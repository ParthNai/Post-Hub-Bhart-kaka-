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

/// Screen 10: Festival & Upcoming Events Listing
/// Matching the approved Screen 10 UI reference image with high fidelity.
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
  final ScrollController _exploreScrollController = ScrollController();

  String _selectedCategory = 'all';
  bool _upcomingOnly = false;
  int _unreadNotificationsCount = 2;
  int _selectedNavIndex = 1; // Festivals tab active (index 1)

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
    _exploreScrollController.dispose();
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
      Navigator.of(context).pop();
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
                  child: const Text('Mark all read',
                      style: TextStyle(
                          color: Color(0xFF6D28D9),
                          fontWeight: FontWeight.w600)),
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
              title: Text('નવરાત્રી સ્પેશિયલ પોસ્ટર ટેમ્પલેટ ઉપલબ્ધ છે!',
                  style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13.5)),
              subtitle: Text('તમારા ગામ માટે સુંદર દાંડિયા રાસ પોસ્ટર બનાવો.',
                  style: TextStyle(fontSize: 12.0)),
              trailing: Text('10m ago',
                  style: TextStyle(fontSize: 11.0, color: Color(0xFF94A3B8))),
            ),
            const ListTile(
              contentPadding: EdgeInsets.zero,
              leading: CircleAvatar(
                backgroundColor: Color(0xFFFEF3C7),
                child: Icon(Icons.campaign_rounded, color: Color(0xFFD97706)),
              ),
              title: Text('દિવાળી પોસ્ટર ડિઝાઇન કલેક્શન લાઇવ થયું',
                  style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13.5)),
              subtitle: Text('શુભકામના સંદેશ સાથે તમારું નામ અને ફોટો જોડો.',
                  style: TextStyle(fontSize: 12.0)),
              trailing: Text('1h ago',
                  style: TextStyle(fontSize: 11.0, color: Color(0xFF94A3B8))),
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
                    child: const Text('Reset All',
                        style: TextStyle(
                            color: Color(0xFF6D28D9),
                            fontWeight: FontWeight.w700)),
                  ),
                ],
              ),
              const Divider(),
              const SizedBox(height: 8.0),
              const Text('Filter by Status',
                  style: TextStyle(
                      fontWeight: FontWeight.w700,
                      fontSize: 14.0,
                      color: AppColors.textNavy)),
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
              const SizedBox(height: 16.0),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF6D28D9),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14.0),
                  ),
                  padding: const EdgeInsets.symmetric(vertical: 13.0),
                ),
                onPressed: () => Navigator.of(ctx).pop(),
                child: const Text('Apply Filter',
                    style: TextStyle(fontWeight: FontWeight.w700)),
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
        initialChildSize: 0.75,
        maxChildSize: 0.95,
        minChildSize: 0.5,
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
                        ),
                      ),
                      title: Text(item.name,
                          style: const TextStyle(
                              fontWeight: FontWeight.w700, fontSize: 14.5)),
                      subtitle: Text('${item.nameGu} • ${item.categoryName}',
                          style: const TextStyle(fontSize: 12.0)),
                      trailing: Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 10.0, vertical: 5.0),
                        decoration: BoxDecoration(
                          color: const Color(0xFFEDE9FE),
                          borderRadius: BorderRadius.circular(12.0),
                        ),
                        child: Text(
                          item.dateDisplay,
                          style: const TextStyle(
                            fontSize: 11.5,
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF6D28D9),
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

  void _showFestivalTemplatesModal(BuildContext context, FestivalItem festival) {
    final nameController = TextEditingController(
      text: _currentUser?.effectiveDisplayName ?? 'Panchayat Post User',
    );
    final villageController = TextEditingController(
      text: _currentUser?.villageCity ?? 'Gram Panchayat',
    );

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24.0)),
      ),
      builder: (ctx) => Padding(
        padding: EdgeInsets.only(
          left: 20.0,
          right: 20.0,
          top: 18.0,
          bottom: MediaQuery.of(ctx).viewInsets.bottom + 20.0,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    '${festival.name} Poster Designs',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 17.0,
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
            const SizedBox(height: 8.0),
            ClipRRect(
              borderRadius: BorderRadius.circular(14.0),
              child: Image.asset(
                festival.imageAsset,
                height: 120.0,
                width: double.infinity,
                fit: BoxFit.cover,
              ),
            ),
            const SizedBox(height: 12.0),
            TextField(
              controller: nameController,
              decoration: InputDecoration(
                labelText: 'તમારું નામ (Your Name)',
                filled: true,
                fillColor: const Color(0xFFF8FAFC),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12.0),
                ),
              ),
            ),
            const SizedBox(height: 10.0),
            TextField(
              controller: villageController,
              decoration: InputDecoration(
                labelText: 'ગામનું નામ (Village / Panchayat)',
                filled: true,
                fillColor: const Color(0xFFF8FAFC),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12.0),
                ),
              ),
            ),
            const SizedBox(height: 14.0),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF6D28D9),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12.0),
                      ),
                      padding: const EdgeInsets.symmetric(vertical: 12.0),
                    ),
                    icon: const Icon(Icons.edit_rounded, size: 18.0),
                    label: const Text('Open in Poster Editor Studio',
                        style: TextStyle(fontWeight: FontWeight.w700, fontSize: 12)),
                    onPressed: () {
                      Navigator.of(ctx).pop();
                      final project = PosterTemplateProject.createFromFestivalTemplate(
                        templateId: 'festival_${festival.id}',
                        imageAsset: festival.imageAsset,
                        title: festival.name,
                      );
                      Navigator.of(context).pushNamed(
                        AppRoutes.posterEditor,
                        arguments: project,
                      );
                    },
                  ),
                ),
                const SizedBox(width: 8.0),
                Expanded(
                  child: OutlinedButton.icon(
                    style: OutlinedButton.styleFrom(
                      foregroundColor: const Color(0xFF6D28D9),
                      side: const BorderSide(color: Color(0xFF6D28D9)),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12.0),
                      ),
                      padding: const EdgeInsets.symmetric(vertical: 12.0),
                    ),
                    icon: const Icon(Icons.download_rounded, size: 18.0),
                    label: const Text('Download / Share Poster',
                        style: TextStyle(fontWeight: FontWeight.w700, fontSize: 12)),
                    onPressed: () {
                      Navigator.of(ctx).pop();
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('Poster for ${festival.name} ready for download!'),
                          backgroundColor: const Color(0xFF059669),
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
          ],
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
        maxChildSize: 0.95,
        expand: false,
        builder: (_, scrollController) => Padding(
          padding: const EdgeInsets.symmetric(horizontal: 18.0, vertical: 16.0),
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
                    child: Text(
                      'All Festival Templates',
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
              const SizedBox(height: 10.0),
              Expanded(
                child: GridView.count(
                  controller: scrollController,
                  crossAxisCount: 2,
                  crossAxisSpacing: 12.0,
                  mainAxisSpacing: 12.0,
                  childAspectRatio: 0.9,
                  children: [
                    _buildTemplateItem('Navratri Utsav', AppAssets.festivalNavratriMaa),
                    _buildTemplateItem('Happy Diwali', AppAssets.festivalDiwaliDiyas),
                    _buildTemplateItem('Bhai Beej', AppAssets.festivalBhaiBeej),
                    _buildTemplateItem('Christmas Celebration', AppAssets.festivalChristmasSanta),
                    _buildTemplateItem('Makar Sankranti', AppAssets.festivalAllMakarSankranti),
                    _buildTemplateItem('Holi Dhuleti', AppAssets.festivalAllHoli),
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
        final project = PosterTemplateProject.createFromFestivalTemplate(
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
                child: Image.asset(asset, fit: BoxFit.cover),
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

  void _showProfileDrawer(BuildContext context) {
    final strings = LocaleScope.of(context).strings;
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24.0)),
      ),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 22.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
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
            const SizedBox(height: 16.0),
            _buildAvatarWidget(size: 64.0),
            const SizedBox(height: 10.0),
            Text(
              _currentUser?.effectiveDisplayName ?? 'Rahul Patel',
              style: const TextStyle(
                fontSize: 18.0,
                fontWeight: FontWeight.w800,
                color: AppColors.textNavy,
              ),
            ),
            Text(
              '@${_currentUser?.username ?? 'rahul17'} • ${_currentUser?.villageCity ?? 'Palanpur, Gujarat'}',
              style: const TextStyle(fontSize: 13.0, color: Color(0xFF64748B)),
            ),
            const SizedBox(height: 16.0),
            const Divider(),
            ListTile(
              leading: const Icon(Icons.edit_outlined, color: Color(0xFF6D28D9)),
              title: Text(strings.editProfileButton,
                  style: const TextStyle(fontWeight: FontWeight.w600)),
              trailing: const Icon(Icons.chevron_right_rounded),
              onTap: () {
                Navigator.of(ctx).pop();
                Navigator.of(context).pushNamed(AppRoutes.profileSetup);
              },
            ),
            ListTile(
              leading: const Icon(Icons.arrow_back_rounded, color: Color(0xFF6D28D9)),
              title: const Text('Back to Home Dashboard',
                  style: TextStyle(fontWeight: FontWeight.w600)),
              trailing: const Icon(Icons.chevron_right_rounded),
              onTap: () {
                Navigator.of(ctx).pop();
                Navigator.of(context).pop();
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAvatarWidget({double size = 36.0}) {
    ImageProvider avatarProvider;
    if (_currentUser?.profilePhotoUrl != null &&
        _currentUser!.profilePhotoUrl!.isNotEmpty) {
      avatarProvider = AssetImage(_currentUser!.profilePhotoUrl!);
    } else {
      avatarProvider = const AssetImage(AppAssets.homeAvatarRahul);
    }

    return GestureDetector(
      onTap: () => _showProfileDrawer(context),
      child: Container(
        width: size,
        height: size,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          border: Border.all(color: const Color(0xFF6D28D9), width: 1.5),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.08),
              blurRadius: 4,
              offset: const Offset(0, 1),
            ),
          ],
          image: DecorationImage(
            image: avatarProvider,
            fit: BoxFit.cover,
          ),
        ),
      ),
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
    final exploreAllList = _festivalService.getExploreAllFestivals();

    return Scaffold(
      backgroundColor: const Color(0xFFFCFCFD),
      body: SafeArea(
        child: Column(
          children: [
            // A. Header (Back Button + Panchayat Post + Festivals Title + Bell + Avatar)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 14.0, vertical: 8.0),
              child: Row(
                children: [
                  // Circular Back Button
                  InkWell(
                    onTap: () => Navigator.of(context).pop(),
                    borderRadius: BorderRadius.circular(20.0),
                    child: Container(
                      width: 36.0,
                      height: 36.0,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        shape: BoxShape.circle,
                        border: Border.all(color: const Color(0xFFE2E8F0)),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.04),
                            blurRadius: 4,
                            offset: const Offset(0, 1),
                          ),
                        ],
                      ),
                      alignment: Alignment.center,
                      child: const Icon(
                        Icons.chevron_left_rounded,
                        size: 22.0,
                        color: Color(0xFF1E293B),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8.0),

                  // Panchayat Post Logo
                  Image.asset(
                    AppAssets.panchayatLogo,
                    height: 32.0,
                    fit: BoxFit.contain,
                  ),
                  const SizedBox(width: 5.0),
                  const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        'Panchayat',
                        style: TextStyle(
                          fontSize: 12.0,
                          fontWeight: FontWeight.w900,
                          color: AppColors.textNavy,
                          height: 1.1,
                        ),
                      ),
                      Text(
                        'Post',
                        style: TextStyle(
                          fontSize: 12.0,
                          fontWeight: FontWeight.w900,
                          color: AppColors.primaryBlue,
                          height: 1.1,
                        ),
                      ),
                    ],
                  ),

                  // Vertical divider
                  Container(
                    height: 24.0,
                    width: 1.0,
                    color: const Color(0xFFCBD5E1),
                    margin: const EdgeInsets.symmetric(horizontal: 8.0),
                  ),

                  // Page Title & Subtitle
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          strings.festivalsPageTitle,
                          style: const TextStyle(
                            fontSize: 15.0,
                            fontWeight: FontWeight.w800,
                            color: AppColors.textNavy,
                            height: 1.1,
                          ),
                        ),
                        Text(
                          strings.festivalsPageSubtitle,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 10.5,
                            fontWeight: FontWeight.w500,
                            color: Color(0xFF64748B),
                            height: 1.15,
                          ),
                        ),
                      ],
                    ),
                  ),

                  // Notification Bell with red dot
                  GestureDetector(
                    onTap: () => _showNotificationsSheet(context),
                    child: Container(
                      padding: const EdgeInsets.all(5.0),
                      child: Stack(
                        clipBehavior: Clip.none,
                        children: [
                          const Icon(
                            Icons.notifications_none_rounded,
                            size: 24.0,
                            color: Color(0xFF1E293B),
                          ),
                          if (_unreadNotificationsCount > 0)
                            Positioned(
                              top: 0,
                              right: 1,
                              child: Container(
                                width: 8.0,
                                height: 8.0,
                                decoration: const BoxDecoration(
                                  color: Color(0xFFEF4444),
                                  shape: BoxShape.circle,
                                ),
                              ),
                            ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(width: 6.0),

                  // Profile Avatar
                  _buildAvatarWidget(size: 34.0),
                ],
              ),
            ),

            // Scrollable Content
            Expanded(
              child: SingleChildScrollView(
                physics: const BouncingScrollPhysics(),
                padding: const EdgeInsets.only(bottom: 12.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // B. Search Bar with Filter
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 4.0),
                      child: Container(
                        height: 46.0,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(24.0),
                          border: Border.all(color: const Color(0xFFE2E8F0)),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withValues(alpha: 0.03),
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
                              size: 20.0,
                              color: Color(0xFF94A3B8),
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
                                  ),
                                  border: InputBorder.none,
                                  isDense: true,
                                  contentPadding: EdgeInsets.zero,
                                ),
                              ),
                            ),
                            if (_searchController.text.isNotEmpty)
                              GestureDetector(
                                onTap: () => _searchController.clear(),
                                child: const Padding(
                                  padding: EdgeInsets.symmetric(horizontal: 6.0),
                                  child: Icon(Icons.close_rounded,
                                      size: 18.0, color: Color(0xFF94A3B8)),
                                ),
                              ),
                            Container(
                              height: 22.0,
                              width: 1.0,
                              color: const Color(0xFFE2E8F0),
                              margin: const EdgeInsets.symmetric(horizontal: 6.0),
                            ),
                            IconButton(
                              icon: const Icon(
                                Icons.tune_rounded,
                                size: 20.0,
                                color: Color(0xFF6D28D9),
                              ),
                              onPressed: () => _showFilterModal(context),
                              tooltip: 'Filter',
                            ),
                            const SizedBox(width: 4.0),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 12.0),

                    // C. Featured Festival Banner
                    _buildFeaturedFestivalBanner(strings, featuredFestival),
                    const SizedBox(height: 16.0),

                    // D. Explore Categories Section
                    _buildExploreCategoriesSection(strings, categories),
                    const SizedBox(height: 16.0),

                    // E. Upcoming Festivals Section (2-Column Grid)
                    _buildUpcomingFestivalsGridSection(strings, displayedFestivals),
                    const SizedBox(height: 16.0),

                    // F. Explore All Festivals Carousel
                    if (query.isEmpty) ...[
                      _buildExploreAllFestivalsSection(strings, exploreAllList),
                      const SizedBox(height: 12.0),
                    ],

                    // Bottom Cultural Village Silhouette Watermark
                    Center(
                      child: Opacity(
                        opacity: 0.35,
                        child: Image.asset(
                          AppAssets.welcomeVillageFooter,
                          height: 38.0,
                          fit: BoxFit.fitWidth,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // G. Bottom Navigation Bar
            _buildBottomNavigationBar(strings),
          ],
        ),
      ),
    );
  }

  // --- UI Section Builders ---

  Widget _buildFeaturedFestivalBanner(AppStrings strings, FestivalItem festival) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16.0),
      height: 190.0,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(22.0),
        gradient: const LinearGradient(
          colors: [
            Color(0xFFFEF3C7),
            Color(0xFFEDE9FE),
            Color(0xFFFCE7F3),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF6D28D9).withValues(alpha: 0.10),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Stack(
        children: [
          // Right side festive dancer artwork
          Positioned(
            right: 0,
            top: 0,
            bottom: 0,
            width: 215.0,
            child: ClipRRect(
              borderRadius: const BorderRadius.only(
                topRight: Radius.circular(22.0),
                bottomRight: Radius.circular(22.0),
              ),
              child: Image.asset(
                AppAssets.festivalHeroDancers,
                fit: BoxFit.cover,
                alignment: Alignment.centerLeft,
              ),
            ),
          ),

          // Left side text and actions
          Positioned(
            left: 16.0,
            top: 14.0,
            bottom: 14.0,
            width: 200.0,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Upcoming Festival Badge
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 4.0),
                      decoration: BoxDecoration(
                        color: const Color(0xFF6D28D9),
                        borderRadius: BorderRadius.circular(12.0),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(Icons.calendar_month_rounded,
                              size: 11.0, color: Colors.white),
                          const SizedBox(width: 4.0),
                          Text(
                            strings.upcomingFestivalBadge,
                            style: const TextStyle(
                              fontSize: 9.0,
                              fontWeight: FontWeight.w800,
                              color: Colors.white,
                              letterSpacing: 0.4,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 6.0),

                    // Navratri Headline
                    Text(
                      strings.navratriCelebrationTitle,
                      style: const TextStyle(
                        fontSize: 24.0,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFF4C1D95),
                        height: 1.1,
                        letterSpacing: -0.3,
                      ),
                    ),

                    // Celebration Script
                    Text(
                      strings.navratriCelebrationScript,
                      style: const TextStyle(
                        fontFamily: 'serif',
                        fontStyle: FontStyle.italic,
                        fontSize: 20.0,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF6D28D9),
                        height: 1.05,
                      ),
                    ),
                    const SizedBox(height: 4.0),

                    // Subtitle
                    Text(
                      strings.exploreFestiveDesignsSubtitle,
                      maxLines: 2,
                      style: const TextStyle(
                        fontSize: 11.0,
                        color: Color(0xFF475569),
                        fontWeight: FontWeight.w500,
                        height: 1.25,
                      ),
                    ),
                  ],
                ),

                // View Designs Button
                InkWell(
                  onTap: () => _showFestivalTemplatesModal(context, festival),
                  borderRadius: BorderRadius.circular(20.0),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14.0, vertical: 8.0),
                    decoration: BoxDecoration(
                      color: const Color(0xFF581C87),
                      borderRadius: BorderRadius.circular(20.0),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF581C87).withValues(alpha: 0.35),
                          blurRadius: 6,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          strings.viewDesignsButton,
                          style: const TextStyle(
                            fontSize: 11.5,
                            fontWeight: FontWeight.w700,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(width: 4.0),
                        const Icon(
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
    );
  }

  Widget _buildExploreCategoriesSection(
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
                height: 17.0,
                decoration: BoxDecoration(
                  color: const Color(0xFF7C3AED),
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
                    color: AppColors.textNavy,
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 10.0),

        // Horizontal Category Chips
        SizedBox(
          height: 38.0,
          child: ListView.separated(
            controller: _categoriesScrollController,
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            physics: const BouncingScrollPhysics(),
            itemCount: categories.length,
            separatorBuilder: (context, index) => const SizedBox(width: 8.0),
            itemBuilder: (context, index) {
              final cat = categories[index];
              final isSelected = _selectedCategory == cat.id;

              return GestureDetector(
                onTap: () {
                  setState(() {
                    _selectedCategory = cat.id;
                  });
                },
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14.0, vertical: 7.0),
                  decoration: BoxDecoration(
                    color: isSelected
                        ? const Color(0xFF6D28D9)
                        : const Color(0xFFF3E8FF),
                    borderRadius: BorderRadius.circular(20.0),
                    boxShadow: isSelected
                        ? [
                            BoxShadow(
                              color: const Color(0xFF6D28D9).withValues(alpha: 0.25),
                              blurRadius: 6,
                              offset: const Offset(0, 2),
                            ),
                          ]
                        : null,
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      if (cat.icon != null) ...[
                        Icon(
                          cat.icon,
                          size: 15.0,
                          color: isSelected ? Colors.white : const Color(0xFF6D28D9),
                        ),
                        const SizedBox(width: 6.0),
                      ] else if (cat.emoji != null) ...[
                        Text(cat.emoji!, style: const TextStyle(fontSize: 13.0)),
                        const SizedBox(width: 6.0),
                      ],
                      Text(
                        cat.name,
                        style: TextStyle(
                          fontSize: 12.0,
                          fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                          color: isSelected ? Colors.white : const Color(0xFF334155),
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

  Widget _buildUpcomingFestivalsGridSection(
      AppStrings strings, List<FestivalItem> festivals) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Section Header + View Calendar
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: Row(
            children: [
              Container(
                width: 4.0,
                height: 17.0,
                decoration: BoxDecoration(
                  color: const Color(0xFF7C3AED),
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
                    color: AppColors.textNavy,
                  ),
                ),
              ),
              GestureDetector(
                onTap: () => _showCalendarSheet(context),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      strings.viewCalendarAction,
                      style: const TextStyle(
                        fontSize: 13.0,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF6D28D9),
                      ),
                    ),
                    const SizedBox(width: 2.0),
                    const Icon(
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

        if (festivals.isEmpty)
          Padding(
            padding: const EdgeInsets.all(24.0),
            child: Center(
              child: Column(
                children: [
                  const Icon(Icons.search_off_rounded, size: 40.0, color: Color(0xFF94A3B8)),
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
          // 2-Column Responsive Festival Grid
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: festivals.length,
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                crossAxisSpacing: 12.0,
                mainAxisSpacing: 12.0,
                childAspectRatio: 0.92,
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
    return InkWell(
      borderRadius: BorderRadius.circular(16.0),
      onTap: () => Navigator.of(context).pushNamed(
        AppRoutes.festivalDetail,
        arguments: item,
      ),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16.0),
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
          // Top Image with "Upcoming" Badge
          Stack(
            children: [
              ClipRRect(
                borderRadius: const BorderRadius.vertical(top: Radius.circular(16.0)),
                child: Image.asset(
                  item.imageAsset,
                  height: 82.0,
                  width: double.infinity,
                  fit: BoxFit.cover,
                ),
              ),
              if (item.isUpcoming)
                Positioned(
                  top: 6.0,
                  right: 6.0,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 7.0, vertical: 3.0),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFEF3C7),
                      borderRadius: BorderRadius.circular(10.0),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.06),
                          blurRadius: 3,
                          offset: const Offset(0, 1),
                        ),
                      ],
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(
                          Icons.access_time_rounded,
                          size: 10.0,
                          color: Color(0xFFD97706),
                        ),
                        const SizedBox(width: 3.0),
                        Text(
                          strings.upcomingStatusBadge,
                          style: const TextStyle(
                            fontSize: 9.5,
                            fontWeight: FontWeight.w700,
                            color: Color(0xFFD97706),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
            ],
          ),

          // Bottom Details & View Designs Button
          Expanded(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(10.0, 8.0, 10.0, 8.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        item.name,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 13.5,
                          fontWeight: FontWeight.w800,
                          color: AppColors.textNavy,
                        ),
                      ),
                      const SizedBox(height: 2.0),
                      Row(
                        children: [
                          const Icon(
                            Icons.calendar_month_outlined,
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
                                fontSize: 10.5,
                                fontWeight: FontWeight.w500,
                                color: Color(0xFF64748B),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),

                  // View Designs pill button
                  GestureDetector(
                    onTap: () => _showFestivalTemplatesModal(context, item),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 4.5),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF3E8FF),
                        borderRadius: BorderRadius.circular(10.0),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Flexible(
                            child: Text(
                              strings.viewDesignsButton,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                fontSize: 10.5,
                                fontWeight: FontWeight.w700,
                                color: Color(0xFF7C3AED),
                              ),
                            ),
                          ),
                          const SizedBox(width: 3.0),
                          const Icon(
                            Icons.arrow_forward_rounded,
                            size: 11.0,
                            color: Color(0xFF7C3AED),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    ),
  );
}

  Widget _buildExploreAllFestivalsSection(
      AppStrings strings, List<FestivalItem> allFestivals) {
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
                height: 17.0,
                decoration: BoxDecoration(
                  color: const Color(0xFF7C3AED),
                  borderRadius: BorderRadius.circular(2.0),
                ),
              ),
              const SizedBox(width: 8.0),
              Expanded(
                child: Text(
                  strings.exploreAllFestivalsTitle,
                  style: const TextStyle(
                    fontSize: 16.0,
                    fontWeight: FontWeight.w800,
                    color: AppColors.textNavy,
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12.0),

        // Carousel of 4 festival cards
        SizedBox(
          height: 122.0,
          child: ListView.separated(
            controller: _exploreScrollController,
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            physics: const BouncingScrollPhysics(),
            itemCount: allFestivals.length,
            separatorBuilder: (context, index) => const SizedBox(width: 10.0),
            itemBuilder: (context, index) {
              final item = allFestivals[index];
              return GestureDetector(
                onTap: () => Navigator.of(context).pushNamed(
                  AppRoutes.festivalDetail,
                  arguments: item,
                ),
                child: Container(
                  width: 105.0,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16.0),
                    border: Border.all(color: const Color(0xFFF1F5F9)),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.05),
                        blurRadius: 6,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      ClipRRect(
                        borderRadius:
                            const BorderRadius.vertical(top: Radius.circular(16.0)),
                        child: Image.asset(
                          item.imageAsset,
                          height: 75.0,
                          width: double.infinity,
                          fit: BoxFit.cover,
                        ),
                      ),
                      Expanded(
                        child: Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 4.0, vertical: 4.0),
                          alignment: Alignment.center,
                          child: Text(
                            item.name,
                            textAlign: TextAlign.center,
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              fontSize: 11.0,
                              fontWeight: FontWeight.w700,
                              color: AppColors.textNavy,
                              height: 1.15,
                            ),
                          ),
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

  // --- Bottom Navigation Bar ---

  Widget _buildBottomNavigationBar(AppStrings strings) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(20.0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.08),
            blurRadius: 10,
            offset: const Offset(0, -3),
          ),
        ],
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
