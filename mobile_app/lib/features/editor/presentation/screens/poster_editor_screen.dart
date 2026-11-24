import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:image_picker/image_picker.dart';
import 'package:panchayat_post/core/constants/app_assets.dart';
import 'package:panchayat_post/core/localization/app_localizations.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';
import 'package:panchayat_post/core/services/app_config_service.dart';
import 'package:panchayat_post/features/auth/data/auth_service.dart';
import 'package:panchayat_post/features/auth/domain/models/user_profile.dart';
import 'package:panchayat_post/features/editor/data/services/design_storage_service.dart';
import 'package:panchayat_post/features/editor/domain/models/poster_element.dart';
import 'package:panchayat_post/features/editor/domain/models/poster_template_project.dart';
import 'package:panchayat_post/features/editor/presentation/widgets/poster_frame_overlay.dart';
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
    this.imagePicker,
  });

  final PosterTemplateProject? initialProject;
  final FestivalPosterTemplate? festivalPosterTemplate;
  final DesignStorageService? storageService;
  final AuthService? authService;
  final ImagePicker? imagePicker;

  @override
  State<PosterEditorScreen> createState() => _PosterEditorScreenState();
}

class _PosterEditorScreenState extends State<PosterEditorScreen> {
  late final DesignStorageService _storageService;
  late final AuthService _authService;
  late final ImagePicker _imagePicker;

  late PosterTemplateProject _project;
  UserProfile? _currentUser;
  String _selectedFrameId = 'gold_vip';
  List<PosterFrameDef> _adminFrames = [];

  // Undo / Redo history stacks
  final List<List<PosterElement>> _undoStack = [];
  final List<List<PosterElement>> _redoStack = [];

  // Controllers
  late final TextEditingController _headlineController;
  late final TextEditingController _supportingController;

  // Active Editor State
  String _selectedTab = 'text'; // 'frames', 'text', 'images', 'colors', 'background', 'fonts'
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

  // Extended palette for Colors tab
  final List<Color> _extendedColors = const [
    Color(0xFF7C3AED), // Royal Purple
    Color(0xFFF59E0B), // Kesariya / Amber
    Color(0xFFDC2626), // Crimson Red
    Color(0xFF1E293B), // Deep Navy
    Color(0xFF16A34A), // Emerald Green
    Color(0xFF2563EB), // Vibrant Blue
    Color(0xFFDB2777), // Festive Pink
    Color(0xFFFDE68A), // Light Gold
    Color(0xFFFFFFFF), // Crisp White
    Color(0xFF9333EA), // Violet
    Color(0xFFEA580C), // Saffron Orange
    Color(0xFF0F172A), // Midnight Slate
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
    _imagePicker = widget.imagePicker ?? ImagePicker();

    _initProject();
    _loadUser();
    _fetchAdminFrames();
  }

  void _initProject() {
    if (widget.initialProject != null) {
      _project = widget.initialProject!;
    } else if (widget.festivalPosterTemplate != null) {
      _project = PosterTemplateProject.createProjectFromTemplate(
        templateId: widget.festivalPosterTemplate!.id,
        imageAsset: widget.festivalPosterTemplate!.imageAsset,
        title: widget.festivalPosterTemplate!.title,
      );
    } else {
      _project = PosterTemplateProject.createDefaultNavratriProject();
    }

    _selectedFrameId = _project.frameId ?? 'gold_vip';

    final hElem = _project.elements.where((e) => e.id == 'elem_headline').firstOrNull;
    final sElem = _project.elements.where((e) => e.id == 'elem_supporting').firstOrNull;

    _headlineController = TextEditingController(text: hElem?.text ?? '');
    _supportingController = TextEditingController(text: sElem?.text ?? '');
  }

  Future<void> _fetchAdminFrames() async {
    try {
      final baseUrl = AppConfigService.instance.serverBaseUrl;
      final uri = Uri.parse('$baseUrl/adminapi/frame');
      final resp = await http.get(uri).timeout(const Duration(seconds: 4));
      if (resp.statusCode == 200) {
        final decoded = jsonDecode(resp.body);
        final list = decoded['data'] as List<dynamic>?;
        if (list != null && list.isNotEmpty) {
          final List<PosterFrameDef> fetched = [];
          for (final item in list) {
            final id = item['_id']?.toString() ?? 'admin_${DateTime.now().millisecondsSinceEpoch}';
            final name = item['frameName']?.toString() ?? 'Admin Frame';
            String rawPath = item['path']?.toString() ?? '';
            String imageUrl = rawPath;
            if (rawPath.isNotEmpty && !rawPath.startsWith('http://') && !rawPath.startsWith('https://')) {
              final cleanPath = rawPath.startsWith('/') ? rawPath.substring(1) : rawPath;
              imageUrl = '$baseUrl/$cleanPath';
            }
            fetched.add(
              PosterFrameDef(
                id: 'admin_$id',
                name: name,
                previewColor: const Color(0xFF6D28D9),
                badgeText: 'Admin',
                imageUrl: imageUrl,
              ),
            );
          }
          if (mounted) {
            setState(() {
              _adminFrames = fetched;
            });
          }
        }
      }
    } catch (_) {
      // Keep offline defaults
    }
  }

