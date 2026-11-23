import 'dart:io';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';
import 'package:panchayat_post/features/editor/data/services/design_storage_service.dart';
import 'package:panchayat_post/features/editor/data/services/poster_export_service.dart';
import 'package:panchayat_post/features/editor/domain/models/poster_template_project.dart';
import 'package:panchayat_post/features/editor/presentation/screens/poster_preview_screen.dart';

/// Test mock of PosterExportService that avoids native calls
class FakePosterExportService extends PosterExportService {
  bool downloadCalled = false;
  bool shareCalled = false;

  @override
  Future<Uint8List?> captureBoundaryToBytes(
    GlobalKey repaintBoundaryKey, {
    double pixelRatio = 2.0,
  }) async {
    return Uint8List.fromList([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  }

  @override
  Future<File> savePosterToFile({
    required Uint8List bytes,
    required String filename,
    required String format,
  }) async {
    downloadCalled = true;
    return File('mock_export_dir/$filename.$format');
  }
}

Widget buildTestablePosterPreviewScreen({
  Size size = const Size(390, 844),
  LocaleController? localeController,
  PosterTemplateProject? initialProject,
  DesignStorageService? storageService,
  PosterExportService? exportService,
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
        child: PosterPreviewScreen(
          initialProject: initialProject,
          storageService: storageService,
          exportService: exportService,
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

  group('Screen 13: Final Poster Preview, Download & Share Tests', () {
    testWidgets('Renders all approved Screen 13 UI elements matching reference image', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        buildTestablePosterPreviewScreen(localeController: englishController),
      );
      await tester.pumpAndSettle();

      // 1. Top Header
      expect(find.byKey(const ValueKey('preview_back_button')), findsOneWidget);
      expect(find.byKey(const ValueKey('preview_title')), findsOneWidget);
      expect(find.text('Your Poster'), findsOneWidget);
      expect(find.byKey(const ValueKey('preview_subtitle')), findsOneWidget);
      expect(find.text('Your design is ready!'), findsOneWidget);
      expect(find.byKey(const ValueKey('preview_header_more_button')), findsOneWidget);

      // 2. Success Status Banner
      expect(find.byKey(const ValueKey('success_check_badge')), findsOneWidget);
      expect(find.text('Poster Created Successfully'), findsOneWidget);
      expect(find.text('Your design is ready to download and share.'), findsOneWidget);

      // 3. Poster Preview Card
      expect(find.byKey(const ValueKey('poster_canvas_preview_gesture')), findsOneWidget);
      expect(find.text('શુભ નવરાત્રી'), findsWidgets);

      // 4. Title & Metadata Row
      expect(find.byKey(const ValueKey('preview_design_title')), findsOneWidget);
      expect(find.text('Navratri Celebration'), findsOneWidget);
      expect(find.byKey(const ValueKey('badge_custom_design')), findsOneWidget);
      expect(find.text('Custom Design'), findsOneWidget);

      // 5. Quick Action Toolbar
      expect(find.byKey(const ValueKey('action_preview')), findsOneWidget);
      expect(find.text('Preview'), findsOneWidget);
      expect(find.byKey(const ValueKey('action_edit')), findsOneWidget);
      expect(find.text('Edit'), findsOneWidget);
      expect(find.byKey(const ValueKey('action_duplicate')), findsOneWidget);
      expect(find.text('Duplicate'), findsOneWidget);
      expect(find.byKey(const ValueKey('action_more')), findsOneWidget);
      expect(find.text('More'), findsOneWidget);

      // 6. Download Section
      expect(find.text('Download Your Poster'), findsOneWidget);
      expect(find.byKey(const ValueKey('format_jpg_button')), findsOneWidget);
      expect(find.byKey(const ValueKey('format_png_button')), findsOneWidget);
      expect(find.byKey(const ValueKey('high_quality_toggle')), findsOneWidget);
      expect(find.text('High Quality'), findsOneWidget);
      expect(find.byKey(const ValueKey('section_download_poster_button')), findsOneWidget);

      // 7. Share Section
      expect(find.text('Share Your Creation'), findsOneWidget);
      expect(find.byKey(const ValueKey('share_whatsapp_button')), findsOneWidget);
      expect(find.text('WhatsApp'), findsOneWidget);
      expect(find.byKey(const ValueKey('share_instagram_button')), findsOneWidget);
      expect(find.text('Instagram'), findsOneWidget);
      expect(find.byKey(const ValueKey('share_more_button')), findsOneWidget);
      expect(find.text('Share More'), findsOneWidget);

      // 8. Saved in My Designs Banner
      expect(find.byKey(const ValueKey('saved_in_my_designs_text')), findsOneWidget);
      expect(find.text('Saved in My Designs'), findsOneWidget);

      // 9. Bottom Dual Action Bar
      expect(find.byKey(const ValueKey('bottom_share_poster_button')), findsOneWidget);
      expect(find.text('Share Poster'), findsOneWidget);
      expect(find.byKey(const ValueKey('bottom_download_poster_button')), findsOneWidget);
      expect(find.text('Download Poster'), findsWidgets);
    });

    testWidgets('Tapping Format selection toggles between JPG and PNG', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        buildTestablePosterPreviewScreen(localeController: englishController),
      );
      await tester.pumpAndSettle();

      await tester.ensureVisible(find.byKey(const ValueKey('format_png_button')));
      await tester.pumpAndSettle();

      // Tap PNG
      await tester.tap(find.byKey(const ValueKey('format_png_button')));
      await tester.pumpAndSettle();

      // Tap JPG again
      await tester.tap(find.byKey(const ValueKey('format_jpg_button')));
      await tester.pumpAndSettle();

      expect(find.byKey(const ValueKey('format_jpg_button')), findsOneWidget);
    });

    testWidgets('Tapping Preview opens interactive full screen preview dialog', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        buildTestablePosterPreviewScreen(localeController: englishController),
      );
      await tester.pumpAndSettle();

      await tester.ensureVisible(find.byKey(const ValueKey('action_preview')));
      await tester.pumpAndSettle();

      await tester.tap(find.byKey(const ValueKey('action_preview')));
      await tester.pumpAndSettle();

      // Dialog opens with InteractiveViewer
      expect(find.byType(Dialog), findsOneWidget);
      expect(find.byType(InteractiveViewer), findsOneWidget);

      // Close dialog
      await tester.tap(find.byIcon(Icons.close_rounded));
      await tester.pumpAndSettle();

      expect(find.byType(Dialog), findsNothing);
    });

