import 'package:flutter/material.dart';
import 'package:panchayat_post/core/constants/app_assets.dart';
import 'package:panchayat_post/core/constants/app_colors.dart';
import 'package:panchayat_post/core/localization/app_localizations.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';
import 'package:panchayat_post/core/widgets/legal_dialog_helper.dart';
import 'package:panchayat_post/features/auth/data/auth_service.dart';
import 'package:panchayat_post/features/auth/domain/models/recovery_request.dart';
import 'package:panchayat_post/features/auth/presentation/widgets/auth_header_widget.dart';
import 'package:panchayat_post/features/welcome/presentation/widgets/welcome_background_painter.dart';

/// Screen 06: Account Recovery Request Status & Confirmation Screen
///
/// Displays real-time status of the submitted password recovery request,
/// including unique Request ID, masked username, submitted date, current status pill badge,
/// an interactive 3-step progress timeline, Help Center contact actions, and navigation.
class RecoveryStatusScreen extends StatefulWidget {
  const RecoveryStatusScreen({
    super.key,
    this.initialRequest,
    this.authService,
  });

  final RecoveryRequest? initialRequest;
  final AuthService? authService;

  @override
  State<RecoveryStatusScreen> createState() => _RecoveryStatusScreenState();
}

class _RecoveryStatusScreenState extends State<RecoveryStatusScreen> {
  late final AuthService _authService;
  RecoveryRequest? _request;
  bool _isLoading = false;
  DateTime _lastUpdated = DateTime.now();
  bool _initialLoadDone = false;

  @override
  void initState() {
    super.initState();
    _authService = widget.authService ?? AuthService();
    if (widget.initialRequest != null) {
      _request = widget.initialRequest;
    }
  }

