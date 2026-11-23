import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';
import 'package:panchayat_post/core/services/session_service.dart';
import 'package:panchayat_post/features/auth/data/auth_service.dart';
import 'package:panchayat_post/features/auth/domain/models/user_profile.dart';
import 'package:panchayat_post/features/home/presentation/screens/home_screen.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  late LocaleController localeController;
  late AuthService authService;
  late UserProfile testUser;

  setUp(() async {
    SharedPreferences.setMockInitialValues({});
    final prefs = await SharedPreferences.getInstance();
    localeController = LocaleController(preferences: prefs);
    await localeController.loadSavedLanguage();
    authService = AuthService(preferences: prefs);

    // Register test user
    testUser = await authService.registerUser(
      fullName: 'Rameshbhai Patel',
      username: 'ramesh_patel',
      password: 'VillagePass1',
    );
    await authService.updateUserProfile(
      userId: testUser.userId,
      fullName: 'Rameshbhai Patel',
      displayName: 'Rameshbhai',
      villageCity: 'Dharmaj',
      state: 'Gujarat',
      isProfileComplete: true,
    );
  });

  Widget buildTestableScreen({
    Size size = const Size(390, 844),
  }) {
    return MediaQuery(
      data: MediaQueryData(size: size),
      child: LocaleScope(
        controller: localeController,
        child: MaterialApp(
          home: HomeScreen(authService: authService),
          routes: {
            AppRoutes.welcome: (context) => const Scaffold(body: Center(child: Text('Welcome Screen'))),
            AppRoutes.profileSetup: (context) => const Scaffold(body: Center(child: Text('Profile Setup Screen'))),
            AppRoutes.createAccount: (context) => const Scaffold(body: Center(child: Text('Create Account Screen'))),
            AppRoutes.login: (context) => const Scaffold(body: Center(child: Text('Login Screen'))),
            AppRoutes.forgotPassword: (context) => const Scaffold(body: Center(child: Text('Forgot Password Screen'))),
            AppRoutes.recoveryStatus: (context) => const Scaffold(body: Center(child: Text('Recovery Status Screen'))),
            AppRoutes.onboardingConfirmation: (context) => const Scaffold(body: Center(child: Text('Onboarding Done Screen'))),
          },
        ),
      ),
    );
  }

  group('Home Dashboard Screen UI & Options Tests', () {
    testWidgets('Renders all Home Dashboard UI elements and options in Gujarati by default', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      // 1. Header elements
      expect(find.text('Panchayat'), findsOneWidget);
      expect(find.text('Post'), findsOneWidget);
      expect(find.text('ગુજરાતી'), findsOneWidget);

      // 2. User profile greeting & details
      expect(find.textContaining('નમસ્તે, Rameshbhai!'), findsOneWidget);
      expect(find.text('Dharmaj'), findsOneWidget);
      expect(find.byKey(const Key('edit_profile_action')), findsOneWidget);

      // 3. AI Poster Creation
      expect(find.text('AI સાથે પોસ્ટર બનાવો'), findsOneWidget);

      // 4. Popular categories
      expect(find.text('લોકપ્રિય કેટેગરીઝ'), findsOneWidget);
      expect(find.text('પંચાયત મીટિંગ'), findsOneWidget);
      expect(find.text('ગામ વિકાસ'), findsOneWidget);
      expect(find.text('તહેવારો અને ઉત્સવ'), findsOneWidget);
      expect(find.text('રાષ્ટ્રીય દિવસ'), findsOneWidget);

      // 5. Screen Navigator
      expect(find.text('બધા પેજ ટેસ્ટ કરો (Screen Navigator)'), findsOneWidget);
      expect(find.text('01: Splash'), findsOneWidget);
      expect(find.text('02: Welcome'), findsOneWidget);
      expect(find.text('03: Create Account'), findsOneWidget);
      expect(find.text('04: Login'), findsOneWidget);

      // 6. Logout button
      expect(find.text('લોગ આઉટ'), findsOneWidget);
    });

    testWidgets('Tapping Edit Profile navigates to Screen 07 Profile Setup', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      final editLink = find.byKey(const Key('edit_profile_action'));
      expect(editLink, findsOneWidget);

      await tester.tap(editLink);
      await tester.pumpAndSettle();

      expect(find.text('Profile Setup Screen'), findsOneWidget);
    });

    testWidgets('Tapping Screen Navigator chip navigates to that screen', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      final createAccountChip = find.text('03: Create Account');
      expect(createAccountChip, findsOneWidget);

      await tester.ensureVisible(createAccountChip);
      await tester.tap(createAccountChip);
      await tester.pumpAndSettle();

      expect(find.text('Create Account Screen'), findsOneWidget);
    });

    testWidgets('Tapping AI Poster generate opens bottom sheet with preview', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      // Enter prompt
      final promptField = find.byType(TextField);
      await tester.enterText(promptField, 'ગ્રામ સફાઈ અભિયાન');
      await tester.pumpAndSettle();

      // Tap generate button
      final generateBtn = find.byIcon(Icons.arrow_forward_rounded);
      await tester.tap(generateBtn);
      await tester.pumpAndSettle();

      // Modal is visible
      expect(find.text('AI દ્વારા પોસ્ટર સફળતાપૂર્વક તૈયાર થયું!'), findsOneWidget);
      expect(find.text('વિષય: "ગ્રામ સફાઈ અભિયાન"'), findsOneWidget);
      expect(find.text('પોસ્ટર શેર કરો / ડાઉનલોડ કરો'), findsOneWidget);
    });

    testWidgets('Tapping Logout shows confirmation dialog and logs out', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      // Scroll to logout
      final logoutBtn = find.widgetWithText(OutlinedButton, 'લોગ આઉટ');
      await tester.ensureVisible(logoutBtn);
      await tester.tap(logoutBtn);
      await tester.pumpAndSettle();

      // Confirm dialog appears
      expect(find.text('શું તમે ખરેખર તમારા એકાઉન્ટમાંથી લોગ આઉટ કરવા માંગો છો?'), findsOneWidget);
      final confirmBtn = find.text('હા, લોગ આઉટ કરો');
      await tester.tap(confirmBtn);
      await tester.pumpAndSettle();

      // Navigated to Welcome
      expect(find.text('Welcome Screen'), findsOneWidget);

      // Session cleared
      final isAuth = await authService.sessionService.checkSession();
      expect(isAuth == SessionState.unauthenticatedOrExpired || isAuth == SessionState.firstTime, isTrue);
    });

    testWidgets('Language switching updates all Home Dashboard texts', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      // Switch to Hindi
      await localeController.setLanguage('hi');
      await tester.pumpAndSettle();

      expect(find.textContaining('नमस्ते, Rameshbhai!'), findsOneWidget);
      expect(find.text('प्रोफ़ाइल एडिट करें'), findsOneWidget);
      expect(find.text('AI से पोस्टर बनाएं'), findsOneWidget);
      expect(find.text('लोकप्रिय श्रेणियां'), findsOneWidget);
      expect(find.text('पंचायत मीटिंग'), findsOneWidget);

      // Switch to English
      await localeController.setLanguage('en');
      await tester.pumpAndSettle();

      expect(find.textContaining('Hello, Rameshbhai!'), findsOneWidget);
      expect(find.text('Edit Profile'), findsOneWidget);
      expect(find.text('Create with AI'), findsOneWidget);
      expect(find.text('Popular Categories'), findsOneWidget);
      expect(find.text('Panchayat Meeting'), findsOneWidget);
    });
  });

  group('Home Dashboard Responsive Layout Tests', () {
    final viewports = <String, Size>{
      'Small Android (360x640)': const Size(360, 640),
      'Standard Mobile (390x844)': const Size(390, 844),
      'Large Android (412x915)': const Size(412, 915),
      'Tablet (768x1024)': const Size(768, 1024),
    };

    for (final entry in viewports.entries) {
      testWidgets('Renders cleanly without overflow on ${entry.key}', (tester) async {
        tester.view.physicalSize = entry.value;
        tester.view.devicePixelRatio = 1.0;
        addTearDown(tester.view.resetPhysicalSize);

        await tester.pumpWidget(buildTestableScreen());
        await tester.pumpAndSettle();

        expect(find.byType(HomeScreen), findsOneWidget);
        expect(tester.takeException(), isNull);
      });
    }
  });
}
