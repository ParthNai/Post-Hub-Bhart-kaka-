import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:panchayat_post/core/constants/app_assets.dart';
import 'package:panchayat_post/core/localization/app_localizations.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';
import 'package:panchayat_post/features/auth/data/auth_service.dart';
import 'package:panchayat_post/features/auth/domain/models/user_profile.dart';
import 'package:panchayat_post/features/splash/presentation/widgets/brand_logo_widget.dart';

// ─── Design tokens ───────────────────────────────────────────────────────────
const _kBg = Color(0xFFFAF9FC);
const _kSurface = Color(0xFFFFFFFF);
const _kPrimary = Color(0xFF7654C8);
const _kPrimaryLight = Color(0xFFEEE8FA);
const _kTextPrimary = Color(0xFF252238);
const _kTextSecondary = Color(0xFF858194);
const _kBorder = Color(0xFFECEAF0);
const _kGreen = Color(0xFF16A34A);
const _kGreenLight = Color(0xFFD1FAE5);
const _kRed = Color(0xFFEF4444);
// ─────────────────────────────────────────────────────────────────────────────

/// Screen 15: User Profile & Account Management
/// Pixel-perfect recreation of approved reference image media_1795420340043_63766ac5.jpg
class ProfileScreen extends StatefulWidget {
  const ProfileScreen({
    super.key,
    this.authService,
  });

  final AuthService? authService;

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  late AuthService _authService;

  UserProfile? _currentUser;
  bool _isLoading = true;
  bool _notificationsEnabled = true;

  @override
  void initState() {
    super.initState();
    _authService = widget.authService ?? AuthService();
    _loadProfile();
    _loadNotificationPref();
  }

  Future<void> _loadProfile() async {
    setState(() => _isLoading = true);
    final user = await _authService.getCurrentUser();
    if (mounted) {
      setState(() {
        _currentUser = user;
        _isLoading = false;
      });
    }
  }

  Future<void> _loadNotificationPref() async {
    final prefs = await SharedPreferences.getInstance();
    if (mounted) {
      setState(() {
        _notificationsEnabled = prefs.getBool('notifications_enabled') ?? true;
      });
    }
  }

  Future<void> _toggleNotifications(bool value) async {
    setState(() => _notificationsEnabled = value);
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('notifications_enabled', value);
  }

  Future<void> _openEditProfile() async {
    final result = await Navigator.of(context).push<bool>(
      MaterialPageRoute(
        builder: (_) => _EditProfileSheet(
          user: _currentUser,
          authService: _authService,
        ),
        fullscreenDialog: true,
      ),
    );
    if (result == true) {
      await _loadProfile();
    }
  }

