import 'dart:async';
import 'dart:math' as math;

import 'package:flutter/material.dart';

import 'auth_service.dart';
import 'creator_data.dart';
import 'creator_screens.dart';

void main() {
  runApp(PostHubApp());
}

class PostHubApp extends StatelessWidget {
  PostHubApp({super.key, AppAuthService? authService})
    : authService = authService ?? AppAuthService(baseUrl: defaultApiBaseUrl());

  final AppAuthService authService;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Post Hub',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF7026E8),
          surface: Colors.white,
        ),
        fontFamily: 'Roboto',
      ),
      home: LoginPage(authService: authService),
    );
  }
}

class LoginPage extends StatefulWidget {
  const LoginPage({super.key, required this.authService});

  final AppAuthService authService;

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> with WidgetsBindingObserver {
  final _email = TextEditingController();
  final _password = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  AppLoginExperience _experience = AppLoginExperience.defaults;
  bool _isLoadingExperience = true;
  bool _isFetchingExperience = false;
  Timer? _refreshTimer;
  bool _showEmailForm = false;
  bool _hidePassword = true;
  bool _rememberMe = true;
  bool _isSubmitting = false;
  String? _configError;
  String? _errorMessage;

  Color get _accent =>
      _parseColor(_experience.accentColor, const Color(0xFF7026E8));

  Color get _background =>
      _parseColor(_experience.backgroundColor, const Color(0xFFFFF9FF));

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _loadExperience(showLoading: true);
    _refreshTimer = Timer.periodic(
      const Duration(seconds: 30),
      (_) => _loadExperience(),
    );
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      _loadExperience();
    }
  }

  @override
  void dispose() {
    _refreshTimer?.cancel();
    WidgetsBinding.instance.removeObserver(this);
    _email.dispose();
    _password.dispose();
    super.dispose();
  }

  Future<void> _loadExperience({bool showLoading = false}) async {
    if (_isFetchingExperience) return;
    _isFetchingExperience = true;
    if (showLoading && mounted) {
      setState(() {
        _isLoadingExperience = true;
        _configError = null;
      });
    }

    try {
      final experience = await widget.authService.loadLoginExperience();
      if (!mounted) return;
      if (experience != _experience ||
          _configError != null ||
          _isLoadingExperience) {
        setState(() {
          _experience = experience;
          _configError = null;
          _isLoadingExperience = false;
          if (!experience.emailEnabled) _showEmailForm = false;
        });
      }
    } on AppAuthException catch (error) {
      if (!mounted) return;
      setState(() {
        _configError = error.message;
        _isLoadingExperience = false;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() {
        _configError = 'Could not load the published login design.';
        _isLoadingExperience = false;
      });
    } finally {
      _isFetchingExperience = false;
    }
  }

  Future<void> _submit() async {
    FocusScope.of(context).unfocus();
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isSubmitting = true;
      _errorMessage = null;
    });

    try {
      final user = await widget.authService.login(
        email: _email.text,
        password: _password.text,
        rememberMe: _rememberMe,
      );
      if (!mounted) return;
      Navigator.of(context).pushReplacement(
        MaterialPageRoute<void>(
          builder: (_) => HomePage(authService: widget.authService, user: user),
        ),
      );
    } on AppAuthException catch (error) {
      if (!mounted) return;
      setState(() => _errorMessage = error.message);
    } catch (_) {
      if (!mounted) return;
      setState(() {
        _errorMessage = 'Unable to sign in right now. Please try again.';
      });
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  void _comingSoon(String feature) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('$feature is not connected yet.'),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  void _startDemoLogin() {
    Navigator.of(context).pushReplacement(
      MaterialPageRoute<void>(
        builder: (_) => HomePage(
          authService: widget.authService,
          user: const AppUser(
            id: 'demo-creator',
            email: 'demo@posthub.local',
            name: 'Creative Explorer',
            role: 'member',
          ),
          isDemo: true,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _background,
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            final width = math.min(constraints.maxWidth, 520.0);
            return SingleChildScrollView(
              keyboardDismissBehavior: ScrollViewKeyboardDismissBehavior.onDrag,
              child: Center(
                child: SizedBox(
                  width: width,
                  child: Column(
                    children: [
                      if (_experience.brandHeaderEnabled)
                        Padding(
                          padding: const EdgeInsets.fromLTRB(24, 20, 24, 12),
                          child: _BrandHeader(
                            experience: _experience,
                            accent: _accent,
                          ),
                        ),
                      if (_experience.welcomeEnabled)
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 16),
                          child: _LoginArtwork(
                            accent: _accent,
                            imageUrl: _experience.heroImageUrl,
                          ),
                        ),
                      Padding(
                        padding: const EdgeInsets.fromLTRB(26, 16, 26, 0),
                        child: _showEmailForm
                            ? _emailContent()
                            : _welcomeContent(),
                      ),
                      const SizedBox(height: 20),
                      if (_experience.footerTagline.trim().isNotEmpty)
                        _FooterBanner(
                          text: _experience.footerTagline,
                          accent: _accent,
                        ),
                    ],
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _welcomeContent() {
    final visibleOptions =
        _experience.googleEnabled ||
        _experience.emailEnabled ||
        _experience.mobileEnabled;

    return Column(
      children: [
        if (_experience.welcomeEnabled) ...[
          Text(
            _experience.welcomeTitle,
            textAlign: TextAlign.center,
            style: const TextStyle(
              color: Color(0xFF1E172F),
              fontSize: 28,
              height: 1.15,
              fontWeight: FontWeight.w900,
              letterSpacing: -0.7,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            _experience.welcomeSubtitle,
            textAlign: TextAlign.center,
            style: const TextStyle(
              color: Color(0xFF787284),
              fontSize: 13.5,
              height: 1.45,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
        if (_configError != null) ...[
          const SizedBox(height: 15),
          _ConfigLoadNotice(
            message: _configError!,
            loading: _isLoadingExperience,
            onRetry: () => _loadExperience(showLoading: true),
          ),
        ],
        const SizedBox(height: 20),
        if (_experience.googleEnabled)
          _GoogleButton(
            accent: _accent,
            onPressed: _isSubmitting ? null : _startDemoLogin,
          ),
        if (_experience.googleEnabled && _experience.emailEnabled)
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 16),
            child: _OrDivider(accent: _accent),
          ),
        if (_experience.emailEnabled)
          _MethodButton(
            key: const ValueKey('email-sign-in'),
            label: 'Continue with Email',
            icon: Icons.mail_outline_rounded,
            accent: _accent,
            onPressed: () {
              setState(() {
                _showEmailForm = true;
                _errorMessage = null;
              });
            },
          ),
        if (_experience.emailEnabled && _experience.mobileEnabled)
          const SizedBox(height: 12),
        if (_experience.mobileEnabled)
          _MethodButton(
            key: const ValueKey('mobile-sign-in'),
            label: 'Continue with Mobile',
            icon: Icons.phone_iphone_rounded,
            accent: _accent,
            onPressed: () => _comingSoon('Mobile sign-in'),
          ),
        if (!visibleOptions)
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 12),
            child: Text(
              'Sign-in options are currently unavailable.',
              textAlign: TextAlign.center,
              style: TextStyle(color: Color(0xFF817A8D), fontSize: 13),
            ),
          ),
        if (_experience.signupEnabled) ...[
          const SizedBox(height: 18),
          Wrap(
            alignment: WrapAlignment.center,
            crossAxisAlignment: WrapCrossAlignment.center,
            children: [
              const Text(
                'New to Post Hub? ',
                style: TextStyle(color: Color(0xFF787284), fontSize: 13),
              ),
              TextButton(
                onPressed: () => _comingSoon('Account creation'),
                style: TextButton.styleFrom(
                  foregroundColor: _accent,
                  padding: EdgeInsets.zero,
                  minimumSize: Size.zero,
                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                  textStyle: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                child: const Text('Create an Account  →'),
              ),
            ],
          ),
        ],
      ],
    );
  }

  Widget _emailContent() {
    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Align(
            alignment: Alignment.centerLeft,
            child: TextButton.icon(
              onPressed: _isSubmitting
                  ? null
                  : () => setState(() {
                      _showEmailForm = false;
                      _errorMessage = null;
                    }),
              icon: const Icon(Icons.arrow_back_rounded, size: 18),
              label: const Text('All sign-in options'),
              style: TextButton.styleFrom(
                foregroundColor: _accent,
                padding: EdgeInsets.zero,
                alignment: Alignment.centerLeft,
                textStyle: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          ),
          const SizedBox(height: 6),
          const Text(
            'Sign in with email',
            style: TextStyle(
              color: Color(0xFF1E172F),
              fontSize: 26,
              fontWeight: FontWeight.w900,
              letterSpacing: -0.6,
            ),
          ),
          const SizedBox(height: 5),
          const Text(
            'Enter your credentials to access your creative studio.',
            style: TextStyle(color: Color(0xFF787284), fontSize: 13),
          ),
          const SizedBox(height: 20),
          const _FieldLabel('EMAIL ADDRESS'),
          const SizedBox(height: 7),
          TextFormField(
            key: const ValueKey('email-field'),
            controller: _email,
            keyboardType: TextInputType.emailAddress,
            textInputAction: TextInputAction.next,
            autofillHints: const [AutofillHints.email],
            style: const TextStyle(
              color: Color(0xFF1E172F),
              fontSize: 14,
              fontWeight: FontWeight.w600,
            ),
            validator: (value) {
              final email = value?.trim() ?? '';
              if (email.isEmpty) return 'Enter your email address.';
              if (!RegExp(r'^[^\s@]+@[^\s@]+\.[^\s@]+$').hasMatch(email)) {
                return 'Enter a valid email address.';
              }
              return null;
            },
            decoration: _inputDecoration(
              hint: 'you@example.com',
              icon: Icons.alternate_email_rounded,
              accent: _accent,
            ),
          ),
          const SizedBox(height: 16),
          const _FieldLabel('PASSWORD'),
          const SizedBox(height: 7),
          TextFormField(
            key: const ValueKey('password-field'),
            controller: _password,
            obscureText: _hidePassword,
            textInputAction: TextInputAction.done,
            onFieldSubmitted: (_) => _submit(),
            autofillHints: const [AutofillHints.password],
            style: const TextStyle(
              color: Color(0xFF1E172F),
              fontSize: 14,
              fontWeight: FontWeight.w600,
            ),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Enter your password.';
              }
              return null;
            },
            decoration: _inputDecoration(
              hint: 'Enter your password',
              icon: Icons.lock_outline_rounded,
              accent: _accent,
              suffix: IconButton(
                tooltip: _hidePassword ? 'Show password' : 'Hide password',
                onPressed: () => setState(() => _hidePassword = !_hidePassword),
                icon: Icon(
                  _hidePassword
                      ? Icons.visibility_outlined
                      : Icons.visibility_off_outlined,
                  color: const Color(0xFF858195),
                  size: 20,
                ),
              ),
            ),
          ),
          const SizedBox(height: 10),
          Wrap(
            alignment: WrapAlignment.spaceBetween,
            crossAxisAlignment: WrapCrossAlignment.center,
            spacing: 8,
            children: [
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  SizedBox(
                    width: 22,
                    height: 22,
                    child: Checkbox(
                      value: _rememberMe,
                      onChanged: _isSubmitting
                          ? null
                          : (value) => setState(() => _rememberMe = value ?? false),
                      activeColor: _accent,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(5),
                      ),
                    ),
                  ),
                  const SizedBox(width: 6),
                  const Text(
                    'Remember me',
                    style: TextStyle(
                      color: Color(0xFF6B6577),
                      fontSize: 12.5,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
              TextButton(
                onPressed: _isSubmitting ? null : () => _comingSoon('Password recovery'),
                style: TextButton.styleFrom(
                  foregroundColor: _accent,
                  padding: EdgeInsets.zero,
                  minimumSize: Size.zero,
                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                  textStyle: const TextStyle(
                    fontSize: 12.5,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                child: const Text('Forgot password?'),
              ),
            ],
          ),
          if (_errorMessage != null) ...[
            const SizedBox(height: 12),
            _LoginError(message: _errorMessage!),
          ],
          const SizedBox(height: 18),
          Container(
            height: 54,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [_accent, Color.lerp(_accent, const Color(0xFF5B10D0), .4)!],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: _accent.withValues(alpha: .35),
                  blurRadius: 14,
                  offset: const Offset(0, 6),
                ),
              ],
            ),
            child: Material(
              color: Colors.transparent,
              child: InkWell(
                key: const ValueKey('login-submit'),
                onTap: _isSubmitting ? null : _submit,
                borderRadius: BorderRadius.circular(16),
                child: Center(
                  child: _isSubmitting
                      ? const SizedBox(
                          width: 22,
                          height: 22,
                          child: CircularProgressIndicator(
                            strokeWidth: 2.2,
                            color: Colors.white,
                          ),
                        )
                      : const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              'Sign in to Post Hub',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 15,
                                fontWeight: FontWeight.w800,
                                letterSpacing: -.2,
                              ),
                            ),
                            SizedBox(width: 8),
                            Icon(Icons.arrow_forward_rounded, color: Colors.white, size: 18),
                          ],
                        ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _BrandHeader extends StatelessWidget {
  const _BrandHeader({required this.experience, required this.accent});

  final AppLoginExperience experience;
  final Color accent;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                accent,
                Color.lerp(accent, const Color(0xFF00C4CC), .35)!,
              ],
            ),
            borderRadius: BorderRadius.circular(14),
            boxShadow: [
              BoxShadow(
                color: accent.withValues(alpha: .28),
                blurRadius: 16,
                offset: const Offset(0, 6),
              ),
            ],
          ),
          child: const Center(
            child: Text(
              'P',
              style: TextStyle(
                color: Colors.white,
                fontSize: 24,
                fontWeight: FontWeight.w900,
                letterSpacing: -1,
              ),
            ),
          ),
        ),
        const SizedBox(width: 12),
        Flexible(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Flexible(
                    child: Text(
                      experience.brandName,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        color: Color(0xFF1E172F),
                        fontSize: 22,
                        fontWeight: FontWeight.w900,
                        letterSpacing: -.6,
                      ),
                    ),
                  ),
                  const SizedBox(width: 6),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                    decoration: BoxDecoration(
                      color: accent.withValues(alpha: .12),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      'STUDIO',
                      style: TextStyle(
                        color: accent,
                        fontSize: 9,
                        fontWeight: FontWeight.w800,
                        letterSpacing: .5,
                      ),
                    ),
                  ),
                ],
              ),
              Text(
                experience.brandTagline,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  color: Color(0xFF8A8297),
                  fontSize: 11,
                  fontWeight: FontWeight.w600,
                  letterSpacing: .2,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

class _LoginArtwork extends StatefulWidget {
  const _LoginArtwork({required this.accent, required this.imageUrl});

  final Color accent;
  final String imageUrl;

  @override
  State<_LoginArtwork> createState() => _LoginArtworkState();
}

class _LoginArtworkState extends State<_LoginArtwork> {
  int _activeSlide = 0;
  Timer? _carouselTimer;

  static const _slides = [
    (
      tag: 'FESTIVAL',
      title: 'Diwali Mega Sale 50% Off',
      subtitle: 'Square 1080 × 1080 px · Instant Edit',
      gradient: [Color(0xFFFF6B4A), Color(0xFF7928CA)],
      badge: 'POPULAR',
    ),
    (
      tag: 'AI MAGIC',
      title: 'Prompt to Poster in 3s',
      subtitle: 'Cyberpunk Neon Cafe Visual',
      gradient: [Color(0xFF8B5CF6), Color(0xFF00C4CC)],
      badge: 'AI',
    ),
    (
      tag: 'STORIES',
      title: 'Autumn Coffee Launch',
      subtitle: '9:16 Vertical Story Template',
      gradient: [Color(0xFF1E1A33), Color(0xFF6B21A8)],
      badge: 'HOT',
    ),
  ];

  @override
  void initState() {
    super.initState();
    _carouselTimer = Timer.periodic(const Duration(seconds: 4), (_) {
      if (!mounted) return;
      setState(() => _activeSlide = (_activeSlide + 1) % _slides.length);
    });
  }

  @override
  void dispose() {
    _carouselTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (widget.imageUrl.trim().isNotEmpty) {
      return Container(
        height: 220,
        width: double.infinity,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(22),
          boxShadow: [
            BoxShadow(
              color: widget.accent.withValues(alpha: .2),
              blurRadius: 24,
              offset: const Offset(0, 10),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(22),
          child: Image.network(
            widget.imageUrl,
            fit: BoxFit.cover,
            errorBuilder: (_, _, _) => _defaultArtwork(context),
          ),
        ),
      );
    }

    return _defaultArtwork(context);
  }

  Widget _defaultArtwork(BuildContext context) {
    final slide = _slides[_activeSlide];

    return SizedBox(
      height: 228,
      width: double.infinity,
      child: Column(
        children: [
          Expanded(
            child: Stack(
              alignment: Alignment.center,
              children: [
                // Ambient glow behind cards
                Positioned(
                  top: 10,
                  child: Container(
                    width: 220,
                    height: 140,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(30),
                      boxShadow: [
                        BoxShadow(
                          color: slide.gradient.last.withValues(alpha: .35),
                          blurRadius: 36,
                          spreadRadius: 4,
                        ),
                      ],
                    ),
                  ),
                ),
                // Left tilted background flyer (Cold Brew Fest)
                Positioned(
                  left: 12,
                  top: 20,
                  child: Transform.rotate(
                    angle: -.11,
                    child: Container(
                      width: 108,
                      height: 140,
                      padding: const EdgeInsets.all(9),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFF0F172A), Color(0xFF1E293B)],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(
                          color: Colors.white.withValues(alpha: .18),
                          width: 1.2,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: .25),
                            blurRadius: 14,
                            offset: const Offset(0, 6),
                          ),
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 5,
                              vertical: 2,
                            ),
                            decoration: BoxDecoration(
                              color: const Color(0xFF00C4CC),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: const Text(
                              'FLYER 3:4',
                              style: TextStyle(
                                color: Color(0xFF0F172A),
                                fontSize: 7,
                                fontWeight: FontWeight.w900,
                              ),
                            ),
                          ),
                          const Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Cold Brew',
                                style: TextStyle(
                                  color: Color(0xFF38BDF8),
                                  fontSize: 10,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                              Text(
                                'Fest 2026',
                                style: TextStyle(
                                  color: Colors.white70,
                                  fontSize: 8,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                // Right tilted background flyer (Neon Story)
                Positioned(
                  right: 12,
                  top: 20,
                  child: Transform.rotate(
                    angle: .11,
                    child: Container(
                      width: 102,
                      height: 140,
                      padding: const EdgeInsets.all(9),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFF3B0764), Color(0xFF701A75)],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(
                          color: Colors.white.withValues(alpha: .2),
                          width: 1.2,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: .25),
                            blurRadius: 14,
                            offset: const Offset(0, 6),
                          ),
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 5,
                              vertical: 2,
                            ),
                            decoration: BoxDecoration(
                              color: const Color(0xFFF472B6),
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: const Text(
                              'STORY 9:16',
                              style: TextStyle(
                                color: Color(0xFF500724),
                                fontSize: 7,
                                fontWeight: FontWeight.w900,
                              ),
                            ),
                          ),
                          const Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Neon Night',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 10,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                              Text(
                                'Live Music',
                                style: TextStyle(
                                  color: Colors.white70,
                                  fontSize: 8,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
                // Main Hero Interactive Template Card (Center)
                AnimatedSwitcher(
                  duration: const Duration(milliseconds: 320),
                  child: Container(
                    key: ValueKey('hero-slide-$_activeSlide'),
                    width: 236,
                    height: 168,
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: slide.gradient,
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(
                        color: Colors.white.withValues(alpha: .3),
                        width: 1.5,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: slide.gradient.first.withValues(alpha: .4),
                          blurRadius: 22,
                          offset: const Offset(0, 10),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 6,
                                vertical: 2.5,
                              ),
                              decoration: BoxDecoration(
                                color: Colors.black.withValues(alpha: .32),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                slide.tag,
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 8,
                                  fontWeight: FontWeight.w800,
                                  letterSpacing: .3,
                                ),
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 5,
                                vertical: 2,
                              ),
                              decoration: BoxDecoration(
                                color: Colors.white.withValues(alpha: .25),
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: Text(
                                slide.badge,
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 7.5,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                            ),
                          ],
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              slide.title,
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 15,
                                height: 1.15,
                                fontWeight: FontWeight.w900,
                                letterSpacing: -.3,
                              ),
                            ),
                            const SizedBox(height: 3),
                            Text(
                              slide.subtitle,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(
                                color: Colors.white.withValues(alpha: .88),
                                fontSize: 9,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 7,
                                vertical: 3,
                              ),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(6),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withValues(alpha: .1),
                                    blurRadius: 4,
                                    offset: const Offset(0, 2),
                                  ),
                                ],
                              ),
                              child: const Text(
                                'EDIT →',
                                style: TextStyle(
                                  color: Color(0xFF1E172F),
                                  fontSize: 8,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                            ),
                            Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Container(
                                  width: 5,
                                  height: 5,
                                  decoration: const BoxDecoration(
                                    color: Color(0xFF10B981),
                                    shape: BoxShape.circle,
                                  ),
                                ),
                                const SizedBox(width: 4),
                                const Text(
                                  'Instant',
                                  style: TextStyle(
                                    color: Colors.white70,
                                    fontSize: 8,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 6),
          // Carousel slide dots
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              for (var i = 0; i < _slides.length; i++)
                GestureDetector(
                  onTap: () => setState(() => _activeSlide = i),
                  child: Container(
                    margin: const EdgeInsets.symmetric(horizontal: 3),
                    width: _activeSlide == i ? 18 : 6,
                    height: 5,
                    decoration: BoxDecoration(
                      color: _activeSlide == i
                          ? widget.accent
                          : widget.accent.withValues(alpha: .22),
                      borderRadius: BorderRadius.circular(3),
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

class _GoogleButton extends StatelessWidget {
  const _GoogleButton({required this.accent, required this.onPressed});

  final Color accent;
  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 52,
      child: OutlinedButton(
        key: const ValueKey('google-sign-in'),
        onPressed: onPressed,
        style: OutlinedButton.styleFrom(
          backgroundColor: Colors.white,
          foregroundColor: const Color(0xFF1E172F),
          side: const BorderSide(color: Color(0xFFE2DCE8), width: 1.2),
          elevation: 1,
          shadowColor: Colors.black.withValues(alpha: .04),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          textStyle: const TextStyle(fontSize: 14.5, fontWeight: FontWeight.w700),
        ),
        child: const Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            _GoogleMark(),
            SizedBox(width: 10),
            Flexible(
              child: Text(
                'Continue with Google',
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _GoogleMark extends StatelessWidget {
  const _GoogleMark();

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 22,
      height: 22,
      child: CustomPaint(
        size: const Size(20, 20),
        painter: _GoogleLogoPainter(),
      ),
    );
  }
}

class _GoogleLogoPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;
    final center = Offset(w / 2, h / 2);
    final radius = w / 2;

    final strokeWidth = radius * 0.44;
    final arcRect = Rect.fromCircle(
      center: center,
      radius: radius - strokeWidth / 2,
    );

    final strokeBlue = Paint()
      ..color = const Color(0xFF4285F4)
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth;
    final strokeRed = Paint()
      ..color = const Color(0xFFEA4335)
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth;
    final strokeYellow = Paint()
      ..color = const Color(0xFFFBBC05)
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth;
    final strokeGreen = Paint()
      ..color = const Color(0xFF34A853)
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth;

    // Draw Google 4-color arcs
    canvas.drawArc(arcRect, -0.785, 1.57, false, strokeBlue);
    canvas.drawArc(arcRect, 0.785, 1.57, false, strokeGreen);
    canvas.drawArc(arcRect, 2.355, 1.57, false, strokeYellow);
    canvas.drawArc(arcRect, 3.925, 1.57, false, strokeRed);

    // Crossbar for the 'G'
    final paintBlue = Paint()
      ..color = const Color(0xFF4285F4)
      ..style = PaintingStyle.fill;
    canvas.drawRect(
      Rect.fromLTWH(
        center.dx,
        center.dy - strokeWidth / 2,
        radius * 0.9,
        strokeWidth,
      ),
      paintBlue,
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _MethodButton extends StatelessWidget {
  const _MethodButton({
    super.key,
    required this.label,
    required this.icon,
    required this.accent,
    required this.onPressed,
  });

  final String label;
  final IconData icon;
  final Color accent;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 52,
      child: OutlinedButton.icon(
        onPressed: onPressed,
        icon: Icon(icon, size: 20, color: accent),
        label: Text(label),
        style: OutlinedButton.styleFrom(
          foregroundColor: const Color(0xFF1E172F),
          backgroundColor: Colors.white,
          side: const BorderSide(color: Color(0xFFE2DCE8), width: 1.2),
          elevation: 1,
          shadowColor: Colors.black.withValues(alpha: .03),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          textStyle: const TextStyle(fontSize: 14.5, fontWeight: FontWeight.w700),
        ),
      ),
    );
  }
}

class _OrDivider extends StatelessWidget {
  const _OrDivider({required this.accent});

  final Color accent;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        const Expanded(child: Divider(color: Color(0xFFE9E2EF))),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 13),
          child: Text(
            'or',
            style: TextStyle(
              color: accent,
              fontSize: 12,
              fontWeight: FontWeight.w700,
            ),
          ),
        ),
        const Expanded(child: Divider(color: Color(0xFFE9E2EF))),
      ],
    );
  }
}

class _FieldLabel extends StatelessWidget {
  const _FieldLabel(this.text);

  final String text;

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: const TextStyle(
        color: Color(0xFF655D70),
        fontSize: 10,
        fontWeight: FontWeight.w800,
        letterSpacing: .85,
      ),
    );
  }
}

InputDecoration _inputDecoration({
  required String hint,
  required IconData icon,
  required Color accent,
  Widget? suffix,
}) {
  return InputDecoration(
    hintText: hint,
    prefixIcon: Icon(icon, color: const Color(0xFF8B8498), size: 19),
    suffixIcon: suffix,
    filled: true,
    fillColor: Colors.white,
    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 15),
    hintStyle: const TextStyle(color: Color(0xFFAAA3B4), fontSize: 13.5),
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(14),
      borderSide: const BorderSide(color: Color(0xFFE4DFEC), width: 1.2),
    ),
    enabledBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(14),
      borderSide: const BorderSide(color: Color(0xFFE4DFEC), width: 1.2),
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(14),
      borderSide: BorderSide(color: accent, width: 1.8),
    ),
    errorBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(14),
      borderSide: const BorderSide(color: Color(0xFFD92D20), width: 1.2),
    ),
    focusedErrorBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(14),
      borderSide: const BorderSide(color: Color(0xFFD92D20), width: 1.8),
    ),
  );
}

class _LoginError extends StatelessWidget {
  const _LoginError({required this.message});

  final String message;

  @override
  Widget build(BuildContext context) {
    return Container(
      key: const ValueKey('login-error'),
      width: double.infinity,
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFFFFF0EF),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFFFD8D5)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(
            Icons.error_outline_rounded,
            size: 18,
            color: Color(0xFFB42318),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              message,
              style: const TextStyle(
                color: Color(0xFFB42318),
                fontSize: 12,
                height: 1.45,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _ConfigLoadNotice extends StatelessWidget {
  const _ConfigLoadNotice({
    required this.message,
    required this.loading,
    required this.onRetry,
  });

  final String message;
  final bool loading;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 11, vertical: 9),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFEAE3EF)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Icon(
                Icons.info_outline_rounded,
                color: Color(0xFF817A8D),
                size: 17,
              ),
              const SizedBox(width: 7),
              Expanded(
                child: Text(
                  message,
                  style: const TextStyle(
                    color: Color(0xFF817A8D),
                    fontSize: 11,
                    height: 1.35,
                  ),
                ),
              ),
            ],
          ),
          Align(
            alignment: Alignment.centerRight,
            child: TextButton(
              onPressed: loading ? null : onRetry,
              style: TextButton.styleFrom(
                foregroundColor: const Color(0xFF7026E8),
                padding: const EdgeInsets.symmetric(horizontal: 5),
                minimumSize: Size.zero,
                tapTargetSize: MaterialTapTargetSize.shrinkWrap,
              ),
              child: Text(loading ? 'Loading' : 'Retry'),
            ),
          ),
        ],
      ),
    );
  }
}

class _FooterBanner extends StatelessWidget {
  const _FooterBanner({required this.text, required this.accent});

  final String text;
  final Color accent;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(20, 16, 20, 20),
      child: Center(
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.auto_awesome, color: accent, size: 14),
            const SizedBox(width: 6),
            Flexible(
              child: Text(
                text,
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: accent,
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                  letterSpacing: .3,
                ),
              ),
            ),
            const SizedBox(width: 6),
            Icon(Icons.auto_awesome, color: accent, size: 14),
          ],
        ),
      ),
    );
  }
}

