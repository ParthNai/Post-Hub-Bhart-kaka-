const express = require('express');
const fs = require('fs');
const path = require('path');
const { AppControl, User } = require('../../models');
const uploadPreloaderVideo = require('../../multer/uploadPreloaderVideo');
const uploadAppLogo = require('../../multer/uploadAppLogo');
const uploadHeroImage = require('../../multer/uploadHeroImage');
const verifyToken = require('../../middlewares/verifyToken');

const router = express.Router();

async function requireAdmin(req, res) {
  const user = await User.findById(req.userId).select('role');
  if (!user || !['admin', 'superadmin'].includes(user.role)) {
    res.status(403).json({ status: false, message: 'Admin access required' });
    return false;
  }
  return true;
}

function getHeroImages(homeScreen) {
  const images = Array.isArray(homeScreen?.heroImages)
    ? homeScreen.heroImages.filter((image) => typeof image === 'string' && image.trim())
    : [];
  const rawList = images.length > 0 ? images : homeScreen?.heroImage ? [homeScreen.heroImage] : [];
  return [...new Set(rawList.map((img) => {
    const filename = path.basename(img);
    if (img.includes('homeHero') || filename.startsWith('hero_')) {
      return '/uploaded/image/homeHero/' + filename;
    }
    return img;
  }))];
}

function getHeroImageDiskPath(imageUrl) {
  const relativePath = imageUrl.replace(/^\/+/, '').replace(/\\/g, '/');
  const prefix = 'uploaded/image/homeHero/';
  if (!relativePath.startsWith(prefix)) return null;

  const filename = relativePath.slice(prefix.length);
  if (
    !filename ||
    filename === '.' ||
    filename === '..' ||
    filename !== path.basename(filename) ||
    !/^hero_[a-z0-9_-]+\.(png|jpe?g|webp)$/i.test(filename)
  ) {
    return null;
  }
  return path.join(__dirname, '..', '..', relativePath);
}

