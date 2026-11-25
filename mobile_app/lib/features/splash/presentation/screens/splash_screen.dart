import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:panchayat_post/core/models/app_remote_config.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';
import 'package:panchayat_post/core/services/app_config_service.dart';
import 'package:panchayat_post/core/services/app_init_service.dart';
import 'package:panchayat_post/core/services/session_service.dart';
import 'package:panchayat_post/features/splash/presentation/widgets/brand_logo_widget.dart';
import 'package:panchayat_post/features/splash/presentation/widgets/dual_arc_loading_indicator.dart';
import 'package:panchayat_post/features/splash/presentation/widgets/splash_background_painter.dart';
import 'package:panchayat_post/features/splash/presentation/widgets/video_preloader_view.dart';

/// Screen 01: Preloader & Splash Screen for Panchayat Post.
/// Fully dynamic - responds live to Admin Panel settings:
/// - Supports full-screen Video Preloader with autoplay & skip button
/// - Supports Animated Emblem / Splash with custom gradient backgrounds
/// - Dynamic Tagline, App Icon, and Dual-Arc brand loader
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
  String _targetRoute = AppRoutes.welcome;

  @override
  void initState() {
    super.initState();
    _initService = widget.initService ?? AppInitService();
    _startStartupFlow();
  }

  Future<void> _startStartupFlow() async {
    final result = await _initService.initialize();

    if (!mounted || _hasNavigated) return;
    _targetRoute = _determineTargetRoute(result.sessionState);
    _navigate();
  }

  void _navigate() {
    if (_hasNavigated || !mounted) return;
    _hasNavigated = true;
    Navigator.of(context).pushReplacementNamed(_targetRoute);
  }

  String _determineTargetRoute(SessionState sessionState) {
    switch (sessionState) {
      case SessionState.firstTime:
        return AppRoutes.welcome;
      case SessionState.authenticated:
        return AppRoutes.home;
      case SessionState.unauthenticatedOrExpired:
        return AppRoutes.welcome;
    }
  }

  @override
  Widget build(BuildContext context) {
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: const SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: Brightness.light,
        statusBarBrightness: Brightness.dark,
        systemNavigationBarColor: Colors.transparent,
        systemNavigationBarIconBrightness: Brightness.light,
      ),
      child: Scaffold(
        backgroundColor: Colors.black,
        body: ValueListenableBuilder<AppRemoteConfig>(
          valueListenable: AppConfigService.instance.configNotifier,
          builder: (context, config, child) {
            final isVideo = config.preloaderMediaType == 'video' &&
                config.preloaderVideoUrl != null &&
                config.preloaderVideoUrl!.isNotEmpty;

            if (isVideo) {
              final rawUrl = config.preloaderVideoUrl!;
              final fullVideoUrl = rawUrl.startsWith('http')
                  ? rawUrl
                  : '${AppConfigService.instance.serverBaseUrl}$rawUrl';

              return Stack(
                fit: StackFit.expand,
                children: [
                  // Full-screen Video Preloader
                  VideoPreloaderView(
                    videoUrl: fullVideoUrl,
                    fit: config.preloaderVideoFit,
                    muted: config.preloaderVideoMuted,
                    loop: config.preloaderVideoLoop,
                  ),

                  // Optional Skip Button
                  if (config.preloaderSkipButtonEnabled)
                    Positioned(
                      top: MediaQuery.of(context).padding.top + 12,
                      right: 16,
                      child: GestureDetector(
                        onTap: _navigate,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                          decoration: BoxDecoration(
                            color: Colors.black.withValues(alpha: 0.65),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: Colors.white.withValues(alpha: 0.35)),
                          ),
                          child: const Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(
                                'Skip',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 12,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                              SizedBox(width: 4),
                              Icon(Icons.chevron_right, size: 16, color: Colors.white),
                            ],
                          ),
                        ),
                      ),
                    ),
                ],
              );
            }

            // Animated Emblem / Standard Preloader View
            return _buildEmblemPreloader(context, config);
          },
        ),
      ),
    );
  }

  Widget _buildEmblemPreloader(BuildContext context, AppRemoteConfig config) {
    final bg = config.preloaderBgGradient;
    Decoration backgroundDecoration;
    final isLight = bg == 'clean_white';
    final textColor = isLight ? const Color(0xFF0F172A) : Colors.white;

    switch (bg) {
      case 'saffron_gradient':
        backgroundDecoration = const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFFEA580C), Color(0xFF9A3412)],
          ),
        );
        break;
      case 'clean_white':
        backgroundDecoration = const BoxDecoration(color: Colors.white);
        break;
      case 'tricolor':
        backgroundDecoration = const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFFFF9933), Color(0xFFFFFFFF), Color(0xFF138808)],
          ),
        );
        break;
      case 'gradient_blue':
      default:
        backgroundDecoration = const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFF1E3A8A), Color(0xFF172554)],
          ),
        );
        break;
    }

    return Container(
      decoration: backgroundDecoration,
      child: Stack(
        fit: StackFit.expand,
        children: [
          // Fallback waves if default background
          if (bg == 'default')
            const RepaintBoundary(
              child: CustomPaint(
                painter: SplashBackgroundPainter(),
              ),
            ),

          SafeArea(
            child: LayoutBuilder(
              builder: (context, constraints) {
                return Column(
                  children: [
                    // Top Bar with Skip Action
                    Padding(
                      padding: const EdgeInsets.only(top: 8, right: 16),
                      child: Align(
                        alignment: Alignment.topRight,
                        child: config.preloaderSkipButtonEnabled
                            ? GestureDetector(
                                onTap: _navigate,
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
                                  decoration: BoxDecoration(
                                    color: (isLight ? Colors.black : Colors.white).withValues(alpha: 0.15),
                                    borderRadius: BorderRadius.circular(16),
                                    border: Border.all(
                                      color: (isLight ? Colors.black : Colors.white).withValues(alpha: 0.25),
                                    ),
                                  ),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Text(
                                        'Skip',
                                        style: TextStyle(
                                          color: textColor,
                                          fontSize: 11,
                                          fontWeight: FontWeight.w700,
                                        ),
                                      ),
                                      const SizedBox(width: 2),
                                      Icon(Icons.chevron_right, size: 14, color: textColor),
                                    ],
                                  ),
                                ),
                              )
                            : const SizedBox(height: 28),
                      ),
                    ),

                    SizedBox(height: constraints.maxHeight * 0.18),

                    // Central Brand Logo
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 24.0),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const BrandLogoWidget(),
                          const SizedBox(height: 24.0),
                          Text(
                            'Panchayat Post',
                            style: TextStyle(
                              color: textColor,
                              fontSize: 26,
                              fontWeight: FontWeight.w900,
                              letterSpacing: -0.5,
                            ),
                          ),
                          const SizedBox(height: 8.0),
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 32.0),
                            child: Text(
                              config.preloaderTagline,
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                color: textColor.withValues(alpha: 0.85),
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                                height: 1.3,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),

                    const Spacer(),

                    // Dual-arc smooth rotating brand loading indicator with dynamic admin colors
                    DualArcLoadingIndicator(
                      size: 38.0,
                      strokeWidth: 3.2,
                      primaryColor: config.preloaderPrimaryColor,
                      secondaryColor: config.preloaderSecondaryColor,
                    ),

                    const SizedBox(height: 16),

                    if (config.preloaderShowVersion)
                      Text(
                        'v2.4.0 • Official Digital Panchayat',
                        style: TextStyle(
                          color: textColor.withValues(alpha: 0.60),
                          fontSize: 10.5,
                          fontWeight: FontWeight.w700,
                          letterSpacing: 0.2,
                        ),
                      ),

                    SizedBox(height: constraints.maxHeight * 0.08),
                  ],
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
