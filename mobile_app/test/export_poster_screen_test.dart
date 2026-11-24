import 'dart:io';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/features/editor/data/services/poster_export_service.dart';
import 'package:panchayat_post/features/editor/domain/models/poster_template_project.dart';
import 'package:panchayat_post/features/editor/presentation/screens/export_poster_screen.dart';

class _MockExportService extends PosterExportService {
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
    final tempDir = Directory.systemTemp.createTempSync();
    final file = File('${tempDir.path}/$filename.$format');
    file.writeAsBytesSync(bytes);
    return file;
  }
}

Widget _buildTestApp({
  String languageCode = 'en',
  PosterTemplateProject? project,
  PosterExportService? exportService,
}) {
  return LocaleScope(
    controller: LocaleController(initialLanguage: languageCode),
    child: MaterialApp(
      home: ExportPosterScreen(
        initialProject: project ?? PosterTemplateProject.createDefaultRepublicDayProject(),
        exportService: exportService ?? _MockExportService(),
      ),
    ),
  );
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('Screen 20: Export Poster Screen UI & Functionality Tests', () {
    testWidgets('renders all visual sections and defaults accurately',
        (WidgetTester tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 915));
      await tester.pumpWidget(_buildTestApp(languageCode: 'en'));
      await tester.pumpAndSettle();

      // Header
      expect(find.byKey(const Key('btn_export_poster_back')), findsOneWidget);
      expect(find.text('Export Poster'), findsWidgets);
      expect(find.text('Choose your preferred download settings'), findsOneWidget);

      // Top Poster Summary Card
      expect(find.text('Republic Day Celebration'), findsOneWidget);
      expect(find.text('1080 × 1350 px'), findsWidgets);
      expect(find.byKey(const Key('btn_preview_poster')), findsOneWidget);
      expect(find.text('Preview'), findsOneWidget);

      // Section 1: File Format
      expect(find.text('File Format'), findsOneWidget);
      expect(find.byKey(const Key('format_card_png')), findsOneWidget);
      expect(find.byKey(const Key('format_card_jpg')), findsOneWidget);
      expect(find.byKey(const Key('format_card_pdf')), findsOneWidget);
      expect(find.text('PNG'), findsWidgets);
      expect(find.text('JPG'), findsOneWidget);
      expect(find.text('PDF'), findsWidgets);

      // Section 2: Image Quality
      expect(find.text('Image Quality'), findsOneWidget);
      expect(find.byKey(const Key('quality_card_standard')), findsOneWidget);
      expect(find.byKey(const Key('quality_card_high')), findsOneWidget);
      expect(find.byKey(const Key('quality_card_ultra')), findsOneWidget);
      expect(find.text('Standard'), findsOneWidget);
      expect(find.text('High'), findsWidgets);
      expect(find.text('Ultra'), findsOneWidget);

      // Section 3: Resolution
      expect(find.text('Resolution'), findsWidgets);
      expect(find.byKey(const Key('resolution_card_standard')), findsOneWidget);
      expect(find.byKey(const Key('resolution_card_high')), findsOneWidget);
      expect(find.byKey(const Key('resolution_card_original')), findsOneWidget);
      expect(find.text('Standard Resolution'), findsOneWidget);
      expect(find.text('High Resolution'), findsOneWidget);
      expect(find.text('Original Dimensions'), findsOneWidget);

      // Section 4: Additional Options
      expect(find.text('Additional Options'), findsOneWidget);
      expect(find.text('Transparent Background'), findsOneWidget);
      expect(find.text('Maintain Original Aspect Ratio'), findsOneWidget);
      expect(find.byKey(const Key('switch_transparent_bg')), findsOneWidget);
      expect(find.byKey(const Key('switch_maintain_aspect_ratio')), findsOneWidget);

      // Section 5: Export Summary
      expect(find.text('Export Summary'), findsOneWidget);
      expect(find.text('Format'), findsOneWidget);
      expect(find.text('Quality'), findsOneWidget);
      expect(find.text('File Size'), findsOneWidget);
      expect(find.text('Calculating after export'), findsOneWidget);
      expect(find.text('Background'), findsOneWidget);
      expect(find.text('Opaque'), findsOneWidget);

      // Primary Button & Footer Note
      expect(find.byKey(const Key('btn_primary_export_poster')), findsOneWidget);
      expect(
        find.text('Your original editable poster will remain saved.'),
        findsOneWidget,
      );
    });

    testWidgets('format selection switches between PNG, JPG, PDF and disables transparency for non-PNG',
        (WidgetTester tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 915));
      await tester.pumpWidget(_buildTestApp(languageCode: 'en'));
      await tester.pumpAndSettle();

      // Tap JPG
      await tester.tap(find.byKey(const Key('format_card_jpg')));
      await tester.pumpAndSettle();

      // Now summary should show JPG
      expect(find.text('JPG'), findsWidgets);

      // Switch transparent background is disabled when JPG
      final switchTransparent = tester.widget<Switch>(find.byKey(const Key('switch_transparent_bg')));
      expect(switchTransparent.onChanged, isNull);

      // Tap PDF
      await tester.tap(find.byKey(const Key('format_card_pdf')));
      await tester.pumpAndSettle();

      // Switch remains disabled for PDF
      final switchTransparentPdf = tester.widget<Switch>(find.byKey(const Key('switch_transparent_bg')));
      expect(switchTransparentPdf.onChanged, isNull);

      // Tap back to PNG
      await tester.tap(find.byKey(const Key('format_card_png')));
      await tester.pumpAndSettle();

      // Switch is now re-enabled
      final switchTransparentPng = tester.widget<Switch>(find.byKey(const Key('switch_transparent_bg')));
      expect(switchTransparentPng.onChanged, isNotNull);
    });

    testWidgets('transparency toggle updates summary background to Transparent',
        (WidgetTester tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 915));
      await tester.pumpWidget(_buildTestApp(languageCode: 'en'));
      await tester.pumpAndSettle();

      // Initially Opaque
      expect(find.text('Opaque'), findsOneWidget);

      // Toggle Transparent Background switch
      await tester.tap(find.byKey(const Key('switch_transparent_bg')));
      await tester.pumpAndSettle();

      // Now background in summary is Transparent
      expect(find.text('Transparent'), findsOneWidget);

      // Toggle back
      await tester.tap(find.byKey(const Key('switch_transparent_bg')));
      await tester.pumpAndSettle();
      expect(find.text('Opaque'), findsOneWidget);
    });

    testWidgets('preview button opens preview dialog and close button dismisses it',
        (WidgetTester tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 915));
      await tester.pumpWidget(_buildTestApp(languageCode: 'en'));
      await tester.pumpAndSettle();

      // Tap preview
      await tester.tap(find.byKey(const Key('btn_preview_poster')));
      await tester.pumpAndSettle();

      // Dialog is open
      expect(find.byType(Dialog), findsOneWidget);
      expect(find.byIcon(Icons.close_rounded), findsOneWidget);

      // Dismiss dialog
      await tester.tap(find.byIcon(Icons.close_rounded));
      await tester.pumpAndSettle();

      expect(find.byType(Dialog), findsNothing);
    });

    testWidgets('tapping Export Poster triggers real file save and shows success sheet',
        (WidgetTester tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 915));
      await tester.pumpWidget(_buildTestApp(languageCode: 'en'));
      await tester.pumpAndSettle();

      // Scroll until Export Poster button is visible, then tap
      await tester.scrollUntilVisible(
        find.byKey(const Key('btn_primary_export_poster')),
        200,
      );
      await tester.tap(find.byKey(const Key('btn_primary_export_poster')));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 100));
      await tester.pumpAndSettle();

      // Success modal sheet is visible
      expect(find.text('Poster Exported Successfully!'), findsOneWidget);
      expect(find.byKey(const Key('btn_share_exported_poster')), findsOneWidget);
      expect(find.byKey(const Key('btn_dismiss_exported_sheet')), findsOneWidget);

      // Dismiss sheet
      await tester.tap(find.byKey(const Key('btn_dismiss_exported_sheet')));
      await tester.pumpAndSettle();

      expect(find.text('Poster Exported Successfully!'), findsNothing);
    });

    testWidgets('renders cleanly across multiple screen resolutions without overflow',
        (WidgetTester tester) async {
      final testSizes = [
        const Size(360, 640), // Small Android
        const Size(390, 844), // iPhone 12/13/14
        const Size(412, 915), // Pixel 7
        const Size(768, 1024), // Tablet
      ];

      for (final size in testSizes) {
        await tester.binding.setSurfaceSize(size);
        await tester.pumpWidget(_buildTestApp(languageCode: 'en'));
        await tester.pumpAndSettle();

        expect(find.text('Export Poster'), findsWidgets);
        expect(tester.takeException(), isNull);
      }
    });

    testWidgets('supports Gujarati localization accurately',
        (WidgetTester tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 915));
      await tester.pumpWidget(_buildTestApp(languageCode: 'gu'));
      await tester.pumpAndSettle();

      expect(find.text('પોસ્ટર એક્સપોર્ટ કરો'), findsWidgets);
      expect(find.text('તમારી પસંદગીના ડાઉનલોડ સેટિંગ્સ પસંદ કરો'), findsOneWidget);
      expect(find.text('ફાઇલ ફોર્મેટ'), findsOneWidget);
      expect(find.text('ઇમેજ ગુણવત્તા'), findsOneWidget);
      expect(find.text('રિઝોલ્યુશન'), findsWidgets);
      expect(find.text('વધારાના વિકલ્પો'), findsOneWidget);
      expect(find.text('એક્સપોર્ટ સારાંશ'), findsOneWidget);
    });
  });
}
