import 'package:flutter/material.dart';

/// Complete remote configuration model synced from the Admin Panel (/api/app/config).
/// Specifically focused on the 4 admin-controllable core items:
/// 1. App Icon / Logo
/// 2. Preloader (Dual-arc spinner colors & duration)
/// 3. Theme & Primary Accent Color
/// 4. Hero Section of Home Screen (Visibility, Badge, Headline, Subtitle)
class AppRemoteConfig {
  const AppRemoteConfig({
    required this.platform,
    required this.schemaVersion,
    required this.publishedAt,
    this.appIconUrl,
    this.logoUrl,
    required this.preloaderPrimaryColor,
    required this.preloaderSecondaryColor,
    this.preloaderDurationMs = 2000,
    required this.themeMode,
    required this.primaryAccentColor,
    this.backgroundColor = '#FFFFFF',
    this.cardRadius = '14px',
    this.headerStyle = 'gradient',
    required this.isHeroVisible,
    this.heroImageUrl,
    this.heroImageUrls = const [],
    this.heroSlideIntervalSeconds = 3,
    required this.heroBadge,
    required this.heroHeadline,
    required this.heroSubtitle,
    required this.screens,
    required this.templates,
  });

  final String platform;
  final String schemaVersion;
  final String publishedAt;

  // 1. App Icon / Logo
  final String? appIconUrl;
  final String? logoUrl;

  // 2. Preloader
  final Color preloaderPrimaryColor;
  final Color preloaderSecondaryColor;
  final int preloaderDurationMs;

  // 3. Theme
  final String themeMode; // "Light" | "Dark"
  final Color primaryAccentColor;
  final String backgroundColor;
  final String cardRadius;
  final String headerStyle;

  // 4. Hero Section of Home Screen
  final bool isHeroVisible;
  final String? heroImageUrl;
  final List<String> heroImageUrls;
  final int heroSlideIntervalSeconds;
  final String heroBadge;
  final String heroHeadline;
  final String heroSubtitle;

  final Map<String, RemoteScreenConfig> screens;
  final List<RemoteTemplate> templates;

  /// Default fallback configuration when server is unreachable or offline
  factory AppRemoteConfig.defaultConfig() {
    return AppRemoteConfig(
      platform: 'Post Hub Mobile Client',
      schemaVersion: '2.1.0',
      publishedAt: DateTime.now().toIso8601String(),
      appIconUrl: null,
      logoUrl: null,
      preloaderPrimaryColor: const Color(0xFFFE8706),
      preloaderSecondaryColor: const Color(0xFF0055B8),
      preloaderDurationMs: 2000,
      themeMode: 'Light',
      primaryAccentColor: const Color(0xFF0055B8),
      backgroundColor: '#FFFFFF',
      cardRadius: '14px',
      headerStyle: 'gradient',
      isHeroVisible: true,
      heroImageUrl: null,
      heroImageUrls: const [],
      heroSlideIntervalSeconds: 3,
      heroBadge: '✨ MAGIC STUDIO',
      heroHeadline: 'What will you design today?',
      heroSubtitle: 'Choose a format below or start from templates.',
      screens: {
        'home': RemoteScreenConfig.defaultHome(),
        'login': RemoteScreenConfig.defaultLogin(),
      },
      templates: const [],
    );
  }

