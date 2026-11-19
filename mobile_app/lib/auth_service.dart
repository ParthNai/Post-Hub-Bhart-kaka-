import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;

const _sessionTokenKey = 'posthub_app_session_token';

String defaultApiBaseUrl() {
  const configuredUrl = String.fromEnvironment('POSTHUB_API_BASE_URL');
  if (configuredUrl.isNotEmpty) {
    return configuredUrl.replaceFirst(RegExp(r'/+$'), '');
  }
  if (!kIsWeb && defaultTargetPlatform == TargetPlatform.android) {
    return 'http://10.0.2.2:3000';
  }
  return 'http://localhost:3000';
}

class AppUser {
  const AppUser({
    required this.id,
    required this.email,
    required this.name,
    required this.role,
  });

  final String id;
  final String email;
  final String name;
  final String role;

  factory AppUser.fromJson(Object? json) {
    if (json is! Map<String, dynamic> ||
        json['id'] is! String ||
        json['email'] is! String ||
        json['name'] is! String ||
        json['role'] is! String) {
      throw const FormatException(
        'The server returned an invalid user profile.',
      );
    }

    return AppUser(
      id: json['id'] as String,
      email: json['email'] as String,
      name: json['name'] as String,
      role: json['role'] as String,
    );
  }
}

class AppLoginExperience {
  const AppLoginExperience({
    required this.brandName,
    required this.brandTagline,
    required this.welcomeTitle,
    required this.welcomeSubtitle,
    required this.footerTagline,
    required this.heroImageUrl,
    required this.accentColor,
    required this.backgroundColor,
    required this.brandHeaderEnabled,
    required this.welcomeEnabled,
    required this.googleEnabled,
    required this.emailEnabled,
    required this.mobileEnabled,
    required this.signupEnabled,
  });

  static const defaults = AppLoginExperience(
    brandName: 'Post Hub',
    brandTagline: 'Design  ·  Create  ·  Inspire',
    welcomeTitle: 'Welcome Back!',
    welcomeSubtitle:
        'Sign in to continue creating amazing designs with Post Hub 💜',
    footerTagline: 'Turn Your Ideas Into Stunning Designs ✨',
    heroImageUrl: '',
    accentColor: '#7026E8',
    backgroundColor: '#FFF9FF',
    brandHeaderEnabled: true,
    welcomeEnabled: true,
    googleEnabled: true,
    emailEnabled: true,
    mobileEnabled: true,
    signupEnabled: true,
  );

  final String brandName;
  final String brandTagline;
  final String welcomeTitle;
  final String welcomeSubtitle;
  final String footerTagline;
  final String heroImageUrl;
  final String accentColor;
  final String backgroundColor;
  final bool brandHeaderEnabled;
  final bool welcomeEnabled;
  final bool googleEnabled;
  final bool emailEnabled;
  final bool mobileEnabled;
  final bool signupEnabled;

  factory AppLoginExperience.fromConfig(Object? json) {
    if (json is! Map<String, dynamic>) {
      throw const FormatException('The published login design is invalid.');
    }

    String readString(String key, String fallback) {
      final value = json[key];
      return value is String ? value : fallback;
    }

    bool readBool(String key, bool fallback) {
      final value = json[key];
      return value is bool ? value : fallback;
    }

    return AppLoginExperience(
      brandName: readString('brandName', defaults.brandName),
      brandTagline: readString('brandTagline', defaults.brandTagline),
      welcomeTitle: readString('welcomeTitle', defaults.welcomeTitle),
      welcomeSubtitle: readString('welcomeSubtitle', defaults.welcomeSubtitle),
      footerTagline: readString('footerTagline', defaults.footerTagline),
      heroImageUrl: readString('heroImageUrl', defaults.heroImageUrl),
      accentColor: readString('accentColor', defaults.accentColor),
      backgroundColor: readString('backgroundColor', defaults.backgroundColor),
      brandHeaderEnabled: readBool(
        'brandHeaderEnabled',
        defaults.brandHeaderEnabled,
      ),
      welcomeEnabled: readBool('welcomeEnabled', defaults.welcomeEnabled),
      googleEnabled: readBool('googleEnabled', defaults.googleEnabled),
      emailEnabled: readBool('emailEnabled', defaults.emailEnabled),
      mobileEnabled: readBool('mobileEnabled', defaults.mobileEnabled),
      signupEnabled: readBool('signupEnabled', defaults.signupEnabled),
    );
  }

