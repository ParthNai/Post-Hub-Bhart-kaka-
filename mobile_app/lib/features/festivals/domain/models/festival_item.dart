/// Poster template item belonging to a festival.
class FestivalPosterTemplate {
  const FestivalPosterTemplate({
    required this.id,
    required this.title,
    required this.imageAsset,
    this.style = 'traditional',
    this.tag,
    this.recommendedFrameId,
  });

  final String id;
  final String title;
  final String imageAsset;
  final String style;
  final String? tag;
  final String? recommendedFrameId;
}

/// Popular design style model for festival posters.
class FestivalDesignStyle {
  const FestivalDesignStyle({
    required this.id,
    required this.name,
    required this.imageAsset,
  });

  final String id;
  final String name;
  final String imageAsset;
}

/// Festival and event data model for Panchayat Post Screens 10 and 11.
class FestivalItem {
  const FestivalItem({
    required this.id,
    required this.name,
    required this.nameGu,
    required this.nameHi,
    required this.dateDisplay,
    required this.category,
    required this.categoryName,
    required this.imageAsset,
    this.isUpcoming = false,
    this.isFeatured = false,
    this.description,
    this.keywords = const [],
    this.templateCount = 12,
    this.celebrationType = 'Traditional',
    this.aboutText,
    this.heroBannerAsset,
    this.posterTemplates = const [],
    this.recommendedFrameId,
    this.showInHero = false,
    this.isAnnouncement = false,
    this.isEditable = false,
    this.showAtBottom = true,
  });

  final String id;
  final String name;
  final String nameGu;
  final String nameHi;
  final String dateDisplay;
  final String category;
  final String categoryName;
  final String imageAsset;
  final bool isUpcoming;
  final bool isFeatured;
  final String? description;
  final List<String> keywords;
  final int templateCount;
  final String celebrationType;
  final String? aboutText;
  final String? heroBannerAsset;
  final List<FestivalPosterTemplate> posterTemplates;
  final String? recommendedFrameId;
  final bool showInHero;
  final bool isAnnouncement;
  final bool isEditable;
  final bool showAtBottom;

  /// Check if this festival matches the search query and filters.
  bool matches({
    String query = '',
    String? categoryFilter,
    bool? upcomingOnly,
  }) {
    // 1. Category filter
    if (categoryFilter != null &&
        categoryFilter.isNotEmpty &&
        categoryFilter.toLowerCase() != 'all') {
      if (category.toLowerCase() != categoryFilter.toLowerCase()) {
        return false;
      }
    }

    // 2. Upcoming filter
    if (upcomingOnly == true && !isUpcoming) {
      return false;
    }

    // 3. Search query
    final trimmedQuery = query.trim().toLowerCase();
    if (trimmedQuery.isEmpty) {
      return true;
    }

    final inName = name.toLowerCase().contains(trimmedQuery);
    final inNameGu = nameGu.toLowerCase().contains(trimmedQuery);
    final inNameHi = nameHi.toLowerCase().contains(trimmedQuery);
    final inCategory = categoryName.toLowerCase().contains(trimmedQuery);
    final inKeywords = keywords.any((k) => k.toLowerCase().contains(trimmedQuery));
    final inDate = dateDisplay.toLowerCase().contains(trimmedQuery);

    return inName || inNameGu || inNameHi || inCategory || inKeywords || inDate;
  }
}
