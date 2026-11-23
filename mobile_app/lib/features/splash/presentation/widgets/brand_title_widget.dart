import 'package:flutter/material.dart';
import 'package:panchayat_post/core/constants/app_typography.dart';
import 'package:panchayat_post/core/services/app_config_service.dart';

/// Reusable application brand title and tagline widget.
/// Displays dynamic brand title and tagline provided by the admin panel remote config,
/// with graceful fallback to default reference branding.
class BrandTitleWidget extends StatelessWidget {
  const BrandTitleWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder(
      valueListenable: AppConfigService.instance.configNotifier,
      builder: (context, config, child) {
        final tagline = config.preloaderTagline.isNotEmpty
            ? config.preloaderTagline
            : 'તમારા ગામનું પોતાનું ડિજિટલ પોસ્ટર';

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
              tagline,
              style: AppTypography.brandTagline,
              textAlign: TextAlign.center,
            ),
          ],
        );
      },
    );
  }
}
