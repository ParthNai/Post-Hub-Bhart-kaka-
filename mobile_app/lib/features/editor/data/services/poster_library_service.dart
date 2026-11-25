import 'package:panchayat_post/features/editor/data/services/design_storage_service.dart';
import 'package:panchayat_post/features/editor/data/services/download_history_service.dart';
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
    String tab = 'All Posters',
    String searchQuery = '',
    String categoryFilter = 'All',
    String dateFilter = 'All Dates',
    String sortBy = 'Recently Updated',
  }) async {
    final effectiveUserId = userId ?? 'default_user';
    var posters = await _storageService.getSavedDesigns(userId: effectiveUserId);

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
      posters.sort((a, b) => b.updatedAt.compareTo(a.updatedAt));
    }

    return posters;
  }

  /// Calculates dynamic library summary counts without double counting.
  Future<Map<String, int>> getCounts({String? userId}) async {
    final effectiveUserId = userId ?? 'default_user';
    final posters = await _storageService.getSavedDesigns(userId: effectiveUserId);

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

  /// Returns saved posters without seeding any demo data.
  Future<List<PosterTemplateProject>> seedDefaultPostersIfEmpty(String userId) async {
    return _storageService.getSavedDesigns(userId: userId);
  }
}
