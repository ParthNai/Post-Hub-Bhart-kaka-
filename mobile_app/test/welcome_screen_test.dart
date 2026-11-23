import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';
import 'package:panchayat_post/core/theme/app_theme.dart';
import 'package:panchayat_post/features/auth/presentation/screens/create_account_screen.dart';
import 'package:panchayat_post/features/auth/presentation/screens/login_screen.dart';
import 'package:panchayat_post/features/home/presentation/screens/home_screen.dart';
import 'package:panchayat_post/features/welcome/presentation/screens/welcome_screen.dart';
import 'package:panchayat_post/features/welcome/presentation/widgets/welcome_hero_widget.dart';

Widget createWelcomeTestApp({LocaleController? controller}) {
  final localeCtrl = controller ?? LocaleController();

  return LocaleScope(
    controller: localeCtrl,
    child: MaterialApp(
      theme: AppTheme.lightTheme,
      home: const WelcomeScreen(),
      routes: {
        AppRoutes.welcome: (context) => const WelcomeScreen(),
        AppRoutes.createAccount: (context) => const CreateAccountScreen(),
        AppRoutes.login: (context) => const LoginScreen(),
        AppRoutes.home: (context) => const HomeScreen(),
      },
    ),
  );
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  group('Screen 02: Welcome Screen UI & Component Tests', () {
    testWidgets('Renders all approved Screen 02 UI elements in Gujarati by default', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() => tester.view.resetPhysicalSize());

      await tester.pumpWidget(createWelcomeTestApp());
      await tester.pumpAndSettle();

      // 1. Header elements
      expect(find.text('Panchayat'), findsOneWidget);
      expect(find.text('Post'), findsOneWidget);
      expect(find.text('ગુજરાતી'), findsOneWidget);

      // 2. Hero Widget
      expect(find.byType(WelcomeHeroWidget), findsOneWidget);

      // 3. Gujarati headline and subtitle
      expect(find.textContaining('તમારા ગામની દરેક વાત'), findsOneWidget);
      expect(find.textContaining('હવે સુંદર પોસ્ટ સાથે'), findsOneWidget);
      expect(find.textContaining('તમારા ગામ, પંચાયત અને સમાજ'), findsOneWidget);

      // 4. Action buttons
      expect(find.text('ચાલો શરૂ કરીએ'), findsOneWidget);
      expect(find.textContaining('પહેલેથી એકાઉન્ટ છે?'), findsOneWidget);
      expect(find.textContaining('Login'), findsOneWidget);

      // 5. Legal policy links
      expect(find.text('Privacy Policy'), findsOneWidget);
      expect(find.text('Terms & Conditions'), findsOneWidget);
    });

    testWidgets('Language switching updates all texts to Hindi and English immediately', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() => tester.view.resetPhysicalSize());

      final controller = LocaleController();
      await tester.pumpWidget(createWelcomeTestApp(controller: controller));
      await tester.pumpAndSettle();

      // 1. Default Gujarati
      expect(find.text('ચાલો શરૂ કરીએ'), findsOneWidget);

      // 2. Switch to Hindi
      await controller.setLanguage('hi');
      await tester.pumpAndSettle();

      expect(find.text('हिंदी'), findsOneWidget);
      expect(find.text('शुरू करें'), findsOneWidget);
      expect(find.textContaining('आपके गांव की हर बात'), findsOneWidget);
      expect(find.textContaining('पहले से खाता है?'), findsOneWidget);

      // 3. Switch to English
      await controller.setLanguage('en');
      await tester.pumpAndSettle();

      expect(find.text('English'), findsOneWidget);
      expect(find.text("Let's Get Started"), findsOneWidget);
      expect(find.textContaining('Every voice of your village'), findsOneWidget);
      expect(find.textContaining('Already have an account?'), findsOneWidget);
    });

    testWidgets('Tapping language selector opens bottom sheet with language choices', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() => tester.view.resetPhysicalSize());

      await tester.pumpWidget(createWelcomeTestApp());
      await tester.pumpAndSettle();

      // Tap language selector pill
      await tester.tap(find.text('ગુજરાતી'));
      await tester.pumpAndSettle();

      // Bottom sheet options
      expect(find.textContaining('Select Language'), findsOneWidget);
      expect(find.text('हिंदी'), findsOneWidget);
      expect(find.text('English'), findsOneWidget);

      // Tap Hindi option
      await tester.tap(find.text('हिंदी'));
      await tester.pumpAndSettle();

      // Bottom sheet dismissed, screen updated to Hindi
      expect(find.text('शुरू करें'), findsOneWidget);
    });
  });

  group('Screen 02: Navigation & Flow Tests', () {
    testWidgets('Tapping "ચાલો શરૂ કરીએ" navigates to Screen 03: Create Account', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() => tester.view.resetPhysicalSize());

      await tester.pumpWidget(createWelcomeTestApp());
      await tester.pumpAndSettle();

      // Tap primary button
      await tester.tap(find.byType(ElevatedButton));
      await tester.pumpAndSettle();

      // Verify Create Account screen is mounted
      expect(find.byType(CreateAccountScreen), findsOneWidget);
      expect(find.text('તમારું એકાઉન્ટ બનાવો'), findsOneWidget);
    });

    testWidgets('Tapping "Login" navigates to Screen 04: Login (Username + Password only)', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() => tester.view.resetPhysicalSize());

      await tester.pumpWidget(createWelcomeTestApp());
      await tester.pumpAndSettle();

      // Tap secondary button (OutlinedButton)
      await tester.tap(find.byType(OutlinedButton));
      await tester.pumpAndSettle();

      // Verify Login screen is mounted
      expect(find.byType(LoginScreen), findsOneWidget);
      expect(find.text('ફરીથી આપનું સ્વાગત છે!'), findsOneWidget);
      expect(find.byType(TextFormField), findsNWidgets(2));
    });

    testWidgets('Tapping Privacy Policy and Terms & Conditions opens informative dialogs', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(() => tester.view.resetPhysicalSize());

      await tester.pumpWidget(createWelcomeTestApp());
      await tester.pumpAndSettle();

      // Privacy Policy
      await tester.tap(find.text('Privacy Policy'));
      await tester.pumpAndSettle();
      expect(find.byType(AlertDialog), findsOneWidget);
      expect(find.textContaining('Panchayat Post respects your privacy'), findsOneWidget);

      // Close dialog
      await tester.tap(find.text('Close'));
      await tester.pumpAndSettle();

      // Terms & Conditions
      await tester.tap(find.text('Terms & Conditions'));
      await tester.pumpAndSettle();
      expect(find.byType(AlertDialog), findsOneWidget);
      expect(find.textContaining('Welcome to Panchayat Post'), findsOneWidget);

      // Close dialog
      await tester.tap(find.text('Close'));
      await tester.pumpAndSettle();
    });
  });

  group('Screen 02: Responsive Layout Across Screen Sizes', () {
    final devices = <String, Size>{
      'Small Android (360x640)': const Size(360, 640),
      'Standard Phone (390x844)': const Size(390, 844),
      'Large Android (412x915)': const Size(412, 915),
      'Tablet (768x1024)': const Size(768, 1024),
    };

    for (final entry in devices.entries) {
      testWidgets('No layout overflow on ${entry.key}', (tester) async {
        tester.view.physicalSize = entry.value;
        tester.view.devicePixelRatio = 1.0;
        addTearDown(() => tester.view.resetPhysicalSize());

        await tester.pumpWidget(createWelcomeTestApp());
        await tester.pumpAndSettle();

        expect(tester.takeException(), isNull);
        expect(find.text('Panchayat'), findsOneWidget);
        expect(find.text('Post'), findsOneWidget);
        expect(find.text('ચાલો શરૂ કરીએ'), findsOneWidget);
      });
    }
  });
}
