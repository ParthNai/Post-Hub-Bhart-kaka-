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
/// Pixel-perfect reproduction of the approved Home Screen UI reference image:
/// - Header:
///   - Left: ONLY the original brand logo ([AppAssets.panchayatLogo]), with NO text beside it.
///   - Middle: Dynamic greeting ("Good morning,") and personalized welcome text ("Krushnapalsinh").
///   - Right: Circular notification button with purple bell and red badge count '2',
///     and circular profile avatar.
/// - Hero Featured Banner:
///   - Auto-scrolling / swipeable banner with warm peach/amber gradient background,
///     Navratri festive artwork, "Shubh" badge, "Navratri" title, subtitle, date,
///     and "Create Festival Post →" pill action.
///   - Carousel indicator dots directly below banner (active is royal blue pill).
/// - Upcoming Festivals Section:
///   - Header with royal blue vertical bar, "Upcoming Festivals", and "View all →" button.
///   - Uncropped cards: Diwali (Oct 20, 2025), Navratri (Oct 1, 2025), Holi (Mar 14, 2026),
///     with "Upcoming" badge, calendar date, and "Explore →" action button.
/// - Create Something New Section:
///   - Header with amber sparkle icon and "Create Something New".
///   - 2 side-by-side cards: "Festival Post" (Diya artwork, purple button) and
///     "Panchayat Post" (Panchayat Bhavan artwork, orange button).
/// - Popular Templates Section:
///   - Header with blue bar, "Popular Templates", and "View all →" button.
///   - Horizontal cards: Good Morning, Independence Day, Suvichar, Good Night.
/// - Bottom Navigation Bar:
///   - 5 tabs: Home (active with lavender pill), Festivals, Templates, My Designs, Profile.
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

  final ScrollController _festivalScrollController = ScrollController();
  final ScrollController _templatesScrollController = ScrollController();
  final PageController _heroPageController = PageController();

  int _heroCurrentPage = 0;
  Timer? _heroTimer;
  int _unreadNotificationsCount = 2; // Matches reference image badge

  final FestivalService _festivalService = FestivalService();
  List<Map<String, String>> _adminSliders = const [];
  List<FestivalItem> _adminFestivals = const [];

  // Default featured festival data matching reference
  static const _defaultFeaturedFestival = {
    'badge': 'Shubh',
    'title': 'Navratri',
    'subtitle': 'May Maa Amba fill your life\nwith happiness and positivity.',
    'date': 'Oct 1 - Oct 10, 2025',
    'imageAsset': AppAssets.homeBannerNavratriHero,
  };

  // Fallback upcoming festivals matching reference image
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
      id: 'navratri',
      name: 'Navratri',
      nameGu: 'નવરાત્રી',
      nameHi: 'नवरात्रि',
      dateDisplay: 'Oct 1, 2025',
      category: 'hindu',
      categoryName: 'Hindu Festivals',
      imageAsset: AppAssets.homeFestivalNavratriCard,
      isUpcoming: true,
      isFeatured: true,
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
    const FestivalItem(
      id: 'independence_day',
      name: 'Independence Day',
      nameGu: 'સ્વતંત્રતા દિવસ',
      nameHi: 'स्वतंत्रता दिवस',
      dateDisplay: 'Aug 15, 2025',
      category: 'national',
      categoryName: 'National Days',
      imageAsset: AppAssets.homeFestivalIndependenceCard,
      isUpcoming: true,
      isFeatured: false,
    ),
    const FestivalItem(
      id: 'ganesh_chaturthi',
      name: 'Ganesh Chaturthi',
      nameGu: 'ગણેશ ચતુર્થી',
      nameHi: 'गणेश चतुर्थी',
      dateDisplay: 'Aug 27, 2025',
      category: 'hindu',
      categoryName: 'Hindu Festivals',
      imageAsset: AppAssets.homeFestivalGaneshCard,
      isUpcoming: true,
      isFeatured: false,
    ),
  ];

  // Fallback popular templates matching reference image
  final List<Map<String, String>> _defaultPopularTemplates = [
    {
      'title': 'Good Morning',
      'asset': AppAssets.homeTemplateGoodMorning,
    },
    {
      'title': 'Independence Day',
      'asset': AppAssets.homeFestivalIndependenceCard,
    },
    {
      'title': 'Suvichar',
      'asset': AppAssets.homeTemplateSuvichar,
    },
    {
      'title': 'Good Night',
      'asset': AppAssets.homeTemplateGoodNight,
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
          'title': s['title']?.toString() ?? '',
          'imageUrl': img,
          'isAnnouncement': 'false',
          'isEditable': 'true',
        });
      }
    }

    // Merge announcements and festivals that have showInHero enabled
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
    _festivalScrollController.dispose();
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

  String _getGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) {
      return 'Good morning,';
    } else if (hour < 17) {
      return 'Good afternoon,';
    } else {
      return 'Good evening,';
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

  // --- Workflows & Modals ---

  void _showNotificationsSheet(BuildContext context) {
    final strings = LocaleScope.of(context).strings;
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24.0)),
      ),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 20.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Row(
                    children: [
                      const Icon(Icons.notifications_active_rounded,
                          color: Color(0xFF6D28D9), size: 24.0),
                      const SizedBox(width: 8.0),
                      Flexible(
                        child: Text(
                          strings.notificationsTitle,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 18.0,
                            fontWeight: FontWeight.w800,
                            color: AppColors.textNavy,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                TextButton(
                  onPressed: () {
                    setState(() => _unreadNotificationsCount = 0);
                    Navigator.of(ctx).pop();
                  },
                  child: const Text(
                    'Mark all read',
                    style: TextStyle(
                      color: Color(0xFF6D28D9),
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
            const Divider(color: Color(0xFFE2E8F0)),
            const SizedBox(height: 12.0),
            _buildNotificationItem(
              title: 'New Navratri Templates Available!',
              subtitle: 'Check out the new high-resolution Garba frames.',
              time: '10m ago',
              isUnread: true,
            ),
            const SizedBox(height: 10.0),
            _buildNotificationItem(
              title: 'Panchayat Post Design Tip',
              subtitle: 'Add your Sarpanch designation badge for official look.',
              time: '2h ago',
              isUnread: false,
            ),
            const SizedBox(height: 20.0),
          ],
        ),
      ),
    );
  }

  Widget _buildNotificationItem({
    required String title,
    required String subtitle,
    required String time,
    required bool isUnread,
  }) {
    return Container(
      padding: const EdgeInsets.all(12.0),
      decoration: BoxDecoration(
        color: isUnread ? const Color(0xFFF5F3FF) : Colors.white,
        borderRadius: BorderRadius.circular(14.0),
        border: Border.all(
          color: isUnread ? const Color(0xFFDDD6FE) : const Color(0xFFE2E8F0),
        ),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 8.0,
            height: 8.0,
            margin: const EdgeInsets.only(top: 5.0, right: 10.0),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: isUnread ? const Color(0xFF6D28D9) : Colors.transparent,
            ),
          ),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: const TextStyle(
                    fontSize: 13.5,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textNavy,
                  ),
                ),
                const SizedBox(height: 2.0),
                Text(
                  subtitle,
                  style: const TextStyle(
                    fontSize: 12.0,
                    color: Color(0xFF64748B),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8.0),
          Text(
            time,
            style: const TextStyle(
              fontSize: 10.5,
              color: Color(0xFF94A3B8),
            ),
          ),
        ],
      ),
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
    final userName = (_currentUser?.effectiveDisplayName != null &&
            _currentUser!.effectiveDisplayName.isNotEmpty)
        ? _currentUser!.effectiveDisplayName.split(' ').first
        : 'Krushnapalsinh';

    return Scaffold(
      backgroundColor: const Color(0xFFF7F9FC),
      body: SafeArea(
        child: Stack(
          children: [
            // Top soft lavender curve wave accent matching reference design
            Positioned(
              top: 0,
              right: 0,
              child: CustomPaint(
                size: const Size(200, 130),
                painter: _HeaderCurvePainter(),
              ),
            ),

            Column(
              children: [
                // 1. Top Header (Original Logo, Greeting, Notification Bell, User Avatar)
                _buildTopHeader(userName),

                // Scrollable Content
                Expanded(
                  child: SingleChildScrollView(
                    physics: const BouncingScrollPhysics(),
                    padding: const EdgeInsets.only(bottom: 24.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const SizedBox(height: 4.0),

                        // 2. Featured Festival Hero Banner & Carousel Dots
                        _buildHeroFeaturedSection(),
                        const SizedBox(height: 22.0),

                        // 3. Upcoming Festivals Section
                        _buildUpcomingFestivalsSection(),
                        const SizedBox(height: 24.0),

                        // 4. Create Something New Section (Festival & Panchayat actions)
                        _buildCreateSomethingNewSection(),
                        const SizedBox(height: 24.0),

                        // 5. Popular Templates Section (Horizontal cards)
                        _buildPopularTemplatesSection(),
                        const SizedBox(height: 24.0),

                        // 6. Optional Admin Announcements (if configured in Admin)
                        _buildAnnouncementsBottomSection(),
                      ],
                    ),
                  ),
                ),

                // 7. Fixed Bottom Navigation Bar (5 tabs)
                _buildBottomNavigationBar(strings),
              ],
            ),
          ],
        ),
      ),
    );
  }

  // --- Header ---

  Widget _buildTopHeader(String userName) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 10.0),
      color: Colors.transparent,
      child: Row(
        children: [
          // Original Panchayat Post Logo ONLY (No brand text beside logo)
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

          // Subtle vertical divider line
          Container(
            height: 26.0,
            width: 1.0,
            color: const Color(0xFFE2E8F0),
            margin: const EdgeInsets.symmetric(horizontal: 12.0),
          ),

          // Greeting Column
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  _getGreeting(),
                  style: const TextStyle(
                    fontSize: 12.5,
                    fontWeight: FontWeight.w500,
                    color: Color(0xFF64748B),
                    height: 1.15,
                  ),
                ),
                const SizedBox(height: 2.0),
                Text(
                  userName,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 17.0,
                    fontWeight: FontWeight.w800,
                    color: AppColors.textNavy,
                    letterSpacing: -0.2,
                  ),
                ),
              ],
            ),
          ),

          // Notification Bell Button with Red Badge
          GestureDetector(
            key: const ValueKey('btn_notifications'),
            onTap: () => _showNotificationsSheet(context),
            child: Container(
              width: 40.0,
              height: 40.0,
              decoration: BoxDecoration(
                color: const Color(0xFFEDE9FE),
                shape: BoxShape.circle,
                border: Border.all(color: const Color(0xFFDDD6FE)),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF6D28D9).withValues(alpha: 0.08),
                    blurRadius: 6,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Stack(
                alignment: Alignment.center,
                children: [
                  const Icon(
                    Icons.notifications_outlined,
                    size: 22.0,
                    color: Color(0xFF6D28D9),
                  ),
                  if (_unreadNotificationsCount > 0)
                    Positioned(
                      top: 4.0,
                      right: 4.0,
                      child: Container(
                        padding: const EdgeInsets.all(2.5),
                        decoration: const BoxDecoration(
                          color: Color(0xFFEF4444),
                          shape: BoxShape.circle,
                        ),
                        constraints: const BoxConstraints(
                          minWidth: 15.0,
                          minHeight: 15.0,
                        ),
                        child: Text(
                          '$_unreadNotificationsCount',
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 9.0,
                            fontWeight: FontWeight.w800,
                            height: 1.0,
                          ),
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),
          const SizedBox(width: 10.0),

          // User Profile Avatar
          _buildAvatarWidget(size: 40.0),
        ],
      ),
    );
  }

  // --- Hero Featured Festival Section ---

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
                    title: slider['title']?.isNotEmpty == true ? slider['title']! : 'Navratri',
                    subtitle: 'May Maa Amba fill your life\nwith happiness and positivity.',
                    date: 'Oct 1 - Oct 10, 2025',
                    badge: 'Shubh',
                    imageUrl: slider['imageUrl'],
                    isAnnouncement: slider['isAnnouncement'] == 'true',
                    isEditable: slider['isEditable'] != 'false',
                    festivalId: slider['festivalId'],
                  ),
                );
              }

              // Default Navratri celebration card matching reference image
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

        // Indicator Dots (royal blue pill for active dot, soft lavender circle for inactives)
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
                width: isActive ? 22.0 : 6.0,
                decoration: BoxDecoration(
                  color: isActive ? const Color(0xFF0056D2) : const Color(0xFFDDD6FE),
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
            Color(0xFFFEF3C7),
            Color(0xFFFED7AA),
            Color(0xFFFFEDD5),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        border: Border.all(color: const Color(0xFFFDE68A), width: 1.0),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFD97706).withValues(alpha: 0.12),
            blurRadius: 14,
            offset: const Offset(0, 5),
          ),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: Stack(
        children: [
          // Row containing Festival Artwork on Left & Info on Right
          Row(
            children: [
              // Left: Festive Artwork (Durga Maa or Slider Image)
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
                      // "Shubh" Pill Badge
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

                      // Title (Navratri)
                      FittedBox(
                        fit: BoxFit.scaleDown,
                        child: Text(
                          title,
                          style: const TextStyle(
                            fontSize: 26.0,
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

                      // "Create Festival Post →" Pill Action Button
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
                          padding: const EdgeInsets.symmetric(horizontal: 12.0, vertical: 7.5),
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
                                  'Create Festival Post',
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
        ],
      ),
    );
  }

  // --- Upcoming Festivals Section ---

  Widget _buildUpcomingFestivalsSection() {
    final festivals = _adminFestivals.isNotEmpty ? _adminFestivals : _defaultUpcomingFestivals;

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
                      'View all',
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
          height: 205.0,
          child: ListView.separated(
            controller: _festivalScrollController,
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            physics: const BouncingScrollPhysics(),
            itemCount: festivals.length,
            separatorBuilder: (context, index) => const SizedBox(width: 12.0),
            itemBuilder: (context, index) {
              final fest = festivals[index];
              return _buildUpcomingFestivalCard(festival: fest);
            },
          ),
        ),
      ],
    );
  }

  Widget _buildUpcomingFestivalCard({
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
        width: 138.0,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18.0),
          border: Border.all(color: const Color(0xFFF1F5F9)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.05),
              blurRadius: 8,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Poster Artwork Container with "Upcoming" Badge
            Stack(
              children: [
                ClipRRect(
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(17.0)),
                  child: SizedBox(
                    height: 112.0,
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
                ),
                Positioned(
                  top: 8.0,
                  right: 8.0,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 3.0),
                    decoration: BoxDecoration(
                      color: const Color(0xFFEEF2FF),
                      borderRadius: BorderRadius.circular(10.0),
                      border: Border.all(color: const Color(0xFFC7D2FE), width: 0.8),
                    ),
                    child: const Text(
                      'Upcoming',
                      style: TextStyle(
                        fontSize: 9.5,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF4338CA),
                      ),
                    ),
                  ),
                ),
              ],
            ),

            Padding(
              padding: const EdgeInsets.fromLTRB(10.0, 8.0, 10.0, 8.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Title
                  Text(
                    title,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 13.5,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textNavy,
                    ),
                  ),
                  const SizedBox(height: 2.0),

                  // Date
                  Row(
                    children: [
                      const Icon(
                        Icons.calendar_month_outlined,
                        size: 11.5,
                        color: Color(0xFF64748B),
                      ),
                      const SizedBox(width: 4.0),
                      Expanded(
                        child: Text(
                          date,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 10.5,
                            fontWeight: FontWeight.w500,
                            color: Color(0xFF64748B),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8.0),

                  // "Explore →" Pill Button
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.symmetric(vertical: 6.0),
                    decoration: BoxDecoration(
                      color: const Color(0xFFEEF2FF),
                      borderRadius: BorderRadius.circular(12.0),
                    ),
                    alignment: Alignment.center,
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          'Explore',
                          style: TextStyle(
                            fontSize: 11.5,
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF0056D2),
                          ),
                        ),
                        SizedBox(width: 4.0),
                        Icon(
                          Icons.arrow_forward_rounded,
                          size: 12.0,
                          color: Color(0xFF0056D2),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // --- Create Something New Section ---

  Widget _buildCreateSomethingNewSection() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Section Header with amber sparkle
          const Row(
            children: [
              Icon(
                Icons.auto_awesome_rounded,
                size: 18.0,
                color: Color(0xFFF59E0B),
              ),
              SizedBox(width: 8.0),
              Expanded(
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

          // 2 Equal Side-by-Side Cards (Festival Post & Panchayat Post)
          Row(
            children: [
              // Card 1: Festival Post
              Expanded(
                child: _buildCreateActionCard(
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

              // Card 2: Panchayat Post
              Expanded(
                child: _buildCreateActionCard(
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

  Widget _buildCreateActionCard({
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

            // Right Arrow Circle Button
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

  // --- Popular Templates Section ---

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
                          'View all',
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

  // --- Announcements Bottom Section ---

  Widget _buildAnnouncementsBottomSection() {
    final announcements = _adminFestivals
        .where((f) => f.isAnnouncement && f.showAtBottom && f.imageAsset.isNotEmpty)
        .toList();
    if (announcements.isEmpty) return const SizedBox.shrink();

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    width: 4,
                    height: 18,
                    decoration: BoxDecoration(
                      color: const Color(0xFF0056D2),
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                  const SizedBox(width: 8),
                  const Text(
                    'સત્તાવાર પરિપત્રો / જાહેરાતો',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w800,
                      color: AppColors.textNavy,
                    ),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: const Color(0xFFDBEAFE),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  '${announcements.length} સક્રિય',
                  style: const TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF1E40AF),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          SizedBox(
            height: 175,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              physics: const BouncingScrollPhysics(),
              itemCount: announcements.length,
              separatorBuilder: (_, _) => const SizedBox(width: 12),
              itemBuilder: (context, index) {
                final item = announcements[index];
                return GestureDetector(
                  onTap: () {
                    if (!item.isEditable) {
                      _showAnnouncementViewer(context, item);
                    } else {
                      Navigator.of(context).pushNamed(
                        AppRoutes.festivalDetail,
                        arguments: item,
                      );
                    }
                  },
                  child: Container(
                    width: 125,
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
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
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: Stack(
                            fit: StackFit.expand,
                            children: [
                              Image.network(
                                item.imageAsset,
                                fit: BoxFit.cover,
                                errorBuilder: (_, _, _) => Container(
                                  color: const Color(0xFFEFF6FF),
                                  child: const Center(
                                    child: Icon(
                                      Icons.description_outlined,
                                      color: Color(0xFF3B82F6),
                                      size: 32,
                                    ),
                                  ),
                                ),
                              ),
                              Positioned(
                                top: 6,
                                right: 6,
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: item.isEditable
                                        ? const Color(0xFF16A34A)
                                        : const Color(0xFF2563EB),
                                    borderRadius: BorderRadius.circular(4),
                                  ),
                                  child: Text(
                                    item.isEditable ? 'પોસ્ટર' : 'માહિતી',
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontSize: 9,
                                      fontWeight: FontWeight.w700,
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.fromLTRB(8, 6, 8, 8),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                item.name,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w700,
                                  color: Color(0xFF1E293B),
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                item.isEditable ? 'ફ્રેમ ઉમેરી શકાય છે' : 'માત્ર જુઓ અને શેર કરો',
                                style: TextStyle(
                                  fontSize: 10,
                                  color: item.isEditable
                                      ? const Color(0xFF15803D)
                                      : const Color(0xFF64748B),
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
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

  // --- Avatar Widget ---

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

  // --- Fixed Bottom Navigation Bar (5 tabs) ---

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

/// Subtle curved painter for soft pastel purple gradient at the top-right
class _HeaderCurvePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..shader = const LinearGradient(
        colors: [
          Color(0x30DDD6FE),
          Color(0x15EDE9FE),
          Colors.transparent,
        ],
        begin: Alignment.topRight,
        end: Alignment.bottomLeft,
      ).createShader(Rect.fromLTWH(0, 0, size.width, size.height));

    final path = Path()
      ..moveTo(size.width, 0)
      ..lineTo(size.width, size.height)
      ..quadraticBezierTo(
        size.width * 0.45,
        size.height * 0.85,
        0,
        0,
      )
      ..close();

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
