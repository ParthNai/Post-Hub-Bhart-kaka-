import 'package:flutter/material.dart';
import 'package:panchayat_post/core/constants/app_assets.dart';
import 'package:panchayat_post/core/constants/app_colors.dart';
import 'package:panchayat_post/core/localization/app_localizations.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';
import 'package:panchayat_post/features/auth/data/auth_service.dart';
import 'package:panchayat_post/features/auth/domain/models/user_profile.dart';
import 'package:panchayat_post/features/editor/domain/models/poster_template_project.dart';
import 'package:panchayat_post/features/festivals/data/services/festival_service.dart';
import 'package:panchayat_post/features/festivals/domain/models/festival_item.dart';

/// Screen 10: Festivals & Upcoming Events Listing
/// Redesigned to accurately match the approved Screen 10 UI reference image.
class FestivalsScreen extends StatefulWidget {
  const FestivalsScreen({
    super.key,
    this.authService,
    this.festivalService,
  });

  final AuthService? authService;
  final FestivalService? festivalService;

  @override
  State<FestivalsScreen> createState() => _FestivalsScreenState();
}

class _FestivalsScreenState extends State<FestivalsScreen> {
  late final AuthService _authService;
  late final FestivalService _festivalService;

  UserProfile? _currentUser;
  final TextEditingController _searchController = TextEditingController();
  final ScrollController _categoriesScrollController = ScrollController();

  String _selectedCategory = 'all';
  bool _upcomingOnly = false;
  int _unreadNotificationsCount = 2;
  int _selectedNavIndex = 1; // Festivals tab active (index 1)
  final int _heroCurrentPage = 0;

