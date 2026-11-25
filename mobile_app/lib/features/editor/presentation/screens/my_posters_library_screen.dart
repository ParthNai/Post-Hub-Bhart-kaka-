import 'dart:io';
import 'package:flutter/material.dart';
import 'package:panchayat_post/core/constants/app_assets.dart';
import 'package:panchayat_post/core/localization/app_localizations.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';
import 'package:panchayat_post/features/auth/data/auth_service.dart';
import 'package:panchayat_post/features/editor/data/services/design_storage_service.dart';
import 'package:panchayat_post/features/editor/data/services/poster_library_service.dart';
import 'package:panchayat_post/features/editor/domain/models/poster_template_project.dart';

/// Screen 22: My Posters – Saved Drafts & Poster Library
/// Exact UI replication from media_1795589933381_ceb394ee.jpg.
class MyPostersLibraryScreen extends StatefulWidget {
  const MyPostersLibraryScreen({
    super.key,
    this.libraryService,
    this.storageService,
    this.authService,
    this.initialPosters,
  });

  final PosterLibraryService? libraryService;
  final DesignStorageService? storageService;
  final AuthService? authService;
  final List<PosterTemplateProject>? initialPosters;

  @override
  State<MyPostersLibraryScreen> createState() => _MyPostersLibraryScreenState();
}

class _MyPostersLibraryScreenState extends State<MyPostersLibraryScreen> {
  // Theme Color Palette
  static const Color _kBg = Color(0xFFF9FAFB);
  static const Color _kNavyText = Color(0xFF1A1D2E);
  static const Color _kMutedText = Color(0xFF6B7280);
  static const Color _kBorderColor = Color(0xFFE5E7EB);
  static const Color _kPurplePrimary = Color(0xFF6C5CE7);
  static const Color _kPurpleTint = Color(0xFFF5F3FF);
  static const Color _kCardBg = Colors.white;

  late PosterLibraryService _libraryService;
  late AuthService _authService;

  List<PosterTemplateProject> _posters = [];
  Map<String, int> _counts = {'total': 0, 'drafts': 0, 'completed': 0, 'exported': 0};
  bool _isLoading = true;

  // Tabs & Filters
  String _selectedTab = 'All Posters'; // 'All Posters', 'Drafts', 'Exported'
  String _selectedCategory = 'All'; // 'All', 'Festivals', 'Panchayat', 'National', 'Business'
  String _selectedDateFilter = 'All Dates'; // 'All Dates', 'Last 7 Days', 'Last 30 Days', 'This Year'
  String _selectedSort = 'Recently Updated'; // 'Recently Updated', 'Oldest First', 'Name A-Z'

  final TextEditingController _searchController = TextEditingController();
  final FocusNode _searchFocusNode = FocusNode();
  int _selectedNavIndex = 3; // 'My Designs' tab active

  @override
  void initState() {
    super.initState();
    _libraryService = widget.libraryService ??
        PosterLibraryService(
          storageService: widget.storageService,
        );
    _authService = widget.authService ?? AuthService();

    _loadData();
  }

  @override
  void dispose() {
    _searchController.dispose();
    _searchFocusNode.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);
    final user = await _authService.getCurrentUser();
    final effectiveUserId = user?.username ?? 'default_user';

    if (widget.initialPosters != null && _posters.isEmpty) {
      _posters = List.from(widget.initialPosters!);
      _counts = {
        'total': _posters.length,
        'drafts': _posters.where((p) => p.isDraft).length,
        'completed': _posters.where((p) => p.isCompleted || p.isExported).length,
        'exported': _posters.where((p) => p.isExported).length,
      };
      if (mounted) setState(() => _isLoading = false);
      return;
    }

    final posters = await _libraryService.getPosters(
      userId: effectiveUserId,
      tab: _selectedTab,
      searchQuery: _searchController.text,
      categoryFilter: _selectedCategory,
      dateFilter: _selectedDateFilter,
      sortBy: _selectedSort,
    );

    final counts = await _libraryService.getCounts(userId: effectiveUserId);

