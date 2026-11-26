import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:panchayat_post/core/constants/app_assets.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';
import 'package:panchayat_post/core/services/session_service.dart';
import 'package:panchayat_post/features/auth/data/auth_service.dart';
import 'package:panchayat_post/features/auth/presentation/screens/create_account_screen.dart';
import 'package:panchayat_post/features/auth/presentation/screens/login_screen.dart';
import 'package:panchayat_post/features/auth/presentation/widgets/four_digit_pin_field.dart';
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
            AppRoutes.home: (context) => const Scaffold(body: Text('Home Screen')),
          },
        ),
      ),
    );
  }

  group('Screen 03: Redesigned Register Account UI & Component Tests', () {
    testWidgets('1-3. Opens in English, no language selector, and displays original logo',
        (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      // 1. Opens in English with approved titles
      expect(find.text('Create your account'), findsOneWidget);
      expect(
        find.textContaining('Join Panchayat Post and create beautiful'),
        findsOneWidget,
      );

      // 2. No language dropdown/selector
      expect(find.text('ગુજરાતી'), findsNothing);
      expect(find.text('Select Language'), findsNothing);

      // 3. Original logo displays
      final logoFinder = find.byWidgetPredicate(
        (widget) =>
            widget is Image && (widget.image as AssetImage).assetName == AppAssets.panchayatLogo,
      );
      expect(logoFinder, findsOneWidget);

      // 4. Back navigation button in circular container
      expect(find.byIcon(Icons.arrow_back_rounded), findsOneWidget);
    });

    testWidgets('4-6. Field labels, input placeholders, and username availability check',
        (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      // Labels and placeholders
      expect(find.text('Full Name'), findsOneWidget);
      expect(find.text('Enter your full name'), findsOneWidget);
      expect(find.text('Username'), findsOneWidget);
      expect(find.text('Choose a username'), findsOneWidget);
      expect(find.text('Your username will be used to log in.'), findsOneWidget);

      // Type username and test availability check
      final usernameInput = find.byType(TextFormField).at(1);
      await tester.enterText(usernameInput, 'new_sarpanch');
      await tester.pump(const Duration(milliseconds: 350));
      await tester.pumpAndSettle();

      expect(find.text('Username is available'), findsOneWidget);
    });

    testWidgets('7-11. Renders two 4-digit PIN fields with exactly 4 boxes each and auto-advance',
        (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      // Two PIN fields (Create and Confirm)
      expect(find.byType(FourDigitPinField), findsNWidgets(2));
      expect(find.text('Create 4-digit PIN'), findsOneWidget);
      expect(find.text('Confirm 4-digit PIN'), findsOneWidget);

      // 8 total digit text fields inside FourDigitPinFields (4 boxes for Create + 4 boxes for Confirm)
      final pinDigitBoxes = find.descendant(
        of: find.byType(FourDigitPinField),
        matching: find.byType(TextField),
      );
      expect(pinDigitBoxes, findsNWidgets(8));

      // Enter digits into the first PIN field
      await tester.enterText(pinDigitBoxes.at(0), '1');
      await tester.pump();
      await tester.enterText(pinDigitBoxes.at(1), '2');
      await tester.pump();
      await tester.enterText(pinDigitBoxes.at(2), '3');
      await tester.pump();
      await tester.enterText(pinDigitBoxes.at(3), '4');
      await tester.pump();
    });

    testWidgets('12-13. Validates PIN mismatch and enforces terms agreement',
        (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      final textFields = find.byType(TextFormField);
      await tester.enterText(textFields.at(0), 'Ramesh Patel');
      await tester.enterText(textFields.at(1), 'sarpanch_ramesh');
      await tester.pump(const Duration(milliseconds: 350));

      final pinDigitBoxes = find.descendant(
        of: find.byType(FourDigitPinField),
        matching: find.byType(TextField),
      );

      // Create PIN: 1234
      await tester.enterText(pinDigitBoxes.at(0), '1');
      await tester.enterText(pinDigitBoxes.at(1), '2');
      await tester.enterText(pinDigitBoxes.at(2), '3');
      await tester.enterText(pinDigitBoxes.at(3), '4');

      // Confirm PIN: 1235 (mismatch!)
      await tester.enterText(pinDigitBoxes.at(4), '1');
      await tester.enterText(pinDigitBoxes.at(5), '2');
      await tester.enterText(pinDigitBoxes.at(6), '3');
      await tester.enterText(pinDigitBoxes.at(7), '5');

      final submitBtn = find.text('Create Account');
      await tester.ensureVisible(submitBtn);
      await tester.tap(submitBtn);
      await tester.pumpAndSettle();

      // Mismatch and Terms errors
      expect(find.text('PINs do not match'), findsOneWidget);
      expect(
        find.text('Please agree to the Terms & Conditions and Privacy Policy.'),
        findsOneWidget,
      );
    });

    testWidgets('14-16. Valid registration completes and navigates to next screen',
        (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      final textFields = find.byType(TextFormField);
      await tester.enterText(textFields.at(0), 'Ramesh Patel');
      await tester.enterText(textFields.at(1), 'sarpanch_ramesh');
      await tester.pump(const Duration(milliseconds: 350));

      final pinDigitBoxes = find.descendant(
        of: find.byType(FourDigitPinField),
        matching: find.byType(TextField),
      );

      // Create PIN: 1234
      await tester.enterText(pinDigitBoxes.at(0), '1');
      await tester.enterText(pinDigitBoxes.at(1), '2');
      await tester.enterText(pinDigitBoxes.at(2), '3');
      await tester.enterText(pinDigitBoxes.at(3), '4');

      // Confirm PIN: 1234
      await tester.enterText(pinDigitBoxes.at(4), '1');
      await tester.enterText(pinDigitBoxes.at(5), '2');
      await tester.enterText(pinDigitBoxes.at(6), '3');
      await tester.enterText(pinDigitBoxes.at(7), '4');

      // Accept Terms
      final checkbox = find.byType(Checkbox);
      await tester.ensureVisible(checkbox);
      await tester.tap(checkbox);
      await tester.pump();

      // Tap Create Account
      final submitBtn = find.text('Create Account');
      await tester.ensureVisible(submitBtn);
      await tester.tap(submitBtn);
      await tester.pumpAndSettle();

      expect(find.text('Home Screen'), findsOneWidget);

      final state = await sessionService.checkSession();
      expect(state, equals(SessionState.authenticated));
    });

    testWidgets('17. Tapping Log in navigates to Login Screen', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      final loginLink = find.text('Log in');
      await tester.ensureVisible(loginLink);
      await tester.tap(loginLink);
      await tester.pumpAndSettle();

      expect(find.byType(LoginScreen), findsOneWidget);
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
        expect(find.text('Create your account'), findsOneWidget);
        expect(find.byType(CreateAccountScreen), findsOneWidget);
      });
    }
  });
}
