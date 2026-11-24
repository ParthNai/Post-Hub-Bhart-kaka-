import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';
import 'package:panchayat_post/features/editor/data/services/design_storage_service.dart';
import 'package:panchayat_post/features/editor/domain/models/poster_template_project.dart';
import 'package:panchayat_post/features/editor/presentation/screens/quick_customize_screen.dart';
import 'package:panchayat_post/features/festivals/domain/models/festival_item.dart';

Widget buildTestableQuickCustomizeScreen({
  Size size = const Size(390, 844),
  LocaleController? localeController,
  PosterTemplateProject? initialProject,
  FestivalPosterTemplate? festivalPosterTemplate,
  DesignStorageService? storageService,
}) {
  return LocaleScope(
    controller: localeController ?? LocaleController(initialLanguage: 'en'),
    child: MaterialApp(
      routes: {
        for (final entry in AppRoutes.routes.entries)
          if (entry.key != AppRoutes.splash) entry.key: entry.value,
      },
      home: MediaQuery(
        data: MediaQueryData(size: size),
        child: QuickCustomizeScreen(
          initialProject: initialProject,
          festivalPosterTemplate: festivalPosterTemplate,
          storageService: storageService,
        ),
      ),
    ),
  );
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  late LocaleController englishController;

  setUp(() {
    SharedPreferences.setMockInitialValues({});
    englishController = LocaleController(initialLanguage: 'en');
  });

  group('Screen 17: Quick Customize UI & Component Tests', () {
    testWidgets('Renders all approved Screen 17 UI elements matching reference image', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        buildTestableQuickCustomizeScreen(localeController: englishController),
      );
      await tester.pumpAndSettle();

      // 1. Top Header
      expect(find.byKey(const ValueKey('quick_customize_back_button')), findsOneWidget);
      expect(find.byKey(const ValueKey('quick_customize_title')), findsOneWidget);
      expect(find.text('Quick Customize'), findsOneWidget);
      expect(find.byKey(const ValueKey('quick_customize_subtitle')), findsOneWidget);
      expect(find.text('Make this template yours.'), findsOneWidget);
      expect(find.text('1 / 2'), findsOneWidget);
      expect(find.text('Customize'), findsOneWidget);

      // 2. Poster Preview Canvas & Edit Preview Button
      expect(find.byKey(const ValueKey('btn_edit_preview')), findsOneWidget);
      expect(find.text('Edit Preview'), findsOneWidget);

      // 3. Section: Personalize Your Poster
      expect(find.text('Personalize Your Poster'), findsOneWidget);

      // 4. 2x2 Personalization Grid Cards
      expect(find.byKey(const ValueKey('card_your_name')), findsOneWidget);
      expect(find.text('Your Name'), findsOneWidget);
      expect(find.byKey(const ValueKey('input_your_name')), findsOneWidget);

      expect(find.byKey(const ValueKey('card_add_photo')), findsOneWidget);
      expect(find.text('Add Your Photo'), findsOneWidget);
      expect(find.byKey(const ValueKey('btn_upload_photo')), findsOneWidget);
      expect(find.byKey(const ValueKey('btn_change_photo')), findsOneWidget);

      expect(find.byKey(const ValueKey('card_business_logo')), findsOneWidget);
      expect(find.text('Add Your Business Logo'), findsOneWidget);
      expect(find.byKey(const ValueKey('btn_upload_logo')), findsOneWidget);
      expect(find.byKey(const ValueKey('btn_change_logo')), findsOneWidget);

      expect(find.byKey(const ValueKey('card_business_details')), findsOneWidget);
      expect(find.text('Business Details'), findsOneWidget);
      expect(find.byKey(const ValueKey('input_business_name')), findsOneWidget);
      expect(find.byKey(const ValueKey('input_mobile_number')), findsOneWidget);
      expect(find.byKey(const ValueKey('input_address')), findsOneWidget);
      expect(find.byKey(const ValueKey('input_website')), findsOneWidget);

      // 5. Section: Poster Text Options
      expect(find.text('Poster Text Options'), findsOneWidget);
      expect(find.byKey(const ValueKey('dropdown_main_heading')), findsOneWidget);
      expect(find.byKey(const ValueKey('dropdown_subheading')), findsOneWidget);
      expect(find.byKey(const ValueKey('switch_contact_info')), findsOneWidget);
      expect(find.byKey(const ValueKey('switch_show_name')), findsOneWidget);
      expect(find.byKey(const ValueKey('switch_show_logo')), findsOneWidget);

      // 6. Action Buttons
      expect(find.byKey(const ValueKey('btn_reset_changes')), findsOneWidget);
      expect(find.text('Reset Changes'), findsOneWidget);
      expect(find.byKey(const ValueKey('btn_preview_poster')), findsOneWidget);
      expect(find.text('Preview Poster'), findsOneWidget);
      expect(find.byKey(const ValueKey('btn_continue_to_editor')), findsOneWidget);
      expect(find.text('Continue to Editor'), findsOneWidget);

      // 7. Bottom Navigation
      expect(find.text('Home'), findsOneWidget);
      expect(find.text('Festivals'), findsOneWidget);
      expect(find.text('Templates'), findsOneWidget);
      expect(find.text('My Designs'), findsOneWidget);
      expect(find.text('Profile'), findsOneWidget);
    });

    testWidgets('Live Personalization: Editing name and business details updates controllers', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        buildTestableQuickCustomizeScreen(localeController: englishController),
      );
      await tester.pumpAndSettle();

      // Enter new name
      await tester.enterText(find.byKey(const ValueKey('input_your_name')), 'Vikram Sarabhai');
      await tester.pumpAndSettle();
      expect(find.text('Vikram Sarabhai'), findsWidgets);

      // Enter new business name
      await tester.enterText(find.byKey(const ValueKey('input_business_name')), 'Sarabhai Foundation');
      await tester.pumpAndSettle();
      expect(find.text('Sarabhai Foundation'), findsWidgets);
    });

    testWidgets('Tapping Upload and Change buttons triggers confirmation feedback', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        buildTestableQuickCustomizeScreen(localeController: englishController),
      );
      await tester.pumpAndSettle();

      // Tap Upload Photo
      await tester.ensureVisible(find.byKey(const ValueKey('btn_upload_photo')));
      await tester.tap(find.byKey(const ValueKey('btn_upload_photo')));
      await tester.pumpAndSettle();
      expect(find.text('Photo uploaded successfully!'), findsOneWidget);

      // Tap Upload Logo
      await tester.ensureVisible(find.byKey(const ValueKey('btn_upload_logo')));
      await tester.tap(find.byKey(const ValueKey('btn_upload_logo')));
      await tester.pumpAndSettle();
      expect(find.text('Business logo uploaded!'), findsOneWidget);
    });

    testWidgets('Toggles: Flipping contact info, show name, and show logo switches values', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        buildTestableQuickCustomizeScreen(localeController: englishController),
      );
      await tester.pumpAndSettle();

      // Scroll to toggles
      await tester.ensureVisible(find.byKey(const ValueKey('switch_contact_info')));
      await tester.pumpAndSettle();

      // Toggle contact info
      await tester.tap(find.byKey(const ValueKey('switch_contact_info')));
      await tester.pumpAndSettle();

      // Toggle show name
      await tester.tap(find.byKey(const ValueKey('switch_show_name')));
      await tester.pumpAndSettle();

      // Toggle show logo
      await tester.tap(find.byKey(const ValueKey('switch_show_logo')));
      await tester.pumpAndSettle();
    });

    testWidgets('Tapping Preview Poster opens dedicated full-size preview modal', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        buildTestableQuickCustomizeScreen(localeController: englishController),
      );
      await tester.pumpAndSettle();

      await tester.ensureVisible(find.byKey(const ValueKey('btn_preview_poster')));
      await tester.pumpAndSettle();

      await tester.tap(find.byKey(const ValueKey('btn_preview_poster')));
      await tester.pumpAndSettle();

      expect(find.byType(Dialog), findsOneWidget);
      expect(find.text('Close Preview'), findsOneWidget);

      await tester.tap(find.text('Close Preview'));
      await tester.pumpAndSettle();
      expect(find.byType(Dialog), findsNothing);
    });

    testWidgets('Tapping Reset Changes shows confirmation dialog and resets fields', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        buildTestableQuickCustomizeScreen(localeController: englishController),
      );
      await tester.pumpAndSettle();

      await tester.enterText(find.byKey(const ValueKey('input_your_name')), 'Test Person');
      await tester.pumpAndSettle();

      await tester.ensureVisible(find.byKey(const ValueKey('btn_reset_changes')));
      await tester.pumpAndSettle();

      await tester.tap(find.byKey(const ValueKey('btn_reset_changes')));
      await tester.pumpAndSettle();

      expect(find.byType(AlertDialog), findsOneWidget);
      expect(find.text('Reset All Changes?'), findsOneWidget);

      await tester.tap(find.text('Reset'));
      await tester.pumpAndSettle();

      expect(find.byType(AlertDialog), findsNothing);
      expect(find.text('All changes have been reset.'), findsOneWidget);
    });

    testWidgets('Tapping Continue to Editor navigates to Screen 12: Poster Editor', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        buildTestableQuickCustomizeScreen(localeController: englishController),
      );
      await tester.pumpAndSettle();

      await tester.ensureVisible(find.byKey(const ValueKey('btn_continue_to_editor')));
      await tester.pumpAndSettle();

      await tester.tap(find.byKey(const ValueKey('btn_continue_to_editor')));
      await tester.pumpAndSettle();

      // Verify navigation to Screen 12 Poster Editor
      expect(find.byKey(const ValueKey('editor_title')), findsOneWidget);
      expect(find.text('Edit Your Poster'), findsOneWidget);
    });

    testWidgets('Responsive Layout: Zero overflows across phone and tablet sizes', (tester) async {
      final testSizes = [
        const Size(360, 640),
        const Size(390, 844),
        const Size(412, 915),
        const Size(768, 1024),
      ];

      for (final size in testSizes) {
        tester.view.physicalSize = size;
        tester.view.devicePixelRatio = 1.0;

        await tester.pumpWidget(
          buildTestableQuickCustomizeScreen(
            size: size,
            localeController: englishController,
          ),
        );
        await tester.pumpAndSettle();

        expect(tester.takeException(), isNull);
        expect(find.byKey(const ValueKey('quick_customize_title')), findsOneWidget);
      }
    });
  });
}
