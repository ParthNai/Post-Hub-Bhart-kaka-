import 'dart:async';
import 'package:flutter/foundation.dart';
import '../localization/locale_controller.dart';
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
      final futures = <Future<dynamic>>[
        _sessionService.checkSession(),
        Future<void>.delayed(Duration(milliseconds: minDurationMs)),
        _loadConfiguration(),
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
      // Default safely to firstTime / welcome screen on error to never get user stuck
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
    // Simulates minimum required configuration load (e.g. feature flags, caching)
    await Future<void>.delayed(const Duration(milliseconds: 150));
  }
}
