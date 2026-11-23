import 'package:flutter/material.dart';
import 'app_colors.dart';

/// Typography definitions matching the approved Screen 01 visual design.
class AppTypography {
  AppTypography._();

  /// "Panchayat Post" brand title typography
  static const TextStyle brandTitle = TextStyle(
    fontSize: 32.0,
    fontWeight: FontWeight.w800,
    color: AppColors.textNavy,
    letterSpacing: -0.4,
    height: 1.15,
  );

  /// "Create. Celebrate. Share." tagline typography
  static const TextStyle brandTagline = TextStyle(
    fontSize: 16.5,
    fontWeight: FontWeight.w400,
    color: AppColors.textSlate,
    letterSpacing: 0.15,
    height: 1.25,
  );

  /// General headline typography
  static const TextStyle headline = TextStyle(
    fontSize: 24.0,
    fontWeight: FontWeight.w700,
    color: AppColors.textNavy,
  );

  /// Body text typography
  static const TextStyle body = TextStyle(
    fontSize: 14.0,
    fontWeight: FontWeight.w400,
    color: AppColors.textSlate,
  );
}