  factory AppLoginExperience.fromLayoutConfig(Object? json) {
    if (json is! Map<String, dynamic>) {
      throw const FormatException('The published login layout is invalid.');
    }
    final experience = AppLoginExperience.fromConfig(json['loginExperience']);
    final sections = json['sections'];

    bool sectionEnabled(String id) {
      if (sections is! List) return true;
      for (final section in sections.whereType<Map<String, dynamic>>()) {
        if (section['id'] == id && section['enabled'] is bool) {
          return section['enabled'] as bool;
        }
      }
      return true;
    }

    return AppLoginExperience(
      brandName: experience.brandName,
      brandTagline: experience.brandTagline,
      welcomeTitle: experience.welcomeTitle,
      welcomeSubtitle: experience.welcomeSubtitle,
      footerTagline: experience.footerTagline,
      heroImageUrl: experience.heroImageUrl,
      accentColor: json['primaryAccent'] is String
          ? json['primaryAccent'] as String
          : experience.accentColor,
      backgroundColor: json['backgroundColor'] is String
          ? json['backgroundColor'] as String
          : experience.backgroundColor,
      brandHeaderEnabled: sectionEnabled('brand_header'),
      welcomeEnabled: sectionEnabled('welcome_text'),
      googleEnabled: experience.googleEnabled && sectionEnabled('social_login'),
      emailEnabled:
          experience.emailEnabled && sectionEnabled('credentials_form'),
      mobileEnabled: experience.mobileEnabled && sectionEnabled('mobile_login'),
      signupEnabled: experience.signupEnabled && sectionEnabled('signup_link'),
    );
  }

  @override
  bool operator ==(Object other) {
    return other is AppLoginExperience &&
        brandName == other.brandName &&
        brandTagline == other.brandTagline &&
        welcomeTitle == other.welcomeTitle &&
        welcomeSubtitle == other.welcomeSubtitle &&
        footerTagline == other.footerTagline &&
        heroImageUrl == other.heroImageUrl &&
        accentColor == other.accentColor &&
        backgroundColor == other.backgroundColor &&
        brandHeaderEnabled == other.brandHeaderEnabled &&
        welcomeEnabled == other.welcomeEnabled &&
        googleEnabled == other.googleEnabled &&
        emailEnabled == other.emailEnabled &&
        mobileEnabled == other.mobileEnabled &&
        signupEnabled == other.signupEnabled;
  }

  @override
  int get hashCode => Object.hash(
    brandName,
    brandTagline,
    welcomeTitle,
    welcomeSubtitle,
    footerTagline,
    heroImageUrl,
    accentColor,
    backgroundColor,
    brandHeaderEnabled,
    welcomeEnabled,
    googleEnabled,
    emailEnabled,
    mobileEnabled,
    signupEnabled,
  );
}

class AppHomeSection {
  const AppHomeSection({
    required this.id,
    required this.title,
    required this.enabled,
    required this.order,
  });

  final String id;
  final String title;
  final bool enabled;
  final int order;
}

class AppHomeExperience {
  const AppHomeExperience({
    required this.name,
    required this.headerTitle,
    required this.accentColor,
    required this.backgroundColor,
    required this.bannerVisible,
    required this.itemsPerPage,
    required this.gridColumns,
    required this.tagsFilterEnabled,
    required this.quickActionsEnabled,
    required this.sections,
  });

  static const defaults = AppHomeExperience(
    name: 'Home',
    headerTitle: 'Home',
    accentColor: '#7956C9',
    backgroundColor: '#FAF7F2',
    bannerVisible: true,
    itemsPerPage: 12,
    gridColumns: 2,
    tagsFilterEnabled: true,
    quickActionsEnabled: true,
    sections: [
      AppHomeSection(id: 'hero', title: 'Hero Banner', enabled: true, order: 1),
      AppHomeSection(
        id: 'categories',
        title: 'Category Rail',
        enabled: true,
        order: 2,
      ),
      AppHomeSection(
        id: 'featured_templates',
        title: 'Featured Templates',
        enabled: true,
        order: 3,
      ),
      AppHomeSection(
        id: 'action_banner',
        title: 'Explore All Templates Action',
        enabled: true,
        order: 4,
      ),
    ],
  );

