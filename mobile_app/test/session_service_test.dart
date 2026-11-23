import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:panchayat_post/core/services/session_service.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('SessionService Acceptance Tests', () {
    test('Defaults to firstTime when app is newly installed', () async {
      SharedPreferences.setMockInitialValues({});
      final service = SessionService();

      final state = await service.checkSession();
      expect(state, equals(SessionState.firstTime));
    });

    test('Returns authenticated when valid unexpired token exists', () async {
      final futureExpiry = DateTime.now().add(const Duration(days: 7)).millisecondsSinceEpoch;
      SharedPreferences.setMockInitialValues({
        'is_first_time_user': false,
        'auth_token': 'test_bearer_token_xyz',
        'session_expiry_ms': futureExpiry,
        'user_id': 'user_123',
      });
      final service = SessionService();

      final state = await service.checkSession();
      expect(state, equals(SessionState.authenticated));
    });

    test('Returns unauthenticatedOrExpired when session has expired', () async {
      final pastExpiry = DateTime.now().subtract(const Duration(minutes: 5)).millisecondsSinceEpoch;
      SharedPreferences.setMockInitialValues({
        'is_first_time_user': false,
        'auth_token': 'expired_token_123',
        'session_expiry_ms': pastExpiry,
        'user_id': 'user_123',
      });
      final service = SessionService();

      final state = await service.checkSession();
      expect(state, equals(SessionState.unauthenticatedOrExpired));
    });

    test('Returns unauthenticatedOrExpired when token is missing/empty', () async {
      SharedPreferences.setMockInitialValues({
        'is_first_time_user': false,
        'auth_token': '',
      });
      final service = SessionService();

      final state = await service.checkSession();
      expect(state, equals(SessionState.unauthenticatedOrExpired));
    });

    test('saveSession updates state to authenticated', () async {
      SharedPreferences.setMockInitialValues({});
      final service = SessionService();

      await service.saveSession(
        token: 'new_token',
        userId: 'user_99',
        expiry: DateTime.now().add(const Duration(hours: 12)),
      );

      final state = await service.checkSession();
      expect(state, equals(SessionState.authenticated));
    });

    test('clearSession clears auth data', () async {
      SharedPreferences.setMockInitialValues({
        'is_first_time_user': false,
        'auth_token': 'active_token',
      });
      final service = SessionService();

      await service.clearSession();
      final state = await service.checkSession();
      expect(state, equals(SessionState.unauthenticatedOrExpired));
    });
  });
}
