import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../constants/app_colors.dart';
import '../models/app_remote_config.dart';

/// Application theme matching the brand identity of Panchayat Post.
class AppTheme {
  AppTheme._();

  static ThemeData fromRemote({
    required String themeMode,
    required Color primaryAccent,
    required String backgroundColor,
    required String headerStyle,
    required String cardRadius,
  }) {
    final isDark = themeMode.toLowerCase() == 'dark';
    final bgColor = hexToColor(
      backgroundColor,
      fallback: isDark ? const Color(0xFF10141E) : AppColors.background,
    );
    final radiusVal =
        double.tryParse(cardRadius.replaceAll(RegExp(r'[^0-9.]'), '')) ?? 14.0;

    return ThemeData(
      useMaterial3: true,
      brightness: isDark ? Brightness.dark : Brightness.light,
      scaffoldBackgroundColor: bgColor,
      colorScheme: isDark
          ? ColorScheme.dark(
              primary: primaryAccent,
              surface: bgColor,
            )
          : ColorScheme.light(
              primary: primaryAccent,
              surface: Colors.white,
            ),
      appBarTheme: AppBarTheme(
        backgroundColor:
            headerStyle == 'solid' ? primaryAccent : Colors.transparent,
        elevation: 0,
        systemOverlayStyle: SystemUiOverlayStyle(
          statusBarColor: Colors.transparent,
          statusBarIconBrightness: isDark ? Brightness.light : Brightness.dark,
        ),
      ),
      cardTheme: CardThemeData(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(radiusVal),
        ),
      ),
    );
  }

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      scaffoldBackgroundColor: AppColors.background,
      colorScheme: const ColorScheme.light(
        primary: AppColors.primaryBlue,
        secondary: AppColors.accentOrange,
        surface: AppColors.surface,
        onPrimary: Colors.white,
        onSecondary: Colors.white,
        onSurface: AppColors.textNavy,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        systemOverlayStyle: SystemUiOverlayStyle(
          statusBarColor: Colors.transparent,
          statusBarIconBrightness: Brightness.dark,
          statusBarBrightness: Brightness.light,
        ),
      ),
    );
  }
}
