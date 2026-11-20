import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

class FlutterSlotZone {
  const FlutterSlotZone({
    required this.id,
    required this.type,
    required this.label,
    required this.x,
    required this.y,
    required this.width,
    required this.height,
    this.photoShape = 'circle',
    this.borderColor = '#FFFFFF',
    this.borderWidth = 2.0,
    this.shadow = true,
    this.textBinding = 'name',
    this.fontSize = 14.0,
    this.textColor = '#FFFFFF',
    this.fontWeight = '700',
    this.alignment = 'left',
    this.shapeType = 'rectangle',
    this.backgroundColor = 'rgba(0,0,0,0.5)',
    this.opacity = 1.0,
    this.customText,
    this.sampleAvatarUrl,
  });

  final String id;
  final String type; // 'photo' | 'text' | 'shape'
  final String label;
  final double x;
  final double y;
  final double width;
  final double height;
  final String photoShape;
  final String borderColor;
  final double borderWidth;
  final bool shadow;
  final String textBinding;
  final double fontSize;
  final String textColor;
  final String fontWeight;
  final String alignment;
  final String shapeType;
  final String backgroundColor;
  final double opacity;
  final String? customText;
  final String? sampleAvatarUrl;

  factory FlutterSlotZone.fromJson(Map<String, dynamic> json) {
    return FlutterSlotZone(
      id: (json['id'] as String?) ?? 'zone-${DateTime.now().millisecondsSinceEpoch}',
      type: (json['type'] as String?) ?? 'photo',
      label: (json['label'] as String?) ?? '',
      x: ((json['x'] as num?) ?? 10).toDouble(),
      y: ((json['y'] as num?) ?? 10).toDouble(),
      width: ((json['width'] as num?) ?? 20).toDouble(),
      height: ((json['height'] as num?) ?? 20).toDouble(),
      photoShape: (json['photoShape'] as String?) ?? 'circle',
      borderColor: (json['borderColor'] as String?) ?? '#FFFFFF',
      borderWidth: ((json['borderWidth'] as num?) ?? 2).toDouble(),
      shadow: json['shadow'] != false,
      textBinding: (json['textBinding'] as String?) ?? 'name',
      fontSize: ((json['fontSize'] as num?) ?? 14).toDouble(),
      textColor: (json['color'] as String?) ?? (json['textColor'] as String?) ?? '#FFFFFF',
      fontWeight: (json['fontWeight'] as String?) ?? '700',
      alignment: (json['alignment'] as String?) ?? 'left',
      shapeType: (json['shapeType'] as String?) ?? 'rectangle',
      backgroundColor: (json['backgroundColor'] as String?) ?? 'rgba(0,0,0,0.5)',
      opacity: ((json['opacity'] as num?) ?? 1.0).toDouble(),
      customText: json['customText'] as String?,
      sampleAvatarUrl: (json['sampleAvatarUrl'] as String?) ?? (json['sampleUrl'] as String?),
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'type': type,
    'label': label,
    'x': x,
    'y': y,
    'width': width,
    'height': height,
    'photoShape': photoShape,
    'borderColor': borderColor,
    'borderWidth': borderWidth,
    'shadow': shadow,
    'textBinding': textBinding,
    'fontSize': fontSize,
    'textColor': textColor,
    'fontWeight': fontWeight,
    'alignment': alignment,
    'shapeType': shapeType,
    'backgroundColor': backgroundColor,
    'opacity': opacity,
    if (customText != null) 'customText': customText,
    if (sampleAvatarUrl != null) 'sampleAvatarUrl': sampleAvatarUrl,
  };

  FlutterSlotZone copyWith({
    String? id,
    String? type,
    String? label,
    double? x,
    double? y,
    double? width,
    double? height,
    String? photoShape,
    String? borderColor,
    double? borderWidth,
    bool? shadow,
    String? textBinding,
    double? fontSize,
    String? textColor,
    String? fontWeight,
    String? alignment,
    String? shapeType,
    String? backgroundColor,
    double? opacity,
    String? customText,
    String? sampleAvatarUrl,
  }) {
    return FlutterSlotZone(
      id: id ?? this.id,
      type: type ?? this.type,
      label: label ?? this.label,
      x: x ?? this.x,
      y: y ?? this.y,
      width: width ?? this.width,
      height: height ?? this.height,
      photoShape: photoShape ?? this.photoShape,
      borderColor: borderColor ?? this.borderColor,
      borderWidth: borderWidth ?? this.borderWidth,
      shadow: shadow ?? this.shadow,
      textBinding: textBinding ?? this.textBinding,
      fontSize: fontSize ?? this.fontSize,
      textColor: textColor ?? this.textColor,
      fontWeight: fontWeight ?? this.fontWeight,
      alignment: alignment ?? this.alignment,
      shapeType: shapeType ?? this.shapeType,
      backgroundColor: backgroundColor ?? this.backgroundColor,
      opacity: opacity ?? this.opacity,
      customText: customText ?? this.customText,
      sampleAvatarUrl: sampleAvatarUrl ?? this.sampleAvatarUrl,
    );
  }
}

class OccasionTemplate {
  const OccasionTemplate({
    required this.id,
    required this.title,
    required this.occasion,
    required this.category,
    required this.regions,
    required this.month,
    required this.headline,
    required this.subtitle,
    required this.background,
    required this.foreground,
    required this.icon,
    this.backgroundImageUrl,
    this.slotZones = const [],
  });

