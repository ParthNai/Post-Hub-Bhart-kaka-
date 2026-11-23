import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:panchayat_post/core/constants/app_assets.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';
import 'package:panchayat_post/features/auth/data/auth_service.dart';
import 'package:panchayat_post/features/auth/presentation/screens/forgot_password_screen.dart';
import 'package:panchayat_post/features/auth/presentation/screens/login_screen.dart';
import 'package:panchayat_post/features/auth/presentation/widgets/auth_text_field.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  late LocaleController localeController;
  late AuthService authService;

  setUp(() async {
    SharedPreferences.setMockInitialValues({});
    final prefs = await SharedPreferences.getInstance();
    localeController = LocaleController(preferences: prefs);
    await localeController.loadSavedLanguage();
    authService = AuthService(preferences: prefs);
  });

  Widget buildTestableScreen({Size size = const Size(390, 844)}) {
    return MediaQuery(
      data: MediaQueryData(size: size),
      child: LocaleScope(
        controller: localeController,
        child: MaterialApp(
          home: ForgotPasswordScreen(
            authService: authService,
            autoNavigateToStatus: false,
          ),
          routes: {
            AppRoutes.login: (context) => const LoginScreen(),
          },
        ),
      ),
    );
  }

  group('Screen 05: Forgot Password UI & Component Tests', () {
    testWidgets('Renders all approved Screen 05 UI elements in Gujarati by default',
        (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      // 1. Header elements
      expect(find.byIcon(Icons.arrow_back_ios_new_rounded), findsOneWidget);
      expect(find.text('Panchayat'), findsOneWidget);
      expect(find.text('Post'), findsOneWidget);
      expect(find.text('ગુજરાતી'), findsOneWidget);

      // 2. Hero illustration
      final heroFinder = find.byWidgetPredicate(
        (widget) => widget is Image && (widget.image as AssetImage).assetName == AppAssets.forgotPasswordHero,
      );
      expect(heroFinder, findsOneWidget);

      // 3. Heading & Subtitle
      expect(find.text('પાસવર્ડ ભૂલી ગયા?'), findsOneWidget);
      expect(
        find.textContaining('ચિંતા કરશો નહીં!'),
        findsOneWidget,
      );

      // 4. Input Field
      expect(find.byType(AuthTextField), findsOneWidget);
      expect(find.text('તમારું યુઝરનેમ'), findsOneWidget);
      expect(find.text('રજિસ્ટર કરેલું યુઝરનેમ લખો'), findsOneWidget);
      expect(find.text('તમારા એકાઉન્ટનું યુઝરનેમ દાખલ કરો.'), findsOneWidget);

      // 5. Informative Blue Card
      expect(find.byIcon(Icons.info_rounded), findsOneWidget);
      expect(
        find.textContaining('તમારી વિનંતી મળ્યા પછી અમારી સપોર્ટ ટીમ'),
        findsOneWidget,
      );

      // 6. Action Button
      expect(find.text('રિકવરી વિનંતી મોકલો'), findsOneWidget);

      // 7. Support & Return to Login links
      expect(find.text('વધુ મદદ જોઈએ છે?'), findsOneWidget);
      expect(find.text('સપોર્ટનો સંપર્ક કરો'), findsOneWidget);
      expect(find.text('Login પર પાછા જાઓ'), findsOneWidget);

      // 8. Legal Footer
      expect(find.text('Terms & Conditions'), findsOneWidget);
      expect(find.text('Privacy Policy'), findsOneWidget);
    });

    testWidgets('Validation triggers error when username is empty or invalid format',
        (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      // 1. Submit empty field
      final submitBtn = find.text('રિકવરી વિનંતી મોકલો');
      await tester.ensureVisible(submitBtn);
      await tester.tap(submitBtn);
      await tester.pumpAndSettle();

      expect(find.text('કૃપા કરીને તમારું રજિસ્ટર કરેલું યુઝરનેમ લખો'), findsOneWidget);

      // 2. Submit too short (< 3 chars)
      final input = find.byType(TextFormField);
      await tester.enterText(input, 'ab');
      await tester.tap(submitBtn);
      await tester.pumpAndSettle();

      expect(find.text('યુઝરનેમમાં ઓછામાં ઓછા 3 અક્ષર હોવા જોઈએ'), findsOneWidget);
    });

    testWidgets('Submitting valid username displays confirmation card with reference ID',
        (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      final input = find.byType(TextFormField);
      await tester.enterText(input, 'sarpanch_ramesh');

      final submitBtn = find.text('રિકવરી વિનંતી મોકલો');
      await tester.ensureVisible(submitBtn);
      await tester.tap(submitBtn);
      await tester.pumpAndSettle();

      // Verified confirmation state
      expect(find.byIcon(Icons.check_circle_rounded), findsOneWidget);
      expect(find.text('વિનંતી સફળતાપૂર્વક મોકલાઈ!'), findsWidgets);
      expect(find.textContaining('REC-2026-'), findsOneWidget);
      expect(find.textContaining('તમારી વિનંતી નોંધાઈ ગઈ છે'), findsOneWidget);
    });

    testWidgets('Tapping Support link opens Help Center dialog with helpline details',
        (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      final supportLink = find.text('સપોર્ટનો સંપર્ક કરો');
      await tester.ensureVisible(supportLink);
      await tester.tap(supportLink);
      await tester.pumpAndSettle();

      expect(find.text('પંચાયત પોસ્ટ સહાયતા કેન્દ્ર'), findsOneWidget);
      expect(find.textContaining('1800-123-7262'), findsOneWidget);
      expect(find.textContaining('support@panchayatpost.in'), findsOneWidget);

      // Close dialog
      await tester.tap(find.text('Close'));
      await tester.pumpAndSettle();
      expect(find.text('પંચાયત પોસ્ટ સહાયતા કેન્દ્ર'), findsNothing);
    });

    testWidgets('Tapping "Login પર પાછા જાઓ" navigates back to Screen 04 Login',
        (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      final backToLoginBtn = find.text('Login પર પાછા જાઓ');
      await tester.ensureVisible(backToLoginBtn);
      await tester.tap(backToLoginBtn);
      await tester.pumpAndSettle();

      expect(find.byType(LoginScreen), findsOneWidget);
      expect(find.text('ફરીથી આપનું સ્વાગત છે!'), findsOneWidget);
    });

    testWidgets('Language switching updates all texts to Hindi and English immediately',
        (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      // Switch to Hindi
      localeController.setLanguage('hi');
      await tester.pumpAndSettle();

      expect(find.text('पासवर्ड भूल गए?'), findsOneWidget);
      expect(find.text('रिकवरी अनुरोध भेजें'), findsOneWidget);
      expect(find.text('और मदद चाहिए?'), findsOneWidget);
      expect(find.text('सपोर्ट से संपर्क करें'), findsOneWidget);
      expect(find.text('Login पर वापस जाएं'), findsOneWidget);
      expect(find.text('हिंदी'), findsOneWidget);

      // Switch to English
      localeController.setLanguage('en');
      await tester.pumpAndSettle();

      expect(find.text('Forgot Password?'), findsOneWidget);
      expect(find.text('Send Recovery Request'), findsOneWidget);
      expect(find.text('Need More Help?'), findsOneWidget);
      expect(find.text('Contact Support'), findsOneWidget);
      expect(find.text('Back to Login'), findsOneWidget);
      expect(find.text('English'), findsOneWidget);
    });
  });

  group('Screen 05: Responsive Layout Across Mobile Screen Sizes', () {
    const screenSizes = [
      Size(360, 640),  // Small Android
      Size(390, 844),  // Standard iPhone
      Size(412, 915),  // Large Android
      Size(768, 1024), // Tablet
    ];

    for (final size in screenSizes) {
      testWidgets('No layout overflow on screen size ${size.width}x${size.height}',
          (tester) async {
        tester.view.physicalSize = size;
        tester.view.devicePixelRatio = 1.0;
        addTearDown(tester.view.resetPhysicalSize);

        await tester.pumpWidget(buildTestableScreen(size: size));
        await tester.pumpAndSettle();

        expect(tester.takeException(), isNull);
        expect(find.text('પાસવર્ડ ભૂલી ગયા?'), findsOneWidget);
        expect(find.byType(ForgotPasswordScreen), findsOneWidget);
      });
    }
  });
}
