/// Asset paths for Panchayat Post UI chrome, brand fallback, and empty states.
/// All content images (banners, festivals, templates, frames) are imported dynamically from Admin.
class AppAssets {
  AppAssets._();

  // Brand logo fallbacks (overridden by Admin appBranding.logoUrl when online)
  static const String panchayatLogo = 'assets/images/panchayat_logo.png';
  static const String panchayatLogoOriginal = 'assets/images/panchayat_logo_original.jpg';

  // Welcome & Auth UI illustrations
  static const String welcomeHeroPosters = 'assets/images/welcome_hero_posters.png';
  static const String welcomeVillageFooter = 'assets/images/welcome_village_footer.png';
  static const String villageSilhouette = 'assets/images/welcome_village_footer.png';
  static const String loginHeroLaptop = 'assets/images/login_hero_laptop.png';
  static const String createAccountHero = 'assets/images/create_account_hero.png';
  static const String forgotPasswordHero = 'assets/images/forgot_password_hero.png';
  static const String recoveryStatusHero = 'assets/images/recovery_status_hero.png';
  static const String profileSetupHero = 'assets/images/profile_setup_hero.png';
  static const String onboardingConfirmationHero = 'assets/images/onboarding_confirmation_hero.png';

  // Empty state illustration
  static const String myDesignEmptyBox = 'assets/images/my_design_empty_box.png';

  // Fallbacks for offline mocks and widget test compatibility
  static const String festivalDiwaliDiyas = 'assets/images/panchayat_logo.png';
  static const String homeTemplateDiwali = 'assets/images/panchayat_logo.png';
  static const String myDesignNavratriWishes = 'assets/images/panchayat_logo.png';
  static const String editorCanvasRepublicDay = 'assets/images/panchayat_logo.png';
  static const String myDesignHappyDiwali = 'assets/images/panchayat_logo.png';
  static const String myDesignGramSabha = 'assets/images/panchayat_logo.png';
}
