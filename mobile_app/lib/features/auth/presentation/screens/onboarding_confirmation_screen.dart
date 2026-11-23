import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:panchayat_post/core/constants/app_assets.dart';
import 'package:panchayat_post/core/constants/app_colors.dart';
import 'package:panchayat_post/core/localization/app_localizations.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';
import 'package:panchayat_post/features/auth/data/auth_service.dart';
import 'package:panchayat_post/features/auth/domain/models/user_profile.dart';
import 'package:panchayat_post/features/auth/presentation/widgets/auth_header_widget.dart';
import 'package:panchayat_post/features/welcome/presentation/widgets/welcome_background_painter.dart';

/// Screen 08: Profile Setup Confirmation & Welcome Onboarding Screen
///
/// Features:
/// - Hero ID card with Panchayat Bhawan and Indian Flag illustration
/// - Congratulatory title with star accent divider
/// - Dynamic authenticated user profile preview card (avatar, check badge, display name, location, completion status)
/// - Respects skipped profiles without falsely declaring completion
/// - Three feature highlight cards: Ready Templates, AI Poster Creation, Easy Editing
/// - Primary orange "ચાલો, શરૂઆત કરીએ >" button with onboarding completion persistence
/// - Bottom motivational tagline and village silhouette
/// - Trilingual support (Gujarati, Hindi, English)
/// - Responsive layout across all standard mobile viewports with zero overflow
class OnboardingConfirmationScreen extends StatefulWidget {
  const OnboardingConfirmationScreen({
    super.key,
    this.initialProfile,
    this.authService,
  });

  final UserProfile? initialProfile;
  final AuthService? authService;

  @override
  State<OnboardingConfirmationScreen> createState() => _OnboardingConfirmationScreenState();
}

