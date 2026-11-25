const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const appControlSchema = mongoose.Schema(
  {
    key: {
      type: String,
      default: 'main_config',
      unique: true,
    },
    preloaderScreen: {
      enabled: { type: Boolean, default: true },
      durationSeconds: { type: Number, default: 2.5 },
      animationStyle: { type: String, default: 'pulse_logo' },
      tagline: { type: String, default: 'તમારા ગામનું પોતાનું ડિજિટલ પોસ્ટર' },
      bgGradient: { type: String, default: 'gradient_blue' },
      showVersion: { type: Boolean, default: true },
      soundEffect: { type: Boolean, default: false },
      mediaType: { type: String, default: 'animation' }, // 'animation' | 'video'
      videoUrl: { type: String, default: '' },
      videoMuted: { type: Boolean, default: true },
      videoLoop: { type: Boolean, default: true },
      videoFit: { type: String, default: 'cover' }, // 'cover' | 'contain'
      skipButtonEnabled: { type: Boolean, default: true },
      appIcon: {
        type: { type: String, default: 'preset' },
        preset: { type: String, default: '🇮🇳' },
        url: { type: String, default: '' },
        shape: { type: String, default: 'rounded_square' },
        bgColor: { type: String, default: 'blue' },
      },
    },
    homeScreen: {
      slidersEnabled: { type: Boolean, default: true },
      festivalsEnabled: { type: Boolean, default: true },
      greetingsEnabled: { type: Boolean, default: true },
      electionEnabled: { type: Boolean, default: true },
      categoriesEnabled: { type: Boolean, default: true },
      heroTitle: { type: String, default: 'નમસ્તે, સરપંચ શ્રી & ગ્રામજનો! 🙏' },
      heroSubtitle: { type: String, default: 'આજના વિશેષ તહેવાર અને પંચાયત પોસ્ટર' },
      heroImage: { type: String, default: '' },
      heroImages: { type: [String], default: [] },
      sliderSpeed: { type: Number, default: 4 },
      noticeBanner: {
        enabled: { type: Boolean, default: true },
        text: { type: String, default: 'Welcome to PanchayatPost! Daily festival & election posters are live.' },
        bgColor: { type: String, default: '#2563EB' },
      },
      sectionOrder: {
        type: [String],
        default: ['notice', 'sliders', 'festivals', 'greetings', 'categories'],
      },
    },
    festivalScreen: {
      autoFeatureToday: { type: Boolean, default: true },
      dateRangeDays: { type: Number, default: 30 },
      watermarkEnabled: { type: Boolean, default: false },
      vipBadgeEnabled: { type: Boolean, default: true },
      categoryFilter: { type: String, default: 'all' },
    },
    greetingsScreen: {
      morningEnabled: { type: Boolean, default: true },
      nightEnabled: { type: Boolean, default: true },
      languages: { type: [String], default: ['gujarati', 'hindi', 'english'] },
      featuredCategory: { type: String, default: 'Good Morning' },
    },
    categoryScreen: {
      showGramPanchayat: { type: Boolean, default: true },
      showFarmer: { type: Boolean, default: true },
      showBusiness: { type: Boolean, default: true },
      gridColumns: { type: Number, default: 2 },
    },
    editorScreen: {
      framesEnabled: { type: Boolean, default: true },
      showUserPhoto: { type: Boolean, default: true },
      showContact: { type: Boolean, default: true },
      photoPosition: { type: String, default: 'left' },
      maxLogoSizeMb: { type: Number, default: 5 },
    },
    globalSettings: {
      maintenanceMode: { type: Boolean, default: false },
      maintenanceMessage: { type: String, default: 'App is temporarily under maintenance for upgrades. Please check back in a few minutes!' },
      minVersion: { type: String, default: '2.4.0' },
      forceUpdate: { type: Boolean, default: false },
      updateUrl: { type: String, default: 'https://play.google.com/store/apps/details?id=com.panchayatpost.app' },
      themeColor: { type: String, default: '#2563EB' },
      themePreset: { type: String, default: 'royal_blue' },
      themeMode: { type: String, default: 'Light' },
      headerStyle: { type: String, default: 'gradient' },
      borderRadius: { type: String, default: 'rounded' },
    },
  },
  {
    timestamps: true,
  }
);

appControlSchema.plugin(toJSON);

const AppControl = mongoose.model('AppControl', appControlSchema);

module.exports = AppControl;
