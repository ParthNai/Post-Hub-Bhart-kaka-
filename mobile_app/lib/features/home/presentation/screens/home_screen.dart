import 'dart:async';
import 'package:flutter/material.dart';
import 'package:panchayat_post/core/constants/app_assets.dart';
import 'package:panchayat_post/core/constants/app_colors.dart';
import 'package:panchayat_post/core/localization/app_localizations.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/core/models/app_remote_config.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';
import 'package:panchayat_post/core/services/app_config_service.dart';
import 'package:panchayat_post/features/auth/data/auth_service.dart';
import 'package:panchayat_post/features/auth/domain/models/user_profile.dart';
import 'package:panchayat_post/features/editor/domain/models/poster_template_project.dart';
import 'package:panchayat_post/features/festivals/data/services/festival_service.dart';
import 'package:panchayat_post/features/festivals/domain/models/festival_item.dart';

/// Screen 09: Main Home Dashboard Screen (Redesigned)
///
/// Pixel-perfect reproduction of the newly approved Home Screen UI reference image:
///
/// 1. Compact Header:
///    - Top-left: ONLY the original brand logo ([AppAssets.panchayatLogo]).
///    - Top-right: User profile avatar.
///    - NO greeting, username, notification bell, badge, language selector, or brand text.
/// 2. Featured Festival Component:
///    - Compact banner with Maa Durga artwork, "Navratri" pill badge, "Navratri Celebration" title,
///      ornamental divider, subtitle, calendar date, "Create Post →" action, and 3 carousel indicator dots.
/// 3. Upcoming Festivals (2-Column Grid):
///    - Heading: "Upcoming Festivals" with "View All →" action.
///    - Two-column responsive grid (Diwali, Holi, etc.) displaying image, title, and calendar date.
///    - Entire card is tappable.
/// 4. Create Something New (2 Action Tiles):
///    - Heading: "Create Something New".
///    - Two equal-width tiles side-by-side:
///      - "Festival Post" ("Create festival greetings") with 3D Diya artwork and purple arrow button.
///      - "Panchayat Post" ("Create community announcements") with 3D Panchayat Bhavan artwork and orange arrow button.
/// 5. Popular Templates (Horizontal Browsing):
///    - Heading: "Popular Templates" with "View All →" action.
///    - Horizontal cards: "Diwali Wishes", "Good Morning", "Jai Hind", "Suvichar".
///    - Tapping opens the poster editor with selected template project.
/// 6. Fixed 5-Item Bottom Navigation Bar:
///    - Home (selected), Festivals, Templates, My Designs, Profile.
class HomeScreen extends StatefulWidget {
  const HomeScreen({
    super.key,
    this.authService,
    this.initialTabIndex = 0,
  });

  final AuthService? authService;
  final int initialTabIndex;

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late final AuthService _authService;
  UserProfile? _currentUser;
  late int _selectedNavIndex;

  final ScrollController _templatesScrollController = ScrollController();
  final PageController _heroPageController = PageController();

  int _heroCurrentPage = 0;
  Timer? _heroTimer;

  final FestivalService _festivalService = FestivalService();
  List<Map<String, String>> _adminSliders = const [];
  List<FestivalItem> _adminFestivals = const [];

  // Default featured festival data matching reference image
  static const _defaultFeaturedFestival = {
    'badge': 'Navratri',
    'title': 'Navratri Celebration',
    'subtitle': 'May Maa Amba fill your life\nwith happiness and positivity.',
    'date': 'Oct 1 – Oct 10, 2025',
    'imageAsset': AppAssets.homeBannerNavratriHero,
  };

  // Fallback upcoming festivals matching 2-column grid in reference image
  final List<FestivalItem> _defaultUpcomingFestivals = [
    const FestivalItem(
      id: 'diwali',
      name: 'Diwali',
      nameGu: 'દિવાળી',
      nameHi: 'दीपावली',
      dateDisplay: 'Oct 20, 2025',
      category: 'hindu',
      categoryName: 'Hindu Festivals',
      imageAsset: AppAssets.homeFestivalDiwaliCard,
      isUpcoming: true,
      isFeatured: false,
    ),
    const FestivalItem(
      id: 'holi',
      name: 'Holi',
      nameGu: 'હોળી',
      nameHi: 'होली',
      dateDisplay: 'Mar 14, 2026',
      category: 'cultural',
      categoryName: 'Cultural Events',
      imageAsset: AppAssets.festivalAllHoli,
      isUpcoming: true,
      isFeatured: false,
    ),
  ];