function formatAppConfigResponse(config) {
  const plain = config.toObject ? config.toObject() : config;

  const themeColor = plain.globalSettings?.themeColor || '#2563EB';
  const durationSec = plain.preloaderScreen?.durationSeconds || 2.5;
  const durationMs = Math.round(durationSec * 1000);
  const heroTitle = plain.homeScreen?.heroTitle || 'નમસ્તે, સરપંચ શ્રી & ગ્રામજનો! 🙏';
  const heroSubtitle = plain.homeScreen?.heroSubtitle || 'આજના વિશેષ તહેવાર અને પંચાયત પોસ્ટર';
  const noticeText = plain.homeScreen?.noticeBanner?.text || 'Special Diwali & Election Posters Live! 🪔';
  const isHeroVisible = Boolean(plain.homeScreen?.slidersEnabled ?? true);
  let iconUrl = plain.preloaderScreen?.appIcon?.url || '';
  if (iconUrl) {
    iconUrl = iconUrl.replace(/\\/g, '/');
    const filename = path.basename(iconUrl);
    if (iconUrl.includes('appLogo') || filename.startsWith('app_logo_')) {
      iconUrl = '/uploaded/image/appLogo/' + filename;
    }
  }

  const navigation = [
    {
      id: 'scr_splash_001',
      key: 'splash',
      name: 'Splash Preloader',
      description: 'Opening splash screen with video or animated emblem',
      route: '/',
      icon: 'Splash',
      category: 'System',
      status: 'configured',
      version: 1,
      visibilityEnabled: Boolean(plain.preloaderScreen?.enabled ?? true),
      minAppVersion: '1.0.0',
      capabilities: ['dual_arc_loader', 'video_splash', 'brand_logo'],
      layoutConfig: {
        bannerVisible: false,
        activeTheme: plain.globalSettings?.themePreset || 'royal_blue',
        primaryAccent: themeColor,
        cardRadius: '14px',
        sections: []
      }
    },
    {
      id: 'scr_home_001',
      key: 'home',
      name: 'Home',
      description: 'Discover templates, create AI images, and explore festival designs.',
      route: '/home',
      icon: 'Home',
      category: 'Navigation',
      status: 'configured',
      version: 1,
      visibilityEnabled: true,
      minAppVersion: '1.0.0',
      capabilities: ['hero_banner', 'category_rail', 'trending_templates'],
      layoutConfig: {
        bannerVisible: isHeroVisible,
        bannerHeadline: heroTitle,
        bannerSubtitle: heroSubtitle,
        bannerBadge: noticeText,
        headerTitle: 'Panchayat Post',
        activeTheme: plain.globalSettings?.themePreset || 'royal_blue',
        primaryAccent: themeColor,
        cardRadius:
          plain.globalSettings?.borderRadius === 'sharp'
            ? '4px'
            : plain.globalSettings?.borderRadius === 'smooth'
              ? '8px'
              : '14px',
        sections: [
          { id: 'hero', title: 'Hero Banner', enabled: isHeroVisible, order: 1 },
          { id: 'notice', title: 'Notice Marquee', enabled: Boolean(plain.homeScreen?.noticeBanner?.enabled ?? true), order: 2 },
          { id: 'festivals', title: 'Upcoming Festivals', enabled: Boolean(plain.homeScreen?.festivalsEnabled ?? true), order: 3 },
          { id: 'categories', title: 'Category Rail', enabled: Boolean(plain.homeScreen?.categoriesEnabled ?? true), order: 4 },
          { id: 'greetings', title: 'Daily Greetings', enabled: Boolean(plain.homeScreen?.greetingsEnabled ?? true), order: 5 }
        ]
      }
    },
    {
      id: 'scr_festivals_002',
      key: 'festivals',
      name: 'Festivals & Events',
      description: 'Festival posters, upcoming dates, and cultural event designs.',
      route: '/festivals',
      icon: 'Calendar',
      category: 'Content',
      status: 'configured',
      version: 1,
      visibilityEnabled: Boolean(plain.homeScreen?.festivalsEnabled ?? true),
      minAppVersion: '1.0.0',
      capabilities: ['festival_calendar', 'download_poster', 'share_poster'],
      layoutConfig: {
        bannerVisible: true,
        headerTitle: 'Festivals',
        activeTheme: 'default',
        primaryAccent: themeColor,
        cardRadius: '14px',
        sections: []
      }
    },
    {
      id: 'scr_welcome_003',
      key: 'welcome',
      name: 'Welcome & Onboarding',
      description: 'First time user onboarding and introduction screen.',
      route: '/welcome',
      icon: 'Sparkles',
      category: 'Account',
      status: 'configured',
      version: 1,
      visibilityEnabled: true,
      minAppVersion: '1.0.0',
      capabilities: ['welcome_carousel', 'language_select'],
      layoutConfig: {
        bannerVisible: false,
        activeTheme: 'default',
        primaryAccent: themeColor,
        cardRadius: '14px',
        sections: []
      }
    },
    {
      id: 'scr_login_004',
      key: 'login',
      name: 'Login & Authentication',
      description: 'Sign in to continue creating and sharing designs.',
      route: '/login',
      icon: 'User',
      category: 'Account',
      status: 'configured',
      version: 1,
      visibilityEnabled: true,
      minAppVersion: '1.0.0',
      capabilities: ['email_password_auth', 'remember_me', 'password_recovery'],
      layoutConfig: {
        bannerVisible: false,
        activeTheme: 'default',
        primaryAccent: themeColor,
        cardRadius: '14px',
        sections: []
      }
    }
  ];

  const appBranding = {
    appIconUrl: iconUrl,
    logoUrl: iconUrl,
    preset: plain.preloaderScreen?.appIcon?.preset || '🇮🇳',
    shape: plain.preloaderScreen?.appIcon?.shape || 'rounded_square',
    bgColor: plain.preloaderScreen?.appIcon?.bgColor || 'blue',
  };

  const preloader = {
    primaryColor: themeColor,
    secondaryColor: '#FE8706',
    durationMs: durationMs,
    durationSeconds: durationSec,
    mediaType: plain.preloaderScreen?.mediaType || 'animation',
    videoUrl: plain.preloaderScreen?.videoUrl || '',
    videoMuted: Boolean(plain.preloaderScreen?.videoMuted ?? true),
    videoLoop: Boolean(plain.preloaderScreen?.videoLoop ?? true),
    videoFit: plain.preloaderScreen?.videoFit || 'cover',
    skipButtonEnabled: Boolean(plain.preloaderScreen?.skipButtonEnabled ?? true),
    tagline: plain.preloaderScreen?.tagline || 'તમારા ગામનું પોતાનું ડિજિટલ પોસ્ટર',
    logoUrl: iconUrl,
    appIconUrl: iconUrl,
  };

  const themeMode = plain.globalSettings?.themeMode || 'Light';
  const theme = {
    mode: themeMode,
    primaryAccent: themeColor,
    backgroundColor: themeMode.toLowerCase() === 'dark' ? '#10141E' : '#FFFFFF',
    cardRadius:
      plain.globalSettings?.borderRadius === 'sharp'
        ? '4px'
        : plain.globalSettings?.borderRadius === 'smooth'
          ? '8px'
          : '14px',
    headerStyle: plain.globalSettings?.headerStyle || 'gradient',
  };

  const storedHeroImages = getHeroImages(plain.homeScreen || {});
  const heroImage = storedHeroImages[0] || '';
  const heroSection = {
    visible: isHeroVisible,
    enabled: isHeroVisible,
    badge: noticeText,
    headline: heroTitle,
    subtitle: heroSubtitle,
    imageUrl: heroImage,
    images: storedHeroImages,
    slideIntervalSeconds: plain.homeScreen?.sliderSpeed || 4,
  };

  const fullData = {
    ...plain,
    platform: 'Post Hub Mobile Client',
    schemaVersion: '2.1.0',
    publishedAt: plain.updatedAt || new Date().toISOString(),
    appBranding,
    logoUrl: iconUrl,
    appLogoUrl: iconUrl,
    appIconUrl: iconUrl,
    preloader,
    theme,
    heroSection,
    navigation,
    templates: [],
  };

  return {
    status: true,
    success: true,
    ...fullData,
    data: fullData,
    config: fullData,
  };
}

