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

  String? _cachedServerUrl;
  Future<void>? _initializationFuture;
  bool _isLoading = false;
  DateTime? _lastSyncedAt;
  String? _syncError;

  bool get isLoading => _isLoading;
  DateTime? get lastSyncedAt => _lastSyncedAt;
  String? get syncError => _syncError;

  /// Determines the best default server host for the current runtime platform:
  /// - Android Emulator -> http://10.0.2.2:3000
  /// - iOS Simulator / Desktop / Web -> http://localhost:3000
  String get defaultServerUrl {
    if (kIsWeb) {
      return 'http://localhost:3000';
    }
    if (Platform.isAndroid) {
      // 10.0.2.2 routes to the host computer's localhost from Android emulator
      return 'http://10.0.2.2:3000';
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
          debugPrint('[AppConfigService] Restored cached config from ${configNotifier.value.publishedAt}');
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
  }

  /// Fetches published configuration from the Admin Panel (/api/app/config).
  /// Updates local cache and notifies all listening UI widgets.
  Future<bool> refreshConfig() async {
    if (_isLoading) return false;
    _isLoading = true;
    _syncError = null;

    final targetUrl = '$serverBaseUrl$configEndpoint';
    debugPrint('[AppConfigService] Fetching remote screen config from: $targetUrl');

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

        debugPrint('[AppConfigService] Successfully synced ${newConfig.screens.length} screens from admin panel!');
        _isLoading = false;
        return true;
      } else {
        _syncError = 'Server returned status ${response.statusCode}';
        debugPrint('[AppConfigService] Server returned error status: ${response.statusCode}');
      }
    } catch (e) {
      _syncError = e.toString();
      debugPrint('[AppConfigService] Network fetch skipped/failed (will use cached/defaults): $e');
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
