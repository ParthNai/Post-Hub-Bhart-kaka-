import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
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

    // Register and update test user
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
          },
        ),
      ),
    );
  }

  group('Screen 09: Main Home Dashboard UI & Component Tests', () {
    testWidgets('Renders all approved Screen 09 UI elements accurately matching reference', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      // A. Top Header
      expect(find.text('Panchayat'), findsOneWidget);
      expect(find.text('Post'), findsOneWidget);
      expect(find.text('Good Morning!'), findsOneWidget);
      expect(find.textContaining('Welcome, Rahul'), findsOneWidget);
      expect(find.byIcon(Icons.notifications_none_rounded), findsOneWidget);

      // B. Featured Festival Hero Banner
      expect(find.text('Create Beautiful'), findsOneWidget);
      expect(find.text('Festival Posts'), findsOneWidget);
      expect(find.textContaining('Celebrate every occasion'), findsOneWidget);
      expect(find.text('Explore Designs'), findsOneWidget);

      // C. Create Something New
      expect(find.text('Create Something New'), findsOneWidget);
      expect(find.textContaining('Festival'), findsWidgets);
      expect(find.textContaining('Panchayat'), findsWidgets);
      expect(find.text('AI Poster'), findsOneWidget);

      // D. Popular Templates
      expect(find.text('Popular Templates'), findsOneWidget);
      expect(find.text('See All'), findsOneWidget);

      // E. Upcoming Festivals
      expect(find.text('Upcoming Festivals'), findsOneWidget);
      expect(find.text('નવરાત્રી'), findsOneWidget);
      expect(find.text('દિવાળી'), findsOneWidget);
      expect(find.text('ભાઈ બીજ'), findsOneWidget);
      expect(find.text('22 Oct'), findsOneWidget);
      expect(find.text('12 Nov'), findsOneWidget);
      expect(find.text('23 Nov'), findsOneWidget);

      // F. Bottom Navigation Bar
      expect(find.text('Home'), findsOneWidget);
      expect(find.text('Festivals'), findsOneWidget);
      expect(find.text('Templates'), findsOneWidget);
      expect(find.text('My Designs'), findsOneWidget);
      expect(find.text('Profile'), findsOneWidget);
      expect(find.byIcon(Icons.home_rounded), findsOneWidget);
      expect(find.byIcon(Icons.grid_view_rounded), findsOneWidget);
    });

    testWidgets('Tapping Notification Bell opens notifications sheet', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      final bellFinder = find.byIcon(Icons.notifications_none_rounded);
      expect(bellFinder, findsOneWidget);

      await tester.tap(bellFinder);
      await tester.pumpAndSettle();

      expect(find.textContaining('Notifications'), findsWidgets);
      expect(find.text('Mark all read'), findsOneWidget);
    });

    testWidgets('Tapping AI Poster card opens AI poster creation bottom sheet', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      final aiCard = find.text('AI Poster');
      expect(aiCard, findsOneWidget);

      await tester.ensureVisible(aiCard);
      await tester.tap(aiCard);
      await tester.pumpAndSettle();

      expect(find.text('AI Poster Creation'), findsOneWidget);
      expect(find.text('Generate Poster with AI'), findsOneWidget);
    });

    testWidgets('Tapping See All opens full templates library modal', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      final seeAll = find.text('See All');
      expect(seeAll, findsOneWidget);

      await tester.ensureVisible(seeAll);
      await tester.tap(seeAll);
      await tester.pumpAndSettle();

      expect(find.text('All Popular Templates'), findsOneWidget);
    });

    testWidgets('Tapping Profile in bottom nav opens profile sheet with edit and test options', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      final profileTab = find.text('Profile');
      expect(profileTab, findsOneWidget);

      await tester.tap(profileTab);
      await tester.pumpAndSettle();

      expect(find.text('Edit Profile Details'), findsOneWidget);
      expect(find.text('Test All Screens (01–08)'), findsOneWidget);
    });

    testWidgets('Tapping Explore Designs button opens festival templates modal', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      final exploreBtn = find.text('Explore Designs');
      expect(exploreBtn, findsOneWidget);

      await tester.ensureVisible(exploreBtn);
      await tester.tap(exploreBtn);
      await tester.pumpAndSettle();

      expect(find.textContaining('Festival Templates'), findsOneWidget);
    });
  });

  group('Screen 09: Responsive Layout Across Mobile Screen Sizes', () {
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
        expect(find.text('Panchayat'), findsOneWidget);
        expect(find.text('Create Beautiful'), findsOneWidget);
        expect(find.text('Create Something New'), findsOneWidget);
        expect(find.text('Popular Templates'), findsOneWidget);
        expect(find.text('Upcoming Festivals'), findsOneWidget);
      });
    }
  });
}