  final String name;
  final String headerTitle;
  final String accentColor;
  final String backgroundColor;
  final bool bannerVisible;
  final int itemsPerPage;
  final int gridColumns;
  final bool tagsFilterEnabled;
  final bool quickActionsEnabled;
  final List<AppHomeSection> sections;

  bool sectionEnabled(String id) =>
      sections.where((section) => section.id == id).firstOrNull?.enabled ??
      true;

  String sectionTitle(String id, String fallback) =>
      sections.where((section) => section.id == id).firstOrNull?.title ??
      fallback;

  factory AppHomeExperience.fromNavigationItem(Object? json) {
    if (json is! Map<String, dynamic> ||
        json['layoutConfig'] is! Map<String, dynamic>) {
      throw const FormatException('The published Home screen is invalid.');
    }

    final layout = json['layoutConfig'] as Map<String, dynamic>;
    final sectionJson = layout['sections'];
    final sections = sectionJson is List
        ? sectionJson
              .whereType<Map<String, dynamic>>()
              .map(
                (section) => AppHomeSection(
                  id: section['id'] is String ? section['id'] as String : '',
                  title: section['title'] is String
                      ? section['title'] as String
                      : '',
                  enabled: section['enabled'] is bool
                      ? section['enabled'] as bool
                      : true,
                  order: section['order'] is int ? section['order'] as int : 0,
                ),
              )
              .toList()
        : AppHomeExperience.defaults.sections;

    return AppHomeExperience(
      name: json['name'] is String
          ? json['name'] as String
          : AppHomeExperience.defaults.name,
      headerTitle: layout['headerTitle'] is String
          ? layout['headerTitle'] as String
          : AppHomeExperience.defaults.headerTitle,
      accentColor: layout['primaryAccent'] is String
          ? layout['primaryAccent'] as String
          : AppHomeExperience.defaults.accentColor,
      backgroundColor: layout['backgroundColor'] is String
          ? layout['backgroundColor'] as String
          : AppHomeExperience.defaults.backgroundColor,
      bannerVisible: layout['bannerVisible'] is bool
          ? layout['bannerVisible'] as bool
          : true,
      itemsPerPage: layout['itemsPerPage'] is int
          ? (layout['itemsPerPage'] as int).clamp(1, 60)
          : AppHomeExperience.defaults.itemsPerPage,
      gridColumns: layout['gridColumns'] is int
          ? (layout['gridColumns'] as int).clamp(1, 3)
          : AppHomeExperience.defaults.gridColumns,
      tagsFilterEnabled: layout['tagsFilterEnabled'] is bool
          ? layout['tagsFilterEnabled'] as bool
          : true,
      quickActionsEnabled: layout['quickActionsEnabled'] is bool
          ? layout['quickActionsEnabled'] as bool
          : true,
      sections: sections.isEmpty
          ? AppHomeExperience.defaults.sections
          : sections,
    );
  }
}

class AppAuthException implements Exception {
  const AppAuthException(this.message);

  final String message;

  @override
  String toString() => message;
}

abstract interface class SessionTokenStore {
  Future<String?> read();
  Future<void> write(String token);
  Future<void> clear();
}

class SecureSessionTokenStore implements SessionTokenStore {
  SecureSessionTokenStore({FlutterSecureStorage? storage})
    : _storage = storage ?? const FlutterSecureStorage();

  final FlutterSecureStorage _storage;

  @override
  Future<String?> read() => _storage.read(key: _sessionTokenKey);

  @override
  Future<void> write(String token) =>
      _storage.write(key: _sessionTokenKey, value: token);

  @override
  Future<void> clear() => _storage.delete(key: _sessionTokenKey);
}

class AppAuthService {
  AppAuthService({
    required String baseUrl,
    http.Client? client,
    SessionTokenStore? tokenStore,
  }) : _baseUrl = baseUrl.replaceFirst(RegExp(r'/+$'), ''),
       _client = client ?? http.Client(),
       _tokenStore = tokenStore ?? SecureSessionTokenStore();

  final String _baseUrl;
  final http.Client _client;
  final SessionTokenStore _tokenStore;

