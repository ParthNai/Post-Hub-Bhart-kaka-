import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:panchayat_post/core/constants/app_assets.dart';
import 'package:panchayat_post/core/constants/app_colors.dart';
import 'package:panchayat_post/core/localization/app_localizations.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/core/models/app_remote_config.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';
import 'package:panchayat_post/core/services/app_config_service.dart';
import 'package:panchayat_post/core/widgets/legal_dialog_helper.dart';
import 'package:panchayat_post/features/auth/data/auth_service.dart';
import 'package:panchayat_post/features/auth/domain/models/user_profile.dart';
import 'package:panchayat_post/features/auth/presentation/widgets/auth_header_widget.dart';
import 'package:panchayat_post/features/welcome/presentation/widgets/welcome_background_painter.dart';

/// Destination: Panchayat Post Home Dashboard Screen
///
/// Features:
/// - Brand Header with Logo, Language Selector, and Home badge
/// - Dynamic authenticated user profile card (photo, display name, village, status)
/// - Shortcut to edit profile (Screen 07 Profile Setup)
/// - AI Poster Creation quick input and interactive generation modal
/// - Poster template categories (Panchayat Meeting, Village Development, Festivals, National Days)
/// - All Screens Navigator allowing direct testing of Screens 01–08
/// - Working Logout with confirmation dialog
/// - Session reset tool for first-time state testing
/// - Trilingual localization (Gujarati, Hindi, English)
/// - Zero-overflow responsive layout across mobile viewports
class HomeScreen extends StatefulWidget {
  const HomeScreen({
    super.key,
    this.authService,
  });

