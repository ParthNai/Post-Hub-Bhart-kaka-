import 'package:shared_preferences/shared_preferences.dart';

/// Represents the session status determined during app startup.
enum SessionState {
  /// User is opening the app for the first time without an account -> Navigate to Welcome Screen (Screen 02)
  firstTime,

  /// User has a valid authenticated session -> Navigate to Home Screen (Screen 06)
  authenticated,

  /// User session is expired or invalid -> Navigate to Welcome Screen (Screen 02)
  unauthenticatedOrExpired,
}

/// Service managing user session status and persistence.
class SessionService {
  SessionService({SharedPreferences? preferences}) : _prefs = preferences;

  SharedPreferences? _prefs;

  static const String _keyFirstTimeUser = 'is_first_time_user';
  static const String _keyAuthToken = 'auth_token';
  static const String _keySessionExpiry = 'session_expiry_ms';
  static const String _keyUserId = 'user_id';
  static const String _keyOnboardingCompleted = 'is_onboarding_completed';

  Future<SharedPreferences> _getPrefs() async {
    _prefs ??= await SharedPreferences.getInstance();
    return _prefs!;
  }

  /// Evaluates whether a valid authenticated user session exists.
  Future<SessionState> checkSession() async {
    final prefs = await _getPrefs();

    // Check if this is a first-time user
    final isFirstTime = prefs.getBool(_keyFirstTimeUser) ?? true;
    if (isFirstTime) {
      return SessionState.firstTime;
    }

    // Check for authentication token
    final token = prefs.getString(_keyAuthToken);
    final expiryMs = prefs.getInt(_keySessionExpiry);

    if (token == null || token.trim().isEmpty) {
      return SessionState.unauthenticatedOrExpired;
    }

    // Check expiration timestamp if configured
    if (expiryMs != null) {
      final nowMs = DateTime.now().millisecondsSinceEpoch;
      if (nowMs >= expiryMs) {
        // Session has expired
        return SessionState.unauthenticatedOrExpired;
      }
    }

    return SessionState.authenticated;
  }

  /// Helper to record that the user has completed or viewed the onboarding flow.
  Future<void> markFirstTimeCompleted() async {
    final prefs = await _getPrefs();
    await prefs.setBool(_keyFirstTimeUser, false);
  }

  /// Marks the onboarding flow as completed.
  Future<void> markOnboardingCompleted() async {
    final prefs = await _getPrefs();
    await prefs.setBool(_keyOnboardingCompleted, true);
  }

  /// Checks if the onboarding flow has been completed.
  Future<bool> isOnboardingCompleted() async {
    final prefs = await _getPrefs();
    return prefs.getBool(_keyOnboardingCompleted) ?? false;
  }

  /// Sets mock or real session credentials for testing or post-login use.
  Future<void> saveSession({
    required String token,
    required String userId,
    DateTime? expiry,
  }) async {
    final prefs = await _getPrefs();
    await prefs.setBool(_keyFirstTimeUser, false);
    await prefs.setString(_keyAuthToken, token);
    await prefs.setString(_keyUserId, userId);
    if (expiry != null) {
      await prefs.setInt(_keySessionExpiry, expiry.millisecondsSinceEpoch);
    } else {
      await prefs.remove(_keySessionExpiry);
    }
  }

  /// Returns the current active user ID from the session if available.
  Future<String?> getUserId() async {
    final prefs = await _getPrefs();
    return prefs.getString(_keyUserId);
  }

  /// Returns the current active auth token from the session if available.
  Future<String?> getAuthToken() async {
    final prefs = await _getPrefs();
    return prefs.getString(_keyAuthToken);
  }

  /// Clears the session credentials (logs the user out or resets expiry).
  Future<void> clearSession() async {
    final prefs = await _getPrefs();
    await prefs.remove(_keyAuthToken);
    await prefs.remove(_keySessionExpiry);
    await prefs.remove(_keyUserId);
  }

  /// Completely resets all flags back to clean first-time install state (for testing).
  Future<void> resetAll() async {
    final prefs = await _getPrefs();
    await prefs.clear();
  }
}
