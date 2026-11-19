import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:mobile_app/auth_service.dart';
import 'package:mobile_app/creator_data.dart';
import 'package:mobile_app/main.dart';
import 'package:shared_preferences/shared_preferences.dart';

class _MemoryTokenStore implements SessionTokenStore {
  String? token;

  @override
  Future<String?> read() async => token;

  @override
  Future<void> write(String value) async {
    token = value;
  }

  @override
  Future<void> clear() async {
    token = null;
  }
}

void main() {
  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  test('loads the published login configuration', () async {
    final experience = await _service().loadLoginExperience();

    expect(experience.brandName, 'Post Hub');
    expect(experience.welcomeTitle, 'Welcome Back!');
    expect(experience.emailEnabled, isTrue);
    expect(experience.googleEnabled, isTrue);
  });

  testWidgets('opens directly on the published welcome login screen', (
    WidgetTester tester,
  ) async {
    _setMobileViewport(tester);

    await tester.pumpWidget(PostHubApp(authService: _service()));
    await tester.pumpAndSettle();

    expect(find.text('Post Hub'), findsOneWidget);
    expect(find.text('Welcome Back!'), findsOneWidget);
    expect(find.byKey(const ValueKey('email-sign-in')), findsOneWidget);
    expect(find.byKey(const ValueKey('email-field')), findsNothing);
    expect(find.text('Continue'), findsNothing);
    expect(tester.takeException(), isNull);
  });

  testWidgets('email login authenticates and opens the Home screen', (
    WidgetTester tester,
  ) async {
    _setMobileViewport(tester);

    http.Request? sentRequest;
    final tokenStore = _MemoryTokenStore();
    final authService = _service(
      tokenStore: tokenStore,
      handler: (request) async {
        if (request.url.path == '/api/app/config') {
          return _configResponse();
        }
        sentRequest = request;
        return http.Response(
          jsonEncode({
            'success': true,
            'token': 'member-session-token',
            'tokenType': 'Bearer',
            'expiresIn': 43200,
            'user': {
              'id': 'member-1',
              'email': 'member@example.com',
              'name': 'PostHub Member',
              'role': 'member',
            },
          }),
          200,
        );
      },
    );

    await tester.pumpWidget(PostHubApp(authService: authService));
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('email-sign-in')));
    await tester.pumpAndSettle();
    await tester.enterText(
      find.byKey(const ValueKey('email-field')),
      'member@example.com',
    );
    await tester.enterText(
      find.byKey(const ValueKey('password-field')),
      'correct-horse',
    );
    await tester.ensureVisible(find.byKey(const ValueKey('login-submit')));
    await tester.tap(find.byKey(const ValueKey('login-submit')));
    await tester.pumpAndSettle();

    expect(find.byKey(const ValueKey('home-hero')), findsOneWidget);
    expect(tokenStore.token, 'member-session-token');
    expect(sentRequest?.url.path, '/api/app/auth/login');
    expect(sentRequest?.headers['content-type'], 'application/json');
    expect(jsonDecode(sentRequest!.body), {
      'email': 'member@example.com',
      'password': 'correct-horse',
      'rememberMe': true,
    });
    expect(tester.takeException(), isNull);
  });

  testWidgets('login errors are shown to the user', (
    WidgetTester tester,
  ) async {
    _setMobileViewport(tester);

    final authService = _service(
      handler: (request) async => request.url.path == '/api/app/config'
          ? _configResponse()
          : http.Response(
              jsonEncode({'error': 'Invalid email or password.'}),
              401,
            ),
    );
    await tester.pumpWidget(PostHubApp(authService: authService));
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('email-sign-in')));
    await tester.pumpAndSettle();
    await tester.enterText(
      find.byKey(const ValueKey('email-field')),
      'member@example.com',
    );
    await tester.enterText(
      find.byKey(const ValueKey('password-field')),
      'wrong-password',
    );
    await tester.ensureVisible(find.byKey(const ValueKey('login-submit')));
    await tester.tap(find.byKey(const ValueKey('login-submit')));
    await tester.pumpAndSettle();

    expect(find.text('Invalid email or password.'), findsOneWidget);
    expect(find.byKey(const ValueKey('login-error')), findsOneWidget);
    expect(tester.takeException(), isNull);
  });

  testWidgets('Google demo login opens the admin-configured Home screen', (
    WidgetTester tester,
  ) async {
    _setMobileViewport(tester);

    final tokenStore = _MemoryTokenStore();
    final authPaths = <String>[];
    final service = _service(
      tokenStore: tokenStore,
      handler: (request) async {
        authPaths.add(request.url.path);
        return request.url.path == '/api/app/config'
            ? _configResponse()
            : http.Response(
                jsonEncode({'error': 'Unexpected auth request.'}),
                500,
              );
      },
    );

    await tester.pumpWidget(PostHubApp(authService: service));
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('google-sign-in')));
    await tester.pumpAndSettle();

    expect(find.byKey(const ValueKey('home-hero')), findsOneWidget);
    expect(find.byKey(const ValueKey('home-navigation-Home')), findsOneWidget);
    expect(
      find.byKey(const ValueKey('template-category-tabs')),
      findsOneWidget,
    );
    expect(
      find.byKey(const ValueKey('home-navigation-Explore')),
      findsOneWidget,
    );
    expect(find.byKey(const ValueKey('demo-session-notice')), findsOneWidget);
    expect(
      find.textContaining('Google sign-in is not connected yet.'),
      findsOneWidget,
    );
    expect(authPaths, everyElement('/api/app/config'));
    expect(tokenStore.token, isNull);

    await tester.ensureVisible(
      find.byKey(const ValueKey('template-category-Business')),
    );
    await tester.tap(find.byKey(const ValueKey('template-category-Business')));
    await tester.pumpAndSettle();
    expect(find.text('Eid Special Offers'), findsOneWidget);
    expect(find.text('Diwali Greetings'), findsNothing);

    await tester.drag(find.byType(ListView).first, const Offset(0, -1000));
    await tester.pumpAndSettle();
    expect(
      find.text('Choose an occasion template and save your first design.'),
      findsOneWidget,
    );
    expect(tester.takeException(), isNull);
  });

  test('occasion catalog changes based on the selected region', () {
    final india = OccasionCatalog.forRegion('India');
    final unitedStates = OccasionCatalog.forRegion('United States');

    expect(india.any((item) => item.occasion == 'Diwali'), isTrue);
    expect(india.any((item) => item.occasion == 'Halloween'), isFalse);
    expect(unitedStates.any((item) => item.occasion == 'Thanksgiving'), isTrue);
    expect(unitedStates.any((item) => item.occasion == 'Diwali'), isFalse);
  });

  test('loads and shows templates from admin backend dynamically', () {
    final adminTemplate = OccasionTemplate.fromAdminJson({
      'id': 'TPL-001',
      'name': 'Business Promotion Poster',
      'category': 'Business',
      'format': '3:4',
      'headline': 'Grow Your Business',
      'subheadline': 'with Smart Solutions',
      'primaryColor': '#1E3A8A',
      'accentColor': '#3B82F6',
    });

    expect(adminTemplate.id, 'TPL-001');
    expect(adminTemplate.title, 'Business Promotion Poster');
    expect(adminTemplate.category, 'Business');
    expect(adminTemplate.headline, 'Grow Your Business');
    expect(adminTemplate.subtitle, 'with Smart Solutions');
    expect(adminTemplate.background, 0xFF1E3A8A);
    expect(adminTemplate.foreground, 0xFF3B82F6);

    OccasionCatalog.setAdminTemplates([adminTemplate]);
    expect(OccasionCatalog.adminTemplates.length, 1);
    expect(
      OccasionCatalog.forRegion('India').any((t) => t.id == 'TPL-001'),
      isTrue,
    );

    // Clean up
    OccasionCatalog.setAdminTemplates([]);
  });

  testWidgets('personalizes and saves an occasion design on device', (
    WidgetTester tester,
  ) async {
    _setMobileViewport(tester);
    final service = _service();

    await tester.pumpWidget(PostHubApp(authService: service));
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('google-sign-in')));
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('home-navigation-Explore')));
    await tester.pumpAndSettle();

    expect(find.byKey(const ValueKey('explore-screen')), findsOneWidget);
    expect(find.byKey(const ValueKey('template-search')), findsOneWidget);
    await tester.ensureVisible(
      find.byKey(const ValueKey('occasion-template-diwali-greetings')),
    );
    await tester.tap(
      find.byKey(const ValueKey('occasion-template-diwali-greetings')),
    );
    await tester.pumpAndSettle();

    expect(find.text('Customize design'), findsOneWidget);
    await tester.enterText(
      find.byKey(const ValueKey('design-headline')),
      'Diwali sale!',
    );
    await tester.enterText(
      find.byKey(const ValueKey('design-business-name')),
      'Parth Studio',
    );
    await tester.tap(find.byKey(const ValueKey('design-palette-1')));
    await tester.tap(find.byKey(const ValueKey('save-design')));
    await tester.pumpAndSettle();

    expect(find.text('Design saved to My designs.'), findsOneWidget);
    await tester.tap(find.byKey(const ValueKey('home-navigation-Saved')));
    await tester.pumpAndSettle();
    expect(find.byKey(const ValueKey('saved-designs-screen')), findsOneWidget);
    expect(find.text('Diwali sale!'), findsOneWidget);
    expect(find.text('Parth Studio'), findsWidgets);
    expect(tester.takeException(), isNull);

    final store = CreatorStore();
    final saved = await store.loadDesigns();
    expect(saved, hasLength(1));
    expect(saved.single.headline, 'Diwali sale!');
    expect(saved.single.businessName, 'Parth Studio');
  });

  testWidgets('region and language preferences persist and update Explore', (
    WidgetTester tester,
  ) async {
    _setMobileViewport(tester);
    await tester.pumpWidget(PostHubApp(authService: _service()));
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('google-sign-in')));
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('home-navigation-Profile')));
    await tester.pumpAndSettle();

    await tester.tap(find.byKey(const ValueKey('profile-region')));
    await tester.pumpAndSettle();
    await tester.tap(find.text('United States').last);
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('profile-language')));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Hindi').last);
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('save-creator-profile')));
    await tester.pumpAndSettle();

    final preferences = await CreatorStore().loadPreferences();
    expect(preferences.region, 'United States');
    expect(preferences.language, 'Hindi');

    await tester.tap(find.byKey(const ValueKey('home-navigation-Explore')));
    await tester.pumpAndSettle();
    expect(find.text('Explore United States'), findsOneWidget);
    expect(
      find.byKey(const ValueKey('occasion-template-halloween')),
      findsOneWidget,
    );
    expect(
      find.byKey(const ValueKey('occasion-template-diwali-greetings')),
      findsNothing,
    );
    expect(tester.takeException(), isNull);
  });

  test('loads the published Home screen settings from admin config', () async {
    final home = await _service().loadHomeExperience();

    expect(home.name, 'Home');
    expect(home.headerTitle, 'Home');
    expect(home.bannerVisible, isTrue);
    expect(home.sectionEnabled('featured_templates'), isTrue);
    expect(home.sectionTitle('categories', ''), 'Category Rail');
  });

  testWidgets('Home screen follows published admin visibility and title', (
    WidgetTester tester,
  ) async {
    _setMobileViewport(tester);

    await tester.pumpWidget(
      PostHubApp(
        authService: _service(
          handler: (_) async => _configResponse(
            homeLayout: {
              'headerTitle': 'Creator Studio',
              'bannerVisible': false,
              'itemsPerPage': 4,
              'gridColumns': 1,
              'tagsFilterEnabled': false,
              'quickActionsEnabled': false,
              'primaryAccent': '#3867D6',
              'sections': [
                {'id': 'hero', 'title': 'Hero', 'enabled': true, 'order': 1},
                {
                  'id': 'categories',
                  'title': 'Categories',
                  'enabled': false,
                  'order': 2,
                },
                {
                  'id': 'featured_templates',
                  'title': 'Featured designs',
                  'enabled': true,
                  'order': 3,
                },
                {
                  'id': 'action_banner',
                  'title': 'Explore designs',
                  'enabled': true,
                  'order': 4,
                },
              ],
            },
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();
    await tester.tap(find.byKey(const ValueKey('google-sign-in')));
    await tester.pumpAndSettle();

    expect(find.text('Creator Studio'), findsOneWidget);
    expect(find.byKey(const ValueKey('home-hero')), findsNothing);
    expect(find.text('Categories'), findsNothing);
    expect(find.text('Featured designs'), findsOneWidget);
    expect(find.text('Explore designs'), findsNothing);
    expect(
      find.byKey(const ValueKey('featured-template-grid')),
      findsOneWidget,
    );
    expect(tester.takeException(), isNull);
  });

  testWidgets('uses the published admin branding and sign-in options', (
    WidgetTester tester,
  ) async {
    _setMobileViewport(tester);

    final service = _service(
      handler: (_) async => _configResponse(
        experience: {
          'brandName': 'Studio Canvas',
          'brandTagline': 'Make it yours',
          'welcomeTitle': 'Create something',
          'welcomeSubtitle': 'Your creative space is ready.',
          'footerTagline': 'Made for your ideas',
          'heroImageUrl': '',
          'googleEnabled': false,
          'emailEnabled': true,
          'mobileEnabled': false,
          'signupEnabled': false,
        },
      ),
    );

    await tester.pumpWidget(PostHubApp(authService: service));
    await tester.pumpAndSettle();

    expect(find.text('Studio Canvas'), findsOneWidget);
    expect(find.text('Make it yours'), findsOneWidget);
    expect(find.text('Create something'), findsOneWidget);
    expect(find.byKey(const ValueKey('google-sign-in')), findsNothing);
    expect(find.byKey(const ValueKey('mobile-sign-in')), findsNothing);
    expect(find.byKey(const ValueKey('email-sign-in')), findsOneWidget);
    expect(find.text('Create an Account  →'), findsNothing);
    expect(find.text('Made for your ideas'), findsOneWidget);
    expect(tester.takeException(), isNull);
  });

  testWidgets('automatically applies newly published settings while open', (
    WidgetTester tester,
  ) async {
    _setMobileViewport(tester);
    var configRequests = 0;
    final service = _service(
      handler: (_) async {
        configRequests++;
        return _configResponse(
          experience: _experienceData(
            welcomeTitle: configRequests == 1
                ? 'Original welcome'
                : 'Updated by admin',
          ),
        );
      },
    );

    await tester.pumpWidget(PostHubApp(authService: service));
    await tester.pumpAndSettle();
    expect(find.text('Original welcome'), findsOneWidget);

    await tester.pump(const Duration(seconds: 30));
    await tester.pumpAndSettle();

    expect(configRequests, 2);
    expect(find.text('Updated by admin'), findsOneWidget);
    expect(find.text('Original welcome'), findsNothing);
    expect(tester.takeException(), isNull);
  });

  testWidgets('refreshes published settings when returning to foreground', (
    WidgetTester tester,
  ) async {
    _setMobileViewport(tester);
    var configRequests = 0;
    final service = _service(
      handler: (_) async {
        configRequests++;
        return _configResponse(
          experience: _experienceData(
            welcomeTitle: configRequests == 1
                ? 'Before background'
                : 'After foreground',
          ),
        );
      },
    );

    await tester.pumpWidget(PostHubApp(authService: service));
    await tester.pumpAndSettle();
    expect(find.text('Before background'), findsOneWidget);

    tester.binding.handleAppLifecycleStateChanged(AppLifecycleState.paused);
    tester.binding.handleAppLifecycleStateChanged(AppLifecycleState.resumed);
    await tester.pumpAndSettle();

    expect(configRequests, 2);
    expect(find.text('After foreground'), findsOneWidget);
    expect(tester.takeException(), isNull);
  });

  testWidgets('shows an explicit retry when published config cannot load', (
    WidgetTester tester,
  ) async {
    _setMobileViewport(tester);

    await tester.pumpWidget(
      PostHubApp(
        authService: _service(
          handler: (_) async => http.Response(
            jsonEncode({'error': 'Configuration unavailable.'}),
            503,
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text('Configuration unavailable.'), findsOneWidget);
    expect(find.text('Retry'), findsOneWidget);
    expect(find.text('Welcome Back!'), findsOneWidget);
    expect(tester.takeException(), isNull);
  });

  testWidgets('honors published section visibility switches', (
    WidgetTester tester,
  ) async {
    _setMobileViewport(tester);

    await tester.pumpWidget(
      PostHubApp(
        authService: _service(
          handler: (_) async => _configResponse(
            sectionValues: {
              'welcome_text': false,
              'credentials_form': false,
              'social_login': false,
              'mobile_login': false,
              'signup_link': false,
            },
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text('Post Hub'), findsOneWidget);
    expect(find.text('Welcome Back!'), findsNothing);
    expect(find.byKey(const ValueKey('google-sign-in')), findsNothing);
    expect(find.byKey(const ValueKey('email-sign-in')), findsNothing);
    expect(find.byKey(const ValueKey('mobile-sign-in')), findsNothing);
    expect(
      find.text('Sign-in options are currently unavailable.'),
      findsOneWidget,
    );
    expect(tester.takeException(), isNull);
  });

  testWidgets('wide viewport remains centered without overflow', (
    WidgetTester tester,
  ) async {
    tester.view.physicalSize = const Size(1280, 900);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);

    await tester.pumpWidget(PostHubApp(authService: _service()));
    await tester.pumpAndSettle();

    expect(find.text('Post Hub'), findsOneWidget);
    expect(find.text('Welcome Back!'), findsOneWidget);
    expect(find.byKey(const ValueKey('email-sign-in')), findsOneWidget);
    expect(tester.takeException(), isNull);
  });
}

void _setMobileViewport(WidgetTester tester) {
  tester.view.physicalSize = const Size(390, 844);
  tester.view.devicePixelRatio = 1;
  addTearDown(tester.view.resetPhysicalSize);
  addTearDown(tester.view.resetDevicePixelRatio);
}

http.Response _configResponse({
  Map<String, Object?>? experience,
  Map<String, bool>? sectionValues,
  Map<String, Object?>? homeLayout,
}) {
  final loginExperience =
      experience ?? _experienceData(welcomeTitle: 'Welcome Back!');
  final defaultSections = [
    {'id': 'hero', 'title': 'Hero Banner', 'enabled': true, 'order': 1},
    {'id': 'categories', 'title': 'Category Rail', 'enabled': true, 'order': 2},
    {
      'id': 'featured_templates',
      'title': 'Featured Templates',
      'enabled': true,
      'order': 3,
    },
    {
      'id': 'action_banner',
      'title': 'Explore All Templates Action',
      'enabled': true,
      'order': 4,
    },
  ];

  return http.Response.bytes(
    utf8.encode(
      jsonEncode({
        'navigation': [
          {
            'key': 'login',
            'layoutConfig': {
              'primaryAccent': '#7026E8',
              'backgroundColor': '#FFF9FF',
              'loginExperience': loginExperience,
              'sections': [
                {
                  'id': 'brand_header',
                  'enabled': sectionValues?['brand_header'] ?? true,
                },
                {
                  'id': 'welcome_text',
                  'enabled': sectionValues?['welcome_text'] ?? true,
                },
                {
                  'id': 'credentials_form',
                  'enabled': sectionValues?['credentials_form'] ?? true,
                },
                {
                  'id': 'social_login',
                  'enabled': sectionValues?['social_login'] ?? true,
                },
                {
                  'id': 'mobile_login',
                  'enabled': sectionValues?['mobile_login'] ?? true,
                },
                {
                  'id': 'signup_link',
                  'enabled': sectionValues?['signup_link'] ?? true,
                },
              ],
            },
          },
          {
            'key': 'home',
            'name': 'Home',
            'route': '/home',
            'visibilityEnabled': true,
            'layoutConfig':
                homeLayout ??
                {
                  'headerTitle': 'Home',
                  'bannerVisible': true,
                  'itemsPerPage': 12,
                  'gridColumns': 2,
                  'tagsFilterEnabled': true,
                  'quickActionsEnabled': true,
                  'primaryAccent': '#7956C9',
                  'backgroundColor': '#FAF7F2',
                  'sections': defaultSections,
                },
          },
        ],
      }),
    ),
    200,
  );
}

Map<String, Object?> _experienceData({required String welcomeTitle}) => {
  'brandName': 'Post Hub',
  'brandTagline': 'Design  ·  Create  ·  Inspire',
  'welcomeTitle': welcomeTitle,
  'welcomeSubtitle':
      'Sign in to continue creating amazing designs with Post Hub 💜',
  'footerTagline': 'Turn Your Ideas Into Stunning Designs ✨',
  'heroImageUrl': '',
  'googleEnabled': true,
  'emailEnabled': true,
  'mobileEnabled': true,
  'signupEnabled': true,
};

AppAuthService _service({
  _MemoryTokenStore? tokenStore,
  Future<http.Response> Function(http.Request request)? handler,
}) {
  return AppAuthService(
    baseUrl: 'http://localhost:3000',
    client: MockClient(
      handler ??
          (request) async {
            return request.url.path == '/api/app/config'
                ? _configResponse()
                : http.Response(
                    jsonEncode({'error': 'Unexpected request.'}),
                    500,
                  );
          },
    ),
    tokenStore: tokenStore ?? _MemoryTokenStore(),
  );
}