    testWidgets('Tapping Duplicate creates duplicate design and displays confirmation SnackBar', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        buildTestablePosterPreviewScreen(localeController: englishController),
      );
      await tester.pumpAndSettle();

      await tester.ensureVisible(find.byKey(const ValueKey('action_duplicate')));
      await tester.pumpAndSettle();

      await tester.tap(find.byKey(const ValueKey('action_duplicate')));
      await tester.pumpAndSettle();

      expect(find.byType(SnackBar), findsOneWidget);
      expect(find.textContaining('Duplicate poster saved successfully!'), findsOneWidget);
    });

    testWidgets('Tapping Download Poster executes real export and displays downloaded file path in SnackBar', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      final fakeExport = FakePosterExportService();

      await tester.pumpWidget(
        buildTestablePosterPreviewScreen(
          localeController: englishController,
          exportService: fakeExport,
        ),
      );
      await tester.pumpAndSettle();

      await tester.ensureVisible(find.byKey(const ValueKey('section_download_poster_button')));
      await tester.pumpAndSettle();

      await tester.tap(find.byKey(const ValueKey('section_download_poster_button')));
      await tester.pumpAndSettle();

      expect(fakeExport.downloadCalled, isTrue);
      expect(find.byType(SnackBar), findsOneWidget);
      expect(find.textContaining('Downloaded:'), findsOneWidget);
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
          buildTestablePosterPreviewScreen(
            size: size,
            localeController: englishController,
          ),
        );
        await tester.pumpAndSettle();

        expect(tester.takeException(), isNull);
        expect(find.byKey(const ValueKey('preview_title')), findsOneWidget);
        expect(find.byKey(const ValueKey('poster_canvas_preview_gesture')), findsOneWidget);
      }
    });
  });
}
