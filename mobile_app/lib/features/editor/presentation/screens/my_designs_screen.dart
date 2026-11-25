import 'dart:io';
import 'package:flutter/material.dart';
import 'package:panchayat_post/core/constants/app_assets.dart';
import 'package:panchayat_post/core/constants/app_colors.dart';
import 'package:panchayat_post/core/localization/app_localizations.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';
import 'package:panchayat_post/features/auth/data/auth_service.dart';
import 'package:panchayat_post/features/auth/domain/models/user_profile.dart';
import 'package:panchayat_post/features/editor/data/services/design_storage_service.dart';
import 'package:panchayat_post/features/editor/data/services/poster_export_service.dart';
import 'package:panchayat_post/features/editor/domain/models/poster_template_project.dart';

/// Screen 14: My Designs (મારા ડિઝાઇન્સ) — Saved Posters Library
/// Completely redesigned to accurately match the approved Screen 14 UI reference.
class MyDesignsScreen extends StatefulWidget {
  const MyDesignsScreen({
    super.key,
    this.storageService,
    this.exportService,
    this.authService,
    this.initialDesigns,
  });

  final DesignStorageService? storageService;
  final PosterExportService? exportService;
  final AuthService? authService;
  final List<PosterTemplateProject>? initialDesigns;

  @override
  State<MyDesignsScreen> createState() => _MyDesignsScreenState();
}

class _MyDesignsScreenState extends State<MyDesignsScreen> {
  late DesignStorageService _storageService;
  late PosterExportService _exportService;
  late AuthService _authService;

  UserProfile? _currentUser;
  List<PosterTemplateProject> _allDesigns = [];
  bool _isLoading = true;
  int _unreadNotificationsCount = 2;

  // Search & Filter State
  String _searchQuery = '';
  String _selectedCategory = 'All Designs';
  bool _isGridView = true;
  String _currentSort = 'Recently Created';
  bool _favoritesOnlyFilter = false;

  final TextEditingController _searchController = TextEditingController();

  final List<String> _categories = const [
    'All Designs',
    'Festivals',
    'Panchayat',
    'Business',
    'Other',
    'Favorites',
  ];