  factory AppRemoteConfig.fromJson(Map<String, dynamic> rawJson) {
    final Map<String, dynamic> json =
        (rawJson['data'] is Map<String, dynamic>)
            ? (rawJson['data'] as Map<String, dynamic>)
            : rawJson;

    // 1. App Branding
    String? appIcon;
    String? logo;
    if (json['appBranding'] is Map<String, dynamic>) {
      final branding = json['appBranding'] as Map<String, dynamic>;
      appIcon = branding['appIconUrl'] as String?;
      logo = branding['logoUrl'] as String?;
    }

    // 2. Preloader
    Color preloaderPrimary = const Color(0xFFFE8706);
    Color preloaderSecondary = const Color(0xFF0055B8);
    int preloaderDuration = 2000;
    if (json['preloader'] is Map<String, dynamic>) {
      final pre = json['preloader'] as Map<String, dynamic>;
      preloaderPrimary = hexToColor(pre['primaryColor'] as String?, fallback: const Color(0xFFFE8706));
      preloaderSecondary = hexToColor(pre['secondaryColor'] as String?, fallback: const Color(0xFF0055B8));
      preloaderDuration = (pre['durationMs'] as num?)?.toInt() ?? 2000;
    }

    // 3. Theme
    String theme = 'Light';
    Color primaryAccent = const Color(0xFF0055B8);
    String bg = '#FFFFFF';
    String radius = '14px';
    String headerStyle = 'gradient';
    if (json['theme'] is Map<String, dynamic>) {
      final th = json['theme'] as Map<String, dynamic>;
      theme = th['mode'] as String? ?? 'Light';
      primaryAccent = hexToColor(th['primaryAccent'] as String?, fallback: const Color(0xFF0055B8));
      bg = th['backgroundColor'] as String? ?? '#FFFFFF';
      radius = th['cardRadius'] as String? ?? '14px';
      headerStyle = th['headerStyle'] as String? ?? 'gradient';
    }

    // 4. Hero Section
    bool heroVis = true;
    String? heroImg;
    List<String> heroImgs = const [];
    int slideInterval = 3;
    String badge = '✨ MAGIC STUDIO';
    String headline = 'What will you design today?';
    String subtitle = 'Choose a format below or start from templates.';
    if (json['heroSection'] is Map<String, dynamic>) {
      final hero = json['heroSection'] as Map<String, dynamic>;
      heroVis = (hero['visible'] as bool? ?? true) && (hero['enabled'] as bool? ?? true);
      heroImg = hero['imageUrl'] as String?;
      if (hero['images'] is List) {
        heroImgs = (hero['images'] as List).map((e) => e.toString()).toList();
      }
      final rawInterval = (hero['slideIntervalSeconds'] as num?)?.toInt() ?? 3;
      slideInterval = rawInterval < 2 ? 2 : rawInterval;
      badge = hero['badge'] as String? ?? '✨ MAGIC STUDIO';
      headline = hero['headline'] as String? ?? 'What will you design today?';
      subtitle = hero['subtitle'] as String? ?? 'Choose a format below or start from templates.';
    }

    // Screens map
    final screensMap = <String, RemoteScreenConfig>{};
    if (json['navigation'] is List) {
      for (final item in json['navigation'] as List) {
        if (item is Map<String, dynamic>) {
          final screen = RemoteScreenConfig.fromJson(item);
          screensMap[screen.key] = screen;
          if (screen.route.isNotEmpty) {
            screensMap[screen.route] = screen;
          }
        }
      }
    }

    // Templates list
    final templatesList = <RemoteTemplate>[];
    if (json['templates'] is List) {
      for (final item in json['templates'] as List) {
        if (item is Map<String, dynamic>) {
          templatesList.add(RemoteTemplate.fromJson(item));
        }
      }
    }

    return AppRemoteConfig(
      platform: json['platform'] as String? ?? 'Post Hub Mobile Client',
      schemaVersion: json['schemaVersion'] as String? ?? '2.1.0',
      publishedAt: json['publishedAt'] as String? ?? '',
      appIconUrl: appIcon,
      logoUrl: logo,
      preloaderPrimaryColor: preloaderPrimary,
      preloaderSecondaryColor: preloaderSecondary,
      preloaderDurationMs: preloaderDuration,
      themeMode: theme,
      primaryAccentColor: primaryAccent,
      backgroundColor: bg,
      cardRadius: radius,
      headerStyle: headerStyle,
      isHeroVisible: heroVis,
      heroImageUrl: heroImg,
      heroImageUrls: heroImgs,
      heroSlideIntervalSeconds: slideInterval,
      heroBadge: badge,
      heroHeadline: headline,
      heroSubtitle: subtitle,
      screens: screensMap,
      templates: templatesList,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'platform': platform,
      'schemaVersion': schemaVersion,
      'publishedAt': publishedAt,
      'appBranding': {
        'appIconUrl': appIconUrl,
        'logoUrl': logoUrl,
      },
      'preloader': {
        'primaryColor': '#${preloaderPrimaryColor.toARGB32().toRadixString(16).padLeft(8, '0').substring(2)}',
        'secondaryColor': '#${preloaderSecondaryColor.toARGB32().toRadixString(16).padLeft(8, '0').substring(2)}',
        'durationMs': preloaderDurationMs,
      },
      'theme': {
        'mode': themeMode,
        'primaryAccent': '#${primaryAccentColor.toARGB32().toRadixString(16).padLeft(8, '0').substring(2)}',
        'backgroundColor': backgroundColor,
        'cardRadius': cardRadius,
      },
      'heroSection': {
        'visible': isHeroVisible,
        'badge': heroBadge,
        'headline': heroHeadline,
        'subtitle': heroSubtitle,
      },
      'navigation': screens.values.map((s) => s.toJson()).toList(),
      'templates': templates.map((t) => t.toJson()).toList(),
    };
  }

  RemoteScreenConfig? getScreen(String key) => screens[key];

  bool isScreenVisible(String key, {bool fallback = true}) {
    final screen = screens[key];
    if (screen == null) return fallback;
    return screen.visibilityEnabled && screen.status != 'archived';
  }
}

