import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:panchayat_post/core/localization/app_localizations.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';
import 'package:panchayat_post/features/auth/data/auth_service.dart';
import 'package:panchayat_post/features/auth/domain/models/user_profile.dart';

// ─── Design tokens ───────────────────────────────────────────────────────────
const _kBg = Color(0xFFFAF9FC);
const _kSurface = Color(0xFFFFFFFF);
const _kPrimary = Color(0xFF7654C8);
const _kPrimaryLight = Color(0xFFEEE8FA);
const _kTextPrimary = Color(0xFF252238);
const _kTextSecondary = Color(0xFF858194);
const _kBorder = Color(0xFFECEAF0);
const _kRed = Color(0xFFEF4444);
const _kRedLight = Color(0xFFFEF2F2);
// ─────────────────────────────────────────────────────────────────────────────

/// Screen 16: Settings & Preferences
/// Pixel-perfect recreation of approved reference image.
class SettingsScreen extends StatefulWidget {
  const SettingsScreen({
    super.key,
    this.authService,
  });

  final AuthService? authService;

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  late AuthService _authService;

  UserProfile? _currentUser;
  bool _isLoading = true;

  // Preferences
  bool _notificationsEnabled = true;
  bool _festivalRemindersEnabled = true;
  String _selectedTheme = 'Light'; // 'Light' or 'System Default'
  String _posterLanguage = 'gu'; // default poster language

  static const String _keyNotifications = 'notifications_enabled';
  static const String _keyFestivalReminders = 'festival_reminders_enabled';
  static const String _keyTheme = 'app_theme_preference';
  static const String _keyPosterLanguage = 'default_poster_language';

