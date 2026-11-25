/* ============================================
   PosterBanao - Video Invite Export
   Records a short animated invite from the poster canvas
   ============================================ */

const VideoManager = (() => {
  const DEFAULT_DURATION_MS = 6000;
  const FPS = 30;

  function backendBaseUrl() {
    const configured = window.PosterBanaoConfig?.renderApiBaseUrl ||
      localStorage.getItem('posterbanao_render_api') ||
      '';
    return configured.toString().trim().replace(/\/+$/, '');
  }

  function backendToken() {
    return window.PosterBanaoConfig?.renderApiToken ||
      localStorage.getItem('posterbanao_render_token') ||
      '';
  }

  function isSupported() {
    const canvas = document.createElement('canvas');
    return Boolean(
      backendBaseUrl() ||
      (
        window.MediaRecorder &&
        canvas.captureStream &&
        MediaRecorder.isTypeSupported
      )
    );
  }

  function isAnimatedImageSupported() {
    try {
      const canvas = document.createElement('canvas');
      return Boolean(canvas.getContext('2d') && window.CanvasEngine?.drawAnimatedFrame);
    } catch {
      return false;
    }
  }

  function preferredMimeType() {
    const options = [
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8',
      'video/webm'
    ];
    return options.find(type => MediaRecorder.isTypeSupported(type)) || '';
  }

  const safeFilePart = PBUtils.safeFilePart;
  const clampNumber = PBUtils.clampNumber;

  function writeAscii(bytes, value) {
    for (let i = 0; i < value.length; i += 1) {
      bytes.push(value.charCodeAt(i) & 0xff);
    }
  }

  function writeShort(bytes, value) {
    bytes.push(value & 0xff, (value >> 8) & 0xff);
  }

  function buildGifPalette() {
    const palette = [];
    for (let r = 0; r < 6; r += 1) {
      for (let g = 0; g < 6; g += 1) {
        for (let b = 0; b < 6; b += 1) {
          palette.push(r * 51, g * 51, b * 51);
        }
      }
    }

    while (palette.length < 256 * 3) {
      palette.push(0, 0, 0);
    }

    return palette;
  }

  const GIF_PALETTE = buildGifPalette();

  function quantizeToGifPalette(rgba) {
    const pixels = new Uint8Array(rgba.length / 4);
    for (let i = 0, p = 0; i < rgba.length; i += 4, p += 1) {
      const r = clampNumber(Math.round(rgba[i] / 51), 0, 5);
      const g = clampNumber(Math.round(rgba[i + 1] / 51), 0, 5);
      const b = clampNumber(Math.round(rgba[i + 2] / 51), 0, 5);
      pixels[p] = r * 36 + g * 6 + b;
    }
    return pixels;
  }

  function lzwEncode(indices, minCodeSize = 8) {
    const clearCode = 1 << minCodeSize;
    const endCode = clearCode + 1;
    let nextCode = endCode + 1;
    let codeSize = minCodeSize + 1;
    let bitBuffer = 0;
    let bitCount = 0;
    const output = [];
    const dictionary = new Map();

    function resetDictionary() {
      dictionary.clear();
      for (let i = 0; i < clearCode; i += 1) {
        dictionary.set(String.fromCharCode(i), i);
      }
      nextCode = endCode + 1;
      codeSize = minCodeSize + 1;
    }

    function writeCode(code) {
      bitBuffer |= code << bitCount;
      bitCount += codeSize;
      while (bitCount >= 8) {
        output.push(bitBuffer & 0xff);
        bitBuffer >>= 8;
        bitCount -= 8;
      }
    }

    resetDictionary();
    writeCode(clearCode);

    let phrase = String.fromCharCode(indices[0] || 0);
    for (let i = 1; i < indices.length; i += 1) {
      const char = String.fromCharCode(indices[i]);
      const phrasePlusChar = phrase + char;

      if (dictionary.has(phrasePlusChar)) {
        phrase = phrasePlusChar;
        continue;
      }

      writeCode(dictionary.get(phrase));
      if (nextCode < 4096) {
        dictionary.set(phrasePlusChar, nextCode);
        nextCode += 1;
        if (nextCode === (1 << codeSize) && codeSize < 12) {
          codeSize += 1;
        }
      } else {
        writeCode(clearCode);
        resetDictionary();
      }
      phrase = char;
    }

    writeCode(dictionary.get(phrase));
    writeCode(endCode);
    if (bitCount > 0) output.push(bitBuffer & 0xff);
    return output;
  }

  function writeGifDataBlocks(bytes, data) {
    for (let offset = 0; offset < data.length; offset += 255) {
      const chunk = data.slice(offset, offset + 255);
      bytes.push(chunk.length, ...chunk);
    }
    bytes.push(0);
  }

  function encodeGif(width, height, frames, delayCs) {
    const bytes = [];
    writeAscii(bytes, 'GIF89a');
    writeShort(bytes, width);
    writeShort(bytes, height);
    bytes.push(0xf7, 0, 0);
    bytes.push(...GIF_PALETTE);

    bytes.push(0x21, 0xff, 0x0b);
    writeAscii(bytes, 'NETSCAPE2.0');
    bytes.push(0x03, 0x01);
    writeShort(bytes, 0);
    bytes.push(0);

    for (const frame of frames) {
      bytes.push(0x21, 0xf9, 0x04, 0x00);
      writeShort(bytes, delayCs);
      bytes.push(0, 0);

      bytes.push(0x2c);
      writeShort(bytes, 0);
      writeShort(bytes, 0);
      writeShort(bytes, width);
      writeShort(bytes, height);
      bytes.push(0);
      bytes.push(8);
      writeGifDataBlocks(bytes, lzwEncode(frame, 8));
    }

    bytes.push(0x3b);
    return new Blob([new Uint8Array(bytes)], { type: 'image/gif' });
  }

  function waitForPaint() {
    return new Promise(resolve => requestAnimationFrame(() => resolve()));
  }

  function loadDataUrl(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Video base frame failed to load'));
      image.src = src;
    });
  }

  function animationSettings(template, design) {
    return {
      preset: design?.animation?.preset || template.animationPreset || 'cinematic',
      intensity: Number(design?.animation?.intensity ?? template.animationIntensity ?? 1),
      speed: Number(design?.animation?.speed ?? template.animationSpeed ?? 1)
    };
  }

  function recordCanvas(canvas, drawFrame, durationMs) {
    return new Promise((resolve, reject) => {
      const mimeType = preferredMimeType();
      const stream = canvas.captureStream(FPS);
      const chunks = [];
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      let startedAt = null;
      let frameId = null;

      recorder.ondataavailable = (event) => {
        if (event.data?.size) chunks.push(event.data);
      };

      recorder.onerror = () => {
        cancelAnimationFrame(frameId);
        reject(new Error('Video recorder failed'));
      };

      recorder.onstop = () => {
        cancelAnimationFrame(frameId);
        stream.getTracks().forEach(track => track.stop());
        resolve(new Blob(chunks, { type: mimeType || 'video/webm' }));
      };

      function step(timestamp) {
        if (!startedAt) startedAt = timestamp;
        const elapsed = timestamp - startedAt;
        const progress = Math.min(1, elapsed / durationMs);
        drawFrame(progress);

        if (progress < 1) {
          frameId = requestAnimationFrame(step);
        } else {
          recorder.stop();
        }
      }

      recorder.start(250);
      frameId = requestAnimationFrame(step);
    });
  }

  function filenameFromDisposition(disposition, fallback) {
    const match = (disposition || '').match(/filename="?([^"]+)"?/i);
    return match?.[1] || fallback;
  }

  async function exportViaBackend(templateId, design, options, profile, template) {
    const baseUrl = backendBaseUrl();
    if (!baseUrl) return null;

    const headers = { 'content-type': 'application/json' };
    const token = backendToken();
    if (token) headers.authorization = `Bearer ${token}`;

    const response = await fetch(`${baseUrl}/api/render/video`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        templateId,
        profile,
        design,
        withWatermark: options.withWatermark !== false,
        durationMs: options.durationMs || DEFAULT_DURATION_MS,
        fps: options.fps || FPS,
        filename: `${safeFilePart(template.name)}_${safeFilePart(profile.shopName)}`
      })
    });

    if (!response.ok) {
      let detail = '';
      try {
        const body = await response.json();
        detail = body?.error?.message || '';
      } catch {
        detail = await response.text().catch(() => '');
      }
      throw new Error(detail || `Video render failed with HTTP ${response.status}`);
    }

    const blob = await response.blob();
    const filename = filenameFromDisposition(
      response.headers.get('content-disposition'),
      `${safeFilePart(template.name)}_${safeFilePart(profile.shopName)}.mp4`
    );
    return { blob, filename, source: 'backend' };
  }

  async function exportInBrowser(templateId, design, options, profile, template) {
    const canvas = await CanvasEngine.renderPoster(templateId, profile, {
      withWatermark: options.withWatermark !== false,
      design
    });
    const ctx = canvas.getContext('2d');
    const baseImage = await loadDataUrl(canvas.toDataURL('image/png'));
    const durationMs = options.durationMs || DEFAULT_DURATION_MS;
    const animation = animationSettings(template, design);

    const blob = await recordCanvas(canvas, (progress) => {
      CanvasEngine.drawAnimatedFrame(ctx, baseImage, progress, animation);
    }, durationMs);

    const filename = `${safeFilePart(template.name)}_${safeFilePart(profile.shopName)}.webm`;
    return { blob, filename, source: 'browser' };
  }

  async function exportAnimatedImage(templateId, design, options = {}) {
    const profile = ProfileManager.getProfile();
    const template = TemplateRegistry.getById(templateId);
    if (!profile || !template) throw new Error('Missing animated invite data');

    const sourceCanvas = await CanvasEngine.renderPoster(templateId, profile, {
      withWatermark: options.withWatermark !== false,
      design
    });
    const baseImage = await loadDataUrl(sourceCanvas.toDataURL('image/png'));
    const size = Math.round(clampNumber(options.size || 540, 240, 720));
    const frameCount = Math.round(clampNumber(options.frames || 16, 6, 28));
    const durationMs = options.durationMs || 2600;
    const delayCs = Math.max(2, Math.round(durationMs / frameCount / 10));
    const animation = animationSettings(template, design);
    const frameCanvas = document.createElement('canvas');
    const frameCtx = frameCanvas.getContext('2d', { willReadFrequently: true });
    const frames = [];

    if (!frameCtx) throw new Error('Animated image canvas is unavailable');

    frameCanvas.width = size;
    frameCanvas.height = size;

    for (let i = 0; i < frameCount; i += 1) {
      CanvasEngine.drawAnimatedFrame(frameCtx, baseImage, i / frameCount, animation);
      frames.push(quantizeToGifPalette(frameCtx.getImageData(0, 0, size, size).data));
      await waitForPaint();
    }

    const blob = encodeGif(size, size, frames, delayCs);
    const filename = `${safeFilePart(template.name)}_${safeFilePart(profile.shopName)}.gif`;
    return { blob, filename, source: 'browser-gif' };
  }

  async function exportInvite(templateId, design, options = {}) {
    const profile = ProfileManager.getProfile();
    const template = TemplateRegistry.getById(templateId);
    if (!profile || !template) throw new Error('Missing video invite data');

    try {
      const backendResult = await exportViaBackend(templateId, design, options, profile, template);
      if (backendResult) return backendResult;
    } catch (e) {
      console.warn('Backend video render failed; falling back to browser recorder:', e);
      if (!window.MediaRecorder) throw e;
    }

    return exportInBrowser(templateId, design, options, profile, template);
  }

  async function shareOrDownload(blob, shareData) {
    const file = new File([blob], shareData.filename, { type: blob.type || 'video/webm' });

    if (window.NativeBridge?.isAvailable?.() && window.NativeBridge?.shareBlob) {
      return NativeBridge.shareBlob(blob, shareData.filename, {
        title: shareData.title,
        text: shareData.text,
        dialogTitle: shareData.dialogTitle || 'Share invite'
      });
    }

    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        title: shareData.title,
        text: shareData.text,
        files: [file]
      });
      return true;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = shareData.filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    return false;
  }

  return {
    isSupported,
    isAnimatedImageSupported,
    exportInvite,
    exportAnimatedImage,
    shareOrDownload
  };
})();

window.VideoManager = VideoManager;
