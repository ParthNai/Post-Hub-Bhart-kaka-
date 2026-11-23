import 'package:flutter/material.dart';
import 'package:panchayat_post/core/constants/app_colors.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';

/// Welcome content widget rendering:
/// - Main localized heading with highlighted orange text and decorative underline brush
/// - Subtitle describing Panchayat Post features in the user's selected language
class WelcomeContentWidget extends StatelessWidget {
  const WelcomeContentWidget({super.key});

  @override
  Widget build(BuildContext context) {
    final strings = LocaleScope.of(context).strings;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24.0),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          // Main Headline with Highlighted text
          Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text.rich(
                TextSpan(
                  children: [
                    TextSpan(
                      text: strings.headingPart1,
                      style: const TextStyle(
                        fontSize: 25.0,
                        fontWeight: FontWeight.w800,
                        color: AppColors.textNavy,
                        height: 1.25,
                        letterSpacing: -0.3,
                      ),
                    ),
                    TextSpan(
                      text: strings.headingPart2Prefix,
                      style: const TextStyle(
                        fontSize: 25.0,
                        fontWeight: FontWeight.w800,
                        color: AppColors.textNavy,
                        height: 1.25,
                      ),
                    ),
                    TextSpan(
                      text: strings.headingHighlight,
                      style: const TextStyle(
                        fontSize: 25.0,
                        fontWeight: FontWeight.w800,
                        color: AppColors.accentOrange,
                        height: 1.25,
                      ),
                    ),
                    TextSpan(
                      text: strings.headingPart2Suffix,
                      style: const TextStyle(
                        fontSize: 25.0,
                        fontWeight: FontWeight.w800,
                        color: AppColors.textNavy,
                        height: 1.25,
                      ),
                    ),
                  ],
                ),
                textAlign: TextAlign.center,
              ),

              // Decorative curved orange underline brush matching UI reference
              const SizedBox(height: 3.0),
              CustomPaint(
                size: const Size(130, 8),
                painter: _CurvedBrushUnderlinePainter(),
              ),
            ],
          ),

          const SizedBox(height: 14.0),

          // Subtitle copy
          Text(
            strings.subtitle,
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 14.2,
              fontWeight: FontWeight.w500,
              color: AppColors.textSlate,
              height: 1.48,
              letterSpacing: 0.1,
            ),
          ),
        ],
      ),
    );
  }
}

/// Draws the playful curved underline beneath the highlighted brand heading.
class _CurvedBrushUnderlinePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = AppColors.accentOrange
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3.6
      ..strokeCap = StrokeCap.round;

    final path = Path()
      ..moveTo(size.width * 0.12, size.height * 0.4)
      ..quadraticBezierTo(
        size.width * 0.55,
        size.height * 1.0,
        size.width * 0.88,
        size.height * 0.2,
      );

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
