import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';
import 'package:panchayat_post/features/auth/data/auth_service.dart';
import 'package:panchayat_post/features/profile/presentation/screens/profile_screen.dart';

Widget buildTestableProfileScreen({
  Size size = const Size(390, 1200),
  LocaleController? localeController,
  AuthService? authService,
}) {
  return LocaleScope(
    controller: localeController ?? LocaleController(),
    child: MaterialApp(
      routes: {
        for (final entry in AppRoutes.routes.entries)
          if (entry.key != AppRoutes.splash) entry.key: entry.value,
      },
      home: MediaQuery(
        data: MediaQueryData(size: size),
        child: ProfileScreen(authService: authService),
      ),
    ),
  );
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  late LocaleController englishController;

  setUp(() {
    SharedPreferences.setMockInitialValues({});
    englishController = LocaleController(initialLanguage: 'en');
  });

  group('Screen 15: Profile Screen Core UI Tests', () {
    testWidgets('Renders header with title, subtitle and settings icon', (tester) async {
      await tester.pumpWidget(buildTestableProfileScreen(localeController: englishController));
      await tester.pumpAndSettle();

      expect(find.byKey(const ValueKey('profile_header')), findsOneWidget);
      expect(find.byKey(const ValueKey('profile_page_title')), findsOneWidget);
      expect(find.byKey(const ValueKey('profile_page_subtitle')), findsOneWidget);
      expect(find.byKey(const ValueKey('profile_settings_btn')), findsOneWidget);
    });

    testWidgets('Renders profile overview card with name and edit button', (tester) async {
      await tester.pumpWidget(buildTestableProfileScreen(localeController: englishController));
      await tester.pumpAndSettle();

      expect(find.byKey(const ValueKey('profile_overview_card')), findsOneWidget);
      expect(find.byKey(const ValueKey('edit_profile_btn')), findsOneWidget);
      expect(find.byKey(const ValueKey('profile_user_name')), findsOneWidget);
    });

    testWidgets('Renders Personal Information section', (tester) async {
      await tester.pumpWidget(buildTestableProfileScreen(localeController: englishController));
      await tester.pumpAndSettle();

      expect(find.byKey(const ValueKey('personal_info_section')), findsOneWidget);
      expect(find.text('Personal Information'), findsOneWidget);
      expect(find.text('Mobile Number'), findsOneWidget);
      expect(find.text('Email Address'), findsOneWidget);
      expect(find.text('Village / City'), findsOneWidget);
      expect(find.text('District'), findsOneWidget);
    });

    testWidgets('Renders Preferences section with language chips and notifications', (tester) async {
      await tester.pumpWidget(buildTestableProfileScreen(localeController: englishController));
      await tester.pumpAndSettle();

      expect(find.byKey(const ValueKey('preferences_section')), findsOneWidget);
      expect(find.text('Preferences'), findsOneWidget);
      expect(find.text('App Language'), findsOneWidget);
      expect(find.text('Notification Preferences'), findsOneWidget);
      expect(find.text('Theme Preference'), findsOneWidget);

      // Language chips
      expect(find.byKey(const ValueKey('lang_chip_gu')), findsOneWidget);
      expect(find.byKey(const ValueKey('lang_chip_en')), findsOneWidget);
      expect(find.byKey(const ValueKey('lang_chip_hi')), findsOneWidget);

      // Notifications switch
      expect(find.byKey(const ValueKey('notifications_switch')), findsOneWidget);
    });

    testWidgets('Renders Account & Support section with all options', (tester) async {
      await tester.pumpWidget(buildTestableProfileScreen(localeController: englishController));
      await tester.pumpAndSettle();

      expect(find.byKey(const ValueKey('account_support_section')), findsOneWidget);
      expect(find.byKey(const ValueKey('account_security_row')), findsOneWidget);
      expect(find.byKey(const ValueKey('help_support_row')), findsOneWidget);
      expect(find.byKey(const ValueKey('about_panchayat_row')), findsOneWidget);
      expect(find.byKey(const ValueKey('privacy_policy_row')), findsOneWidget);
      expect(find.byKey(const ValueKey('terms_conditions_row')), findsOneWidget);
    });

    testWidgets('Renders Logout button', (tester) async {
      await tester.pumpWidget(buildTestableProfileScreen(localeController: englishController));
      await tester.pumpAndSettle();

      expect(find.byKey(const ValueKey('logout_btn')), findsOneWidget);
      expect(find.text('Log Out'), findsOneWidget);
    });

    testWidgets('Renders bottom navigation bar with Profile active', (tester) async {
      await tester.pumpWidget(buildTestableProfileScreen(localeController: englishController));
      await tester.pumpAndSettle();

      expect(find.byKey(const ValueKey('nav_profile')), findsOneWidget);
      expect(find.byKey(const ValueKey('nav_home')), findsOneWidget);
      expect(find.byKey(const ValueKey('nav_festivals')), findsOneWidget);
      expect(find.byKey(const ValueKey('nav_templates')), findsOneWidget);
      expect(find.byKey(const ValueKey('nav_my_designs')), findsOneWidget);
    });
  });

  group('Screen 15: Interactive Functionality Tests', () {
    testWidgets('Tapping language chip changes language selection', (tester) async {
      await tester.pumpWidget(buildTestableProfileScreen(localeController: englishController));
      await tester.pumpAndSettle();

      final chipFinder = find.byKey(const ValueKey('lang_chip_gu'));
      await tester.scrollUntilVisible(chipFinder, 100);
      await tester.pumpAndSettle();

      await tester.tap(chipFinder);
      await tester.pumpAndSettle();

      expect(englishController.currentLanguageCode, 'gu');
    });

    testWidgets('Toggling notifications switch changes state', (tester) async {
      await tester.pumpWidget(buildTestableProfileScreen(localeController: englishController));
      await tester.pumpAndSettle();

      final switchFinder = find.byKey(const ValueKey('notifications_switch'));
      expect(switchFinder, findsOneWidget);

      await tester.scrollUntilVisible(switchFinder, 100);
      await tester.pumpAndSettle();

      final initialSwitch = tester.widget<Switch>(switchFinder);
      final initialValue = initialSwitch.value;

      await tester.tap(switchFinder);
      await tester.pumpAndSettle();

      final updatedSwitch = tester.widget<Switch>(switchFinder);
      expect(updatedSwitch.value, !initialValue);
    });

    testWidgets('Tapping Account Security opens info sheet', (tester) async {
      await tester.pumpWidget(buildTestableProfileScreen(localeController: englishController));
      await tester.pumpAndSettle();

      final rowFinder = find.byKey(const ValueKey('account_security_row'));
      await tester.scrollUntilVisible(rowFinder, 100);
      await tester.pumpAndSettle();

      await tester.tap(rowFinder);
      await tester.pumpAndSettle();

      expect(find.text('Account Security'), findsWidgets);
    });

    testWidgets('Tapping Log Out shows confirmation dialog', (tester) async {
      await tester.pumpWidget(buildTestableProfileScreen(localeController: englishController));
      await tester.pumpAndSettle();

      final logoutBtnFinder = find.byKey(const ValueKey('logout_btn'));
      await tester.scrollUntilVisible(logoutBtnFinder, 150);
      await tester.pumpAndSettle();

      await tester.tap(logoutBtnFinder);
      await tester.pumpAndSettle();

      expect(find.byKey(const ValueKey('logout_dialog_title')), findsOneWidget);
      expect(find.byKey(const ValueKey('logout_cancel_btn')), findsOneWidget);
      expect(find.byKey(const ValueKey('logout_confirm_btn')), findsOneWidget);
    });

    testWidgets('Cancelling logout dialog keeps user on profile screen', (tester) async {
      await tester.pumpWidget(buildTestableProfileScreen(localeController: englishController));
      await tester.pumpAndSettle();

      final logoutBtnFinder = find.byKey(const ValueKey('logout_btn'));
      await tester.scrollUntilVisible(logoutBtnFinder, 150);
      await tester.pumpAndSettle();

      await tester.tap(logoutBtnFinder);
      await tester.pumpAndSettle();

      await tester.tap(find.byKey(const ValueKey('logout_cancel_btn')));
      await tester.pumpAndSettle();

      // Profile screen still visible
      expect(find.byKey(const ValueKey('profile_header')), findsOneWidget);
    });
  });

  group('Screen 15: Responsive Layout Tests', () {
    final deviceSizes = [
      const Size(360, 640),
      const Size(390, 844),
      const Size(412, 915),
      const Size(768, 1024),
    ];

    for (final size in deviceSizes) {
      testWidgets('Renders cleanly on ${size.width}x${size.height} without overflow', (tester) async {
        await tester.pumpWidget(buildTestableProfileScreen(
          size: size,
          localeController: englishController,
        ));
        await tester.pumpAndSettle();

        expect(find.byKey(const ValueKey('profile_header')), findsOneWidget);
        expect(tester.takeException(), isNull);
      });
    }
  });
}
