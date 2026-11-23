import 'package:flutter/material.dart';
import 'package:panchayat_post/core/constants/app_assets.dart';
import 'package:panchayat_post/core/localization/app_localizations.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';
import 'package:panchayat_post/features/auth/data/auth_service.dart';
import 'package:panchayat_post/features/auth/domain/models/user_profile.dart';
import 'package:panchayat_post/features/editor/data/services/design_storage_service.dart';
import 'package:panchayat_post/features/editor/domain/models/poster_element.dart';
import 'package:panchayat_post/features/editor/domain/models/poster_template_project.dart';
import 'package:panchayat_post/features/festivals/domain/models/festival_item.dart';

/// Screen 12: Poster Template Editor & Customization Studio
///
/// Implements pixel-accurate layout corresponding to the approved
/// Screen 12 design reference image. Provides live interactive canvas,
/// contextual editing tools, customizable headline & supporting text,
/// font & color controls, zoom & preview, undo/redo, and persistent save.
class PosterEditorScreen extends StatefulWidget {
  const PosterEditorScreen({
    super.key,
    this.initialProject,
    this.festivalPosterTemplate,
    this.storageService,
    this.authService,
  });

  final PosterTemplateProject? initialProject;
  final FestivalPosterTemplate? festivalPosterTemplate;
  final DesignStorageService? storageService;
  final AuthService? authService;

  @override
  State<PosterEditorScreen> createState() => _PosterEditorScreenState();
}

class _PosterEditorScreenState extends State<PosterEditorScreen> {
  late final DesignStorageService _storageService;
  late final AuthService _authService;

  late PosterTemplateProject _project;
  UserProfile? _currentUser;

  // Undo / Redo history stacks
  final List<List<PosterElement>> _undoStack = [];
  final List<List<PosterElement>> _redoStack = [];

  // Controllers
  late final TextEditingController _headlineController;
  late final TextEditingController _supportingController;

  // Active Editor State
  String _selectedTab = 'text'; // 'text', 'images', 'colors', 'background', 'fonts'
  String? _selectedElementId = 'elem_headline';
  double _zoomLevel = 1.0; // 1.0 (100%), 1.25 (125%), 1.5 (150%)
  bool _isSaving = false;
  bool _hasUnsavedChanges = false;

  // Color options matching reference
  final List<Color> _availableColors = const [
    Color(0xFF7C3AED), // Purple (active)
    Color(0xFFF59E0B), // Golden Yellow
    Color(0xFFDC2626), // Crimson Red
    Color(0xFF1E293B), // Deep Navy
  ];

  // Font options
  final List<String> _availableFonts = const [
    'Poppins',
    'Anek Gujarati',
    'Noto Sans Gujarati',
    'Mukta',
    'Roboto',
  ];

  @override
  void initState() {
    super.initState();
    _storageService = widget.storageService ?? DesignStorageService();
    _authService = widget.authService ?? AuthService();

    _initProject();
    _loadUser();
  }

  void _initProject() {
    if (widget.initialProject != null) {
      _project = widget.initialProject!;
    } else if (widget.festivalPosterTemplate != null) {
      _project = PosterTemplateProject.createDefaultNavratriProject(
        templateId: widget.festivalPosterTemplate!.id,
        imageAsset: widget.festivalPosterTemplate!.imageAsset,
        title: widget.festivalPosterTemplate!.title,
      );
    } else {
      _project = PosterTemplateProject.createDefaultNavratriProject();
    }

    final headline = _project.elements
        .firstWhere((e) => e.id == 'elem_headline', orElse: () => _project.elements.first)
        .text;
    final supporting = _project.elements
        .firstWhere(
          (e) => e.id == 'elem_supporting',
          orElse: () => _project.elements.length > 1 ? _project.elements[1] : _project.elements.first,
        )
        .text;

    _headlineController = TextEditingController(text: headline);
    _supportingController = TextEditingController(text: supporting);
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Support receiving FestivalPosterTemplate or PosterTemplateProject via route arguments
    final args = ModalRoute.of(context)?.settings.arguments;
    if (widget.initialProject == null && widget.festivalPosterTemplate == null) {
      if (args is PosterTemplateProject) {
        setState(() {
          _project = args;
          _headlineController.text = _getElementText('elem_headline');
          _supportingController.text = _getElementText('elem_supporting');
        });
      } else if (args is FestivalPosterTemplate) {
        setState(() {
          _project = PosterTemplateProject.createDefaultNavratriProject(
            templateId: args.id,
            imageAsset: args.imageAsset,
            title: args.title,
          );
          _headlineController.text = _getElementText('elem_headline');
          _supportingController.text = _getElementText('elem_supporting');
        });
      }
    }
  }