  final String id;
  final String title;
  final String occasion;
  final String category;
  final List<String> regions;
  final int month;
  final String headline;
  final String subtitle;
  final int background;
  final int foreground;
  final String icon;
  final String? backgroundImageUrl;
  final List<FlutterSlotZone> slotZones;

  bool availableIn(String region) =>
      regions.contains('All') || regions.contains(region);

  static int _parseHexColor(dynamic hex, {int fallback = 0xFF7956C9}) {
    if (hex is! String || hex.isEmpty) return fallback;
    final clean = hex.replaceAll('#', '').trim();
    if (clean.length == 6) {
      return int.tryParse('FF$clean', radix: 16) ?? fallback;
    } else if (clean.length == 8) {
      return int.tryParse(clean, radix: 16) ?? fallback;
    }
    return fallback;
  }

  static String _categoryIcon(String? category) {
    switch (category?.toLowerCase()) {
      case 'festival':
        return 'festival';
      case 'business':
        return 'business';
      case 'promotion':
        return 'sale';
      case 'education':
        return 'education';
      default:
        return 'sparkles';
    }
  }

  factory OccasionTemplate.fromAdminJson(Map<String, dynamic> json) {
    final cat = (json['category'] as String?) ?? 'Business';
    final name = (json['name'] as String?) ?? 'Poster Template';
    final headline = (json['headline'] as String?) ?? name;
    final subtitle =
        (json['subheadline'] as String?) ??
        (json['description'] as String?) ??
        '';
    final primary = _parseHexColor(json['primaryColor'], fallback: 0xFF1E3A8A);
    final accent = _parseHexColor(json['accentColor'], fallback: 0xFF3B82F6);
    final id =
        (json['id'] as String?) ?? 'tpl-${DateTime.now().millisecondsSinceEpoch}';

    List<String> regions = ['All'];
    if (cat.toLowerCase() == 'festival' &&
        name.toLowerCase().contains('diwali')) {
      regions = ['India'];
    }

    final bgUrl = (json['backgroundImageUrl'] as String?) ??
        (json['thumbnailUrl'] as String?) ??
        (json['assetFileName'] != null && (json['assetFileName'] as String).isNotEmpty
            ? '/templates/${json['assetFileName']}'
            : null);
    final rawZones = (json['slotZones'] as List<dynamic>?) ?? (json['zones'] as List<dynamic>?);
    final zones = rawZones != null
        ? rawZones
            .whereType<Map<String, dynamic>>()
            .map((z) => FlutterSlotZone.fromJson(z))
            .toList()
        : const <FlutterSlotZone>[];

    return OccasionTemplate(
      id: id,
      title: name,
      occasion: name,
      category: cat,
      regions: regions,
      month: 10,
      headline: headline,
      subtitle: subtitle,
      background: primary,
      foreground: accent,
      icon: _categoryIcon(cat),
      backgroundImageUrl: bgUrl,
      slotZones: zones,
    );
  }
}

class OccasionCatalog {
  static List<OccasionTemplate> _adminTemplates = [];