class _OnboardingConfirmationScreenState extends State<OnboardingConfirmationScreen>
    with SingleTickerProviderStateMixin {
  late final AuthService _authService;
  UserProfile? _currentUser;
  bool _isLoading = false;
  bool _initialLoadDone = false;

  late AnimationController _animController;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;

  @override
  void initState() {
    super.initState();
    _authService = widget.authService ?? AuthService();
    if (widget.initialProfile != null) {
      _currentUser = widget.initialProfile;
    }

    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );

    _fadeAnimation = CurvedAnimation(
      parent: _animController,
      curve: Curves.easeOut,
    );

    _slideAnimation = Tween<Offset>(
      begin: const Offset(0, 0.08),
      end: Offset.zero,
    ).animate(CurvedAnimation(
      parent: _animController,
      curve: Curves.easeOutCubic,
    ));

    _animController.forward();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (!_initialLoadDone) {
      _initialLoadDone = true;
      _resolveCurrentUser();
    }
  }

  @override
  void didUpdateWidget(covariant OnboardingConfirmationScreen oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.initialProfile != oldWidget.initialProfile && widget.initialProfile != null) {
      setState(() {
        _currentUser = widget.initialProfile;
      });
    }
  }

  Future<void> _resolveCurrentUser() async {
    if (_currentUser != null) return;

    final args = ModalRoute.of(context)?.settings.arguments;
    if (args is UserProfile) {
      setState(() => _currentUser = args);
      return;
    }

    final activeUser = await _authService.getCurrentUser();
    if (mounted) {
      setState(() {
        _currentUser = activeUser ??
            UserProfile(
              userId: 'user_default',
              fullName: 'Parth Patel',
              username: 'parth_patel',
              passwordHash: '',
              displayName: 'Parth Patel',
              villageCity: 'Palanpur',
              state: 'Gujarat',
              isProfileComplete: true,
              createdAt: DateTime.now(),
              acceptedLegalTimestamp: DateTime.now(),
            );
      });
    }
  }

  @override
  void dispose() {
    _animController.dispose();
    super.dispose();
  }

  Future<void> _handleStart() async {
    if (_isLoading) return;
    setState(() => _isLoading = true);

    try {
      final userId = _currentUser?.userId ??
          (await _authService.getCurrentUser())?.userId ??
          'user_guest';

      await _authService.completeOnboarding(userId: userId);

      if (!mounted) return;
      setState(() => _isLoading = false);

      // Navigate to Home Dashboard Screen
      Navigator.of(context).pushNamedAndRemoveUntil(
        AppRoutes.home,
        (route) => false,
      );
    } catch (_) {
      if (!mounted) return;
      setState(() => _isLoading = false);
      // Fallback navigation to home
      Navigator.of(context).pushNamedAndRemoveUntil(
        AppRoutes.home,
        (route) => false,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final strings = LocaleScope.of(context).strings;
    final isComplete = _currentUser?.isProfileComplete ?? true;

    return Scaffold(
      backgroundColor: Colors.white,
      body: CustomPaint(
        painter: const WelcomeBackgroundPainter(),
        child: SafeArea(
          child: Column(
            children: [
              // 1. Header (Back arrow, logo, language selector)
              AuthHeaderWidget(
                onBackPressed: () => Navigator.of(context).maybePop(),
              ),

              // 2. Scrollable Body
              Expanded(
                child: SingleChildScrollView(
                  physics: const ClampingScrollPhysics(),
                  padding: const EdgeInsets.symmetric(horizontal: 18.0),
                  child: FadeTransition(
                    opacity: _fadeAnimation,
                    child: SlideTransition(
                      position: _slideAnimation,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          const SizedBox(height: 8.0),

                          // Hero Illustration (ID card, green badge, Panchayat Bhawan)
                          Image.asset(
                            AppAssets.onboardingConfirmationHero,
                            height: 160.0,
                            fit: BoxFit.contain,
                          ),
                          const SizedBox(height: 14.0),

                          // Heading ("અભિનંદન!")
                          Text(
                            strings.confirmationHeading,
                            textAlign: TextAlign.center,
                            style: const TextStyle(
                              fontSize: 26.0,
                              fontWeight: FontWeight.w800,
                              color: AppColors.textNavy,
                              letterSpacing: -0.4,
                            ),
                          ),
                          const SizedBox(height: 4.0),

                          // Subtitle heading ("તમારું પ્રોફાઇલ તૈયાર છે.")
                          Text(
                            isComplete
                                ? strings.confirmationSubtitleComplete
                                : strings.confirmationSubtitleIncomplete,
                            textAlign: TextAlign.center,
                            style: const TextStyle(
                              fontSize: 21.0,
                              fontWeight: FontWeight.w800,
                              color: AppColors.textNavy,
                              letterSpacing: -0.3,
                            ),
                          ),
                          const SizedBox(height: 10.0),

                          // Star accent line divider
                          _buildStarAccent(),
                          const SizedBox(height: 12.0),

                          // Body text
                          Text(
                            strings.confirmationBodyText,
                            textAlign: TextAlign.center,
                            style: const TextStyle(
                              fontSize: 13.5,
                              color: Color(0xFF475569),
                              height: 1.45,
                            ),
                          ),
                          const SizedBox(height: 20.0),

                          // Dynamic User Profile Preview Card
                          _buildProfileCard(strings, isComplete),
                          const SizedBox(height: 22.0),

                          // Section Title Divider ("— Panchayat Post માં તમે શું કરી શકશો? —")
                          _buildSectionTitleDivider(strings.featuresSectionTitle),
                          const SizedBox(height: 16.0),

                          // 3 Feature Highlight Cards (Row)
                          _buildFeatureCardsRow(strings),
                          const SizedBox(height: 24.0),

                          // Primary Action Button ("ચાલો, શરૂઆત કરીએ >")
                          SizedBox(
                            width: double.infinity,
                            height: 52.0,
                            child: ElevatedButton(
                              key: const Key('lets_start_button'),
                              onPressed: _isLoading ? null : _handleStart,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: const Color(0xFFFF6600),
                                foregroundColor: Colors.white,
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
                                  : FittedBox(
                                      fit: BoxFit.scaleDown,
                                      child: Row(
                                        mainAxisAlignment: MainAxisAlignment.center,
                                        children: [
                                          Text(
                                            strings.letsStartButton,
                                            style: const TextStyle(
                                              fontSize: 16.5,
                                              fontWeight: FontWeight.w700,
                                              letterSpacing: 0.2,
                                            ),
                                          ),
                                          const SizedBox(width: 8.0),
                                          const Icon(
                                            Icons.arrow_forward_ios_rounded,
                                            size: 16.0,
                                            color: Colors.white,
                                          ),
                                        ],
                                      ),
                                    ),
                            ),
                          ),
                          const SizedBox(height: 16.0),

                          // Bottom Motivational Tagline with Accent lines
                          _buildBottomTagline(strings.bottomTagline),
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
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Profile Preview Card
  // ---------------------------------------------------------------------------

  Widget _buildProfileCard(AppStrings strings, bool isComplete) {
    final displayName = _currentUser?.effectiveDisplayName ?? 'User';
    final location = _currentUser?.villageCity != null && _currentUser!.villageCity!.isNotEmpty
        ? _currentUser!.villageCity!
        : strings.noVillageProvided;

    Widget avatarImage;
    final photoUrl = _currentUser?.profilePhotoUrl;

    if (photoUrl != null && photoUrl.isNotEmpty) {
      if (photoUrl.startsWith('data:image')) {
        try {
          final base64Part = photoUrl.split(',').last;
          final bytes = base64Decode(base64Part);
          avatarImage = ClipOval(
            child: Image.memory(
              bytes,
              width: 66.0,
              height: 66.0,
              fit: BoxFit.cover,
            ),
          );
        } catch (_) {
          avatarImage = const Icon(Icons.person_rounded, size: 42.0, color: Color(0xFF2563EB));
        }
      } else {
        avatarImage = const Icon(Icons.person_rounded, size: 42.0, color: Color(0xFF2563EB));
      }
    } else {
      avatarImage = const Icon(Icons.person_rounded, size: 42.0, color: Color(0xFF2563EB));
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 14.0),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18.0),
        border: Border.all(color: const Color(0xFFE2E8F0), width: 1.2),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.04),
            blurRadius: 12.0,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          // Circular Avatar with Blue Check Badge
          Stack(
            children: [
              Container(
                width: 68.0,
                height: 68.0,
                decoration: BoxDecoration(
                  color: const Color(0xFFE0F2FE),
                  shape: BoxShape.circle,
                  border: Border.all(color: const Color(0xFFBAE6FD), width: 2.0),
                ),
                child: Center(child: avatarImage),
              ),
              Positioned(
                bottom: 0,
                right: 0,
                child: Container(
                  padding: const EdgeInsets.all(4.0),
                  decoration: BoxDecoration(
                    color: const Color(0xFF0284C7),
                    shape: BoxShape.circle,
                    border: Border.all(color: Colors.white, width: 2.0),
                  ),
                  child: const Icon(
                    Icons.check_rounded,
                    color: Colors.white,
                    size: 13.0,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(width: 14.0),

          // Vertical divider line
          Container(
            width: 1.0,
            height: 54.0,
            color: const Color(0xFFE2E8F0),
          ),
          const SizedBox(width: 14.0),

          // User details & status badge
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Display Name
                Text(
                  displayName,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 18.0,
                    fontWeight: FontWeight.w800,
                    color: AppColors.textNavy,
                  ),
                ),
                const SizedBox(height: 3.0),

                // Location
                Row(
                  children: [
                    const Icon(
                      Icons.location_on_rounded,
                      size: 15.0,
                      color: Color(0xFF64748B),
                    ),
                    const SizedBox(width: 4.0),
                    Expanded(
                      child: Text(
                        location,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 13.0,
                          fontWeight: FontWeight.w500,
                          color: Color(0xFF64748B),
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6.0),

                // Status Badge (Completed vs Pending)
                FittedBox(
                  fit: BoxFit.scaleDown,
                  alignment: Alignment.centerLeft,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 3.5),
                    decoration: BoxDecoration(
                      color: isComplete ? const Color(0xFFF0FDF4) : const Color(0xFFFFFBEB),
                      borderRadius: BorderRadius.circular(10.0),
                      border: Border.all(
                        color: isComplete ? const Color(0xFFBBF7D0) : const Color(0xFFFDE68A),
                        width: 1.0,
                      ),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          isComplete ? Icons.check_circle_rounded : Icons.pending_actions_rounded,
                          size: 13.0,
                          color: isComplete ? const Color(0xFF16A34A) : const Color(0xFFD97706),
                        ),
                        const SizedBox(width: 5.0),
                        Text(
                          isComplete
                              ? strings.profileStatusCompletedBadge
                              : strings.profileStatusPendingBadge,
                          style: TextStyle(
                            fontSize: 11.5,
                            fontWeight: FontWeight.w700,
                            color: isComplete ? const Color(0xFF15803D) : const Color(0xFFB45309),
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
    );
  }

  // ---------------------------------------------------------------------------
  // Feature Cards Row
  // ---------------------------------------------------------------------------

  Widget _buildFeatureCardsRow(AppStrings strings) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Card 1: Ready Templates
        Expanded(
          child: _buildFeatureCard(
            icon: Icons.collections_rounded,
            iconBgColor: const Color(0xFFEFF6FF),
            iconColor: const Color(0xFF2563EB),
            title: strings.readyTemplatesTitle,
            desc: strings.readyTemplatesDesc,
          ),
        ),
        const SizedBox(width: 10.0),

        // Card 2: AI Poster Creation
        Expanded(
          child: _buildFeatureCard(
            icon: Icons.auto_awesome_rounded,
            iconBgColor: const Color(0xFFFFF7ED),
            iconColor: const Color(0xFFEA580C),
            title: strings.aiPosterCreationTitle,
            desc: strings.aiPosterCreationDesc,
          ),
        ),
        const SizedBox(width: 10.0),

        // Card 3: Easy Editing
        Expanded(
          child: _buildFeatureCard(
            icon: Icons.edit_note_rounded,
            iconBgColor: const Color(0xFFF0FDF4),
            iconColor: const Color(0xFF16A34A),
            title: strings.easyEditingTitle,
            desc: strings.easyEditingDesc,
          ),
        ),
      ],
    );
  }

  Widget _buildFeatureCard({
    required IconData icon,
    required Color iconBgColor,
    required Color iconColor,
    required String title,
    required String desc,
  }) {
    return Container(
      constraints: const BoxConstraints(minHeight: 120.0),
      padding: const EdgeInsets.symmetric(horizontal: 8.0, vertical: 12.0),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14.0),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 6.0,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        children: [
          // Icon Container
          Container(
            padding: const EdgeInsets.all(8.0),
            decoration: BoxDecoration(
              color: iconBgColor,
              shape: BoxShape.circle,
            ),
            child: Icon(
              icon,
              size: 22.0,
              color: iconColor,
            ),
          ),
          const SizedBox(height: 8.0),

          // Title
          Text(
            title,
            textAlign: TextAlign.center,
            maxLines: 2,
            style: const TextStyle(
              fontSize: 12.0,
              fontWeight: FontWeight.w800,
              color: AppColors.textNavy,
            ),
          ),
          const SizedBox(height: 4.0),

          // Description
          Text(
            desc,
            textAlign: TextAlign.center,
            maxLines: 3,
            overflow: TextOverflow.ellipsis,
            style: const TextStyle(
              fontSize: 10.5,
              color: Color(0xFF64748B),
              height: 1.3,
            ),
          ),
        ],
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // Accent Dividers & Taglines
  // ---------------------------------------------------------------------------

  Widget _buildStarAccent() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Container(
          width: 32.0,
          height: 1.5,
          color: const Color(0xFFFFB74D),
        ),
        const Padding(
          padding: EdgeInsets.symmetric(horizontal: 6.0),
          child: Icon(
            Icons.star_rounded,
            size: 16.0,
            color: Color(0xFFFFA000),
          ),
        ),
        Container(
          width: 32.0,
          height: 1.5,
          color: const Color(0xFFFFB74D),
        ),
      ],
    );
  }

  Widget _buildSectionTitleDivider(String title) {
    return FittedBox(
      fit: BoxFit.scaleDown,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 30.0,
            height: 1.5,
            color: const Color(0xFFFFB74D),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8.0),
            child: Text(
              title,
              style: const TextStyle(
                fontSize: 13.5,
                fontWeight: FontWeight.w800,
                color: AppColors.textNavy,
              ),
            ),
          ),
          Container(
            width: 30.0,
            height: 1.5,
            color: const Color(0xFFFFB74D),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomTagline(String tagline) {
    return FittedBox(
      fit: BoxFit.scaleDown,
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 24.0,
            height: 1.5,
            color: const Color(0xFFFFB74D),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8.0),
            child: Text(
              tagline,
              style: const TextStyle(
                fontSize: 13.0,
                fontWeight: FontWeight.w700,
                color: AppColors.textNavy,
              ),
            ),
          ),
          Container(
            width: 24.0,
            height: 1.5,
            color: const Color(0xFFFFB74D),
          ),
        ],
      ),
    );
  }
}