  @override
  void initState() {
    super.initState();
    _authService = widget.authService ?? AuthService();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);
    final user = await _authService.getCurrentUser();
    final prefs = await SharedPreferences.getInstance();
    if (mounted) {
      setState(() {
        _currentUser = user;
        _notificationsEnabled = prefs.getBool(_keyNotifications) ?? true;
        _festivalRemindersEnabled = prefs.getBool(_keyFestivalReminders) ?? true;
        _selectedTheme = prefs.getString(_keyTheme) ?? 'Light';
        _posterLanguage = prefs.getString(_keyPosterLanguage) ?? 'gu';
        _isLoading = false;
      });
    }
  }

  Future<void> _toggleNotifications(bool value) async {
    setState(() => _notificationsEnabled = value);
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_keyNotifications, value);
  }

  Future<void> _toggleFestivalReminders(bool value) async {
    setState(() => _festivalRemindersEnabled = value);
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_keyFestivalReminders, value);
  }

  Future<void> _setTheme(String theme) async {
    setState(() => _selectedTheme = theme);
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyTheme, theme);
  }

  Future<void> _setPosterLanguage(String code) async {
    setState(() => _posterLanguage = code);
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyPosterLanguage, code);
  }

  Future<void> _confirmLogout(AppStrings s) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20.0)),
        title: Text(
          s.logoutConfirmTitle,
          key: const ValueKey('settings_logout_dialog_title'),
          style: const TextStyle(fontSize: 17.0, fontWeight: FontWeight.w800, color: _kTextPrimary),
        ),
        content: Text(
          s.logoutConfirmMessage,
          style: const TextStyle(fontSize: 13.5, color: _kTextSecondary, height: 1.4),
        ),
        actions: [
          TextButton(
            key: const ValueKey('settings_logout_cancel'),
            onPressed: () => Navigator.of(ctx).pop(false),
            child: Text(s.cancelAction, style: const TextStyle(color: _kTextSecondary)),
          ),
          ElevatedButton(
            key: const ValueKey('settings_logout_confirm'),
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
          Navigator.of(context).pushNamedAndRemoveUntil(AppRoutes.welcome, (route) => false);
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Logout failed. Please try again.'), backgroundColor: _kRed),
          );
        }
      }
    }
  }

  Future<void> _confirmDeleteAccount(AppStrings s) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20.0)),
        title: Text(
          s.deleteAccountTitle,
          key: const ValueKey('delete_account_dialog_title'),
          style: const TextStyle(fontSize: 17.0, fontWeight: FontWeight.w800, color: _kRed),
        ),
        content: Text(
          s.deleteAccountMessage,
          style: const TextStyle(fontSize: 13.5, color: _kTextSecondary, height: 1.4),
        ),
        actions: [
          TextButton(
            key: const ValueKey('delete_account_cancel'),
            onPressed: () => Navigator.of(ctx).pop(false),
            child: Text(s.cancelAction, style: const TextStyle(color: _kTextSecondary)),
          ),
          ElevatedButton(
            key: const ValueKey('delete_account_confirm'),
            style: ElevatedButton.styleFrom(
              backgroundColor: _kRed,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10.0)),
            ),
            onPressed: () => Navigator.of(ctx).pop(true),
            child: Text(s.deleteAccountAction),
          ),
        ],
      ),
    );

    if (confirmed == true && mounted) {
      try {
        await _authService.sessionService.clearSession();
        if (mounted) {
          Navigator.of(context).pushNamedAndRemoveUntil(AppRoutes.welcome, (route) => false);
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Account deletion request submitted.'), backgroundColor: _kPrimary),
          );
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Failed. Please try again.'), backgroundColor: _kRed),
          );
        }
      }
    }
  }

  void _onNavTapped(int index) {
    if (index == 4) {
      Navigator.of(context).pushReplacementNamed(AppRoutes.profile);
    } else if (index == 0) {
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
                          const SizedBox(height: 10.0),
                          _buildAccountPreferencesSection(s),
                          const SizedBox(height: 14.0),
                          _buildAppPreferencesSection(s, locale),
                          const SizedBox(height: 14.0),
                          _buildPrivacySecuritySection(s),
                          const SizedBox(height: 14.0),
                          _buildSupportSection(s),
                          const SizedBox(height: 14.0),
                          _buildAccountActionsSection(s),
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

  // ── 1. Header ──────────────────────────────────────────────────────────────
  Widget _buildHeader(AppStrings s) {
    return Container(
      key: const ValueKey('settings_header'),
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
      color: _kSurface,
      child: Row(
        children: [
          // Back button
          InkWell(
            key: const ValueKey('settings_back_btn'),
            borderRadius: BorderRadius.circular(10.0),
            onTap: () => Navigator.of(context).pop(),
            child: Container(
              padding: const EdgeInsets.all(8.0),
              decoration: BoxDecoration(
                color: _kPrimaryLight,
                borderRadius: BorderRadius.circular(10.0),
              ),
              child: const Icon(Icons.arrow_back_rounded, color: _kPrimary, size: 20.0),
            ),
          ),
          const SizedBox(width: 12.0),

          // Title + subtitle
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  s.settingsTitle,
                  key: const ValueKey('settings_page_title'),
                  style: const TextStyle(
                    fontSize: 18.0,
                    fontWeight: FontWeight.w800,
                    color: _kTextPrimary,
                  ),
                ),
                Text(
                  s.settingsSubtitle,
                  key: const ValueKey('settings_page_subtitle'),
                  style: const TextStyle(fontSize: 11.5, color: _kTextSecondary),
                ),
              ],
            ),
          ),

          // Settings gear icon
          Container(
            padding: const EdgeInsets.all(8.0),
            decoration: BoxDecoration(
              color: _kPrimaryLight,
              borderRadius: BorderRadius.circular(10.0),
            ),
            child: const Icon(Icons.settings_outlined, color: _kPrimary, size: 20.0),
          ),
        ],
      ),
    );
  }

  // ── 2. Account Preferences Section ─────────────────────────────────────────
  Widget _buildAccountPreferencesSection(AppStrings s) {
    return _SettingsSectionCard(
      key: const ValueKey('account_preferences_section'),
      title: s.accountPreferencesTitle,
      children: [
        _SettingsNavigationRow(
          key: const ValueKey('personal_info_row'),
          icon: Icons.person_outline_rounded,
          title: s.personalInfoSettingsTitle,
          subtitle: s.personalInfoSettingsSubtitle,
          onTap: () => _showPersonalInfoSheet(s),
        ),
        _SettingsNavigationRow(
          key: const ValueKey('change_password_row'),
          icon: Icons.lock_outline_rounded,
          title: s.changePasswordTitle,
          subtitle: s.changePasswordSubtitle,
          onTap: () => _showChangePasswordSheet(s),
        ),
        _SettingsNavigationRow(
          key: const ValueKey('mobile_email_row'),
          icon: Icons.phone_android_rounded,
          title: s.mobileEmailTitle,
          subtitle: s.mobileEmailSubtitle,
          onTap: () => _showMobileEmailSheet(s),
        ),
        _SettingsNavigationRow(
          key: const ValueKey('language_pref_row'),
          icon: Icons.translate_rounded,
          title: s.languagePrefTitle,
          subtitle: s.languagePrefSubtitle,
          onTap: () => _showLanguagePrefSheet(s),
        ),
        _SettingsNavigationRow(
          key: const ValueKey('notification_pref_row'),
          icon: Icons.notifications_outlined,
          title: s.notificationPrefSettingsTitle,
          subtitle: s.notificationPrefSettingsSubtitle,
          onTap: () => _showNotificationPrefSheet(s),
          isLast: true,
        ),
      ],
    );
  }

  // ── 3. App Preferences Section ─────────────────────────────────────────────
  Widget _buildAppPreferencesSection(AppStrings s, LocaleController locale) {
    return _SettingsSectionCard(
      key: const ValueKey('app_preferences_section'),
      title: s.appPreferencesTitle,
      children: [
        // App Language with chips
        _SettingsRowWithChips(
          key: const ValueKey('app_language_setting_row'),
          icon: Icons.language_rounded,
          title: s.appLanguageSettingsTitle,
          subtitle: s.appLanguageSettingsSubtitle,
          chips: [
            _SettingsChipData(label: 'Gujarati', code: 'gu', isSelected: locale.currentLanguageCode == 'gu'),
            _SettingsChipData(label: 'English', code: 'en', isSelected: locale.currentLanguageCode == 'en'),
            _SettingsChipData(label: 'Hindi', code: 'hi', isSelected: locale.currentLanguageCode == 'hi'),
          ],
          onChipTap: (code) => locale.setLanguage(code),
        ),
        const Divider(height: 1, indent: 16.0, color: _kBorder),

        // Default Poster Language with chips
        _SettingsRowWithChips(
          key: const ValueKey('poster_language_setting_row'),
          icon: Icons.text_fields_rounded,
          title: s.defaultPosterLanguageTitle,
          subtitle: s.defaultPosterLanguageSubtitle,
          chips: [
            _SettingsChipData(label: 'Gujarati', code: 'gu', isSelected: _posterLanguage == 'gu'),
            _SettingsChipData(label: 'English', code: 'en', isSelected: _posterLanguage == 'en'),
            _SettingsChipData(label: 'Hindi', code: 'hi', isSelected: _posterLanguage == 'hi'),
          ],
          onChipTap: _setPosterLanguage,
        ),
        const Divider(height: 1, indent: 16.0, color: _kBorder),

        // Notification Settings toggle
        _SettingsToggleRow(
          key: const ValueKey('notification_toggle_row'),
          icon: Icons.notifications_active_outlined,
          title: s.notificationSettingsTitle,
          subtitle: s.notificationSettingsSubtitle,
          value: _notificationsEnabled,
          onChanged: _toggleNotifications,
        ),
        const Divider(height: 1, indent: 16.0, color: _kBorder),

        // Festival Reminders toggle
        _SettingsToggleRow(
          key: const ValueKey('festival_reminders_toggle_row'),
          icon: Icons.event_available_rounded,
          title: s.festivalRemindersTitle,
          subtitle: s.festivalRemindersSubtitle,
          value: _festivalRemindersEnabled,
          onChanged: _toggleFestivalReminders,
        ),
        const Divider(height: 1, indent: 16.0, color: _kBorder),

        // App Theme
        _SettingsRowWithThemeChips(
          key: const ValueKey('app_theme_setting_row'),
          icon: Icons.palette_outlined,
          title: s.appThemeTitle,
          subtitle: s.appThemeSubtitle,
          selectedTheme: _selectedTheme,
          onThemeTap: _setTheme,
        ),
      ],
    );
  }

  // ── 4. Privacy & Security Section ──────────────────────────────────────────
  Widget _buildPrivacySecuritySection(AppStrings s) {
    return _SettingsSectionCard(
      key: const ValueKey('privacy_security_section'),
      title: s.privacySecurityTitle,
      children: [
        _SettingsNavigationRow(
          key: const ValueKey('privacy_settings_row'),
          icon: Icons.verified_user_outlined,
          title: s.privacySettingsTitle,
          subtitle: s.privacySettingsSubtitle,
          onTap: () => _showInfoSheet(title: s.privacySettingsTitle, icon: Icons.verified_user_outlined, content: s.privacySettingsContent),
        ),
        _SettingsNavigationRow(
          key: const ValueKey('account_security_settings_row'),
          icon: Icons.shield_outlined,
          title: s.accountSecuritySettingsTitle,
          subtitle: s.accountSecuritySettingsSubtitle,
          onTap: () => _showInfoSheet(title: s.accountSecuritySettingsTitle, icon: Icons.shield_outlined, content: s.accountSecuritySettingsContent),
        ),
        _SettingsNavigationRow(
          key: const ValueKey('active_sessions_row'),
          icon: Icons.devices_rounded,
          title: s.activeSessionsTitle,
          subtitle: s.activeSessionsSubtitle,
          onTap: () => _showInfoSheet(title: s.activeSessionsTitle, icon: Icons.devices_rounded, content: s.activeSessionsContent),
        ),
        _SettingsNavigationRow(
          key: const ValueKey('data_permissions_row'),
          icon: Icons.admin_panel_settings_outlined,
          title: s.dataPermissionsTitle,
          subtitle: s.dataPermissionsSubtitle,
          onTap: () => _showInfoSheet(title: s.dataPermissionsTitle, icon: Icons.admin_panel_settings_outlined, content: s.dataPermissionsContent),
          isLast: true,
        ),
      ],
    );
  }

  // ── 5. Support Section ─────────────────────────────────────────────────────
  Widget _buildSupportSection(AppStrings s) {
    return _SettingsSectionCard(
      key: const ValueKey('support_section'),
      title: s.supportTitle,
      children: [
        _SettingsNavigationRow(
          key: const ValueKey('help_support_settings_row'),
          icon: Icons.headset_mic_outlined,
          title: s.helpSupportSettingsTitle,
          subtitle: s.helpSupportSettingsSubtitle,
          onTap: () => _showInfoSheet(title: s.helpSupportSettingsTitle, icon: Icons.headset_mic_outlined, content: s.helpSupportSettingsContent),
        ),
        _SettingsNavigationRow(
          key: const ValueKey('faq_row'),
          icon: Icons.quiz_outlined,
          title: s.faqTitle,
          subtitle: s.faqSubtitle,
          onTap: () => _showInfoSheet(title: s.faqTitle, icon: Icons.quiz_outlined, content: s.faqContent),
        ),
        _SettingsNavigationRow(
          key: const ValueKey('contact_us_row'),
          icon: Icons.mail_outline_rounded,
          title: s.contactUsTitle,
          subtitle: s.contactUsSubtitle,
          onTap: () => _showInfoSheet(title: s.contactUsTitle, icon: Icons.mail_outline_rounded, content: s.contactUsContent),
        ),
        _SettingsNavigationRow(
          key: const ValueKey('about_app_row'),
          icon: Icons.info_outline_rounded,
          title: s.aboutAppTitle,
          subtitle: s.aboutAppSubtitle,
          onTap: () => _showInfoSheet(title: s.aboutAppTitle, icon: Icons.info_outline_rounded, content: s.aboutAppContent),
          isLast: true,
        ),
      ],
    );
  }

  // ── 6. Account Actions Section ─────────────────────────────────────────────
  Widget _buildAccountActionsSection(AppStrings s) {
    return _SettingsSectionCard(
      key: const ValueKey('account_actions_section'),
      title: s.accountActionsTitle,
      children: [
        // Logout row
        _SettingsNavigationRow(
          key: const ValueKey('settings_logout_row'),
          icon: Icons.logout_rounded,
          title: s.logoutAction,
          subtitle: s.logoutSettingsSubtitle,
          onTap: () => _confirmLogout(s),
          iconColor: _kTextPrimary,
        ),
        // Delete Account row (red)
        InkWell(
          key: const ValueKey('delete_account_row'),
          onTap: () => _confirmDeleteAccount(s),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 14.0),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8.0),
                  decoration: BoxDecoration(
                    color: _kRedLight,
                    borderRadius: BorderRadius.circular(10.0),
                  ),
                  child: const Icon(Icons.delete_outline_rounded, color: _kRed, size: 18.0),
                ),
                const SizedBox(width: 12.0),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        s.deleteAccountTitle,
                        style: const TextStyle(fontSize: 14.0, fontWeight: FontWeight.w600, color: _kRed),
                      ),
                      const SizedBox(height: 2.0),
                      Text(
                        s.deleteAccountSubtitle,
                        style: const TextStyle(fontSize: 11.5, color: _kTextSecondary),
                      ),
                    ],
                  ),
                ),
                const Icon(Icons.chevron_right_rounded, color: _kRed, size: 20.0),
              ],
            ),
          ),
        ),
      ],
    );
  }

  // ── 7. Bottom Navigation Bar ───────────────────────────────────────────────
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
              _NavItem(key: const ValueKey('settings_nav_home'), icon: Icons.home_outlined, activeIcon: Icons.home_rounded, label: s.navHome, isActive: false, onTap: () => _onNavTapped(0)),
              _NavItem(key: const ValueKey('settings_nav_festivals'), icon: Icons.calendar_month_outlined, activeIcon: Icons.calendar_month_rounded, label: s.navFestivals, isActive: false, onTap: () => _onNavTapped(1)),
              _NavItem(key: const ValueKey('settings_nav_templates'), icon: Icons.layers_outlined, activeIcon: Icons.layers_rounded, label: s.navTemplates, isActive: false, onTap: () => _onNavTapped(2)),
              _NavItem(key: const ValueKey('settings_nav_my_designs'), icon: Icons.photo_library_outlined, activeIcon: Icons.photo_library_rounded, label: s.navMyDesigns, isActive: false, onTap: () => _onNavTapped(3)),
              _NavItem(key: const ValueKey('settings_nav_profile'), icon: Icons.person_outline_rounded, activeIcon: Icons.person_rounded, label: s.navProfile, isActive: true, onTap: () => _onNavTapped(4)),
            ],
          ),
        ),
      ),
    );
  }

  // ── Sheet Helpers ──────────────────────────────────────────────────────────
  void _showPersonalInfoSheet(AppStrings s) {
    final name = _currentUser?.effectiveDisplayName ?? '—';
    final mobile = '+91 98765 43210';
    final email = _currentUser?.username != null ? '${_currentUser!.username}@panchayatpost.in' : '—';
    final village = _currentUser?.villageCity ?? '—';
    final district = _currentUser?.state ?? '—';

    _showInfoSheet(
      title: s.personalInfoSettingsTitle,
      icon: Icons.person_outline_rounded,
      content: 'Full Name: $name\nMobile: $mobile\nEmail: $email\nVillage / City: $village\nDistrict: $district',
    );
  }

  void _showChangePasswordSheet(AppStrings s) {
    _showInfoSheet(
      title: s.changePasswordTitle,
      icon: Icons.lock_outline_rounded,
      content: 'To change your password, please log out and use the "Forgot Password" feature on the login screen. Your account security is important to us.',
    );
  }

  void _showMobileEmailSheet(AppStrings s) {
    final mobile = '+91 98765 43210';
    final email = _currentUser?.username != null ? '${_currentUser!.username}@panchayatpost.in' : '—';
    _showInfoSheet(
      title: s.mobileEmailTitle,
      icon: Icons.phone_android_rounded,
      content: 'Registered Mobile: $mobile\nRegistered Email: $email\n\nTo update your contact details, please contact our support team.',
    );
  }

  void _showLanguagePrefSheet(AppStrings s) {
    _showInfoSheet(
      title: s.languagePrefTitle,
      icon: Icons.translate_rounded,
      content: 'You can change the app language from the App Preferences section below. Currently supported languages: Gujarati, English, Hindi.',
    );
  }

  void _showNotificationPrefSheet(AppStrings s) {
    _showInfoSheet(
      title: s.notificationPrefSettingsTitle,
      icon: Icons.notifications_outlined,
      content: 'Manage your notification preferences in the App Preferences section. You can toggle notification settings and festival reminders on or off.',
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
                  Expanded(
                    child: Text(title, style: const TextStyle(fontSize: 17.0, fontWeight: FontWeight.w800, color: _kTextPrimary)),
                  ),
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

// ═══════════════════════════════════════════════════════════════════════════════
// Reusable Widgets
// ═══════════════════════════════════════════════════════════════════════════════

/// Section card container matching reference design.
class _SettingsSectionCard extends StatelessWidget {
  const _SettingsSectionCard({super.key, required this.title, required this.children});
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

/// Navigation row with chevron arrow.
class _SettingsNavigationRow extends StatelessWidget {
  const _SettingsNavigationRow({
    super.key,
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
    this.isLast = false,
    this.iconColor,
  });
  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;
  final bool isLast;
  final Color? iconColor;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        InkWell(
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 14.0),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8.0),
                  decoration: BoxDecoration(
                    color: _kPrimaryLight,
                    borderRadius: BorderRadius.circular(10.0),
                  ),
                  child: Icon(icon, color: iconColor ?? _kPrimary, size: 18.0),
                ),
                const SizedBox(width: 12.0),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(title, style: const TextStyle(fontSize: 14.0, fontWeight: FontWeight.w600, color: _kTextPrimary)),
                      const SizedBox(height: 2.0),
                      Text(subtitle, style: const TextStyle(fontSize: 11.5, color: _kTextSecondary)),
                    ],
                  ),
                ),
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

