import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/features/editor/data/services/poster_export_service.dart';
import 'package:panchayat_post/features/festivals/domain/models/festival_item.dart';
import 'package:panchayat_post/features/festivals/presentation/screens/festival_detail_screen.dart';

class _FakePosterExportService extends PosterExportService {
  Uint8List? capturedBytes;
  String? savedFilename;
  Object? saveError;

  @override
  Future<Uint8List?> captureBoundaryToBytes(
    GlobalKey repaintBoundaryKey, {
    double pixelRatio = 2.0,
  }) async {
    return Uint8List.fromList([1, 2, 3]);
  }

  @override
  Future<void> savePosterToGallery({
    required Uint8List bytes,
    required String filename,
  }) async {
    if (saveError != null) throw saveError!;
    capturedBytes = bytes;
    savedFilename = filename;
  }
}

const _festivalWithPosters = FestivalItem(
  id: 'fest_navratri_test',
  name: 'Navratri',
  nameGu: 'નવરાત્રી',
  nameHi: 'नवरात्रि',
  dateDisplay: '22 Oct – 30 Oct',
  category: 'hindu',
  categoryName: 'Hindu Festivals',
  imageAsset: '',
  isUpcoming: true,
  isAnnouncement: true,
  celebrationType: 'Traditional',
  aboutText: 'Celebrate Navratri.',
  heroBannerAsset: '',
  posterTemplates: [
    FestivalPosterTemplate(
      id: 'navratri_happy',
      title: 'Happy Navratri',
      imageAsset: '',
      style: 'traditional',
    ),
  ],
);

Widget _buildTestApp(PosterExportService exportService) {
  return LocaleScope(
    controller: LocaleController(initialLanguage: 'en'),
    child: MaterialApp(
      home: FestivalDetailScreen(
        festival: _festivalWithPosters,
        posterExportService: exportService,
      ),
    ),
  );
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('saves the rendered poster before showing success', (
    tester,
  ) async {
    tester.view.physicalSize = const Size(390, 844);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.resetPhysicalSize);
    final exportService = _FakePosterExportService();

    await tester.pumpWidget(_buildTestApp(exportService));
    await tester.pumpAndSettle();
    final posterCard = find.byKey(const ValueKey('poster_card_navratri_happy'));
    await tester.ensureVisible(posterCard);
    await tester.tap(posterCard);
    await tester.pumpAndSettle();

    await tester.tap(find.byKey(const ValueKey('sheet_download_poster_btn')));
    await tester.pumpAndSettle();

    expect(exportService.capturedBytes, equals([1, 2, 3]));
    expect(exportService.savedFilename, contains('happy_navratri'));
    expect(find.byType(BottomSheet), findsNothing);
    expect(
      find.text('Happy Navratri poster saved to your gallery.'),
      findsOneWidget,
    );
  });

  testWidgets('keeps the preview open and reports a gallery save error', (
    tester,
  ) async {
    tester.view.physicalSize = const Size(390, 844);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.resetPhysicalSize);
    final exportService = _FakePosterExportService()
      ..saveError = StateError('permission denied');

    await tester.pumpWidget(_buildTestApp(exportService));
    await tester.pumpAndSettle();
    final posterCard = find.byKey(const ValueKey('poster_card_navratri_happy'));
    await tester.ensureVisible(posterCard);
    await tester.tap(posterCard);
    await tester.pumpAndSettle();

    await tester.tap(find.byKey(const ValueKey('sheet_download_poster_btn')));
    await tester.pumpAndSettle();

    expect(find.byType(BottomSheet), findsOneWidget);
    expect(find.textContaining('Could not save the poster'), findsOneWidget);
    expect(find.textContaining('saved to your gallery'), findsNothing);
  });
}
