import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:panchayat_post/core/constants/app_assets.dart';
import 'package:panchayat_post/core/constants/app_colors.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';
import 'package:panchayat_post/core/services/session_service.dart';
import 'package:panchayat_post/core/widgets/legal_dialog_helper.dart';
import 'package:panchayat_post/features/auth/data/auth_service.dart';
import 'package:panchayat_post/features/auth/presentation/widgets/auth_header_widget.dart';
import 'package:panchayat_post/features/auth/presentation/widgets/auth_text_field.dart';
import 'package:panchayat_post/features/welcome/presentation/widgets/welcome_background_painter.dart';

/// Screen 04: User Login Screen.
/// Implements Username + Password authentication exclusively.
/// Features secure salted SHA-256 password verification, configurable session persistence
/// (Remember Me), account recovery dialog, and live multi-language switching.
class LoginScreen extends StatefulWidget {
  const LoginScreen({
    super.key,
    this.authService,
    this.sessionService,
    this.navigateToProfileSetup = false,
  });

  final AuthService? authService;
  final SessionService? sessionService;
  final bool navigateToProfileSetup;

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _mobileController = TextEditingController();
  final _pinController = TextEditingController();

  late final AuthService _authService;
  late final SessionService _sessionService;

  bool _obscurePin = true;
  bool _rememberMe = true;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _sessionService = widget.sessionService ?? SessionService();
    _authService = widget.authService ?? AuthService(sessionService: _sessionService);
  }

  @override
  void dispose() {
    _mobileController.dispose();
    _pinController.dispose();
    super.dispose();
  }

  Future<void> _handleLogin() async {
    // Dismiss keyboard
    FocusScope.of(context).unfocus();

    if (!_formKey.currentState!.validate()) return;

    final strings = LocaleScope.of(context).strings;

    setState(() => _isLoading = true);

    try {
      final user = await _authService.loginWithPin(
        mobile: _mobileController.text.trim(),
        pin: _pinController.text.trim(),
        rememberMe: _rememberMe,
      );

      if (!mounted) return;
      setState(() => _isLoading = false);

      ScaffoldMessenger.of(context).removeCurrentSnackBar();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(strings.loginSuccessMessage),
          backgroundColor: const Color(0xFF16A34A),
          duration: const Duration(seconds: 2),
        ),
      );

      // Navigate to Screen 07 Profile Setup if configured and profile incomplete; else Home
      if (widget.navigateToProfileSetup && !user.isProfileComplete) {
        Navigator.of(context).pushNamedAndRemoveUntil(
          AppRoutes.profileSetup,
          (route) => false,
          arguments: user,
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

      // Map backend error messages to localized strings where appropriate
      String displayMsg = e.message;
      if (e.message.contains('does not exist')) {
        displayMsg = strings.accountNotFoundError;
      } else if (e.message.contains('Invalid password')) {
        displayMsg = strings.invalidPasswordError;
      }

      ScaffoldMessenger.of(context).removeCurrentSnackBar();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(displayMsg),
          backgroundColor: const Color(0xFFEF4444),
        ),
      );
    } catch (_) {
      if (!mounted) return;
      setState(() => _isLoading = false);

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

              // 2. Scrollable Login Form
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
                        const SizedBox(height: 10.0),

                        // Hero Illustration (Laptop surrounded by poster templates)
                        Image.asset(
                          AppAssets.loginHeroLaptop,
                          height: 105.0,
                          fit: BoxFit.contain,
                        ),
                        const SizedBox(height: 14.0),

                        // Main Heading ("ફરીથી આપનું સ્વાગત છે!")
                        Text(
                          strings.loginHeading,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontSize: 24.0,
                            fontWeight: FontWeight.w800,
                            color: AppColors.textNavy,
                            letterSpacing: -0.4,
                          ),
                        ),
                        const SizedBox(height: 6.0),

                        // Subtitle
                        Text(
                          strings.loginSubheading,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontSize: 13.0,
                            color: Color(0xFF475569),
                            height: 1.35,
                          ),
                        ),
                        const SizedBox(height: 24.0),

                        // Field 1: Mobile number
                        AuthTextField(
                          label: strings.mobileNumberLabel,
                          hintText: strings.mobileNumberHint,
                          controller: _mobileController,
                          keyboardType: TextInputType.phone,
                          textInputAction: TextInputAction.next,
                          labelIcon: const Icon(
                            Icons.phone_android_rounded,
                            size: 16.0,
                            color: AppColors.textNavy,
                          ),
                          prefixWidget: const Icon(Icons.phone_android_rounded, color: AppColors.textNavy),
                          inputFormatters: [
                            FilteringTextInputFormatter.digitsOnly,
                            LengthLimitingTextInputFormatter(10),
                          ],
                          validator: (val) {
                            if (val == null || val.trim().isEmpty) return strings.mobileRequiredError;
                            return RegExp(r'^\d{10}$').hasMatch(val.trim())
                                ? null
                                : strings.mobileInvalidError;
                          },
                        ),
                        const SizedBox(height: 16.0),

                        // Field 2: PIN
                        AuthTextField(
                          label: strings.pinLabel,
                          hintText: strings.pinHint,
                          controller: _pinController,
                          obscureText: _obscurePin,
                          keyboardType: TextInputType.number,
                          textInputAction: TextInputAction.done,
                          inputFormatters: [
                            FilteringTextInputFormatter.digitsOnly,
                            LengthLimitingTextInputFormatter(4),
                          ],
                          labelIcon: const Icon(
                            Icons.lock_rounded,
                            size: 15.0,
                            color: AppColors.textNavy,
                          ),
                          prefixWidget: const Icon(
                            Icons.lock_outline_rounded,
                            color: AppColors.textNavy,
                            size: 20.0,
                          ),
                          suffixWidget: IconButton(
                            icon: Icon(
                              _obscurePin
                                  ? Icons.visibility_off_outlined
                                  : Icons.visibility_outlined,
                              color: const Color(0xFF64748B),
                              size: 20.0,
                            ),
                            onPressed: () => setState(() => _obscurePin = !_obscurePin),
                          ),
                          validator: (val) {
                            if (val == null || val.isEmpty) return strings.pinRequiredError;
                            return RegExp(r'^\d{4}$').hasMatch(val) ? null : strings.pinRequiredError;
                          },
                        ),
                        const SizedBox(height: 12.0),

                        Align(
                          alignment: Alignment.centerLeft,
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Checkbox(
                                value: _rememberMe,
                                activeColor: AppColors.primaryBlue,
                                onChanged: (val) => setState(() => _rememberMe = val ?? true),
                              ),
                              Text(
                                strings.rememberMeLabel,
                                style: const TextStyle(
                                  fontSize: 13.0,
                                  fontWeight: FontWeight.w500,
                                  color: Color(0xFF334155),
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 22.0),

                        // Primary Action Button ("લોગિન કરો →")
                        SizedBox(
                          width: double.infinity,
                          height: 52.0,
                          child: ElevatedButton(
                            onPressed: _isLoading ? null : _handleLogin,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.primaryBlue,
                              foregroundColor: Colors.white,
                              disabledBackgroundColor:
                                  AppColors.primaryBlue.withValues(alpha: 0.6),
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
                                : Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Text(
                                        strings.loginButtonLabel,
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
                        const SizedBox(height: 24.0),

                        // Create Account Divider Row
                        Row(
                          children: [
                            const Expanded(
                              child: Divider(color: Color(0xFFE2E8F0), thickness: 1.0),
                            ),
                            Padding(
                              padding: const EdgeInsets.symmetric(horizontal: 10.0),
                              child: Text(
                                strings.noAccountPrompt,
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

                        // Create Account Link with orange highlight
                        GestureDetector(
                          onTap: () {
                            Navigator.of(context).pushReplacementNamed(AppRoutes.createAccount);
                          },
                          child: Padding(
                            padding: const EdgeInsets.symmetric(vertical: 4.0),
                            child: Text(
                              strings.createAccountAction,
                              style: const TextStyle(
                                fontSize: 16.5,
                                fontWeight: FontWeight.w800,
                                color: AppColors.primaryBlue,
                                decoration: TextDecoration.underline,
                                decorationColor: AppColors.accentOrange,
                                decorationThickness: 2.5,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(height: 16.0),

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
              ),
            ],
          ),
        ),
      ),
    );
  }
}
