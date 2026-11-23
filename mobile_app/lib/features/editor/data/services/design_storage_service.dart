import 'package:panchayat_post/core/constants/app_assets.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:panchayat_post/features/editor/domain/models/poster_template_project.dart';

/// Service managing persistent storage of user customized poster designs.
class DesignStorageService {
  DesignStorageService({SharedPreferences? preferences}) : _prefs = preferences;

  static const String _keyDesigns = 'user_saved_poster_designs_v1';
  SharedPreferences? _prefs;

  Future<SharedPreferences> _getPrefs() async {
    return _prefs ??= await SharedPreferences.getInstance();
  }

  /// Saves or updates a design project.
  Future<bool> saveDesign(PosterTemplateProject project, {String? userId}) async {
    final prefs = await _getPrefs();
    final effectiveUserId = userId ?? project.userId;
    final updatedProject = project.copyWith(
      userId: effectiveUserId,
      updatedAt: DateTime.now(),
    );

    final allDesigns = await getSavedDesigns();
    final index = allDesigns.indexWhere((d) => d.id == updatedProject.id);

    if (index >= 0) {
      allDesigns[index] = updatedProject;
    } else {
      allDesigns.insert(0, updatedProject);
    }

    final rawList = allDesigns.map((d) => d.toJson()).toList();
    return prefs.setStringList(_keyDesigns, rawList);
  }

  /// Retrieves all saved designs, optionally filtered by user ID.
  Future<List<PosterTemplateProject>> getSavedDesigns({String? userId}) async {
    final prefs = await _getPrefs();
    final rawList = prefs.getStringList(_keyDesigns) ?? [];

    final list = rawList
        .map((jsonStr) {
          try {
            return PosterTemplateProject.fromJson(jsonStr);
          } catch (_) {
            return null;
          }
        })
        .whereType<PosterTemplateProject>()
        .toList();

    if (userId != null && userId.isNotEmpty) {
      return list.where((d) => d.userId == userId).toList();
    }
    return list;
  }

  /// Gets a single design project by its unique ID.
  Future<PosterTemplateProject?> getDesignById(String id) async {
    final designs = await getSavedDesigns();
    try {
      return designs.firstWhere((d) => d.id == id);
    } catch (_) {
      return null;
    }
  }

  /// Deletes a saved design.
  Future<bool> deleteDesign(String id) async {
    final prefs = await _getPrefs();
    final allDesigns = await getSavedDesigns();
    allDesigns.removeWhere((d) => d.id == id);
    final rawList = allDesigns.map((d) => d.toJson()).toList();
    return prefs.setStringList(_keyDesigns, rawList);
  }

  /// Creates and stores an independent duplicate copy of a design project.
  Future<PosterTemplateProject> duplicateDesign(
    PosterTemplateProject project, {
    String? userId,
  }) async {
    final copy = project.duplicate();
    await saveDesign(copy, userId: userId);
    return copy;
  }

  /// Toggles favorite status for a given design ID.
  Future<PosterTemplateProject?> toggleFavorite(String id) async {
    final allDesigns = await getSavedDesigns();
    final index = allDesigns.indexWhere((d) => d.id == id);
    if (index >= 0) {
      final updated = allDesigns[index].copyWith(
        isFavorite: !allDesigns[index].isFavorite,
        updatedAt: DateTime.now(),
      );
      allDesigns[index] = updated;
      final prefs = await _getPrefs();
      final rawList = allDesigns.map((d) => d.toJson()).toList();
      await prefs.setStringList(_keyDesigns, rawList);
      return updated;
    }
    return null;
  }

  /// Clears designs (for testing empty states or resetting).
  Future<bool> clearDesigns({String? userId}) async {
    final prefs = await _getPrefs();
    if (userId == null) {
      return prefs.remove(_keyDesigns);
    }
    final all = await getSavedDesigns();
    all.removeWhere((d) => d.userId == userId);
    final rawList = all.map((d) => d.toJson()).toList();
    return prefs.setStringList(_keyDesigns, rawList);
  }

  /// Populates standard initial designs matching reference image if the user's collection is empty.
  Future<List<PosterTemplateProject>> seedSampleDesignsIfEmpty(String userId) async {
    final existing = await getSavedDesigns(userId: userId);
    if (existing.isNotEmpty) {
      return existing;
    }

    final samples = [
      PosterTemplateProject(
        id: 'design_navratri_wishes',
        templateId: 'navratri_wishes',
        title: 'Navratri Wishes',
        backgroundAsset: AppAssets.myDesignNavratriWishes,
        previewAsset: AppAssets.myDesignNavratriWishes,
        category: 'Festivals',
        createdAt: DateTime(2025, 10, 23),
        updatedAt: DateTime(2025, 10, 23),
        userId: userId,
        isFavorite: true,
      ),
      PosterTemplateProject(
        id: 'design_village_dev',
        templateId: 'village_development',
        title: 'Village Development',
        backgroundAsset: AppAssets.myDesignVillageDev,
        previewAsset: AppAssets.myDesignVillageDev,
        category: 'Panchayat',
        createdAt: DateTime(2025, 10, 20),
        updatedAt: DateTime(2025, 10, 20),
        userId: userId,
        isFavorite: false,
      ),
      PosterTemplateProject(
        id: 'design_happy_diwali',
        templateId: 'happy_diwali',
        title: 'Happy Diwali',
        backgroundAsset: AppAssets.myDesignHappyDiwali,
        previewAsset: AppAssets.myDesignHappyDiwali,
        category: 'Festivals',
        createdAt: DateTime(2025, 10, 10),
        updatedAt: DateTime(2025, 10, 10),
        userId: userId,
        isFavorite: true,
      ),
      PosterTemplateProject(
        id: 'design_gram_sabha',
        templateId: 'gram_sabha_notice',
        title: 'Gram Sabha Notice',
        backgroundAsset: AppAssets.myDesignGramSabha,
        previewAsset: AppAssets.myDesignGramSabha,
        category: 'Panchayat',
        createdAt: DateTime(2025, 10, 5),
        updatedAt: DateTime(2025, 10, 5),
        userId: userId,
        isFavorite: false,
      ),
    ];

    for (final sample in samples) {
      await saveDesign(sample, userId: userId);
    }

    return getSavedDesigns(userId: userId);
  }
}