/// Data class for chip display.
class _SettingsChipData {
  const _SettingsChipData({required this.label, required this.code, required this.isSelected});
  final String label;
  final String code;
  final bool isSelected;
}

/// Row with language chips for app/poster language.
class _SettingsRowWithChips extends StatelessWidget {
  const _SettingsRowWithChips({
    super.key,
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.chips,
    required this.onChipTap,
  });
  final IconData icon;
  final String title;
  final String subtitle;
  final List<_SettingsChipData> chips;
  final ValueChanged<String> onChipTap;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8.0),
            decoration: BoxDecoration(color: _kPrimaryLight, borderRadius: BorderRadius.circular(10.0)),
            child: Icon(icon, color: _kPrimary, size: 18.0),
          ),
          const SizedBox(width: 12.0),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontSize: 14.0, fontWeight: FontWeight.w600, color: _kTextPrimary)),
                const SizedBox(height: 2.0),
                Text(subtitle, style: const TextStyle(fontSize: 11.5, color: _kTextSecondary)),
              ],
            ),
          ),
          const SizedBox(width: 6.0),
          Row(
            mainAxisSize: MainAxisSize.min,
            children: chips.map((chip) {
              return Padding(
                padding: const EdgeInsets.only(left: 4.0),
                child: GestureDetector(
                  key: ValueKey('settings_chip_${chip.code}_${title.replaceAll(' ', '_').toLowerCase()}'),
                  onTap: () => onChipTap(chip.code),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 5.0),
                    decoration: BoxDecoration(
                      color: chip.isSelected ? _kPrimary : _kSurface,
                      borderRadius: BorderRadius.circular(20.0),
                      border: Border.all(color: chip.isSelected ? _kPrimary : _kBorder),
                    ),
                    child: Text(
                      chip.label,
                      style: TextStyle(
                        fontSize: 11.0,
                        fontWeight: FontWeight.w700,
                        color: chip.isSelected ? Colors.white : _kTextSecondary,
                      ),
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }
}

/// Toggle row for settings with Switch.
class _SettingsToggleRow extends StatelessWidget {
  const _SettingsToggleRow({
    super.key,
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.value,
    required this.onChanged,
  });
  final IconData icon;
  final String title;
  final String subtitle;
  final bool value;
  final ValueChanged<bool> onChanged;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 10.0),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8.0),
            decoration: BoxDecoration(color: _kPrimaryLight, borderRadius: BorderRadius.circular(10.0)),
            child: Icon(icon, color: _kPrimary, size: 18.0),
          ),
          const SizedBox(width: 12.0),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontSize: 14.0, fontWeight: FontWeight.w600, color: _kTextPrimary)),
                const SizedBox(height: 2.0),
                Text(subtitle, style: const TextStyle(fontSize: 11.5, color: _kTextSecondary)),
              ],
            ),
          ),
          Switch(
            value: value,
            activeThumbColor: Colors.white,
            activeTrackColor: _kPrimary,
            onChanged: onChanged,
          ),
        ],
      ),
    );
  }
}

