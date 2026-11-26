import 'package:flutter/material.dart';
import 'package:panchayat_post/core/services/app_config_service.dart';
import 'package:panchayat_post/features/festivals/domain/models/festival_item.dart';

class FestivalCategory {
  const FestivalCategory({
    required this.id,
    required this.name,
    this.icon,
    this.emoji,
  });

  final String id;
  final String name;
  final IconData? icon;
  final String? emoji;
}

/// Service providing live festival listings imported from the Admin Panel,
/// plus category chips and search/filtering logic. No demo data is hardcoded.
class FestivalService {
  FestivalService();

  static const List<FestivalPosterTemplate> navratriTemplates = [];

  List<FestivalItem> _cachedAdminFestivals = const [];

  /// Fetches live festivals and their poster images from the Admin Panel (/adminapi/festival).
  Future<List<FestivalItem>> fetchAdminFestivals() async {
    final rawList = await AppConfigService.instance.fetchAdminFestivals();
    final items = <FestivalItem>[];

    for (final raw in rawList) {
      final base = raw['_resolvedBase']?.toString();
      final id = raw['_id']?.toString() ?? raw['id']?.toString() ?? '';
      final name = raw['festivalName']?.toString().trim() ??
          raw['name']?.toString().trim() ??
          '';
      if (name.isEmpty) continue;

      final rawMainImg = raw['festivalImage']?.toString() ?? '';
      final mainImg = AppConfigService.instance.resolveMediaUrl(
        rawMainImg,
        baseUrlOverride: base,
      );

      final rawGallery = (raw['festivalImages'] as List<dynamic>? ?? const [])
          .map((e) => AppConfigService.instance.resolveMediaUrl(
                e?.toString(),
                baseUrlOverride: base,
              ))
          .where((url) => url.isNotEmpty)
          .toList();

      final recommendedFrameId = raw['recommendedFrameId']?.toString();
      final showInHero = raw['showInHero'] == true || raw['showInHero'] == 'true';
      final isAnnouncement = (raw['categoryType']?.toString() == 'announcement') ||
          (raw['isAnnouncement'] == true) ||
          (name.contains('પરિપત્ર') || name.contains('જાહેરાત'));

      final posterTemplates = <FestivalPosterTemplate>[
        if (mainImg.isNotEmpty)
          FestivalPosterTemplate(
            id: '${id}_cover',
            title: name,
            imageAsset: mainImg,
            style: 'traditional',
            recommendedFrameId: recommendedFrameId,
          ),
        for (int i = 0; i < rawGallery.length; i++)
          FestivalPosterTemplate(
            id: '${id}_img_$i',
            title: name,
            imageAsset: rawGallery[i],
            style: 'traditional',
            recommendedFrameId: recommendedFrameId,
          ),
      ];

      final rawDate = raw['festivalDate']?.toString() ?? '';
      final dateDisplay = rawDate.isNotEmpty
          ? rawDate.split('T').first
          : (raw['dateDisplay']?.toString() ?? '');

      items.add(
        FestivalItem(
          id: id.isNotEmpty ? id : name.toLowerCase().replaceAll(' ', '_'),
          name: name,
          nameGu: name,
          nameHi: name,
          dateDisplay: dateDisplay,
          category: (raw['category']?.toString() ?? 'cultural').toLowerCase(),
          categoryName: raw['categoryName']?.toString() ?? 'Festival',
          imageAsset: mainImg.isNotEmpty
              ? mainImg
              : (rawGallery.isNotEmpty ? rawGallery.first : ''),
          isUpcoming: true,
          isFeatured: items.isEmpty,
          heroBannerAsset: mainImg.isNotEmpty
              ? mainImg
              : (rawGallery.isNotEmpty ? rawGallery.first : ''),
          posterTemplates: posterTemplates,
          templateCount: posterTemplates.length,
          recommendedFrameId: recommendedFrameId,
          showInHero: showInHero,
          isAnnouncement: isAnnouncement,
        ),
      );
    }

    _cachedAdminFestivals = items;
    return items;
  }

  /// Default category chips
  List<FestivalCategory> getCategories() {
    return const [
      FestivalCategory(id: 'all', name: 'All'),
      FestivalCategory(
        id: 'hindu',
        name: 'Hindu Festivals',
        icon: Icons.temple_hindu_rounded,
      ),
      FestivalCategory(
        id: 'national',
        name: 'National Days',
        emoji: '🇮🇳',
      ),
      FestivalCategory(
        id: 'religious',
        name: 'Religious Events',
        icon: Icons.volunteer_activism_rounded,
      ),
      FestivalCategory(
        id: 'cultural',
        name: 'Cultural Events',
        icon: Icons.theater_comedy_rounded,
      ),
    ];
  }

  /// Design style filters (UI metadata only, no demo image assets)
  List<FestivalDesignStyle> getDesignStyles() {
    return const [
      FestivalDesignStyle(id: 'traditional', name: 'Traditional', imageAsset: ''),
      FestivalDesignStyle(id: 'modern', name: 'Modern', imageAsset: ''),
      FestivalDesignStyle(id: 'devotional', name: 'Devotional', imageAsset: ''),
      FestivalDesignStyle(id: 'event', name: 'Event Announcement', imageAsset: ''),
    ];
  }

  /// Returns the first admin-uploaded festival if available, or an empty placeholder.
  FestivalItem getFeaturedFestival() {
    if (_cachedAdminFestivals.isNotEmpty) {
      return _cachedAdminFestivals.first;
    }
    return const FestivalItem(
      id: 'empty_featured',
      name: 'Festivals',
      nameGu: 'તહેવારો',
      nameHi: 'त्यौहार',
      dateDisplay: '',
      category: 'all',
      categoryName: 'Festival',
      imageAsset: '',
      isUpcoming: true,
      isFeatured: true,
      posterTemplates: [],
      templateCount: 0,
    );
  }

  /// Returns only live admin-imported upcoming festivals.
  List<FestivalItem> getUpcomingFestivals() => _cachedAdminFestivals;

  /// Returns only live admin-imported festivals.
  List<FestivalItem> getExploreAllFestivals() => _cachedAdminFestivals;

  /// Filter and search across admin-imported festivals.
  List<FestivalItem> searchFestivals({
    String query = '',
    String? categoryFilter,
    bool? upcomingOnly,
  }) {
    return _cachedAdminFestivals.where((f) {
      return f.matches(
        query: query,
        categoryFilter: categoryFilter,
        upcomingOnly: upcomingOnly,
      );
    }).toList();
  }
}
