import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:video_player/video_player.dart';
import 'package:panchayat_post/core/models/app_remote_config.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';
import 'package:panchayat_post/core/services/app_config_service.dart';
import 'package:panchayat_post/core/services/app_init_service.dart';
import 'package:panchayat_post/core/services/session_service.dart';
import 'package:panchayat_post/features/splash/presentation/widgets/brand_logo_widget.dart';
import 'package:panchayat_post/features/splash/presentation/widgets/dual_arc_loading_indicator.dart';
import 'package:panchayat_post/features/splash/presentation/widgets/splash_background_painter.dart';

/// Screen 01: Preloader & Splash Screen for Panchayat Post.
/// Supports both:
/// 1. 🎬 Full-Screen Video Preloader (MP4 / WebM with interactive Skip button & auto-transition)
/// 2. ✨ Animated Emblem Splash (App Icon emblem, custom tagline, brand gradient & dual-arc spinner)
/// Controlled in real-time from the Connected App Admin Studio.
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
  VideoPlayerController? _videoController;
  bool _isVideoInitialized = false;
  bool _isVideoError = false;
  bool _needsUserGesture = false;
  bool _hasNavigated = false;
  String _targetRoute = AppRoutes.welcome;
  Timer? _fallbackTimer;

  @override
  void initState() {
    super.initState();
    _initService = widget.initService ?? AppInitService();
    _startPreloaderLifecycle();
  }

  @override
  void dispose() {
    _fallbackTimer?.cancel();
    _videoController?.dispose();
    super.dispose();
  }

  Future<void> _startPreloaderLifecycle() async {
    // Initiate remote sync without blocking session initialization
    unawaited(AppConfigService.instance.initialize());

    final config = AppConfigService.instance.config;
    debugPrint(
      '[SplashScreen] Preloader config: mediaType=${config.preloaderMediaType}, '
      'videoUrl=${config.preloaderVideoUrl}',
    );

    // Check if preloader screen is disabled by admin
    if (!config.isPreloaderEnabled) {
      final result = await _initService.initialize();
      _navigateToRoute(_determineTargetRoute(result.sessionState));
      return;
    }

    // 3. If video preloader is enabled, prepare the video player
    final isVideoMode = config.preloaderMediaType == 'video' &&
        config.preloaderVideoUrl != null &&
        config.preloaderVideoUrl!.trim().isNotEmpty;

    if (isVideoMode) {
      _setupVideoPlayer(config);
    }

    // 4. Await session determination
    final result = await _initService.initialize();
    _targetRoute = _determineTargetRoute(result.sessionState);

    // 5. If animation mode, navigate once initialization is complete
    if (!isVideoMode) {
      _navigateToRoute(_targetRoute);
    }
  }

  Future<void> _setupVideoPlayer(AppRemoteConfig config) async {
    final rawUrl = config.preloaderVideoUrl!.trim();
    final effectiveUrl = rawUrl.startsWith('http')
        ? rawUrl
        : '${AppConfigService.instance.serverBaseUrl}$rawUrl';

    try {
      final controller = VideoPlayerController.networkUrl(Uri.parse(effectiveUrl));
      _videoController = controller;

      await controller.initialize();
      if (!mounted) {
        await controller.dispose();
        return;
      }

      await controller.setVolume(config.preloaderVideoMuted ? 0.0 : 1.0);
      await controller.setLooping(config.preloaderVideoLoop);

      if (kIsWeb && !config.preloaderVideoMuted) {
        setState(() {
          _isVideoInitialized = true;
          _needsUserGesture = true;
        });
        return;
      }

      await _startVideoPlayback(controller, config);
    } catch (e) {
      debugPrint('[SplashScreen] Video preloader initialization error: $e');
      if (mounted) {
        setState(() {
          _isVideoError = true;
        });
      }
      // Graceful fallback: navigate after configured duration
      final durationMs = config.preloaderDurationMs > 0 ? config.preloaderDurationMs : 2500;
      _fallbackTimer = Timer(Duration(milliseconds: durationMs), () {
        _navigateToRoute(_targetRoute);
      });
    }
  }

  Future<void> _startVideoPlayback(
    VideoPlayerController controller,
    AppRemoteConfig config,
  ) async {
    try {
      await controller.play();
      if (!mounted) return;

      setState(() {
        _isVideoInitialized = true;
        _needsUserGesture = false;
      });

      if (!config.preloaderVideoLoop) {
        controller.addListener(() {
          if (controller.value.isInitialized &&
              controller.value.position >= controller.value.duration) {
            _navigateToRoute(_targetRoute);
          }
        });
      } else {
        final durationMs = config.preloaderDurationMs > 0 ? config.preloaderDurationMs : 3000;
        _fallbackTimer = Timer(Duration(milliseconds: durationMs), () {
          _navigateToRoute(_targetRoute);
        });
      }
    } catch (e) {
      debugPrint('[SplashScreen] Video playback error: $e');
      if (!mounted) return;
      setState(() {
        _isVideoError = true;
      });
      final durationMs = config.preloaderDurationMs > 0 ? config.preloaderDurationMs : 2500;
      _fallbackTimer = Timer(Duration(milliseconds: durationMs), () {
        _navigateToRoute(_targetRoute);
      });
    }
  }

  void _navigateToRoute(String route) {
    if (!mounted || _hasNavigated) return;
    _hasNavigated = true;
    _fallbackTimer?.cancel();
    Navigator.of(context).pushReplacementNamed(route);
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
        body: ValueListenableBuilder<AppRemoteConfig>(
          valueListenable: AppConfigService.instance.configNotifier,
          builder: (context, config, child) {
            final isVideo = config.preloaderMediaType == 'video' &&
                config.preloaderVideoUrl != null &&
                config.preloaderVideoUrl!.trim().isNotEmpty &&
                !_isVideoError;

            if (isVideo && _isVideoInitialized && _videoController != null) {
              return _buildVideoPreloaderView(config, _videoController!);
            }
            if (isVideo) {
              return _buildVideoLoadingView();
            }

            return _buildAnimatedEmblemSplashView(config);
          },
        ),
      ),
    );
  }

  Widget _buildVideoLoadingView() {
    return const ColoredBox(
      color: Color(0xFF172554),
      child: Center(
        child: CircularProgressIndicator(color: Colors.white),
      ),
    );
  }

  /// 1. Full-Screen Video Preloader View
  Widget _buildVideoPreloaderView(AppRemoteConfig config, VideoPlayerController controller) {
    final fitMode = config.preloaderVideoFit == 'contain' ? BoxFit.contain : BoxFit.cover;

    return Stack(
      fit: StackFit.expand,
      children: [
        // Video presentation
        Container(
          color: Colors.black,
          child: Center(
            child: SizedBox.expand(
              child: FittedBox(
                fit: fitMode,
                child: SizedBox(
                  width: controller.value.size.width,
                  height: controller.value.size.height,
                  child: VideoPlayer(controller),
                ),
              ),
            ),
          ),
        ),

        // Interactive Skip Button
        if (_needsUserGesture)
          Center(
            child: ElevatedButton.icon(
              onPressed: () => _startVideoPlayback(controller, config),
              icon: const Icon(Icons.play_arrow),
              label: const Text('Tap to play with sound'),
            ),
          ),

        if (config.preloaderSkipButtonEnabled)
          SafeArea(
            child: Align(
              alignment: Alignment.topRight,
              child: Padding(
                padding: const EdgeInsets.only(top: 14.0, right: 16.0),
                child: Material(
                  color: Colors.black.withValues(alpha: 0.55),
                  borderRadius: BorderRadius.circular(20.0),
                  child: InkWell(
                    borderRadius: BorderRadius.circular(20.0),
                    onTap: () => _navigateToRoute(_targetRoute),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 14.0, vertical: 7.0),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: const [
                          Text(
                            'Skip',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 12.0,
                              fontWeight: FontWeight.w700,
                              letterSpacing: 0.3,
                            ),
                          ),
                          SizedBox(width: 4.0),
                          Icon(
                            Icons.arrow_forward_ios_rounded,
                            color: Colors.white,
                            size: 11.0,
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
      ],
    );
  }

  /// 2. Animated Emblem Splash View (Theme Gradients + App Icon + Tagline + Dual Arc)
  Widget _buildAnimatedEmblemSplashView(AppRemoteConfig config) {
    final gradient = _resolveBackgroundGradient(config.preloaderBgGradient);
    final isLightBg = config.preloaderBgGradient == 'clean_white' ||
        config.preloaderBgGradient == 'tricolor';
    final textColor = isLightBg ? const Color(0xFF0F172A) : Colors.white;

    return Stack(
      fit: StackFit.expand,
      children: [
        // Themed Background
        Container(
          decoration: BoxDecoration(gradient: gradient),
        ),

        // Decorative subtle wave painter for depth
        const RepaintBoundary(
          child: CustomPaint(
            painter: SplashBackgroundPainter(),
          ),
        ),

        // Content
        SafeArea(
          child: LayoutBuilder(
            builder: (context, constraints) {
              return Column(
                children: [
                  SizedBox(height: constraints.maxHeight * 0.22),

                  // Brand App Icon / Emblem
                  _buildAppIconWidget(config),
                  const SizedBox(height: 20.0),

                  // Brand Title
                  Text(
                    'Panchayat Post',
                    style: TextStyle(
                      fontFamily: 'Plus Jakarta Sans',
                      fontSize: 26.0,
                      fontWeight: FontWeight.w800,
                      color: textColor,
                      letterSpacing: -0.5,
                    ),
                  ),

                  const SizedBox(height: 8.0),

                  // Admin Configured Tagline
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 32.0),
                    child: Text(
                      config.preloaderTagline,
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 13.5,
                        fontWeight: FontWeight.w600,
                        color: textColor.withValues(alpha: 0.85),
                        height: 1.35,
                      ),
                    ),
                  ),

                  const Spacer(),

                  // Dual-arc smooth rotating brand loading indicator
                  DualArcLoadingIndicator(
                    size: 40.0,
                    strokeWidth: 3.5,
                    primaryColor: config.preloaderPrimaryColor,
                    secondaryColor: config.preloaderSecondaryColor,
                  ),

                  // Bottom Version Tag
                  SizedBox(height: constraints.maxHeight * 0.10),
                  Text(
                    'v2.4.0 • Official Digital Panchayat',
                    style: TextStyle(
                      fontSize: 11.0,
                      fontWeight: FontWeight.w600,
                      color: textColor.withValues(alpha: 0.55),
                      letterSpacing: 0.2,
                    ),
                  ),
                  const SizedBox(height: 14.0),
                ],
              );
            },
          ),
        ),
      ],
    );
  }

  /// App Icon or Preset Emblem builder
  Widget _buildAppIconWidget(AppRemoteConfig config) {
    final customUrl = config.logoUrl ?? config.appIconUrl;
    final borderRadius = _resolveShapeBorderRadius(config.appIconShape);

    if (customUrl != null && customUrl.trim().isNotEmpty) {
      final effectiveUrl = customUrl.startsWith('http')
          ? customUrl
          : '${AppConfigService.instance.serverBaseUrl}$customUrl';

      return Container(
        width: 82.0,
        height: 82.0,
        decoration: BoxDecoration(
          borderRadius: borderRadius,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.20),
              blurRadius: 16.0,
              offset: const Offset(0, 6),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: borderRadius,
          child: Image.network(
            effectiveUrl,
            fit: BoxFit.contain,
            errorBuilder: (context, error, stackTrace) => const BrandLogoWidget(width: 82.0),
          ),
        ),
      );
    }

    // Official brand logo fallback or Curated Preset Emblem
    if (config.appIconPreset.isEmpty || config.appIconPreset == '🇮🇳' || config.appIconPreset == 'logo') {
      return const BrandLogoWidget(width: 82.0);
    }

    final bgGradient = _resolveIconBgGradient(config.appIconBgColor);
    return Container(
      width: 82.0,
      height: 82.0,
      decoration: BoxDecoration(
        gradient: bgGradient,
        borderRadius: borderRadius,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.22),
            blurRadius: 18.0,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Center(
        child: Text(
          config.appIconPreset,
          style: const TextStyle(fontSize: 42.0),
        ),
      ),
    );
  }

  LinearGradient _resolveBackgroundGradient(String style) {
    switch (style) {
      case 'saffron_gradient':
        return const LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [Color(0xFFEA580C), Color(0xFF9A3412)],
        );
      case 'clean_white':
        return const LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [Colors.white, Color(0xFFF1F5F9)],
        );
      case 'tricolor':
        return const LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          stops: [0.0, 0.5, 1.0],
          colors: [Color(0xFFFF9933), Colors.white, Color(0xFF138808)],
        );
      case 'gradient_blue':
      default:
        return const LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [Color(0xFF1E3A8A), Color(0xFF172554)],
        );
    }
  }

  LinearGradient _resolveIconBgGradient(String bg) {
    switch (bg) {
      case 'saffron':
        return const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFFEA580C), Color(0xFFF97316)],
        );
      case 'navy':
        return const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF0F172A), Color(0xFF1E293B)],
        );
      case 'gold':
        return const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFFB45309), Color(0xFFF59E0B)],
        );
      case 'white':
        return const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Colors.white, Color(0xFFE2E8F0)],
        );
      case 'blue':
      default:
        return const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF1E3A8A), Color(0xFF2563EB)],
        );
    }
  }

  BorderRadius _resolveShapeBorderRadius(String shape) {
    switch (shape) {
      case 'circle':
        return BorderRadius.circular(41.0);
      case 'square':
        return BorderRadius.circular(8.0);
      case 'shield':
        return const BorderRadius.only(
          topLeft: Radius.circular(14.0),
          topRight: Radius.circular(14.0),
          bottomLeft: Radius.circular(32.0),
          bottomRight: Radius.circular(32.0),
        );
      case 'rounded_square':
      default:
        return BorderRadius.circular(22.0);
    }
  }
}