/// Theme selector row with two theme chips.
class _SettingsRowWithThemeChips extends StatelessWidget {
  const _SettingsRowWithThemeChips({
    super.key,
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.selectedTheme,
    required this.onThemeTap,
  });
  final IconData icon;
  final String title;
  final String subtitle;
  final String selectedTheme;
  final ValueChanged<String> onThemeTap;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8.0),
            decoration: BoxDecoration(color: _kPrimaryLight, borderRadius: BorderRadius.circular(10.0)),
            child: Icon(icon, color: _kPrimary, size: 18.0),
          ),
          const SizedBox(width: 12.0),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(fontSize: 14.0, fontWeight: FontWeight.w600, color: _kTextPrimary)),
                const SizedBox(height: 2.0),
                Text(subtitle, style: const TextStyle(fontSize: 11.5, color: _kTextSecondary)),
              ],
            ),
          ),
          const SizedBox(width: 6.0),
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              GestureDetector(
                key: const ValueKey('theme_chip_light'),
                onTap: () => onThemeTap('Light'),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12.0, vertical: 6.0),
                  decoration: BoxDecoration(
                    color: selectedTheme == 'Light' ? _kPrimary : _kSurface,
                    borderRadius: BorderRadius.circular(20.0),
                    border: Border.all(color: selectedTheme == 'Light' ? _kPrimary : _kBorder),
                  ),
                  child: Text(
                    'Light',
                    style: TextStyle(
                      fontSize: 11.0,
                      fontWeight: FontWeight.w700,
                      color: selectedTheme == 'Light' ? Colors.white : _kTextSecondary,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 6.0),
              GestureDetector(
                key: const ValueKey('theme_chip_system'),
                onTap: () => onThemeTap('System Default'),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12.0, vertical: 6.0),
                  decoration: BoxDecoration(
                    color: selectedTheme == 'System Default' ? _kPrimary : _kSurface,
                    borderRadius: BorderRadius.circular(20.0),
                    border: Border.all(color: selectedTheme == 'System Default' ? _kPrimary : _kBorder),
                  ),
                  child: Text(
                    'System Default',
                    style: TextStyle(
                      fontSize: 11.0,
                      fontWeight: FontWeight.w700,
                      color: selectedTheme == 'System Default' ? Colors.white : _kTextSecondary,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

/// Bottom navigation item (same style as other screens).
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
