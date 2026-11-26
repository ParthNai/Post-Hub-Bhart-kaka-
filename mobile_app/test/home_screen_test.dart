import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:panchayat_post/core/constants/app_assets.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';
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

    testUser = await authService.registerUser(
      fullName: 'Rahul Sharma',
      username: 'rahul_panchayat',
      password: 'VillagePass1',
    );
    await authService.updateUserProfile(
      userId: testUser.userId,
      fullName: 'Rahul Sharma',
      displayName: 'Rahul',
      villageCity: 'Palanpur',
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
            AppRoutes.festivals: (context) => const Scaffold(body: Center(child: Text('Festivals Screen'))),
            AppRoutes.festivalDetail: (context) => const Scaffold(body: Center(child: Text('Festival Detail Screen'))),
            AppRoutes.posterEditor: (context) => const Scaffold(body: Center(child: Text('Poster Editor Screen'))),
            AppRoutes.profile: (context) => const Scaffold(body: Center(child: Text('Profile Screen'))),
            AppRoutes.myDesigns: (context) => const Scaffold(body: Center(child: Text('My Designs Screen'))),
            AppRoutes.settings: (context) => const Scaffold(body: Center(child: Text('Settings Screen'))),
          },
        ),
      ),
    );
  }

  group('Redesigned Home Screen UI & Component Tests (Strict Reference Match)', () {
    testWidgets('Header contains ONLY original logo on left and avatar on right, NO greeting, username, or bell', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      // Top-left: Original logo
      expect(find.byWidgetPredicate((widget) =>
          widget is Image &&
          widget.image is AssetImage &&
          (widget.image as AssetImage).assetName == AppAssets.panchayatLogo), findsOneWidget);

      // Top-right: User avatar
      expect(find.byKey(const ValueKey('btn_profile_avatar')), findsOneWidget);

      // CRITICAL: NO greeting text, username, or notification bell in header
      expect(find.text('Good morning,'), findsNothing);
      expect(find.text('Good afternoon,'), findsNothing);
      expect(find.text('Good evening,'), findsNothing);
      expect(find.text('Rahul'), findsNothing);
      expect(find.text('Krushnapalsinh'), findsNothing);
      expect(find.byKey(const ValueKey('btn_notifications')), findsNothing);
      expect(find.byIcon(Icons.notifications_outlined), findsNothing);
    });

    testWidgets('Renders all redesigned Home Screen sections accurately matching reference', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      // 1. Featured Festival Component
      expect(find.byType(PageView), findsOneWidget);
      expect(find.text('Navratri'), findsWidgets);
      expect(find.text('Navratri Celebration'), findsOneWidget);
      expect(find.text('Create Post'), findsOneWidget);

      // 2. Upcoming Festivals Section (Two-Column Grid)
      expect(find.text('Upcoming Festivals'), findsOneWidget);
      expect(find.byKey(const ValueKey('btn_see_all_festivals')), findsOneWidget);
      expect(find.text('Diwali', skipOffstage: false), findsWidgets);
      expect(find.text('Holi', skipOffstage: false), findsOneWidget);
      expect(find.text('Oct 20, 2025', skipOffstage: false), findsOneWidget);
      expect(find.text('Mar 14, 2026', skipOffstage: false), findsOneWidget);

      // 3. Create Something New Section (Two Equal Action Tiles)
      expect(find.text('Create Something New'), findsOneWidget);
      expect(find.text('Festival Post'), findsOneWidget);
      expect(find.text('Create festival greetings'), findsOneWidget);
      expect(find.text('Panchayat Post'), findsOneWidget);
      expect(find.text('Create community\nannouncements'), findsOneWidget);

      // 4. Popular Templates Section (Horizontal List)
      expect(find.text('Popular Templates'), findsOneWidget);
      expect(find.byKey(const ValueKey('btn_see_all_templates')), findsOneWidget);
      expect(find.text('Diwali Wishes', skipOffstage: false), findsOneWidget);
      expect(find.text('Good Morning', skipOffstage: false), findsOneWidget);
      expect(find.text('Jai Hind', skipOffstage: false), findsOneWidget);
      expect(find.text('Suvichar', skipOffstage: false), findsOneWidget);

      // 5. Fixed 5-Item Bottom Navigation Bar
      expect(find.text('Home'), findsOneWidget);
      expect(find.text('Festivals'), findsOneWidget);
      expect(find.text('Templates'), findsOneWidget);
      expect(find.text('My Designs'), findsOneWidget);
      expect(find.text('Profile'), findsOneWidget);
      expect(find.byIcon(Icons.home_rounded), findsOneWidget);
      expect(find.byIcon(Icons.layers_outlined), findsOneWidget);
    });

    testWidgets('Tapping Festival Post in Create Something New opens Festivals screen', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      final festAction = find.text('Festival Post');
      expect(festAction, findsOneWidget);

      await tester.ensureVisible(festAction);
      await tester.tap(festAction);
      await tester.pumpAndSettle();

      expect(find.text('Festivals Screen'), findsOneWidget);
    });

    testWidgets('Tapping View All in Popular Templates opens full templates library modal', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      final seeAll = find.byKey(const ValueKey('btn_see_all_templates'));
      expect(seeAll, findsOneWidget);

      await tester.ensureVisible(seeAll);
      await tester.tap(seeAll);
      await tester.pumpAndSettle();

      expect(find.text('All Popular Templates'), findsOneWidget);
    });

    testWidgets('Tapping Profile in bottom nav navigates to profile screen', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      final profileTab = find.text('Profile');
      expect(profileTab, findsOneWidget);

      await tester.tap(profileTab);
      await tester.pumpAndSettle();

      expect(find.text('Profile Screen'), findsOneWidget);
    });

    testWidgets('Tapping Upcoming Festival item navigates to festival detail', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      final holiCard = find.text('Holi');
      expect(holiCard, findsOneWidget);

      await tester.ensureVisible(holiCard);
      await tester.tap(holiCard);
      await tester.pumpAndSettle();

      expect(find.text('Festival Detail Screen'), findsOneWidget);
    });

    testWidgets('Tapping Create Post in Featured Festival navigates to festivals screen', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      final createPostBtn = find.text('Create Post');
      expect(createPostBtn, findsOneWidget);

      await tester.ensureVisible(createPostBtn);
      await tester.tap(createPostBtn);
      await tester.pumpAndSettle();

      expect(find.text('Festivals Screen'), findsOneWidget);
    });
  });

  group('Redesigned Home Screen: Responsive Layout Across Mobile Screen Sizes', () {
    const screenSizes = [
      Size(360, 640),  // Small Android
      Size(390, 844),  // Standard iPhone
      Size(412, 915),  // Large Android
      Size(768, 1024), // Tablet
    ];

    for (final size in screenSizes) {
      testWidgets('Zero overflow on screen size ${size.width}x${size.height}', (tester) async {
        tester.view.physicalSize = size;
        tester.view.devicePixelRatio = 1.0;
        addTearDown(tester.view.resetPhysicalSize);

        await tester.pumpWidget(buildTestableScreen(size: size));
        await tester.pumpAndSettle();

        expect(tester.takeException(), isNull);
        expect(find.text('Create Something New'), findsOneWidget);
        expect(find.text('Popular Templates'), findsOneWidget);
        expect(find.text('Upcoming Festivals'), findsOneWidget);
      });
    }
  });
}
