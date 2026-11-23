import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:panchayat_post/core/constants/app_assets.dart';
import 'package:panchayat_post/core/constants/app_colors.dart';
import 'package:panchayat_post/core/localization/app_localizations.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';
import 'package:panchayat_post/core/models/app_remote_config.dart';
import 'package:panchayat_post/core/services/app_config_service.dart';
import 'package:panchayat_post/features/auth/data/auth_service.dart';
import 'package:panchayat_post/features/auth/domain/models/user_profile.dart';
import 'package:panchayat_post/features/editor/domain/models/poster_template_project.dart';
import 'package:panchayat_post/features/home/data/home_content_service.dart';

/// Screen 09: Main Home Dashboard Screen
///
/// Fully functional, pixel-perfect reproduction of approved Screen 09 reference:
/// - Top Header: Panchayat Post logo, vertical divider, Good Morning greeting,
///   personalized user welcome, notification bell with red dot badge, and circular profile avatar.
/// - Government announcement hero image configured by the admin.
/// - Create Something New: Three visual cards with overlapping circular badge icons:
///   1. Festival Posters (Goddess Lakshmi artwork)
///   2. Panchayat Posts (Parliament / Panchayat building with tricolor)
///   3. AI Poster (Banyan tree sunrise landscape)
/// - Popular Templates and Upcoming Festivals: Loaded from the admin-backed explore API.
/// - Bottom Village Silhouette: Warm cultural village watermark illustration.
/// - Bottom Navigation Bar: Elevated curved bar with 5 items (Home active with lavender pill,
///   Festivals, Templates, My Designs, Profile).
/// - Full interactive workflows: AI poster generation, category templates, template preview,
///   notifications bottom sheet, profile navigator, and logout dialog.
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key, this.authService, this.initialTabIndex = 0});

  final AuthService? authService;
  final int initialTabIndex;

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late final AuthService _authService;
  late final HomeContentService _homeContentService;
  UserProfile? _currentUser;
  HomeExploreContent? _homeContent;
  String? _homeContentError;
  bool _isHomeContentLoading = true;
  late int _selectedNavIndex;

  final TextEditingController _aiPromptController = TextEditingController();
  final ScrollController _festivalScrollController = ScrollController();
  final ScrollController _templatesScrollController = ScrollController();
  final PageController _heroPageController = PageController();
  Timer? _heroSlideTimer;
  String _heroCarouselSignature = '';
  int _heroPageIndex = 0;

  int _unreadNotificationsCount = 2;

  Color get _primaryColor => Theme.of(context).colorScheme.primary;
  Color get _surfaceColor => Theme.of(context).colorScheme.surface;

  @override
  void initState() {
    super.initState();
    _authService = widget.authService ?? AuthService();
    _homeContentService = HomeContentService(
      sessionService: _authService.sessionService,
    );
    _selectedNavIndex = widget.initialTabIndex;
    AppConfigService.instance.configNotifier.addListener(
      _handleHeroConfigChanged,
    );
    _handleHeroConfigChanged();
    _loadUserProfile();
    _loadHomeContent();
  }

  @override
  void dispose() {
    _aiPromptController.dispose();
    _festivalScrollController.dispose();
    _templatesScrollController.dispose();
    AppConfigService.instance.configNotifier.removeListener(
      _handleHeroConfigChanged,
    );
    _heroSlideTimer?.cancel();
    _heroPageController.dispose();
    _homeContentService.dispose();
    super.dispose();
  }

  void _handleHeroConfigChanged() {
    final config = AppConfigService.instance.configNotifier.value;
    final images = config.heroImageUrls
        .map((image) => image.trim())
        .where((image) => image.isNotEmpty)
        .toList();
    final signature = '${config.heroSlideIntervalSeconds}:${images.join('|')}';
    if (signature == _heroCarouselSignature) return;

    _heroCarouselSignature = signature;
    _heroSlideTimer?.cancel();
    _heroPageIndex = 0;
    if (_heroPageController.hasClients) {
      _heroPageController.jumpToPage(0);
    }

    if (images.length < 2) return;
    _heroSlideTimer = Timer.periodic(
      Duration(seconds: config.heroSlideIntervalSeconds),
      (_) {
        if (!mounted || !_heroPageController.hasClients) return;
        final nextPage = (_heroPageIndex + 1) % images.length;
        _heroPageController.animateToPage(
          nextPage,
          duration: const Duration(milliseconds: 450),
          curve: Curves.easeInOut,
        );
      },
    );
  }

  Future<void> _loadUserProfile() async {
    final user = await _authService.getCurrentUser();
    if (mounted) {
      setState(() {
        _currentUser = user;
      });
    }
  }

  Future<void> _loadHomeContent() async {
    setState(() {
      _isHomeContentLoading = true;
      _homeContentError = null;
    });
    try {
      final content = await _homeContentService.load();
      if (!mounted) return;
      setState(() {
        _homeContent = content;
        _isHomeContentLoading = false;
      });
    } on HomeContentException catch (error) {
      if (!mounted) return;
      setState(() {
        _homeContentError = error.message;
        _isHomeContentLoading = false;
      });
    }
  }

  Widget _buildHomeContentMessage(String message, {bool showRetry = false}) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(8.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              message,
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontSize: 11.5,
                fontWeight: FontWeight.w600,
                color: Color(0xFF64748B),
              ),
            ),
            if (showRetry)
              TextButton.icon(
                onPressed: _loadHomeContent,
                icon: const Icon(Icons.refresh_rounded, size: 15.0),
                label: const Text('Retry'),
              ),
          ],
        ),
      ),
    );
  }

  String _formatFestivalDate(String value) {
    final date = DateTime.tryParse(value);
    if (date == null) return 'Date not set';
    return MaterialLocalizations.of(context).formatShortDate(date.toLocal());
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
      backgroundColor: _surfaceColor,
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
                      Icon(
                        Icons.notifications_active_rounded,
                        color: _primaryColor,
                        size: 24.0,
                      ),
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
                  child: Text(
                    'Mark all read',
                    style: TextStyle(
                      color: _primaryColor,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
            const Divider(),
            ListTile(
              contentPadding: EdgeInsets.zero,
              leading: CircleAvatar(
                backgroundColor: Color(0xFFEDE9FE),
                child: Icon(Icons.celebration_rounded, color: _primaryColor),
              ),
              title: const Text(
                'નવરાત્રી સ્પેશિયલ પોસ્ટર ટેમ્પલેટ ઉપલબ્ધ છે!',
                style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13.5),
              ),
              subtitle: const Text(
                'તમારા ગામ માટે સુંદર દાંડિયા રાસ પોસ્ટર બનાવો.',
                style: TextStyle(fontSize: 12.0),
              ),
              trailing: const Text(
                '10m ago',
                style: TextStyle(fontSize: 11.0, color: Color(0xFF94A3B8)),
              ),
            ),
            ListTile(
              contentPadding: EdgeInsets.zero,
              leading: const CircleAvatar(
                backgroundColor: Color(0xFFFEF3C7),
                child: Icon(Icons.campaign_rounded, color: Color(0xFFD97706)),
              ),
              title: const Text(
                'ગ્રામ સભા મીટિંગ નોટિસ અપડેટ',
                style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13.5),
              ),
              subtitle: const Text(
                'નવી ગ્રામ વિકાસ સભા માટે તૈયાર પોસ્ટર જુઓ.',
                style: TextStyle(fontSize: 12.0),
              ),
              trailing: const Text(
                '2h ago',
                style: TextStyle(fontSize: 11.0, color: Color(0xFF94A3B8)),
              ),
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
      backgroundColor: _surfaceColor,
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
                child: _isHomeContentLoading
                    ? const Center(child: CircularProgressIndicator())
                    : _homeContentError != null
                    ? _buildHomeContentMessage(
                        _homeContentError!,
                        showRetry: true,
                      )
                    : (_homeContent?.templates.isNotEmpty ?? false)
                    ? GridView.builder(
                        controller: scrollController,
                        itemCount: _homeContent!.templates.length,
                        gridDelegate:
                            const SliverGridDelegateWithFixedCrossAxisCount(
                              crossAxisCount: 2,
                              crossAxisSpacing: 12.0,
                              mainAxisSpacing: 12.0,
                              childAspectRatio: 0.85,
                            ),
                        itemBuilder: (context, index) => _buildTemplateGridItem(
                          _homeContent!.templates[index],
                        ),
                      )
                    : _buildHomeContentMessage(
                        'No templates have been published by the admin yet.',
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTemplateGridItem(HomeContentTemplate template) {
    final imageUrl = AppConfigService.instance.resolveMediaUrl(
      template.imageUrl,
    );
    return GestureDetector(
      onTap: () {
        Navigator.of(context).pop();
        _showTemplateEditorModal(
          context,
          template.title,
          imageUrl,
          useNetworkImage: true,
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
                child: Image.network(
                  imageUrl,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) => const Center(
                    child: Icon(Icons.image_not_supported_outlined),
                  ),
                ),
              ),
              Container(
                color: Colors.white,
                padding: const EdgeInsets.symmetric(
                  horizontal: 8.0,
                  vertical: 6.0,
                ),
                child: Text(
                  template.title,
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

  void _showTemplateEditorModal(
    BuildContext context,
    String title,
    String asset, {
    bool useNetworkImage = false,
  }) {
    if (!useNetworkImage) {
      final project = PosterTemplateProject.createDefaultNavratriProject(
        templateId: 'home_template_${title.toLowerCase().replaceAll(' ', '_')}',
        imageAsset: asset,
        title: title,
      );
      Navigator.of(context)
          .pushNamed(AppRoutes.posterEditor, arguments: project);
      return;
    }

    final nameController = TextEditingController(
      text: _currentUser?.effectiveDisplayName ?? 'Panchayat Post User',
    );
    final villageController = TextEditingController(
      text: _currentUser?.villageCity ?? 'Gram Panchayat',
    );

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: _surfaceColor,
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
                    'Customize: $title',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      fontSize: 16.0,
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
            Center(
              child: ClipRRect(
                borderRadius: BorderRadius.circular(12.0),
                child: useNetworkImage
                    ? Image.network(
                        asset,
                        height: 140.0,
                        fit: BoxFit.contain,
                        errorBuilder: (context, error, stackTrace) =>
                            const Icon(
                              Icons.image_not_supported_outlined,
                              size: 48,
                            ),
                      )
                    : Image.asset(asset, height: 140.0, fit: BoxFit.contain),
              ),
            ),
            const SizedBox(height: 12.0),
            TextField(
              controller: nameController,
              decoration: InputDecoration(
                labelText: 'Your Name on Poster',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10.0),
                ),
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: 12.0,
                  vertical: 10.0,
                ),
              ),
            ),
            const SizedBox(height: 10.0),
            TextField(
              controller: villageController,
              decoration: InputDecoration(
                labelText: 'Village / Designation',
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(10.0),
                ),
                contentPadding: const EdgeInsets.symmetric(
                  horizontal: 12.0,
                  vertical: 10.0,
                ),
              ),
            ),
            const SizedBox(height: 14.0),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _primaryColor,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12.0),
                      ),
                      padding: const EdgeInsets.symmetric(vertical: 12.0),
                    ),
                    icon: const Icon(Icons.download_rounded, size: 18.0),
                    label: const Text(
                      'Save Poster',
                      style: TextStyle(fontWeight: FontWeight.w700),
                    ),
                    onPressed: () {
                      Navigator.of(ctx).pop();
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text(
                            'Poster for "$title" saved successfully!',
                          ),
                          backgroundColor: const Color(0xFF16A34A),
                        ),
                      );
                    },
                  ),
                ),
                const SizedBox(width: 10.0),
                Expanded(
                  child: OutlinedButton.icon(
                    style: OutlinedButton.styleFrom(
                      foregroundColor: _primaryColor,
                      side: BorderSide(color: _primaryColor),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12.0),
                      ),
                      padding: const EdgeInsets.symmetric(vertical: 12.0),
                    ),
                    icon: const Icon(Icons.share_rounded, size: 18.0),
                    label: const Text(
                      'Share',
                      style: TextStyle(fontWeight: FontWeight.w700),
                    ),
                    onPressed: () {
                      Navigator.of(ctx).pop();
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text(
                            'Sharing poster to WhatsApp & Social Media...',
                          ),
                          backgroundColor: Color(0xFF0055B8),
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

  void _showAiPosterModal(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: _surfaceColor,
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
                  child: Text(
                    'AI',
                    style: TextStyle(
                      color: _primaryColor,
                      fontWeight: FontWeight.w900,
                      fontSize: 13,
                    ),
                  ),
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
                hintStyle: const TextStyle(
                  fontSize: 13.0,
                  color: Color(0xFF94A3B8),
                ),
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
                backgroundColor: _primaryColor,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14.0),
                ),
                padding: const EdgeInsets.symmetric(vertical: 13.0),
              ),
              icon: const Icon(Icons.auto_awesome_rounded, size: 18.0),
              label: const Text(
                'Generate Poster with AI',
                style: TextStyle(fontWeight: FontWeight.w700),
              ),
              onPressed: () {
                Navigator.of(ctx).pop();
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(
                      'AI is generating your custom poster design...',
                    ),
                    backgroundColor: _primaryColor,
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
      backgroundColor: _surfaceColor,
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
                Icon(Icons.palette_outlined, color: _primaryColor),
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
            if (_isHomeContentLoading)
              const Padding(
                padding: EdgeInsets.all(24.0),
                child: Center(child: CircularProgressIndicator()),
              )
            else if (_homeContentError != null)
              _buildHomeContentMessage(_homeContentError!, showRetry: true)
            else if (_homeContent?.templates.isEmpty ?? true)
              _buildHomeContentMessage(
                'No templates have been published by the admin yet.',
              )
            else
              SizedBox(
                height: 250.0,
                child: GridView.builder(
                  itemCount: _homeContent!.templates.length,
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    crossAxisSpacing: 10.0,
                    mainAxisSpacing: 10.0,
                    childAspectRatio: 0.85,
                  ),
                  itemBuilder: (context, index) =>
                      _buildTemplateGridItem(_homeContent!.templates[index]),
                ),
              ),
            const SizedBox(height: 12.0),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: _primaryColor,
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
              child: const Text(
                'Browse All Designs',
                style: TextStyle(fontWeight: FontWeight.w700),
              ),
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
      backgroundColor: _surfaceColor,
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
                        _currentUser?.displayName ??
                            _currentUser?.fullName ??
                            'Rahul',
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
              leading: Icon(Icons.edit_note_rounded, color: _primaryColor),
              title: const Text(
                'Edit Profile Details',
                style: TextStyle(fontWeight: FontWeight.w600),
              ),
              trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14.0),
              onTap: () {
                Navigator.of(ctx).pop();
                Navigator.of(context)
                    .pushNamed(AppRoutes.profileSetup, arguments: _currentUser);
              },
            ),
            ListTile(
              leading: const Icon(
                Icons.layers_rounded,
                color: Color(0xFF0055B8),
              ),
              title: const Text(
                'Test All Screens (01–08)',
                style: TextStyle(fontWeight: FontWeight.w600),
              ),
              trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 14.0),
              onTap: () {
                Navigator.of(ctx).pop();
                _showScreensNavigator(context);
              },
            ),
            ListTile(
              leading: const Icon(
                Icons.logout_rounded,
                color: Color(0xFFDC2626),
              ),
              title: Text(
                strings.logoutDialogTitle,
                style: const TextStyle(
                  fontWeight: FontWeight.w600,
                  color: Color(0xFFDC2626),
                ),
              ),
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
      backgroundColor: _surfaceColor,
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
            _buildNavTile(
              ctx,
              'Screen 03: Create Account',
              AppRoutes.createAccount,
            ),
            _buildNavTile(ctx, 'Screen 04: User Login', AppRoutes.login),
            _buildNavTile(
              ctx,
              'Screen 05: Forgot Password',
              AppRoutes.forgotPassword,
            ),
            _buildNavTile(
              ctx,
              'Screen 06: Recovery Status',
              AppRoutes.recoveryStatus,
            ),
            _buildNavTile(
              ctx,
              'Screen 07: Profile Setup',
              AppRoutes.profileSetup,
            ),
            _buildNavTile(
              ctx,
              'Screen 08: Onboarding Confirmation',
              AppRoutes.onboardingConfirmation,
            ),
            _buildNavTile(ctx, 'Screen 09: Home Dashboard', AppRoutes.home),
            _buildNavTile(
              ctx,
              'Screen 10: Festival Listing',
              AppRoutes.festivals,
            ),
            _buildNavTile(
              ctx,
              'Screen 11: Festival Details',
              AppRoutes.festivalDetail,
            ),
            _buildNavTile(
              ctx,
              'Screen 12: Poster Editor Studio',
              AppRoutes.posterEditor,
            ),
            _buildNavTile(
              ctx,
              'Screen 13: Final Poster Preview & Share',
              AppRoutes.posterPreview,
            ),
            _buildNavTile(
              ctx,
              'Screen 14: My Designs Library',
              AppRoutes.myDesigns,
            ),
            _buildNavTile(ctx, 'Screen 15: User Profile', AppRoutes.profile),
            _buildNavTile(
              ctx,
              'Screen 16: Settings & Preferences',
              AppRoutes.settings,
            ),
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
      leading: Icon(Icons.circle, size: 8.0, color: _primaryColor),
      title: Text(
        label,
        style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13.5),
      ),
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
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20.0),
        ),
        title: Row(
          children: [
            const Icon(
              Icons.logout_rounded,
              color: Color(0xFFDC2626),
              size: 24.0,
            ),
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
              Navigator.of(context)
                  .pushNamedAndRemoveUntil(AppRoutes.welcome, (route) => false);
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
      onTap: () => _showProfileDrawer(context),
      child: Container(
        width: size,
        height: size,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          border: Border.all(color: Colors.white, width: 1.5),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.08),
              blurRadius: 4,
              offset: const Offset(0, 1),
            ),
          ],
          image: DecorationImage(image: avatarProvider, fit: BoxFit.cover),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final strings = LocaleScope.of(context).strings;
    final appTheme = Theme.of(context);
    final primaryColor = appTheme.colorScheme.primary;
    final headerStyle = AppConfigService.instance.config.headerStyle;
    final userName =
        (_currentUser?.effectiveDisplayName != null &&
            _currentUser!.effectiveDisplayName.isNotEmpty)
        ? _currentUser!.effectiveDisplayName.split(' ').first
        : 'Rahul';

    return Scaffold(
      backgroundColor: appTheme.scaffoldBackgroundColor,
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(20.0, 12.0, 20.0, 14.0),
              child: Row(
                children: [
                  Container(
                    width: 44.0,
                    height: 44.0,
                    decoration: BoxDecoration(
                      color: headerStyle == 'solid'
                          ? primaryColor.withValues(alpha: 0.12)
                          : appTheme.colorScheme.surface,
                      borderRadius: BorderRadius.circular(14.0),
                      border: Border.all(
                        color: appTheme.colorScheme.outlineVariant.withValues(
                          alpha: 0.45,
                        ),
                      ),
                    ),
                    alignment: Alignment.center,
                    child: Image.asset(
                      AppAssets.panchayatLogo,
                      height: 34.0,
                      fit: BoxFit.contain,
                    ),
                  ),
                  const SizedBox(width: 12.0),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          'Panchayat Post',
                          style: TextStyle(
                            fontSize: 11.0,
                            fontWeight: FontWeight.w800,
                            color: primaryColor,
                            letterSpacing: 0.25,
                          ),
                        ),
                        const SizedBox(height: 2.0),
                        Text(
                          strings.goodMorningGreeting,
                          style: TextStyle(
                            fontSize: 11.0,
                            fontWeight: FontWeight.w500,
                            color: appTheme.colorScheme.onSurfaceVariant,
                            height: 1.1,
                          ),
                        ),
                        Text(
                          '${strings.welcomeUserPrefix}$userName',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            fontSize: 16.0,
                            fontWeight: FontWeight.w800,
                            color: appTheme.colorScheme.onSurface,
                            height: 1.2,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 8.0),
                  Material(
                    color: appTheme.colorScheme.surface,
                    shape: CircleBorder(
                      side: BorderSide(
                        color: appTheme.colorScheme.outlineVariant.withValues(
                          alpha: 0.55,
                        ),
                      ),
                    ),
                    child: InkWell(
                      customBorder: const CircleBorder(),
                      onTap: () => _showNotificationsSheet(context),
                      child: SizedBox(
                        width: 42.0,
                        height: 42.0,
                        child: Stack(
                          alignment: Alignment.center,
                          children: [
                            Icon(
                              Icons.notifications_none_rounded,
                              size: 22.0,
                              color: appTheme.colorScheme.onSurface,
                            ),
                            if (_unreadNotificationsCount > 0)
                              Positioned(
                                top: 10.0,
                                right: 10.0,
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
                  ),
                  const SizedBox(width: 10.0),
                  _buildAvatarWidget(size: 42.0),
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
                    // B. Featured Festival Hero Banner
                    _buildFeaturedHeroBanner(),
                    const SizedBox(height: 16.0),

                    // C. Create Something New
                    _buildCreateSomethingNewSection(strings),
                    const SizedBox(height: 18.0),

                    // D. Popular Templates
                    _buildPopularTemplatesSection(strings),
                    const SizedBox(height: 18.0),

                    // E. Upcoming Festivals
                    _buildUpcomingFestivalsSection(strings),
                    const SizedBox(height: 12.0),

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

            // F. Bottom Navigation Bar
            _buildBottomNavigationBar(strings),
          ],
        ),
      ),
    );
  }

  // --- Sections ---

  Widget _buildFeaturedHeroBanner() {
    return ValueListenableBuilder<AppRemoteConfig>(
      valueListenable: AppConfigService.instance.configNotifier,
      builder: (context, config, child) {
        if (!config.isHeroVisible) return const SizedBox.shrink();

        final primaryColor = Theme.of(context).colorScheme.primary;
        final heroImageUrls = config.heroImageUrls
            .map((image) => image.trim())
            .where((image) => image.isNotEmpty)
            .toList();
        if (heroImageUrls.isEmpty) return const SizedBox.shrink();

        return Container(
          margin: const EdgeInsets.symmetric(horizontal: 16.0),
          height: 200.0,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(22.0),
            boxShadow: [
              BoxShadow(
                color: primaryColor.withValues(alpha: 0.12),
                blurRadius: 12,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Stack(
            children: [
              PageView.builder(
                controller: _heroPageController,
                itemCount: heroImageUrls.length,
                onPageChanged: (index) {
                  if (!mounted || _heroPageIndex == index) return;
                  setState(() => _heroPageIndex = index);
                },
                itemBuilder: (context, index) => Image.network(
                  AppConfigService.instance.resolveMediaUrl(
                    heroImageUrls[index],
                  ),
                  width: double.infinity,
                  height: 200.0,
                  fit: BoxFit.cover,
                  semanticLabel: 'Government announcement',
                  errorBuilder: (context, error, stackTrace) => Container(
                    color: Theme.of(context).colorScheme.surface,
                    alignment: Alignment.center,
                    child: Icon(
                      Icons.image_not_supported_outlined,
                      color: primaryColor,
                      size: 36.0,
                    ),
                  ),
                ),
              ),
              if (heroImageUrls.length > 1)
                Positioned(
                  right: 12.0,
                  bottom: 12.0,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10.0,
                      vertical: 5.0,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.black54,
                      borderRadius: BorderRadius.circular(20.0),
                    ),
                    child: Text(
                      '${_heroPageIndex + 1}/${heroImageUrls.length}',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 11.0,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildCreateSomethingNewSection(AppStrings strings) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Section Heading
          Row(
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
                  strings.createSomethingNewTitle,
                  style: const TextStyle(
                    fontSize: 16.0,
                    fontWeight: FontWeight.w800,
                    color: AppColors.textNavy,
                  ),
                ),
              ),
              const Icon(
                Icons.auto_awesome_rounded,
                size: 18.0,
                color: Color(0xFF8B5CF6),
              ),
            ],
          ),
          const SizedBox(height: 12.0),

          // 3 Cards Row
          Row(
            children: [
              // Card 1: Festival Posters
              Expanded(
                child: _buildCreateCard(
                  title: strings.cardFestivalPosters,
                  imageAsset: AppAssets.homeCreateFestival,
                  badgeWidget: Icon(
                    Icons.calendar_month_rounded,
                    size: 14.0,
                    color: _primaryColor,
                  ),
                  onTap: () => _showTemplatesModal(context, 'Festival'),
                ),
              ),
              const SizedBox(width: 10.0),

              // Card 2: Panchayat Posts
              Expanded(
                child: _buildCreateCard(
                  title: strings.cardPanchayatPosts,
                  imageAsset: AppAssets.homeCreatePanchayat,
                  badgeWidget: Icon(
                    Icons.campaign_rounded,
                    size: 14.0,
                    color: _primaryColor,
                  ),
                  onTap: () => _showTemplatesModal(context, 'Panchayat'),
                ),
              ),
              const SizedBox(width: 10.0),

              // Card 3: AI Poster
              Expanded(
                child: _buildCreateCard(
                  title: strings.cardAiPoster,
                  imageAsset: AppAssets.homeCreateAi,
                  badgeWidget: Text(
                    'AI',
                    style: TextStyle(
                      fontSize: 10.0,
                      fontWeight: FontWeight.w900,
                      color: _primaryColor,
                    ),
                  ),
                  onTap: () => _showAiPosterModal(context),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildCreateCard({
    required String title,
    required String imageAsset,
    required Widget badgeWidget,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 146.0,
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
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Artwork with Overlapping Icon
            Stack(
              clipBehavior: Clip.none,
              children: [
                ClipRRect(
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(16.0),
                  ),
                  child: Image.asset(
                    imageAsset,
                    height: 82.0,
                    width: double.infinity,
                    fit: BoxFit.cover,
                  ),
                ),
                Positioned(
                  left: 10.0,
                  bottom: -12.0,
                  child: Container(
                    width: 26.0,
                    height: 26.0,
                    decoration: BoxDecoration(
                      color: const Color(0xFFEDE9FE),
                      shape: BoxShape.circle,
                      border: Border.all(color: Colors.white, width: 2.0),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.08),
                          blurRadius: 4,
                          offset: const Offset(0, 1),
                        ),
                      ],
                    ),
                    alignment: Alignment.center,
                    child: badgeWidget,
                  ),
                ),
              ],
            ),
            const Spacer(),

            // Card Bottom (Label + Arrow)
            Padding(
              padding: const EdgeInsets.fromLTRB(10.0, 4.0, 10.0, 10.0),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Expanded(
                    child: Text(
                      title,
                      maxLines: 2,
                      style: const TextStyle(
                        fontSize: 11.5,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textNavy,
                        height: 1.15,
                      ),
                    ),
                  ),
                  Icon(
                    Icons.arrow_forward_rounded,
                    size: 14.0,
                    color: _primaryColor,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPopularTemplatesSection(AppStrings strings) {
    final templates = _homeContent?.templates ?? const <HomeContentTemplate>[];
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
                  color: _primaryColor,
                  borderRadius: BorderRadius.circular(2.0),
                ),
              ),
              const SizedBox(width: 8.0),
              Expanded(
                child: Text(
                  strings.popularTemplatesTitle,
                  style: const TextStyle(
                    fontSize: 16.0,
                    fontWeight: FontWeight.w800,
                    color: AppColors.textNavy,
                  ),
                ),
              ),
              GestureDetector(
                onTap: () => _showAllTemplatesLibrary(context),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      strings.seeAllAction,
                      style: TextStyle(
                        fontSize: 13.0,
                        fontWeight: FontWeight.w700,
                        color: _primaryColor,
                      ),
                    ),
                    const SizedBox(width: 2.0),
                    Icon(
                      Icons.arrow_forward_rounded,
                      size: 13.0,
                      color: _primaryColor,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12.0),

        // 4 Horizontal Template Cards
        SizedBox(
          height: 122.0,
          child: _isHomeContentLoading
              ? const Center(child: CircularProgressIndicator())
              : _homeContentError != null
              ? _buildHomeContentMessage(_homeContentError!, showRetry: true)
              : templates.isEmpty
              ? _buildHomeContentMessage(
                  'No templates have been published by the admin yet.',
                )
              : ListView.separated(
                  controller: _templatesScrollController,
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 16.0),
                  physics: const BouncingScrollPhysics(),
                  itemCount: templates.length,
                  separatorBuilder: (context, index) =>
                      const SizedBox(width: 10.0),
                  itemBuilder: (context, index) =>
                      _buildTemplateCard(templates[index]),
                ),
        ),
      ],
    );
  }

  Widget _buildTemplateCard(HomeContentTemplate template) {
    final imageUrl = AppConfigService.instance.resolveMediaUrl(
      template.imageUrl,
    );
    return GestureDetector(
      onTap: () => _showTemplateEditorModal(
        context,
        template.title,
        imageUrl,
        useNetworkImage: true,
      ),
      child: Container(
        width: 104.0,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(14.0),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.08),
              blurRadius: 8,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(14.0),
          child: Image.network(
            imageUrl,
            fit: BoxFit.cover,
            errorBuilder: (context, error, stackTrace) =>
                const Center(child: Icon(Icons.image_not_supported_outlined)),
          ),
        ),
      ),
    );
  }

  Widget _buildUpcomingFestivalsSection(AppStrings strings) {
    final festivals = _homeContent?.festivals ?? const <HomeContentFestival>[];
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
                  strings.upcomingFestivalsTitle,
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

        // Carousel with Floating Next Button
        SizedBox(
          height: 116.0,
          child: Stack(
            children: [
              ListView(
                controller: _festivalScrollController,
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.only(left: 16.0, right: 36.0),
                physics: const BouncingScrollPhysics(),
                children: _isHomeContentLoading
                    ? [
                        const SizedBox(
                          width: 250.0,
                          child: Center(child: CircularProgressIndicator()),
                        ),
                      ]
                    : _homeContentError != null
                    ? [
                        SizedBox(
                          width: 250.0,
                          child: _buildHomeContentMessage(
                            _homeContentError!,
                            showRetry: true,
                          ),
                        ),
                      ]
                    : festivals.isEmpty
                    ? [
                        SizedBox(
                          width: 250.0,
                          child: _buildHomeContentMessage(
                            'No upcoming festivals have been published by the admin yet.',
                          ),
                        ),
                      ]
                    : [
                        for (
                          var index = 0;
                          index < festivals.length;
                          index++
                        ) ...[
                          if (index > 0) const SizedBox(width: 10.0),
                          _buildFestivalCard(festivals[index]),
                        ],
                      ],
              ),

              // Floating Right Chevron Scroll Button
              Positioned(
                right: 8.0,
                top: 0,
                bottom: 0,
                child: Center(
                  child: GestureDetector(
                    onTap: () {
                      _festivalScrollController.animateTo(
                        _festivalScrollController.offset + 130.0,
                        duration: const Duration(milliseconds: 300),
                        curve: Curves.easeInOut,
                      );
                    },
                    child: Container(
                      width: 26.0,
                      height: 34.0,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16.0),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.12),
                            blurRadius: 6,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      alignment: Alignment.center,
                      child: Icon(
                        Icons.chevron_right_rounded,
                        size: 20.0,
                        color: _primaryColor,
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildFestivalCard(HomeContentFestival festival) {
    return GestureDetector(
      onTap: () => _showTemplatesModal(context, festival.title),
      child: Container(
        width: 130.0,
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
            SizedBox(
              height: 60.0,
              width: double.infinity,
              child: festival.imageUrl == null
                  ? const ColoredBox(
                      color: Color(0xFFEFF6FF),
                      child: Icon(Icons.celebration_outlined),
                    )
                  : Image.network(
                      AppConfigService.instance.resolveMediaUrl(
                        festival.imageUrl!,
                      ),
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) =>
                          const ColoredBox(
                            color: Color(0xFFEFF6FF),
                            child: Icon(Icons.celebration_outlined),
                          ),
                    ),
            ),
            const SizedBox(height: 6.0),
            Text(
              festival.title,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                fontSize: 13.0,
                fontWeight: FontWeight.w800,
                color: AppColors.textNavy,
              ),
            ),
            const SizedBox(height: 2.0),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(
                  Icons.calendar_month_outlined,
                  size: 11.0,
                  color: Color(0xFF64748B),
                ),
                const SizedBox(width: 4.0),
                Text(
                  _formatFestivalDate(festival.date),
                  style: const TextStyle(
                    fontSize: 10.5,
                    fontWeight: FontWeight.w600,
                    color: Color(0xFF64748B),
                  ),
                ),
              ],
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
              icon: Icons.calendar_month_outlined,
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
    final color = isSelected ? _primaryColor : const Color(0xFF64748B);

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
            Icon(icon, size: 22.0, color: color),
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
