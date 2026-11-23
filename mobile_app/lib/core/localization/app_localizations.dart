/// Supported language definitions and localized strings for Panchayat Post.
class AppStrings {
  AppStrings({
    required this.languageName,
    required this.headingPart1,
    required this.headingPart2Prefix,
    required this.headingHighlight,
    required this.headingPart2Suffix,
    required this.subtitle,
    required this.primaryButton,
    required this.secondaryButtonPrefix,
    required this.secondaryButtonAction,
    required this.privacyPolicy,
    required this.termsAndConditions,
    required this.selectLanguageTitle,
    required this.createAccountTitle,
    required this.loginTitle,
    // Screen 03: Create Account strings
    required this.createAccountHeading,
    required this.createAccountSubheading,
    required this.fullNameLabel,
    required this.fullNameHint,
    required this.fullNameRequiredError,
    required this.usernameLabel,
    required this.usernameHint,
    required this.usernameHelper,
    required this.usernameLengthError,
    required this.usernameInvalidFormatError,
    required this.usernameTakenError,
    required this.usernameAvailable,
    required this.passwordLabel,
    required this.passwordHint,
    required this.confirmPasswordLabel,
    required this.confirmPasswordHint,
    required this.passwordInstructionsTitle,
    required this.passwordRuleMinChars,
    required this.passwordRuleCase,
    required this.passwordRuleNumber,
    required this.passwordMismatchError,
    required this.passwordWeakError,
    required this.termsAcceptPrefix,
    required this.termsAndText,
    required this.termsAcceptSuffix,
    required this.termsRequiredError,
    required this.createAccountButton,
    required this.alreadyHaveAccount,
    required this.loginAction,
    required this.registrationSuccess,
    required this.networkOrServerError,
    // Screen 04: Login strings
    required this.loginHeading,
    required this.loginSubheading,
    required this.loginUsernameLabel,
    required this.loginUsernameHint,
    required this.loginUsernameRequiredError,
    required this.loginPasswordLabel,
    required this.loginPasswordHint,
    required this.loginPasswordRequiredError,
    required this.rememberMeLabel,
    required this.forgotPasswordLabel,
    required this.forgotPasswordTitle,
    required this.forgotPasswordMessage,
    required this.loginButtonLabel,
    required this.noAccountPrompt,
    required this.createAccountAction,
    required this.loginSuccessMessage,
    required this.accountNotFoundError,
    required this.invalidPasswordError,
    // Screen 05: Forgot Password / Account Recovery strings
    required this.forgotPasswordHeading,
    required this.forgotPasswordSubheading,
    required this.recoveryUsernameLabel,
    required this.recoveryUsernameHint,
    required this.recoveryUsernameHelper,
    required this.recoveryUsernameRequired,
    required this.recoveryInfoBanner,
    required this.sendRecoveryButton,
    required this.needMoreHelpDivider,
    required this.contactSupportAction,
    required this.backToLoginButton,
    required this.recoveryRequestSubmitted,
    required this.recoveryReferenceNumber,
    required this.recoveryInstructions,
    required this.rateLimitError,
    required this.supportContactDetailsTitle,
    required this.supportContactDetailsBody,
    // Screen 06: Account Recovery Status strings
    required this.recoveryStatusHeading,
    required this.recoveryStatusSubheading,
    required this.requestIdLabel,
    required this.usernameRowLabel,
    required this.submittedDateLabel,
    required this.currentStatusLabel,
    required this.statusSubmitted,
    required this.statusUnderReview,
    required this.statusAdditionalInfoRequired,
    required this.statusResolved,
    required this.statusRejected,
    required this.timelineStep1Title,
    required this.timelineStep1Subtitle,
    required this.timelineStep2Title,
    required this.timelineStep2Subtitle,
    required this.timelineStep3Title,
    required this.timelineStep3Subtitle,
    required this.recoveryNoticeBanner,
    required this.contactSupportButton,
    required this.goToLoginScreenButton,
    required this.refreshStatusTooltip,
    required this.lastUpdatedLabel,
    // Screen 07: User Profile Setup strings
    required this.profileSetupHeaderStep,
    required this.profileSetupHeading,
    required this.profileSetupSubheading,
    required this.addPhotoAction,
    required this.changePhotoAction,
    required this.removePhotoAction,
    required this.takePhotoFromCamera,
    required this.chooseFromGallery,
    required this.orDivider,
    required this.fullNameFieldLabel,
    required this.fullNameFieldHint,
    required this.displayNameFieldLabel,
    required this.displayNameFieldHint,
    required this.displayNameHelper,
    required this.villageCityFieldLabel,
    required this.villageCityFieldHint,
    required this.stateFieldLabel,
    required this.stateFieldHint,
    required this.searchStateHint,
    required this.selectStateTitle,
    required this.profileInfoBanner,
    required this.saveProfileButton,
    required this.skipForNowButton,
    required this.profileSavedSuccess,
    required this.photoPermissionDenied,
    required this.photoSizeTooLargeError,
    required this.unsupportedImageFormatError,
    required this.displayNameRequiredError,
    // Screen 08: Onboarding Confirmation strings
    required this.confirmationHeading,
    required this.confirmationSubtitleComplete,
    required this.confirmationSubtitleIncomplete,
    required this.confirmationBodyText,
    required this.profileStatusCompletedBadge,
    required this.profileStatusPendingBadge,
    required this.noVillageProvided,
    required this.featuresSectionTitle,
    required this.readyTemplatesTitle,
    required this.readyTemplatesDesc,
    required this.aiPosterCreationTitle,
    required this.aiPosterCreationDesc,
    required this.easyEditingTitle,
    required this.easyEditingDesc,
    required this.letsStartButton,
    required this.bottomTagline,
    // Home Dashboard strings
    required this.homeHeaderTitle,
    required this.greetingPrefix,
    required this.editProfileButton,
    required this.posterTemplatesTitle,
    required this.createWithAiTitle,
    required this.createWithAiDesc,
    required this.browseTemplatesAction,
    required this.screenNavigatorTitle,
    required this.screenNavigatorDesc,
    required this.logoutDialogTitle,
    required this.logoutDialogMessage,
    required this.logoutConfirmButton,
    required this.cancelButton,
    required this.categoriesTitle,
    required this.categoryMeeting,
    required this.categoryDevelopment,
    required this.categoryFestivals,
    required this.categoryNational,
    // Screen 09: Main Home Dashboard strings
    required this.goodMorningGreeting,
    required this.welcomeUserPrefix,
    required this.heroBannerCreate,
    required this.heroBannerFestival,
    required this.heroBannerSubtitle,
    required this.heroBannerButton,
    required this.createSomethingNewTitle,
    required this.cardFestivalPosters,
    required this.cardPanchayatPosts,
    required this.cardAiPoster,
    required this.popularTemplatesTitle,
    required this.seeAllAction,
    required this.upcomingFestivalsTitle,
    required this.festivalNavratri,
    required this.festivalDiwali,
    required this.festivalBhaiBeej,
    required this.navratriDate,
    required this.diwaliDate,
    required this.bhaiBeejDate,
    required this.navHome,
    required this.navFestivals,
    required this.navTemplates,
    required this.navMyDesigns,
    required this.navProfile,
    required this.notificationsTitle,
    required this.noNewNotifications,
    // Screen 10: Festival & Upcoming Events listing strings
    required this.festivalsPageTitle,
    required this.festivalsPageSubtitle,
    required this.searchFestivalsHint,
    required this.upcomingFestivalBadge,
    required this.navratriCelebrationTitle,
    required this.navratriCelebrationScript,
    required this.exploreFestiveDesignsSubtitle,
    required this.viewDesignsButton,
    required this.exploreCategoriesTitle,
    required this.categoryAll,
    required this.categoryHinduFestivals,
    required this.categoryNationalDays,
    required this.categoryReligiousEvents,
    required this.categoryCulturalEvents,
    required this.upcomingFestivalsHeader,
    required this.viewCalendarAction,
    required this.exploreAllFestivalsTitle,
    required this.upcomingStatusBadge,
    required this.noFestivalsFound,
    required this.clearSearchAction,
    required this.filterTitle,
    required this.filterAllOption,
    required this.filterUpcomingOnly,
    // Screen 11: Festival Details & Poster Collection strings
    required this.festivalDetailsTitle,
    required this.breadcrumbFestivals,
    required this.breadcrumbFestivalDetails,
    required this.celebrateGarbaSubtitle,
    required this.shareFestivalButton,
    required this.aboutThisFestivalHeader,
    required this.aboutFestivalDesc,
    required this.festivalCategoryLabel,
    required this.festivalDateLabel,
    required this.celebrationTypeLabel,
    required this.categoryCulturalValue,
    required this.celebrationTypeValue,
    required this.createFestivalPostsTitle,
    required this.createFestivalPostsSubtitle,
    required this.popularDesignStylesTitle,
    required this.styleTraditionalLabel,
    required this.styleModernLabel,
    required this.styleDevotionalLabel,
    required this.styleEventAnnouncementLabel,
    required this.createYourOwnTitle,
    required this.createYourOwnSubtitle,
    required this.startNowButton,
    // Screen 12: Poster Template Editor & Customization Studio strings
    required this.editYourPosterTitle,
    required this.editingModeBadge,
    required this.customizeYourDesignTitle,
    required this.toolEditText,
    required this.toolReplaceImage,
    required this.toolChangeColor,
    required this.toolPosition,
    required this.toolDuplicate,
    required this.tabText,
    required this.tabImages,
    required this.tabColors,
    required this.tabBackground,
    required this.tabFonts,
    required this.headlineTextLabel,
    required this.supportingTextLabel,
    required this.fontStyleLabel,
    required this.textAlignmentLabel,
    required this.textColorLabel,
    required this.previewPosterButton,
    required this.saveDesignButton,
    required this.allChangesSavedLabel,
    required this.designSavedSuccess,
    // Screen 13
    required this.yourPosterTitle,
    required this.yourDesignIsReady,
    required this.posterCreatedSuccessfully,
    required this.readyToDownloadAndShare,
    required this.customDesignBadge,
    required this.previewAction,
    required this.editAction,
    required this.duplicateAction,
    required this.moreAction,
    required this.downloadYourPosterTitle,
    required this.highQualityOption,
    required this.downloadPosterButton,
    required this.shareYourCreationTitle,
    required this.whatsAppAction,
    required this.instagramAction,
    required this.shareMoreAction,
    required this.savedInMyDesignsBadge,
    required this.sharePosterButton,
    required this.duplicateCreatedSuccess,
    // Screen 14
    required this.myDesignsTitle,
    required this.myDesignsSubtitle,
    required this.totalDesignsLabel,
    required this.recentlyCreatedLabel,
    required this.favoritesLabel,
    required this.searchYourDesignsHint,
    required this.categoryAllDesigns,
    required this.categoryPanchayat,
    required this.categoryBusiness,
    required this.yourCreationsTitle,
    required this.editDesignMenu,
    required this.previewMenu,
    required this.duplicateMenu,
    required this.downloadMenu,
    required this.shareMenu,
    required this.deleteMenu,
    required this.deleteConfirmTitle,
    required this.deleteConfirmMessage,
    required this.confirmDeleteAction,
    required this.cancelAction,
    required this.noDesignsYetTitle,
    required this.noDesignsYetSubtitle,
    required this.createFirstPosterButton,
    // Screen 15: Profile
    required this.profileTitle,
    required this.profileSubtitle,
    required this.verifiedAccountBadge,
    required this.personalInfoTitle,
    required this.mobileNumberLabel,
    required this.emailAddressLabel,
    required this.villageCityLabel,
    required this.districtLabel,
    required this.preferencesTitle,
    required this.appLanguageLabel,
    required this.notificationPrefLabel,
    required this.themePrefLabel,
    required this.lightThemeOption,
    required this.accountSupportTitle,
    required this.accountSecurityLabel,
    required this.helpSupportLabel,
    required this.aboutPanchayatPostLabel,
    required this.privacyPolicyLabel,
    required this.termsConditionsLabel,
    required this.logoutAction,
    required this.logoutConfirmTitle,
    required this.logoutConfirmMessage,
    // Screen 16: Settings & Preferences
    required this.settingsTitle,
    required this.settingsSubtitle,
    required this.accountPreferencesTitle,
    required this.personalInfoSettingsTitle,
    required this.personalInfoSettingsSubtitle,
    required this.changePasswordTitle,
    required this.changePasswordSubtitle,
    required this.mobileEmailTitle,
    required this.mobileEmailSubtitle,
    required this.languagePrefTitle,
    required this.languagePrefSubtitle,
    required this.notificationPrefSettingsTitle,
    required this.notificationPrefSettingsSubtitle,
    required this.appPreferencesTitle,
    required this.appLanguageSettingsTitle,
    required this.appLanguageSettingsSubtitle,
    required this.defaultPosterLanguageTitle,
    required this.defaultPosterLanguageSubtitle,
    required this.notificationSettingsTitle,
    required this.notificationSettingsSubtitle,
    required this.festivalRemindersTitle,
    required this.festivalRemindersSubtitle,
    required this.appThemeTitle,
    required this.appThemeSubtitle,
    required this.privacySecurityTitle,
    required this.privacySettingsTitle,
    required this.privacySettingsSubtitle,
    required this.privacySettingsContent,
    required this.accountSecuritySettingsTitle,
    required this.accountSecuritySettingsSubtitle,
    required this.accountSecuritySettingsContent,
    required this.activeSessionsTitle,
    required this.activeSessionsSubtitle,
    required this.activeSessionsContent,
    required this.dataPermissionsTitle,
    required this.dataPermissionsSubtitle,
    required this.dataPermissionsContent,
    required this.supportTitle,
    required this.helpSupportSettingsTitle,
    required this.helpSupportSettingsSubtitle,
    required this.helpSupportSettingsContent,
    required this.faqTitle,
    required this.faqSubtitle,
    required this.faqContent,
    required this.contactUsTitle,
    required this.contactUsSubtitle,
    required this.contactUsContent,
    required this.aboutAppTitle,
    required this.aboutAppSubtitle,
    required this.aboutAppContent,
    required this.accountActionsTitle,
    required this.logoutSettingsSubtitle,
    required this.deleteAccountTitle,
    required this.deleteAccountSubtitle,
    required this.deleteAccountMessage,
    required this.deleteAccountAction,
  });

