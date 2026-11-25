import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:panchayat_post/core/constants/app_colors.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';
import 'package:panchayat_post/core/services/app_config_service.dart';
import 'package:panchayat_post/core/services/app_init_service.dart';
import 'package:panchayat_post/core/services/session_service.dart';
import 'package:panchayat_post/features/splash/presentation/widgets/brand_logo_widget.dart';
import 'package:panchayat_post/features/splash/presentation/widgets/brand_title_widget.dart';
import 'package:panchayat_post/features/splash/presentation/widgets/dual_arc_loading_indicator.dart';
import 'package:panchayat_post/features/splash/presentation/widgets/splash_background_painter.dart';

/// Screen 01: Splash Screen for Panchayat Post.
/// Reproduces the approved reference UI design with exact visual fidelity:
/// - Screen-filling background with top-left & bottom-right curved brand waves
/// - Original Panchayat Post logo at center
/// - Brand title "Panchayat Post" & tagline "Create. Celebrate. Share."
/// - Dual-arc animated loading indicator in brand colors
/// - Asynchronous initialization with safe routing to Welcome (Screen 02) or Home (Screen 06)
class SplashScreen extends StatefulWidget {
  const SplashScreen({
    super.key,
    this.initService,
  });

  final AppInitService? initService;

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  late final AppInitService _initService;
  bool _hasNavigated = false;

  @override
  void initState() {
    super.initState();
    _initService = widget.initService ?? AppInitService();
    _startStartupFlow();
  }

  Future<void> _startStartupFlow() async {
    final result = await _initService.initialize();

    if (!mounted || _hasNavigated) return;
    _hasNavigated = true;

    final targetRoute = _determineTargetRoute(result.sessionState);

    Navigator.of(context).pushReplacementNamed(targetRoute);
  }

  String _determineTargetRoute(SessionState sessionState) {
    switch (sessionState) {
      case SessionState.firstTime:
        // First-time user without an account -> Welcome Screen (Screen 02)
        return AppRoutes.welcome;
      case SessionState.authenticated:
        // Existing user with a valid session -> Home Screen (Screen 06)
        return AppRoutes.home;
      case SessionState.unauthenticatedOrExpired:
        // User with an expired or invalid session -> Welcome Screen (Screen 02)
        return AppRoutes.welcome;
    }
  }

  @override
  Widget build(BuildContext context) {
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: const SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: Brightness.dark,
        statusBarBrightness: Brightness.light,
        systemNavigationBarColor: Colors.transparent,
        systemNavigationBarIconBrightness: Brightness.dark,
      ),
      child: Scaffold(
        backgroundColor: AppColors.background,
        body: Stack(
          fit: StackFit.expand,
          children: [
            // 1. Decorative curved brand waves (top-left & bottom-right)
            const RepaintBoundary(
              child: CustomPaint(
                painter: SplashBackgroundPainter(),
              ),
            ),

            // 2. Foreground content within safe margins
            SafeArea(
              child: LayoutBuilder(
                builder: (context, constraints) {
                  return Column(
                    children: [
                      // Top spacing proportional to screen height (~28% of available height)
                      SizedBox(height: constraints.maxHeight * 0.26),

                      // Central Brand Identity: Logo + Title + Tagline
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 24.0),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: const [
                            BrandLogoWidget(),
                            SizedBox(height: 28.0),
                            BrandTitleWidget(),
                          ],
                        ),
                      ),

                      const Spacer(),

                      // Dual-arc smooth rotating brand loading indicator with dynamic admin colors
                      ValueListenableBuilder(
                        valueListenable: AppConfigService.instance.configNotifier,
                        builder: (context, config, child) {
                          return DualArcLoadingIndicator(
                            size: 38.0,
                            strokeWidth: 3.2,
                            primaryColor: config.preloaderPrimaryColor,
                            secondaryColor: config.preloaderSecondaryColor,
                          );
                        },
                      ),

                      // Bottom spacing matching visual reference (~16% of height)
                      SizedBox(height: constraints.maxHeight * 0.16),
                    ],
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
