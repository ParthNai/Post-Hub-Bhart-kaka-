import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:panchayat_post/core/constants/app_assets.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';
import 'package:panchayat_post/features/festivals/data/services/festival_service.dart';
import 'package:panchayat_post/features/festivals/domain/models/festival_item.dart';
import 'package:panchayat_post/features/festivals/presentation/screens/festival_detail_screen.dart';

Widget buildTestableFestivalDetailScreen({
  Size size = const Size(390, 844),
  LocaleController? localeController,
  FestivalItem? festival,
  FestivalService? festivalService,
}) {
  return LocaleScope(
    controller: localeController ?? LocaleController(),
    child: MaterialApp(
      routes: {
        for (final entry in AppRoutes.routes.entries)
          if (entry.key != AppRoutes.splash) entry.key: entry.value,
      },
      home: MediaQuery(
        data: MediaQueryData(size: size),
        child: FestivalDetailScreen(
          festival: festival,
          festivalService: festivalService,
        ),
      ),
    ),
  );
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  late LocaleController englishController;

  setUp(() {
    englishController = LocaleController(initialLanguage: 'en');
  });

  group('Screen 11: Festival Details & Poster Collection UI & Functional Tests', () {
    testWidgets('Renders all Screen 11 sections and elements matching reference image', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        buildTestableFestivalDetailScreen(localeController: englishController),
      );
      await tester.pumpAndSettle();

      // 1. Top Header
      expect(find.byKey(const ValueKey('festival_detail_back_button')), findsOneWidget);
      expect(find.byKey(const ValueKey('festival_detail_title')), findsOneWidget);
      expect(find.text('Festival Details'), findsWidgets);
      expect(find.byKey(const ValueKey('festival_detail_notification_button')), findsOneWidget);
      expect(find.byKey(const ValueKey('festival_detail_profile_avatar')), findsOneWidget);

      // 2. Breadcrumb
      expect(find.textContaining('Festivals'), findsWidgets);
      expect(find.byIcon(Icons.home_rounded), findsWidgets);

      // 3. Featured Hero Celebration Banner
      expect(find.byKey(const ValueKey('festival_detail_hero_name')), findsOneWidget);
      expect(find.text('Navratri'), findsWidgets);
      expect(find.text('Celebration'), findsOneWidget);
      expect(find.text('22 Oct – 30 Oct'), findsWidgets);
      expect(find.text('Upcoming'), findsWidgets);
      expect(find.byKey(const ValueKey('explore_designs_button')), findsOneWidget);
      expect(find.byKey(const ValueKey('share_festival_button')), findsOneWidget);

      // 4. About This Festival Section
      expect(find.text('About This Festival'), findsOneWidget);
      expect(find.text('Festival Category'), findsOneWidget);
      expect(find.text('Festival Date'), findsOneWidget);
      expect(find.text('Celebration Type'), findsOneWidget);
      expect(find.text('Cultural'), findsWidgets);
      expect(find.text('Traditional'), findsWidgets);

      // 5. Create Festival Posts Grid
      expect(find.text('Create Festival Posts'), findsOneWidget);
      expect(find.byKey(const ValueKey('view_all_posters_button')), findsOneWidget);
      expect(find.byKey(const ValueKey('poster_card_navratri_shubh')), findsOneWidget);
      expect(find.byKey(const ValueKey('poster_card_navratri_happy')), findsOneWidget);
      expect(find.byKey(const ValueKey('poster_card_navratri_garba')), findsOneWidget);
      expect(find.byKey(const ValueKey('poster_card_navratri_jay_mataji')), findsOneWidget);

      // 6. Popular Design Styles
      expect(find.text('Popular Design Styles'), findsOneWidget);
      expect(find.byKey(const ValueKey('style_card_traditional')), findsOneWidget);
      expect(find.byKey(const ValueKey('style_card_modern')), findsOneWidget);
      expect(find.byKey(const ValueKey('style_card_devotional')), findsOneWidget);
      expect(find.byKey(const ValueKey('style_card_event')), findsOneWidget);

      // 7. Create Your Own Festival Post Card
      expect(find.text('Create Your Own Festival Post'), findsOneWidget);
      expect(find.byKey(const ValueKey('start_now_button')), findsOneWidget);

      // 8. Bottom Navigation
      expect(find.text('Festivals'), findsWidgets);
      expect(find.text('Home'), findsOneWidget);
      expect(find.text('Templates'), findsOneWidget);
      expect(find.text('My Designs'), findsOneWidget);
      expect(find.text('Profile'), findsOneWidget);
    });

    testWidgets('Dynamic Festival Details: Displays Diwali correctly when passed', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      const diwaliFestival = FestivalItem(
        id: 'fest_diwali',
        name: 'Diwali',
        nameGu: 'દિવાળી',
        nameHi: 'दिवाली',
        dateDisplay: '12 Nov – 20 Nov',
        category: 'hindu',
        categoryName: 'Hindu Festivals',
        imageAsset: AppAssets.festivalDiwaliDiyas,
        isUpcoming: true,
        celebrationType: 'Festival of Lights',
        aboutText: 'Celebrate Diwali with joyful lights and greetings.',
        heroBannerAsset: AppAssets.festivalDiwaliDiyas,
        posterTemplates: [
          FestivalPosterTemplate(
            id: 'diwali_happy',
            title: 'Happy Diwali',
            imageAsset: AppAssets.homeTemplateDiwali,
            style: 'traditional',
          ),
          FestivalPosterTemplate(
            id: 'diwali_shubh',
            title: 'શુભ દીપાવલી',
            imageAsset: AppAssets.festivalDiwaliDiyas,
            style: 'devotional',
          ),
        ],
      );

      await tester.pumpWidget(
        buildTestableFestivalDetailScreen(
          localeController: englishController,
          festival: diwaliFestival,
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('Diwali'), findsWidgets);
      expect(find.text('12 Nov – 20 Nov'), findsWidgets);
      expect(find.text('Festival of Lights'), findsWidgets);
      expect(find.text('Hindu Festivals'), findsWidgets);
      expect(find.byKey(const ValueKey('poster_card_diwali_happy')), findsOneWidget);
      expect(find.byKey(const ValueKey('poster_card_diwali_shubh')), findsOneWidget);
    });

    testWidgets('Tapping Share Festival triggers sharing confirmation SnackBar', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        buildTestableFestivalDetailScreen(localeController: englishController),
      );
      await tester.pumpAndSettle();

      await tester.tap(find.byKey(const ValueKey('share_festival_button')));
      await tester.pump();

      expect(find.byType(SnackBar), findsOneWidget);
      expect(find.textContaining('copied to share'), findsOneWidget);
    });

    testWidgets('Tapping a poster card opens the interactive customization sheet', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        buildTestableFestivalDetailScreen(localeController: englishController),
      );
      await tester.pumpAndSettle();

      // Scroll to poster card if needed
      await tester.ensureVisible(find.byKey(const ValueKey('poster_card_navratri_shubh')));
      await tester.pumpAndSettle();

      await tester.tap(find.byKey(const ValueKey('poster_card_navratri_shubh')));
      await tester.pumpAndSettle();

      // Verify bottom sheet appears
      expect(find.byType(BottomSheet), findsOneWidget);
      expect(find.text('Customize: શુભ નવરાત્રી'), findsOneWidget);
      expect(find.text('Download & Share Poster'), findsOneWidget);

      // Tap download button
      await tester.tap(find.text('Download & Share Poster'));
      await tester.pumpAndSettle();

      // Confirm closed and feedback shown
      expect(find.byType(BottomSheet), findsNothing);
      expect(find.byType(SnackBar), findsOneWidget);
    });

    testWidgets('Tapping Design Style card filters poster templates and View All resets', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        buildTestableFestivalDetailScreen(localeController: englishController),
      );
      await tester.pumpAndSettle();

      // Scroll down to popular design styles
      await tester.ensureVisible(find.byKey(const ValueKey('style_card_modern')));
      await tester.pumpAndSettle();

      // Tap Modern style card
      await tester.tap(find.byKey(const ValueKey('style_card_modern')));
      await tester.pumpAndSettle();

      // Only Modern templates should remain in the grid
      expect(find.byKey(const ValueKey('poster_card_navratri_happy')), findsOneWidget);
      expect(find.byKey(const ValueKey('poster_card_navratri_shubh')), findsNothing);

      // Tap View All
      await tester.ensureVisible(find.byKey(const ValueKey('view_all_posters_button')));
      await tester.pumpAndSettle();
      await tester.tap(find.byKey(const ValueKey('view_all_posters_button')));
      await tester.pumpAndSettle();

      // All 4 templates should be visible again
      expect(find.byKey(const ValueKey('poster_card_navratri_shubh')), findsOneWidget);
      expect(find.byKey(const ValueKey('poster_card_navratri_happy')), findsOneWidget);
      expect(find.byKey(const ValueKey('poster_card_navratri_garba')), findsOneWidget);
      expect(find.byKey(const ValueKey('poster_card_navratri_jay_mataji')), findsOneWidget);
    });

    testWidgets('Tapping Notification Bell opens notifications sheet', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        buildTestableFestivalDetailScreen(localeController: englishController),
      );
      await tester.pumpAndSettle();

      await tester.tap(find.byKey(const ValueKey('festival_detail_notification_button')));
      await tester.pumpAndSettle();

      expect(find.byType(BottomSheet), findsOneWidget);
      expect(find.text('Notifications'), findsWidgets);
    });

    testWidgets('Responsive Layout: No overflows on various phone and tablet viewports', (tester) async {
      final testSizes = [
        const Size(360, 640), // Small phone
        const Size(390, 844), // Standard phone
        const Size(412, 915), // Large phone
        const Size(768, 1024), // Tablet
      ];

      for (final size in testSizes) {
        tester.view.physicalSize = size;
        tester.view.devicePixelRatio = 1.0;

        await tester.pumpWidget(
          buildTestableFestivalDetailScreen(
            size: size,
            localeController: englishController,
          ),
        );
        await tester.pumpAndSettle();

        expect(tester.takeException(), isNull);
        expect(find.byKey(const ValueKey('festival_detail_title')), findsOneWidget);
        expect(find.byKey(const ValueKey('festival_detail_hero_name')), findsOneWidget);
      }
    });
  });
}
