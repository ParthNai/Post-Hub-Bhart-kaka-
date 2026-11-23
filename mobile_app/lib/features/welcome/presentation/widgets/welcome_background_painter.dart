import 'package:flutter/material.dart';
import 'package:panchayat_post/core/constants/app_colors.dart';

/// CustomPainter rendering the subtle top decorative corner waves
/// matching Screen 02 Welcome Screen reference image.
class WelcomeBackgroundPainter extends CustomPainter {
  const WelcomeBackgroundPainter();

  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;

    // 1. Top-Left soft orange wave swoosh
    final topLeftOrange = Path()
      ..moveTo(0, 0)
      ..lineTo(w * 0.45, 0)
      ..cubicTo(w * 0.32, h * 0.04, w * 0.12, h * 0.08, 0, h * 0.14)
      ..close();
    final orangePaint = Paint()
      ..color = AppColors.accentOrange.withValues(alpha: 0.9)
      ..style = PaintingStyle.fill
      ..isAntiAlias = true;
    canvas.drawPath(topLeftOrange, orangePaint);

    // 2. Top-Right subtle sky-blue wash around language selector
    final topRightSky = Path()
      ..moveTo(w * 0.60, 0)
      ..lineTo(w, 0)
      ..lineTo(w, h * 0.12)
      ..cubicTo(w * 0.85, h * 0.10, w * 0.72, h * 0.04, w * 0.60, 0)
      ..close();
    final skyPaint = Paint()
      ..color = const Color(0xFFE8F1FC).withValues(alpha: 0.85)
      ..style = PaintingStyle.fill
      ..isAntiAlias = true;
    canvas.drawPath(topRightSky, skyPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