  static void setAdminTemplates(List<OccasionTemplate> items) {
    _adminTemplates = items;
  }

  static List<OccasionTemplate> get adminTemplates => _adminTemplates;

  static const sampleTemplates = <OccasionTemplate>[
    OccasionTemplate(
      id: 'diwali-greetings',
      title: 'Diwali Greetings',
      occasion: 'Diwali',
      category: 'Festival',
      regions: ['India'],
      month: 10,
      headline: 'HAPPY DIWALI',
      subtitle: 'Wishing you light, joy & prosperity',
      background: 0xFFFFE8B2,
      foreground: 0xFF8A3D12,
      icon: 'festival',
    ),
    OccasionTemplate(
      id: 'holi-colors',
      title: 'Festival of Colors',
      occasion: 'Holi',
      category: 'Festival',
      regions: ['India'],
      month: 3,
      headline: 'HAPPY HOLI',
      subtitle: 'Let your colors shine',
      background: 0xFFFFD8EA,
      foreground: 0xFF9B2363,
      icon: 'colors',
    ),
    OccasionTemplate(
      id: 'eid-greetings',
      title: 'Eid Mubarak',
      occasion: 'Eid',
      category: 'Festival',
      regions: ['India', 'Global'],
      month: 3,
      headline: 'EID MUBARAK',
      subtitle: 'Wishing you peace and happiness',
      background: 0xFFD8F2E3,
      foreground: 0xFF176B50,
      icon: 'crescent',
    ),
    OccasionTemplate(
      id: 'navratri-nights',
      title: 'Navratri Nights',
      occasion: 'Navratri',
      category: 'Festival',
      regions: ['India'],
      month: 10,
      headline: 'HAPPY NAVRATRI',
      subtitle: 'Celebrate every color of joy',
      background: 0xFFFFDCCB,
      foreground: 0xFF9C3F2B,
      icon: 'festival',
    ),
    OccasionTemplate(
      id: 'independence-india',
      title: 'Independence Day',
      occasion: 'Independence Day',
      category: 'National Days',
      regions: ['India'],
      month: 8,
      headline: 'HAPPY INDEPENDENCE DAY',
      subtitle: 'Celebrating the spirit of freedom',
      background: 0xFFFFE2C7,
      foreground: 0xFF9E542D,
      icon: 'flag',
    ),
    OccasionTemplate(
      id: 'republic-india',
      title: 'Republic Day',
      occasion: 'Republic Day',
      category: 'National Days',
      regions: ['India'],
      month: 1,
      headline: 'HAPPY REPUBLIC DAY',
      subtitle: 'Proud to be Indian',
      background: 0xFFD9EDFF,
      foreground: 0xFF265B91,
      icon: 'flag',
    ),
    OccasionTemplate(
      id: 'christmas-greetings',
      title: 'Christmas Greetings',
      occasion: 'Christmas',
      category: 'Festival',
      regions: ['All'],
      month: 12,
      headline: 'MERRY CHRISTMAS',
      subtitle: 'May your season sparkle',
      background: 0xFFD8F0E2,
      foreground: 0xFF1E684A,
      icon: 'star',
    ),
    OccasionTemplate(
      id: 'new-year',
      title: 'New Year Celebration',
      occasion: 'New Year',
      category: 'Seasonal',
      regions: ['All'],
      month: 1,
      headline: 'HELLO, NEW YEAR!',
      subtitle: 'Make this year unforgettable',
      background: 0xFFE5DCFF,
      foreground: 0xFF59419B,
      icon: 'star',
    ),
    OccasionTemplate(
      id: 'valentines-day',
      title: 'Valentine Wishes',
      occasion: 'Valentine’s Day',
      category: 'Seasonal',
      regions: ['All'],
      month: 2,
      headline: 'MADE WITH LOVE',
      subtitle: 'Share a little more love',
      background: 0xFFFFDCE7,
      foreground: 0xFFA72E59,
      icon: 'heart',
    ),
    OccasionTemplate(
      id: 'thanksgiving',
      title: 'Thanksgiving',
      occasion: 'Thanksgiving',
      category: 'Seasonal',
      regions: ['United States', 'Canada'],
      month: 11,
      headline: 'GIVE THANKS',
      subtitle: 'Grateful for you, today and always',
      background: 0xFFFFE4C5,
      foreground: 0xFF935021,
      icon: 'star',
    ),
    OccasionTemplate(
      id: 'halloween',
      title: 'Halloween Party',
      occasion: 'Halloween',
      category: 'Seasonal',
      regions: ['United States', 'United Kingdom', 'Canada'],
      month: 10,
      headline: 'HAPPY HALLOWEEN',
      subtitle: 'A little magic, a lot of treats',
      background: 0xFFFFDFC8,
      foreground: 0xFF773BA0,
      icon: 'star',
    ),
    OccasionTemplate(
      id: 'mothers-day',
      title: 'Mother’s Day',
      occasion: 'Mother’s Day',
      category: 'Seasonal',
      regions: ['All'],
      month: 5,
      headline: 'FOR THE BEST MOM',
      subtitle: 'Today is all about you',
      background: 0xFFFFDCEC,
      foreground: 0xFFA23D77,
      icon: 'heart',
    ),
    OccasionTemplate(
      id: 'summer-sale',
      title: 'Summer Sale',
      occasion: 'Summer Sale',
      category: 'Business',
      regions: ['All'],
      month: 6,
      headline: 'SUNNY DAYS, BIG SAVINGS',
      subtitle: 'Your summer starts here',
      background: 0xFFFFE7AF,
      foreground: 0xFF965A17,
      icon: 'sale',
    ),
    OccasionTemplate(
      id: 'grand-opening',
      title: 'Grand Opening',
      occasion: 'Store Opening',
      category: 'Business',
      regions: ['All'],
      month: 1,
      headline: 'WE’RE OPEN!',
      subtitle: 'Come celebrate with us',
      background: 0xFFD8F3E9,
      foreground: 0xFF26745C,
      icon: 'store',
    ),
    OccasionTemplate(
      id: 'new-arrivals',
      title: 'New Arrivals',
      occasion: 'Product Launch',
      category: 'Business',
      regions: ['All'],
      month: 1,
      headline: 'JUST LANDED',
      subtitle: 'Meet your new favorite',
      background: 0xFFE4DEFF,
      foreground: 0xFF51448E,
      icon: 'sparkle',
    ),
    OccasionTemplate(
      id: 'birthday-celebration',
      title: 'Birthday Celebration',
      occasion: 'Birthday',
      category: 'Celebrations',
      regions: ['All'],
      month: 1,
      headline: 'MAKE A WISH',
      subtitle: 'Here’s to your best year yet',
      background: 0xFFFFDCCB,
      foreground: 0xFF984A4B,
      icon: 'cake',
    ),
    OccasionTemplate(
      id: 'wedding-invitation',
      title: 'Wedding Invitation',
      occasion: 'Wedding',
      category: 'Celebrations',
      regions: ['All'],
      month: 1,
      headline: 'SAVE THE DATE',
      subtitle: 'Together is a beautiful place to be',
      background: 0xFFF4E8D8,
      foreground: 0xFF72513E,
      icon: 'heart',
    ),
    OccasionTemplate(
      id: 'eid-sale',
      title: 'Eid Special Offers',
      occasion: 'Eid Sale',
      category: 'Business',
      regions: ['India', 'Global'],
      month: 3,
      headline: 'EID SPECIAL',
      subtitle: 'Celebrate with something special',
      background: 0xFFD8F2E3,
      foreground: 0xFF176B50,
      icon: 'sale',
    ),
  ];

