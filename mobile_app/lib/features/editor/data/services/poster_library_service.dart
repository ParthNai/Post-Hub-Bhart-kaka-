import 'package:flutter/material.dart';
import 'package:panchayat_post/core/constants/app_assets.dart';
import 'package:panchayat_post/features/editor/data/services/design_storage_service.dart';
import 'package:panchayat_post/features/editor/data/services/download_history_service.dart';
import 'package:panchayat_post/features/editor/domain/models/poster_element.dart';
import 'package:panchayat_post/features/editor/domain/models/poster_template_project.dart';

/// Service managing poster library data, status filtering, counts, and mutations.
class PosterLibraryService {
  PosterLibraryService({
    DesignStorageService? storageService,
    DownloadHistoryService? historyService,
  })  : _storageService = storageService ?? DesignStorageService(),
        _historyService = historyService ?? DownloadHistoryService();

  final DesignStorageService _storageService;
  final DownloadHistoryService _historyService;

  DownloadHistoryService get historyService => _historyService;

  /// Saves or updates a poster project in the storage.
  Future<bool> savePoster(PosterTemplateProject project, {String? userId}) async {
    return _storageService.saveDesign(project, userId: userId);
  }

  /// Retrieves all posters with comprehensive search, category, status, date, and sorting.
  Future<List<PosterTemplateProject>> getPosters({
    String? userId,
    String tab = 'All Posters', // 'All Posters', 'Drafts', 'Exported'
    String searchQuery = '',
    String categoryFilter = 'All',
    String dateFilter = 'All Dates',
    String sortBy = 'Recently Updated',
  }) async {
    final effectiveUserId = userId ?? 'default_user';
    var posters = await _storageService.getSavedDesigns(userId: effectiveUserId);

    if (posters.isEmpty) {
      posters = await seedDefaultPostersIfEmpty(effectiveUserId);
    }

    // Tab Filter
    if (tab == 'Drafts') {
      posters = posters.where((p) => p.isDraft).toList();
    } else if (tab == 'Exported') {
      posters = posters.where((p) => p.isExported).toList();
    }

    // Category Filter
    if (categoryFilter != 'All' && categoryFilter.isNotEmpty) {
      posters = posters.where((p) {
        return p.category.toLowerCase() == categoryFilter.toLowerCase();
      }).toList();
    }

    // Date Filter
    final now = DateTime.now();
    if (dateFilter == 'Last 7 Days') {
      final sevenDaysAgo = now.subtract(const Duration(days: 7));
      posters = posters.where((p) => p.updatedAt.isAfter(sevenDaysAgo)).toList();
    } else if (dateFilter == 'Last 30 Days') {
      final thirtyDaysAgo = now.subtract(const Duration(days: 30));
      posters = posters.where((p) => p.updatedAt.isAfter(thirtyDaysAgo)).toList();
    } else if (dateFilter == 'This Year') {
      posters = posters.where((p) => p.updatedAt.year == now.year).toList();
    }

    // Search Query
    if (searchQuery.trim().isNotEmpty) {
      final q = searchQuery.trim().toLowerCase();
      posters = posters.where((p) {
        final titleMatch = p.title.toLowerCase().contains(q);
        final categoryMatch = p.category.toLowerCase().contains(q);
        final templateMatch = p.templateId.toLowerCase().contains(q);
        return titleMatch || categoryMatch || templateMatch;
      }).toList();
    }

    // Sorting
    if (sortBy == 'Oldest First') {
      posters.sort((a, b) => a.updatedAt.compareTo(b.updatedAt));
    } else if (sortBy == 'Name' || sortBy == 'Name A-Z') {
      posters.sort((a, b) => a.title.toLowerCase().compareTo(b.title.toLowerCase()));
    } else {
      // Default: Recently Updated
      posters.sort((a, b) => b.updatedAt.compareTo(a.updatedAt));
    }

    return posters;
  }

  /// Calculates dynamic library summary counts without double counting.
  Future<Map<String, int>> getCounts({String? userId}) async {
    final effectiveUserId = userId ?? 'default_user';
    var posters = await _storageService.getSavedDesigns(userId: effectiveUserId);
    if (posters.isEmpty) {
      posters = await seedDefaultPostersIfEmpty(effectiveUserId);
    }

    int drafts = 0;
    int completed = 0;
    int exported = 0;

    for (final p in posters) {
      if (p.isDraft) {
        drafts++;
      } else if (p.isCompleted) {
        completed++;
      } else if (p.isExported) {
        exported++;
        // Exported also counts towards finished/completed designs in the UI metric
        completed++;
      }
    }

    return {
      'total': posters.length,
      'drafts': drafts,
      'completed': completed,
      'exported': exported,
    };
  }

  /// Duplicates a poster with unique ID and "Copy of [Title]" naming.
  Future<PosterTemplateProject> duplicatePoster(
    String id, {
    String? userId,
  }) async {
    final original = await _storageService.getDesignById(id);
    if (original == null) {
      throw Exception('Original poster $id not found for duplication.');
    }

    final copy = original.duplicate(newTitle: 'Copy of ${original.title}');
    await _storageService.saveDesign(copy, userId: userId);
    return copy;
  }

