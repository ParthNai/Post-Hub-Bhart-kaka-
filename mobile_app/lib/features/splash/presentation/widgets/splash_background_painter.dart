import 'package:flutter/material.dart';
import 'package:panchayat_post/core/constants/app_colors.dart';

/// CustomPainter that renders the exact decorative curved brand waves
/// seen at the top-left and bottom-right in the approved Screen 01 reference image.
/// Uses proportional cubic Bezier curves to look crisp and identical across all screen sizes.
class SplashBackgroundPainter extends CustomPainter {
  const SplashBackgroundPainter();

  @override
  void paint(Canvas canvas, Size size) {
    final w = size.width;
    final h = size.height;

    // 1. Fill complete screen background with pure white
    final bgPaint = Paint()..color = AppColors.background;
    canvas.drawRect(Rect.fromLTWH(0, 0, w, h), bgPaint);

    final creamPaint = Paint()
      ..color = AppColors.waveCream
      ..style = PaintingStyle.fill
      ..isAntiAlias = true;

    final orangePaint = Paint()
      ..color = AppColors.accentOrange
      ..style = PaintingStyle.fill
      ..isAntiAlias = true;

    final bluePaint = Paint()
      ..color = AppColors.primaryBlue
      ..style = PaintingStyle.fill
      ..isAntiAlias = true;

    // ==========================================
    // TOP-LEFT CORNER WAVES
    // ==========================================

    // Layer 1 (Cream soft accent)
    final topLeftCream = Path()
      ..moveTo(0, 0)
      ..lineTo(w * 0.68, 0)
      ..cubicTo(w * 0.48, h * 0.08, w * 0.20, h * 0.14, 0, h * 0.22)
      ..close();
    canvas.drawPath(topLeftCream, creamPaint);

    // Layer 2 (Vibrant Saffron Orange wave)
    final topLeftOrange = Path()
      ..moveTo(0, 0)
      ..lineTo(w * 0.58, 0)
      ..cubicTo(w * 0.42, h * 0.06, w * 0.17, h * 0.11, 0, h * 0.18)
      ..close();
    canvas.drawPath(topLeftOrange, orangePaint);

    // Layer 3 (Royal Blue top-most corner wave)
    final topLeftBlue = Path()
      ..moveTo(0, 0)
      ..lineTo(w * 0.32, 0)
      ..cubicTo(w * 0.22, h * 0.03, w * 0.08, h * 0.06, 0, h * 0.105)
      ..close();
    canvas.drawPath(topLeftBlue, bluePaint);

    // ==========================================
    // BOTTOM-RIGHT CORNER WAVES
    // ==========================================

    // Layer 1 (Cream soft accent)
    final bottomRightCream = Path()
      ..moveTo(w, h)
      ..lineTo(w, h * 0.74)
      ..cubicTo(w * 0.82, h * 0.84, w * 0.60, h * 0.93, w * 0.35, h)
      ..close();
    canvas.drawPath(bottomRightCream, creamPaint);

    // Layer 2 (Vibrant Saffron Orange wave)
    final bottomRightOrange = Path()
      ..moveTo(w, h)
      ..lineTo(w, h * 0.82)
      ..cubicTo(w * 0.86, h * 0.90, w * 0.70, h * 0.96, w * 0.44, h)
      ..close();
    canvas.drawPath(bottomRightOrange, orangePaint);

    // Layer 3 (Royal Blue bottom-most corner wave)
    final bottomRightBlue = Path()
      ..moveTo(w, h)
      ..lineTo(w, h * 0.90)
      ..cubicTo(w * 0.91, h * 0.96, w * 0.82, h * 0.99, w * 0.68, h)
      ..close();
    canvas.drawPath(bottomRightBlue, bluePaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