  static List<OccasionTemplate> get templates => [
    ..._adminTemplates,
    ...sampleTemplates,
  ];

  static List<OccasionTemplate> forRegion(String region) =>
      templates.where((template) => template.availableIn(region)).toList();

  static List<String> get categories => [
    'All',
    ...templates.map((template) => template.category).toSet(),
  ];

  static List<String> get regions => [
    'India',
    'United States',
    'United Kingdom',
    'Canada',
    'Global',
  ];

  static List<String> get languages => ['English', 'Hindi', 'Gujarati'];
}

class CreatorPreferences {
  const CreatorPreferences({
    this.region = 'India',
    this.language = 'English',
    this.businessName = '',
    this.businessType = '',
  });

  final String region;
  final String language;
  final String businessName;
  final String businessType;

  CreatorPreferences copyWith({
    String? region,
    String? language,
    String? businessName,
    String? businessType,
  }) => CreatorPreferences(
    region: region ?? this.region,
    language: language ?? this.language,
    businessName: businessName ?? this.businessName,
    businessType: businessType ?? this.businessType,
  );
}

class SavedDesign {
  const SavedDesign({
    required this.id,
    required this.templateId,
    required this.title,
    required this.occasion,
    required this.headline,
    required this.subtitle,
    required this.businessName,
    required this.businessType,
    required this.background,
    required this.foreground,
    required this.icon,
    required this.savedAt,
    this.backgroundImageUrl,
    this.slotZones = const [],
    this.userName,
    this.userAvatarUrl,
    this.userPhone,
    this.userDesignation,
  });