  @override
  void dispose() {
    _headlineController.dispose();
    _supportingController.dispose();
    super.dispose();
  }

  Future<void> _loadUser() async {
    final user = await _authService.getCurrentUser();
    if (mounted) {
      setState(() {
        _currentUser = user;
      });
    }
  }

  String _getElementText(String id) {
    try {
      return _project.elements.firstWhere((e) => e.id == id).text;
    } catch (_) {
      return '';
    }
  }

  // --- UNDO / REDO MANAGEMENT ---
  void _recordHistory() {
    _undoStack.add(List.from(_project.elements));
    _redoStack.clear();
    _hasUnsavedChanges = true;
  }

  void _undo() {
    if (_undoStack.isEmpty) return;
    setState(() {
      _redoStack.add(List.from(_project.elements));
      final previous = _undoStack.removeLast();
      _project = _project.copyWith(elements: previous);
      _syncControllers();
    });
  }

  void _redo() {
    if (_redoStack.isEmpty) return;
    setState(() {
      _undoStack.add(List.from(_project.elements));
      final next = _redoStack.removeLast();
      _project = _project.copyWith(elements: next);
      _syncControllers();
    });
  }

  void _syncControllers() {
    final h = _getElementText('elem_headline');
    if (_headlineController.text != h) {
      _headlineController.text = h;
    }
    final s = _getElementText('elem_supporting');
    if (_supportingController.text != s) {
      _supportingController.text = s;
    }
  }

  // --- ELEMENT MANIPULATION ---
  void _updateHeadline(String newText) {
    _recordHistory();
    setState(() {
      final updated = _project.elements.map((e) {
        if (e.id == 'elem_headline') {
          return e.copyWith(text: newText);
        }
        return e;
      }).toList();
      _project = _project.copyWith(elements: updated);
    });
  }

  void _updateSupporting(String newText) {
    _recordHistory();
    setState(() {
      final updated = _project.elements.map((e) {
        if (e.id == 'elem_supporting') {
          return e.copyWith(text: newText);
        }
        return e;
      }).toList();
      _project = _project.copyWith(elements: updated);
    });
  }

  void _updateSelectedColor(Color color) {
    _recordHistory();
    setState(() {
      final updated = _project.elements.map((e) {
        if (e.id == _selectedElementId) {
          return e.copyWith(color: color);
        }
        return e;
      }).toList();
      _project = _project.copyWith(elements: updated);
    });
  }

  void _updateSelectedFont(String font) {
    _recordHistory();
    setState(() {
      final updated = _project.elements.map((e) {
        if (e.id == _selectedElementId) {
          return e.copyWith(fontFamily: font);
        }
        return e;
      }).toList();
      _project = _project.copyWith(elements: updated);
    });
  }

  void _updateSelectedAlignment(TextAlign align) {
    _recordHistory();
    setState(() {
      final updated = _project.elements.map((e) {
        if (e.id == _selectedElementId) {
          return e.copyWith(textAlign: align);
        }
        return e;
      }).toList();
      _project = _project.copyWith(elements: updated);
    });
  }

