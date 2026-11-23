import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:panchayat_post/core/constants/app_assets.dart';
import 'package:panchayat_post/core/constants/app_colors.dart';
import 'package:panchayat_post/core/constants/indian_states.dart';
import 'package:panchayat_post/core/localization/app_localizations.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';
import 'package:panchayat_post/features/auth/data/auth_service.dart';
import 'package:panchayat_post/features/auth/domain/models/user_profile.dart';
import 'package:panchayat_post/features/auth/presentation/widgets/auth_header_widget.dart';
import 'package:panchayat_post/features/welcome/presentation/widgets/welcome_background_painter.dart';

/// Screen 07: User Profile Setup Screen
///
/// Features:
/// - Step progress indicator bar ("પ્રોફાઇલ સેટઅપ" + 50% orange bar)
/// - Top hero artwork with avatar and leaf wings
/// - Circular profile photo picker with camera badge, Add Photo, and Change Photo actions
/// - Camera & Gallery selection with format validation (.png, .jpg, .jpeg, .webp) and max 5MB size check
/// - Required Full Name (prefilled from registration) & Display Name fields with validation
/// - Optional Village / City and searchable Indian State & UT dropdown
/// - Amber notice banner
/// - Primary orange "પ્રોફાઇલ સેવ કરો" button with backend persistence
/// - Secondary "હમણાં પછીથી કરો" skip button preserving uncompleted profile state
/// - Multi-language support (Gujarati default, Hindi, English)
/// - Responsive & overflow-free layout across mobile viewports
class ProfileSetupScreen extends StatefulWidget {
  const ProfileSetupScreen({
    super.key,
    this.initialProfile,
    this.authService,
    this.imagePicker,
    this.initialImageBytes,
    this.initialImageFileName,
    this.navigateToConfirmation = true,
  });

  final UserProfile? initialProfile;
  final AuthService? authService;
  final ImagePicker? imagePicker;
  final Uint8List? initialImageBytes;
  final String? initialImageFileName;
  final bool navigateToConfirmation;

  @override
  State<ProfileSetupScreen> createState() => _ProfileSetupScreenState();
}

class _ProfileSetupScreenState extends State<ProfileSetupScreen> {
  final _formKey = GlobalKey<FormState>();

  late final AuthService _authService;
  late final ImagePicker _imagePicker;

  final _fullNameController = TextEditingController();
  final _displayNameController = TextEditingController();
  final _villageCityController = TextEditingController();

  IndianState? _selectedState;
  Uint8List? _profileImageBytes;
  String? _profileImageFileName;
  String? _savedPhotoUrl;

  UserProfile? _currentUser;
  bool _isLoading = false;
  bool _initialLoadDone = false;

  @override
  void initState() {
    super.initState();
    _authService = widget.authService ?? AuthService();
    _imagePicker = widget.imagePicker ?? ImagePicker();

    if (widget.initialImageBytes != null) {
      _profileImageBytes = widget.initialImageBytes;
      _profileImageFileName = widget.initialImageFileName ?? 'avatar.jpg';
    }

    if (widget.initialProfile != null) {
      _applyProfile(widget.initialProfile!);
    }
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (!_initialLoadDone) {
      _initialLoadDone = true;
      _loadInitialUserData();
    }
  }