  final String id;
  final String templateId;
  final String title;
  final String occasion;
  final String headline;
  final String subtitle;
  final String businessName;
  final String businessType;
  final int background;
  final int foreground;
  final String icon;
  final DateTime savedAt;
  final String? backgroundImageUrl;
  final List<FlutterSlotZone> slotZones;
  final String? userName;
  final String? userAvatarUrl;
  final String? userPhone;
  final String? userDesignation;

  factory SavedDesign.fromTemplate(
    OccasionTemplate template, {
    required String businessName,
    required String businessType,
    String? headline,
    String? subtitle,
    int? background,
    int? foreground,
    List<FlutterSlotZone>? slotZones,
    String? userName,
    String? userAvatarUrl,
    String? userPhone,
    String? userDesignation,
  }) => SavedDesign(
    id: '${template.id}-${DateTime.now().microsecondsSinceEpoch}',
    templateId: template.id,
    title: template.title,
    occasion: template.occasion,
    headline: headline ?? template.headline,
    subtitle: subtitle ?? template.subtitle,
    businessName: businessName,
    businessType: businessType,
    background: background ?? template.background,
    foreground: foreground ?? template.foreground,
    icon: template.icon,
    savedAt: DateTime.now(),
    backgroundImageUrl: template.backgroundImageUrl,
    slotZones: slotZones ?? template.slotZones,
    userName: userName,
    userAvatarUrl: userAvatarUrl,
    userPhone: userPhone,
    userDesignation: userDesignation,
  );