// UPLOAD app logo / icon from device
router.post('/upload-logo', (req, res) => {
  uploadAppLogo.single('logo')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ status: false, message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ status: false, message: 'No logo image file provided' });
    }

    try {
      const normalizedPath = '/uploaded/image/appLogo/' + req.file.filename;

      // Ensure root uploaded directory also receives a copy
      try {
        const rootDir = path.join(__dirname, '..', '..', '..', 'uploaded', 'image', 'appLogo');
        if (!fs.existsSync(rootDir)) {
          fs.mkdirSync(rootDir, { recursive: true });
        }
        fs.copyFileSync(req.file.path, path.join(rootDir, req.file.filename));
      } catch (copyErr) {
        console.warn('Could not mirror app logo to root:', copyErr.message);
      }

      // Also mirror to admin directory so admin portal's logo192, logo512, and logowhite reflect the new logo!
      try {
        const adminDir = path.join(__dirname, '..', '..', '..', 'admin');
        if (fs.existsSync(adminDir)) {
          fs.copyFileSync(req.file.path, path.join(adminDir, 'logo192.png'));
          fs.copyFileSync(req.file.path, path.join(adminDir, 'logo512.png'));
          fs.copyFileSync(req.file.path, path.join(adminDir, 'logowhite.png'));
        }
      } catch (adminCopyErr) {
        console.warn('Could not mirror logo to admin portal:', adminCopyErr.message);
      }

      const config = await AppControl.findOneAndUpdate(
        { key: 'main_config' },
        {
          $set: {
            'preloaderScreen.appIcon.type': 'custom',
            'preloaderScreen.appIcon.url': normalizedPath,
            'globalSettings.appLogo': normalizedPath,
            'homeScreen.logoUrl': normalizedPath,
          },
        },
        { new: true, upsert: true }
      );

      return res.status(200).json({
        status: true,
        message: 'App Logo uploaded successfully!',
        url: normalizedPath,
        data: config,
      });
    } catch (dbErr) {
      return res.status(500).json({ status: false, message: dbErr.message });
    }
  });
});

// UPLOAD home hero announcement image
router.post('/upload-hero-image', verifyToken, async (req, res) => {
  try {
    if (!(await requireAdmin(req, res))) return;

    uploadHeroImage.single('image')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ status: false, message: err.message });
      }
      if (!req.file) {
        return res.status(400).json({ status: false, message: 'No hero image file provided' });
      }

      try {
        const imageUrl = '/uploaded/image/homeHero/' + req.file.filename;
        const config = await AppControl.findOneAndUpdate(
          { key: 'main_config' },
          {
            $set: {
              'homeScreen.heroImage': imageUrl,
              'homeScreen.heroImages': [imageUrl],
              'homeScreen.slidersEnabled': true,
            },
          },
          { new: true, upsert: true }
        );

        return res.status(200).json({
          status: true,
          message: 'Home hero image uploaded successfully!',
          imageUrl,
          images: [imageUrl],
          data: config,
        });
      } catch (dbErr) {
        return res.status(500).json({ status: false, message: dbErr.message });
      }
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
});

