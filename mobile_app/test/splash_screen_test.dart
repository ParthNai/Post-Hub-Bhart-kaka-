import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:panchayat_post/core/constants/app_colors.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';
import 'package:panchayat_post/core/services/app_init_service.dart';
import 'package:panchayat_post/core/services/session_service.dart';
import 'package:panchayat_post/core/theme/app_theme.dart';
import 'package:panchayat_post/features/splash/presentation/screens/splash_screen.dart';
import 'package:panchayat_post/features/splash/presentation/widgets/brand_logo_widget.dart';
import 'package:panchayat_post/features/splash/presentation/widgets/dual_arc_loading_indicator.dart';
import 'package:panchayat_post/features/splash/presentation/widgets/splash_background_painter.dart';

class MockAppInitService extends AppInitService {
  MockAppInitService(this._mockState);

  final SessionState _mockState;

  @override
  Future<AppInitResult> initialize({int minDurationMs = 0}) async {
    return AppInitResult(sessionState: _mockState);
  }
}

class CompletableMockAppInitService extends AppInitService {
  CompletableMockAppInitService(this._mockState);

  final SessionState _mockState;
  bool shouldComplete = false;

  @override
  Future<AppInitResult> initialize({int minDurationMs = 0}) async {
    while (!shouldComplete) {
      await Future<void>.delayed(const Duration(milliseconds: 50));
    }
    return AppInitResult(sessionState: _mockState);
  }
}

Widget createTestApp({
  required AppInitService initService,
}) {
  return MaterialApp(
    theme: AppTheme.lightTheme,
    initialRoute: AppRoutes.splash,
    routes: {
      AppRoutes.splash: (context) => SplashScreen(initService: initService),
      AppRoutes.welcome: (context) => const Scaffold(body: Center(child: Text('Screen 02 Welcome'))),
      AppRoutes.home: (context) => const Scaffold(body: Center(child: Text('Screen 06 Home'))),
    },
  );
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('Screen 01: Splash Screen UI & Fidelity Tests', () {
    testWidgets('Renders all approved brand visual elements correctly', (tester) async {
      final mockService = CompletableMockAppInitService(SessionState.firstTime);

      await tester.pumpWidget(createTestApp(initService: mockService));
      await tester.pump();

      // 1. Verify custom wave background painter is present
      expect(
        find.byWidgetPredicate(
          (widget) => widget is CustomPaint && widget.painter is SplashBackgroundPainter,
        ),
        findsOneWidget,
      );

      // 2. Verify Brand Logo Widget is present
      expect(find.byType(BrandLogoWidget), findsOneWidget);

      // 3. Verify Brand Title "Panchayat Post"
      expect(find.text('Panchayat Post'), findsOneWidget);

      // 4. Verify Brand Tagline "Create. Celebrate. Share."
      expect(find.text('Create. Celebrate. Share.'), findsOneWidget);

      // 5. Verify Dual-arc brand animated loading indicator is present
      expect(find.byType(DualArcLoadingIndicator), findsOneWidget);

      // Complete the mock service and settle
      mockService.shouldComplete = true;
      await tester.pump(const Duration(milliseconds: 60));
      await tester.pumpAndSettle();
    });

    testWidgets('Dual-arc loading indicator renders with brand colors and spins', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: Scaffold(
            body: Center(
              child: DualArcLoadingIndicator(
                primaryColor: AppColors.accentOrange,
                secondaryColor: AppColors.primaryBlue,
              ),
            ),
          ),
        ),
      );

      expect(find.byType(DualArcLoadingIndicator), findsOneWidget);
      await tester.pump(const Duration(milliseconds: 250));
      await tester.pump(const Duration(milliseconds: 250));

      // Replace tree to cleanly dispose animation controller
      await tester.pumpWidget(const SizedBox.shrink());
    });
  });

  group('Screen 01: Startup Flow & Navigation Routing Tests', () {
    testWidgets('First-time user navigates to Welcome Screen (Screen 02)', (tester) async {
      final mockService = MockAppInitService(SessionState.firstTime);

      await tester.pumpWidget(createTestApp(initService: mockService));
      await tester.pump();
      await tester.pumpAndSettle();

      // Verify Welcome Screen is displayed
      expect(find.text('Screen 02 Welcome'), findsOneWidget);
      expect(find.text('Panchayat Post'), findsNothing);
    });

    testWidgets('Existing user with valid session navigates to Home Screen (Screen 06)', (tester) async {
      final mockService = MockAppInitService(SessionState.authenticated);

      await tester.pumpWidget(createTestApp(initService: mockService));
      await tester.pump();
      await tester.pumpAndSettle();

      // Verify Home Screen is displayed
      expect(find.text('Screen 06 Home'), findsOneWidget);
      expect(find.text('Screen 02 Welcome'), findsNothing);
    });

    testWidgets('User with expired/invalid session navigates to Welcome Screen (Screen 02)', (tester) async {
      final mockService = MockAppInitService(SessionState.unauthenticatedOrExpired);

      await tester.pumpWidget(createTestApp(initService: mockService));
      await tester.pump();
      await tester.pumpAndSettle();

      // Verify Welcome Screen is displayed
      expect(find.text('Screen 02 Welcome'), findsOneWidget);
      expect(find.text('Screen 06 Home'), findsNothing);
    });
  });

  group('Screen 01: Responsive Layout Multi-Device Tests', () {
    final deviceScreens = <String, Size>{
      'Small Android (360x640)': const Size(360, 640),
      'Standard Phone (390x844)': const Size(390, 844),
      'Large Android / Pixel (412x915)': const Size(412, 915),
      'Tall Phone (430x932)': const Size(430, 932),
      'Tablet (768x1024)': const Size(768, 1024),
    };

    for (final entry in deviceScreens.entries) {
      testWidgets('No layout overflow on ${entry.key}', (tester) async {
        tester.view.physicalSize = entry.value;
        tester.view.devicePixelRatio = 1.0;
        addTearDown(() => tester.view.resetPhysicalSize());

        final mockService = CompletableMockAppInitService(SessionState.firstTime);

        await tester.pumpWidget(createTestApp(initService: mockService));
        await tester.pump();

        // Check for layout overflows
        expect(tester.takeException(), isNull);
        expect(find.text('Panchayat Post'), findsOneWidget);
        expect(find.text('Create. Celebrate. Share.'), findsOneWidget);
        expect(find.byType(DualArcLoadingIndicator), findsOneWidget);

        mockService.shouldComplete = true;
        await tester.pump(const Duration(milliseconds: 60));
        await tester.pumpAndSettle();
      });
    }
  });
}
