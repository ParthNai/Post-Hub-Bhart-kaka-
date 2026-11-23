import 'package:flutter/material.dart';

/// Centralized color palette for Panchayat Post application.
/// Derived with exact pixel fidelity from the approved Screen 01 design specifications.
class AppColors {
  AppColors._();

  /// Primary vibrant royal blue wave & brand accent (#0055B8)
  static const Color primaryBlue = Color(0xFF0055B8);

  /// Deep navy blue for brand title typography (#0D1B3E)
  static const Color textNavy = Color(0xFF0D1B3E);

  /// Vibrant saffron orange wave, logo element & arc spinner accent (#FE8706)
  static const Color accentOrange = Color(0xFFFE8706);

  /// Subtle cream/pale-orange gradient wave accent (#FFF4E8)
  static const Color waveCream = Color(0xFFFFF4E8);

  /// Secondary tagline and neutral slate text (#33384B)
  static const Color textSlate = Color(0xFF33384B);

  /// Subdued helper text (#70778B)
  static const Color textMuted = Color(0xFF70778B);

  /// Clean pure white background (#FFFFFF)
  static const Color background = Color(0xFFFFFFFF);

  /// Surface white for cards and modals
  static const Color surface = Color(0xFFFFFFFF);

  /// Dark mode neutral (future proofing)
  static const Color darkBackground = Color(0xFF10141E);
}