  @override
  void initState() {
    super.initState();
    _storageService = widget.storageService ?? DesignStorageService();
    _exportService = widget.exportService ?? PosterExportService();
    _authService = widget.authService ?? AuthService();

    _loadData();
    _searchController.addListener(() {
      final text = _searchController.text;
      if (text != _searchQuery) {
        setState(() => _searchQuery = text);
      }
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);
    final user = await _authService.getCurrentUser();
    final effectiveUserId = user?.username ?? 'default_user';

    List<PosterTemplateProject> designs;
    if (widget.initialDesigns != null) {
      designs = List.from(widget.initialDesigns!);
    } else {
      designs = await _storageService.seedSampleDesignsIfEmpty(effectiveUserId);
    }

    if (mounted) {
      setState(() {
        _currentUser = user;
        _allDesigns = designs;
        _isLoading = false;
      });
    }
  }

  // --- FILTERING & SORTING LOGIC ---
  List<PosterTemplateProject> get _filteredAndSortedDesigns {
    var result = List<PosterTemplateProject>.from(_allDesigns);

    // 1. Favorites only toggle
    if (_favoritesOnlyFilter) {
      result = result.where((d) => d.isFavorite).toList();
    }

    // 2. Filter by category
    if (_selectedCategory == 'Favorites') {
      result = result.where((d) => d.isFavorite).toList();
    } else if (_selectedCategory != 'All Designs') {
      result = result.where((d) {
        final cat = d.category.toLowerCase();
        final sel = _selectedCategory.toLowerCase();
        return cat.contains(sel) || sel.contains(cat);
      }).toList();
    }

    // 3. Search query filter
    if (_searchQuery.trim().isNotEmpty) {
      final q = _searchQuery.trim().toLowerCase();
      result = result.where((d) {
        return d.title.toLowerCase().contains(q) ||
            d.category.toLowerCase().contains(q) ||
            d.elements.any((e) => e.text.toLowerCase().contains(q));
      }).toList();
    }

    // 4. Sort
    switch (_currentSort) {
      case 'Oldest First':
        result.sort((a, b) => a.createdAt.compareTo(b.createdAt));
        break;
      case 'Name A–Z':
        result.sort((a, b) => a.title.toLowerCase().compareTo(b.title.toLowerCase()));
        break;
      case 'Name Z–A':
        result.sort((a, b) => b.title.toLowerCase().compareTo(a.title.toLowerCase()));
        break;
      case 'Favorites First':
        result.sort((a, b) {
          if (a.isFavorite && !b.isFavorite) return -1;
          if (!a.isFavorite && b.isFavorite) return 1;
          return b.createdAt.compareTo(a.createdAt);
        });
        break;
      case 'Recently Updated':
        result.sort((a, b) => b.updatedAt.compareTo(a.updatedAt));
        break;
      case 'Recently Created':
      default:
        result.sort((a, b) => b.createdAt.compareTo(a.createdAt));
        break;
    }

    return result;
  }

  // --- METRIC CALCULATIONS ---
  int get _totalDesignsCount => _allDesigns.length;

  int get _favoritesCount => _allDesigns.where((d) => d.isFavorite).length;

  int get _recentCreatedCount {
    if (_allDesigns.isEmpty) return 0;
    final now = DateTime.now();
    final count = _allDesigns.where((d) {
      final diff = now.difference(d.createdAt).inDays;
      return diff <= 60 || (d.createdAt.year == now.year && d.createdAt.month == now.month);
    }).length;
    return count > 0 ? count : _allDesigns.length;
  }

  // --- ACTIONS: FAVORITE, DUPLICATE, DELETE, SHARE, DOWNLOAD ---
  Future<void> _toggleFavorite(PosterTemplateProject design) async {
    final updated = await _storageService.toggleFavorite(design.id);
    if (updated != null && mounted) {
      setState(() {
        final idx = _allDesigns.indexWhere((d) => d.id == design.id);
        if (idx >= 0) {
          _allDesigns[idx] = updated;
        }
      });
    }
  }

  Future<void> _duplicateDesign(PosterTemplateProject design, AppStrings s) async {
    final copy = await _storageService.duplicateDesign(
      design,
      userId: _currentUser?.username ?? design.userId,
    );

    if (mounted) {
      setState(() {
        _allDesigns.insert(0, copy);
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('${s.duplicateCreatedSuccess} (${copy.title})'),
          backgroundColor: const Color(0xFF6D28D9),
        ),
      );
    }
  }

  void _confirmDelete(PosterTemplateProject design, AppStrings s) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(s.deleteConfirmTitle, key: const ValueKey('delete_dialog_title')),
        content: Text(s.deleteConfirmMessage),
        actions: [
          TextButton(
            key: const ValueKey('delete_dialog_cancel'),
            child: Text(s.cancelAction),
            onPressed: () => Navigator.of(ctx).pop(),
          ),
          ElevatedButton(
            key: const ValueKey('delete_dialog_confirm'),
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFDC2626)),
            child: Text(s.confirmDeleteAction, style: const TextStyle(color: Colors.white)),
            onPressed: () async {
              Navigator.of(ctx).pop();
              await _storageService.deleteDesign(design.id);
              if (mounted) {
                setState(() {
                  _allDesigns.removeWhere((d) => d.id == design.id);
                });
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Design deleted successfully')),
                );
              }
            },
          ),
        ],
      ),
    );
  }

  void _shareDesign(PosterTemplateProject design) {
    _exportService.sharePosterFile(
      file: File(design.backgroundAsset),
      text: 'Check out my design: ${design.title}',
    );
  }

  void _downloadDesign(PosterTemplateProject design) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Downloaded ${design.title} to device gallery'),
        backgroundColor: const Color(0xFF16A34A),
      ),
    );
  }

  // --- MODALS: NOTIFICATIONS, FILTER, SORT ---

  void _showNotificationsSheet(BuildContext context) {
    final strings = LocaleScope.maybeOf(context)?.strings ??
        AppStrings.of(AppStrings.defaultLanguageCode);
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
                '2h ago',
                style: TextStyle(fontSize: 11.0, color: Color(0xFF94A3B8)),
              ),
            ),
            const SizedBox(height: 12.0),
          ],
        ),
      ),
    );
  }

  void _openSortModal() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20.0)),
      ),
      builder: (ctx) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 16.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40.0,
                  height: 4.0,
                  decoration: BoxDecoration(
                    color: const Color(0xFFCBD5E1),
                    borderRadius: BorderRadius.circular(2.0),
                  ),
                ),
              ),
              const SizedBox(height: 16.0),
              const Text(
                'Sort Designs By',
                style: TextStyle(fontSize: 16.0, fontWeight: FontWeight.w800, color: Color(0xFF1E293B)),
              ),
              const SizedBox(height: 12.0),
              for (final sortOption in [
                'Recently Created',
                'Oldest First',
                'Name A–Z',
                'Name Z–A',
                'Favorites First',
                'Recently Updated',
              ])
                ListTile(
                  title: Text(sortOption, style: const TextStyle(fontWeight: FontWeight.w600)),
                  trailing: _currentSort == sortOption
                      ? const Icon(Icons.check_rounded, color: Color(0xFF6D28D9))
                      : null,
                  onTap: () {
                    setState(() => _currentSort = sortOption);
                    Navigator.of(ctx).pop();
                  },
                ),
            ],
          ),
        ),
      ),
    );
  }

  void _openFilterModal() {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24.0)),
      ),
      builder: (ctx) => StatefulBuilder(
        builder: (context, setModalState) => SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 18.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Center(
                  child: Container(
                    width: 40.0,
                    height: 4.0,
                    decoration: BoxDecoration(
                      color: const Color(0xFFCBD5E1),
                      borderRadius: BorderRadius.circular(2.0),
                    ),
                  ),
                ),
                const SizedBox(height: 16.0),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Filter Designs',
                      style: TextStyle(
                        fontSize: 18.0,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF1E293B),
                      ),
                    ),
                    TextButton(
                      onPressed: () {
                        setState(() {
                          _selectedCategory = 'All Designs';
                          _favoritesOnlyFilter = false;
                        });
                        Navigator.of(ctx).pop();
                      },
                      child: const Text(
                        'Reset All',
                        style: TextStyle(color: Color(0xFF6D28D9), fontWeight: FontWeight.w700),
                      ),
                    ),
                  ],
                ),
                const Divider(),
                const SizedBox(height: 10.0),
                const Text(
                  'Category',
                  style: TextStyle(fontSize: 14.0, fontWeight: FontWeight.w700, color: Color(0xFF475569)),
                ),
                const SizedBox(height: 10.0),
                Wrap(
                  spacing: 8.0,
                  runSpacing: 8.0,
                  children: _categories.take(5).map((cat) {
                    final isSel = _selectedCategory == cat;
                    return ChoiceChip(
                      label: Text(cat),
                      selected: isSel,
                      selectedColor: const Color(0xFF6D28D9),
                      labelStyle: TextStyle(
                        color: isSel ? Colors.white : const Color(0xFF475569),
                        fontWeight: FontWeight.w600,
                        fontSize: 12.0,
                      ),
                      onSelected: (val) {
                        setModalState(() {
                          _selectedCategory = cat;
                        });
                        setState(() {
                          _selectedCategory = cat;
                        });
                      },
                    );
                  }).toList(),
                ),
                const SizedBox(height: 16.0),
                SwitchListTile(
                  contentPadding: EdgeInsets.zero,
                  title: const Text(
                    'Favorites Only',
                    style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14.0),
                  ),
                  subtitle: const Text(
                    'Show only posters you have bookmarked',
                    style: TextStyle(fontSize: 12.0, color: Color(0xFF64748B)),
                  ),
                  activeThumbColor: const Color(0xFF6D28D9),
                  value: _favoritesOnlyFilter,
                  onChanged: (val) {
                    setModalState(() => _favoritesOnlyFilter = val);
                    setState(() => _favoritesOnlyFilter = val);
                  },
                ),
                const SizedBox(height: 16.0),
                SizedBox(
                  width: double.infinity,
                  height: 46.0,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF6D28D9),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14.0)),
                    ),
                    onPressed: () => Navigator.of(ctx).pop(),
                    child: const Text('Apply Filter', style: TextStyle(fontWeight: FontWeight.w700)),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // --- MAIN BUILD ---

  @override
  Widget build(BuildContext context) {
    final s = LocaleScope.maybeOf(context)?.strings ??
        AppStrings.of(AppStrings.defaultLanguageCode);

    final displayDesigns = _filteredAndSortedDesigns;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: Column(
          children: [
            // 1. Redesigned Premium Header
            _buildHeader(s),

            // Scrollable Content
            Expanded(
              child: _isLoading
                  ? const Center(
                      child: CircularProgressIndicator(
                        valueColor: AlwaysStoppedAnimation(Color(0xFF6D28D9)),
                      ),
                    )
                  : RefreshIndicator(
                      onRefresh: _loadData,
                      color: const Color(0xFF6D28D9),
                      child: SingleChildScrollView(
                        physics: const AlwaysScrollableScrollPhysics(
                          parent: BouncingScrollPhysics(),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const SizedBox(height: 12.0),

                            // 2. Summary Metric Cards Row
                            _buildSummaryCardsRow(s),
                            const SizedBox(height: 14.0),

                            // 3. Search Bar & Filter Button
                            _buildSearchBar(s),
                            const SizedBox(height: 14.0),

                            // 4. Category Filter Chips
                            _buildCategoryFilters(s),
                            const SizedBox(height: 18.0),

                            // 5. Gallery Toolbar (Heading + View Mode Toggles + Sort)
                            _buildGalleryToolbar(s),
                            const SizedBox(height: 14.0),

                            // 6. Posters Display (Grid or List or Empty)
                            if (displayDesigns.isEmpty)
                              _buildEmptyState(s)
                            else ...[
                              if (_isGridView)
                                _buildPosterGrid(displayDesigns, s)
                              else
                                _buildPosterList(displayDesigns, s),

                              const SizedBox(height: 18.0),

                              // 7. Create New Design Bottom Banner
                              _buildCreationBanner(s),
                            ],
                            const SizedBox(height: 18.0),
                          ],
                        ),
                      ),
                    ),
            ),

            // 8. Modern Pill Bottom Navigation Bar
            _buildBottomNavigation(),
          ],
        ),
      ),
    );
  }

  // --- 1. Redesigned Premium Header ---

  Widget _buildHeader(AppStrings s) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 10.0),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(bottom: BorderSide(color: Color(0xFFF1F5F9), width: 1.0)),
      ),
      child: Row(
        children: [
          // A. Original Logo (Strict: NO text beside it)
          Container(
            width: 40.0,
            height: 40.0,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: Colors.white,
              border: Border.all(color: const Color(0xFFE2E8F0)),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.04),
                  blurRadius: 4,
                  offset: const Offset(0, 1),
                ),
              ],
            ),
            child: ClipOval(
              child: Image.asset(
                AppAssets.panchayatLogo,
                fit: BoxFit.contain,
                errorBuilder: (_, error, stackTrace) => const Icon(
                  Icons.account_balance,
                  color: Color(0xFFEA580C),
                  size: 22.0,
                ),
              ),
            ),
          ),
          const SizedBox(width: 12.0),

          // B. Page Title & Subtitle
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text(
                  'મારા ડિઝાઇન્સ',
                  key: ValueKey('my_designs_page_title'),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 18.5,
                    fontWeight: FontWeight.w900,
                    color: Color(0xFF1E293B),
                    letterSpacing: -0.2,
                  ),
                ),
                const SizedBox(height: 1.0),
                const Text(
                  'તમારી બધી રચનાત્મક ડિઝાઇન્સ એક જગ્યાએ',
                  key: ValueKey('my_designs_page_subtitle'),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 11.2,
                    fontWeight: FontWeight.w500,
                    color: Color(0xFF64748B),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8.0),

          // C. Notification Bell with Badge '2'
          InkWell(
            key: const ValueKey('my_designs_notification_button'),
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

          // D. User Profile Avatar
          GestureDetector(
            key: const ValueKey('my_designs_profile_avatar'),
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

  // --- 2. Summary Metric Cards Row ---

  Widget _buildSummaryCardsRow(AppStrings s) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Row(
        children: [
          // Total Designs Card
          Expanded(
            child: _buildMetricCard(
              key: 'metric_total_designs',
              icon: Icons.photo_library_outlined,
              value: '$_totalDesignsCount',
              label: 'Total Designs',
            ),
          ),
          const SizedBox(width: 10.0),

          // Recently Created Card
          Expanded(
            child: _buildMetricCard(
              key: 'metric_recently_created',
              icon: Icons.calendar_month_outlined,
              value: '$_recentCreatedCount',
              label: 'Recently Created',
            ),
          ),
          const SizedBox(width: 10.0),

          // Favorites Card
          Expanded(
            child: _buildMetricCard(
              key: 'metric_favorites',
              icon: Icons.favorite_outline_rounded,
              value: '$_favoritesCount',
              label: 'Favorites',
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMetricCard({
    required String key,
    required IconData icon,
    required String value,
    required String label,
  }) {
    return Container(
      key: ValueKey(key),
      padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 12.0),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16.0),
        border: Border.all(color: const Color(0xFFEDE9FE)),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF6D28D9).withValues(alpha: 0.04),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          Icon(
            icon,
            size: 26.0,
            color: const Color(0xFF6D28D9),
          ),
          const SizedBox(width: 8.0),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                FittedBox(
                  fit: BoxFit.scaleDown,
                  child: Text(
                    value,
                    style: const TextStyle(
                      fontSize: 18.0,
                      fontWeight: FontWeight.w900,
                      color: Color(0xFF1E293B),
                    ),
                  ),
                ),
                const SizedBox(height: 1.0),
                FittedBox(
                  fit: BoxFit.scaleDown,
                  child: Text(
                    label,
                    style: const TextStyle(
                      fontSize: 10.2,
                      fontWeight: FontWeight.w500,
                      color: Color(0xFF64748B),
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

  // --- 3. Search Bar & Filter Button ---

  Widget _buildSearchBar(AppStrings s) {
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
                    size: 20.0,
                    color: Color(0xFF64748B),
                  ),
                  const SizedBox(width: 8.0),
                  Expanded(
                    child: TextField(
                      key: const ValueKey('my_designs_search_field'),
                      controller: _searchController,
                      style: const TextStyle(fontSize: 13.5, color: Color(0xFF1E293B)),
                      decoration: const InputDecoration(
                        hintText: 'Search your designs...',
                        hintStyle: TextStyle(
                          color: Color(0xFF94A3B8),
                          fontSize: 13.0,
                          fontWeight: FontWeight.w400,
                        ),
                        border: InputBorder.none,
                        isDense: true,
                        contentPadding: EdgeInsets.zero,
                      ),
                    ),
                  ),
                  if (_searchQuery.isNotEmpty)
                    IconButton(
                      key: const ValueKey('designs_search_clear'),
                      icon: const Icon(Icons.close_rounded, size: 18.0, color: Color(0xFF64748B)),
                      onPressed: () {
                        _searchController.clear();
                        setState(() => _searchQuery = '');
                      },
                    )
                  else
                    const SizedBox(width: 12.0),
                ],
              ),
            ),
          ),
          const SizedBox(width: 10.0),

          // Filter Button
          InkWell(
            key: const ValueKey('my_designs_filter_button'),
            borderRadius: BorderRadius.circular(16.0),
            onTap: _openFilterModal,
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

  // --- 4. Category Filter Chips ---

  Widget _buildCategoryFilters(AppStrings s) {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Row(
        children: _categories.map((category) {
          final isSelected = _selectedCategory == category;
          final icon = _getCategoryIcon(category);

          return Padding(
            padding: const EdgeInsets.only(right: 8.0),
            child: InkWell(
              key: ValueKey('chip_category_$category'),
              borderRadius: BorderRadius.circular(22.0),
              onTap: () => setState(() => _selectedCategory = category),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 14.0, vertical: 8.0),
                decoration: BoxDecoration(
                  color: isSelected ? const Color(0xFF6D28D9) : const Color(0xFFF3E8FF),
                  borderRadius: BorderRadius.circular(22.0),
                  border: Border.all(
                    color: isSelected ? const Color(0xFF6D28D9) : const Color(0xFFEDE9FE),
                  ),
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
                    Icon(
                      icon,
                      size: 15.0,
                      color: isSelected ? Colors.white : const Color(0xFF6D28D9),
                    ),
                    const SizedBox(width: 6.0),
                    Text(
                      category,
                      style: TextStyle(
                        fontSize: 12.0,
                        fontWeight: FontWeight.w700,
                        color: isSelected ? Colors.white : const Color(0xFF6D28D9),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  IconData _getCategoryIcon(String category) {
    switch (category) {
      case 'All Designs':
        return Icons.grid_view_rounded;
      case 'Festivals':
        return Icons.star_outline_rounded;
      case 'Panchayat':
        return Icons.account_balance_outlined;
      case 'Business':
        return Icons.business_center_outlined;
      case 'Other':
        return Icons.more_horiz_rounded;
      case 'Favorites':
        return Icons.favorite_rounded;
      default:
        return Icons.tag_rounded;
    }
  }

  // --- 5. Gallery Toolbar (Heading + View Mode Toggles + Sort) ---

  Widget _buildGalleryToolbar(AppStrings s) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Row(
        children: [
          // Vertical Indicator
          Container(
            width: 3.5,
            height: 18.0,
            decoration: BoxDecoration(
              color: const Color(0xFF6D28D9),
              borderRadius: BorderRadius.circular(2.0),
            ),
          ),
          const SizedBox(width: 8.0),

          // Section Heading
          const Expanded(
            child: Text(
              'Your Creations',
              style: TextStyle(
                fontSize: 17.0,
                fontWeight: FontWeight.w800,
                color: Color(0xFF1E293B),
              ),
            ),
          ),

          // Grid View Toggle
          InkWell(
            key: const ValueKey('toggle_grid_view'),
            borderRadius: BorderRadius.circular(12.0),
            onTap: () => setState(() => _isGridView = true),
            child: Container(
              width: 36.0,
              height: 36.0,
              decoration: BoxDecoration(
                color: _isGridView ? const Color(0xFF6D28D9) : const Color(0xFFF3E8FF),
                borderRadius: BorderRadius.circular(12.0),
              ),
              alignment: Alignment.center,
              child: Icon(
                Icons.grid_view_rounded,
                size: 18.0,
                color: _isGridView ? Colors.white : const Color(0xFF6D28D9),
              ),
            ),
          ),
          const SizedBox(width: 8.0),

          // List View Toggle
          InkWell(
            key: const ValueKey('toggle_list_view'),
            borderRadius: BorderRadius.circular(12.0),
            onTap: () => setState(() => _isGridView = false),
            child: Container(
              width: 36.0,
              height: 36.0,
              decoration: BoxDecoration(
                color: !_isGridView ? const Color(0xFF6D28D9) : const Color(0xFFF3E8FF),
                borderRadius: BorderRadius.circular(12.0),
              ),
              alignment: Alignment.center,
              child: Icon(
                Icons.format_list_bulleted_rounded,
                size: 18.0,
                color: !_isGridView ? Colors.white : const Color(0xFF6D28D9),
              ),
            ),
          ),
          const SizedBox(width: 8.0),

          // Sort Button
          InkWell(
            key: const ValueKey('button_sort_designs'),
            borderRadius: BorderRadius.circular(12.0),
            onTap: _openSortModal,
            child: Container(
              width: 36.0,
              height: 36.0,
              decoration: BoxDecoration(
                color: const Color(0xFFF3E8FF),
                borderRadius: BorderRadius.circular(12.0),
              ),
              alignment: Alignment.center,
              child: const Icon(
                Icons.swap_vert_rounded,
                size: 18.0,
                color: Color(0xFF6D28D9),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // --- 6A. Poster Grid (2 Columns) ---

  Widget _buildPosterGrid(List<PosterTemplateProject> designs, AppStrings s) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: GridView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        itemCount: designs.length,
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          crossAxisSpacing: 12.0,
          mainAxisSpacing: 14.0,
          childAspectRatio: 0.72,
        ),
        itemBuilder: (context, index) {
          final design = designs[index];
          return _buildPosterGridCard(design, s);
        },
      ),
    );
  }

  Widget _buildPosterGridCard(PosterTemplateProject design, AppStrings s) {
    return Container(
      key: ValueKey('design_card_grid_${design.id}'),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18.0),
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
              borderRadius: BorderRadius.circular(14.0),
              child: AspectRatio(
                aspectRatio: 1.25,
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    Image.asset(
                      design.previewAsset ?? design.backgroundAsset,
                      fit: BoxFit.cover,
                      errorBuilder: (_, error, stackTrace) => Container(
                        color: const Color(0xFFEDE9FE),
                        alignment: Alignment.center,
                        child: Text(
                          design.title,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontSize: 12.0,
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF6D28D9),
                          ),
                        ),
                      ),
                    ),

                    // Top-right Favorite Heart Button
                    Positioned(
                      top: 6.0,
                      right: 6.0,
                      child: InkWell(
                        key: ValueKey('favorite_btn_${design.id}'),
                        borderRadius: BorderRadius.circular(15.0),
                        onTap: () => _toggleFavorite(design),
                        child: Container(
                          width: 30.0,
                          height: 30.0,
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.92),
                            shape: BoxShape.circle,
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withValues(alpha: 0.12),
                                blurRadius: 4,
                                offset: const Offset(0, 1),
                              ),
                            ],
                          ),
                          alignment: Alignment.center,
                          child: Icon(
                            design.isFavorite
                                ? Icons.favorite_rounded
                                : Icons.favorite_border_rounded,
                            size: 16.0,
                            color: const Color(0xFF6D28D9),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // 2. Design Title
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 10.0),
            child: Text(
              design.title,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                fontSize: 13.0,
                fontWeight: FontWeight.w800,
                color: Color(0xFF1E293B),
              ),
            ),
          ),
          const SizedBox(height: 5.0),

          // 3. Category Tag + 3-Dots Menu
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 10.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Flexible(
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 6.0, vertical: 2.5),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF3E8FF),
                      borderRadius: BorderRadius.circular(8.0),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          _getCategoryIcon(design.category),
                          size: 11.0,
                          color: const Color(0xFF6D28D9),
                        ),
                        const SizedBox(width: 3.5),
                        Flexible(
                          child: Text(
                            design.category,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              fontSize: 10.5,
                              fontWeight: FontWeight.w700,
                              color: Color(0xFF6D28D9),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 4.0),
                _buildCardContextMenu(design, s),
              ],
            ),
          ),
          const SizedBox(height: 5.0),

          // 4. Creation Date
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
                    _formatDesignDate(design.createdAt),
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
          ),
        ],
      ),
    );
  }

  // --- 6B. Poster List View ---

  Widget _buildPosterList(List<PosterTemplateProject> designs, AppStrings s) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: ListView.separated(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        itemCount: designs.length,
        separatorBuilder: (context, index) => const SizedBox(height: 10.0),
        itemBuilder: (context, index) {
          final design = designs[index];

          return InkWell(
            key: ValueKey('design_card_list_${design.id}'),
            borderRadius: BorderRadius.circular(16.0),
            onTap: () {
              Navigator.of(context).pushNamed(AppRoutes.posterEditor, arguments: design);
            },
            child: Container(
              padding: const EdgeInsets.all(8.0),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16.0),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Row(
                children: [
                  // Thumbnail
                  ClipRRect(
                    borderRadius: BorderRadius.circular(12.0),
                    child: SizedBox(
                      width: 70.0,
                      height: 70.0,
                      child: Image.asset(
                        design.previewAsset ?? design.backgroundAsset,
                        fit: BoxFit.cover,
                        errorBuilder: (_, error, stackTrace) =>
                            Container(color: const Color(0xFFEDE9FE)),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12.0),

                  // Title & Details
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          design.title,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 14.0,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFF1E293B),
                          ),
                        ),
                        const SizedBox(height: 4.0),
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6.0, vertical: 2.0),
                              decoration: BoxDecoration(
                                color: const Color(0xFFF3E8FF),
                                borderRadius: BorderRadius.circular(8.0),
                              ),
                              child: Text(
                                design.category,
                                style: const TextStyle(
                                  fontSize: 10.0,
                                  fontWeight: FontWeight.w700,
                                  color: Color(0xFF6D28D9),
                                ),
                              ),
                            ),
                            const SizedBox(width: 8.0),
                            Text(
                              _formatDesignDate(design.createdAt),
                              style: const TextStyle(
                                fontSize: 11.0,
                                color: Color(0xFF64748B),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  // Favorite Button
                  IconButton(
                    icon: Icon(
                      design.isFavorite ? Icons.favorite_rounded : Icons.favorite_border_rounded,
                      color: const Color(0xFF6D28D9),
                      size: 20.0,
                    ),
                    onPressed: () => _toggleFavorite(design),
                  ),

                  // 3-Dots Menu
                  _buildCardContextMenu(design, s),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  // --- Context Menu (3-Dots) ---

  Widget _buildCardContextMenu(PosterTemplateProject design, AppStrings s) {
    return SizedBox(
      width: 24.0,
      height: 24.0,
      child: PopupMenuButton<String>(
      key: ValueKey('menu_btn_${design.id}'),
      icon: const Icon(Icons.more_vert_rounded, size: 18.0, color: Color(0xFF6D28D9)),
      padding: EdgeInsets.zero,
      constraints: const BoxConstraints(minWidth: 140.0),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.0)),
      itemBuilder: (context) => [
        PopupMenuItem(
          value: 'edit',
          child: Row(
            children: [
              const Icon(Icons.edit_outlined, size: 16.0, color: Color(0xFF6D28D9)),
              const SizedBox(width: 8.0),
              Text(s.editDesignMenu, style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w600)),
            ],
          ),
        ),
        PopupMenuItem(
          value: 'preview',
          child: Row(
            children: [
              const Icon(Icons.visibility_outlined, size: 16.0, color: Color(0xFF6D28D9)),
              const SizedBox(width: 8.0),
              Text(s.previewMenu, style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w600)),
            ],
          ),
        ),
        PopupMenuItem(
          value: 'duplicate',
          child: Row(
            children: [
              const Icon(Icons.copy_rounded, size: 16.0, color: Color(0xFF6D28D9)),
              const SizedBox(width: 8.0),
              Text(s.duplicateMenu, style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w600)),
            ],
          ),
        ),
        PopupMenuItem(
          value: 'download',
          child: Row(
            children: [
              const Icon(Icons.file_download_outlined, size: 16.0, color: Color(0xFF6D28D9)),
              const SizedBox(width: 8.0),
              Text(s.downloadMenu, style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w600)),
            ],
          ),
        ),
        PopupMenuItem(
          value: 'share',
          child: Row(
            children: [
              const Icon(Icons.share_outlined, size: 16.0, color: Color(0xFF6D28D9)),
              const SizedBox(width: 8.0),
              Text(s.shareMenu, style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w600)),
            ],
          ),
        ),
        const PopupMenuDivider(),
        PopupMenuItem(
          value: 'delete',
          child: Row(
            children: [
              const Icon(Icons.delete_outline_rounded, size: 16.0, color: Color(0xFFDC2626)),
              const SizedBox(width: 8.0),
              Text(
                s.deleteMenu,
                style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w600, color: Color(0xFFDC2626)),
              ),
            ],
          ),
        ),
      ],
      onSelected: (value) {
        switch (value) {
          case 'edit':
            Navigator.of(context).pushNamed(AppRoutes.posterEditor, arguments: design);
            break;
          case 'preview':
            Navigator.of(context).pushNamed(AppRoutes.posterPreview, arguments: design);
            break;
          case 'duplicate':
            _duplicateDesign(design, s);
            break;
          case 'download':
            _downloadDesign(design);
            break;
          case 'share':
            _shareDesign(design);
            break;
          case 'delete':
            _confirmDelete(design, s);
            break;
        }
      },
    ),
  );
}

  String _formatDesignDate(DateTime dt) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return '${months[dt.month - 1]} ${dt.day}, ${dt.year}';
  }

  // --- 7. Create New Design Bottom Banner ---

  Widget _buildCreationBanner(AppStrings s) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16.0),
      padding: const EdgeInsets.symmetric(horizontal: 14.0, vertical: 12.0),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFFF1F5FD), Color(0xFFF3E8FF)],
          begin: Alignment.centerLeft,
          end: Alignment.centerRight,
        ),
        borderRadius: BorderRadius.circular(20.0),
        border: Border.all(color: const Color(0xFFEDE9FE)),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF6D28D9).withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          // 3D Folder / Posters Illustration
          Image.asset(
            AppAssets.homeCreateFestivalThumb,
            width: 58.0,
            height: 52.0,
            fit: BoxFit.contain,
            errorBuilder: (_, error, stackTrace) => const Icon(
              Icons.folder_special_rounded,
              size: 40.0,
              color: Color(0xFF6D28D9),
            ),
          ),
          const SizedBox(width: 12.0),

          // Text Column
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'નવું ડિઝાઇન બનાવો',
                  style: TextStyle(
                    fontSize: 15.0,
                    fontWeight: FontWeight.w900,
                    color: Color(0xFF1E293B),
                  ),
                ),
                SizedBox(height: 2.0),
                Text(
                  'તમે નવી પોસ્ટર બનાવવા માંગો છો?',
                  style: TextStyle(
                    fontSize: 11.2,
                    fontWeight: FontWeight.w500,
                    color: Color(0xFF64748B),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8.0),

          // "+ નવી ડિઝાઇન" Action Button
          InkWell(
            key: const ValueKey('banner_create_first_poster_btn'),
            borderRadius: BorderRadius.circular(20.0),
            onTap: () => Navigator.of(context).pushNamed(AppRoutes.festivals),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12.0, vertical: 8.5),
              decoration: BoxDecoration(
                color: const Color(0xFF6D28D9),
                borderRadius: BorderRadius.circular(20.0),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF6D28D9).withValues(alpha: 0.30),
                    blurRadius: 6,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: const Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.add_rounded, size: 16.0, color: Colors.white),
                  SizedBox(width: 3.0),
                  Text(
                    'નવી ડિઝાઇન',
                    style: TextStyle(
                      fontSize: 11.5,
                      fontWeight: FontWeight.w800,
                      color: Colors.white,
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

  // --- Empty State ---

  Widget _buildEmptyState(AppStrings s) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 36.0),
      child: Center(
        child: Column(
          children: [
            Image.asset(
              AppAssets.myDesignEmptyBox,
              height: 100.0,
              fit: BoxFit.contain,
              errorBuilder: (_, error, stackTrace) => const Icon(
                Icons.inventory_2_outlined,
                size: 64.0,
                color: Color(0xFF6D28D9),
              ),
            ),
            const SizedBox(height: 16.0),
            Text(
              s.noDesignsYetTitle,
              style: const TextStyle(
                fontSize: 16.5,
                fontWeight: FontWeight.w800,
                color: Color(0xFF1E293B),
              ),
            ),
            const SizedBox(height: 4.0),
            Text(
              s.noDesignsYetSubtitle,
              style: const TextStyle(
                fontSize: 12.5,
                color: Color(0xFF64748B),
              ),
            ),
            const SizedBox(height: 18.0),
            ElevatedButton(
              key: const ValueKey('empty_create_first_poster_btn'),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF6D28D9),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 12.0),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24.0)),
              ),
              child: Text(
                s.createFirstPosterButton,
                style: const TextStyle(fontWeight: FontWeight.w700),
              ),
              onPressed: () => Navigator.of(context).pushNamed(AppRoutes.festivals),
            ),
          ],
        ),
      ),
    );
  }

  // --- 8. Modern Pill Bottom Navigation Bar ---

  Widget _buildBottomNavigation() {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: Color(0xFFF1F5F9), width: 1.0)),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 12.0, vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildNavItem(
            icon: Icons.home_rounded,
            label: 'Home',
            isSelected: false,
            onTap: () => Navigator.of(context).pushReplacementNamed(AppRoutes.home),
          ),
          _buildNavItem(
            icon: Icons.calendar_month_rounded,
            label: 'Festivals',
            isSelected: false,
            onTap: () => Navigator.of(context).pushReplacementNamed(AppRoutes.festivals),
          ),
          _buildNavItem(
            icon: Icons.layers_rounded,
            label: 'Templates',
            isSelected: false,
            onTap: () => Navigator.of(context).pushReplacementNamed(AppRoutes.festivals),
          ),
          _buildNavItem(
            icon: Icons.photo_library_rounded,
            label: 'My Designs',
            isSelected: true,
            onTap: () {},
          ),
          _buildNavItem(
            icon: Icons.person_rounded,
            label: 'Profile',
            isSelected: false,
            onTap: () => Navigator.of(context).pushNamed(AppRoutes.profile),
          ),
        ],
      ),
    );
  }

  Widget _buildNavItem({
    required IconData icon,
    required String label,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    final color = isSelected ? const Color(0xFF6D28D9) : const Color(0xFF64748B);
    return Expanded(
      child: InkWell(
        key: ValueKey('bottom_nav_${label.toLowerCase().replaceAll(' ', '_')}'),
        onTap: onTap,
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
                  style: TextStyle(
                    fontSize: 11.0,
                    fontWeight: isSelected ? FontWeight.w800 : FontWeight.w500,
                    color: color,
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
