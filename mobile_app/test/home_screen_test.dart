import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/core/models/app_remote_config.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';
import 'package:panchayat_post/core/services/app_config_service.dart';
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

  Widget buildTestableScreen({Size size = const Size(390, 844)}) {
    return MediaQuery(
      data: MediaQueryData(size: size),
      child: LocaleScope(
        controller: localeController,
        child: MaterialApp(
          home: HomeScreen(authService: authService),
          routes: {
            AppRoutes.welcome: (context) =>
                const Scaffold(body: Center(child: Text('Welcome Screen'))),
            AppRoutes.profileSetup: (context) => const Scaffold(
              body: Center(child: Text('Profile Setup Screen')),
            ),
            AppRoutes.createAccount: (context) => const Scaffold(
              body: Center(child: Text('Create Account Screen')),
            ),
            AppRoutes.login: (context) =>
                const Scaffold(body: Center(child: Text('Login Screen'))),
            AppRoutes.forgotPassword: (context) => const Scaffold(
              body: Center(child: Text('Forgot Password Screen')),
            ),
            AppRoutes.recoveryStatus: (context) => const Scaffold(
              body: Center(child: Text('Recovery Status Screen')),
            ),
            AppRoutes.onboardingConfirmation: (context) => const Scaffold(
              body: Center(child: Text('Onboarding Done Screen')),
            ),
            AppRoutes.festivals: (context) =>
                const Scaffold(body: Center(child: Text('Festivals Screen'))),
            AppRoutes.profile: (context) =>
                const Scaffold(body: Center(child: Text('Profile Screen'))),
            AppRoutes.myDesigns: (context) =>
                const Scaffold(body: Center(child: Text('My Designs Screen'))),
            AppRoutes.settings: (context) =>
                const Scaffold(body: Center(child: Text('Settings Screen'))),
          },
        ),
      ),
    );
  }

  group('Screen 09: Main Home Dashboard UI & Component Tests', () {
    testWidgets('renders the announcement image configured by the admin', (
      tester,
    ) async {
      final configNotifier = AppConfigService.instance.configNotifier;
      final originalConfig = configNotifier.value;
      addTearDown(() => configNotifier.value = originalConfig);
      configNotifier.value = AppRemoteConfig.fromJson({
        'heroSection': {
          'visible': true,
          'enabled': true,
          'imageUrl': '/uploaded/image/homeHero/hero_test.webp',
        },
      });

      await tester.pumpWidget(buildTestableScreen());
      await tester.pump();

      expect(
        find.byWidgetPredicate(
          (widget) =>
              widget is Image &&
              widget.semanticLabel == 'Government announcement',
        ),
        findsOneWidget,
      );
      expect(find.text('Create Beautiful'), findsNothing);
    });

    testWidgets('allows swiping between admin announcement images', (
      tester,
    ) async {
      final configNotifier = AppConfigService.instance.configNotifier;
      final originalConfig = configNotifier.value;
      addTearDown(() => configNotifier.value = originalConfig);
      configNotifier.value = AppRemoteConfig.fromJson({
        'heroSection': {
          'visible': true,
          'enabled': true,
          'images': [
            '/uploaded/image/homeHero/hero_1.webp',
            '/uploaded/image/homeHero/hero_2.webp',
          ],
          'slideIntervalSeconds': 30,
        },
      });

      await tester.pumpWidget(buildTestableScreen());
      await tester.pump();

      expect(find.text('1/2'), findsOneWidget);
      await tester.fling(find.byType(PageView), const Offset(-300, 0), 1000);
      await tester.pumpAndSettle();
      expect(find.text('2/2'), findsOneWidget);
    });

    testWidgets('automatically advances the announcement carousel', (
      tester,
    ) async {
      final configNotifier = AppConfigService.instance.configNotifier;
      final originalConfig = configNotifier.value;
      addTearDown(() => configNotifier.value = originalConfig);
      configNotifier.value = AppRemoteConfig.fromJson({
        'heroSection': {
          'visible': true,
          'enabled': true,
          'images': [
            '/uploaded/image/homeHero/hero_1.webp',
            '/uploaded/image/homeHero/hero_2.webp',
          ],
          'slideIntervalSeconds': 2,
        },
      });

      await tester.pumpWidget(buildTestableScreen());
      await tester.pump();
      expect(find.text('1/2'), findsOneWidget);

      await tester.pump(const Duration(seconds: 2));
      await tester.pump(const Duration(milliseconds: 500));
      expect(find.text('2/2'), findsOneWidget);
    });

    testWidgets('Renders the home screen without bundled demo content', (
      tester,
    ) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      // A. Top Header
      expect(find.text('Panchayat Post'), findsOneWidget);
      expect(find.text('Good Morning!'), findsOneWidget);
      expect(find.textContaining('Welcome, Rahul'), findsOneWidget);
      expect(find.byIcon(Icons.notifications_none_rounded), findsOneWidget);

      // B. Create Something New
      expect(find.text('Create Something New'), findsOneWidget);
      expect(find.textContaining('Festival'), findsWidgets);
      expect(find.textContaining('Panchayat'), findsWidgets);
      expect(find.text('AI Poster'), findsOneWidget);

      // C. Popular Templates
      expect(find.text('Popular Templates'), findsOneWidget);
      expect(find.text('See All'), findsOneWidget);
      expect(find.text('Happy Diwali'), findsNothing);

      // D. Upcoming Festivals
      expect(find.text('Upcoming Festivals'), findsOneWidget);
      expect(find.text('નવરાત્રી'), findsNothing);
      expect(find.text('દિવાળી'), findsNothing);
      expect(find.text('ભાઈ બીજ'), findsNothing);
      expect(find.text('22 Oct'), findsNothing);
      expect(find.text('12 Nov'), findsNothing);
      expect(find.text('23 Nov'), findsNothing);

      // F. Bottom Navigation Bar
      expect(find.text('Home'), findsOneWidget);
      expect(find.text('Festivals'), findsOneWidget);
      expect(find.text('Templates'), findsOneWidget);
      expect(find.text('My Designs'), findsOneWidget);
      expect(find.text('Profile'), findsOneWidget);
      expect(find.byIcon(Icons.home_rounded), findsOneWidget);
      expect(find.byIcon(Icons.grid_view_rounded), findsOneWidget);
    });

    testWidgets('Tapping Notification Bell opens notifications sheet', (
      tester,
    ) async {
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

    testWidgets(
      'Tapping AI Poster card opens AI poster creation bottom sheet',
      (tester) async {
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
      },
    );

    testWidgets('Tapping See All opens full templates library modal', (
      tester,
    ) async {
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

    testWidgets('Tapping Profile in bottom nav navigates to profile screen', (
      tester,
    ) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      final profileTab = find.text('Profile');
      expect(profileTab, findsOneWidget);

      await tester.tap(profileTab);
      await tester.pumpAndSettle();

      // Profile nav now navigates to the profile route
      expect(find.text('Profile Screen'), findsOneWidget);
    });

    testWidgets('Tapping Festival Posters opens admin templates modal', (
      tester,
    ) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      final festivalCardIcon = find.byIcon(Icons.calendar_month_rounded);
      expect(festivalCardIcon, findsOneWidget);

      await tester.ensureVisible(festivalCardIcon);
      await tester.tap(festivalCardIcon);
      await tester.pumpAndSettle();

      expect(find.textContaining('Festival Templates'), findsOneWidget);
    });
  });

  group('Screen 09: Responsive Layout Across Mobile Screen Sizes', () {
    const screenSizes = [
      Size(360, 640), // Small Android
      Size(390, 844), // Standard iPhone
      Size(412, 915), // Large Android
      Size(768, 1024), // Tablet
    ];

    for (final size in screenSizes) {
      testWidgets('Zero overflow on screen size ${size.width}x${size.height}', (
        tester,
      ) async {
        tester.view.physicalSize = size;
        tester.view.devicePixelRatio = 1.0;
        addTearDown(tester.view.resetPhysicalSize);

        await tester.pumpWidget(buildTestableScreen(size: size));
        await tester.pumpAndSettle();

        expect(tester.takeException(), isNull);
        expect(find.text('Panchayat Post'), findsOneWidget);
        expect(find.text('Create Beautiful'), findsNothing);
        expect(find.text('Create Something New'), findsOneWidget);
        expect(find.text('Popular Templates'), findsOneWidget);
        expect(find.text('Upcoming Festivals'), findsOneWidget);
      });
    }
  });
}