  Future<void> _confirmLogout(AppStrings s) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20.0)),
        title: Text(
          s.logoutConfirmTitle,
          key: const ValueKey('logout_dialog_title'),
          style: const TextStyle(
            fontSize: 17.0,
            fontWeight: FontWeight.w800,
            color: _kTextPrimary,
          ),
        ),
        content: Text(
          s.logoutConfirmMessage,
          style: const TextStyle(fontSize: 13.5, color: _kTextSecondary, height: 1.4),
        ),
        actions: [
          TextButton(
            key: const ValueKey('logout_cancel_btn'),
            onPressed: () => Navigator.of(ctx).pop(false),
            child: Text(s.cancelAction, style: const TextStyle(color: _kTextSecondary)),
          ),
          ElevatedButton(
            key: const ValueKey('logout_confirm_btn'),
            style: ElevatedButton.styleFrom(
              backgroundColor: _kRed,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10.0)),
            ),
            onPressed: () => Navigator.of(ctx).pop(true),
            child: Text(s.logoutAction),
          ),
        ],
      ),
    );

    if (confirmed == true && mounted) {
      try {
        await _authService.sessionService.clearSession();
        if (mounted) {
          Navigator.of(context).pushNamedAndRemoveUntil(
            AppRoutes.welcome,
            (route) => false,
          );
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Logout failed. Please try again.'),
              backgroundColor: _kRed,
            ),
          );
        }
      }
    }
  }

  void _onNavTapped(int index, AppStrings s) {
    if (index == 4) return; // already on Profile
    if (index == 0) {
      Navigator.of(context).pushReplacementNamed(AppRoutes.home);
    } else if (index == 1) {
      Navigator.of(context).pushReplacementNamed(AppRoutes.festivals);
    } else if (index == 2) {
      Navigator.of(context).pushReplacementNamed(AppRoutes.festivals);
    } else if (index == 3) {
      Navigator.of(context).pushReplacementNamed(AppRoutes.myDesigns);
    }
  }

  @override
  Widget build(BuildContext context) {
    final locale = LocaleScope.of(context);
    final s = locale.strings;

    return Scaffold(
      backgroundColor: _kBg,
      body: SafeArea(
        child: Column(
          children: [
            _buildHeader(s),
            Expanded(
              child: _isLoading
                  ? const Center(child: CircularProgressIndicator(color: _kPrimary))
                  : SingleChildScrollView(
                      physics: const BouncingScrollPhysics(),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const SizedBox(height: 14.0),
                          _buildProfileOverviewCard(s, locale),
                          const SizedBox(height: 14.0),
                          _buildPersonalInfoSection(s),
                          const SizedBox(height: 14.0),
                          _buildPreferencesSection(s, locale),
                          const SizedBox(height: 14.0),
                          _buildAccountSupportSection(s),
                          const SizedBox(height: 14.0),
                          _buildLogoutButton(s),
                          const SizedBox(height: 20.0),
                        ],
                      ),
                    ),
            ),
            _buildBottomNavBar(s),
          ],
        ),
      ),
    );
  }

  // ── 1. Top Header ──────────────────────────────────────────────────────────
  Widget _buildHeader(AppStrings s) {
    return Container(
      key: const ValueKey('profile_header'),
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 10.0),
      color: _kSurface,
      child: Row(
        children: [
          // Logo box
          Container(
            width: 44.0,
            height: 44.0,
            padding: const EdgeInsets.all(5.0),
            decoration: BoxDecoration(
              color: _kSurface,
              borderRadius: BorderRadius.circular(12.0),
              border: Border.all(color: _kBorder),
              boxShadow: [
                BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 6, offset: const Offset(0, 2)),
              ],
            ),
            child: const BrandLogoWidget(
              height: 30.0,
            ),
          ),
          const SizedBox(width: 10.0),

          // Title + subtitle
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  s.profileTitle,
                  key: const ValueKey('profile_page_title'),
                  style: const TextStyle(
                    fontSize: 18.0,
                    fontWeight: FontWeight.w800,
                    color: _kTextPrimary,
                  ),
                ),
                Text(
                  s.profileSubtitle,
                  key: const ValueKey('profile_page_subtitle'),
                  style: const TextStyle(fontSize: 11.5, color: _kTextSecondary),
                ),
              ],
            ),
          ),

          // Settings gear
          InkWell(
            key: const ValueKey('profile_settings_btn'),
            borderRadius: BorderRadius.circular(10.0),
            onTap: () => Navigator.of(context).pushNamed(AppRoutes.settings),
            child: Container(
              padding: const EdgeInsets.all(8.0),
              decoration: BoxDecoration(
                color: _kPrimaryLight,
                borderRadius: BorderRadius.circular(10.0),
              ),
              child: const Icon(Icons.settings_outlined, color: _kPrimary, size: 20.0),
            ),
          ),
        ],
      ),
    );
  }

  // ── 2. Profile Overview Card ───────────────────────────────────────────────
  Widget _buildProfileOverviewCard(AppStrings s, LocaleController locale) {
    final name = _currentUser?.effectiveDisplayName ?? 'Guest User';
    final mobile = '+91 98765 43210'; // placeholder; real users add it in profile
    final email = _currentUser?.username != null ? '${_currentUser!.username}@panchayatpost.in' : '—';

    return Container(
      key: const ValueKey('profile_overview_card'),
      margin: const EdgeInsets.symmetric(horizontal: 16.0),
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFFF3EDFF), Color(0xFFEEE8FA)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20.0),
        border: Border.all(color: _kBorder),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Avatar + camera icon
          Stack(
            children: [
              Container(
                width: 72.0,
                height: 72.0,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(color: _kPrimary, width: 2.5),
                  color: _kPrimaryLight,
                ),
                child: ClipOval(
                  child: _currentUser?.profilePhotoUrl != null
                      ? Image.network(
                          _currentUser!.profilePhotoUrl!,
                          fit: BoxFit.cover,
                          errorBuilder: (_, _, _) => _DefaultAvatar(name: name),
                        )
                      : _DefaultAvatar(name: name),
                ),
              ),
              Positioned(
                bottom: 0,
                right: 0,
                child: GestureDetector(
                  onTap: _openEditProfile,
                  child: Container(
                    width: 22.0,
                    height: 22.0,
                    decoration: const BoxDecoration(shape: BoxShape.circle, color: _kPrimary),
                    child: const Icon(Icons.camera_alt_rounded, color: Colors.white, size: 12.0),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(width: 14.0),

          // Name + verified badge + contact
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  key: const ValueKey('profile_user_name'),
                  style: const TextStyle(
                    fontSize: 17.0,
                    fontWeight: FontWeight.w800,
                    color: _kTextPrimary,
                  ),
                ),
                const SizedBox(height: 4.0),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 2.0),
                  decoration: BoxDecoration(
                    color: _kGreenLight,
                    borderRadius: BorderRadius.circular(20.0),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.check_circle_rounded, color: _kGreen, size: 12.0),
                      const SizedBox(width: 4.0),
                      Text(
                        s.verifiedAccountBadge,
                        style: const TextStyle(fontSize: 10.5, fontWeight: FontWeight.w700, color: _kGreen),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 8.0),
                Row(
                  children: [
                    const Icon(Icons.phone_rounded, size: 12.0, color: _kTextSecondary),
                    const SizedBox(width: 5.0),
                    Text(mobile, style: const TextStyle(fontSize: 11.5, color: _kTextPrimary, fontWeight: FontWeight.w500)),
                  ],
                ),
                const SizedBox(height: 2.0),
                Row(
                  children: [
                    const Icon(Icons.email_outlined, size: 12.0, color: _kTextSecondary),
                    const SizedBox(width: 5.0),
                    Flexible(
                      child: Text(
                        email,
                        style: const TextStyle(fontSize: 11.5, color: _kTextPrimary, fontWeight: FontWeight.w500),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(width: 10.0),

          // Edit Profile button
          GestureDetector(
            onTap: _openEditProfile,
            child: Container(
              key: const ValueKey('edit_profile_btn'),
              padding: const EdgeInsets.symmetric(horizontal: 12.0, vertical: 8.0),
              decoration: BoxDecoration(
                color: _kPrimary,
                borderRadius: BorderRadius.circular(20.0),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.edit_rounded, color: Colors.white, size: 13.0),
                  const SizedBox(width: 5.0),
                  Text(
                    s.editProfileButton,
                    style: const TextStyle(color: Colors.white, fontSize: 12.0, fontWeight: FontWeight.w700),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ── 3. Personal Information Section ───────────────────────────────────────
  Widget _buildPersonalInfoSection(AppStrings s) {
    final name = _currentUser?.effectiveDisplayName ?? '—';
    final mobile = '+91 98765 43210';
    final email = _currentUser?.username != null ? '${_currentUser!.username}@panchayatpost.in' : '—';
    final village = _currentUser?.villageCity ?? '—';
    final district = _currentUser?.state ?? '—';

    return _SectionCard(
      key: const ValueKey('personal_info_section'),
      title: s.personalInfoTitle,
      children: [
        _InfoRow(icon: Icons.person_outline_rounded, label: s.fullNameLabel, value: name),
        _InfoRow(icon: Icons.phone_outlined, label: s.mobileNumberLabel, value: mobile),
        _InfoRow(icon: Icons.email_outlined, label: s.emailAddressLabel, value: email),
        _InfoRow(icon: Icons.location_on_outlined, label: s.villageCityLabel, value: village),
        _InfoRow(icon: Icons.account_balance_outlined, label: s.districtLabel, value: district, isLast: true),
      ],
    );
  }

  // ── 4. Preferences Section ─────────────────────────────────────────────────
  Widget _buildPreferencesSection(AppStrings s, LocaleController locale) {
    return _SectionCard(
      key: const ValueKey('preferences_section'),
      title: s.preferencesTitle,
      children: [
        // App Language
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(7.0),
                decoration: BoxDecoration(color: _kPrimaryLight, borderRadius: BorderRadius.circular(8.0)),
                child: const Icon(Icons.language_rounded, color: _kPrimary, size: 18.0),
              ),
              const SizedBox(width: 12.0),
              Expanded(
                child: Text(s.appLanguageLabel,
                    style: const TextStyle(fontSize: 13.5, fontWeight: FontWeight.w600, color: _kTextPrimary)),
              ),
              // Language chips
              Row(
                children: [
                  _LangChip(
                    label: 'Gujarati',
                    code: 'gu',
                    isSelected: locale.currentLanguageCode == 'gu',
                    onTap: () => locale.setLanguage('gu'),
                  ),
                  const SizedBox(width: 6.0),
                  _LangChip(
                    label: 'English',
                    code: 'en',
                    isSelected: locale.currentLanguageCode == 'en',
                    onTap: () => locale.setLanguage('en'),
                  ),
                  const SizedBox(width: 6.0),
                  _LangChip(
                    label: 'Hindi',
                    code: 'hi',
                    isSelected: locale.currentLanguageCode == 'hi',
                    onTap: () => locale.setLanguage('hi'),
                  ),
                ],
              ),
            ],
          ),
        ),
        const Divider(height: 1, color: _kBorder),

        // Notification Preferences
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(7.0),
                decoration: BoxDecoration(color: _kPrimaryLight, borderRadius: BorderRadius.circular(8.0)),
                child: const Icon(Icons.notifications_outlined, color: _kPrimary, size: 18.0),
              ),
              const SizedBox(width: 12.0),
              Expanded(
                child: Text(s.notificationPrefLabel,
                    style: const TextStyle(fontSize: 13.5, fontWeight: FontWeight.w600, color: _kTextPrimary)),
              ),
              Switch(
                key: const ValueKey('notifications_switch'),
                value: _notificationsEnabled,
                activeThumbColor: Colors.white,
                activeTrackColor: _kPrimary,
                onChanged: _toggleNotifications,
              ),
            ],
          ),
        ),
        const Divider(height: 1, color: _kBorder),

        // Theme Preference
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(7.0),
                decoration: BoxDecoration(color: _kPrimaryLight, borderRadius: BorderRadius.circular(8.0)),
                child: const Icon(Icons.palette_outlined, color: _kPrimary, size: 18.0),
              ),
              const SizedBox(width: 12.0),
              Expanded(
                child: Text(s.themePrefLabel,
                    style: const TextStyle(fontSize: 13.5, fontWeight: FontWeight.w600, color: _kTextPrimary)),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 6.0),
                decoration: BoxDecoration(
                  color: _kPrimaryLight,
                  borderRadius: BorderRadius.circular(20.0),
                  border: Border.all(color: _kBorder),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.wb_sunny_outlined, color: _kPrimary, size: 14.0),
                    const SizedBox(width: 5.0),
                    Text(s.lightThemeOption,
                        style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.w700, color: _kPrimary)),
                    const SizedBox(width: 3.0),
                    const Icon(Icons.keyboard_arrow_down_rounded, color: _kPrimary, size: 14.0),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  // ── 5. Account & Support Section ───────────────────────────────────────────
  Widget _buildAccountSupportSection(AppStrings s) {
    return _SectionCard(
      key: const ValueKey('account_support_section'),
      title: s.accountSupportTitle,
      children: [
        _SupportRow(
          key: const ValueKey('account_security_row'),
          icon: Icons.shield_outlined,
          label: s.accountSecurityLabel,
          onTap: _showAccountSecuritySheet,
        ),
        _SupportRow(
          key: const ValueKey('help_support_row'),
          icon: Icons.headset_mic_outlined,
          label: s.helpSupportLabel,
          onTap: _showHelpSupportSheet,
        ),
        _SupportRow(
          key: const ValueKey('about_panchayat_row'),
          icon: Icons.info_outline_rounded,
          label: s.aboutPanchayatPostLabel,
          onTap: _showAboutSheet,
        ),
        _SupportRow(
          key: const ValueKey('privacy_policy_row'),
          icon: Icons.verified_user_outlined,
          label: s.privacyPolicyLabel,
          onTap: _showPrivacySheet,
        ),
        _SupportRow(
          key: const ValueKey('terms_conditions_row'),
          icon: Icons.description_outlined,
          label: s.termsConditionsLabel,
          onTap: _showTermsSheet,
          isLast: true,
        ),
      ],
    );
  }

  // ── 6. Logout Button ────────────────────────────────────────────────────────
  Widget _buildLogoutButton(AppStrings s) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: GestureDetector(
        key: const ValueKey('logout_btn'),
        onTap: () => _confirmLogout(s),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 14.0),
          decoration: BoxDecoration(
            color: const Color(0xFFFFF1F1),
            borderRadius: BorderRadius.circular(16.0),
            border: Border.all(color: const Color(0xFFFFCDD2)),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.logout_rounded, color: _kRed, size: 20.0),
              const SizedBox(width: 10.0),
              Text(
                s.logoutAction,
                style: const TextStyle(fontSize: 15.0, fontWeight: FontWeight.w700, color: _kRed),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ── 7. Bottom Navigation Bar ────────────────────────────────────────────────
  Widget _buildBottomNavBar(AppStrings s) {
    return Container(
      decoration: BoxDecoration(
        color: _kSurface,
        border: const Border(top: BorderSide(color: _kBorder, width: 0.8)),
        boxShadow: [
          BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 10, offset: const Offset(0, -3)),
        ],
      ),
      child: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 6.0),
          child: Row(
            children: [
              _NavItem(key: const ValueKey('nav_home'), icon: Icons.home_outlined, activeIcon: Icons.home_rounded, label: s.navHome, isActive: false, onTap: () => _onNavTapped(0, s)),
              _NavItem(key: const ValueKey('nav_festivals'), icon: Icons.calendar_month_outlined, activeIcon: Icons.calendar_month_rounded, label: s.navFestivals, isActive: false, onTap: () => _onNavTapped(1, s)),
              _NavItem(key: const ValueKey('nav_templates'), icon: Icons.layers_outlined, activeIcon: Icons.layers_rounded, label: s.navTemplates, isActive: false, onTap: () => _onNavTapped(2, s)),
              _NavItem(key: const ValueKey('nav_my_designs'), icon: Icons.photo_library_outlined, activeIcon: Icons.photo_library_rounded, label: s.navMyDesigns, isActive: false, onTap: () => _onNavTapped(3, s)),
              _NavItem(key: const ValueKey('nav_profile'), icon: Icons.person_outline_rounded, activeIcon: Icons.person_rounded, label: s.navProfile, isActive: true, onTap: () {}),
            ],
          ),
        ),
      ),
    );
  }

  // ── Support Sheet Helpers ──────────────────────────────────────────────────
  void _showAccountSecuritySheet() {
    _showInfoSheet(
      title: 'Account Security',
      icon: Icons.shield_outlined,
      content: 'Your account is protected with a secure password. To change your password, log out and use the "Forgot Password" option on the login screen.',
    );
  }

  void _showHelpSupportSheet() {
    _showInfoSheet(
      title: 'Help & Support',
      icon: Icons.headset_mic_outlined,
      content: 'For assistance, contact us at support@panchayatpost.in or visit our website. Our support team is available Monday to Friday, 9 AM – 6 PM IST.',
    );
  }

  void _showAboutSheet() {
    _showInfoSheet(
      title: 'About Panchayat Post',
      icon: Icons.info_outline_rounded,
      content: 'Panchayat Post v1.0.0\n\nA platform for village communities to create and share beautiful festival and government posters.\n\nBuilt with ❤️ for Bharat.',
    );
  }

  void _showPrivacySheet() {
    _showInfoSheet(
      title: 'Privacy Policy',
      icon: Icons.verified_user_outlined,
      content: 'We respect your privacy. Personal information is stored locally on your device and is not shared with any third parties without your explicit consent.',
    );
  }

  void _showTermsSheet() {
    _showInfoSheet(
      title: 'Terms & Conditions',
      icon: Icons.description_outlined,
      content: 'By using Panchayat Post, you agree to use the app for lawful purposes only. All poster designs created remain the intellectual property of their creators.',
    );
  }

  void _showInfoSheet({required String title, required IconData icon, required String content}) {
    showModalBottomSheet(
      context: context,
      backgroundColor: _kSurface,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24.0))),
      builder: (ctx) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(10.0),
                    decoration: BoxDecoration(color: _kPrimaryLight, borderRadius: BorderRadius.circular(12.0)),
                    child: Icon(icon, color: _kPrimary, size: 22.0),
                  ),
                  const SizedBox(width: 12.0),
                  Text(title, style: const TextStyle(fontSize: 17.0, fontWeight: FontWeight.w800, color: _kTextPrimary)),
                ],
              ),
              const SizedBox(height: 16.0),
              Text(content, style: const TextStyle(fontSize: 13.5, color: _kTextSecondary, height: 1.5)),
              const SizedBox(height: 16.0),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: _kPrimary,
                  foregroundColor: Colors.white,
                  minimumSize: const Size(double.infinity, 44.0),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.0)),
                ),
                onPressed: () => Navigator.of(ctx).pop(),
                child: const Text('Close'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ── Edit Profile Full-screen Dialog ────────────────────────────────────────
class _EditProfileSheet extends StatefulWidget {
  const _EditProfileSheet({required this.user, required this.authService});
  final UserProfile? user;
  final AuthService authService;

  @override
  State<_EditProfileSheet> createState() => _EditProfileSheetState();
}

class _EditProfileSheetState extends State<_EditProfileSheet> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _nameCtrl;
  late TextEditingController _villageCityCtrl;
  late TextEditingController _districtCtrl;
  bool _isSaving = false;

  @override
  void initState() {
    super.initState();
    _nameCtrl = TextEditingController(text: widget.user?.fullName ?? '');
    _villageCityCtrl = TextEditingController(text: widget.user?.villageCity ?? '');
    _districtCtrl = TextEditingController(text: widget.user?.state ?? '');
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    _villageCityCtrl.dispose();
    _districtCtrl.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    if (widget.user == null) return;

    setState(() => _isSaving = true);
    try {
      await widget.authService.updateUserProfile(
        userId: widget.user!.userId,
        fullName: _nameCtrl.text.trim(),
        villageCity: _villageCityCtrl.text.trim().isEmpty ? null : _villageCityCtrl.text.trim(),
        state: _districtCtrl.text.trim().isEmpty ? null : _districtCtrl.text.trim(),
      );
      if (mounted) {
        Navigator.of(context).pop(true);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Profile updated successfully!'), backgroundColor: _kGreen),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Update failed: $e'), backgroundColor: _kRed),
        );
      }
    } finally {
      if (mounted) setState(() => _isSaving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _kBg,
      appBar: AppBar(
        backgroundColor: _kSurface,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded, color: _kTextPrimary),
          onPressed: () => Navigator.of(context).pop(false),
        ),
        title: const Text(
          'Edit Profile',
          style: TextStyle(fontSize: 18.0, fontWeight: FontWeight.w800, color: _kTextPrimary),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 8.0),
            child: TextButton.icon(
              key: const ValueKey('save_profile_btn'),
              style: TextButton.styleFrom(
                foregroundColor: _kPrimary,
                padding: const EdgeInsets.symmetric(horizontal: 12.0),
              ),
              icon: _isSaving
                  ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2, color: _kPrimary))
                  : const Icon(Icons.check_rounded, size: 18.0),
              label: const Text('Save', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14.0)),
              onPressed: _isSaving ? null : _save,
            ),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 16.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              // Avatar circle with camera edit badge
              Center(
                child: Stack(
                  children: [
                    Container(
                      width: 88.0,
                      height: 88.0,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(color: _kPrimaryLight, width: 3.0),
                        boxShadow: [
                          BoxShadow(color: Colors.black.withValues(alpha: 0.08), blurRadius: 10, offset: const Offset(0, 4)),
                        ],
                      ),
                      child: ClipOval(
                        child: widget.user?.profilePhotoUrl != null
                            ? Image.network(
                                widget.user!.profilePhotoUrl!,
                                fit: BoxFit.cover,
                                errorBuilder: (_, _, _) => _DefaultAvatar(name: _nameCtrl.text),
                              )
                            : Image.asset(
                                AppAssets.homeAvatarRahul,
                                fit: BoxFit.cover,
                                errorBuilder: (_, _, _) => _DefaultAvatar(name: _nameCtrl.text),
                              ),
                      ),
                    ),
                    Positioned(
                      bottom: 0,
                      right: 0,
                      child: Container(
                        padding: const EdgeInsets.all(6.0),
                        decoration: BoxDecoration(
                          color: _kPrimary,
                          shape: BoxShape.circle,
                          border: Border.all(color: Colors.white, width: 2.0),
                        ),
                        child: const Icon(Icons.camera_alt_rounded, size: 15.0, color: Colors.white),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24.0),

              _buildField(
                controller: _nameCtrl,
                label: 'Full Name',
                icon: Icons.person_outline_rounded,
                validator: (v) => (v == null || v.trim().isEmpty) ? 'Full name is required' : null,
              ),
              const SizedBox(height: 16.0),
              _buildField(
                controller: _villageCityCtrl,
                label: 'Village / City',
                icon: Icons.location_on_outlined,
              ),
              const SizedBox(height: 16.0),
              _buildField(
                controller: _districtCtrl,
                label: 'District',
                icon: Icons.account_balance_outlined,
              ),
              const SizedBox(height: 32.0),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: _kPrimary,
                  foregroundColor: Colors.white,
                  minimumSize: const Size(double.infinity, 50.0),
                  elevation: 2.0,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14.0)),
                ),
                onPressed: _isSaving ? null : _save,
                child: Text(
                  _isSaving ? 'Saving…' : 'Save Changes',
                  style: const TextStyle(fontSize: 15.0, fontWeight: FontWeight.w700),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    String? Function(String?)? validator,
  }) {
    return TextFormField(
      controller: controller,
      validator: validator,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Icon(icon, color: _kPrimary, size: 20.0),
        filled: true,
        fillColor: _kSurface,
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12.0), borderSide: const BorderSide(color: _kBorder)),
        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12.0), borderSide: const BorderSide(color: _kBorder)),
        focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(12.0), borderSide: const BorderSide(color: _kPrimary, width: 1.5)),
      ),
    );
  }
}

