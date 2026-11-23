import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:panchayat_post/core/constants/app_assets.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';
import 'package:panchayat_post/core/services/session_service.dart';
import 'package:panchayat_post/features/auth/data/auth_service.dart';
import 'package:panchayat_post/features/auth/presentation/screens/create_account_screen.dart';
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
    authService = AuthService(
      preferences: prefs,
      sessionService: sessionService,
      httpClient: MockClient((request) async {
        final payload = jsonDecode(request.body) as Map<String, dynamic>;
        if (payload['mobile'] == '7801985214' && payload['otp'] == '4567') {
          return http.Response(
            jsonEncode({
              'message': 'Login Success',
              'token': 'test-token',
              'user': {
                '_id': 'test-user',
                'name': 'Rameshbhai Patel',
                'mobile': 7801985214,
                'status': true,
                'createdAt': '2026-01-01T00:00:00.000Z',
                'village': 'Palanpur',
                'district': 'Bk',
              },
            }),
            200,
            headers: {'content-type': 'application/json'},
          );
        }
        return http.Response(
          jsonEncode({'message': 'Invalid Pin or user does not exist'}),
          500,
          headers: {'content-type': 'application/json'},
        );
      }),
    );
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
      expect(find.text('મોબાઇલ નંબર'), findsOneWidget);
      expect(find.text('10 અંકનો મોબાઇલ નંબર'), findsOneWidget);
      expect(find.text('4 અંકનો PIN'), findsOneWidget);
      expect(find.text('તમારો PIN લખો'), findsOneWidget);

      // 5. Remember Me
      expect(find.byType(Checkbox), findsOneWidget);
      expect(find.text('મને યાદ રાખો'), findsOneWidget);

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

    testWidgets('Validation triggers errors for empty mobile number or PIN', (tester) async {
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

      expect(find.text('કૃપા કરીને મોબાઇલ નંબર લખો'), findsOneWidget);
      expect(find.text('કૃપા કરીને 4 અંકનો PIN લખો'), findsOneWidget);
    });

    testWidgets('Shows an error for an unknown mobile number or incorrect PIN', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      final textFields = find.byType(TextFormField);

      await tester.enterText(textFields.at(0), '9999999999');
      await tester.enterText(textFields.at(1), '0000');

      final loginBtn = find.text('લોગિન કરો');
      await tester.ensureVisible(loginBtn);
      await tester.tap(loginBtn);
      await tester.pumpAndSettle();

      expect(find.text('મોબાઇલ નંબર અથવા PIN ખોટો છે'), findsOneWidget);

      await tester.enterText(textFields.at(0), '7801985214');
      await tester.enterText(textFields.at(1), '1111');
      await tester.tap(loginBtn);
      await tester.pumpAndSettle();

      expect(find.text('મોબાઇલ નંબર અથવા PIN ખોટો છે'), findsOneWidget);
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

      await tester.enterText(textFields.at(0), '7801985214');
      await tester.enterText(textFields.at(1), '4567');

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
