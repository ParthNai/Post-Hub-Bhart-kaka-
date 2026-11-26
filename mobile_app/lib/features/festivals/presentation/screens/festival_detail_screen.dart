import 'dart:convert';
import 'dart:typed_data';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:panchayat_post/core/constants/app_assets.dart';
import 'package:panchayat_post/core/constants/app_colors.dart';
import 'package:panchayat_post/core/localization/app_localizations.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';
import 'package:panchayat_post/core/services/background_remover_service.dart';
import 'package:panchayat_post/features/auth/data/auth_service.dart';
import 'package:panchayat_post/features/auth/domain/models/user_profile.dart';
import 'package:panchayat_post/features/editor/domain/models/poster_template_project.dart';
import 'package:panchayat_post/features/festivals/data/services/festival_service.dart';
import 'package:panchayat_post/features/festivals/domain/models/festival_item.dart';
import 'package:panchayat_post/features/editor/presentation/widgets/poster_frame_overlay.dart';

/// Screen 11: Festival Details & Poster Collection
///
/// Implements pixel-accurate layout corresponding to the approved
/// Screen 11 design reference image. Displays dynamic festival metadata,
/// hero celebration banner, about section, poster templates 2-column grid,
/// popular design styles selector, create-your-own section, and navigation.
class FestivalDetailScreen extends StatefulWidget {
  const FestivalDetailScreen({
    super.key,
    this.festival,
    this.festivalService,
    this.authService,
  });

  final FestivalItem? festival;
  final FestivalService? festivalService;
  final AuthService? authService;

  @override
  State<FestivalDetailScreen> createState() => _FestivalDetailScreenState();
}

class _FestivalDetailScreenState extends State<FestivalDetailScreen> {
  late final FestivalService _festivalService;
  late final AuthService _authService;
  final ScrollController _scrollController = ScrollController();
  final GlobalKey _posterGridKey = GlobalKey();

  UserProfile? _currentUser;
  late FestivalItem _currentFestival;
  String? _selectedStyleFilter;
  String? _customPhotoUrl;