// ── Reusable Widgets ───────────────────────────────────────────────────────

class _DefaultAvatar extends StatelessWidget {
  const _DefaultAvatar({required this.name});
  final String name;

  @override
  Widget build(BuildContext context) {
    final initials = name.trim().split(' ').where((p) => p.isNotEmpty).map((p) => p[0].toUpperCase()).take(2).join();
    return Container(
      color: _kPrimaryLight,
      child: Center(
        child: Text(
          initials.isEmpty ? '?' : initials,
          style: const TextStyle(fontSize: 24.0, fontWeight: FontWeight.w800, color: _kPrimary),
        ),
      ),
    );
  }
}

class _SectionCard extends StatelessWidget {
  const _SectionCard({super.key, required this.title, required this.children});
  final String title;
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Container(
        decoration: BoxDecoration(
          color: _kSurface,
          borderRadius: BorderRadius.circular(16.0),
          border: Border.all(color: _kBorder),
          boxShadow: [
            BoxShadow(color: Colors.black.withValues(alpha: 0.03), blurRadius: 8, offset: const Offset(0, 2)),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(16.0, 14.0, 16.0, 10.0),
              child: Row(
                children: [
                  Container(width: 3.5, height: 18.0, decoration: BoxDecoration(color: _kPrimary, borderRadius: BorderRadius.circular(2.0))),
                  const SizedBox(width: 10.0),
                  Text(title, style: const TextStyle(fontSize: 15.0, fontWeight: FontWeight.w800, color: _kTextPrimary)),
                ],
              ),
            ),
            const Divider(height: 1, color: _kBorder),
            ...children,
          ],
        ),
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  const _InfoRow({required this.icon, required this.label, required this.value, this.isLast = false});
  final IconData icon;
  final String label;
  final String value;
  final bool isLast;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(7.0),
                decoration: BoxDecoration(color: _kPrimaryLight, borderRadius: BorderRadius.circular(8.0)),
                child: Icon(icon, color: _kPrimary, size: 16.0),
              ),
              const SizedBox(width: 12.0),
              Expanded(
                child: Text(label, style: const TextStyle(fontSize: 13.0, fontWeight: FontWeight.w500, color: _kTextSecondary)),
              ),
              Flexible(
                child: Text(
                  value,
                  style: const TextStyle(fontSize: 13.0, fontWeight: FontWeight.w700, color: _kTextPrimary),
                  textAlign: TextAlign.end,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
        ),
        if (!isLast) const Divider(height: 1, indent: 16.0, color: _kBorder),
      ],
    );
  }
}