  final String languageName;
  final String headingPart1;
  final String headingPart2Prefix;
  final String headingHighlight;
  final String headingPart2Suffix;
  final String subtitle;
  final String primaryButton;
  final String secondaryButtonPrefix;
  final String secondaryButtonAction;
  final String privacyPolicy;
  final String termsAndConditions;
  final String selectLanguageTitle;
  final String createAccountTitle;
  final String loginTitle;

  // Screen 03 Strings
  final String createAccountHeading;
  final String createAccountSubheading;
  final String fullNameLabel;
  final String fullNameHint;
  final String fullNameRequiredError;
  final String usernameLabel;
  final String usernameHint;
  final String usernameHelper;
  final String usernameLengthError;
  final String usernameInvalidFormatError;
  final String usernameTakenError;
  final String usernameAvailable;
  final String passwordLabel;
  final String passwordHint;
  final String confirmPasswordLabel;
  final String confirmPasswordHint;
  final String passwordInstructionsTitle;
  final String passwordRuleMinChars;
  final String passwordRuleCase;
  final String passwordRuleNumber;
  final String passwordMismatchError;
  final String passwordWeakError;
  final String termsAcceptPrefix;
  final String termsAndText;
  final String termsAcceptSuffix;
  final String termsRequiredError;
  final String createAccountButton;
  final String alreadyHaveAccount;
  final String loginAction;
  final String registrationSuccess;
  final String networkOrServerError;

  // Screen 04 Strings
  final String loginHeading;
  final String loginSubheading;
  final String loginUsernameLabel;
  final String loginUsernameHint;
  final String loginUsernameRequiredError;
  final String loginPasswordLabel;
  final String loginPasswordHint;
  final String loginPasswordRequiredError;
  final String rememberMeLabel;
  final String forgotPasswordLabel;
  final String forgotPasswordTitle;
  final String forgotPasswordMessage;
  final String loginButtonLabel;
  final String noAccountPrompt;
  final String createAccountAction;
  final String loginSuccessMessage;
  final String accountNotFoundError;
  final String invalidPasswordError;

  // Screen 05 Strings
  final String forgotPasswordHeading;
  final String forgotPasswordSubheading;
  final String recoveryUsernameLabel;
  final String recoveryUsernameHint;
  final String recoveryUsernameHelper;
  final String recoveryUsernameRequired;
  final String recoveryInfoBanner;
  final String sendRecoveryButton;
  final String needMoreHelpDivider;
  final String contactSupportAction;
  final String backToLoginButton;
  final String recoveryRequestSubmitted;
  final String recoveryReferenceNumber;
  final String recoveryInstructions;
  final String rateLimitError;
  final String supportContactDetailsTitle;
  final String supportContactDetailsBody;

  // Screen 06 Strings
  final String recoveryStatusHeading;
  final String recoveryStatusSubheading;
  final String requestIdLabel;
  final String usernameRowLabel;
  final String submittedDateLabel;
  final String currentStatusLabel;
  final String statusSubmitted;
  final String statusUnderReview;
  final String statusAdditionalInfoRequired;
  final String statusResolved;
  final String statusRejected;
  final String timelineStep1Title;
  final String timelineStep1Subtitle;
  final String timelineStep2Title;
  final String timelineStep2Subtitle;
  final String timelineStep3Title;
  final String timelineStep3Subtitle;
  final String recoveryNoticeBanner;
  final String contactSupportButton;
  final String goToLoginScreenButton;
  final String refreshStatusTooltip;
  final String lastUpdatedLabel;

  // Screen 07 Strings
  final String profileSetupHeaderStep;
  final String profileSetupHeading;
  final String profileSetupSubheading;
  final String addPhotoAction;
  final String changePhotoAction;
  final String removePhotoAction;
  final String takePhotoFromCamera;
  final String chooseFromGallery;
  final String orDivider;
  final String fullNameFieldLabel;
  final String fullNameFieldHint;
  final String displayNameFieldLabel;
  final String displayNameFieldHint;
  final String displayNameHelper;
  final String villageCityFieldLabel;
  final String villageCityFieldHint;
  final String stateFieldLabel;
  final String stateFieldHint;
  final String searchStateHint;
  final String selectStateTitle;
  final String profileInfoBanner;
  final String saveProfileButton;
  final String skipForNowButton;
  final String profileSavedSuccess;
  final String photoPermissionDenied;
  final String photoSizeTooLargeError;
  final String unsupportedImageFormatError;
  final String displayNameRequiredError;

  // Screen 08 Strings
  final String confirmationHeading;
  final String confirmationSubtitleComplete;
  final String confirmationSubtitleIncomplete;
  final String confirmationBodyText;
  final String profileStatusCompletedBadge;
  final String profileStatusPendingBadge;
  final String noVillageProvided;
  final String featuresSectionTitle;
  final String readyTemplatesTitle;
  final String readyTemplatesDesc;
  final String aiPosterCreationTitle;
  final String aiPosterCreationDesc;
  final String easyEditingTitle;
  final String easyEditingDesc;
  final String letsStartButton;
  final String bottomTagline;

  // Home Dashboard Strings
  final String homeHeaderTitle;
  final String greetingPrefix;
  final String editProfileButton;
  final String posterTemplatesTitle;
  final String createWithAiTitle;
  final String createWithAiDesc;
  final String browseTemplatesAction;
  final String screenNavigatorTitle;
  final String screenNavigatorDesc;
  final String logoutDialogTitle;
  final String logoutDialogMessage;
  final String logoutConfirmButton;
  final String cancelButton;
  final String categoriesTitle;
  final String categoryMeeting;
  final String categoryDevelopment;
  final String categoryFestivals;
  final String categoryNational;

  // Screen 09 Strings
  final String goodMorningGreeting;
  final String welcomeUserPrefix;
  final String heroBannerCreate;
  final String heroBannerFestival;
  final String heroBannerSubtitle;
  final String heroBannerButton;
  final String createSomethingNewTitle;
  final String cardFestivalPosters;
  final String cardPanchayatPosts;
  final String cardAiPoster;
  final String popularTemplatesTitle;
  final String seeAllAction;
  final String upcomingFestivalsTitle;
  final String festivalNavratri;
  final String festivalDiwali;
  final String festivalBhaiBeej;
  final String navratriDate;
  final String diwaliDate;
  final String bhaiBeejDate;
  final String navHome;
  final String navFestivals;
  final String navTemplates;
  final String navMyDesigns;
  final String navProfile;
  final String notificationsTitle;
  final String noNewNotifications;
  // Screen 10 Strings
  final String festivalsPageTitle;
  final String festivalsPageSubtitle;
  final String searchFestivalsHint;
  final String upcomingFestivalBadge;
  final String navratriCelebrationTitle;
  final String navratriCelebrationScript;
  final String exploreFestiveDesignsSubtitle;
  final String viewDesignsButton;
  final String exploreCategoriesTitle;
  final String categoryAll;
  final String categoryHinduFestivals;
  final String categoryNationalDays;
  final String categoryReligiousEvents;
  final String categoryCulturalEvents;
  final String upcomingFestivalsHeader;
  final String viewCalendarAction;
  final String exploreAllFestivalsTitle;
  final String upcomingStatusBadge;
  final String noFestivalsFound;
  final String clearSearchAction;
  final String filterTitle;
  final String filterAllOption;
  final String filterUpcomingOnly;
  // Screen 11 Strings
  final String festivalDetailsTitle;
  final String breadcrumbFestivals;
  final String breadcrumbFestivalDetails;
  final String celebrateGarbaSubtitle;
  final String shareFestivalButton;
  final String aboutThisFestivalHeader;
  final String aboutFestivalDesc;
  final String festivalCategoryLabel;
  final String festivalDateLabel;
  final String celebrationTypeLabel;
  final String categoryCulturalValue;
  final String celebrationTypeValue;
  final String createFestivalPostsTitle;
  final String createFestivalPostsSubtitle;
  final String popularDesignStylesTitle;
  final String styleTraditionalLabel;
  final String styleModernLabel;
  final String styleDevotionalLabel;
  final String styleEventAnnouncementLabel;
  final String createYourOwnTitle;
  final String createYourOwnSubtitle;
  final String startNowButton;
  // Screen 12 Strings
  final String editYourPosterTitle;
  final String editingModeBadge;
  final String customizeYourDesignTitle;
  final String toolEditText;
  final String toolReplaceImage;
  final String toolChangeColor;
  final String toolPosition;
  final String toolDuplicate;
  final String tabText;
  final String tabImages;
  final String tabColors;
  final String tabBackground;
  final String tabFonts;
  final String headlineTextLabel;
  final String supportingTextLabel;
  final String fontStyleLabel;
  final String textAlignmentLabel;
  final String textColorLabel;
  final String previewPosterButton;
  final String saveDesignButton;
  final String allChangesSavedLabel;
  final String designSavedSuccess;
  // Screen 13 Strings
  final String yourPosterTitle;
  final String yourDesignIsReady;
  final String posterCreatedSuccessfully;
  final String readyToDownloadAndShare;
  final String customDesignBadge;
  final String previewAction;
  final String editAction;
  final String duplicateAction;
  final String moreAction;
  final String downloadYourPosterTitle;
  final String highQualityOption;
  final String downloadPosterButton;
  final String shareYourCreationTitle;
  final String whatsAppAction;
  final String instagramAction;
  final String shareMoreAction;
  final String savedInMyDesignsBadge;
  final String sharePosterButton;
  final String duplicateCreatedSuccess;
  // Screen 14 Strings
  final String myDesignsTitle;
  final String myDesignsSubtitle;
  final String totalDesignsLabel;
  final String recentlyCreatedLabel;
  final String favoritesLabel;
  final String searchYourDesignsHint;
  final String categoryAllDesigns;
  final String categoryPanchayat;
  final String categoryBusiness;
  final String yourCreationsTitle;
  final String editDesignMenu;
  final String previewMenu;
  final String duplicateMenu;
  final String downloadMenu;
  final String shareMenu;
  final String deleteMenu;
  final String deleteConfirmTitle;
  final String deleteConfirmMessage;
  final String confirmDeleteAction;
  final String cancelAction;
  final String noDesignsYetTitle;
  final String noDesignsYetSubtitle;
  final String createFirstPosterButton;

  // Screen 15: Profile
  final String profileTitle;
  final String profileSubtitle;
  final String verifiedAccountBadge;
  final String personalInfoTitle;
  final String mobileNumberLabel;
  final String emailAddressLabel;
  final String villageCityLabel;
  final String districtLabel;
  final String preferencesTitle;
  final String appLanguageLabel;
  final String notificationPrefLabel;
  final String themePrefLabel;
  final String lightThemeOption;
  final String accountSupportTitle;
  final String accountSecurityLabel;
  final String helpSupportLabel;
  final String aboutPanchayatPostLabel;
  final String privacyPolicyLabel;
  final String termsConditionsLabel;
  final String logoutAction;
  final String logoutConfirmTitle;
  final String logoutConfirmMessage;

  // Screen 16: Settings & Preferences
  final String settingsTitle;
  final String settingsSubtitle;
  final String accountPreferencesTitle;
  final String personalInfoSettingsTitle;
  final String personalInfoSettingsSubtitle;
  final String changePasswordTitle;
  final String changePasswordSubtitle;
  final String mobileEmailTitle;
  final String mobileEmailSubtitle;
  final String languagePrefTitle;
  final String languagePrefSubtitle;
  final String notificationPrefSettingsTitle;
  final String notificationPrefSettingsSubtitle;
  final String appPreferencesTitle;
  final String appLanguageSettingsTitle;
  final String appLanguageSettingsSubtitle;
  final String defaultPosterLanguageTitle;
  final String defaultPosterLanguageSubtitle;
  final String notificationSettingsTitle;
  final String notificationSettingsSubtitle;
  final String festivalRemindersTitle;
  final String festivalRemindersSubtitle;
  final String appThemeTitle;
  final String appThemeSubtitle;
  final String privacySecurityTitle;
  final String privacySettingsTitle;
  final String privacySettingsSubtitle;
  final String privacySettingsContent;
  final String accountSecuritySettingsTitle;
  final String accountSecuritySettingsSubtitle;
  final String accountSecuritySettingsContent;
  final String activeSessionsTitle;
  final String activeSessionsSubtitle;
  final String activeSessionsContent;
  final String dataPermissionsTitle;
  final String dataPermissionsSubtitle;
  final String dataPermissionsContent;
  final String supportTitle;
  final String helpSupportSettingsTitle;
  final String helpSupportSettingsSubtitle;
  final String helpSupportSettingsContent;
  final String faqTitle;
  final String faqSubtitle;
  final String faqContent;
  final String contactUsTitle;
  final String contactUsSubtitle;
  final String contactUsContent;
  final String aboutAppTitle;
  final String aboutAppSubtitle;
  final String aboutAppContent;
  final String accountActionsTitle;
  final String logoutSettingsSubtitle;
  final String deleteAccountTitle;
  final String deleteAccountSubtitle;
  final String deleteAccountMessage;
  final String deleteAccountAction;

