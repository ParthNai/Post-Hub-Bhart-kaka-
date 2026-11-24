import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:panchayat_post/core/constants/app_assets.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';
import 'package:panchayat_post/core/services/session_service.dart';
import 'package:panchayat_post/features/auth/data/auth_service.dart';
import 'package:panchayat_post/features/auth/presentation/screens/create_account_screen.dart';
import 'package:panchayat_post/features/auth/presentation/screens/login_screen.dart';
import 'package:panchayat_post/features/auth/presentation/widgets/auth_text_field.dart';
import 'package:panchayat_post/features/auth/presentation/widgets/password_guidelines_widget.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  late LocaleController localeController;
  late AuthService authService;
  late SessionService sessionService;

  setUp(() async {
    SharedPreferences.setMockInitialValues({});
    final prefs = await SharedPreferences.getInstance();
    localeController = LocaleController(preferences: prefs);
    await localeController.loadSavedLanguage();
    sessionService = SessionService(preferences: prefs);
    authService = AuthService(preferences: prefs, sessionService: sessionService);
  });

  Widget buildTestableScreen({Size size = const Size(390, 844)}) {
    return MediaQuery(
      data: MediaQueryData(size: size),
      child: LocaleScope(
        controller: localeController,
        child: MaterialApp(
          home: CreateAccountScreen(authService: authService),
          routes: {
            AppRoutes.login: (context) => const LoginScreen(),
            AppRoutes.home: (context) => const Scaffold(body: Text('Home Screen 06')),
          },
        ),
      ),
    );
  }

  group('Screen 03: Create Account UI & Component Tests', () {
    testWidgets('Renders all approved Screen 03 UI elements in Gujarati by default',
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
        (widget) => widget is Image && (widget.image as AssetImage).assetName == AppAssets.createAccountHero,
      );
      expect(heroFinder, findsOneWidget);

      // 3. Heading & Subtitle
      expect(find.text('તમારું એકાઉન્ટ બનાવો'), findsOneWidget);
      expect(
        find.textContaining('Panchayat Post સાથે જોડાઓ'),
        findsOneWidget,
      );

      // 4. Input Fields
      expect(find.byType(AuthTextField), findsNWidgets(4));
      expect(find.text('તમારું પૂરું નામ લખો'), findsWidgets);
      expect(find.text('તમારું યુઝરનેમ બનાવો'), findsWidgets);
      expect(find.text('પાસવર્ડ બનાવો'), findsWidgets);
      expect(find.text('પાસવર્ડ ફરીથી લખો'), findsWidgets);

      // 5. Password guidelines card
      expect(find.byType(PasswordGuidelinesWidget), findsOneWidget);
      expect(find.text('પાસવર્ડ માટે સુચના:'), findsOneWidget);
      expect(find.text('ઓછામાં ઓછા 8 અક્ષર'), findsOneWidget);
      expect(find.text('મોટા અને નાના અક્ષર'), findsOneWidget);
      expect(find.text('ઓછામાં ઓછો 1 નંબર'), findsOneWidget);

      // 6. Terms & Conditions checkbox & text
      expect(find.byType(Checkbox), findsOneWidget);
      expect(find.textContaining('Terms & Conditions'), findsOneWidget);
      expect(find.textContaining('Privacy Policy'), findsOneWidget);

      // 7. Submit button and login link
      expect(find.text('એકાઉન્ટ બનાવો'), findsOneWidget);
      expect(find.text('પહેલેથી એકાઉન્ટ છે?'), findsOneWidget);
      expect(find.text('Login કરો'), findsOneWidget);
    });

    testWidgets('Password requirements dynamically update indicators as user types',
        (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      // Find password input (3rd TextFormField)
      final passwordFields = find.byType(TextFormField);
      final passwordInput = passwordFields.at(2);

      // Initially no checkmarks are active
      expect(find.byIcon(Icons.check_circle), findsNothing);

      // Type 8 lowercase letters -> min length fulfilled
      await tester.enterText(passwordInput, 'abcdefgh');
      await tester.pump();
      expect(find.byIcon(Icons.check_circle), findsNWidgets(1));

      // Add uppercase -> case fulfilled
      await tester.enterText(passwordInput, 'Abcdefgh');
      await tester.pump();
      expect(find.byIcon(Icons.check_circle), findsNWidgets(2));

      // Add number -> all 3 fulfilled
      await tester.enterText(passwordInput, 'Abcdefgh1');
      await tester.pump();
      expect(find.byIcon(Icons.check_circle), findsNWidgets(3));
    });

    testWidgets('Validation triggers errors for empty fields, password mismatch, and unaccepted terms',
        (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      // Tap submit button with empty form
      final submitBtn = find.text('એકાઉન્ટ બનાવો');
      await tester.ensureVisible(submitBtn);
      await tester.tap(submitBtn);
      await tester.pumpAndSettle();

      // Expect field errors and terms error
      expect(find.text('કૃપા કરીને તમારું પૂરું નામ લખો'), findsOneWidget);
      expect(find.text('યુઝરનેમમાં ઓછામાં ઓછા 3 અક્ષર હોવા જોઈએ'), findsOneWidget);
      expect(find.text('કૃપા કરીને Terms & Conditions સ્વીકારો.'), findsOneWidget);
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

      expect(find.text('अपना खाता बनाएं'), findsOneWidget);
      expect(find.text('खाता बनाएं'), findsOneWidget);
      expect(find.text('Login करें'), findsOneWidget);
      expect(find.text('हिंदी'), findsOneWidget);

      // Switch to English
      localeController.setLanguage('en');
      await tester.pumpAndSettle();

      expect(find.text('Create Your Account'), findsOneWidget);
      expect(find.text('Create Account'), findsOneWidget);
      expect(find.text('Login'), findsWidgets);
      expect(find.text('English'), findsOneWidget);
    });

    testWidgets('Tapping Login link navigates to Screen 04 Login', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      final loginLink = find.text('Login કરો');
      await tester.ensureVisible(loginLink);
      await tester.tap(loginLink);
      await tester.pumpAndSettle();

      expect(find.byType(LoginScreen), findsOneWidget);
      expect(find.text('ફરીથી આપનું સ્વાગત છે!'), findsOneWidget);
    });

    testWidgets('Valid form submission registers account and navigates to next screen',
        (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      final textFields = find.byType(TextFormField);

      // 1. Enter Full Name
      await tester.enterText(textFields.at(0), 'Rameshbhai Patel');

      // 2. Enter Username
      await tester.enterText(textFields.at(1), 'sarpanch_ramesh');
      await tester.pump(const Duration(milliseconds: 350)); // Debounce timer

      // 3. Enter Password
      await tester.enterText(textFields.at(2), 'Village@2026');

      // 4. Enter Confirm Password
      await tester.enterText(textFields.at(3), 'Village@2026');

      // 5. Accept Terms
      final checkbox = find.byType(Checkbox);
      await tester.ensureVisible(checkbox);
      await tester.tap(checkbox);
      await tester.pump();

      // 6. Submit
      final submitBtn = find.text('એકાઉન્ટ બનાવો');
      await tester.ensureVisible(submitBtn);
      await tester.tap(submitBtn);
      await tester.pumpAndSettle();

      // Verified navigated to Home Screen 06
      expect(find.text('Home Screen 06'), findsOneWidget);

      // Verified session is marked authenticated
      final sessionState = await sessionService.checkSession();
      expect(sessionState, equals(SessionState.authenticated));
    });
  });

  group('Screen 03: Responsive Layout Across Mobile Screen Sizes', () {
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
        expect(find.text('તમારું એકાઉન્ટ બનાવો'), findsOneWidget);
        expect(find.byType(CreateAccountScreen), findsOneWidget);
      });
    }
  });
}
