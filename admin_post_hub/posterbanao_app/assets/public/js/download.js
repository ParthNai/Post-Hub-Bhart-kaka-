/* ============================================
   PosterBanao - Download & Share Manager
   Handles poster export, WhatsApp sharing and batch ZIP downloads
   ============================================ */

const DownloadManager = (() => {
  let activeDesign = null;
  let crcTable = null;

  const FORMAT_META = {
    png: { mime: 'image/png', extension: 'png', label: 'PNG' },
    jpeg: { mime: 'image/jpeg', extension: 'jpg', label: 'JPEG' },
    webp: { mime: 'image/webp', extension: 'webp', label: 'WebP' }
  };

  const SIZE_PRESETS = {
    original: { label: 'Original HD' },
    whatsapp: { label: 'WhatsApp optimized' },
    instagram: { label: 'Instagram ready' }
  };

  function setActiveDesign(design) {
    activeDesign = design ? CanvasEngine.cloneDesign(design) : null;
  }

  function isUnlocked() {
    return true;
  }

  function markUnlocked() {
    return true;
  }

  function clamp(value, min, max, fallback) {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    return Math.max(min, Math.min(max, number));
  }

  function normalizeExportOptions(options = {}) {
    const format = FORMAT_META[options.format] ? options.format : 'png';
    const sizePreset = SIZE_PRESETS[options.sizePreset] ? options.sizePreset : 'original';
    return {
      format,
      sizePreset,
      quality: clamp(options.quality, 0.5, 1, 0.92)
    };
  }

  function isDefaultNativeExport(options) {
    const normalized = normalizeExportOptions(options);
    return normalized.format === 'png' &&
      normalized.sizePreset === 'original';
  }

  function safeSlug(value, fallback = 'poster', max = 36) {
    const slug = (value || fallback)
      .toString()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .substring(0, max);
    return slug || fallback;
  }

  function resolveExportDimensions(canvas, sizePreset) {
    const sourceWidth = canvas.width;
    const sourceHeight = canvas.height;

    if (sizePreset === 'whatsapp') {
      const maxSide = 1600;
      const scale = Math.min(1, maxSide / Math.max(sourceWidth, sourceHeight));
      return {
        width: Math.max(1, Math.round(sourceWidth * scale)),
        height: Math.max(1, Math.round(sourceHeight * scale))
      };
    }

    if (sizePreset === 'instagram') {
      if (Math.abs(sourceWidth - sourceHeight) <= 4) {
        return { width: 1080, height: 1080 };
      }

      const width = 1080;
      return {
        width,
        height: Math.max(1, Math.round((sourceHeight / sourceWidth) * width))
      };
    }

    return {
      width: sourceWidth,
      height: sourceHeight
    };
  }

  function toBlob(canvas, mime, quality) {
    return new Promise((resolve) => {
      canvas.toBlob(resolve, mime, quality);
    });
  }

  async function exportCanvasWithOptions(sourceCanvas, options) {
    const normalized = normalizeExportOptions(options);
    let meta = FORMAT_META[normalized.format];
    const dimensions = resolveExportDimensions(sourceCanvas, normalized.sizePreset);
    const needsOutputCanvas =
      dimensions.width !== sourceCanvas.width ||
      dimensions.height !== sourceCanvas.height ||
      normalized.format === 'jpeg';

    let outputCanvas = sourceCanvas;
    if (needsOutputCanvas) {
      outputCanvas = document.createElement('canvas');
      outputCanvas.width = dimensions.width;
      outputCanvas.height = dimensions.height;
      const ctx = outputCanvas.getContext('2d');

      if (normalized.format === 'jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, dimensions.width, dimensions.height);
      }

      ctx.drawImage(sourceCanvas, 0, 0, dimensions.width, dimensions.height);
    }

    let blob = await toBlob(outputCanvas, meta.mime, normalized.quality);
    let actualFormat = normalized.format;

    if (!blob && normalized.format === 'webp') {
      actualFormat = 'png';
      meta = FORMAT_META.png;
      blob = await toBlob(outputCanvas, meta.mime, normalized.quality);
    }

    if (!blob) throw new Error('Failed to export poster');

    return {
      blob,
      format: actualFormat,
      mime: meta.mime,
      extension: meta.extension,
      width: dimensions.width,
      height: dimensions.height
    };
  }

  async function renderDesignToBlob(templateId, profile, design, withWatermark, options) {
    const canvas = await CanvasEngine.renderPoster(templateId, profile, {
      withWatermark: Boolean(withWatermark),
      design
    });
    return exportCanvasWithOptions(canvas, options);
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  async function saveOrDownloadBlob(blob, filename) {
    if (window.NativeBridge?.isAvailable?.() && window.NativeBridge?.saveBlob) {
      return NativeBridge.saveBlob(blob, filename);
    }

    downloadBlob(blob, filename);
    return true;
  }

  function posterFilename(templateId, shopName, extension) {
    const template = TemplateRegistry.getById(templateId);
    const safeName = safeSlug(shopName, 'poster', 24);
    const templateName = safeSlug(template?.name, 'poster', 34);
    return `${templateName}_${safeName}.${extension}`;
  }

  function batchFilename(record, index, extension) {
    const template = TemplateRegistry.getById(record.templateId || record.design?.templateId);
    const title = safeSlug(record.title || template?.name, `design_${index + 1}`, 38);
    return `${String(index + 1).padStart(2, '0')}_${title}.${extension}`;
  }

  /**
   * Download the poster using the selected export options.
   * @param {string} templateId - For rendering and filename.
   * @param {string} shopName - For filename.
   * @param {boolean} withWatermark - Kept for old callers; defaults to HD/no watermark.
   * @param {Object} options - { format, quality, sizePreset }
   */
  async function downloadPoster(templateId, shopName, withWatermark = false, options = {}) {
    const profile = ProfileManager.getProfile();
    if (!profile) return false;

    try {
      if (window.NativeBridge?.isAvailable?.() && isDefaultNativeExport(options)) {
        return NativeBridge.downloadPoster(templateId, shopName, Boolean(withWatermark), activeDesign);
      }

      const result = await renderDesignToBlob(
        templateId,
        profile,
        activeDesign,
        withWatermark,
        normalizeExportOptions(options)
      );

      return saveOrDownloadBlob(result.blob, posterFilename(templateId, shopName, result.extension));
    } catch (e) {
      console.error('Download failed:', e);
      return false;
    }
  }

  async function shareToWhatsApp(templateId, options = {}) {
    const profile = ProfileManager.getProfile();
    if (!profile) return false;

    const template = TemplateRegistry.getById(templateId);
    const displayName = ProfileManager.getDisplayName(profile) || profile.shopName || 'PosterBanao';
    const exportOptions = normalizeExportOptions(
      Object.keys(options || {}).length ? options : { format: 'png', sizePreset: 'whatsapp' }
    );

    try {
      if (window.NativeBridge?.isAvailable?.() && isDefaultNativeExport(exportOptions)) {
        return NativeBridge.sharePoster(templateId, activeDesign);
      }

      const result = await renderDesignToBlob(templateId, profile, activeDesign, false, exportOptions);
      const filename = `${safeSlug(template?.name, 'poster')}.${result.extension}`;
      const shareData = {
        title: `${template?.name || 'Poster'} - ${displayName}`,
        text: `Greetings from ${displayName}`
      };

      if (window.NativeBridge?.isAvailable?.() && window.NativeBridge?.shareBlob) {
        try {
          const shared = await NativeBridge.shareBlob(result.blob, filename, {
            ...shareData,
            dialogTitle: 'Share poster'
          });
          if (shared) return true;
        } catch (nativeError) {
          console.warn('Native share failed:', nativeError);
        }
      }

      if (navigator.share && navigator.canShare) {
        const file = new File([result.blob], filename, {
          type: result.mime
        });
        const browserShareData = {
          ...shareData,
          files: [file]
        };

        if (navigator.canShare(browserShareData)) {
          await navigator.share(browserShareData);
          return true;
        }
      }

      await saveOrDownloadBlob(result.blob, posterFilename(templateId, displayName, result.extension));
      openWhatsAppText(profile, displayName);
      return true;
    } catch (e) {
      console.error('Share failed:', e);
      openWhatsAppText(profile, displayName);
      return false;
    }
  }

  function openWhatsAppText(profile, displayName) {
    const lines = [`Greetings from ${displayName}`];
    if (profile.phone) lines.push(`Phone: ${profile.phone}`);
    const text = encodeURIComponent(lines.join('\n'));
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
  }

  function makeCrcTable() {
    const table = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let j = 0; j < 8; j++) {
        c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
      }
      table[i] = c >>> 0;
    }
    return table;
  }

  function crc32(data) {
    if (!crcTable) crcTable = makeCrcTable();
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < data.length; i++) {
      crc = crcTable[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8);
    }
    return (crc ^ 0xFFFFFFFF) >>> 0;
  }

  function zipDateTime(date = new Date()) {
    const year = Math.max(1980, date.getFullYear());
    const dosTime = (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
    const dosDate = ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
    return { dosTime, dosDate };
  }

  function writeLocalHeader(nameBytes, data, crc, timeParts) {
    const header = new Uint8Array(30 + nameBytes.length);
    const view = new DataView(header.buffer);
    view.setUint32(0, 0x04034b50, true);
    view.setUint16(4, 20, true);
    view.setUint16(6, 0, true);
    view.setUint16(8, 0, true);
    view.setUint16(10, timeParts.dosTime, true);
    view.setUint16(12, timeParts.dosDate, true);
    view.setUint32(14, crc, true);
    view.setUint32(18, data.length, true);
    view.setUint32(22, data.length, true);
    view.setUint16(26, nameBytes.length, true);
    view.setUint16(28, 0, true);
    header.set(nameBytes, 30);
    return header;
  }

  function writeCentralDirectory(entry, timeParts) {
    const header = new Uint8Array(46 + entry.nameBytes.length);
    const view = new DataView(header.buffer);
    view.setUint32(0, 0x02014b50, true);
    view.setUint16(4, 20, true);
    view.setUint16(6, 20, true);
    view.setUint16(8, 0, true);
    view.setUint16(10, 0, true);
    view.setUint16(12, timeParts.dosTime, true);
    view.setUint16(14, timeParts.dosDate, true);
    view.setUint32(16, entry.crc, true);
    view.setUint32(20, entry.data.length, true);
    view.setUint32(24, entry.data.length, true);
    view.setUint16(28, entry.nameBytes.length, true);
    view.setUint16(30, 0, true);
    view.setUint16(32, 0, true);
    view.setUint16(34, 0, true);
    view.setUint16(36, 0, true);
    view.setUint32(38, 0, true);
    view.setUint32(42, entry.offset, true);
    header.set(entry.nameBytes, 46);
    return header;
  }

  async function createZipBlob(files) {
    const encoder = new TextEncoder();
    const parts = [];
    const entries = [];
    const timeParts = zipDateTime();
    let offset = 0;

    for (const file of files) {
      const nameBytes = encoder.encode(file.name.replace(/[\\/:*?"<>|]+/g, '_'));
      const data = new Uint8Array(await file.blob.arrayBuffer());
      const crc = crc32(data);
      const localHeader = writeLocalHeader(nameBytes, data, crc, timeParts);
      parts.push(localHeader, data);
      entries.push({ nameBytes, data, crc, offset });
      offset += localHeader.length + data.length;
    }

    const centralStart = offset;
    const centralParts = entries.map(entry => writeCentralDirectory(entry, timeParts));
    const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
    parts.push(...centralParts);

    const eocd = new Uint8Array(22);
    const view = new DataView(eocd.buffer);
    view.setUint32(0, 0x06054b50, true);
    view.setUint16(4, 0, true);
    view.setUint16(6, 0, true);
    view.setUint16(8, entries.length, true);
    view.setUint16(10, entries.length, true);
    view.setUint32(12, centralSize, true);
    view.setUint32(16, centralStart, true);
    view.setUint16(20, 0, true);
    parts.push(eocd);

    return new Blob(parts, { type: 'application/zip' });
  }

  async function downloadSavedDesignsBatch(records = [], options = {}, callbacks = {}) {
    const profile = ProfileManager.getProfile();
    if (!profile) return { success: false, reason: 'profile' };
    if (!Array.isArray(records) || !records.length) return { success: false, reason: 'empty' };

    const normalizedOptions = normalizeExportOptions(options);
    const files = [];
    const usedNames = new Map();

    try {
      for (let index = 0; index < records.length; index++) {
        const record = records[index];
        const templateId = record.templateId || record.design?.templateId;
        if (!templateId || !record.design) continue;

        const title = record.title || TemplateRegistry.getById(templateId)?.name || `Design ${index + 1}`;
        callbacks.onProgress?.({ index: index + 1, total: records.length, title });

        const result = await renderDesignToBlob(
          templateId,
          profile,
          CanvasEngine.cloneDesign(record.design),
          false,
          normalizedOptions
        );
        const baseName = batchFilename(record, index, result.extension);
        const count = usedNames.get(baseName) || 0;
        usedNames.set(baseName, count + 1);
        const name = count
          ? baseName.replace(new RegExp(`\\.${result.extension}$`), `_${count + 1}.${result.extension}`)
          : baseName;
        files.push({ name, blob: result.blob });
      }

      if (!files.length) return { success: false, reason: 'empty' };

      const zip = await createZipBlob(files);
      const date = new Date().toISOString().slice(0, 10);
      const saved = await saveOrDownloadBlob(zip, `PosterBanao_saved_designs_${date}.zip`);
      if (!saved) return { success: false, reason: 'native' };
      return { success: true, count: files.length };
    } catch (e) {
      console.error('Batch export failed:', e);
      return { success: false, reason: 'error' };
    }
  }

  function describeExportOptions(options = {}) {
    const normalized = normalizeExportOptions(options);
    const meta = FORMAT_META[normalized.format];
    const size = SIZE_PRESETS[normalized.sizePreset];
    const quality = normalized.format === 'png' ? '' : ` / ${Math.round(normalized.quality * 100)}%`;
    return `${meta.label} / ${size.label}${quality}`;
  }

  function showConfetti() {
    const colors = ['#FF6B2C', '#E91E8C', '#FFB800', '#00BFA6', '#7C3AED', '#3B82F6'];
    const container = document.body;

    for (let i = 0; i < 40; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + '%';
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = Math.random() * 0.5 + 's';
      piece.style.animationDuration = (Math.random() * 1.5 + 1.5) + 's';
      piece.style.width = (Math.random() * 8 + 4) + 'px';
      piece.style.height = (Math.random() * 8 + 4) + 'px';
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      container.appendChild(piece);
      setTimeout(() => piece.remove(), 3000);
    }
  }

  return {
    isUnlocked,
    markUnlocked,
    setActiveDesign,
    downloadPoster,
    shareToWhatsApp,
    downloadSavedDesignsBatch,
    normalizeExportOptions,
    describeExportOptions,
    showConfetti
  };
})();
