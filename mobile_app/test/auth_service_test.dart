import 'dart:convert';

import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:panchayat_post/core/services/session_service.dart';
import 'package:panchayat_post/features/auth/data/auth_service.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  late AuthService authService;
  late SessionService sessionService;
  late SharedPreferences preferences;

  setUp(() async {
    SharedPreferences.setMockInitialValues({});
    preferences = await SharedPreferences.getInstance();
    sessionService = SessionService(preferences: preferences);
    authService = AuthService(preferences: preferences, sessionService: sessionService);
  });

  group('AuthService Unit Tests', () {
    test('Password hashing produces consistent SHA-256 salted hash and never stores plaintext', () {
      final hash1 = AuthService.hashPassword('MySecurePass1');
      final hash2 = AuthService.hashPassword('MySecurePass1');
      final hash3 = AuthService.hashPassword('DifferentPass1');

      expect(hash1, equals(hash2));
      expect(hash1, isNot(equals('MySecurePass1')));
      expect(hash1, isNot(equals(hash3)));
      expect(hash1.length, equals(64)); // Standard SHA-256 hex string length
    });

    test('Password policy validator accurately validates criteria', () {
      // Min length (8)
      expect(AuthService.validatePasswordMinLength('Abc1234'), isFalse);
      expect(AuthService.validatePasswordMinLength('Abc12345'), isTrue);

      // Upper and lower case
      expect(AuthService.validatePasswordCases('lowercase123'), isFalse);
      expect(AuthService.validatePasswordCases('UPPERCASE123'), isFalse);
      expect(AuthService.validatePasswordCases('UpperLower123'), isTrue);

      // Number
      expect(AuthService.validatePasswordNumber('NoNumberPass'), isFalse);
      expect(AuthService.validatePasswordNumber('WithNumber1'), isTrue);

      // All criteria combined (requires at least 8 characters)
      expect(AuthService.isPasswordValid('weak'), isFalse);
      expect(AuthService.isPasswordValid('validPass1'), isTrue);
      expect(AuthService.isPasswordValid('1111111111'), isTrue);
    });

    test('Username format validator restricts to alphanumeric and underscores (3-30 chars)', () {
      expect(AuthService.isUsernameFormatValid('ab'), isFalse); // Too short
      expect(AuthService.isUsernameFormatValid('abc'), isTrue);
      expect(AuthService.isUsernameFormatValid('user_123'), isTrue);
      expect(AuthService.isUsernameFormatValid('user@name'), isFalse); // Special characters not allowed
      expect(AuthService.isUsernameFormatValid('user name'), isFalse); // Spaces not allowed
      expect(AuthService.isUsernameFormatValid('a' * 31), isFalse); // Too long
    });

    test('Username availability check returns true for new and false for registered', () async {
      final isAvailableBefore = await authService.checkUsernameAvailability('sarpanch_raj');
      expect(isAvailableBefore, isTrue);

      await authService.registerUser(
        fullName: 'Rajesh Patel',
        username: 'sarpanch_raj',
        password: 'Password123',
      );

      final isAvailableAfter = await authService.checkUsernameAvailability('sarpanch_raj');
      expect(isAvailableAfter, isFalse);

      // Case insensitive check
      final isAvailableUpper = await authService.checkUsernameAvailability('SARPANCH_RAJ');
      expect(isAvailableUpper, isFalse);
    });

    test('Successful registration persists profile, hashes password, and creates active session', () async {
      final profile = await authService.registerUser(
        fullName: 'Rameshbhai Prajapati',
        username: 'ramesh_gram',
        password: 'SecureVillage123',
      );

      expect(profile.fullName, equals('Rameshbhai Prajapati'));
      expect(profile.username, equals('ramesh_gram'));
      expect(profile.passwordHash, isNot(equals('SecureVillage123')));
      expect(profile.status, equals('active'));
      expect(profile.acceptedLegalVersion, equals('1.0'));

      // Check session status in SessionService
      final sessionState = await sessionService.checkSession();
      expect(sessionState, equals(SessionState.authenticated));
    });

    test('Duplicate username registration throws AuthException', () async {
      await authService.registerUser(
        fullName: 'First User',
        username: 'village_post',
        password: 'Password123',
      );

      expect(
        () => authService.registerUser(
          fullName: 'Second User',
          username: 'village_post',
          password: 'Password456',
        ),
        throwsA(isA<AuthException>()),
      );
    });

    test('Login authenticates with valid credentials and rejects incorrect password', () async {
      await authService.registerUser(
        fullName: 'User Test',
        username: 'test_user',
        password: 'Password123',
      );

      // Successful login
      final profile = await authService.login(
        username: 'test_user',
        password: 'Password123',
      );
      expect(profile.username, equals('test_user'));

      // Incorrect password
      expect(
        () => authService.login(
          username: 'test_user',
          password: 'WrongPassword',
        ),
        throwsA(isA<AuthException>()),
      );

      // Non-existent user
      expect(
        () => authService.login(
          username: 'ghost_user',
          password: 'Password123',
        ),
        throwsA(isA<AuthException>()),
      );
    });

    test('Backend registration sends the profile and leaves server-controlled fields out', () async {
      late http.Request request;
      final service = AuthService(
        preferences: preferences,
        sessionService: sessionService,
        httpClient: MockClient((receivedRequest) async {
          request = receivedRequest;
          return http.Response(
            jsonEncode({'message': 'User registered successfully'}),
            200,
            headers: {'content-type': 'application/json'},
          );
        }),
      );

      final message = await service.registerWithBackend(
        fullName: 'Akash P',
        mobile: '7801985214',
        pin: '4567',
        occupation: 'Sarpanch',
        village: 'Palanpur',
        taluka: 'Palanpur',
        district: 'Bk',
      );

      expect(message, 'User registered successfully');
      expect(request.url.path, endsWith('/api/register'));
      expect(jsonDecode(request.body), {
        'name': 'Akash P',
        'mobile': '7801985214',
        'pin': '4567',
        'occupation': 'Sarpanch',
        'village': 'Palanpur',
        'taluka': 'Palanpur',
        'district': 'Bk',
      });
    });

    test('PIN login sends the PIN as otp and persists the backend session', () async {
      late http.Request request;
      final service = AuthService(
        preferences: preferences,
        sessionService: sessionService,
        httpClient: MockClient((receivedRequest) async {
          request = receivedRequest;
          return http.Response(
            jsonEncode({
              'token': 'backend-token',
              'user': {
                '_id': 'user-123',
                'name': 'Akash P',
                'mobile': 7801985214,
                'occupation': 'Sarpanch',
                'village': 'Palanpur',
                'taluka': 'Palanpur',
                'district': 'Bk',
                'status': true,
                'createdAt': '2026-01-01T00:00:00.000Z',
              },
            }),
            200,
            headers: {'content-type': 'application/json'},
          );
        }),
      );

      final profile = await service.loginWithPin(
        mobile: '7801985214',
        pin: '4567',
        rememberMe: false,
      );

      expect(request.url.path, endsWith('/api/login'));
      expect(jsonDecode(request.body), {'mobile': '7801985214', 'otp': '4567'});
      expect(profile.userId, 'user-123');
      expect(profile.status, 'active');
      expect(profile.villageCity, 'Palanpur');
      expect(await sessionService.checkSession(), SessionState.authenticated);
    });
  });
}