router.post('/upload-hero-images', verifyToken, async (req, res) => {
  try {
    if (!(await requireAdmin(req, res))) return;

    uploadHeroImage.array('images', 10)(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ status: false, message: err.message });
      }
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ status: false, message: 'No hero images provided' });
      }

      try {
        const uploadedImages = req.files.map(
          (file) => '/uploaded/image/homeHero/' + file.filename
        );
        const currentConfig = await AppControl.findOne({ key: 'main_config' });
        const currentImages = getHeroImages(currentConfig?.homeScreen || {});
        const images = [...new Set([...currentImages, ...uploadedImages])];
        const config = await AppControl.findOneAndUpdate(
          { key: 'main_config' },
          {
            $set: {
              'homeScreen.heroImage': images[0] || '',
              'homeScreen.heroImages': images,
              'homeScreen.slidersEnabled': true,
            },
          },
          { new: true, upsert: true }
        );

        return res.status(200).json({
          status: true,
          message: 'Home hero images uploaded successfully!',
          images,
          addedImages: uploadedImages,
          data: formatAppConfigResponse(config),
        });
      } catch (dbErr) {
        return res.status(500).json({ status: false, message: dbErr.message });
      }
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
});

router.delete('/hero-image', verifyToken, async (req, res) => {
  try {
    if (!(await requireAdmin(req, res))) return;

    const imageUrl = req.body?.imageUrl;
    if (typeof imageUrl !== 'string' || !imageUrl.trim()) {
      return res.status(400).json({ status: false, message: 'Hero image URL is required' });
    }

    const config = await AppControl.findOne({ key: 'main_config' });
    if (!config) {
      return res.status(404).json({ status: false, message: 'App configuration not found' });
    }

    const currentImages = getHeroImages(config.homeScreen || {});
    if (!currentImages.includes(imageUrl)) {
      return res.status(404).json({ status: false, message: 'Hero image not found' });
    }

    const imagePath = getHeroImageDiskPath(imageUrl);
    if (!imagePath) {
      return res.status(400).json({ status: false, message: 'Invalid hero image path' });
    }

    const images = currentImages.filter((image) => image !== imageUrl);
    const updatedConfig = await AppControl.findOneAndUpdate(
      { key: 'main_config' },
      {
        $set: {
          'homeScreen.heroImage': images[0] || '',
          'homeScreen.heroImages': images,
          'homeScreen.slidersEnabled': images.length > 0,
        },
      },
      { new: true }
    );

    try {
      await fs.promises.unlink(imagePath);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        return res.status(500).json({ status: false, message: error.message });
      }
    }

    return res.status(200).json({
      status: true,
      message: 'Hero image removed successfully!',
      images,
      data: formatAppConfigResponse(updatedConfig),
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
});

// UPLOAD preloader video
router.post('/upload-video', (req, res) => {
  uploadPreloaderVideo.single('video')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ status: false, message: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ status: false, message: 'No video file provided' });
    }

    try {
      const normalizedPath = '/' + req.file.path.replace(/\\/g, '/');
      const config = await AppControl.findOneAndUpdate(
        { key: 'main_config' },
        {
          $set: {
            'preloaderScreen.mediaType': 'video',
            'preloaderScreen.videoUrl': normalizedPath,
          },
        },
        { new: true, upsert: true }
      );

      return res.status(200).json({
        status: true,
        message: 'Preloader video uploaded successfully!',
        videoUrl: normalizedPath,
        data: config,
      });
    } catch (dbErr) {
      return res.status(500).json({ status: false, message: dbErr.message });
    }
  });
});

// GET active app control configuration
router.get('/', async (req, res) => {
  try {
    let config = await AppControl.findOne({ key: 'main_config' });
    if (!config) {
      config = await AppControl.create({ key: 'main_config' });
    }
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    return res.status(200).json(formatAppConfigResponse(config));
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
});

// Also support direct /config subpath
router.get('/config', async (req, res) => {
  try {
    let config = await AppControl.findOne({ key: 'main_config' });
    if (!config) {
      config = await AppControl.create({ key: 'main_config' });
    }
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    return res.status(200).json(formatAppConfigResponse(config));
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
});

// UPDATE app control configuration
router.post('/', async (req, res) => {
  try {
    const updateData = req.body || {};
    delete updateData._id;
    delete updateData.key;

    const config = await AppControl.findOneAndUpdate(
      { key: 'main_config' },
      { $set: updateData },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      status: true,
      message: 'App screen configuration updated successfully!',
      data: formatAppConfigResponse(config),
    });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
});

// RESET to defaults
router.post('/reset', async (req, res) => {
  try {
    await AppControl.deleteOne({ key: 'main_config' });
    const config = await AppControl.create({ key: 'main_config' });
    return res.status(200).json({
      status: true,
      message: 'Configuration reset to defaults!',
      data: formatAppConfigResponse(config),
    });
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
});

module.exports = router;
