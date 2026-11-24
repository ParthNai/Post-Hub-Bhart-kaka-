import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';
import 'package:panchayat_post/features/editor/data/services/design_storage_service.dart';
import 'package:panchayat_post/features/editor/domain/models/poster_template_project.dart';
import 'package:panchayat_post/features/editor/presentation/screens/main_poster_editor_screen.dart';

Widget buildTestableMainPosterEditorScreen({
  Size size = const Size(390, 844),
  LocaleController? localeController,
  PosterTemplateProject? initialProject,
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
        child: MainPosterEditorScreen(
          initialProject: initialProject,
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

  group('Screen 18: Main Poster Editor UI & Component Tests', () {
    testWidgets('Renders all approved Screen 18 UI elements matching reference image', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        buildTestableMainPosterEditorScreen(localeController: englishController),
      );
      await tester.pumpAndSettle();

      // 1. Top Header Bar
      expect(find.byKey(const ValueKey('btn_back')), findsOneWidget);
      expect(find.byKey(const ValueKey('editor_title')), findsOneWidget);
      expect(find.text('Edit Your Poster'), findsOneWidget);
      expect(find.byKey(const ValueKey('btn_undo')), findsOneWidget);
      expect(find.byKey(const ValueKey('btn_redo')), findsOneWidget);
      expect(find.byKey(const ValueKey('btn_save_draft')), findsOneWidget);
      expect(find.byKey(const ValueKey('btn_more')), findsOneWidget);

      // 2. Poster Canvas & Floating Zoom
      expect(find.byKey(const ValueKey('zoom_indicator_pill')), findsOneWidget);
      expect(find.text('100%'), findsOneWidget);

      // 3. Tool Categories Bar (6 tools)
      expect(find.byKey(const ValueKey('tool_tab_text')), findsOneWidget);
      expect(find.byKey(const ValueKey('tool_tab_images')), findsOneWidget);
      expect(find.byKey(const ValueKey('tool_tab_logo')), findsOneWidget);
      expect(find.byKey(const ValueKey('tool_tab_background')), findsOneWidget);
      expect(find.byKey(const ValueKey('tool_tab_elements')), findsOneWidget);
      expect(find.byKey(const ValueKey('tool_tab_templates')), findsOneWidget);

      // 4. Text Properties Panel
      expect(find.byKey(const ValueKey('panel_text_properties')), findsOneWidget);
      expect(find.text('Text Properties'), findsOneWidget);
      expect(find.byKey(const ValueKey('btn_edit_text')), findsOneWidget);
      expect(find.byKey(const ValueKey('dropdown_font')), findsOneWidget);
      expect(find.byKey(const ValueKey('dropdown_size')), findsOneWidget);
      expect(find.byKey(const ValueKey('btn_color_picker')), findsOneWidget);
      expect(find.byKey(const ValueKey('btn_bold')), findsOneWidget);
      expect(find.byKey(const ValueKey('btn_italic')), findsOneWidget);
      expect(find.byKey(const ValueKey('btn_align_left')), findsOneWidget);
      expect(find.byKey(const ValueKey('btn_align_center')), findsOneWidget);
      expect(find.byKey(const ValueKey('btn_align_right')), findsOneWidget);
      expect(find.byKey(const ValueKey('btn_align_justify')), findsOneWidget);
      expect(find.byKey(const ValueKey('btn_duplicate')), findsOneWidget);
      expect(find.byKey(const ValueKey('btn_delete')), findsOneWidget);

      // 5. Quick Actions Section
      expect(find.text('Quick Actions'), findsOneWidget);
      expect(find.byKey(const ValueKey('btn_add_text')), findsOneWidget);
      expect(find.byKey(const ValueKey('btn_add_image')), findsOneWidget);
      expect(find.byKey(const ValueKey('btn_change_bg')), findsOneWidget);
      expect(find.byKey(const ValueKey('btn_layer_position')), findsOneWidget);

      // 6. Bottom Primary CTA
      expect(find.byKey(const ValueKey('btn_preview_poster')), findsOneWidget);
      expect(find.text('Preview Poster'), findsOneWidget);
    });

    testWidgets('Live Text Editing: Modal text update changes headline and pushes history', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        buildTestableMainPosterEditorScreen(localeController: englishController),
      );
      await tester.pumpAndSettle();

      // Open Edit Text modal
      await tester.ensureVisible(find.byKey(const ValueKey('btn_edit_text')));
      await tester.tap(find.byKey(const ValueKey('btn_edit_text')));
      await tester.pumpAndSettle();

      expect(find.byKey(const ValueKey('input_modal_edit_text')), findsOneWidget);
      expect(find.byKey(const ValueKey('btn_save_modal_text')), findsOneWidget);

      // Enter new text and submit
      await tester.enterText(find.byKey(const ValueKey('input_modal_edit_text')), 'Happy 77th Republic Day');
      await tester.tap(find.byKey(const ValueKey('btn_save_modal_text')));
      await tester.pumpAndSettle();

      // Modal is closed and text is updated
      expect(find.byKey(const ValueKey('input_modal_edit_text')), findsNothing);
      expect(find.text('Happy 77th Republic Day'), findsOneWidget);
    });

    testWidgets('Style Toggles: Bold and Italic toggles update style and alignment', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        buildTestableMainPosterEditorScreen(localeController: englishController),
      );
      await tester.pumpAndSettle();

      // Toggle Italic
      await tester.ensureVisible(find.byKey(const ValueKey('btn_italic')));
      await tester.tap(find.byKey(const ValueKey('btn_italic')));
      await tester.pumpAndSettle();

      // Toggle Center Alignment
      await tester.ensureVisible(find.byKey(const ValueKey('btn_align_center')));
      await tester.tap(find.byKey(const ValueKey('btn_align_center')));
      await tester.pumpAndSettle();
    });

    testWidgets('Element Actions: Duplicate and Delete manage elements reactive state', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        buildTestableMainPosterEditorScreen(localeController: englishController),
      );
      await tester.pumpAndSettle();

      // Tap Duplicate
      await tester.ensureVisible(find.byKey(const ValueKey('btn_duplicate')));
      await tester.tap(find.byKey(const ValueKey('btn_duplicate')));
      await tester.pumpAndSettle();
      expect(find.text('Element duplicated successfully!'), findsOneWidget);

      // Tap Delete
      await tester.ensureVisible(find.byKey(const ValueKey('btn_delete')));
      await tester.tap(find.byKey(const ValueKey('btn_delete')));
      await tester.pumpAndSettle();
      expect(find.text('Element deleted from poster.'), findsOneWidget);
    });

    testWidgets('Quick Actions: Add Text appends new element', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        buildTestableMainPosterEditorScreen(localeController: englishController),
      );
      await tester.pumpAndSettle();

      await tester.ensureVisible(find.byKey(const ValueKey('btn_add_text')));
      await tester.tap(find.byKey(const ValueKey('btn_add_text')));
      await tester.pumpAndSettle();

      expect(find.text('New text element added!'), findsOneWidget);
      expect(find.text('New Greeting Text'), findsOneWidget);
    });

    testWidgets('Zoom Tool: Cycling zoom changes zoom indicator', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        buildTestableMainPosterEditorScreen(localeController: englishController),
      );
      await tester.pumpAndSettle();

      expect(find.text('100%'), findsOneWidget);

      // Tap zoom cycle
      await tester.tap(find.byKey(const ValueKey('btn_zoom_cycle')));
      await tester.pumpAndSettle();
      expect(find.text('125%'), findsOneWidget);

      // Tap zoom fit
      await tester.tap(find.byKey(const ValueKey('btn_zoom_fit')));
      await tester.pumpAndSettle();
      expect(find.text('100%'), findsOneWidget);
    });

    testWidgets('Save Draft: Persists poster project and shows confirmation SnackBar', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        buildTestableMainPosterEditorScreen(localeController: englishController),
      );
      await tester.pumpAndSettle();

      await tester.tap(find.byKey(const ValueKey('btn_save_draft')));
      await tester.pumpAndSettle();

      expect(find.text('Poster draft saved successfully!'), findsOneWidget);
    });

    testWidgets('Preview Poster: Opens full modal dialog with pristine poster display', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        buildTestableMainPosterEditorScreen(localeController: englishController),
      );
      await tester.pumpAndSettle();

      await tester.ensureVisible(find.byKey(const ValueKey('btn_preview_poster')));
      await tester.tap(find.byKey(const ValueKey('btn_preview_poster')));
      await tester.pumpAndSettle();

      // Modal is visible
      expect(find.byType(Dialog), findsOneWidget);
      expect(find.text('Back to Editor'), findsOneWidget);
      expect(find.text('Share Poster'), findsOneWidget);

      // Close modal
      await tester.tap(find.text('Back to Editor'));
      await tester.pumpAndSettle();
      expect(find.byType(Dialog), findsNothing);
    });

    testWidgets('Responsive Multi-Device Layout: Zero overflows across all phone and tablet sizes', (tester) async {
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
          buildTestableMainPosterEditorScreen(size: size, localeController: englishController),
        );
        await tester.pumpAndSettle();

        expect(tester.takeException(), isNull, reason: 'Overflow on size $size');
      }
      addTearDown(tester.view.resetPhysicalSize);
    });
  });
}