  Map<String, Object?> toJson() => {
    'id': id,
    'templateId': templateId,
    'title': title,
    'occasion': occasion,
    'headline': headline,
    'subtitle': subtitle,
    'businessName': businessName,
    'businessType': businessType,
    'background': background,
    'foreground': foreground,
    'icon': icon,
    'savedAt': savedAt.toIso8601String(),
    if (backgroundImageUrl != null) 'backgroundImageUrl': backgroundImageUrl,
    'slotZones': slotZones.map((z) => z.toJson()).toList(),
    if (userName != null) 'userName': userName,
    if (userAvatarUrl != null) 'userAvatarUrl': userAvatarUrl,
    if (userPhone != null) 'userPhone': userPhone,
    if (userDesignation != null) 'userDesignation': userDesignation,
  };

  factory SavedDesign.fromJson(Map<String, dynamic> json) => SavedDesign(
    id: json['id'] as String,
    templateId: json['templateId'] as String,
    title: json['title'] as String,
    occasion: json['occasion'] as String,
    headline: json['headline'] as String,
    subtitle: json['subtitle'] as String,
    businessName: json['businessName'] as String? ?? '',
    businessType: json['businessType'] as String? ?? '',
    background: json['background'] as int,
    foreground: json['foreground'] as int,
    icon: json['icon'] as String,
    savedAt: DateTime.parse(json['savedAt'] as String),
    backgroundImageUrl: json['backgroundImageUrl'] as String?,
    slotZones: (json['slotZones'] as List<dynamic>?)
            ?.whereType<Map<String, dynamic>>()
            .map(FlutterSlotZone.fromJson)
            .toList() ??
        const [],
    userName: json['userName'] as String?,
    userAvatarUrl: json['userAvatarUrl'] as String?,
    userPhone: json['userPhone'] as String?,
    userDesignation: json['userDesignation'] as String?,
  );
}

class CreatorStore {
  static const _regionKey = 'posthub_creator_region';
  static const _languageKey = 'posthub_creator_language';
  static const _businessNameKey = 'posthub_creator_business_name';
  static const _businessTypeKey = 'posthub_creator_business_type';
  static const _savedDesignsKey = 'posthub_creator_saved_designs';

  Future<CreatorPreferences> loadPreferences() async {
    final preferences = await SharedPreferences.getInstance();
    return CreatorPreferences(
      region: preferences.getString(_regionKey) ?? 'India',
      language: preferences.getString(_languageKey) ?? 'English',
      businessName: preferences.getString(_businessNameKey) ?? '',
      businessType: preferences.getString(_businessTypeKey) ?? '',
    );
  }

  Future<void> savePreferences(CreatorPreferences value) async {
    final preferences = await SharedPreferences.getInstance();
    await preferences.setString(_regionKey, value.region);
    await preferences.setString(_languageKey, value.language);
    await preferences.setString(_businessNameKey, value.businessName);
    await preferences.setString(_businessTypeKey, value.businessType);
  }

  Future<List<SavedDesign>> loadDesigns() async {
    final preferences = await SharedPreferences.getInstance();
    final encoded = preferences.getString(_savedDesignsKey);
    if (encoded == null || encoded.isEmpty) return [];
    final decoded = jsonDecode(encoded);
    if (decoded is! List) {
      throw const FormatException('Saved designs have an invalid format.');
    }
    return decoded
        .whereType<Map<String, dynamic>>()
        .map(SavedDesign.fromJson)
        .toList();
  }

  Future<void> saveDesign(SavedDesign design) async {
    final designs = await loadDesigns();
    designs.removeWhere((item) => item.id == design.id);
    designs.insert(0, design);
    final preferences = await SharedPreferences.getInstance();
    await preferences.setString(
      _savedDesignsKey,
      jsonEncode(designs.map((item) => item.toJson()).toList()),
    );
  }

  Future<void> deleteDesign(String id) async {
    final designs = await loadDesigns();
    designs.removeWhere((item) => item.id == id);
    final preferences = await SharedPreferences.getInstance();
    await preferences.setString(
      _savedDesignsKey,
      jsonEncode(designs.map((item) => item.toJson()).toList()),
    );
  }
}