  final AuthService? authService;

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late final AuthService _authService;
  UserProfile? _currentUser;
  final TextEditingController _aiPromptController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _authService = widget.authService ?? AuthService();
    _loadUserProfile();
  }

  @override
  void dispose() {
    _aiPromptController.dispose();
    super.dispose();
  }

  Future<void> _loadUserProfile() async {
    final user = await _authService.getCurrentUser();
    if (mounted) {
      setState(() {
        _currentUser = user;
      });
    }
  }

  void _showLogoutDialog(BuildContext context, AppStrings strings) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20.0)),
        title: Row(
          children: [
            const Icon(Icons.logout_rounded, color: Color(0xFFDC2626), size: 24.0),
            const SizedBox(width: 10.0),
            Text(
              strings.logoutDialogTitle,
              style: const TextStyle(
                fontWeight: FontWeight.w800,
                color: AppColors.textNavy,
                fontSize: 18.0,
              ),
            ),
          ],
        ),
        content: Text(
          strings.logoutDialogMessage,
          style: const TextStyle(
            fontSize: 14.0,
            color: Color(0xFF475569),
            height: 1.4,
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: Text(
              strings.cancelButton,
              style: const TextStyle(
                color: Color(0xFF64748B),
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFDC2626),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12.0),
              ),
            ),
            onPressed: () async {
              Navigator.of(ctx).pop();
              await _authService.sessionService.clearSession();
              if (!context.mounted) return;
              Navigator.of(context).pushNamedAndRemoveUntil(
                AppRoutes.welcome,
                (route) => false,
              );
            },
            child: Text(
              strings.logoutConfirmButton,
              style: const TextStyle(fontWeight: FontWeight.w700),
            ),
          ),
        ],
      ),
    );
  }

  void _showAiPosterModal(BuildContext context, AppStrings strings) {
    final prompt = _aiPromptController.text.trim();
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24.0)),
      ),
      builder: (ctx) => Padding(
        padding: EdgeInsets.only(
          left: 20.0,
          right: 20.0,
          top: 20.0,
          bottom: MediaQuery.of(ctx).viewInsets.bottom + 24.0,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8.0),
                  decoration: const BoxDecoration(
                    color: Color(0xFFFFF7ED),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.auto_awesome_rounded, color: Color(0xFFEA580C)),
                ),
                const SizedBox(width: 12.0),
                Expanded(
                  child: Text(
                    strings.createWithAiTitle,
                    style: const TextStyle(
                      fontSize: 18.0,
                      fontWeight: FontWeight.w800,
                      color: AppColors.textNavy,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12.0),
            Text(
              prompt.isNotEmpty ? 'વિષય: "$prompt"' : strings.createWithAiDesc,
              style: const TextStyle(color: Color(0xFF64748B), fontSize: 13.5),
            ),
            const SizedBox(height: 16.0),
            Container(
              height: 140,
              decoration: BoxDecoration(
                color: const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(14.0),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Image.asset(
                      AppAssets.welcomeHeroPosters,
                      height: 90,
                      fit: BoxFit.contain,
                    ),
                    const SizedBox(height: 6.0),
                    const Text(
                      'AI દ્વારા પોસ્ટર સફળતાપૂર્વક તૈયાર થયું!',
                      style: TextStyle(
                        fontSize: 12.0,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF16A34A),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16.0),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primaryBlue,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14.0),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14.0)),
              ),
              onPressed: () {
                Navigator.of(ctx).pop();
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('પોસ્ટર સેવ થઈ ગયું!'),
                    backgroundColor: Color(0xFF16A34A),
                  ),
                );
              },
              child: const Text('પોસ્ટર શેર કરો / ડાઉનલોડ કરો', style: TextStyle(fontWeight: FontWeight.w700)),
            ),
          ],
        ),
      ),
    );
  }

  void _showTemplatesModal(BuildContext context, String categoryName) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24.0)),
      ),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              children: [
                const Icon(Icons.collections_rounded, color: AppColors.primaryBlue),
                const SizedBox(width: 10.0),
                Text(
                  categoryName,
                  style: const TextStyle(
                    fontSize: 18.0,
                    fontWeight: FontWeight.w800,
                    color: AppColors.textNavy,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16.0),
            SizedBox(
              height: 180,
              child: Image.asset(
                AppAssets.welcomeHeroPosters,
                fit: BoxFit.contain,
              ),
            ),
            const SizedBox(height: 16.0),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFFF6600),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.0)),
              ),
              onPressed: () => Navigator.of(ctx).pop(),
              child: const Text('આ ટેમ્પલેટ પસંદ કરો', style: TextStyle(fontWeight: FontWeight.w700)),
            ),
          ],
        ),
      ),
    );
  }

  void _showServerConfigDialog(BuildContext context) {
    final textController = TextEditingController(text: AppConfigService.instance.serverBaseUrl);
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18.0)),
        title: const Row(
          children: [
            Icon(Icons.dns_rounded, color: AppColors.primaryBlue, size: 22.0),
            SizedBox(width: 8.0),
            Text(
              'Admin Server URL',
              style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16.0, color: AppColors.textNavy),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Connect your mobile app to the Admin Panel server to dynamically sync theme, hero section, preloader, and app icon.',
              style: TextStyle(fontSize: 12.5, color: Color(0xFF64748B), height: 1.4),
            ),
            const SizedBox(height: 12.0),
            TextField(
              controller: textController,
              decoration: InputDecoration(
                labelText: 'Server Base URL',
                hintText: 'http://10.0.2.2:3000 or http://localhost:3000',
                filled: true,
                fillColor: const Color(0xFFF8FAFC),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(10.0)),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primaryBlue,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10.0)),
            ),
            onPressed: () async {
              Navigator.of(ctx).pop();
              await AppConfigService.instance.setServerBaseUrl(textController.text.trim());
              if (!context.mounted) return;
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Server URL updated! Settings synced.'),
                  backgroundColor: Color(0xFF16A34A),
                ),
              );
            },
            child: const Text('Save & Sync'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder<AppRemoteConfig>(
      valueListenable: AppConfigService.instance.configNotifier,
      builder: (context, config, child) {
        final strings = LocaleScope.of(context).strings;
        final displayName = _currentUser?.effectiveDisplayName ?? 'User';
        final village = _currentUser?.villageCity != null && _currentUser!.villageCity!.isNotEmpty
            ? _currentUser!.villageCity!
            : strings.noVillageProvided;
        final isComplete = _currentUser?.isProfileComplete ?? false;
        final primaryAccent = config.primaryAccentColor;

        Widget avatarImage;
        final photoUrl = _currentUser?.profilePhotoUrl;
        if (photoUrl != null && photoUrl.isNotEmpty) {
          if (photoUrl.startsWith('data:image')) {
            try {
              final base64Part = photoUrl.split(',').last;
              avatarImage = ClipOval(
                child: Image.memory(
                  base64Decode(base64Part),
                  width: 54,
                  height: 54,
                  fit: BoxFit.cover,
                ),
              );
            } catch (_) {
              avatarImage = Icon(Icons.person_rounded, size: 32, color: primaryAccent);
            }
          } else {
            avatarImage = Icon(Icons.person_rounded, size: 32, color: primaryAccent);
          }
        } else {
          avatarImage = Icon(Icons.person_rounded, size: 32, color: primaryAccent);
        }

        return Scaffold(
          backgroundColor: Colors.white,
          body: CustomPaint(
            painter: const WelcomeBackgroundPainter(),
            child: SafeArea(
              child: Column(
                children: [
                  // 1. Header with Panchayat Post logo and language selector
                  const AuthHeaderWidget(
                    showBackButton: false,
                  ),

                  // 2. Main Scrollable Dashboard Content with Pull-to-Refresh
                  Expanded(
                    child: RefreshIndicator(
                      color: primaryAccent,
                      onRefresh: () async {
                        final synced = await AppConfigService.instance.refreshConfig();
                        if (!context.mounted) return;
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text(synced
                                ? 'એડમિન પેનલ સેટિંગ્સ અપડેટ થઈ ગઈ!'
                                : 'સર્વર સાથે કનેક્ટ નથી થઈ શક્યું (Offline)'),
                            backgroundColor: synced ? primaryAccent : const Color(0xFFEF4444),
                            duration: const Duration(seconds: 2),
                          ),
                        );
                      },
                      child: SingleChildScrollView(
                        physics: const AlwaysScrollableScrollPhysics(parent: ClampingScrollPhysics()),
                        padding: const EdgeInsets.symmetric(horizontal: 18.0, vertical: 8.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            // User Welcome & Profile Card
                            Container(
                              padding: const EdgeInsets.all(16.0),
                              decoration: BoxDecoration(
                                gradient: const LinearGradient(
                                  colors: [Color(0xFFEFF6FF), Color(0xFFF8FAFC)],
                                  begin: Alignment.topLeft,
                                  end: Alignment.bottomRight,
                                ),
                                borderRadius: BorderRadius.circular(18.0),
                                border: Border.all(color: const Color(0xFFBFDBFE), width: 1.2),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withValues(alpha: 0.03),
                                    blurRadius: 10.0,
                                    offset: const Offset(0, 4),
                                  ),
                                ],
                              ),
                              child: Row(
                                children: [
                                  // Avatar with verified badge
                                  Stack(
                                    children: [
                                      Container(
                                        width: 58,
                                        height: 58,
                                        decoration: BoxDecoration(
                                          color: const Color(0xFFDBEAFE),
                                          shape: BoxShape.circle,
                                          border: Border.all(color: Colors.white, width: 2.0),
                                        ),
                                        child: Center(child: avatarImage),
                                      ),
                                      Positioned(
                                        bottom: 0,
                                        right: 0,
                                        child: Container(
                                          padding: const EdgeInsets.all(3.0),
                                          decoration: BoxDecoration(
                                            color: primaryAccent,
                                            shape: BoxShape.circle,
                                          ),
                                          child: const Icon(Icons.check_rounded, color: Colors.white, size: 10.0),
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(width: 14.0),

                                  // Details
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          '${strings.greetingPrefix}, $displayName! 👋',
                                          style: const TextStyle(
                                            fontSize: 16.5,
                                            fontWeight: FontWeight.w800,
                                            color: AppColors.textNavy,
                                          ),
                                        ),
                                        const SizedBox(height: 3.0),
                                        Row(
                                          children: [
                                            const Icon(Icons.location_on_rounded, size: 14.0, color: Color(0xFF64748B)),
                                            const SizedBox(width: 3.0),
                                            Expanded(
                                              child: Text(
                                                village,
                                                style: const TextStyle(
                                                  fontSize: 12.5,
                                                  fontWeight: FontWeight.w500,
                                                  color: Color(0xFF64748B),
                                                ),
                                                maxLines: 1,
                                                overflow: TextOverflow.ellipsis,
                                              ),
                                            ),
                                          ],
                                        ),
                                        const SizedBox(height: 5.0),
                                        FittedBox(
                                          fit: BoxFit.scaleDown,
                                          alignment: Alignment.centerLeft,
                                          child: Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 7.0, vertical: 2.0),
                                            decoration: BoxDecoration(
                                              color: isComplete ? const Color(0xFFF0FDF4) : const Color(0xFFFFFBEB),
                                              borderRadius: BorderRadius.circular(8.0),
                                              border: Border.all(
                                                color: isComplete ? const Color(0xFFBBF7D0) : const Color(0xFFFDE68A),
                                              ),
                                            ),
                                            child: Row(
                                              mainAxisSize: MainAxisSize.min,
                                              children: [
                                                Icon(
                                                  isComplete ? Icons.check_circle_rounded : Icons.pending_actions_rounded,
                                                  size: 11.0,
                                                  color: isComplete ? const Color(0xFF16A34A) : const Color(0xFFD97706),
                                                ),
                                                const SizedBox(width: 4.0),
                                                Text(
                                                  isComplete
                                                      ? strings.profileStatusCompletedBadge
                                                      : strings.profileStatusPendingBadge,
                                                  style: TextStyle(
                                                    fontSize: 10.5,
                                                    fontWeight: FontWeight.w700,
                                                    color: isComplete ? const Color(0xFF15803D) : const Color(0xFFB45309),
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ),
                                        ),
                                        const SizedBox(height: 6.0),
                                        // Edit profile link
                                        InkWell(
                                          key: const Key('edit_profile_action'),
                                          onTap: () {
                                            Navigator.of(context).pushNamed(
                                              AppRoutes.profileSetup,
                                              arguments: _currentUser,
                                            );
                                          },
                                          child: FittedBox(
                                            fit: BoxFit.scaleDown,
                                            alignment: Alignment.centerLeft,
                                            child: Row(
                                              mainAxisSize: MainAxisSize.min,
                                              children: [
                                                Icon(Icons.edit_rounded, size: 13.0, color: primaryAccent),
                                                const SizedBox(width: 4.0),
                                                Text(
                                                  strings.editProfileButton,
                                                  style: TextStyle(
                                                    fontSize: 12.0,
                                                    fontWeight: FontWeight.w700,
                                                    color: primaryAccent,
                                                    decoration: TextDecoration.underline,
                                                  ),
                                                ),
                                              ],
                                            ),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(height: 18.0),

                            // ==============================================================
                            // 4. Hero Section of Home Screen (Admin Controllable)
                            // ==============================================================
                            if (config.isHeroVisible) ...[
                              Container(
                                padding: const EdgeInsets.all(18.0),
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    colors: [
                                      primaryAccent.withValues(alpha: 0.10),
                                      const Color(0xFFFFF7ED),
                                    ],
                                    begin: Alignment.topLeft,
                                    end: Alignment.bottomRight,
                                  ),
                                  borderRadius: BorderRadius.circular(18.0),
                                  border: Border.all(
                                    color: primaryAccent.withValues(alpha: 0.25),
                                    width: 1.2,
                                  ),
                                  boxShadow: [
                                    BoxShadow(
                                      color: primaryAccent.withValues(alpha: 0.05),
                                      blurRadius: 10.0,
                                      offset: const Offset(0, 4),
                                    ),
                                  ],
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    FittedBox(
                                      fit: BoxFit.scaleDown,
                                      alignment: Alignment.centerLeft,
                                      child: Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 4.0),
                                        decoration: BoxDecoration(
                                          color: primaryAccent,
                                          borderRadius: BorderRadius.circular(20.0),
                                        ),
                                        child: Text(
                                          config.heroBadge,
                                          style: const TextStyle(
                                            color: Colors.white,
                                            fontSize: 11.0,
                                            fontWeight: FontWeight.w800,
                                            letterSpacing: 0.3,
                                          ),
                                        ),
                                      ),
                                    ),
                                    const SizedBox(height: 10.0),
                                    // Headline (Admin Controlled)
                                    Text(
                                      config.heroHeadline,
                                      style: const TextStyle(
                                        fontSize: 18.0,
                                        fontWeight: FontWeight.w800,
                                        color: AppColors.textNavy,
                                        height: 1.25,
                                      ),
                                    ),
                                    const SizedBox(height: 6.0),
                                    // Subtitle (Admin Controlled)
                                    Text(
                                      config.heroSubtitle,
                                      style: const TextStyle(
                                        fontSize: 13.0,
                                        color: Color(0xFF64748B),
                                        height: 1.4,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(height: 18.0),
                            ],

                      // AI Poster Creation Card
                      Container(
                        padding: const EdgeInsets.all(16.0),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFFF7ED),
                          borderRadius: BorderRadius.circular(18.0),
                          border: Border.all(color: const Color(0xFFFED7AA), width: 1.2),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(6.0),
                                  decoration: const BoxDecoration(
                                    color: Color(0xFFEA580C),
                                    shape: BoxShape.circle,
                                  ),
                                  child: const Icon(Icons.auto_awesome_rounded, color: Colors.white, size: 16.0),
                                ),
                                const SizedBox(width: 8.0),
                                Expanded(
                                  child: Text(
                                    strings.createWithAiTitle,
                                    style: const TextStyle(
                                      fontSize: 15.5,
                                      fontWeight: FontWeight.w800,
                                      color: Color(0xFF9A3412),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8.0),
                            Text(
                              strings.createWithAiDesc,
                              style: const TextStyle(fontSize: 12.5, color: Color(0xFF7C2D12)),
                            ),
                            const SizedBox(height: 10.0),
                            Row(
                              children: [
                                Expanded(
                                  child: TextField(
                                    controller: _aiPromptController,
                                    decoration: InputDecoration(
                                      hintText: 'દા.ત. ગ્રામ સફાઈ અભિયાન...',
                                      hintStyle: const TextStyle(fontSize: 13.0, color: Color(0xFF9CA3AF)),
                                      filled: true,
                                      fillColor: Colors.white,
                                      contentPadding: const EdgeInsets.symmetric(horizontal: 14.0, vertical: 10.0),
                                      border: OutlineInputBorder(
                                        borderRadius: BorderRadius.circular(12.0),
                                        borderSide: const BorderSide(color: Color(0xFFFDBA74)),
                                      ),
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 8.0),
                                ElevatedButton(
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: const Color(0xFFEA580C),
                                    foregroundColor: Colors.white,
                                    padding: const EdgeInsets.symmetric(horizontal: 14.0, vertical: 12.0),
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12.0)),
                                  ),
                                  onPressed: () => _showAiPosterModal(context, strings),
                                  child: const Icon(Icons.arrow_forward_rounded, size: 20.0),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 18.0),

                      // Popular Categories
                      Text(
                        strings.categoriesTitle,
                        style: const TextStyle(
                          fontSize: 15.5,
                          fontWeight: FontWeight.w800,
                          color: AppColors.textNavy,
                        ),
                      ),
                      const SizedBox(height: 10.0),
                      Row(
                        children: [
                          Expanded(
                            child: _buildCategoryCard(
                              title: strings.categoryMeeting,
                              icon: Icons.groups_rounded,
                              bgColor: const Color(0xFFEFF6FF),
                              iconColor: const Color(0xFF2563EB),
                              onTap: () => _showTemplatesModal(context, strings.categoryMeeting),
                            ),
                          ),
                          const SizedBox(width: 10.0),
                          Expanded(
                            child: _buildCategoryCard(
                              title: strings.categoryDevelopment,
                              icon: Icons.agriculture_rounded,
                              bgColor: const Color(0xFFF0FDF4),
                              iconColor: const Color(0xFF16A34A),
                              onTap: () => _showTemplatesModal(context, strings.categoryDevelopment),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10.0),
                      Row(
                        children: [
                          Expanded(
                            child: _buildCategoryCard(
                              title: strings.categoryFestivals,
                              icon: Icons.celebration_rounded,
                              bgColor: const Color(0xFFFEF2F2),
                              iconColor: const Color(0xFFDC2626),
                              onTap: () => _showTemplatesModal(context, strings.categoryFestivals),
                            ),
                          ),
                          const SizedBox(width: 10.0),
                          Expanded(
                            child: _buildCategoryCard(
                              title: strings.categoryNational,
                              icon: Icons.flag_rounded,
                              bgColor: const Color(0xFFFFFBEB),
                              iconColor: const Color(0xFFD97706),
                              onTap: () => _showTemplatesModal(context, strings.categoryNational),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 22.0),

                      // All 8 Screens Navigator / Test Navigator
                      Container(
                        padding: const EdgeInsets.all(14.0),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16.0),
                          border: Border.all(color: const Color(0xFFE2E8F0)),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withValues(alpha: 0.02),
                              blurRadius: 8.0,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                const Icon(Icons.navigation_rounded, color: AppColors.primaryBlue, size: 20.0),
                                const SizedBox(width: 8.0),
                                Expanded(
                                  child: Text(
                                    strings.screenNavigatorTitle,
                                    style: const TextStyle(
                                      fontSize: 14.5,
                                      fontWeight: FontWeight.w800,
                                      color: AppColors.textNavy,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 4.0),
                            Text(
                              strings.screenNavigatorDesc,
                              style: const TextStyle(fontSize: 11.5, color: Color(0xFF64748B)),
                            ),
                            const SizedBox(height: 12.0),
                            Wrap(
                              spacing: 8.0,
                              runSpacing: 8.0,
                              children: [
                                _buildNavChip(context, '01: Splash', AppRoutes.splash),
                                _buildNavChip(context, '02: Welcome', AppRoutes.welcome),
                                _buildNavChip(context, '03: Create Account', AppRoutes.createAccount),
                                _buildNavChip(context, '04: Login', AppRoutes.login),
                                _buildNavChip(context, '05: Forgot Password', AppRoutes.forgotPassword),
                                _buildNavChip(context, '06: Recovery Status', AppRoutes.recoveryStatus),
                                _buildNavChip(context, '07: Profile Setup', AppRoutes.profileSetup),
                                _buildNavChip(context, '08: Onboarding Done', AppRoutes.onboardingConfirmation),
                                ActionChip(
                                  avatar: Icon(Icons.settings_ethernet_rounded, size: 14.0, color: primaryAccent),
                                  backgroundColor: const Color(0xFFEFF6FF),
                                  side: const BorderSide(color: Color(0xFFBFDBFE)),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8.0)),
                                  label: const Text('Admin Server URL', style: TextStyle(fontSize: 12.0, fontWeight: FontWeight.w700, color: AppColors.textNavy)),
                                  onPressed: () => _showServerConfigDialog(context),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 20.0),

                      // Session Logout Button
                      OutlinedButton.icon(
                        style: OutlinedButton.styleFrom(
                          foregroundColor: const Color(0xFFDC2626),
                          side: const BorderSide(color: Color(0xFFFCA5A5)),
                          padding: const EdgeInsets.symmetric(vertical: 12.0),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14.0)),
                        ),
                        icon: const Icon(Icons.logout_rounded, size: 18.0),
                        label: Text(
                          strings.logoutDialogTitle,
                          style: const TextStyle(fontWeight: FontWeight.w700),
                        ),
                        onPressed: () => _showLogoutDialog(context, strings),
                      ),
                      const SizedBox(height: 16.0),

                      // Legal Footer (Terms & Conditions | Privacy Policy)
                      FittedBox(
                        fit: BoxFit.scaleDown,
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            InkWell(
                              onTap: () => LegalDialogHelper.showPolicyDialog(context, isPrivacy: false),
                              child: Text(
                                strings.termsAndConditions,
                                style: const TextStyle(fontSize: 12.0, color: Color(0xFF64748B), decoration: TextDecoration.underline),
                              ),
                            ),
                            const Padding(
                              padding: EdgeInsets.symmetric(horizontal: 10.0),
                              child: Text('|', style: TextStyle(color: Color(0xFFCBD5E1))),
                            ),
                            InkWell(
                              onTap: () => LegalDialogHelper.showPolicyDialog(context, isPrivacy: true),
                              child: Text(
                                strings.privacyPolicy,
                                style: const TextStyle(fontSize: 12.0, color: Color(0xFF64748B), decoration: TextDecoration.underline),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 14.0),

                      // Village Footer Art
                      Image.asset(
                        AppAssets.welcomeVillageFooter,
                        height: 48.0,
                        width: double.infinity,
                        fit: BoxFit.cover,
                        color: const Color(0xFFE2E8F0),
                        colorBlendMode: BlendMode.srcIn,
                      ),
                      const SizedBox(height: 8.0),
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
      },
    );
  }

  Widget _buildCategoryCard({
    required String title,
    required IconData icon,
    required Color bgColor,
    required Color iconColor,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(14.0),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12.0, vertical: 14.0),
        decoration: BoxDecoration(
          color: bgColor,
          borderRadius: BorderRadius.circular(14.0),
          border: Border.all(color: iconColor.withValues(alpha: 0.2)),
        ),
        child: Row(
          children: [
            Icon(icon, color: iconColor, size: 22.0),
            const SizedBox(width: 8.0),
            Expanded(
              child: Text(
                title,
                style: TextStyle(
                  fontSize: 12.5,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textNavy,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNavChip(BuildContext context, String label, String routeName) {
    return ActionChip(
      backgroundColor: const Color(0xFFF1F5F9),
      side: const BorderSide(color: Color(0xFFCBD5E1)),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8.0)),
      label: Text(
        label,
        style: const TextStyle(fontSize: 12.0, fontWeight: FontWeight.w600, color: AppColors.textNavy),
      ),
      onPressed: () {
        Navigator.of(context).pushNamed(routeName);
      },
    );
  }
}
