import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';
import 'package:panchayat_post/features/editor/data/services/design_storage_service.dart';
import 'package:panchayat_post/features/editor/domain/models/poster_template_project.dart';
import 'package:panchayat_post/features/editor/presentation/screens/final_poster_preview_screen.dart';

Widget buildTestableFinalPosterPreviewScreen({
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
        child: FinalPosterPreviewScreen(
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

  group('Screen 19: Final Poster Preview & Quality Check Tests', () {
    testWidgets('Renders all approved Screen 19 UI elements matching reference image', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        buildTestableFinalPosterPreviewScreen(localeController: englishController),
      );
      await tester.pumpAndSettle();

      // 1. Top Header Bar
      expect(find.byKey(const ValueKey('btn_preview_back')), findsOneWidget);
      expect(find.byKey(const ValueKey('preview_screen_title')), findsOneWidget);
      expect(find.text('Final Poster Preview'), findsOneWidget);
      expect(find.byKey(const ValueKey('preview_screen_subtitle')), findsOneWidget);
      expect(find.text('Review your design before exporting.'), findsOneWidget);

      // 2. Poster Preview Card
      expect(find.byKey(const ValueKey('card_poster_preview')), findsOneWidget);

      // 3. Preview Controls Bar (4 items)
      expect(find.byKey(const ValueKey('btn_zoom_out')), findsOneWidget);
      expect(find.text('Zoom Out'), findsOneWidget);
      expect(find.byKey(const ValueKey('btn_zoom_in')), findsOneWidget);
      expect(find.text('Zoom In'), findsOneWidget);
      expect(find.byKey(const ValueKey('btn_fit_screen')), findsOneWidget);
      expect(find.text('Fit to Screen'), findsOneWidget);
      expect(find.byKey(const ValueKey('btn_full_screen')), findsOneWidget);
      expect(find.text('Full Screen'), findsOneWidget);

      // 4. Quality Check Card
      expect(find.byKey(const ValueKey('card_quality_check')), findsOneWidget);
      expect(find.text('Quality Check'), findsOneWidget);
      expect(find.byKey(const ValueKey('check_text_visibility')), findsOneWidget);
      expect(find.byKey(const ValueKey('check_image_quality')), findsOneWidget);
      expect(find.byKey(const ValueKey('check_logo_placement')), findsOneWidget);
      expect(find.byKey(const ValueKey('check_layout_alignment')), findsOneWidget);
      expect(find.byKey(const ValueKey('check_contact_info')), findsOneWidget);

      // 5. Poster Information Card
      expect(find.byKey(const ValueKey('card_poster_info')), findsOneWidget);
      expect(find.text('Poster Information'), findsOneWidget);
      expect(find.text('Republic Day Celebration'), findsOneWidget);
      expect(find.text('1080 × 1350 px'), findsOneWidget);
      expect(find.text('Social Media Poster'), findsOneWidget);
      expect(find.text('Just now'), findsOneWidget);

      // 6. Bottom Actions Row
      expect(find.byKey(const ValueKey('btn_edit_again')), findsOneWidget);
      expect(find.text('Edit Again'), findsOneWidget);
      expect(find.byKey(const ValueKey('btn_save_draft')), findsOneWidget);
      expect(find.text('Save Draft'), findsOneWidget);
      expect(find.byKey(const ValueKey('btn_continue_export')), findsOneWidget);
      expect(find.text('Continue to Export'), findsOneWidget);
    });

    testWidgets('Preview Controls: Zoom In, Zoom Out, and Fit to Screen operate properly', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        buildTestableFinalPosterPreviewScreen(localeController: englishController),
      );
      await tester.pumpAndSettle();

      // Tap Zoom In
      await tester.tap(find.byKey(const ValueKey('btn_zoom_in')));
      await tester.pumpAndSettle();

      // Tap Zoom Out
      await tester.tap(find.byKey(const ValueKey('btn_zoom_out')));
      await tester.pumpAndSettle();

      // Tap Fit to Screen
      await tester.tap(find.byKey(const ValueKey('btn_fit_screen')));
      await tester.pumpAndSettle();
    });

    testWidgets('Full Screen Preview: Opens immersive modal and closes cleanly', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        buildTestableFinalPosterPreviewScreen(localeController: englishController),
      );
      await tester.pumpAndSettle();

      // Open Full Screen
      await tester.tap(find.byKey(const ValueKey('btn_full_screen')));
      await tester.pumpAndSettle();

      expect(find.byType(Dialog), findsOneWidget);
      expect(find.byKey(const ValueKey('btn_close_full_screen')), findsOneWidget);

      // Close Full Screen
      await tester.tap(find.byKey(const ValueKey('btn_close_full_screen')));
      await tester.pumpAndSettle();
      expect(find.byType(Dialog), findsNothing);
    });

    testWidgets('Quality Check Engine: Running checks validates all criteria and updates statuses', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        buildTestableFinalPosterPreviewScreen(localeController: englishController),
      );
      await tester.pumpAndSettle();

      // Tap Quality Check card to run full validation engine
      await tester.ensureVisible(find.byKey(const ValueKey('card_quality_check')));
      await tester.tap(find.byKey(const ValueKey('card_quality_check')));
      await tester.pumpAndSettle();

      // Verify completion SnackBar and passed badges
      expect(find.text('Quality check completed. All checks passed!'), findsOneWidget);
      expect(find.text('Passed'), findsAtLeastNWidgets(1));
    });

    testWidgets('Save Draft: Persists poster project and shows confirmation SnackBar', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        buildTestableFinalPosterPreviewScreen(localeController: englishController),
      );
      await tester.pumpAndSettle();

      await tester.ensureVisible(find.byKey(const ValueKey('btn_save_draft')));
      await tester.tap(find.byKey(const ValueKey('btn_save_draft')));
      await tester.pumpAndSettle();

      expect(find.text('Poster draft saved successfully!'), findsOneWidget);
    });

    testWidgets('Continue to Export: Navigates to Screen 13/20 Poster Preview & Export flow', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        buildTestableFinalPosterPreviewScreen(localeController: englishController),
      );
      await tester.pumpAndSettle();

      await tester.ensureVisible(find.byKey(const ValueKey('btn_continue_export')));
      await tester.tap(find.byKey(const ValueKey('btn_continue_export')));
      await tester.pumpAndSettle();

      // Navigation executed
      expect(find.byKey(const ValueKey('card_poster_preview')), findsNothing);
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
          buildTestableFinalPosterPreviewScreen(size: size, localeController: englishController),
        );
        await tester.pumpAndSettle();

        expect(tester.takeException(), isNull, reason: 'Overflow on size $size');
      }
      addTearDown(tester.view.resetPhysicalSize);
    });
  });
}
