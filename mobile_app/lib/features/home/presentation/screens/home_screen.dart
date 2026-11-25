import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:panchayat_post/core/constants/app_assets.dart';
import 'package:panchayat_post/core/constants/app_colors.dart';
import 'package:panchayat_post/core/localization/app_localizations.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';
import 'package:panchayat_post/features/auth/data/auth_service.dart';
import 'package:panchayat_post/features/auth/domain/models/user_profile.dart';
import 'package:panchayat_post/features/editor/domain/models/poster_template_project.dart';

/// Screen 09: Main Home Dashboard Screen (Redesigned)
///
/// Pixel-perfect reproduction of the approved Home Screen UI reference image:
/// - Header:
///   - Left: ONLY the original brand logo ([AppAssets.panchayatLogo]), with NO text beside it.
///   - Middle: Dynamic greeting ("Good Morning!" / "Good Afternoon!" / "Good Evening!")
///     and personalized welcome text ("Welcome, Rahul").
///   - Right: Circular notification button with purple bell and red badge count '2',
///     and circular profile avatar.
/// - Hero Carousel:
///   - Auto-scrolling / swipeable banner with Navratri festive artwork.
///   - 5 indicator dots below banner (active is deep purple pill, inactives are lavender circles).
/// - Upcoming Festivals Section:
///   - Header with deep purple vertical bar, "Upcoming Festivals", and "See All >" button.
///   - 4 uncropped vertical festival cards: Navratri (Oct 1, 2025), Independence Day (Aug 15, 2025),
///     Diwali (Oct 20, 2025), and Ganesh Chaturthi (Aug 27, 2025).
/// - Create Something New Section:
///   - Header with amber sparkle icon and "Create Something New".
///   - 2 side-by-side cards: "Festival" and "Panchayat" with artwork, badge icons, and arrow buttons.
/// - AI Poster Entry:
///   - Lavender gradient banner with AI microchip icon, "AI Poster" title, description,
///     magic wand artwork, and purple chevron button.
/// - Popular Templates Section:
///   - Header with purple bar, "Popular Templates", and "See All >" button.
///   - 5 vertical poster cards: Sarkari Yojana, Suvichar, Atmanirbhar Bharat, Good Morning, Good Night.
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

  final TextEditingController _aiPromptController = TextEditingController();
  final ScrollController _festivalScrollController = ScrollController();
  final ScrollController _templatesScrollController = ScrollController();
  final PageController _heroPageController = PageController();

  int _heroCurrentPage = 0;
  Timer? _heroTimer;
  int _unreadNotificationsCount = 2;

  final List<Map<String, String>> _heroBanners = [
    {
      'title': 'Happy Navratri',
      'subtitle': 'May Maa Durga remove all negativity and fill our lives with happiness.',
      'asset': AppAssets.homeBannerNavratriHero,
      'fallback': AppAssets.homeHeroBannerFull,
    },
    {
      'title': 'Diwali Celebration',
      'subtitle': 'Celebrate the festival of lights with prosperity & joyous blessings.',
      'asset': AppAssets.homeFestivalDiwali,
      'fallback': AppAssets.festivalDiwaliDiyas,
    },
    {
      'title': 'Independence Day',
      'subtitle': 'Saluting our brave heroes & celebrating freedom and unity.',
      'asset': AppAssets.editorCanvasRepublicDay,
      'fallback': AppAssets.screen18Reference,
    },
    {
      'title': 'Ganesh Chaturthi',
      'subtitle': 'May Lord Ganesha bless your family with joy, peace, and good health.',
      'asset': AppAssets.festivalAllGanesh,
      'fallback': AppAssets.homeFestivalNavratri,
    },
    {
      'title': 'Republic Day',
      'subtitle': 'Let us celebrate the spirit of unity, constitution, and progress.',
      'asset': AppAssets.editorCanvasRepublicDay,
      'fallback': AppAssets.homeTemplateVikas,
    },
  ];

  @override
  void initState() {
    super.initState();
    _authService = widget.authService ?? AuthService();
    _selectedNavIndex = widget.initialTabIndex;
    _loadUserProfile();
    _startHeroAutoScroll();
  }

  @override
  void dispose() {
    _heroTimer?.cancel();
    _heroPageController.dispose();
    _aiPromptController.dispose();
    _festivalScrollController.dispose();
    _templatesScrollController.dispose();
    super.dispose();
  }

  void _startHeroAutoScroll() {
    _heroTimer = Timer.periodic(const Duration(seconds: 5), (timer) {
      if (_heroPageController.hasClients) {
        final nextPage = (_heroCurrentPage + 1) % _heroBanners.length;
        _heroPageController.animateToPage(
          nextPage,
          duration: const Duration(milliseconds: 500),
          curve: Curves.easeInOut,
        );
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
      return 'Good Morning!';
    } else if (hour < 17) {
      return 'Good Afternoon!';
    } else {
      return 'Good Evening!';
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
            const Divider(),
            ListTile(
              contentPadding: EdgeInsets.zero,
              leading: const CircleAvatar(
                backgroundColor: Color(0xFFEDE9FE),
                child: Icon(Icons.celebration_rounded, color: Color(0xFF6D28D9)),
              ),
              title: const Text('નવરાત્રી સ્પેશિયલ પોસ્ટર ટેમ્પલેટ ઉપલબ્ધ છે!',
                  style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13.5)),
              subtitle: const Text('તમારા ગામ માટે સુંદર દાંડિયા રાસ પોસ્ટર બનાવો.',
                  style: TextStyle(fontSize: 12.0)),
              trailing: const Text('10m ago',
                  style: TextStyle(fontSize: 11.0, color: Color(0xFF94A3B8))),
            ),
            ListTile(
              contentPadding: EdgeInsets.zero,
              leading: const CircleAvatar(
                backgroundColor: Color(0xFFFEF3C7),
                child: Icon(Icons.campaign_rounded, color: Color(0xFFD97706)),
              ),
              title: const Text('ગ્રામ સભા મીટિંગ નોટિસ અપડેટ',
                  style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13.5)),
              subtitle: const Text('નવી ગ્રામ વિકાસ સભા માટે તૈયાર પોસ્ટર જુઓ.',
                  style: TextStyle(fontSize: 12.0)),
              trailing: const Text('2h ago',
                  style: TextStyle(fontSize: 11.0, color: Color(0xFF94A3B8))),
            ),
            const SizedBox(height: 16.0),
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
        initialChildSize: 0.75,
        minChildSize: 0.5,
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
                      'All Popular Templates',
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
                  childAspectRatio: 0.85,
                  children: [
                    _buildTemplateGridItem('Sarkari Yojana', AppAssets.homeTemplateSarkariYojana),
                    _buildTemplateGridItem('Suvichar', AppAssets.homeTemplateSuvichar),
                    _buildTemplateGridItem('Atmanirbhar Bharat', AppAssets.homeTemplateAtmanirbhar),
                    _buildTemplateGridItem('Good Morning', AppAssets.homeTemplateGoodMorning),
                    _buildTemplateGridItem('Good Night', AppAssets.homeTemplateGoodNight),
                    _buildTemplateGridItem('Happy Diwali', AppAssets.homeTemplateDiwali),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTemplateGridItem(String title, String asset) {
    return GestureDetector(
      onTap: () {
        Navigator.of(context).pop();
        _openTemplateInEditor(title, asset);
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
                    child: const Icon(Icons.image_outlined, color: Color(0xFF6C5CE7)),
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

  void _showAiPosterModal(BuildContext context) {
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
          top: 20.0,
          bottom: MediaQuery.of(ctx).viewInsets.bottom + 24.0,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8.0),
                  decoration: const BoxDecoration(
                    color: Color(0xFFEDE9FE),
                    shape: BoxShape.circle,
                  ),
                  child: const Text('AI',
                      style: TextStyle(
                          color: Color(0xFF6C5CE7), fontWeight: FontWeight.w900, fontSize: 13)),
                ),
                const SizedBox(width: 10.0),
                const Expanded(
                  child: Text(
                    'AI Poster Creation',
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
            TextField(
              controller: _aiPromptController,
              maxLines: 3,
              decoration: InputDecoration(
                hintText: 'દા.ત. નવરાત્રી માટે અમારા ગામ વતી શુભેચ્છા પાઠવતું સુંદર પોસ્ટર...',
                hintStyle: const TextStyle(fontSize: 13.0, color: Color(0xFF94A3B8)),
                filled: true,
                fillColor: const Color(0xFFF8FAFC),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14.0),
                  borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                ),
              ),
            ),
            const SizedBox(height: 14.0),
            ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF6C5CE7),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14.0),
                ),
                padding: const EdgeInsets.symmetric(vertical: 13.0),
              ),
              icon: const Icon(Icons.auto_awesome_rounded, size: 18.0),
              label: const Text('Generate Poster with AI',
                  style: TextStyle(fontWeight: FontWeight.w700)),
              onPressed: () {
                Navigator.of(ctx).pop();
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('AI is generating your custom poster design...'),
                    backgroundColor: Color(0xFF6C5CE7),
                    duration: Duration(seconds: 3),
                  ),
                );
              },
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
                const Icon(Icons.palette_outlined, color: Color(0xFF6C5CE7)),
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
            ClipRRect(
              borderRadius: BorderRadius.circular(14.0),
              child: Image.asset(
                AppAssets.welcomeHeroPosters,
                height: 150.0,
                fit: BoxFit.contain,
              ),
            ),
            const SizedBox(height: 16.0),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF6C5CE7),
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
        padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 20.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              children: [
                _buildAvatarWidget(size: 52.0),
                const SizedBox(width: 14.0),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        _currentUser?.displayName ?? _currentUser?.fullName ?? 'Rahul',
                        style: const TextStyle(
                          fontSize: 17.0,
                          fontWeight: FontWeight.w800,
                          color: AppColors.textNavy,
                        ),
                      ),
                      Text(
                        _currentUser?.villageCity ?? 'Palanpur, Gujarat',
                        style: const TextStyle(
                          fontSize: 12.5,
                          color: Color(0xFF64748B),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16.0),
            const Divider(),
            ListTile(
              leading: const Icon(Icons.edit_note_rounded, color: Color(0xFF6C5CE7)),
              title: const Text('Edit Profile Details', style: TextStyle(fontWeight: FontWeight.w600)),
              trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14.0),
              onTap: () {
                Navigator.of(ctx).pop();
                Navigator.of(context).pushNamed(
                  AppRoutes.profileSetup,
                  arguments: _currentUser,
                );
              },
            ),
            ListTile(
              leading: const Icon(Icons.layers_rounded, color: Color(0xFF0055B8)),
              title: const Text('Test All Screens (01–22)', style: TextStyle(fontWeight: FontWeight.w600)),
              trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14.0),
              onTap: () {
                Navigator.of(ctx).pop();
                _showScreensNavigator(context);
              },
            ),
            ListTile(
              leading: const Icon(Icons.logout_rounded, color: Color(0xFFDC2626)),
              title: Text(strings.logoutDialogTitle,
                  style: const TextStyle(fontWeight: FontWeight.w600, color: Color(0xFFDC2626))),
              trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14.0),
              onTap: () {
                Navigator.of(ctx).pop();
                _showLogoutDialog(context, strings);
              },
            ),
            const SizedBox(height: 10.0),
          ],
        ),
      ),
    );
  }

  void _showScreensNavigator(BuildContext context) {
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
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Panchayat Post — All Screens Navigator',
              style: TextStyle(
                fontSize: 17.0,
                fontWeight: FontWeight.w800,
                color: AppColors.textNavy,
              ),
            ),
            const SizedBox(height: 12.0),
            _buildNavTile(ctx, 'Screen 01: Splash Screen', AppRoutes.splash),
            _buildNavTile(ctx, 'Screen 02: Welcome Screen', AppRoutes.welcome),
            _buildNavTile(ctx, 'Screen 03: Create Account', AppRoutes.createAccount),
            _buildNavTile(ctx, 'Screen 04: User Login', AppRoutes.login),
            _buildNavTile(ctx, 'Screen 05: Forgot Password', AppRoutes.forgotPassword),
            _buildNavTile(ctx, 'Screen 06: Recovery Status', AppRoutes.recoveryStatus),
            _buildNavTile(ctx, 'Screen 07: Profile Setup', AppRoutes.profileSetup),
            _buildNavTile(ctx, 'Screen 08: Onboarding Confirmation', AppRoutes.onboardingConfirmation),
            _buildNavTile(ctx, 'Screen 09: Home Dashboard', AppRoutes.home),
            _buildNavTile(ctx, 'Screen 10: Festival Listing', AppRoutes.festivals),
            _buildNavTile(ctx, 'Screen 11: Festival Details', AppRoutes.festivalDetail),
            _buildNavTile(ctx, 'Screen 12: Poster Editor Studio', AppRoutes.posterEditor),
            _buildNavTile(ctx, 'Screen 17: Quick Customize', AppRoutes.quickCustomize),
            _buildNavTile(ctx, 'Screen 18: Main Poster Editor', AppRoutes.mainPosterEditor),
            _buildNavTile(ctx, 'Screen 19: Final Poster Preview', AppRoutes.finalPosterPreview),
            _buildNavTile(ctx, 'Screen 20: Export Poster Settings', AppRoutes.exportPoster),
            _buildNavTile(ctx, 'Screen 21: Export Success & History', AppRoutes.exportSuccess),
            _buildNavTile(ctx, 'Screen 22: My Posters Library', AppRoutes.myPosters),
            const SizedBox(height: 10.0),
          ],
        ),
      ),
    );
  }

  Widget _buildNavTile(BuildContext ctx, String label, String route) {
    return ListTile(
      dense: true,
      contentPadding: EdgeInsets.zero,
      leading: const Icon(Icons.circle, size: 8.0, color: Color(0xFF6C5CE7)),
      title: Text(label, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13.5)),
      trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 13.0),
      onTap: () {
        Navigator.of(ctx).pop();
        Navigator.of(context).pushNamed(route);
      },
    );
  }

  void _showLogoutDialog(BuildContext context, AppStrings strings) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20.0)),
        title: Row(
          children: [
            const Icon(Icons.logout_rounded, color: Color(0xFFDC2626), size: 24.0),
            const SizedBox(width: 10.0),
            Text(
              strings.logoutDialogTitle,
              style: const TextStyle(
                fontWeight: FontWeight.w800,
                color: AppColors.textNavy,
                fontSize: 18.0,
              ),
            ),
          ],
        ),
        content: Text(
          strings.logoutDialogMessage,
          style: const TextStyle(
            fontSize: 14.0,
            color: Color(0xFF475569),
            height: 1.4,
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: Text(
              strings.cancelButton,
              style: const TextStyle(
                color: Color(0xFF64748B),
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFDC2626),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12.0),
              ),
            ),
            onPressed: () async {
              Navigator.of(ctx).pop();
              await _authService.sessionService.clearSession();
              if (!context.mounted) return;
              Navigator.of(context).pushNamedAndRemoveUntil(
                AppRoutes.welcome,
                (route) => false,
              );
            },
            child: Text(
              strings.logoutConfirmButton,
              style: const TextStyle(fontWeight: FontWeight.w700),
            ),
          ),
        ],
      ),
    );
  }

  // --- UI Components ---

  Widget _buildAvatarWidget({double size = 38.0}) {
    ImageProvider avatarProvider;
    if (_currentUser?.profilePhotoUrl != null &&
        _currentUser!.profilePhotoUrl!.startsWith('data:image')) {
      try {
        final commaIdx = _currentUser!.profilePhotoUrl!.indexOf(',');
        final base64Str = commaIdx != -1
            ? _currentUser!.profilePhotoUrl!.substring(commaIdx + 1)
            : _currentUser!.profilePhotoUrl!;
        avatarProvider = MemoryImage(base64Decode(base64Str));
      } catch (_) {
        avatarProvider = const AssetImage(AppAssets.homeAvatarRahul);
      }
    } else {
      avatarProvider = const AssetImage(AppAssets.homeAvatarRahul);
    }

    return GestureDetector(
      key: const ValueKey('btn_profile_avatar'),
      onTap: () => _showProfileDrawer(context),
      child: Container(
        width: size,
        height: size,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          border: Border.all(color: Colors.white, width: 2.0),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.10),
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

  @override
  Widget build(BuildContext context) {
    final strings = LocaleScope.of(context).strings;
    final userName = (_currentUser?.effectiveDisplayName != null &&
            _currentUser!.effectiveDisplayName.isNotEmpty)
        ? _currentUser!.effectiveDisplayName.split(' ').first
        : 'Rahul';

    return Scaffold(
      backgroundColor: const Color(0xFFFBFBFE),
      body: SafeArea(
        child: Column(
          children: [
            // 1. Top Header (Logo ONLY on left, Greeting in middle, Bell & Avatar on right)
            _buildTopHeader(userName),

            // Scrollable Content
            Expanded(
              child: SingleChildScrollView(
                physics: const BouncingScrollPhysics(),
                padding: const EdgeInsets.only(bottom: 16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // 2. Hero Carousel Banner & Dots
                    _buildHeroCarouselSection(),
                    const SizedBox(height: 18.0),

                    // 3. Upcoming Festivals Section (Uncropped poster cards)
                    _buildUpcomingFestivalsSection(),
                    const SizedBox(height: 20.0),

                    // 4. Create Something New Section (Festival & Panchayat 2-card row)
                    _buildCreateSomethingNewSection(),
                    const SizedBox(height: 18.0),

                    // 5. AI Poster Entry Section (Full-width banner)
                    _buildAiPosterCard(),
                    const SizedBox(height: 20.0),

                    // 6. Popular Templates Section (5 vertical cards)
                    _buildPopularTemplatesSection(),
                    const SizedBox(height: 12.0),
                  ],
                ),
              ),
            ),

            // 7. Bottom Navigation Bar
            _buildBottomNavigationBar(strings),
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
          // Original Panchayat Post Logo ONLY (No text beside logo)
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
                    fontSize: 12.0,
                    fontWeight: FontWeight.w500,
                    color: Color(0xFF64748B),
                    height: 1.15,
                  ),
                ),
                const SizedBox(height: 2.0),
                Text(
                  'Welcome, $userName',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 16.0,
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
                color: Colors.white,
                shape: BoxShape.circle,
                border: Border.all(color: const Color(0xFFE2E8F0)),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.05),
                    blurRadius: 4,
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
                    color: Color(0xFF6C5CE7),
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

  // --- Hero Carousel Section ---

  Widget _buildHeroCarouselSection() {
    return Column(
      children: [
        SizedBox(
          height: 195.0,
          child: PageView.builder(
            controller: _heroPageController,
            itemCount: _heroBanners.length,
            onPageChanged: (index) {
              setState(() => _heroCurrentPage = index);
            },
            itemBuilder: (context, index) {
              final banner = _heroBanners[index];
              return Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: GestureDetector(
                  onTap: () => _showTemplatesModal(context, banner['title']!),
                  child: Container(
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(22.0),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF6C5CE7).withValues(alpha: 0.12),
                          blurRadius: 14,
                          offset: const Offset(0, 6),
                        ),
                      ],
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(22.0),
                      child: Image.asset(
                        banner['asset']!,
                        fit: BoxFit.cover,
                        errorBuilder: (_, error, stackTrace) => Image.asset(
                          banner['fallback']!,
                          fit: BoxFit.cover,
                        ),
                      ),
                    ),
                  ),
                ),
              );
            },
          ),
        ),
        const SizedBox(height: 10.0),

        // 5 Dot Page Indicators (Active is elongated purple pill)
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(_heroBanners.length, (index) {
            final isActive = _heroCurrentPage == index;
            return AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              margin: const EdgeInsets.symmetric(horizontal: 2.5),
              height: 6.0,
              width: isActive ? 22.0 : 6.0,
              decoration: BoxDecoration(
                color: isActive ? const Color(0xFF6C5CE7) : const Color(0xFFDDD6FE),
                borderRadius: BorderRadius.circular(3.0),
              ),
            );
          }),
        ),
      ],
    );
  }

  // --- Upcoming Festivals Section ---

  Widget _buildUpcomingFestivalsSection() {
    final festivals = [
      {
        'title': 'Navratri',
        'date': 'Oct 1, 2025',
        'asset': AppAssets.homeFestivalNavratriCard,
        'fallback': AppAssets.festivalPosterGarbaNight,
      },
      {
        'title': 'Independence Day',
        'date': 'Aug 15, 2025',
        'asset': AppAssets.homeFestivalIndependenceCard,
        'fallback': AppAssets.editorCanvasRepublicDay,
      },
      {
        'title': 'Diwali',
        'date': 'Oct 20, 2025',
        'asset': AppAssets.homeFestivalDiwaliCard,
        'fallback': AppAssets.festivalDiwaliDiyas,
      },
      {
        'title': 'Ganesh Chaturthi',
        'date': 'Aug 27, 2025',
        'asset': AppAssets.homeFestivalGaneshCard,
        'fallback': AppAssets.festivalAllGanesh,
      },
    ];

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
                  color: const Color(0xFF6C5CE7),
                  borderRadius: BorderRadius.circular(2.0),
                ),
              ),
              const SizedBox(width: 8.0),
              const Expanded(
                child: Text(
                  'Upcoming Festivals',
                  style: TextStyle(
                    fontSize: 16.5,
                    fontWeight: FontWeight.w800,
                    color: AppColors.textNavy,
                  ),
                ),
              ),
              _buildSeeAllPill(
                key: const ValueKey('btn_see_all_festivals'),
                onTap: () => Navigator.of(context).pushNamed(AppRoutes.festivals),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12.0),

        // Horizontal List of Uncropped Vertical Cards
        SizedBox(
          height: 172.0,
          child: ListView.separated(
            controller: _festivalScrollController,
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            physics: const BouncingScrollPhysics(),
            itemCount: festivals.length,
            separatorBuilder: (context, index) => const SizedBox(width: 12.0),
            itemBuilder: (context, index) {
              final fest = festivals[index];
              return _buildFestivalPosterCard(
                title: fest['title']!,
                date: fest['date']!,
                asset: fest['asset']!,
                fallback: fest['fallback']!,
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildFestivalPosterCard({
    required String title,
    required String date,
    required String asset,
    required String fallback,
  }) {
    return GestureDetector(
      onTap: () {
        Navigator.of(context).pushNamed(
          AppRoutes.festivalDetail,
          arguments: title,
        );
      },
      child: Container(
        width: 122.0,
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
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            // Top uncropped artwork container
            ClipRRect(
              borderRadius: const BorderRadius.vertical(top: Radius.circular(15.0)),
              child: SizedBox(
                height: 104.0,
                width: double.infinity,
                child: Image.asset(
                  asset,
                  fit: BoxFit.cover,
                  errorBuilder: (_, error, stackTrace) => Image.asset(
                    fallback,
                    fit: BoxFit.cover,
                  ),
                ),
              ),
            ),
            const Spacer(),

            // Festival Title
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 6.0),
              child: FittedBox(
                fit: BoxFit.scaleDown,
                child: Text(
                  title,
                  maxLines: 1,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 12.5,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textNavy,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 3.0),

            // Date with calendar icon
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 6.0),
              child: FittedBox(
                fit: BoxFit.scaleDown,
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(
                      Icons.calendar_month_outlined,
                      size: 11.5,
                      color: Color(0xFF64748B),
                    ),
                    const SizedBox(width: 4.0),
                    Text(
                      date,
                      style: const TextStyle(
                        fontSize: 10.5,
                        fontWeight: FontWeight.w500,
                        color: Color(0xFF64748B),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 10.0),
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
                    fontSize: 16.5,
                    fontWeight: FontWeight.w800,
                    color: AppColors.textNavy,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12.0),

          // 2 Equal Side-by-Side Cards (Festival and Panchayat)
          Row(
            children: [
              // Card 1: Festival
              Expanded(
                child: _buildCreateCategoryCard(
                  title: 'Festival',
                  subtitle: 'Create festival posts',
                  thumbAsset: AppAssets.homeCreateFestivalThumb,
                  fallbackThumb: AppAssets.homeCreateFestival,
                  icon: Icons.event_note_rounded,
                  onTap: () => Navigator.of(context).pushNamed(AppRoutes.festivals),
                ),
              ),
              const SizedBox(width: 12.0),

              // Card 2: Panchayat
              Expanded(
                child: _buildCreateCategoryCard(
                  title: 'Panchayat',
                  subtitle: 'Create panchayat posts',
                  thumbAsset: AppAssets.homeCreatePanchayatThumb,
                  fallbackThumb: AppAssets.homeCreatePanchayat,
                  icon: Icons.groups_rounded,
                  onTap: () => _showTemplatesModal(context, 'Panchayat'),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildCreateCategoryCard({
    required String title,
    required String subtitle,
    required String thumbAsset,
    required String fallbackThumb,
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 86.0,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16.0),
          border: Border.all(color: const Color(0xFFF1F5F9)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.04),
              blurRadius: 8,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Row(
          children: [
            // Left artwork thumbnail
            ClipRRect(
              borderRadius: const BorderRadius.horizontal(left: Radius.circular(15.0)),
              child: SizedBox(
                width: 74.0,
                height: 86.0,
                child: Image.asset(
                  thumbAsset,
                  fit: BoxFit.cover,
                  errorBuilder: (_, error, stackTrace) => Image.asset(
                    fallbackThumb,
                    fit: BoxFit.cover,
                  ),
                ),
              ),
            ),

            // Right text and action
            Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 8.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Container(
                          width: 24.0,
                          height: 24.0,
                          decoration: const BoxDecoration(
                            color: Color(0xFFEDE9FE),
                            shape: BoxShape.circle,
                          ),
                          child: Icon(icon, size: 13.0, color: const Color(0xFF6C5CE7)),
                        ),
                        const Spacer(),
                        Container(
                          width: 20.0,
                          height: 20.0,
                          decoration: const BoxDecoration(
                            color: Color(0xFF6C5CE7),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.chevron_right_rounded,
                            size: 14.0,
                            color: Colors.white,
                          ),
                        ),
                      ],
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        FittedBox(
                          fit: BoxFit.scaleDown,
                          child: Text(
                            title,
                            maxLines: 1,
                            style: const TextStyle(
                              fontSize: 13.5,
                              fontWeight: FontWeight.w800,
                              color: AppColors.textNavy,
                            ),
                          ),
                        ),
                        FittedBox(
                          fit: BoxFit.scaleDown,
                          child: Text(
                            subtitle,
                            maxLines: 1,
                            style: const TextStyle(
                              fontSize: 9.5,
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
            ),
          ],
        ),
      ),
    );
  }

  // --- AI Poster Banner Card ---

  Widget _buildAiPosterCard() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: GestureDetector(
        onTap: () => _showAiPosterModal(context),
        child: Container(
          constraints: const BoxConstraints(minHeight: 74.0),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [
                Color(0xFFF5F3FF),
                Color(0xFFEDE9FE),
              ],
              begin: Alignment.centerLeft,
              end: Alignment.centerRight,
            ),
            borderRadius: BorderRadius.circular(18.0),
            border: Border.all(color: const Color(0xFFDDD6FE), width: 1.0),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF6C5CE7).withValues(alpha: 0.08),
                blurRadius: 8,
                offset: const Offset(0, 3),
              ),
            ],
          ),
          padding: const EdgeInsets.symmetric(horizontal: 14.0, vertical: 8.0),
          child: Row(
            children: [
              // Left AI Microchip Icon
              Container(
                width: 44.0,
                height: 44.0,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12.0),
                  border: Border.all(color: const Color(0xFFC4B5FD)),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF6C5CE7).withValues(alpha: 0.12),
                      blurRadius: 4,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: const Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.memory_rounded,
                      size: 20.0,
                      color: Color(0xFF6C5CE7),
                    ),
                    Text(
                      'AI',
                      style: TextStyle(
                        fontSize: 9.0,
                        fontWeight: FontWeight.w900,
                        color: Color(0xFF6C5CE7),
                        height: 1.0,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 12.0),

              // Middle Texts
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'AI Poster',
                      style: TextStyle(
                        fontSize: 15.5,
                        fontWeight: FontWeight.w800,
                        color: AppColors.textNavy,
                      ),
                    ),
                    SizedBox(height: 2.0),
                    Text(
                      'Create stunning posters with AI',
                      style: TextStyle(
                        fontSize: 11.5,
                        fontWeight: FontWeight.w500,
                        color: Color(0xFF6B7280),
                      ),
                    ),
                  ],
                ),
              ),

              // Right Magic Wand & Chevron Button
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Image.asset(
                    AppAssets.homeAiWandThumb,
                    height: 44.0,
                    fit: BoxFit.contain,
                    errorBuilder: (_, error, stackTrace) => const Icon(
                      Icons.auto_awesome_rounded,
                      color: Color(0xFF8B5CF6),
                      size: 24.0,
                    ),
                  ),
                  const SizedBox(width: 8.0),
                  Container(
                    width: 26.0,
                    height: 26.0,
                    decoration: const BoxDecoration(
                      color: Color(0xFF6C5CE7),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.chevron_right_rounded,
                      size: 18.0,
                      color: Colors.white,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  // --- Popular Templates Section ---

  Widget _buildPopularTemplatesSection() {
    final templates = [
      {
        'title': 'Sarkari Yojana',
        'asset': AppAssets.homeTemplateSarkariYojana,
        'fallback': AppAssets.homeTemplateVikas,
      },
      {
        'title': 'Suvichar',
        'asset': AppAssets.homeTemplateSuvichar,
        'fallback': AppAssets.homeTemplateGramSabha,
      },
      {
        'title': 'Atmanirbhar Bharat',
        'asset': AppAssets.homeTemplateAtmanirbhar,
        'fallback': AppAssets.homeTemplateSwachh,
      },
      {
        'title': 'Good Morning',
        'asset': AppAssets.homeTemplateGoodMorning,
        'fallback': AppAssets.homeTemplateDiwali,
      },
      {
        'title': 'Good Night',
        'asset': AppAssets.homeTemplateGoodNight,
        'fallback': AppAssets.homeFestivalBhaiBeej,
      },
    ];

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
                  color: const Color(0xFF6C5CE7),
                  borderRadius: BorderRadius.circular(2.0),
                ),
              ),
              const SizedBox(width: 8.0),
              const Expanded(
                child: Text(
                  'Popular Templates',
                  style: TextStyle(
                    fontSize: 16.5,
                    fontWeight: FontWeight.w800,
                    color: AppColors.textNavy,
                  ),
                ),
              ),
              _buildSeeAllPill(
                key: const ValueKey('btn_see_all_templates'),
                onTap: () => _showAllTemplatesLibrary(context),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12.0),

        // Horizontal List of 5 Vertical Poster Cards
        SizedBox(
          height: 168.0,
          child: ListView.separated(
            controller: _templatesScrollController,
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            physics: const BouncingScrollPhysics(),
            itemCount: templates.length,
            separatorBuilder: (context, index) => const SizedBox(width: 12.0),
            itemBuilder: (context, index) {
              final item = templates[index];
              return _buildPopularTemplateCard(
                title: item['title']!,
                asset: item['asset']!,
                fallback: item['fallback']!,
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildPopularTemplateCard({
    required String title,
    required String asset,
    required String fallback,
  }) {
    return GestureDetector(
      onTap: () => _openTemplateInEditor(title, asset),
      child: Container(
        width: 104.0,
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
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            ClipRRect(
              borderRadius: const BorderRadius.vertical(top: Radius.circular(15.0)),
              child: SizedBox(
                height: 124.0,
                width: double.infinity,
                child: Image.asset(
                  asset,
                  fit: BoxFit.cover,
                  errorBuilder: (_, error, stackTrace) => Image.asset(
                    fallback,
                    fit: BoxFit.cover,
                  ),
                ),
              ),
            ),
            const Spacer(),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 6.0),
              child: FittedBox(
                fit: BoxFit.scaleDown,
                child: Text(
                  title,
                  maxLines: 1,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 11.5,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textNavy,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 8.0),
          ],
        ),
      ),
    );
  }

  // --- Helper Widgets ---

  Widget _buildSeeAllPill({
    required VoidCallback onTap,
    Key? key,
  }) {
    return GestureDetector(
      key: key,
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 4.0),
        decoration: BoxDecoration(
          color: const Color(0xFFF5F3FF),
          borderRadius: BorderRadius.circular(14.0),
        ),
        child: const Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'See All',
              style: TextStyle(
                fontSize: 12.0,
                fontWeight: FontWeight.w700,
                color: Color(0xFF6C5CE7),
              ),
            ),
            SizedBox(width: 2.0),
            Icon(
              Icons.chevron_right_rounded,
              size: 15.0,
              color: Color(0xFF6C5CE7),
            ),
          ],
        ),
      ),
    );
  }

  // --- Bottom Navigation Bar ---

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
    final color = isSelected ? const Color(0xFF6C5CE7) : const Color(0xFF64748B);

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
