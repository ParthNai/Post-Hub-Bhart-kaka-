import 'package:flutter/material.dart';
import 'package:panchayat_post/core/constants/app_assets.dart';

/// Centrally managed brand logo widget for Panchayat Post.
/// Uses the exact original supplied logo asset, preserving aspect ratio
/// and visual proportions without distortion, cropping, or stretching.
class BrandLogoWidget extends StatelessWidget {
  const BrandLogoWidget({
    super.key,
    this.width,
    this.height,
  });

  final double? width;
  final double? height;

  @override
  Widget build(BuildContext context) {
    // In the reference image, the logo occupies approximately 52% of the screen width
    final screenWidth = MediaQuery.of(context).size.width;
    final effectiveWidth = width ?? (screenWidth * 0.52).clamp(190.0, 260.0);

    return Image.asset(
      AppAssets.panchayatLogo,
      width: effectiveWidth,
      fit: BoxFit.contain,
      filterQuality: FilterQuality.high,
      errorBuilder: (context, error, stackTrace) {
        // Fallback to original supplied file if needed
        return Image.asset(
          AppAssets.panchayatLogoOriginal,
          width: effectiveWidth,
          fit: BoxFit.contain,
        );
      },
    );
  }
}