  // Fallback popular templates matching horizontal cards in reference image
  final List<Map<String, String>> _defaultPopularTemplates = [
    {
      'title': 'Diwali Wishes',
      'asset': AppAssets.homeFestivalDiwaliCard,
    },
    {
      'title': 'Good Morning',
      'asset': AppAssets.homeTemplateGoodMorning,
    },
    {
      'title': 'Jai Hind',
      'asset': AppAssets.homeFestivalIndependenceCard,
    },
    {
      'title': 'Suvichar',
      'asset': AppAssets.homeTemplateSuvichar,
    },
  ];

  @override
  void initState() {
    super.initState();
    _authService = widget.authService ?? AuthService();
    _selectedNavIndex = widget.initialTabIndex;
    _loadUserProfile();
    _loadAdminContent();
    _startHeroAutoScroll();
  }

  Future<void> _loadAdminContent() async {
    await AppConfigService.instance.refreshConfig();
    final slidersRaw = await AppConfigService.instance.fetchAdminSliders();
    final festivals = await _festivalService.fetchAdminFestivals();

    final mappedSliders = <Map<String, String>>[];
    for (final s in slidersRaw) {
      final base = s['_resolvedBase']?.toString();
      final img = AppConfigService.instance.resolveMediaUrl(
        s['sliderImage']?.toString() ?? s['image']?.toString(),
        baseUrlOverride: base,
      );
      if (img.isNotEmpty) {
        mappedSliders.add({
          'title': s['title']?.toString() ?? 'Navratri Celebration',
          'imageUrl': img,
          'isAnnouncement': 'false',
          'isEditable': 'true',
        });
      }
    }

    for (final f in festivals) {
      if (f.showInHero && f.imageAsset.isNotEmpty) {
        if (!mappedSliders.any((s) => s['imageUrl'] == f.imageAsset)) {
          mappedSliders.add({
            'title': f.name,
            'imageUrl': f.imageAsset,
            'isAnnouncement': f.isAnnouncement ? 'true' : 'false',
            'isEditable': f.isEditable ? 'true' : 'false',
            'festivalId': f.id,
          });
        }
      }
    }

    if (!mounted) return;
    setState(() {
      _adminSliders = mappedSliders;
      _adminFestivals = festivals;
    });
  }

  @override
  void dispose() {
    _heroTimer?.cancel();
    _heroPageController.dispose();
    _templatesScrollController.dispose();
    super.dispose();
  }

  void _startHeroAutoScroll() {
    _heroTimer = Timer.periodic(const Duration(seconds: 5), (timer) {
      if (_heroPageController.hasClients) {
        final totalPages = _adminSliders.isEmpty ? 3 : _adminSliders.length;
        if (totalPages > 1) {
          final nextPage = (_heroCurrentPage + 1) % totalPages;
          _heroPageController.animateToPage(
            nextPage,
            duration: const Duration(milliseconds: 500),
            curve: Curves.easeInOut,
          );
        }
      }
    });
  }

  Future<void> _loadUserProfile() async {
    final user = await _authService.getCurrentUser();
    if (mounted) {
      setState(() {
        _currentUser = user;
      });
    }
  }

  void _onNavTapped(int index) {
    setState(() {
      _selectedNavIndex = index;
    });

    if (index == 1) {
      Navigator.of(context).pushNamed(AppRoutes.festivals).then((_) {
        if (mounted) {
          setState(() => _selectedNavIndex = 0);
        }
      });
    } else if (index == 2) {
      _showAllTemplatesLibrary(context);
    } else if (index == 3) {
      Navigator.of(context).pushNamed(AppRoutes.myDesigns).then((_) {
        if (mounted) {
          setState(() => _selectedNavIndex = 0);
        }
      });
    } else if (index == 4) {
      Navigator.of(context).pushNamed(AppRoutes.profile).then((_) {
        if (mounted) {
          setState(() => _selectedNavIndex = 0);
        }
      });
    }
  }

  void _openTemplateInEditor(String title, String asset) {
    final defaultProject = PosterTemplateProject.createDefaultNavratriProject(
      templateId: 'home_template_${title.toLowerCase().replaceAll(' ', '_')}',
      imageAsset: asset,
      title: title,
    );
    Navigator.of(context).pushNamed(
      AppRoutes.posterEditor,
      arguments: defaultProject,
    );
  }

