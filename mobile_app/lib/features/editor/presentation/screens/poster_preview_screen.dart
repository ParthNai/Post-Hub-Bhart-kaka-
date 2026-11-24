import 'dart:io';
import 'dart:typed_data';
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

/// Screen 13: Final Poster Preview, Download & Share
/// Recreated with pixel-perfect reference fidelity from media_1795419839318_59d13792.jpg.
class PosterPreviewScreen extends StatefulWidget {
  const PosterPreviewScreen({
    super.key,
    this.initialProject,
    this.storageService,
    this.exportService,
    this.authService,
  });

  final PosterTemplateProject? initialProject;
  final DesignStorageService? storageService;
  final PosterExportService? exportService;
  final AuthService? authService;

  @override
  State<PosterPreviewScreen> createState() => _PosterPreviewScreenState();
}

class _PosterPreviewScreenState extends State<PosterPreviewScreen> {
  final GlobalKey _repaintBoundaryKey = GlobalKey();

  late DesignStorageService _storageService;
  late PosterExportService _exportService;
  late AuthService _authService;

  late PosterTemplateProject _project;
  UserProfile? _currentUser;

  // Export configurations matching reference
  String _selectedFormat = 'JPG'; // 'JPG' or 'PNG'
  bool _isHighQuality = true;

  bool _isDownloading = false;
  bool _isSharing = false;
  File? _lastExportedFile;

  @override
  void initState() {
    super.initState();
    _storageService = widget.storageService ?? DesignStorageService();
    _exportService = widget.exportService ?? PosterExportService();
    _authService = widget.authService ?? AuthService();

    _project = widget.initialProject ?? PosterTemplateProject.createDefaultNavratriProject();
    _loadUserAndSave();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final args = ModalRoute.of(context)?.settings.arguments;
    if (widget.initialProject == null && args is PosterTemplateProject) {
      setState(() {
        _project = args;
      });
    }
  }

  Future<void> _loadUserAndSave() async {
    final user = await _authService.getCurrentUser();
    if (mounted) {
      setState(() => _currentUser = user);
    }
    // Automatically ensure the finalized design is saved in My Designs
    await _storageService.saveDesign(
      _project,
      userId: user?.username ?? _project.userId,
    );
  }

  // --- ACTIONS: EXPORT & DOWNLOAD ---
  Future<File?> _captureAndSaveFile({required String format, required bool highQuality}) async {
    final pixelRatio = highQuality ? 3.0 : 1.5;
    final Uint8List? bytes = await _exportService.captureBoundaryToBytes(
      _repaintBoundaryKey,
      pixelRatio: pixelRatio,
    );

    if (bytes == null || bytes.isEmpty) {
      return null;
    }

    final sanitizedTitle = _project.title.replaceAll(RegExp(r'\s+'), '_');
    final filename = '${sanitizedTitle}_${DateTime.now().millisecondsSinceEpoch}';

    final file = await _exportService.savePosterToFile(
      bytes: bytes,
      filename: filename,
      format: format,
    );

    _lastExportedFile = file;
    return file;
  }

