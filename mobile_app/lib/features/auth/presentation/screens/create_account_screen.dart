import 'dart:async';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:panchayat_post/core/constants/app_assets.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';
import 'package:panchayat_post/core/widgets/legal_dialog_helper.dart';
import 'package:panchayat_post/features/auth/data/auth_service.dart';
import 'package:panchayat_post/features/auth/presentation/widgets/four_digit_pin_field.dart';

/// Screen 03: Create Account / Registration Screen.
/// Redesigned with a minimal, spacious UI featuring:
/// - Compact header with circular back navigation
/// - Centered original Panchayat Post brand mark
/// - English default typography and styling
/// - Clean full name & username fields with live availability check
/// - Two independent 4-digit PIN input components with auto-advance and secure masking
/// - Interactive Terms & Privacy Policy integration
/// - High-contrast primary action button and seamless Login navigation
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
  final _usernameController = TextEditingController();

  String _pin = '';
  String _confirmPin = '';
  String? _pinError;
  String? _confirmPinError;

  late final AuthService _authService;

  bool _termsAccepted = false;
  bool _showTermsError = false;

  bool _isLoading = false;
  bool _isCheckingUsername = false;
  bool? _isUsernameAvailable;
  String? _usernameFeedback;
  Timer? _debounceTimer;

  late final TapGestureRecognizer _termsRecognizer;
  late final TapGestureRecognizer _privacyRecognizer;

  @override
  void initState() {
    super.initState();
    _authService = widget.authService ?? AuthService();
    _usernameController.addListener(_onUsernameChanged);

    _termsRecognizer = TapGestureRecognizer()
      ..onTap = () => LegalDialogHelper.showPolicyDialog(context, isPrivacy: false);
    _privacyRecognizer = TapGestureRecognizer()
      ..onTap = () => LegalDialogHelper.showPolicyDialog(context, isPrivacy: true);
  }

  @override
  void dispose() {
    _debounceTimer?.cancel();
    _usernameController.removeListener(_onUsernameChanged);
    _fullNameController.dispose();
    _usernameController.dispose();
    _termsRecognizer.dispose();
    _privacyRecognizer.dispose();
    super.dispose();
  }

  void _onUsernameChanged() {
    final text = _usernameController.text.trim();
    _debounceTimer?.cancel();

    if (text.isEmpty) {
      if (mounted) {
        setState(() {
          _isCheckingUsername = false;
          _isUsernameAvailable = null;
          _usernameFeedback = null;
        });
      }
      return;
    }

    if (!AuthService.isUsernameFormatValid(text)) {
      if (mounted) {
        setState(() {
          _isCheckingUsername = false;
          _isUsernameAvailable = false;
          _usernameFeedback = 'Username must be 3-30 letters, numbers, or _';
        });
      }
      return;
    }

    setState(() {
      _isCheckingUsername = true;
      _usernameFeedback = null;
    });

    _debounceTimer = Timer(const Duration(milliseconds: 300), () async {
      try {
        final available = await _authService.checkUsernameAvailability(text);
        if (mounted) {
          setState(() {
            _isCheckingUsername = false;
            _isUsernameAvailable = available;
            _usernameFeedback = available
                ? 'Username is available'
                : 'This username is already taken';
          });
        }
      } catch (_) {
        if (mounted) {
          setState(() {
            _isCheckingUsername = false;
          });
        }
      }
    });
  }

  Future<void> _handleRegister() async {
    // Dismiss soft keyboard
    FocusScope.of(context).unfocus();

    // Reset inline PIN & Terms errors
    setState(() {
      _pinError = null;
      _confirmPinError = null;
      _showTermsError = false;
    });

    bool isValid = _formKey.currentState!.validate();

    // Validate 4-digit PIN
    if (_pin.length != 4) {
      setState(() => _pinError = 'Please enter a complete 4-digit PIN');
      isValid = false;
    } else if (!AuthService.validatePinFormat(_pin)) {
      setState(() => _pinError = 'PIN must contain exactly 4 numeric digits');
      isValid = false;
    }

    // Validate Confirm PIN
    if (_confirmPin.length != 4) {
      setState(() => _confirmPinError = 'Please confirm your 4-digit PIN');
      isValid = false;
    } else if (_pin != _confirmPin) {
      setState(() => _confirmPinError = 'PINs do not match');
      isValid = false;
    }

    // Validate Terms acceptance
    if (!_termsAccepted) {
      setState(() => _showTermsError = true);
      isValid = false;
    }

    if (!isValid) return;

    if (_isUsernameAvailable == false) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(_usernameFeedback ?? 'This username is already taken'),
          backgroundColor: const Color(0xFFDC2626),
        ),
      );
      return;
    }

    setState(() => _isLoading = true);

    try {
      final user = await _authService.registerUser(
        fullName: _fullNameController.text.trim(),
        username: _usernameController.text.trim(),
        password: _pin,
      );

      if (!mounted) return;
      setState(() => _isLoading = false);

      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Account created successfully!'),
          backgroundColor: Color(0xFF16A34A),
          duration: Duration(seconds: 2),
        ),
      );

      if (widget.navigateToProfileSetup) {
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
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(e.message),
          backgroundColor: const Color(0xFFDC2626),
        ),
      );
    } catch (_) {
      if (!mounted) return;
      setState(() => _isLoading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('An error occurred. Please try again.'),
          backgroundColor: Color(0xFFDC2626),
        ),
      );
    }
  }

  void _navigateToLogin() {
    if (Navigator.of(context).canPop()) {
      Navigator.of(context).pop();
    } else {
      Navigator.of(context).pushReplacementNamed(AppRoutes.login);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Stack(
        children: [
          // Subtle soft pastel waves at corners
          Positioned(
            top: 0,
            right: 0,
            child: IgnorePointer(
              child: CustomPaint(
                size: const Size(220, 180),
                painter: _TopRightWavePainter(),
              ),
            ),
          ),
          Positioned(
            bottom: 0,
            left: 0,
            child: IgnorePointer(
              child: CustomPaint(
                size: const Size(200, 160),
                painter: _BottomLeftWavePainter(),
              ),
            ),
          ),

          // Main form content
          SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 12.0),
              physics: const ClampingScrollPhysics(),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Back button row
                    Row(
                      children: [
                        GestureDetector(
                          onTap: _navigateToLogin,
                          behavior: HitTestBehavior.opaque,
                          child: Container(
                            width: 40,
                            height: 40,
                            decoration: BoxDecoration(
                              color: const Color(0xFFF3E8FF),
                              shape: BoxShape.circle,
                              boxShadow: [
                                BoxShadow(
                                  color: const Color(0xFF9333EA).withValues(alpha: 0.08),
                                  blurRadius: 6,
                                  offset: const Offset(0, 2),
                                ),
                              ],
                            ),
                            alignment: Alignment.center,
                            child: const Icon(
                              Icons.arrow_back_rounded,
                              color: Color(0xFF6B21A8),
                              size: 20,
                            ),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 12),

                    // Centered original brand logo
                    Center(
                      child: Image.asset(
                        AppAssets.panchayatLogo,
                        height: 72,
                        fit: BoxFit.contain,
                        errorBuilder: (context, error, stackTrace) => Image.asset(
                          AppAssets.panchayatLogoOriginal,
                          height: 72,
                          fit: BoxFit.contain,
                        ),
                      ),
                    ),

                    const SizedBox(height: 18),

                    // Title
                    const Text(
                      'Create your account',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 26,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF0F172A),
                        letterSpacing: -0.5,
                      ),
                    ),

                    const SizedBox(height: 8),

                    // Subtitle
                    const Text(
                      'Join Panchayat Post and create beautiful\nposts for your community.',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 14,
                        color: Color(0xFF64748B),
                        height: 1.45,
                        fontWeight: FontWeight.w400,
                      ),
                    ),

                    const SizedBox(height: 28),

                    // 1. Full Name
                    _buildFieldLabel(
                      icon: Icons.person_rounded,
                      label: 'Full Name',
                    ),
                    const SizedBox(height: 8),
                    TextFormField(
                      controller: _fullNameController,
                      textCapitalization: TextCapitalization.words,
                      keyboardType: TextInputType.name,
                      textInputAction: TextInputAction.next,
                      style: const TextStyle(
                        fontSize: 15,
                        color: Color(0xFF0F172A),
                        fontWeight: FontWeight.w500,
                      ),
                      decoration: _buildInputDecoration(
                        hintText: 'Enter your full name',
                        prefixIcon: Icons.person_outline_rounded,
                      ),
                      validator: (value) {
                        if (value == null || value.trim().isEmpty) {
                          return 'Please enter your full name';
                        }
                        if (value.trim().length < 2) {
                          return 'Full name must be at least 2 characters';
                        }
                        return null;
                      },
                    ),

                    const SizedBox(height: 20),

                    // 2. Username
                    _buildFieldLabel(
                      icon: Icons.alternate_email_rounded,
                      label: 'Username',
                    ),
                    const SizedBox(height: 8),
                    TextFormField(
                      controller: _usernameController,
                      keyboardType: TextInputType.text,
                      textInputAction: TextInputAction.next,
                      autocorrect: false,
                      style: const TextStyle(
                        fontSize: 15,
                        color: Color(0xFF0F172A),
                        fontWeight: FontWeight.w500,
                      ),
                      decoration: _buildInputDecoration(
                        hintText: 'Choose a username',
                        prefixIcon: Icons.alternate_email_rounded,
                      ),
                      validator: (value) {
                        if (value == null || value.trim().isEmpty) {
                          return 'Please enter a username';
                        }
                        if (value.trim().length < 3) {
                          return 'Username must be at least 3 characters';
                        }
                        if (!AuthService.isUsernameFormatValid(value.trim())) {
                          return 'Only letters, numbers, and _ are allowed';
                        }
                        return null;
                      },
                    ),

                    // Username helper row
                    const SizedBox(height: 6),
                    _buildUsernameHelper(),

                    const SizedBox(height: 20),

                    // 3. Create 4-digit PIN
                    _buildFieldLabel(
                      icon: Icons.lock_rounded,
                      label: 'Create 4-digit PIN',
                    ),
                    const SizedBox(height: 10),
                    FourDigitPinField(
                      obscureText: true,
                      hasError: _pinError != null,
                      errorMessage: _pinError,
                      onChanged: (pin) {
                        setState(() {
                          _pin = pin;
                          if (pin.length == 4) _pinError = null;
                        });
                      },
                    ),

                    const SizedBox(height: 20),

                    // 4. Confirm 4-digit PIN
                    _buildFieldLabel(
                      icon: Icons.lock_rounded,
                      label: 'Confirm 4-digit PIN',
                    ),
                    const SizedBox(height: 10),
                    FourDigitPinField(
                      obscureText: true,
                      hasError: _confirmPinError != null,
                      errorMessage: _confirmPinError,
                      onChanged: (pin) {
                        setState(() {
                          _confirmPin = pin;
                          if (pin.length == 4) _confirmPinError = null;
                        });
                      },
                    ),

                    const SizedBox(height: 20),

                    // 5. Terms & Conditions Checkbox
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        SizedBox(
                          width: 24,
                          height: 24,
                          child: Checkbox(
                            value: _termsAccepted,
                            activeColor: const Color(0xFF0056D2),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(5),
                            ),
                            side: BorderSide(
                              color: _showTermsError
                                  ? const Color(0xFFEF4444)
                                  : const Color(0xFF94A3B8),
                              width: 1.5,
                            ),
                            onChanged: (val) {
                              setState(() {
                                _termsAccepted = val ?? false;
                                if (_termsAccepted) _showTermsError = false;
                              });
                            },
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Padding(
                            padding: const EdgeInsets.only(top: 2.0),
                            child: RichText(
                              text: TextSpan(
                                style: const TextStyle(
                                  fontSize: 13.5,
                                  color: Color(0xFF475569),
                                  height: 1.4,
                                ),
                                children: [
                                  const TextSpan(text: 'I agree to the '),
                                  TextSpan(
                                    text: 'Terms & Conditions',
                                    style: const TextStyle(
                                      color: Color(0xFF0056D2),
                                      fontWeight: FontWeight.w600,
                                      decoration: TextDecoration.underline,
                                    ),
                                    recognizer: _termsRecognizer,
                                  ),
                                  const TextSpan(text: ' and '),
                                  TextSpan(
                                    text: 'Privacy Policy',
                                    style: const TextStyle(
                                      color: Color(0xFF0056D2),
                                      fontWeight: FontWeight.w600,
                                      decoration: TextDecoration.underline,
                                    ),
                                    recognizer: _privacyRecognizer,
                                  ),
                                  const TextSpan(text: '.'),
                                ],
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                    if (_showTermsError) ...[
                      const SizedBox(height: 6),
                      const Padding(
                        padding: EdgeInsets.only(left: 34.0),
                        child: Text(
                          'Please agree to the Terms & Conditions and Privacy Policy.',
                          style: TextStyle(
                            color: Color(0xFFEF4444),
                            fontSize: 12,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                    ],

                    const SizedBox(height: 28),

                    // Primary Action Button: "Create Account ->"
                    SizedBox(
                      height: 52,
                      child: ElevatedButton(
                        onPressed: _isLoading ? null : _handleRegister,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF0056D2),
                          foregroundColor: Colors.white,
                          disabledBackgroundColor: const Color(0xFF93C5FD),
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14),
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
                            : const Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Text(
                                    'Create Account',
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w700,
                                      letterSpacing: 0.2,
                                    ),
                                  ),
                                  SizedBox(width: 8),
                                  Icon(
                                    Icons.arrow_forward_rounded,
                                    size: 19,
                                  ),
                                ],
                              ),
                      ),
                    ),

                    const SizedBox(height: 28),

                    // Footer divider and login link
                    LayoutBuilder(
                      builder: (context, constraints) {
                        return Row(
                          children: [
                            const Expanded(
                              child: Divider(
                                color: Color(0xFFE2E8F0),
                                thickness: 1,
                              ),
                            ),
                            ConstrainedBox(
                              constraints: BoxConstraints(
                                maxWidth: constraints.maxWidth > 60
                                    ? constraints.maxWidth - 40
                                    : constraints.maxWidth,
                              ),
                              child: Padding(
                                padding:
                                    const EdgeInsets.symmetric(horizontal: 8.0),
                                child: FittedBox(
                                  fit: BoxFit.scaleDown,
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      const Text(
                                        'Already have an account? ',
                                        style: TextStyle(
                                          fontSize: 13.5,
                                          color: Color(0xFF64748B),
                                          fontWeight: FontWeight.w400,
                                        ),
                                      ),
                                      GestureDetector(
                                        onTap: _navigateToLogin,
                                        child: const Text(
                                          'Log in',
                                          style: TextStyle(
                                            fontSize: 13.5,
                                            color: Color(0xFF0056D2),
                                            fontWeight: FontWeight.w700,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                            const Expanded(
                              child: Divider(
                                color: Color(0xFFE2E8F0),
                                thickness: 1,
                              ),
                            ),
                          ],
                        );
                      },
                    ),

                    const SizedBox(height: 24),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFieldLabel({
    required IconData icon,
    required String label,
  }) {
    return Row(
      children: [
        Icon(
          icon,
          size: 18,
          color: const Color(0xFF6366F1),
        ),
        const SizedBox(width: 8),
        Text(
          label,
          style: const TextStyle(
            fontSize: 14.5,
            fontWeight: FontWeight.w700,
            color: Color(0xFF0F172A),
            letterSpacing: -0.2,
          ),
        ),
      ],
    );
  }

  InputDecoration _buildInputDecoration({
    required String hintText,
    required IconData prefixIcon,
  }) {
    return InputDecoration(
      hintText: hintText,
      hintStyle: const TextStyle(
        fontSize: 14.5,
        color: Color(0xFF94A3B8),
        fontWeight: FontWeight.w400,
      ),
      prefixIcon: Icon(
        prefixIcon,
        color: const Color(0xFF94A3B8),
        size: 20,
      ),
      filled: true,
      fillColor: Colors.white,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 15),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: Color(0xFFE2E8F0), width: 1.0),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: Color(0xFFE2E8F0), width: 1.0),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: Color(0xFF2563EB), width: 1.8),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: Color(0xFFEF4444), width: 1.2),
      ),
      focusedErrorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: Color(0xFFEF4444), width: 1.8),
      ),
    );
  }

  Widget _buildUsernameHelper() {
    if (_isCheckingUsername) {
      return const Row(
        children: [
          SizedBox(
            width: 14,
            height: 14,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              color: Color(0xFF6366F1),
            ),
          ),
          SizedBox(width: 6),
          Expanded(
            child: Text(
              'Checking username availability...',
              style: TextStyle(
                color: Color(0xFF64748B),
                fontSize: 12.5,
              ),
            ),
          ),
        ],
      );
    }

    if (_isUsernameAvailable == true) {
      return const Row(
        children: [
          Icon(Icons.check_circle_rounded, size: 15, color: Color(0xFF16A34A)),
          SizedBox(width: 6),
          Expanded(
            child: Text(
              'Username is available',
              style: TextStyle(
                color: Color(0xFF16A34A),
                fontSize: 12.5,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      );
    }

    if (_isUsernameAvailable == false) {
      return Row(
        children: [
          const Icon(Icons.cancel_rounded, size: 15, color: Color(0xFFDC2626)),
          const SizedBox(width: 6),
          Expanded(
            child: Text(
              _usernameFeedback ?? 'This username is already taken',
              style: const TextStyle(
                color: Color(0xFFDC2626),
                fontSize: 12.5,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      );
    }

    return const Row(
      children: [
        Icon(Icons.info_outline_rounded, size: 15, color: Color(0xFF6366F1)),
        SizedBox(width: 6),
        Expanded(
          child: Text(
            'Your username will be used to log in.',
            style: TextStyle(
              color: Color(0xFF6366F1),
              fontSize: 12.5,
              fontWeight: FontWeight.w400,
            ),
          ),
        ),
      ],
    );
  }
}

/// Custom painter for the top-right subtle purple curved background accent.
class _TopRightWavePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint1 = Paint()
      ..color = const Color(0xFFF3E8FF).withValues(alpha: 0.7)
      ..style = PaintingStyle.fill;

    final paint2 = Paint()
      ..color = const Color(0xFFEDE9FE).withValues(alpha: 0.5)
      ..style = PaintingStyle.fill;

    final path1 = Path()
      ..moveTo(size.width * 0.25, 0)
      ..quadraticBezierTo(
        size.width * 0.45,
        size.height * 0.7,
        size.width,
        size.height * 0.9,
      )
      ..lineTo(size.width, 0)
      ..close();

    final path2 = Path()
      ..moveTo(size.width * 0.45, 0)
      ..quadraticBezierTo(
        size.width * 0.65,
        size.height * 0.55,
        size.width,
        size.height * 0.75,
      )
      ..lineTo(size.width, 0)
      ..close();

    canvas.drawPath(path1, paint1);
    canvas.drawPath(path2, paint2);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

/// Custom painter for the bottom-left subtle purple curved background accent.
class _BottomLeftWavePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFFF3E8FF).withValues(alpha: 0.6)
      ..style = PaintingStyle.fill;

    final path = Path()
      ..moveTo(0, size.height * 0.2)
      ..quadraticBezierTo(
        size.width * 0.65,
        size.height * 0.5,
        size.width * 0.8,
        size.height,
      )
      ..lineTo(0, size.height)
      ..close();

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