class HomePage extends StatefulWidget {
  const HomePage({
    super.key,
    required this.authService,
    required this.user,
    this.isDemo = false,
  });

  final AppAuthService authService;
  final AppUser user;
  final bool isDemo;

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final _promptController = TextEditingController();
  final _creatorStore = CreatorStore();
  AppHomeExperience _experience = AppHomeExperience.defaults;
  CreatorPreferences _creatorPreferences = const CreatorPreferences();
  List<SavedDesign> _savedDesigns = [];
  bool _isLoading = true;
  bool _isLoadingLocalData = true;
  String? _loadError;
  String? _localDataError;
  String _selectedCategory = 'All';
  int _selectedTab = 0;

  @override
  void dispose() {
    _promptController.dispose();
    super.dispose();
  }

  Color get _accent =>
      _parseColor(_experience.accentColor, const Color(0xFF7956C9));
  Color get _background =>
      _parseColor(_experience.backgroundColor, const Color(0xFFFAF7F2));

  @override
  void initState() {
    super.initState();
    _loadHomeExperience();
    _loadCreatorData();
  }

  Future<void> _loadCreatorData() async {
    try {
      final values = await Future.wait<Object>([
        _creatorStore.loadPreferences(),
        _creatorStore.loadDesigns(),
      ]);
      if (!mounted) return;
      setState(() {
        _creatorPreferences = values[0] as CreatorPreferences;
        _savedDesigns = values[1] as List<SavedDesign>;
        _isLoadingLocalData = false;
        _localDataError = null;
      });
    } catch (error) {
      if (!mounted) return;
      setState(() {
        _isLoadingLocalData = false;
        _localDataError = 'Could not load saved creator preferences: $error';
      });
    }
  }

