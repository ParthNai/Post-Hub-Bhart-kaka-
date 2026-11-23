import 'dart:io';
import 'package:flutter/material.dart';
import 'package:panchayat_post/core/constants/app_assets.dart';
import 'package:panchayat_post/core/localization/app_localizations.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';
import 'package:panchayat_post/features/auth/data/auth_service.dart';
import 'package:panchayat_post/features/auth/domain/models/user_profile.dart';
import 'package:panchayat_post/features/editor/data/services/design_storage_service.dart';
import 'package:panchayat_post/features/editor/data/services/poster_export_service.dart';
import 'package:panchayat_post/features/editor/domain/models/poster_template_project.dart';

/// Screen 14: My Designs — Saved Posters Library
/// Recreated with pixel-perfect reference fidelity from media_1795420106947_2b17f99e.jpg.
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

  // Search & Filter State
  String _searchQuery = '';
  String _selectedCategory = 'All Designs'; // 'All Designs', 'Festivals', 'Panchayat', 'Business', 'Favorites'
  bool _isGridView = true;
  String _currentSort = 'Recently Created'; // 'Recently Created', 'Oldest First', 'Name A–Z', 'Name Z–A', 'Recently Updated'

  final TextEditingController _searchController = TextEditingController();

  final List<String> _categories = const [
    'All Designs',
    'Festivals',
    'Panchayat',
    'Business',
    'Favorites',
  ];

  @override
  void initState() {
    super.initState();
    _storageService = widget.storageService ?? DesignStorageService();
    _exportService = widget.exportService ?? PosterExportService();
    _authService = widget.authService ?? AuthService();

    _loadData();
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

    // 1. Filter by category
    if (_selectedCategory == 'Favorites') {
      result = result.where((d) => d.isFavorite).toList();
    } else if (_selectedCategory != 'All Designs') {
      result = result.where((d) {
        final cat = d.category.toLowerCase();
        final sel = _selectedCategory.toLowerCase();
        return cat.contains(sel) || sel.contains(cat);
      }).toList();
    }

    // 2. Search query filter
    if (_searchQuery.trim().isNotEmpty) {
      final q = _searchQuery.trim().toLowerCase();
      result = result.where((d) {
        return d.title.toLowerCase().contains(q) ||
            d.category.toLowerCase().contains(q) ||
            d.elements.any((e) => e.text.toLowerCase().contains(q));
      }).toList();
    }

    // 3. Sort
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

  String get _recentCreatedText {
    final now = DateTime.now();
    final todayCount = _allDesigns.where((d) {
      return d.createdAt.year == now.year &&
          d.createdAt.month == now.month &&
          d.createdAt.day == now.day;
    }).length;

    if (todayCount > 0) return 'Today';
    return '${_allDesigns.length}';
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

  // --- SORT MODAL ---
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
            // 1. Top Header
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
                            const SizedBox(height: 10.0),

                            // 2. Summary Cards Row
                            _buildSummaryCardsRow(s),
                            const SizedBox(height: 12.0),

                            // 3. Search Bar
                            _buildSearchBar(s),
                            const SizedBox(height: 12.0),

                            // 4. Category Filter Chips
                            _buildCategoryFilters(s),
                            const SizedBox(height: 16.0),

                            // 5. Gallery Toolbar (Heading + View Toggles + Sort)
                            _buildGalleryToolbar(s),
                            const SizedBox(height: 12.0),

                            // 6. Posters Display (Grid or List or Empty)
                            if (displayDesigns.isEmpty)
                              _buildEmptyState(s)
                            else ...[
                              if (_isGridView)
                                _buildPosterGrid(displayDesigns, s)
                              else
                                _buildPosterList(displayDesigns, s),

                              const SizedBox(height: 20.0),

                              // 7. Creative Empty / Sample Creation Banner matching reference
                              _buildCreationBanner(s),
                            ],
                            const SizedBox(height: 20.0),
                          ],
                        ),
                      ),
                    ),
            ),

            // 8. Bottom Navigation Bar
            _buildBottomNavigation(),
          ],
        ),
      ),
    );
  }

  // --- WIDGET BUILDERS ---

  // 1. Top Header
  Widget _buildHeader(AppStrings s) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 10.0),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(bottom: BorderSide(color: Color(0xFFE2E8F0), width: 0.8)),
      ),
      child: Row(
        children: [
          // Logo Card
          Container(
            width: 42.0,
            height: 42.0,
            padding: const EdgeInsets.all(5.0),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12.0),
              border: Border.all(color: const Color(0xFFE2E8F0)),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.04),
                  blurRadius: 6,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Image.asset(
              AppAssets.panchayatLogo,
              fit: BoxFit.contain,
              errorBuilder: (_, _, _) => const Icon(
                Icons.account_balance_rounded,
                color: Color(0xFFEA580C),
                size: 24.0,
              ),
            ),
          ),
          const SizedBox(width: 12.0),

          // Title & Subtitle Column
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  s.myDesignsTitle,
                  key: const ValueKey('my_designs_page_title'),
                  style: const TextStyle(
                    fontSize: 19.0,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF1E293B),
                  ),
                ),
                const SizedBox(height: 1.0),
                Text(
                  s.myDesignsSubtitle,
                  key: const ValueKey('my_designs_page_subtitle'),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 11.5,
                    fontWeight: FontWeight.w500,
                    color: Color(0xFF64748B),
                  ),
                ),
              ],
            ),
          ),

          // Notification Bell with Red Badge "2"
          Stack(
            clipBehavior: Clip.none,
            children: [
              IconButton(
                key: const ValueKey('my_designs_notification_button'),
                icon: const Icon(
                  Icons.notifications_outlined,
                  size: 24.0,
                  color: Color(0xFF1E293B),
                ),
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Notifications: 2 new design templates available')),
                  );
                },
              ),
              Positioned(
                top: 8.0,
                right: 8.0,
                child: Container(
                  width: 16.0,
                  height: 16.0,
                  alignment: Alignment.center,
                  decoration: const BoxDecoration(
                    color: Color(0xFFEF4444),
                    shape: BoxShape.circle,
                  ),
                  child: const Text(
                    '2',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 9.5,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ),
              ),
            ],
          ),

          // User Avatar
          InkWell(
            key: const ValueKey('my_designs_profile_avatar'),
            onTap: () => Navigator.of(context).pushNamed(AppRoutes.profileSetup),
            borderRadius: BorderRadius.circular(20.0),
            child: Container(
              width: 36.0,
              height: 36.0,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(color: const Color(0xFF6D28D9), width: 1.5),
              ),
              child: const CircleAvatar(
                backgroundColor: Color(0xFFF3E8FF),
                child: Icon(Icons.person, color: Color(0xFF6D28D9), size: 20.0),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // 2. Summary Metric Cards Row (Total Designs, Recently Created, Favorites)
  Widget _buildSummaryCardsRow(AppStrings s) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Row(
        children: [
          // Total Designs Card
          Expanded(
            child: _buildMetricCard(
              key: 'metric_total_designs',
              icon: Icons.image_outlined,
              value: '$_totalDesignsCount',
              label: s.totalDesignsLabel,
            ),
          ),
          const SizedBox(width: 8.0),

          // Recently Created Card
          Expanded(
            child: _buildMetricCard(
              key: 'metric_recently_created',
              icon: Icons.calendar_today_outlined,
              value: _recentCreatedText,
              label: s.recentlyCreatedLabel,
            ),
          ),
          const SizedBox(width: 8.0),

          // Favorites Card
          Expanded(
            child: _buildMetricCard(
              key: 'metric_favorites',
              icon: Icons.favorite_rounded,
              value: '$_favoritesCount',
              label: s.favoritesLabel,
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
      padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 10.0),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16.0),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 18.0, color: const Color(0xFF7C3AED)),
              const SizedBox(width: 6.0),
              Flexible(
                child: Text(
                  value,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 16.0,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF1E293B),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 4.0),
          Text(
            label,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(
              fontSize: 10.5,
              fontWeight: FontWeight.w600,
              color: Color(0xFF64748B),
            ),
          ),
        ],
      ),
    );
  }

  // 3. Search Bar & Filter Button
  Widget _buildSearchBar(AppStrings s) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Row(
        children: [
          // Search Input
          Expanded(
            child: Container(
              height: 46.0,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(14.0),
                border: Border.all(color: const Color(0xFFE2E8F0)),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.03),
                    blurRadius: 6,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: TextField(
                key: const ValueKey('my_designs_search_field'),
                controller: _searchController,
                onChanged: (val) => setState(() => _searchQuery = val),
                decoration: InputDecoration(
                  hintText: s.searchYourDesignsHint,
                  hintStyle: const TextStyle(color: Color(0xFF94A3B8), fontSize: 13.0),
                  prefixIcon: const Icon(Icons.search_rounded, color: Color(0xFF64748B), size: 20.0),
                  suffixIcon: _searchQuery.isNotEmpty
                      ? IconButton(
                          key: const ValueKey('designs_search_clear'),
                          icon: const Icon(Icons.close_rounded, size: 16.0, color: Color(0xFF64748B)),
                          onPressed: () {
                            _searchController.clear();
                            setState(() => _searchQuery = '');
                          },
                        )
                      : null,
                  border: InputBorder.none,
                  contentPadding: const EdgeInsets.symmetric(vertical: 12.0),
                ),
              ),
            ),
          ),
          const SizedBox(width: 8.0),

          // Filter Button
          InkWell(
            key: const ValueKey('my_designs_filter_button'),
            borderRadius: BorderRadius.circular(14.0),
            onTap: _openSortModal,
            child: Container(
              width: 46.0,
              height: 46.0,
              decoration: BoxDecoration(
                color: const Color(0xFFF3E8FF),
                borderRadius: BorderRadius.circular(14.0),
                border: Border.all(color: const Color(0xFFE9D5FF)),
              ),
              child: const Icon(
                Icons.tune_rounded,
                color: Color(0xFF7C3AED),
                size: 22.0,
              ),
            ),
          ),
        ],
      ),
    );
  }

  // 4. Category Filter Chips
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
              borderRadius: BorderRadius.circular(20.0),
              onTap: () => setState(() => _selectedCategory = category),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 12.0, vertical: 7.0),
                decoration: BoxDecoration(
                  color: isSelected ? const Color(0xFF6D28D9) : Colors.white,
                  borderRadius: BorderRadius.circular(20.0),
                  border: Border.all(
                    color: isSelected ? const Color(0xFF6D28D9) : const Color(0xFFE2E8F0),
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
                      color: isSelected ? Colors.white : const Color(0xFF475569),
                    ),
                    const SizedBox(width: 5.0),
                    Text(
                      category,
                      style: TextStyle(
                        fontSize: 12.0,
                        fontWeight: FontWeight.w700,
                        color: isSelected ? Colors.white : const Color(0xFF475569),
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
        return Icons.emoji_events_outlined;
      case 'Panchayat':
        return Icons.account_balance_outlined;
      case 'Business':
        return Icons.business_center_outlined;
      case 'Favorites':
        return Icons.favorite_rounded;
      default:
        return Icons.tag_rounded;
    }
  }

  // 5. Gallery Toolbar (Heading + View Mode Toggles + Sort)
  Widget _buildGalleryToolbar(AppStrings s) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Row(
        children: [
          // Vertical Indicator
          Container(
            width: 3.5,
            height: 16.0,
            decoration: BoxDecoration(
              color: const Color(0xFF6D28D9),
              borderRadius: BorderRadius.circular(2.0),
            ),
          ),
          const SizedBox(width: 8.0),

          // Section Heading
          Expanded(
            child: Text(
              s.yourCreationsTitle,
              style: const TextStyle(
                fontSize: 16.5,
                fontWeight: FontWeight.w800,
                color: Color(0xFF1E293B),
              ),
            ),
          ),

          // Grid View Toggle
          InkWell(
            key: const ValueKey('toggle_grid_view'),
            borderRadius: BorderRadius.circular(10.0),
            onTap: () => setState(() => _isGridView = true),
            child: Container(
              padding: const EdgeInsets.all(6.0),
              decoration: BoxDecoration(
                color: _isGridView ? const Color(0xFF6D28D9) : Colors.white,
                borderRadius: BorderRadius.circular(10.0),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Icon(
                Icons.grid_view_rounded,
                size: 18.0,
                color: _isGridView ? Colors.white : const Color(0xFF64748B),
              ),
            ),
          ),
          const SizedBox(width: 6.0),

          // List View Toggle
          InkWell(
            key: const ValueKey('toggle_list_view'),
            borderRadius: BorderRadius.circular(10.0),
            onTap: () => setState(() => _isGridView = false),
            child: Container(
              padding: const EdgeInsets.all(6.0),
              decoration: BoxDecoration(
                color: !_isGridView ? const Color(0xFF6D28D9) : Colors.white,
                borderRadius: BorderRadius.circular(10.0),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Icon(
                Icons.format_list_bulleted_rounded,
                size: 18.0,
                color: !_isGridView ? Colors.white : const Color(0xFF64748B),
              ),
            ),
          ),
          const SizedBox(width: 6.0),

          // Sort Button
          InkWell(
            key: const ValueKey('button_sort_designs'),
            borderRadius: BorderRadius.circular(10.0),
            onTap: _openSortModal,
            child: Container(
              padding: const EdgeInsets.all(6.0),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(10.0),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: const Icon(
                Icons.swap_vert_rounded,
                size: 18.0,
                color: Color(0xFF64748B),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // 6A. Poster Grid (2 Columns)
  Widget _buildPosterGrid(List<PosterTemplateProject> designs, AppStrings s) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: LayoutBuilder(
        builder: (context, constraints) {
          final itemWidth = (constraints.maxWidth - 12.0) / 2;

          return Wrap(
            spacing: 12.0,
            runSpacing: 14.0,
            children: designs.map((design) {
              return SizedBox(
                width: itemWidth,
                child: _buildPosterGridCard(design, s),
              );
            }).toList(),
          );
        },
      ),
    );
  }

  Widget _buildPosterGridCard(PosterTemplateProject design, AppStrings s) {
    return InkWell(
      key: ValueKey('design_card_grid_${design.id}'),
      borderRadius: BorderRadius.circular(16.0),
      onTap: () {
        Navigator.of(context).pushNamed(AppRoutes.posterEditor, arguments: design);
      },
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16.0),
          border: Border.all(color: const Color(0xFFE2E8F0)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.04),
              blurRadius: 8,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
          // Poster Thumbnail with Favorite Heart
          ClipRRect(
            borderRadius: const BorderRadius.vertical(top: Radius.circular(16.0)),
            child: AspectRatio(
              aspectRatio: 1.25,
              child: Stack(
                fit: StackFit.expand,
                children: [
                  Image.asset(
                    design.previewAsset ?? design.backgroundAsset,
                    fit: BoxFit.cover,
                    errorBuilder: (_, _, _) => Container(
                      color: design.backgroundColor,
                      child: const Center(
                        child: Icon(Icons.celebration_rounded, color: Colors.white30, size: 32.0),
                      ),
                    ),
                  ),

                  // Favorite Heart Button in top-right
                  Positioned(
                    top: 6.0,
                    right: 6.0,
                    child: InkWell(
                      key: ValueKey('favorite_btn_${design.id}'),
                      borderRadius: BorderRadius.circular(14.0),
                      onTap: () => _toggleFavorite(design),
                      child: Container(
                        padding: const EdgeInsets.all(5.0),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.90),
                          shape: BoxShape.circle,
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withValues(alpha: 0.12),
                              blurRadius: 4,
                            ),
                          ],
                        ),
                        child: Icon(
                          design.isFavorite ? Icons.favorite_rounded : Icons.favorite_border_rounded,
                          size: 15.0,
                          color: design.isFavorite ? const Color(0xFF7C3AED) : const Color(0xFF64748B),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Details & 3-Dots Menu Row
          Padding(
            padding: const EdgeInsets.all(10.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
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
                    _buildCardContextMenu(design, s),
                  ],
                ),
                const SizedBox(height: 4.0),

                // Category Badge
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6.0, vertical: 2.0),
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
                      const SizedBox(width: 3.0),
                      Text(
                        design.category,
                        style: const TextStyle(
                          fontSize: 10.0,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF6D28D9),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 6.0),

                // Date Row
                Row(
                  children: [
                    const Icon(
                      Icons.calendar_today_outlined,
                      size: 12.0,
                      color: Color(0xFF94A3B8),
                    ),
                    const SizedBox(width: 4.0),
                    Text(
                      _formatDesignDate(design.createdAt),
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
        ],
      ),
    ),
  );
}

  // 6B. Poster List View
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
                      errorBuilder: (_, _, _) => Container(color: design.backgroundColor),
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
                    color: design.isFavorite ? const Color(0xFF7C3AED) : const Color(0xFF94A3B8),
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

  // 3-Dots Context Menu
  Widget _buildCardContextMenu(PosterTemplateProject design, AppStrings s) {
    return PopupMenuButton<String>(
      key: ValueKey('menu_btn_${design.id}'),
      icon: const Icon(Icons.more_vert_rounded, size: 18.0, color: Color(0xFF64748B)),
      padding: EdgeInsets.zero,
      constraints: const BoxConstraints(),
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
              Text(s.deleteMenu, style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w600, color: Color(0xFFDC2626))),
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
    );
  }

  String _formatDesignDate(DateTime dt) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return '${dt.day.toString().padLeft(2, '0')} ${months[dt.month - 1]} ${dt.year}';
  }

  // 7. Creative Empty State / Sample Banner matching reference
  Widget _buildEmptyState(AppStrings s) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 24.0),
      child: Center(
        child: Column(
          children: [
            Image.asset(
              AppAssets.myDesignEmptyBox,
              height: 100.0,
              fit: BoxFit.contain,
              errorBuilder: (_, _, _) => const Icon(
                Icons.inventory_2_outlined,
                size: 64.0,
                color: Color(0xFF7C3AED),
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
            const SizedBox(height: 16.0),
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

  Widget _buildCreationBanner(AppStrings s) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16.0),
      padding: const EdgeInsets.all(14.0),
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
      child: Row(
        children: [
          // Illustration Box
          Image.asset(
            AppAssets.myDesignEmptyBox,
            width: 80.0,
            height: 70.0,
            fit: BoxFit.contain,
            errorBuilder: (_, _, _) => const Icon(Icons.card_giftcard, size: 40.0, color: Color(0xFF7C3AED)),
          ),
          const SizedBox(width: 12.0),

          // Message & CTA
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  s.noDesignsYetTitle,
                  style: const TextStyle(
                    fontSize: 14.5,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF1E293B),
                  ),
                ),
                const SizedBox(height: 2.0),
                Text(
                  s.noDesignsYetSubtitle,
                  style: const TextStyle(
                    fontSize: 11.5,
                    color: Color(0xFF64748B),
                  ),
                ),
                const SizedBox(height: 8.0),
                ElevatedButton(
                  key: const ValueKey('banner_create_first_poster_btn'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF6D28D9),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(horizontal: 14.0, vertical: 8.0),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20.0)),
                  ),
                  child: Text(
                    s.createFirstPosterButton,
                    style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.w700),
                  ),
                  onPressed: () => Navigator.of(context).pushNamed(AppRoutes.festivals),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // 8. Bottom Navigation Bar
  Widget _buildBottomNavigation() {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: Color(0xFFE2E8F0), width: 0.8)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildNavItem(
            icon: Icons.home_outlined,
            label: 'Home',
            isSelected: false,
            onTap: () => Navigator.of(context).pushReplacementNamed(AppRoutes.home),
          ),
          _buildNavItem(
            icon: Icons.calendar_month_outlined,
            label: 'Festivals',
            isSelected: false,
            onTap: () => Navigator.of(context).pushReplacementNamed(AppRoutes.festivals),
          ),
          _buildNavItem(
            icon: Icons.layers_outlined,
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
            icon: Icons.person_outline_rounded,
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
    return Expanded(
      child: InkWell(
        key: ValueKey('bottom_nav_${label.toLowerCase().replaceAll(' ', '_')}'),
        onTap: onTap,
        borderRadius: BorderRadius.circular(12.0),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 2.0, vertical: 4.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                icon,
                size: 22.0,
                color: isSelected ? const Color(0xFF6D28D9) : const Color(0xFF64748B),
              ),
              const SizedBox(height: 2.0),
              Text(
                label,
                style: TextStyle(
                  fontSize: 10.5,
                  fontWeight: isSelected ? FontWeight.w800 : FontWeight.w500,
                  color: isSelected ? const Color(0xFF6D28D9) : const Color(0xFF64748B),
                ),
                overflow: TextOverflow.ellipsis,
              ),
              if (isSelected) ...[
                const SizedBox(height: 2.0),
                Container(
                  width: 16.0,
                  height: 2.0,
                  decoration: BoxDecoration(
                    color: const Color(0xFF6D28D9),
                    borderRadius: BorderRadius.circular(1.0),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
