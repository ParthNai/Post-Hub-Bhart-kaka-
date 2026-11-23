import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:panchayat_post/core/constants/app_assets.dart';
import 'package:panchayat_post/core/services/app_config_service.dart';

/// Centrally managed brand logo widget for Panchayat Post.
/// Supports dynamic App Icon / Logo from Admin Panel (Device Base64 Upload, Server URL, or Cloud URL)
/// with graceful local asset fallback.
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
    final screenWidth = MediaQuery.of(context).size.width;
    // If only height is given, let width be null so aspect ratio is preserved
    final effectiveWidth = (width == null && height != null)
        ? null
        : (width ?? (screenWidth * 0.52).clamp(190.0, 260.0));

    return ValueListenableBuilder(
      valueListenable: AppConfigService.instance.configNotifier,
      builder: (context, config, child) {
        final logoUrl = config.logoUrl ?? config.appIconUrl;
        if (logoUrl != null && logoUrl.isNotEmpty) {
          // 1. Direct device file upload: base64 Data URL (data:image/...)
          if (logoUrl.startsWith('data:image')) {
            try {
              final commaIndex = logoUrl.indexOf(',');
              final base64Part = commaIndex != -1 ? logoUrl.substring(commaIndex + 1) : logoUrl;
              final bytes = base64Decode(base64Part.trim());
              return Image.memory(
                bytes,
                width: effectiveWidth,
                height: height,
                fit: BoxFit.contain,
                filterQuality: FilterQuality.high,
                errorBuilder: (context, error, stackTrace) => _buildLocalFallback(effectiveWidth, height),
              );
            } catch (_) {
              return _buildLocalFallback(effectiveWidth, height);
            }
          }

          // 2. Relative or Full HTTP(S) Server URL
          final fullUrl = logoUrl.startsWith('http')
              ? logoUrl
              : '${AppConfigService.instance.serverBaseUrl}$logoUrl';

          return Image.network(
            fullUrl,
            width: effectiveWidth,
            height: height,
            fit: BoxFit.contain,
            filterQuality: FilterQuality.high,
            errorBuilder: (context, error, stackTrace) => _buildLocalFallback(effectiveWidth, height),
          );
        }

        return _buildLocalFallback(effectiveWidth, height);
      },
    );
  }

  Widget _buildLocalFallback(double? effectiveWidth, double? effectiveHeight) {
    return Image.asset(
      AppAssets.panchayatLogo,
      width: effectiveWidth,
      height: effectiveHeight,
      fit: BoxFit.contain,
      filterQuality: FilterQuality.high,
      errorBuilder: (context, error, stackTrace) {
        return Image.asset(
          AppAssets.panchayatLogoOriginal,
          width: effectiveWidth,
          height: effectiveHeight,
          fit: BoxFit.contain,
        );
      },
    );
  }
}