  void _showAllTemplatesLibrary(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24.0)),
      ),
      builder: (ctx) => DraggableScrollableSheet(
        initialChildSize: 0.85,
        minChildSize: 0.5,
        maxChildSize: 0.95,
        expand: false,
        builder: (_, scrollController) => Padding(
          padding: const EdgeInsets.fromLTRB(20.0, 12.0, 20.0, 20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40.0,
                  height: 4.0,
                  margin: const EdgeInsets.only(bottom: 16.0),
                  decoration: BoxDecoration(
                    color: const Color(0xFFCBD5E1),
                    borderRadius: BorderRadius.circular(2.0),
                  ),
                ),
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Expanded(
                    child: Text(
                      'All Popular Templates',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        fontSize: 18.0,
                        fontWeight: FontWeight.w800,
                        color: AppColors.textNavy,
                      ),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close_rounded),
                    onPressed: () => Navigator.of(ctx).pop(),
                  ),
                ],
              ),
              const SizedBox(height: 12.0),
              Expanded(
                child: ValueListenableBuilder<AppRemoteConfig>(
                  valueListenable: AppConfigService.instance.configNotifier,
                  builder: (context, config, _) {
                    final templates = config.templates;
                    if (templates.isEmpty) {
                      return GridView.builder(
                        controller: scrollController,
                        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          crossAxisSpacing: 12.0,
                          mainAxisSpacing: 12.0,
                          childAspectRatio: 0.82,
                        ),
                        itemCount: _defaultPopularTemplates.length,
                        itemBuilder: (context, index) {
                          final item = _defaultPopularTemplates[index];
                          return _buildTemplateItemInModal(
                            title: item['title']!,
                            imageAsset: item['asset']!,
                          );
                        },
                      );
                    }
                    return GridView.builder(
                      controller: scrollController,
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        crossAxisSpacing: 12.0,
                        mainAxisSpacing: 12.0,
                        childAspectRatio: 0.82,
                      ),
                      itemCount: templates.length,
                      itemBuilder: (context, index) {
                        final item = templates[index];
                        final imageUrl = AppConfigService.instance.resolveMediaUrl(
                          item.thumbnailUrl ?? item.backgroundImageUrl,
                        );
                        return _buildTemplateItemInModal(
                          title: item.name,
                          imageUrl: imageUrl,
                        );
                      },
                    );
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTemplateItemInModal({
    required String title,
    String? imageAsset,
    String? imageUrl,
  }) {
    return GestureDetector(
      onTap: () {
        Navigator.of(context).pop();
        _openTemplateInEditor(title, imageAsset ?? imageUrl ?? '');
      },
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16.0),
          border: Border.all(color: const Color(0xFFE2E8F0)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.04),
              blurRadius: 6,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        clipBehavior: Clip.antiAlias,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Expanded(
              child: imageAsset != null
                  ? Image.asset(
                      imageAsset,
                      fit: BoxFit.cover,
                      errorBuilder: (_, _, _) => const Center(
                        child: Icon(Icons.image_outlined, color: Color(0xFF94A3B8)),
                      ),
                    )
                  : Image.network(
                      imageUrl ?? '',
                      fit: BoxFit.cover,
                      errorBuilder: (_, _, _) => const Center(
                        child: Icon(Icons.image_outlined, color: Color(0xFF94A3B8)),
                      ),
                    ),
            ),
            Container(
              color: Colors.white,
              padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 6.0),
              child: Text(
                title,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  fontSize: 11.5,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textNavy,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showTemplatesModal(BuildContext context, String categoryName) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24.0)),
      ),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              children: [
                const Icon(Icons.palette_outlined, color: Color(0xFF0056D2)),
                const SizedBox(width: 8.0),
                Expanded(
                  child: Text(
                    '$categoryName Templates',
                    style: const TextStyle(
                      fontSize: 18.0,
                      fontWeight: FontWeight.w800,
                      color: AppColors.textNavy,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16.0),
            Container(
              height: 110.0,
              decoration: BoxDecoration(
                color: const Color(0xFFEFF6FF),
                borderRadius: BorderRadius.circular(14.0),
              ),
              child: const Center(
                child: Icon(
                  Icons.auto_awesome_rounded,
                  size: 48.0,
                  color: Color(0xFF0056D2),
                ),
              ),
            ),
            const SizedBox(height: 16.0),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF0056D2),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12.0),
                ),
                padding: const EdgeInsets.symmetric(vertical: 12.0),
              ),
              onPressed: () {
                Navigator.of(ctx).pop();
                _showAllTemplatesLibrary(context);
              },
              child: const Text('Browse All Designs', style: TextStyle(fontWeight: FontWeight.w700)),
            ),
          ],
        ),
      ),
    );
  }

  // --- Main Build ---

  @override
  Widget build(BuildContext context) {
    final strings = LocaleScope.of(context).strings;

    return Scaffold(
      backgroundColor: Colors.white,
      body: SafeArea(
        child: Column(
          children: [
            // 1. Compact Header: Logo ONLY on top-left, Profile Avatar ONLY on top-right
            _buildTopHeader(),

            // Main Vertical Scrollable Content Area
            Expanded(
              child: SingleChildScrollView(
                physics: const BouncingScrollPhysics(),
                padding: const EdgeInsets.only(bottom: 24.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 6.0),

                    // 2. Featured Festival Hero Banner & Carousel Dots
                    _buildHeroFeaturedSection(),
                    const SizedBox(height: 22.0),

                    // 3. Upcoming Festivals Section (Two-Column Grid)
                    _buildUpcomingFestivalsSection(),
                    const SizedBox(height: 24.0),

                    // 4. Create Something New Section (Two Equal Action Tiles)
                    _buildCreateSomethingNewSection(),
                    const SizedBox(height: 24.0),

                    // 5. Popular Templates Section (Horizontal List)
                    _buildPopularTemplatesSection(),
                  ],
                ),
              ),
            ),

            // 6. Fixed Bottom Navigation Bar (5 tabs)
            _buildBottomNavigationBar(strings),
          ],
        ),
      ),
    );
  }

  // --- 1. Compact Header ---
  // EXACT REQUIREMENT: Contains ONLY original logo on left and user avatar on right.
  // NO greeting, username, notification bell, badge, language selector, or brand text.

  Widget _buildTopHeader() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 10.0),
      color: Colors.white,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // Original Panchayat Post Logo (Top-Left)
          Container(
            width: 44.0,
            height: 44.0,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12.0),
              border: Border.all(color: const Color(0xFFE2E8F0), width: 1.0),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.04),
                  blurRadius: 4,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            padding: const EdgeInsets.all(4.0),
            child: Image.asset(
              AppAssets.panchayatLogo,
              fit: BoxFit.contain,
              errorBuilder: (_, error, stackTrace) => Image.asset(
                AppAssets.panchayatLogoOriginal,
                fit: BoxFit.contain,
              ),
            ),
          ),

          // User Profile Avatar (Top-Right)
          _buildAvatarWidget(size: 40.0),
        ],
      ),
    );
  }

  Widget _buildAvatarWidget({required double size}) {
    return GestureDetector(
      key: const ValueKey('btn_profile_avatar'),
      onTap: () {
        Navigator.of(context).pushNamed(AppRoutes.profile).then((_) {
          if (mounted) setState(() => _selectedNavIndex = 0);
        });
      },
      child: Container(
        width: size,
        height: size,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          border: Border.all(
            color: const Color(0xFF0056D2),
            width: 1.5,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.08),
              blurRadius: 4,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: ClipOval(
          child: Image.asset(
            AppAssets.homeAvatarRahul,
            fit: BoxFit.cover,
            errorBuilder: (_, _, _) => Container(
              color: const Color(0xFFEDE9FE),
              child: Center(
                child: Text(
                  _currentUser?.effectiveDisplayName.isNotEmpty == true
                      ? _currentUser!.effectiveDisplayName.substring(0, 1).toUpperCase()
                      : 'K',
                  style: TextStyle(
                    color: const Color(0xFF0056D2),
                    fontWeight: FontWeight.w800,
                    fontSize: size * 0.42,
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  // --- 2. Featured Festival Component ---

  Widget _buildHeroFeaturedSection() {
    return Column(
      children: [
        SizedBox(
          height: 195.0,
          child: PageView.builder(
            controller: _heroPageController,
            itemCount: _adminSliders.isNotEmpty ? _adminSliders.length : 3,
            onPageChanged: (index) {
              setState(() => _heroCurrentPage = index);
            },
            itemBuilder: (context, index) {
              if (_adminSliders.isNotEmpty) {
                final slider = _adminSliders[index];
                return Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16.0),
                  child: _buildFeaturedCard(
                    title: slider['title']?.isNotEmpty == true
                        ? slider['title']!
                        : _defaultFeaturedFestival['title']!,
                    subtitle: _defaultFeaturedFestival['subtitle']!,
                    date: _defaultFeaturedFestival['date']!,
                    badge: _defaultFeaturedFestival['badge']!,
                    imageUrl: slider['imageUrl'],
                    isAnnouncement: slider['isAnnouncement'] == 'true',
                    isEditable: slider['isEditable'] != 'false',
                    festivalId: slider['festivalId'],
                  ),
                );
              }

              return Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: _buildFeaturedCard(
                  title: _defaultFeaturedFestival['title']!,
                  subtitle: _defaultFeaturedFestival['subtitle']!,
                  date: _defaultFeaturedFestival['date']!,
                  badge: _defaultFeaturedFestival['badge']!,
                  imageAsset: _defaultFeaturedFestival['imageAsset']!,
                ),
              );
            },
          ),
        ),
        const SizedBox(height: 10.0),

        // Carousel Indicator Dots (3 dots matching reference image)
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(
            _adminSliders.isNotEmpty ? _adminSliders.length : 3,
            (index) {
              final isActive = _heroCurrentPage == index;
              return AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                margin: const EdgeInsets.symmetric(horizontal: 3.0),
                height: 6.0,
                width: isActive ? 20.0 : 6.0,
                decoration: BoxDecoration(
                  color: isActive ? const Color(0xFF0056D2) : const Color(0xFFC7D2FE),
                  borderRadius: BorderRadius.circular(3.0),
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildFeaturedCard({
    required String title,
    required String subtitle,
    required String date,
    required String badge,
    String? imageAsset,
    String? imageUrl,
    bool isAnnouncement = false,
    bool isEditable = true,
    String? festivalId,
  }) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(22.0),
        gradient: const LinearGradient(
          colors: [
            Color(0xFFFFFBEB),
            Color(0xFFFEF3C7),
            Color(0xFFFED7AA),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        border: Border.all(color: const Color(0xFFFDE68A), width: 1.0),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFD97706).withValues(alpha: 0.10),
            blurRadius: 14,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: Row(
        children: [
          // Left: Full Festival Artwork (Maa Durga on Lion)
          Expanded(
            flex: 44,
            child: Container(
              height: double.infinity,
              alignment: Alignment.center,
              padding: const EdgeInsets.all(6.0),
              child: imageUrl != null && imageUrl.isNotEmpty
                  ? Image.network(
                      imageUrl,
                      fit: BoxFit.contain,
                      errorBuilder: (_, _, _) => Image.asset(
                        AppAssets.homeBannerNavratriHero,
                        fit: BoxFit.contain,
                      ),
                    )
                  : Image.asset(
                      imageAsset ?? AppAssets.homeBannerNavratriHero,
                      fit: BoxFit.contain,
                    ),
            ),
          ),

          // Right: Content Column
          Expanded(
            flex: 56,
            child: Padding(
              padding: const EdgeInsets.fromLTRB(4.0, 14.0, 14.0, 14.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Blue Pill Badge ("Navratri")
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14.0, vertical: 3.5),
                    decoration: BoxDecoration(
                      color: const Color(0xFF0056D2),
                      borderRadius: BorderRadius.circular(12.0),
                    ),
                    child: Text(
                      badge,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 11.5,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 0.2,
                      ),
                    ),
                  ),
                  const SizedBox(height: 6.0),

                  // Title ("Navratri Celebration")
                  FittedBox(
                    fit: BoxFit.scaleDown,
                    child: Text(
                      title,
                      style: const TextStyle(
                        fontSize: 22.0,
                        fontWeight: FontWeight.w900,
                        color: AppColors.textNavy,
                        letterSpacing: -0.5,
                      ),
                    ),
                  ),
                  const SizedBox(height: 4.0),

                  // Subtitle
                  Text(
                    subtitle,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 10.5,
                      color: Color(0xFF475569),
                      height: 1.25,
                    ),
                  ),
                  const SizedBox(height: 6.0),

                  // Date with calendar icon
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(
                        Icons.calendar_month_outlined,
                        size: 12.0,
                        color: Color(0xFF0056D2),
                      ),
                      const SizedBox(width: 4.0),
                      Flexible(
                        child: Text(
                          date,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 10.5,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFF334155),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10.0),

                  // "Create Post →" Action Pill Button
                  GestureDetector(
                    onTap: () {
                      if (isAnnouncement && !isEditable) {
                        final matched = _adminFestivals.firstWhere(
                          (f) => f.imageAsset == imageUrl || f.id == festivalId,
                          orElse: () => _festivalService.getFeaturedFestival(),
                        );
                        _showAnnouncementViewer(context, matched);
                      } else {
                        Navigator.of(context).pushNamed(AppRoutes.festivals);
                      }
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14.0, vertical: 7.0),
                      decoration: BoxDecoration(
                        color: const Color(0xFF0056D2),
                        borderRadius: BorderRadius.circular(20.0),
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFF0056D2).withValues(alpha: 0.25),
                            blurRadius: 6,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: const FittedBox(
                        fit: BoxFit.scaleDown,
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              'Create Post',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 11.5,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                            SizedBox(width: 4.0),
                            Icon(
                              Icons.arrow_forward_rounded,
                              size: 13.0,
                              color: Colors.white,
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // --- 3. Upcoming Festivals Section (Exact 2-Column Grid) ---

  Widget _buildUpcomingFestivalsSection() {
    final festivals = _adminFestivals.isNotEmpty ? _adminFestivals : _defaultUpcomingFestivals;
    // Show top 2 for the clean two-column grid matching reference image
    final displayFestivals = festivals.take(2).toList();

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Section Header
          Row(
            children: [
              Container(
                width: 4.0,
                height: 18.0,
                decoration: BoxDecoration(
                  color: const Color(0xFF0056D2),
                  borderRadius: BorderRadius.circular(2.0),
                ),
              ),
              const SizedBox(width: 8.0),
              const Expanded(
                child: Text(
                  'Upcoming Festivals',
                  style: TextStyle(
                    fontSize: 17.0,
                    fontWeight: FontWeight.w800,
                    color: AppColors.textNavy,
                  ),
                ),
              ),
              GestureDetector(
                key: const ValueKey('btn_see_all_festivals'),
                onTap: () => Navigator.of(context).pushNamed(AppRoutes.festivals),
                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      'View All',
                      style: TextStyle(
                        fontSize: 13.5,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF0056D2),
                      ),
                    ),
                    SizedBox(width: 2.0),
                    Icon(
                      Icons.arrow_forward_rounded,
                      size: 14.0,
                      color: Color(0xFF0056D2),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12.0),

          // Two-Column Grid matching reference image
          Row(
            children: [
              for (int i = 0; i < displayFestivals.length; i++) ...[
                if (i > 0) const SizedBox(width: 12.0),
                Expanded(
                  child: _buildUpcomingFestivalGridCard(
                    festival: displayFestivals[i],
                  ),
                ),
              ],
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildUpcomingFestivalGridCard({
    required FestivalItem festival,
  }) {
    final title = festival.name;
    final date = festival.dateDisplay;
    final imageAsset = festival.imageAsset;

    return GestureDetector(
      onTap: () {
        Navigator.of(context).pushNamed(
          AppRoutes.festivalDetail,
          arguments: festival,
        );
      },
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18.0),
          border: Border.all(color: const Color(0xFFE2E8F0)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.04),
              blurRadius: 8,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        clipBehavior: Clip.antiAlias,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Image Container
            SizedBox(
              height: 104.0,
              width: double.infinity,
              child: imageAsset.startsWith('assets/')
                  ? Image.asset(
                      imageAsset,
                      fit: BoxFit.cover,
                      errorBuilder: (_, _, _) => const Center(
                        child: Icon(Icons.celebration_rounded, color: Color(0xFF94A3B8)),
                      ),
                    )
                  : Image.network(
                      imageAsset,
                      fit: BoxFit.cover,
                      errorBuilder: (_, _, _) => const Center(
                        child: Icon(Icons.celebration_rounded, color: Color(0xFF94A3B8)),
                      ),
                    ),
            ),

            // Text Info
            Padding(
              padding: const EdgeInsets.all(10.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 14.0,
                      fontWeight: FontWeight.w800,
                      color: AppColors.textNavy,
                    ),
                  ),
                  const SizedBox(height: 3.0),
                  Row(
                    children: [
                      const Icon(
                        Icons.calendar_month_outlined,
                        size: 12.0,
                        color: Color(0xFF64748B),
                      ),
                      const SizedBox(width: 4.0),
                      Expanded(
                        child: Text(
                          date,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 11.0,
                            fontWeight: FontWeight.w500,
                            color: Color(0xFF64748B),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // --- 4. Create Something New Section (Two Equal Action Tiles) ---

  Widget _buildCreateSomethingNewSection() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Section Header with blue vertical bar
          Row(
            children: [
              Container(
                width: 4.0,
                height: 18.0,
                decoration: BoxDecoration(
                  color: const Color(0xFF0056D2),
                  borderRadius: BorderRadius.circular(2.0),
                ),
              ),
              const SizedBox(width: 8.0),
              const Expanded(
                child: Text(
                  'Create Something New',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 17.0,
                    fontWeight: FontWeight.w800,
                    color: AppColors.textNavy,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12.0),

          // 2 Equal-Width Action Tiles Side-by-Side
          Row(
            children: [
              // Tile 1: Festival Post
              Expanded(
                child: _buildCreateActionTile(
                  title: 'Festival Post',
                  subtitle: 'Create festival greetings',
                  illustrationAsset: AppAssets.homeCreateFestivalThumb,
                  gradientColors: const [
                    Color(0xFFEEF2FF),
                    Color(0xFFEDE9FE),
                  ],
                  borderColor: const Color(0xFFE0E7FF),
                  actionColor: const Color(0xFF7C3AED),
                  onTap: () => Navigator.of(context).pushNamed(AppRoutes.festivals),
                ),
              ),
              const SizedBox(width: 12.0),

              // Tile 2: Panchayat Post
              Expanded(
                child: _buildCreateActionTile(
                  title: 'Panchayat Post',
                  subtitle: 'Create community\nannouncements',
                  illustrationAsset: AppAssets.homeCreatePanchayatThumb,
                  gradientColors: const [
                    Color(0xFFFEF3C7),
                    Color(0xFFFFFBEB),
                  ],
                  borderColor: const Color(0xFFFDE68A),
                  actionColor: const Color(0xFFF97316),
                  onTap: () => _showTemplatesModal(context, 'Panchayat'),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildCreateActionTile({
    required String title,
    required String subtitle,
    required String illustrationAsset,
    required List<Color> gradientColors,
    required Color borderColor,
    required Color actionColor,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 88.0,
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: gradientColors,
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(18.0),
          border: Border.all(color: borderColor),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.04),
              blurRadius: 8,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        padding: const EdgeInsets.all(10.0),
        child: Row(
          children: [
            // Left Illustration
            SizedBox(
              width: 44.0,
              height: 44.0,
              child: Image.asset(
                illustrationAsset,
                fit: BoxFit.contain,
                errorBuilder: (_, _, _) => Icon(
                  Icons.palette_outlined,
                  size: 28.0,
                  color: actionColor,
                ),
              ),
            ),
            const SizedBox(width: 8.0),

            // Middle Text
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    title,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 13.0,
                      fontWeight: FontWeight.w800,
                      color: AppColors.textNavy,
                    ),
                  ),
                  const SizedBox(height: 2.0),
                  Text(
                    subtitle,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 9.5,
                      fontWeight: FontWeight.w500,
                      color: Color(0xFF64748B),
                      height: 1.15,
                    ),
                  ),
                ],
              ),
            ),

            // Right Circular Arrow Button
            Container(
              width: 24.0,
              height: 24.0,
              decoration: BoxDecoration(
                color: actionColor,
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.chevron_right_rounded,
                size: 16.0,
                color: Colors.white,
              ),
            ),
          ],
        ),
      ),
    );
  }

  // --- 5. Popular Templates Section (Horizontal List) ---

  Widget _buildPopularTemplatesSection() {
    return ValueListenableBuilder<AppRemoteConfig>(
      valueListenable: AppConfigService.instance.configNotifier,
      builder: (context, config, _) {
        final adminTemplates = config.templates;

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Section Header
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: Row(
                children: [
                  Container(
                    width: 4.0,
                    height: 18.0,
                    decoration: BoxDecoration(
                      color: const Color(0xFF0056D2),
                      borderRadius: BorderRadius.circular(2.0),
                    ),
                  ),
                  const SizedBox(width: 8.0),
                  const Expanded(
                    child: Text(
                      'Popular Templates',
                      style: TextStyle(
                        fontSize: 17.0,
                        fontWeight: FontWeight.w800,
                        color: AppColors.textNavy,
                      ),
                    ),
                  ),
                  GestureDetector(
                    key: const ValueKey('btn_see_all_templates'),
                    onTap: () => _showAllTemplatesLibrary(context),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          'View All',
                          style: TextStyle(
                            fontSize: 13.5,
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF0056D2),
                          ),
                        ),
                        SizedBox(width: 2.0),
                        Icon(
                          Icons.arrow_forward_rounded,
                          size: 14.0,
                          color: Color(0xFF0056D2),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12.0),

            SizedBox(
              height: 165.0,
              child: ListView.separated(
                controller: _templatesScrollController,
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                physics: const BouncingScrollPhysics(),
                itemCount: adminTemplates.isNotEmpty
                    ? adminTemplates.length
                    : _defaultPopularTemplates.length,
                separatorBuilder: (context, index) => const SizedBox(width: 12.0),
                itemBuilder: (context, index) {
                  if (adminTemplates.isNotEmpty) {
                    final item = adminTemplates[index];
                    final imageUrl = AppConfigService.instance.resolveMediaUrl(
                      item.thumbnailUrl ?? item.backgroundImageUrl,
                    );
                    return _buildPopularTemplateCard(
                      title: item.name,
                      imageUrl: imageUrl,
                    );
                  }

                  final item = _defaultPopularTemplates[index];
                  return _buildPopularTemplateCard(
                    title: item['title']!,
                    imageAsset: item['asset']!,
                  );
                },
              ),
            ),
          ],
        );
      },
    );
  }

  Widget _buildPopularTemplateCard({
    required String title,
    String? imageAsset,
    String? imageUrl,
  }) {
    return GestureDetector(
      onTap: () => _openTemplateInEditor(title, imageAsset ?? imageUrl ?? ''),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Container(
            width: 110.0,
            height: 122.0,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16.0),
              border: Border.all(color: const Color(0xFFE2E8F0)),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.05),
                  blurRadius: 6,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            clipBehavior: Clip.antiAlias,
            child: imageAsset != null
                ? Image.asset(
                    imageAsset,
                    fit: BoxFit.cover,
                    errorBuilder: (_, _, _) => const Center(
                      child: Icon(Icons.image_outlined, color: Color(0xFF94A3B8)),
                    ),
                  )
                : Image.network(
                    imageUrl ?? '',
                    fit: BoxFit.cover,
                    errorBuilder: (_, _, _) => const Center(
                      child: Icon(Icons.image_outlined, color: Color(0xFF94A3B8)),
                    ),
                  ),
          ),
          const SizedBox(height: 6.0),
          SizedBox(
            width: 110.0,
            child: Text(
              title,
              maxLines: 1,
              textAlign: TextAlign.center,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                fontSize: 11.5,
                fontWeight: FontWeight.w700,
                color: AppColors.textNavy,
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _showAnnouncementViewer(BuildContext context, FestivalItem item) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24.0)),
      ),
      builder: (ctx) => Container(
        constraints: BoxConstraints(
          maxHeight: MediaQuery.of(ctx).size.height * 0.90,
        ),
        padding: const EdgeInsets.fromLTRB(18, 12, 18, 20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                margin: const EdgeInsets.only(bottom: 12),
                decoration: BoxDecoration(
                  color: const Color(0xFFCBD5E1),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          const Text('📢', style: TextStyle(fontSize: 16)),
                          const SizedBox(width: 6),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: const Color(0xFFDBEAFE),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: const Text(
                              'સત્તાવાર પરિપત્ર',
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.w800,
                                color: Color(0xFF1E40AF),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        item.name,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF1E293B),
                        ),
                      ),
                    ],
                  ),
                ),
                IconButton(
                  onPressed: () => Navigator.of(ctx).pop(),
                  icon: const Icon(Icons.close_rounded, color: Color(0xFF64748B)),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Expanded(
              child: ClipRRect(
                borderRadius: BorderRadius.circular(16),
                child: Image.network(
                  item.imageAsset,
                  fit: BoxFit.contain,
                  errorBuilder: (_, _, _) => Container(
                    color: const Color(0xFFF1F5F9),
                    child: const Center(
                      child: Text('ઇમેજ લોડ થઈ શકી નથી'),
                    ),
                  ),
                ),
              ),
            ),
            const SizedBox(height: 14),
            ElevatedButton.icon(
              onPressed: () {
                Navigator.of(ctx).pop();
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('પરિપત્ર શેર થઈ રહ્યો છે...')),
                );
              },
              icon: const Icon(Icons.share_rounded, size: 18),
              label: const Text('શેર કરો (WhatsApp / Social)'),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF0056D2),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 13),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // --- 6. Fixed Bottom Navigation Bar (5 tabs) ---

  Widget _buildBottomNavigationBar(AppStrings strings) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(22.0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.06),
            blurRadius: 10,
            offset: const Offset(0, -3),
          ),
        ],
      ),
      padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 6.0),
      child: Row(
        children: [
          Expanded(
            child: _buildNavItem(
              index: 0,
              label: strings.navHome,
              icon: Icons.home_rounded,
            ),
          ),
          Expanded(
            child: _buildNavItem(
              index: 1,
              label: strings.navFestivals,
              icon: Icons.calendar_month_outlined,
            ),
          ),
          Expanded(
            child: _buildNavItem(
              index: 2,
              label: strings.navTemplates,
              icon: Icons.layers_outlined,
            ),
          ),
          Expanded(
            child: _buildNavItem(
              index: 3,
              label: strings.navMyDesigns,
              icon: Icons.photo_library_outlined,
            ),
          ),
          Expanded(
            child: _buildNavItem(
              index: 4,
              label: strings.navProfile,
              icon: Icons.person_outline_rounded,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNavItem({
    required int index,
    required String label,
    required IconData icon,
  }) {
    final isSelected = _selectedNavIndex == index;
    final color = isSelected ? const Color(0xFF0056D2) : const Color(0xFF64748B);

    return InkWell(
      onTap: () => _onNavTapped(index),
      borderRadius: BorderRadius.circular(16.0),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 4.0, vertical: 6.0),
        decoration: isSelected
            ? BoxDecoration(
                color: const Color(0xFFEDE9FE),
                borderRadius: BorderRadius.circular(18.0),
              )
            : null,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 22.0,
              color: color,
            ),
            const SizedBox(height: 2.0),
            FittedBox(
              fit: BoxFit.scaleDown,
              child: Text(
                label,
                maxLines: 1,
                style: TextStyle(
                  fontSize: 11.0,
                  fontWeight: isSelected ? FontWeight.w800 : FontWeight.w500,
                  color: color,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
