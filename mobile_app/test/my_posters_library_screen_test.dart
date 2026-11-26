import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';
import 'package:panchayat_post/features/editor/data/services/poster_library_service.dart';
import 'package:panchayat_post/features/editor/domain/models/poster_template_project.dart';
import 'package:panchayat_post/features/editor/presentation/screens/my_posters_library_screen.dart';
import 'package:shared_preferences/shared_preferences.dart';

Widget _buildTestApp({
  String languageCode = 'en',
  PosterLibraryService? libraryService,
  List<PosterTemplateProject>? initialPosters,
}) {
  return LocaleScope(
    controller: LocaleController(initialLanguage: languageCode),
    child: MaterialApp(
      routes: {
        for (final entry in AppRoutes.routes.entries)
          if (entry.key != AppRoutes.splash) entry.key: entry.value,
      },
      home: MyPostersLibraryScreen(
        libraryService: libraryService,
        initialPosters: initialPosters,
      ),
    ),
  );
}

List<PosterTemplateProject> _createSamplePosters() {
  return [
    PosterTemplateProject(
      id: 'p_navratri',
      templateId: 'navratri_wishes',
      title: 'Navratri Wishes Poster',
      backgroundAsset: '',
      previewAsset: '',
      category: 'Festivals',
      status: 'completed',
      fileSizeBytes: (2.4 * 1024 * 1024).toInt(),
      createdAt: DateTime(2025, 10, 10, 16, 25),
      updatedAt: DateTime(2025, 10, 10, 16, 25),
    ),
    PosterTemplateProject(
      id: 'p_independence',
      templateId: 'republic_day',
      title: 'Independence Day Poster',
      backgroundAsset: '',
      previewAsset: '',
      category: 'National',
      status: 'exported',
      fileSizeBytes: (1.8 * 1024 * 1024).toInt(),
      createdAt: DateTime(2025, 8, 15, 9, 20),
      updatedAt: DateTime(2025, 8, 15, 9, 20),
      lastExportedAt: DateTime(2025, 8, 15, 9, 20),
    ),
    PosterTemplateProject(
      id: 'p_diwali',
      templateId: 'happy_diwali',
      title: 'Diwali Wishes Poster',
      backgroundAsset: '',
      previewAsset: '',
      category: 'Festivals',
      status: 'draft',
      fileSizeBytes: (1.8 * 1024 * 1024).toInt(),
      createdAt: DateTime(2025, 10, 8, 16, 15),
      updatedAt: DateTime(2025, 10, 8, 16, 15),
    ),
    PosterTemplateProject(
      id: 'p_gram_sabha',
      templateId: 'gram_sabha_notice',
      title: 'Gram Sabha Notice',
      backgroundAsset: '',
      previewAsset: '',
      category: 'Panchayat',
      status: 'draft',
      fileSizeBytes: 980 * 1024,
      createdAt: DateTime(2025, 10, 5, 10, 0),
      updatedAt: DateTime(2025, 10, 5, 10, 0),
    ),
  ];
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  group('Screen 22: My Posters – Saved Drafts & Poster Library Tests', () {
    testWidgets('renders all visual sections and counts matching Screen 22 reference',
        (WidgetTester tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 915));
      await tester.pumpWidget(_buildTestApp(initialPosters: _createSamplePosters()));
      await tester.pumpAndSettle();

      // Header
      expect(find.byKey(const Key('btn_posters_back')), findsOneWidget);
      expect(find.text('My Posters'), findsOneWidget);
      expect(find.text('All your designs, in one place'), findsOneWidget);
      expect(find.byKey(const Key('btn_header_search')), findsOneWidget);
      expect(find.byKey(const Key('btn_header_filter')), findsOneWidget);

      // Summary Metric Cards
      expect(find.byKey(const Key('metric_total_posters')), findsOneWidget);
      expect(find.byKey(const Key('metric_drafts')), findsOneWidget);
      expect(find.byKey(const Key('metric_completed')), findsOneWidget);
      expect(find.text('Total Posters'), findsOneWidget);
      expect(find.text('Drafts'), findsWidgets);
      expect(find.text('Completed'), findsWidgets);

      // Category Tabs
      expect(find.byKey(const Key('tab_all_posters')), findsOneWidget);
      expect(find.byKey(const Key('tab_drafts')), findsOneWidget);
      expect(find.byKey(const Key('tab_exported')), findsOneWidget);
      expect(find.text('All Posters'), findsOneWidget);
      expect(find.text('Exported'), findsWidgets);

      // Search & Filters Bar
      expect(find.byKey(const Key('posters_search_field')), findsOneWidget);
      expect(find.byKey(const Key('btn_filter_category_dropdown')), findsOneWidget);
      expect(find.byKey(const Key('btn_date_filter_dropdown')), findsOneWidget);
      expect(find.byKey(const Key('btn_sort_dropdown')), findsOneWidget);

      // Posters in Grid
      expect(find.text('Navratri Wishes Poster'), findsOneWidget);
      expect(find.text('Independence Day Poster'), findsOneWidget);
      expect(find.text('Diwali Wishes Poster'), findsOneWidget);
      expect(find.text('Gram Sabha Notice'), findsOneWidget);

      // Status Badges on Cards
      expect(find.text('Draft'), findsWidgets);

      // Empty State Card & FAB
      expect(find.text('Your Poster Library is Empty'), findsOneWidget);
      expect(find.byKey(const Key('btn_create_poster_card')), findsOneWidget);
      expect(find.byKey(const Key('btn_fab_create_poster')), findsOneWidget);
    });

    testWidgets('tab switching filters posters between All Posters, Drafts and Exported',
        (WidgetTester tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 915));
      final posters = _createSamplePosters();
      final library = PosterLibraryService();
      for (final p in posters) {
        await library.savePoster(p);
      }

      await tester.pumpWidget(_buildTestApp(libraryService: library));
      await tester.pumpAndSettle();

      // Initially All Posters: 4 posters visible
      expect(find.text('Navratri Wishes Poster'), findsOneWidget);
      expect(find.text('Independence Day Poster'), findsOneWidget);
      expect(find.text('Diwali Wishes Poster'), findsOneWidget);
      expect(find.text('Gram Sabha Notice'), findsOneWidget);

      // Switch to Drafts tab
      await tester.tap(find.byKey(const Key('tab_drafts')));
      await tester.pumpAndSettle();

      expect(find.text('Diwali Wishes Poster'), findsOneWidget);
      expect(find.text('Gram Sabha Notice'), findsOneWidget);
      expect(find.text('Navratri Wishes Poster'), findsNothing);
      expect(find.text('Independence Day Poster'), findsNothing);

      // Switch to Exported tab
      await tester.tap(find.byKey(const Key('tab_exported')));
      await tester.pumpAndSettle();

      expect(find.text('Independence Day Poster'), findsOneWidget);
      expect(find.text('Diwali Wishes Poster'), findsNothing);
    });

    testWidgets('search filters posters in real-time by title',
        (WidgetTester tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 915));
      final posters = _createSamplePosters();
      final library = PosterLibraryService();
      for (final p in posters) {
        await library.savePoster(p);
      }

      await tester.pumpWidget(_buildTestApp(libraryService: library));
      await tester.pumpAndSettle();

      // Search for 'Diwali'
      await tester.enterText(find.byKey(const Key('posters_search_field')), 'Diwali');
      await tester.pumpAndSettle();

      expect(find.text('Diwali Wishes Poster'), findsOneWidget);
      expect(find.text('Navratri Wishes Poster'), findsNothing);
      expect(find.text('Gram Sabha Notice'), findsNothing);

      // Clear search
      await tester.enterText(find.byKey(const Key('posters_search_field')), '');
      await tester.pumpAndSettle();

      expect(find.text('Navratri Wishes Poster'), findsOneWidget);
      expect(find.text('Gram Sabha Notice'), findsOneWidget);
    });

    testWidgets('Preview action opens interactive modal dialog with dismiss button',
        (WidgetTester tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 915));
      await tester.pumpWidget(_buildTestApp(initialPosters: _createSamplePosters()));
      await tester.pumpAndSettle();

      // Tap on card directly
      await tester.tap(find.text('Navratri Wishes Poster'));
      await tester.pumpAndSettle();

      expect(find.byType(Dialog), findsOneWidget);
      expect(find.text('Edit in Studio'), findsOneWidget);

      // Dismiss dialog
      await tester.tap(find.byIcon(Icons.close_rounded));
      await tester.pumpAndSettle();

      expect(find.byType(Dialog), findsNothing);
    });

    testWidgets('Duplicate poster creates a copy with draft status',
        (WidgetTester tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 915));
      final posters = _createSamplePosters();
      final library = PosterLibraryService();
      for (final p in posters) {
        await library.savePoster(p);
      }

      await tester.pumpWidget(_buildTestApp(libraryService: library));
      await tester.pumpAndSettle();

      // Ensure menu is visible above FAB
      await tester.ensureVisible(find.byKey(const Key('menu_p_navratri')));
      await tester.pumpAndSettle();

      // Open menu on Navratri Wishes Poster
      await tester.tap(find.byKey(const Key('menu_p_navratri')));
      await tester.pumpAndSettle();

      // Tap Duplicate
      await tester.tap(find.text('Duplicate'));
      await tester.pumpAndSettle();

      // Duplicate should appear in the library
      expect(find.text('Copy of Navratri Wishes Poster'), findsOneWidget);
      // Original remains intact
      expect(find.text('Navratri Wishes Poster'), findsOneWidget);
    });

    testWidgets('Rename poster updates title in dialog and refreshes library',
        (WidgetTester tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 915));
      final posters = _createSamplePosters();
      final library = PosterLibraryService();
      for (final p in posters) {
        await library.savePoster(p);
      }

      await tester.pumpWidget(_buildTestApp(libraryService: library));
      await tester.pumpAndSettle();

      await tester.ensureVisible(find.byKey(const Key('menu_p_gram_sabha')));
      await tester.pumpAndSettle();

      // Open menu on Gram Sabha Notice
      await tester.tap(find.byKey(const Key('menu_p_gram_sabha')));
      await tester.pumpAndSettle();

      // Tap Rename
      await tester.tap(find.text('Rename'));
      await tester.pumpAndSettle();

      expect(find.byType(AlertDialog), findsOneWidget);

      // Enter new title
      await tester.enterText(find.byType(TextField).last, 'Gram Sabha 2025 Notice');
      await tester.pumpAndSettle();

      // Confirm rename
      await tester.tap(find.byKey(const Key('btn_confirm_rename')));
      await tester.pumpAndSettle();

      expect(find.text('Gram Sabha 2025 Notice'), findsOneWidget);
    });

    testWidgets('Delete poster shows confirmation dialog and removes poster',
        (WidgetTester tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 915));
      final posters = _createSamplePosters();
      final library = PosterLibraryService();
      for (final p in posters) {
        await library.savePoster(p);
      }

      await tester.pumpWidget(_buildTestApp(libraryService: library));
      await tester.pumpAndSettle();

      expect(find.text('Diwali Wishes Poster'), findsOneWidget);

      await tester.ensureVisible(find.byKey(const Key('menu_p_diwali')));
      await tester.pumpAndSettle();

      // Open menu on Diwali Wishes Poster
      await tester.tap(find.byKey(const Key('menu_p_diwali')));
      await tester.pumpAndSettle();

      // Tap Delete
      await tester.tap(find.text('Delete'));
      await tester.pumpAndSettle();

      expect(find.byType(AlertDialog), findsOneWidget);

      // Confirm delete
      await tester.tap(find.byKey(const Key('btn_confirm_delete_poster')));
      await tester.pumpAndSettle();

      expect(find.text('Diwali Wishes Poster'), findsNothing);
    });

    testWidgets('renders cleanly across multiple screen resolutions without overflow',
        (WidgetTester tester) async {
      final testSizes = [
        const Size(360, 640),
        const Size(390, 844),
        const Size(412, 915),
        const Size(768, 1024),
      ];

      for (final size in testSizes) {
        await tester.binding.setSurfaceSize(size);
        await tester.pumpWidget(_buildTestApp(initialPosters: _createSamplePosters()));
        await tester.pumpAndSettle();

        expect(find.text('My Posters'), findsOneWidget);
        expect(tester.takeException(), isNull);
      }
    });

    testWidgets('supports Gujarati localization accurately',
        (WidgetTester tester) async {
      await tester.binding.setSurfaceSize(const Size(412, 915));
      await tester.pumpWidget(_buildTestApp(
        languageCode: 'gu',
        initialPosters: _createSamplePosters(),
      ));
      await tester.pumpAndSettle();

      expect(find.text('મારા પોસ્ટર્સ'), findsOneWidget);
      expect(find.text('કુલ પોસ્ટર્સ'), findsOneWidget);
      expect(find.text('ડ્રાફ્ટ્સ'), findsWidgets);
      expect(find.text('બધા પોસ્ટર્સ'), findsOneWidget);
      expect(find.text('તમારી પોસ્ટર લાયબ્રેરી ખાલી છે'), findsOneWidget);
    });
  });
}
