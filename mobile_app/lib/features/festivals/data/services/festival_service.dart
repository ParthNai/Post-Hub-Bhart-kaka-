import 'package:flutter/material.dart';
import 'package:panchayat_post/core/constants/app_assets.dart';
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

/// Service providing festival listings, categories, and search/filtering logic.
class FestivalService {
  FestivalService();

  /// Default category chips matching Screen 10
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

  /// The Hero Featured Festival shown on the top banner
  FestivalItem getFeaturedFestival() {
    return const FestivalItem(
      id: 'fest_featured_navratri',
      name: 'Navratri',
      nameGu: 'નવરાત્રી',
      nameHi: 'नवरात्रि',
      dateDisplay: '22 Oct – 30 Oct',
      category: 'hindu',
      categoryName: 'Hindu Festivals',
      imageAsset: AppAssets.festivalHeroDancers,
      isUpcoming: true,
      isFeatured: true,
      description: 'Navratri Celebration. Explore beautiful festive designs.',
      keywords: ['navratri', 'garba', 'dandiya', 'celebration', 'નવરાત્રી', 'ગરબા'],
      templateCount: 24,
    );
  }

  /// 4 Primary Upcoming Festivals for the 2-Column Grid
  List<FestivalItem> getUpcomingFestivals() {
    return const [
      FestivalItem(
        id: 'fest_navratri',
        name: 'Navratri',
        nameGu: 'નવરાત્રી',
        nameHi: 'नवरात्रि',
        dateDisplay: '22 Oct – 30 Oct',
        category: 'hindu',
        categoryName: 'Hindu Festivals',
        imageAsset: AppAssets.festivalNavratriMaa,
        isUpcoming: true,
        keywords: ['navratri', 'durga', 'maa', 'garba', 'dandiya', 'નવરાત્રી', 'અંબે મા'],
        templateCount: 18,
      ),
      FestivalItem(
        id: 'fest_diwali',
        name: 'Diwali',
        nameGu: 'દિવાળી',
        nameHi: 'दिवाली',
        dateDisplay: '12 Nov – 20 Nov',
        category: 'hindu',
        categoryName: 'Hindu Festivals',
        imageAsset: AppAssets.festivalDiwaliDiyas,
        isUpcoming: true,
        keywords: ['diwali', 'deepotsav', 'diya', 'lights', 'દિવાળી', 'દીવો', 'दिवाली'],
        templateCount: 22,
      ),
      FestivalItem(
        id: 'fest_bhai_beej',
        name: 'Bhai Beej',
        nameGu: 'ભાઈ બીજ',
        nameHi: 'भाई दूज',
        dateDisplay: '16 Nov',
        category: 'hindu',
        categoryName: 'Hindu Festivals',
        imageAsset: AppAssets.festivalBhaiBeej,
        isUpcoming: true,
        keywords: ['bhai beej', 'bhai dooj', 'tilak', 'ભાઈ બીજ', 'भाई दूज'],
        templateCount: 10,
      ),
      FestivalItem(
        id: 'fest_christmas',
        name: 'Christmas',
        nameGu: 'નાતાલ (Christmas)',
        nameHi: 'क्रिसमस',
        dateDisplay: '25 Dec',
        category: 'religious',
        categoryName: 'Religious Events',
        imageAsset: AppAssets.festivalChristmasSanta,
        isUpcoming: true,
        keywords: ['christmas', 'santa', 'xmas', 'holiday', 'નાતાલ', 'क्रिसमस'],
        templateCount: 8,
      ),
    ];
  }

  /// All Festivals for carousel and full directory
  List<FestivalItem> getExploreAllFestivals() {
    return const [
      FestivalItem(
        id: 'fest_makar_sankranti',
        name: 'Makar Sankranti',
        nameGu: 'ઉત્તરાયણ / મકર સંક્રાંતિ',
        nameHi: 'मकर संक्रांति',
        dateDisplay: '14 Jan',
        category: 'cultural',
        categoryName: 'Cultural Events',
        imageAsset: AppAssets.festivalAllMakarSankranti,
        keywords: ['makar sankranti', 'kite', 'uttarayan', 'પતંગ', 'ઉત્તરાયણ'],
        templateCount: 14,
      ),
      FestivalItem(
        id: 'fest_holi',
        name: 'Holi',
        nameGu: 'હોળી ધુળેટી',
        nameHi: 'होली',
        dateDisplay: '25 Mar',
        category: 'cultural',
        categoryName: 'Cultural Events',
        imageAsset: AppAssets.festivalAllHoli,
        keywords: ['holi', 'dhuleti', 'colors', 'gulal', 'હોળી', 'ધુળેટી'],
        templateCount: 16,
      ),
      FestivalItem(
        id: 'fest_janmashtami',
        name: 'Janmashtami',
        nameGu: 'જન્માષ્ટમી',
        nameHi: 'जन्माष्टमी',
        dateDisplay: '26 Aug',
        category: 'hindu',
        categoryName: 'Hindu Festivals',
        imageAsset: AppAssets.festivalAllJanmashtami,
        keywords: ['janmashtami', 'krishna', 'kanha', 'matki', 'જન્માષ્ટમી', 'કાનજી'],
        templateCount: 15,
      ),
      FestivalItem(
        id: 'fest_ganesh_chaturthi',
        name: 'Ganesh Chaturthi',
        nameGu: 'ગણેશ ચતુર્થી',
        nameHi: 'गणेश चतुर्थी',
        dateDisplay: '07 Sep',
        category: 'hindu',
        categoryName: 'Hindu Festivals',
        imageAsset: AppAssets.festivalAllGanesh,
        keywords: ['ganesh', 'chaturthi', 'bappa', 'modak', 'ગણેશ', 'વિનાયક'],
        templateCount: 20,
      ),
    ];
  }

  /// Filter and search across all festivals
  List<FestivalItem> searchFestivals({
    String query = '',
    String? categoryFilter,
    bool? upcomingOnly,
  }) {
    final allList = [
      ...getUpcomingFestivals(),
      ...getExploreAllFestivals(),
    ];

    // Deduplicate by ID
    final seenIds = <String>{};
    final unique = <FestivalItem>[];
    for (final f in allList) {
      if (seenIds.add(f.id)) {
        unique.add(f);
      }
    }

    return unique.where((f) {
      return f.matches(
        query: query,
        categoryFilter: categoryFilter,
        upcomingOnly: upcomingOnly,
      );
    }).toList();
  }
}