/// Screen configuration entity matching the Admin Panel AppScreen definition.
class RemoteScreenConfig {
  const RemoteScreenConfig({
    required this.id,
    required this.key,
    required this.name,
    required this.description,
    required this.route,
    required this.icon,
    required this.category,
    required this.status,
    required this.version,
    required this.visibilityEnabled,
    required this.minAppVersion,
    required this.capabilities,
    required this.layoutConfig,
  });

  final String id;
  final String key;
  final String name;
  final String description;
  final String route;
  final String icon;
  final String category;
  final String status;
  final int version;
  final bool visibilityEnabled;
  final String minAppVersion;
  final List<String> capabilities;
  final ScreenLayoutConfig layoutConfig;

  factory RemoteScreenConfig.defaultHome() {
    return RemoteScreenConfig(
      id: 'scr_home_001',
      key: 'home',
      name: 'Home',
      description: 'Discover templates, create AI images, and explore festival designs.',
      route: '/home',
      icon: 'Home',
      category: 'Navigation',
      status: 'configured',
      version: 1,
      visibilityEnabled: true,
      minAppVersion: '1.0.0',
      capabilities: const ['hero_banner', 'category_rail', 'trending_templates'],
      layoutConfig: ScreenLayoutConfig.defaultHomeLayout(),
    );
  }

  factory RemoteScreenConfig.defaultLogin() {
    return RemoteScreenConfig(
      id: 'scr_login_007',
      key: 'login',
      name: 'Login & Authentication',
      description: 'Sign in to continue creating and sharing designs.',
      route: '/login',
      icon: 'User',
      category: 'Account',
      status: 'configured',
      version: 1,
      visibilityEnabled: true,
      minAppVersion: '1.0.0',
      capabilities: const ['email_password_auth', 'remember_me', 'password_recovery'],
      layoutConfig: const ScreenLayoutConfig(),
    );
  }

  factory RemoteScreenConfig.fromJson(Map<String, dynamic> json) {
    return RemoteScreenConfig(
      id: json['id'] as String? ?? '',
      key: json['key'] as String? ?? '',
      name: json['name'] as String? ?? '',
      description: json['description'] as String? ?? '',
      route: json['route'] as String? ?? '',
      icon: json['icon'] as String? ?? 'Home',
      category: json['category'] as String? ?? 'Navigation',
      status: json['status'] as String? ?? 'configured',
      version: (json['version'] as num?)?.toInt() ?? 1,
      visibilityEnabled: json['visibilityEnabled'] as bool? ?? true,
      minAppVersion: json['minAppVersion'] as String? ?? '1.0.0',
      capabilities: (json['capabilities'] as List<dynamic>?)
              ?.map((e) => e.toString())
              .toList() ??
          const [],
      layoutConfig: json['layoutConfig'] is Map<String, dynamic>
          ? ScreenLayoutConfig.fromJson(json['layoutConfig'] as Map<String, dynamic>)
          : ScreenLayoutConfig.defaultHomeLayout(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'key': key,
      'name': name,
      'description': description,
      'route': route,
      'icon': icon,
      'category': category,
      'status': status,
      'version': version,
      'visibilityEnabled': visibilityEnabled,
      'minAppVersion': minAppVersion,
      'capabilities': capabilities,
      'layoutConfig': layoutConfig.toJson(),
    };
  }
}

/// Detailed layout configuration for a screen.
class ScreenLayoutConfig {
  const ScreenLayoutConfig({
    this.bannerVisible = false,
    this.bannerHeadline,
    this.bannerSubtitle,
    this.bannerBadge,
    this.headerTitle,
    this.activeTheme = 'default',
    this.primaryAccent,
    this.backgroundColor,
    this.cardRadius = '14px',
    this.sections = const [],
  });

  final bool bannerVisible;
  final String? bannerHeadline;
  final String? bannerSubtitle;
  final String? bannerBadge;
  final String? headerTitle;
  final String activeTheme;
  final String? primaryAccent;
  final String? backgroundColor;
  final String cardRadius;
  final List<ScreenSectionConfig> sections;

  factory ScreenLayoutConfig.defaultHomeLayout() {
    return const ScreenLayoutConfig(
      bannerVisible: true,
      bannerHeadline: 'What will you design today?',
      bannerSubtitle: 'Choose a format below or start from templates.',
      bannerBadge: '✨ MAGIC STUDIO',
      headerTitle: 'Panchayat Post',
      activeTheme: 'default',
      primaryAccent: '#0055B8',
      cardRadius: '14px',
      sections: [
        ScreenSectionConfig(id: 'hero', title: 'Hero Banner', enabled: true, order: 1),
        ScreenSectionConfig(id: 'categories', title: 'Category Rail', enabled: true, order: 2),
        ScreenSectionConfig(id: 'ai_studio', title: 'AI Studio', enabled: true, order: 3),
        ScreenSectionConfig(id: 'featured_templates', title: 'Featured Templates', enabled: true, order: 4),
        ScreenSectionConfig(id: 'screen_navigator', title: 'Screen Navigator', enabled: true, order: 5),
      ],
    );
  }