  Future<void> _pickUserPhoto(
    void Function(void Function()) setSheetState,
  ) async {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20.0)),
      ),
      builder: (ctx) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 16.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Center(
                child: Container(
                  width: 36,
                  height: 4,
                  margin: const EdgeInsets.only(bottom: 14),
                  decoration: BoxDecoration(
                    color: const Color(0xFFCBD5E1),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const Text(
                'તમારો ફોટો પસંદ કરો (Add Your Photo)',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 16.0,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFF1E293B),
                ),
              ),
              const SizedBox(height: 16.0),
              ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: const Color(0xFFEFF6FF),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(
                    Icons.camera_alt_rounded,
                    color: Color(0xFF2563EB),
                  ),
                ),
                title: const Text(
                  'કેમેરાથી ફોટો પાડો (Camera)',
                  style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14),
                ),
                onTap: () {
                  Navigator.of(ctx).pop();
                  _executePhotoPick(ImageSource.camera);
                },
              ),
              ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF0FDF4),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(
                    Icons.photo_library_rounded,
                    color: Color(0xFF16A34A),
                  ),
                ),
                title: const Text(
                  'ગેલેરીમાંથી પસંદ કરો (Gallery)',
                  style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14),
                ),
                onTap: () {
                  Navigator.of(ctx).pop();
                  _executePhotoPick(ImageSource.gallery);
                },
              ),
              if (_customPhotoUrl != null ||
                  _currentUser?.profilePhotoUrl?.isNotEmpty == true) ...[
                ListTile(
                  leading: Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFEF2F2),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Icon(
                      Icons.delete_outline_rounded,
                      color: Color(0xFFDC2626),
                    ),
                  ),
                  title: const Text(
                    'ફોટો દૂર કરો (Remove Photo)',
                    style: TextStyle(
                      fontWeight: FontWeight.w700,
                      fontSize: 14,
                      color: Color(0xFFDC2626),
                    ),
                  ),
                  onTap: () {
                    Navigator.of(ctx).pop();
                    setSheetState(() {
                      _customPhotoUrl = '';
                    });
                    setState(() {
                      _customPhotoUrl = '';
                    });
                  },
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _executePhotoPick(ImageSource source) async {
    try {
      final picker = ImagePicker();
      final picked = await picker.pickImage(
        source: source,
        maxWidth: 1024,
        maxHeight: 1024,
        imageQuality: 85,
      );
      if (picked == null) return;

      final bytes = await picked.readAsBytes();
      if (!mounted) return;

      final messenger = ScaffoldMessenger.of(context);
      messenger.hideCurrentSnackBar();
      messenger.showSnackBar(
        const SnackBar(
          content: Text('Removing the background on your device...'),
          duration: Duration(minutes: 1),
        ),
      );

      Uint8List cutoutBytes;
      try {
        cutoutBytes = await BackgroundRemoverService.instance
            .removeBackgroundFromBytes(bytes);
      } catch (error) {
        debugPrint('[FestivalDetail] Photo background removal failed: $error');
        if (!mounted) return;
        messenger.hideCurrentSnackBar();
        messenger.showSnackBar(
          SnackBar(
            content: Text(
              error is UnsupportedError
                  ? 'Automatic background removal is available on Android and iOS. You can still add the original photo.'
                  : 'Could not remove the background. You can still add the original photo.',
            ),
            duration: const Duration(seconds: 8),
            action: SnackBarAction(
              label: 'Use original',
              onPressed: () {
                _applyPhotoToFrame(
                  bytes,
                  fileName: picked.name,
                  backgroundRemoved: false,
                );
              },
            ),
          ),
        );
        return;
      }

      if (!mounted) return;
      messenger.hideCurrentSnackBar();
      final fileExtension = picked.name.lastIndexOf('.');
      final fileStem = fileExtension > 0
          ? picked.name.substring(0, fileExtension)
          : 'frame-photo';
      await _applyPhotoToFrame(
        cutoutBytes,
        fileName: '${fileStem}_cutout.png',
        backgroundRemoved: true,
      );
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('⚠️ ફોટો પસંદ કરવામાં ભૂલ: $e'),
            backgroundColor: const Color(0xFFDC2626),
          ),
        );
      }
    }
  }

  Future<void> _applyPhotoToFrame(
    Uint8List bytes, {
    required String fileName,
    required bool backgroundRemoved,
  }) async {
    if (!mounted) return;

    final mimeType = fileName.toLowerCase().endsWith('.png')
        ? 'image/png'
        : fileName.toLowerCase().endsWith('.webp')
        ? 'image/webp'
        : 'image/jpeg';
    final dataUrl = 'data:$mimeType;base64,${base64Encode(bytes)}';

    setState(() {
      _customPhotoUrl = dataUrl;
    });

    if (_currentUser != null) {
      try {
        final savedUrl = await _authService.saveProfilePhoto(
          userId: _currentUser!.userId,
          imageBytes: bytes,
          fileName: fileName,
        );
        final updated = await _authService.updateUserProfile(
          userId: _currentUser!.userId,
          profilePhotoUrl: savedUrl,
        );
        if (mounted) {
          setState(() {
            _currentUser = updated;
          });
        }
      } catch (error) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                'Photo added to the frame, but could not be saved to your profile: $error',
              ),
              backgroundColor: const Color(0xFFB45309),
            ),
          );
        }
        return;
      }
    }

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            backgroundRemoved
                ? '✅ Photo background removed and added to the frame.'
                : '✅ Original photo added to the frame.',
          ),
          backgroundColor: Color(0xFF15803D),
          duration: Duration(seconds: 2),
        ),
      );
    }
  }

  @override
  void initState() {
    super.initState();
    _festivalService = widget.festivalService ?? FestivalService();
    _authService = widget.authService ?? AuthService();
    _currentFestival =
        widget.festival ?? _festivalService.getFeaturedFestival();
    _loadUserProfile();
    _loadFrames();
  }

  Future<void> _loadFrames() async {
    await PosterFrames.loadAdminFrames();
    if (mounted) setState(() {});
  }

  /// Universal adaptive image loader supporting network URLs and local assets safely.
  Widget _buildAdaptiveImage(
    String path, {
    BoxFit fit = BoxFit.cover,
    double? width,
    double? height,
    Alignment alignment = Alignment.center,
    Widget? fallback,
  }) {
    if (path.isEmpty) {
      return fallback ?? Container(color: const Color(0xFFEDE9FE));
    }
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return Image.network(
        path,
        fit: fit,
        width: width,
        height: height,
        alignment: alignment,
        errorBuilder: (context, error, stackTrace) =>
            fallback ?? Container(color: const Color(0xFFEDE9FE)),
      );
    }
    return Image.asset(
      path,
      fit: fit,
      width: width,
      height: height,
      alignment: alignment,
      errorBuilder: (context, error, stackTrace) =>
          fallback ?? Container(color: const Color(0xFFEDE9FE)),
    );
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Allow receiving FestivalItem via ModalRoute settings arguments if not provided via constructor
    final routeArgs = ModalRoute.of(context)?.settings.arguments;
    if (widget.festival == null && routeArgs is FestivalItem) {
      _currentFestival = routeArgs;
    }
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  Future<void> _loadUserProfile() async {
    final profile = await _authService.getCurrentUser();
    if (mounted) {
      setState(() {
        _currentUser = profile;
      });
    }
  }

  void _scrollToPosterGrid() {
    final targetContext = _posterGridKey.currentContext;
    if (targetContext != null) {
      Scrollable.ensureVisible(
        targetContext,
        duration: const Duration(milliseconds: 400),
        curve: Curves.easeInOut,
      );
    } else {
      _scrollController.animateTo(
        350.0,
        duration: const Duration(milliseconds: 400),
        curve: Curves.easeInOut,
      );
    }
  }

  void _shareFestival() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            const Icon(Icons.share_rounded, color: Colors.white, size: 20),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                '${_currentFestival.name} link copied to share with community!',
                style: const TextStyle(fontWeight: FontWeight.w600),
              ),
            ),
          ],
        ),
        backgroundColor: const Color(0xFF6D28D9),
        behavior: SnackBarBehavior.floating,
        duration: const Duration(seconds: 3),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }

  void _showPosterCustomizationSheet(
    BuildContext context, {
    FestivalPosterTemplate? template,
  }) {
    final title = template?.title ?? _currentFestival.name;
    final imageAsset = template?.imageAsset ?? _currentFestival.imageAsset;
    final isAnnouncement = _currentFestival.isAnnouncement;

    // Pre-select:
    // 1. If template or festival has a specific recommended frame ID, use it.
    // 2. Otherwise, if the admin uploaded any custom frame, use the first custom admin frame!
    // 3. Fallback to 'admin_kesariya'.
    String? explicitRec =
        template?.recommendedFrameId ?? _currentFestival.recommendedFrameId;
    if (explicitRec != null && explicitRec.trim().isEmpty) explicitRec = null;

    final firstAdminCustomFrame = PosterFrames.list.firstWhere(
      (f) => f.imageUrl != null && f.imageUrl!.isNotEmpty,
      orElse: () => const PosterFrameDef(
        id: 'admin_kesariya',
        name: 'Royal Kesariya',
        previewColor: Colors.amber,
      ),
    );

    final recommendedFrameId = explicitRec ?? firstAdminCustomFrame.id;
    String selectedFrameId = recommendedFrameId;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24.0)),
      ),
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setSheetState) {
          final bottomPadding = MediaQuery.of(ctx).viewInsets.bottom + 20.0;
          final availableFrames = PosterFrames.list;

          return Container(
            constraints: BoxConstraints(
              maxHeight: MediaQuery.of(ctx).size.height * 0.92,
            ),
            child: SingleChildScrollView(
              padding: EdgeInsets.only(
                left: 18.0,
                right: 18.0,
                top: 14.0,
                bottom: bottomPadding,
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Top Drag handle
                  Center(
                    child: Container(
                      width: 42.0,
                      height: 4.5,
                      margin: const EdgeInsets.only(bottom: 12.0),
                      decoration: BoxDecoration(
                        color: const Color(0xFFCBD5E1),
                        borderRadius: BorderRadius.circular(3.0),
                      ),
                    ),
                  ),

                  // Header Row
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                if (isAnnouncement)
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 8.0,
                                      vertical: 3.0,
                                    ),
                                    margin: const EdgeInsets.only(right: 6.0),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFEFF6FF),
                                      borderRadius: BorderRadius.circular(6.0),
                                      border: Border.all(
                                        color: const Color(0xFF93C5FD),
                                      ),
                                    ),
                                    child: const Text(
                                      '📢 પરિપત્ર / જાહેરાત',
                                      style: TextStyle(
                                        fontSize: 11.0,
                                        fontWeight: FontWeight.w700,
                                        color: Color(0xFF1D4ED8),
                                      ),
                                    ),
                                  )
                                else
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 8.0,
                                      vertical: 3.0,
                                    ),
                                    margin: const EdgeInsets.only(right: 6.0),
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFFDF2F8),
                                      borderRadius: BorderRadius.circular(6.0),
                                      border: Border.all(
                                        color: const Color(0xFFFBCFE8),
                                      ),
                                    ),
                                    child: const Text(
                                      '⭐ ૧-ક્લિક ફ્રેમ પોસ્ટર',
                                      style: TextStyle(
                                        fontSize: 11.0,
                                        fontWeight: FontWeight.w700,
                                        color: Color(0xFFDB2777),
                                      ),
                                    ),
                                  ),
                              ],
                            ),
                            const SizedBox(height: 4.0),
                            Text(
                              title,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                fontSize: 17.0,
                                fontWeight: FontWeight.w800,
                                color: AppColors.textNavy,
                              ),
                            ),
                          ],
                        ),
                      ),
                      IconButton(
                        icon: const Icon(
                          Icons.close_rounded,
                          color: Color(0xFF64748B),
                        ),
                        onPressed: () => Navigator.of(ctx).pop(),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12.0),

                  // --- ANNOUNCEMENT VIEW (View & Share only, no user frame) ---
                  if (isAnnouncement) ...[
                    Container(
                      height: 320.0,
                      decoration: BoxDecoration(
                        color: const Color(0xFFF8FAFC),
                        borderRadius: BorderRadius.circular(16.0),
                        border: Border.all(color: const Color(0xFFE2E8F0)),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.05),
                            blurRadius: 10.0,
                            offset: const Offset(0, 3),
                          ),
                        ],
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(16.0),
                        child: _buildAdaptiveImage(
                          imageAsset,
                          fit: BoxFit.contain,
                          width: double.infinity,
                          height: double.infinity,
                        ),
                      ),
                    ),
                    const SizedBox(height: 12.0),
                    Container(
                      padding: const EdgeInsets.all(10.0),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF0FDF4),
                        borderRadius: BorderRadius.circular(10.0),
                        border: Border.all(color: const Color(0xFFBBF7D0)),
                      ),
                      child: const Row(
                        children: [
                          Icon(
                            Icons.info_outline_rounded,
                            color: Color(0xFF16A34A),
                            size: 18.0,
                          ),
                          SizedBox(width: 8.0),
                          Expanded(
                            child: Text(
                              'આ સત્તાવાર પરિપત્ર છે. તેને સીધું ગ્રામજનો અને વોટ્સએપ ગ્રુપમાં શેર કરી શકો છો.',
                              style: TextStyle(
                                fontSize: 11.5,
                                color: Color(0xFF15803D),
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ]
                  // --- FESTIVAL POSTER VIEW (1-Click Frame Overlay) ---
                  else ...[
                    // Square live canvas preview with PosterFrameOverlay
                    LayoutBuilder(
                      builder: (context, constraints) {
                        final canvasWidth = constraints.maxWidth;
                        final canvasHeight = canvasWidth;

                        return Container(
                          width: canvasWidth,
                          height: canvasHeight,
                          decoration: BoxDecoration(
                            color: const Color(0xFF0F172A),
                            borderRadius: BorderRadius.circular(16.0),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withValues(alpha: 0.12),
                                blurRadius: 12.0,
                                offset: const Offset(0, 4),
                              ),
                            ],
                          ),
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(16.0),
                            child: Stack(
                              fit: StackFit.expand,
                              children: [
                                // 1. Base Festival Artwork
                                _buildAdaptiveImage(
                                  imageAsset,
                                  fit: BoxFit.cover,
                                  width: double.infinity,
                                  height: double.infinity,
                                ),

                                // 2. Instant Frame Overlay with user's name & details
                                PosterFrameOverlay(
                                  frameId: selectedFrameId,
                                  user: _currentUser,
                                  w: canvasWidth,
                                  h: canvasHeight,
                                  customPhotoUrl:
                                      (_customPhotoUrl != null &&
                                          _customPhotoUrl!.isNotEmpty)
                                      ? _customPhotoUrl
                                      : _currentUser?.profilePhotoUrl,
                                  onTapPhoto: () =>
                                      _pickUserPhoto(setSheetState),
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
                    const SizedBox(height: 12.0),

                    // User identity chip with "Add / Change Photo" action
                    Builder(
                      builder: (context) {
                        final effectivePhoto =
                            (_customPhotoUrl != null &&
                                _customPhotoUrl!.isNotEmpty)
                            ? _customPhotoUrl
                            : _currentUser?.profilePhotoUrl;
                        final hasPhoto =
                            effectivePhoto != null && effectivePhoto.isNotEmpty;

                        ImageProvider? photoProvider;
                        if (hasPhoto) {
                          if (effectivePhoto.startsWith('data:')) {
                            final raw = effectivePhoto.contains(',')
                                ? effectivePhoto.split(',').last
                                : effectivePhoto;
                            try {
                              photoProvider = MemoryImage(base64Decode(raw));
                            } catch (_) {}
                          } else if (effectivePhoto.startsWith('http://') ||
                              effectivePhoto.startsWith('https://')) {
                            photoProvider = NetworkImage(effectivePhoto);
                          }
                        }

                        return Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 10.0,
                            vertical: 8.0,
                          ),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF8FAFC),
                            borderRadius: BorderRadius.circular(12.0),
                            border: Border.all(color: const Color(0xFFE2E8F0)),
                          ),
                          child: Row(
                            children: [
                              GestureDetector(
                                onTap: () => _pickUserPhoto(setSheetState),
                                child: Stack(
                                  clipBehavior: Clip.none,
                                  children: [
                                    CircleAvatar(
                                      radius: 16.0,
                                      backgroundColor: const Color(0xFF7C3AED),
                                      backgroundImage: photoProvider,
                                      child: !hasPhoto
                                          ? const Icon(
                                              Icons.person,
                                              size: 18.0,
                                              color: Colors.white,
                                            )
                                          : null,
                                    ),
                                    Positioned(
                                      bottom: -2,
                                      right: -2,
                                      child: Container(
                                        padding: const EdgeInsets.all(2.5),
                                        decoration: const BoxDecoration(
                                          color: Color(0xFF2563EB),
                                          shape: BoxShape.circle,
                                        ),
                                        child: const Icon(
                                          Icons.camera_alt,
                                          size: 8.5,
                                          color: Colors.white,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(width: 10.0),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Text(
                                      '${_currentUser?.effectiveDisplayName ?? 'રાહુલ શર્મા'} (સરપંચ શ્રી)',
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                      style: const TextStyle(
                                        fontSize: 12.0,
                                        fontWeight: FontWeight.w700,
                                        color: Color(0xFF1E293B),
                                      ),
                                    ),
                                    Text(
                                      _currentUser?.villageCity ??
                                          'પાલનપુર ગ્રામ પંચાયત',
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                      style: const TextStyle(
                                        fontSize: 10.5,
                                        fontWeight: FontWeight.w500,
                                        color: Color(0xFF64748B),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(width: 8.0),
                              ElevatedButton.icon(
                                icon: const Icon(
                                  Icons.add_a_photo_rounded,
                                  size: 14.0,
                                ),
                                label: Text(
                                  hasPhoto ? 'ફોટો બદલો' : 'ફોટો ઉમેરો',
                                  style: const TextStyle(
                                    fontSize: 11.5,
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: const Color(0xFF2563EB),
                                  foregroundColor: Colors.white,
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 10.0,
                                    vertical: 8.0,
                                  ),
                                  shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(8.0),
                                  ),
                                  elevation: 0,
                                ),
                                onPressed: () => _pickUserPhoto(setSheetState),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
                    const SizedBox(height: 12.0),

                    // Frame Selector Header
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'ફ્રેમ પસંદ કરો / Choose Frame:',
                          style: TextStyle(
                            fontSize: 13.0,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFF1E293B),
                          ),
                        ),
                        if (selectedFrameId == recommendedFrameId)
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8.0,
                              vertical: 2.0,
                            ),
                            decoration: BoxDecoration(
                              color: const Color(0xFFFEF3C7),
                              borderRadius: BorderRadius.circular(8.0),
                              border: Border.all(
                                color: const Color(0xFFFDE68A),
                              ),
                            ),
                            child: const Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(
                                  Icons.star_rounded,
                                  size: 13.0,
                                  color: Color(0xFFD97706),
                                ),
                                SizedBox(width: 3.0),
                                Text(
                                  'શ્રેષ્ઠ મેળ ખાતી ભલામણ',
                                  style: TextStyle(
                                    fontSize: 10.5,
                                    fontWeight: FontWeight.w700,
                                    color: Color(0xFFB45309),
                                  ),
                                ),
                              ],
                            ),
                          ),
                      ],
                    ),
                    const SizedBox(height: 8.0),

                    // Horizontal Frame Thumbnails
                    SizedBox(
                      height: 80.0,
                      child: ListView.separated(
                        scrollDirection: Axis.horizontal,
                        itemCount: availableFrames.length,
                        separatorBuilder: (context, index) =>
                            const SizedBox(width: 8.0),
                        itemBuilder: (context, idx) {
                          final f = availableFrames[idx];
                          final isSelected = (selectedFrameId == f.id);
                          final isRec =
                              (f.id == recommendedFrameId ||
                              (recommendedFrameId.isNotEmpty &&
                                  f.id.contains(recommendedFrameId)));

                          return InkWell(
                            key: ValueKey('frame_pick_${f.id}'),
                            borderRadius: BorderRadius.circular(12.0),
                            onTap: () {
                              setSheetState(() {
                                selectedFrameId = f.id;
                              });
                            },
                            child: AnimatedContainer(
                              duration: const Duration(milliseconds: 180),
                              width: 76.0,
                              padding: const EdgeInsets.all(4.0),
                              decoration: BoxDecoration(
                                color: isSelected
                                    ? const Color(0xFFF3E8FF)
                                    : Colors.white,
                                borderRadius: BorderRadius.circular(12.0),
                                border: Border.all(
                                  color: isSelected
                                      ? const Color(0xFF7C3AED)
                                      : (isRec
                                            ? const Color(0xFFF59E0B)
                                            : const Color(0xFFE2E8F0)),
                                  width: isSelected ? 2.0 : (isRec ? 1.5 : 1.0),
                                ),
                                boxShadow: [
                                  if (isSelected)
                                    BoxShadow(
                                      color: const Color(0xFF7C3AED)
                                          .withValues(alpha: 0.20),
                                      blurRadius: 6.0,
                                      offset: const Offset(0, 2),
                                    ),
                                ],
                              ),
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Stack(
                                    clipBehavior: Clip.none,
                                    children: [
                                      Container(
                                        width: 32.0,
                                        height: 32.0,
                                        decoration: BoxDecoration(
                                          color: f.previewColor.withValues(
                                            alpha: 0.20,
                                          ),
                                          shape: BoxShape.circle,
                                          border: Border.all(
                                            color: f.previewColor,
                                            width: 1.5,
                                          ),
                                        ),
                                        child: Center(
                                          child: Icon(
                                            Icons.crop_original_rounded,
                                            size: 16.0,
                                            color: f.previewColor,
                                          ),
                                        ),
                                      ),
                                      if (isRec)
                                        Positioned(
                                          top: -4.0,
                                          right: -4.0,
                                          child: Container(
                                            padding: const EdgeInsets.all(2.0),
                                            decoration: const BoxDecoration(
                                              color: Color(0xFFF59E0B),
                                              shape: BoxShape.circle,
                                            ),
                                            child: const Icon(
                                              Icons.star_rounded,
                                              size: 10.0,
                                              color: Colors.white,
                                            ),
                                          ),
                                        ),
                                    ],
                                  ),
                                  const SizedBox(height: 4.0),
                                  Text(
                                    f.name,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    textAlign: TextAlign.center,
                                    style: TextStyle(
                                      fontSize: 9.5,
                                      fontWeight: isSelected
                                          ? FontWeight.w800
                                          : FontWeight.w600,
                                      color: isSelected
                                          ? const Color(0xFF6D28D9)
                                          : const Color(0xFF475569),
                                    ),
                                  ),
                                  if (isRec)
                                    const Text(
                                      '⭐ ભલામણ',
                                      style: TextStyle(
                                        fontSize: 8.0,
                                        fontWeight: FontWeight.w700,
                                        color: Color(0xFFD97706),
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

                  const SizedBox(height: 16.0),

                  // --- ACTION BUTTONS (WhatsApp Share & Download) ---
                  Row(
                    children: [
                      // 🟢 WhatsApp Share Button
                      Expanded(
                        child: ElevatedButton.icon(
                          key: const ValueKey('sheet_whatsapp_share_btn'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF25D366),
                            foregroundColor: Colors.white,
                            elevation: 2.0,
                            padding: const EdgeInsets.symmetric(vertical: 12.0),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12.0),
                            ),
                          ),
                          icon: const Icon(Icons.share_rounded, size: 18.0),
                          label: const Text(
                            'વોટ્સએપ શેર',
                            style: TextStyle(
                              fontWeight: FontWeight.w800,
                              fontSize: 13.5,
                            ),
                          ),
                          onPressed: () {
                            Navigator.of(ctx).pop();
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Row(
                                  children: [
                                    const Icon(
                                      Icons.check_circle_rounded,
                                      color: Colors.white,
                                      size: 20,
                                    ),
                                    const SizedBox(width: 8),
                                    Expanded(
                                      child: Text(
                                        'શુભ ${_currentFestival.name}! વોટ્સએપ પર શેરિંગ તૈયાર છે.',
                                        style: const TextStyle(
                                          fontWeight: FontWeight.w600,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                backgroundColor: const Color(0xFF16A34A),
                                behavior: SnackBarBehavior.floating,
                                duration: const Duration(seconds: 3),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(10),
                                ),
                              ),
                            );
                          },
                        ),
                      ),
                      const SizedBox(width: 10.0),

                      // 🟣 Download Poster Button
                      Expanded(
                        child: ElevatedButton.icon(
                          key: const ValueKey('sheet_download_poster_btn'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF6D28D9),
                            foregroundColor: Colors.white,
                            elevation: 2.0,
                            padding: const EdgeInsets.symmetric(vertical: 12.0),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12.0),
                            ),
                          ),
                          icon: const Icon(Icons.download_rounded, size: 18.0),
                          label: Text(
                            isAnnouncement ? 'પરિપત્ર ડાઉનલોડ' : 'ડાઉનલોડ કરો',
                            style: const TextStyle(
                              fontWeight: FontWeight.w800,
                              fontSize: 13.5,
                            ),
                          ),
                          onPressed: () {
                            Navigator.of(ctx).pop();
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Row(
                                  children: [
                                    const Icon(
                                      Icons.download_done_rounded,
                                      color: Colors.white,
                                      size: 20,
                                    ),
                                    const SizedBox(width: 8),
                                    Expanded(
                                      child: Text(
                                        '${_currentFestival.name} પોસ્ટર ગેલેરીમાં સાચવવામાં આવ્યું!',
                                        style: const TextStyle(
                                          fontWeight: FontWeight.w600,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                backgroundColor: const Color(0xFF059669),
                                behavior: SnackBarBehavior.floating,
                                duration: const Duration(seconds: 3),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(10),
                                ),
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
        },
      ),
    );
  }

  void _showNotificationsSheet(BuildContext context) {
    final s =
        LocaleScope.maybeOf(context)?.strings ??
        AppStrings.of(AppStrings.defaultLanguageCode);
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24.0)),
      ),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 20.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  child: Text(
                    s.notificationsTitle,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(
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
            const SizedBox(height: 20.0),
            Container(
              padding: const EdgeInsets.all(16.0),
              decoration: BoxDecoration(
                color: const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(16.0),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10.0),
                    decoration: const BoxDecoration(
                      color: Color(0xFFEDE9FE),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.celebration_rounded,
                      color: Color(0xFF6D28D9),
                      size: 24.0,
                    ),
                  ),
                  const SizedBox(width: 14.0),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '${_currentFestival.name} Poster Collection is Live!',
                          style: const TextStyle(
                            fontSize: 14.0,
                            fontWeight: FontWeight.w700,
                            color: AppColors.textNavy,
                          ),
                        ),
                        const SizedBox(height: 4.0),
                        Text(
                          'Create customized banners for ${_currentFestival.name} now.',
                          style: const TextStyle(
                            fontSize: 12.0,
                            color: Color(0xFF64748B),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24.0),
          ],
        ),
      ),
    );
  }

  List<FestivalPosterTemplate> _getFilteredTemplates() {
    final templates = _currentFestival.posterTemplates.isNotEmpty
        ? _currentFestival.posterTemplates
        : FestivalService.navratriTemplates;

    if (_selectedStyleFilter == null || _selectedStyleFilter!.isEmpty) {
      return templates;
    }

    final filtered = templates
        .where(
          (t) => t.style.toLowerCase() == _selectedStyleFilter!.toLowerCase(),
        )
        .toList();

    return filtered.isNotEmpty ? filtered : templates;
  }

  @override
  Widget build(BuildContext context) {
    final s =
        LocaleScope.maybeOf(context)?.strings ??
        AppStrings.of(AppStrings.defaultLanguageCode);
    final isDesktop = MediaQuery.of(context).size.width >= 768;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: SafeArea(
        child: Column(
          children: [
            // Top Header
            _buildTopHeader(context, s),

            // Scrollable Content
            Expanded(
              child: SingleChildScrollView(
                controller: _scrollController,
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
                          const SizedBox(height: 8.0),

                          // Breadcrumb
                          _buildBreadcrumb(s),

                          const SizedBox(height: 14.0),

                          // Hero Celebration Banner
                          _buildHeroBanner(context, s),

                          const SizedBox(height: 20.0),

                          // About This Festival
                          _buildAboutSection(s),

                          const SizedBox(height: 24.0),

                          // Create Festival Posts Header & 2-Col Grid
                          _buildPosterCollectionSection(context, s),

                          const SizedBox(height: 24.0),

                          // Popular Design Styles
                          _buildDesignStylesSection(s),

                          const SizedBox(height: 20.0),

                          // Create Your Own Festival Post
                          _buildCreateYourOwnCard(context, s),

                          const SizedBox(height: 24.0),

                          // Bottom village silhouette watermark
                          Center(
                            child: Image.asset(
                              AppAssets.villageSilhouette,
                              height: 48.0,
                              fit: BoxFit.contain,
                              opacity: const AlwaysStoppedAnimation(0.28),
                            ),
                          ),

                          const SizedBox(height: 16.0),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),

            // Bottom Navigation Bar
            _buildBottomNavBar(context, s),
          ],
        ),
      ),
    );
  }

  // 1. Top Header
  Widget _buildTopHeader(BuildContext context, AppStrings s) {
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
            key: const ValueKey('festival_detail_back_button'),
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
          const SizedBox(width: 10.0),

          // Panchayat Post Logo
          Image.asset(
            AppAssets.panchayatLogo,
            height: 32.0,
            fit: BoxFit.contain,
          ),
          const SizedBox(width: 8.0),

          // Vertical Divider
          Container(height: 18.0, width: 1.2, color: const Color(0xFFCBD5E1)),
          const SizedBox(width: 8.0),

          // Page Title
          Expanded(
            child: Text(
              s.festivalDetailsTitle,
              key: const ValueKey('festival_detail_title'),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                fontSize: 16.5,
                fontWeight: FontWeight.w700,
                color: Color(0xFF1E293B),
              ),
            ),
          ),

          // Notification Bell with red badge
          IconButton(
            key: const ValueKey('festival_detail_notification_button'),
            icon: Stack(
              clipBehavior: Clip.none,
              children: [
                const Icon(
                  Icons.notifications_none_rounded,
                  color: Color(0xFF1E293B),
                  size: 24.0,
                ),
                Positioned(
                  top: -2,
                  right: -1,
                  child: Container(
                    width: 8.5,
                    height: 8.5,
                    decoration: const BoxDecoration(
                      color: Color(0xFFEF4444),
                      shape: BoxShape.circle,
                    ),
                  ),
                ),
              ],
            ),
            onPressed: () => _showNotificationsSheet(context),
          ),

          // User Profile Avatar
          GestureDetector(
            key: const ValueKey('festival_detail_profile_avatar'),
            onTap: () {
              Navigator.of(context).pushNamed(AppRoutes.profileSetup);
            },
            child: Container(
              padding: const EdgeInsets.all(1.5),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                border: Border.all(color: const Color(0xFF7C3AED), width: 1.5),
              ),
              child: const CircleAvatar(
                radius: 16.0,
                backgroundColor: Color(0xFFEDE9FE),
                child: Icon(
                  Icons.person_rounded,
                  size: 18.0,
                  color: Color(0xFF7C3AED),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // 2. Breadcrumb
  Widget _buildBreadcrumb(AppStrings s) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 5.0),
      decoration: BoxDecoration(
        color: const Color(0xFFF3E8FF),
        borderRadius: BorderRadius.circular(20.0),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.home_rounded, size: 14.0, color: Color(0xFF7C3AED)),
          const SizedBox(width: 5.0),
          Flexible(
            child: Text(
              '${s.breadcrumbFestivals}  /  ${s.breadcrumbFestivalDetails}',
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                color: Color(0xFF7C3AED),
                fontSize: 11.5,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }

  // 3. Hero Celebration Banner
  Widget _buildHeroBanner(BuildContext context, AppStrings s) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20.0),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF6D28D9).withValues(alpha: 0.24),
            blurRadius: 18.0,
            offset: const Offset(0, 8.0),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20.0),
        child: Stack(
          children: [
            // Background Gradient
            Positioned.fill(
              child: Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      Color(0xFF240046),
                      Color(0xFF3C096C),
                      Color(0xFF5A189A),
                    ],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                ),
              ),
            ),

            // Right side dancers artwork (without any baked-in text!)
            Positioned(
              right: 0,
              top: 0,
              bottom: 0,
              width: 210.0,
              child: ClipRRect(
                borderRadius: const BorderRadius.only(
                  topRight: Radius.circular(20.0),
                  bottomRight: Radius.circular(20.0),
                ),
                child: (_currentFestival.heroBannerAsset?.isNotEmpty == true)
                    ? _buildAdaptiveImage(
                        _currentFestival.heroBannerAsset!,
                        fit: BoxFit.cover,
                        alignment: Alignment.centerLeft,
                        fallback: const SizedBox(),
                      )
                    : const SizedBox(),
              ),
            ),

            // Left side dark gradient overlay for text readability
            Positioned.fill(
              child: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      const Color(0xFF1B0033).withValues(alpha: 0.92),
                      const Color(0xFF240046).withValues(alpha: 0.70),
                      Colors.transparent,
                    ],
                    stops: const [0.0, 0.55, 1.0],
                    begin: Alignment.centerLeft,
                    end: Alignment.centerRight,
                  ),
                ),
              ),
            ),

            // Banner Content
            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: 16.0,
                vertical: 16.0,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Title: Festival Name
                  Text(
                    _currentFestival.name,
                    key: const ValueKey('festival_detail_hero_name'),
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 24.0,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 0.2,
                    ),
                  ),

                  // Elegant cursive script: Celebration
                  Text(
                    'Celebration',
                    style: TextStyle(
                      color: const Color(0xFFFDE68A), // Golden Amber
                      fontSize: 22.0,
                      fontWeight: FontWeight.w700,
                      fontStyle: FontStyle.italic,
                      letterSpacing: 0.5,
                      shadows: [
                        Shadow(
                          color: Colors.black.withValues(alpha: 0.5),
                          blurRadius: 4.0,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 6.0),

                  // Subtitle
                  ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 240.0),
                    child: Text(
                      _currentFestival.id == 'fest_featured_navratri' ||
                              _currentFestival.id == 'fest_navratri'
                          ? s.celebrateGarbaSubtitle
                          : (_currentFestival.description ??
                                s.celebrateGarbaSubtitle),
                      style: TextStyle(
                        color: Colors.white.withValues(alpha: 0.92),
                        fontSize: 12.0,
                        height: 1.3,
                        fontWeight: FontWeight.w400,
                      ),
                    ),
                  ),
                  const SizedBox(height: 10.0),

                  // Golden decorative divider
                  Container(
                    width: 220.0,
                    height: 1.2,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          const Color(0xFFFDE68A).withValues(alpha: 0.1),
                          const Color(0xFFFDE68A),
                          const Color(0xFFFDE68A).withValues(alpha: 0.1),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 10.0),

                  // Metadata Badges Row: Date | Tag | Upcoming
                  Wrap(
                    spacing: 8.0,
                    runSpacing: 6.0,
                    crossAxisAlignment: WrapCrossAlignment.center,
                    children: [
                      // Date
                      Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(
                            Icons.calendar_today_rounded,
                            size: 12.0,
                            color: Colors.white70,
                          ),
                          const SizedBox(width: 4.0),
                          Text(
                            _currentFestival.dateDisplay,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 11.0,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),

                      // Divider pipe
                      Text(
                        '|',
                        style: TextStyle(
                          color: Colors.white.withValues(alpha: 0.5),
                        ),
                      ),

                      // Tag
                      Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(
                            Icons.label_outline_rounded,
                            size: 13.0,
                            color: Colors.white70,
                          ),
                          const SizedBox(width: 3.0),
                          Text(
                            _currentFestival.categoryName.isNotEmpty
                                ? _currentFestival.categoryName
                                : 'Festival',
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 11.0,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),

                      // Upcoming Badge
                      if (_currentFestival.isUpcoming)
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8.0,
                            vertical: 2.5,
                          ),
                          decoration: BoxDecoration(
                            color: const Color(0xFFFEF3C7), // Warm yellow/amber
                            borderRadius: BorderRadius.circular(10.0),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: const [
                              Icon(
                                Icons.access_time_filled_rounded,
                                size: 11.0,
                                color: Color(0xFF92400E),
                              ),
                              SizedBox(width: 3.0),
                              Text(
                                'Upcoming',
                                style: TextStyle(
                                  color: Color(0xFF92400E),
                                  fontSize: 10.5,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                            ],
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 14.0),

                  // Two Action Buttons: Explore Designs -> & Share Festival
                  Row(
                    children: [
                      // Explore Designs
                      Flexible(
                        child: ElevatedButton(
                          key: const ValueKey('explore_designs_button'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF7C3AED),
                            foregroundColor: Colors.white,
                            elevation: 3.0,
                            padding: const EdgeInsets.symmetric(
                              horizontal: 12.0,
                              vertical: 8.0,
                            ),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(20.0),
                            ),
                          ),
                          onPressed: _scrollToPosterGrid,
                          child: FittedBox(
                            fit: BoxFit.scaleDown,
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: const [
                                Text(
                                  'Explore Designs',
                                  style: TextStyle(
                                    fontWeight: FontWeight.w700,
                                    fontSize: 12.0,
                                  ),
                                ),
                                SizedBox(width: 4.0),
                                Icon(Icons.arrow_forward_rounded, size: 13.0),
                              ],
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 8.0),

                      // Share Festival
                      Flexible(
                        child: OutlinedButton.icon(
                          key: const ValueKey('share_festival_button'),
                          style: OutlinedButton.styleFrom(
                            backgroundColor: Colors.white,
                            foregroundColor: const Color(0xFF1E293B),
                            side: BorderSide.none,
                            elevation: 2.0,
                            padding: const EdgeInsets.symmetric(
                              horizontal: 12.0,
                              vertical: 8.0,
                            ),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(20.0),
                            ),
                          ),
                          icon: const Icon(
                            Icons.share_outlined,
                            size: 13.0,
                            color: Color(0xFF1E293B),
                          ),
                          label: FittedBox(
                            fit: BoxFit.scaleDown,
                            child: Text(
                              s.shareFestivalButton,
                              style: const TextStyle(
                                fontWeight: FontWeight.w700,
                                fontSize: 12.0,
                                color: Color(0xFF1E293B),
                              ),
                            ),
                          ),
                          onPressed: _shareFestival,
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

  // 4. About This Festival
  Widget _buildAboutSection(AppStrings s) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Section Header with purple indicator
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
                s.aboutThisFestivalHeader,
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

        // About Card
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(14.0),
          decoration: BoxDecoration(
            color: const Color(0xFFF5F3FF),
            borderRadius: BorderRadius.circular(16.0),
            border: Border.all(color: const Color(0xFFEDE9FE)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Description
              Text(
                _currentFestival.aboutText ?? s.aboutFestivalDesc,
                style: const TextStyle(
                  fontSize: 12.5,
                  height: 1.45,
                  color: Color(0xFF475569),
                  fontWeight: FontWeight.w500,
                ),
              ),
              const SizedBox(height: 14.0),

              // Light divider
              Container(height: 1.0, color: const Color(0xFFE2E8F0)),
              const SizedBox(height: 12.0),

              // 3-Column stats row
              Row(
                children: [
                  // Col 1: Festival Category
                  Expanded(
                    child: _buildStatColumn(
                      icon: Icons.grid_view_rounded,
                      label: s.festivalCategoryLabel,
                      value: _currentFestival.categoryName.isNotEmpty
                          ? _currentFestival.categoryName
                          : s.categoryCulturalValue,
                    ),
                  ),

                  // Vertical divider
                  Container(
                    height: 32.0,
                    width: 1.0,
                    color: const Color(0xFFE2E8F0),
                  ),

                  // Col 2: Festival Date
                  Expanded(
                    child: _buildStatColumn(
                      icon: Icons.calendar_month_outlined,
                      label: s.festivalDateLabel,
                      value: _currentFestival.dateDisplay,
                    ),
                  ),

                  // Vertical divider
                  Container(
                    height: 32.0,
                    width: 1.0,
                    color: const Color(0xFFE2E8F0),
                  ),

                  // Col 3: Celebration Type
                  Expanded(
                    child: _buildStatColumn(
                      icon: Icons.star_rounded,
                      label: s.celebrationTypeLabel,
                      value: _currentFestival.celebrationType.isNotEmpty
                          ? _currentFestival.celebrationType
                          : s.celebrationTypeValue,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildStatColumn({
    required IconData icon,
    required String label,
    required String value,
  }) {
    return Column(
      children: [
        Icon(icon, size: 18.0, color: const Color(0xFF7C3AED)),
        const SizedBox(height: 4.0),
        Text(
          label,
          textAlign: TextAlign.center,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: const TextStyle(
            fontSize: 10.5,
            color: Color(0xFF64748B),
            fontWeight: FontWeight.w500,
          ),
        ),
        const SizedBox(height: 2.0),
        Text(
          value,
          textAlign: TextAlign.center,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: const TextStyle(
            fontSize: 12.0,
            fontWeight: FontWeight.w700,
            color: Color(0xFF6D28D9),
          ),
        ),
      ],
    );
  }

  // 5. Create Festival Posts (2-Col Grid)
  Widget _buildPosterCollectionSection(BuildContext context, AppStrings s) {
    final templates = _getFilteredTemplates();

    return Column(
      key: _posterGridKey,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Section Header & View All
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Expanded(
              child: Row(
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
                      s.createFestivalPostsTitle,
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
            ),
            const SizedBox(width: 8.0),
            InkWell(
              key: const ValueKey('view_all_posters_button'),
              onTap: () {
                setState(() {
                  _selectedStyleFilter = null; // Clear filter to view all
                });
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Showing all available festival templates'),
                    duration: Duration(seconds: 2),
                  ),
                );
              },
              child: Row(
                children: const [
                  Text(
                    'View All',
                    style: TextStyle(
                      fontSize: 12.5,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFF6D28D9),
                    ),
                  ),
                  SizedBox(width: 2.0),
                  Icon(
                    Icons.arrow_forward_rounded,
                    size: 13.0,
                    color: Color(0xFF6D28D9),
                  ),
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: 3.0),

        // Subtitle
        Text(
          s.createFestivalPostsSubtitle,
          style: const TextStyle(fontSize: 12.0, color: Color(0xFF64748B)),
        ),
        const SizedBox(height: 12.0),

        // 2-Column Grid of 4 Poster Cards
        GridView.builder(
          physics: const NeverScrollableScrollPhysics(),
          shrinkWrap: true,
          itemCount: templates.length,
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            crossAxisSpacing: 10.0,
            mainAxisSpacing: 10.0,
            childAspectRatio: 1.85,
          ),
          itemBuilder: (context, index) {
            final template = templates[index];
            return _buildPosterCard(context, template);
          },
        ),
      ],
    );
  }

  Widget _buildPosterCard(
    BuildContext context,
    FestivalPosterTemplate template,
  ) {
    return InkWell(
      key: ValueKey('poster_card_${template.id}'),
      borderRadius: BorderRadius.circular(14.0),
      onTap: () => _showPosterCustomizationSheet(context, template: template),
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(14.0),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.06),
              blurRadius: 8.0,
              offset: const Offset(0, 3.0),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(14.0),
          child: Stack(
            fit: StackFit.expand,
            children: [
              // Poster Graphic Asset
              _buildAdaptiveImage(
                template.imageAsset,
                fit: BoxFit.cover,
                fallback: Container(
                  color: const Color(0xFFEDE9FE),
                  alignment: Alignment.center,
                  child: Text(
                    template.title,
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 12.0,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF6D28D9),
                    ),
                  ),
                ),
              ),

              // If has recommended frame, show gold badge
              if (template.recommendedFrameId != null &&
                  template.recommendedFrameId!.isNotEmpty)
                Positioned(
                  top: 8.0,
                  left: 8.0,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 6.0,
                      vertical: 2.0,
                    ),
                    decoration: BoxDecoration(
                      color: const Color(0xFFD97706),
                      borderRadius: BorderRadius.circular(6.0),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.2),
                          blurRadius: 3,
                          offset: const Offset(0, 1),
                        ),
                      ],
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.star_rounded, size: 10, color: Colors.white),
                        SizedBox(width: 2),
                        Text(
                          'ભલામણ',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 9.0,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

              // Bottom right circular white button with purple forward arrow
              Positioned(
                bottom: 8.0,
                right: 8.0,
                child: Container(
                  width: 22.0,
                  height: 22.0,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.18),
                        blurRadius: 4.0,
                        offset: const Offset(0, 1.5),
                      ),
                    ],
                  ),
                  child: const Center(
                    child: Icon(
                      Icons.arrow_forward_rounded,
                      size: 13.0,
                      color: Color(0xFF6D28D9),
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

  // 6. Popular Design Styles
  Widget _buildDesignStylesSection(AppStrings s) {
    final styles = _festivalService.getDesignStyles();

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
                s.popularDesignStylesTitle,
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
        const SizedBox(height: 12.0),

        // 4 Horizontal Style Cards
        SizedBox(
          height: 84.0,
          child: ListView.separated(
            scrollDirection: Axis.horizontal,
            itemCount: styles.length,
            separatorBuilder: (context, index) => const SizedBox(width: 10.0),
            itemBuilder: (context, index) {
              final style = styles[index];
              final isSelected = _selectedStyleFilter == style.id;

              return InkWell(
                key: ValueKey('style_card_${style.id}'),
                borderRadius: BorderRadius.circular(12.0),
                onTap: () {
                  setState(() {
                    if (_selectedStyleFilter == style.id) {
                      _selectedStyleFilter = null; // deselect
                    } else {
                      _selectedStyleFilter = style.id;
                    }
                  });
                },
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  width: 96.0,
                  padding: const EdgeInsets.all(5.0),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(12.0),
                    border: Border.all(
                      color: isSelected
                          ? const Color(0xFF7C3AED)
                          : const Color(0xFFE2E8F0),
                      width: isSelected ? 1.8 : 1.0,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: isSelected
                            ? const Color(0xFF7C3AED).withValues(alpha: 0.18)
                            : Colors.black.withValues(alpha: 0.04),
                        blurRadius: isSelected ? 8.0 : 4.0,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(8.0),
                        child: Image.asset(
                          style.imageAsset,
                          height: 42.0,
                          width: double.infinity,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) =>
                              Container(
                                height: 42.0,
                                color: const Color(0xFFEDE9FE),
                                child: const Icon(
                                  Icons.style_rounded,
                                  size: 20.0,
                                  color: Color(0xFF7C3AED),
                                ),
                              ),
                        ),
                      ),
                      const SizedBox(height: 5.0),
                      Text(
                        style.name,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 10.0,
                          fontWeight: isSelected
                              ? FontWeight.w800
                              : FontWeight.w600,
                          color: isSelected
                              ? const Color(0xFF6D28D9)
                              : const Color(0xFF334155),
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
    );
  }

  // 7. Create Your Own Festival Post Card
  Widget _buildCreateYourOwnCard(BuildContext context, AppStrings s) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 14.0, vertical: 14.0),
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
      child: Row(
        children: [
          // Artist palette graphic
          Container(
            width: 44.0,
            height: 44.0,
            decoration: BoxDecoration(
              color: const Color(0xFFF3E8FF),
              borderRadius: BorderRadius.circular(12.0),
            ),
            padding: const EdgeInsets.all(5.0),
            child: const Icon(
              Icons.palette_rounded,
              color: Color(0xFF7C3AED),
              size: 26.0,
            ),
          ),
          const SizedBox(width: 12.0),

          // Titles
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  s.createYourOwnTitle,
                  style: const TextStyle(
                    fontSize: 13.5,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF1E293B),
                  ),
                ),
                const SizedBox(height: 2.0),
                Text(
                  s.createYourOwnSubtitle,
                  style: const TextStyle(
                    fontSize: 10.8,
                    height: 1.3,
                    color: Color(0xFF64748B),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8.0),

          // Start Now button
          ElevatedButton(
            key: const ValueKey('start_now_button'),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF6D28D9),
              foregroundColor: Colors.white,
              elevation: 2.0,
              padding: const EdgeInsets.symmetric(
                horizontal: 12.0,
                vertical: 9.0,
              ),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16.0),
              ),
            ),
            onPressed: () {
              final project =
                  PosterTemplateProject.createDefaultNavratriProject(
                    templateId: 'festival_${_currentFestival.id}',
                    imageAsset: _currentFestival.imageAsset,
                    title: _currentFestival.name,
                  );
              Navigator.of(context)
                  .pushNamed(AppRoutes.posterEditor, arguments: project);
            },
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  s.startNowButton,
                  style: const TextStyle(
                    fontSize: 11.5,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(width: 3.0),
                const Icon(Icons.arrow_forward_rounded, size: 13.0),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // 8. Bottom Navigation Bar
  Widget _buildBottomNavBar(BuildContext context, AppStrings s) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: Color(0xFFE2E8F0), width: 0.8)),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 4.0, vertical: 6.0),
      child: Row(
        children: [
          Expanded(
            child: _buildBottomNavItem(
              index: 0,
              icon: Icons.home_outlined,
              activeIcon: Icons.home_rounded,
              label: s.navHome,
              onTap: () {
                Navigator.of(context).pushReplacementNamed(AppRoutes.home);
              },
            ),
          ),
          Expanded(
            child: _buildBottomNavItem(
              index: 1,
              icon: Icons.calendar_month_outlined,
              activeIcon: Icons.calendar_month_rounded,
              label: s.navFestivals,
              isActive: true,
              onTap: () {
                // Already on Festivals
              },
            ),
          ),
          Expanded(
            child: _buildBottomNavItem(
              index: 2,
              icon: Icons.grid_view_outlined,
              activeIcon: Icons.grid_view_rounded,
              label: s.navTemplates,
              onTap: _scrollToPosterGrid,
            ),
          ),
          Expanded(
            child: _buildBottomNavItem(
              index: 3,
              icon: Icons.image_outlined,
              activeIcon: Icons.image_rounded,
              label: s.navMyDesigns,
              onTap: () {
                Navigator.of(context).pushNamed(AppRoutes.myDesigns);
              },
            ),
          ),
          Expanded(
            child: _buildBottomNavItem(
              index: 4,
              icon: Icons.person_outline_rounded,
              activeIcon: Icons.person_rounded,
              label: s.navProfile,
              onTap: () {
                Navigator.of(context).pushNamed(AppRoutes.profile);
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomNavItem({
    required int index,
    required IconData icon,
    required IconData activeIcon,
    required String label,
    required VoidCallback onTap,
    bool isActive = false,
  }) {
    const activeColor = Color(0xFF6D28D9);
    const inactiveColor = Color(0xFF64748B);

    return InkWell(
      borderRadius: BorderRadius.circular(16.0),
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 2.0, vertical: 4.0),
        decoration: BoxDecoration(
          color: isActive ? const Color(0xFFEDE9FE) : Colors.transparent,
          borderRadius: BorderRadius.circular(16.0),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              isActive ? activeIcon : icon,
              color: isActive ? activeColor : inactiveColor,
              size: 20.0,
            ),
            const SizedBox(height: 2.0),
            Text(
              label,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 10.0,
                fontWeight: isActive ? FontWeight.w700 : FontWeight.w500,
                color: isActive ? activeColor : inactiveColor,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