  Future<AppLoginExperience> loadLoginExperience() async {
    final body = await _loadPublishedConfig();
    final layout = _findScreenLayout(body, 'login');
    try {
      return AppLoginExperience.fromLayoutConfig(layout);
    } on FormatException catch (error) {
      throw AppAuthException(error.message);
    }
  }

  Future<AppHomeExperience> loadHomeExperience() async {
    final body = await _loadPublishedConfig();
    final navigation = body['navigation'] as List;
    for (final screen in navigation.whereType<Map<String, dynamic>>()) {
      if (screen['key'] == 'home' && screen['visibilityEnabled'] != false) {
        try {
          return AppHomeExperience.fromNavigationItem(screen);
        } on FormatException catch (error) {
          throw AppAuthException(error.message);
        }
      }
    }
    throw const AppAuthException(
      'The published Home screen could not be found or is hidden.',
    );
  }

  Future<Map<String, dynamic>> _loadPublishedConfig() async {
    final response = await _send(
      () => _client.get(Uri.parse('$_baseUrl/api/app/config')),
    );
    final body = _decodeResponse(response);
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw AppAuthException(_errorMessage(body));
    }
    if (body is! Map<String, dynamic> || body['navigation'] is! List) {
      throw const AppAuthException(
        'The server returned an invalid app configuration.',
      );
    }
    return body;
  }

  Map<String, dynamic> _findScreenLayout(
    Map<String, dynamic> body,
    String key,
  ) {
    Map<String, dynamic>? targetScreen;
    for (final screen
        in (body['navigation'] as List).whereType<Map<String, dynamic>>()) {
      if (screen['key'] == key) {
        targetScreen = screen;
        break;
      }
    }
    final layout = targetScreen?['layoutConfig'];
    if (layout is! Map<String, dynamic>) {
      throw const AppAuthException(
        'The published login screen configuration could not be found.',
      );
    }
    return layout;
  }

  Future<AppUser> login({
    required String email,
    required String password,
    required bool rememberMe,
  }) async {
    final response = await _send(
      () => _client.post(
        Uri.parse('$_baseUrl/api/app/auth/login'),
        headers: const {'content-type': 'application/json'},
        body: jsonEncode({
          'email': email.trim(),
          'password': password,
          'rememberMe': rememberMe,
        }),
      ),
    );
    final body = _decodeResponse(response);
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw AppAuthException(_errorMessage(body));
    }

    if (body is! Map<String, dynamic> ||
        body['success'] != true ||
        body['token'] is! String ||
        (body['token'] as String).isEmpty) {
      throw const AppAuthException(
        'The server returned an invalid login response.',
      );
    }

    final user = AppUser.fromJson(body['user']);
    await _tokenStore.write(body['token'] as String);
    return user;
  }

  Future<AppUser> currentUser() async {
    final token = await _tokenStore.read();
    if (token == null || token.isEmpty) {
      throw const AppAuthException('Please log in to continue.');
    }

    final response = await _send(
      () => _client.get(
        Uri.parse('$_baseUrl/api/app/auth/me'),
        headers: {'authorization': 'Bearer $token'},
      ),
    );
    final body = _decodeResponse(response);

    if (response.statusCode == 401) {
      await _tokenStore.clear();
      throw AppAuthException(_errorMessage(body));
    }
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw AppAuthException(_errorMessage(body));
    }
    if (body is! Map<String, dynamic> || body['authenticated'] != true) {
      throw const AppAuthException(
        'The server returned an invalid session response.',
      );
    }

    return AppUser.fromJson(body['user']);
  }

  Future<void> logout() => _tokenStore.clear();

  Future<http.Response> _send(Future<http.Response> Function() request) async {
    try {
      return await request().timeout(const Duration(seconds: 20));
    } catch (_) {
      throw AppAuthException(
        'Unable to reach PostHub. Check your connection and try again.',
      );
    }
  }

  Object? _decodeResponse(http.Response response) {
    try {
      return jsonDecode(response.body);
    } on FormatException {
      return null;
    }
  }

  String _errorMessage(Object? body) {
    if (body is Map<String, dynamic> && body['error'] is String) {
      return body['error'] as String;
    }
    return 'Something went wrong. Please try again.';
  }
}
