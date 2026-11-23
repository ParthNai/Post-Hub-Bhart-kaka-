import 'dart:convert';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:panchayat_post/core/constants/app_assets.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';
import 'package:panchayat_post/features/auth/data/auth_service.dart';
import 'package:panchayat_post/features/auth/domain/models/user_profile.dart';
import 'package:panchayat_post/features/auth/presentation/screens/onboarding_confirmation_screen.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  late LocaleController localeController;
  late AuthService authService;
  late UserProfile completeUser;
  late UserProfile incompleteUser;

  setUp(() async {
    SharedPreferences.setMockInitialValues({});
    final prefs = await SharedPreferences.getInstance();
    localeController = LocaleController(preferences: prefs);
    await localeController.loadSavedLanguage();
    authService = AuthService(preferences: prefs);

    // Complete user matching approved Screen 08 reference mock
    completeUser = UserProfile(
      userId: 'user_parth_001',
      fullName: 'Parth Patel',
      username: 'parth_patel',
      passwordHash: 'hash123',
      displayName: 'Parth Patel',
      villageCity: 'Palanpur',
      state: 'Gujarat',
      isProfileComplete: true,
      createdAt: DateTime.now(),
      acceptedLegalTimestamp: DateTime.now(),
    );

    // Incomplete/skipped user
    incompleteUser = UserProfile(
      userId: 'user_incomplete_002',
      fullName: 'Rameshbhai Prajapati',
      username: 'ramesh_p',
      passwordHash: 'hash456',
      displayName: 'Rameshbhai',
      villageCity: null,
      state: null,
      isProfileComplete: false,
      createdAt: DateTime.now(),
      acceptedLegalTimestamp: DateTime.now(),
    );
  });

  Widget buildTestableScreen({
    UserProfile? profile,
    Size size = const Size(390, 844),
  }) {
    return MediaQuery(
      data: MediaQueryData(size: size),
      child: LocaleScope(
        controller: localeController,
        child: MaterialApp(
          home: OnboardingConfirmationScreen(
            initialProfile: profile ?? completeUser,
            authService: authService,
          ),
          routes: {
            AppRoutes.home: (context) => const Scaffold(
                  body: Center(child: Text('Home Dashboard Screen')),
                ),
          },
        ),
      ),
    );
  }

  group('Screen 08: Profile Setup Confirmation & Welcome Onboarding UI Tests', () {
    testWidgets('Renders all approved Screen 08 UI elements in Gujarati by default',
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
        (widget) =>
            widget is Image &&
            (widget.image as AssetImage).assetName == AppAssets.onboardingConfirmationHero,
      );
      expect(heroFinder, findsOneWidget);

      // 3. Heading & Subtitle
      expect(find.text('અભિનંદન!'), findsOneWidget);
      expect(find.text('તમારું પ્રોફાઇલ તૈયાર છે.'), findsOneWidget);

      // 4. Star accent divider
      expect(find.byIcon(Icons.star_rounded), findsOneWidget);

      // 5. Body message
      expect(find.textContaining('હવે Panchayat Post સાથે તમારા ગામ'), findsOneWidget);

      // 6. User Profile Card
      expect(find.text('Parth Patel'), findsOneWidget);
      expect(find.text('Palanpur'), findsOneWidget);
      expect(find.text('Profile Completed'), findsOneWidget);
      expect(find.byIcon(Icons.check_circle_rounded), findsOneWidget);
      expect(find.byIcon(Icons.check_rounded), findsOneWidget); // Avatar check badge

      // 7. Feature highlights section title
      expect(find.text('Panchayat Post માં તમે શું કરી શકશો?'), findsOneWidget);

      // 8. 3 Feature cards
      expect(find.text('Ready Templates'), findsOneWidget);
      expect(find.textContaining('તૈયાર સુંદર પોસ્ટર'), findsOneWidget);
      expect(find.text('AI Poster Creation'), findsOneWidget);
      expect(find.textContaining('તમારા વિચારોમાંથી'), findsOneWidget);
      expect(find.text('Easy Editing'), findsOneWidget);
      expect(find.textContaining('તમારા પોસ્ટરમાં ટેક્સ્ટ'), findsOneWidget);

      // 9. Primary Action Button
      expect(find.byKey(const Key('lets_start_button')), findsOneWidget);
      expect(find.text('ચાલો, શરૂઆત કરીએ'), findsOneWidget);
      expect(find.byIcon(Icons.arrow_forward_ios_rounded), findsOneWidget);

      // 10. Bottom tagline & village footer
      expect(find.text('તમારા વિચારોનો સુંદર પોસ્ટરમાં ફેરવો.'), findsOneWidget);
      final villageFooterFinder = find.byWidgetPredicate(
        (widget) =>
            widget is Image &&
            (widget.image as AssetImage).assetName == AppAssets.welcomeVillageFooter,
      );
      expect(villageFooterFinder, findsOneWidget);
    });

    testWidgets('Displays dynamic user profile data with photo and completion status',
        (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      // 1x1 transparent PNG as data URI
      final tinyPng = Uint8List.fromList([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
        0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
        0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
        0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4,
        0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41,
        0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
        0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00,
        0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE,
        0x42, 0x60, 0x82,
      ]);
      final base64Photo = 'data:image/png;base64,${base64Encode(tinyPng)}';

      final customUser = completeUser.copyWith(
        displayName: 'Vikram Thakor',
        villageCity: 'Mehsana',
        profilePhotoUrl: base64Photo,
      );

      await tester.pumpWidget(buildTestableScreen(profile: customUser));
      await tester.pumpAndSettle();

      expect(find.text('Vikram Thakor'), findsOneWidget);
      expect(find.text('Mehsana'), findsOneWidget);
      expect(find.text('Profile Completed'), findsOneWidget);

      // Verify Image.memory avatar rendered
      expect(find.byType(Image), findsWidgets);
    });

    testWidgets('Properly handles incomplete/skipped profile without claiming completion',
        (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen(profile: incompleteUser));
      await tester.pumpAndSettle();

      // Heading shows welcome rather than "profile is ready"
      expect(find.text('અભિનંદન!'), findsOneWidget);
      expect(find.text('Panchayat Post માં આપનું સ્વાગત છે!'), findsOneWidget);
      expect(find.text('તમારું પ્રોફાઇલ તૈયાર છે.'), findsNothing);

      // Profile details
      expect(find.text('Rameshbhai'), findsOneWidget);
      expect(find.text('ગામ ઉમેરેલ નથી'), findsOneWidget);

      // Badge displays pending status, NOT completed
      expect(find.text('Profile Pending'), findsOneWidget);
      expect(find.text('Profile Completed'), findsNothing);
      expect(find.byIcon(Icons.pending_actions_rounded), findsOneWidget);
    });

    testWidgets('Tapping primary button completes onboarding and navigates to Home Dashboard',
        (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen(profile: completeUser));
      await tester.pumpAndSettle();

      final startBtn = find.byKey(const Key('lets_start_button'));
      expect(startBtn, findsOneWidget);

      await tester.ensureVisible(startBtn);
      await tester.tap(startBtn);
      await tester.pumpAndSettle();

      // Navigated to Home Screen
      expect(find.text('Home Dashboard Screen'), findsOneWidget);

      // Verified onboarding completion persisted to backend session
      final session = authService.sessionService;
      final isDone = await session.isOnboardingCompleted();
      expect(isDone, isTrue);
    });

    testWidgets('Language switching instantly updates all Screen 08 strings in Hindi and English',
        (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      // Switch to Hindi
      await localeController.setLanguage('hi');
      await tester.pumpAndSettle();

      expect(find.text('बधाई हो!'), findsOneWidget);
      expect(find.text('आपकी प्रोफ़ाइल तैयार है।'), findsOneWidget);
      expect(find.text('Panchayat Post में आप क्या कर सकेंगे?'), findsOneWidget);
      expect(find.text('चलिए, शुरुआत करें'), findsOneWidget);
      expect(find.text('अपने विचारों को सुंदर पोस्टर में बदलें।'), findsOneWidget);
      expect(find.textContaining('तैयार सुंदर पोस्टर'), findsOneWidget);

      // Switch to English
      await localeController.setLanguage('en');
      await tester.pumpAndSettle();

      expect(find.text('Congratulations!'), findsOneWidget);
      expect(find.text('Your profile is ready.'), findsOneWidget);
      expect(find.text('What can you do with Panchayat Post?'), findsOneWidget);
      expect(find.text("Let's Get Started"), findsOneWidget);
      expect(find.text('Turn your thoughts into beautiful posters.'), findsOneWidget);
      expect(find.textContaining('Choose ready-made'), findsOneWidget);
    });

    testWidgets('Header back navigation safely calls pop', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      bool popped = false;
      await tester.pumpWidget(
        LocaleScope(
          controller: localeController,
          child: MaterialApp(
            home: Builder(
              builder: (context) => ElevatedButton(
                onPressed: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => OnboardingConfirmationScreen(
                        initialProfile: completeUser,
                        authService: authService,
                      ),
                    ),
                  ).then((_) => popped = true);
                },
                child: const Text('Open Confirmation'),
              ),
            ),
          ),
        ),
      );
      await tester.tap(find.text('Open Confirmation'));
      await tester.pumpAndSettle();

      final backBtn = find.byIcon(Icons.arrow_back_ios_new_rounded);
      expect(backBtn, findsOneWidget);
      await tester.tap(backBtn);
      await tester.pumpAndSettle();

      expect(popped, isTrue);
    });

    testWidgets('Resolves user from AuthService when initialProfile is null', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      // Register and save session for an active user in authService
      final user = await authService.registerUser(
        fullName: 'Kiranben Shah',
        username: 'kiran_shah',
        password: 'SecurePass123',
      );
      await authService.updateUserProfile(
        userId: user.userId,
        fullName: 'Kiranben Shah',
        displayName: 'Kiranben',
        villageCity: 'Anand',
        state: 'Gujarat',
        isProfileComplete: true,
      );

      await tester.pumpWidget(
        LocaleScope(
          controller: localeController,
          child: MaterialApp(
            home: OnboardingConfirmationScreen(
              authService: authService,
            ),
            routes: {
              AppRoutes.home: (context) => const Scaffold(
                    body: Center(child: Text('Home Dashboard Screen')),
                  ),
            },
          ),
        ),
      );
      await tester.pumpAndSettle();

      // Resolved active user
      expect(find.text('Kiranben'), findsOneWidget);
      expect(find.text('Anand'), findsOneWidget);
      expect(find.text('Profile Completed'), findsOneWidget);
    });
  });

  group('Screen 08: Multi-Device Responsive Layout Tests', () {
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

        // Verify primary components exist
        expect(find.byType(OnboardingConfirmationScreen), findsOneWidget);
        expect(find.byKey(const Key('lets_start_button')), findsOneWidget);
        expect(find.text('Parth Patel'), findsOneWidget);

        // Verify no RenderFlex errors
        expect(tester.takeException(), isNull);
      });
    }
  });
}
