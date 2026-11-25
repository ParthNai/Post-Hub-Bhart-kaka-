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

  group('Screen 09 Redesign: Main Home Dashboard UI & Component Tests', () {
    testWidgets('Renders all redesigned Home Screen elements accurately matching reference', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      // A. Top Header
      // STRICT REQUIREMENT: Only the original brand logo is displayed; NO brand text next to logo.
      expect(find.byWidgetPredicate((widget) =>
          widget is Image &&
          widget.image is AssetImage &&
          (widget.image as AssetImage).assetName == AppAssets.panchayatLogo), findsOneWidget);
      expect(find.text('Panchayat Post'), findsNothing);
      expect(find.textContaining('Welcome, Rahul'), findsOneWidget);
      expect(find.byKey(const ValueKey('btn_notifications')), findsOneWidget);
      expect(find.text('2'), findsOneWidget); // unread badge count
      expect(find.byKey(const ValueKey('btn_profile_avatar')), findsOneWidget);

      // B. Hero Carousel
      expect(find.byType(PageView), findsOneWidget);

      // C. Upcoming Festivals Section (Uncropped festival cards)
      expect(find.text('Upcoming Festivals'), findsOneWidget);
      expect(find.byKey(const ValueKey('btn_see_all_festivals')), findsOneWidget);
      expect(find.text('Navratri', skipOffstage: false), findsOneWidget);
      expect(find.text('Independence Day', skipOffstage: false), findsOneWidget);
      expect(find.text('Diwali', skipOffstage: false), findsOneWidget);
      expect(find.text('Ganesh Chaturthi', skipOffstage: false), findsOneWidget);
      expect(find.text('Oct 1, 2025', skipOffstage: false), findsOneWidget);
      expect(find.text('Aug 15, 2025', skipOffstage: false), findsOneWidget);
      expect(find.text('Oct 20, 2025', skipOffstage: false), findsOneWidget);
      expect(find.text('Aug 27, 2025', skipOffstage: false), findsOneWidget);

      // D. Create Something New Section
      expect(find.text('Create Something New'), findsOneWidget);
      expect(find.text('Festival'), findsWidgets);
      expect(find.text('Create festival posts'), findsOneWidget);
      expect(find.text('Panchayat'), findsWidgets);
      expect(find.text('Create panchayat posts'), findsOneWidget);

      // E. AI Poster Entry Section
      expect(find.text('AI Poster'), findsOneWidget);
      expect(find.text('Create stunning posters with AI'), findsOneWidget);

      // F. Popular Templates Section
      expect(find.text('Popular Templates'), findsOneWidget);
      expect(find.byKey(const ValueKey('btn_see_all_templates')), findsOneWidget);
      expect(find.text('Sarkari Yojana', skipOffstage: false), findsOneWidget);
      expect(find.text('Suvichar', skipOffstage: false), findsOneWidget);
      expect(find.text('Atmanirbhar Bharat', skipOffstage: false), findsOneWidget);
      expect(find.text('Good Morning', skipOffstage: false), findsOneWidget);
      expect(find.text('Good Night', skipOffstage: false), findsOneWidget);

      // G. Bottom Navigation Bar
      expect(find.text('Home'), findsOneWidget);
      expect(find.text('Festivals'), findsOneWidget);
      expect(find.text('Templates'), findsOneWidget);
      expect(find.text('My Designs'), findsOneWidget);
      expect(find.text('Profile'), findsOneWidget);
      expect(find.byIcon(Icons.home_rounded), findsOneWidget);
      expect(find.byIcon(Icons.layers_outlined), findsOneWidget);
    });

    testWidgets('Tapping Notification Bell opens notifications sheet', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      final bellFinder = find.byKey(const ValueKey('btn_notifications'));
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

    testWidgets('Tapping See All in Popular Templates opens full templates library modal', (tester) async {
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

    testWidgets('Tapping Upcoming Festival card navigates to festival detail', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableScreen());
      await tester.pumpAndSettle();

      final navratriCard = find.text('Navratri');
      expect(navratriCard, findsOneWidget);

      await tester.ensureVisible(navratriCard);
      await tester.tap(navratriCard);
      await tester.pumpAndSettle();

      expect(find.text('Festival Detail Screen'), findsOneWidget);
    });
  });

  group('Screen 09 Redesign: Responsive Layout Across Mobile Screen Sizes', () {
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
        expect(find.text('AI Poster'), findsOneWidget);
      });
    }
  });
}
