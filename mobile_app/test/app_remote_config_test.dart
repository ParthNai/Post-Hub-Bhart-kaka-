import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:panchayat_post/core/models/app_remote_config.dart';
import 'package:panchayat_post/core/theme/app_theme.dart';

void main() {
  test('parses admin theme and announcement hero image settings', () {
    final config = AppRemoteConfig.fromJson({
      'data': {
        'theme': {
          'mode': 'Dark',
          'primaryAccent': '#123456',
          'backgroundColor': '#10141E',
          'cardRadius': '8px',
          'headerStyle': 'solid',
        },
        'heroSection': {
          'visible': true,
          'enabled': true,
          'imageUrl': '/uploaded/image/homeHero/hero_1.webp',
        },
      },
    });

    expect(config.themeMode, 'Dark');
    expect(config.primaryAccentColor, const Color(0xFF123456));
    expect(config.cardRadius, '8px');
    expect(config.headerStyle, 'solid');
    expect(config.heroImageUrl, '/uploaded/image/homeHero/hero_1.webp');
  });

  test('parses multiple hero images and bounds the slide interval', () {
    final config = AppRemoteConfig.fromJson({
      'heroSection': {
        'visible': true,
        'images': [
          '/uploaded/image/homeHero/hero_1.webp',
          '/uploaded/image/homeHero/hero_2.webp',
        ],
        'slideIntervalSeconds': 1,
      },
    });

    expect(config.heroImageUrls, [
      '/uploaded/image/homeHero/hero_1.webp',
      '/uploaded/image/homeHero/hero_2.webp',
    ]);
    expect(config.heroSlideIntervalSeconds, 2);
  });

  test('builds Material theme from admin-selected styles', () {
    final theme = AppTheme.fromRemote(
      themeMode: 'Dark',
      primaryAccent: const Color(0xFF123456),
      backgroundColor: '#10141E',
      headerStyle: 'solid',
      cardRadius: '8px',
    );

    expect(theme.colorScheme.primary, const Color(0xFF123456));
    expect(theme.scaffoldBackgroundColor, const Color(0xFF10141E));
    expect(theme.appBarTheme.backgroundColor, const Color(0xFF123456));
    expect(theme.cardTheme.shape, isA<RoundedRectangleBorder>());
  });
}
