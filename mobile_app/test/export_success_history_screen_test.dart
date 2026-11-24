import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';
import 'package:panchayat_post/features/editor/data/services/download_history_service.dart';
import 'package:panchayat_post/features/editor/domain/models/download_history_record.dart';
import 'package:panchayat_post/features/editor/domain/models/poster_template_project.dart';
import 'package:panchayat_post/features/editor/presentation/screens/export_success_history_screen.dart';
import 'package:shared_preferences/shared_preferences.dart';

Widget _buildTestApp({
  String languageCode = 'en',
  ExportResult? exportResult,
  DownloadHistoryService? historyService,
}) {
  return LocaleScope(
    controller: LocaleController(initialLanguage: languageCode),
    child: MaterialApp(
      routes: {
        for (final entry in AppRoutes.routes.entries)
          if (entry.key != AppRoutes.splash) entry.key: entry.value,
      },
      home: ExportSuccessHistoryScreen(
        initialExportResult: exportResult,
        historyService: historyService,
      ),
    ),
  );
}

ExportResult _createSampleExportResult() {
  final record = DownloadHistoryRecord(
    id: 'dl_sample_navratri',
    posterId: 'navratri_01',
    title: 'Navratri Wishes Poster',
    filePath: '',
    format: 'JPG',
    width: 1080,
    height: 1080,
    fileSizeBytes: (2.4 * 1024 * 1024).toInt(),
    exportedAt: DateTime(2025, 10, 10, 16, 25),
    thumbnailAsset: 'assets/images/editor_canvas_navratri.png',
  );

  return ExportResult(
    record: record,
    originalProject: PosterTemplateProject.createDefaultRepublicDayProject(
      title: 'Navratri Wishes Poster',
    ),
    fileBytes: Uint8List.fromList([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
      0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
      0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4,
      0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41,
      0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
      0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00,
      0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE,
      0x42, 0x60, 0x82,
    ]),
  );
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  group('Screen 21: Export Success & Download History UI & Functionality', () {
    testWidgets('renders all visual components matching Screen 21 reference',
        (WidgetTester tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 915));
      final exportResult = _createSampleExportResult();

      await tester.pumpWidget(_buildTestApp(exportResult: exportResult));
      await tester.pumpAndSettle();

      // Header
      expect(find.byKey(const Key('btn_downloads_back')), findsOneWidget);
      expect(find.text('My Downloads'), findsOneWidget);
      expect(find.text('Your exported posters in one place'), findsOneWidget);

      // Success Confirmation Banner
      expect(find.text('Poster Exported Successfully!'), findsOneWidget);
      expect(find.text('Your poster is ready to use and share.'), findsOneWidget);

      // Featured Poster Card
      expect(find.text('Navratri Wishes Poster'), findsOneWidget);
      expect(find.text('1080 × 1080 px'), findsWidgets);
      expect(find.text('2.4 MB'), findsOneWidget);
      expect(find.byKey(const Key('btn_view_poster')), findsOneWidget);
      expect(find.byKey(const Key('btn_share_poster')), findsOneWidget);
      expect(find.byKey(const Key('btn_export_again')), findsOneWidget);

      // Recent Downloads Section
      expect(find.text('Recent Downloads'), findsOneWidget);
      expect(find.byKey(const Key('btn_filter_dropdown')), findsOneWidget);
      expect(find.text('Diwali Wishes Poster'), findsOneWidget);
      expect(find.text('Independence Day Poster'), findsOneWidget);
      expect(find.text('Ganesh Chaturthi Wishes'), findsOneWidget);

      // Empty State / Create Poster Banner
      expect(find.text('No Downloads Yet'), findsOneWidget);
      expect(find.text('Your exported posters will appear here.'), findsOneWidget);
      expect(find.byKey(const Key('btn_create_poster_empty')), findsOneWidget);
    });

    testWidgets('View Poster opens preview dialog and dismisses cleanly',
        (WidgetTester tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 915));
      final exportResult = _createSampleExportResult();

      await tester.pumpWidget(_buildTestApp(exportResult: exportResult));
      await tester.pumpAndSettle();

      // Tap View Poster
      await tester.tap(find.byKey(const Key('btn_view_poster')));
      await tester.pumpAndSettle();

      // Dialog is open
      expect(find.byType(Dialog), findsOneWidget);
      expect(find.byIcon(Icons.close_rounded), findsOneWidget);

      // Dismiss dialog
      await tester.tap(find.byIcon(Icons.close_rounded));
      await tester.pumpAndSettle();

      expect(find.byType(Dialog), findsNothing);
    });

    testWidgets('Share Poster button executes without error',
        (WidgetTester tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 915));
      final exportResult = _createSampleExportResult();

      await tester.pumpWidget(_buildTestApp(exportResult: exportResult));
      await tester.pumpAndSettle();

      // Tap Share Poster
      await tester.tap(find.byKey(const Key('btn_share_poster')));
      await tester.pumpAndSettle();

      expect(tester.takeException(), isNull);
    });

    testWidgets('Export Again navigates to Screen 20 Export Poster',
        (WidgetTester tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 915));
      final exportResult = _createSampleExportResult();

      await tester.pumpWidget(_buildTestApp(exportResult: exportResult));
      await tester.pumpAndSettle();

      // Tap Export Again
      await tester.tap(find.byKey(const Key('btn_export_again')));
      await tester.pumpAndSettle();

      // Expect Screen 20 Export Poster Title
      expect(find.text('Export Poster'), findsWidgets);
    });

    testWidgets('deleting a download item displays confirmation and removes item from history',
        (WidgetTester tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 915));
      final exportResult = _createSampleExportResult();
      await tester.pumpWidget(_buildTestApp(exportResult: exportResult));
      await tester.pumpAndSettle();

      // Initially Diwali Wishes Poster is present in the history list
      expect(find.text('Diwali Wishes Poster'), findsOneWidget);

      // Open options menu on Diwali Wishes Poster
      await tester.tap(find.byKey(const Key('menu_dl_diwali_2025')));
      await tester.pumpAndSettle();

      // Tap Delete Download in popup menu
      await tester.tap(find.text('Delete Download'));
      await tester.pumpAndSettle();

      // Confirmation dialog appears
      expect(find.byType(AlertDialog), findsOneWidget);
      expect(find.text('Are you sure you want to delete this downloaded poster?'), findsOneWidget);

      // Tap Delete in dialog
      await tester.tap(find.widgetWithText(ElevatedButton, 'Delete'));
      await tester.pumpAndSettle();

      // Item is now removed
      expect(find.text('Diwali Wishes Poster'), findsNothing);
    });

    testWidgets('filtering by JPG/PNG updates the displayed downloads',
        (WidgetTester tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 915));
      final exportResult = _createSampleExportResult();
      await tester.pumpWidget(_buildTestApp(exportResult: exportResult));
      await tester.pumpAndSettle();

      // Tap filter dropdown
      await tester.tap(find.byKey(const Key('btn_filter_dropdown')));
      await tester.pumpAndSettle();

      // Select PNG
      await tester.tap(find.text('PNG'));
      await tester.pumpAndSettle();

      // All initial sample records in history are JPG, so PNG history list has no Diwali item
      expect(find.text('Diwali Wishes Poster'), findsNothing);

      // Switch back to All
      await tester.tap(find.byKey(const Key('btn_filter_dropdown')));
      await tester.pumpAndSettle();
      await tester.tap(find.text('All'));
      await tester.pumpAndSettle();

      // Items return
      expect(find.text('Diwali Wishes Poster'), findsOneWidget);
    });

    testWidgets('renders cleanly across multiple screen resolutions without overflow',
        (WidgetTester tester) async {
      final originalOnError = FlutterError.onError;
      FlutterErrorDetails? caughtDetails;
      FlutterError.onError = (FlutterErrorDetails details) {
        caughtDetails = details;
        originalOnError?.call(details);
      };

      try {
        final testSizes = [
          const Size(360, 640),
          const Size(390, 844),
          const Size(412, 915),
          const Size(768, 1024),
        ];

        for (final size in testSizes) {
          await tester.binding.setSurfaceSize(size);
          final exportResult = _createSampleExportResult();
          await tester.pumpWidget(_buildTestApp(exportResult: exportResult));
          await tester.pumpAndSettle();

          expect(find.text('My Downloads'), findsOneWidget);
          expect(caughtDetails, isNull, reason: caughtDetails?.toString());
        }
      } finally {
        FlutterError.onError = originalOnError;
      }
    });

    testWidgets('supports Gujarati localization accurately',
        (WidgetTester tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 915));
      final exportResult = _createSampleExportResult();

      await tester.pumpWidget(_buildTestApp(
        languageCode: 'gu',
        exportResult: exportResult,
      ));
      await tester.pumpAndSettle();

      expect(find.text('મારા ડાઉનલોડ્સ'), findsOneWidget);
      expect(find.text('પોસ્ટર સફળતાપૂર્વક એક્સપોર્ટ થયું!'), findsOneWidget);
      expect(find.text('તાજેતરના ડાઉનલોડ્સ'), findsOneWidget);
      expect(find.text('પોસ્ટર જુઓ'), findsOneWidget);
      expect(find.text('ફરીથી એક્સપોર્ટ કરો'), findsOneWidget);
      expect(find.text('હજુ સુધી કોઈ ડાઉનલોડ નથી'), findsOneWidget);
    });
  });
}
