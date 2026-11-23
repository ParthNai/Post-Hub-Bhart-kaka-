import 'dart:math' as math;
import 'package:flutter/material.dart';
import 'package:panchayat_post/core/constants/app_colors.dart';

/// Smooth animated circular loading indicator featuring dual arcs
/// in Panchayat Post brand colors (Orange at top, Royal Blue at bottom).
/// Matches the exact approved Screen 01 UI reference design.
class DualArcLoadingIndicator extends StatefulWidget {
  const DualArcLoadingIndicator({
    super.key,
    this.size = 38.0,
    this.strokeWidth = 3.2,
    this.primaryColor = AppColors.accentOrange,
    this.secondaryColor = AppColors.primaryBlue,
    this.duration = const Duration(milliseconds: 1100),
  });

  final double size;
  final double strokeWidth;
  final Color primaryColor;
  final Color secondaryColor;
  final Duration duration;

  @override
  State<DualArcLoadingIndicator> createState() => _DualArcLoadingIndicatorState();
}

class _DualArcLoadingIndicatorState extends State<DualArcLoadingIndicator>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: widget.duration,
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: widget.size,
      height: widget.size,
      child: AnimatedBuilder(
        animation: _controller,
        builder: (context, child) {
          return Transform.rotate(
            angle: _controller.value * 2 * math.pi,
            child: CustomPaint(
              size: Size(widget.size, widget.size),
              painter: _DualArcPainter(
                orangeColor: widget.primaryColor,
                blueColor: widget.secondaryColor,
                strokeWidth: widget.strokeWidth,
              ),
            ),
          );
        },
      ),
    );
  }
}

class _DualArcPainter extends CustomPainter {
  const _DualArcPainter({
    required this.orangeColor,
    required this.blueColor,
    required this.strokeWidth,
  });

  final Color orangeColor;
  final Color blueColor;
  final double strokeWidth;

  @override
  void paint(Canvas canvas, Size size) {
    final rect = Rect.fromLTWH(
      strokeWidth / 2,
      strokeWidth / 2,
      size.width - strokeWidth,
      size.height - strokeWidth,
    );

    // Each arc sweeps approx 125 degrees (2.18 radians) with ~55 degree gaps
    const sweepAngle = 2.18;
    const gapAngle = (2 * math.pi - 2 * sweepAngle) / 2;

    // Top arc: Orange
    final orangePaint = Paint()
      ..color = orangeColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round;

    // Start angle for top arc centered around -pi/2 (top)
    const topStart = -math.pi / 2 - (sweepAngle / 2);
    canvas.drawArc(rect, topStart, sweepAngle, false, orangePaint);

    // Bottom arc: Blue
    final bluePaint = Paint()
      ..color = blueColor
      ..style = PaintingStyle.stroke
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round;

    // Start angle for bottom arc
    final bottomStart = topStart + sweepAngle + gapAngle;
    canvas.drawArc(rect, bottomStart, sweepAngle, false, bluePaint);
  }

  @override
  bool shouldRepaint(covariant _DualArcPainter oldDelegate) {
    return oldDelegate.orangeColor != orangeColor ||
        oldDelegate.blueColor != blueColor ||
        oldDelegate.strokeWidth != strokeWidth;
  }
}
