import 'dart:math' as math;
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

/// Screen 18: Main Poster Editor
///
/// Production-grade interactive poster editing workspace replicating the
/// approved Screen 18 UI reference image. Features a live gesture-interactive
/// canvas, element dragging, selection bounding boxes with resize & rotation
/// handles, text properties editing (font, size, color, bold, italic, alignment),
/// duplicate & delete, tool categories bar, quick actions, layer ordering,
/// robust undo/redo history, draft saving, and full poster preview.
class MainPosterEditorScreen extends StatefulWidget {
  const MainPosterEditorScreen({
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
  State<MainPosterEditorScreen> createState() => _MainPosterEditorScreenState();
}

class _MainPosterEditorScreenState extends State<MainPosterEditorScreen> {
  // ── Color System (Screen 18 Theme) ──────────────────────────────────────────
  static const Color _kBg = Color(0xFFF8FAFC);
  static const Color _kSurface = Colors.white;
  static const Color _kPrimaryOrange = Color(0xFFFA7126);
  static const Color _kPrimaryNavy = Color(0xFF0F172A);
  static const Color _kTextPrimary = Color(0xFF1E293B);
  static const Color _kTextSecondary = Color(0xFF64748B);
  static const Color _kBorder = Color(0xFFE2E8F0);
  static const Color _kHandleBlue = Color(0xFF3B82F6);
  static const Color _kGreen = Color(0xFF16A34A);

  late final DesignStorageService _storageService;
  late final AuthService _authService;

  late PosterTemplateProject _project;
  UserProfile? _currentUser;

  // History Stacks (Undo / Redo)
  final List<List<PosterElement>> _undoStack = [];
  final List<List<PosterElement>> _redoStack = [];

  // Editor State
  String _selectedTab = 'text'; // 'text', 'images', 'logo', 'background', 'elements', 'templates'
  String? _selectedElementId = 'elem_headline';
  double _zoomLevel = 1.0; // 1.0 (100%), 1.25 (125%), 1.5 (150%)
  bool _isPropertiesExpanded = true;
  bool _isSaving = false;

  // Available fonts matching application typography
  final List<String> _availableFonts = const [
    'Poppins',
    'Anek Gujarati',
    'Noto Sans Gujarati',
    'Mukta',
    'Roboto',
  ];

  // Available font sizes
  final List<int> _availableFontSizes = const [12, 14, 16, 18, 24, 28, 32, 36, 42, 48, 56, 64];

  // Palette colors for the text property color picker
  final List<Color> _paletteColors = const [
    Color(0xFF0F172A), // Navy (default headline)
    Color(0xFFEA580C), // Orange
    Color(0xFFF59E0B), // Golden Amber
    Color(0xFFDC2626), // Crimson Red
    Color(0xFF10B981), // Emerald Green
    Color(0xFF7C3AED), // Purple
    Color(0xFF1E293B), // Slate
    Colors.white,      // White
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
      _project = PosterTemplateProject.createDefaultRepublicDayProject(
        templateId: widget.festivalPosterTemplate!.id,
        imageAsset: widget.festivalPosterTemplate!.imageAsset,
        title: widget.festivalPosterTemplate!.title,
      );
    } else {
      _project = PosterTemplateProject.createDefaultRepublicDayProject();
    }

    // Default selection
    if (_project.elements.isNotEmpty) {
      _selectedElementId = _project.elements.firstWhere(
        (e) => e.id == 'elem_headline',
        orElse: () => _project.elements.first,
      ).id;
    }
  }

  Future<void> _loadUser() async {
    final user = await _authService.getCurrentUser();
    if (mounted && user != null) {
      setState(() => _currentUser = user);
    }
  }

  // ─── HISTORY MANAGEMENT ───────────────────────────────────────────────────
  void _pushHistory() {
    final snapshot = _project.elements.map((e) => e.copyWith()).toList();
    _undoStack.add(snapshot);
    _redoStack.clear();
  }

  void _undo() {
    if (_undoStack.isEmpty) return;
    final currentSnapshot = _project.elements.map((e) => e.copyWith()).toList();
    _redoStack.add(currentSnapshot);

    final previousSnapshot = _undoStack.removeLast();
    setState(() {
      _project = _project.copyWith(elements: previousSnapshot, updatedAt: DateTime.now());
      if (_selectedElementId != null &&
          !_project.elements.any((e) => e.id == _selectedElementId)) {
        _selectedElementId = _project.elements.isNotEmpty ? _project.elements.first.id : null;
      }
    });
  }

  void _redo() {
    if (_redoStack.isEmpty) return;
    final currentSnapshot = _project.elements.map((e) => e.copyWith()).toList();
    _undoStack.add(currentSnapshot);

    final nextSnapshot = _redoStack.removeLast();
    setState(() {
      _project = _project.copyWith(elements: nextSnapshot, updatedAt: DateTime.now());
      if (_selectedElementId != null &&
          !_project.elements.any((e) => e.id == _selectedElementId)) {
        _selectedElementId = _project.elements.isNotEmpty ? _project.elements.first.id : null;
      }
    });
  }

  // ─── ELEMENT SELECTION & MANIPULATION ─────────────────────────────────────
  PosterElement? get _selectedElement {
    if (_selectedElementId == null) return null;
    try {
      return _project.elements.firstWhere((e) => e.id == _selectedElementId);
    } catch (_) {
      return null;
    }
  }

  void _selectElement(String id) {
    setState(() {
      _selectedElementId = id;
    });
  }

  void _updateSelectedElement(PosterElement Function(PosterElement current) update) {
    final elem = _selectedElement;
    if (elem == null) return;
    _pushHistory();
    final updated = update(elem);
    setState(() {
      final list = List<PosterElement>.from(_project.elements);
      final index = list.indexWhere((e) => e.id == elem.id);
      if (index >= 0) {
        list[index] = updated;
        _project = _project.copyWith(elements: list, updatedAt: DateTime.now());
      }
    });
  }

  void _onDragElement(PosterElement elem, DragUpdateDetails details, Size canvasSize) {
    if (canvasSize.width <= 0 || canvasSize.height <= 0) return;
    final dxRelative = details.delta.dx / canvasSize.width;
    final dyRelative = details.delta.dy / canvasSize.height;

    final newX = (elem.x + dxRelative).clamp(0.05, 0.95);
    final newY = (elem.y + dyRelative).clamp(0.05, 0.95);

    setState(() {
      final list = List<PosterElement>.from(_project.elements);
      final index = list.indexWhere((e) => e.id == elem.id);
      if (index >= 0) {
        list[index] = elem.copyWith(x: newX, y: newY);
        _project = _project.copyWith(elements: list, updatedAt: DateTime.now());
      }
    });
  }

  void _duplicateSelectedElement() {
    final elem = _selectedElement;
    if (elem == null) return;
    _pushHistory();

    final newId = 'elem_${DateTime.now().millisecondsSinceEpoch}';
    final duplicated = elem.copyWith(
      id: newId,
      x: (elem.x + 0.05).clamp(0.05, 0.95),
      y: (elem.y + 0.05).clamp(0.05, 0.95),
    );

    setState(() {
      final list = List<PosterElement>.from(_project.elements)..add(duplicated);
      _project = _project.copyWith(elements: list, updatedAt: DateTime.now());
      _selectedElementId = newId;
    });

    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(
        const SnackBar(
          content: Text('Element duplicated successfully!'),
          backgroundColor: _kGreen,
          duration: Duration(seconds: 2),
        ),
      );
  }

  void _deleteSelectedElement() {
    final elem = _selectedElement;
    if (elem == null) return;
    _pushHistory();

    setState(() {
      final list = List<PosterElement>.from(_project.elements)..removeWhere((e) => e.id == elem.id);
      _project = _project.copyWith(elements: list, updatedAt: DateTime.now());
      _selectedElementId = list.isNotEmpty ? list.first.id : null;
    });

    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(
        const SnackBar(
          content: Text('Element deleted from poster.'),
          backgroundColor: _kPrimaryNavy,
          duration: Duration(seconds: 2),
        ),
      );
  }

  void _addNewTextElement() {
    _pushHistory();
    final newId = 'elem_${DateTime.now().millisecondsSinceEpoch}';
    final newElem = PosterElement(
      id: newId,
      type: PosterElementType.text,
      text: 'New Greeting Text',
      x: 0.50,
      y: 0.50,
      fontSize: 22.0,
      color: _kPrimaryNavy,
      fontFamily: 'Poppins',
      textAlign: TextAlign.center,
      isBold: true,
      isSelected: true,
    );

    setState(() {
      final list = List<PosterElement>.from(_project.elements)..add(newElem);
      _project = _project.copyWith(elements: list, updatedAt: DateTime.now());
      _selectedElementId = newId;
    });

    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(
        const SnackBar(
          content: Text('New text element added!'),
          backgroundColor: _kGreen,
          duration: Duration(seconds: 2),
        ),
      );
  }

  // ─── SAVE DRAFT ───────────────────────────────────────────────────────────
  Future<void> _saveDraft() async {
    setState(() => _isSaving = true);
    final userId = _currentUser?.username ?? 'default_user';
    await _storageService.saveDesign(_project, userId: userId);
    if (!mounted) return;
    setState(() {
      _isSaving = false;
    });

    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(
        const SnackBar(
          content: Text('Poster draft saved successfully!'),
          backgroundColor: _kGreen,
          duration: Duration(seconds: 2),
        ),
      );
  }

  // ─── ZOOM & FIT ───────────────────────────────────────────────────────────
  void _cycleZoom() {
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

  void _fitScreen() {
    setState(() => _zoomLevel = 1.0);
  }

  // ─── EDIT TEXT MODAL ──────────────────────────────────────────────────────
  void _openEditTextSheet() {
    final elem = _selectedElement;
    if (elem == null || elem.type != PosterElementType.text) return;

    final controller = TextEditingController(text: elem.text);
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: _kSurface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20.0)),
      ),
      builder: (ctx) {
        return Padding(
          padding: EdgeInsets.only(
            left: 20.0,
            right: 20.0,
            top: 20.0,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 20.0,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Edit Text Content',
                    style: TextStyle(
                      fontSize: 16.0,
                      fontWeight: FontWeight.w800,
                      color: _kTextPrimary,
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.close_rounded, size: 20.0),
                    onPressed: () => Navigator.of(ctx).pop(),
                  ),
                ],
              ),
              const SizedBox(height: 12.0),
              TextField(
                key: const ValueKey('input_modal_edit_text'),
                controller: controller,
                maxLines: 3,
                autofocus: true,
                style: const TextStyle(fontSize: 14.0, fontWeight: FontWeight.w600, color: _kTextPrimary),
                decoration: InputDecoration(
                  hintText: 'Enter text here...',
                  filled: true,
                  fillColor: const Color(0xFFF8FAFC),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12.0),
                    borderSide: const BorderSide(color: _kBorder),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12.0),
                    borderSide: const BorderSide(color: _kPrimaryOrange, width: 1.5),
                  ),
                ),
              ),
              const SizedBox(height: 16.0),
              SizedBox(
                width: double.infinity,
                height: 48.0,
                child: ElevatedButton(
                  key: const ValueKey('btn_save_modal_text'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _kPrimaryOrange,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.0)),
                  ),
                  onPressed: () {
                    final newText = controller.text.trim();
                    if (newText.isNotEmpty) {
                      _updateSelectedElement((curr) => curr.copyWith(
                        text: newText,
                        clearSecondaryText: true,
                      ));
                    }
                    Navigator.of(ctx).pop();
                  },
                  child: const Text('Update Text', style: TextStyle(fontWeight: FontWeight.w700)),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  // ─── COLOR PICKER SHEET ───────────────────────────────────────────────────
  void _openColorPicker() {
    final elem = _selectedElement;
    if (elem == null) return;

    showModalBottomSheet(
      context: context,
      backgroundColor: _kSurface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20.0)),
      ),
      builder: (ctx) {
        return Padding(
          padding: const EdgeInsets.all(20.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Select Text Color',
                style: TextStyle(fontSize: 16.0, fontWeight: FontWeight.w800, color: _kTextPrimary),
              ),
              const SizedBox(height: 16.0),
              Wrap(
                spacing: 16.0,
                runSpacing: 16.0,
                children: _paletteColors.map((color) {
                  final isSelected = elem.color == color;
                  return InkWell(
                    key: ValueKey('palette_color_${color.toARGB32()}'),
                    onTap: () {
                      _updateSelectedElement((curr) => curr.copyWith(color: color));
                      Navigator.of(ctx).pop();
                    },
                    borderRadius: BorderRadius.circular(24.0),
                    child: Container(
                      width: 44.0,
                      height: 44.0,
                      decoration: BoxDecoration(
                        color: color,
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: isSelected ? _kPrimaryOrange : _kBorder,
                          width: isSelected ? 3.0 : 1.2,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.1),
                            blurRadius: 4,
                            offset: const Offset(0, 2),
                          ),
                        ],
                      ),
                      child: isSelected
                          ? Icon(
                              Icons.check_rounded,
                              size: 20.0,
                              color: color.computeLuminance() > 0.5 ? Colors.black : Colors.white,
                            )
                          : null,
                    ),
                  );
                }).toList(),
              ),
              const SizedBox(height: 12.0),
            ],
          ),
        );
      },
    );
  }

  // ─── LAYER POSITION MODAL ─────────────────────────────────────────────────
  void _openLayerPositionModal() {
    final elem = _selectedElement;
    if (elem == null) return;

    showModalBottomSheet(
      context: context,
      backgroundColor: _kSurface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20.0)),
      ),
      builder: (ctx) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 20.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Layer Ordering',
                  style: TextStyle(fontSize: 16.0, fontWeight: FontWeight.w800, color: _kTextPrimary),
                ),
                const SizedBox(height: 16.0),
                ListTile(
                  key: const ValueKey('layer_bring_to_front'),
                  leading: const Icon(Icons.flip_to_front_rounded, color: _kPrimaryOrange),
                  title: const Text('Bring to Front', style: TextStyle(fontWeight: FontWeight.w700)),
                  onTap: () {
                    _pushHistory();
                    setState(() {
                      final list = List<PosterElement>.from(_project.elements)..removeWhere((e) => e.id == elem.id);
                      list.add(elem);
                      _project = _project.copyWith(elements: list, updatedAt: DateTime.now());
                    });
                    Navigator.of(ctx).pop();
                  },
                ),
                ListTile(
                  key: const ValueKey('layer_send_to_back'),
                  leading: const Icon(Icons.flip_to_back_rounded, color: _kPrimaryOrange),
                  title: const Text('Send to Back', style: TextStyle(fontWeight: FontWeight.w700)),
                  onTap: () {
                    _pushHistory();
                    setState(() {
                      final list = List<PosterElement>.from(_project.elements)..removeWhere((e) => e.id == elem.id);
                      list.insert(0, elem);
                      _project = _project.copyWith(elements: list, updatedAt: DateTime.now());
                    });
                    Navigator.of(ctx).pop();
                  },
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  // ─── BACKGROUND SELECTOR MODAL ───────────────────────────────────────────
  void _openBackgroundSelector() {
    showModalBottomSheet(
      context: context,
      backgroundColor: _kSurface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20.0)),
      ),
      builder: (ctx) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(20.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Select Poster Background',
                  style: TextStyle(fontSize: 16.0, fontWeight: FontWeight.w800, color: _kTextPrimary),
                ),
                const SizedBox(height: 16.0),
                Row(
                  children: [
                    Expanded(
                      child: InkWell(
                        key: const ValueKey('bg_republic_day'),
                        onTap: () {
                          _pushHistory();
                          setState(() {
                            _project = _project.copyWith(
                              backgroundAsset: AppAssets.editorCanvasRepublicDay,
                              backgroundColor: const Color(0xFFF8FAFC),
                            );
                          });
                          Navigator.of(ctx).pop();
                        },
                        child: Container(
                          height: 70.0,
                          decoration: BoxDecoration(
                            border: Border.all(color: _kPrimaryOrange, width: 2.0),
                            borderRadius: BorderRadius.circular(12.0),
                            image: const DecorationImage(
                              image: AssetImage(AppAssets.editorCanvasRepublicDay),
                              fit: BoxFit.cover,
                            ),
                          ),
                          alignment: Alignment.bottomCenter,
                          padding: const EdgeInsets.all(4.0),
                          child: Container(
                            color: Colors.black54,
                            padding: const EdgeInsets.symmetric(horizontal: 6.0, vertical: 2.0),
                            child: const Text('Republic Day', style: TextStyle(color: Colors.white, fontSize: 10.0)),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12.0),
                    Expanded(
                      child: InkWell(
                        key: const ValueKey('bg_navratri'),
                        onTap: () {
                          _pushHistory();
                          setState(() {
                            _project = _project.copyWith(
                              backgroundAsset: AppAssets.editorCanvasNavratri,
                              backgroundColor: const Color(0xFF2E0854),
                            );
                          });
                          Navigator.of(ctx).pop();
                        },
                        child: Container(
                          height: 70.0,
                          decoration: BoxDecoration(
                            border: Border.all(color: _kBorder),
                            borderRadius: BorderRadius.circular(12.0),
                            image: const DecorationImage(
                              image: AssetImage(AppAssets.editorCanvasNavratri),
                              fit: BoxFit.cover,
                            ),
                          ),
                          alignment: Alignment.bottomCenter,
                          padding: const EdgeInsets.all(4.0),
                          child: Container(
                            color: Colors.black54,
                            padding: const EdgeInsets.symmetric(horizontal: 6.0, vertical: 2.0),
                            child: const Text('Navratri', style: TextStyle(color: Colors.white, fontSize: 10.0)),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  // ─── ADD IMAGE MODAL ──────────────────────────────────────────────────────
  void _openAddImageModal() {
    _pushHistory();
    final newId = 'elem_img_${DateTime.now().millisecondsSinceEpoch}';
    final newElem = PosterElement(
      id: newId,
      type: PosterElementType.image,
      imageAsset: AppAssets.panchayatLogo,
      x: 0.50,
      y: 0.60,
      width: 60.0,
      height: 60.0,
      isSelected: true,
    );

    setState(() {
      final list = List<PosterElement>.from(_project.elements)..add(newElem);
      _project = _project.copyWith(elements: list, updatedAt: DateTime.now());
      _selectedElementId = newId;
    });

    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(
        const SnackBar(
          content: Text('Image graphic added to poster!'),
          backgroundColor: _kGreen,
          duration: Duration(seconds: 2),
        ),
      );
  }

  // ─── PREVIEW POSTER MODAL ─────────────────────────────────────────────────
  void _openPreviewPoster() {
    showDialog(
      context: context,
      barrierDismissible: true,
      builder: (ctx) {
        return Dialog(
          backgroundColor: Colors.transparent,
          insetPadding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 24.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(20.0),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.25),
                      blurRadius: 20,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(20.0),
                  child: AspectRatio(
                    aspectRatio: 0.76,
                    child: Stack(
                      children: [
                        Positioned.fill(
                          child: Image.asset(
                            _project.backgroundAsset,
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) => Container(color: _project.backgroundColor),
                          ),
                        ),
                        // Clean elements without selection handles
                        ..._project.elements.where((e) => e.isVisible).map((elem) {
                          return _buildElementWidget(elem, isPreview: true);
                        }),
                      ],
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 16.0),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Expanded(
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: _kTextPrimary,
                        elevation: 2.0,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24.0)),
                        padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 12.0),
                      ),
                      icon: const Icon(Icons.close_rounded, size: 16.0),
                      label: const Text('Back to Editor', maxLines: 1, overflow: TextOverflow.ellipsis, style: TextStyle(fontWeight: FontWeight.w700, fontSize: 12.0)),
                      onPressed: () => Navigator.of(ctx).pop(),
                    ),
                  ),
                  const SizedBox(width: 8.0),
                  Expanded(
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: _kPrimaryOrange,
                        foregroundColor: Colors.white,
                        elevation: 2.0,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24.0)),
                        padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 12.0),
                      ),
                      icon: const Icon(Icons.share_rounded, size: 16.0),
                      label: const Text('Share Poster', maxLines: 1, overflow: TextOverflow.ellipsis, style: TextStyle(fontWeight: FontWeight.w700, fontSize: 12.0)),
                      onPressed: () {
                        Navigator.of(ctx).pop();
                        Navigator.of(context).pushNamed(AppRoutes.finalPosterPreview, arguments: _project);
                      },
                    ),
                  ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final s = LocaleScope.of(context).strings;

    return Scaffold(
      backgroundColor: _kBg,
      body: SafeArea(
        child: Column(
          children: [
            // 1. Top Header Bar
            _buildTopHeaderBar(s),

            // 2. Main Scrollable Workspace
            Expanded(
              child: SingleChildScrollView(
                physics: const ClampingScrollPhysics(),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 12.0, vertical: 6.0),
                  child: Column(
                    children: [
                      // Poster Canvas
                      _buildPosterCanvas(s),
                      const SizedBox(height: 10.0),

                      // Tool Categories Bar (6 items)
                      _buildToolCategoriesBar(s),
                      const SizedBox(height: 10.0),

                      // Contextual Properties Panel (Text Properties)
                      _buildPropertiesPanel(s),
                      const SizedBox(height: 10.0),

                      // Quick Actions Section
                      _buildQuickActions(s),
                      const SizedBox(height: 14.0),

                      // Primary Bottom CTA: Preview Poster
                      _buildBottomCta(s),
                      const SizedBox(height: 12.0),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ─── 1. TOP HEADER BAR ─────────────────────────────────────────────────────
  Widget _buildTopHeaderBar(AppStrings s) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14.0, vertical: 8.0),
      color: _kBg,
      child: Row(
        children: [
          // Back button
          InkWell(
            key: const ValueKey('btn_back'),
            onTap: () => Navigator.of(context).maybePop(),
            borderRadius: BorderRadius.circular(10.0),
            child: Container(
              width: 38.0,
              height: 38.0,
              decoration: BoxDecoration(
                color: _kSurface,
                borderRadius: BorderRadius.circular(10.0),
                border: Border.all(color: _kBorder),
              ),
              child: const Icon(
                Icons.arrow_back_ios_new_rounded,
                size: 16.0,
                color: _kTextPrimary,
              ),
            ),
          ),
          const SizedBox(width: 12.0),

          // Title
          Expanded(
            child: Text(
              s.editYourPosterTitle,
              key: const ValueKey('editor_title'),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                fontSize: 17.5,
                fontWeight: FontWeight.w800,
                color: _kTextPrimary,
                letterSpacing: -0.2,
              ),
            ),
          ),

          // Undo Action
          _buildHeaderAction(
            key: 'btn_undo',
            icon: Icons.undo_rounded,
            enabled: _undoStack.isNotEmpty,
            onTap: _undo,
          ),
          const SizedBox(width: 6.0),

          // Redo Action
          _buildHeaderAction(
            key: 'btn_redo',
            icon: Icons.redo_rounded,
            enabled: _redoStack.isNotEmpty,
            onTap: _redo,
          ),
          const SizedBox(width: 6.0),

          // Save Action
          _buildHeaderAction(
            key: 'btn_save_draft',
            icon: Icons.save_outlined,
            enabled: true,
            isLoading: _isSaving,
            onTap: _saveDraft,
          ),
          const SizedBox(width: 6.0),

          // More Options
          _buildHeaderAction(
            key: 'btn_more',
            icon: Icons.more_vert_rounded,
            enabled: true,
            onTap: () {
              ScaffoldMessenger.of(context)
                ..hideCurrentSnackBar()
                ..showSnackBar(
                  const SnackBar(
                    content: Text('Panchayat Post Editor v1.0.0'),
                    duration: Duration(seconds: 1),
                  ),
                );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildHeaderAction({
    required String key,
    required IconData icon,
    required bool enabled,
    required VoidCallback onTap,
    bool isLoading = false,
  }) {
    return InkWell(
      key: ValueKey(key),
      onTap: enabled && !isLoading ? onTap : null,
      borderRadius: BorderRadius.circular(10.0),
      child: Container(
        width: 36.0,
        height: 36.0,
        decoration: BoxDecoration(
          color: _kSurface,
          borderRadius: BorderRadius.circular(10.0),
          border: Border.all(color: _kBorder),
        ),
        child: isLoading
            ? const Padding(
                padding: EdgeInsets.all(9.0),
                child: CircularProgressIndicator(strokeWidth: 2.0, color: _kPrimaryOrange),
              )
            : Icon(
                icon,
                size: 18.0,
                color: enabled ? _kTextPrimary : _kTextSecondary.withValues(alpha: 0.4),
              ),
      ),
    );
  }

  // ─── 2. POSTER CANVAS ──────────────────────────────────────────────────────
  Widget _buildPosterCanvas(AppStrings s) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final canvasWidth = constraints.maxWidth;
        final canvasHeight = canvasWidth / 0.76;

        return Center(
          child: Container(
            width: canvasWidth,
            height: canvasHeight,
            decoration: BoxDecoration(
              color: _project.backgroundColor,
              borderRadius: BorderRadius.circular(18.0),
              border: Border.all(color: _kBorder, width: 1.0),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.08),
                  blurRadius: 16,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(18.0),
              child: Stack(
                fit: StackFit.expand,
                children: [
                  // Background Artwork
                  Image.asset(
                    _project.backgroundAsset,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) => Container(color: _project.backgroundColor),
                  ),

                  // Interactive Elements Layer
                  ..._project.elements.where((e) => e.isVisible).map((elem) {
                    return _buildElementWidget(
                      elem,
                      canvasSize: Size(canvasWidth, canvasHeight),
                    );
                  }),

                  // Floating Bottom-Left Zoom Tool
                  Positioned(
                    left: 12.0,
                    bottom: 12.0,
                    child: _buildZoomPill(),
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildZoomPill() {
    return Container(
      key: const ValueKey('zoom_indicator_pill'),
      padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 5.0),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20.0),
        border: Border.all(color: _kBorder),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.08),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          InkWell(
            key: const ValueKey('btn_zoom_cycle'),
            onTap: _cycleZoom,
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.search_rounded, size: 16.0, color: _kTextPrimary),
                const SizedBox(width: 4.0),
                Text(
                  '${(_zoomLevel * 100).toInt()}%',
                  style: const TextStyle(fontSize: 12.0, fontWeight: FontWeight.w700, color: _kTextPrimary),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8.0),
          Container(width: 1.0, height: 14.0, color: _kBorder),
          const SizedBox(width: 8.0),
          InkWell(
            key: const ValueKey('btn_zoom_fit'),
            onTap: _fitScreen,
            child: const Icon(Icons.fullscreen_rounded, size: 18.0, color: _kTextPrimary),
          ),
        ],
      ),
    );
  }

  // ─── ELEMENT RENDERER WITH SELECTION HANDLES ──────────────────────────────
  Widget _buildElementWidget(
    PosterElement elem, {
    Size? canvasSize,
    bool isPreview = false,
  }) {
    final isSelected = !isPreview && _selectedElementId == elem.id;

    Widget content;
    if (elem.type == PosterElementType.image) {
      content = Image.asset(
        elem.imageAsset ?? AppAssets.panchayatLogo,
        width: elem.width ?? 48.0,
        height: elem.height ?? 48.0,
        fit: BoxFit.contain,
        errorBuilder: (context, error, stackTrace) => const Icon(Icons.image, size: 40.0, color: _kTextSecondary),
      );
    } else {
      // Dual-tone text or standard text
      if (elem.secondaryText != null && elem.text.contains(elem.secondaryText!)) {
        final parts = elem.text.split(elem.secondaryText!);
        content = RichText(
          textAlign: elem.textAlign,
          text: TextSpan(
            style: TextStyle(
              fontFamily: elem.fontFamily,
              fontSize: elem.fontSize * _zoomLevel,
              fontWeight: elem.isBold ? FontWeight.w900 : FontWeight.normal,
              fontStyle: elem.isItalic ? FontStyle.italic : FontStyle.normal,
              color: elem.color,
              height: 1.15,
            ),
            children: [
              TextSpan(text: parts[0]),
              TextSpan(
                text: elem.secondaryText,
                style: TextStyle(
                  color: elem.secondaryColor ?? _kPrimaryOrange,
                ),
              ),
              if (parts.length > 1) TextSpan(text: parts[1]),
            ],
          ),
        );
      } else {
        content = Text(
          elem.text,
          textAlign: elem.textAlign,
          style: TextStyle(
            fontFamily: elem.fontFamily,
            fontSize: elem.fontSize * _zoomLevel,
            fontWeight: elem.isBold ? FontWeight.w800 : FontWeight.normal,
            fontStyle: elem.isItalic ? FontStyle.italic : FontStyle.normal,
            color: elem.color,
            height: 1.15,
          ),
        );
      }
    }

    if (elem.rotation != 0.0) {
      content = Transform.rotate(
        angle: elem.rotation * (math.pi / 180.0),
        child: content,
      );
    }

    // Wrap with Selection Handles if active
    if (isSelected && !isPreview) {
      content = _buildSelectionFrame(content, elem);
    }

    return Positioned(
      left: (canvasSize != null ? elem.x * canvasSize.width : 100) - (isSelected ? 40 : 30),
      top: (canvasSize != null ? elem.y * canvasSize.height : 100) - (isSelected ? 30 : 20),
      child: GestureDetector(
        key: ValueKey('canvas_element_${elem.id}'),
        onTap: () => _selectElement(elem.id),
        onPanUpdate: canvasSize != null
            ? (details) => _onDragElement(elem, details, canvasSize)
            : null,
        child: content,
      ),
    );
  }

  Widget _buildSelectionFrame(Widget child, PosterElement elem) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14.0, vertical: 10.0),
      decoration: BoxDecoration(
        border: Border.all(
          color: _kHandleBlue,
          width: 1.5,
          style: BorderStyle.solid,
        ),
      ),
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          child,
          // Top rotation handle
          Positioned(
            top: -26.0,
            left: 0,
            right: 0,
            child: Center(
              child: Container(
                width: 20.0,
                height: 20.0,
                decoration: const BoxDecoration(
                  color: Colors.white,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(color: Colors.black26, blurRadius: 4),
                  ],
                ),
                child: const Icon(Icons.refresh_rounded, size: 14.0, color: _kHandleBlue),
              ),
            ),
          ),
          // 4 Corner Dots
          Positioned(top: -6.0, left: -6.0, child: _buildHandleDot()),
          Positioned(top: -6.0, right: -6.0, child: _buildHandleDot()),
          Positioned(bottom: -6.0, left: -6.0, child: _buildHandleDot()),
          Positioned(bottom: -6.0, right: -6.0, child: _buildHandleDot()),
          // 4 Edge Dots
          Positioned(top: -5.0, left: 0, right: 0, child: Center(child: _buildHandleDot(size: 8.0))),
          Positioned(bottom: -5.0, left: 0, right: 0, child: Center(child: _buildHandleDot(size: 8.0))),
        ],
      ),
    );
  }

  Widget _buildHandleDot({double size = 10.0}) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: _kHandleBlue,
        shape: BoxShape.circle,
        border: Border.all(color: Colors.white, width: 1.5),
      ),
    );
  }

  // ─── 3. TOOL CATEGORIES BAR (6 Items) ──────────────────────────────────────
  Widget _buildToolCategoriesBar(AppStrings s) {
    final tools = [
      {'id': 'text', 'icon': Icons.title_rounded, 'label': s.toolTextLabel},
      {'id': 'images', 'icon': Icons.image_outlined, 'label': s.toolImagesLabel},
      {'id': 'logo', 'icon': Icons.stars_outlined, 'label': s.toolLogoLabel},
      {'id': 'background', 'icon': Icons.texture_rounded, 'label': s.toolBackgroundLabel},
      {'id': 'elements', 'icon': Icons.star_outline_rounded, 'label': s.toolElementsLabel},
      {'id': 'templates', 'icon': Icons.grid_view_rounded, 'label': s.toolTemplatesLabel},
    ];

    return Container(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      decoration: BoxDecoration(
        color: _kSurface,
        borderRadius: BorderRadius.circular(16.0),
        border: Border.all(color: _kBorder),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: tools.map((tool) {
          final isSelected = _selectedTab == tool['id'];
          final id = tool['id'] as String;
          return Expanded(
            child: InkWell(
              key: ValueKey('tool_tab_$id'),
              onTap: () {
                setState(() => _selectedTab = id);
                if (id == 'background') _openBackgroundSelector();
                if (id == 'images') _openAddImageModal();
              },
              borderRadius: BorderRadius.circular(10.0),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(
                    tool['icon'] as IconData,
                    size: 20.0,
                    color: isSelected ? _kPrimaryOrange : _kTextSecondary,
                  ),
                  const SizedBox(height: 3.0),
                  Text(
                    tool['label'] as String,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontSize: 10.5,
                      fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                      color: isSelected ? _kPrimaryOrange : _kTextSecondary,
                    ),
                  ),
                  if (isSelected)
                    Container(
                      margin: const EdgeInsets.only(top: 3.0),
                      width: 16.0,
                      height: 2.0,
                      decoration: BoxDecoration(
                        color: _kPrimaryOrange,
                        borderRadius: BorderRadius.circular(1.0),
                      ),
                    ),
                ],
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  // ─── 4. CONTEXTUAL PROPERTIES PANEL (Text Properties) ──────────────────────
  Widget _buildPropertiesPanel(AppStrings s) {
    final elem = _selectedElement;

    return Container(
      key: const ValueKey('panel_text_properties'),
      padding: const EdgeInsets.all(12.0),
      decoration: BoxDecoration(
        color: _kSurface,
        borderRadius: BorderRadius.circular(16.0),
        border: Border.all(color: _kBorder),
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
          // Header
          Row(
            children: [
              Container(
                width: 3.5,
                height: 16.0,
                decoration: BoxDecoration(
                  color: _kPrimaryOrange,
                  borderRadius: BorderRadius.circular(2.0),
                ),
              ),
              const SizedBox(width: 8.0),
              Expanded(
                child: Text(
                  s.textPropertiesTitle,
                  style: const TextStyle(
                    fontSize: 14.0,
                    fontWeight: FontWeight.w800,
                    color: _kTextPrimary,
                  ),
                ),
              ),
              InkWell(
                key: const ValueKey('btn_toggle_properties'),
                onTap: () => setState(() => _isPropertiesExpanded = !_isPropertiesExpanded),
                borderRadius: BorderRadius.circular(12.0),
                child: Padding(
                  padding: const EdgeInsets.all(4.0),
                  child: Icon(
                    _isPropertiesExpanded
                        ? Icons.keyboard_arrow_up_rounded
                        : Icons.keyboard_arrow_down_rounded,
                    size: 20.0,
                    color: _kTextSecondary,
                  ),
                ),
              ),
            ],
          ),

          if (_isPropertiesExpanded && elem != null) ...[
            const SizedBox(height: 12.0),

            // Row 1: Edit Text, Font Family, Font Size, Color Swatch, Bold, Italic
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  // Edit Text button
                  OutlinedButton.icon(
                    key: const ValueKey('btn_edit_text'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: _kTextPrimary,
                      side: const BorderSide(color: _kBorder),
                      padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 8.0),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10.0)),
                    ),
                    icon: const Icon(Icons.edit_rounded, size: 14.0, color: _kTextPrimary),
                    label: Text(s.editTextButton, style: const TextStyle(fontSize: 12.0, fontWeight: FontWeight.w700)),
                    onPressed: _openEditTextSheet,
                  ),
                  const SizedBox(width: 8.0),

                  // Font Family Dropdown
                  Container(
                    key: const ValueKey('dropdown_font'),
                    padding: const EdgeInsets.symmetric(horizontal: 10.0),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF8FAFC),
                      borderRadius: BorderRadius.circular(10.0),
                      border: Border.all(color: _kBorder),
                    ),
                    child: DropdownButtonHideUnderline(
                      child: DropdownButton<String>(
                        value: _availableFonts.contains(elem.fontFamily) ? elem.fontFamily : 'Poppins',
                        icon: const Icon(Icons.keyboard_arrow_down_rounded, size: 16.0, color: _kTextSecondary),
                        style: const TextStyle(fontSize: 12.0, fontWeight: FontWeight.w600, color: _kTextPrimary),
                        onChanged: (newFont) {
                          if (newFont != null) {
                            _updateSelectedElement((curr) => curr.copyWith(fontFamily: newFont));
                          }
                        },
                        items: _availableFonts.map((f) => DropdownMenuItem(value: f, child: Text(f))).toList(),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8.0),

                  // Font Size Dropdown
                  Container(
                    key: const ValueKey('dropdown_size'),
                    padding: const EdgeInsets.symmetric(horizontal: 8.0),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF8FAFC),
                      borderRadius: BorderRadius.circular(10.0),
                      border: Border.all(color: _kBorder),
                    ),
                    child: DropdownButtonHideUnderline(
                      child: DropdownButton<int>(
                        value: _availableFontSizes.contains(elem.fontSize.toInt())
                            ? elem.fontSize.toInt()
                            : 48,
                        icon: const Icon(Icons.keyboard_arrow_down_rounded, size: 16.0, color: _kTextSecondary),
                        style: const TextStyle(fontSize: 12.0, fontWeight: FontWeight.w600, color: _kTextPrimary),
                        onChanged: (newSize) {
                          if (newSize != null) {
                            _updateSelectedElement((curr) => curr.copyWith(fontSize: newSize.toDouble()));
                          }
                        },
                        items: _availableFontSizes.map((s) => DropdownMenuItem(value: s, child: Text('$s'))).toList(),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8.0),

                  // Color Picker Swatch
                  InkWell(
                    key: const ValueKey('btn_color_picker'),
                    onTap: _openColorPicker,
                    borderRadius: BorderRadius.circular(16.0),
                    child: Container(
                      width: 32.0,
                      height: 32.0,
                      decoration: BoxDecoration(
                        color: elem.color,
                        shape: BoxShape.circle,
                        border: Border.all(color: _kBorder, width: 1.5),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8.0),

                  // Bold Toggle
                  _buildToggleIcon(
                    key: 'btn_bold',
                    label: 'B',
                    isActive: elem.isBold,
                    onTap: () => _updateSelectedElement((curr) => curr.copyWith(isBold: !curr.isBold)),
                  ),
                  const SizedBox(width: 6.0),

                  // Italic Toggle
                  _buildToggleIcon(
                    key: 'btn_italic',
                    label: 'I',
                    isItalic: true,
                    isActive: elem.isItalic,
                    onTap: () => _updateSelectedElement((curr) => curr.copyWith(isItalic: !curr.isItalic)),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 10.0),

            // Row 2: Alignment, Duplicate, Delete
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  // Alignment Buttons
                  _buildAlignButton(TextAlign.left, Icons.format_align_left_rounded, elem, 'btn_align_left'),
                  const SizedBox(width: 4.0),
                  _buildAlignButton(TextAlign.center, Icons.format_align_center_rounded, elem, 'btn_align_center'),
                  const SizedBox(width: 4.0),
                  _buildAlignButton(TextAlign.right, Icons.format_align_right_rounded, elem, 'btn_align_right'),
                  const SizedBox(width: 4.0),
                  _buildAlignButton(TextAlign.justify, Icons.format_align_justify_rounded, elem, 'btn_align_justify'),

                  const SizedBox(width: 8.0),

                  // Duplicate Button
                  OutlinedButton.icon(
                    key: const ValueKey('btn_duplicate'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: _kTextPrimary,
                      side: const BorderSide(color: _kBorder),
                      padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 8.0),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10.0)),
                    ),
                    icon: const Icon(Icons.copy_rounded, size: 14.0),
                    label: Text(s.duplicateButton, style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.w700)),
                    onPressed: _duplicateSelectedElement,
                  ),
                  const SizedBox(width: 6.0),

                  // Delete Button
                  OutlinedButton.icon(
                    key: const ValueKey('btn_delete'),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: _kPrimaryNavy,
                      side: const BorderSide(color: _kBorder),
                      padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 8.0),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10.0)),
                    ),
                    icon: const Icon(Icons.delete_outline_rounded, size: 14.0, color: _kTextSecondary),
                    label: Text(s.deleteButton, style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.w700)),
                    onPressed: _deleteSelectedElement,
                  ),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildToggleIcon({
    required String key,
    required String label,
    required bool isActive,
    required VoidCallback onTap,
    bool isItalic = false,
  }) {
    return InkWell(
      key: ValueKey(key),
      onTap: onTap,
      borderRadius: BorderRadius.circular(8.0),
      child: Container(
        width: 32.0,
        height: 32.0,
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: isActive ? const Color(0xFFFFF7ED) : const Color(0xFFF8FAFC),
          borderRadius: BorderRadius.circular(8.0),
          border: Border.all(color: isActive ? _kPrimaryOrange : _kBorder),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 14.0,
            fontWeight: FontWeight.w800,
            fontStyle: isItalic ? FontStyle.italic : FontStyle.normal,
            color: isActive ? _kPrimaryOrange : _kTextPrimary,
          ),
        ),
      ),
    );
  }

  Widget _buildAlignButton(TextAlign align, IconData icon, PosterElement elem, String key) {
    final isActive = elem.textAlign == align;
    return InkWell(
      key: ValueKey(key),
      onTap: () => _updateSelectedElement((curr) => curr.copyWith(textAlign: align)),
      borderRadius: BorderRadius.circular(8.0),
      child: Container(
        width: 34.0,
        height: 32.0,
        decoration: BoxDecoration(
          color: isActive ? _kPrimaryOrange : const Color(0xFFF8FAFC),
          borderRadius: BorderRadius.circular(8.0),
          border: Border.all(color: isActive ? _kPrimaryOrange : _kBorder),
        ),
        child: Icon(
          icon,
          size: 16.0,
          color: isActive ? Colors.white : _kTextSecondary,
        ),
      ),
    );
  }

  // ─── 5. QUICK ACTIONS SECTION ──────────────────────────────────────────────
  Widget _buildQuickActions(AppStrings s) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Container(
              width: 3.5,
              height: 16.0,
              decoration: BoxDecoration(
                color: _kPrimaryOrange,
                borderRadius: BorderRadius.circular(2.0),
              ),
            ),
            const SizedBox(width: 8.0),
            Text(
              s.quickActionsTitle,
              style: const TextStyle(
                fontSize: 14.0,
                fontWeight: FontWeight.w800,
                color: _kTextPrimary,
              ),
            ),
          ],
        ),
        const SizedBox(height: 10.0),

        Row(
          children: [
            Expanded(
              child: _buildQuickActionButton(
                key: 'btn_add_text',
                icon: Icons.title_rounded,
                label: s.addTextButton,
                onTap: _addNewTextElement,
              ),
            ),
            const SizedBox(width: 8.0),
            Expanded(
              child: _buildQuickActionButton(
                key: 'btn_add_image',
                icon: Icons.image_outlined,
                label: s.addImageButton,
                onTap: _openAddImageModal,
              ),
            ),
          ],
        ),
        const SizedBox(height: 8.0),
        Row(
          children: [
            Expanded(
              child: _buildQuickActionButton(
                key: 'btn_change_bg',
                icon: Icons.palette_outlined,
                label: s.changeBackgroundButton,
                onTap: _openBackgroundSelector,
              ),
            ),
            const SizedBox(width: 8.0),
            Expanded(
              child: _buildQuickActionButton(
                key: 'btn_layer_position',
                icon: Icons.layers_outlined,
                label: s.layerPositionButton,
                onTap: _openLayerPositionModal,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildQuickActionButton({
    required String key,
    required IconData icon,
    required String label,
    required VoidCallback onTap,
  }) {
    return InkWell(
      key: ValueKey(key),
      onTap: onTap,
      borderRadius: BorderRadius.circular(12.0),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 10.0),
        decoration: BoxDecoration(
          color: _kSurface,
          borderRadius: BorderRadius.circular(12.0),
          border: Border.all(color: _kBorder),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.02),
              blurRadius: 4,
              offset: const Offset(0, 1),
            ),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 16.0, color: _kTextPrimary),
            const SizedBox(width: 6.0),
            Flexible(
              child: Text(
                label,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(fontSize: 12.0, fontWeight: FontWeight.w700, color: _kTextPrimary),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ─── 6. PRIMARY BOTTOM ACTION (Preview Poster) ─────────────────────────────
  Widget _buildBottomCta(AppStrings s) {
    return SizedBox(
      width: double.infinity,
      height: 50.0,
      child: ElevatedButton.icon(
        key: const ValueKey('btn_preview_poster'),
        style: ElevatedButton.styleFrom(
          backgroundColor: _kPrimaryOrange,
          foregroundColor: Colors.white,
          elevation: 2.0,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(25.0)),
        ),
        icon: const Icon(Icons.visibility_outlined, size: 20.0),
        label: Text(
          s.previewPosterButton,
          style: const TextStyle(
            fontSize: 15.0,
            fontWeight: FontWeight.w800,
            letterSpacing: 0.2,
          ),
        ),
        onPressed: _openPreviewPoster,
      ),
    );
  }
}