  static const String defaultLanguageCode = 'gu';

  static final Map<String, AppStrings> _localizedValues = {
    'gu': AppStrings(
      languageName: 'ગુજરાતી',
      headingPart1: 'તમારા ગામની દરેક વાત,\n',
      headingPart2Prefix: 'હવે ',
      headingHighlight: 'સુંદર પોસ્ટ',
      headingPart2Suffix: ' સાથે!',
      subtitle: 'તમારા ગામ, પંચાયત અને સમાજ માટે સુંદર પોસ્ટર બનાવો.\nતૈયાર ટેમ્પલેટ પસંદ કરો અથવા AI ની મદદથી\nતમારી પોતાની પોસ્ટ બનાવો.',
      primaryButton: 'ચાલો શરૂ કરીએ',
      secondaryButtonPrefix: 'પહેલેથી એકાઉન્ટ છે? ',
      secondaryButtonAction: 'Login',
      privacyPolicy: 'Privacy Policy',
      termsAndConditions: 'Terms & Conditions',
      selectLanguageTitle: 'ભાષા પસંદ કરો / Select Language',
      createAccountTitle: 'ખાતું બનાવો (Create Account)',
      loginTitle: 'લૉગિન (Login)',
      // Screen 03
      createAccountHeading: 'તમારું એકાઉન્ટ બનાવો',
      createAccountSubheading: 'Panchayat Post સાથે જોડાઓ અને\nતમારા ગામ માટે સુંદર પોસ્ટર બનાવવાનું શરૂ કરો.',
      fullNameLabel: 'તમારું પૂરું નામ લખો',
      fullNameHint: 'તમારું પૂરું નામ લખો',
      fullNameRequiredError: 'કૃપા કરીને તમારું પૂરું નામ લખો',
      usernameLabel: 'તમારું યુઝરનેમ બનાવો',
      usernameHint: 'તમારું યુઝરનેમ બનાવો',
      usernameHelper: 'આ યુઝરનેમથી તમે લોગિન કરી શકશો.',
      usernameLengthError: 'યુઝરનેમમાં ઓછામાં ઓછા 3 અક્ષર હોવા જોઈએ',
      usernameInvalidFormatError: 'માત્ર અંગ્રેજી અક્ષરો, સંખ્યાઓ અને _ માન્ય છે',
      usernameTakenError: 'આ યુઝરનેમ પહેલેથી ઉપયોગમાં છે',
      usernameAvailable: 'યુઝરનેમ ઉપલબ્ધ છે',
      passwordLabel: 'પાસવર્ડ બનાવો',
      passwordHint: 'પાસવર્ડ બનાવો',
      confirmPasswordLabel: 'પાસવર્ડ ફરીથી લખો',
      confirmPasswordHint: 'પાસવર્ડ ફરીથી લખો',
      passwordInstructionsTitle: 'પાસવર્ડ માટે સુચના:',
      passwordRuleMinChars: 'ઓછામાં ઓછા 8 અક્ષર',
      passwordRuleCase: 'મોટા અને નાના અક્ષર',
      passwordRuleNumber: 'ઓછામાં ઓછો 1 નંબર',
      passwordMismatchError: 'પાસવર્ડ મેળ ખાતો નથી',
      passwordWeakError: 'કૃપા કરીને નિયમો મુજબ પાસવર્ડ બનાવો',
      termsAcceptPrefix: 'હું ',
      termsAndText: ' અને ',
      termsAcceptSuffix: ' સ્વીકારું છું.',
      termsRequiredError: 'કૃપા કરીને Terms & Conditions સ્વીકારો.',
      createAccountButton: 'એકાઉન્ટ બનાવો',
      alreadyHaveAccount: 'પહેલેથી એકાઉન્ટ છે?',
      loginAction: 'Login કરો',
      registrationSuccess: 'એકાઉન્ટ સફળતાપૂર્વક બની ગયું!',
      networkOrServerError: 'સર્વર સાથે સંપર્ક થઈ શક્યો નથી. ફરી પ્રયાસ કરો.',
      // Screen 04
      loginHeading: 'ફરીથી આપનું સ્વાગત છે!',
      loginSubheading: 'તમારા Panchayat Post એકાઉન્ટમાં લોગિન કરો\nઅને તમારી પોસ્ટ બનાવવાનું ચાલુ રાખો.',
      loginUsernameLabel: 'યુઝરનેમ',
      loginUsernameHint: 'તમારું યુઝરનેમ લખો',
      loginUsernameRequiredError: 'કૃપા કરીને તમારું યુઝરનેમ લખો',
      loginPasswordLabel: 'પાસવર્ડ',
      loginPasswordHint: 'તમારો પાસવર્ડ લખો',
      loginPasswordRequiredError: 'કૃપા કરીને તમારો પાસવર્ડ લખો',
      rememberMeLabel: 'મને યાદ રાખો',
      forgotPasswordLabel: 'પાસવર્ડ ભૂલી ગયા?',
      forgotPasswordTitle: 'પાસવર્ડ પુનઃપ્રાપ્તિ સહાય',
      forgotPasswordMessage: 'ખાતાની સુરક્ષા માટે પાસવર્ડ રીસેટ કરવા તમારા ગ્રામ પંચાયત એડમિન અથવા સપોર્ટ ટીમનો સંપર્ક કરો:\n\n📧 support@panchayatpost.in\n📞 હેલ્પલાઇન: 1800-123-7262',
      loginButtonLabel: 'લોગિન કરો',
      noAccountPrompt: 'નવું એકાઉન્ટ નથી?',
      createAccountAction: 'એકાઉન્ટ બનાવો',
      loginSuccessMessage: 'સફળતાપૂર્વક લોગિન થયું!',
      accountNotFoundError: 'આ યુઝરનેમ વાળું એકાઉન્ટ મળ્યું નથી.',
      invalidPasswordError: 'ખોટો પાસવર્ડ દાખલ કર્યો છે.',
      // Screen 05
      forgotPasswordHeading: 'પાસવર્ડ ભૂલી ગયા?',
      forgotPasswordSubheading: 'ચિંતા કરશો નહીં! તમારી એકાઉન્ટ વિગતો આપો.\nઅમારી ટીમ તમને એકાઉન્ટ પાછું મેળવવામાં મદદ કરશે.',
      recoveryUsernameLabel: 'તમારું યુઝરનેમ',
      recoveryUsernameHint: 'રજિસ્ટર કરેલું યુઝરનેમ લખો',
      recoveryUsernameHelper: 'તમારા એકાઉન્ટનું યુઝરનેમ દાખલ કરો.',
      recoveryUsernameRequired: 'કૃપા કરીને તમારું રજિસ્ટર કરેલું યુઝરનેમ લખો',
      recoveryInfoBanner: 'તમારી વિનંતી મળ્યા પછી અમારી સપોર્ટ ટીમ\nએકાઉન્ટ રિકવરી માટે આગળની પ્રક્રિયામાં મદદ કરશે.',
      sendRecoveryButton: 'રિકવરી વિનંતી મોકલો',
      needMoreHelpDivider: 'વધુ મદદ જોઈએ છે?',
      contactSupportAction: 'સપોર્ટનો સંપર્ક કરો',
      backToLoginButton: 'Login પર પાછા જાઓ',
      recoveryRequestSubmitted: 'વિનંતી સફળતાપૂર્વક મોકલાઈ!',
      recoveryReferenceNumber: 'રિકવરી રેફરન્સ નંબર',
      recoveryInstructions: 'તમારી વિનંતી નોંધાઈ ગઈ છે. કૃપા કરીને આ રેફરન્સ નંબર સાચવી રાખો અને સહાયતા માટે ગ્રામ પંચાયત એડમિનનો સંપર્ક કરો.',
      rateLimitError: 'તમે ખૂબ ઝડપથી વિનંતી કરી રહ્યા છો. કૃપા કરીને થોડીવાર પછી ફરી પ્રયાસ કરો.',
      supportContactDetailsTitle: 'પંચાયત પોસ્ટ સહાયતા કેન્દ્ર',
      supportContactDetailsBody: 'ગ્રામ પંચાયત એકાઉન્ટ સહાયતા અને પાસવર્ડ રિકવરી માટે:\n\n📧 ઈમેઈલ: support@panchayatpost.in\n📞 ટોલ-ફ્રી હેલ્પલાઇન: 1800-123-7262\n⏰ સમય: સવારે 9:00 થી સાંજે 6:00 (સોમ-શનિ)\n🏛️ સ્થાનિક કાર્યાલય: તમારા તાલુકા/જિલ્લા પંચાયત આઈટી સંયોજક',
      // Screen 06
      recoveryStatusHeading: 'તમારી વિનંતી મળી ગઈ!',
      recoveryStatusSubheading: 'તમારી એકાઉન્ટ રિકવરી વિનંતી સફળતાપૂર્વક\nસબમિટ થઈ છે. અમારી ટીમ તેની તપાસ કરીને\nતમને આગળની માહિતી આપશે.',
      requestIdLabel: 'વિનંતી ક્રમાંક (Request ID):',
      usernameRowLabel: 'વપરાશકર્તા નામ (Username):',
      submittedDateLabel: 'જમા તારીખ (Submitted Date):',
      currentStatusLabel: 'હાલની સ્થિતિ (Current Status):',
      statusSubmitted: 'સબમિટ કરેલ',
      statusUnderReview: 'વિચારણા હેઠળ',
      statusAdditionalInfoRequired: 'વધુ માહિતી જરૂરી',
      statusResolved: 'ઉકેલાયેલ',
      statusRejected: 'અસ્વીકાર કરેલ',
      timelineStep1Title: 'વિનંતી પ્રાપ્ત થઈ',
      timelineStep1Subtitle: 'તમારી રિકવરી વિનંતી મળી ગઈ છે.',
      timelineStep2Title: 'તપાસ ચાલુ છે',
      timelineStep2Subtitle: 'અમારી ટીમ તમારી વિનંતીની તપાસ કરશે.',
      timelineStep3Title: 'આગળની કાર્યવાહી',
      timelineStep3Subtitle: 'તપાસ પૂર્ણ થયા પછી તમને આગળની સૂચના મળશે.',
      recoveryNoticeBanner: 'તમારી વિનંતી અંગેની આગળની માહિતી માટે\nઅમારી સપોર્ટ ટીમનો સંપર્ક કરી શકો છો.',
      contactSupportButton: 'સપોર્ટનો સંપર્ક કરો',
      goToLoginScreenButton: 'Login સ્ક્રીન પર જાઓ',
       refreshStatusTooltip: 'સ્થિતિ રીફ્રેશ કરો',
      lastUpdatedLabel: 'છેલ્લું અપડેટ',
      // Screen 07
      profileSetupHeaderStep: 'પ્રોફાઇલ સેટઅપ',
      profileSetupHeading: 'તમારું પ્રોફાઇલ તૈયાર કરો',
      profileSetupSubheading: 'તમારી કેટલીક વિગતો ઉમેરો અને\nPanchayat Post નો અનુભવ શરૂ કરો.',
      addPhotoAction: 'ફોટો ઉમેરો',
      changePhotoAction: 'ફોટો બદલો',
      removePhotoAction: 'ફોટો દૂર કરો',
      takePhotoFromCamera: 'કેમેરામાંથી ફોટો લો',
      chooseFromGallery: 'ગેલેરીમાંથી પસંદ કરો',
      orDivider: 'અથવા',
      fullNameFieldLabel: 'પુરું નામ',
      fullNameFieldHint: 'તમારું નામ લખો',
      displayNameFieldLabel: 'ડિસ્પ્લે નામ',
      displayNameFieldHint: 'બીજા યુઝર્સ તમને કયા નામથી ઓળખે?',
      displayNameHelper: 'આ નામ તમારા પ્રોફાઇલમાં દેખાશે.',
      villageCityFieldLabel: 'ગામ / શહેર',
      villageCityFieldHint: 'તમારા ગામ અથવા શહેરનું નામ',
      stateFieldLabel: 'રાજ્ય',
      stateFieldHint: 'રાજ્ય પસંદ કરો',
      searchStateHint: 'રાજ્ય શોધો...',
      selectStateTitle: 'રાજ્ય પસંદ કરો',
      profileInfoBanner: 'તમારી પ્રોફાઇલની માહિતી તમારા એકાઉન્ટ અનુભવને\nવધુ સારો બનાવવામાં મદદ કરશે.',
      saveProfileButton: 'પ્રોફાઇલ સેવ કરો',
      skipForNowButton: 'હમણાં પછીથી કરો',
      profileSavedSuccess: 'પ્રોફાઇલ સફળતાપૂર્વક સેવ થઈ ગઈ!',
      photoPermissionDenied: 'ફોટો પસંદ કરવા માટે પરવાનગી જરૂરી છે.',
      photoSizeTooLargeError: 'ફોટોનું કદ 5MB થી ઓછું હોવું જોઈએ.',
      unsupportedImageFormatError: 'માત્ર PNG, JPG અથવા WEBP ફોર્મેટ સ્વીકાર્ય છે.',
      displayNameRequiredError: 'કૃપા કરીને ડિસ્પ્લે નામ દાખલ કરો',
      // Screen 08
      confirmationHeading: 'અભિનંદન!',
      confirmationSubtitleComplete: 'તમારું પ્રોફાઇલ તૈયાર છે.',
      confirmationSubtitleIncomplete: 'Panchayat Post માં આપનું સ્વાગત છે!',
      confirmationBodyText: 'હવે Panchayat Post સાથે તમારા ગામ,\nપંચાયત અને સમાજ માટે સુંદર પોસ્ટર બનાવવાની\nશરૂઆત કરો.',
      profileStatusCompletedBadge: 'Profile Completed',
      profileStatusPendingBadge: 'Profile Pending',
      noVillageProvided: 'ગામ ઉમેરેલ નથી',
      featuresSectionTitle: 'Panchayat Post માં તમે શું કરી શકશો?',
      readyTemplatesTitle: 'Ready Templates',
      readyTemplatesDesc: 'તૈયાર સુંદર પોસ્ટર ટેમ્પલેટ પસંદ કરો.',
      aiPosterCreationTitle: 'AI Poster Creation',
      aiPosterCreationDesc: 'તમારા વિચારોમાંથી AI ની મદદથી પોસ્ટર બનાવો.',
      easyEditingTitle: 'Easy Editing',
      easyEditingDesc: 'તમારા પોસ્ટરમાં ટેક્સ્ટ, ફોટો અને ડિઝાઇન બદલો.',
      letsStartButton: 'ચાલો, શરૂઆત કરીએ',
      bottomTagline: 'તમારા વિચારોનો સુંદર પોસ્ટરમાં ફેરવો.',
      // Home Dashboard
      homeHeaderTitle: 'Panchayat Post',
      greetingPrefix: 'નમસ્તે',
      editProfileButton: 'પ્રોફાઇલ એડિટ કરો',
      posterTemplatesTitle: 'પોસ્ટર ટેમ્પલેટ્સ',
      createWithAiTitle: 'AI સાથે પોસ્ટર બનાવો',
      createWithAiDesc: 'તમારા વિચારોમાંથી 1 મિનિટમાં સુંદર પોસ્ટર તૈયાર કરો.',
      browseTemplatesAction: 'ટેમ્પલેટ પસંદ કરો',
      screenNavigatorTitle: 'બધા પેજ ટેસ્ટ કરો (Screen Navigator)',
      screenNavigatorDesc: 'કોઈપણ સ્ક્રીન પર સીધા જવા માટે ટેપ કરો',
      logoutDialogTitle: 'લોગ આઉટ',
      logoutDialogMessage: 'શું તમે ખરેખર તમારા એકાઉન્ટમાંથી લોગ આઉટ કરવા માંગો છો?',
      logoutConfirmButton: 'હા, લોગ આઉટ કરો',
      cancelButton: 'રદ કરો',
      categoriesTitle: 'લોકપ્રિય કેટેગરીઝ',
      categoryMeeting: 'પંચાયત મીટિંગ',
      categoryDevelopment: 'ગામ વિકાસ',
      categoryFestivals: 'તહેવારો અને ઉત્સવ',
      categoryNational: 'રાષ્ટ્રીય દિવસ',
      goodMorningGreeting: 'Good Morning!',
      welcomeUserPrefix: 'Welcome, ',
      heroBannerCreate: 'Create Beautiful',
      heroBannerFestival: 'Festival Posts',
      heroBannerSubtitle: 'Celebrate every occasion with beautiful designs.',
      heroBannerButton: 'Explore Designs',
      createSomethingNewTitle: 'Create Something New',
      cardFestivalPosters: 'Festival\nPosters',
      cardPanchayatPosts: 'Panchayat\nPosts',
      cardAiPoster: 'AI Poster',
      popularTemplatesTitle: 'Popular Templates',
      seeAllAction: 'See All',
      upcomingFestivalsTitle: 'Upcoming Festivals',
      festivalNavratri: 'નવરાત્રી',
      festivalDiwali: 'દિવાળી',
      festivalBhaiBeej: 'ભાઈ બીજ',
      navratriDate: '22 Oct',
      diwaliDate: '12 Nov',
      bhaiBeejDate: '23 Nov',
      navHome: 'Home',
      navFestivals: 'Festivals',
      navTemplates: 'Templates',
      navMyDesigns: 'My Designs',
      navProfile: 'Profile',
      notificationsTitle: 'સૂચનાઓ (Notifications)',
      noNewNotifications: 'કોઈ નવી સૂચના નથી',
      festivalsPageTitle: 'Festivals',
      festivalsPageSubtitle: 'Discover beautiful festival designs',
      searchFestivalsHint: 'Search festivals, occasions...',
      upcomingFestivalBadge: 'UPCOMING FESTIVAL',
      navratriCelebrationTitle: 'Navratri',
      navratriCelebrationScript: 'Celebration',
      exploreFestiveDesignsSubtitle: 'Explore beautiful festive designs',
      viewDesignsButton: 'View Designs',
      exploreCategoriesTitle: 'Explore Categories',
      categoryAll: 'All',
      categoryHinduFestivals: 'Hindu Festivals',
      categoryNationalDays: 'National Days',
      categoryReligiousEvents: 'Religious Events',
      categoryCulturalEvents: 'Cultural Events',
      upcomingFestivalsHeader: 'Upcoming Festivals',
      viewCalendarAction: 'View Calendar',
      exploreAllFestivalsTitle: 'Explore All Festivals',
      upcomingStatusBadge: 'Upcoming',
      noFestivalsFound: 'કોઈ તહેવાર મળ્યા નથી',
      clearSearchAction: 'શોધ સાફ કરો',
      filterTitle: 'ફિલ્ટર (Filter)',
      filterAllOption: 'બધા તહેવારો (All)',
      filterUpcomingOnly: 'માત્ર આગામી (Upcoming)',
      // Screen 11
      festivalDetailsTitle: 'Festival Details',
      breadcrumbFestivals: 'Festivals',
      breadcrumbFestivalDetails: 'Festival Details',
      celebrateGarbaSubtitle: 'Celebrate the joy of Garba and devotion',
      shareFestivalButton: 'Share Festival',
      aboutThisFestivalHeader: 'About This Festival',
      aboutFestivalDesc: 'Celebrate Navratri with devotion, music, traditional Garba and beautiful festive designs.',
      festivalCategoryLabel: 'Festival Category',
      festivalDateLabel: 'Festival Date',
      celebrationTypeLabel: 'Celebration Type',
      categoryCulturalValue: 'Cultural',
      celebrationTypeValue: 'Traditional',
      createFestivalPostsTitle: 'Create Festival Posts',
      createFestivalPostsSubtitle: 'Choose a beautiful design for your celebration.',
      popularDesignStylesTitle: 'Popular Design Styles',
      styleTraditionalLabel: 'Traditional',
      styleModernLabel: 'Modern',
      styleDevotionalLabel: 'Devotional',
      styleEventAnnouncementLabel: 'Event Announcement',
      createYourOwnTitle: 'Create Your Own Festival Post',
      createYourOwnSubtitle: 'Customize a design with your own name, photo and message.',
      startNowButton: 'Start Now',
      // Screen 12
      editYourPosterTitle: 'Edit Your Poster',
      editingModeBadge: 'Editing',
      customizeYourDesignTitle: 'Customize Your Design',
      toolEditText: 'Edit Text',
      toolReplaceImage: 'Replace Image',
      toolChangeColor: 'Change Color',
      toolPosition: 'Position',
      toolDuplicate: 'Duplicate',
      tabText: 'Text',
      tabImages: 'Images',
      tabColors: 'Colors',
      tabBackground: 'Background',
      tabFonts: 'Fonts',
      headlineTextLabel: 'Headline Text',
      supportingTextLabel: 'Supporting Text',
      fontStyleLabel: 'Font Style',
      textAlignmentLabel: 'Text Alignment',
      textColorLabel: 'Text Color',
      previewPosterButton: 'Preview Poster',
      saveDesignButton: 'Save Design',
      allChangesSavedLabel: 'All changes saved',
      designSavedSuccess: 'પોસ્ટર ડિઝાઇન સફળતાપૂર્વક સાચવવામાં આવી!',
      // Screen 13
      yourPosterTitle: 'તમારું પોસ્ટર',
      yourDesignIsReady: 'તમારી ડિઝાઇન તૈયાર છે!',
      posterCreatedSuccessfully: 'પોસ્ટર સફળતાપૂર્વક બનાવવામાં આવ્યું',
      readyToDownloadAndShare: 'તમારી ડિઝાઇન ડાઉનલોડ અને શેર કરવા માટે તૈયાર છે.',
      customDesignBadge: 'કસ્ટમ ડિઝાઇન',
      previewAction: 'Preview',
      editAction: 'Edit',
      duplicateAction: 'Duplicate',
      moreAction: 'More',
      downloadYourPosterTitle: 'તમારું પોસ્ટર ડાઉનલોડ કરો',
      highQualityOption: 'High Quality',
      downloadPosterButton: 'પોસ્ટર ડાઉનલોડ કરો',
      shareYourCreationTitle: 'તમારી રચના શેર કરો',
      whatsAppAction: 'WhatsApp',
      instagramAction: 'Instagram',
      shareMoreAction: 'Share More',
      savedInMyDesignsBadge: 'Saved in My Designs',
      sharePosterButton: 'પોસ્ટર શેર કરો',
      duplicateCreatedSuccess: 'ડુપ્લિકેટ પોસ્ટર સાચવવામાં આવ્યું!',
      // Screen 14
      myDesignsTitle: 'મારા ડિઝાઇન',
      myDesignsSubtitle: 'તમારી બધી રચનાત્મક ડિઝાઇન એક જગ્યાએ',
      totalDesignsLabel: 'Total Designs',
      recentlyCreatedLabel: 'Recently Created',
      favoritesLabel: 'Favorites',
      searchYourDesignsHint: 'Search your designs...',
      categoryAllDesigns: 'All Designs',
      categoryPanchayat: 'Panchayat',
      categoryBusiness: 'Business',
      yourCreationsTitle: 'Your Creations',
      editDesignMenu: 'Edit Design',
      previewMenu: 'Preview',
      duplicateMenu: 'Duplicate',
      downloadMenu: 'Download',
      shareMenu: 'Share',
      deleteMenu: 'Delete',
      deleteConfirmTitle: 'ડિઝાઇન કાઢી નાખવી છે?',
      deleteConfirmMessage: 'શું તમે ખરેખર આ પોસ્ટર કાયમ માટે કાઢી નાખવા માંગો છો?',
      confirmDeleteAction: 'Delete',
      cancelAction: 'Cancel',
      noDesignsYetTitle: 'No Designs Yet',
      noDesignsYetSubtitle: 'Your creations will appear here.',
      createFirstPosterButton: '+ Create Your First Poster',
      // Screen 15
      profileTitle: 'મારી પ્રોફ઼ાઇલ',
      profileSubtitle: 'તમારો એકાઉન્ટ અને પ્રાધાન્યો સંચાલિત કરો',
      verifiedAccountBadge: 'ચકાસાયેલ ખાતું',
      personalInfoTitle: 'વ્યક્તિગત માહિતી',
      mobileNumberLabel: 'મોબાઇલ નંબર',
      emailAddressLabel: 'ઇ-મેઇલ સરનામું',
      villageCityLabel: 'ગામ / શહેર',
      districtLabel: 'જિલ્લો',
      preferencesTitle: 'પ્રાધાન્ય',
      appLanguageLabel: 'ઍપ ભાષા',
      notificationPrefLabel: 'સૂચના પ્રાધાન્ય',
      themePrefLabel: 'થીમ પ્રાધાન્ય',
      lightThemeOption: 'લાઇટ થીમ',
      accountSupportTitle: 'ખાતું અને સહાય',
      accountSecurityLabel: 'ખાતાની સુરક્ષા',
      helpSupportLabel: 'સહાય',
      aboutPanchayatPostLabel: 'Panchayat Post વિશે',
      privacyPolicyLabel: 'ગોપનીયતા નીતિ',
      termsConditionsLabel: 'નિયમો અને શરતો',
      logoutAction: 'લૉગ આઉટ',
      logoutConfirmTitle: 'લૉગ આઉટ?',
      logoutConfirmMessage: 'શું તમે ખરેખર Panchayat Post ખાતામાંથી લૉગ આઉટ કરવા માગો છો?',
      // Screen 16
      settingsTitle: 'સેટિંગ્સ અને પ્રાધાન્ય',
      settingsSubtitle: 'તમારો ઍપ અનુભવ સંચાલિત કરો.',
      accountPreferencesTitle: 'ખાતું પ્રાધાન્ય',
      personalInfoSettingsTitle: 'વ્યક્તિગત માહિતી',
      personalInfoSettingsSubtitle: 'તમારી પ્રોફ઼ાઇલ વિગતો જુઓ અને અપડેટ કરો',
      changePasswordTitle: 'પાસવર્ડ બદલો',
      changePasswordSubtitle: 'તમારા ખાતાનો પાસવર્ડ અપડેટ કરો',
      mobileEmailTitle: 'મોબાઇલ નંબર અને ઈ-મેઇલ',
      mobileEmailSubtitle: 'તમારો મોબાઇલ નંબર અને ઈ-મેઇલ સંચાલિત કરો',
      languagePrefTitle: 'ભાષા પ્રાધાન્ય',
      languagePrefSubtitle: 'તમારી પસંદગીની ભાષા પસંદ કરો',
      notificationPrefSettingsTitle: 'સૂચના પ્રાધાન્ય',
      notificationPrefSettingsSubtitle: 'તમારી સૂચના સેટિંગ્સ સંચાલિત કરો',
      appPreferencesTitle: 'ઍપ પ્રાધાન્ય',
      appLanguageSettingsTitle: 'ઍપ ભાષા',
      appLanguageSettingsSubtitle: 'તમારી ઍપ ભાષા પસંદ કરો',
      defaultPosterLanguageTitle: 'ડિફૉલ્ટ પોસ્ટર ભાષા',
      defaultPosterLanguageSubtitle: 'નવા પોસ્ટર માટે ડિફૉલ્ટ ભાષા સેટ કરો',
      notificationSettingsTitle: 'સૂચના સેટિંગ્સ',
      notificationSettingsSubtitle: 'મહત્વના અપડેટ વિશે સૂચના મેળવો',
      festivalRemindersTitle: 'તહેવાર રિમાઇન્ડર્સ',
      festivalRemindersSubtitle: 'તહેવાર અને ઇવેન્ટ રિમાઇન્ડર્સ મેળવો',
      appThemeTitle: 'ઍપ થીમ',
      appThemeSubtitle: 'તમારી પસંદગીની થીમ પસંદ કરો',
      privacySecurityTitle: 'ગોપનીયતા અને સુરક્ષા',
      privacySettingsTitle: 'ગોપનીયતા સેટિંગ્સ',
      privacySettingsSubtitle: 'તમારો ડેટા અને ગોપનીયતા નિયંત્રિત કરો',
      privacySettingsContent: 'અમે તમારી ગોપનીયતાનું સન્માન કરીએ છીએ. વ્યક્તિગત માહિતી તમારા ઉપકરણ પર સ્થાનિક રીતે સંગ્રહિત થાય છે.',
      accountSecuritySettingsTitle: 'ખાતાની સુરક્ષા',
      accountSecuritySettingsSubtitle: 'સુરક્ષા સેટિંગ્સ સંચાલિત કરો',
      accountSecuritySettingsContent: 'તમારું ખાતું સુરક્ષિત પાસવર્ડ સાથે સુરક્ષિત છે.',
      activeSessionsTitle: 'સક્રિય સત્રો',
      activeSessionsSubtitle: 'તમારા લૉગ-ઇન ઉપકરણો જુઓ',
      activeSessionsContent: 'તમારું વર્તમાન સત્ર આ ઉપકરણ પર સક્રિય છે.',
      dataPermissionsTitle: 'ડેટા અને પરવાનગીઓ',
      dataPermissionsSubtitle: 'ડેટા ઍક્સેસ અને પરવાનગીઓ સંચાલિત કરો',
      dataPermissionsContent: 'ઍપ પરવાનગીઓ તમારા ઉપકરણ સેટિંગ્સમાં સંચાલિત કરી શકાય છે.',
      supportTitle: 'સહાય',
      helpSupportSettingsTitle: 'સહાય અને સપોર્ટ',
      helpSupportSettingsSubtitle: 'જ્યારે પણ જરૂર હોય ત્યારે સહાય મેળવો',
      helpSupportSettingsContent: 'સહાય માટે, support@panchayatpost.in પર સંપર્ક કરો.',
      faqTitle: 'વારંવાર પૂછાતા પ્રશ્નો',
      faqSubtitle: 'સામાન્ય પ્રશ્નોના જવાબો શોધો',
      faqContent: 'અહીં Panchayat Post વિશેના સૌથી સામાન્ય પ્રશ્નોના જવાબો છે.',
      contactUsTitle: 'અમારો સંપર્ક કરો',
      contactUsSubtitle: 'અમે મદદ કરવા અહીં છીએ',
      contactUsContent: '📧 support@panchayatpost.in\n📞 1800-123-7262\n⏰ સોમ-શનિ, 9:00 AM - 6:00 PM',
      aboutAppTitle: 'Panchayat Post વિશે',
      aboutAppSubtitle: 'ઍપ વર્ઝન, માહિતી અને વધુ',
      aboutAppContent: 'Panchayat Post v1.0.0\n\nગામડાના સમુદાયો માટે સુંદર તહેવાર અને સરકારી પોસ્ટર બનાવવા અને શેર કરવા માટેનું પ્લેટફોર્મ.\n\n❤️ ભારત માટે બનાવવામાં આવ્યું.',
      accountActionsTitle: 'ખાતું ક્રિયાઓ',
      logoutSettingsSubtitle: 'તમારા ખાતામાંથી સાઇન આઉટ કરો',
      deleteAccountTitle: 'ખાતું કાઢી નાખો',
      deleteAccountSubtitle: 'તમારું ખાતું કાયમ માટે દૂર કરો',
      deleteAccountMessage: 'આ ક્રિયા તમારા ખાતા, ડિઝાઇન અને ડેટાને કાયમ માટે કાઢી નાખશે. આ ક્રિયા પૂર્વવત્ કરી શકાતી નથી.',
      deleteAccountAction: 'ખાતું કાઢી નાખો',
    ),
    'hi': AppStrings(
      languageName: 'हिंदी',
      headingPart1: 'आपके गांव की हर बात,\n',
      headingPart2Prefix: 'अब ',
      headingHighlight: 'सुंदर पोस्ट',
      headingPart2Suffix: ' के साथ!',
      subtitle: 'अपने गांव, पंचायत और समाज के लिए सुंदर पोस्टर बनाएं।\nतैयार टेम्पलेट चुनें या AI की मदद से\nअपनी खुद की पोस्ट बनाएं।',
      primaryButton: 'शुरू करें',
      secondaryButtonPrefix: 'पहले से खाता है? ',
      secondaryButtonAction: 'Login',
      privacyPolicy: 'Privacy Policy',
      termsAndConditions: 'Terms & Conditions',
      selectLanguageTitle: 'भाषा चुनें / Select Language',
      createAccountTitle: 'खाता बनाएं (Create Account)',
      loginTitle: 'लॉगिन (Login)',
      // Screen 03
      createAccountHeading: 'अपना खाता बनाएं',
      createAccountSubheading: 'Panchayat Post से जुड़ें और\nअपने गांव के लिए सुंदर पोस्टर बनाना शुरू करें।',
      fullNameLabel: 'अपना पूरा नाम लिखें',
      fullNameHint: 'अपना पूरा नाम लिखें',
      fullNameRequiredError: 'कृपया अपना पूरा नाम लिखें',
      usernameLabel: 'अपना यूज़रनेम बनाएं',
      usernameHint: 'अपना यूज़रनेम बनाएं',
      usernameHelper: 'इस यूज़रनेम से आप लॉगिन कर सकेंगे।',
      usernameLengthError: 'यूज़रनेम में कम से कम 3 अक्षर होने चाहिए',
      usernameInvalidFormatError: 'केवल अंग्रेजी अक्षर, संख्याएं और _ मान्य हैं',
      usernameTakenError: 'यह यूज़रनेम पहले से उपयोग में है',
      usernameAvailable: 'यूज़रनेम उपलब्ध है',
      passwordLabel: 'पासवर्ड बनाएं',
      passwordHint: 'पासवर्ड बनाएं',
      confirmPasswordLabel: 'पासवर्ड दोबारा लिखें',
      confirmPasswordHint: 'पासवर्ड दोबारा लिखें',
      passwordInstructionsTitle: 'पासवर्ड के लिए निर्देश:',
      passwordRuleMinChars: 'कम से कम 8 अक्षर',
      passwordRuleCase: 'बड़े और छोटे अक्षर',
      passwordRuleNumber: 'कम से कम 1 नंबर',
      passwordMismatchError: 'पासवर्ड मेल नहीं खाता',
      passwordWeakError: 'कृपया नियमों के अनुसार पासवर्ड बनाएं',
      termsAcceptPrefix: 'मैं ',
      termsAndText: ' और ',
      termsAcceptSuffix: ' स्वीकार करता हूँ।',
      termsRequiredError: 'कृपया Terms & Conditions स्वीकार करें।',
      createAccountButton: 'खाता बनाएं',
      alreadyHaveAccount: 'पहले से खाता है?',
      loginAction: 'Login करें',
      registrationSuccess: 'खाता सफलतापूर्वक बन गया!',
      networkOrServerError: 'सर्वर से संपर्क नहीं हो सका। पुनः प्रयास करें।',
      // Screen 04
      loginHeading: 'वापस स्वागत है!',
      loginSubheading: 'अपने Panchayat Post खाते में लॉगिन करें\nऔर अपनी पोस्ट बनाना जारी रखें।',
      loginUsernameLabel: 'यूज़रनेम',
      loginUsernameHint: 'अपना यूज़रनेम लिखें',
      loginUsernameRequiredError: 'कृपया अपना यूज़रनेम लिखें',
      loginPasswordLabel: 'पासवर्ड',
      loginPasswordHint: 'अपना पासवर्ड लिखें',
      loginPasswordRequiredError: 'कृपया अपना पासवर्ड लिखें',
      rememberMeLabel: 'मुझे याद रखें',
      forgotPasswordLabel: 'पासवर्ड भूल गए?',
      forgotPasswordTitle: 'पासवर्ड पुनः प्राप्ति सहायता',
      forgotPasswordMessage: 'खाता सुरक्षा के लिए पासवर्ड रीसेट करने हेतु अपने ग्राम पंचायत व्यवस्थापक या सहायता टीम से संपर्क करें:\n\n📧 support@panchayatpost.in\n📞 हेल्पलाइन: 1800-123-7262',
      loginButtonLabel: 'लॉगिन करें',
      noAccountPrompt: 'नया खाता नहीं है?',
      createAccountAction: 'खाता बनाएं',
      loginSuccessMessage: 'सफलतापूर्वक लॉगिन हो गया!',
      accountNotFoundError: 'यह यूज़रनेम वाला खाता नहीं मिला।',
      invalidPasswordError: 'गलत पासवर्ड दर्ज किया गया है।',
      // Screen 05
      forgotPasswordHeading: 'पासवर्ड भूल गए?',
      forgotPasswordSubheading: 'चिंता न करें! अपने खाते का विवरण दें।\nहमारी टीम आपको खाता वापस पाने में मदद करेगी।',
      recoveryUsernameLabel: 'आपका यूज़रनेम',
      recoveryUsernameHint: 'रजिस्टर्ड यूज़रनेम लिखें',
      recoveryUsernameHelper: 'अपने खाते का यूज़रनेम दर्ज करें।',
      recoveryUsernameRequired: 'कृपया अपना रजिस्टर्ड यूज़रनेम लिखें',
      recoveryInfoBanner: 'आपकी विनंती मिलने के बाद हमारी सहायता टीम\nखाता पुनः प्राप्ति की आगे की प्रक्रिया में मदद करेगी।',
      sendRecoveryButton: 'रिकवरी अनुरोध भेजें',
      needMoreHelpDivider: 'और मदद चाहिए?',
      contactSupportAction: 'सपोर्ट से संपर्क करें',
      backToLoginButton: 'Login पर वापस जाएं',
      recoveryRequestSubmitted: 'अनुरोध सफलतापूर्वक भेजा गया!',
      recoveryReferenceNumber: 'रिकवरी संदर्भ संख्या',
      recoveryInstructions: 'आपका अनुरोध दर्ज हो गया है। कृपया यह संदर्भ संख्या सुरक्षित रखें और सहायता के लिए ग्राम पंचायत व्यवस्थापक से संपर्क करें।',
      rateLimitError: 'आप बहुत जल्दी अनुरोध कर रहे हैं। कृपया कुछ देर बाद पुनः प्रयास करें।',
      supportContactDetailsTitle: 'पंचायत पोस्ट सहायता केंद्र',
      supportContactDetailsBody: 'ग्राम पंचायत खाता सहायता और पासवर्ड रिकवरी के लिए:\n\n📧 ईमेल: support@panchayatpost.in\n📞 टोल-फ्री हेल्पलाइन: 1800-123-7262\n⏰ समय: सुबह 9:00 से शाम 6:00 (सोम-शनि)\n🏛️ स्थानीय कार्यालय: अपने तालुका/जिला पंचायत आईटी समन्वयक',
      // Screen 06
      recoveryStatusHeading: 'आपकी विनंती मिल गई!',
      recoveryStatusSubheading: 'आपके खाते की पुनः प्राप्ति का अनुरोध सफलतापूर्वक\nदर्ज हो गया है। हमारी टीम इसकी जांच करके\nआपको आगे की सूचना देगी।',
      requestIdLabel: 'अनुरोध क्रमांक (Request ID):',
      usernameRowLabel: 'उपयोगकर्ता नाम (Username):',
      submittedDateLabel: 'जमा तिथि (Submitted Date):',
      currentStatusLabel: 'वर्तमान स्थिति (Current Status):',
      statusSubmitted: 'प्रस्तुत',
      statusUnderReview: 'समीक्षाधीन',
      statusAdditionalInfoRequired: 'अतिरिक्त जानकारी आवश्यक',
      statusResolved: 'समाधान हो गया',
      statusRejected: 'अस्वीकृत',
      timelineStep1Title: 'अनुरोध प्राप्त हुआ',
      timelineStep1Subtitle: 'आपकी रिकवरी विनंती मिल गई है।',
      timelineStep2Title: 'जांच जारी है',
      timelineStep2Subtitle: 'हमारी टीम आपके अनुरोध की जांच करेगी।',
      timelineStep3Title: 'आगे की कार्रवाई',
      timelineStep3Subtitle: 'जांच पूरी होने पर आपको आगे के निर्देश मिलेंगे।',
      recoveryNoticeBanner: 'अपने अनुरोध के संबंध में आगे की जानकारी के लिए\nहमारी सहायता टीम से संपर्क कर सकते हैं।',
      contactSupportButton: 'सपोर्ट से संपर्क करें',
      goToLoginScreenButton: 'Login स्क्रीन पर जाएं',
      refreshStatusTooltip: 'स्थिति रीफ्रेश करें',
      lastUpdatedLabel: 'अंतिम अपडेट',
      // Screen 07
      profileSetupHeaderStep: 'प्रोफ़ाइल सेटअप',
      profileSetupHeading: 'अपनी प्रोफ़ाइल तैयार करें',
      profileSetupSubheading: 'अपने कुछ विवरण जोड़ें और\nPanchayat Post का अनुभव शुरू करें।',
      addPhotoAction: 'फ़ोटो जोड़ें',
      changePhotoAction: 'फ़ोटो बदलें',
      removePhotoAction: 'फ़ोटो हटाएं',
      takePhotoFromCamera: 'कैमरे से फ़ोटो लें',
      chooseFromGallery: 'गैलरी से चुनें',
      orDivider: 'या',
      fullNameFieldLabel: 'पूरा नाम',
      fullNameFieldHint: 'अपना नाम लिखें',
      displayNameFieldLabel: 'डिस्प्ले नाम',
      displayNameFieldHint: 'अन्य यूज़र्स आपको किस नाम से जानें?',
      displayNameHelper: 'यह नाम आपकी प्रोफ़ाइल में दिखाई देगा।',
      villageCityFieldLabel: 'गांव / शहर',
      villageCityFieldHint: 'अपने गांव या शहर का नाम',
      stateFieldLabel: 'राज्य',
      stateFieldHint: 'राज्य चुनें',
      searchStateHint: 'राज्य खोजें...',
      selectStateTitle: 'राज्य चुनें',
      profileInfoBanner: 'आपकी प्रोफ़ाइल की जानकारी आपके खाते के अनुभव को\nऔर बेहतर बनाने में मदद करेगी।',
      saveProfileButton: 'प्रोफ़ाइल सेव करें',
      skipForNowButton: 'अभी के लिए छोड़ें',
      profileSavedSuccess: 'प्रोफ़ाइल सफलतापूर्वक सहेजी गई!',
      photoPermissionDenied: 'फ़ोटो चुनने के लिए अनुमति आवश्यक है।',
      photoSizeTooLargeError: 'फ़ोटो का आकार 5MB से कम होना चाहिए।',
      unsupportedImageFormatError: 'केवल PNG, JPG या WEBP प्रारूप समर्थित हैं।',
      displayNameRequiredError: 'कृपया डिस्प्ले नाम दर्ज करें',
      // Screen 08
      confirmationHeading: 'बधाई हो!',
      confirmationSubtitleComplete: 'आपकी प्रोफ़ाइल तैयार है।',
      confirmationSubtitleIncomplete: 'Panchayat Post में आपका स्वागत है!',
      confirmationBodyText: 'अब Panchayat Post के साथ अपने गांव,\nपंचायत और समाज के लिए सुंदर पोस्टर बनाने की\nशुरुआत करें।',
      profileStatusCompletedBadge: 'Profile Completed',
      profileStatusPendingBadge: 'Profile Pending',
      noVillageProvided: 'गांव दर्ज नहीं',
      featuresSectionTitle: 'Panchayat Post में आप क्या कर सकेंगे?',
      readyTemplatesTitle: 'Ready Templates',
      readyTemplatesDesc: 'तैयार सुंदर पोस्टर टेम्पलेट चुनें।',
      aiPosterCreationTitle: 'AI Poster Creation',
      aiPosterCreationDesc: 'अपने विचारों से AI की मदद से पोस्टर बनाएं।',
      easyEditingTitle: 'Easy Editing',
      easyEditingDesc: 'अपने पोस्टर में टेक्स्ट, फ़ोटो और डिज़ाइन बदलें।',
      letsStartButton: 'चलिए, शुरुआत करें',
      bottomTagline: 'अपने विचारों को सुंदर पोस्टर में बदलें।',
      // Home Dashboard
      homeHeaderTitle: 'Panchayat Post',
      greetingPrefix: 'नमस्ते',
      editProfileButton: 'प्रोफ़ाइल एडिट करें',
      posterTemplatesTitle: 'पोस्टर टेम्पलेट्स',
      createWithAiTitle: 'AI से पोस्टर बनाएं',
      createWithAiDesc: 'अपने विचारों से 1 मिनट में सुंदर पोस्टर तैयार करें।',
      browseTemplatesAction: 'टेम्पलेट चुनें',
      screenNavigatorTitle: 'सभी पेज टेस्ट करें (Screen Navigator)',
      screenNavigatorDesc: 'किसी भी स्क्रीन पर सीधे जाने के लिए टैप करें',
      logoutDialogTitle: 'लॉग आउट',
      logoutDialogMessage: 'क्या आप वाकई अपने खाते से लॉग आउट करना चाहते हैं?',
      logoutConfirmButton: 'हाँ, लॉग आउट करें',
      cancelButton: 'रद्द करें',
      categoriesTitle: 'लोकप्रिय श्रेणियां',
      categoryMeeting: 'पंचायत मीटिंग',
      categoryDevelopment: 'गांव विकास',
      categoryFestivals: 'त्योहार और उत्सव',
      categoryNational: 'राष्ट्रीय दिवस',
      goodMorningGreeting: 'Good Morning!',
      welcomeUserPrefix: 'Welcome, ',
      heroBannerCreate: 'Create Beautiful',
      heroBannerFestival: 'Festival Posts',
      heroBannerSubtitle: 'Celebrate every occasion with beautiful designs.',
      heroBannerButton: 'Explore Designs',
      createSomethingNewTitle: 'Create Something New',
      cardFestivalPosters: 'Festival\nPosters',
      cardPanchayatPosts: 'Panchayat\nPosts',
      cardAiPoster: 'AI Poster',
      popularTemplatesTitle: 'Popular Templates',
      seeAllAction: 'See All',
      upcomingFestivalsTitle: 'Upcoming Festivals',
      festivalNavratri: 'नवरात्रि',
      festivalDiwali: 'दिवाली',
      festivalBhaiBeej: 'भाई दूज',
      navratriDate: '22 Oct',
      diwaliDate: '12 Nov',
      bhaiBeejDate: '23 Nov',
      navHome: 'Home',
      navFestivals: 'Festivals',
      navTemplates: 'Templates',
      navMyDesigns: 'My Designs',
      navProfile: 'Profile',
      notificationsTitle: 'सूचनाएं (Notifications)',
      noNewNotifications: 'कोई नई सूचना नहीं है',
      festivalsPageTitle: 'Festivals',
      festivalsPageSubtitle: 'Discover beautiful festival designs',
      searchFestivalsHint: 'Search festivals, occasions...',
      upcomingFestivalBadge: 'UPCOMING FESTIVAL',
      navratriCelebrationTitle: 'Navratri',
      navratriCelebrationScript: 'Celebration',
      exploreFestiveDesignsSubtitle: 'Explore beautiful festive designs',
      viewDesignsButton: 'View Designs',
      exploreCategoriesTitle: 'Explore Categories',
      categoryAll: 'All',
      categoryHinduFestivals: 'Hindu Festivals',
      categoryNationalDays: 'National Days',
      categoryReligiousEvents: 'Religious Events',
      categoryCulturalEvents: 'Cultural Events',
      upcomingFestivalsHeader: 'Upcoming Festivals',
      viewCalendarAction: 'View Calendar',
      exploreAllFestivalsTitle: 'Explore All Festivals',
      upcomingStatusBadge: 'Upcoming',
      noFestivalsFound: 'कोई त्यौहार नहीं मिला',
      clearSearchAction: 'खोज साफ़ करें',
      filterTitle: 'फ़िल्टर (Filter)',
      filterAllOption: 'सभी त्यौहार (All)',
      filterUpcomingOnly: 'केवल आगामी (Upcoming)',
      // Screen 11
      festivalDetailsTitle: 'Festival Details',
      breadcrumbFestivals: 'Festivals',
      breadcrumbFestivalDetails: 'Festival Details',
      celebrateGarbaSubtitle: 'Celebrate the joy of Garba and devotion',
      shareFestivalButton: 'Share Festival',
      aboutThisFestivalHeader: 'About This Festival',
      aboutFestivalDesc: 'Celebrate Navratri with devotion, music, traditional Garba and beautiful festive designs.',
      festivalCategoryLabel: 'Festival Category',
      festivalDateLabel: 'Festival Date',
      celebrationTypeLabel: 'Celebration Type',
      categoryCulturalValue: 'Cultural',
      celebrationTypeValue: 'Traditional',
      createFestivalPostsTitle: 'Create Festival Posts',
      createFestivalPostsSubtitle: 'Choose a beautiful design for your celebration.',
      popularDesignStylesTitle: 'Popular Design Styles',
      styleTraditionalLabel: 'Traditional',
      styleModernLabel: 'Modern',
      styleDevotionalLabel: 'Devotional',
      styleEventAnnouncementLabel: 'Event Announcement',
      createYourOwnTitle: 'Create Your Own Festival Post',
      createYourOwnSubtitle: 'Customize a design with your own name, photo and message.',
      startNowButton: 'Start Now',
      // Screen 12
      editYourPosterTitle: 'Edit Your Poster',
      editingModeBadge: 'Editing',
      customizeYourDesignTitle: 'Customize Your Design',
      toolEditText: 'Edit Text',
      toolReplaceImage: 'Replace Image',
      toolChangeColor: 'Change Color',
      toolPosition: 'Position',
      toolDuplicate: 'Duplicate',
      tabText: 'Text',
      tabImages: 'Images',
      tabColors: 'Colors',
      tabBackground: 'Background',
      tabFonts: 'Fonts',
      headlineTextLabel: 'Headline Text',
      supportingTextLabel: 'Supporting Text',
      fontStyleLabel: 'Font Style',
      textAlignmentLabel: 'Text Alignment',
      textColorLabel: 'Text Color',
      previewPosterButton: 'Preview Poster',
      saveDesignButton: 'Save Design',
      allChangesSavedLabel: 'All changes saved',
      designSavedSuccess: 'पोस्टर डिज़ाइन सफलतापूर्वक सहेजा गया!',
      // Screen 13
      yourPosterTitle: 'आपका पोस्टर',
      yourDesignIsReady: 'आपकी डिज़ाइन तैयार है!',
      posterCreatedSuccessfully: 'पोस्टर सफलतापूर्वक बनाया गया',
      readyToDownloadAndShare: 'आपकी डिज़ाइन डाउनलोड और साझा करने के लिए तैयार है।',
      customDesignBadge: 'कस्टम डिज़ाइन',
      previewAction: 'Preview',
      editAction: 'Edit',
      duplicateAction: 'Duplicate',
      moreAction: 'More',
      downloadYourPosterTitle: 'अपना पोस्टर डाउनलोड करें',
      highQualityOption: 'High Quality',
      downloadPosterButton: 'पोस्टर डाउनलोड करें',
      shareYourCreationTitle: 'अपनी रचना साझा करें',
      whatsAppAction: 'WhatsApp',
      instagramAction: 'Instagram',
      shareMoreAction: 'Share More',
      savedInMyDesignsBadge: 'Saved in My Designs',
      sharePosterButton: 'पोस्टर साझा करें',
      duplicateCreatedSuccess: 'डुप्लिकेट पोस्टर सहेजा गया!',
      // Screen 14
      myDesignsTitle: 'मेरी डिज़ाइन',
      myDesignsSubtitle: 'आपकी सभी रचनात्मक डिज़ाइन एक स्थान पर',
      totalDesignsLabel: 'Total Designs',
      recentlyCreatedLabel: 'Recently Created',
      favoritesLabel: 'Favorites',
      searchYourDesignsHint: 'Search your designs...',
      categoryAllDesigns: 'All Designs',
      categoryPanchayat: 'Panchayat',
      categoryBusiness: 'Business',
      yourCreationsTitle: 'Your Creations',
      editDesignMenu: 'Edit Design',
      previewMenu: 'Preview',
      duplicateMenu: 'Duplicate',
      downloadMenu: 'Download',
      shareMenu: 'Share',
      deleteMenu: 'Delete',
      deleteConfirmTitle: 'डिज़ाइन हटाएं?',
      deleteConfirmMessage: 'क्या आप वाकई इस पोस्टर को हटाना चाहते हैं?',
      confirmDeleteAction: 'Delete',
      cancelAction: 'Cancel',
      noDesignsYetTitle: 'No Designs Yet',
      noDesignsYetSubtitle: 'Your creations will appear here.',
      createFirstPosterButton: '+ Create Your First Poster',
      // Screen 15
      profileTitle: 'मेरी प्रोफ़ाइल',
      profileSubtitle: 'अपना खाता और प्राथमिकताएँ प्रबंधित करें',
      verifiedAccountBadge: 'सत्यापित खाता',
      personalInfoTitle: 'व्यक्तिगत जानकारी',
      mobileNumberLabel: 'मोबाइल नंबर',
      emailAddressLabel: 'ईमेल पता',
      villageCityLabel: 'गाँव / शहर',
      districtLabel: 'जिला',
      preferencesTitle: 'प्राथमिकताएँ',
      appLanguageLabel: 'ऐप भाषा',
      notificationPrefLabel: 'सूचना प्राथमिकताएँ',
      themePrefLabel: 'थीम प्राथमिकता',
      lightThemeOption: 'लाइट थीम',
      accountSupportTitle: 'खाता और सहायता',
      accountSecurityLabel: 'खाता सुरक्षा',
      helpSupportLabel: 'सहायता',
      aboutPanchayatPostLabel: 'Panchayat Post के बारे में',
      privacyPolicyLabel: 'गोपनीयता नीति',
      termsConditionsLabel: 'नियम और शर्तें',
      logoutAction: 'लॉग आउट',
      logoutConfirmTitle: 'लॉग आउट करें?',
      logoutConfirmMessage: 'क्या आप अपने Panchayat Post खाते से लॉग आउट करना चाहते हैं?',
      // Screen 16
      settingsTitle: 'सेटिंग्स और प्राथमिकताएँ',
      settingsSubtitle: 'अपने ऐप अनुभव को प्रबंधित करें.',
      accountPreferencesTitle: 'खाता प्राथमिकताएँ',
      personalInfoSettingsTitle: 'व्यक्तिगत जानकारी',
      personalInfoSettingsSubtitle: 'अपनी प्रोफ़ाइल विवरण देखें और अपडेट करें',
      changePasswordTitle: 'पासवर्ड बदलें',
      changePasswordSubtitle: 'अपने खाते का पासवर्ड अपडेट करें',
      mobileEmailTitle: 'मोबाइल नंबर और ईमेल',
      mobileEmailSubtitle: 'अपना मोबाइल नंबर और ईमेल प्रबंधित करें',
      languagePrefTitle: 'भाषा प्राथमिकता',
      languagePrefSubtitle: 'अपनी पसंदीदा भाषा चुनें',
      notificationPrefSettingsTitle: 'सूचना प्राथमिकताएँ',
      notificationPrefSettingsSubtitle: 'अपनी सूचना सेटिंग्स प्रबंधित करें',
      appPreferencesTitle: 'ऐप प्राथमिकताएँ',
      appLanguageSettingsTitle: 'ऐप भाषा',
      appLanguageSettingsSubtitle: 'अपनी ऐप भाषा चुनें',
      defaultPosterLanguageTitle: 'डिफ़ॉल्ट पोस्टर भाषा',
      defaultPosterLanguageSubtitle: 'नए पोस्टर के लिए डिफ़ॉल्ट भाषा सेट करें',
      notificationSettingsTitle: 'सूचना सेटिंग्स',
      notificationSettingsSubtitle: 'महत्वपूर्ण अपडेट के बारे में सूचनाएं प्राप्त करें',
      festivalRemindersTitle: 'त्योहार रिमाइंडर',
      festivalRemindersSubtitle: 'त्योहार और इवेंट रिमाइंडर प्राप्त करें',
      appThemeTitle: 'ऐप थीम',
      appThemeSubtitle: 'अपनी पसंदीदा थीम चुनें',
      privacySecurityTitle: 'गोपनीयता और सुरक्षा',
      privacySettingsTitle: 'गोपनीयता सेटिंग्स',
      privacySettingsSubtitle: 'अपना डेटा और गोपनीयता नियंत्रित करें',
      privacySettingsContent: 'हम आपकी गोपनीयता का सम्मान करते हैं। व्यक्तिगत जानकारी आपके डिवाइस पर स्थानीय रूप से संग्रहित होती है.',
      accountSecuritySettingsTitle: 'खाता सुरक्षा',
      accountSecuritySettingsSubtitle: 'सुरक्षा सेटिंग्स प्रबंधित करें',
      accountSecuritySettingsContent: 'आपका खाता सुरक्षित पासवर्ड से सुरक्षित है.',
      activeSessionsTitle: 'सक्रिय सत्र',
      activeSessionsSubtitle: 'अपने लॉग-इन डिवाइस देखें',
      activeSessionsContent: 'आपका वर्तमान सत्र इस डिवाइस पर सक्रिय है.',
      dataPermissionsTitle: 'डेटा और अनुमतियाँ',
      dataPermissionsSubtitle: 'डेटा एक्सेस और अनुमतियाँ प्रबंधित करें',
      dataPermissionsContent: 'ऐप अनुमतियाँ आपकी डिवाइस सेटिंग्स में प्रबंधित की जा सकती हैं.',
      supportTitle: 'सहायता',
      helpSupportSettingsTitle: 'सहायता और सपोर्ट',
      helpSupportSettingsSubtitle: 'जब भी जरूरत हो सहायता प्राप्त करें',
      helpSupportSettingsContent: 'सहायता के लिए, support@panchayatpost.in पर संपर्क करें.',
      faqTitle: 'अक्सर पूछे जाने वाले प्रश्न',
      faqSubtitle: 'सामान्य प्रश्नों के उत्तर खोजें',
      faqContent: 'यहाँ Panchayat Post के बारे में सबसे आम प्रश्नों के उत्तर हैं.',
      contactUsTitle: 'हमसे संपर्क करें',
      contactUsSubtitle: 'हम मदद करने के लिए यहाँ हैं',
      contactUsContent: '📧 support@panchayatpost.in\n📞 1800-123-7262\n⏰ सोम-शनि, 9:00 AM - 6:00 PM',
      aboutAppTitle: 'Panchayat Post के बारे में',
      aboutAppSubtitle: 'ऐप संस्करण, जानकारी और अधिक',
      aboutAppContent: 'Panchayat Post v1.0.0\n\nगाँव समुदायों के लिए सुंदर त्योहार और सरकारी पोस्टर बनाने और साझा करने का मंच.\n\n❤️ भारत के लिए बनाया गया.',
      accountActionsTitle: 'खाता क्रियाएँ',
      logoutSettingsSubtitle: 'अपने खाते से साइन आउट करें',
      deleteAccountTitle: 'खाता हटाएं',
      deleteAccountSubtitle: 'अपना खाता स्थायी रूप से हटाएं',
      deleteAccountMessage: 'यह क्रिया आपके खाते, डिज़ाइन और डेटा को स्थायी रूप से हटा देगी। इसे पूर्ववत नहीं किया जा सकता.',
      deleteAccountAction: 'खाता हटाएं',
    ),
    'en': AppStrings(
      languageName: 'English',
      headingPart1: 'Every voice of your village,\n',
      headingPart2Prefix: 'now with a ',
      headingHighlight: 'beautiful post',
      headingPart2Suffix: '!',
      subtitle: 'Create stunning posters for your village, panchayat, and community.\nChoose ready templates or create your own post\nwith the help of AI.',
      primaryButton: "Let's Get Started",
      secondaryButtonPrefix: 'Already have an account? ',
      secondaryButtonAction: 'Login',
      privacyPolicy: 'Privacy Policy',
      termsAndConditions: 'Terms & Conditions',
      selectLanguageTitle: 'Select Language',
      createAccountTitle: 'Create Account',
      loginTitle: 'Login',
      // Screen 03
      createAccountHeading: 'Create Your Account',
      createAccountSubheading: 'Join Panchayat Post and start\ncreating beautiful posters for your village.',
      fullNameLabel: 'Enter your full name',
      fullNameHint: 'Enter your full name',
      fullNameRequiredError: 'Please enter your full name',
      usernameLabel: 'Create your username',
      usernameHint: 'Create your username',
      usernameHelper: 'You will be able to log in with this username.',
      usernameLengthError: 'Username must be at least 3 characters',
      usernameInvalidFormatError: 'Only letters, numbers and _ allowed',
      usernameTakenError: 'This username is already taken',
      usernameAvailable: 'Username is available',
      passwordLabel: 'Create password',
      passwordHint: 'Create password',
      confirmPasswordLabel: 'Re-enter password',
      confirmPasswordHint: 'Re-enter password',
      passwordInstructionsTitle: 'Password guidelines:',
      passwordRuleMinChars: 'At least 8 characters',
      passwordRuleCase: 'Upper & lowercase',
      passwordRuleNumber: 'At least 1 number',
      passwordMismatchError: 'Passwords do not match',
      passwordWeakError: 'Please meet all password requirements',
      termsAcceptPrefix: 'I accept ',
      termsAndText: ' and ',
      termsAcceptSuffix: '.',
      termsRequiredError: 'Please accept Terms & Conditions.',
      createAccountButton: 'Create Account',
      alreadyHaveAccount: 'Already have an account?',
      loginAction: 'Login',
      registrationSuccess: 'Account created successfully!',
      networkOrServerError: 'Could not connect to server. Please try again.',
      // Screen 04
      loginHeading: 'Welcome Back!',
      loginSubheading: 'Log in to your Panchayat Post account\nand continue creating your posts.',
      loginUsernameLabel: 'Username',
      loginUsernameHint: 'Enter your username',
      loginUsernameRequiredError: 'Please enter your username',
      loginPasswordLabel: 'Password',
      loginPasswordHint: 'Enter your password',
      loginPasswordRequiredError: 'Please enter your password',
      rememberMeLabel: 'Remember me',
      forgotPasswordLabel: 'Forgot Password?',
      forgotPasswordTitle: 'Password Recovery Assistance',
      forgotPasswordMessage: 'For account security, please contact your Gram Panchayat administrator or support team to reset your password:\n\n📧 support@panchayatpost.in\n📞 Helpline: 1800-123-7262',
      loginButtonLabel: 'Login',
      noAccountPrompt: "Don't have an account?",
      createAccountAction: 'Create Account',
      loginSuccessMessage: 'Login successful!',
      accountNotFoundError: 'Account not found with this username.',
      invalidPasswordError: 'Incorrect password entered.',
      // Screen 05
      forgotPasswordHeading: 'Forgot Password?',
      forgotPasswordSubheading: "Don't worry! Provide your account details.\nOur team will help you recover your account.",
      recoveryUsernameLabel: 'Your Username',
      recoveryUsernameHint: 'Enter registered username',
      recoveryUsernameHelper: 'Enter the username of your account.',
      recoveryUsernameRequired: 'Please enter your registered username',
      recoveryInfoBanner: 'After receiving your request, our support team\nwill assist with the next steps for account recovery.',
      sendRecoveryButton: 'Send Recovery Request',
      needMoreHelpDivider: 'Need More Help?',
      contactSupportAction: 'Contact Support',
      backToLoginButton: 'Back to Login',
      recoveryRequestSubmitted: 'Request Submitted Successfully!',
      recoveryReferenceNumber: 'Recovery Reference Number',
      recoveryInstructions: 'Your request has been logged. Please save this reference number and contact your Gram Panchayat administrator for assistance.',
      rateLimitError: 'Too many requests. Please try again after a few minutes.',
      supportContactDetailsTitle: 'Panchayat Post Help Center',
      supportContactDetailsBody: 'For Gram Panchayat account assistance and password recovery:\n\n📧 Email: support@panchayatpost.in\n📞 Toll-free Helpline: 1800-123-7262\n⏰ Hours: 9:00 AM - 6:00 PM (Mon-Sat)\n🏛️ Local Office: Your Taluka/District Panchayat IT Coordinator',
      // Screen 06
      recoveryStatusHeading: 'Your Request Has Been Received!',
      recoveryStatusSubheading: 'Your account recovery request has been submitted\nsuccessfully. Our team will verify it and\nprovide further details.',
      requestIdLabel: 'Request ID:',
      usernameRowLabel: 'Username:',
      submittedDateLabel: 'Submitted Date:',
      currentStatusLabel: 'Current Status:',
      statusSubmitted: 'Submitted',
      statusUnderReview: 'Under Review',
      statusAdditionalInfoRequired: 'Info Required',
      statusResolved: 'Resolved',
      statusRejected: 'Rejected',
      timelineStep1Title: 'Request Received',
      timelineStep1Subtitle: 'Your recovery request has been received.',
      timelineStep2Title: 'Verification In Progress',
      timelineStep2Subtitle: 'Our team is reviewing your request.',
      timelineStep3Title: 'Next Action',
      timelineStep3Subtitle: 'You will receive further instructions once verified.',
      recoveryNoticeBanner: 'For further information regarding your request,\nyou can contact our support team.',
      contactSupportButton: 'Contact Support',
      goToLoginScreenButton: 'Go to Login Screen',
      refreshStatusTooltip: 'Refresh Status',
      lastUpdatedLabel: 'Last updated',
      // Screen 07
      profileSetupHeaderStep: 'Profile Setup',
      profileSetupHeading: 'Create Your Profile',
      profileSetupSubheading: 'Add a few details to kickstart\nyour Panchayat Post experience.',
      addPhotoAction: 'Add Photo',
      changePhotoAction: 'Change Photo',
      removePhotoAction: 'Remove Photo',
      takePhotoFromCamera: 'Take Photo from Camera',
      chooseFromGallery: 'Choose from Gallery',
      orDivider: 'or',
      fullNameFieldLabel: 'Full Name',
      fullNameFieldHint: 'Enter your name',
      displayNameFieldLabel: 'Display Name',
      displayNameFieldHint: 'How should other users know you?',
      displayNameHelper: 'This name will appear on your profile.',
      villageCityFieldLabel: 'Village / City',
      villageCityFieldHint: 'Name of your village or city',
      stateFieldLabel: 'State',
      stateFieldHint: 'Select state',
      searchStateHint: 'Search state...',
      selectStateTitle: 'Select State',
      profileInfoBanner: 'Your profile details help personalize and enrich\nyour Panchayat Post experience.',
      saveProfileButton: 'Save Profile',
      skipForNowButton: 'Do This Later',
      profileSavedSuccess: 'Profile saved successfully!',
      photoPermissionDenied: 'Permission is required to select photos.',
      photoSizeTooLargeError: 'Image size must be less than 5MB.',
      unsupportedImageFormatError: 'Only PNG, JPG or WEBP formats are supported.',
      displayNameRequiredError: 'Please enter a display name',
      // Screen 08
      confirmationHeading: 'Congratulations!',
      confirmationSubtitleComplete: 'Your profile is ready.',
      confirmationSubtitleIncomplete: 'Welcome to Panchayat Post!',
      confirmationBodyText: 'Now start creating stunning posters for your\nvillage, panchayat, and community with\nPanchayat Post.',
      profileStatusCompletedBadge: 'Profile Completed',
      profileStatusPendingBadge: 'Profile Pending',
      noVillageProvided: 'Village not set',
      featuresSectionTitle: 'What can you do with Panchayat Post?',
      readyTemplatesTitle: 'Ready Templates',
      readyTemplatesDesc: 'Choose ready-made beautiful templates.',
      aiPosterCreationTitle: 'AI Poster Creation',
      aiPosterCreationDesc: 'Create posters from your thoughts using AI.',
      easyEditingTitle: 'Easy Editing',
      easyEditingDesc: 'Easily customize text, photos and design.',
      letsStartButton: "Let's Get Started",
      bottomTagline: 'Turn your thoughts into beautiful posters.',
      // Home Dashboard
      homeHeaderTitle: 'Panchayat Post',
      greetingPrefix: 'Hello',
      editProfileButton: 'Edit Profile',
      posterTemplatesTitle: 'Poster Templates',
      createWithAiTitle: 'Create with AI',
      createWithAiDesc: 'Turn your ideas into beautiful posters in 1 minute.',
      browseTemplatesAction: 'Choose Template',
      screenNavigatorTitle: 'Test All Screens (Screen Navigator)',
      screenNavigatorDesc: 'Tap to jump directly to any screen',
      logoutDialogTitle: 'Log Out',
      logoutDialogMessage: 'Are you sure you want to log out of your account?',
      logoutConfirmButton: 'Yes, Log Out',
      cancelButton: 'Cancel',
      categoriesTitle: 'Popular Categories',
      categoryMeeting: 'Panchayat Meeting',
      categoryDevelopment: 'Village Development',
      categoryFestivals: 'Festivals & Celebrations',
      categoryNational: 'National Days',
      goodMorningGreeting: 'Good Morning!',
      welcomeUserPrefix: 'Welcome, ',
      heroBannerCreate: 'Create Beautiful',
      heroBannerFestival: 'Festival Posts',
      heroBannerSubtitle: 'Celebrate every occasion with beautiful designs.',
      heroBannerButton: 'Explore Designs',
      createSomethingNewTitle: 'Create Something New',
      cardFestivalPosters: 'Festival\nPosters',
      cardPanchayatPosts: 'Panchayat\nPosts',
      cardAiPoster: 'AI Poster',
      popularTemplatesTitle: 'Popular Templates',
      seeAllAction: 'See All',
      upcomingFestivalsTitle: 'Upcoming Festivals',
      festivalNavratri: 'Navratri',
      festivalDiwali: 'Diwali',
      festivalBhaiBeej: 'Bhai Beej',
      navratriDate: '22 Oct',
      diwaliDate: '12 Nov',
      bhaiBeejDate: '23 Nov',
      navHome: 'Home',
      navFestivals: 'Festivals',
      navTemplates: 'Templates',
      navMyDesigns: 'My Designs',
      navProfile: 'Profile',
      notificationsTitle: 'Notifications',
      noNewNotifications: 'No new notifications',
      festivalsPageTitle: 'Festivals',
      festivalsPageSubtitle: 'Discover beautiful festival designs',
      searchFestivalsHint: 'Search festivals, occasions...',
      upcomingFestivalBadge: 'UPCOMING FESTIVAL',
      navratriCelebrationTitle: 'Navratri',
      navratriCelebrationScript: 'Celebration',
      exploreFestiveDesignsSubtitle: 'Explore beautiful festive designs',
      viewDesignsButton: 'View Designs',
      exploreCategoriesTitle: 'Explore Categories',
      categoryAll: 'All',
      categoryHinduFestivals: 'Hindu Festivals',
      categoryNationalDays: 'National Days',
      categoryReligiousEvents: 'Religious Events',
      categoryCulturalEvents: 'Cultural Events',
      upcomingFestivalsHeader: 'Upcoming Festivals',
      viewCalendarAction: 'View Calendar',
      exploreAllFestivalsTitle: 'Explore All Festivals',
      upcomingStatusBadge: 'Upcoming',
      noFestivalsFound: 'No festivals found',
      clearSearchAction: 'Clear Search',
      filterTitle: 'Filter',
      filterAllOption: 'All Festivals',
      filterUpcomingOnly: 'Upcoming Only',
      // Screen 11
      festivalDetailsTitle: 'Festival Details',
      breadcrumbFestivals: 'Festivals',
      breadcrumbFestivalDetails: 'Festival Details',
      celebrateGarbaSubtitle: 'Celebrate the joy of Garba and devotion',
      shareFestivalButton: 'Share Festival',
      aboutThisFestivalHeader: 'About This Festival',
      aboutFestivalDesc: 'Celebrate Navratri with devotion, music, traditional Garba and beautiful festive designs.',
      festivalCategoryLabel: 'Festival Category',
      festivalDateLabel: 'Festival Date',
      celebrationTypeLabel: 'Celebration Type',
      categoryCulturalValue: 'Cultural',
      celebrationTypeValue: 'Traditional',
      createFestivalPostsTitle: 'Create Festival Posts',
      createFestivalPostsSubtitle: 'Choose a beautiful design for your celebration.',
      popularDesignStylesTitle: 'Popular Design Styles',
      styleTraditionalLabel: 'Traditional',
      styleModernLabel: 'Modern',
      styleDevotionalLabel: 'Devotional',
      styleEventAnnouncementLabel: 'Event Announcement',
      createYourOwnTitle: 'Create Your Own Festival Post',
      createYourOwnSubtitle: 'Customize a design with your own name, photo and message.',
      startNowButton: 'Start Now',
      // Screen 12
      editYourPosterTitle: 'Edit Your Poster',
      editingModeBadge: 'Editing',
      customizeYourDesignTitle: 'Customize Your Design',
      toolEditText: 'Edit Text',
      toolReplaceImage: 'Replace Image',
      toolChangeColor: 'Change Color',
      toolPosition: 'Position',
      toolDuplicate: 'Duplicate',
      tabText: 'Text',
      tabImages: 'Images',
      tabColors: 'Colors',
      tabBackground: 'Background',
      tabFonts: 'Fonts',
      headlineTextLabel: 'Headline Text',
      supportingTextLabel: 'Supporting Text',
      fontStyleLabel: 'Font Style',
      textAlignmentLabel: 'Text Alignment',
      textColorLabel: 'Text Color',
      previewPosterButton: 'Preview Poster',
      saveDesignButton: 'Save Design',
      allChangesSavedLabel: 'All changes saved',
      designSavedSuccess: 'Poster design saved successfully!',
      // Screen 13
      yourPosterTitle: 'Your Poster',
      yourDesignIsReady: 'Your design is ready!',
      posterCreatedSuccessfully: 'Poster Created Successfully',
      readyToDownloadAndShare: 'Your design is ready to download and share.',
      customDesignBadge: 'Custom Design',
      previewAction: 'Preview',
      editAction: 'Edit',
      duplicateAction: 'Duplicate',
      moreAction: 'More',
      downloadYourPosterTitle: 'Download Your Poster',
      highQualityOption: 'High Quality',
      downloadPosterButton: 'Download Poster',
      shareYourCreationTitle: 'Share Your Creation',
      whatsAppAction: 'WhatsApp',
      instagramAction: 'Instagram',
      shareMoreAction: 'Share More',
      savedInMyDesignsBadge: 'Saved in My Designs',
      sharePosterButton: 'Share Poster',
      duplicateCreatedSuccess: 'Duplicate poster saved successfully!',
      // Screen 14
      myDesignsTitle: 'My Designs',
      myDesignsSubtitle: 'All your creative designs in one place',
      totalDesignsLabel: 'Total Designs',
      recentlyCreatedLabel: 'Recently Created',
      favoritesLabel: 'Favorites',
      searchYourDesignsHint: 'Search your designs...',
      categoryAllDesigns: 'All Designs',
      categoryPanchayat: 'Panchayat',
      categoryBusiness: 'Business',
      yourCreationsTitle: 'Your Creations',
      editDesignMenu: 'Edit Design',
      previewMenu: 'Preview',
      duplicateMenu: 'Duplicate',
      downloadMenu: 'Download',
      shareMenu: 'Share',
      deleteMenu: 'Delete',
      deleteConfirmTitle: 'Delete Design?',
      deleteConfirmMessage: 'Are you sure you want to permanently delete this poster?',
      confirmDeleteAction: 'Delete',
      cancelAction: 'Cancel',
      noDesignsYetTitle: 'No Designs Yet',
      noDesignsYetSubtitle: 'Your creations will appear here.',
      createFirstPosterButton: '+ Create Your First Poster',
      // Screen 15
      profileTitle: 'My Profile',
      profileSubtitle: 'Manage your account and preferences',
      verifiedAccountBadge: 'Verified Account',
      personalInfoTitle: 'Personal Information',
      mobileNumberLabel: 'Mobile Number',
      emailAddressLabel: 'Email Address',
      villageCityLabel: 'Village / City',
      districtLabel: 'District',
      preferencesTitle: 'Preferences',
      appLanguageLabel: 'App Language',
      notificationPrefLabel: 'Notification Preferences',
      themePrefLabel: 'Theme Preference',
      lightThemeOption: 'Light Theme',
      accountSupportTitle: 'Account & Support',
      accountSecurityLabel: 'Account Security',
      helpSupportLabel: 'Help & Support',
      aboutPanchayatPostLabel: 'About Panchayat Post',
      privacyPolicyLabel: 'Privacy Policy',
      termsConditionsLabel: 'Terms & Conditions',
      logoutAction: 'Log Out',
      logoutConfirmTitle: 'Log Out?',
      logoutConfirmMessage: 'Are you sure you want to log out of your Panchayat Post account?',
      // Screen 16
      settingsTitle: 'Settings & Preferences',
      settingsSubtitle: 'Manage your app experience.',
      accountPreferencesTitle: 'Account Preferences',
      personalInfoSettingsTitle: 'Personal Information',
      personalInfoSettingsSubtitle: 'View and update your profile details',
      changePasswordTitle: 'Change Password',
      changePasswordSubtitle: 'Update your account password',
      mobileEmailTitle: 'Mobile Number & Email',
      mobileEmailSubtitle: 'Manage your mobile number and email address',
      languagePrefTitle: 'Language Preference',
      languagePrefSubtitle: 'Choose your preferred language',
      notificationPrefSettingsTitle: 'Notification Preferences',
      notificationPrefSettingsSubtitle: 'Manage your notification settings',
      appPreferencesTitle: 'App Preferences',
      appLanguageSettingsTitle: 'App Language',
      appLanguageSettingsSubtitle: 'Select your app language',
      defaultPosterLanguageTitle: 'Default Poster Language',
      defaultPosterLanguageSubtitle: 'Set default language for new posters',
      notificationSettingsTitle: 'Notification Settings',
      notificationSettingsSubtitle: 'Get notified about important updates',
      festivalRemindersTitle: 'Festival Reminders',
      festivalRemindersSubtitle: 'Receive festival and event reminders',
      appThemeTitle: 'App Theme',
      appThemeSubtitle: 'Choose your preferred theme',
      privacySecurityTitle: 'Privacy & Security',
      privacySettingsTitle: 'Privacy Settings',
      privacySettingsSubtitle: 'Control your data and privacy',
      privacySettingsContent: 'We respect your privacy. Personal information is stored locally on your device and is not shared with third parties.',
      accountSecuritySettingsTitle: 'Account Security',
      accountSecuritySettingsSubtitle: 'Manage security settings',
      accountSecuritySettingsContent: 'Your account is protected with a secure password.',
      activeSessionsTitle: 'Active Sessions',
      activeSessionsSubtitle: 'View your logged in devices',
      activeSessionsContent: 'Your current session is active on this device.',
      dataPermissionsTitle: 'Data & Permissions',
      dataPermissionsSubtitle: 'Manage data access and permissions',
      dataPermissionsContent: 'App permissions can be managed in your device settings.',
      supportTitle: 'Support',
      helpSupportSettingsTitle: 'Help & Support',
      helpSupportSettingsSubtitle: 'Get help whenever you need',
      helpSupportSettingsContent: 'For assistance, contact us at support@panchayatpost.in. Our support team is available Monday to Saturday, 9 AM – 6 PM IST.',
      faqTitle: 'Frequently Asked Questions',
      faqSubtitle: 'Find answers to common questions',
      faqContent: 'Here are answers to the most common questions about Panchayat Post.',
      contactUsTitle: 'Contact Us',
      contactUsSubtitle: "We're here to help",
      contactUsContent: '📧 support@panchayatpost.in\n📞 1800-123-7262\n⏰ Mon-Sat, 9:00 AM - 6:00 PM',
      aboutAppTitle: 'About Panchayat Post',
      aboutAppSubtitle: 'App version, info and more',
      aboutAppContent: 'Panchayat Post v1.0.0\n\nA platform for village communities to create and share beautiful festival and government posters.\n\nBuilt with ❤️ for Bharat.',
      accountActionsTitle: 'Account Actions',
      logoutSettingsSubtitle: 'Sign out from your account',
      deleteAccountTitle: 'Delete Account',
      deleteAccountSubtitle: 'Permanently remove your account',
      deleteAccountMessage: 'This action will permanently delete your account, designs and data. This action cannot be undone.',
      deleteAccountAction: 'Delete Account',
    ),
  };

  /// Returns strings for the given language code, defaulting to Gujarati.
  static AppStrings of(String languageCode) {
    return _localizedValues[languageCode] ?? _localizedValues[defaultLanguageCode]!;
  }

  /// List of all supported languages for the selector.
  static const List<Map<String, String>> supportedLanguages = [
    {'code': 'gu', 'name': 'ગુજરાતી', 'englishName': 'Gujarati'},
    {'code': 'hi', 'name': 'हिंदी', 'englishName': 'Hindi'},
    {'code': 'en', 'name': 'English', 'englishName': 'English'},
  ];
}