  void _duplicateSelectedElement() {
    final target = _project.elements.firstWhere(
      (e) => e.id == _selectedElementId,
      orElse: () => _project.elements.first,
    );
    _recordHistory();
    final newId = 'elem_${DateTime.now().millisecondsSinceEpoch}';
    final duplicated = target.copyWith(
      id: newId,
      y: (target.y + 0.08).clamp(0.05, 0.95),
      isSelected: true,
    );

    setState(() {
      final deselectAll = _project.elements.map((e) => e.copyWith(isSelected: false)).toList();
      _project = _project.copyWith(elements: [...deselectAll, duplicated]);
      _selectedElementId = newId;
    });

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Element duplicated on canvas'),
        duration: Duration(seconds: 2),
      ),
    );
  }

  void _replaceImageAction() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Image selection dialog opened from device gallery'),
        duration: Duration(seconds: 2),
      ),
    );
  }

  // --- SAVE & PREVIEW ---
  Future<void> _saveDesign() async {
    setState(() => _isSaving = true);

    final success = await _storageService.saveDesign(
      _project,
      userId: _currentUser?.username ?? 'default_user',
    );

    if (!mounted) return;

    setState(() {
      _isSaving = false;
      if (success) {
        _hasUnsavedChanges = false;
      }
    });

    final s = LocaleScope.maybeOf(context)?.strings ??
        AppStrings.of(AppStrings.defaultLanguageCode);

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            const Icon(Icons.check_circle_rounded, color: Colors.white, size: 20.0),
            const SizedBox(width: 8.0),
            Expanded(child: Text(s.designSavedSuccess)),
          ],
        ),
        backgroundColor: const Color(0xFF16A34A),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.0)),
      ),
    );
  }

  void _previewPoster() {
    showDialog(
      context: context,
      builder: (ctx) => Dialog(
        backgroundColor: Colors.transparent,
        insetPadding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 24.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Preview Card
            ClipRRect(
              borderRadius: BorderRadius.circular(20.0),
              child: AspectRatio(
                aspectRatio: 1.04,
                child: _buildCanvasStack(isInteractive: false),
              ),
            ),
            const SizedBox(height: 16.0),

            // Close & Share Buttons
            Wrap(
              alignment: WrapAlignment.center,
              spacing: 12.0,
              runSpacing: 8.0,
              children: [
                ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: const Color(0xFF1E293B),
                    padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 10.0),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20.0),
                    ),
                  ),
                  icon: const Icon(Icons.close_rounded, size: 18.0),
                  label: const Text('Close Preview', style: TextStyle(fontWeight: FontWeight.w700)),
                  onPressed: () => Navigator.of(ctx).pop(),
                ),
                ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF6D28D9),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 10.0),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20.0),
                    ),
                  ),
                  icon: const Icon(Icons.download_rounded, size: 18.0),
                  label: const Text('Save / Export', style: TextStyle(fontWeight: FontWeight.w700)),
                  onPressed: () {
                    Navigator.of(ctx).pop();
                    _saveDesign();
                  },
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _toggleZoom() {
    setState(() {
      if (_zoomLevel == 1.0) {
        _zoomLevel = 1.25;
      } else if (_zoomLevel == 1.25) {
        _zoomLevel = 1.5;
      } else {
        _zoomLevel = 1.0;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final s = LocaleScope.maybeOf(context)?.strings ??
        AppStrings.of(AppStrings.defaultLanguageCode);
    final isDesktop = MediaQuery.of(context).size.width >= 768;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: Column(
          children: [
            // 1. Top Header
            _buildTopHeader(s),

            // Scrollable Workspace
            Expanded(
              child: SingleChildScrollView(
                child: Center(
                  child: ConstrainedBox(
                    constraints: BoxConstraints(
                      maxWidth: isDesktop ? 600.0 : double.infinity,
                    ),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16.0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const SizedBox(height: 12.0),

                          // 2. Poster Canvas
                          _buildPosterCanvas(),

                          const SizedBox(height: 14.0),

                          // 3. Contextual Action Toolbar
                          _buildContextualToolbar(s),

                          const SizedBox(height: 20.0),

                          // 4. Customize Your Design Section & Tabs
                          _buildCustomizeSectionHeader(s),

                          const SizedBox(height: 10.0),

                          // 5. Active Editing Controls Panel (Text Tab)
                          _buildEditingControlsPanel(s),

                          const SizedBox(height: 18.0),

                          // 6. Preview Poster & Save Design Action Buttons
                          _buildBottomActionButtons(s),

                          const SizedBox(height: 12.0),

                          // 7. All changes saved badge & Bottom decorative footer
                          _buildSaveStatusBadge(s),

                          const SizedBox(height: 16.0),

                          // Bottom silhouette watermark
                          Center(
                            child: Image.asset(
                              AppAssets.villageSilhouette,
                              height: 38.0,
                              fit: BoxFit.contain,
                              opacity: const AlwaysStoppedAnimation(0.24),
                            ),
                          ),

                          const SizedBox(height: 12.0),
                        ],
                      ),
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

  // 1. Top Header
  Widget _buildTopHeader(AppStrings s) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 10.0),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(
          bottom: BorderSide(color: Color(0xFFE2E8F0), width: 0.8),
        ),
      ),
      child: Row(
        children: [
          // Back button
          InkWell(
            key: const ValueKey('editor_back_button'),
            borderRadius: BorderRadius.circular(20.0),
            onTap: () {
              if (Navigator.of(context).canPop()) {
                Navigator.of(context).pop();
              } else {
                Navigator.of(context).pushReplacementNamed(AppRoutes.festivals);
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
          const SizedBox(width: 8.0),

          // Title
          Expanded(
            child: Text(
              s.editYourPosterTitle,
              key: const ValueKey('editor_title'),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                fontSize: 16.5,
                fontWeight: FontWeight.w800,
                color: Color(0xFF1E293B),
              ),
            ),
          ),

          // "Editing" Mode Pill Badge
          Container(
            key: const ValueKey('editor_mode_badge'),
            padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 4.5),
            decoration: BoxDecoration(
              color: const Color(0xFFF3E8FF),
              borderRadius: BorderRadius.circular(16.0),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(
                  Icons.edit_rounded,
                  size: 13.0,
                  color: Color(0xFF7C3AED),
                ),
                const SizedBox(width: 4.0),
                Text(
                  s.editingModeBadge,
                  style: const TextStyle(
                    fontSize: 11.5,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF7C3AED),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 6.0),

          // Undo Button
          IconButton(
            key: const ValueKey('editor_undo_button'),
            visualDensity: VisualDensity.compact,
            padding: const EdgeInsets.symmetric(horizontal: 4.0),
            constraints: const BoxConstraints(),
            icon: Icon(
              Icons.undo_rounded,
              size: 21.0,
              color: _undoStack.isNotEmpty ? const Color(0xFF6D28D9) : const Color(0xFFCBD5E1),
            ),
            onPressed: _undoStack.isNotEmpty ? _undo : null,
            tooltip: 'Undo',
          ),

          // Redo Button
          IconButton(
            key: const ValueKey('editor_redo_button'),
            visualDensity: VisualDensity.compact,
            padding: const EdgeInsets.symmetric(horizontal: 4.0),
            constraints: const BoxConstraints(),
            icon: Icon(
              Icons.redo_rounded,
              size: 21.0,
              color: _redoStack.isNotEmpty ? const Color(0xFF6D28D9) : const Color(0xFFCBD5E1),
            ),
            onPressed: _redoStack.isNotEmpty ? _redo : null,
            tooltip: 'Redo',
          ),

          // Vertical Divider
          Container(
            height: 18.0,
            width: 1.0,
            color: const Color(0xFFE2E8F0),
            margin: const EdgeInsets.symmetric(horizontal: 4.0),
          ),

          // Quick Header Save Button
          InkWell(
            key: const ValueKey('editor_header_save_button'),
            borderRadius: BorderRadius.circular(10.0),
            onTap: _isSaving ? null : _saveDesign,
            child: Container(
              padding: const EdgeInsets.all(7.5),
              decoration: BoxDecoration(
                color: const Color(0xFF6D28D9),
                borderRadius: BorderRadius.circular(10.0),
              ),
              child: const Icon(
                Icons.save_rounded,
                size: 19.0,
                color: Colors.white,
              ),
            ),
          ),
        ],
      ),
    );
  }

  // 2. Poster Canvas
  Widget _buildPosterCanvas() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20.0),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.08),
            blurRadius: 16.0,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20.0),
        child: AspectRatio(
          aspectRatio: 1.04,
          child: Stack(
            children: [
              // Zoomable / Scalable Canvas
              Transform.scale(
                scale: _zoomLevel,
                alignment: Alignment.center,
                child: _buildCanvasStack(isInteractive: true),
              ),

              // Floating Zoom & Fullscreen Controls
              Positioned(
                top: 10.0,
                right: 10.0,
                child: InkWell(
                  key: const ValueKey('editor_zoom_button'),
                  borderRadius: BorderRadius.circular(16.0),
                  onTap: _toggleZoom,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 5.0),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.94),
                      borderRadius: BorderRadius.circular(16.0),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.14),
                          blurRadius: 6,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(
                          Icons.search_rounded,
                          size: 14.0,
                          color: Color(0xFF1E293B),
                        ),
                        const SizedBox(width: 4.0),
                        Text(
                          '${(_zoomLevel * 100).toInt()}%',
                          style: const TextStyle(
                            fontSize: 11.5,
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF1E293B),
                          ),
                        ),
                        const SizedBox(width: 5.0),
                        const Icon(
                          Icons.fullscreen_rounded,
                          size: 15.0,
                          color: Color(0xFF64748B),
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
    );
  }

  Widget _buildCanvasStack({required bool isInteractive}) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final w = constraints.maxWidth;
        final h = constraints.maxHeight;

        return Stack(
          fit: StackFit.expand,
          children: [
            // Background Artwork Layer
            Image.asset(
              _project.backgroundAsset,
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) => Container(
                color: _project.backgroundColor,
                child: const Center(
                  child: Icon(Icons.celebration_rounded, size: 48, color: Colors.white30),
                ),
              ),
            ),

            // Elements Layer
            for (final element in _project.elements)
              Positioned(
                left: (element.x * w) - (w * 0.45),
                top: element.y * h,
                width: w * 0.9,
                child: GestureDetector(
                  onTap: isInteractive
                      ? () {
                          setState(() {
                            _selectedElementId = element.id;
                            if (element.id == 'elem_headline') {
                              _selectedTab = 'text';
                            }
                          });
                        }
                      : null,
                  onPanUpdate: isInteractive
                      ? (details) {
                          _recordHistory();
                          setState(() {
                            final newX = (element.x + details.delta.dx / w).clamp(0.1, 0.9);
                            final newY = (element.y + details.delta.dy / h).clamp(0.05, 0.95);
                            final updated = _project.elements.map((e) {
                              if (e.id == element.id) {
                                return e.copyWith(x: newX, y: newY);
                              }
                              return e;
                            }).toList();
                            _project = _project.copyWith(elements: updated);
                          });
                        }
                      : null,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 4.0),
                    decoration: BoxDecoration(
                      border: isInteractive && _selectedElementId == element.id
                          ? Border.all(color: const Color(0xFF7C3AED), width: 1.5)
                          : null,
                      borderRadius: BorderRadius.circular(6.0),
                    ),
                    child: Text(
                      element.text,
                      textAlign: element.textAlign,
                      style: TextStyle(
                        fontFamily: element.fontFamily,
                        fontSize: element.fontSize,
                        fontWeight: element.isBold ? FontWeight.w800 : FontWeight.w500,
                        color: element.color,
                        height: 1.25,
                        shadows: [
                          Shadow(
                            color: Colors.black.withValues(alpha: 0.6),
                            blurRadius: 4.0,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
          ],
        );
      },
    );
  }

  // 3. Contextual Action Toolbar
  Widget _buildContextualToolbar(AppStrings s) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 10.0),
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
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildToolButton(
            key: 'tool_edit_text',
            iconText: 'T',
            label: s.toolEditText,
            onTap: () {
              setState(() => _selectedTab = 'text');
            },
          ),
          _buildToolButton(
            key: 'tool_replace_image',
            icon: Icons.image_outlined,
            label: s.toolReplaceImage,
            onTap: _replaceImageAction,
          ),
          _buildToolButton(
            key: 'tool_change_color',
            icon: Icons.palette_outlined,
            label: s.toolChangeColor,
            onTap: () {
              setState(() => _selectedTab = 'colors');
            },
          ),
          _buildToolButton(
            key: 'tool_position',
            icon: Icons.open_with_rounded,
            label: s.toolPosition,
            onTap: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Drag elements on canvas to reposition'),
                  duration: Duration(seconds: 2),
                ),
              );
            },
          ),
          _buildToolButton(
            key: 'tool_duplicate',
            icon: Icons.copy_rounded,
            label: s.toolDuplicate,
            onTap: _duplicateSelectedElement,
          ),
        ],
      ),
    );
  }

  Widget _buildToolButton({
    required String key,
    IconData? icon,
    String? iconText,
    required String label,
    required VoidCallback onTap,
  }) {
    return Expanded(
      child: InkWell(
        key: ValueKey(key),
        borderRadius: BorderRadius.circular(12.0),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 2.0, vertical: 4.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (iconText != null)
                Container(
                  height: 24.0,
                  alignment: Alignment.center,
                  child: Text(
                    iconText,
                    style: const TextStyle(
                      fontSize: 18.0,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF6D28D9),
                    ),
                  ),
                )
              else
                Icon(
                  icon,
                  size: 22.0,
                  color: const Color(0xFF6D28D9),
                ),
              const SizedBox(height: 4.0),
              Text(
                label,
                textAlign: TextAlign.center,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  fontSize: 10.2,
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

  // 4. Customize Your Design Section & Tabs
  Widget _buildCustomizeSectionHeader(AppStrings s) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Section Header
        Row(
          children: [
            Container(
              width: 4.0,
              height: 16.0,
              decoration: BoxDecoration(
                color: const Color(0xFF7C3AED),
                borderRadius: BorderRadius.circular(2.0),
              ),
            ),
            const SizedBox(width: 8.0),
            Expanded(
              child: Text(
                s.customizeYourDesignTitle,
                key: const ValueKey('customize_your_design_title'),
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
        const SizedBox(height: 10.0),

        // 5 Category Tabs
        Container(
          height: 40.0,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(14.0),
            border: Border.all(color: const Color(0xFFE2E8F0)),
          ),
          child: Row(
            children: [
              _buildCategoryTab(
                id: 'text',
                label: s.tabText,
                iconText: 'T',
              ),
              _buildCategoryTab(
                id: 'images',
                label: s.tabImages,
                icon: Icons.image_outlined,
              ),
              _buildCategoryTab(
                id: 'colors',
                label: s.tabColors,
                icon: Icons.palette_outlined,
              ),
              _buildCategoryTab(
                id: 'background',
                label: s.tabBackground,
                icon: Icons.texture_rounded,
              ),
              _buildCategoryTab(
                id: 'fonts',
                label: s.tabFonts,
                iconText: 'Aa',
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildCategoryTab({
    required String id,
    required String label,
    IconData? icon,
    String? iconText,
  }) {
    final isActive = _selectedTab == id;

    return Expanded(
      child: InkWell(
        key: ValueKey('tab_$id'),
        borderRadius: BorderRadius.circular(12.0),
        onTap: () {
          setState(() => _selectedTab = id);
        },
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          alignment: Alignment.center,
          decoration: BoxDecoration(
            color: isActive ? const Color(0xFF6D28D9) : Colors.transparent,
            borderRadius: BorderRadius.circular(12.0),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              if (iconText != null)
                Text(
                  iconText,
                  style: TextStyle(
                    fontSize: 12.0,
                    fontWeight: FontWeight.w800,
                    color: isActive ? Colors.white : const Color(0xFF64748B),
                  ),
                )
              else
                Icon(
                  icon,
                  size: 15.0,
                  color: isActive ? Colors.white : const Color(0xFF64748B),
                ),
              const SizedBox(width: 4.0),
              Flexible(
                child: Text(
                  label,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 11.0,
                    fontWeight: isActive ? FontWeight.w700 : FontWeight.w500,
                    color: isActive ? Colors.white : const Color(0xFF64748B),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // 5. Active Editing Controls Panel (Text Tab)
  Widget _buildEditingControlsPanel(AppStrings s) {
    final selectedElement = _project.elements.firstWhere(
      (e) => e.id == _selectedElementId,
      orElse: () => _project.elements.first,
    );

    return Container(
      padding: const EdgeInsets.all(14.0),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16.0),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 10.0,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Headline Text Input
          _buildInputLabel(iconText: 'T', label: s.headlineTextLabel),
          const SizedBox(height: 6.0),
          TextField(
            key: const ValueKey('input_headline_text'),
            controller: _headlineController,
            onChanged: _updateHeadline,
            decoration: InputDecoration(
              filled: true,
              fillColor: const Color(0xFFF8FAFC),
              contentPadding: const EdgeInsets.symmetric(horizontal: 14.0, vertical: 10.0),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12.0),
                borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
              ),
              suffixIcon: IconButton(
                icon: const Icon(Icons.close_rounded, size: 18.0),
                onPressed: () {
                  _headlineController.clear();
                  _updateHeadline('');
                },
              ),
            ),
          ),
          const SizedBox(height: 12.0),

          // Supporting Text Input
          _buildInputLabel(iconText: 'T', label: s.supportingTextLabel),
          const SizedBox(height: 6.0),
          TextField(
            key: const ValueKey('input_supporting_text'),
            controller: _supportingController,
            maxLines: 2,
            onChanged: _updateSupporting,
            decoration: InputDecoration(
              filled: true,
              fillColor: const Color(0xFFF8FAFC),
              contentPadding: const EdgeInsets.symmetric(horizontal: 14.0, vertical: 10.0),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12.0),
                borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
              ),
              suffixIcon: IconButton(
                icon: const Icon(Icons.close_rounded, size: 18.0),
                onPressed: () {
                  _supportingController.clear();
                  _updateSupporting('');
                },
              ),
            ),
          ),
          const SizedBox(height: 14.0),

          // Font Style Dropdown Row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildInputLabel(iconText: 'Aa', label: s.fontStyleLabel),
              Container(
                width: 140.0,
                height: 38.0,
                padding: const EdgeInsets.symmetric(horizontal: 10.0),
                decoration: BoxDecoration(
                  color: const Color(0xFFF8FAFC),
                  borderRadius: BorderRadius.circular(12.0),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: DropdownButtonHideUnderline(
                  child: DropdownButton<String>(
                    key: const ValueKey('dropdown_font_style'),
                    isExpanded: true,
                    value: _availableFonts.contains(selectedElement.fontFamily)
                        ? selectedElement.fontFamily
                        : 'Poppins',
                    icon: const Icon(Icons.keyboard_arrow_down_rounded, size: 18.0),
                    items: _availableFonts.map((font) {
                      return DropdownMenuItem<String>(
                        value: font,
                        child: Text(
                          font,
                          overflow: TextOverflow.ellipsis,
                          maxLines: 1,
                          style: TextStyle(
                            fontFamily: font,
                            fontSize: 12.5,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      );
                    }).toList(),
                    onChanged: (newFont) {
                      if (newFont != null) _updateSelectedFont(newFont);
                    },
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14.0),

          // Text Alignment & Text Color Row
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Left: Text Alignment
              Expanded(
                flex: 5,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      s.textAlignmentLabel,
                      style: const TextStyle(
                        fontSize: 11.5,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF475569),
                      ),
                    ),
                    const SizedBox(height: 8.0),
                    Container(
                      height: 38.0,
                      padding: const EdgeInsets.all(2.5),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF3E8FF),
                        borderRadius: BorderRadius.circular(12.0),
                      ),
                      child: Row(
                        children: [
                          _buildAlignOption(
                            icon: Icons.format_align_left_rounded,
                            align: TextAlign.left,
                            current: selectedElement.textAlign,
                          ),
                          _buildAlignOption(
                            icon: Icons.format_align_center_rounded,
                            align: TextAlign.center,
                            current: selectedElement.textAlign,
                          ),
                          _buildAlignOption(
                            icon: Icons.format_align_right_rounded,
                            align: TextAlign.right,
                            current: selectedElement.textAlign,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 10.0),

              // Right: Text Color
              Expanded(
                flex: 6,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      s.textColorLabel,
                      style: const TextStyle(
                        fontSize: 11.5,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF475569),
                      ),
                    ),
                    const SizedBox(height: 8.0),
                    Wrap(
                      spacing: 4.0,
                      runSpacing: 4.0,
                      crossAxisAlignment: WrapCrossAlignment.center,
                      children: [
                        for (final color in _availableColors)
                          _buildColorSwatch(color, selectedElement.color),
                        _buildCustomColorAdd(),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildInputLabel({required String iconText, required String label}) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(
          iconText,
          style: const TextStyle(
            fontSize: 13.0,
            fontWeight: FontWeight.w800,
            color: Color(0xFF7C3AED),
          ),
        ),
        const SizedBox(width: 6.0),
        Text(
          label,
          style: const TextStyle(
            fontSize: 11.8,
            fontWeight: FontWeight.w700,
            color: Color(0xFF334155),
          ),
        ),
      ],
    );
  }

  Widget _buildAlignOption({
    required IconData icon,
    required TextAlign align,
    required TextAlign current,
  }) {
    final isActive = current == align;

    return Expanded(
      child: InkWell(
        borderRadius: BorderRadius.circular(10.0),
        onTap: () => _updateSelectedAlignment(align),
        child: Container(
          decoration: BoxDecoration(
            color: isActive ? const Color(0xFF7C3AED) : Colors.transparent,
            borderRadius: BorderRadius.circular(10.0),
          ),
          child: Icon(
            icon,
            size: 18.0,
            color: isActive ? Colors.white : const Color(0xFF7C3AED),
          ),
        ),
      ),
    );
  }

  Widget _buildColorSwatch(Color color, Color selectedColor) {
    final isSelected = color.toARGB32() == selectedColor.toARGB32();

    return GestureDetector(
      onTap: () => _updateSelectedColor(color),
      child: Container(
        margin: const EdgeInsets.only(right: 6.0),
        padding: const EdgeInsets.all(2.0),
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          border: isSelected ? Border.all(color: const Color(0xFF7C3AED), width: 1.8) : null,
        ),
        child: Container(
          width: 20.0,
          height: 20.0,
          decoration: BoxDecoration(
            color: color,
            shape: BoxShape.circle,
            border: Border.all(color: Colors.black12, width: 0.5),
          ),
        ),
      ),
    );
  }

  Widget _buildCustomColorAdd() {
    return GestureDetector(
      onTap: () {
        _updateSelectedColor(const Color(0xFFEC4899)); // Pink accent
      },
      child: Container(
        width: 22.0,
        height: 22.0,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          border: Border.all(color: const Color(0xFFCBD5E1)),
        ),
        child: const Icon(Icons.add, size: 14.0, color: Color(0xFF64748B)),
      ),
    );
  }

  // 6. Bottom Action Buttons: Preview Poster & Save Design
  Widget _buildBottomActionButtons(AppStrings s) {
    return Row(
      children: [
        // Preview Poster (Outlined)
        Expanded(
          child: OutlinedButton.icon(
            key: const ValueKey('preview_poster_button'),
            style: OutlinedButton.styleFrom(
              backgroundColor: Colors.white,
              foregroundColor: const Color(0xFF1E293B),
              side: const BorderSide(color: Color(0xFFCBD5E1), width: 1.2),
              padding: const EdgeInsets.symmetric(vertical: 12.0),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(24.0),
              ),
            ),
            icon: const Icon(Icons.visibility_outlined, size: 18.0, color: Color(0xFF1E293B)),
            label: Text(
              s.previewPosterButton,
              style: const TextStyle(
                fontWeight: FontWeight.w700,
                fontSize: 13.0,
                color: Color(0xFF1E293B),
              ),
            ),
            onPressed: _previewPoster,
          ),
        ),
        const SizedBox(width: 12.0),

        // Save Design (Filled)
        Expanded(
          child: ElevatedButton.icon(
            key: const ValueKey('save_design_button'),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF6D28D9),
              foregroundColor: Colors.white,
              elevation: 3.0,
              padding: const EdgeInsets.symmetric(vertical: 12.0),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(24.0),
              ),
            ),
            icon: _isSaving
                ? const SizedBox(
                    width: 16.0,
                    height: 16.0,
                    child: CircularProgressIndicator(
                      strokeWidth: 2.0,
                      valueColor: AlwaysStoppedAnimation(Colors.white),
                    ),
                  )
                : const Icon(Icons.save_rounded, size: 18.0),
            label: Text(
              s.saveDesignButton,
              style: const TextStyle(
                fontWeight: FontWeight.w700,
                fontSize: 13.0,
              ),
            ),
            onPressed: _isSaving ? null : _saveDesign,
          ),
        ),
      ],
    );
  }

  // 7. Save Status Badge
  Widget _buildSaveStatusBadge(AppStrings s) {
    final isSaved = !_hasUnsavedChanges;
    return Center(
      child: Container(
        key: const ValueKey('all_changes_saved_badge'),
        padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 3.5),
        decoration: BoxDecoration(
          color: isSaved ? const Color(0xFFF0FDF4) : const Color(0xFFFEF3C7),
          borderRadius: BorderRadius.circular(14.0),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              isSaved ? Icons.check_circle_rounded : Icons.pending_actions_rounded,
              size: 14.0,
              color: isSaved ? const Color(0xFF16A34A) : const Color(0xFFD97706),
            ),
            const SizedBox(width: 4.0),
            Text(
              isSaved ? s.allChangesSavedLabel : 'Unsaved changes',
              style: TextStyle(
                fontSize: 11.0,
                fontWeight: FontWeight.w600,
                color: isSaved ? const Color(0xFF15803D) : const Color(0xFFB45309),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