class _SupportRow extends StatelessWidget {
  const _SupportRow({super.key, required this.icon, required this.label, required this.onTap, this.isLast = false});
  final IconData icon;
  final String label;
  final VoidCallback onTap;
  final bool isLast;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        InkWell(
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(7.0),
                  decoration: BoxDecoration(color: _kPrimaryLight, borderRadius: BorderRadius.circular(8.0)),
                  child: Icon(icon, color: _kPrimary, size: 16.0),
                ),
                const SizedBox(width: 12.0),
                Expanded(child: Text(label, style: const TextStyle(fontSize: 13.5, fontWeight: FontWeight.w600, color: _kTextPrimary))),
                const Icon(Icons.chevron_right_rounded, color: _kTextSecondary, size: 20.0),
              ],
            ),
          ),
        ),
        if (!isLast) const Divider(height: 1, indent: 16.0, color: _kBorder),
      ],
    );
  }
}

class _LangChip extends StatelessWidget {
  const _LangChip({required this.label, required this.code, required this.isSelected, required this.onTap});
  final String label;
  final String code;
  final bool isSelected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      key: ValueKey('lang_chip_$code'),
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 5.0),
        decoration: BoxDecoration(
          color: isSelected ? _kPrimary : _kSurface,
          borderRadius: BorderRadius.circular(20.0),
          border: Border.all(color: isSelected ? _kPrimary : _kBorder),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 11.0,
            fontWeight: FontWeight.w700,
            color: isSelected ? Colors.white : _kTextSecondary,
          ),
        ),
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  const _NavItem({super.key, required this.icon, required this.activeIcon, required this.label, required this.isActive, required this.onTap});
  final IconData icon;
  final IconData activeIcon;
  final String label;
  final bool isActive;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12.0),
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 4.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              isActive
                  ? Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14.0, vertical: 5.0),
                      decoration: BoxDecoration(color: _kPrimaryLight, borderRadius: BorderRadius.circular(20.0)),
                      child: Icon(activeIcon, size: 20.0, color: _kPrimary),
                    )
                  : Icon(icon, size: 22.0, color: const Color(0xFF64748B)),
              const SizedBox(height: 2.0),
              Text(
                label,
                style: TextStyle(
                  fontSize: 10.0,
                  fontWeight: isActive ? FontWeight.w700 : FontWeight.w500,
                  color: isActive ? _kPrimary : const Color(0xFF64748B),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
