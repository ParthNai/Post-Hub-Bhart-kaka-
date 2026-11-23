import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:panchayat_post/core/constants/app_assets.dart';
import 'package:panchayat_post/core/constants/app_colors.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';
import 'package:panchayat_post/core/widgets/legal_dialog_helper.dart';
import 'package:panchayat_post/features/auth/data/auth_service.dart';
import 'package:panchayat_post/features/auth/presentation/widgets/auth_header_widget.dart';
import 'package:panchayat_post/features/auth/presentation/widgets/auth_text_field.dart';
import 'package:panchayat_post/features/welcome/presentation/widgets/welcome_background_painter.dart';

/// Screen 03: Create Account / Registration Screen.
/// Fully functional registration with form validation, debounced username availability,
/// dynamic password requirement checkmarks, salted SHA-256 password hashing,
/// terms agreement enforcement, and session creation.
class CreateAccountScreen extends StatefulWidget {
  const CreateAccountScreen({
    super.key,
    this.authService,
    this.navigateToProfileSetup = false,
  });

  final AuthService? authService;
  final bool navigateToProfileSetup;

  @override
  State<CreateAccountScreen> createState() => _CreateAccountScreenState();
}

class _CreateAccountScreenState extends State<CreateAccountScreen> {
  final _formKey = GlobalKey<FormState>();

  final _fullNameController = TextEditingController();
  final _mobileController = TextEditingController();
  final _pinController = TextEditingController();
  final _occupationController = TextEditingController();
  final _villageController = TextEditingController();
  final _talukaController = TextEditingController();
  final _districtController = TextEditingController();

  late final AuthService _authService;

