import 'package:flutter/material.dart';
import 'package:panchayat_post/features/auth/presentation/screens/create_account_screen.dart';
import 'package:panchayat_post/features/auth/presentation/screens/forgot_password_screen.dart';
import 'package:panchayat_post/features/auth/presentation/screens/login_screen.dart';
import 'package:panchayat_post/features/auth/presentation/screens/onboarding_confirmation_screen.dart';
import 'package:panchayat_post/features/auth/presentation/screens/profile_setup_screen.dart';
import 'package:panchayat_post/features/auth/presentation/screens/recovery_status_screen.dart';
import 'package:panchayat_post/features/festivals/presentation/screens/festivals_screen.dart';
import 'package:panchayat_post/features/home/presentation/screens/home_screen.dart';
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
      };
}
