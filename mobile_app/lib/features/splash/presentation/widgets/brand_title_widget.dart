import 'package:flutter/material.dart';
import 'package:panchayat_post/core/constants/app_typography.dart';

/// Reusable application brand title and tagline widget.
/// Displays "Panchayat Post" and "Create. Celebrate. Share."
/// matching typography, font weight, color, and spacing from the approved reference.
class BrandTitleWidget extends StatelessWidget {
  const BrandTitleWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Text(
          'Panchayat Post',
          style: AppTypography.brandTitle,
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 8.0),
        Text(
          'Create. Celebrate. Share.',
          style: AppTypography.brandTagline,
          textAlign: TextAlign.center,
        ),
      ],
    );
  }
}