  bool _termsAccepted = false;
  bool _showTermsError = false;

  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _authService = widget.authService ?? AuthService();
  }

  @override
  void dispose() {
    _fullNameController.dispose();
    _mobileController.dispose();
    _pinController.dispose();
    _occupationController.dispose();
    _villageController.dispose();
    _talukaController.dispose();
    _districtController.dispose();
    super.dispose();
  }

  Future<void> _handleRegistration() async {
    // Dismiss keyboard
    FocusScope.of(context).unfocus();

    final strings = LocaleScope.of(context).strings;

    // Validate form fields
    final isValid = _formKey.currentState?.validate() ?? false;

    // Validate terms acceptance
    if (!_termsAccepted) {
      setState(() => _showTermsError = true);
    } else {
      setState(() => _showTermsError = false);
    }

    if (!isValid || !_termsAccepted) {
      return;
    }

    setState(() => _isLoading = true);

    try {
      final message = await _authService.registerWithBackend(
        fullName: _fullNameController.text.trim(),
        mobile: _mobileController.text.trim(),
        pin: _pinController.text.trim(),
        occupation: _occupationController.text.trim(),
        village: _villageController.text,
        taluka: _talukaController.text,
        district: _districtController.text,
      );

      if (!mounted) return;

      setState(() => _isLoading = false);

      // Show success feedback
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(message.isNotEmpty ? message : strings.registrationSuccess),
          backgroundColor: const Color(0xFF16A34A),
          duration: const Duration(seconds: 2),
        ),
      );

      Navigator.of(context).pushNamedAndRemoveUntil(
        AppRoutes.login,
        (route) => false,
      );
    } on AuthException catch (e) {
      if (!mounted) return;
      setState(() => _isLoading = false);
      final message = e.message.toLowerCase().contains('already exist')
          ? strings.mobileAlreadyRegisteredError
          : e.message;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(message),
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

              // 2. Scrollable Registration Form
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
                        const SizedBox(height: 8.0),

                        // Hero Illustration
                        Image.asset(
                          AppAssets.createAccountHero,
                          height: 65,
                          fit: BoxFit.contain,
                        ),
                        const SizedBox(height: 12.0),

                        // Main Heading
                        Text(
                          strings.createAccountHeading,
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
                          strings.createAccountSubheading,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontSize: 13.0,
                            color: Color(0xFF475569),
                            height: 1.35,
                          ),
                        ),
                        const SizedBox(height: 20.0),

                        // Field 1: Full Name
                        AuthTextField(
                          label: strings.fullNameLabel,
                          hintText: strings.fullNameHint,
                          controller: _fullNameController,
                          textInputAction: TextInputAction.next,
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
                        const SizedBox(height: 14.0),

                        // Field 2: Mobile number
                        AuthTextField(
                          label: '${strings.mobileNumberLabel} *',
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
                        const SizedBox(height: 14.0),

                        // Field 3: PIN
                        AuthTextField(
                          label: strings.pinLabel,
                          hintText: strings.pinHint,
                          controller: _pinController,
                          obscureText: true,
                          keyboardType: TextInputType.number,
                          textInputAction: TextInputAction.next,
                          inputFormatters: [
                            FilteringTextInputFormatter.digitsOnly,
                            LengthLimitingTextInputFormatter(4),
                          ],
                          labelIcon: const Icon(
                            Icons.lock_rounded,
                            size: 15.0,
                            color: AppColors.textNavy,
                          ),
                          prefixWidget: const Icon(Icons.lock_outline_rounded, color: AppColors.textNavy),
                          validator: (val) {
                            if (val == null || val.isEmpty) return strings.pinRequiredError;
                            return RegExp(r'^\d{4}$').hasMatch(val) ? null : strings.pinRequiredError;
                          },
                        ),
                        const SizedBox(height: 14.0),

                        // Field 4: Occupation
                        AuthTextField(
                          label: '${strings.occupationLabel} *',
                          hintText: strings.occupationHint,
                          controller: _occupationController,
                          textInputAction: TextInputAction.next,
                          labelIcon: const Icon(
                            Icons.work_outline_rounded,
                            size: 15.0,
                            color: AppColors.textNavy,
                          ),
                          prefixWidget: const Icon(Icons.work_outline_rounded, color: AppColors.textNavy),
                          validator: (val) {
                            if (val == null || val.trim().isEmpty) return strings.occupationRequiredError;
                            return null;
                          },
                        ),
                        const SizedBox(height: 14.0),

                        AuthTextField(
                          label: strings.villageCityFieldLabel,
                          hintText: strings.villageCityFieldHint,
                          controller: _villageController,
                          textInputAction: TextInputAction.next,
                          labelIcon: const Icon(Icons.location_city_rounded, size: 16.0, color: AppColors.textNavy),
                          prefixWidget: const Icon(Icons.location_on_outlined, color: AppColors.textNavy),
                        ),
                        const SizedBox(height: 14.0),

                        AuthTextField(
                          label: strings.talukaLabel,
                          hintText: strings.talukaLabel,
                          controller: _talukaController,
                          textInputAction: TextInputAction.next,
                          labelIcon: const Icon(Icons.map_outlined, size: 16.0, color: AppColors.textNavy),
                          prefixWidget: const Icon(Icons.map_outlined, color: AppColors.textNavy),
                        ),
                        const SizedBox(height: 14.0),

                        AuthTextField(
                          label: strings.districtLabel,
                          hintText: strings.districtLabel,
                          controller: _districtController,
                          textInputAction: TextInputAction.done,
                          labelIcon: const Icon(Icons.public_rounded, size: 16.0, color: AppColors.textNavy),
                          prefixWidget: const Icon(Icons.public_rounded, color: AppColors.textNavy),
                        ),
                        const SizedBox(height: 14.0),

                        // Terms & Conditions Checkbox
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            SizedBox(
                              width: 24,
                              height: 24,
                              child: Checkbox(
                                value: _termsAccepted,
                                activeColor: AppColors.primaryBlue,
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(4.0),
                                ),
                                onChanged: (val) {
                                  setState(() {
                                    _termsAccepted = val ?? false;
                                    if (_termsAccepted) _showTermsError = false;
                                  });
                                },
                              ),
                            ),
                            const SizedBox(width: 8.0),
                            Expanded(
                              child: Text.rich(
                                TextSpan(
                                  style: const TextStyle(
                                    fontSize: 12.5,
                                    color: Color(0xFF334155),
                                  ),
                                  children: [
                                    TextSpan(text: strings.termsAcceptPrefix),
                                    WidgetSpan(
                                      alignment: PlaceholderAlignment.baseline,
                                      baseline: TextBaseline.alphabetic,
                                      child: GestureDetector(
                                        onTap: () => LegalDialogHelper.showPolicyDialog(
                                          context,
                                          isPrivacy: false,
                                        ),
                                        child: Text(
                                          strings.termsAndConditions,
                                          style: const TextStyle(
                                            color: AppColors.primaryBlue,
                                            fontWeight: FontWeight.w600,
                                            fontSize: 12.5,
                                            decoration: TextDecoration.underline,
                                          ),
                                        ),
                                      ),
                                    ),
                                    TextSpan(text: strings.termsAndText),
                                    WidgetSpan(
                                      alignment: PlaceholderAlignment.baseline,
                                      baseline: TextBaseline.alphabetic,
                                      child: GestureDetector(
                                        onTap: () => LegalDialogHelper.showPolicyDialog(
                                          context,
                                          isPrivacy: true,
                                        ),
                                        child: Text(
                                          strings.privacyPolicy,
                                          style: const TextStyle(
                                            color: AppColors.primaryBlue,
                                            fontWeight: FontWeight.w600,
                                            fontSize: 12.5,
                                            decoration: TextDecoration.underline,
                                          ),
                                        ),
                                      ),
                                    ),
                                    TextSpan(text: strings.termsAcceptSuffix),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),

                        if (_showTermsError) ...[
                          const SizedBox(height: 4.0),
                          Align(
                            alignment: Alignment.centerLeft,
                            child: Padding(
                              padding: const EdgeInsets.only(left: 32.0),
                              child: Text(
                                strings.termsRequiredError,
                                style: const TextStyle(
                                  color: Color(0xFFEF4444),
                                  fontSize: 11.5,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ),
                          ),
                        ],
                        const SizedBox(height: 18.0),

                        // Primary Action Button ("એકાઉન્ટ બનાવો →")
                        SizedBox(
                          width: double.infinity,
                          height: 52.0,
                          child: ElevatedButton(
                            onPressed: _isLoading ? null : _handleRegistration,
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
                                : Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Text(
                                        strings.createAccountButton,
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
                        const SizedBox(height: 20.0),

                        // Login Divider Row
                        Row(
                          children: [
                            const Expanded(
                              child: Divider(color: Color(0xFFE2E8F0), thickness: 1.0),
                            ),
                            Padding(
                              padding: const EdgeInsets.symmetric(horizontal: 10.0),
                              child: Text(
                                strings.alreadyHaveAccount,
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

                        // Login Link with brush highlight
                        GestureDetector(
                          onTap: () {
                            Navigator.of(context).pushReplacementNamed(AppRoutes.login);
                          },
                          child: Padding(
                            padding: const EdgeInsets.symmetric(vertical: 4.0),
                            child: Text(
                              strings.loginAction,
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

                        // Village Silhouette Footer
                        Image.asset(
                          AppAssets.welcomeVillageFooter,
                          fit: BoxFit.contain,
                          width: double.infinity,
                          height: 70.0,
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
