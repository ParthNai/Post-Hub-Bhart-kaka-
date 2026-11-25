import 'dart:async';
import 'package:flutter/foundation.dart';
import '../localization/locale_controller.dart';
import 'app_config_service.dart';
import 'session_service.dart';

/// Result returned by application startup initialization.
class AppInitResult {
  const AppInitResult({
    required this.sessionState,
    this.errorMessage,
  });

  final SessionState sessionState;
  final String? errorMessage;

  bool get hasError => errorMessage != null;
}

/// Orchestrates application startup, service preloading, and authentication check.
class AppInitService {
  AppInitService({
    SessionService? sessionService,
    this.localeController,
  }) : _sessionService = sessionService ?? SessionService();

  final SessionService _sessionService;
  final LocaleController? localeController;

  /// Default minimum duration the splash screen remains visible (in ms)
  /// to ensure smooth brand presentation without jarring flicker.
  static const int minSplashDurationMs = 2000;

  /// Initializes essential background services and checks user session.
  Future<AppInitResult> initialize({int minDurationMs = minSplashDurationMs}) async {
    final stopwatch = Stopwatch()..start();
    SessionState determinedSession = SessionState.firstTime;
    String? initError;

    try {
      await _loadConfiguration();
      final configDuration = (AppConfigService.instance.config.preloaderDurationSeconds * 1000).toInt();
      final targetMs = minDurationMs != minSplashDurationMs ? minDurationMs : configDuration.clamp(1000, 30000);

      final futures = <Future<dynamic>>[
        _sessionService.checkSession(),
        Future<void>.delayed(Duration(milliseconds: targetMs)),
      ];

      final controller = localeController;
      if (controller != null) {
        futures.add(controller.loadSavedLanguage());
      }

      final results = await Future.wait<dynamic>(futures);
      determinedSession = results[0] as SessionState;
    } catch (e, stack) {
      debugPrint('App initialization error: $e\n$stack');
      initError = e.toString();
      determinedSession = SessionState.firstTime;
    } finally {
      stopwatch.stop();
    }

    return AppInitResult(
      sessionState: determinedSession,
      errorMessage: initError,
    );
  }

  Future<void> _loadConfiguration() async {
    // Initialize remote configuration service to sync Admin Panel controls
    try {
      await AppConfigService.instance.initialize();
    } catch (e) {
      debugPrint('Remote config initialization error: $e');
    }
  }
}