    if (mounted) {
      setState(() {
        _posters = posters;
        _counts = counts;
        _isLoading = false;
      });
    }
  }

  // --- ACTIONS ---

  void _onTabSelected(String tab) {
    if (_selectedTab == tab) return;
    setState(() => _selectedTab = tab);
    _loadData();
  }

  void _onCategoryChanged(String category) {
    setState(() => _selectedCategory = category);
    _loadData();
  }

  void _onDateFilterChanged(String dateFilter) {
    setState(() => _selectedDateFilter = dateFilter);
    _loadData();
  }

  void _onSortChanged(String sort) {
    setState(() => _selectedSort = sort);
    _loadData();
  }

  void _openInEditor(PosterTemplateProject poster) {
    Navigator.of(context).pushNamed(
      AppRoutes.mainPosterEditor,
      arguments: poster,
    ).then((_) => _loadData());
  }

  void _previewPoster(PosterTemplateProject poster) {
    showDialog<void>(
      context: context,
      builder: (ctx) => Dialog(
        backgroundColor: Colors.transparent,
        insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 36),
        child: Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(18),
            boxShadow: const [
              BoxShadow(
                color: Colors.black26,
                blurRadius: 20,
                offset: Offset(0, 8),
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 12, 12, 8),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        poster.title,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: _kNavyText,
                        ),
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close_rounded, color: _kNavyText),
                      onPressed: () => Navigator.of(ctx).pop(),
                    ),
                  ],
                ),
              ),
              const Divider(height: 1, color: _kBorderColor),
              Padding(
                padding: const EdgeInsets.all(16),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: AspectRatio(
                    aspectRatio: 1.0,
                    child: _buildPosterImage(poster),
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                child: Row(
                  children: [
                    Expanded(
                      child: OutlinedButton.icon(
                        style: OutlinedButton.styleFrom(
                          foregroundColor: _kPurplePrimary,
                          side: const BorderSide(color: _kPurplePrimary),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          padding: const EdgeInsets.symmetric(vertical: 12),
                        ),
                        icon: const Icon(Icons.edit_outlined, size: 18),
                        label: const Text('Edit in Studio', style: TextStyle(fontWeight: FontWeight.bold)),
                        onPressed: () {
                          Navigator.of(ctx).pop();
                          _openInEditor(poster);
                        },
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: _kPurplePrimary,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          elevation: 0,
                        ),
                        icon: const Icon(Icons.file_download_outlined, size: 18),
                        label: const Text('Export', style: TextStyle(fontWeight: FontWeight.bold)),
                        onPressed: () {
                          Navigator.of(ctx).pop();
                          _exportPoster(poster);
                        },
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _duplicatePoster(PosterTemplateProject poster) async {
    try {
      final copy = await _libraryService.duplicatePoster(poster.id);
      await _loadData();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('${copy.title} created as draft.'),
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to duplicate: $e')),
        );
      }
    }
  }

  Future<void> _renamePoster(PosterTemplateProject poster) async {
    final s = LocaleScope.of(context).strings;
    final controller = TextEditingController(text: poster.title);

    await showDialog<void>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Text(
          s.renamePosterTitle,
          style: const TextStyle(fontWeight: FontWeight.bold, color: _kNavyText, fontSize: 18),
        ),
        content: TextField(
          controller: controller,
          autofocus: true,
          decoration: InputDecoration(
            hintText: s.enterNewPosterTitle,
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: _kPurplePrimary, width: 2),
            ),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: Text(s.filterAllLabel == 'All' ? 'Cancel' : 'રદ કરો', style: const TextStyle(color: _kMutedText)),
          ),
          ElevatedButton(
            key: const Key('btn_confirm_rename'),
            style: ElevatedButton.styleFrom(
              backgroundColor: _kPurplePrimary,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              elevation: 0,
            ),
            onPressed: () async {
              final newTitle = controller.text.trim();
              if (newTitle.isNotEmpty) {
                Navigator.of(ctx).pop();
                await _libraryService.renamePoster(poster.id, newTitle);
                await _loadData();
              }
            },
            child: Text(s.saveDesignButton.isNotEmpty ? 'Save' : 'સાચવો'),
          ),
        ],
      ),
    );
  }

  void _exportPoster(PosterTemplateProject poster) {
    Navigator.of(context).pushNamed(
      AppRoutes.exportPoster,
      arguments: poster,
    ).then((_) => _loadData());
  }

  Future<void> _deletePoster(PosterTemplateProject poster) async {
    final s = LocaleScope.of(context).strings;

    await showDialog<void>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Text(
          s.deletePosterAction,
          style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.red, fontSize: 18),
        ),
        content: Text(
          '${s.deletePosterConfirmMessage}\n"${poster.title}"',
          style: const TextStyle(color: _kNavyText, fontSize: 14),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: Text(s.filterAllLabel == 'All' ? 'Cancel' : 'રદ કરો', style: const TextStyle(color: _kMutedText)),
          ),
          ElevatedButton(
            key: const Key('btn_confirm_delete_poster'),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              elevation: 0,
            ),
            onPressed: () async {
              Navigator.of(ctx).pop();
              await _libraryService.deletePoster(poster.id);
              await _loadData();
              if (mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Poster deleted successfully.')),
                );
              }
            },
            child: Text(s.deletePosterAction),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final s = LocaleScope.of(context).strings;

    return Scaffold(
      backgroundColor: _kBg,
      floatingActionButton: FloatingActionButton(
        key: const Key('btn_fab_create_poster'),
        backgroundColor: _kPurplePrimary,
        foregroundColor: Colors.white,
        elevation: 4,
        onPressed: () {
          Navigator.of(context).pushNamed(AppRoutes.festivals);
        },
        child: const Icon(Icons.add_rounded, size: 28),
      ),
      body: SafeArea(
        child: Column(
          children: [
            _buildHeader(s),
            Expanded(
              child: _isLoading
                  ? const Center(
                      child: CircularProgressIndicator(
                        valueColor: AlwaysStoppedAnimation<Color>(_kPurplePrimary),
                      ),
                    )
                  : RefreshIndicator(
                      onRefresh: _loadData,
                      color: _kPurplePrimary,
                      child: SingleChildScrollView(
                        physics: const AlwaysScrollableScrollPhysics(
                          parent: BouncingScrollPhysics(),
                        ),
                        padding: const EdgeInsets.fromLTRB(16, 4, 16, 80),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            // 1. Summary Metrics Cards (Total, Drafts, Completed)
                            _buildSummaryCards(s),
                            const SizedBox(height: 16),

                            // 2. Category Tabs (All Posters, Drafts, Exported)
                            _buildCategoryTabs(s),
                            const SizedBox(height: 14),

                            // 3. Search and Secondary Filters Bar
                            _buildSearchAndFilters(s),
                            const SizedBox(height: 16),

                            // 4. Posters Grid or Empty State
                            if (_posters.isEmpty)
                              _buildEmptyStateView(s)
                            else ...[
                              _buildPostersGrid(s),
                              const SizedBox(height: 20),
                              // Showcase Empty / Create Poster Card from reference
                              _buildEmptyStateCard(s),
                            ],
                          ],
                        ),
                      ),
                    ),
            ),
            _buildBottomNav(),
          ],
        ),
      ),
    );
  }

  // --- 1. Header Bar ---
  Widget _buildHeader(AppStrings s) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          // Back button
          InkWell(
            key: const Key('btn_posters_back'),
            onTap: () => Navigator.of(context).pop(),
            borderRadius: BorderRadius.circular(12),
            child: Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: _kBorderColor, width: 1),
                boxShadow: const [
                  BoxShadow(
                    color: Color(0x0A000000),
                    blurRadius: 4,
                    offset: Offset(0, 2),
                  ),
                ],
              ),
              child: const Icon(
                Icons.arrow_back_ios_new_rounded,
                size: 18,
                color: _kNavyText,
              ),
            ),
          ),
          const SizedBox(width: 14),
          // Title & Subtitle
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  s.myPostersTitle,
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: _kNavyText,
                    letterSpacing: -0.2,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  s.myPostersSubtitle,
                  style: const TextStyle(
                    fontSize: 13,
                    color: _kMutedText,
                  ),
                ),
              ],
            ),
          ),
          // Search Icon Action
          InkWell(
            key: const Key('btn_header_search'),
            onTap: () {
              _searchFocusNode.requestFocus();
            },
            borderRadius: BorderRadius.circular(12),
            child: Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: _kBorderColor, width: 1),
                boxShadow: const [
                  BoxShadow(
                    color: Color(0x0A000000),
                    blurRadius: 4,
                    offset: Offset(0, 2),
                  ),
                ],
              ),
              child: const Icon(
                Icons.search_rounded,
                size: 20,
                color: _kPurplePrimary,
              ),
            ),
          ),
          const SizedBox(width: 8),
          // Filter Icon Action
          PopupMenuButton<String>(
            key: const Key('btn_header_filter'),
            tooltip: 'Filter Category',
            color: Colors.white,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
            icon: Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: _kBorderColor, width: 1),
                boxShadow: const [
                  BoxShadow(
                    color: Color(0x0A000000),
                    blurRadius: 4,
                    offset: Offset(0, 2),
                  ),
                ],
              ),
              child: const Icon(
                Icons.tune_rounded,
                size: 20,
                color: _kPurplePrimary,
              ),
            ),
            onSelected: _onCategoryChanged,
            itemBuilder: (ctx) => [
              _buildPopupCheckItem('All', 'All Categories', _selectedCategory == 'All'),
              _buildPopupCheckItem('Festivals', 'Festivals', _selectedCategory == 'Festivals'),
              _buildPopupCheckItem('Panchayat', 'Panchayat', _selectedCategory == 'Panchayat'),
              _buildPopupCheckItem('National', 'National', _selectedCategory == 'National'),
              _buildPopupCheckItem('Business', 'Business', _selectedCategory == 'Business'),
            ],
          ),
        ],
      ),
    );
  }

  // --- 2. Summary Metric Cards Section ---
  Widget _buildSummaryCards(AppStrings s) {
    return Row(
      children: [
        Expanded(
          child: _buildMetricCard(
            keyName: 'metric_total_posters',
            icon: Icons.image_outlined,
            count: _counts['total'] ?? _posters.length,
            label: s.totalPostersLabel,
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: _buildMetricCard(
            keyName: 'metric_drafts',
            icon: Icons.history_edu_outlined,
            count: _counts['drafts'] ?? 0,
            label: s.draftsLabel,
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: _buildMetricCard(
            keyName: 'metric_completed',
            icon: Icons.check_circle_outline_rounded,
            count: _counts['completed'] ?? 0,
            label: s.completedLabel,
          ),
        ),
      ],
    );
  }

  Widget _buildMetricCard({
    required String keyName,
    required IconData icon,
    required int count,
    required String label,
  }) {
    return Container(
      key: Key(keyName),
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 12),
      decoration: BoxDecoration(
        color: _kCardBg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: _kBorderColor),
        boxShadow: const [
          BoxShadow(
            color: Color(0x06000000),
            blurRadius: 8,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 32,
            height: 32,
            decoration: BoxDecoration(
              color: _kPurpleTint,
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, size: 18, color: _kPurplePrimary),
          ),
          const SizedBox(height: 8),
          Text(
            '$count',
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: _kNavyText,
            ),
          ),
          const SizedBox(height: 1),
          Text(
            label,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(
              fontSize: 11.5,
              fontWeight: FontWeight.w500,
              color: _kMutedText,
            ),
          ),
        ],
      ),
    );
  }

  // --- 3. Category Tabs (All Posters, Drafts, Exported) ---
  Widget _buildCategoryTabs(AppStrings s) {
    return Row(
      children: [
        Expanded(
          child: _buildTabPill(
            key: const Key('tab_all_posters'),
            label: s.allPostersTab,
            icon: Icons.grid_view_rounded,
            isSelected: _selectedTab == 'All Posters',
            onTap: () => _onTabSelected('All Posters'),
          ),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: _buildTabPill(
            key: const Key('tab_drafts'),
            label: s.draftsLabel,
            icon: Icons.description_outlined,
            isSelected: _selectedTab == 'Drafts',
            onTap: () => _onTabSelected('Drafts'),
          ),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: _buildTabPill(
            key: const Key('tab_exported'),
            label: s.exportedStatusLabel,
            icon: Icons.check_circle_outline_rounded,
            isSelected: _selectedTab == 'Exported',
            onTap: () => _onTabSelected('Exported'),
          ),
        ),
      ],
    );
  }

  Widget _buildTabPill({
    required Key key,
    required String label,
    required IconData icon,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    return InkWell(
      key: key,
      onTap: onTap,
      borderRadius: BorderRadius.circular(24),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 8),
        decoration: BoxDecoration(
          color: isSelected ? _kPurplePrimary : Colors.white,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
            color: isSelected ? _kPurplePrimary : _kBorderColor,
            width: 1,
          ),
          boxShadow: isSelected
              ? const [
                  BoxShadow(
                    color: Color(0x336C5CE7),
                    blurRadius: 8,
                    offset: Offset(0, 3),
                  ),
                ]
              : null,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              size: 15,
              color: isSelected ? Colors.white : _kMutedText,
            ),
            const SizedBox(width: 5),
            Flexible(
              child: Text(
                label,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: isSelected ? FontWeight.bold : FontWeight.w600,
                  color: isSelected ? Colors.white : _kNavyText,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // --- 4. Search and Secondary Filters Bar ---
  Widget _buildSearchAndFilters(AppStrings s) {
    return Column(
      children: [
        // Search Field Row with Filter button
        Row(
          children: [
            Expanded(
              child: Container(
                height: 44,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: _kBorderColor),
                ),
                child: TextField(
                  key: const Key('posters_search_field'),
                  controller: _searchController,
                  focusNode: _searchFocusNode,
                  onChanged: (val) => _loadData(),
                  style: const TextStyle(fontSize: 13, color: _kNavyText),
                  decoration: InputDecoration(
                    hintText: s.searchPostersHint,
                    hintStyle: const TextStyle(fontSize: 13, color: _kMutedText),
                    prefixIcon: const Icon(Icons.search_rounded, size: 20, color: _kPurplePrimary),
                    suffixIcon: _searchController.text.isNotEmpty
                        ? IconButton(
                            icon: const Icon(Icons.clear_rounded, size: 18, color: _kMutedText),
                            onPressed: () {
                              _searchController.clear();
                              _loadData();
                            },
                          )
                        : null,
                    border: InputBorder.none,
                    contentPadding: const EdgeInsets.symmetric(vertical: 11),
                  ),
                ),
              ),
            ),
            const SizedBox(width: 8),
            // Filter dropdown button
            PopupMenuButton<String>(
              key: const Key('btn_filter_category_dropdown'),
              color: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              onSelected: _onCategoryChanged,
              itemBuilder: (ctx) => [
                _buildPopupCheckItem('All', 'All', _selectedCategory == 'All'),
                _buildPopupCheckItem('Festivals', 'Festivals', _selectedCategory == 'Festivals'),
                _buildPopupCheckItem('Panchayat', 'Panchayat', _selectedCategory == 'Panchayat'),
                _buildPopupCheckItem('National', 'National', _selectedCategory == 'National'),
                _buildPopupCheckItem('Business', 'Business', _selectedCategory == 'Business'),
              ],
              child: Container(
                height: 44,
                padding: const EdgeInsets.symmetric(horizontal: 10),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: _kBorderColor),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.grid_view_rounded, size: 15, color: _kPurplePrimary),
                    const SizedBox(width: 4),
                    Text(
                      _selectedCategory == 'All' ? s.filterLabel : _selectedCategory,
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: _kNavyText,
                      ),
                    ),
                    const SizedBox(width: 2),
                    const Icon(Icons.keyboard_arrow_down_rounded, size: 16, color: _kMutedText),
                  ],
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),

        // Date and Sort Pills Row
        Row(
          children: [
            // Date Filter Pill
            Expanded(
              child: PopupMenuButton<String>(
                key: const Key('btn_date_filter_dropdown'),
                color: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                onSelected: _onDateFilterChanged,
                itemBuilder: (ctx) => [
                  _buildPopupCheckItem('All Dates', s.allDatesLabel, _selectedDateFilter == 'All Dates'),
                  _buildPopupCheckItem('Last 7 Days', 'Last 7 Days', _selectedDateFilter == 'Last 7 Days'),
                  _buildPopupCheckItem('Last 30 Days', 'Last 30 Days', _selectedDateFilter == 'Last 30 Days'),
                  _buildPopupCheckItem('This Year', 'This Year', _selectedDateFilter == 'This Year'),
                ],
                child: Container(
                  height: 38,
                  padding: const EdgeInsets.symmetric(horizontal: 10),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: _kBorderColor),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.calendar_today_outlined, size: 13, color: _kPurplePrimary),
                      const SizedBox(width: 5),
                      Flexible(
                        child: Text(
                          _selectedDateFilter == 'All Dates' ? s.allDatesLabel : _selectedDateFilter,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 11.5,
                            fontWeight: FontWeight.w600,
                            color: _kNavyText,
                          ),
                        ),
                      ),
                      const SizedBox(width: 2),
                      const Icon(Icons.keyboard_arrow_down_rounded, size: 15, color: _kMutedText),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(width: 8),

            // Sort Pill
            Expanded(
              flex: 1,
              child: PopupMenuButton<String>(
                key: const Key('btn_sort_dropdown'),
                color: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                onSelected: _onSortChanged,
                itemBuilder: (ctx) => [
                  _buildPopupCheckItem('Recently Updated', s.sortByRecentlyUpdated, _selectedSort == 'Recently Updated'),
                  _buildPopupCheckItem('Oldest First', s.sortByOldestFirst, _selectedSort == 'Oldest First'),
                  _buildPopupCheckItem('Name A-Z', s.sortByName, _selectedSort == 'Name A-Z'),
                ],
                child: Container(
                  height: 38,
                  padding: const EdgeInsets.symmetric(horizontal: 10),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: _kBorderColor),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.swap_vert_rounded, size: 16, color: _kPurplePrimary),
                      const SizedBox(width: 4),
                      Flexible(
                        child: Text(
                          'Sort: $_selectedSort',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 11.5,
                            fontWeight: FontWeight.w600,
                            color: _kNavyText,
                          ),
                        ),
                      ),
                      const SizedBox(width: 2),
                      const Icon(Icons.keyboard_arrow_down_rounded, size: 15, color: _kMutedText),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }

  PopupMenuItem<String> _buildPopupCheckItem(String value, String label, bool isSelected) {
    return PopupMenuItem<String>(
      value: value,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: 13,
              fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              color: isSelected ? _kPurplePrimary : _kNavyText,
            ),
          ),
          if (isSelected) const Icon(Icons.check_rounded, size: 16, color: _kPurplePrimary),
        ],
      ),
    );
  }

  // --- 5. Posters Grid (2 Columns) ---
  Widget _buildPostersGrid(AppStrings s) {
    return GridView.builder(
      key: const Key('posters_grid'),
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 12,
        mainAxisSpacing: 12,
        childAspectRatio: 0.73,
      ),
      itemCount: _posters.length,
      itemBuilder: (context, index) {
        final poster = _posters[index];
        return _buildPosterCard(s, poster);
      },
    );
  }

  Widget _buildPosterCard(AppStrings s, PosterTemplateProject poster) {
    return Container(
      decoration: BoxDecoration(
        color: _kCardBg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: _kBorderColor),
        boxShadow: const [
          BoxShadow(
            color: Color(0x06000000),
            blurRadius: 8,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: InkWell(
        onTap: () => _previewPoster(poster),
        borderRadius: BorderRadius.circular(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Thumbnail container with status badge
            Expanded(
              child: Stack(
                fit: StackFit.expand,
                children: [
                  ClipRRect(
                    borderRadius: const BorderRadius.vertical(top: Radius.circular(15)),
                    child: _buildPosterImage(poster),
                  ),
                  // Overlaid status badge
                  Positioned(
                    top: 8,
                    right: 8,
                    child: _buildStatusBadge(poster),
                  ),
                ],
              ),
            ),
            // Card Footer: Title, date/size, 3-dots popup
            Padding(
              padding: const EdgeInsets.fromLTRB(10, 8, 4, 8),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          poster.title,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                            color: _kNavyText,
                          ),
                        ),
                        const SizedBox(height: 3),
                        Row(
                          children: [
                            const Icon(
                              Icons.calendar_today_outlined,
                              size: 10,
                              color: _kMutedText,
                            ),
                            const SizedBox(width: 4),
                            Expanded(
                              child: Text(
                                '${poster.formattedDate} • ${poster.formattedFileSize}',
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(
                                  fontSize: 10.5,
                                  color: _kMutedText,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  // 3-dots action menu
                  PopupMenuButton<String>(
                    key: Key('menu_${poster.id}'),
                    icon: const Icon(Icons.more_vert_rounded, size: 18, color: _kMutedText),
                    color: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    onSelected: (action) {
                      switch (action) {
                        case 'edit':
                          _openInEditor(poster);
                          break;
                        case 'preview':
                          _previewPoster(poster);
                          break;
                        case 'duplicate':
                          _duplicatePoster(poster);
                          break;
                        case 'rename':
                          _renamePoster(poster);
                          break;
                        case 'export':
                          _exportPoster(poster);
                          break;
                        case 'delete':
                          _deletePoster(poster);
                          break;
                      }
                    },
                    itemBuilder: (ctx) => [
                      PopupMenuItem(
                        value: 'edit',
                        child: Row(
                          children: [
                            const Icon(Icons.edit_outlined, size: 16, color: _kNavyText),
                            const SizedBox(width: 10),
                            Text(s.openInEditorAction, style: const TextStyle(fontSize: 13, color: _kNavyText)),
                          ],
                        ),
                      ),
                      PopupMenuItem(
                        value: 'preview',
                        child: Row(
                          children: [
                            const Icon(Icons.visibility_outlined, size: 16, color: _kNavyText),
                            const SizedBox(width: 10),
                            Text(s.previewPosterAction, style: const TextStyle(fontSize: 13, color: _kNavyText)),
                          ],
                        ),
                      ),
                      PopupMenuItem(
                        value: 'duplicate',
                        child: Row(
                          children: [
                            const Icon(Icons.copy_outlined, size: 16, color: _kNavyText),
                            const SizedBox(width: 10),
                            Text(s.duplicatePosterAction, style: const TextStyle(fontSize: 13, color: _kNavyText)),
                          ],
                        ),
                      ),
                      PopupMenuItem(
                        value: 'rename',
                        child: Row(
                          children: [
                            const Icon(Icons.drive_file_rename_outline_rounded, size: 16, color: _kNavyText),
                            const SizedBox(width: 10),
                            Text(s.renamePosterAction, style: const TextStyle(fontSize: 13, color: _kNavyText)),
                          ],
                        ),
                      ),
                      PopupMenuItem(
                        value: 'export',
                        child: Row(
                          children: [
                            const Icon(Icons.file_download_outlined, size: 16, color: _kNavyText),
                            const SizedBox(width: 10),
                            Text(s.exportPosterAction, style: const TextStyle(fontSize: 13, color: _kNavyText)),
                          ],
                        ),
                      ),
                      const PopupMenuDivider(height: 1),
                      PopupMenuItem(
                        value: 'delete',
                        child: Row(
                          children: [
                            const Icon(Icons.delete_outline_rounded, size: 16, color: Colors.red),
                            const SizedBox(width: 10),
                            Text(s.deletePosterAction, style: const TextStyle(fontSize: 13, color: Colors.red)),
                          ],
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

  Widget _buildStatusBadge(PosterTemplateProject poster) {
    Color bgColor;
    IconData icon;
    String text;

    if (poster.isCompleted) {
      bgColor = const Color(0xFF4F46E5); // Indigo
      icon = Icons.check_rounded;
      text = 'Completed';
    } else if (poster.isExported) {
      bgColor = _kPurplePrimary; // Purple
      icon = Icons.download_rounded;
      text = 'Exported';
    } else {
      // Draft
      bgColor = const Color(0xFF581C87); // Deep Purple / Plum
      icon = Icons.description_outlined;
      text = 'Draft';
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
      decoration: BoxDecoration(
        color: bgColor.withValues(alpha: 0.92),
        borderRadius: BorderRadius.circular(6),
        boxShadow: const [
          BoxShadow(
            color: Color(0x22000000),
            blurRadius: 4,
            offset: Offset(0, 1),
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 11, color: Colors.white),
          const SizedBox(width: 3.5),
          Text(
            text,
            style: const TextStyle(
              fontSize: 10,
              fontWeight: FontWeight.bold,
              color: Colors.white,
              letterSpacing: 0.1,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPosterImage(PosterTemplateProject poster) {
    if (poster.previewAsset != null && poster.previewAsset!.isNotEmpty) {
      if (poster.previewAsset!.startsWith('assets/')) {
        return Image.asset(
          poster.previewAsset!,
          fit: BoxFit.cover,
          errorBuilder: (_, error, stackTrace) => _buildFallbackThumbnail(poster),
        );
      } else {
        return Image.file(
          File(poster.previewAsset!),
          fit: BoxFit.cover,
          errorBuilder: (_, error, stackTrace) => _buildFallbackThumbnail(poster),
        );
      }
    }

    if (poster.backgroundAsset.startsWith('assets/')) {
      return Image.asset(
        poster.backgroundAsset,
        fit: BoxFit.cover,
        errorBuilder: (_, error, stackTrace) => _buildFallbackThumbnail(poster),
      );
    }

    return _buildFallbackThumbnail(poster);
  }

  Widget _buildFallbackThumbnail(PosterTemplateProject poster) {
    return Container(
      color: poster.backgroundColor,
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.image_outlined, size: 32, color: Colors.white70),
            const SizedBox(height: 6),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8),
              child: Text(
                poster.title,
                textAlign: TextAlign.center,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // --- 6. Empty State View & Empty State Showcase Card ---
  Widget _buildEmptyStateView(AppStrings s) {
    return Container(
      margin: const EdgeInsets.only(top: 24),
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: _kCardBg,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: _kBorderColor),
      ),
      child: Column(
        children: [
          const Icon(Icons.folder_open_outlined, size: 54, color: _kMutedText),
          const SizedBox(height: 12),
          Text(
            _searchController.text.isNotEmpty
                ? s.noPostersFound
                : _selectedTab == 'Drafts'
                    ? s.noSavedDraftsYet
                    : _selectedTab == 'Exported'
                        ? s.noExportedPostersYet
                        : s.yourPosterLibraryIsEmpty,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: _kNavyText,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            _searchController.text.isNotEmpty
                ? 'Try adjusting your search or filters.'
                : s.startCreatingFirstPoster,
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 13, color: _kMutedText),
          ),
          const SizedBox(height: 16),
          if (_searchController.text.isNotEmpty || _selectedCategory != 'All') ...[
            OutlinedButton(
              onPressed: () {
                _searchController.clear();
                _selectedCategory = 'All';
                _selectedDateFilter = 'All Dates';
                _loadData();
              },
              style: OutlinedButton.styleFrom(
                foregroundColor: _kPurplePrimary,
                side: const BorderSide(color: _kPurplePrimary),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              ),
              child: const Text('Clear Search & Filters'),
            ),
          ] else ...[
            ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: _kPurplePrimary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                elevation: 0,
              ),
              icon: const Icon(Icons.add, size: 18),
              label: Text(s.createPosterButton),
              onPressed: () => Navigator.of(context).pushNamed(AppRoutes.festivals),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildEmptyStateCard(AppStrings s) {
    return Container(
      decoration: BoxDecoration(
        color: _kCardBg,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: _kBorderColor),
        boxShadow: const [
          BoxShadow(
            color: Color(0x06000000),
            blurRadius: 8,
            offset: Offset(0, 2),
          ),
        ],
      ),
      padding: const EdgeInsets.all(14),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Container(
            width: 84,
            height: 84,
            decoration: BoxDecoration(
              color: _kPurpleTint,
              borderRadius: BorderRadius.circular(14),
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(14),
              child: Image.asset(
                AppAssets.myDesignEmptyBox,
                fit: BoxFit.contain,
                errorBuilder: (_, error, stackTrace) => const Icon(
                  Icons.card_giftcard_rounded,
                  size: 40,
                  color: _kPurplePrimary,
                ),
              ),
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  s.yourPosterLibraryIsEmpty,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: _kNavyText,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  s.startCreatingFirstPoster,
                  style: const TextStyle(
                    fontSize: 11.5,
                    color: _kMutedText,
                    height: 1.3,
                  ),
                ),
                const SizedBox(height: 10),
                SizedBox(
                  height: 36,
                  child: ElevatedButton.icon(
                    key: const Key('btn_create_poster_card'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _kPurplePrimary,
                      foregroundColor: Colors.white,
                      elevation: 0,
                      padding: const EdgeInsets.symmetric(horizontal: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                    icon: const Icon(Icons.add, size: 16),
                    label: Text(
                      s.createPosterButton,
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    onPressed: () {
                      Navigator.of(context).pushNamed(AppRoutes.festivals);
                    },
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // --- 7. Bottom Navigation Bar ---
  Widget _buildBottomNav() {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(
          top: BorderSide(color: _kBorderColor, width: 1),
        ),
      ),
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildNavItem(0, Icons.home_outlined, Icons.home_rounded, 'Home', AppRoutes.home),
          _buildNavItem(1, Icons.calendar_today_outlined, Icons.calendar_today_rounded, 'Festivals', AppRoutes.festivals),
          _buildNavItem(2, Icons.layers_outlined, Icons.layers_rounded, 'Templates', AppRoutes.festivals),
          _buildNavItem(3, Icons.photo_library_outlined, Icons.photo_library_rounded, 'My Designs', AppRoutes.myPosters),
          _buildNavItem(4, Icons.person_outline_rounded, Icons.person_rounded, 'Profile', AppRoutes.profile),
        ],
      ),
    );
  }

  Widget _buildNavItem(int index, IconData outlineIcon, IconData filledIcon, String label, String route) {
    final bool isSelected = _selectedNavIndex == index;
    final color = isSelected ? _kPurplePrimary : _kMutedText;

    return Expanded(
      child: InkWell(
        onTap: () {
          setState(() => _selectedNavIndex = index);
          if (ModalRoute.of(context)?.settings.name != route) {
            Navigator.of(context).pushReplacementNamed(route);
          }
        },
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 2, vertical: 2),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(isSelected ? filledIcon : outlineIcon, color: color, size: 22),
              const SizedBox(height: 2),
              Text(
                label,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  fontSize: 10.5,
                  fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                  color: color,
                ),
              ),
              if (isSelected)
                Container(
                  margin: const EdgeInsets.only(top: 2),
                  width: 18,
                  height: 2,
                  decoration: BoxDecoration(
                    color: _kPurplePrimary,
                    borderRadius: BorderRadius.circular(1),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
