import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

import '../models/app_remote_config.dart';

/// Singleton service that manages fetching, caching, and live updates
/// of the Admin Panel screen & layout configurations.
class AppConfigService {
  AppConfigService._();

  static final AppConfigService instance = AppConfigService._();

  static const String _cacheKey = 'posthub_remote_config_cache';
  static const String _customServerUrlKey = 'posthub_server_base_url';

  /// Default API port and endpoint
  static const String configEndpoint = '/api/app/config';

  /// In-memory reactive config state
  late final ValueNotifier<AppRemoteConfig> configNotifier =
      ValueNotifier<AppRemoteConfig>(AppRemoteConfig.defaultConfig());

  /// Current active config getter
  AppRemoteConfig get config => configNotifier.value;

  String resolveMediaUrl(String path) {
    final value = path.trim();
    if (value.isEmpty) return value;
    final uri = Uri.tryParse(value);
    if (uri != null && uri.hasScheme) return value;
    final baseUrl = serverBaseUrl.replaceAll(RegExp(r'/+$'), '');
    return '$baseUrl/${value.replaceFirst(RegExp(r'^/+'), '')}';
  }

  String? _cachedServerUrl;
  Future<void>? _initializationFuture;
  bool _isLoading = false;
  DateTime? _lastSyncedAt;
  String? _syncError;

  bool get isLoading => _isLoading;
  DateTime? get lastSyncedAt => _lastSyncedAt;
  String? get syncError => _syncError;
  Timer? _pollTimer;

  /// Determines the best default server host for the current runtime platform:
  /// - Android Device on Local Wi-Fi -> http://192.168.0.121:3000 (or localhost via adb reverse)
  /// - Web / iOS / Desktop -> http://localhost:3000
  String get defaultServerUrl {
    const envUrl = String.fromEnvironment('BACKEND_URL');
    if (envUrl.isNotEmpty) return envUrl;
    if (kIsWeb) {
      return 'http://localhost:3000';
    }
    if (Platform.isAndroid) {
      // 192.168.0.121 is development machine's local Wi-Fi IP.
      // Also works via USB with `adb reverse tcp:3000 tcp:3000`.
      return 'http://192.168.0.121:3000';
    }
    return 'http://localhost:3000';
  }

  /// Get current effective server URL
  String get serverBaseUrl => _cachedServerUrl ?? defaultServerUrl;

  /// Updates and persists custom server base URL (e.g. for testing with local IP or production domain)
  Future<void> setServerBaseUrl(String url) async {
    final cleanUrl = url.trim().replaceAll(RegExp(r'/+$'), '');
    _cachedServerUrl = cleanUrl;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_customServerUrlKey, cleanUrl);
    await refreshConfig();
  }

  /// Initializes the service:
  /// 1. Reads saved server URL from SharedPreferences.
  /// 2. Restores previously cached configuration instantly (zero launch lag).
  /// 3. Asynchronously fetches the latest published configuration from the Admin API.
  Future<void> initialize() {
    return _initializationFuture ??= _initialize();
  }

  Future<void> _initialize() async {
    try {
      final prefs = await SharedPreferences.getInstance();

      // Restore custom server URL if previously set
      final savedUrl = prefs.getString(_customServerUrlKey);
      if (savedUrl != null && savedUrl.isNotEmpty) {
        _cachedServerUrl = savedUrl;
      }

      // Restore cached config
      final cachedJsonStr = prefs.getString(_cacheKey);
      if (cachedJsonStr != null && cachedJsonStr.isNotEmpty) {
        try {
          final decoded = jsonDecode(cachedJsonStr) as Map<String, dynamic>;
          configNotifier.value = AppRemoteConfig.fromJson(decoded);
          debugPrint(
            '[AppConfigService] Restored cached config from ${configNotifier.value.publishedAt}',
          );
        } catch (e) {
          debugPrint('[AppConfigService] Error reading cached config: $e');
        }
      }
    } catch (e) {
      debugPrint('[AppConfigService] SharedPreferences error during init: $e');
    }

    // Wait for the bounded request so startup can use the latest admin preloader.
    try {
      await refreshConfig();
    } catch (e) {
      debugPrint('[AppConfigService] Remote sync timeout or offline: $e');
    }

    // Only start background polling timer outside of unit tests to prevent pumpAndSettle timeouts
    bool isTest = false;
    if (!kIsWeb) {
      try {
        isTest = Platform.environment.containsKey('FLUTTER_TEST');
      } catch (_) {}
    }
    if (!isTest) {
      _pollTimer ??= Timer.periodic(const Duration(seconds: 15), (_) {
        unawaited(refreshConfig());
      });
    }
  }

  /// Fetches published configuration from the Admin Panel (/api/app/config).
  /// Updates local cache and notifies all listening UI widgets.
  Future<bool> refreshConfig() async {
    if (_isLoading) return false;
    _isLoading = true;
    _syncError = null;

    final targetUrl = '$serverBaseUrl$configEndpoint';
    debugPrint(
      '[AppConfigService] Fetching remote screen config from: $targetUrl',
    );

    try {
      final response = await http
          .get(
            Uri.parse(targetUrl),
            headers: {
              'Accept': 'application/json',
              'Cache-Control': 'no-cache',
            },
          )
          .timeout(const Duration(milliseconds: 3500));

      if (response.statusCode == 200) {
        final decoded = jsonDecode(response.body) as Map<String, dynamic>;
        final newConfig = AppRemoteConfig.fromJson(decoded);

        configNotifier.value = newConfig;
        _lastSyncedAt = DateTime.now();
        _syncError = null;

        // Persist to local cache for offline startup
        try {
          final prefs = await SharedPreferences.getInstance();
          await prefs.setString(_cacheKey, response.body);
        } catch (_) {}

        debugPrint(
          '[AppConfigService] Successfully synced ${newConfig.screens.length} screens from admin panel!',
        );
        _isLoading = false;
        return true;
      } else {
        _syncError = 'Server returned status ${response.statusCode}';
        debugPrint(
          '[AppConfigService] Server returned error status: ${response.statusCode}',
        );
      }
    } catch (e) {
      _syncError = e.toString();
      debugPrint(
        '[AppConfigService] Network fetch skipped/failed (will use cached/defaults): $e',
      );
    } finally {
      _isLoading = false;
    }

    return false;
  }

  /// Helper to get a screen config directly
  RemoteScreenConfig? getScreen(String key) => config.getScreen(key);

  /// Helper to check if a screen is visible
  bool isScreenVisible(String key, {bool fallback = true}) =>
      config.isScreenVisible(key, fallback: fallback);
}
