/* ============================================
   PosterBanao - Capacitor Native Bridge
   Android save/share support for wrapped builds
   ============================================ */

const NativeBridge = (() => {
  function capacitor() {
    return window.Capacitor || null;
  }

  function plugins() {
    return capacitor()?.Plugins || {};
  }

  function isAvailable() {
    return Boolean(
      capacitor()?.isNativePlatform?.() &&
      plugins().Filesystem &&
      plugins().Share
    );
  }

  const safeFilePart = PBUtils.safeFilePart;

  function safeFilename(value, fallback = 'poster') {
    const raw = (value || fallback).toString().trim() || fallback;
    const normalized = raw.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
    const parts = normalized.split('.');
    const extension = parts.length > 1
      ? parts.pop().replace(/[^a-zA-Z0-9]+/g, '').substring(0, 8).toLowerCase()
      : '';
    const base = (parts.join('.') || fallback)
      .replace(/[\\/:*?"<>|]+/g, '_')
      .replace(/[^a-zA-Z0-9._ -]+/g, '_')
      .replace(/\s+/g, '_')
      .replace(/_+/g, '_')
      .replace(/^[._ -]+|[._ -]+$/g, '')
      .substring(0, 72) || fallback;

    return extension ? `${base}.${extension}` : base;
  }

  function filenameFor(templateId, shopName) {
    const template = TemplateRegistry.getById(templateId);
    const templateName = safeFilePart(template?.name, templateId || 'poster');
    const businessName = safeFilePart(shopName, 'business');
    return `${templateName}_${businessName}.png`;
  }

  async function writeCurrentCanvas({ directory, path }) {
    const { Filesystem } = plugins();
    const dataUrl = CanvasEngine.exportAsDataURL();
    const base64Data = dataUrl.split(',')[1];

    await Filesystem.writeFile({
      path,
      data: base64Data,
      directory,
      recursive: true
    });

    return Filesystem.getUri({ path, directory });
  }

  function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result || '';
        resolve(result.toString().split(',')[1] || '');
      };
      reader.onerror = () => reject(new Error('Failed to read video file'));
      reader.readAsDataURL(blob);
    });
  }

  async function writeBlob({ blob, directory, path }) {
    const { Filesystem } = plugins();
    const base64Data = await blobToBase64(blob);

    await Filesystem.writeFile({
      path,
      data: base64Data,
      directory,
      recursive: true
    });

    return Filesystem.getUri({ path, directory });
  }

  async function downloadPoster(templateId, shopName, withWatermark = true, design = null) {
    if (!isAvailable()) return false;

    const profile = ProfileManager.getProfile();
    if (!profile) return false;

    await CanvasEngine.renderPoster(templateId, profile, { withWatermark, design });

    const filename = filenameFor(templateId, shopName);
    await writeCurrentCanvas({
      directory: 'DOCUMENTS',
      path: `PosterBanao/${filename}`
    });

    return true;
  }

  async function sharePoster(templateId, design = null) {
    if (!isAvailable()) return false;

    const profile = ProfileManager.getProfile();
    if (!profile) return false;

    const template = TemplateRegistry.getById(templateId);
    const isUnlocked = DownloadManager.isUnlocked(templateId);
    await CanvasEngine.renderPoster(templateId, profile, {
      withWatermark: !isUnlocked,
      design
    });

    const filename = `share_${Date.now()}_${filenameFor(templateId, profile.shopName)}`;
    const file = await writeCurrentCanvas({
      directory: 'CACHE',
      path: filename
    });

    await plugins().Share.share({
      title: `${template?.name || 'Poster'} - ${profile.shopName}`,
      text: `Greetings from ${profile.shopName}!`,
      files: [file.uri],
      dialogTitle: 'Share poster'
    });

    return true;
  }

  async function saveBlob(blob, filename, options = {}) {
    if (!isAvailable() || !blob) return false;

    const directory = options.directory || 'DOCUMENTS';
    const folder = (options.folder || 'PosterBanao')
      .toString()
      .replace(/[\\:*?"<>|]+/g, '_')
      .replace(/^\/+|\/+$/g, '') || 'PosterBanao';
    const path = options.path || `${folder}/${safeFilename(filename, `poster_${Date.now()}`)}`;

    await writeBlob({
      blob,
      directory,
      path
    });

    return true;
  }

  async function shareBlob(blob, filename, options = {}) {
    if (!isAvailable()) return false;

    const safeName = safeFilename(filename, `invite_${Date.now()}`);
    const path = `share_${Date.now()}_${safeName}`;
    const file = await writeBlob({
      blob,
      directory: 'CACHE',
      path
    });

    await plugins().Share.share({
      title: options.title || 'PosterBanao invite',
      text: options.text || '',
      files: [file.uri],
      dialogTitle: options.dialogTitle || 'Share invite'
    });

    return true;
  }

  return {
    isAvailable,
    downloadPoster,
    sharePoster,
    saveBlob,
    shareBlob
  };
})();

window.NativeBridge = NativeBridge;
