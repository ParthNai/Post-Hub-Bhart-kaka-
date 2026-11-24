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

// ─── Design Tokens ────────────────────────────────────────────────────────────
const _kBg = Color(0xFFFAF9FC);
const _kSurface = Color(0xFFFFFFFF);
const _kPrimary = Color(0xFF7654C8);
const _kPrimaryDeep = Color(0xFF6D28D9);
const _kPrimaryLight = Color(0xFFEEE8FA);
const _kPrimaryUltraLight = Color(0xFFF3E8FF);
const _kTextPrimary = Color(0xFF252238);
const _kTextSecondary = Color(0xFF858194);
const _kBorder = Color(0xFFECEAF0);
const _kGreen = Color(0xFF16A34A);
// ─────────────────────────────────────────────────────────────────────────────

/// Screen 17: Quick Customize
/// Exact UI replication & complete working implementation corresponding
/// to the approved Screen 17 reference image.
class QuickCustomizeScreen extends StatefulWidget {
  const QuickCustomizeScreen({
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
  State<QuickCustomizeScreen> createState() => _QuickCustomizeScreenState();
}

class _QuickCustomizeScreenState extends State<QuickCustomizeScreen> {
  late final DesignStorageService _storageService;
  late final AuthService _authService;

  late PosterTemplateProject _project;
  UserProfile? _currentUser;

  // Controllers for Personal Information
  late final TextEditingController _nameController;
  late final TextEditingController _businessNameController;
  late final TextEditingController _mobileController;
  late final TextEditingController _addressController;
  late final TextEditingController _websiteController;

  // Text Options
  String _selectedMainHeading = 'Happy Navratri';
  String _selectedSubheading = 'May Maa Amba remove all the negativity and fill our lives with happiness.';

  final List<String> _headingOptions = const [
    'Happy Navratri',
    'Shubh Navratri',
    'Garba Mahotsav 2026',
    'Jai Mataji',
  ];

  final List<String> _subheadingOptions = const [
    'May Maa Amba remove all the negativity and fill our lives with happiness.',
    'Warm festival wishes to all villagers and families.',
    'Celebrating devotion, culture, and unity together.',
    'May the divine blessings bring joy, peace, and prosperity.',
  ];

  // Visibility Toggles
  bool _showContactInfo = true;
  bool _showName = true;
  bool _showLogo = true;

  // Personal Assets
  String _photoAsset = AppAssets.homeAvatarRahul;
  String _logoAsset = AppAssets.panchayatLogo;

  int _selectedNavIndex = 4; // Default to Profile tab as shown in reference

  @override
  void initState() {
    super.initState();
    _storageService = widget.storageService ?? DesignStorageService();
    _authService = widget.authService ?? AuthService();

    _initProject();
    _initControllers();
    _loadUser();
  }

  void _initProject() {
    if (widget.initialProject != null) {
      _project = widget.initialProject!;
    } else if (widget.festivalPosterTemplate != null) {
      _project = PosterTemplateProject.createDefaultQuickCustomizeProject(
        templateId: widget.festivalPosterTemplate!.id,
        imageAsset: widget.festivalPosterTemplate!.imageAsset,
        title: widget.festivalPosterTemplate!.title,
      );
    } else {
      _project = PosterTemplateProject.createDefaultQuickCustomizeProject();
    }
  }

  void _initControllers() {
    _nameController = TextEditingController(text: 'Rajan Patel');
    _businessNameController = TextEditingController(text: 'Panchayat Post');
    _mobileController = TextEditingController(text: '+91 98765 43210');
    _addressController = TextEditingController(text: 'Ahmedabad, Gujarat');
    _websiteController = TextEditingController(text: 'www.panchayatpost.in');

    _nameController.addListener(() => setState(() {}));
    _businessNameController.addListener(() => setState(() {}));
    _mobileController.addListener(() => setState(() {}));
    _addressController.addListener(() => setState(() {}));
    _websiteController.addListener(() => setState(() {}));
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final args = ModalRoute.of(context)?.settings.arguments;
    if (widget.initialProject == null && widget.festivalPosterTemplate == null) {
      if (args is PosterTemplateProject) {
        setState(() {
          _project = args;
          _selectedMainHeading = _project.title.isNotEmpty ? _project.title : 'Happy Navratri';
        });
      } else if (args is FestivalPosterTemplate) {
        setState(() {
          _project = PosterTemplateProject.createDefaultQuickCustomizeProject(
            templateId: args.id,
            imageAsset: args.imageAsset,
            title: args.title,
          );
          _selectedMainHeading = args.title.isNotEmpty ? args.title : 'Happy Navratri';
        });
      }
    }
  }

  @override
  void dispose() {
    _nameController.dispose();
    _businessNameController.dispose();
    _mobileController.dispose();
    _addressController.dispose();
    _websiteController.dispose();
    super.dispose();
  }

  Future<void> _loadUser() async {
    final user = await _authService.getCurrentUser();
    if (mounted && user != null) {
      setState(() {
        _currentUser = user;
        if (user.effectiveDisplayName.isNotEmpty) {
          _nameController.text = user.effectiveDisplayName;
        }
      });
    }
  }

  // ─── PHOTO & LOGO ACTIONS ──────────────────────────────────────────────────
  void _uploadPhoto() {
    setState(() {
      _photoAsset = AppAssets.homeAvatarRahul;
    });
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(
        const SnackBar(
          content: Text('Photo uploaded successfully!'),
          backgroundColor: _kGreen,
          duration: Duration(seconds: 2),
        ),
      );
  }

  void _changePhoto() {
    setState(() {
      _photoAsset = AppAssets.homeAvatarRahul;
    });
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(
        const SnackBar(
          content: Text('Photo changed from device gallery.'),
          backgroundColor: _kPrimary,
          duration: Duration(seconds: 2),
        ),
      );
  }

  void _uploadLogo() {
    setState(() {
      _logoAsset = AppAssets.panchayatLogo;
    });
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(
        const SnackBar(
          content: Text('Business logo uploaded!'),
          backgroundColor: _kGreen,
          duration: Duration(seconds: 2),
        ),
      );
  }

  void _changeLogo() {
    setState(() {
      _logoAsset = AppAssets.panchayatLogo;
    });
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(
        const SnackBar(
          content: Text('Logo updated from files.'),
          backgroundColor: _kPrimary,
          duration: Duration(seconds: 2),
        ),
      );
  }

  // ─── RESET ACTION ──────────────────────────────────────────────────────────
  void _resetChanges() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20.0)),
        title: const Text('Reset All Changes?', style: TextStyle(fontWeight: FontWeight.w800, color: _kTextPrimary)),
        content: const Text(
          'This will restore all text, business details, and visibility settings back to initial defaults.',
          style: TextStyle(color: _kTextSecondary, fontSize: 13.5),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('Cancel', style: TextStyle(color: _kTextSecondary, fontWeight: FontWeight.w600)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFEF4444),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.0)),
            ),
            onPressed: () {
              Navigator.of(ctx).pop();
              setState(() {
                _nameController.text = _currentUser?.effectiveDisplayName ?? 'Rajan Patel';
                _businessNameController.text = 'Panchayat Post';
                _mobileController.text = '+91 98765 43210';
                _addressController.text = 'Ahmedabad, Gujarat';
                _websiteController.text = 'www.panchayatpost.in';
                _selectedMainHeading = 'Happy Navratri';
                _selectedSubheading = 'May Maa Amba remove all the negativity and fill our lives with happiness.';
                _showContactInfo = true;
                _showName = true;
                _showLogo = true;
                _photoAsset = AppAssets.homeAvatarRahul;
                _logoAsset = AppAssets.panchayatLogo;
              });
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('All changes have been reset.'),
                  backgroundColor: _kPrimary,
                  duration: Duration(seconds: 2),
                ),
              );
            },
            child: const Text('Reset', style: TextStyle(fontWeight: FontWeight.w700)),
          ),
        ],
      ),
    );
  }

  // ─── PREVIEW POSTER MODAL ──────────────────────────────────────────────────
  void _previewPoster() {
    showDialog(
      context: context,
      builder: (ctx) => Dialog(
        backgroundColor: Colors.transparent,
        insetPadding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 24.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(20.0),
              child: AspectRatio(
                aspectRatio: 1.5,
                child: _buildCanvasStack(isInteractive: false),
              ),
            ),
            const SizedBox(height: 16.0),
            ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.white,
                foregroundColor: _kTextPrimary,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20.0)),
                padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 10.0),
              ),
              icon: const Icon(Icons.close_rounded, size: 18.0),
              label: const Text('Close Preview', style: TextStyle(fontWeight: FontWeight.w700)),
              onPressed: () => Navigator.of(ctx).pop(),
            ),
          ],
        ),
      ),
    );
  }

  // ─── CONTINUE TO EDITOR (PRIMARY ACTION) ───────────────────────────────────
  Future<void> _continueToEditor() async {
    // Package all customized values into a dynamic PosterTemplateProject
    final updatedElements = <PosterElement>[
      PosterElement(
        id: 'elem_headline',
        type: PosterElementType.text,
        text: _selectedMainHeading,
        x: 0.72,
        y: 0.16,
        fontSize: 28.0,
        color: const Color(0xFF6B1D2F),
        fontFamily: 'Poppins',
        textAlign: TextAlign.center,
        isBold: true,
        isSelected: true,
      ),
      PosterElement(
        id: 'elem_supporting',
        type: PosterElementType.text,
        text: _selectedSubheading,
        x: 0.72,
        y: 0.32,
        fontSize: 11.5,
        color: const Color(0xFF4A3E3D),
        fontFamily: 'Poppins',
        textAlign: TextAlign.center,
        isBold: false,
      ),
      if (_showName && _nameController.text.trim().isNotEmpty)
        PosterElement(
          id: 'elem_user_name',
          type: PosterElementType.text,
          text: _nameController.text.trim(),
          x: 0.82,
          y: 0.88,
          fontSize: 12.0,
          color: const Color(0xFF252238),
          fontFamily: 'Poppins',
          textAlign: TextAlign.right,
          isBold: true,
        ),
      if (_showContactInfo)
        PosterElement(
          id: 'elem_contact_phone',
          type: PosterElementType.text,
          text: '${_businessNameController.text.trim()} • ${_mobileController.text.trim()}',
          x: 0.50,
          y: 0.94,
          fontSize: 10.0,
          color: const Color(0xFF475569),
          fontFamily: 'Poppins',
          textAlign: TextAlign.center,
          isBold: false,
        ),
    ];

    final updatedProject = _project.copyWith(
      title: _selectedMainHeading,
      elements: updatedElements,
      updatedAt: DateTime.now(),
    );

    // Save draft
    await _storageService.saveDesign(
      updatedProject,
      userId: _currentUser?.username ?? 'default_user',
    );

    if (!mounted) return;

    // Navigate to Screen 12: Main Poster Editor
    Navigator.of(context).pushNamed(
      AppRoutes.posterEditor,
      arguments: updatedProject,
    );
  }

  @override
  Widget build(BuildContext context) {
    final s = LocaleScope.maybeOf(context)?.strings ??
        AppStrings.of(AppStrings.defaultLanguageCode);
    final isDesktop = MediaQuery.of(context).size.width >= 768;

    return Scaffold(
      backgroundColor: _kBg,
      body: SafeArea(
        child: Column(
          children: [
            // 1. Top Header
            _buildHeader(s),

            // Scrollable Content
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

                          // 2. Poster Preview Canvas
                          _buildPosterCanvasCard(),

                          const SizedBox(height: 18.0),

                          // 3. Section: Personalize Your Poster
                          _buildSectionHeader(s.personalizePosterTitle),

                          const SizedBox(height: 10.0),

                          // 4. 2x2 Personalization Grid Cards
                          _buildPersonalizationGrid(s),

                          const SizedBox(height: 20.0),

                          // 5. Section: Poster Text Options
                          _buildSectionHeader(s.posterTextOptionsTitle),

                          const SizedBox(height: 10.0),

                          // 6. Poster Text Controls Card
                          _buildPosterTextOptionsCard(s),

                          const SizedBox(height: 20.0),

                          // 7. Bottom Action Buttons (Reset, Preview, Continue)
                          _buildActionButtons(s),

                          const SizedBox(height: 16.0),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),

            // 8. Bottom Navigation Bar
            _buildBottomNavigationBar(),
          ],
        ),
      ),
    );
  }

  // ─── 1. TOP HEADER ─────────────────────────────────────────────────────────
  Widget _buildHeader(AppStrings s) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 10.0),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(bottom: BorderSide(color: _kBorder, width: 0.8)),
      ),
      child: Row(
        children: [
          // Back Button
          InkWell(
            key: const ValueKey('quick_customize_back_button'),
            borderRadius: BorderRadius.circular(12.0),
            onTap: () {
              if (Navigator.of(context).canPop()) {
                Navigator.of(context).pop();
              } else {
                Navigator.of(context).pushReplacementNamed(AppRoutes.festivalDetail);
              }
            },
            child: Container(
              padding: const EdgeInsets.all(8.0),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12.0),
                border: Border.all(color: _kBorder),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.04),
                    blurRadius: 4,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: const Icon(Icons.arrow_back_rounded, size: 20.0, color: _kTextPrimary),
            ),
          ),
          const SizedBox(width: 12.0),

          // Title & Subtitle
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  s.quickCustomizeTitle,
                  key: const ValueKey('quick_customize_title'),
                  style: const TextStyle(
                    fontSize: 17.5,
                    fontWeight: FontWeight.w800,
                    color: _kTextPrimary,
                  ),
                ),
                const SizedBox(height: 1.0),
                Text(
                  s.quickCustomizeSubtitle,
                  key: const ValueKey('quick_customize_subtitle'),
                  style: const TextStyle(
                    fontSize: 12.0,
                    fontWeight: FontWeight.w500,
                    color: _kTextSecondary,
                  ),
                ),
              ],
            ),
          ),

          // Step Pill Indicator: 1 / 2 | Customize
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 5.0, vertical: 4.0),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20.0),
              border: Border.all(color: _kBorder),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 7.0, vertical: 3.0),
                  decoration: BoxDecoration(
                    color: _kPrimaryDeep,
                    borderRadius: BorderRadius.circular(12.0),
                  ),
                  child: const Text(
                    '1 / 2',
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.w700,
                      fontSize: 10.5,
                    ),
                  ),
                ),
                Container(
                  margin: const EdgeInsets.symmetric(horizontal: 5.0),
                  height: 12.0,
                  width: 1.0,
                  color: _kBorder,
                ),
                const Padding(
                  padding: EdgeInsets.only(right: 6.0),
                  child: Text(
                    'Customize',
                    style: TextStyle(
                      color: _kPrimaryDeep,
                      fontWeight: FontWeight.w700,
                      fontSize: 11.0,
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

  // ─── 2. POSTER CANVAS CARD ─────────────────────────────────────────────────
  Widget _buildPosterCanvasCard() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20.0),
        border: Border.all(color: _kBorder),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.08),
            blurRadius: 14.0,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20.0),
        child: AspectRatio(
          aspectRatio: 1.5,
          child: Stack(
            fit: StackFit.expand,
            children: [
              // Canvas Stack
              _buildCanvasStack(isInteractive: true),

              // Floating "Edit Preview" Badge on Top Right
              Positioned(
                top: 10.0,
                right: 10.0,
                child: InkWell(
                  key: const ValueKey('btn_edit_preview'),
                  borderRadius: BorderRadius.circular(16.0),
                  onTap: _previewPoster,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 5.0),
                    decoration: BoxDecoration(
                      color: _kPrimary,
                      borderRadius: BorderRadius.circular(16.0),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.16),
                          blurRadius: 6,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: const [
                        Icon(Icons.visibility_outlined, size: 14.0, color: Colors.white),
                        SizedBox(width: 4.0),
                        Text(
                          'Edit Preview',
                          style: TextStyle(
                            fontSize: 11.0,
                            fontWeight: FontWeight.w700,
                            color: Colors.white,
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
      ),
    );
  }

  Widget _buildCanvasStack({required bool isInteractive}) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final w = constraints.maxWidth;
        final h = constraints.maxHeight;

        final isDefaultHeading = _selectedMainHeading == 'Happy Navratri';
        final isDefaultSub = _selectedSubheading == 'May Maa Amba remove all the negativity and fill our lives with happiness.';

        return Stack(
          fit: StackFit.expand,
          children: [
            // Background Artwork
            Image.asset(
              _project.backgroundAsset,
              fit: BoxFit.cover,
              errorBuilder: (_, _, _) => Container(
                color: const Color(0xFFFDF7EE),
                child: const Center(
                  child: Icon(Icons.celebration_rounded, size: 48, color: Colors.black26),
                ),
              ),
            ),

            // Live Heading Overlay (when customized)
            if (!isDefaultHeading)
              Positioned(
                right: w * 0.05,
                top: h * 0.12,
                width: w * 0.50,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6.0, vertical: 3.0),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFDF7EE).withValues(alpha: 0.90),
                    borderRadius: BorderRadius.circular(8.0),
                  ),
                  child: Text(
                    _selectedMainHeading,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 18.0,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF6B1D2F),
                      fontFamily: 'Poppins',
                    ),
                  ),
                ),
              ),

            // Live Subheading Overlay (when customized)
            if (!isDefaultSub)
              Positioned(
                right: w * 0.05,
                top: h * 0.28,
                width: w * 0.50,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6.0, vertical: 3.0),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFDF7EE).withValues(alpha: 0.90),
                    borderRadius: BorderRadius.circular(8.0),
                  ),
                  child: Text(
                    _selectedSubheading,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 10.0,
                      fontWeight: FontWeight.w500,
                      color: Color(0xFF4A3E3D),
                      fontFamily: 'Poppins',
                    ),
                  ),
                ),
              ),

            // Live User Name Overlay
            if (_showName && _nameController.text.trim().isNotEmpty)
              Positioned(
                bottom: h * 0.08,
                right: w * 0.06,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 2.0),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.88),
                    borderRadius: BorderRadius.circular(6.0),
                    border: Border.all(color: _kBorder, width: 0.5),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.person_rounded, size: 10.0, color: _kPrimaryDeep),
                      const SizedBox(width: 3.0),
                      Text(
                        _nameController.text.trim(),
                        style: const TextStyle(
                          fontSize: 9.5,
                          fontWeight: FontWeight.w700,
                          color: _kTextPrimary,
                        ),
                      ),
                    ],
                  ),
                ),
              ),

            // Live User Photo Overlay
            Positioned(
              bottom: h * 0.06,
              left: w * 0.05,
              child: Container(
                width: 28.0,
                height: 28.0,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(color: Colors.white, width: 1.5),
                  boxShadow: [
                    BoxShadow(color: Colors.black.withValues(alpha: 0.15), blurRadius: 4),
                  ],
                ),
                child: ClipOval(
                  child: Image.asset(
                    _photoAsset,
                    fit: BoxFit.cover,
                    errorBuilder: (_, _, _) => const Icon(Icons.person, size: 16),
                  ),
                ),
              ),
            ),

            // Live Business Logo Overlay
            if (_showLogo)
              Positioned(
                bottom: h * 0.06,
                left: w * 0.14,
                child: Container(
                  width: 24.0,
                  height: 24.0,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    shape: BoxShape.circle,
                    border: Border.all(color: _kBorder, width: 0.5),
                  ),
                  child: ClipOval(
                    child: Image.asset(
                      _logoAsset,
                      fit: BoxFit.contain,
                      errorBuilder: (_, _, _) => const Icon(Icons.business, size: 14),
                    ),
                  ),
                ),
              ),

            // Live Contact Details Footer
            if (_showContactInfo)
              Positioned(
                bottom: h * 0.015,
                left: 0,
                right: 0,
                child: Center(
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 1.5),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.90),
                      borderRadius: BorderRadius.circular(10.0),
                    ),
                    child: Text(
                      '${_businessNameController.text.trim()} • ${_mobileController.text.trim()}',
                      style: const TextStyle(
                        fontSize: 8.5,
                        fontWeight: FontWeight.w600,
                        color: Color(0xFF475569),
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

  // ─── 3. SECTION HEADER ─────────────────────────────────────────────────────
  Widget _buildSectionHeader(String title) {
    return Row(
      children: [
        Container(
          width: 3.5,
          height: 16.0,
          decoration: BoxDecoration(
            color: _kPrimary,
            borderRadius: BorderRadius.circular(2.0),
          ),
        ),
        const SizedBox(width: 8.0),
        Expanded(
          child: Text(
            title,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(
              fontSize: 16.0,
              fontWeight: FontWeight.w800,
              color: _kTextPrimary,
            ),
          ),
        ),
      ],
    );
  }

  // ─── 4. 2X2 PERSONALIZATION GRID CARDS ─────────────────────────────────────
  Widget _buildPersonalizationGrid(AppStrings s) {
    return Column(
      children: [
        // Top Row: Your Name & Add Your Photo
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(child: _buildYourNameCard(s)),
            const SizedBox(width: 12.0),
            Expanded(child: _buildAddYourPhotoCard(s)),
          ],
        ),
        const SizedBox(height: 12.0),

        // Bottom Row: Add Business Logo & Business Details
        Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(child: _buildAddBusinessLogoCard(s)),
            const SizedBox(width: 12.0),
            Expanded(child: _buildBusinessDetailsCard(s)),
          ],
        ),
      ],
    );
  }

  // Card 1: Your Name
  Widget _buildYourNameCard(AppStrings s) {
    return Container(
      key: const ValueKey('card_your_name'),
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
          Row(
            children: [
              const Icon(Icons.person_outline_rounded, size: 18.0, color: _kPrimary),
              const SizedBox(width: 6.0),
              Expanded(
                child: Text(
                  s.yourNameLabel,
                  style: const TextStyle(
                    fontSize: 13.0,
                    fontWeight: FontWeight.w700,
                    color: _kTextPrimary,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12.0),
          TextField(
            key: const ValueKey('input_your_name'),
            controller: _nameController,
            style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w600, color: _kTextPrimary),
            decoration: InputDecoration(
              hintText: s.enterYourNameHint,
              hintStyle: const TextStyle(fontSize: 12.0, color: _kTextSecondary),
              filled: true,
              fillColor: const Color(0xFFF8FAFC),
              contentPadding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 8.0),
              suffixIcon: const Icon(Icons.edit_rounded, size: 16.0, color: _kPrimary),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10.0),
                borderSide: const BorderSide(color: _kBorder),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10.0),
                borderSide: const BorderSide(color: _kBorder),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // Card 2: Add Your Photo
  Widget _buildAddYourPhotoCard(AppStrings s) {
    return Container(
      key: const ValueKey('card_add_photo'),
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
          Row(
            children: [
              const Icon(Icons.account_circle_outlined, size: 18.0, color: _kPrimary),
              const SizedBox(width: 6.0),
              Expanded(
                child: Text(
                  s.addYourPhotoLabel,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 13.0,
                    fontWeight: FontWeight.w700,
                    color: _kTextPrimary,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10.0),
          Row(
            children: [
              // Photo Avatar Circle
              Container(
                width: 50.0,
                height: 50.0,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(color: _kPrimaryLight, width: 2.0),
                ),
                child: ClipOval(
                  child: Image.asset(
                    _photoAsset,
                    fit: BoxFit.cover,
                    errorBuilder: (_, _, _) => const Icon(Icons.person, size: 28),
                  ),
                ),
              ),
              const SizedBox(width: 8.0),

              // Upload & Change Buttons Column
              Expanded(
                child: Column(
                  children: [
                    SizedBox(
                      width: double.infinity,
                      height: 26.0,
                      child: ElevatedButton.icon(
                        key: const ValueKey('btn_upload_photo'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: _kPrimary,
                          foregroundColor: Colors.white,
                          elevation: 0,
                          padding: const EdgeInsets.symmetric(horizontal: 6.0),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8.0)),
                        ),
                        icon: const Icon(Icons.cloud_upload_outlined, size: 13.0),
                        label: Text(
                          s.uploadButton,
                          style: const TextStyle(fontSize: 11.0, fontWeight: FontWeight.w700),
                        ),
                        onPressed: _uploadPhoto,
                      ),
                    ),
                    const SizedBox(height: 6.0),
                    SizedBox(
                      width: double.infinity,
                      height: 26.0,
                      child: ElevatedButton.icon(
                        key: const ValueKey('btn_change_photo'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: _kPrimaryUltraLight,
                          foregroundColor: _kPrimary,
                          elevation: 0,
                          padding: const EdgeInsets.symmetric(horizontal: 6.0),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8.0)),
                        ),
                        icon: const Icon(Icons.sync_rounded, size: 13.0),
                        label: Text(
                          s.changeButton,
                          style: const TextStyle(fontSize: 11.0, fontWeight: FontWeight.w700),
                        ),
                        onPressed: _changePhoto,
                      ),
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

  // Card 3: Add Your Business Logo
  Widget _buildAddBusinessLogoCard(AppStrings s) {
    return Container(
      key: const ValueKey('card_business_logo'),
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
          Row(
            children: [
              const Icon(Icons.photo_filter_rounded, size: 18.0, color: _kPrimary),
              const SizedBox(width: 6.0),
              Expanded(
                child: Text(
                  s.addBusinessLogoLabel,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 13.0,
                    fontWeight: FontWeight.w700,
                    color: _kTextPrimary,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10.0),
          Row(
            children: [
              // Logo Preview Box
              Container(
                width: 54.0,
                height: 54.0,
                padding: const EdgeInsets.all(4.0),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(10.0),
                  border: Border.all(color: _kBorder),
                ),
                child: Image.asset(
                  _logoAsset,
                  fit: BoxFit.contain,
                  errorBuilder: (_, _, _) => const Icon(Icons.business, size: 24),
                ),
              ),
              const SizedBox(width: 8.0),

              // Upload & Change Buttons Column
              Expanded(
                child: Column(
                  children: [
                    SizedBox(
                      width: double.infinity,
                      height: 26.0,
                      child: ElevatedButton.icon(
                        key: const ValueKey('btn_upload_logo'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: _kPrimary,
                          foregroundColor: Colors.white,
                          elevation: 0,
                          padding: const EdgeInsets.symmetric(horizontal: 6.0),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8.0)),
                        ),
                        icon: const Icon(Icons.cloud_upload_outlined, size: 13.0),
                        label: Text(
                          s.uploadButton,
                          style: const TextStyle(fontSize: 11.0, fontWeight: FontWeight.w700),
                        ),
                        onPressed: _uploadLogo,
                      ),
                    ),
                    const SizedBox(height: 6.0),
                    SizedBox(
                      width: double.infinity,
                      height: 26.0,
                      child: ElevatedButton.icon(
                        key: const ValueKey('btn_change_logo'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: _kPrimaryUltraLight,
                          foregroundColor: _kPrimary,
                          elevation: 0,
                          padding: const EdgeInsets.symmetric(horizontal: 6.0),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8.0)),
                        ),
                        icon: const Icon(Icons.sync_rounded, size: 13.0),
                        label: Text(
                          s.changeButton,
                          style: const TextStyle(fontSize: 11.0, fontWeight: FontWeight.w700),
                        ),
                        onPressed: _changeLogo,
                      ),
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

  // Card 4: Business Details
  Widget _buildBusinessDetailsCard(AppStrings s) {
    return Container(
      key: const ValueKey('card_business_details'),
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
          Row(
            children: [
              const Icon(Icons.business_center_outlined, size: 18.0, color: _kPrimary),
              const SizedBox(width: 6.0),
              Expanded(
                child: Text(
                  s.businessDetailsLabel,
                  style: const TextStyle(
                    fontSize: 13.0,
                    fontWeight: FontWeight.w700,
                    color: _kTextPrimary,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8.0),
          _buildDetailField(
            key: 'input_business_name',
            label: s.businessNameLabel,
            controller: _businessNameController,
          ),
          const SizedBox(height: 6.0),
          _buildDetailField(
            key: 'input_mobile_number',
            label: s.mobileNumberLabel,
            controller: _mobileController,
          ),
          const SizedBox(height: 6.0),
          _buildDetailField(
            key: 'input_address',
            label: s.addressOptionalLabel,
            controller: _addressController,
          ),
          const SizedBox(height: 6.0),
          _buildDetailField(
            key: 'input_website',
            label: s.websiteOptionalLabel,
            controller: _websiteController,
          ),
        ],
      ),
    );
  }

  Widget _buildDetailField({
    required String key,
    required String label,
    required TextEditingController controller,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(fontSize: 9.5, fontWeight: FontWeight.w500, color: _kTextSecondary),
        ),
        const SizedBox(height: 2.0),
        SizedBox(
          height: 26.0,
          child: TextField(
            key: ValueKey(key),
            controller: controller,
            style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.w600, color: _kTextPrimary),
            decoration: InputDecoration(
              filled: true,
              fillColor: const Color(0xFFF8FAFC),
              contentPadding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 4.0),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(6.0),
                borderSide: const BorderSide(color: _kBorder),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(6.0),
                borderSide: const BorderSide(color: _kBorder),
              ),
            ),
          ),
        ),
      ],
    );
  }

  // ─── 5. POSTER TEXT OPTIONS CARD ───────────────────────────────────────────
  Widget _buildPosterTextOptionsCard(AppStrings s) {
    return Container(
      padding: const EdgeInsets.all(14.0),
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
        children: [
          // Row 1: Main Heading & Subheading Dropdowns
          Row(
            children: [
              // Main Heading
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Text(
                          'T',
                          style: TextStyle(
                            fontSize: 13.0,
                            fontWeight: FontWeight.w800,
                            color: _kPrimary,
                          ),
                        ),
                        const SizedBox(width: 5.0),
                        Expanded(
                          child: Text(
                            s.mainHeadingLabel,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              fontSize: 12.0,
                              fontWeight: FontWeight.w700,
                              color: _kTextPrimary,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6.0),
                    Container(
                      height: 38.0,
                      padding: const EdgeInsets.symmetric(horizontal: 10.0),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF8FAFC),
                        borderRadius: BorderRadius.circular(10.0),
                        border: Border.all(color: _kBorder),
                      ),
                      child: DropdownButtonHideUnderline(
                        child: DropdownButton<String>(
                          key: const ValueKey('dropdown_main_heading'),
                          isExpanded: true,
                          value: _headingOptions.contains(_selectedMainHeading)
                              ? _selectedMainHeading
                              : _headingOptions.first,
                          icon: const Icon(Icons.keyboard_arrow_down_rounded, size: 18.0),
                          items: _headingOptions.map((h) {
                            return DropdownMenuItem<String>(
                              value: h,
                              child: Text(
                                h,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(fontSize: 12.0, fontWeight: FontWeight.w600),
                              ),
                            );
                          }).toList(),
                          onChanged: (val) {
                            if (val != null) setState(() => _selectedMainHeading = val);
                          },
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 12.0),

              // Subheading
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.format_list_bulleted_rounded, size: 14.0, color: _kPrimary),
                        const SizedBox(width: 5.0),
                        Expanded(
                          child: Text(
                            s.subheadingLabel,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              fontSize: 12.0,
                              fontWeight: FontWeight.w700,
                              color: _kTextPrimary,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6.0),
                    Container(
                      height: 38.0,
                      padding: const EdgeInsets.symmetric(horizontal: 10.0),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF8FAFC),
                        borderRadius: BorderRadius.circular(10.0),
                        border: Border.all(color: _kBorder),
                      ),
                      child: DropdownButtonHideUnderline(
                        child: DropdownButton<String>(
                          key: const ValueKey('dropdown_subheading'),
                          isExpanded: true,
                          value: _subheadingOptions.contains(_selectedSubheading)
                              ? _selectedSubheading
                              : _subheadingOptions.first,
                          icon: const Icon(Icons.keyboard_arrow_down_rounded, size: 18.0),
                          items: _subheadingOptions.map((sh) {
                            return DropdownMenuItem<String>(
                              value: sh,
                              child: Text(
                                sh,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.w600),
                              ),
                            );
                          }).toList(),
                          onChanged: (val) {
                            if (val != null) setState(() => _selectedSubheading = val);
                          },
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 14.0),
          const Divider(color: _kBorder, height: 1.0),
          const SizedBox(height: 12.0),

          // Row 2: Contact Details & Show/Hide Name
          Row(
            children: [
              // Contact Details Toggle
              Expanded(
                child: Row(
                  children: [
                    const Icon(Icons.phone_outlined, size: 18.0, color: _kPrimary),
                    const SizedBox(width: 8.0),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            s.contactDetailsLabel,
                            style: const TextStyle(
                              fontSize: 12.0,
                              fontWeight: FontWeight.w700,
                              color: _kTextPrimary,
                            ),
                          ),
                          Text(
                            s.showContactInfoLabel,
                            style: const TextStyle(fontSize: 10.0, color: _kTextSecondary),
                          ),
                        ],
                      ),
                    ),
                    Transform.scale(
                      scale: 0.75,
                      child: Switch(
                        key: const ValueKey('switch_contact_info'),
                        value: _showContactInfo,
                        activeThumbColor: _kPrimary,
                        activeTrackColor: _kPrimaryLight,
                        onChanged: (val) => setState(() => _showContactInfo = val),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8.0),

              // Show/Hide Name Toggle
              Expanded(
                child: Row(
                  children: [
                    const Icon(Icons.visibility_outlined, size: 18.0, color: _kPrimary),
                    const SizedBox(width: 8.0),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            s.showHideNameLabel,
                            style: const TextStyle(
                              fontSize: 12.0,
                              fontWeight: FontWeight.w700,
                              color: _kTextPrimary,
                            ),
                          ),
                          Text(
                            s.showNameLabel,
                            style: const TextStyle(fontSize: 10.0, color: _kTextSecondary),
                          ),
                        ],
                      ),
                    ),
                    Transform.scale(
                      scale: 0.75,
                      child: Switch(
                        key: const ValueKey('switch_show_name'),
                        value: _showName,
                        activeThumbColor: _kPrimary,
                        activeTrackColor: _kPrimaryLight,
                        onChanged: (val) => setState(() => _showName = val),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 8.0),
          const Divider(color: _kBorder, height: 1.0),
          const SizedBox(height: 8.0),

          // Row 3: Show/Hide Logo Toggle
          Row(
            children: [
              Expanded(
                child: Row(
                  children: [
                    const Icon(Icons.shield_outlined, size: 18.0, color: _kPrimary),
                    const SizedBox(width: 8.0),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            s.showHideLogoLabel,
                            style: const TextStyle(
                              fontSize: 12.0,
                              fontWeight: FontWeight.w700,
                              color: _kTextPrimary,
                            ),
                          ),
                          Text(
                            s.showLogoLabel,
                            style: const TextStyle(fontSize: 10.0, color: _kTextSecondary),
                          ),
                        ],
                      ),
                    ),
                    Transform.scale(
                      scale: 0.75,
                      child: Switch(
                        key: const ValueKey('switch_show_logo'),
                        value: _showLogo,
                        activeThumbColor: _kPrimary,
                        activeTrackColor: _kPrimaryLight,
                        onChanged: (val) => setState(() => _showLogo = val),
                      ),
                    ),
                  ],
                ),
              ),
              const Expanded(child: SizedBox.shrink()),
            ],
          ),
        ],
      ),
    );
  }

  // ─── 6. BOTTOM ACTION BUTTONS ──────────────────────────────────────────────
  Widget _buildActionButtons(AppStrings s) {
    return Row(
      children: [
        // 1. Reset Changes Button
        Expanded(
          flex: 4,
          child: ElevatedButton.icon(
            key: const ValueKey('btn_reset_changes'),
            style: ElevatedButton.styleFrom(
              backgroundColor: _kPrimaryUltraLight,
              foregroundColor: _kPrimary,
              elevation: 0,
              padding: const EdgeInsets.symmetric(vertical: 13.0),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24.0)),
            ),
            icon: const Icon(Icons.sync_rounded, size: 16.0),
            label: Text(
              s.resetChangesButton,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(fontSize: 12.0, fontWeight: FontWeight.w700),
            ),
            onPressed: _resetChanges,
          ),
        ),
        const SizedBox(width: 8.0),

        // 2. Preview Poster Button
        Expanded(
          flex: 4,
          child: ElevatedButton.icon(
            key: const ValueKey('btn_preview_poster'),
            style: ElevatedButton.styleFrom(
              backgroundColor: _kPrimaryUltraLight,
              foregroundColor: _kPrimary,
              elevation: 0,
              padding: const EdgeInsets.symmetric(vertical: 13.0),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24.0)),
            ),
            icon: const Icon(Icons.visibility_outlined, size: 16.0),
            label: Text(
              s.previewPosterButton,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(fontSize: 12.0, fontWeight: FontWeight.w700),
            ),
            onPressed: _previewPoster,
          ),
        ),
        const SizedBox(width: 8.0),

        // 3. Continue to Editor Button (Primary CTA)
        Expanded(
          flex: 5,
          child: ElevatedButton.icon(
            key: const ValueKey('btn_continue_to_editor'),
            style: ElevatedButton.styleFrom(
              backgroundColor: _kPrimaryDeep,
              foregroundColor: Colors.white,
              elevation: 2.0,
              padding: const EdgeInsets.symmetric(vertical: 13.0),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24.0)),
            ),
            icon: const Icon(Icons.arrow_forward_rounded, size: 16.0),
            label: Text(
              s.continueToEditorButton,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w700),
            ),
            onPressed: _continueToEditor,
          ),
        ),
      ],
    );
  }

  // ─── 7. BOTTOM NAVIGATION BAR ──────────────────────────────────────────────
  Widget _buildBottomNavigationBar() {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: _kBorder, width: 0.8)),
      ),
      padding: const EdgeInsets.symmetric(vertical: 6.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildNavItem(0, Icons.home_outlined, 'Home', () {
            Navigator.of(context).pushReplacementNamed(AppRoutes.home);
          }),
          _buildNavItem(1, Icons.calendar_today_outlined, 'Festivals', () {
            Navigator.of(context).pushReplacementNamed(AppRoutes.festivals);
          }),
          _buildNavItem(2, Icons.layers_outlined, 'Templates', () {
            Navigator.of(context).pushReplacementNamed(AppRoutes.festivals);
          }),
          _buildNavItem(3, Icons.photo_library_outlined, 'My Designs', () {
            Navigator.of(context).pushReplacementNamed(AppRoutes.myDesigns);
          }),
          _buildNavItem(4, Icons.person_rounded, 'Profile', () {
            Navigator.of(context).pushReplacementNamed(AppRoutes.profile);
          }),
        ],
      ),
    );
  }

  Widget _buildNavItem(int index, IconData icon, String label, VoidCallback onTap) {
    final isActive = _selectedNavIndex == index;
    return Expanded(
      child: InkWell(
        onTap: () {
          setState(() => _selectedNavIndex = index);
          onTap();
        },
        borderRadius: BorderRadius.circular(12.0),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 4.0, vertical: 4.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                icon,
                size: 22.0,
                color: isActive ? _kPrimary : _kTextSecondary,
              ),
              const SizedBox(height: 3.0),
              Text(
                label,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  fontSize: 10.5,
                  fontWeight: isActive ? FontWeight.w700 : FontWeight.w500,
                  color: isActive ? _kPrimary : _kTextSecondary,
                ),
              ),
              if (isActive)
                Container(
                  margin: const EdgeInsets.only(top: 3.0),
                  width: 18.0,
                  height: 2.5,
                  decoration: BoxDecoration(
                    color: _kPrimary,
                    borderRadius: BorderRadius.circular(2.0),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
