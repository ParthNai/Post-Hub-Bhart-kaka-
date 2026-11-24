import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';
import 'package:panchayat_post/features/editor/data/services/design_storage_service.dart';
import 'package:panchayat_post/features/editor/domain/models/poster_template_project.dart';
import 'package:panchayat_post/features/editor/presentation/screens/poster_editor_screen.dart';
import 'package:panchayat_post/features/festivals/domain/models/festival_item.dart';

Widget buildTestablePosterEditorScreen({
  Size size = const Size(390, 844),
  LocaleController? localeController,
  PosterTemplateProject? initialProject,
  FestivalPosterTemplate? festivalPosterTemplate,
  DesignStorageService? storageService,
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
        child: PosterEditorScreen(
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

  group('Screen 12: Poster Template Editor & Customization Studio Tests', () {
    testWidgets('Renders all approved Screen 12 UI elements matching reference image', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        buildTestablePosterEditorScreen(localeController: englishController),
      );
      await tester.pumpAndSettle();

      // 1. Top Header
      expect(find.byKey(const ValueKey('editor_back_button')), findsOneWidget);
      expect(find.byKey(const ValueKey('editor_title')), findsOneWidget);
      expect(find.text('Edit Your Poster'), findsOneWidget);
      expect(find.byKey(const ValueKey('editor_mode_badge')), findsOneWidget);
      expect(find.text('Editing'), findsOneWidget);
      expect(find.byKey(const ValueKey('editor_undo_button')), findsOneWidget);
      expect(find.byKey(const ValueKey('editor_redo_button')), findsOneWidget);
      expect(find.byKey(const ValueKey('editor_header_save_button')), findsOneWidget);

      // 2. Poster Canvas
      expect(find.byKey(const ValueKey('editor_zoom_button')), findsOneWidget);
      expect(find.text('100%'), findsOneWidget);
      expect(find.text('શુભ નવરાત્રી'), findsWidgets);

      // 3. Contextual Action Toolbar
      expect(find.byKey(const ValueKey('tool_edit_text')), findsOneWidget);
      expect(find.byKey(const ValueKey('tool_replace_image')), findsOneWidget);
      expect(find.byKey(const ValueKey('tool_change_color')), findsOneWidget);
      expect(find.byKey(const ValueKey('tool_position')), findsOneWidget);
      expect(find.byKey(const ValueKey('tool_duplicate')), findsOneWidget);

      // 4. Customize Your Design Section & Tabs
      expect(find.byKey(const ValueKey('customize_your_design_title')), findsOneWidget);
      expect(find.text('Customize Your Design'), findsOneWidget);
      expect(find.byKey(const ValueKey('tab_frames')), findsOneWidget);
      expect(find.byKey(const ValueKey('tab_text')), findsOneWidget);
      expect(find.byKey(const ValueKey('tab_images')), findsOneWidget);
      expect(find.byKey(const ValueKey('tab_colors')), findsOneWidget);
      expect(find.byKey(const ValueKey('tab_background')), findsOneWidget);
      expect(find.byKey(const ValueKey('tab_fonts')), findsOneWidget);

      // Switch to Text tab to verify text editing controls
      await tester.tap(find.byKey(const ValueKey('tab_text')));
      await tester.pumpAndSettle();

      // 5. Active Editing Controls Panel (Text Tab)
      expect(find.byKey(const ValueKey('input_headline_text')), findsOneWidget);
      expect(find.byKey(const ValueKey('input_supporting_text')), findsOneWidget);
      expect(find.byKey(const ValueKey('dropdown_font_style')), findsOneWidget);
      expect(find.text('Text Alignment'), findsOneWidget);
      expect(find.text('Text Color'), findsOneWidget);

      // 6. Bottom Action Area
      expect(find.byKey(const ValueKey('preview_poster_button')), findsOneWidget);
      expect(find.byKey(const ValueKey('save_design_button')), findsOneWidget);
      expect(find.byKey(const ValueKey('all_changes_saved_badge')), findsOneWidget);
      expect(find.text('All changes saved'), findsOneWidget);
    });

    testWidgets('Live Text Editing: Changing headline and supporting text updates canvas and enables Undo', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        buildTestablePosterEditorScreen(localeController: englishController),
      );
      await tester.pumpAndSettle();

      // Switch to text tab
      await tester.tap(find.byKey(const ValueKey('tab_text')));
      await tester.pumpAndSettle();

      // Scroll to headline input
      await tester.ensureVisible(find.byKey(const ValueKey('input_headline_text')));
      await tester.pumpAndSettle();

      // Enter new headline
      await tester.enterText(find.byKey(const ValueKey('input_headline_text')), 'Happy Diwali');
      await tester.pumpAndSettle();

      // Canvas should display new headline
      expect(find.text('Happy Diwali'), findsWidgets);

      // Tap Undo button
      await tester.ensureVisible(find.byKey(const ValueKey('editor_undo_button')));
      await tester.pumpAndSettle();
      await tester.tap(find.byKey(const ValueKey('editor_undo_button')));
      await tester.pumpAndSettle();

      // Headline should revert to previous text
      expect(find.text('શુભ નવરાત્રી'), findsWidgets);

      // Tap Redo button
      await tester.tap(find.byKey(const ValueKey('editor_redo_button')));
      await tester.pumpAndSettle();

      // Headline should be Happy Diwali again
      expect(find.text('Happy Diwali'), findsWidgets);
    });

    testWidgets('Tapping Zoom button cycles zoom level', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        buildTestablePosterEditorScreen(localeController: englishController),
      );
      await tester.pumpAndSettle();

      expect(find.text('100%'), findsOneWidget);

      await tester.tap(find.byKey(const ValueKey('editor_zoom_button')));
      await tester.pumpAndSettle();
      expect(find.text('125%'), findsOneWidget);

      await tester.tap(find.byKey(const ValueKey('editor_zoom_button')));
      await tester.pumpAndSettle();
      expect(find.text('150%'), findsOneWidget);

      await tester.tap(find.byKey(const ValueKey('editor_zoom_button')));
      await tester.pumpAndSettle();
      expect(find.text('100%'), findsOneWidget);
    });

    testWidgets('Tapping Duplicate creates a new element on canvas', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        buildTestablePosterEditorScreen(localeController: englishController),
      );
      await tester.pumpAndSettle();

      await tester.ensureVisible(find.byKey(const ValueKey('tool_duplicate')));
      await tester.pumpAndSettle();

      await tester.tap(find.byKey(const ValueKey('tool_duplicate')));
      await tester.pumpAndSettle();

      expect(find.byType(SnackBar), findsOneWidget);
      expect(find.text('Element duplicated on canvas'), findsOneWidget);
    });

    testWidgets('Tapping Preview Poster opens clean preview dialog', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        buildTestablePosterEditorScreen(localeController: englishController),
      );
      await tester.pumpAndSettle();

      await tester.ensureVisible(find.byKey(const ValueKey('preview_poster_button')));
      await tester.pumpAndSettle();

      await tester.tap(find.byKey(const ValueKey('preview_poster_button')));
      await tester.pumpAndSettle();

      // Dialog should be displayed with Close Preview button
      expect(find.byType(Dialog), findsOneWidget);
      expect(find.text('Close Preview'), findsOneWidget);
      expect(find.text('Save / Export'), findsOneWidget);

      // Close dialog
      await tester.tap(find.text('Close Preview'));
      await tester.pumpAndSettle();

      expect(find.byType(Dialog), findsNothing);
    });

    testWidgets('Tapping Save Design persists design project and shows confirmation SnackBar', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        buildTestablePosterEditorScreen(localeController: englishController),
      );
      await tester.pumpAndSettle();

      await tester.ensureVisible(find.byKey(const ValueKey('save_design_button')));
      await tester.pumpAndSettle();

      await tester.tap(find.byKey(const ValueKey('save_design_button')));
      await tester.pumpAndSettle();

      expect(find.byType(SnackBar), findsOneWidget);
      expect(find.text('Poster design saved successfully!'), findsOneWidget);
    });

    testWidgets('Responsive Layout: No layout overflows across Small, Standard, Large, and Tablet screens', (tester) async {
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
          buildTestablePosterEditorScreen(
            size: size,
            localeController: englishController,
          ),
        );
        await tester.pumpAndSettle();

        expect(tester.takeException(), isNull);
        expect(find.byKey(const ValueKey('editor_title')), findsOneWidget);
        expect(find.byKey(const ValueKey('editor_zoom_button')), findsOneWidget);
      }
    });
  });
}
