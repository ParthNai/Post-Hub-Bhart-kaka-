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
import 'package:panchayat_post/features/editor/presentation/screens/my_designs_screen.dart';

/// Test fake of PosterExportService
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

Widget buildTestableMyDesignsScreen({
  Size size = const Size(390, 1400),
  LocaleController? localeController,
  List<PosterTemplateProject>? initialDesigns,
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
        child: MyDesignsScreen(
          initialDesigns: initialDesigns,
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

  group('Screen 14: My Designs Screen Core UI Tests', () {
    testWidgets('Renders header with title, subtitle, notification and avatar', (tester) async {
      await tester.pumpWidget(
        buildTestableMyDesignsScreen(localeController: englishController),
      );
      await tester.pumpAndSettle();

      expect(find.byKey(const ValueKey('my_designs_page_title')), findsOneWidget);
      expect(find.byKey(const ValueKey('my_designs_page_subtitle')), findsOneWidget);
      expect(find.byKey(const ValueKey('my_designs_notification_button')), findsOneWidget);
      expect(find.byKey(const ValueKey('my_designs_profile_avatar')), findsOneWidget);
    });

    testWidgets('Renders 3 summary cards (Total Designs, Recently Created, Favorites)', (tester) async {
      await tester.pumpWidget(
        buildTestableMyDesignsScreen(localeController: englishController),
      );
      await tester.pumpAndSettle();

      expect(find.byKey(const ValueKey('metric_total_designs')), findsOneWidget);
      expect(find.byKey(const ValueKey('metric_recently_created')), findsOneWidget);
      expect(find.byKey(const ValueKey('metric_favorites')), findsOneWidget);

      expect(find.text('Total Designs'), findsOneWidget);
      expect(find.text('Recently Created'), findsOneWidget);
      // 'Favorites' also appears in category chips, so find inside metric card
      expect(
        find.descendant(
          of: find.byKey(const ValueKey('metric_favorites')),
          matching: find.text('Favorites'),
        ),
        findsOneWidget,
      );
    });

    testWidgets('Renders search bar, filter button and category chips', (tester) async {
      await tester.pumpWidget(
        buildTestableMyDesignsScreen(localeController: englishController),
      );
      await tester.pumpAndSettle();

      expect(find.byKey(const ValueKey('my_designs_search_field')), findsOneWidget);
      expect(find.byKey(const ValueKey('my_designs_filter_button')), findsOneWidget);

      expect(find.byKey(const ValueKey('chip_category_All Designs')), findsOneWidget);
      expect(find.byKey(const ValueKey('chip_category_Festivals')), findsOneWidget);
      expect(find.byKey(const ValueKey('chip_category_Panchayat')), findsOneWidget);
      expect(find.byKey(const ValueKey('chip_category_Business')), findsOneWidget);
      expect(find.byKey(const ValueKey('chip_category_Favorites')), findsOneWidget);
    });

    testWidgets('Renders gallery toolbar with title and view mode buttons', (tester) async {
      await tester.pumpWidget(
        buildTestableMyDesignsScreen(localeController: englishController),
      );
      await tester.pumpAndSettle();

      expect(find.text('Your Creations'), findsOneWidget);
      expect(find.byKey(const ValueKey('toggle_grid_view')), findsOneWidget);
      expect(find.byKey(const ValueKey('toggle_list_view')), findsOneWidget);
      expect(find.byKey(const ValueKey('button_sort_designs')), findsOneWidget);
    });

    testWidgets('Renders bottom navigation bar with My Designs active', (tester) async {
      await tester.pumpWidget(
        buildTestableMyDesignsScreen(localeController: englishController),
      );
      await tester.pumpAndSettle();

      expect(find.byKey(const ValueKey('bottom_nav_my_designs')), findsOneWidget);
    });
  });

  group('Screen 14: Filtering, Searching & Favorites', () {
    testWidgets('Filters designs when searching by title', (tester) async {
      await tester.pumpWidget(
        buildTestableMyDesignsScreen(localeController: englishController),
      );
      await tester.pumpAndSettle();

      // Enter search query
      final searchField = find.byKey(const ValueKey('my_designs_search_field'));
      await tester.enterText(searchField, 'Diwali');
      await tester.pumpAndSettle();

      expect(find.text('Happy Diwali'), findsOneWidget);
      expect(find.text('Navratri Wishes'), findsNothing);

      // Clear search
      final clearButton = find.byKey(const ValueKey('designs_search_clear'));
      expect(clearButton, findsOneWidget);
      await tester.tap(clearButton);
      await tester.pumpAndSettle();

      expect(find.text('Navratri Wishes'), findsOneWidget);
      expect(find.text('Happy Diwali'), findsOneWidget);
    });

    testWidgets('Filters designs when tapping category chip', (tester) async {
      await tester.pumpWidget(
        buildTestableMyDesignsScreen(localeController: englishController),
      );
      await tester.pumpAndSettle();

      // Tap Panchayat category
      await tester.tap(find.byKey(const ValueKey('chip_category_Panchayat')));
      await tester.pumpAndSettle();

      expect(find.text('Village Development'), findsOneWidget);
      expect(find.text('Gram Sabha Notice'), findsOneWidget);
      expect(find.text('Navratri Wishes'), findsNothing);

      // Return to All Designs
      await tester.tap(find.byKey(const ValueKey('chip_category_All Designs')));
      await tester.pumpAndSettle();

      expect(find.text('Navratri Wishes'), findsOneWidget);
      expect(find.text('Village Development'), findsOneWidget);
    });

    testWidgets('Toggles favorite state on poster card', (tester) async {
      await tester.pumpWidget(
        buildTestableMyDesignsScreen(localeController: englishController),
      );
      await tester.pumpAndSettle();

      // Find first favorite button
      final favBtn = find.byKey(const ValueKey('favorite_btn_design_navratri_wishes'));
      expect(favBtn, findsOneWidget);

      await tester.tap(favBtn);
      await tester.pumpAndSettle();

      // Tapping again toggles back
      await tester.tap(favBtn);
      await tester.pumpAndSettle();
    });

    testWidgets('Switches view mode between Grid and List', (tester) async {
      await tester.pumpWidget(
        buildTestableMyDesignsScreen(localeController: englishController),
      );
      await tester.pumpAndSettle();

      // Tap List view button
      await tester.tap(find.byKey(const ValueKey('toggle_list_view')));
      await tester.pumpAndSettle();

      // Verify list cards exist
      expect(find.byKey(const ValueKey('design_card_list_design_navratri_wishes')), findsOneWidget);

      // Tap Grid view button
      await tester.tap(find.byKey(const ValueKey('toggle_grid_view')));
      await tester.pumpAndSettle();

      // Verify grid cards exist
      expect(find.byKey(const ValueKey('design_card_grid_design_navratri_wishes')), findsOneWidget);
    });
  });

  group('Screen 14: Actions & Context Menu', () {
    testWidgets('Opens 3-dots popup menu and duplicates design', (tester) async {
      tester.view.physicalSize = const Size(390, 1400);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        buildTestableMyDesignsScreen(localeController: englishController),
      );
      await tester.pumpAndSettle();

      final menuBtn = find.byKey(const ValueKey('menu_btn_design_navratri_wishes'));
      expect(menuBtn, findsOneWidget);

      await tester.tap(menuBtn);
      await tester.pumpAndSettle();

      expect(find.text('Edit Design'), findsOneWidget);
      expect(find.text('Preview'), findsOneWidget);
      expect(find.text('Duplicate'), findsOneWidget);
      expect(find.text('Download'), findsOneWidget);
      expect(find.text('Share'), findsOneWidget);
      expect(find.text('Delete'), findsOneWidget);

      // Tap Duplicate
      await tester.tap(find.text('Duplicate'));
      await tester.pumpAndSettle();

      // Verify copy exists
      expect(find.text('Navratri Wishes (Copy)'), findsOneWidget);
    });

    testWidgets('Shows delete confirmation dialog and cancels', (tester) async {
      tester.view.physicalSize = const Size(390, 1400);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(
        buildTestableMyDesignsScreen(localeController: englishController),
      );
      await tester.pumpAndSettle();

      final menuBtn = find.byKey(const ValueKey('menu_btn_design_navratri_wishes'));
      await tester.tap(menuBtn);
      await tester.pumpAndSettle();

      await tester.tap(find.text('Delete'));
      await tester.pumpAndSettle();

      expect(find.byKey(const ValueKey('delete_dialog_title')), findsOneWidget);
      expect(find.byKey(const ValueKey('delete_dialog_cancel')), findsOneWidget);
      expect(find.byKey(const ValueKey('delete_dialog_confirm')), findsOneWidget);

      // Cancel delete
      await tester.tap(find.byKey(const ValueKey('delete_dialog_cancel')));
      await tester.pumpAndSettle();

      // Design is still present
      expect(find.text('Navratri Wishes'), findsOneWidget);
    });

    testWidgets('Renders empty state when designs list is empty', (tester) async {
      await tester.pumpWidget(
        buildTestableMyDesignsScreen(
          localeController: englishController,
          initialDesigns: const [],
        ),
      );
      await tester.pumpAndSettle();

      expect(find.text('No Designs Yet'), findsOneWidget);
      expect(find.text('Your creations will appear here.'), findsOneWidget);
      expect(find.byKey(const ValueKey('empty_create_first_poster_btn')), findsOneWidget);
    });
  });

  group('Screen 14: Responsive Multi-Device Tests', () {
    final deviceViewports = [
      const Size(360, 640), // Compact Android
      const Size(390, 844), // iPhone 12/13/14
      const Size(412, 915), // Pixel 7
      const Size(768, 1024), // Tablet / iPad
    ];

    for (final size in deviceViewports) {
      testWidgets('Renders cleanly on ${size.width}x${size.height} without overflow', (tester) async {
        await tester.pumpWidget(
          buildTestableMyDesignsScreen(
            size: size,
            localeController: englishController,
          ),
        );
        await tester.pumpAndSettle();

        expect(find.byKey(const ValueKey('my_designs_page_title')), findsOneWidget);
        expect(tester.takeException(), isNull);
      });
    }
  });
}
