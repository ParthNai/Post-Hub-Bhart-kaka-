import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:panchayat_post/core/constants/app_assets.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';
import 'package:panchayat_post/features/auth/data/auth_service.dart';
import 'package:panchayat_post/features/auth/domain/models/recovery_request.dart';
import 'package:panchayat_post/features/auth/presentation/screens/login_screen.dart';
import 'package:panchayat_post/features/auth/presentation/screens/recovery_status_screen.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  late LocaleController localeController;
  late AuthService authService;

  setUp(() async {
    SharedPreferences.setMockInitialValues({});
    final prefs = await SharedPreferences.getInstance();
    localeController = LocaleController(preferences: prefs);
    await localeController.loadSavedLanguage();
    authService = AuthService(preferences: prefs);
  });

  Widget buildTestableScreen({
    RecoveryRequest? request,
    Size size = const Size(390, 844),
  }) {
    return MediaQuery(
      data: MediaQueryData(size: size),
      child: LocaleScope(
        controller: localeController,
        child: MaterialApp(
          home: RecoveryStatusScreen(
            key: request != null ? ValueKey('${request.referenceId}_${request.status}') : null,
            initialRequest: request,
            authService: authService,
          ),
          routes: {
            AppRoutes.login: (context) => const LoginScreen(),
          },
        ),
      ),
    );
  }

  group('Screen 06: Recovery Request Status UI & Component Tests', () {
    testWidgets('Renders all approved Screen 06 UI elements in Gujarati by default',
        (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      final mockRequest = RecoveryRequest(
        referenceId: 'REC-2026-08142',
        username: 'sarpanch_ramesh',
        createdAt: DateTime(2026, 11, 21, 12, 30),
        status: 'Under Review',
      );

      await tester.pumpWidget(buildTestableScreen(request: mockRequest));
      await tester.pumpAndSettle();

      // 1. Header elements
      expect(find.byIcon(Icons.arrow_back_ios_new_rounded), findsOneWidget);
      expect(find.text('Panchayat'), findsOneWidget);
      expect(find.text('Post'), findsOneWidget);
      expect(find.text('ગુજરાતી'), findsOneWidget);

      // 2. Hero illustration
      final heroFinder = find.byWidgetPredicate(
        (widget) =>
            widget is Image &&
            (widget.image as AssetImage).assetName == AppAssets.recoveryStatusHero,
      );
      expect(heroFinder, findsOneWidget);

      // 3. Title & Subtitle
      expect(find.text('તમારી વિનંતી મળી ગઈ!'), findsOneWidget);
      expect(find.textContaining('તમારી એકાઉન્ટ રિકવરી વિનંતી સફળતાપૂર્વક'), findsOneWidget);

      // 4. Request Details card
      expect(find.textContaining('REC-2026-08142'), findsOneWidget);
      expect(find.text('sa••••sh'), findsOneWidget); // Masked username
      expect(find.text('21/11/2026'), findsOneWidget); // Submitted date
      expect(find.text('વિચારણા હેઠળ'), findsOneWidget); // Current status badge

      // 5. 3-Step Progress Timeline
      expect(find.text('વિનંતી પ્રાપ્ત થઈ'), findsOneWidget);
      expect(find.text('તમારી રિકવરી વિનંતી મળી ગઈ છે.'), findsOneWidget);
      expect(find.text('તપાસ ચાલુ છે'), findsOneWidget);
      expect(find.text('અમારી ટીમ તમારી વિનંતીની તપાસ કરશે.'), findsOneWidget);
      expect(find.text('આગળની કાર્યવાહી'), findsOneWidget);
      expect(find.text('તપાસ પૂર્ણ થયા પછી તમને આગળની સૂચના મળશે.'), findsOneWidget);

      // 6. Amber Notice Banner
      expect(find.textContaining('તમારી વિનંતી અંગેની આગળની માહિતી માટે'), findsOneWidget);

      // 7. Last Updated indicator
      expect(find.textContaining('છેલ્લું અપડેટ:'), findsOneWidget);

      // 8. Primary Orange Button
      final supportBtn = find.byKey(const Key('contact_support_button'));
      expect(supportBtn, findsOneWidget);
      expect(find.text('સપોર્ટનો સંપર્ક કરો'), findsOneWidget);
      expect(find.byIcon(Icons.headset_mic_rounded), findsOneWidget);

      // 9. Secondary White/Orange Button
      final loginBtn = find.byKey(const Key('go_to_login_button'));
      expect(loginBtn, findsOneWidget);
      expect(find.text('Login સ્ક્રીન પર જાઓ'), findsOneWidget);
      expect(find.byIcon(Icons.login_rounded), findsOneWidget);

      // 10. Legal Footer & Village Silhouette
      expect(find.text('Privacy Policy'), findsOneWidget);
      expect(find.text('Terms & Conditions'), findsOneWidget);
      final villageFinder = find.byWidgetPredicate(
        (widget) =>
            widget is Image &&
            (widget.image as AssetImage).assetName == AppAssets.villageSilhouette,
      );
      expect(villageFinder, findsOneWidget);
    });

    testWidgets('Correctly displays masked username and custom reference ID',
        (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      final customRequest = RecoveryRequest(
        referenceId: 'REC-2026-98765',
        username: 'bharat_kaka',
        createdAt: DateTime(2026, 10, 15, 9, 0),
        status: 'Submitted',
      );

      await tester.pumpWidget(buildTestableScreen(request: customRequest));
      await tester.pumpAndSettle();

      expect(find.textContaining('REC-2026-98765'), findsOneWidget);
      expect(find.text('bh••••ka'), findsOneWidget); // Masked username for bharat_kaka
      expect(find.text('15/10/2026'), findsOneWidget);
      expect(find.text('સબમિટ કરેલ'), findsOneWidget); // Submitted badge
    });

    testWidgets('Correctly maps all backend recovery statuses and badge labels',
        (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      final statuses = [
        {'status': 'Submitted', 'label': 'સબમિટ કરેલ'},
        {'status': 'Under Review', 'label': 'વિચારણા હેઠળ'},
        {'status': 'Additional Information Required', 'label': 'વધુ માહિતી જરૂરી'},
        {'status': 'Resolved', 'label': 'ઉકેલાયેલ'},
        {'status': 'Rejected', 'label': 'અસ્વીકાર કરેલ'},
      ];

      for (final item in statuses) {
        final req = RecoveryRequest(
          referenceId: 'REC-TEST-1234',
          username: 'test_user',
          createdAt: DateTime.now(),
          status: item['status']!,
        );

        await tester.pumpWidget(buildTestableScreen(request: req));
        await tester.pumpAndSettle();

        expect(find.text(item['label']!), findsOneWidget);
      }
    });

    testWidgets('Manual status refresh re-fetches latest status from AuthService',
        (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      // 1. Submit initial request in AuthService
      final req = await authService.submitRecoveryRequest(username: 'talati_vikram');
      expect(req.status, 'Submitted');

      await tester.pumpWidget(buildTestableScreen(request: req));
      await tester.pumpAndSettle();

      expect(find.text('સબમિટ કરેલ'), findsOneWidget);

      // 2. Simulate backend updating status to "Under Review"
      await authService.updateRecoveryRequestStatus(req.referenceId, 'Under Review');

      // 3. Tap refresh button next to Request ID
      final refreshBtn = find.byIcon(Icons.refresh_rounded);
      expect(refreshBtn, findsOneWidget);
      await tester.tap(refreshBtn);
      await tester.pumpAndSettle();

      // 4. Verify status updated to "Under Review"
      expect(find.text('વિચારણા હેઠળ'), findsOneWidget);
    });

    testWidgets('Tapping Support button opens Help Center dialog with helpline details',
        (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      final req = RecoveryRequest(
        referenceId: 'REC-2026-08142',
        username: 'sarpanch_ramesh',
        createdAt: DateTime.now(),
        status: 'Under Review',
        supportHelpline: '1800-123-7262',
        supportEmail: 'support@panchayatpost.in',
      );

      await tester.pumpWidget(buildTestableScreen(request: req));
      await tester.pumpAndSettle();

      final supportBtn = find.byKey(const Key('contact_support_button'));
      await tester.ensureVisible(supportBtn);
      await tester.tap(supportBtn);
      await tester.pumpAndSettle();

      // Dialog assertions
      expect(find.text('પંચાયત પોસ્ટ સહાયતા કેન્દ્ર'), findsOneWidget);
      expect(find.textContaining('1800-123-7262'), findsWidgets);
      expect(find.textContaining('support@panchayatpost.in'), findsOneWidget);
      expect(find.textContaining('REC-2026-08142'), findsWidgets);

      // Dismiss dialog
      await tester.tap(find.text('બંધ કરો (Close)'));
      await tester.pumpAndSettle();
      expect(find.text('પંચાયત પોસ્ટ સહાયતા કેન્દ્ર'), findsNothing);
    });

    testWidgets('Tapping Login button navigates to AppRoutes.login',
        (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      final req = RecoveryRequest(
        referenceId: 'REC-2026-08142',
        username: 'sarpanch_ramesh',
        createdAt: DateTime.now(),
        status: 'Under Review',
      );

      await tester.pumpWidget(buildTestableScreen(request: req));
      await tester.pumpAndSettle();

      final loginBtn = find.byKey(const Key('go_to_login_button'));
      await tester.ensureVisible(loginBtn);
      await tester.tap(loginBtn);
      await tester.pumpAndSettle();

      // Should be on Login Screen
      expect(find.byType(LoginScreen), findsOneWidget);
      expect(find.text('ફરીથી આપનું સ્વાગત છે!'), findsOneWidget);
    });

    testWidgets('Language selector updates Screen 06 text across Hindi and English',
        (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      final req = RecoveryRequest(
        referenceId: 'REC-2026-08142',
        username: 'sarpanch_ramesh',
        createdAt: DateTime.now(),
        status: 'Under Review',
      );

      await tester.pumpWidget(buildTestableScreen(request: req));
      await tester.pumpAndSettle();

      // Switch to Hindi
      await localeController.setLanguage('hi');
      await tester.pumpAndSettle();

      expect(find.text('आपकी विनंती मिल गई!'), findsOneWidget);
      expect(find.text('समीक्षाधीन'), findsOneWidget);
      expect(find.text('सपोर्ट से संपर्क करें'), findsOneWidget);
      expect(find.text('Login स्क्रीन पर जाएं'), findsOneWidget);

      // Switch to English
      await localeController.setLanguage('en');
      await tester.pumpAndSettle();

      expect(find.text('Your Request Has Been Received!'), findsOneWidget);
      expect(find.text('Under Review'), findsOneWidget);
      expect(find.text('Contact Support'), findsOneWidget);
      expect(find.text('Go to Login Screen'), findsOneWidget);
    });

    testWidgets('Zero RenderFlex overflow across Small, Standard, Large, and Tablet viewports',
        (tester) async {
      final viewports = [
        const Size(360, 640),  // Small Android
        const Size(390, 844),  // Standard iPhone
        const Size(412, 915),  // Large Android
        const Size(768, 1024), // Tablet
      ];

      for (final size in viewports) {
        tester.view.physicalSize = size;
        tester.view.devicePixelRatio = 1.0;

        final req = RecoveryRequest(
          referenceId: 'REC-2026-08142',
          username: 'sarpanch_ramesh_patel',
          createdAt: DateTime.now(),
          status: 'Under Review',
        );

        await tester.pumpWidget(buildTestableScreen(request: req, size: size));
        await tester.pumpAndSettle();

        expect(tester.takeException(), isNull,
            reason: 'RenderFlex overflow occurred on viewport size: $size');
      }

      tester.view.resetPhysicalSize();
    });
  });
}
