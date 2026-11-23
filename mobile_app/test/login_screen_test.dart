import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:panchayat_post/core/constants/app_assets.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';
import 'package:panchayat_post/core/services/session_service.dart';
import 'package:panchayat_post/features/auth/data/auth_service.dart';
import 'package:panchayat_post/features/auth/presentation/screens/create_account_screen.dart';
import 'package:panchayat_post/features/auth/presentation/screens/forgot_password_screen.dart';
import 'package:panchayat_post/features/auth/presentation/screens/login_screen.dart';
import 'package:panchayat_post/features/auth/presentation/widgets/auth_text_field.dart';
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

    // Seed a registered test user
    await authService.registerUser(
      fullName: 'Rameshbhai Patel',
      username: 'ramesh_sarpanch',
      password: 'VillagePassword1',
    );
    // Clear session so login can be independently tested
    await sessionService.clearSession();
  });

  Widget buildTestableScreen({Size size = const Size(390, 844)}) {
    return MediaQuery(
      data: MediaQueryData(size: size),
      child: LocaleScope(
        controller: localeController,
        child: MaterialApp(
          home: LoginScreen(
            authService: authService,
            sessionService: sessionService,
          ),
          routes: {
            AppRoutes.createAccount: (context) => const CreateAccountScreen(),
            AppRoutes.forgotPassword: (context) => const ForgotPasswordScreen(),
            AppRoutes.home: (context) => const Scaffold(body: Text('Home Screen 06')),
          },
        ),
      ),
    );
  }

  group('Screen 04: Login UI & Component Tests', () {
    testWidgets('Renders all approved Screen 04 UI elements in Gujarati by default',
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

      // 2. Hero illustration (Laptop surrounded by templates)
      final heroFinder = find.byWidgetPredicate(
        (widget) => widget is Image && (widget.image as AssetImage).assetName == AppAssets.loginHeroLaptop,
      );
      expect(heroFinder, findsOneWidget);

      // 3. Heading & Subtitle
      expect(find.text('ફરીથી આપનું સ્વાગત છે!'), findsOneWidget);
      expect(
        find.textContaining('Panchayat Post એકાઉન્ટમાં લોગિન કરો'),
        findsOneWidget,
      );

      // 4. Input Fields
      expect(find.byType(AuthTextField), findsNWidgets(2));
      expect(find.text('યુઝરનેમ'), findsWidgets);
      expect(find.text('તમારું યુઝરનેમ લખો'), findsOneWidget);
      expect(find.text('પાસવર્ડ'), findsWidgets);
      expect(find.text('તમારો પાસવર્ડ લખો'), findsOneWidget);

      // 5. Remember Me & Forgot Password
      expect(find.byType(Checkbox), findsOneWidget);
      expect(find.text('મને યાદ રાખો'), findsOneWidget);
      expect(find.text('પાસવર્ડ ભૂલી ગયા?'), findsOneWidget);

      // 6. Primary Action Button
      expect(find.text('લોગિન કરો'), findsOneWidget);

      // 7. Create Account Link
      expect(find.text('નવું એકાઉન્ટ નથી?'), findsOneWidget);
      expect(find.text('એકાઉન્ટ બનાવો'), findsOneWidget);

      // 8. Legal Footer
      expect(find.text('Terms & Conditions'), findsOneWidget);
      expect(find.text('Privacy Policy'), findsOneWidget);
    });

    testWidgets('Password visibility toggle toggles obscured text', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      final toggleIcon = find.byIcon(Icons.visibility_off_outlined);
      expect(toggleIcon, findsOneWidget);

      // Tap toggle
      await tester.tap(toggleIcon);
      await tester.pump();
      expect(find.byIcon(Icons.visibility_outlined), findsOneWidget);
    });

    testWidgets('Validation triggers errors for empty username or password', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      // Tap Login button with empty fields
      final loginBtn = find.text('લોગિન કરો');
      await tester.ensureVisible(loginBtn);
      await tester.tap(loginBtn);
      await tester.pumpAndSettle();

      expect(find.text('કૃપા કરીને તમારું યુઝરનેમ લખો'), findsOneWidget);
      expect(find.text('કૃપા કરીને તમારો પાસવર્ડ લખો'), findsOneWidget);
    });

    testWidgets('Shows error when account does not exist or password is wrong', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      final textFields = find.byType(TextFormField);

      // 1. Non-existent username
      await tester.enterText(textFields.at(0), 'unknown_user');
      await tester.enterText(textFields.at(1), 'SomePass123');

      final loginBtn = find.text('લોગિન કરો');
      await tester.ensureVisible(loginBtn);
      await tester.tap(loginBtn);
      await tester.pumpAndSettle();

      expect(find.text('આ યુઝરનેમ વાળું એકાઉન્ટ મળ્યું નથી.'), findsOneWidget);

      // 2. Correct username, wrong password
      await tester.enterText(textFields.at(0), 'ramesh_sarpanch');
      await tester.enterText(textFields.at(1), 'WrongPassword123');
      await tester.tap(loginBtn);
      await tester.pumpAndSettle();

      expect(find.text('ખોટો પાસવર્ડ દાખલ કર્યો છે.'), findsOneWidget);
    });

    testWidgets('Tapping Forgot Password navigates to Screen 05 Forgot Password', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      final forgotLink = find.text('પાસવર્ડ ભૂલી ગયા?');
      await tester.ensureVisible(forgotLink);
      await tester.tap(forgotLink);
      await tester.pumpAndSettle();

      expect(find.byType(ForgotPasswordScreen), findsOneWidget);
      expect(find.textContaining('ચિંતા કરશો નહીં!'), findsOneWidget);
    });

    testWidgets('Tapping "એકાઉન્ટ બનાવો" navigates to Screen 03 Create Account',
        (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      final createAccountLink = find.text('એકાઉન્ટ બનાવો');
      await tester.ensureVisible(createAccountLink);
      await tester.tap(createAccountLink);
      await tester.pumpAndSettle();

      expect(find.byType(CreateAccountScreen), findsOneWidget);
      expect(find.text('તમારું એકાઉન્ટ બનાવો'), findsOneWidget);
    });

    testWidgets('Valid credentials authenticates session and navigates to Home Dashboard',
        (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      final textFields = find.byType(TextFormField);

      await tester.enterText(textFields.at(0), 'ramesh_sarpanch');
      await tester.enterText(textFields.at(1), 'VillagePassword1');

      final loginBtn = find.text('લોગિન કરો');
      await tester.ensureVisible(loginBtn);
      await tester.tap(loginBtn);
      await tester.pumpAndSettle();

      expect(find.text('Home Screen 06'), findsOneWidget);

      // Verify authenticated session was created
      final sessionState = await sessionService.checkSession();
      expect(sessionState, equals(SessionState.authenticated));
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

      expect(find.text('वापस स्वागत है!'), findsOneWidget);
      expect(find.text('लॉगिन करें'), findsOneWidget);
      expect(find.text('खाता बनाएं'), findsOneWidget);
      expect(find.text('मुझे याद रखें'), findsOneWidget);
      expect(find.text('हिंदी'), findsOneWidget);

      // Switch to English
      localeController.setLanguage('en');
      await tester.pumpAndSettle();

      expect(find.text('Welcome Back!'), findsOneWidget);
      expect(find.text('Login'), findsWidgets);
      expect(find.text('Create Account'), findsOneWidget);
      expect(find.text('Remember me'), findsOneWidget);
      expect(find.text('English'), findsOneWidget);
    });
  });

  group('Screen 04: Responsive Layout Across Mobile Screen Sizes', () {
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
        expect(find.text('ફરીથી આપનું સ્વાગત છે!'), findsOneWidget);
        expect(find.byType(LoginScreen), findsOneWidget);
      });
    }
  });
}