  String? _getAdminFrameUrl(String frameId) {
    for (final f in _adminFrames) {
      if (f.id == frameId) {
        return f.imageUrl;
      }
    }
    if (_project.frameImageUrl != null && _project.frameImageUrl!.isNotEmpty) {
      return _project.frameImageUrl;
    }
    return null;
  }

  PosterElement get _effectiveSelectedElement {
    if (_selectedElementId != null) {
      final match = _project.elements.where((e) => e.id == _selectedElementId).firstOrNull;
      if (match != null) return match;
    }
    if (_project.elements.isNotEmpty) {
      return _project.elements.first;
    }
    return const PosterElement(
      id: 'elem_headline',
      type: PosterElementType.text,
      text: '',
      x: 0.5,
      y: 0.20,
      fontSize: 28.0,
      color: Color(0xFFFDE68A),
      fontFamily: 'Poppins',
      textAlign: TextAlign.center,
      isBold: true,
    );
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Support receiving FestivalPosterTemplate, PosterTemplateProject or Map via route arguments
    final args = ModalRoute.of(context)?.settings.arguments;
    if (widget.initialProject == null && widget.festivalPosterTemplate == null) {
      if (args is PosterTemplateProject) {
        setState(() {
          _project = args;
          _selectedFrameId = args.frameId ?? 'gold_vip';
          _headlineController.text = _getElementText('elem_headline');
          _supportingController.text = _getElementText('elem_supporting');
        });
      } else if (args is FestivalPosterTemplate) {
        setState(() {
          _project = PosterTemplateProject.createProjectFromTemplate(
            templateId: args.id,
            imageAsset: args.imageAsset,
            title: args.title,
          );
          _selectedFrameId = _project.frameId ?? 'gold_vip';
          _headlineController.text = _getElementText('elem_headline');
          _supportingController.text = _getElementText('elem_supporting');
        });
      } else if (args is Map<String, dynamic>) {
        setState(() {
          _project = PosterTemplateProject.fromMap(args);
          _selectedFrameId = _project.frameId ?? 'gold_vip';
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

  // --- UNDO / REDO HISTORY ---
  void _recordHistory() {
    _undoStack.add(_project.elements.map((e) => e.copyWith()).toList());
    _redoStack.clear();
    _hasUnsavedChanges = true;
  }

  void _undo() {
    if (_undoStack.isEmpty) return;
    _redoStack.add(_project.elements.map((e) => e.copyWith()).toList());
    final prevElements = _undoStack.removeLast();

    setState(() {
      _project = _project.copyWith(elements: prevElements);
      _headlineController.text = _getElementText('elem_headline');
      _supportingController.text = _getElementText('elem_supporting');
      _hasUnsavedChanges = true;
    });
  }

  void _redo() {
    if (_redoStack.isEmpty) return;
    _undoStack.add(_project.elements.map((e) => e.copyWith()).toList());
    final nextElements = _redoStack.removeLast();

    setState(() {
      _project = _project.copyWith(elements: nextElements);
      _headlineController.text = _getElementText('elem_headline');
      _supportingController.text = _getElementText('elem_supporting');
      _hasUnsavedChanges = true;
    });
  }

  // --- ELEMENT MANIPULATION ---
  void _updateHeadline(String newText) {
    _recordHistory();
    setState(() {
      final exists = _project.elements.any((e) => e.id == 'elem_headline');
      if (exists) {
        if (newText.isEmpty) {
          _project = _project.copyWith(
            elements: _project.elements.where((e) => e.id != 'elem_headline').toList(),
          );
        } else {
          final updated = _project.elements.map((e) {
            if (e.id == 'elem_headline') {
              return e.copyWith(text: newText);
            }
            return e;
          }).toList();
          _project = _project.copyWith(elements: updated);
        }
      } else if (newText.isNotEmpty) {
        final newElem = PosterElement(
          id: 'elem_headline',
          type: PosterElementType.text,
          text: newText,
          x: 0.5,
          y: 0.20,
          fontSize: 28.0,
          color: const Color(0xFFFDE68A),
          fontFamily: 'Poppins',
          textAlign: TextAlign.center,
          isBold: true,
          isSelected: true,
        );
        _project = _project.copyWith(elements: [..._project.elements, newElem]);
        _selectedElementId = 'elem_headline';
      }
    });
  }

  void _updateSupporting(String newText) {
    _recordHistory();
    setState(() {
      final exists = _project.elements.any((e) => e.id == 'elem_supporting');
      if (exists) {
        if (newText.isEmpty) {
          _project = _project.copyWith(
            elements: _project.elements.where((e) => e.id != 'elem_supporting').toList(),
          );
        } else {
          final updated = _project.elements.map((e) {
            if (e.id == 'elem_supporting') {
              return e.copyWith(text: newText);
            }
            return e;
          }).toList();
          _project = _project.copyWith(elements: updated);
        }
      } else if (newText.isNotEmpty) {
        final newElem = PosterElement(
          id: 'elem_supporting',
          type: PosterElementType.text,
          text: newText,
          x: 0.5,
          y: 0.32,
          fontSize: 13.0,
          color: Colors.white,
          fontFamily: 'Poppins',
          textAlign: TextAlign.center,
          isBold: false,
        );
        _project = _project.copyWith(elements: [..._project.elements, newElem]);
      }
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

  void _updateSelectedFontSize(double size) {
    _recordHistory();
    setState(() {
      final updated = _project.elements.map((e) {
        if (e.id == _selectedElementId) {
          return e.copyWith(fontSize: size);
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
    if (_project.elements.isEmpty) return;
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

  void _deleteSelectedElement() {
    if (_selectedElementId == null) return;
    if (_selectedElementId == 'elem_headline') {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Cannot delete main poster headline.')),
      );
      return;
    }
    _recordHistory();
    setState(() {
      final updated = _project.elements.where((e) => e.id != _selectedElementId).toList();
      _project = _project.copyWith(elements: updated);
      _selectedElementId = _project.elements.isNotEmpty ? _project.elements.first.id : null;
    });
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Element removed from canvas')),
    );
  }

  // --- IMAGE PICKING & REPLACEMENT ---
  Future<void> _pickImageFromGallery() async {
    try {
      final XFile? file = await _imagePicker.pickImage(
        source: ImageSource.gallery,
        maxWidth: 1024,
        maxHeight: 1024,
        imageQuality: 85,
      );
      if (file == null) return;

      final bytes = await file.readAsBytes();
      final base64String = base64Encode(bytes);
      _applyImageToCanvas(imageData: base64String);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error picking image: $e')),
        );
      }
    }
  }

  Future<void> _pickImageFromCamera() async {
    try {
      final XFile? file = await _imagePicker.pickImage(
        source: ImageSource.camera,
        maxWidth: 1024,
        maxHeight: 1024,
        imageQuality: 85,
      );
      if (file == null) return;

      final bytes = await file.readAsBytes();
      final base64String = base64Encode(bytes);
      _applyImageToCanvas(imageData: base64String);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error taking photo: $e')),
        );
      }
    }
  }

  void _applyImageToCanvas({String? imageAsset, String? imageData}) {
    _recordHistory();
    final selected = _project.elements.where((e) => e.id == _selectedElementId).firstOrNull;

    if (selected != null && selected.type == PosterElementType.image) {
      // Replace existing selected image
      setState(() {
        final updated = _project.elements.map((e) {
          if (e.id == selected.id) {
            return e.copyWith(
              imageAsset: imageAsset,
              imageData: imageData,
            );
          }
          return e;
        }).toList();
        _project = _project.copyWith(elements: updated);
      });
    } else {
      // Add as new image element
      final newId = 'img_${DateTime.now().millisecondsSinceEpoch}';
      final newElement = PosterElement(
        id: newId,
        type: PosterElementType.image,
        imageAsset: imageAsset,
        imageData: imageData,
        x: 0.5,
        y: 0.55,
        width: 0.7,
        height: 0.45,
        isSelected: true,
      );
      setState(() {
        final deselect = _project.elements.map((e) => e.copyWith(isSelected: false)).toList();
        _project = _project.copyWith(elements: [...deselect, newElement]);
        _selectedElementId = newId;
        _selectedTab = 'images';
      });
    }

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Image updated on canvas successfully'),
        duration: Duration(seconds: 2),
      ),
    );
  }

  void _replaceImageAction() {
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
                'Choose Poster Image Source',
                style: TextStyle(
                  fontSize: 16.0,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFF1E293B),
                ),
              ),
              const SizedBox(height: 14.0),

              // Gallery Option
              ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(8.0),
                  decoration: BoxDecoration(
                    color: const Color(0xFFEDE9FE),
                    borderRadius: BorderRadius.circular(10.0),
                  ),
                  child: const Icon(Icons.photo_library_rounded, color: Color(0xFF7C3AED)),
                ),
                title: const Text('Choose from Device Gallery', style: TextStyle(fontWeight: FontWeight.w700)),
                subtitle: const Text('Upload custom festival photography or logo'),
                onTap: () {
                  Navigator.of(ctx).pop();
                  _pickImageFromGallery();
                },
              ),

              // Camera Option
              ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(8.0),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFEF3C7),
                    borderRadius: BorderRadius.circular(10.0),
                  ),
                  child: const Icon(Icons.camera_alt_rounded, color: Color(0xFFD97706)),
                ),
                title: const Text('Take Photo with Camera', style: TextStyle(fontWeight: FontWeight.w700)),
                subtitle: const Text('Capture photo directly from your device'),
                onTap: () {
                  Navigator.of(ctx).pop();
                  _pickImageFromCamera();
                },
              ),

              // Festival Preset Artwork
              ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(8.0),
                  decoration: BoxDecoration(
                    color: const Color(0xFFDCFCE7),
                    borderRadius: BorderRadius.circular(10.0),
                  ),
                  child: const Icon(Icons.celebration_rounded, color: Color(0xFF16A34A)),
                ),
                title: const Text('Festival Artwork & Dandiya Stickers', style: TextStyle(fontWeight: FontWeight.w700)),
                subtitle: const Text('Select verified Panchayat Post cultural designs'),
                onTap: () {
                  Navigator.of(ctx).pop();
                  setState(() => _selectedTab = 'images');
                },
              ),
            ],
          ),
        ),
      ),
    );

    // Keep notification for test expectations
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

    final projectToSave = _project.copyWith(
      frameId: _selectedFrameId,
      frameImageUrl: _getAdminFrameUrl(_selectedFrameId),
    );

    final success = await _storageService.saveDesign(
      projectToSave,
      userId: _currentUser?.username ?? 'default_user',
    );

    if (!mounted) return;

    setState(() {
      _isSaving = false;
      if (success) {
        _hasUnsavedChanges = false;
        _project = projectToSave;
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

    if (success) {
      Navigator.of(context).pushNamed(
        AppRoutes.posterPreview,
        arguments: projectToSave,
      );
    }
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
                  icon: const Icon(Icons.share_rounded, size: 18.0),
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

  // --- BUILD UI ---
  @override
  Widget build(BuildContext context) {
    final s = LocaleScope.maybeOf(context)?.strings ??
        AppStrings.of(AppStrings.defaultLanguageCode);

    return Scaffold(
      backgroundColor: const Color(0xFFF1F5F9),
      body: SafeArea(
        child: Column(
          children: [
            // 1. Pinned Top Header
            _buildTopHeader(s),

            // 2. Fixed Center Live Canvas Area (Pinned in place, not scrollable!)
            Expanded(
              flex: 5,
              child: Center(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
                  child: AspectRatio(
                    aspectRatio: 1.0,
                    child: _buildPosterCanvas(),
                  ),
                ),
              ),
            ),

            // 3. Bottom Studio Dock (Contains contextual tools, tabs, and editing panels)
            Expanded(
              flex: 6,
              child: _buildBottomStudioDock(s),
            ),
          ],
        ),
      ),
    );
  }

  // Pinned Bottom Studio Dock with smooth scrollable editing controls
  Widget _buildBottomStudioDock(AppStrings s) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24.0)),
        boxShadow: [
          BoxShadow(
            color: Color(0x14000000),
            blurRadius: 16.0,
            offset: Offset(0, -4),
          ),
        ],
      ),
      child: Column(
        children: [
          // Drag handle pill
          Center(
            child: Container(
              margin: const EdgeInsets.only(top: 8.0, bottom: 6.0),
              width: 36.0,
              height: 4.0,
              decoration: BoxDecoration(
                color: const Color(0xFFCBD5E1),
                borderRadius: BorderRadius.circular(2.0),
              ),
            ),
          ),

          // Scrollable Controls Content Inside Studio Dock
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 14.0, vertical: 4.0),
              physics: const BouncingScrollPhysics(),
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 480.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // 1. Contextual Action Toolbar
                    _buildContextualToolbar(s),
                    const SizedBox(height: 12.0),

                    // 2. Customize Section Header & Category Tabs
                    _buildCustomizeSectionHeader(s),
                    const SizedBox(height: 10.0),

                    // 3. Active Tab Panel
                    _buildEditingControlsPanel(s),
                    const SizedBox(height: 14.0),

                    // 4. Action Buttons (Preview & Save)
                    _buildBottomActionButtons(s),
                    const SizedBox(height: 8.0),

                    // 5. Save Status Badge
                    _buildSaveStatusBadge(s),
                    const SizedBox(height: 8.0),
                  ],
                ),
              ),
            ),
          ),
        ],
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
            _project.backgroundAsset.startsWith('http://') ||
                    _project.backgroundAsset.startsWith('https://')
                ? Image.network(
                    _project.backgroundAsset,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) => Container(
                      color: _project.backgroundColor,
                      child: const Center(
                        child: Icon(Icons.celebration_rounded, size: 48, color: Colors.white30),
                      ),
                    ),
                  )
                : Image.asset(
                    _project.backgroundAsset,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) => Container(
                      color: _project.backgroundColor,
                      child: const Center(
                        child: Icon(Icons.celebration_rounded, size: 48, color: Colors.white30),
                      ),
                    ),
                  ),

            // Elements Layer (Text & Image elements)
            for (final element in _project.elements)
              if (element.type == PosterElementType.image)
                _buildImageElement(element, w, h, isInteractive)
              else
                _buildTextElement(element, w, h, isInteractive),

            // Frame Layer Overlay (Shows Sarpanch/user photo, name, designation, phone, or admin frame)
            if (_selectedFrameId != 'none')
              PosterFrameOverlay(
                frameId: _selectedFrameId,
                user: _currentUser,
                w: w,
                h: h,
                adminImageUrl: _getAdminFrameUrl(_selectedFrameId),
              ),
          ],
        );
      },
    );
  }

  Widget _buildImageElement(PosterElement element, double w, double h, bool isInteractive) {
    final elemWidth = (element.width ?? 0.65) * w;
    final elemHeight = (element.height ?? 0.45) * h;
    final isSelected = isInteractive && _selectedElementId == element.id;

    return Positioned(
      left: (element.x * w) - (elemWidth / 2),
      top: (element.y * h) - (elemHeight / 2),
      width: elemWidth,
      height: elemHeight,
      child: GestureDetector(
        onTap: isInteractive
            ? () {
                setState(() {
                  _selectedElementId = element.id;
                  _selectedTab = 'images';
                });
              }
            : null,
        onPanUpdate: isInteractive
            ? (details) {
                _recordHistory();
                setState(() {
                  final newX = (element.x + details.delta.dx / w).clamp(0.05, 0.95);
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
          decoration: BoxDecoration(
            border: isSelected
                ? Border.all(color: const Color(0xFF7C3AED), width: 1.8)
                : null,
            borderRadius: BorderRadius.circular(4.0),
          ),
          child: Stack(
            fit: StackFit.expand,
            children: [
              if (element.imageData != null)
                Image.memory(
                  base64Decode(element.imageData!),
                  fit: BoxFit.contain,
                )
              else if (element.imageAsset != null)
                element.imageAsset!.startsWith('http://') ||
                        element.imageAsset!.startsWith('https://')
                    ? Image.network(
                        element.imageAsset!,
                        fit: BoxFit.contain,
                        errorBuilder: (_, _, _) => const Icon(Icons.image, size: 36, color: Colors.white54),
                      )
                    : Image.asset(
                        element.imageAsset!,
                        fit: BoxFit.contain,
                        errorBuilder: (_, _, _) => const Icon(Icons.image, size: 36, color: Colors.white54),
                      )
              else
                const Icon(Icons.image_outlined, size: 36, color: Colors.white70),

              // Corner selection indicators
              if (isSelected) ...[
                Positioned(
                  top: -3,
                  left: -3,
                  child: Container(width: 8, height: 8, color: const Color(0xFF7C3AED)),
                ),
                Positioned(
                  top: -3,
                  right: -3,
                  child: Container(width: 8, height: 8, color: const Color(0xFF7C3AED)),
                ),
                Positioned(
                  bottom: -3,
                  left: -3,
                  child: Container(width: 8, height: 8, color: const Color(0xFF7C3AED)),
                ),
                Positioned(
                  bottom: -3,
                  right: -3,
                  child: Container(width: 8, height: 8, color: const Color(0xFF7C3AED)),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTextElement(PosterElement element, double w, double h, bool isInteractive) {
    final isSelected = isInteractive && _selectedElementId == element.id;

    return Positioned(
      left: (element.x * w) - (w * 0.45),
      top: element.y * h,
      width: w * 0.9,
      child: GestureDetector(
        onTap: isInteractive
            ? () {
                setState(() {
                  _selectedElementId = element.id;
                  if (element.id == 'elem_headline' || element.id == 'elem_supporting') {
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
            border: isSelected
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
            key: 'tool_frames',
            icon: Icons.crop_square_rounded,
            label: 'Frames',
            onTap: () {
              setState(() => _selectedTab = 'frames');
            },
          ),
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

        // Category Tabs: Frames, Text, Images, Colors, Background, Fonts
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          physics: const BouncingScrollPhysics(),
          child: Container(
            height: 40.0,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(14.0),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            padding: const EdgeInsets.symmetric(horizontal: 4.0, vertical: 2.5),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                _buildCategoryTab(
                  id: 'frames',
                  label: 'Frames',
                  icon: Icons.crop_square_rounded,
                ),
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

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 2.0),
      child: InkWell(
        key: ValueKey('tab_$id'),
        borderRadius: BorderRadius.circular(12.0),
        onTap: () {
          setState(() => _selectedTab = id);
        },
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          alignment: Alignment.center,
          padding: const EdgeInsets.symmetric(horizontal: 10.0),
          decoration: BoxDecoration(
            color: isActive ? const Color(0xFF6D28D9) : Colors.transparent,
            borderRadius: BorderRadius.circular(12.0),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
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
              Text(
                label,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  fontSize: 11.0,
                  fontWeight: isActive ? FontWeight.w700 : FontWeight.w500,
                  color: isActive ? Colors.white : const Color(0xFF64748B),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // 5. Active Editing Controls Panel (Contextual)
  Widget _buildEditingControlsPanel(AppStrings s) {
    switch (_selectedTab) {
      case 'frames':
        return _buildFramesTabPanel(s);
      case 'images':
        return _buildImagesTabPanel(s);
      case 'colors':
        return _buildColorsTabPanel(s);
      case 'background':
        return _buildBackgroundTabPanel(s);
      case 'fonts':
        return _buildFontsTabPanel(s);
      case 'text':
      default:
        return _buildTextTabPanel(s);
    }
  }

  // Frames Selection Tab Panel (Built-in + Admin Frames)
  Widget _buildFramesTabPanel(AppStrings s) {
    final allFrames = [...PosterFrames.list, ..._adminFrames];

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
          Row(
            children: [
              const Icon(Icons.crop_square_rounded, color: Color(0xFF7C3AED), size: 18.0),
              const SizedBox(width: 8.0),
              const Text(
                'Digital Frames & Panchayat Identity',
                style: TextStyle(
                  fontSize: 14.0,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFF1E293B),
                ),
              ),
              const Spacer(),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 2.0),
                decoration: BoxDecoration(
                  color: const Color(0xFFF3E8FF),
                  borderRadius: BorderRadius.circular(10.0),
                ),
                child: Text(
                  '${allFrames.length} Frames',
                  style: const TextStyle(
                    fontSize: 10.5,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF7C3AED),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 6.0),
          const Text(
            'Select a frame to automatically stamp your photo, name, designation, and mobile number.',
            style: TextStyle(fontSize: 11.5, color: Color(0xFF64748B)),
          ),
          const SizedBox(height: 12.0),
          SizedBox(
            height: 94.0,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: allFrames.length,
              separatorBuilder: (_, _) => const SizedBox(width: 10.0),
              itemBuilder: (context, idx) {
                final frame = allFrames[idx];
                final isSelected = _selectedFrameId == frame.id;

                return InkWell(
                  key: ValueKey('frame_option_${frame.id}'),
                  borderRadius: BorderRadius.circular(12.0),
                  onTap: () {
                    setState(() {
                      _selectedFrameId = frame.id;
                      _hasUnsavedChanges = true;
                    });
                  },
                  child: Container(
                    width: 86.0,
                    decoration: BoxDecoration(
                      color: isSelected ? const Color(0xFFF5F3FF) : const Color(0xFFF8FAFC),
                      borderRadius: BorderRadius.circular(12.0),
                      border: Border.all(
                        color: isSelected ? const Color(0xFF7C3AED) : const Color(0xFFE2E8F0),
                        width: isSelected ? 2.0 : 1.0,
                      ),
                      boxShadow: isSelected
                          ? [
                              BoxShadow(
                                color: const Color(0xFF7C3AED).withValues(alpha: 0.18),
                                blurRadius: 6.0,
                                offset: const Offset(0, 2),
                              ),
                            ]
                          : null,
                    ),
                    padding: const EdgeInsets.all(6.0),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        // Thumbnail Icon/Preview
                        Stack(
                          clipBehavior: Clip.none,
                          children: [
                            Container(
                              width: 44.0,
                              height: 40.0,
                              decoration: BoxDecoration(
                                color: frame.previewColor.withValues(alpha: 0.15),
                                borderRadius: BorderRadius.circular(8.0),
                                border: Border.all(color: frame.previewColor, width: 1.5),
                              ),
                              child: frame.id == 'none'
                                  ? const Icon(Icons.block_rounded, size: 20.0, color: Color(0xFF94A3B8))
                                  : frame.imageUrl != null
                                      ? ClipRRect(
                                          borderRadius: BorderRadius.circular(6.0),
                                          child: frame.imageUrl!.startsWith('http')
                                              ? Image.network(
                                                  frame.imageUrl!,
                                                  fit: BoxFit.cover,
                                                  errorBuilder: (_, _, _) => Icon(
                                                    Icons.broken_image_rounded,
                                                    size: 20.0,
                                                    color: frame.previewColor,
                                                  ),
                                                )
                                              : Image.asset(
                                                  frame.imageUrl!,
                                                  fit: BoxFit.cover,
                                                  errorBuilder: (_, _, _) => Icon(
                                                    Icons.broken_image_rounded,
                                                    size: 20.0,
                                                    color: frame.previewColor,
                                                  ),
                                                ),
                                        )
                                      : Icon(Icons.badge_rounded, size: 22.0, color: frame.previewColor),
                            ),
                            if (isSelected)
                              Positioned(
                                top: -4,
                                right: -4,
                                child: Container(
                                  padding: const EdgeInsets.all(2.0),
                                  decoration: const BoxDecoration(
                                    color: Color(0xFF7C3AED),
                                    shape: BoxShape.circle,
                                  ),
                                  child: const Icon(Icons.check, size: 10.0, color: Colors.white),
                                ),
                              ),
                          ],
                        ),
                        const SizedBox(height: 6.0),
                        Text(
                          frame.name,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 10.5,
                            fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                            color: isSelected ? const Color(0xFF6D28D9) : const Color(0xFF1E293B),
                          ),
                        ),
                        if (frame.badgeText != null)
                          Text(
                            frame.badgeText!,
                            style: TextStyle(
                              fontSize: 9.0,
                              fontWeight: FontWeight.w700,
                              color: frame.previewColor,
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
      ),
    );
  }

  Widget _buildTextTabPanel(AppStrings s) {
    final selectedElement = _effectiveSelectedElement;

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
                width: 136.0,
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

  Widget _buildColorsTabPanel(AppStrings s) {
    final selectedElement = _effectiveSelectedElement;

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
          Row(
            children: const [
              Icon(Icons.palette_outlined, color: Color(0xFF7C3AED), size: 18.0),
              SizedBox(width: 8.0),
              Text(
                'Color Palette & Accents',
                style: TextStyle(fontSize: 14.0, fontWeight: FontWeight.w800, color: Color(0xFF1E293B)),
              ),
            ],
          ),
          const SizedBox(height: 12.0),
          Wrap(
            spacing: 8.0,
            runSpacing: 8.0,
            crossAxisAlignment: WrapCrossAlignment.center,
            children: [
              for (final color in _extendedColors)
                _buildColorSwatch(color, selectedElement.color),
              _buildCustomColorAdd(),
            ],
          ),
          const SizedBox(height: 14.0),
          const Text(
            'Tap any color swatch to apply directly to the selected canvas text or element.',
            style: TextStyle(fontSize: 11.5, color: Color(0xFF64748B)),
          ),
        ],
      ),
    );
  }

  Widget _buildFontsTabPanel(AppStrings s) {
    final selectedElement = _effectiveSelectedElement;

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
          Row(
            children: const [
              Icon(Icons.font_download_outlined, color: Color(0xFF7C3AED), size: 18.0),
              SizedBox(width: 8.0),
              Text(
                'Gujarati & Indian Fonts',
                style: TextStyle(fontSize: 14.0, fontWeight: FontWeight.w800, color: Color(0xFF1E293B)),
              ),
            ],
          ),
          const SizedBox(height: 12.0),
          Wrap(
            spacing: 8.0,
            runSpacing: 8.0,
            children: _availableFonts.map((font) {
              final isCurrent = selectedElement.fontFamily == font;
              return ChoiceChip(
                label: Text(font, style: TextStyle(fontFamily: font, fontWeight: isCurrent ? FontWeight.w700 : FontWeight.w500)),
                selected: isCurrent,
                selectedColor: const Color(0xFFEDE9FE),
                labelStyle: TextStyle(color: isCurrent ? const Color(0xFF6D28D9) : const Color(0xFF334155)),
                onSelected: (_) => _updateSelectedFont(font),
              );
            }).toList(),
          ),
          const SizedBox(height: 14.0),
          // Font Size Stepper
          Row(
            children: [
              const Text('Font Size:', style: TextStyle(fontSize: 12.0, fontWeight: FontWeight.w700, color: Color(0xFF334155))),
              Expanded(
                child: Slider(
                  value: selectedElement.fontSize.clamp(12.0, 48.0),
                  min: 12.0,
                  max: 48.0,
                  divisions: 18,
                  activeColor: const Color(0xFF7C3AED),
                  label: '${selectedElement.fontSize.toInt()} pt',
                  onChanged: (val) => _updateSelectedFontSize(val),
                ),
              ),
              Text('${selectedElement.fontSize.toInt()} pt', style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 12.0)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildImagesTabPanel(AppStrings s) {
    final festivalArtworks = [
      AppAssets.editorDandiyaCouple,
      AppAssets.navratriDandiyaTempleArt,
      AppAssets.festivalNavratriMaa,
      AppAssets.festivalDiwaliDiyas,
      AppAssets.panchayatLogo,
    ];

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
          Row(
            children: const [
              Icon(Icons.image_outlined, color: Color(0xFF7C3AED), size: 18.0),
              SizedBox(width: 8.0),
              Text(
                'Poster Artwork & Elements',
                style: TextStyle(fontSize: 14.0, fontWeight: FontWeight.w800, color: Color(0xFF1E293B)),
              ),
            ],
          ),
          const SizedBox(height: 12.0),
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  style: OutlinedButton.styleFrom(
                    foregroundColor: const Color(0xFF6D28D9),
                    side: const BorderSide(color: Color(0xFF6D28D9)),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.0)),
                  ),
                  icon: const Icon(Icons.photo_library_outlined, size: 16.0),
                  label: const Text('Add Image'),
                  onPressed: _replaceImageAction,
                ),
              ),
              const SizedBox(width: 10.0),
              Expanded(
                child: OutlinedButton.icon(
                  style: OutlinedButton.styleFrom(
                    foregroundColor: const Color(0xFF6D28D9),
                    side: const BorderSide(color: Color(0xFF6D28D9)),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.0)),
                  ),
                  icon: const Icon(Icons.copy_rounded, size: 16.0),
                  label: const Text('Duplicate'),
                  onPressed: _duplicateSelectedElement,
                ),
              ),
              if (_selectedElementId != null && _selectedElementId != 'elem_headline') ...[
                const SizedBox(width: 8.0),
                IconButton(
                  tooltip: 'Delete Element',
                  icon: const Icon(Icons.delete_outline_rounded, color: Color(0xFFDC2626)),
                  onPressed: _deleteSelectedElement,
                ),
              ],
            ],
          ),
          const SizedBox(height: 14.0),
          const Text(
            'Quick Festival Artwork Stickers:',
            style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.w700, color: Color(0xFF475569)),
          ),
          const SizedBox(height: 8.0),
          SizedBox(
            height: 60.0,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: festivalArtworks.length,
              separatorBuilder: (_, _) => const SizedBox(width: 8.0),
              itemBuilder: (context, idx) {
                final art = festivalArtworks[idx];
                return InkWell(
                  borderRadius: BorderRadius.circular(10.0),
                  onTap: () => _applyImageToCanvas(imageAsset: art),
                  child: Container(
                    width: 60.0,
                    height: 60.0,
                    padding: const EdgeInsets.all(4.0),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF8FAFC),
                      borderRadius: BorderRadius.circular(10.0),
                      border: Border.all(color: const Color(0xFFE2E8F0)),
                    ),
                    child: Image.asset(art, fit: BoxFit.contain),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBackgroundTabPanel(AppStrings s) {
    final backgrounds = [
      {'title': 'Shubh Navratri', 'asset': AppAssets.festivalPosterShubhNavratri},
      {'title': 'Temple Garba', 'asset': AppAssets.navratriDandiyaTempleArt},
      {'title': 'Diwali Lights', 'asset': AppAssets.festivalDiwaliDiyas},
      {'title': 'Maa Durga', 'asset': AppAssets.festivalNavratriMaa},
    ];

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
          Row(
            children: const [
              Icon(Icons.texture_rounded, color: Color(0xFF7C3AED), size: 18.0),
              SizedBox(width: 8.0),
              Text(
                'Background Atmosphere',
                style: TextStyle(fontSize: 14.0, fontWeight: FontWeight.w800, color: Color(0xFF1E293B)),
              ),
            ],
          ),
          const SizedBox(height: 10.0),
          const Text(
            'The active background theme is calibrated to festival artwork with authentic Indian temple backdrops and illumination.',
            style: TextStyle(fontSize: 12.0, color: Color(0xFF64748B)),
          ),
          const SizedBox(height: 12.0),
          SizedBox(
            height: 72.0,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: backgrounds.length,
              separatorBuilder: (_, _) => const SizedBox(width: 8.0),
              itemBuilder: (context, idx) {
                final bg = backgrounds[idx];
                final isCurrent = _project.backgroundAsset == bg['asset'];
                return InkWell(
                  borderRadius: BorderRadius.circular(10.0),
                  onTap: () {
                    _recordHistory();
                    setState(() {
                      _project = _project.copyWith(backgroundAsset: bg['asset']);
                    });
                  },
                  child: Container(
                    width: 72.0,
                    height: 72.0,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(10.0),
                      border: Border.all(
                        color: isCurrent ? const Color(0xFF7C3AED) : const Color(0xFFE2E8F0),
                        width: isCurrent ? 2.0 : 1.0,
                      ),
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(9.0),
                      child: Image.asset(bg['asset']!, fit: BoxFit.cover),
                    ),
                  ),
                );
              },
            ),
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