  @override
  void didUpdateWidget(covariant RecoveryStatusScreen oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.initialRequest != oldWidget.initialRequest && widget.initialRequest != null) {
      setState(() {
        _request = widget.initialRequest;
        _lastUpdated = DateTime.now();
      });
    }
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (!_initialLoadDone) {
      _initialLoadDone = true;
      _resolveInitialRequest();
    }
  }

  Future<void> _resolveInitialRequest() async {
    if (_request != null) return;

    final args = ModalRoute.of(context)?.settings.arguments;
    if (args is RecoveryRequest) {
      setState(() {
        _request = args;
        _lastUpdated = DateTime.now();
      });
      return;
    }

    if (args is String && args.isNotEmpty) {
      setState(() => _isLoading = true);
      final found = await _authService.getRecoveryRequest(args);
      if (mounted) {
        setState(() {
          _request = found ?? _buildDefaultPendingRequest();
          _isLoading = false;
          _lastUpdated = DateTime.now();
        });
      }
      return;
    }

    // Try finding the latest stored request
    final latest = await _authService.getLatestRecoveryRequest();
    if (mounted) {
      setState(() {
        _request = latest ?? _buildDefaultPendingRequest();
        _lastUpdated = DateTime.now();
      });
    }
  }

  RecoveryRequest _buildDefaultPendingRequest() {
    return RecoveryRequest(
      referenceId: 'REC-2026-08142',
      username: 'sarpanch_ramesh',
      createdAt: DateTime.now(),
      status: 'Under Review',
    );
  }

  Future<void> _refreshStatus() async {
    if (_isLoading) return;

    final strings = LocaleScope.of(context).strings;
    setState(() => _isLoading = true);

    try {
      if (_request != null) {
        final updated = await _authService.getRecoveryRequest(_request!.referenceId);
        if (mounted) {
          setState(() {
            if (updated != null) {
              _request = updated;
            }
            _isLoading = false;
            _lastUpdated = DateTime.now();
          });
        }
      } else {
        await _resolveInitialRequest();
        if (mounted) {
          setState(() {
            _isLoading = false;
            _lastUpdated = DateTime.now();
          });
        }
      }
    } catch (_) {
      if (!mounted) return;
      setState(() => _isLoading = false);
      ScaffoldMessenger.of(context).removeCurrentSnackBar();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(strings.networkOrServerError),
          backgroundColor: const Color(0xFFEF4444),
          duration: const Duration(seconds: 2),
        ),
      );
    }
  }

  String _formatDate(DateTime dt) {
    final day = dt.day.toString().padLeft(2, '0');
    final month = dt.month.toString().padLeft(2, '0');
    final year = dt.year.toString();
    return '$day/$month/$year';
  }

  String _formatTime(DateTime dt) {
    final hour = dt.hour % 12 == 0 ? 12 : dt.hour % 12;
    final minute = dt.minute.toString().padLeft(2, '0');
    final period = dt.hour >= 12 ? 'PM' : 'AM';
    return '$hour:$minute $period';
  }

  void _showSupportDialog(BuildContext context, AppStrings strings) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20.0),
        ),
        title: Row(
          children: [
            const Icon(
              Icons.support_agent_rounded,
              color: AppColors.accentOrange,
              size: 28.0,
            ),
            const SizedBox(width: 10.0),
            Expanded(
              child: Text(
                strings.supportContactDetailsTitle,
                style: const TextStyle(
                  fontSize: 17.0,
                  fontWeight: FontWeight.w800,
                  color: AppColors.textNavy,
                ),
              ),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              strings.supportContactDetailsBody,
              style: const TextStyle(
                fontSize: 13.5,
                color: Color(0xFF334155),
                height: 1.45,
              ),
            ),
            const SizedBox(height: 14.0),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12.0),
              decoration: BoxDecoration(
                color: const Color(0xFFFFF7ED),
                borderRadius: BorderRadius.circular(10.0),
                border: Border.all(color: const Color(0xFFFFEDD5)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '${strings.requestIdLabel} ${_request?.referenceId ?? '—'}',
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 13.0,
                      color: AppColors.textNavy,
                    ),
                  ),
                  const SizedBox(height: 4.0),
                  Text(
                    'Helpline: ${_request?.supportHelpline ?? '1800-123-7262'}',
                    style: const TextStyle(
                      fontSize: 12.5,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFFC2410C),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text(
              'બંધ કરો (Close)',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                color: AppColors.primaryBlue,
              ),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final strings = LocaleScope.of(context).strings;
    final currentStatus = _request?.status ?? 'Under Review';

    return Scaffold(
      backgroundColor: Colors.white,
      body: CustomPaint(
        painter: const WelcomeBackgroundPainter(),
        child: SafeArea(
          child: Column(
            children: [
              // 1. Header (Back, Logo, Language Selector)
              AuthHeaderWidget(
                onBackPressed: () => Navigator.of(context).maybePop(),
              ),

              // 2. Scrollable Body with Pull-to-Refresh
              Expanded(
                child: RefreshIndicator(
                  color: AppColors.primaryBlue,
                  onRefresh: _refreshStatus,
                  child: SingleChildScrollView(
                    physics: const AlwaysScrollableScrollPhysics(
                      parent: ClampingScrollPhysics(),
                    ),
                    padding: const EdgeInsets.symmetric(horizontal: 18.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        const SizedBox(height: 10.0),

                        // Hero Illustration
                        Image.asset(
                          AppAssets.recoveryStatusHero,
                          height: 120.0,
                          fit: BoxFit.contain,
                        ),
                        const SizedBox(height: 14.0),

                        // Heading ("તમારી વિનંતી મળી ગઈ!")
                        Text(
                          strings.recoveryStatusHeading,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontSize: 24.0,
                            fontWeight: FontWeight.w800,
                            color: AppColors.textNavy,
                            letterSpacing: -0.4,
                          ),
                        ),
                        const SizedBox(height: 10.0),

                        // Subtitle
                        Text(
                          strings.recoveryStatusSubheading,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontSize: 13.0,
                            color: Color(0xFF475569),
                            height: 1.4,
                          ),
                        ),
                        const SizedBox(height: 20.0),

                        // Request Details Card
                        _buildDetailsCard(strings, currentStatus),
                        const SizedBox(height: 16.0),

                        // 3-Step Progress Timeline Tracker
                        _buildTimelineCard(strings, currentStatus),
                        const SizedBox(height: 16.0),

                        // Amber Notice/Help Banner
                        _buildNoticeBanner(strings),
                        const SizedBox(height: 12.0),

                        // Last Updated Timestamp & Refresh
                        FittedBox(
                          fit: BoxFit.scaleDown,
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                '${strings.lastUpdatedLabel}: ${_formatTime(_lastUpdated)}',
                                style: const TextStyle(
                                  fontSize: 12.0,
                                  color: Color(0xFF64748B),
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                              if (_isLoading) ...[
                                const SizedBox(width: 8.0),
                                const SizedBox(
                                  width: 12.0,
                                  height: 12.0,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2.0,
                                    color: AppColors.primaryBlue,
                                  ),
                                ),
                              ],
                            ],
                          ),
                        ),
                        const SizedBox(height: 16.0),

                        // Primary Action Button ("🎧 સપોર્ટનો સંપર્ક કરો")
                        SizedBox(
                          width: double.infinity,
                          height: 52.0,
                          child: ElevatedButton(
                            key: const Key('contact_support_button'),
                            onPressed: () => _showSupportDialog(context, strings),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFFFF6600),
                              foregroundColor: Colors.white,
                              elevation: 2.0,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(26.0),
                              ),
                            ),
                            child: FittedBox(
                              fit: BoxFit.scaleDown,
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  const Icon(
                                    Icons.headset_mic_rounded,
                                    size: 22.0,
                                    color: Colors.white,
                                  ),
                                  const SizedBox(width: 8.0),
                                  Text(
                                    strings.contactSupportButton,
                                    style: const TextStyle(
                                      fontSize: 16.5,
                                      fontWeight: FontWeight.w700,
                                      letterSpacing: 0.2,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(height: 12.0),

                        // Secondary Action Button ("➔ Login સ્ક્રીન પર જાઓ")
                        SizedBox(
                          width: double.infinity,
                          height: 52.0,
                          child: OutlinedButton(
                            key: const Key('go_to_login_button'),
                            onPressed: () {
                              Navigator.of(context).pushNamedAndRemoveUntil(
                                AppRoutes.login,
                                (route) => false,
                              );
                            },
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
                            child: FittedBox(
                              fit: BoxFit.scaleDown,
                              child: Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  const Icon(
                                    Icons.login_rounded,
                                    size: 22.0,
                                    color: AppColors.textNavy,
                                  ),
                                  const SizedBox(width: 8.0),
                                  Text(
                                    strings.goToLoginScreenButton,
                                    style: const TextStyle(
                                      fontSize: 16.0,
                                      fontWeight: FontWeight.w700,
                                      color: AppColors.textNavy,
                                      letterSpacing: 0.2,
                                    ),
                                  ),
                                ],
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
                              GestureDetector(
                                onTap: () => LegalDialogHelper.showPolicyDialog(
                                  context,
                                  isPrivacy: true,
                                ),
                                child: Text(
                                  strings.privacyPolicy,
                                  style: const TextStyle(
                                    fontSize: 12.0,
                                    color: Color(0xFF64748B),
                                    fontWeight: FontWeight.w500,
                                  ),
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
                              GestureDetector(
                                onTap: () => LegalDialogHelper.showPolicyDialog(
                                  context,
                                  isPrivacy: false,
                                ),
                                child: Text(
                                  strings.termsAndConditions,
                                  style: const TextStyle(
                                    fontSize: 12.0,
                                    color: Color(0xFF64748B),
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 16.0),

                        // Village Silhouette Art
                        Image.asset(
                          AppAssets.villageSilhouette,
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

  /// Request Details Card (Request ID, Username, Date, Status badge)
  Widget _buildDetailsCard(AppStrings strings, String currentStatus) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 14.0),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16.0),
        border: Border.all(color: const Color(0xFFE2E8F0), width: 1.0),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 10.0,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          // Row 1: Request ID
          _buildDetailRow(
            icon: Icons.description_outlined,
            label: strings.requestIdLabel,
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  _request?.referenceId ?? '—',
                  style: const TextStyle(
                    fontSize: 13.5,
                    fontWeight: FontWeight.w800,
                    color: AppColors.textNavy,
                    letterSpacing: 0.3,
                  ),
                ),
                const SizedBox(width: 4.0),
                IconButton(
                  tooltip: strings.refreshStatusTooltip,
                  icon: const Icon(
                    Icons.refresh_rounded,
                    size: 18.0,
                    color: Color(0xFFF97316),
                  ),
                  padding: EdgeInsets.zero,
                  constraints: const BoxConstraints(),
                  onPressed: _refreshStatus,
                ),
              ],
            ),
          ),
          const Divider(height: 18.0, color: Color(0xFFF1F5F9)),

          // Row 2: Masked Username
          _buildDetailRow(
            icon: Icons.person_outline_rounded,
            label: strings.usernameRowLabel,
            child: Text(
              _request?.maskedUsername ?? '••••',
              style: const TextStyle(
                fontSize: 14.0,
                fontWeight: FontWeight.w700,
                color: AppColors.textNavy,
              ),
            ),
          ),
          const Divider(height: 18.0, color: Color(0xFFF1F5F9)),

          // Row 3: Submitted Date
          _buildDetailRow(
            icon: Icons.calendar_today_outlined,
            label: strings.submittedDateLabel,
            child: Text(
              _request != null ? _formatDate(_request!.createdAt) : '—',
              style: const TextStyle(
                fontSize: 13.5,
                fontWeight: FontWeight.w600,
                color: Color(0xFF334155),
              ),
            ),
          ),
          const Divider(height: 18.0, color: Color(0xFFF1F5F9)),

          // Row 4: Current Status Pill
          _buildDetailRow(
            icon: Icons.info_outline_rounded,
            label: strings.currentStatusLabel,
            child: _buildStatusBadge(currentStatus, strings),
          ),
        ],
      ),
    );
  }

  Widget _buildDetailRow({
    required IconData icon,
    required String label,
    required Widget child,
  }) {
    return Row(
      children: [
        Icon(
          icon,
          size: 18.0,
          color: const Color(0xFFEA580C),
        ),
        const SizedBox(width: 8.0),
        Expanded(
          child: Text(
            label,
            style: const TextStyle(
              fontSize: 13.0,
              fontWeight: FontWeight.w600,
              color: Color(0xFF475569),
            ),
          ),
        ),
        FittedBox(
          fit: BoxFit.scaleDown,
          child: child,
        ),
      ],
    );
  }

  /// Status Badge Pill with colors mapped per backend status
  Widget _buildStatusBadge(String status, AppStrings strings) {
    Color bg;
    Color border;
    Color text;
    String label;

    switch (status.toLowerCase()) {
      case 'submitted':
        bg = const Color(0xFFEFF6FF);
        border = const Color(0xFFBFDBFE);
        text = const Color(0xFF1D4ED8);
        label = strings.statusSubmitted;
        break;
      case 'under review':
      case 'review':
        bg = const Color(0xFFFFF7ED);
        border = const Color(0xFFFFEDD5);
        text = const Color(0xFFC2410C);
        label = strings.statusUnderReview;
        break;
      case 'additional information required':
      case 'info required':
        bg = const Color(0xFFFEF9C3);
        border = const Color(0xFFFDE047);
        text = const Color(0xFFA16207);
        label = strings.statusAdditionalInfoRequired;
        break;
      case 'resolved':
        bg = const Color(0xFFF0FDF4);
        border = const Color(0xFFBBF7D0);
        text = const Color(0xFF15803D);
        label = strings.statusResolved;
        break;
      case 'rejected':
        bg = const Color(0xFFFEF2F2);
        border = const Color(0xFFFECACA);
        text = const Color(0xFFB91C1C);
        label = strings.statusRejected;
        break;
      default:
        bg = const Color(0xFFFFF7ED);
        border = const Color(0xFFFFEDD5);
        text = const Color(0xFFC2410C);
        label = strings.statusUnderReview;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 4.5),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(12.0),
        border: Border.all(color: border, width: 1.0),
      ),
      child: Text(
        label,
        style: TextStyle(
          fontSize: 12.0,
          fontWeight: FontWeight.w700,
          color: text,
        ),
      ),
    );
  }

  /// 3-Step Progress Timeline Card
  Widget _buildTimelineCard(AppStrings strings, String currentStatus) {
    final statusLower = currentStatus.toLowerCase();
    final isSubmitted = true; // Step 1 is always completed once request exists
    final isReviewActive = statusLower == 'under review' ||
        statusLower == 'additional information required';
    final isResolved = statusLower == 'resolved';
    final isRejected = statusLower == 'rejected';

    return Container(
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16.0),
        border: Border.all(color: const Color(0xFFE2E8F0), width: 1.0),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 10.0,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          // Step 1: વિનંતી પ્રાપ્ત થઈ (Request Received)
          _buildTimelineStep(
            isCompleted: isSubmitted,
            isActive: false,
            isLast: false,
            title: strings.timelineStep1Title,
            subtitle: strings.timelineStep1Subtitle,
          ),

          // Step 2: તપાસ ચાલુ છે (Review in Progress)
          _buildTimelineStep(
            isCompleted: isResolved,
            isActive: isReviewActive,
            isRejected: isRejected,
            isLast: false,
            title: strings.timelineStep2Title,
            subtitle: strings.timelineStep2Subtitle,
          ),

          // Step 3: આગળની કાર્યવાહી (Next Action)
          _buildTimelineStep(
            isCompleted: isResolved,
            isActive: false,
            isLast: true,
            title: strings.timelineStep3Title,
            subtitle: strings.timelineStep3Subtitle,
          ),
        ],
      ),
    );
  }

  Widget _buildTimelineStep({
    required bool isCompleted,
    required bool isActive,
    bool isRejected = false,
    required bool isLast,
    required String title,
    required String subtitle,
  }) {
    Widget indicator;
    Color lineColor = const Color(0xFFCBD5E1);

    if (isCompleted) {
      indicator = Container(
        width: 24.0,
        height: 24.0,
        decoration: const BoxDecoration(
          color: Color(0xFFFF6600),
          shape: BoxShape.circle,
        ),
        child: const Icon(
          Icons.check_rounded,
          color: Colors.white,
          size: 16.0,
        ),
      );
      lineColor = const Color(0xFFFF6600);
    } else if (isActive) {
      indicator = Container(
        width: 24.0,
        height: 24.0,
        decoration: BoxDecoration(
          color: Colors.white,
          shape: BoxShape.circle,
          border: Border.all(color: const Color(0xFFFF6600), width: 2.5),
        ),
        child: Center(
          child: Container(
            width: 8.0,
            height: 8.0,
            decoration: const BoxDecoration(
              color: Color(0xFFFF6600),
              shape: BoxShape.circle,
            ),
          ),
        ),
      );
    } else if (isRejected) {
      indicator = Container(
        width: 24.0,
        height: 24.0,
        decoration: const BoxDecoration(
          color: Color(0xFFEF4444),
          shape: BoxShape.circle,
        ),
        child: const Icon(
          Icons.close_rounded,
          color: Colors.white,
          size: 16.0,
        ),
      );
    } else {
      // Pending step matching the reference image's hollow gray ring
      indicator = Container(
        width: 24.0,
        height: 24.0,
        decoration: BoxDecoration(
          color: Colors.white,
          shape: BoxShape.circle,
          border: Border.all(color: const Color(0xFFCBD5E1), width: 2.0),
        ),
      );
    }

    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Indicator column with vertical connecting line
          Column(
            children: [
              indicator,
              if (!isLast)
                Expanded(
                  child: Container(
                    width: 2.0,
                    margin: const EdgeInsets.symmetric(vertical: 4.0),
                    color: lineColor,
                  ),
                ),
            ],
          ),
          const SizedBox(width: 14.0),

          // Title & Subtitle column
          Expanded(
            child: Padding(
              padding: EdgeInsets.only(bottom: isLast ? 0.0 : 18.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 14.5,
                      fontWeight: FontWeight.w700,
                      color: AppColors.textNavy,
                    ),
                  ),
                  const SizedBox(height: 3.0),
                  Text(
                    subtitle,
                    style: const TextStyle(
                      fontSize: 12.5,
                      color: Color(0xFF64748B),
                      height: 1.35,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  /// Amber Notice / Help Banner
  Widget _buildNoticeBanner(AppStrings strings) {
    return Container(
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
              strings.recoveryNoticeBanner,
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
    );
  }
}
