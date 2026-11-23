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
}