  factory ScreenLayoutConfig.fromJson(Map<String, dynamic> json) {
    final sectionsList = <ScreenSectionConfig>[];
    if (json['sections'] is List) {
      for (final item in json['sections'] as List) {
        if (item is Map<String, dynamic>) {
          sectionsList.add(ScreenSectionConfig.fromJson(item));
        }
      }
    }

    return ScreenLayoutConfig(
      bannerVisible: json['bannerVisible'] as bool? ?? false,
      bannerHeadline: json['bannerHeadline'] as String?,
      bannerSubtitle: json['bannerSubtitle'] as String?,
      bannerBadge: json['bannerBadge'] as String?,
      headerTitle: json['headerTitle'] as String?,
      activeTheme: json['activeTheme'] as String? ?? 'default',
      primaryAccent: json['primaryAccent'] as String?,
      backgroundColor: json['backgroundColor'] as String?,
      cardRadius: json['cardRadius'] as String? ?? '14px',
      sections: sectionsList,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'bannerVisible': bannerVisible,
      'bannerHeadline': bannerHeadline,
      'bannerSubtitle': bannerSubtitle,
      'bannerBadge': bannerBadge,
      'headerTitle': headerTitle,
      'activeTheme': activeTheme,
      'primaryAccent': primaryAccent,
      'backgroundColor': backgroundColor,
      'cardRadius': cardRadius,
      'sections': sections.map((s) => s.toJson()).toList(),
    };
  }

  bool isSectionEnabled(String sectionId, {bool fallback = true}) {
    final s = sections.where((sec) => sec.id == sectionId).firstOrNull;
    return s != null ? s.enabled : fallback;
  }
}

class ScreenSectionConfig {
  const ScreenSectionConfig({
    required this.id,
    required this.title,
    required this.enabled,
    required this.order,
  });

  final String id;
  final String title;
  final bool enabled;
  final int order;

  factory ScreenSectionConfig.fromJson(Map<String, dynamic> json) {
    return ScreenSectionConfig(
      id: json['id'] as String? ?? '',
      title: json['title'] as String? ?? '',
      enabled: json['enabled'] as bool? ?? true,
      order: (json['order'] as num?)?.toInt() ?? 1,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'enabled': enabled,
      'order': order,
    };
  }
}

class RemoteTemplate {
  const RemoteTemplate({
    required this.id,
    required this.name,
    required this.category,
    required this.format,
    required this.headline,
    required this.subheadline,
    required this.ctaText,
    required this.primaryColor,
    required this.accentColor,
    required this.aspectRatio,
    this.thumbnailUrl,
    this.backgroundImageUrl,
    this.tags = const [],
  });

  final String id;
  final String name;
  final String category;
  final String format;
  final String headline;
  final String subheadline;
  final String ctaText;
  final String primaryColor;
  final String accentColor;
  final String aspectRatio;
  final String? thumbnailUrl;
  final String? backgroundImageUrl;
  final List<String> tags;

  factory RemoteTemplate.fromJson(Map<String, dynamic> json) {
    return RemoteTemplate(
      id: json['id'] as String? ?? '',
      name: json['name'] as String? ?? '',
      category: json['category'] as String? ?? 'General',
      format: json['format'] as String? ?? '3:4',
      headline: json['headline'] as String? ?? '',
      subheadline: json['subheadline'] as String? ?? '',
      ctaText: json['ctaText'] as String? ?? 'Edit Template',
      primaryColor: json['primaryColor'] as String? ?? '#7956C9',
      accentColor: json['accentColor'] as String? ?? '#FF5722',
      aspectRatio: json['aspectRatio'] as String? ?? '3:4',
      thumbnailUrl: json['thumbnailUrl'] as String?,
      backgroundImageUrl: json['backgroundImageUrl'] as String?,
      tags: (json['tags'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? const [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'category': category,
      'format': format,
      'headline': headline,
      'subheadline': subheadline,
      'ctaText': ctaText,
      'primaryColor': primaryColor,
      'accentColor': accentColor,
      'aspectRatio': aspectRatio,
      'thumbnailUrl': thumbnailUrl,
      'backgroundImageUrl': backgroundImageUrl,
      'tags': tags,
    };
  }
}

/// Helper to convert hex string (#RRGGBB or #AARRGGBB) to Flutter Color
Color hexToColor(String? hexString, {Color fallback = const Color(0xFF0055B8)}) {
  if (hexString == null || hexString.isEmpty) return fallback;
  var hex = hexString.replaceAll('#', '').trim();
  if (hex.length == 6) {
    hex = 'FF$hex';
  }
  if (hex.length == 8) {
    final val = int.tryParse(hex, radix: 16);
    if (val != null) {
      return Color(val);
    }
  }
  return fallback;
}