  @override
  void initState() {
    super.initState();
    _authService = widget.authService ?? AuthService();
    _festivalService = widget.festivalService ?? FestivalService();
    _loadUserProfile();
    _searchController.addListener(() {
      setState(() {});
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    _categoriesScrollController.dispose();
    super.dispose();
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
    if (index == 0) {
      Navigator.of(context).pushReplacementNamed(AppRoutes.home);
    } else if (index == 1) {
      setState(() => _selectedNavIndex = 1);
    } else if (index == 2) {
      _showAllTemplatesLibrary(context);
    } else if (index == 3) {
      Navigator.of(context).pushNamed(AppRoutes.myDesigns).then((_) {
        if (mounted) {
          setState(() => _selectedNavIndex = 1);
        }
      });
    } else if (index == 4) {
      Navigator.of(context).pushNamed(AppRoutes.profile).then((_) {
        if (mounted) {
          setState(() => _selectedNavIndex = 1);
        }
      });
    }
  }

  // --- Modals and Sheets ---

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
            const Divider(),
            const ListTile(
              contentPadding: EdgeInsets.zero,
              leading: CircleAvatar(
                backgroundColor: Color(0xFFEDE9FE),
                child: Icon(Icons.celebration_rounded, color: Color(0xFF6D28D9)),
              ),
              title: Text(
                'નવરાત્રી સ્પેશિયલ પોસ્ટર ટેમ્પલેટ ઉપલબ્ધ છે!',
                style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13.5),
              ),
              subtitle: Text(
                'તમારા ગામ માટે સુંદર દાંડિયા રાસ પોસ્ટર બનાવો.',
                style: TextStyle(fontSize: 12.0),
              ),
              trailing: Text(
                '10m ago',
                style: TextStyle(fontSize: 11.0, color: Color(0xFF94A3B8)),
              ),
            ),
            const ListTile(
              contentPadding: EdgeInsets.zero,
              leading: CircleAvatar(
                backgroundColor: Color(0xFFFEF3C7),
                child: Icon(Icons.campaign_rounded, color: Color(0xFFD97706)),
              ),
              title: Text(
                'દિવાળી પોસ્ટર ડિઝાઇન કલેક્શન લાઇવ થયું',
                style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13.5),
              ),
              subtitle: Text(
                'શુભકામના સંદેશ સાથે તમારું નામ અને ફોટો જોડો.',
                style: TextStyle(fontSize: 12.0),
              ),
              trailing: Text(
                '1h ago',
                style: TextStyle(fontSize: 11.0, color: Color(0xFF94A3B8)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showFilterModal(BuildContext context) {
    final strings = LocaleScope.of(context).strings;
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24.0)),
      ),
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setModalState) => Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 20.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Row(
                      children: [
                        const Icon(Icons.tune_rounded, color: Color(0xFF6D28D9)),
                        const SizedBox(width: 8.0),
                        Flexible(
                          child: Text(
                            strings.filterTitle,
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
                      setState(() {
                        _selectedCategory = 'all';
                        _upcomingOnly = false;
                        _searchController.clear();
                      });
                      Navigator.of(ctx).pop();
                    },
                    child: const Text(
                      'Reset All',
                      style: TextStyle(
                        color: Color(0xFF6D28D9),
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                ],
              ),
              const Divider(),
              const SizedBox(height: 8.0),
              const Text(
                'Filter by Status',
                style: TextStyle(
                  fontWeight: FontWeight.w700,
                  fontSize: 14.0,
                  color: AppColors.textNavy,
                ),
              ),
              const SizedBox(height: 8.0),
              SwitchListTile(
                contentPadding: EdgeInsets.zero,
                activeThumbColor: const Color(0xFF6D28D9),
                title: Text(strings.filterUpcomingOnly),
                value: _upcomingOnly,
                onChanged: (val) {
                  setModalState(() => _upcomingOnly = val);
                  setState(() => _upcomingOnly = val);
                },
              ),
              const SizedBox(height: 12.0),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF6D28D9),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 12.0),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12.0),
                  ),
                ),
                onPressed: () => Navigator.of(ctx).pop(),
                child: const Text(
                  'Apply Filter',
                  style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14.5),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showCalendarSheet(BuildContext context) {
    final allFestivals = [
      ..._festivalService.getUpcomingFestivals(),
      ..._festivalService.getExploreAllFestivals(),
    ];

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24.0)),
      ),
      builder: (ctx) => DraggableScrollableSheet(
        initialChildSize: 0.72,
        minChildSize: 0.45,
        maxChildSize: 0.95,
        expand: false,
        builder: (_, scrollController) => Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: const Color(0xFFCBD5E1),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 14.0),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Expanded(
                    child: Row(
                      children: [
                        Icon(Icons.calendar_month_rounded,
                            color: Color(0xFF6D28D9), size: 24.0),
                        SizedBox(width: 8.0),
                        Flexible(
                          child: Text(
                            'Festival Calendar 2026',
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(
                              fontSize: 18.0,
                              fontWeight: FontWeight.w800,
                              color: AppColors.textNavy,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close_rounded),
                    onPressed: () => Navigator.of(ctx).pop(),
                  ),
                ],
              ),
              const Divider(),
              Expanded(
                child: ListView.separated(
                  controller: scrollController,
                  itemCount: allFestivals.length,
                  separatorBuilder: (context, index) => const Divider(height: 1),
                  itemBuilder: (_, index) {
                    final item = allFestivals[index];
                    return ListTile(
                      contentPadding: const EdgeInsets.symmetric(vertical: 4.0),
                      leading: ClipRRect(
                        borderRadius: BorderRadius.circular(8.0),
                        child: Image.asset(
                          item.imageAsset,
                          width: 46.0,
                          height: 46.0,
                          fit: BoxFit.cover,
                          errorBuilder: (_, error, stackTrace) => Container(
                            width: 46.0,
                            height: 46.0,
                            color: const Color(0xFFEDE9FE),
                            child: const Icon(Icons.celebration, color: Color(0xFF6D28D9)),
                          ),
                        ),
                      ),
                      title: Text(
                        item.name,
                        style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14.5),
                      ),
                      subtitle: Text(
                        '${item.nameGu} • ${item.categoryName}',
                        style: const TextStyle(fontSize: 12.0),
                      ),
                      trailing: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 4.0),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF3E8FF),
                          borderRadius: BorderRadius.circular(12.0),
                        ),
                        child: Text(
                          item.dateDisplay,
                          style: const TextStyle(
                            color: Color(0xFF6D28D9),
                            fontSize: 11.5,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                      onTap: () {
                        Navigator.of(ctx).pop();
                        Navigator.of(context).pushNamed(
                          AppRoutes.festivalDetail,
                          arguments: item,
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

  void _showAllTemplatesLibrary(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24.0)),
      ),
      builder: (ctx) => DraggableScrollableSheet(
        initialChildSize: 0.8,
        minChildSize: 0.5,
        maxChildSize: 0.95,
        expand: false,
        builder: (_, scrollController) => Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: const Color(0xFFCBD5E1),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 14.0),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'All Poster Templates',
                    style: TextStyle(
                      fontSize: 18.0,
                      fontWeight: FontWeight.w800,
                      color: AppColors.textNavy,
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close_rounded),
                    onPressed: () => Navigator.of(ctx).pop(),
                  ),
                ],
              ),
              const Divider(),
              Expanded(
                child: GridView.count(
                  controller: scrollController,
                  crossAxisCount: 2,
                  crossAxisSpacing: 12.0,
                  mainAxisSpacing: 12.0,
                  childAspectRatio: 0.75,
                  children: [
                    _buildTemplateItem('શુભ નવરાત્રી', AppAssets.homeFestivalNavratriCard),
                    _buildTemplateItem('સ્વાતંત્ર્ય દિન', AppAssets.homeFestivalIndependenceCard),
                    _buildTemplateItem('દીપોત્સવ દિવાળી', AppAssets.homeFestivalDiwaliCard),
                    _buildTemplateItem('ગણેશ ઉત્સવ', AppAssets.homeFestivalGaneshCard),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTemplateItem(String title, String asset) {
    return GestureDetector(
      onTap: () {
        Navigator.of(context).pop();
        final project = PosterTemplateProject.createDefaultNavratriProject(
          templateId: 'tpl_${title.toLowerCase().replaceAll(' ', '_')}',
          imageAsset: asset,
          title: title,
        );
        Navigator.of(context).pushNamed(
          AppRoutes.posterEditor,
          arguments: project,
        );
      },
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(14.0),
          border: Border.all(color: const Color(0xFFE2E8F0)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.04),
              blurRadius: 6,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(14.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Expanded(
                child: Image.asset(
                  asset,
                  fit: BoxFit.cover,
                  errorBuilder: (_, error, stackTrace) => Container(
                    color: const Color(0xFFEDE9FE),
                    child: const Icon(Icons.image, color: Color(0xFF6D28D9)),
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
      ),
    );
  }

  void _showFestivalTemplatesModal(BuildContext context, FestivalItem festival) {
    Navigator.of(context).pushNamed(
      AppRoutes.festivalDetail,
      arguments: festival,
    );
  }

  // --- Main Build ---

  @override
  Widget build(BuildContext context) {
    final strings = LocaleScope.of(context).strings;
    final categories = _festivalService.getCategories();

    final query = _searchController.text.trim();
    final bool isFiltering =
        query.isNotEmpty || _selectedCategory != 'all' || _upcomingOnly;
    final displayedFestivals = isFiltering
        ? _festivalService.searchFestivals(
            query: query,
            categoryFilter: _selectedCategory,
            upcomingOnly: _upcomingOnly,
          )
        : _festivalService.getUpcomingFestivals();

    final featuredFestival = _festivalService.getFeaturedFestival();

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: Column(
          children: [
            // 1. Redesigned Premium Header
            _buildHeader(strings),

            // Scrollable Content
            Expanded(
              child: SingleChildScrollView(
                physics: const BouncingScrollPhysics(),
                padding: const EdgeInsets.only(bottom: 16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 10.0),

                    // 2. Search Bar & Filter Button
                    _buildSearchBar(strings),

                    const SizedBox(height: 14.0),

                    // 3. Featured Festival Hero Banner
                    _buildHeroBanner(featuredFestival),

                    const SizedBox(height: 18.0),

                    // 4. Explore Categories Section
                    _buildCategoriesSection(strings, categories),

                    const SizedBox(height: 20.0),

                    // 5. Upcoming Festivals Section (2-Column Grid)
                    _buildUpcomingFestivalsSection(strings, displayedFestivals),

                    const SizedBox(height: 16.0),
                  ],
                ),
              ),
            ),

            // 6. Modern Pill Bottom Navigation Bar
            _buildBottomNavigationBar(strings),
          ],
        ),
      ),
    );
  }

  // --- 1. Redesigned Header ---

  Widget _buildHeader(AppStrings strings) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 10.0),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(
          bottom: BorderSide(color: Color(0xFFF1F5F9), width: 1.0),
        ),
      ),
      child: Row(
        children: [
          // A. Back Button
          InkWell(
            key: const Key('festival_back_button'),
            onTap: () => Navigator.of(context).pop(),
            borderRadius: BorderRadius.circular(12.0),
            child: Container(
              width: 38.0,
              height: 38.0,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12.0),
                border: Border.all(color: const Color(0xFFE2E8F0)),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.03),
                    blurRadius: 4,
                    offset: const Offset(0, 1),
                  ),
                ],
              ),
              alignment: Alignment.center,
              child: const Icon(
                Icons.arrow_back_rounded,
                size: 20.0,
                color: Color(0xFF4C1D95),
              ),
            ),
          ),
          const SizedBox(width: 10.0),

          // B. Original Panchayat Post Logo (Strict requirement: NO text beside it)
          Container(
            width: 40.0,
            height: 40.0,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: Colors.white,
              border: Border.all(color: const Color(0xFFEDE9FE), width: 1.5),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF6D28D9).withValues(alpha: 0.08),
                  blurRadius: 6,
                  offset: const Offset(0, 1),
                ),
              ],
            ),
            padding: const EdgeInsets.all(2.5),
            child: Image.asset(
              AppAssets.panchayatLogo,
              fit: BoxFit.contain,
              errorBuilder: (_, error, stackTrace) => const Icon(
                Icons.account_balance_rounded,
                size: 22.0,
                color: Color(0xFF0055B8),
              ),
            ),
          ),
          const SizedBox(width: 10.0),

          // C. Page Title & Subtitle
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  strings.festivalsPageTitle,
                  style: const TextStyle(
                    fontSize: 17.5,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF1E1B4B),
                    height: 1.15,
                  ),
                ),
                const SizedBox(height: 1.5),
                Text(
                  strings.festivalsPageSubtitle,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 11.2,
                    fontWeight: FontWeight.w500,
                    color: Color(0xFF64748B),
                    height: 1.15,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8.0),

          // D. Notification Bell Button
          InkWell(
            onTap: () => _showNotificationsSheet(context),
            borderRadius: BorderRadius.circular(20.0),
            child: Container(
              width: 38.0,
              height: 38.0,
              decoration: const BoxDecoration(
                color: Color(0xFFF3E8FF),
                shape: BoxShape.circle,
              ),
              child: Stack(
                clipBehavior: Clip.none,
                alignment: Alignment.center,
                children: [
                  const Icon(
                    Icons.notifications_none_rounded,
                    size: 21.0,
                    color: Color(0xFF6D28D9),
                  ),
                  if (_unreadNotificationsCount > 0)
                    Positioned(
                      top: 1,
                      right: 2,
                      child: Container(
                        padding: const EdgeInsets.all(3.0),
                        decoration: const BoxDecoration(
                          color: Color(0xFFEF4444),
                          shape: BoxShape.circle,
                        ),
                        child: Text(
                          '$_unreadNotificationsCount',
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
          const SizedBox(width: 8.0),

          // E. Profile Avatar
          GestureDetector(
            onTap: () => Navigator.of(context).pushNamed(AppRoutes.profile),
            child: Container(
              padding: const EdgeInsets.all(1.5),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(color: const Color(0xFF7C3AED), width: 1.5),
              ),
              child: CircleAvatar(
                radius: 17.0,
                backgroundImage: AssetImage(
                  _currentUser?.profilePhotoUrl ?? AppAssets.homeAvatarRahul,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // --- 2. Search Bar & Filter ---

  Widget _buildSearchBar(AppStrings strings) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Row(
        children: [
          // Search Field
          Expanded(
            child: Container(
              height: 48.0,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(24.0),
                border: Border.all(color: const Color(0xFFE2E8F0)),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.02),
                    blurRadius: 6,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Row(
                children: [
                  const SizedBox(width: 14.0),
                  const Icon(
                    Icons.search_rounded,
                    size: 21.0,
                    color: Color(0xFF6D28D9),
                  ),
                  const SizedBox(width: 10.0),
                  Expanded(
                    child: TextField(
                      controller: _searchController,
                      style: const TextStyle(
                        fontSize: 13.5,
                        color: AppColors.textNavy,
                      ),
                      decoration: InputDecoration(
                        hintText: strings.searchFestivalsHint,
                        hintStyle: const TextStyle(
                          fontSize: 13.0,
                          color: Color(0xFF94A3B8),
                          fontWeight: FontWeight.w400,
                        ),
                        border: InputBorder.none,
                        isDense: true,
                        contentPadding: EdgeInsets.zero,
                      ),
                    ),
                  ),
                  if (_searchController.text.isNotEmpty)
                    GestureDetector(
                      onTap: () => setState(() => _searchController.clear()),
                      child: const Padding(
                        padding: EdgeInsets.symmetric(horizontal: 8.0),
                        child: Icon(
                          Icons.close_rounded,
                          size: 18.0,
                          color: Color(0xFF94A3B8),
                        ),
                      ),
                    )
                  else
                    const Padding(
                      padding: EdgeInsets.symmetric(horizontal: 12.0),
                      child: Icon(
                        Icons.chevron_right_rounded,
                        color: Color(0xFFCBD5E1),
                        size: 20.0,
                      ),
                    ),
                ],
              ),
            ),
          ),
          const SizedBox(width: 10.0),

          // Filter Button
          InkWell(
            onTap: () => _showFilterModal(context),
            borderRadius: BorderRadius.circular(16.0),
            child: Container(
              width: 48.0,
              height: 48.0,
              decoration: BoxDecoration(
                color: const Color(0xFFF3E8FF),
                borderRadius: BorderRadius.circular(16.0),
                border: Border.all(color: const Color(0xFFEDE9FE)),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF6D28D9).withValues(alpha: 0.08),
                    blurRadius: 4,
                    offset: const Offset(0, 1),
                  ),
                ],
              ),
              alignment: Alignment.center,
              child: const Icon(
                Icons.tune_rounded,
                size: 22.0,
                color: Color(0xFF6D28D9),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // --- 3. Hero Celebration Banner ---

  Widget _buildHeroBanner(FestivalItem festival) {
    return Column(
      children: [
        Container(
          margin: const EdgeInsets.symmetric(horizontal: 16.0),
          height: 180.0,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(22.0),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFFD97706).withValues(alpha: 0.18),
                blurRadius: 14,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(22.0),
            child: Stack(
              fit: StackFit.expand,
              children: [
                // Background festive image
                Image.asset(
                  AppAssets.homeBannerNavratriHero,
                  fit: BoxFit.cover,
                  alignment: Alignment.center,
                  errorBuilder: (_, error, stackTrace) => Container(
                    decoration: const BoxDecoration(
                      gradient: LinearGradient(
                        colors: [Color(0xFFFEF3C7), Color(0xFFFDE68A)],
                      ),
                    ),
                  ),
                ),

                // Warm gradient overlay on right side for text contrast
                Positioned.fill(
                  child: Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          Colors.transparent,
                          const Color(0xFFFFFBEB).withValues(alpha: 0.45),
                          const Color(0xFFFEF3C7).withValues(alpha: 0.94),
                        ],
                        stops: const [0.0, 0.40, 0.72],
                        begin: Alignment.centerLeft,
                        end: Alignment.centerRight,
                      ),
                    ),
                  ),
                ),

                // Content on right half
                Positioned(
                  right: 16.0,
                  top: 14.0,
                  bottom: 14.0,
                  width: 195.0,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Pill: UPCOMING FESTIVAL
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8.0,
                              vertical: 3.5,
                            ),
                            decoration: BoxDecoration(
                              color: const Color(0xFF6D28D9),
                              borderRadius: BorderRadius.circular(12.0),
                            ),
                            child: const Text(
                              'UPCOMING FESTIVAL',
                              style: TextStyle(
                                fontSize: 9.0,
                                fontWeight: FontWeight.w800,
                                color: Colors.white,
                                letterSpacing: 0.4,
                              ),
                            ),
                          ),
                          const SizedBox(height: 5.0),

                          // Navratri Celebration title
                          const Text(
                            'Navratri',
                            style: TextStyle(
                              fontFamily: 'serif',
                              fontSize: 22.0,
                              fontWeight: FontWeight.w900,
                              color: Color(0xFF831843), // Deep Maroon/Crimson
                              height: 1.05,
                            ),
                          ),
                          const Text(
                            'Celebration',
                            style: TextStyle(
                              fontFamily: 'serif',
                              fontSize: 20.0,
                              fontStyle: FontStyle.italic,
                              fontWeight: FontWeight.w700,
                              color: Color(0xFF831843),
                              height: 1.05,
                            ),
                          ),
                          const SizedBox(height: 4.0),

                          // Subtitle
                          const Text(
                            'Explore beautiful festive designs',
                            style: TextStyle(
                              fontSize: 10.5,
                              color: Color(0xFF1E293B),
                              fontWeight: FontWeight.w500,
                              height: 1.2,
                            ),
                          ),
                        ],
                      ),

                      // View Designs button
                      InkWell(
                        onTap: () => _showFestivalTemplatesModal(context, festival),
                        borderRadius: BorderRadius.circular(20.0),
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 14.0,
                            vertical: 7.0,
                          ),
                          decoration: BoxDecoration(
                            color: const Color(0xFF6D28D9),
                            borderRadius: BorderRadius.circular(20.0),
                            boxShadow: [
                              BoxShadow(
                                color: const Color(0xFF6D28D9).withValues(alpha: 0.35),
                                blurRadius: 6,
                                offset: const Offset(0, 2),
                              ),
                            ],
                          ),
                          child: const Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(
                                'View Designs',
                                style: TextStyle(
                                  fontSize: 11.5,
                                  fontWeight: FontWeight.w700,
                                  color: Colors.white,
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
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 8.0),

        // Pagination Dots
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(5, (index) {
            final isActive = index == _heroCurrentPage;
            return Container(
              margin: const EdgeInsets.symmetric(horizontal: 2.5),
              width: isActive ? 22.0 : 6.0,
              height: 6.0,
              decoration: BoxDecoration(
                color: isActive
                    ? const Color(0xFF6D28D9)
                    : const Color(0xFFEDE9FE),
                borderRadius: BorderRadius.circular(3.0),
              ),
            );
          }),
        ),
      ],
    );
  }

  // --- 4. Explore Categories ---

  Widget _buildCategoriesSection(
      AppStrings strings, List<FestivalCategory> categories) {
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
                height: 16.0,
                decoration: BoxDecoration(
                  color: const Color(0xFF6D28D9),
                  borderRadius: BorderRadius.circular(2.0),
                ),
              ),
              const SizedBox(width: 8.0),
              Expanded(
                child: Text(
                  strings.exploreCategoriesTitle,
                  style: const TextStyle(
                    fontSize: 16.0,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF1E293B),
                  ),
                ),
              ),
              InkWell(
                onTap: () {
                  setState(() => _selectedCategory = 'all');
                },
                child: const Row(
                  children: [
                    Text(
                      'See All',
                      style: TextStyle(
                        fontSize: 12.5,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF6D28D9),
                      ),
                    ),
                    SizedBox(width: 2.0),
                    Icon(
                      Icons.arrow_forward_rounded,
                      size: 13.0,
                      color: Color(0xFF6D28D9),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12.0),

        // Horizontal Category Cards
        SizedBox(
          height: 76.0,
          child: ListView.separated(
            controller: _categoriesScrollController,
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            physics: const BouncingScrollPhysics(),
            itemCount: categories.length,
            separatorBuilder: (context, index) => const SizedBox(width: 10.0),
            itemBuilder: (context, index) {
              final cat = categories[index];
              final isSelected = _selectedCategory == cat.id;

              return InkWell(
                onTap: () {
                  setState(() {
                    _selectedCategory = cat.id;
                  });
                },
                borderRadius: BorderRadius.circular(16.0),
                child: Container(
                  width: 78.0,
                  decoration: BoxDecoration(
                    color: isSelected
                        ? const Color(0xFF6D28D9)
                        : const Color(0xFFF3E8FF),
                    borderRadius: BorderRadius.circular(16.0),
                    boxShadow: isSelected
                        ? [
                            BoxShadow(
                              color: const Color(0xFF6D28D9).withValues(alpha: 0.28),
                              blurRadius: 8,
                              offset: const Offset(0, 3),
                            ),
                          ]
                        : null,
                  ),
                  padding: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 4.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(
                        cat.icon ?? Icons.celebration_rounded,
                        size: 22.0,
                        color: isSelected ? Colors.white : const Color(0xFF6D28D9),
                      ),
                      const SizedBox(height: 4.0),
                      Text(
                        cat.name,
                        textAlign: TextAlign.center,
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontSize: 10.2,
                          fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                          color: isSelected ? Colors.white : const Color(0xFF1E293B),
                          height: 1.15,
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
    );
  }

  // --- 5. Upcoming Festivals (2-Column Grid) ---

  Widget _buildUpcomingFestivalsSection(
      AppStrings strings, List<FestivalItem> festivals) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Section Header + View Calendar Action
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: Row(
            children: [
              Container(
                width: 4.0,
                height: 16.0,
                decoration: BoxDecoration(
                  color: const Color(0xFF6D28D9),
                  borderRadius: BorderRadius.circular(2.0),
                ),
              ),
              const SizedBox(width: 8.0),
              Expanded(
                child: Text(
                  strings.upcomingFestivalsHeader,
                  style: const TextStyle(
                    fontSize: 16.0,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF1E293B),
                  ),
                ),
              ),
              InkWell(
                onTap: () => _showCalendarSheet(context),
                borderRadius: BorderRadius.circular(20.0),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 5.0),
                  decoration: BoxDecoration(
                    color: const Color(0xFFEDE9FE),
                    borderRadius: BorderRadius.circular(20.0),
                  ),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        Icons.calendar_month_outlined,
                        size: 13.0,
                        color: Color(0xFF6D28D9),
                      ),
                      SizedBox(width: 4.0),
                      Text(
                        'View Calendar',
                        style: TextStyle(
                          fontSize: 11.2,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF6D28D9),
                        ),
                      ),
                      SizedBox(width: 2.0),
                      Icon(
                        Icons.arrow_forward_rounded,
                        size: 12.0,
                        color: Color(0xFF6D28D9),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12.0),

        if (festivals.isEmpty)
          Padding(
            padding: const EdgeInsets.all(28.0),
            child: Center(
              child: Column(
                children: [
                  const Icon(
                    Icons.search_off_rounded,
                    size: 42.0,
                    color: Color(0xFF94A3B8),
                  ),
                  const SizedBox(height: 8.0),
                  Text(
                    strings.noFestivalsFound,
                    style: const TextStyle(
                      fontSize: 14.0,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF64748B),
                    ),
                  ),
                  const SizedBox(height: 10.0),
                  TextButton(
                    onPressed: () {
                      setState(() {
                        _searchController.clear();
                        _selectedCategory = 'all';
                        _upcomingOnly = false;
                      });
                    },
                    child: Text(strings.clearSearchAction),
                  ),
                ],
              ),
            ),
          )
        else
          // 2-Column Grid
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: festivals.length,
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 12.0,
                mainAxisSpacing: 14.0,
                childAspectRatio: 0.72,
              ),
              itemBuilder: (context, index) {
                final item = festivals[index];
                return _buildFestivalGridCard(strings, item);
              },
            ),
          ),
      ],
    );
  }

  Widget _buildFestivalGridCard(AppStrings strings, FestivalItem item) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16.0),
        border: Border.all(color: const Color(0xFFF1F5F9)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 1. Dedicated Poster Image Container (Entire artwork visible)
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(12.0),
              child: AspectRatio(
                aspectRatio: 1.25,
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    Image.asset(
                      item.imageAsset,
                      fit: BoxFit.cover,
                      errorBuilder: (_, error, stackTrace) => Container(
                        color: const Color(0xFFEDE9FE),
                        alignment: Alignment.center,
                        child: Text(
                          item.name,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontSize: 12.0,
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF6D28D9),
                          ),
                        ),
                      ),
                    ),
                    if (item.isUpcoming)
                      Positioned(
                        top: 6.0,
                        right: 6.0,
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 6.0,
                            vertical: 2.5,
                          ),
                          decoration: BoxDecoration(
                            color: const Color(0xFF6D28D9),
                            borderRadius: BorderRadius.circular(8.0),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withValues(alpha: 0.20),
                                blurRadius: 3,
                                offset: const Offset(0, 1),
                              ),
                            ],
                          ),
                          child: const Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(
                                Icons.calendar_month_rounded,
                                size: 10.0,
                                color: Colors.white,
                              ),
                              SizedBox(width: 3.0),
                              Text(
                                'Upcoming',
                                style: TextStyle(
                                  fontSize: 9.0,
                                  fontWeight: FontWeight.w700,
                                  color: Colors.white,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                  ],
                ),
              ),
            ),
          ),

          // 2. Festival Title
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 10.0),
            child: Text(
              item.name,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                fontSize: 13.5,
                fontWeight: FontWeight.w800,
                color: Color(0xFF1E293B),
              ),
            ),
          ),
          const SizedBox(height: 3.0),

          // 3. Festival Date
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 10.0),
            child: Row(
              children: [
                const Icon(
                  Icons.calendar_today_outlined,
                  size: 11.0,
                  color: Color(0xFF64748B),
                ),
                const SizedBox(width: 4.0),
                Expanded(
                  child: Text(
                    item.dateDisplay,
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
          ),

          const Spacer(),

          // 4. View Designs Button
          Padding(
            padding: const EdgeInsets.fromLTRB(10.0, 0, 10.0, 10.0),
            child: InkWell(
              onTap: () => _showFestivalTemplatesModal(context, item),
              borderRadius: BorderRadius.circular(10.0),
              child: Container(
                width: double.infinity,
                height: 32.0,
                decoration: BoxDecoration(
                  color: const Color(0xFFEDE9FE),
                  borderRadius: BorderRadius.circular(10.0),
                ),
                alignment: Alignment.center,
                padding: const EdgeInsets.symmetric(horizontal: 4.0),
                child: const FittedBox(
                  fit: BoxFit.scaleDown,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        'View Designs',
                        style: TextStyle(
                          fontSize: 11.0,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF6D28D9),
                        ),
                      ),
                      SizedBox(width: 4.0),
                      Icon(
                        Icons.arrow_forward_rounded,
                        size: 12.0,
                        color: Color(0xFF6D28D9),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // --- 6. Bottom Navigation Bar ---

  Widget _buildBottomNavigationBar(AppStrings strings) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(
          top: BorderSide(color: Color(0xFFF1F5F9), width: 1.0),
        ),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 4.0, vertical: 6.0),
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
              icon: Icons.calendar_month_rounded,
            ),
          ),
          Expanded(
            child: _buildNavItem(
              index: 2,
              label: strings.navTemplates,
              icon: Icons.grid_view_rounded,
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
    final color = isSelected ? const Color(0xFF6D28D9) : const Color(0xFF64748B);

    return InkWell(
      onTap: () => _onNavTapped(index),
      borderRadius: BorderRadius.circular(16.0),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 4.0, vertical: 6.0),
        decoration: isSelected
            ? BoxDecoration(
                color: const Color(0xFFEDE9FE),
                borderRadius: BorderRadius.circular(20.0),
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
