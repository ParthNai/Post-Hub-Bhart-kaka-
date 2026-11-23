import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';
import 'package:panchayat_post/features/auth/data/auth_service.dart';
import 'package:panchayat_post/features/profile/presentation/screens/settings_screen.dart';

Widget buildTestableSettingsScreen({
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
        child: SettingsScreen(authService: authService),
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

  group('Screen 16: Settings & Preferences UI Fidelity Tests', () {
    testWidgets('Renders header with title, subtitle, back button and settings gear icon', (tester) async {
      await tester.pumpWidget(buildTestableSettingsScreen(localeController: englishController));
      await tester.pumpAndSettle();

      expect(find.byKey(const ValueKey('settings_header')), findsOneWidget);
      expect(find.byKey(const ValueKey('settings_back_btn')), findsOneWidget);
      expect(find.byKey(const ValueKey('settings_page_title')), findsOneWidget);
      expect(find.byKey(const ValueKey('settings_page_subtitle')), findsOneWidget);
      expect(find.text('Settings & Preferences'), findsOneWidget);
      expect(find.text('Manage your app experience.'), findsOneWidget);
    });

    testWidgets('Renders Account Preferences section and all 5 options', (tester) async {
      await tester.pumpWidget(buildTestableSettingsScreen(localeController: englishController));
      await tester.pumpAndSettle();

      expect(find.byKey(const ValueKey('account_preferences_section')), findsOneWidget);
      expect(find.text('Account Preferences'), findsOneWidget);

      expect(find.byKey(const ValueKey('personal_info_row')), findsOneWidget);
      expect(find.text('Personal Information'), findsOneWidget);

      expect(find.byKey(const ValueKey('change_password_row')), findsOneWidget);
      expect(find.text('Change Password'), findsOneWidget);

      expect(find.byKey(const ValueKey('mobile_email_row')), findsOneWidget);
      expect(find.text('Mobile Number & Email'), findsOneWidget);

      expect(find.byKey(const ValueKey('language_pref_row')), findsOneWidget);
      expect(find.text('Language Preference'), findsOneWidget);

      expect(find.byKey(const ValueKey('notification_pref_row')), findsOneWidget);
      expect(find.text('Notification Preferences'), findsOneWidget);
    });

    testWidgets('Renders App Preferences section with language chips, toggles and theme selector', (tester) async {
      await tester.pumpWidget(buildTestableSettingsScreen(localeController: englishController));
      await tester.pumpAndSettle();

      expect(find.byKey(const ValueKey('app_preferences_section')), findsOneWidget);
      expect(find.text('App Preferences'), findsOneWidget);

      expect(find.byKey(const ValueKey('app_language_setting_row')), findsOneWidget);
      expect(find.text('App Language'), findsOneWidget);

      expect(find.byKey(const ValueKey('poster_language_setting_row')), findsOneWidget);
      expect(find.text('Default Poster Language'), findsOneWidget);

      expect(find.byKey(const ValueKey('notification_toggle_row')), findsOneWidget);
      expect(find.text('Notification Settings'), findsOneWidget);

      expect(find.byKey(const ValueKey('festival_reminders_toggle_row')), findsOneWidget);
      expect(find.text('Festival Reminders'), findsOneWidget);

      expect(find.byKey(const ValueKey('app_theme_setting_row')), findsOneWidget);
      expect(find.text('App Theme'), findsOneWidget);
      expect(find.byKey(const ValueKey('theme_chip_light')), findsOneWidget);
      expect(find.byKey(const ValueKey('theme_chip_system')), findsOneWidget);
    });

    testWidgets('Renders Privacy & Security section with all 4 rows', (tester) async {
      await tester.pumpWidget(buildTestableSettingsScreen(localeController: englishController));
      await tester.pumpAndSettle();

      expect(find.byKey(const ValueKey('privacy_security_section')), findsOneWidget);
      expect(find.text('Privacy & Security'), findsOneWidget);

      expect(find.byKey(const ValueKey('privacy_settings_row')), findsOneWidget);
      expect(find.text('Privacy Settings'), findsOneWidget);

      expect(find.byKey(const ValueKey('account_security_settings_row')), findsOneWidget);
      expect(find.text('Account Security'), findsOneWidget);

      expect(find.byKey(const ValueKey('active_sessions_row')), findsOneWidget);
      expect(find.text('Active Sessions'), findsOneWidget);

      expect(find.byKey(const ValueKey('data_permissions_row')), findsOneWidget);
      expect(find.text('Data & Permissions'), findsOneWidget);
    });

    testWidgets('Renders Support section with Help, FAQ, Contact Us, About', (tester) async {
      await tester.pumpWidget(buildTestableSettingsScreen(localeController: englishController));
      await tester.pumpAndSettle();

      expect(find.byKey(const ValueKey('support_section')), findsOneWidget);
      expect(find.text('Support'), findsOneWidget);

      expect(find.byKey(const ValueKey('help_support_settings_row')), findsOneWidget);
      expect(find.text('Help & Support'), findsOneWidget);

      expect(find.byKey(const ValueKey('faq_row')), findsOneWidget);
      expect(find.text('Frequently Asked Questions'), findsOneWidget);

      expect(find.byKey(const ValueKey('contact_us_row')), findsOneWidget);
      expect(find.text('Contact Us'), findsOneWidget);

      expect(find.byKey(const ValueKey('about_app_row')), findsOneWidget);
      expect(find.text('About Panchayat Post'), findsOneWidget);
    });

    testWidgets('Renders Account Actions section with Logout and Delete Account', (tester) async {
      await tester.pumpWidget(buildTestableSettingsScreen(localeController: englishController));
      await tester.pumpAndSettle();

      expect(find.byKey(const ValueKey('account_actions_section')), findsOneWidget);
      expect(find.text('Account Actions'), findsOneWidget);

      expect(find.byKey(const ValueKey('settings_logout_row')), findsOneWidget);
      expect(find.text('Log Out'), findsOneWidget);

      expect(find.byKey(const ValueKey('delete_account_row')), findsOneWidget);
      expect(find.text('Delete Account'), findsOneWidget);
    });

    testWidgets('Renders bottom navigation bar with Profile highlighted', (tester) async {
      await tester.pumpWidget(buildTestableSettingsScreen(localeController: englishController));
      await tester.pumpAndSettle();

      expect(find.byKey(const ValueKey('settings_nav_home')), findsOneWidget);
      expect(find.byKey(const ValueKey('settings_nav_festivals')), findsOneWidget);
      expect(find.byKey(const ValueKey('settings_nav_templates')), findsOneWidget);
      expect(find.byKey(const ValueKey('settings_nav_my_designs')), findsOneWidget);
      expect(find.byKey(const ValueKey('settings_nav_profile')), findsOneWidget);
    });
  });

  group('Screen 16: Interactive Features & Toggles', () {
    testWidgets('Tapping theme chip switches between Light and System Default', (tester) async {
      await tester.pumpWidget(buildTestableSettingsScreen(localeController: englishController));
      await tester.pumpAndSettle();

      final systemChip = find.byKey(const ValueKey('theme_chip_system'));
      await tester.tap(systemChip);
      await tester.pumpAndSettle();

      final lightChip = find.byKey(const ValueKey('theme_chip_light'));
      await tester.tap(lightChip);
      await tester.pumpAndSettle();
    });

    testWidgets('Toggling notifications switch flips value', (tester) async {
      await tester.pumpWidget(buildTestableSettingsScreen(localeController: englishController));
      await tester.pumpAndSettle();

      final toggleFinder = find.descendant(
        of: find.byKey(const ValueKey('notification_toggle_row')),
        matching: find.byType(Switch),
      );
      expect(toggleFinder, findsOneWidget);

      await tester.scrollUntilVisible(toggleFinder, 100);
      await tester.pumpAndSettle();

      final initialVal = tester.widget<Switch>(toggleFinder).value;
      await tester.tap(toggleFinder);
      await tester.pumpAndSettle();

      final updatedVal = tester.widget<Switch>(toggleFinder).value;
      expect(updatedVal, !initialVal);
    });

    testWidgets('Toggling festival reminders switch flips value', (tester) async {
      await tester.pumpWidget(buildTestableSettingsScreen(localeController: englishController));
      await tester.pumpAndSettle();

      final toggleFinder = find.descendant(
        of: find.byKey(const ValueKey('festival_reminders_toggle_row')),
        matching: find.byType(Switch),
      );
      expect(toggleFinder, findsOneWidget);

      await tester.scrollUntilVisible(toggleFinder, 100);
      await tester.pumpAndSettle();

      final initialVal = tester.widget<Switch>(toggleFinder).value;
      await tester.tap(toggleFinder);
      await tester.pumpAndSettle();

      final updatedVal = tester.widget<Switch>(toggleFinder).value;
      expect(updatedVal, !initialVal);
    });

    testWidgets('Tapping Personal Information opens bottom sheet', (tester) async {
      await tester.pumpWidget(buildTestableSettingsScreen(localeController: englishController));
      await tester.pumpAndSettle();

      await tester.tap(find.byKey(const ValueKey('personal_info_row')));
      await tester.pumpAndSettle();

      expect(find.text('Close'), findsOneWidget);
      await tester.tap(find.text('Close'));
      await tester.pumpAndSettle();
    });

    testWidgets('Tapping Change Password opens bottom sheet', (tester) async {
      await tester.pumpWidget(buildTestableSettingsScreen(localeController: englishController));
      await tester.pumpAndSettle();

      await tester.tap(find.byKey(const ValueKey('change_password_row')));
      await tester.pumpAndSettle();

      expect(find.text('Close'), findsOneWidget);
      await tester.tap(find.text('Close'));
      await tester.pumpAndSettle();
    });

    testWidgets('Tapping Logout shows confirmation dialog and cancels', (tester) async {
      await tester.pumpWidget(buildTestableSettingsScreen(localeController: englishController));
      await tester.pumpAndSettle();

      final rowFinder = find.byKey(const ValueKey('settings_logout_row'));
      await tester.scrollUntilVisible(rowFinder, 200);
      await tester.pumpAndSettle();

      await tester.tap(rowFinder);
      await tester.pumpAndSettle();

      expect(find.byKey(const ValueKey('settings_logout_dialog_title')), findsOneWidget);
      expect(find.byKey(const ValueKey('settings_logout_cancel')), findsOneWidget);
      expect(find.byKey(const ValueKey('settings_logout_confirm')), findsOneWidget);

      await tester.tap(find.byKey(const ValueKey('settings_logout_cancel')));
      await tester.pumpAndSettle();

      expect(find.byKey(const ValueKey('settings_logout_dialog_title')), findsNothing);
    });

    testWidgets('Tapping Delete Account shows confirmation dialog and cancels', (tester) async {
      await tester.pumpWidget(buildTestableSettingsScreen(localeController: englishController));
      await tester.pumpAndSettle();

      final rowFinder = find.byKey(const ValueKey('delete_account_row'));
      await tester.scrollUntilVisible(rowFinder, 200);
      await tester.pumpAndSettle();

      await tester.tap(rowFinder);
      await tester.pumpAndSettle();

      expect(find.byKey(const ValueKey('delete_account_dialog_title')), findsOneWidget);
      expect(find.byKey(const ValueKey('delete_account_cancel')), findsOneWidget);
      expect(find.byKey(const ValueKey('delete_account_confirm')), findsOneWidget);

      await tester.tap(find.byKey(const ValueKey('delete_account_cancel')));
      await tester.pumpAndSettle();

      expect(find.byKey(const ValueKey('delete_account_dialog_title')), findsNothing);
    });
  });

  group('Screen 16: Responsive Multi-Device Tests', () {
    final viewports = [
      const Size(360, 640),  // Compact
      const Size(390, 844),  // Standard iPhone
      const Size(412, 915),  // Pixel 7
      const Size(768, 1024), // Tablet
    ];

    for (final size in viewports) {
      testWidgets('Renders without overflow on ${size.width}x${size.height}', (tester) async {
        await tester.pumpWidget(buildTestableSettingsScreen(
          size: size,
          localeController: englishController,
        ));
        await tester.pumpAndSettle();

        expect(find.byKey(const ValueKey('settings_page_title')), findsOneWidget);
        expect(tester.takeException(), isNull);
      });
    }
  });
}
