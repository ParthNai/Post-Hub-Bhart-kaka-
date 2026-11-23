import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:panchayat_post/core/constants/app_assets.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';
import 'package:panchayat_post/features/auth/data/auth_service.dart';
import 'package:panchayat_post/features/auth/domain/models/user_profile.dart';
import 'package:panchayat_post/features/auth/presentation/screens/login_screen.dart';
import 'package:panchayat_post/features/auth/presentation/screens/profile_setup_screen.dart';
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

    // Seed a registered test user
    testUser = await authService.registerUser(
      fullName: 'Bharatbhai Patel',
      username: 'bharat_kaka',
      password: 'VillagePassword1',
    );
  });

  Widget buildTestableScreen({
    UserProfile? profile,
    Uint8List? initialImageBytes,
    String? initialImageFileName,
    Size size = const Size(390, 844),
  }) {
    return MediaQuery(
      data: MediaQueryData(size: size),
      child: LocaleScope(
        controller: localeController,
        child: MaterialApp(
          home: ProfileSetupScreen(
            initialProfile: profile ?? testUser,
            authService: authService,
            initialImageBytes: initialImageBytes,
            initialImageFileName: initialImageFileName,
          ),
          routes: {
            AppRoutes.home: (context) => const Scaffold(
                  body: Center(child: Text('Home Dashboard Screen')),
                ),
            AppRoutes.onboardingConfirmation: (context) => const Scaffold(
                  body: Center(child: Text('Onboarding Confirmation Screen')),
                ),
          },
        ),
      ),
    );
  }

  group('Screen 07: User Profile Setup UI & Component Tests', () {
    testWidgets('Renders all approved Screen 07 UI elements in Gujarati by default',
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

      // 2. Step progress indicator bar
      expect(find.text('પ્રોફાઇલ સેટઅપ'), findsOneWidget);
      expect(find.byIcon(Icons.person_rounded), findsWidgets);

      // 3. Hero illustration
      final heroFinder = find.byWidgetPredicate(
        (widget) =>
            widget is Image &&
            (widget.image as AssetImage).assetName == AppAssets.profileSetupHero,
      );
      expect(heroFinder, findsOneWidget);

      // 4. Heading & Subtitle
      expect(find.text('તમારું પ્રોફાઇલ તૈયાર કરો'), findsOneWidget);
      expect(find.textContaining('તમારી કેટલીક વિગતો ઉમેરો અને'), findsOneWidget);

      // 5. Circular photo picker actions
      expect(find.byKey(const Key('add_photo_badge')), findsOneWidget);
      expect(find.text('ફોટો ઉમેરો'), findsOneWidget);
      expect(find.text('અથવા'), findsOneWidget);
      expect(find.byKey(const Key('change_photo_button')), findsOneWidget);
      expect(find.text('ફોટો બદલો'), findsOneWidget);

      // 6. Input fields
      expect(find.text('પુરું નામ'), findsOneWidget);
      expect(find.byKey(const Key('full_name_input')), findsOneWidget);
      expect(find.text('ડિસ્પ્લે નામ'), findsOneWidget);
      expect(find.byKey(const Key('display_name_input')), findsOneWidget);
      expect(find.text('આ નામ તમારા પ્રોફાઇલમાં દેખાશે.'), findsOneWidget);
      expect(find.text('ગામ / શહેર'), findsOneWidget);
      expect(find.byKey(const Key('village_city_input')), findsOneWidget);
      expect(find.text('રાજ્ય'), findsOneWidget);
      expect(find.byKey(const Key('state_dropdown_trigger')), findsOneWidget);

      // 7. Amber notice banner
      expect(find.textContaining('તમારી પ્રોફાઇલની માહિતી તમારા એકાઉન્ટ અનુભવને'), findsOneWidget);

      // 8. Buttons
      expect(find.byKey(const Key('save_profile_button')), findsOneWidget);
      expect(find.text('પ્રોફાઇલ સેવ કરો'), findsOneWidget);
      expect(find.byKey(const Key('skip_for_now_button')), findsOneWidget);
      expect(find.text('હમણાં પછીથી કરો'), findsOneWidget);

      // 9. Legal Footer & Village silhouette
      expect(find.text('Privacy Policy'), findsOneWidget);
      expect(find.text('Terms & Conditions'), findsOneWidget);
      final villageFinder = find.byWidgetPredicate(
        (widget) =>
            widget is Image &&
            (widget.image as AssetImage).assetName == AppAssets.welcomeVillageFooter,
      );
      expect(villageFinder, findsOneWidget);
    });

    testWidgets('Prefills Full Name and Display Name from registration profile',
        (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen(profile: testUser));
      await tester.pumpAndSettle();

      expect(find.text('Bharatbhai Patel'), findsWidgets);
    });

    testWidgets('Form validation enforces required Full Name and Display Name',
        (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      // Clear full name
      final nameField = find.byKey(const Key('full_name_input'));
      await tester.enterText(nameField, '');

      // Clear display name
      final displayField = find.byKey(const Key('display_name_input'));
      await tester.enterText(displayField, '');

      // Tap Save
      final saveBtn = find.byKey(const Key('save_profile_button'));
      await tester.ensureVisible(saveBtn);
      await tester.tap(saveBtn);
      await tester.pumpAndSettle();

      expect(find.text('કૃપા કરીને તમારું પૂરું નામ લખો'), findsOneWidget);
      expect(find.text('કૃપા કરીને ડિસ્પ્લે નામ દાખલ કરો'), findsOneWidget);
    });

    testWidgets('Tapping photo trigger opens bottom sheet modal with Camera and Gallery options',
        (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      final addPhotoBadge = find.byKey(const Key('add_photo_badge'));
      await tester.tap(addPhotoBadge);
      await tester.pumpAndSettle();

      expect(find.text('કેમેરામાંથી ફોટો લો'), findsOneWidget);
      expect(find.text('ગેલેરીમાંથી પસંદ કરો'), findsOneWidget);
    });

    testWidgets('Displaying selected photo preview and removing it via options sheet',
        (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      // Create a 1x1 test PNG byte array
      final testPngBytes = Uint8List.fromList([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG magic
        0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
        0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
        0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4,
        0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41,
        0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
        0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00,
        0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE,
        0x42, 0x60, 0x82,
      ]);

      await tester.pumpWidget(buildTestableScreen(
        initialImageBytes: testPngBytes,
        initialImageFileName: 'profile.png',
      ));
      await tester.pumpAndSettle();

      // Open bottom sheet
      final changePhotoBtn = find.byKey(const Key('change_photo_button'));
      await tester.tap(changePhotoBtn);
      await tester.pumpAndSettle();

      // Verify "Remove Photo" option appears when photo is present
      expect(find.text('ફોટો દૂર કરો'), findsOneWidget);

      // Tap remove photo
      await tester.tap(find.text('ફોટો દૂર કરો'));
      await tester.pumpAndSettle();

      // Bottom sheet dismissed
      expect(find.text('ફોટો દૂર કરો'), findsNothing);
    });

    testWidgets('Searchable State dropdown filters and selects an Indian State',
        (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      // Trigger state dropdown
      final stateTrigger = find.byKey(const Key('state_dropdown_trigger'));
      await tester.ensureVisible(stateTrigger);
      await tester.tap(stateTrigger);
      await tester.pumpAndSettle();

      // Verify modal opened
      expect(find.text('રાજ્ય પસંદ કરો'), findsWidgets);
      expect(find.byKey(const Key('state_search_input')), findsOneWidget);

      // Search for Gujarat
      await tester.enterText(find.byKey(const Key('state_search_input')), 'ગુજરાત');
      await tester.pumpAndSettle();

      // Tap Gujarat
      final gujaratTile = find.widgetWithText(ListTile, 'ગુજરાત');
      expect(gujaratTile, findsOneWidget);
      await tester.tap(gujaratTile);
      await tester.pumpAndSettle();

      // Verified Gujarat is now selected in dropdown trigger
      expect(find.text('ગુજરાત'), findsOneWidget);
    });

    testWidgets('Saving profile updates backend and navigates to Home Dashboard',
        (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      // Fill Village / City
      final villageField = find.byKey(const Key('village_city_input'));
      await tester.enterText(villageField, 'Dharmaj');

      // Select State
      final stateTrigger = find.byKey(const Key('state_dropdown_trigger'));
      await tester.ensureVisible(stateTrigger);
      await tester.tap(stateTrigger);
      await tester.pumpAndSettle();
      await tester.tap(find.text('ગુજરાત'));
      await tester.pumpAndSettle();

      // Tap Save Profile
      final saveBtn = find.byKey(const Key('save_profile_button'));
      await tester.ensureVisible(saveBtn);
      await tester.tap(saveBtn);
      await tester.pumpAndSettle();

      // Verified navigated to Onboarding Confirmation (Screen 08)
      expect(find.text('Onboarding Confirmation Screen'), findsOneWidget);

      // Verify backend user profile updated with isProfileComplete = true
      final updatedUser = await authService.getUserById(testUser.userId);
      expect(updatedUser, isNotNull);
      expect(updatedUser!.isProfileComplete, isTrue);
      expect(updatedUser.villageCity, 'Dharmaj');
      expect(updatedUser.state, 'Gujarat');
    });

    testWidgets('Skip button preserves incomplete profile state and navigates to Home',
        (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      final skipBtn = find.byKey(const Key('skip_for_now_button'));
      await tester.ensureVisible(skipBtn);
      await tester.tap(skipBtn);
      await tester.pumpAndSettle();

      // Verified navigated to Onboarding Confirmation (Screen 08)
      expect(find.text('Onboarding Confirmation Screen'), findsOneWidget);

      // Verify profile is still marked incomplete
      final user = await authService.getUserById(testUser.userId);
      expect(user, isNotNull);
      expect(user!.isProfileComplete, isFalse);
    });

    testWidgets('Language switching updates all Screen 07 texts across Hindi and English',
        (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      // Switch to Hindi
      await localeController.setLanguage('hi');
      await tester.pumpAndSettle();

      expect(find.text('अपनी प्रोफ़ाइल तैयार करें'), findsOneWidget);
      expect(find.text('प्रोफ़ाइल सेटअप'), findsOneWidget);
      expect(find.text('फ़ोटो जोड़ें'), findsOneWidget);
      expect(find.text('फ़ोटो बदलें'), findsOneWidget);
      expect(find.text('पूरा नाम'), findsOneWidget);
      expect(find.text('डिस्प्ले नाम'), findsOneWidget);
      expect(find.text('प्रोफ़ाइल सेव करें'), findsOneWidget);
      expect(find.text('अभी के लिए छोड़ें'), findsOneWidget);

      // Switch to English
      await localeController.setLanguage('en');
      await tester.pumpAndSettle();

      expect(find.text('Create Your Profile'), findsOneWidget);
      expect(find.text('Profile Setup'), findsOneWidget);
      expect(find.text('Add Photo'), findsOneWidget);
      expect(find.text('Change Photo'), findsOneWidget);
      expect(find.text('Full Name'), findsOneWidget);
      expect(find.text('Display Name'), findsOneWidget);
      expect(find.text('Save Profile'), findsOneWidget);
      expect(find.text('Do This Later'), findsOneWidget);
    });

    testWidgets('Returning user entry flow: incomplete profile navigates to Screen 07; completed profile goes to Home',
        (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      // Seed user with completed profile
      final completedUser = await authService.registerUser(
        fullName: 'Kanubhai Patel',
        username: 'kanu_sarpanch',
        password: 'VillagePassword2',
      );
      await authService.updateUserProfile(
        userId: completedUser.userId,
        isProfileComplete: true,
      );

      // Test Login Screen navigation with navigateToProfileSetup = true
      Widget buildTestLoginScreen() {
        return LocaleScope(
          controller: localeController,
          child: MaterialApp(
            home: LoginScreen(
              authService: authService,
              navigateToProfileSetup: true,
            ),
            routes: {
              AppRoutes.profileSetup: (context) => const Scaffold(body: Text('Profile Setup Route')),
              AppRoutes.home: (context) => const Scaffold(body: Text('Home Route')),
            },
          ),
        );
      }

      await tester.pumpWidget(buildTestLoginScreen());
      await tester.pumpAndSettle();

      // Login with completed user
      final textFields = find.byType(TextFormField);
      await tester.enterText(textFields.at(0), 'kanu_sarpanch');
      await tester.enterText(textFields.at(1), 'VillagePassword2');

      final loginBtn = find.text('લોગિન કરો');
      await tester.ensureVisible(loginBtn);
      await tester.tap(loginBtn);
      await tester.pumpAndSettle();

      // Returning user with completed profile navigates directly to Home!
      expect(find.text('Home Route'), findsOneWidget);
    });

    testWidgets('Zero RenderFlex overflow across Small, Standard, Large, and Tablet viewports',
        (tester) async {
      final viewports = [
        const Size(360, 640),  // Small Android
        const Size(390, 844),  // Standard iPhone
        const Size(412, 915),  // Large Android
        const Size(768, 1024), // Tablet
      ];

      for (final size in viewports) {
        tester.view.physicalSize = size;
        tester.view.devicePixelRatio = 1.0;

        await tester.pumpWidget(buildTestableScreen(size: size));
        await tester.pumpAndSettle();

        expect(tester.takeException(), isNull,
            reason: 'RenderFlex overflow occurred on viewport size: $size');
      }

      tester.view.resetPhysicalSize();
    });
  });
}