  /// Renames an existing poster.
  Future<PosterTemplateProject> renamePoster(
    String id,
    String newTitle, {
    String? userId,
  }) async {
    final original = await _storageService.getDesignById(id);
    if (original == null) {
      throw Exception('Poster $id not found.');
    }

    final updated = original.copyWith(
      title: newTitle.trim(),
      updatedAt: DateTime.now(),
    );
    await _storageService.saveDesign(updated, userId: userId);
    return updated;
  }

  /// Deletes a poster safely.
  Future<bool> deletePoster(String id) async {
    return _storageService.deleteDesign(id);
  }

  /// Seeds default posters matching Screen 22 reference if none exist.
  Future<List<PosterTemplateProject>> seedDefaultPostersIfEmpty(String userId) async {
    final existing = await _storageService.getSavedDesigns(userId: userId);
    if (existing.isNotEmpty) {
      return existing;
    }

    final baseline = [
      PosterTemplateProject(
        id: 'poster_navratri_wishes',
        templateId: 'navratri_wishes',
        title: 'Navratri Wishes Poster',
        backgroundAsset: AppAssets.myDesignNavratriWishes,
        previewAsset: AppAssets.myDesignNavratriWishes,
        category: 'Festivals',
        status: 'completed',
        fileSizeBytes: (2.4 * 1024 * 1024).toInt(),
        createdAt: DateTime(2025, 10, 10, 16, 25),
        updatedAt: DateTime(2025, 10, 10, 16, 25),
        userId: userId,
        elements: const [
          PosterElement(
            id: 'elem_navratri_title',
            type: PosterElementType.text,
            text: 'Happy Navratri',
            x: 0.5,
            y: 0.25,
            fontSize: 32.0,
            color: Color(0xFF7654C8),
            fontFamily: 'Poppins',
            textAlign: TextAlign.center,
            isBold: true,
          ),
          PosterElement(
            id: 'elem_navratri_body',
            type: PosterElementType.text,
            text: 'May Maa Amba remove all negativity and fill our lives with happiness.',
            x: 0.5,
            y: 0.45,
            fontSize: 14.0,
            color: Color(0xFF333333),
            fontFamily: 'Poppins',
            textAlign: TextAlign.center,
            isBold: false,
          ),
        ],
      ),
      PosterTemplateProject(
        id: 'poster_independence_day',
        templateId: 'republic_day',
        title: 'Independence Day Poster',
        backgroundAsset: AppAssets.editorCanvasRepublicDay,
        previewAsset: AppAssets.editorCanvasRepublicDay,
        category: 'National',
        status: 'exported',
        fileSizeBytes: (1.8 * 1024 * 1024).toInt(),
        createdAt: DateTime(2025, 8, 15, 9, 20),
        updatedAt: DateTime(2025, 8, 15, 9, 20),
        lastExportedAt: DateTime(2025, 8, 15, 9, 20),
        userId: userId,
        elements: const [
          PosterElement(
            id: 'elem_indep_title',
            type: PosterElementType.text,
            text: '15th August\nHappy Independence Day',
            x: 0.5,
            y: 0.35,
            fontSize: 28.0,
            color: Color(0xFF0F172A),
            fontFamily: 'Poppins',
            textAlign: TextAlign.center,
            isBold: true,
          ),
        ],
      ),
      PosterTemplateProject(
        id: 'poster_happy_diwali',
        templateId: 'happy_diwali',
        title: 'Diwali Wishes Poster',
        backgroundAsset: AppAssets.myDesignHappyDiwali,
        previewAsset: AppAssets.myDesignHappyDiwali,
        category: 'Festivals',
        status: 'draft',
        fileSizeBytes: (1.8 * 1024 * 1024).toInt(),
        createdAt: DateTime(2025, 10, 8, 16, 15),
        updatedAt: DateTime(2025, 10, 8, 16, 15),
        userId: userId,
        elements: const [
          PosterElement(
            id: 'elem_diwali_title',
            type: PosterElementType.text,
            text: 'Happy Diwali',
            x: 0.5,
            y: 0.30,
            fontSize: 34.0,
            color: Color(0xFFFDE68A),
            fontFamily: 'Poppins',
            textAlign: TextAlign.center,
            isBold: true,
          ),
        ],
      ),
      PosterTemplateProject(
        id: 'poster_gram_sabha',
        templateId: 'gram_sabha_notice',
        title: 'Gram Sabha Notice',
        backgroundAsset: AppAssets.myDesignGramSabha,
        previewAsset: AppAssets.myDesignGramSabha,
        category: 'Panchayat',
        status: 'draft',
        fileSizeBytes: 980 * 1024,
        createdAt: DateTime(2025, 10, 5, 10, 0),
        updatedAt: DateTime(2025, 10, 5, 10, 0),
        userId: userId,
        elements: const [
          PosterElement(
            id: 'elem_gram_title',
            type: PosterElementType.text,
            text: 'ગ્રામસભા ની જાહેરાત',
            x: 0.5,
            y: 0.20,
            fontSize: 28.0,
            color: Color(0xFFDC2626),
            fontFamily: 'Anek Gujarati',
            textAlign: TextAlign.center,
            isBold: true,
          ),
        ],
      ),
    ];

    for (final p in baseline) {
      await _storageService.saveDesign(p, userId: userId);
    }

    return _storageService.getSavedDesigns(userId: userId);
  }
}