  Future<void> _saveCreatorPreferences(CreatorPreferences preferences) async {
    try {
      await _creatorStore.savePreferences(preferences);
      if (!mounted) return;
      setState(() {
        _creatorPreferences = preferences;
        _selectedCategory = 'All';
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Your preferences are saved on this device.'),
          behavior: SnackBarBehavior.floating,
        ),
      );
    } catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Could not save your preferences: $error'),
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  Future<void> _openTemplate(OccasionTemplate template) async {
    final design = await Navigator.of(context).push<SavedDesign>(
      MaterialPageRoute<SavedDesign>(
        builder: (_) => TemplateEditorPage(
          template: template,
          preferences: _creatorPreferences,
        ),
      ),
    );
    if (design == null || !mounted) return;
    try {
      await _creatorStore.saveDesign(design);
      if (!mounted) return;
      setState(() {
        _savedDesigns = [design, ..._savedDesigns];
        if (design.businessName.trim().isNotEmpty) {
          _creatorPreferences = _creatorPreferences.copyWith(
            businessName: design.businessName.trim(),
          );
        }
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Design saved to My designs.'),
          behavior: SnackBarBehavior.floating,
        ),
      );
    } catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Could not save your design: $error'),
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  Future<void> _deleteDesign(SavedDesign design) async {
    try {
      await _creatorStore.deleteDesign(design.id);
      if (!mounted) return;
      setState(() => _savedDesigns.removeWhere((item) => item.id == design.id));
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Design removed from this device.'),
          behavior: SnackBarBehavior.floating,
        ),
      );
    } catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Could not delete the design: $error'),
          behavior: SnackBarBehavior.floating,
        ),
      );
    }
  }

  Future<void> _loadHomeExperience() async {
    try {
      final experience = await widget.authService.loadHomeExperience();
      if (!mounted) return;
      setState(() {
        _experience = experience;
        _isLoading = false;
        _loadError = null;
      });
    } on AppAuthException catch (error) {
      if (!mounted) return;
      setState(() {
        _isLoading = false;
        _loadError = error.message;
      });
    } catch (_) {
      if (!mounted) return;
      setState(() {
        _isLoading = false;
        _loadError = 'Could not load the published Home screen settings.';
      });
    }
  }

  Future<void> _signOut() async {
    await widget.authService.logout();
    if (!mounted) return;
    Navigator.of(context).pushAndRemoveUntil(
      MaterialPageRoute<void>(
        builder: (_) => LoginPage(authService: widget.authService),
      ),
      (_) => false,
    );
  }

  void _showComingSoon(String feature) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('$feature is coming soon in this demo.'),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _background,
      body: SafeArea(
        child: Column(
          children: [
            _HomeTopBar(
              user: widget.user,
              title: _experience.headerTitle,
              accent: _accent,
              isDemo: widget.isDemo,
              onSignOut: _signOut,
              onNotifications: () => setState(() => _selectedTab = 3),
            ),
            Expanded(
              child: Center(
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 620),
                  child: _selectedTab == 0
                      ? _homeDashboard()
                      : _selectedTab == 1
                      ? _exploreScreen()
                      : _selectedTab == 2
                      ? SavedDesignsScreen(
                          designs: _savedDesigns,
                          accent: _accent,
                          onDelete: _deleteDesign,
                        )
                      : CreatorProfileScreen(
                          key: ValueKey(
                            'creator-profile-${_creatorPreferences.region}-${_creatorPreferences.businessName}',
                          ),
                          initialPreferences: _creatorPreferences,
                          onSave: _saveCreatorPreferences,
                        ),
                ),
              ),
            ),
          ],
        ),
      ),
      bottomNavigationBar: _HomeBottomNavigationBar(
        accent: _accent,
        onSelect: (index) {
          setState(() => _selectedTab = index);
        },
        selectedIndex: _selectedTab,
      ),
    );
  }

  Widget _homeDashboard() {
    return ListView(
      key: const ValueKey('home-dashboard'),
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 28),
      children: [
        if (_loadError != null)
          _HomeConfigError(message: _loadError!, onRetry: _loadHomeExperience),
        if (_loadError != null) const SizedBox(height: 18),
        if (_localDataError != null)
          _HomeConfigError(
            message: _localDataError!,
            onRetry: _loadCreatorData,
          ),
        if (_localDataError != null) const SizedBox(height: 18),
        if (_isLoading && _loadError == null ||
            _isLoadingLocalData && _localDataError == null)
          const LinearProgressIndicator(),
        if (widget.isDemo) ...[const _DemoNotice(), const SizedBox(height: 18)],
        ..._homeSections(),
      ],
    );
  }

  Widget _exploreScreen() {
    return ListView(
      key: const ValueKey('explore-screen'),
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 28),
      children: [
        Text(
          'Explore ${_creatorPreferences.region}',
          style: const TextStyle(
            color: Color(0xFF211D35),
            fontSize: 24,
            fontWeight: FontWeight.w900,
          ),
        ),
        const SizedBox(height: 5),
        const Text(
          'Find a design for festivals, celebrations and your business.',
          style: TextStyle(color: Color(0xFF817A8D), fontSize: 12),
        ),
        const SizedBox(height: 18),
        TemplateCatalogSection(
          region: _creatorPreferences.region,
          accent: _accent,
          selectedCategory: _selectedCategory,
          onCategorySelected: (category) =>
              setState(() => _selectedCategory = category),
          onTemplateSelected: _openTemplate,
          onSeeAll: () {},
          showSearch: true,
        ),
      ],
    );
  }

  List<Widget> _homeSections() {
    final sections = [..._experience.sections]
      ..sort((first, second) => first.order.compareTo(second.order));
    return [
      for (final section in sections)
        if (section.enabled)
          switch (section.id) {
            'hero' when _experience.bannerVisible => Padding(
              padding: const EdgeInsets.only(bottom: 20),
              child: _HomeHero(
                accent: _accent,
                userName: widget.user.name,
                onGenerate: () {
                  if (_promptController.text.trim().isEmpty) {
                    _showComingSoon('AI design');
                  } else {
                    _showComingSoon(
                      'AI design for "${_promptController.text.trim()}"',
                    );
                  }
                },
                promptController: _promptController,
              ),
            ),
            'categories' when _experience.tagsFilterEnabled => _HomeCategories(
              title: 'Quick Create',
              accent: _accent,
              onCreate: _showComingSoon,
            ),
            'featured_templates' => _FeaturedTemplates(
              title: section.title,
              region: _creatorPreferences.region,
              accent: _accent,
              count: _experience.itemsPerPage,
              columns: _experience.gridColumns,
              selectedCategory: _selectedCategory,
              onCategorySelected: (category) =>
                  setState(() => _selectedCategory = category),
              onTemplateSelected: _openTemplate,
              onSeeAll: () => setState(() => _selectedTab = 1),
            ),
            'action_banner' when _experience.quickActionsEnabled => Padding(
              padding: const EdgeInsets.only(top: 18),
              child: _RecentDesigns(
                title: 'Recent Designs',
                accent: _accent,
                designs: _savedDesigns.take(3).toList(),
                onSeeAll: () => setState(() => _selectedTab = 2),
              ),
            ),
            _ => const SizedBox.shrink(),
          },
    ];
  }
}