  @override
  void didUpdateWidget(covariant ProfileSetupScreen oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.initialProfile != oldWidget.initialProfile && widget.initialProfile != null) {
      _applyProfile(widget.initialProfile!);
    }
  }

  void _applyProfile(UserProfile profile) {
    _currentUser = profile;
    _fullNameController.text = profile.fullName;
    _displayNameController.text = profile.displayName ?? profile.fullName;
    _villageCityController.text = profile.villageCity ?? '';
    _savedPhotoUrl = profile.profilePhotoUrl;

    if (profile.state != null && profile.state!.isNotEmpty) {
      try {
        _selectedState = IndianStatesData.allStates.firstWhere(
          (s) =>
              s.nameEn.toLowerCase() == profile.state!.toLowerCase() ||
              s.nameGu.toLowerCase() == profile.state!.toLowerCase() ||
              s.nameHi.toLowerCase() == profile.state!.toLowerCase() ||
              s.code.toLowerCase() == profile.state!.toLowerCase(),
        );
      } catch (_) {
        _selectedState = null;
      }
    }
  }

  Future<void> _loadInitialUserData() async {
    if (_currentUser != null) return;

    final args = ModalRoute.of(context)?.settings.arguments;
    if (args is UserProfile) {
      setState(() => _applyProfile(args));
      return;
    }

    final activeUser = await _authService.getCurrentUser();
    if (activeUser != null && mounted) {
      setState(() => _applyProfile(activeUser));
    }
  }

  @override
  void dispose() {
    _fullNameController.dispose();
    _displayNameController.dispose();
    _villageCityController.dispose();
    super.dispose();
  }

  // ---------------------------------------------------------------------------
  // Profile Photo Selection & Management
  // ---------------------------------------------------------------------------

  void _showPhotoOptionsBottomSheet(BuildContext context) {
    final strings = LocaleScope.of(context).strings;

    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24.0)),
      ),
      builder: (ctx) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 16.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Drag handle
                Container(
                  width: 40.0,
                  height: 4.0,
                  decoration: BoxDecoration(
                    color: const Color(0xFFCBD5E1),
                    borderRadius: BorderRadius.circular(2.0),
                  ),
                ),
                const SizedBox(height: 18.0),

                Text(
                  strings.addPhotoAction,
                  style: const TextStyle(
                    fontSize: 18.0,
                    fontWeight: FontWeight.w800,
                    color: AppColors.textNavy,
                  ),
                ),
                const SizedBox(height: 16.0),

                // Option 1: Camera
                ListTile(
                  leading: Container(
                    padding: const EdgeInsets.all(8.0),
                    decoration: const BoxDecoration(
                      color: Color(0xFFEFF6FF),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.camera_alt_rounded,
                      color: Color(0xFF0284C7),
                      size: 22.0,
                    ),
                  ),
                  title: Text(
                    strings.takePhotoFromCamera,
                    style: const TextStyle(
                      fontWeight: FontWeight.w600,
                      color: AppColors.textNavy,
                    ),
                  ),
                  onTap: () {
                    Navigator.of(ctx).pop();
                    _pickImage(ImageSource.camera);
                  },
                ),

                // Option 2: Gallery
                ListTile(
                  leading: Container(
                    padding: const EdgeInsets.all(8.0),
                    decoration: const BoxDecoration(
                      color: Color(0xFFFFF7ED),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.photo_library_rounded,
                      color: Color(0xFFEA580C),
                      size: 22.0,
                    ),
                  ),
                  title: Text(
                    strings.chooseFromGallery,
                    style: const TextStyle(
                      fontWeight: FontWeight.w600,
                      color: AppColors.textNavy,
                    ),
                  ),
                  onTap: () {
                    Navigator.of(ctx).pop();
                    _pickImage(ImageSource.gallery);
                  },
                ),

                // Option 3: Remove photo (if image present)
                if (_profileImageBytes != null || (_savedPhotoUrl != null && _savedPhotoUrl!.isNotEmpty))
                  ListTile(
                    leading: Container(
                      padding: const EdgeInsets.all(8.0),
                      decoration: const BoxDecoration(
                        color: Color(0xFFFEF2F2),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.delete_outline_rounded,
                        color: Color(0xFFDC2626),
                        size: 22.0,
                      ),
                    ),
                    title: Text(
                      strings.removePhotoAction,
                      style: const TextStyle(
                        fontWeight: FontWeight.w600,
                        color: Color(0xFFDC2626),
                      ),
                    ),
                    onTap: () {
                      Navigator.of(ctx).pop();
                      _removePhoto();
                    },
                  ),
              ],
            ),
          ),
        );
      },
    );
  }

  Future<void> _pickImage(ImageSource source) async {
    final strings = LocaleScope.of(context).strings;

    try {
      final XFile? file = await _imagePicker.pickImage(
        source: source,
        maxWidth: 1024,
        maxHeight: 1024,
        imageQuality: 85,
      );

      if (file == null) return;

      // 1. Format validation
      final nameLower = file.name.toLowerCase();
      final isSupported = nameLower.endsWith('.png') ||
          nameLower.endsWith('.jpg') ||
          nameLower.endsWith('.jpeg') ||
          nameLower.endsWith('.webp');

      if (!isSupported) {
        if (!mounted) return;
        _showErrorSnackBar(strings.unsupportedImageFormatError);
        return;
      }

      // 2. Size validation (max 5MB)
      final bytes = await file.readAsBytes();
      const int maxBytes = 5 * 1024 * 1024;
      if (bytes.length > maxBytes) {
        if (!mounted) return;
        _showErrorSnackBar(strings.photoSizeTooLargeError);
        return;
      }

      setState(() {
        _profileImageBytes = bytes;
        _profileImageFileName = file.name;
      });
    } catch (_) {
      if (!mounted) return;
      _showErrorSnackBar(strings.photoPermissionDenied);
    }
  }

  void _removePhoto() {
    setState(() {
      _profileImageBytes = null;
      _profileImageFileName = null;
      _savedPhotoUrl = null;
    });
  }

  void _showErrorSnackBar(String message) {
    ScaffoldMessenger.of(context).removeCurrentSnackBar();
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: const Color(0xFFEF4444),
        duration: const Duration(seconds: 3),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // State Search & Selection Modal
  // ---------------------------------------------------------------------------

  void _showStateSelectionModal(BuildContext context) {
    final strings = LocaleScope.of(context).strings;
    final langCode = LocaleScope.of(context).currentLanguageCode;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24.0)),
      ),
      builder: (ctx) {
        String searchQuery = '';

        return StatefulBuilder(
          builder: (context, setModalState) {
            final filtered = IndianStatesData.allStates.where((state) {
              final q = searchQuery.toLowerCase().trim();
              if (q.isEmpty) return true;
              return state.localizedName(langCode).toLowerCase().contains(q) ||
                  state.nameEn.toLowerCase().contains(q) ||
                  state.nameGu.toLowerCase().contains(q) ||
                  state.nameHi.toLowerCase().contains(q) ||
                  state.code.toLowerCase().contains(q);
            }).toList();

            return DraggableScrollableSheet(
              initialChildSize: 0.7,
              minChildSize: 0.5,
              maxChildSize: 0.9,
              expand: false,
              builder: (_, scrollController) {
                return Column(
                  children: [
                    // Handle
                    Padding(
                      padding: const EdgeInsets.only(top: 12.0, bottom: 8.0),
                      child: Container(
                        width: 40.0,
                        height: 4.0,
                        decoration: BoxDecoration(
                          color: const Color(0xFFCBD5E1),
                          borderRadius: BorderRadius.circular(2.0),
                        ),
                      ),
                    ),

                    // Title
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 8.0),
                      child: Row(
                        children: [
                          const Icon(
                            Icons.account_balance_outlined,
                            color: Color(0xFFEA580C),
                            size: 22.0,
                          ),
                          const SizedBox(width: 8.0),
                          Text(
                            strings.selectStateTitle,
                            style: const TextStyle(
                              fontSize: 18.0,
                              fontWeight: FontWeight.w800,
                              color: AppColors.textNavy,
                            ),
                          ),
                        ],
                      ),
                    ),

                    // Search input
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 18.0, vertical: 8.0),
                      child: TextField(
                        key: const Key('state_search_input'),
                        decoration: InputDecoration(
                          prefixIcon: const Icon(Icons.search_rounded, color: Color(0xFF64748B)),
                          hintText: strings.searchStateHint,
                          hintStyle: const TextStyle(color: Color(0xFF94A3B8), fontSize: 14.0),
                          filled: true,
                          fillColor: const Color(0xFFF8FAFC),
                          contentPadding: const EdgeInsets.symmetric(vertical: 10.0),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12.0),
                            borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12.0),
                            borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12.0),
                            borderSide: const BorderSide(color: Color(0xFFEA580C), width: 1.5),
                          ),
                        ),
                        onChanged: (val) {
                          setModalState(() => searchQuery = val);
                        },
                      ),
                    ),

                    // List
                    Expanded(
                      child: ListView.separated(
                        controller: scrollController,
                        itemCount: filtered.length,
                        separatorBuilder: (context, index) => const Divider(height: 1.0, color: Color(0xFFF1F5F9)),
                        itemBuilder: (context, index) {
                          final state = filtered[index];
                          final isSelected = _selectedState?.code == state.code;

                          return ListTile(
                            dense: true,
                            title: Text(
                              state.localizedName(langCode),
                              style: TextStyle(
                                fontSize: 15.0,
                                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                                color: isSelected ? const Color(0xFFEA580C) : AppColors.textNavy,
                              ),
                            ),
                            subtitle: Text(
                              state.isUnionTerritory ? 'Union Territory' : 'State',
                              style: const TextStyle(fontSize: 11.5, color: Color(0xFF94A3B8)),
                            ),
                            trailing: isSelected
                                ? const Icon(Icons.check_circle_rounded, color: Color(0xFFEA580C), size: 20.0)
                                : null,
                            onTap: () {
                              setState(() => _selectedState = state);
                              Navigator.of(ctx).pop();
                            },
                          );
                        },
                      ),
                    ),
                  ],
                );
              },
            );
          },
        );
      },
    );
  }

  // ---------------------------------------------------------------------------
  // Save & Skip Handlers
  // ---------------------------------------------------------------------------

  Future<void> _handleSaveProfile() async {
    if (_isLoading) return;
    FocusScope.of(context).unfocus();

    if (!_formKey.currentState!.validate()) return;

    final strings = LocaleScope.of(context).strings;
    setState(() => _isLoading = true);

    try {
      // 1. Ensure user ID
      final userId = _currentUser?.userId ??
          (await _authService.getCurrentUser())?.userId ??
          'user_guest_${DateTime.now().millisecondsSinceEpoch}';

      // 2. Upload/Save profile photo if newly picked
      String? photoUrl = _savedPhotoUrl;
      if (_profileImageBytes != null) {
        photoUrl = await _authService.saveProfilePhoto(
          userId: userId,
          imageBytes: _profileImageBytes!,
          fileName: _profileImageFileName ?? 'avatar.jpg',
        );
      }

      // 3. Persist profile to backend
      final updated = await _authService.updateUserProfile(
        userId: userId,
        fullName: _fullNameController.text.trim(),
        displayName: _displayNameController.text.trim(),
        profilePhotoUrl: photoUrl,
        villageCity: _villageCityController.text.trim(),
        state: _selectedState?.nameEn,
        isProfileComplete: true,
      );

      if (!mounted) return;
      setState(() {
        _isLoading = false;
        _currentUser = updated;
        _savedPhotoUrl = photoUrl;
      });

      // 4. Show success feedback
      ScaffoldMessenger.of(context).removeCurrentSnackBar();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(strings.profileSavedSuccess),
          backgroundColor: const Color(0xFF16A34A),
          duration: const Duration(seconds: 2),
        ),
      );

      // 5. Navigate to Screen 08 (Onboarding Confirmation) or Home
      if (widget.navigateToConfirmation) {
        Navigator.of(context).pushNamedAndRemoveUntil(
          AppRoutes.onboardingConfirmation,
          (route) => false,
          arguments: updated,
        );
      } else {
        Navigator.of(context).pushNamedAndRemoveUntil(
          AppRoutes.home,
          (route) => false,
        );
      }
    } on AuthException catch (e) {
      if (!mounted) return;
      setState(() => _isLoading = false);
      _showErrorSnackBar(e.message);
    } catch (_) {
      if (!mounted) return;
      setState(() => _isLoading = false);
      _showErrorSnackBar(strings.networkOrServerError);
    }
  }

  void _handleSkipForNow() {
    // Navigate to Screen 08 (Onboarding Confirmation) or Home preserving incomplete profile status
    if (widget.navigateToConfirmation) {
      Navigator.of(context).pushNamedAndRemoveUntil(
        AppRoutes.onboardingConfirmation,
        (route) => false,
        arguments: _currentUser,
      );
    } else {
      Navigator.of(context).pushNamedAndRemoveUntil(
        AppRoutes.home,
        (route) => false,
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Build Method
  // ---------------------------------------------------------------------------

  @override
  Widget build(BuildContext context) {
    final strings = LocaleScope.of(context).strings;
    final langCode = LocaleScope.of(context).currentLanguageCode;

    return Scaffold(
      backgroundColor: Colors.white,
      body: CustomPaint(
        painter: const WelcomeBackgroundPainter(),
        child: SafeArea(
          child: Column(
            children: [
              // 1. Header (Back arrow, Panchayat Post logo & wordmark, Language selector)
              AuthHeaderWidget(
                onBackPressed: () => Navigator.of(context).maybePop(),
              ),

              // 2. Step Progress Header Bar
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 18.0, vertical: 6.0),
                child: Row(
                  children: [
                    // Orange circular person icon + "પ્રોફાઇલ સેટઅપ"
                    Container(
                      padding: const EdgeInsets.all(5.0),
                      decoration: const BoxDecoration(
                        color: Color(0xFFEA580C),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.person_rounded,
                        color: Colors.white,
                        size: 14.0,
                      ),
                    ),
                    const SizedBox(width: 8.0),
                    Text(
                      strings.profileSetupHeaderStep,
                      style: const TextStyle(
                        fontSize: 14.0,
                        fontWeight: FontWeight.w800,
                        color: AppColors.textNavy,
                      ),
                    ),
                    const SizedBox(width: 14.0),

                    // 50% Progress Bar
                    Expanded(
                      child: Container(
                        height: 6.0,
                        decoration: BoxDecoration(
                          color: const Color(0xFFE2E8F0),
                          borderRadius: BorderRadius.circular(3.0),
                        ),
                        child: Align(
                          alignment: Alignment.centerLeft,
                          child: FractionallySizedBox(
                            widthFactor: 0.5,
                            child: Container(
                              decoration: BoxDecoration(
                                color: const Color(0xFFFF6600),
                                borderRadius: BorderRadius.circular(3.0),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              // 3. Scrollable Form Body
              Expanded(
                child: SingleChildScrollView(
                  keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
                  physics: const ClampingScrollPhysics(),
                  padding: const EdgeInsets.symmetric(horizontal: 18.0),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        const SizedBox(height: 6.0),

                        // Hero Illustration
                        Image.asset(
                          AppAssets.profileSetupHero,
                          height: 105.0,
                          fit: BoxFit.contain,
                        ),
                        const SizedBox(height: 12.0),

                        // Heading ("તમારું પ્રોફાઇલ તૈયાર કરો")
                        Text(
                          strings.profileSetupHeading,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontSize: 24.0,
                            fontWeight: FontWeight.w800,
                            color: AppColors.textNavy,
                            letterSpacing: -0.4,
                          ),
                        ),
                        const SizedBox(height: 8.0),

                        // Subtitle
                        Text(
                          strings.profileSetupSubheading,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontSize: 13.0,
                            color: Color(0xFF475569),
                            height: 1.4,
                          ),
                        ),
                        const SizedBox(height: 18.0),

                        // Interactive Profile Photo Picker Component
                        _buildPhotoPicker(strings),
                        const SizedBox(height: 20.0),

                        // 1. Full Name Field (Required)
                        _buildFieldContainer(
                          icon: Icons.person_outline_rounded,
                          label: strings.fullNameFieldLabel,
                          child: TextFormField(
                            key: const Key('full_name_input'),
                            controller: _fullNameController,
                            textCapitalization: TextCapitalization.words,
                            decoration: _buildInputDecoration(strings.fullNameFieldHint),
                            validator: (val) {
                              if (val == null || val.trim().isEmpty) {
                                return strings.fullNameRequiredError;
                              }
                              if (val.trim().length < 2) {
                                return strings.fullNameRequiredError;
                              }
                              return null;
                            },
                          ),
                        ),
                        const SizedBox(height: 14.0),

                        // 2. Display Name Field (Required)
                        _buildFieldContainer(
                          icon: Icons.edit_outlined,
                          label: strings.displayNameFieldLabel,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              TextFormField(
                                key: const Key('display_name_input'),
                                controller: _displayNameController,
                                decoration: _buildInputDecoration(strings.displayNameFieldHint),
                                validator: (val) {
                                  if (val == null || val.trim().isEmpty) {
                                    return strings.displayNameRequiredError;
                                  }
                                  if (val.trim().length < 2 || val.trim().length > 50) {
                                    return strings.displayNameRequiredError;
                                  }
                                  return null;
                                },
                              ),
                              const SizedBox(height: 6.0),
                              Text(
                                strings.displayNameHelper,
                                style: const TextStyle(
                                  fontSize: 12.0,
                                  color: Color(0xFF64748B),
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 14.0),

                        // 3. Village / City Field (Optional)
                        _buildFieldContainer(
                          icon: Icons.location_on_outlined,
                          label: strings.villageCityFieldLabel,
                          child: TextFormField(
                            key: const Key('village_city_input'),
                            controller: _villageCityController,
                            textCapitalization: TextCapitalization.words,
                            decoration: _buildInputDecoration(strings.villageCityFieldHint),
                          ),
                        ),
                        const SizedBox(height: 14.0),

                        // 4. State Searchable Dropdown (Optional)
                        _buildFieldContainer(
                          icon: Icons.account_balance_outlined,
                          label: strings.stateFieldLabel,
                          child: InkWell(
                            key: const Key('state_dropdown_trigger'),
                            onTap: () => _showStateSelectionModal(context),
                            borderRadius: BorderRadius.circular(12.0),
                            child: Container(
                              width: double.infinity,
                              padding: const EdgeInsets.symmetric(horizontal: 14.0, vertical: 14.0),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(12.0),
                                border: Border.all(color: const Color(0xFFE2E8F0)),
                              ),
                              child: Row(
                                children: [
                                  Expanded(
                                    child: Text(
                                      _selectedState != null
                                          ? _selectedState!.localizedName(langCode)
                                          : strings.stateFieldHint,
                                      style: TextStyle(
                                        fontSize: 14.5,
                                        fontWeight: _selectedState != null ? FontWeight.w600 : FontWeight.w400,
                                        color: _selectedState != null ? AppColors.textNavy : const Color(0xFF94A3B8),
                                      ),
                                    ),
                                  ),
                                  const Icon(
                                    Icons.keyboard_arrow_down_rounded,
                                    color: Color(0xFF64748B),
                                    size: 24.0,
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(height: 18.0),

                        // Amber Notice Banner
                        Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(12.0),
                          decoration: BoxDecoration(
                            color: const Color(0xFFFFF7ED),
                            borderRadius: BorderRadius.circular(12.0),
                            border: Border.all(color: const Color(0xFFFFEDD5)),
                          ),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Icon(
                                Icons.info_outline_rounded,
                                size: 20.0,
                                color: Color(0xFFEA580C),
                              ),
                              const SizedBox(width: 10.0),
                              Expanded(
                                child: Text(
                                  strings.profileInfoBanner,
                                  style: const TextStyle(
                                    fontSize: 12.5,
                                    color: Color(0xFF9A3412),
                                    height: 1.4,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 18.0),

                        // Primary Action Button ("પ્રોફાઇલ સેવ કરો")
                        SizedBox(
                          width: double.infinity,
                          height: 52.0,
                          child: ElevatedButton(
                            key: const Key('save_profile_button'),
                            onPressed: _isLoading ? null : _handleSaveProfile,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFFFF6600),
                              foregroundColor: Colors.white,
                              disabledBackgroundColor: const Color(0xFFFF6600).withValues(alpha: 0.6),
                              elevation: 2.0,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(26.0),
                              ),
                            ),
                            child: _isLoading
                                ? const SizedBox(
                                    width: 22.0,
                                    height: 22.0,
                                    child: CircularProgressIndicator(
                                      strokeWidth: 2.5,
                                      color: Colors.white,
                                    ),
                                  )
                                : Text(
                                    strings.saveProfileButton,
                                    style: const TextStyle(
                                      fontSize: 16.5,
                                      fontWeight: FontWeight.w700,
                                      letterSpacing: 0.2,
                                    ),
                                  ),
                          ),
                        ),
                        const SizedBox(height: 12.0),

                        // Secondary Action Button ("હમણાં પછીથી કરો")
                        SizedBox(
                          width: double.infinity,
                          height: 52.0,
                          child: OutlinedButton(
                            key: const Key('skip_for_now_button'),
                            onPressed: _isLoading ? null : _handleSkipForNow,
                            style: OutlinedButton.styleFrom(
                              backgroundColor: Colors.white,
                              foregroundColor: AppColors.textNavy,
                              side: const BorderSide(
                                color: Color(0xFFFF6600),
                                width: 1.5,
                              ),
                              elevation: 0.0,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(26.0),
                              ),
                            ),
                            child: Text(
                              strings.skipForNowButton,
                              style: const TextStyle(
                                fontSize: 16.0,
                                fontWeight: FontWeight.w700,
                                color: AppColors.textNavy,
                                letterSpacing: 0.2,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(height: 24.0),

                        // Legal Footer
                        FittedBox(
                          fit: BoxFit.scaleDown,
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                strings.privacyPolicy,
                                style: const TextStyle(
                                  fontSize: 12.0,
                                  color: Color(0xFF64748B),
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                              const Padding(
                                padding: EdgeInsets.symmetric(horizontal: 10.0),
                                child: Text(
                                  '|',
                                  style: TextStyle(
                                    fontSize: 12.0,
                                    color: Color(0xFF94A3B8),
                                  ),
                                ),
                              ),
                              Text(
                                strings.termsAndConditions,
                                style: const TextStyle(
                                  fontSize: 12.0,
                                  color: Color(0xFF64748B),
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 14.0),

                        // Village Silhouette Art
                        Image.asset(
                          AppAssets.welcomeVillageFooter,
                          height: 48.0,
                          width: double.infinity,
                          fit: BoxFit.cover,
                          color: const Color(0xFFE2E8F0),
                          colorBlendMode: BlendMode.srcIn,
                        ),
                        const SizedBox(height: 12.0),
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

  // ---------------------------------------------------------------------------
  // Photo Picker Widget
  // ---------------------------------------------------------------------------

  Widget _buildPhotoPicker(AppStrings strings) {
    Widget avatarContent;

    if (_profileImageBytes != null) {
      avatarContent = ClipOval(
        child: Image.memory(
          _profileImageBytes!,
          width: 105.0,
          height: 105.0,
          fit: BoxFit.cover,
        ),
      );
    } else if (_savedPhotoUrl != null && _savedPhotoUrl!.isNotEmpty) {
      if (_savedPhotoUrl!.startsWith('data:image')) {
        try {
          final base64Part = _savedPhotoUrl!.split(',').last;
          final decoded = base64Decode(base64Part);
          avatarContent = ClipOval(
            child: Image.memory(
              decoded,
              width: 105.0,
              height: 105.0,
              fit: BoxFit.cover,
            ),
          );
        } catch (_) {
          avatarContent = const Icon(
            Icons.person_rounded,
            size: 64.0,
            color: Color(0xFF2563EB),
          );
        }
      } else {
        avatarContent = const Icon(
          Icons.person_rounded,
          size: 64.0,
          color: Color(0xFF2563EB),
        );
      }
    } else {
      avatarContent = const Icon(
        Icons.person_rounded,
        size: 64.0,
        color: Color(0xFF2563EB),
      );
    }

    return Column(
      children: [
        // Circular Avatar Stack with Blue Camera Badge
        GestureDetector(
          onTap: () => _showPhotoOptionsBottomSheet(context),
          child: Stack(
            children: [
              Container(
                width: 105.0,
                height: 105.0,
                decoration: BoxDecoration(
                  color: const Color(0xFFE0F2FE),
                  shape: BoxShape.circle,
                  border: Border.all(color: const Color(0xFFBAE6FD), width: 3.0),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.04),
                      blurRadius: 10.0,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Center(child: avatarContent),
              ),
              Positioned(
                bottom: 2.0,
                right: 2.0,
                child: Container(
                  padding: const EdgeInsets.all(7.0),
                  decoration: BoxDecoration(
                    color: const Color(0xFF0284C7),
                    shape: BoxShape.circle,
                    border: Border.all(color: Colors.white, width: 2.5),
                  ),
                  child: const Icon(
                    Icons.camera_alt_rounded,
                    color: Colors.white,
                    size: 15.0,
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12.0),

        // Add Photo Pill Badge ("📷 ફોટો ઉમેરો")
        InkWell(
          key: const Key('add_photo_badge'),
          onTap: () => _showPhotoOptionsBottomSheet(context),
          borderRadius: BorderRadius.circular(20.0),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 7.0),
            decoration: BoxDecoration(
              color: const Color(0xFFE0F2FE),
              borderRadius: BorderRadius.circular(20.0),
              border: Border.all(color: const Color(0xFFBAE6FD)),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(
                  Icons.camera_alt_outlined,
                  size: 16.0,
                  color: Color(0xFF0369A1),
                ),
                const SizedBox(width: 6.0),
                Text(
                  strings.addPhotoAction,
                  style: const TextStyle(
                    fontSize: 13.0,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF0369A1),
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 10.0),

        // "અથવા" (or) Divider Line
        SizedBox(
          width: 180.0,
          child: Row(
            children: [
              const Expanded(child: Divider(color: Color(0xFFCBD5E1), thickness: 1.0)),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 8.0),
                child: Text(
                  strings.orDivider,
                  style: const TextStyle(
                    fontSize: 12.0,
                    color: Color(0xFF64748B),
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              const Expanded(child: Divider(color: Color(0xFFCBD5E1), thickness: 1.0)),
            ],
          ),
        ),
        const SizedBox(height: 10.0),

        // Change Photo Pill Button ("🔄 ફોટો બદલો")
        InkWell(
          key: const Key('change_photo_button'),
          onTap: () => _showPhotoOptionsBottomSheet(context),
          borderRadius: BorderRadius.circular(20.0),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 18.0, vertical: 8.0),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20.0),
              border: Border.all(color: const Color(0xFF0284C7), width: 1.4),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(
                  Icons.sync_rounded,
                  size: 16.0,
                  color: Color(0xFF0284C7),
                ),
                const SizedBox(width: 6.0),
                Text(
                  strings.changePhotoAction,
                  style: const TextStyle(
                    fontSize: 13.5,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF0284C7),
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  // ---------------------------------------------------------------------------
  // Field Container Helpers
  // ---------------------------------------------------------------------------

  Widget _buildFieldContainer({
    required IconData icon,
    required String label,
    required Widget child,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(
              icon,
              size: 18.0,
              color: const Color(0xFFEA580C),
            ),
            const SizedBox(width: 8.0),
            Text(
              label,
              style: const TextStyle(
                fontSize: 14.0,
                fontWeight: FontWeight.w700,
                color: AppColors.textNavy,
              ),
            ),
          ],
        ),
        const SizedBox(height: 6.0),
        child,
      ],
    );
  }

  InputDecoration _buildInputDecoration(String hint) {
    return InputDecoration(
      hintText: hint,
      hintStyle: const TextStyle(
        color: Color(0xFF94A3B8),
        fontSize: 14.0,
      ),
      filled: true,
      fillColor: Colors.white,
      contentPadding: const EdgeInsets.symmetric(horizontal: 14.0, vertical: 14.0),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12.0),
        borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12.0),
        borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12.0),
        borderSide: const BorderSide(color: Color(0xFFEA580C), width: 1.5),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12.0),
        borderSide: const BorderSide(color: Color(0xFFEF4444)),
      ),
      focusedErrorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12.0),
        borderSide: const BorderSide(color: Color(0xFFEF4444), width: 1.5),
      ),
    );
  }
}
