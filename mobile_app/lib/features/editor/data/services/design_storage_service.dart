import 'package:flutter/material.dart';
import 'package:panchayat_post/core/constants/app_assets.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:panchayat_post/features/editor/domain/models/poster_element.dart';
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
        title: 'Navratri Wishes Poster',
        backgroundAsset: AppAssets.homeFestivalNavratriCard,
        previewAsset: AppAssets.homeFestivalNavratriCard,
        category: 'Festivals',
        createdAt: DateTime(2025, 10, 10),
        updatedAt: DateTime(2025, 10, 10),
        userId: userId,
        isFavorite: true,
        elements: const [
          PosterElement(
            id: 'elem_headline',
            type: PosterElementType.text,
            text: 'Happy Navratri',
            x: 0.5,
            y: 0.22,
            fontSize: 32.0,
            color: Color(0xFF831843),
            fontFamily: 'serif',
            textAlign: TextAlign.center,
            isBold: true,
            isSelected: true,
          ),
          PosterElement(
            id: 'elem_supporting',
            type: PosterElementType.text,
            text: 'May Maa Amba remove all negativity and fill our lives with happiness.',
            x: 0.5,
            y: 0.38,
            fontSize: 13.5,
            color: Color(0xFF1E293B),
            fontFamily: 'Poppins',
            textAlign: TextAlign.center,
            isBold: false,
          ),
        ],
      ),
      PosterTemplateProject(
        id: 'design_independence_day',
        templateId: 'independence_day',
        title: 'Independence Day Poster',
        backgroundAsset: AppAssets.homeFestivalIndependenceCard,
        previewAsset: AppAssets.homeFestivalIndependenceCard,
        category: 'Panchayat',
        createdAt: DateTime(2025, 8, 15),
        updatedAt: DateTime(2025, 8, 15),
        userId: userId,
        isFavorite: false,
        elements: const [
          PosterElement(
            id: 'elem_headline',
            type: PosterElementType.text,
            text: '15th August Happy Independence Day',
            x: 0.5,
            y: 0.20,
            fontSize: 26.0,
            color: Color(0xFF1E293B),
            fontFamily: 'Poppins',
            textAlign: TextAlign.center,
            isBold: true,
            isSelected: true,
          ),
        ],
      ),
      PosterTemplateProject(
        id: 'design_diwali_wishes',
        templateId: 'happy_diwali',
        title: 'Diwali Wishes Poster',
        backgroundAsset: AppAssets.homeFestivalDiwaliCard,
        previewAsset: AppAssets.homeFestivalDiwaliCard,
        category: 'Festivals',
        createdAt: DateTime(2025, 10, 20),
        updatedAt: DateTime(2025, 10, 20),
        userId: userId,
        isFavorite: true,
        elements: const [
          PosterElement(
            id: 'elem_headline',
            type: PosterElementType.text,
            text: 'Happy Diwali',
            x: 0.5,
            y: 0.28,
            fontSize: 34.0,
            color: Color(0xFFFDE68A),
            fontFamily: 'serif',
            textAlign: TextAlign.center,
            isBold: true,
            isSelected: true,
          ),
          PosterElement(
            id: 'elem_supporting',
            type: PosterElementType.text,
            text: 'May the festival of lights bring joy, peace and prosperity to all.',
            x: 0.5,
            y: 0.44,
            fontSize: 13.0,
            color: Colors.white,
            fontFamily: 'Poppins',
            textAlign: TextAlign.center,
            isBold: false,
          ),
        ],
      ),
      PosterTemplateProject(
        id: 'design_ganesh_chaturthi',
        templateId: 'ganesh_chaturthi',
        title: 'Ganesh Chaturthi Poster',
        backgroundAsset: AppAssets.homeFestivalGaneshCard,
        previewAsset: AppAssets.homeFestivalGaneshCard,
        category: 'Festivals',
        createdAt: DateTime(2025, 8, 27),
        updatedAt: DateTime(2025, 8, 27),
        userId: userId,
        isFavorite: false,
        elements: const [
          PosterElement(
            id: 'elem_headline',
            type: PosterElementType.text,
            text: 'ગણેશ ચતુર્થી',
            x: 0.5,
            y: 0.25,
            fontSize: 28.0,
            color: Color(0xFF831843),
            fontFamily: 'serif',
            textAlign: TextAlign.center,
            isBold: true,
            isSelected: true,
          ),
          PosterElement(
            id: 'elem_supporting',
            type: PosterElementType.text,
            text: 'ની હાર્દિક શુભેચ્છાઓ...',
            x: 0.5,
            y: 0.38,
            fontSize: 14.0,
            color: Color(0xFF1E293B),
            fontFamily: 'Poppins',
            textAlign: TextAlign.center,
            isBold: false,
          ),
        ],
      ),
    ];

    for (final sample in samples) {
      await saveDesign(sample, userId: userId);
    }

    return getSavedDesigns(userId: userId);
  }
}
