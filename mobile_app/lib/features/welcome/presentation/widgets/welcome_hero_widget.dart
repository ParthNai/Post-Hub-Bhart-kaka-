import 'package:flutter/material.dart';
import 'package:panchayat_post/core/constants/app_assets.dart';

/// Hero visual composition for Screen 02 Welcome Screen.
/// Displays the approved 5-poster fanned-out preview stack with smooth entrance animation.
class WelcomeHeroWidget extends StatefulWidget {
  const WelcomeHeroWidget({
    super.key,
    this.height,
  });

  final double? height;

  @override
  State<WelcomeHeroWidget> createState() => _WelcomeHeroWidgetState();
}

class _WelcomeHeroWidgetState extends State<WelcomeHeroWidget>
    with SingleTickerProviderStateMixin {
  late final AnimationController _animController;
  late final Animation<double> _scaleAnimation;
  late final Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 650),
    );

    _scaleAnimation = Tween<double>(begin: 0.93, end: 1.0).animate(
      CurvedAnimation(parent: _animController, curve: Curves.easeOutCubic),
    );

    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _animController, curve: Curves.easeIn),
    );

    _animController.forward();
  }

  @override
  void dispose() {
    _animController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final effectiveHeight = widget.height ?? 235.0;

    return FadeTransition(
      opacity: _fadeAnimation,
      child: ScaleTransition(
        scale: _scaleAnimation,
        child: Container(
          height: effectiveHeight,
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          alignment: Alignment.center,
          child: Image.asset(
            AppAssets.welcomeHeroPosters,
            height: effectiveHeight,
            fit: BoxFit.contain,
            filterQuality: FilterQuality.high,
          ),
        ),
      ),
    );
  }
}
