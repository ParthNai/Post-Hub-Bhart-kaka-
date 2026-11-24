import 'package:flutter/material.dart';
import 'package:panchayat_post/features/auth/presentation/screens/create_account_screen.dart';
import 'package:panchayat_post/features/auth/presentation/screens/forgot_password_screen.dart';
import 'package:panchayat_post/features/auth/presentation/screens/login_screen.dart';
import 'package:panchayat_post/features/auth/presentation/screens/onboarding_confirmation_screen.dart';
import 'package:panchayat_post/features/auth/presentation/screens/profile_setup_screen.dart';
import 'package:panchayat_post/features/auth/presentation/screens/recovery_status_screen.dart';
import 'package:panchayat_post/features/editor/presentation/screens/my_designs_screen.dart';
import 'package:panchayat_post/features/editor/presentation/screens/poster_editor_screen.dart';
import 'package:panchayat_post/features/editor/presentation/screens/poster_preview_screen.dart';
import 'package:panchayat_post/features/editor/presentation/screens/quick_customize_screen.dart';
import 'package:panchayat_post/features/festivals/presentation/screens/festival_detail_screen.dart';
import 'package:panchayat_post/features/festivals/presentation/screens/festivals_screen.dart';
import 'package:panchayat_post/features/home/presentation/screens/home_screen.dart';
import 'package:panchayat_post/features/profile/presentation/screens/profile_screen.dart';
import 'package:panchayat_post/features/profile/presentation/screens/settings_screen.dart';
import 'package:panchayat_post/features/splash/presentation/screens/splash_screen.dart';
import 'package:panchayat_post/features/welcome/presentation/screens/welcome_screen.dart';

/// Centralized application route definitions.
class AppRoutes {
  AppRoutes._();

  /// Screen 01: Splash Screen
  static const String splash = '/';

  /// Screen 02: Welcome / Onboarding Screen
  static const String welcome = '/welcome';

  /// Screen 03: Create Account Screen
  static const String createAccount = '/create-account';

  /// Screen 04: Login Screen (Username + Password)
  static const String login = '/login';

  /// Screen 05: Forgot Password / Account Recovery Screen
  static const String forgotPassword = '/forgot-password';

  /// Screen 06: Account Recovery Status & Confirmation Screen
  static const String recoveryStatus = '/recovery-status';

  /// Screen 07: User Profile Setup Screen
  static const String profileSetup = '/profile-setup';

  /// Screen 08: Profile Setup Confirmation & Welcome Onboarding Screen
  static const String onboardingConfirmation = '/onboarding-confirmation';

  /// Screen 09: Home Dashboard Screen
  static const String home = '/home';

  /// Screen 10: Festival & Upcoming Events Listing
  static const String festivals = '/festivals';

  /// Screen 11: Festival Details & Poster Collection
  static const String festivalDetail = '/festival-detail';

  /// Screen 12: Poster Template Editor & Customization Studio
  static const String posterEditor = '/poster-editor';

  /// Screen 13: Final Poster Preview, Download & Share
  static const String posterPreview = '/poster-preview';

  /// Screen 14: My Designs — Saved Posters Library
  static const String myDesigns = '/my-designs';

  /// Screen 15: User Profile & Account Management
  static const String profile = '/profile';

  /// Screen 16: Settings & Preferences
  static const String settings = '/settings';

  /// Screen 17: Quick Customize
  static const String quickCustomize = '/quick-customize';

  /// Route generator map
  static Map<String, WidgetBuilder> get routes => {
        splash: (context) => const SplashScreen(),
        welcome: (context) => const WelcomeScreen(),
        createAccount: (context) => const CreateAccountScreen(),
        login: (context) => const LoginScreen(),
        forgotPassword: (context) => const ForgotPasswordScreen(),
        recoveryStatus: (context) => const RecoveryStatusScreen(),
        profileSetup: (context) => const ProfileSetupScreen(),
        onboardingConfirmation: (context) => const OnboardingConfirmationScreen(),
        home: (context) => const HomeScreen(),
        festivals: (context) => const FestivalsScreen(),
        festivalDetail: (context) => const FestivalDetailScreen(),
        posterEditor: (context) => const PosterEditorScreen(),
        posterPreview: (context) => const PosterPreviewScreen(),
        myDesigns: (context) => const MyDesignsScreen(),
        profile: (context) => const ProfileScreen(),
        settings: (context) => const SettingsScreen(),
        quickCustomize: (context) => const QuickCustomizeScreen(),
      };
}
