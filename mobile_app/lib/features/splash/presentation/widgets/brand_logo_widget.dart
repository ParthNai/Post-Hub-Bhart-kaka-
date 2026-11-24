import 'package:flutter/material.dart';
import 'package:panchayat_post/core/constants/app_assets.dart';
import 'package:panchayat_post/core/services/app_config_service.dart';

/// Centrally managed brand logo widget for Panchayat Post.
/// Supports dynamic App Icon / Logo URL from Admin Panel with graceful local asset fallback.
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
    final effectiveWidth = width ?? (height == null ? (screenWidth * 0.52).clamp(190.0, 260.0) : null);

    return ValueListenableBuilder(
      valueListenable: AppConfigService.instance.configNotifier,
      builder: (context, config, child) {
        final logoUrl = config.logoUrl ?? config.appIconUrl;
        if (logoUrl != null && logoUrl.isNotEmpty) {
          final fullUrl = logoUrl.startsWith('http')
              ? logoUrl
              : '${AppConfigService.instance.serverBaseUrl}$logoUrl';

          return Image.network(
            fullUrl,
            width: effectiveWidth,
            height: height,
            fit: BoxFit.contain,
            filterQuality: FilterQuality.high,
            errorBuilder: (context, error, stackTrace) => _buildLocalFallback(effectiveWidth),
          );
        }

        return _buildLocalFallback(effectiveWidth);
      },
    );
  }

  Widget _buildLocalFallback(double? effectiveWidth) {
    return Image.asset(
      AppAssets.panchayatLogo,
      width: effectiveWidth,
      height: height,
      fit: BoxFit.contain,
      filterQuality: FilterQuality.high,
      errorBuilder: (context, error, stackTrace) {
        return Image.asset(
          AppAssets.panchayatLogoOriginal,
          width: effectiveWidth,
          height: height,
          fit: BoxFit.contain,
        );
      },
    );
  }
}
