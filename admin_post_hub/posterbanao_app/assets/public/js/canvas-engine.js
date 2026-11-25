/* ============================================
   PosterBanao — Canvas Rendering Engine
   Renders posters with business info overlay
   ============================================ */

const CanvasEngine = (() => {
  let CANVAS_SIZE = 1080;
  let CANVAS_WIDTH = 1080;
  let CANVAS_HEIGHT = 1080;
  let currentCanvas = null;
  let currentCtx = null;
  const stickerImageCache = new Map();

  const ASPECT_PRESETS = {
    '1:1': { width: 1080, height: 1080, label: 'Square' },
    '9:16': { width: 1080, height: 1920, label: 'Story' },
    '16:9': { width: 1920, height: 1080, label: 'Landscape' },
    a4: { width: 1240, height: 1754, label: 'A4 Portrait' }
  };

  /**
   * Initialize or get the canvas
   */
  function getCanvas() {
    if (!currentCanvas) {
      currentCanvas = document.getElementById('posterCanvas');
      currentCtx = currentCanvas.getContext('2d');
    }
    refreshCanvasMetrics();
    return { canvas: currentCanvas, ctx: currentCtx };
  }

  function refreshCanvasMetrics() {
    if (currentCanvas) {
      CANVAS_WIDTH = currentCanvas.width;
      CANVAS_HEIGHT = currentCanvas.height;
      CANVAS_SIZE = Math.min(CANVAS_WIDTH, CANVAS_HEIGHT);
    }
  }

  function getCanvasDimensionsForAspect(aspectRatio = '1:1') {
    return ASPECT_PRESETS[aspectRatio] || ASPECT_PRESETS['1:1'];
  }

  function setCanvasSizeForAspect(aspectRatio = '1:1') {
    const { canvas } = getCanvas();
    const dimensions = getCanvasDimensionsForAspect(aspectRatio);
    if (!canvas) return dimensions;

    if (canvas.width !== dimensions.width || canvas.height !== dimensions.height) {
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
      currentCtx = canvas.getContext('2d');
    }

    refreshCanvasMetrics();
    return dimensions;
  }

  function layerPixelWidth(layer, fallback = 0.12) {
    const value = clamp(layer?.width ?? fallback, 0, 1);
    return layer?.type === 'shape' || layer?.scaleWithCanvas
      ? CANVAS_WIDTH * value
      : CANVAS_SIZE * value;
  }

  function layerPixelHeight(layer, fallback = 0.12) {
    const value = clamp(layer?.height ?? layer?.width ?? fallback, 0, 1);
    return layer?.type === 'shape' || layer?.scaleWithCanvas
      ? CANVAS_HEIGHT * value
      : CANVAS_SIZE * value;
  }

  /**
   * Load an image from a URL
   * @param {string} src - Image source URL
   * @returns {Promise<HTMLImageElement>}
   */
  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  }

  function svgToDataUrl(svg) {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  async function loadStickerImage(layer) {
    if (!layer?.svg) return null;
    const key = layer.svg;
    if (!stickerImageCache.has(key)) {
      stickerImageCache.set(key, loadImage(svgToDataUrl(layer.svg)));
    }
    return stickerImageCache.get(key);
  }

  /**
   * Generate a canvas-based template background (for templates without images)
   * @param {CanvasRenderingContext2D} ctx
   * @param {Object} config - canvasGen config from template
   */
  function generateCanvasBackground(ctx, config) {
    const w = CANVAS_WIDTH;
    const h = CANVAS_HEIGHT;

    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, w, h);
    const colors = config.gradient || ['#FF6B2C', '#E91E8C'];
    colors.forEach((color, i) => {
      gradient.addColorStop(i / (colors.length - 1), color);
    });
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    // Draw decorative circles/bokeh
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h * 0.75;
      const r = Math.random() * 40 + 10;
      const alpha = Math.random() * 0.15 + 0.03;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();
    }

    // Draw larger decorative glow spots
    for (let i = 0; i < 8; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h * 0.65;
      const r = Math.random() * 80 + 40;
      const grd = ctx.createRadialGradient(x, y, 0, x, y, r);
      grd.addColorStop(0, 'rgba(255, 215, 0, 0.12)');
      grd.addColorStop(1, 'rgba(255, 215, 0, 0)');
      ctx.fillStyle = grd;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    }

    // Draw sparkle dots
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h * 0.7;
      const r = Math.random() * 3 + 1;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.3})`;
      ctx.fill();
    }

    // Draw decorative border pattern
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.15)';
    ctx.lineWidth = 3;
    const borderPad = 40;
    const cornerR = 20;
    drawRoundedRect(ctx, borderPad, borderPad, w - borderPad * 2, h * 0.72, cornerR);
    ctx.stroke();

    // Draw inner decorative border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    drawRoundedRect(ctx, borderPad + 10, borderPad + 10, w - (borderPad + 10) * 2, h * 0.72 - 20, cornerR - 5);
    ctx.stroke();

    drawTemplateMotif(ctx, config);

    // Draw main festival text
    if (config.text) {
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Text shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetY = 4;

      // Main text
      ctx.font = `bold 72px "Outfit", "Arial", sans-serif`;
      ctx.fillStyle = config.textColor || '#FFFFFF';
      ctx.fillText(config.text, w / 2, h * 0.35);

      // Subtext
      if (config.subtext) {
        ctx.font = `500 32px "Poppins", "Arial", sans-serif`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.fillText(config.subtext, w / 2, h * 0.45);
      }

      ctx.restore();
    }

    // Draw decorative emoji elements
    if (config.decorEmojis && config.decorEmojis.length > 0) {
      ctx.save();
      ctx.font = '60px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const emojiPositions = [
        { x: w * 0.15, y: h * 0.18 },
        { x: w * 0.85, y: h * 0.15 },
        { x: w * 0.12, y: h * 0.58 },
        { x: w * 0.88, y: h * 0.55 }
      ];

      config.decorEmojis.forEach((emoji, i) => {
        if (i < emojiPositions.length) {
          ctx.font = `${50 + Math.random() * 20}px serif`;
          ctx.fillText(emoji, emojiPositions[i].x, emojiPositions[i].y);
        }
      });

      ctx.restore();
    }

    // Draw ornamental divider line below text
    ctx.beginPath();
    ctx.moveTo(w * 0.3, h * 0.55);
    ctx.lineTo(w * 0.7, h * 0.55);
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Small diamond in center of divider
    ctx.beginPath();
    const cx = w / 2, cy = h * 0.55;
    ctx.moveTo(cx, cy - 6);
    ctx.lineTo(cx + 6, cy);
    ctx.lineTo(cx, cy + 6);
    ctx.lineTo(cx - 6, cy);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 215, 0, 0.6)';
    ctx.fill();
  }

  /**
   * Helper: Draw a rounded rectangle path
   */
  function drawRoundedRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function colorWithAlpha(color, alpha) {
    if (!color) return `rgba(255,255,255,${alpha})`;
    if (color.startsWith('#')) {
      const hex = color.replace('#', '');
      const value = hex.length === 3
        ? hex.split('').map(part => part + part).join('')
        : hex.substring(0, 6);
      const int = parseInt(value, 16);
      if (Number.isFinite(int)) {
        const r = (int >> 16) & 255;
        const g = (int >> 8) & 255;
        const b = int & 255;
        return `rgba(${r},${g},${b},${alpha})`;
      }
    }
    if (/^rgba\(/i.test(color)) return color.replace(/,\s*[\d.]+\)$/i, `, ${alpha})`);
    if (/^rgb\(/i.test(color)) return color.replace(/^rgb\((.+)\)$/i, `rgba($1, ${alpha})`);
    return color;
  }

  function drawPetalRing(ctx, cx, cy, radius, petalW, petalH, color, count = 12, rotation = 0) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    for (let i = 0; i < count; i++) {
      ctx.save();
      ctx.rotate((Math.PI * 2 * i) / count);
      ctx.beginPath();
      ctx.ellipse(0, -radius, petalW, petalH, 0, 0, Math.PI * 2);
      ctx.fillStyle = colorWithAlpha(color, 0.22);
      ctx.fill();
      ctx.strokeStyle = colorWithAlpha('#FFFFFF', 0.18);
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
  }

  function drawDiya(ctx, x, y, scale, color) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.beginPath();
    ctx.ellipse(0, 16, 36, 13, 0, 0, Math.PI * 2);
    ctx.fillStyle = colorWithAlpha(color, 0.38);
    ctx.fill();
    ctx.strokeStyle = colorWithAlpha('#FFFFFF', 0.16);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -32);
    ctx.bezierCurveTo(22, -5, 8, 18, 0, 24);
    ctx.bezierCurveTo(-10, 12, -18, -9, 0, -32);
    ctx.fillStyle = 'rgba(255, 244, 170, 0.48)';
    ctx.fill();
    ctx.restore();
  }

  function drawTemplateMotif(ctx, config = {}) {
    const motif = config.motif;
    if (!motif) return;

    const w = CANVAS_WIDTH;
    const h = CANVAS_HEIGHT;
    const accent = config.accentColor || '#FFD166';
    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    if (motif === 'lights') {
      for (let i = 0; i < 5; i++) {
        drawDiya(ctx, w * (0.16 + i * 0.17), h * 0.64, 0.95, accent);
      }
      ctx.strokeStyle = colorWithAlpha(accent, 0.16);
      ctx.lineWidth = 4;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(w * (0.1 + i * 0.23), h * 0.12);
        ctx.quadraticCurveTo(w * (0.2 + i * 0.23), h * 0.18, w * (0.3 + i * 0.23), h * 0.12);
        ctx.stroke();
      }
    }

    if (motif === 'rangoli') {
      drawPetalRing(ctx, w * 0.5, h * 0.58, 92, 22, 48, accent, 14, Math.PI / 14);
      drawPetalRing(ctx, w * 0.5, h * 0.58, 48, 14, 30, '#FFFFFF', 10, 0);
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.58, 18, 0, Math.PI * 2);
      ctx.fillStyle = colorWithAlpha(accent, 0.36);
      ctx.fill();
    }

    if (motif === 'moon') {
      ctx.beginPath();
      ctx.arc(w * 0.74, h * 0.2, 76, 0, Math.PI * 2);
      ctx.fillStyle = colorWithAlpha('#FFFFFF', 0.24);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(w * 0.78, h * 0.18, 76, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
      ctx.fill();
      for (let i = 0; i < 12; i++) {
        ctx.beginPath();
        ctx.arc(w * (0.16 + (i % 6) * 0.11), h * (0.16 + Math.floor(i / 6) * 0.12), 3 + (i % 3), 0, Math.PI * 2);
        ctx.fillStyle = colorWithAlpha('#FFFFFF', 0.24);
        ctx.fill();
      }
    }

    if (motif === 'colors') {
      const palette = ['#FDE047', '#22C55E', '#E11D48', '#38BDF8', '#A855F7'];
      for (let i = 0; i < 18; i++) {
        ctx.beginPath();
        ctx.arc(w * ((i * 37) % 100) / 100, h * (0.16 + ((i * 19) % 46) / 100), 22 + (i % 5) * 10, 0, Math.PI * 2);
        ctx.fillStyle = colorWithAlpha(palette[i % palette.length], 0.16);
        ctx.fill();
      }
    }

    if (motif === 'mandap') {
      ctx.fillStyle = colorWithAlpha(accent, 0.18);
      ctx.beginPath();
      ctx.moveTo(w * 0.18, h * 0.18);
      ctx.lineTo(w * 0.82, h * 0.18);
      ctx.lineTo(w * 0.72, h * 0.28);
      ctx.lineTo(w * 0.28, h * 0.28);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = colorWithAlpha('#FFFFFF', 0.11);
      [0.25, 0.75].forEach((x) => {
        drawRoundedRect(ctx, w * x - 13, h * 0.24, 26, h * 0.34, 13);
        ctx.fill();
      });
      ctx.strokeStyle = colorWithAlpha(accent, 0.2);
      ctx.lineWidth = 4;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(w * (0.28 + i * 0.11), h * 0.28);
        ctx.lineTo(w * (0.28 + i * 0.11), h * 0.42);
        ctx.stroke();
      }
    }

    if (motif === 'garba') {
      drawPetalRing(ctx, w * 0.5, h * 0.56, 104, 16, 42, accent, 18, 0);
      ctx.strokeStyle = colorWithAlpha('#FFFFFF', 0.22);
      ctx.lineWidth = 7;
      for (let i = 0; i < 10; i++) {
        const x = w * (0.17 + i * 0.075);
        ctx.beginPath();
        ctx.moveTo(x - 22, h * 0.22);
        ctx.lineTo(x + 22, h * 0.30);
        ctx.stroke();
      }
    }

    if (motif === 'rakhi') {
      ctx.strokeStyle = colorWithAlpha(accent, 0.24);
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(w * 0.12, h * 0.54);
      ctx.bezierCurveTo(w * 0.32, h * 0.44, w * 0.68, h * 0.64, w * 0.88, h * 0.52);
      ctx.stroke();
      drawPetalRing(ctx, w * 0.5, h * 0.54, 54, 12, 28, accent, 12, 0);
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.54, 22, 0, Math.PI * 2);
      ctx.fillStyle = colorWithAlpha('#FFFFFF', 0.22);
      ctx.fill();
    }

    if (motif === 'ganesh') {
      ctx.strokeStyle = colorWithAlpha(accent, 0.24);
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.42, 110, Math.PI * 1.08, Math.PI * 1.92);
      ctx.stroke();
      drawPetalRing(ctx, w * 0.5, h * 0.55, 80, 18, 38, accent, 10, Math.PI / 10);
      ctx.fillStyle = colorWithAlpha(accent, 0.18);
      ctx.fillRect(w * 0.32, h * 0.64, w * 0.36, 8);
    }

    if (motif === 'durga') {
      ctx.strokeStyle = colorWithAlpha(accent, 0.24);
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(w * 0.5, h * 0.18);
      ctx.lineTo(w * 0.5, h * 0.48);
      ctx.moveTo(w * 0.43, h * 0.25);
      ctx.quadraticCurveTo(w * 0.5, h * 0.14, w * 0.57, h * 0.25);
      ctx.moveTo(w * 0.43, h * 0.25);
      ctx.lineTo(w * 0.36, h * 0.2);
      ctx.moveTo(w * 0.57, h * 0.25);
      ctx.lineTo(w * 0.64, h * 0.2);
      ctx.stroke();
      drawPetalRing(ctx, w * 0.5, h * 0.58, 84, 16, 36, accent, 12, 0);
    }

    if (motif === 'harvest') {
      ctx.beginPath();
      ctx.arc(w * 0.78, h * 0.2, 74, 0, Math.PI * 2);
      ctx.fillStyle = colorWithAlpha(accent, 0.22);
      ctx.fill();
      ctx.strokeStyle = colorWithAlpha('#FFFFFF', 0.14);
      ctx.lineWidth = 5;
      for (let i = 0; i < 7; i++) {
        ctx.beginPath();
        ctx.moveTo(w * 0.08, h * (0.58 + i * 0.035));
        ctx.quadraticCurveTo(w * 0.44, h * (0.52 + i * 0.025), w * 0.92, h * (0.58 + i * 0.035));
        ctx.stroke();
      }
    }

    if (motif === 'stage' || motif === 'product') {
      const left = ctx.createLinearGradient(w * 0.12, 0, w * 0.5, h * 0.72);
      left.addColorStop(0, colorWithAlpha('#FFFFFF', 0.18));
      left.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = left;
      ctx.beginPath();
      ctx.moveTo(w * 0.14, h * 0.08);
      ctx.lineTo(w * 0.42, h * 0.72);
      ctx.lineTo(w * 0.18, h * 0.72);
      ctx.closePath();
      ctx.fill();

      const right = ctx.createLinearGradient(w * 0.88, 0, w * 0.5, h * 0.72);
      right.addColorStop(0, colorWithAlpha(accent, 0.18));
      right.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = right;
      ctx.beginPath();
      ctx.moveTo(w * 0.86, h * 0.08);
      ctx.lineTo(w * 0.58, h * 0.72);
      ctx.lineTo(w * 0.82, h * 0.72);
      ctx.closePath();
      ctx.fill();

      if (motif === 'product') {
        ctx.fillStyle = colorWithAlpha(accent, 0.18);
        ctx.beginPath();
        ctx.ellipse(w * 0.5, h * 0.64, w * 0.24, h * 0.045, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  function setRgbaAlpha(color, alpha) {
    if (!color) return color;
    return color.replace(/rgba\((.+),\s*[\d.]+\)$/i, `rgba($1, ${alpha})`);
  }

  function clamp(value, min, max) {
    const number = Number(value);
    if (!Number.isFinite(number)) return min;
    return Math.max(min, Math.min(max, number));
  }

  function cloneDesign(design) {
    return JSON.parse(JSON.stringify(design));
  }

  function normalizeTemplateLayer(layer) {
    const next = cloneDesign(layer);
    if (next.type === 'image') {
      next.mask = next.mask || next.shape || 'rounded';
      next.shape = next.shape || next.mask;
      next.fit = next.fit || 'cover';
      next.cropX = next.cropX ?? next.crop?.x ?? 0.5;
      next.cropY = next.cropY ?? next.crop?.y ?? 0.5;
      next.cropZoom = next.cropZoom ?? next.crop?.zoom ?? 1;
      next.padding = next.padding ?? 0;
      next.placeholderLabel = next.placeholderLabel || next.label || 'Photo';
    }
    if (next.type === 'text') {
      next.text = next.text ?? '';
    }
    if (next.type === 'sticker') {
      next.stickerKind = next.stickerKind || (next.glyph ? 'emoji' : 'svg');
      next.width = next.width ?? 0.2;
      next.height = next.height ?? next.width;
      next.opacity = next.opacity ?? 1;
    }
    return next;
  }

  function defaultAnimationForTemplate(template) {
    if (!template?.isVideoInvite) return null;
    return {
      preset: template.animationPreset || 'cinematic',
      intensity: template.animationIntensity ?? 1,
      speed: template.animationSpeed ?? 1
    };
  }

  function profileBrandDefaults(profile = {}) {
    const source = profile.brandDefaults || {};
    const show = source.show || {};
    const presetIds = ['bottom_bar', 'top_bar', 'left_stack', 'right_stack', 'corner_logo', 'clean'];
    const logoShapes = ['circle', 'rounded', 'rect'];
    const textColor = /^#[0-9a-f]{6}$/i.test(source.textColor || '') ? source.textColor : '#FFFFFF';

    return {
      show: {
        logo: typeof show.logo === 'boolean' ? show.logo : true,
        business_name: typeof show.business_name === 'boolean' ? show.business_name : true,
        phone: typeof show.phone === 'boolean' ? show.phone : true,
        tagline: typeof show.tagline === 'boolean' ? show.tagline : true,
        address: typeof show.address === 'boolean' ? show.address : true
      },
      presetId: presetIds.includes(source.presetId) ? source.presetId : 'bottom_bar',
      textColor,
      logoShape: logoShapes.includes(source.logoShape) ? source.logoShape : 'circle'
    };
  }

  function createDefaultDesign(templateId, profile = {}, options = {}) {
    const template = TemplateRegistry.getById(templateId);
    if (!template) throw new Error('Template not found');

    const config = template.overlayConfig || {};
    const aspectRatio = ASPECT_PRESETS[options.aspectRatio] ? options.aspectRatio : '1:1';
    const brandDefaults = profileBrandDefaults(profile);
    const brandShow = {
      logo: Boolean(brandDefaults.show.logo),
      business_name: Boolean(brandDefaults.show.business_name),
      phone: Boolean(brandDefaults.show.phone && profile.phone),
      tagline: Boolean(brandDefaults.show.tagline && profile.tagline),
      address: Boolean(brandDefaults.show.address && profile.address)
    };
    const design = {
      id: `design_${Date.now()}`,
      templateId,
      title: template.name,
      aspectRatio,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      animation: defaultAnimationForTemplate(template),
      brand: {
        presetId: brandDefaults.presetId,
        show: brandShow
      },
      layers: [
        {
          id: 'business_banner',
          label: 'Footer Banner',
          type: 'shape',
          shape: 'rect',
          x: 0,
          y: config.bannerY ?? 0.78,
          width: 1,
          height: config.bannerHeight ?? 0.22,
          color: config.bannerColor || 'rgba(0,0,0,0.86)',
          editable: false
        },
        {
          id: 'logo',
          label: 'Logo',
          type: 'image',
          role: 'logoDataURL',
          x: config.logoX ?? 0.06,
          y: config.logoY ?? 0.82,
          width: config.logoSize ?? 0.12,
          height: config.logoSize ?? 0.12,
          shape: brandDefaults.logoShape,
          mask: brandDefaults.logoShape,
          fit: 'cover',
          cropX: 0.5,
          cropY: 0.5,
          cropZoom: 1,
          padding: config.logoPadding ?? 0.012,
          backgroundColor: 'rgba(255,255,255,0.12)',
          borderColor: 'rgba(255,255,255,0.28)',
          placeholderLabel: 'Logo',
          editable: true,
          hidden: !brandShow.logo
        },
        {
          id: 'business_name',
          label: 'Business Name',
          type: 'text',
          role: 'shopName',
          text: profile.shopName || 'Your Business',
          x: config.nameX ?? 0.22,
          y: config.nameY ?? 0.86,
          maxWidth: 0.7,
          fontSize: config.nameFontSize || 36,
          weight: 'bold',
          fontFamily: '"Outfit", "Arial", sans-serif',
          color: brandDefaults.textColor || config.nameColor || '#FFD700',
          align: 'left',
          baseline: 'middle',
          editable: true,
          hidden: !brandShow.business_name
        },
        {
          id: 'phone',
          label: 'Phone',
          type: 'text',
          role: 'phone',
          text: profile.phone || '',
          prefix: 'Phone: ',
          x: config.phoneX ?? 0.22,
          y: config.phoneY ?? 0.92,
          maxWidth: 0.64,
          fontSize: config.phoneFontSize || 22,
          weight: '500',
          fontFamily: '"Poppins", "Arial", sans-serif',
          color: brandDefaults.textColor || config.phoneColor || '#FFFFFF',
          align: 'left',
          baseline: 'middle',
          editable: true,
          hidden: !brandShow.phone
        },
        {
          id: 'tagline',
          label: 'Tagline',
          type: 'text',
          role: 'tagline',
          text: profile.tagline || '',
          x: config.taglineX ?? 0.22,
          y: config.taglineY ?? 0.96,
          maxWidth: 0.64,
          fontSize: config.taglineFontSize || 16,
          weight: '400',
          style: 'italic',
          fontFamily: '"Poppins", "Arial", sans-serif',
          color: brandDefaults.textColor || config.taglineColor || 'rgba(255,255,255,0.72)',
          align: 'left',
          baseline: 'middle',
          editable: true,
          hidden: !brandShow.tagline
        }
      ]
    };

    if (template.defaultLayers?.length) {
      design.layers.unshift(...template.defaultLayers.map(normalizeTemplateLayer));
    }

    design.layers.push({
      id: 'address',
      label: 'Address',
      type: 'text',
      role: 'address',
      text: profile.address || '',
      prefix: 'Address: ',
      x: 0.5,
      y: 0.982,
      maxWidth: 0.86,
      fontSize: 18,
      weight: '400',
      fontFamily: '"Poppins", "Arial", sans-serif',
      color: brandDefaults.textColor || 'rgba(255,255,255,0.5)',
      align: 'center',
      baseline: 'bottom',
      editable: true,
      hidden: !brandShow.address
    });

    if (template.isCustomStarter) {
      const isStory = aspectRatio === '9:16';
      const isLandscape = aspectRatio === '16:9';
      const photoSlot = isStory
        ? { x: 0.16, y: 0.48, width: 0.68, height: 0.38 }
        : isLandscape
          ? { x: 0.56, y: 0.26, width: 0.34, height: 0.42 }
          : { x: 0.28, y: 0.52, width: 0.44, height: 0.26 };
      const titleLayout = isStory
        ? { x: 0.5, y: 0.22, maxWidth: 0.82, fontSize: 78, align: 'center' }
        : isLandscape
          ? { x: 0.08, y: 0.26, maxWidth: 0.42, fontSize: 68, align: 'left' }
          : { x: 0.5, y: 0.34, maxWidth: 0.82, fontSize: 70, align: 'center' };
      const subtitleLayout = isStory
        ? { x: 0.5, y: 0.31, maxWidth: 0.78, fontSize: 32, align: 'center' }
        : isLandscape
          ? { x: 0.08, y: 0.44, maxWidth: 0.42, fontSize: 30, align: 'left' }
          : { x: 0.5, y: 0.44, maxWidth: 0.8, fontSize: 30, align: 'center' };

      design.layers.splice(1, 0,
        {
          id: 'custom_photo',
          label: 'Photo',
          type: 'image',
          x: photoSlot.x,
          y: photoSlot.y,
          width: photoSlot.width,
          height: photoSlot.height,
          shape: 'rect',
          mask: 'rounded',
          fit: 'cover',
          cropX: 0.5,
          cropY: 0.5,
          cropZoom: 1,
          padding: 0,
          backgroundColor: 'rgba(255,255,255,0.12)',
          borderColor: 'rgba(255,255,255,0.22)',
          placeholderLabel: 'Photo',
          slot: true,
          templateLayer: true,
          editable: true
        },
        {
          id: 'custom_title',
          label: 'Main Title',
          type: 'text',
          text: 'Your Event Title',
          x: titleLayout.x,
          y: titleLayout.y,
          maxWidth: titleLayout.maxWidth,
          fontSize: titleLayout.fontSize,
          weight: 'bold',
          fontFamily: '"Outfit", "Arial", sans-serif',
          color: '#FFFFFF',
          align: titleLayout.align,
          baseline: 'middle',
          editable: true
        },
        {
          id: 'custom_subtitle',
          label: 'Subtitle',
          type: 'text',
          text: 'Add date, venue, offer or message',
          x: subtitleLayout.x,
          y: subtitleLayout.y,
          maxWidth: subtitleLayout.maxWidth,
          fontSize: subtitleLayout.fontSize,
          weight: '500',
          fontFamily: '"Poppins", "Arial", sans-serif',
          color: '#D1FAE5',
          align: subtitleLayout.align,
          baseline: 'middle',
          editable: true
        }
      );
    }

    return design;
  }

  function layerText(layer, profile) {
    if (layer.role) {
      const value = profile?.[layer.role] || '';
      return value ? `${layer.prefix || ''}${value}` : '';
    }
    return `${layer.prefix || ''}${layer.text || ''}`;
  }

  function profileInitials(profile = {}) {
    const source = (profile.displayName || profile.shopName || profile.businessName || 'Poster Banao')
      .toString()
      .replace(/\s+/g, ' ')
      .trim();
    const parts = source.match(/[a-zA-Z0-9]+/g) || [];
    return (parts.length ? parts.slice(0, 2).map(part => part[0]).join('') : 'PB').toUpperCase();
  }

  function drawInitialsLogo(ctx, layer, profile, x, y, width, height, radius) {
    const mask = layer.mask || layer.shape || 'circle';
    ctx.save();
    drawMaskPath(ctx, mask, x, y, width, height, radius);
    ctx.clip();

    const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
    gradient.addColorStop(0, '#FF6B2C');
    gradient.addColorStop(0.48, '#E91E8C');
    gradient.addColorStop(1, '#00BFA6');
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, width, height);

    ctx.fillStyle = 'rgba(255,255,255,0.17)';
    ctx.beginPath();
    ctx.arc(x + width * 0.22, y + height * 0.22, width * 0.18, 0, Math.PI * 2);
    ctx.arc(x + width * 0.86, y + height * 0.82, width * 0.16, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowColor = 'rgba(0,0,0,0.28)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `900 ${Math.max(26, width * 0.36)}px "Outfit", "Arial", sans-serif`;
    ctx.fillText(profileInitials(profile), x + width / 2, y + height / 2 + height * 0.03, width * 0.78);
    ctx.restore();
  }

  function layerRotation(layer) {
    const value = Number(layer?.rotation || 0);
    if (!Number.isFinite(value)) return 0;
    return value * Math.PI / 180;
  }

  function normalizeAdjustments(source = {}) {
    return {
      brightness: Number(source.brightness || 0),
      contrast: Number(source.contrast || 0),
      saturation: Number(source.saturation || 0),
      warmth: Number(source.warmth || 0),
      highlights: Number(source.highlights || 0),
      shadows: Number(source.shadows || 0),
      vignette: Number(source.vignette || 0),
      sharpen: Number(source.sharpen || 0)
    };
  }

  function filterPresetAdjustments(preset) {
    const presets = {
      vivid: { contrast: 16, saturation: 28, brightness: 4, sharpen: 14 },
      warm: { warmth: 34, saturation: 8, brightness: 4 },
      cool: { warmth: -32, contrast: 8, brightness: 2 },
      matte: { contrast: -10, saturation: -8, shadows: 18, highlights: -10 },
      film: { contrast: 12, saturation: -12, warmth: 18, vignette: 14 },
      festive: { contrast: 18, saturation: 34, warmth: 16, brightness: 8 },
      glow: { brightness: 12, contrast: -4, saturation: 12, highlights: 16 },
      mono: { saturation: -100, contrast: 20, brightness: 4 },
      food: { saturation: 26, warmth: 24, contrast: 12, sharpen: 18 },
      beauty: { brightness: 10, contrast: -8, warmth: 10, saturation: 8 },
      real_estate: { brightness: 12, contrast: 10, saturation: 8, shadows: 12, sharpen: 18 },
      fitness: { contrast: 24, saturation: 20, shadows: -4, sharpen: 24 }
    };
    return presets[preset] || {};
  }

  function mergedPhotoAdjustments(style = {}) {
    const preset = filterPresetAdjustments(style.filterPreset || 'original');
    const manual = normalizeAdjustments(style.adjustments);
    return normalizeAdjustments({
      brightness: (preset.brightness || 0) + manual.brightness,
      contrast: (preset.contrast || 0) + manual.contrast,
      saturation: (preset.saturation || 0) + manual.saturation,
      warmth: (preset.warmth || 0) + manual.warmth,
      highlights: (preset.highlights || 0) + manual.highlights,
      shadows: (preset.shadows || 0) + manual.shadows,
      vignette: Math.max(preset.vignette || 0, manual.vignette),
      sharpen: (preset.sharpen || 0) + manual.sharpen
    });
  }

  function photoCanvasFilter(style = {}) {
    const next = mergedPhotoAdjustments(style);
    const brightness = clamp(1 + (next.brightness + next.highlights * 0.18 + next.shadows * 0.12) / 140, 0.35, 1.9);
    const contrast = clamp(1 + (next.contrast + next.sharpen * 0.35) / 130, 0.35, 2.2);
    const saturation = clamp(1 + next.saturation / 110, 0, 2.6);
    const warmth = clamp(next.warmth, -100, 100);
    const sepia = Math.max(0, warmth) / 260;
    const hue = warmth < 0 ? Math.abs(warmth) * 0.42 : -warmth * 0.18;
    const grayscale = (style.filterPreset || '').toLowerCase() === 'mono' ? 1 : 0;
    return [
      `brightness(${brightness})`,
      `contrast(${contrast})`,
      `saturate(${saturation})`,
      sepia ? `sepia(${sepia})` : '',
      hue ? `hue-rotate(${hue}deg)` : '',
      grayscale ? 'grayscale(1)' : ''
    ].filter(Boolean).join(' ');
  }

  function drawPhotoAdjustmentOverlay(ctx, x, y, width, height, style = {}) {
    const adjustments = mergedPhotoAdjustments(style);
    const vignette = clamp(adjustments.vignette || 0, 0, 100);
    const shadows = clamp(adjustments.shadows || 0, -100, 100);
    const highlights = clamp(adjustments.highlights || 0, -100, 100);

    if (shadows > 0) {
      ctx.fillStyle = `rgba(255,255,255,${shadows / 420})`;
      ctx.fillRect(x, y, width, height);
    } else if (shadows < 0) {
      ctx.fillStyle = `rgba(0,0,0,${Math.abs(shadows) / 360})`;
      ctx.fillRect(x, y, width, height);
    }

    if (highlights < 0) {
      ctx.fillStyle = `rgba(0,0,0,${Math.abs(highlights) / 520})`;
      ctx.fillRect(x, y, width, height);
    }

    if (vignette > 0) {
      const gradient = ctx.createRadialGradient(
        x + width / 2,
        y + height / 2,
        Math.min(width, height) * 0.14,
        x + width / 2,
        y + height / 2,
        Math.max(width, height) * 0.72
      );
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(1, `rgba(0,0,0,${vignette / 145})`);
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, width, height);
    }
  }

  function drawTemplateImageBackground(ctx, image, style = {}) {
    const rotation = layerRotation(style);
    const w = CANVAS_WIDTH;
    const h = CANVAS_HEIGHT;

    if (!rotation) {
      const scale = Math.max(w / image.width, h / image.height);
      const drawW = image.width * scale;
      const drawH = image.height * scale;
      ctx.drawImage(image, (w - drawW) / 2, (h - drawH) / 2, drawW, drawH);
      return;
    }

    const coverW = w * Math.abs(Math.cos(rotation)) + h * Math.abs(Math.sin(rotation));
    const coverH = w * Math.abs(Math.sin(rotation)) + h * Math.abs(Math.cos(rotation));
    const scale = Math.max(coverW / image.width, coverH / image.height);
    const drawW = image.width * scale;
    const drawH = image.height * scale;

    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(rotation);
    ctx.drawImage(image, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();
  }

  function drawTextLayer(ctx, layer, profile) {
    const text = layerText(layer, profile);
    if (!text) return;

    ctx.save();
    const align = layer.align || 'left';
    const baseline = layer.baseline || 'middle';
    const anchorX = CANVAS_WIDTH * layer.x;
    const anchorY = CANVAS_HEIGHT * layer.y;
    ctx.textAlign = align;
    ctx.textBaseline = baseline;
    ctx.shadowColor = layer.shadowColor || 'rgba(0, 0, 0, 0.45)';
    ctx.shadowBlur = layer.shadowBlur ?? 6;
    ctx.shadowOffsetY = layer.shadowOffsetY ?? 2;

    let fontSize = layer.fontSize || 24;
    const style = layer.style ? `${layer.style} ` : '';
    const weight = layer.weight || '400';
    const family = layer.fontFamily || '"Poppins", "Arial", sans-serif';
    const maxWidth = CANVAS_WIDTH * (layer.maxWidth || 0.7);

    ctx.font = `${style}${weight} ${fontSize}px ${family}`;
    while (ctx.measureText(text).width > maxWidth && fontSize > 10) {
      fontSize -= 2;
      ctx.font = `${style}${weight} ${fontSize}px ${family}`;
    }

    const textWidth = Math.min(ctx.measureText(text).width, maxWidth);
    const textHeight = fontSize * 1.28;
    let textX = anchorX;
    let textY = anchorY;

    if (align === 'center') textX -= textWidth / 2;
    if (align === 'right') textX -= textWidth;
    if (baseline === 'middle') textY -= textHeight / 2;
    if (baseline === 'bottom' || baseline === 'alphabetic') textY -= textHeight;

    const rotation = layerRotation(layer);
    if (rotation) {
      ctx.translate(textX + textWidth / 2, textY + textHeight / 2);
      ctx.rotate(rotation);
      ctx.translate(-(textX + textWidth / 2), -(textY + textHeight / 2));
    }

    if (layer.textBackground) {
      const padX = CANVAS_SIZE * (layer.textPadding ?? 0.014);
      const padY = Math.max(8, padX * 0.72);
      ctx.shadowColor = 'rgba(0, 0, 0, 0.18)';
      ctx.shadowBlur = Math.max(ctx.shadowBlur, 8);
      ctx.fillStyle = layer.textBackground;
      drawRoundedRect(
        ctx,
        textX - padX,
        textY - padY,
        textWidth + padX * 2,
        textHeight + padY * 2,
        Math.min(999, (textHeight + padY * 2) / 2)
      );
      ctx.fill();
    }

    if (Number(layer.outlineWidth || 0) > 0) {
      ctx.lineJoin = 'round';
      ctx.lineWidth = Number(layer.outlineWidth || 0);
      ctx.strokeStyle = layer.outlineColor || 'rgba(0,0,0,0.62)';
      ctx.strokeText(text, anchorX, anchorY);
    }

    ctx.fillStyle = layer.color || '#FFFFFF';
    ctx.fillText(text, anchorX, anchorY);
    ctx.restore();
  }

  function drawMaskPath(ctx, mask, x, y, width, height, radius = 28) {
    const shape = mask || 'rect';
    if (shape === 'circle') {
      const cx = x + width / 2;
      const cy = y + height / 2;
      const r = Math.min(width, height) / 2;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      return;
    }

    if (shape === 'oval') {
      ctx.beginPath();
      ctx.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, Math.PI * 2);
      return;
    }

    if (shape === 'arch') {
      ctx.beginPath();
      ctx.moveTo(x, y + height);
      ctx.lineTo(x, y + height * 0.38);
      ctx.bezierCurveTo(x, y + height * 0.12, x + width * 0.22, y, x + width * 0.5, y);
      ctx.bezierCurveTo(x + width * 0.78, y, x + width, y + height * 0.12, x + width, y + height * 0.38);
      ctx.lineTo(x + width, y + height);
      ctx.closePath();
      return;
    }

    if (shape === 'heart') {
      const cx = x + width / 2;
      const top = y + height * 0.2;
      const bottom = y + height * 0.92;
      ctx.beginPath();
      ctx.moveTo(cx, bottom);
      ctx.bezierCurveTo(x - width * 0.05, y + height * 0.58, x + width * 0.03, top, cx, y + height * 0.35);
      ctx.bezierCurveTo(x + width * 0.97, top, x + width * 1.05, y + height * 0.58, cx, bottom);
      ctx.closePath();
      return;
    }

    if (shape === 'rounded') {
      drawRoundedRect(ctx, x, y, width, height, Math.min(radius, width / 2, height / 2));
      return;
    }

    ctx.beginPath();
    ctx.rect(x, y, width, height);
  }

  function drawImageCover(ctx, image, x, y, width, height, layer) {
    if (layer.fit === 'contain') {
      const scale = Math.min(width / image.width, height / image.height);
      const drawW = image.width * scale;
      const drawH = image.height * scale;
      ctx.drawImage(image, x + (width - drawW) / 2, y + (height - drawH) / 2, drawW, drawH);
      return;
    }

    const zoom = clamp(layer.cropZoom ?? 1, 1, 4);
    const cropX = clamp(layer.cropX ?? layer.crop?.x ?? 0.5, 0, 1);
    const cropY = clamp(layer.cropY ?? layer.crop?.y ?? 0.5, 0, 1);
    const sourceRatio = image.width / image.height;
    const slotRatio = width / height;
    let sw = image.width;
    let sh = image.height;

    if (sourceRatio > slotRatio) {
      sw = image.height * slotRatio;
    } else {
      sh = image.width / slotRatio;
    }

    sw = Math.max(1, sw / zoom);
    sh = Math.max(1, sh / zoom);
    const sx = (image.width - sw) * cropX;
    const sy = (image.height - sh) * cropY;
    ctx.drawImage(image, sx, sy, sw, sh, x, y, width, height);
  }

  function drawImagePlaceholder(ctx, layer, x, y, width, height) {
    const label = layer.placeholderLabel || layer.label || 'Photo';
    ctx.save();
    drawMaskPath(ctx, layer.mask || layer.shape || 'rounded', x, y, width, height, CANVAS_SIZE * 0.026);
    ctx.clip();
    ctx.fillStyle = layer.placeholderFill || 'rgba(255,255,255,0.08)';
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = layer.placeholderColor || 'rgba(255,255,255,0.72)';
    ctx.font = '600 26px "Poppins", "Arial", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x + width / 2, y + height / 2, width * 0.82);
    ctx.restore();
  }

  function drawImageLayer(ctx, layer, image, profile) {
    let x = CANVAS_WIDTH * layer.x;
    let y = CANVAS_HEIGHT * layer.y;
    const width = layerPixelWidth(layer);
    const height = layerPixelHeight(layer);
    const padding = CANVAS_SIZE * (layer.padding || 0);
    const mask = layer.mask || layer.shape || 'rect';
    const frameColor = layer.frameColor || layer.borderColor;
    const radius = CANVAS_SIZE * (layer.radius || 0.026);

    ctx.save();
    const rotation = layerRotation(layer);
    if (rotation) {
      ctx.translate(x + width / 2, y + height / 2);
      ctx.rotate(rotation);
      x = -width / 2;
      y = -height / 2;
    }
    if (padding > 0 || layer.backgroundColor || frameColor || !image) {
      drawMaskPath(ctx, mask, x - padding, y - padding, width + padding * 2, height + padding * 2, radius + padding);
      ctx.fillStyle = layer.backgroundColor || 'rgba(255,255,255,0.12)';
      ctx.fill();
      if (frameColor) {
        ctx.strokeStyle = frameColor;
        ctx.lineWidth = Math.max(2, CANVAS_SIZE * (layer.frameWidth || 0.003));
        ctx.stroke();
      }
    }

    if (!image && layer.role === 'logoDataURL') {
      drawInitialsLogo(ctx, layer, profile, x, y, width, height, radius);
      ctx.restore();
      return;
    }

    if (!image) {
      if (layer.slot || layer.placeholderLabel || layer.editable) {
        drawImagePlaceholder(ctx, layer, x, y, width, height);
      }
      ctx.restore();
      return;
    }

    drawMaskPath(ctx, mask, x, y, width, height, radius);
    ctx.clip();
    ctx.filter = photoCanvasFilter(layer);
    drawImageCover(ctx, image, x, y, width, height, layer);
    ctx.filter = 'none';
    drawPhotoAdjustmentOverlay(ctx, x, y, width, height, layer);
    ctx.restore();
  }

  function drawShapeLayer(ctx, layer) {
    let x = CANVAS_WIDTH * (layer.x || 0);
    let y = CANVAS_HEIGHT * (layer.y || 0);
    const width = layerPixelWidth(layer, 1);
    const height = layerPixelHeight(layer, 1);

    ctx.save();
    const rotation = layerRotation(layer);
    if (rotation) {
      ctx.translate(x + width / 2, y + height / 2);
      ctx.rotate(rotation);
      x = -width / 2;
      y = -height / 2;
    }
    ctx.fillStyle = layer.color || 'rgba(0,0,0,0.8)';

    if (layer.shape === 'rect') {
      const radius = layer.radius ?? 20;
      ctx.beginPath();
      ctx.moveTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height);
      ctx.lineTo(x, y + height);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  function drawStickerLayer(ctx, layer, image) {
    let x = CANVAS_WIDTH * (layer.x || 0);
    let y = CANVAS_HEIGHT * (layer.y || 0);
    const width = layerPixelWidth(layer, 0.2);
    const height = layerPixelHeight(layer, 0.2);

    ctx.save();
    const rotation = layerRotation(layer);
    if (rotation) {
      ctx.translate(x + width / 2, y + height / 2);
      ctx.rotate(rotation);
      x = -width / 2;
      y = -height / 2;
    }

    if (image) {
      ctx.shadowColor = layer.shadowColor || 'rgba(0,0,0,0.22)';
      ctx.shadowBlur = layer.shadowBlur ?? Math.max(8, CANVAS_SIZE * 0.01);
      ctx.shadowOffsetY = layer.shadowOffsetY ?? Math.max(2, CANVAS_SIZE * 0.003);
      ctx.drawImage(image, x, y, width, height);
      ctx.restore();
      return;
    }

    if (layer.glyph) {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `${Math.max(18, Math.min(width, height) * 0.78)}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
      ctx.shadowColor = layer.shadowColor || 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = layer.shadowBlur ?? Math.max(8, CANVAS_SIZE * 0.012);
      ctx.shadowOffsetY = layer.shadowOffsetY ?? Math.max(2, CANVAS_SIZE * 0.004);
      ctx.fillText(layer.glyph, x + width / 2, y + height / 2);
    }

    ctx.restore();
  }

  function measureTextBounds(layer, profile) {
    const text = layerText(layer, profile);
    if (!text) return null;

    const canvas = document.createElement('canvas');
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    const ctx = canvas.getContext('2d');
    let fontSize = layer.fontSize || 24;
    const style = layer.style ? `${layer.style} ` : '';
    const weight = layer.weight || '400';
    const family = layer.fontFamily || '"Poppins", "Arial", sans-serif';
    const maxWidth = CANVAS_WIDTH * (layer.maxWidth || 0.7);

    ctx.font = `${style}${weight} ${fontSize}px ${family}`;
    while (ctx.measureText(text).width > maxWidth && fontSize > 10) {
      fontSize -= 2;
      ctx.font = `${style}${weight} ${fontSize}px ${family}`;
    }

    const width = Math.min(ctx.measureText(text).width, maxWidth);
    const height = fontSize * 1.28;
    let x = CANVAS_WIDTH * (layer.x || 0);
    let y = CANVAS_HEIGHT * (layer.y || 0);

    if ((layer.align || 'left') === 'center') x -= width / 2;
    if ((layer.align || 'left') === 'right') x -= width;

    const baseline = layer.baseline || 'middle';
    if (baseline === 'middle') y -= height / 2;
    if (baseline === 'bottom' || baseline === 'alphabetic') y -= height;

    const pad = Math.max(10, fontSize * 0.22);
    return {
      x: clamp((x - pad) / CANVAS_WIDTH, 0, 1),
      y: clamp((y - pad) / CANVAS_HEIGHT, 0, 1),
      width: clamp((width + pad * 2) / CANVAS_WIDTH, 0.02, 1),
      height: clamp((height + pad * 2) / CANVAS_HEIGHT, 0.02, 1)
    };
  }

  function getLayerBounds(layer, profile = {}) {
    if (!layer || layer.hidden) return null;

    if (layer.type === 'image' || layer.type === 'shape' || layer.type === 'sticker') {
      return {
        x: clamp(layer.x || 0, 0, 1),
        y: clamp(layer.y || 0, 0, 1),
        width: clamp(layerPixelWidth(layer) / CANVAS_WIDTH, 0.02, 1),
        height: clamp(layerPixelHeight(layer) / CANVAS_HEIGHT, 0.02, 1)
      };
    }

    if (layer.type === 'text') {
      return measureTextBounds(layer, profile);
    }

    return null;
  }

  async function renderDesignLayers(ctx, design, profile) {
    const imageLayers = design.layers.filter(layer => layer.type === 'image');
    const imageMap = {};
    const stickerLayers = design.layers.filter(layer => layer.type === 'sticker' && layer.svg);
    const stickerMap = {};

    for (const layer of imageLayers) {
      const src = layer.role ? profile[layer.role] : layer.src;
      if (!src) continue;
      try {
        imageMap[layer.id] = await loadImage(src);
      } catch (e) {
        console.warn('Layer image failed:', e);
      }
    }

    for (const layer of stickerLayers) {
      try {
        stickerMap[layer.id] = await loadStickerImage(layer);
      } catch (e) {
        console.warn('Sticker image failed:', e);
      }
    }

    for (const layer of design.layers) {
      if (layer.hidden) continue;
      const prevAlpha = ctx.globalAlpha;
      if (typeof layer.opacity === 'number') {
        ctx.globalAlpha = prevAlpha * Math.max(0, Math.min(1, layer.opacity));
      }
      if (layer.type === 'shape') drawShapeLayer(ctx, layer);
      if (layer.type === 'image') drawImageLayer(ctx, layer, imageMap[layer.id], profile);
      if (layer.type === 'sticker') drawStickerLayer(ctx, layer, stickerMap[layer.id]);
      if (layer.type === 'text') drawTextLayer(ctx, layer, profile);
      ctx.globalAlpha = prevAlpha;
    }
  }

  function drawAnimatedFrame(ctx, image, progress, animation = {}) {
    const canvas = ctx.canvas;
    const w = canvas.width;
    const h = canvas.height;
    const preset = animation.preset || 'cinematic';
    const intensity = clamp(animation.intensity ?? 1, 0, 2);
    const speed = clamp(animation.speed ?? 1, 0.4, 2.5);
    const loop = (progress * speed) % 1;
    const pulse = Math.sin(loop * Math.PI);
    const wave = Math.sin(loop * Math.PI * 2);
    const isDepthPreset = ['mandap3d', 'rangoli3d', 'stage3d', 'product3d', 'photoOrbit3d', 'fireworks3d', 'confetti3d', 'luxury3d'].includes(preset);
    const scaleBase = preset === 'zoom' ? 0.045 : preset === 'pulse' ? 0.032 : isDepthPreset ? 0.034 : 0.024;
    const scale = 1 + pulse * scaleBase * intensity;
    const pan = preset === 'slide' || preset === 'product3d' ? (loop - 0.5) * w * 0.035 * intensity : 0;
    const scaledW = w * scale;
    const scaledH = h * scale;
    const x = (w - scaledW) / 2 + pan;
    const y = (h - scaledH) / 2;

    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(image, x, y, scaledW, scaledH);

    if (preset === 'spotlight' || preset === 'cinematic' || preset === 'zoom' || preset === 'stage3d' || preset === 'product3d' || preset === 'mandap3d' || preset === 'photoOrbit3d' || preset === 'luxury3d') {
      const sx = w * (0.25 + loop * 0.5);
      const sy = h * (0.22 + Math.sin(loop * Math.PI * 2) * 0.08);
      const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, w * 0.58);
      glow.addColorStop(0, `rgba(255,255,255,${0.16 * intensity})`);
      glow.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, w, h);
    }

    if (preset === 'cinematic' || preset === 'sparkle' || preset === 'slide' || preset === 'stage3d' || preset === 'product3d' || preset === 'luxury3d') {
      const sweepX = (loop * 1.35 - 0.2) * w;
      const sweep = ctx.createLinearGradient(sweepX - w * 0.25, 0, sweepX + w * 0.25, h);
      sweep.addColorStop(0, 'rgba(255,255,255,0)');
      sweep.addColorStop(0.5, `rgba(255,255,255,${0.15 * intensity})`);
      sweep.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = sweep;
      ctx.fillRect(0, 0, w, h);
    }

    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    if (preset === 'confetti' || preset === 'confetti3d') {
      const colors = ['#FF6B2C', '#E91E8C', '#FFB800', '#00BFA6', '#7C3AED', '#3B82F6'];
      const count = Math.round(42 * Math.max(0.35, intensity));
      for (let i = 0; i < count; i++) {
        const depth = preset === 'confetti3d' ? 0.45 + ((i * 17) % 100) / 100 : 1;
        const px = ((i * 97) % w) + Math.sin(loop * 6 + i) * 18 * depth;
        const py = ((loop * h * 1.25 * depth + i * 53) % (h + 120)) - 60;
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(loop * Math.PI * 4 + i);
        ctx.fillStyle = colors[i % colors.length];
        ctx.globalAlpha = 0.24 + depth * 0.28;
        ctx.fillRect(-5 * depth, -3 * depth, 10 * depth, 6 * depth);
        ctx.restore();
      }
    } else {
      const count = Math.round((preset === 'sparkle' ? 44 : 24) * Math.max(0.35, intensity));
      for (let i = 0; i < count; i++) {
        const drift = (loop * 190 + i * 41) % (h + 160);
        const px = (Math.sin(i * 9.17) * 0.5 + 0.5) * w;
        const py = h + 80 - drift;
        const radius = 1.5 + (i % 5) * 0.8;
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.12 + (i % 4) * 0.04})`;
        ctx.fill();
      }
    }
    ctx.restore();

    if (preset === 'mandap3d') drawMandap3dOverlay(ctx, w, h, loop, intensity, wave);
    if (preset === 'rangoli3d') drawRangoli3dOverlay(ctx, w, h, loop, intensity);
    if (preset === 'stage3d') drawStage3dOverlay(ctx, w, h, loop, intensity);
    if (preset === 'product3d') drawProduct3dOverlay(ctx, w, h, loop, intensity);
    if (preset === 'photoOrbit3d') drawPhotoOrbit3dOverlay(ctx, w, h, loop, intensity);
    if (preset === 'fireworks3d') drawFireworks3dOverlay(ctx, w, h, loop, intensity);
    if (preset === 'luxury3d') drawLuxury3dOverlay(ctx, w, h, loop, intensity);

    if (preset === 'pulse') {
      ctx.fillStyle = `rgba(255,255,255,${(0.035 + wave * 0.018) * intensity})`;
      ctx.fillRect(0, 0, w, h);
    }

    const fade = Math.min(progress, 1 - progress) * 2;
    if (fade < 1) {
      ctx.fillStyle = `rgba(0,0,0,${(1 - fade) * 0.14})`;
      ctx.fillRect(0, 0, w, h);
    }
  }

  function drawLuxury3dOverlay(ctx, w, h, loop, intensity) {
    const phase = loop * Math.PI * 2;
    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    const floorGrad = ctx.createRadialGradient(w * 0.5, h * 0.76, 0, w * 0.5, h * 0.76, w * 0.46);
    floorGrad.addColorStop(0, `rgba(255, 235, 170, ${0.18 * intensity})`);
    floorGrad.addColorStop(0.45, `rgba(217, 70, 239, ${0.08 * intensity})`);
    floorGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = floorGrad;
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.76, w * 0.42, h * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(w * 0.5, h * 0.5);
    ctx.scale(1, 0.48);
    for (let ring = 0; ring < 5; ring++) {
      const radius = w * (0.18 + ring * 0.045);
      const alpha = (0.18 - ring * 0.018) * intensity;
      ctx.save();
      ctx.rotate(phase * (ring % 2 ? -0.18 : 0.22) + ring * 0.55);
      ctx.strokeStyle = ring % 2
        ? `rgba(245, 208, 254, ${alpha})`
        : `rgba(253, 224, 71, ${alpha})`;
      ctx.lineWidth = 3 + ring;
      ctx.beginPath();
      ctx.ellipse(0, 0, radius, radius * (0.32 + ring * 0.02), 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();

    for (let i = 0; i < 6; i++) {
      const depth = 0.68 + i * 0.07;
      const x = w * (0.16 + ((i * 19 + loop * 22) % 68) / 100);
      const y = h * (0.22 + ((i * 13) % 44) / 100) + Math.sin(phase + i) * h * 0.014;
      const size = w * (0.04 + (i % 3) * 0.012) * depth;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.sin(phase * 0.8 + i) * 0.35);
      ctx.fillStyle = `rgba(255,255,255,${0.07 * intensity})`;
      ctx.strokeStyle = i % 2
        ? `rgba(251, 207, 232, ${0.18 * intensity})`
        : `rgba(253, 230, 138, ${0.18 * intensity})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.lineTo(size * 0.72, 0);
      ctx.lineTo(0, size);
      ctx.lineTo(-size * 0.72, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    const colors = ['#FDE68A', '#F5D0FE', '#BAE6FD', '#FBCFE8'];
    for (let i = 0; i < 36; i++) {
      const depth = 0.45 + ((i * 29) % 100) / 100;
      const px = ((i * 83 + loop * w * 0.18) % w);
      const py = ((i * 47 + loop * h * 0.72) % (h + 100)) - 50;
      const radius = (2.2 + (i % 4) * 1.1) * depth;
      ctx.beginPath();
      ctx.arc(px, py, radius, 0, Math.PI * 2);
      ctx.fillStyle = colorWithAlpha(colors[i % colors.length], (0.08 + depth * 0.12) * intensity);
      ctx.fill();
    }

    ctx.restore();
  }

  function drawMandap3dOverlay(ctx, w, h, loop, intensity, wave) {
    const sway = wave * w * 0.012 * intensity;
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = `rgba(255, 214, 120, ${0.08 * intensity})`;
    ctx.beginPath();
    ctx.moveTo(w * 0.16 + sway, h * 0.08);
    ctx.lineTo(w * 0.84 + sway, h * 0.08);
    ctx.lineTo(w * 0.73 - sway, h * 0.25);
    ctx.lineTo(w * 0.27 - sway, h * 0.25);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = `rgba(255, 244, 190, ${0.18 * intensity})`;
    ctx.lineWidth = 8;
    [0.22, 0.78].forEach((x) => {
      ctx.beginPath();
      ctx.moveTo(w * x + sway, h * 0.18);
      ctx.lineTo(w * (x + (x < 0.5 ? -0.035 : 0.035)) - sway, h * 0.78);
      ctx.stroke();
    });
    ctx.restore();
  }

  function drawRangoli3dOverlay(ctx, w, h, loop, intensity) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.translate(w * 0.5, h * 0.58);
    ctx.scale(1, 0.42);
    ctx.rotate(loop * Math.PI * 2);
    const palette = ['#FDE047', '#F97316', '#E11D48', '#22C55E', '#38BDF8'];
    for (let ring = 0; ring < 3; ring++) {
      const radius = w * (0.09 + ring * 0.045);
      const count = 10 + ring * 4;
      for (let i = 0; i < count; i++) {
        ctx.save();
        ctx.rotate((Math.PI * 2 * i) / count);
        ctx.beginPath();
        ctx.ellipse(0, -radius, 12 + ring * 5, 36 + ring * 8, 0, 0, Math.PI * 2);
        ctx.fillStyle = colorWithAlpha(palette[(i + ring) % palette.length], 0.11 + intensity * 0.04);
        ctx.fill();
        ctx.restore();
      }
    }
    ctx.restore();
  }

  function drawStage3dOverlay(ctx, w, h, loop, intensity) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const beams = [
      { x: 0.08, target: 0.42, color: '#FFFFFF' },
      { x: 0.50, target: 0.50 + Math.sin(loop * Math.PI * 2) * 0.14, color: '#FDE68A' },
      { x: 0.92, target: 0.58, color: '#93C5FD' }
    ];
    beams.forEach((beam) => {
      const grad = ctx.createLinearGradient(w * beam.x, h * 0.05, w * beam.target, h * 0.82);
      grad.addColorStop(0, colorWithAlpha(beam.color, 0.2 * intensity));
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(w * beam.x, h * 0.03);
      ctx.lineTo(w * (beam.target - 0.14), h * 0.82);
      ctx.lineTo(w * (beam.target + 0.14), h * 0.82);
      ctx.closePath();
      ctx.fill();
    });
    ctx.restore();
  }

  function drawProduct3dOverlay(ctx, w, h, loop, intensity) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const skew = Math.sin(loop * Math.PI * 2) * w * 0.04 * intensity;
    ctx.strokeStyle = `rgba(255,255,255,${0.2 * intensity})`;
    ctx.lineWidth = 4;
    for (let i = 0; i < 3; i++) {
      const pad = w * (0.12 + i * 0.045);
      ctx.beginPath();
      ctx.moveTo(pad + skew, h * (0.18 + i * 0.03));
      ctx.lineTo(w - pad + skew, h * (0.18 + i * 0.03));
      ctx.lineTo(w - pad - skew, h * (0.72 - i * 0.02));
      ctx.lineTo(pad - skew, h * (0.72 - i * 0.02));
      ctx.closePath();
      ctx.stroke();
    }
    ctx.fillStyle = `rgba(255, 214, 120, ${0.1 * intensity})`;
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.75, w * 0.26, h * 0.04, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawPhotoOrbit3dOverlay(ctx, w, h, loop, intensity) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.translate(w * 0.5, h * 0.48);
    ctx.strokeStyle = `rgba(255,255,255,${0.2 * intensity})`;
    ctx.lineWidth = 3;
    for (let i = 0; i < 3; i++) {
      ctx.save();
      ctx.rotate(loop * Math.PI * 2 + i * 0.9);
      ctx.beginPath();
      ctx.ellipse(0, 0, w * (0.24 + i * 0.04), h * (0.08 + i * 0.018), 0, 0, Math.PI * 2);
      ctx.stroke();
      const dotX = Math.cos(loop * Math.PI * 2 + i) * w * (0.24 + i * 0.04);
      const dotY = Math.sin(loop * Math.PI * 2 + i) * h * (0.08 + i * 0.018);
      ctx.beginPath();
      ctx.arc(dotX, dotY, 5 + i * 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 244, 180, ${0.26 * intensity})`;
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }

  function drawFireworks3dOverlay(ctx, w, h, loop, intensity) {
    const colors = ['#FDE047', '#F97316', '#E11D48', '#38BDF8', '#A855F7'];
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    for (let burst = 0; burst < 5; burst++) {
      const phase = (loop + burst * 0.19) % 1;
      const cx = w * (0.18 + ((burst * 23) % 64) / 100);
      const cy = h * (0.14 + ((burst * 17) % 42) / 100);
      const radius = w * (0.03 + phase * 0.13);
      const alpha = (1 - phase) * 0.28 * intensity;
      for (let i = 0; i < 18; i++) {
        const angle = (Math.PI * 2 * i) / 18;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * radius * 0.25, cy + Math.sin(angle) * radius * 0.25);
        ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
        ctx.strokeStyle = colorWithAlpha(colors[(burst + i) % colors.length], alpha);
        ctx.lineWidth = 3;
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  /**
   * Draw the business info banner overlay
   * @param {CanvasRenderingContext2D} ctx
   * @param {Object} profile - Business profile data
   * @param {Object} config - overlayConfig from template
   * @param {HTMLImageElement|null} logoImg - Loaded logo image
   */
  function drawBusinessOverlay(ctx, profile, config, logoImg) {
    const w = CANVAS_WIDTH;
    const h = CANVAS_HEIGHT;

    // Draw semi-transparent banner background
    const bannerY = h * config.bannerY;
    const bannerH = h * config.bannerHeight;

    // Gradient banner for premium feel
    const bannerGrad = ctx.createLinearGradient(0, bannerY, 0, bannerY + bannerH);
    const bannerColor = config.bannerColor || 'rgba(0, 0, 0, 0.86)';
    bannerGrad.addColorStop(0, setRgbaAlpha(bannerColor, 0.97));
    bannerGrad.addColorStop(1, setRgbaAlpha(bannerColor, 0.99));
    ctx.fillStyle = bannerGrad;

    // Rounded top corners for the banner
    const radius = 20;
    ctx.beginPath();
    ctx.moveTo(0, bannerY + radius);
    ctx.quadraticCurveTo(0, bannerY, radius, bannerY);
    ctx.lineTo(w - radius, bannerY);
    ctx.quadraticCurveTo(w, bannerY, w, bannerY + radius);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    // Thin accent line at top of banner
    ctx.beginPath();
    ctx.moveTo(20, bannerY + 1);
    ctx.lineTo(w - 20, bannerY + 1);
    const accentGrad = ctx.createLinearGradient(20, 0, w - 20, 0);
    accentGrad.addColorStop(0, 'rgba(255, 107, 44, 0)');
    accentGrad.addColorStop(0.2, 'rgba(255, 107, 44, 0.8)');
    accentGrad.addColorStop(0.5, 'rgba(233, 30, 140, 0.8)');
    accentGrad.addColorStop(0.8, 'rgba(255, 184, 0, 0.8)');
    accentGrad.addColorStop(1, 'rgba(255, 184, 0, 0)');
    ctx.strokeStyle = accentGrad;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw logo
    if (logoImg) {
      const logoX = w * config.logoX;
      const logoY = h * config.logoY;
      const logoSize = CANVAS_SIZE * config.logoSize;

      // Logo background circle
      ctx.save();
      ctx.beginPath();
      const logoCX = logoX + logoSize / 2;
      const logoCY = logoY + logoSize / 2;
      const logoR = logoSize / 2 + 4;
      ctx.arc(logoCX, logoCY, logoR, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Clip to circle and draw logo
      ctx.beginPath();
      ctx.arc(logoCX, logoCY, logoSize / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
      ctx.restore();
    }

    // Draw shop name
    if (profile.shopName) {
      ctx.save();
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 8;

      const nameX = w * config.nameX;
      const nameY = h * config.nameY;
      const maxWidth = w * 0.7;

      // Auto-size text to fit
      let fontSize = config.nameFontSize || 36;
      ctx.font = `bold ${fontSize}px "Outfit", "Arial", sans-serif`;
      while (ctx.measureText(profile.shopName).width > maxWidth && fontSize > 18) {
        fontSize -= 2;
        ctx.font = `bold ${fontSize}px "Outfit", "Arial", sans-serif`;
      }

      ctx.fillStyle = config.nameColor || '#FFD700';
      ctx.fillText(profile.shopName, nameX, nameY);
      ctx.restore();
    }

    // Draw phone number
    if (profile.phone) {
      ctx.save();
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
      ctx.shadowBlur = 4;

      const phoneX = w * config.phoneX;
      const phoneY = h * config.phoneY;
      ctx.font = `500 ${config.phoneFontSize || 22}px "Poppins", "Arial", sans-serif`;
      ctx.fillStyle = config.phoneColor || '#FFFFFF';
      ctx.fillText(`📞 ${profile.phone}`, phoneX, phoneY);
      ctx.restore();
    }

    // Draw tagline
    if (profile.tagline) {
      ctx.save();
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';

      const tagX = w * config.taglineX;
      const tagY = h * config.taglineY;
      const maxTagWidth = w * 0.65;
      let tagFontSize = config.taglineFontSize || 16;
      ctx.font = `italic ${tagFontSize}px "Poppins", "Arial", sans-serif`;

      while (ctx.measureText(profile.tagline).width > maxTagWidth && tagFontSize > 10) {
        tagFontSize -= 1;
        ctx.font = `italic ${tagFontSize}px "Poppins", "Arial", sans-serif`;
      }

      ctx.fillStyle = config.taglineColor || 'rgba(255,255,255,0.7)';
      ctx.fillText(profile.tagline, tagX, tagY);
      ctx.restore();
    }

    // Draw address (small, at the very bottom)
    if (profile.address) {
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.font = `400 14px "Poppins", "Arial", sans-serif`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      const maxAddrWidth = w * 0.85;
      let addr = profile.address;
      if (ctx.measureText(addr).width > maxAddrWidth) {
        addr = addr.substring(0, 50) + '...';
      }
      ctx.fillText(`📍 ${addr}`, w / 2, h - 12);
      ctx.restore();
    }
  }

  /**
   * Draw watermark on the poster
   * @param {CanvasRenderingContext2D} ctx
   */
  function drawWatermark(ctx) {
    const w = CANVAS_WIDTH;
    const h = CANVAS_HEIGHT;

    ctx.save();

    // Diagonal watermark text
    ctx.translate(w / 2, h / 2);
    ctx.rotate(-Math.PI / 6);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 42px "Outfit", "Arial", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.fillText('PosterBanao.in', 0, -60);
    ctx.fillText('PosterBanao.in', 0, 60);

    // Smaller repeated watermarks
    ctx.font = 'bold 28px "Outfit", "Arial", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fillText('PosterBanao.in', -200, -180);
    ctx.fillText('PosterBanao.in', 200, 180);
    ctx.fillText('PosterBanao.in', -200, 180);
    ctx.fillText('PosterBanao.in', 200, -180);

    ctx.restore();

    // Bottom right corner badge
    ctx.save();
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.font = 'bold 16px "Outfit", "Arial", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.fillText('Made with PosterBanao', w - 20, h * 0.78 - 10);
    ctx.restore();
  }

  /**
   * Render a complete poster
   * @param {string} templateId - Template ID
   * @param {Object} profile - Business profile
   * @param {Object} options - { withWatermark: boolean }
   * @returns {Promise<HTMLCanvasElement>}
   */
  async function renderPoster(templateId, profile, options = {}) {
    const template = TemplateRegistry.getById(templateId);
    if (!template) throw new Error('Template not found');

    if (options.design?.aspectRatio) {
      setCanvasSizeForAspect(options.design.aspectRatio);
    }

    const { canvas, ctx } = getCanvas();
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Step 1: Draw background
    if (template.path) {
      try {
        const bgImg = await loadImage(template.path);
        ctx.save();
        if (options.design?.photoStyle) {
          ctx.filter = photoCanvasFilter(options.design.photoStyle);
        }
        drawTemplateImageBackground(ctx, bgImg, options.design?.photoStyle || {});
        ctx.filter = 'none';
        if (options.design?.photoStyle) {
          drawPhotoAdjustmentOverlay(ctx, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, options.design.photoStyle);
        }
        ctx.restore();
      } catch (e) {
        // Fallback to generated background
        console.warn('Image load failed, using generated background:', e);
        generateCanvasBackground(ctx, template.canvasGen || {
          gradient: ['#1a0e2e', '#2d1b4e'],
          text: template.name,
          textColor: '#FFD700'
        });
      }
    } else if (template.canvasGen) {
      generateCanvasBackground(ctx, template.canvasGen);
    }

    if (options.design) {
      await renderDesignLayers(ctx, options.design, profile);
    } else {
      // Step 2: Load logo if exists
      let logoImg = null;
      if (profile.logoDataURL) {
        try {
          logoImg = await loadImage(profile.logoDataURL);
        } catch (e) {
          console.warn('Logo load failed:', e);
        }
      }

      // Step 3: Draw business overlay
      drawBusinessOverlay(ctx, profile, template.overlayConfig, logoImg);
    }

    // Step 4: Draw watermark if needed
    if (options.withWatermark !== false) {
      drawWatermark(ctx);
    }

    // Draw alignment guidelines if set in editor
    if (options.design && options.design.guidelines) {
      const g = options.design.guidelines;
      ctx.save();
      ctx.strokeStyle = '#D946EF'; // Neon Magenta guide color
      ctx.lineWidth = 3;
      ctx.setLineDash([10, 8]);
      ctx.shadowColor = 'rgba(217, 70, 239, 0.5)';
      ctx.shadowBlur = 6;

      if (Array.isArray(g.vLines)) {
        g.vLines.forEach(x => {
          const px = x * CANVAS_WIDTH;
          ctx.beginPath();
          ctx.moveTo(px, 0);
          ctx.lineTo(px, CANVAS_HEIGHT);
          ctx.stroke();
        });
      }

      if (Array.isArray(g.hLines)) {
        g.hLines.forEach(y => {
          const py = y * CANVAS_HEIGHT;
          ctx.beginPath();
          ctx.moveTo(0, py);
          ctx.lineTo(CANVAS_WIDTH, py);
          ctx.stroke();
        });
      }
      ctx.restore();
    }

    return canvas;
  }

  /**
   * Generate a thumbnail preview for the gallery
   * @param {string} templateId
   * @returns {Promise<string>} Data URL of thumbnail
   */
  async function generateThumbnail(templateId) {
    const template = TemplateRegistry.getById(templateId);
    if (!template) return null;

    // Create an offscreen canvas for thumbnails
    const thumbCanvas = document.createElement('canvas');
    thumbCanvas.width = 300;
    thumbCanvas.height = 300;
    const tCtx = thumbCanvas.getContext('2d');

    if (template.path) {
      try {
        const img = await loadImage(template.path);
        tCtx.drawImage(img, 0, 0, 300, 300);
        return thumbCanvas.toDataURL('image/jpeg', 0.7);
      } catch (e) {
        // Fall through to canvas generation
      }
    }

    if (template.canvasGen) {
      // Scale down the generation
      tCtx.save();
      tCtx.scale(300 / CANVAS_SIZE, 300 / CANVAS_SIZE);

      // Simplified background for thumbnail
      const config = template.canvasGen;
      const gradient = tCtx.createLinearGradient(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      const colors = config.gradient || ['#FF6B2C', '#E91E8C'];
      colors.forEach((color, i) => {
        gradient.addColorStop(i / (colors.length - 1), color);
      });
      tCtx.fillStyle = gradient;
      tCtx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      // Add some bokeh
      for (let i = 0; i < 15; i++) {
        const x = Math.random() * CANVAS_SIZE;
        const y = Math.random() * CANVAS_SIZE * 0.7;
        const r = Math.random() * 30 + 10;
        tCtx.beginPath();
        tCtx.arc(x, y, r, 0, Math.PI * 2);
        tCtx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.1 + 0.02})`;
        tCtx.fill();
      }

      // Text
      if (config.text) {
        tCtx.textAlign = 'center';
        tCtx.textBaseline = 'middle';
        tCtx.font = 'bold 72px "Outfit", "Arial", sans-serif';
        tCtx.fillStyle = config.textColor || '#FFFFFF';
        tCtx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        tCtx.shadowBlur = 15;
        tCtx.fillText(config.text, CANVAS_SIZE / 2, CANVAS_SIZE * 0.4);
      }

      if (template.defaultLayers?.length) {
        await renderDesignLayers(tCtx, {
          layers: template.defaultLayers.map(normalizeTemplateLayer)
        }, {});
      }

      tCtx.restore();
      return thumbCanvas.toDataURL('image/jpeg', 0.7);
    }

    return null;
  }

  /**
   * Export the current canvas as a Blob
   * @param {string} format - 'image/png' or 'image/jpeg'
   * @param {number} quality - JPEG quality (0-1)
   * @returns {Promise<Blob>}
   */
  function exportAsBlob(format = 'image/png', quality = 0.92) {
    return new Promise((resolve) => {
      const { canvas } = getCanvas();
      canvas.toBlob(resolve, format, quality);
    });
  }

  /**
   * Export as Data URL
   * @returns {string}
   */
  function exportAsDataURL() {
    const { canvas } = getCanvas();
    return canvas.toDataURL('image/png');
  }

  return {
    renderPoster,
    createDefaultDesign,
    cloneDesign,
    generateThumbnail,
    exportAsBlob,
    exportAsDataURL,
    drawWatermark,
    drawAnimatedFrame,
    loadImage,
    getLayerBounds,
    getCanvasDimensionsForAspect,
    setCanvasSizeForAspect,
    CANVAS_SIZE
  };
})();