class _HomeTopBar extends StatelessWidget {
  const _HomeTopBar({
    required this.user,
    required this.title,
    required this.accent,
    required this.isDemo,
    required this.onSignOut,
    required this.onNotifications,
  });

  final AppUser user;
  final String title;
  final Color accent;
  final bool isDemo;
  final VoidCallback onSignOut;
  final VoidCallback onNotifications;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 10, 16, 12),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(
          bottom: BorderSide(
            color: Color(0xFFF1EEF5),
            width: 1,
          ),
        ),
      ),
      child: Row(
        children: [
          // Canva-style gradient squircle P mark
          Container(
            width: 38,
            height: 38,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  accent,
                  Color.lerp(accent, const Color(0xFF8B5CF6), .6)!,
                  const Color(0xFF00C4CC),
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(12),
              boxShadow: [
                BoxShadow(
                  color: accent.withValues(alpha: .3),
                  blurRadius: 10,
                  offset: const Offset(0, 3),
                ),
              ],
            ),
            child: const Center(
              child: Text(
                'P',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 22,
                  fontWeight: FontWeight.w900,
                  height: 1,
                ),
              ),
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Row(
                  children: [
                    const Text(
                      'Post Hub',
                      style: TextStyle(
                        color: Color(0xFF1E172F),
                        fontSize: 18,
                        fontWeight: FontWeight.w900,
                        letterSpacing: -.5,
                      ),
                    ),
                    const SizedBox(width: 6),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 5,
                        vertical: 1.5,
                      ),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            accent,
                            Color.lerp(accent, const Color(0xFFFF6B4A), .4)!,
                          ],
                        ),
                        borderRadius: BorderRadius.circular(5),
                      ),
                      child: const Text(
                        'PRO',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 8.5,
                          fontWeight: FontWeight.w900,
                          letterSpacing: .4,
                        ),
                      ),
                    ),
                  ],
                ),
                Text(
                  title.trim().isEmpty ? 'Creative Studio' : title,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: Color(0xFF787284),
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
          // Notification bell with unread indicator dot
          Stack(
            clipBehavior: Clip.none,
            children: [
              IconButton(
                tooltip: 'Notifications',
                onPressed: onNotifications,
                icon: const Icon(Icons.notifications_none_rounded, size: 24),
                color: const Color(0xFF1E172F),
                splashRadius: 22,
              ),
              Positioned(
                right: 9,
                top: 9,
                child: Container(
                  width: 8,
                  height: 8,
                  decoration: BoxDecoration(
                    color: const Color(0xFFFF4D4F),
                    shape: BoxShape.circle,
                    border: Border.all(color: Colors.white, width: 1.5),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(width: 4),
          // User Avatar with gradient ring
          Tooltip(
            message: isDemo
                ? 'Demo account — tap to sign out'
                : 'Tap to sign out',
            child: InkWell(
              onTap: onSignOut,
              customBorder: const CircleBorder(),
              child: Stack(
                clipBehavior: Clip.none,
                children: [
                  Container(
                    padding: const EdgeInsets.all(2),
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: LinearGradient(
                        colors: [accent, const Color(0xFF00C4CC)],
                      ),
                    ),
                    child: CircleAvatar(
                      radius: 17,
                      backgroundColor: Colors.white,
                      child: Text(
                        user.name.isEmpty ? 'P' : user.name[0].toUpperCase(),
                        style: TextStyle(
                          color: accent,
                          fontSize: 14,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                    ),
                  ),
                  if (isDemo)
                    Positioned(
                      right: -1,
                      bottom: -1,
                      child: Container(
                        width: 12,
                        height: 12,
                        decoration: BoxDecoration(
                          color: const Color(0xFFF2A93B),
                          shape: BoxShape.circle,
                          border: Border.all(color: Colors.white, width: 2),
                        ),
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
}

class _DemoNotice extends StatelessWidget {
  const _DemoNotice();

  @override
  Widget build(BuildContext context) {
    return Container(
      key: const ValueKey('demo-session-notice'),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 11),
      decoration: BoxDecoration(
        color: const Color(0xFFFFF8E8),
        border: Border.all(color: const Color(0xFFF4DDAA)),
        borderRadius: BorderRadius.circular(16),
      ),
      child: const Row(
        children: [
          Icon(Icons.info_outline_rounded, color: Color(0xFF9A690B), size: 18),
          SizedBox(width: 9),
          Expanded(
            child: Text(
              'Demo preview — Google sign-in is not connected yet.',
              style: TextStyle(
                color: Color(0xFF75530E),
                fontSize: 11.5,
                height: 1.35,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _HomeHero extends StatelessWidget {
  const _HomeHero({
    required this.accent,
    required this.userName,
    required this.promptController,
    required this.onGenerate,
  });

  final Color accent;
  final String userName;
  final TextEditingController promptController;
  final VoidCallback onGenerate;

  static const _quickPrompts = [
    'Diwali Sale 50% Off 🎆',
    'Coffee Cafe Flyer ☕',
    'Neon Music Story ⚡',
    'New Launch 🚀',
  ];

  @override
  Widget build(BuildContext context) {
    final displayName = userName.trim().isEmpty
        ? 'Creator'
        : userName.trim().split(' ').first;

    return Container(
      key: const ValueKey('home-hero'),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [
            Color(0xFF1A122E),
            Color(0xFF2C194D),
            Color(0xFF161127),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: accent.withValues(alpha: .28),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          Positioned(
            right: -20,
            top: -20,
            child: Container(
              width: 140,
              height: 140,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  colors: [
                    accent.withValues(alpha: .35),
                    Colors.transparent,
                  ],
                ),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(18, 18, 18, 16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 3.5,
                      ),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [accent, const Color(0xFF00C4CC)],
                        ),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.auto_awesome, color: Colors.white, size: 11),
                          SizedBox(width: 4),
                          Text(
                            'MAGIC STUDIO',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 9,
                              fontWeight: FontWeight.w900,
                              letterSpacing: .6,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Text(
                      'AI v2.4',
                      style: TextStyle(
                        color: Colors.white.withValues(alpha: .5),
                        fontSize: 10,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Text(
                  'Good day, $displayName 👋',
                  style: TextStyle(
                    color: Colors.white.withValues(alpha: .75),
                    fontSize: 12.5,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 2),
                const Text(
                  'What will you design today?',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 22,
                    height: 1.15,
                    fontWeight: FontWeight.w900,
                    letterSpacing: -.6,
                  ),
                ),
                const SizedBox(height: 14),
                Container(
                  height: 48,
                  padding: const EdgeInsets.fromLTRB(12, 0, 4, 0),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: .15),
                        blurRadius: 10,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      Icon(Icons.auto_awesome, color: accent, size: 18),
                      const SizedBox(width: 8),
                      Expanded(
                        child: TextField(
                          key: const ValueKey('home-ai-prompt'),
                          controller: promptController,
                          textInputAction: TextInputAction.go,
                          onSubmitted: (_) => onGenerate(),
                          style: const TextStyle(
                            color: Color(0xFF1E172F),
                            fontSize: 12.5,
                            fontWeight: FontWeight.w600,
                          ),
                          decoration: const InputDecoration(
                            hintText: 'Describe your idea, poster or festival...',
                            hintStyle: TextStyle(
                              color: Color(0xFF9E98A8),
                              fontSize: 11.5,
                            ),
                            border: InputBorder.none,
                            isDense: true,
                          ),
                        ),
                      ),
                      const SizedBox(width: 4),
                      Material(
                        color: accent,
                        shape: const CircleBorder(),
                        child: InkWell(
                          key: const ValueKey('home-ai-submit'),
                          customBorder: const CircleBorder(),
                          onTap: onGenerate,
                          child: Container(
                            width: 38,
                            height: 38,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              gradient: LinearGradient(
                                colors: [
                                  accent,
                                  Color.lerp(
                                    accent,
                                    const Color(0xFF00C4CC),
                                    .3,
                                  )!,
                                ],
                              ),
                            ),
                            child: const Icon(
                              Icons.arrow_forward_rounded,
                              color: Colors.white,
                              size: 19,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 10),
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      for (final chip in _quickPrompts)
                        Padding(
                          padding: const EdgeInsets.only(right: 7),
                          child: InkWell(
                            onTap: () {
                              promptController.text = chip;
                            },
                            borderRadius: BorderRadius.circular(14),
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 9,
                                vertical: 4.5,
                              ),
                              decoration: BoxDecoration(
                                color: Colors.white.withValues(alpha: .12),
                                borderRadius: BorderRadius.circular(14),
                                border: Border.all(
                                  color: Colors.white.withValues(alpha: .18),
                                ),
                              ),
                              child: Text(
                                chip,
                                style: TextStyle(
                                  color: Colors.white.withValues(alpha: .9),
                                  fontSize: 10,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _HomeCategories extends StatelessWidget {
  const _HomeCategories({
    required this.title,
    required this.accent,
    required this.onCreate,
  });

  final String title;
  final Color accent;
  final ValueChanged<String> onCreate;

  static const _formats = [
    (
      'Post',
      '1080 × 1080',
      Icons.camera_alt_rounded,
      [Color(0xFFFF5376), Color(0xFFFF8552)],
    ),
    (
      'Story',
      '9:16 Vertical',
      Icons.amp_stories_rounded,
      [Color(0xFF8B5CF6), Color(0xFFC084FC)],
    ),
    (
      'Poster',
      'Print A4',
      Icons.dashboard_customize_rounded,
      [Color(0xFF00C4CC), Color(0xFF38BDF8)],
    ),
    (
      'Video',
      'Reels & 16:9',
      Icons.play_circle_fill_rounded,
      [Color(0xFFEC4899), Color(0xFFF43F5E)],
    ),
    (
      'Custom Size',
      'Any px',
      Icons.crop_free_rounded,
      [Color(0xFF6366F1), Color(0xFF8B5CF6)],
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _SectionHeading(
          title: title,
          trailing: 'See all  →',
          onTrailingTap: () => onCreate('Quick Create'),
        ),
        const SizedBox(height: 12),
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: [
              for (var index = 0; index < _formats.length; index++)
                Padding(
                  padding: EdgeInsets.only(
                    right: index == _formats.length - 1 ? 0 : 12,
                  ),
                  child: InkWell(
                    key: ValueKey('quick-create-${_formats[index].$1}'),
                    borderRadius: BorderRadius.circular(18),
                    onTap: () => onCreate(_formats[index].$1),
                    child: Container(
                      width: 82,
                      padding: const EdgeInsets.fromLTRB(8, 10, 8, 8),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(18),
                        border: Border.all(
                          color: const Color(0xFFEFEAF4),
                          width: 1,
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: .03),
                            blurRadius: 10,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Container(
                            width: 48,
                            height: 48,
                            decoration: BoxDecoration(
                              gradient: LinearGradient(
                                colors: _formats[index].$4,
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                              ),
                              borderRadius: BorderRadius.circular(14),
                              boxShadow: [
                                BoxShadow(
                                  color: _formats[index].$4.first.withValues(
                                    alpha: .32,
                                  ),
                                  blurRadius: 8,
                                  offset: const Offset(0, 3),
                                ),
                              ],
                            ),
                            child: Icon(
                              _formats[index].$3,
                              color: Colors.white,
                              size: 24,
                            ),
                          ),
                          const SizedBox(height: 7),
                          Text(
                            _formats[index].$1,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              color: Color(0xFF1E172F),
                              fontSize: 11,
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                          const SizedBox(height: 1),
                          Text(
                            _formats[index].$2,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              color: Color(0xFF8B8594),
                              fontSize: 8.5,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
            ],
          ),
        ),
        const SizedBox(height: 18),
      ],
    );
  }
}

class _FeaturedTemplates extends StatelessWidget {
  const _FeaturedTemplates({
    required this.title,
    required this.region,
    required this.accent,
    required this.count,
    required this.columns,
    required this.selectedCategory,
    required this.onCategorySelected,
    required this.onTemplateSelected,
    required this.onSeeAll,
  });

  final String title;
  final String region;
  final Color accent;
  final int count;
  final int columns;
  final String selectedCategory;
  final ValueChanged<String> onCategorySelected;
  final ValueChanged<OccasionTemplate> onTemplateSelected;
  final VoidCallback onSeeAll;

  @override
  Widget build(BuildContext context) => TemplateCatalogSection(
    title: title,
    region: region,
    accent: accent,
    selectedCategory: selectedCategory,
    onCategorySelected: onCategorySelected,
    onTemplateSelected: onTemplateSelected,
    onSeeAll: onSeeAll,
    maxItems: count,
    columns: columns,
  );
}

class _RecentDesigns extends StatelessWidget {
  const _RecentDesigns({
    required this.title,
    required this.accent,
    required this.designs,
    required this.onSeeAll,
  });

  final String title;
  final Color accent;
  final List<SavedDesign> designs;
  final VoidCallback onSeeAll;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _SectionHeading(
          title: title,
          trailing: 'See all  →',
          onTrailingTap: onSeeAll,
        ),
        const SizedBox(height: 12),
        if (designs.isEmpty)
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: const Color(0xFFEDE8F0)),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: .02),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
            child: Row(
              children: [
                Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                    color: accent.withValues(alpha: .1),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(Icons.auto_awesome, color: accent, size: 20),
                ),
                const SizedBox(width: 12),
                const Expanded(
                  child: Text(
                    'Choose an occasion template and save your first design.',
                    style: TextStyle(
                      color: Color(0xFF514A5C),
                      fontSize: 11.5,
                      height: 1.4,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
          )
        else
          SizedBox(
            height: 154,
            child: ListView.separated(
              key: const ValueKey('recent-designs-list'),
              scrollDirection: Axis.horizontal,
              itemCount: designs.length,
              separatorBuilder: (_, _) => const SizedBox(width: 12),
              itemBuilder: (context, index) {
                final design = designs[index];
                return Container(
                  width: 118,
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFFEDE8F0)),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: .03),
                        blurRadius: 8,
                        offset: const Offset(0, 3),
                      ),
                    ],
                  ),
                  padding: const EdgeInsets.all(7),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Expanded(
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(11),
                          child: TemplatePoster.fromSavedDesign(design),
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        design.title,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          color: Color(0xFF1E172F),
                          fontSize: 10.5,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                      Text(
                        design.occasion,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          color: Color(0xFF8A8394),
                          fontSize: 9,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
      ],
    );
  }
}

class _SectionHeading extends StatelessWidget {
  const _SectionHeading({
    required this.title,
    this.trailing,
    this.onTrailingTap,
  });

  final String title;
  final String? trailing;
  final VoidCallback? onTrailingTap;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: Text(
            title,
            style: const TextStyle(
              color: Color(0xFF1E172F),
              fontSize: 16,
              fontWeight: FontWeight.w900,
              letterSpacing: -.3,
            ),
          ),
        ),
        if (trailing != null)
          InkWell(
            onTap: onTrailingTap,
            borderRadius: BorderRadius.circular(8),
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 5, horizontal: 3),
              child: Text(
                trailing!,
                style: const TextStyle(
                  color: Color(0xFF817A8D),
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          ),
      ],
    );
  }
}

class _HomeBottomNavigationBar extends StatelessWidget {
  const _HomeBottomNavigationBar({
    required this.accent,
    required this.onSelect,
    required this.selectedIndex,
  });

  final Color accent;
  final ValueChanged<int> onSelect;
  final int selectedIndex;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: Color(0xFFF0ECF2), width: 1)),
      ),
      child: SafeArea(
        top: false,
        child: SizedBox(
          height: 64,
          child: Row(
            children: [
              // 1. Home
              _navItem(
                key: const ValueKey('home-navigation-Home'),
                label: 'Home',
                icon: selectedIndex == 0
                    ? Icons.home_rounded
                    : Icons.home_outlined,
                isSelected: selectedIndex == 0,
                onTap: () => onSelect(0),
              ),
              // 2. Explore
              _navItem(
                key: const ValueKey('home-navigation-Explore'),
                label: 'Explore',
                icon: selectedIndex == 1
                    ? Icons.explore_rounded
                    : Icons.explore_outlined,
                isSelected: selectedIndex == 1,
                onTap: () => onSelect(1),
              ),
              // 3. Center Canva Floating + Create Action Button
              Expanded(
                child: Center(
                  child: InkWell(
                    onTap: () => onSelect(1),
                    customBorder: const CircleBorder(),
                    child: Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [accent, const Color(0xFF00C4CC)],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: accent.withValues(alpha: .4),
                            blurRadius: 10,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: const Icon(
                        Icons.add_rounded,
                        color: Colors.white,
                        size: 28,
                      ),
                    ),
                  ),
                ),
              ),
              // 4. Saved
              _navItem(
                key: const ValueKey('home-navigation-Saved'),
                label: 'Saved',
                icon: selectedIndex == 2
                    ? Icons.bookmark_rounded
                    : Icons.bookmark_border_rounded,
                isSelected: selectedIndex == 2,
                onTap: () => onSelect(2),
              ),
              // 5. Profile
              _navItem(
                key: const ValueKey('home-navigation-Profile'),
                label: 'Profile',
                icon: selectedIndex == 3
                    ? Icons.person_rounded
                    : Icons.person_outline_rounded,
                isSelected: selectedIndex == 3,
                onTap: () => onSelect(3),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _navItem({
    required Key key,
    required String label,
    required IconData icon,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    return Expanded(
      child: InkWell(
        key: key,
        onTap: onTap,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              color: isSelected ? accent : const Color(0xFF9B95A3),
              size: 23,
            ),
            const SizedBox(height: 3),
            Text(
              label,
              style: TextStyle(
                color: isSelected ? accent : const Color(0xFF8A8394),
                fontSize: 9.5,
                fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _HomeConfigError extends StatelessWidget {
  const _HomeConfigError({required this.message, required this.onRetry});

  final String message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 14),
      child: Material(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        child: ListTile(
          leading: const Icon(Icons.info_outline, color: Color(0xFF8A5A00)),
          title: Text(
            message,
            style: const TextStyle(fontSize: 12, color: Color(0xFF574A35)),
          ),
          trailing: IconButton(
            tooltip: 'Retry',
            onPressed: onRetry,
            icon: const Icon(Icons.refresh_rounded),
          ),
        ),
      ),
    );
  }
}

Color _parseColor(String value, Color fallback) {
  final normalized = value.trim().replaceFirst('#', '');
  if (!RegExp(r'^(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$').hasMatch(normalized)) {
    return fallback;
  }
  final parsed = int.tryParse(normalized, radix: 16);
  if (parsed == null) return fallback;
  return Color(normalized.length == 6 ? 0xFF000000 | parsed : parsed);
}