  Future<void> _handleDownload() async {
    if (_isDownloading) return;
    setState(() => _isDownloading = true);

    try {
      final file = await _captureAndSaveFile(
        format: _selectedFormat,
        highQuality: _isHighQuality,
      );

      if (!mounted) return;
      setState(() => _isDownloading = false);

      if (file != null) {
        final filename = file.path.split(Platform.pathSeparator).last;
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Row(
              children: [
                const Icon(Icons.check_circle_rounded, color: Colors.white, size: 20.0),
                const SizedBox(width: 8.0),
                Expanded(
                  child: Text('Downloaded: $filename ($_selectedFormat)'),
                ),
              ],
            ),
            backgroundColor: const Color(0xFF16A34A),
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.0)),
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Failed to generate poster file.'),
            backgroundColor: Color(0xFFDC2626),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isDownloading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Download error: $e'),
            backgroundColor: const Color(0xFFDC2626),
          ),
        );
      }
    }
  }

  // --- ACTIONS: SHARING ---
  Future<void> _handleShare({String? platform}) async {
    if (_isSharing) return;
    setState(() => _isSharing = true);

    try {
      File? file = _lastExportedFile;
      file ??= await _captureAndSaveFile(
        format: _selectedFormat,
        highQuality: _isHighQuality,
      );

      if (!mounted) return;
      setState(() => _isSharing = false);

      if (file != null) {
        final caption = 'Check out this ${_project.title} poster created on Panchayat Post!';
        await _exportService.sharePosterFile(
          file: file,
          text: caption,
          platform: platform,
        );
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isSharing = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Share error: $e'),
            backgroundColor: const Color(0xFFDC2626),
          ),
        );
      }
    }
  }

  // --- ACTIONS: DUPLICATE ---
  Future<void> _handleDuplicate(AppStrings s) async {
    final copy = await _storageService.duplicateDesign(
      _project,
      userId: _currentUser?.username,
    );

    if (!mounted) return;

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            const Icon(Icons.copy_rounded, color: Colors.white, size: 18.0),
            const SizedBox(width: 8.0),
            Expanded(child: Text('${s.duplicateCreatedSuccess} (${copy.title})')),
          ],
        ),
        backgroundColor: const Color(0xFF6D28D9),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.0)),
      ),
    );
  }

  // --- FULL SCREEN PREVIEW MODAL ---
  void _openFullScreenPreview() {
    showDialog(
      context: context,
      barrierColor: Colors.black.withValues(alpha: 0.88),
      builder: (ctx) => Dialog(
        backgroundColor: Colors.transparent,
        insetPadding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 24.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Top close & download bar
            Row(
              children: [
                IconButton(
                  icon: const Icon(Icons.close_rounded, color: Colors.white, size: 28.0),
                  onPressed: () => Navigator.of(ctx).pop(),
                ),
                Expanded(
                  child: Text(
                    _project.title,
                    textAlign: TextAlign.center,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 16.0,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.download_rounded, color: Colors.white, size: 26.0),
                  onPressed: () {
                    Navigator.of(ctx).pop();
                    _handleDownload();
                  },
                ),
              ],
            ),
            const SizedBox(height: 12.0),

            // Interactive Zoomable Viewer
            Expanded(
              child: Center(
                child: InteractiveViewer(
                  panEnabled: true,
                  scaleEnabled: true,
                  minScale: 0.8,
                  maxScale: 3.5,
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(16.0),
                    child: AspectRatio(
                      aspectRatio: 1.04,
                      child: _buildCanvasStack(),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // --- MORE OPTIONS SHEET ---
  void _openMoreOptionsSheet(AppStrings s) {
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
              Text(
                _project.title,
                style: const TextStyle(fontSize: 16.0, fontWeight: FontWeight.w800),
              ),
              const SizedBox(height: 12.0),
              ListTile(
                leading: const Icon(Icons.edit_rounded, color: Color(0xFF6D28D9)),
                title: Text(s.editAction),
                onTap: () {
                  Navigator.of(ctx).pop();
                  Navigator.of(context).pushReplacementNamed(
                    AppRoutes.posterEditor,
                    arguments: _project,
                  );
                },
              ),
              ListTile(
                leading: const Icon(Icons.copy_rounded, color: Color(0xFF6D28D9)),
                title: Text(s.duplicateAction),
                onTap: () {
                  Navigator.of(ctx).pop();
                  _handleDuplicate(s);
                },
              ),
              ListTile(
                leading: const Icon(Icons.info_outline_rounded, color: Color(0xFF64748B)),
                title: const Text('Design Details'),
                subtitle: Text('ID: ${_project.id} • Elements: ${_project.elements.length}'),
                onTap: () => Navigator.of(ctx).pop(),
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

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: Column(
          children: [
            // 1. Top Header
            _buildTopHeader(s),

            // Scrollable Content
            Expanded(
              child: SingleChildScrollView(
                physics: const BouncingScrollPhysics(),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 10.0),

                    // 2. Success Status Banner
                    _buildSuccessBanner(s),
                    const SizedBox(height: 12.0),

                    // 3. Poster Preview Card
                    _buildPosterPreviewCard(),
                    const SizedBox(height: 12.0),

                    // 4. Title & Metadata Row
                    _buildTitleMetadataRow(s),
                    const SizedBox(height: 12.0),

                    // 5. Quick Action Toolbar
                    _buildActionToolbar(s),
                    const SizedBox(height: 12.0),

                    // 6. Download Your Poster Section
                    _buildDownloadSection(s),
                    const SizedBox(height: 12.0),

                    // 7. Share Your Creation Section
                    _buildShareSection(s),
                    const SizedBox(height: 12.0),

                    // 8. Saved in My Designs Banner
                    _buildSavedInMyDesignsBadge(s),
                    const SizedBox(height: 24.0),

                    // Bottom village footer decoration
                    Opacity(
                      opacity: 0.5,
                      child: Image.asset(
                        AppAssets.villageSilhouette,
                        width: double.infinity,
                        height: 50.0,
                        fit: BoxFit.cover,
                        errorBuilder: (_, _, _) => const SizedBox(height: 20.0),
                      ),
                    ),
                    const SizedBox(height: 16.0),
                  ],
                ),
              ),
            ),

            // 9. Bottom Dual Action Bar
            _buildBottomActionBar(s),
          ],
        ),
      ),
    );
  }

  // --- WIDGET BUILDERS ---

  // 1. Top Header
  Widget _buildTopHeader(AppStrings s) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 10.0),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(bottom: BorderSide(color: Color(0xFFE2E8F0), width: 0.8)),
      ),
      child: Row(
        children: [
          // Circular Back Button
          InkWell(
            key: const ValueKey('preview_back_button'),
            borderRadius: BorderRadius.circular(20.0),
            onTap: () {
              if (Navigator.of(context).canPop()) {
                Navigator.of(context).pop();
              } else {
                Navigator.of(context).pushReplacementNamed(AppRoutes.home);
              }
            },
            child: Container(
              padding: const EdgeInsets.all(7.0),
              decoration: BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
                border: Border.all(color: const Color(0xFFE2E8F0)),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.04),
                    blurRadius: 4,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: const Icon(
                Icons.chevron_left_rounded,
                size: 22.0,
                color: Color(0xFF1E293B),
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
                  s.yourPosterTitle,
                  key: const ValueKey('preview_title'),
                  style: const TextStyle(
                    fontSize: 16.5,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF1E293B),
                  ),
                ),
                const SizedBox(height: 1.0),
                Text(
                  s.yourDesignIsReady,
                  key: const ValueKey('preview_subtitle'),
                  style: const TextStyle(
                    fontSize: 11.5,
                    fontWeight: FontWeight.w500,
                    color: Color(0xFF64748B),
                  ),
                ),
              ],
            ),
          ),

          // 3-Dots More Menu Button
          InkWell(
            key: const ValueKey('preview_header_more_button'),
            borderRadius: BorderRadius.circular(20.0),
            onTap: () => _openMoreOptionsSheet(s),
            child: Container(
              padding: const EdgeInsets.all(7.0),
              decoration: BoxDecoration(
                color: Colors.white,
                shape: BoxShape.circle,
                border: Border.all(color: const Color(0xFFE2E8F0)),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.04),
                    blurRadius: 4,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: const Icon(
                Icons.more_vert_rounded,
                size: 20.0,
                color: Color(0xFF1E293B),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // 2. Success Status Banner
  Widget _buildSuccessBanner(AppStrings s) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16.0),
      padding: const EdgeInsets.symmetric(horizontal: 14.0, vertical: 12.0),
      decoration: BoxDecoration(
        color: const Color(0xFFF3E8FF),
        borderRadius: BorderRadius.circular(16.0),
        border: Border.all(color: const Color(0xFFE9D5FF)),
      ),
      child: Row(
        children: [
          // Green Circular Check Badge
          Container(
            key: const ValueKey('success_check_badge'),
            width: 28.0,
            height: 28.0,
            decoration: const BoxDecoration(
              color: Color(0xFF22C55E),
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.check_rounded,
              color: Colors.white,
              size: 18.0,
            ),
          ),
          const SizedBox(width: 12.0),

          // Message
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  s.posterCreatedSuccessfully,
                  style: const TextStyle(
                    fontSize: 13.0,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF1E293B),
                  ),
                ),
                const SizedBox(height: 2.0),
                Text(
                  s.readyToDownloadAndShare,
                  style: const TextStyle(
                    fontSize: 11.0,
                    fontWeight: FontWeight.w500,
                    color: Color(0xFF475569),
                  ),
                ),
              ],
            ),
          ),

          // Purple Celebration Accents
          const Icon(
            Icons.auto_awesome_rounded,
            size: 22.0,
            color: Color(0xFF9333EA),
          ),
        ],
      ),
    );
  }

  // 3. Poster Preview Card
  Widget _buildPosterPreviewCard() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16.0),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20.0),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.10),
            blurRadius: 18.0,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20.0),
        child: AspectRatio(
          aspectRatio: 1.04,
          child: GestureDetector(
            key: const ValueKey('poster_canvas_preview_gesture'),
            onTap: _openFullScreenPreview,
            child: RepaintBoundary(
              key: _repaintBoundaryKey,
              child: _buildCanvasStack(),
            ),
          ),
        ),
      ),
    );
  }

  // Inner Stack rendering all elements of the customized poster
  Widget _buildCanvasStack() {
    return LayoutBuilder(
      builder: (context, constraints) {
        final w = constraints.maxWidth;
        final h = constraints.maxHeight;

        return Stack(
          fit: StackFit.expand,
          children: [
            // Background Artwork
            Image.asset(
              _project.backgroundAsset,
              fit: BoxFit.cover,
              errorBuilder: (_, _, _) => Container(
                color: _project.backgroundColor,
                child: const Center(
                  child: Icon(Icons.celebration_rounded, size: 48, color: Colors.white30),
                ),
              ),
            ),

            // Dandiya couple artwork
            Positioned(
              bottom: 0,
              left: 0,
              right: 0,
              child: Image.asset(
                AppAssets.editorDandiyaCouple,
                fit: BoxFit.contain,
                errorBuilder: (_, _, _) => const SizedBox.shrink(),
              ),
            ),

            // Text and layer elements
            for (final element in _project.elements)
              Positioned(
                left: (element.x * w) - (w * 0.45),
                top: element.y * h,
                width: w * 0.9,
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 8.0),
                  child: Text(
                    element.text,
                    textAlign: element.textAlign,
                    style: TextStyle(
                      fontFamily: element.fontFamily,
                      fontSize: element.fontSize * (w / 340.0),
                      fontWeight: element.isBold ? FontWeight.w800 : FontWeight.w600,
                      color: element.color,
                      shadows: [
                        Shadow(
                          color: Colors.black.withValues(alpha: 0.6),
                          blurRadius: 6.0,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
          ],
        );
      },
    );
  }

  // 4. Title & Metadata Row
  Widget _buildTitleMetadataRow(AppStrings s) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Title & Custom Design Badge
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  _project.title,
                  key: const ValueKey('preview_design_title'),
                  style: const TextStyle(
                    fontSize: 16.5,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF1E293B),
                  ),
                ),
                const SizedBox(height: 4.0),
                Container(
                  key: const ValueKey('badge_custom_design'),
                  padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 3.0),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF3E8FF),
                    borderRadius: BorderRadius.circular(12.0),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.star_rounded, size: 12.0, color: Color(0xFF7C3AED)),
                      const SizedBox(width: 4.0),
                      Text(
                        s.customDesignBadge,
                        style: const TextStyle(
                          fontSize: 10.5,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF7C3AED),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Date on the right
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(
                Icons.calendar_today_outlined,
                size: 13.5,
                color: Color(0xFF64748B),
              ),
              const SizedBox(width: 5.0),
              Text(
                _formatDate(_project.updatedAt),
                style: const TextStyle(
                  fontSize: 11.5,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF475569),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime dt) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return '${dt.day} ${months[dt.month - 1]} ${dt.year}';
  }

  // 5. Quick Action Toolbar (Preview, Edit, Duplicate, More)
  Widget _buildActionToolbar(AppStrings s) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16.0),
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16.0),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 8.0,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Row(
        children: [
          _buildActionItem(
            key: 'action_preview',
            icon: Icons.remove_red_eye_outlined,
            label: s.previewAction,
            onTap: _openFullScreenPreview,
          ),
          _buildActionDivider(),
          _buildActionItem(
            key: 'action_edit',
            icon: Icons.edit_outlined,
            label: s.editAction,
            onTap: () {
              Navigator.of(context).pushReplacementNamed(
                AppRoutes.posterEditor,
                arguments: _project,
              );
            },
          ),
          _buildActionDivider(),
          _buildActionItem(
            key: 'action_duplicate',
            icon: Icons.copy_rounded,
            label: s.duplicateAction,
            onTap: () => _handleDuplicate(s),
          ),
          _buildActionDivider(),
          _buildActionItem(
            key: 'action_more',
            icon: Icons.more_horiz_rounded,
            label: s.moreAction,
            onTap: () => _openMoreOptionsSheet(s),
          ),
        ],
      ),
    );
  }

  Widget _buildActionItem({
    required String key,
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return Expanded(
      child: InkWell(
        key: ValueKey(key),
        borderRadius: BorderRadius.circular(12.0),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 6.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(icon, size: 20.0, color: const Color(0xFF1E293B)),
              const SizedBox(height: 4.0),
              Text(
                label,
                textAlign: TextAlign.center,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  fontSize: 11.0,
                  fontWeight: FontWeight.w600,
                  color: Color(0xFF334155),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildActionDivider() {
    return Container(
      height: 24.0,
      width: 1.0,
      color: const Color(0xFFE2E8F0),
    );
  }

  // 6. Download Section
  Widget _buildDownloadSection(AppStrings s) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16.0),
      padding: const EdgeInsets.all(14.0),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16.0),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 8.0,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Section Title
          Row(
            children: [
              const Icon(
                Icons.file_download_outlined,
                size: 20.0,
                color: Color(0xFF6D28D9),
              ),
              const SizedBox(width: 6.0),
              Expanded(
                child: Text(
                  s.downloadYourPosterTitle,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 13.5,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF1E293B),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12.0),

          // Format & Quality Option Controls
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 4.0, vertical: 4.0),
            decoration: BoxDecoration(
              color: const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(14.0),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Row(
              children: [
                // JPG Option
                Expanded(
                  flex: 3,
                  child: InkWell(
                    key: const ValueKey('format_jpg_button'),
                    borderRadius: BorderRadius.circular(10.0),
                    onTap: () => setState(() => _selectedFormat = 'JPG'),
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 6.0),
                      decoration: BoxDecoration(
                        color: _selectedFormat == 'JPG' ? const Color(0xFF6D28D9) : Colors.transparent,
                        borderRadius: BorderRadius.circular(10.0),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.image_outlined,
                            size: 15.0,
                            color: _selectedFormat == 'JPG' ? Colors.white : const Color(0xFF475569),
                          ),
                          const SizedBox(width: 4.0),
                          Text(
                            'JPG',
                            style: TextStyle(
                              fontSize: 12.0,
                              fontWeight: FontWeight.w700,
                              color: _selectedFormat == 'JPG' ? Colors.white : const Color(0xFF475569),
                            ),
                          ),
                          if (_selectedFormat == 'JPG') ...[
                            const SizedBox(width: 4.0),
                            const Icon(Icons.check_rounded, size: 14.0, color: Colors.white),
                          ],
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 4.0),

                // PNG Option
                Expanded(
                  flex: 3,
                  child: InkWell(
                    key: const ValueKey('format_png_button'),
                    borderRadius: BorderRadius.circular(10.0),
                    onTap: () => setState(() => _selectedFormat = 'PNG'),
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 6.0),
                      decoration: BoxDecoration(
                        color: _selectedFormat == 'PNG' ? const Color(0xFF6D28D9) : Colors.transparent,
                        borderRadius: BorderRadius.circular(10.0),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.image_outlined,
                            size: 15.0,
                            color: _selectedFormat == 'PNG' ? Colors.white : const Color(0xFF475569),
                          ),
                          const SizedBox(width: 4.0),
                          Text(
                            'PNG',
                            style: TextStyle(
                              fontSize: 12.0,
                              fontWeight: FontWeight.w700,
                              color: _selectedFormat == 'PNG' ? Colors.white : const Color(0xFF475569),
                            ),
                          ),
                          if (_selectedFormat == 'PNG') ...[
                            const SizedBox(width: 4.0),
                            const Icon(Icons.check_rounded, size: 14.0, color: Colors.white),
                          ],
                        ],
                      ),
                    ),
                  ),
                ),

                // Vertical Divider
                Container(
                  height: 20.0,
                  width: 1.0,
                  color: const Color(0xFFCBD5E1),
                  margin: const EdgeInsets.symmetric(horizontal: 4.0),
                ),

                // High Quality Option
                Expanded(
                  flex: 4,
                  child: InkWell(
                    key: const ValueKey('high_quality_toggle'),
                    borderRadius: BorderRadius.circular(10.0),
                    onTap: () => setState(() => _isHighQuality = !_isHighQuality),
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 6.0),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.diamond_outlined,
                            size: 15.0,
                            color: _isHighQuality ? const Color(0xFF6D28D9) : const Color(0xFF64748B),
                          ),
                          const SizedBox(width: 4.0),
                          Expanded(
                            child: Text(
                              s.highQualityOption,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(
                                fontSize: 11.5,
                                fontWeight: FontWeight.w700,
                                color: _isHighQuality ? const Color(0xFF6D28D9) : const Color(0xFF475569),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 12.0),

          // Primary Download Button
          SizedBox(
            width: double.infinity,
            height: 46.0,
            child: ElevatedButton.icon(
              key: const ValueKey('section_download_poster_button'),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF6D28D9),
                foregroundColor: Colors.white,
                elevation: 3.0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(24.0),
                ),
              ),
              icon: _isDownloading
                  ? const SizedBox(
                      width: 16.0,
                      height: 16.0,
                      child: CircularProgressIndicator(
                        strokeWidth: 2.0,
                        valueColor: AlwaysStoppedAnimation(Colors.white),
                      ),
                    )
                  : const Icon(Icons.file_download_outlined, size: 20.0),
              label: Text(
                s.downloadPosterButton,
                style: const TextStyle(
                  fontSize: 13.5,
                  fontWeight: FontWeight.w800,
                ),
              ),
              onPressed: _isDownloading ? null : _handleDownload,
            ),
          ),
        ],
      ),
    );
  }

  // 7. Share Section
  Widget _buildShareSection(AppStrings s) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16.0),
      padding: const EdgeInsets.all(14.0),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16.0),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 8.0,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Section Title
          Row(
            children: [
              const Icon(
                Icons.share_outlined,
                size: 20.0,
                color: Color(0xFF6D28D9),
              ),
              const SizedBox(width: 6.0),
              Expanded(
                child: Text(
                  s.shareYourCreationTitle,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 13.5,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF1E293B),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14.0),

          // 3 App Sharing Buttons
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildShareAppButton(
                key: 'share_whatsapp_button',
                label: s.whatsAppAction,
                backgroundColor: const Color(0xFF22C55E),
                icon: Icons.chat_rounded,
                onTap: () => _handleShare(platform: 'whatsapp'),
              ),
              _buildShareAppButton(
                key: 'share_instagram_button',
                label: s.instagramAction,
                gradient: const LinearGradient(
                  colors: [Color(0xFF833AB4), Color(0xFFFD1D1D), Color(0xFFFCB045)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                icon: Icons.camera_alt_rounded,
                onTap: () => _handleShare(platform: 'instagram'),
              ),
              _buildShareAppButton(
                key: 'share_more_button',
                label: s.shareMoreAction,
                backgroundColor: const Color(0xFFF3E8FF),
                icon: Icons.share_rounded,
                iconColor: const Color(0xFF7C3AED),
                onTap: () => _handleShare(),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildShareAppButton({
    required String key,
    required String label,
    Color? backgroundColor,
    Gradient? gradient,
    required IconData icon,
    Color iconColor = Colors.white,
    required VoidCallback onTap,
  }) {
    return Expanded(
      child: InkWell(
        key: ValueKey(key),
        borderRadius: BorderRadius.circular(16.0),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 4.0, vertical: 4.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 48.0,
                height: 48.0,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: backgroundColor,
                  gradient: gradient,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.08),
                      blurRadius: 6,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: Icon(icon, color: iconColor, size: 24.0),
              ),
              const SizedBox(height: 6.0),
              Text(
                label,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 11.5,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF1E293B),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // 8. Saved in My Designs Status Banner
  Widget _buildSavedInMyDesignsBadge(AppStrings s) {
    return InkWell(
      key: const ValueKey('saved_in_my_designs_button'),
      borderRadius: BorderRadius.circular(14.0),
      onTap: () {
        Navigator.of(context).pushNamed(AppRoutes.myDesigns);
      },
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 16.0),
        padding: const EdgeInsets.symmetric(vertical: 10.0),
        decoration: BoxDecoration(
          color: const Color(0xFFF0FDF4),
          borderRadius: BorderRadius.circular(14.0),
          border: Border.all(color: const Color(0xFFBBF7D0)),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.folder_open_rounded,
              size: 18.0,
              color: Color(0xFF16A34A),
            ),
            const SizedBox(width: 8.0),
            Text(
              s.savedInMyDesignsBadge,
              key: const ValueKey('saved_in_my_designs_text'),
              style: const TextStyle(
                fontSize: 12.5,
                fontWeight: FontWeight.w700,
                color: Color(0xFF15803D),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // 9. Bottom Dual Action Bar
  Widget _buildBottomActionBar(AppStrings s) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 10.0),
      decoration: BoxDecoration(
        color: Colors.white,
        border: const Border(top: BorderSide(color: Color(0xFFE2E8F0), width: 0.8)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 8.0,
            offset: const Offset(0, -3),
          ),
        ],
      ),
      child: Row(
        children: [
          // Share Poster (Outlined)
          Expanded(
            child: OutlinedButton.icon(
              key: const ValueKey('bottom_share_poster_button'),
              style: OutlinedButton.styleFrom(
                backgroundColor: Colors.white,
                foregroundColor: const Color(0xFF1E293B),
                side: const BorderSide(color: Color(0xFFCBD5E1), width: 1.2),
                padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 11.0),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(24.0),
                ),
              ),
              icon: _isSharing
                  ? const SizedBox(
                      width: 16.0,
                      height: 16.0,
                      child: CircularProgressIndicator(
                        strokeWidth: 2.0,
                        valueColor: AlwaysStoppedAnimation(Color(0xFF1E293B)),
                      ),
                    )
                  : const Icon(Icons.share_outlined, size: 18.0),
              label: Text(
                s.sharePosterButton,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  fontWeight: FontWeight.w700,
                  fontSize: 12.5,
                  color: Color(0xFF1E293B),
                ),
              ),
              onPressed: _isSharing ? null : () => _handleShare(),
            ),
          ),
          const SizedBox(width: 10.0),

          // Download Poster (Filled Purple)
          Expanded(
            child: ElevatedButton.icon(
              key: const ValueKey('bottom_download_poster_button'),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF6D28D9),
                foregroundColor: Colors.white,
                elevation: 3.0,
                padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 11.0),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(24.0),
                ),
              ),
              icon: _isDownloading
                  ? const SizedBox(
                      width: 16.0,
                      height: 16.0,
                      child: CircularProgressIndicator(
                        strokeWidth: 2.0,
                        valueColor: AlwaysStoppedAnimation(Colors.white),
                      ),
                    )
                  : const Icon(Icons.download_rounded, size: 18.0),
              label: Text(
                s.downloadPosterButton,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  fontWeight: FontWeight.w700,
                  fontSize: 12.5,
                ),
              ),
              onPressed: _isDownloading ? null : _handleDownload,
            ),
          ),
        ],
      ),
    );
  }
}
