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
import 'package:panchayat_post/features/auth/presentation/widgets/auth_text_field.dart';
import 'package:panchayat_post/features/welcome/presentation/widgets/welcome_background_painter.dart';

/// Screen 05: Forgot Password / Account Recovery Screen.
/// Provides a secure, genuine recovery request workflow without exposing account existence.
/// Enforces rate limiting, generates official trackable reference IDs, provides Panchayat
/// administrator support channels, and supports multi-language switching.
class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({
    super.key,
    this.authService,
    this.autoNavigateToStatus = true,
  });

  final AuthService? authService;
  final bool autoNavigateToStatus;

  @override
  State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  final _formKey = GlobalKey<FormState>();
  final _usernameController = TextEditingController();

  late final AuthService _authService;

  bool _isLoading = false;
  RecoveryRequest? _submittedRequest;

  @override
  void initState() {
    super.initState();
    _authService = widget.authService ?? AuthService();
    _usernameController.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    _usernameController.dispose();
    super.dispose();
  }

  void _showSupportDialog() {
    final strings = LocaleScope.of(context).strings;

    showDialog<void>(
      context: context,
      builder: (dialogCtx) {
        return AlertDialog(
          backgroundColor: Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18.0)),
          title: Row(
            children: [
              const Icon(
                Icons.headset_mic_rounded,
                color: AppColors.primaryBlue,
                size: 24,
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  strings.supportContactDetailsTitle,
                  style: const TextStyle(
                    fontSize: 17.0,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textNavy,
                  ),
                ),
              ),
            ],
          ),
          content: SingleChildScrollView(
            child: Text(
              strings.supportContactDetailsBody,
              style: const TextStyle(
                fontSize: 13.5,
                color: AppColors.textSlate,
                height: 1.45,
              ),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(dialogCtx),
              child: const Text(
                'Close',
                style: TextStyle(
                  color: AppColors.primaryBlue,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          ],
        );
      },
    );
  }

  Future<void> _handleRecoveryRequest() async {
    // Dismiss keyboard
    FocusScope.of(context).unfocus();

    if (!_formKey.currentState!.validate()) return;

    final strings = LocaleScope.of(context).strings;

    setState(() => _isLoading = true);

    try {
      final request = await _authService.submitRecoveryRequest(
        username: _usernameController.text.trim(),
      );

      if (!mounted) return;
      setState(() {
        _isLoading = false;
        _submittedRequest = request;
      });

      ScaffoldMessenger.of(context).removeCurrentSnackBar();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(strings.recoveryRequestSubmitted),
          backgroundColor: const Color(0xFF16A34A),
          duration: const Duration(seconds: 3),
        ),
      );

      // Navigate to Screen 06 passing the genuine RecoveryRequest response
      if (widget.autoNavigateToStatus) {
        Navigator.of(context).pushNamed(
          AppRoutes.recoveryStatus,
          arguments: request,
        );
      }
    } on AuthException catch (e) {
      if (!mounted) return;
      setState(() => _isLoading = false);

      String errorMsg = e.message;
      if (e.message.contains('Too many recovery requests')) {
        errorMsg = strings.rateLimitError;
      }

      ScaffoldMessenger.of(context).removeCurrentSnackBar();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(errorMsg),
          backgroundColor: const Color(0xFFEF4444),
        ),
      );
    } catch (_) {
      if (!mounted) return;
      setState(() => _isLoading = false);

      ScaffoldMessenger.of(context).removeCurrentSnackBar();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(strings.networkOrServerError),
          backgroundColor: const Color(0xFFEF4444),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final strings = LocaleScope.of(context).strings;

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

              // 2. Scrollable Content Area
              Expanded(
                child: SingleChildScrollView(
                  keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
                  physics: const ClampingScrollPhysics(),
                  padding: const EdgeInsets.symmetric(horizontal: 18.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      const SizedBox(height: 10.0),

                      // Hero Illustration
                      Image.asset(
                        AppAssets.forgotPasswordHero,
                        height: 100.0,
                        fit: BoxFit.contain,
                      ),
                      const SizedBox(height: 14.0),

                      // Heading with curved brush underline
                      Column(
                        children: [
                          Text(
                            strings.forgotPasswordHeading,
                            textAlign: TextAlign.center,
                            style: const TextStyle(
                              fontSize: 24.0,
                              fontWeight: FontWeight.w800,
                              color: AppColors.textNavy,
                              letterSpacing: -0.4,
                            ),
                          ),
                          const SizedBox(height: 4.0),
                          CustomPaint(
                            size: const Size(120, 6),
                            painter: _CurvedUnderlinePainter(),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10.0),

                      // Subtitle
                      Text(
                        strings.forgotPasswordSubheading,
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          fontSize: 13.0,
                          color: Color(0xFF475569),
                          height: 1.35,
                        ),
                      ),
                      const SizedBox(height: 22.0),

                      // Toggle between Form and Confirmation Card
                      if (_submittedRequest == null)
                        _buildRecoveryForm(strings)
                      else
                        _buildConfirmationCard(strings),

                      const SizedBox(height: 20.0),

                      // Need more help Divider
                      Row(
                        children: [
                          const Expanded(
                            child: Divider(color: Color(0xFFE2E8F0), thickness: 1.0),
                          ),
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 10.0),
                            child: Text(
                              strings.needMoreHelpDivider,
                              style: const TextStyle(
                                fontSize: 13.5,
                                fontWeight: FontWeight.w500,
                                color: Color(0xFF64748B),
                              ),
                            ),
                          ),
                          const Expanded(
                            child: Divider(color: Color(0xFFE2E8F0), thickness: 1.0),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6.0),

                      // Contact Support Link with orange underline
                      GestureDetector(
                        onTap: _showSupportDialog,
                        child: Padding(
                          padding: const EdgeInsets.symmetric(vertical: 4.0),
                          child: Text(
                            strings.contactSupportAction,
                            style: const TextStyle(
                              fontSize: 16.0,
                              fontWeight: FontWeight.w800,
                              color: AppColors.primaryBlue,
                              decoration: TextDecoration.underline,
                              decorationColor: AppColors.accentOrange,
                              decorationThickness: 2.5,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 14.0),

                      // Secondary Action: Return to Login Button ("← Login પર પાછા જાઓ")
                      SizedBox(
                        width: double.infinity,
                        height: 50.0,
                        child: OutlinedButton(
                          onPressed: () {
                            Navigator.of(context).pushReplacementNamed(AppRoutes.login);
                          },
                          style: OutlinedButton.styleFrom(
                            foregroundColor: AppColors.textNavy,
                            side: const BorderSide(color: Color(0xFF0D1B3E), width: 1.2),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(25.0),
                            ),
                          ),
                          child: FittedBox(
                            fit: BoxFit.scaleDown,
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                const Icon(Icons.arrow_back_rounded, size: 18.0),
                                const SizedBox(width: 8.0),
                                Text(
                                  strings.backToLoginButton,
                                  style: const TextStyle(
                                    fontSize: 15.0,
                                    fontWeight: FontWeight.w700,
                                    color: AppColors.textNavy,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 18.0),

                      // Village Silhouette Footer Illustration
                      Image.asset(
                        AppAssets.welcomeVillageFooter,
                        fit: BoxFit.contain,
                        width: double.infinity,
                        height: 70.0,
                      ),
                      const SizedBox(height: 4.0),

                      // Legal Footer (Terms & Conditions | Privacy Policy)
                      Padding(
                        padding: const EdgeInsets.symmetric(vertical: 6.0),
                        child: FittedBox(
                          fit: BoxFit.scaleDown,
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              InkWell(
                                onTap: () => LegalDialogHelper.showPolicyDialog(
                                  context,
                                  isPrivacy: false,
                                ),
                                borderRadius: BorderRadius.circular(4.0),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    const Icon(
                                      Icons.article_outlined,
                                      size: 14.0,
                                      color: AppColors.textSlate,
                                    ),
                                    const SizedBox(width: 4.0),
                                    Text(
                                      strings.termsAndConditions,
                                      style: const TextStyle(
                                        fontSize: 12.0,
                                        fontWeight: FontWeight.w500,
                                        color: AppColors.textSlate,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              const Padding(
                                padding: EdgeInsets.symmetric(horizontal: 8.0),
                                child: Text(
                                  '|',
                                  style: TextStyle(
                                    color: Color(0xFFD1D5DB),
                                    fontSize: 12.0,
                                  ),
                                ),
                              ),
                              InkWell(
                                onTap: () => LegalDialogHelper.showPolicyDialog(
                                  context,
                                  isPrivacy: true,
                                ),
                                borderRadius: BorderRadius.circular(4.0),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    const Icon(
                                      Icons.verified_user_outlined,
                                      size: 14.0,
                                      color: AppColors.textSlate,
                                    ),
                                    const SizedBox(width: 4.0),
                                    Text(
                                      strings.privacyPolicy,
                                      style: const TextStyle(
                                        fontSize: 12.0,
                                        fontWeight: FontWeight.w500,
                                        color: AppColors.textSlate,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 8.0),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildRecoveryForm(AppStrings strings) {
    return Form(
      key: _formKey,
      child: Column(
        children: [
          // Username Input Field
          AuthTextField(
            label: strings.recoveryUsernameLabel,
            hintText: strings.recoveryUsernameHint,
            controller: _usernameController,
            textInputAction: TextInputAction.done,
            labelIcon: const Icon(
              Icons.person_rounded,
              size: 16.0,
              color: AppColors.textNavy,
            ),
            prefixWidget: const Icon(
              Icons.person_outline_rounded,
              color: AppColors.textNavy,
              size: 20.0,
            ),
            suffixWidget: _usernameController.text.isNotEmpty
                ? IconButton(
                    icon: const Icon(Icons.clear_rounded, size: 18.0, color: Color(0xFF94A3B8)),
                    onPressed: () {
                      _usernameController.clear();
                      setState(() {});
                    },
                  )
                : null,
            helperText: strings.recoveryUsernameHelper,
            validator: (val) {
              if (val == null || val.trim().isEmpty) {
                return strings.recoveryUsernameRequired;
              }
              final clean = val.trim();
              if (clean.length < 3) {
                return strings.usernameLengthError;
              }
              if (!AuthService.isUsernameFormatValid(clean)) {
                return strings.usernameInvalidFormatError;
              }
              return null;
            },
          ),
          const SizedBox(height: 16.0),

          // Informative Blue Card matching reference
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14.0, vertical: 12.0),
            decoration: BoxDecoration(
              color: const Color(0xFFEFF6FF),
              borderRadius: BorderRadius.circular(12.0),
              border: Border.all(color: const Color(0xFFD6E4FF), width: 1.0),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Icon(
                  Icons.info_rounded,
                  color: AppColors.primaryBlue,
                  size: 22.0,
                ),
                const SizedBox(width: 10.0),
                Expanded(
                  child: Text(
                    strings.recoveryInfoBanner,
                    style: const TextStyle(
                      fontSize: 12.5,
                      color: Color(0xFF1E293B),
                      height: 1.4,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20.0),

          // Primary Button ("રિકવરી વિનંતી મોકલો →")
          SizedBox(
            width: double.infinity,
            height: 52.0,
            child: ElevatedButton(
              onPressed: _isLoading ? null : _handleRecoveryRequest,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primaryBlue,
                foregroundColor: Colors.white,
                disabledBackgroundColor: AppColors.primaryBlue.withValues(alpha: 0.6),
                elevation: 2.0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(26.0),
                ),
              ),
              child: _isLoading
                  ? const SizedBox(
                      width: 22,
                      height: 22,
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
                            strings.sendRecoveryButton,
                            style: const TextStyle(
                              fontSize: 16.5,
                              fontWeight: FontWeight.w700,
                              letterSpacing: 0.2,
                            ),
                          ),
                          const SizedBox(width: 8.0),
                          const Icon(
                            Icons.arrow_forward_rounded,
                            size: 20.0,
                          ),
                        ],
                      ),
                    ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildConfirmationCard(AppStrings strings) {
    return Container(
      padding: const EdgeInsets.all(18.0),
      decoration: BoxDecoration(
        color: const Color(0xFFF0FDF4),
        borderRadius: BorderRadius.circular(16.0),
        border: Border.all(color: const Color(0xFFBBF7D0), width: 1.2),
      ),
      child: Column(
        children: [
          const Icon(
            Icons.check_circle_rounded,
            color: Color(0xFF16A34A),
            size: 54.0,
          ),
          const SizedBox(height: 10.0),
          Text(
            strings.recoveryRequestSubmitted,
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 18.0,
              fontWeight: FontWeight.w800,
              color: Color(0xFF166534),
            ),
          ),
          const SizedBox(height: 12.0),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14.0, vertical: 8.0),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(8.0),
              border: Border.all(color: const Color(0xFF86EFAC)),
            ),
            child: FittedBox(
              fit: BoxFit.scaleDown,
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    '${strings.recoveryReferenceNumber}: ',
                    style: const TextStyle(
                      fontSize: 13.0,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF15803D),
                    ),
                  ),
                  Text(
                    _submittedRequest!.referenceId,
                    style: const TextStyle(
                      fontSize: 14.0,
                      fontWeight: FontWeight.w800,
                      color: AppColors.textNavy,
                      letterSpacing: 0.5,
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 12.0),
          Text(
            strings.recoveryInstructions,
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 12.5,
              color: Color(0xFF334155),
              height: 1.4,
            ),
          ),
          const SizedBox(height: 14.0),
          SizedBox(
            width: double.infinity,
            height: 48.0,
            child: ElevatedButton.icon(
              key: const Key('view_recovery_status_button'),
              onPressed: () {
                Navigator.of(context).pushNamed(
                  AppRoutes.recoveryStatus,
                  arguments: _submittedRequest,
                );
              },
              icon: const Icon(Icons.arrow_forward_rounded, size: 20),
              label: Text(
                '${strings.recoveryStatusHeading} ➔',
                style: const TextStyle(
                  fontSize: 14.5,
                  fontWeight: FontWeight.bold,
                ),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.accentOrange,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(24.0),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// Custom painter for the warm orange curved brush underline under the heading
class _CurvedUnderlinePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = AppColors.accentOrange
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3.2
      ..strokeCap = StrokeCap.round;

    final path = Path()
      ..moveTo(0, size.height * 0.4)
      ..quadraticBezierTo(
        size.width * 0.5,
        size.height,
        size.width,
        size.height * 0.2,
      );

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
