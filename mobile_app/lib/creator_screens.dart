import 'dart:math' as math;
import 'dart:ui' as ui;

import 'package:cross_file/cross_file.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:share_plus/share_plus.dart';

import 'creator_data.dart';

Color _parseHex(String? hex, {Color fallback = Colors.white}) {
  if (hex == null || hex.isEmpty) return fallback;
  final clean = hex.replaceAll('#', '').trim();
  if (clean.length == 6) {
    final val = int.tryParse('FF$clean', radix: 16);
    if (val != null) return Color(val);
  } else if (clean.length == 8) {
    final val = int.tryParse(clean, radix: 16);
    if (val != null) return Color(val);
  }
  return fallback;
}

Color _parseZoneBackground(String? colorStr, double opacity) {
  if (colorStr == null || colorStr.isEmpty) {
    return Colors.black.withValues(alpha: opacity.clamp(0.0, 1.0));
  }
  if (colorStr.startsWith('#')) {
    return _parseHex(colorStr).withValues(alpha: opacity.clamp(0.0, 1.0));
  }
  if (colorStr.startsWith('rgba') || colorStr.startsWith('rgb')) {
    final match = RegExp(r'rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)').firstMatch(colorStr);
    if (match != null) {
      final r = int.tryParse(match.group(1)!) ?? 0;
      final g = int.tryParse(match.group(2)!) ?? 0;
      final b = int.tryParse(match.group(3)!) ?? 0;
      return Color.fromRGBO(r, g, b, opacity.clamp(0.0, 1.0));
    }
  }
  return Colors.black.withValues(alpha: opacity.clamp(0.0, 1.0));
}

class TemplatePoster extends StatelessWidget {
  const TemplatePoster({
    super.key,
    required this.headline,
    required this.subtitle,
    required this.businessName,
    required this.background,
    required this.foreground,
    required this.icon,
    this.backgroundImageUrl,
    this.slotZones = const [],
    this.userName,
    this.userAvatarUrl,
    this.userPhone,
    this.userDesignation,
  });

  final String headline;
  final String subtitle;
  final String businessName;
  final int background;
  final int foreground;
  final String icon;
  final String? backgroundImageUrl;
  final List<FlutterSlotZone> slotZones;
  final String? userName;
  final String? userAvatarUrl;
  final String? userPhone;
  final String? userDesignation;

  factory TemplatePoster.fromTemplate(
    OccasionTemplate template, {
    String? userName,
    String? userAvatarUrl,
    String? userPhone,
    String? userDesignation,
    String? businessName,
  }) =>
      TemplatePoster(
        headline: template.headline,
        subtitle: template.subtitle,
        businessName: businessName ?? '',
        background: template.background,
        foreground: template.foreground,
        icon: template.icon,
        backgroundImageUrl: template.backgroundImageUrl,
        slotZones: template.slotZones,
        userName: userName,
        userAvatarUrl: userAvatarUrl,
        userPhone: userPhone,
        userDesignation: userDesignation,
      );

  factory TemplatePoster.fromSavedDesign(
    SavedDesign design, {
    String? userName,
    String? userAvatarUrl,
    String? userPhone,
    String? userDesignation,
  }) => TemplatePoster(
    headline: design.headline,
    subtitle: design.subtitle,
    businessName: design.businessName,
    background: design.background,
    foreground: design.foreground,
    icon: design.icon,
    backgroundImageUrl: design.backgroundImageUrl,
    slotZones: design.slotZones,
    userName: userName,
    userAvatarUrl: userAvatarUrl,
    userPhone: userPhone,
    userDesignation: userDesignation,
  );

  Widget _buildShapeZone(FlutterSlotZone zone, double w, double h) {
    final isPill = zone.shapeType == 'pill';
    final bgColor = _parseZoneBackground(zone.backgroundColor, zone.opacity);
    return Container(
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(isPill ? 999 : 8),
      ),
    );
  }

  Widget _buildPhotoZone(FlutterSlotZone zone, double w, double h) {
    final isCutout = zone.photoShape == 'cutout';
    final isCircle = zone.photoShape == 'circle';
    final isSquircle = zone.photoShape == 'squircle';
    final borderRadius = isCutout
        ? BorderRadius.zero
        : (isCircle
            ? BorderRadius.circular(999)
            : (isSquircle ? BorderRadius.circular(16) : BorderRadius.circular(6)));

    final photo = (userAvatarUrl != null && userAvatarUrl!.isNotEmpty)
        ? userAvatarUrl!
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80';

    final borderColor = _parseHex(zone.borderColor, fallback: Colors.white);
    final borderWidth = isCutout ? 0.0 : zone.borderWidth;

    Widget imageWidget = Image.network(
      photo,
      fit: isCutout ? BoxFit.contain : BoxFit.cover,
      alignment: Alignment.topCenter,
      errorBuilder: (context, error, stackTrace) => Container(
        color: Colors.white24,
        child: const Icon(Icons.person, color: Colors.white, size: 24),
      ),
    );

    // Soft bottom gradient fade for cutout/silhouette so it blends seamlessly into foreground
    if (isCutout) {
      imageWidget = ShaderMask(
        shaderCallback: (Rect bounds) {
          return const LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Colors.black, Colors.black, Colors.transparent],
            stops: [0.0, 0.72, 1.0],
          ).createShader(bounds);
        },
        blendMode: BlendMode.dstIn,
        child: imageWidget,
      );
    }

    return Container(
      decoration: BoxDecoration(
        borderRadius: borderRadius,
        border: borderWidth > 0 ? Border.all(color: borderColor, width: borderWidth) : null,
        boxShadow: (!isCutout && zone.shadow)
            ? [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.35),
                  blurRadius: 6,
                  offset: const Offset(0, 3),
                ),
              ]
            : null,
      ),
      child: ClipRRect(
        borderRadius: borderRadius,
        child: imageWidget,
      ),
    );
  }

  Widget _buildTextZone(FlutterSlotZone zone, double w, double h) {
    String text;
    switch (zone.textBinding) {
      case 'name':
        text = (userName != null && userName!.isNotEmpty) ? userName! : 'Parth Patel';
        break;
      case 'phone':
        text = (userPhone != null && userPhone!.isNotEmpty) ? userPhone! : '+91 98765 43210';
        break;
      case 'designation':
        text = (userDesignation != null && userDesignation!.isNotEmpty)
            ? userDesignation!
            : 'Founder & Director';
        break;
      case 'businessName':
        text = businessName.isNotEmpty ? businessName : 'Post Hub Studio';
        break;
      case 'custom':
      default:
        text = zone.customText ?? zone.label;
        break;
    }

    final textColor = _parseHex(zone.textColor, fallback: Colors.white);
    final baseFontSize = (h * (zone.fontSize / 380)).clamp(8.0, 32.0);
    double scaledFontSize = baseFontSize;

    // Auto-fit dynamic font-size calculation:
    final textLen = text.length;
    if (textLen > 18) {
      final approxCap = (zone.width * zone.height) / 12;
      if (textLen > approxCap && approxCap > 0) {
        final scale = math.sqrt(approxCap / textLen);
        scaledFontSize = (baseFontSize * scale).clamp(8.0, baseFontSize);
      }
    }

    final textAlign = zone.alignment == 'center'
        ? TextAlign.center
        : (zone.alignment == 'right' ? TextAlign.right : TextAlign.left);

    return Align(
      alignment: zone.alignment == 'center'
          ? Alignment.center
          : (zone.alignment == 'right' ? Alignment.centerRight : Alignment.centerLeft),
      child: Text(
        text,
        textAlign: textAlign,
        softWrap: true,
        maxLines: 4,
        overflow: TextOverflow.ellipsis,
        style: TextStyle(
          color: textColor,
          fontSize: scaledFontSize,
          height: 1.2,
          fontWeight: zone.fontWeight == '800'
              ? FontWeight.w800
              : (zone.fontWeight == '700' ? FontWeight.w700 : FontWeight.w600),
          shadows: const [
            Shadow(color: Colors.black87, blurRadius: 4, offset: Offset(0, 1)),
          ],
        ),
      ),
    );
  }

  Widget _buildSlotZoneWidget(FlutterSlotZone zone, double w, double h) {
    switch (zone.type) {
      case 'photo':
        return _buildPhotoZone(zone, w, h);
      case 'text':
        return _buildTextZone(zone, w, h);
      case 'shape':
      default:
        return _buildShapeZone(zone, w, h);
    }
  }

  @override
  Widget build(BuildContext context) {
    final foregroundColor = Color(foreground);
    final hasBackground = backgroundImageUrl != null && backgroundImageUrl!.trim().isNotEmpty;
    final hasSlots = slotZones.isNotEmpty;

    return Container(
      decoration: BoxDecoration(
        color: Color(background),
        borderRadius: BorderRadius.circular(18),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(18),
        child: LayoutBuilder(
          builder: (context, constraints) {
            final w = constraints.maxWidth;
            final h = constraints.maxHeight;

            // If template has an AI/custom background image or slot zones, render visual canvas
            if (hasBackground || hasSlots) {
              return Stack(
                children: [
                  Positioned.fill(
                    child: hasBackground
                        ? Image.network(
                            backgroundImageUrl!,
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) => Container(
                              color: Color(background),
                            ),
                          )
                        : Container(color: Color(background)),
                  ),
                  if (hasSlots) ...[
                    for (final zone in slotZones)
                      Positioned(
                        left: w * (zone.x / 100),
                        top: h * (zone.y / 100),
                        width: (w * (zone.width / 100)).clamp(10.0, w),
                        height: (h * (zone.height / 100)).clamp(10.0, h),
                        child: _buildSlotZoneWidget(zone, w, h),
                      ),
                  ] else ...[
                    Center(
                      child: Container(
                        margin: const EdgeInsets.symmetric(horizontal: 16),
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                        decoration: BoxDecoration(
                          color: Colors.black.withValues(alpha: 0.55),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              headline,
                              textAlign: TextAlign.center,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 14,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            if (subtitle.isNotEmpty) ...[
                              const SizedBox(height: 4),
                              Text(
                                subtitle,
                                textAlign: TextAlign.center,
                                style: const TextStyle(
                                  color: Colors.white70,
                                  fontSize: 10,
                                ),
                              ),
                            ],
                          ],
                        ),
                      ),
                    ),
                  ],
                ],
              );
            }

            // Fallback default vector artwork
            final isCompact =
                constraints.maxHeight < 140 || constraints.maxWidth < 120;
            final isTiny =
                constraints.maxHeight < 95 || constraints.maxWidth < 90;
            final pad = isTiny ? 6.0 : (isCompact ? 8.0 : 14.0);
            final iconSize = isTiny ? 18.0 : (isCompact ? 22.0 : 29.0);
            final titleSize = isTiny ? 11.0 : (isCompact ? 13.0 : 17.0);
            final subSize = isTiny ? 7.5 : (isCompact ? 8.0 : 9.0);

            return Stack(
              children: [
                if (!isCompact) ...[
                  Positioned(
                    top: 12,
                    right: 12,
                    child: Icon(
                      _posterIcon(icon),
                      color: foregroundColor.withValues(alpha: .16),
                      size: 60,
                    ),
                  ),
                  Positioned(
                    left: 12,
                    bottom: 12,
                    child: Icon(
                      _posterIcon(icon),
                      color: foregroundColor.withValues(alpha: .12),
                      size: 42,
                    ),
                  ),
                ],
                Center(
                  child: Padding(
                    padding: EdgeInsets.all(pad),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          _posterIcon(icon),
                          color: foregroundColor,
                          size: iconSize,
                        ),
                        SizedBox(height: isTiny ? 4 : (isCompact ? 6 : 12)),
                        Flexible(
                          child: Text(
                            headline,
                            textAlign: TextAlign.center,
                            maxLines: isCompact ? 2 : 3,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(
                              color: foregroundColor,
                              fontSize: titleSize,
                              height: 1.05,
                              fontWeight: FontWeight.w900,
                              letterSpacing: -.3,
                            ),
                          ),
                        ),
                        if (!isTiny && subtitle.trim().isNotEmpty) ...[
                          SizedBox(height: isCompact ? 3 : 8),
                          Flexible(
                            child: Text(
                              subtitle,
                              textAlign: TextAlign.center,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(
                                color: foregroundColor.withValues(alpha: .84),
                                fontSize: subSize,
                                height: 1.2,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ],
                        if (!isTiny && businessName.trim().isNotEmpty) ...[
                          SizedBox(height: isCompact ? 4 : 10),
                          Flexible(
                            child: Container(
                              padding: EdgeInsets.symmetric(
                                horizontal: isCompact ? 6 : 10,
                                vertical: isCompact ? 2 : 5,
                              ),
                              decoration: BoxDecoration(
                                color: Colors.white.withValues(alpha: .52),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Text(
                                businessName.trim(),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle(
                                  color: foregroundColor,
                                  fontSize: isCompact ? 7 : 8,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}

class TemplateCatalogSection extends StatelessWidget {
  const TemplateCatalogSection({
    super.key,
    this.title = 'Templates for you',
    required this.region,
    required this.accent,
    required this.selectedCategory,
    required this.onCategorySelected,
    required this.onTemplateSelected,
    required this.onSeeAll,
    this.maxItems,
    this.columns,
    this.showSearch = false,
  });

  final String title;
  final String region;
  final Color accent;
  final String selectedCategory;
  final ValueChanged<String> onCategorySelected;
  final ValueChanged<OccasionTemplate> onTemplateSelected;
  final VoidCallback onSeeAll;
  final int? maxItems;
  final int? columns;
  final bool showSearch;

  @override
  Widget build(BuildContext context) {
    final available = OccasionCatalog.forRegion(region);
    final filtered = available
        .where(
          (template) =>
              selectedCategory == 'All' ||
              template.category == selectedCategory,
        )
        .take(maxItems ?? available.length)
        .toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Expanded(
              child: Text(
                title,
                style: TextStyle(
                  color: Color(0xFF302A3A),
                  fontSize: 16,
                  fontWeight: FontWeight.w900,
                ),
              ),
            ),
            TextButton(onPressed: onSeeAll, child: const Text('See all')),
          ],
        ),
        if (showSearch) ...[
          const SizedBox(height: 6),
          _CatalogSearch(
            region: region,
            accent: accent,
            selectedCategory: selectedCategory,
            onCategorySelected: onCategorySelected,
            onTemplateSelected: onTemplateSelected,
          ),
        ] else ...[
          const SizedBox(height: 8),
          _CategoryChips(
            selectedCategory: selectedCategory,
            accent: accent,
            onSelected: onCategorySelected,
          ),
          const SizedBox(height: 12),
          if (filtered.isEmpty)
            const _EmptyCatalog()
          else
            _TemplateGrid(
              templates: filtered,
              accent: accent,
              onTemplateSelected: onTemplateSelected,
              maxCrossAxisExtent: 195,
              columns: columns,
            ),
        ],
      ],
    );
  }
}

class _CatalogSearch extends StatefulWidget {
  const _CatalogSearch({
    required this.region,
    required this.accent,
    required this.selectedCategory,
    required this.onCategorySelected,
    required this.onTemplateSelected,
  });

  final String region;
  final Color accent;
  final String selectedCategory;
  final ValueChanged<String> onCategorySelected;
  final ValueChanged<OccasionTemplate> onTemplateSelected;

  @override
  State<_CatalogSearch> createState() => _CatalogSearchState();
}

class _CatalogSearchState extends State<_CatalogSearch> {
  final _search = TextEditingController();

  @override
  void dispose() {
    _search.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final query = _search.text.trim().toLowerCase();
    final templates = OccasionCatalog.forRegion(widget.region)
        .where(
          (template) =>
              (widget.selectedCategory == 'All' ||
                  template.category == widget.selectedCategory) &&
              (query.isEmpty ||
                  template.title.toLowerCase().contains(query) ||
                  template.occasion.toLowerCase().contains(query) ||
                  template.category.toLowerCase().contains(query)),
        )
        .toList();

    return Column(
      children: [
        TextField(
          key: const ValueKey('template-search'),
          controller: _search,
          onChanged: (_) => setState(() {}),
          decoration: InputDecoration(
            hintText: 'Search festivals, events or designs',
            prefixIcon: const Icon(Icons.search_rounded),
            filled: true,
            fillColor: Colors.white,
            contentPadding: const EdgeInsets.symmetric(vertical: 12),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide: const BorderSide(color: Color(0xFFEDE8F0)),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide: const BorderSide(color: Color(0xFFEDE8F0)),
            ),
          ),
        ),
        const SizedBox(height: 12),
        _CategoryChips(
          selectedCategory: widget.selectedCategory,
          accent: widget.accent,
          onSelected: widget.onCategorySelected,
        ),
        const SizedBox(height: 12),
        if (templates.isEmpty)
          const _EmptyCatalog()
        else
          _TemplateGrid(
            templates: templates,
            accent: widget.accent,
            onTemplateSelected: widget.onTemplateSelected,
            maxCrossAxisExtent: 220,
          ),
      ],
    );
  }
}

class _CategoryChips extends StatelessWidget {
  const _CategoryChips({
    required this.selectedCategory,
    required this.accent,
    required this.onSelected,
  });

  final String selectedCategory;
  final Color accent;
  final ValueChanged<String> onSelected;

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      key: const ValueKey('template-category-tabs'),
      scrollDirection: Axis.horizontal,
      child: Row(
        children: [
          for (var index = 0; index < OccasionCatalog.categories.length; index++)
            Padding(
              padding: EdgeInsets.only(
                right: index == OccasionCatalog.categories.length - 1 ? 0 : 8,
              ),
              child: ChoiceChip(
                key: ValueKey('template-category-${OccasionCatalog.categories[index]}'),
                label: Text(OccasionCatalog.categories[index]),
                selected: OccasionCatalog.categories[index] == selectedCategory,
                onSelected: (_) => onSelected(OccasionCatalog.categories[index]),
                showCheckmark: false,
                selectedColor: accent,
                backgroundColor: Colors.white,
                labelStyle: TextStyle(
                  color: OccasionCatalog.categories[index] == selectedCategory
                      ? Colors.white
                      : const Color(0xFF696274),
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                ),
                side: BorderSide(
                  color: OccasionCatalog.categories[index] == selectedCategory
                      ? accent
                      : const Color(0xFFEDE8F0),
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class _TemplateGrid extends StatelessWidget {
  const _TemplateGrid({
    required this.templates,
    required this.accent,
    required this.onTemplateSelected,
    required this.maxCrossAxisExtent,
    this.columns,
  });

  final List<OccasionTemplate> templates;
  final Color accent;
  final ValueChanged<OccasionTemplate> onTemplateSelected;
  final double maxCrossAxisExtent;
  final int? columns;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final count =
            columns ??
            (constraints.maxWidth / maxCrossAxisExtent).floor().clamp(1, 3);
        return GridView.builder(
          key: const ValueKey('featured-template-grid'),
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: templates.length,
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: count.clamp(1, 3),
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            childAspectRatio: .68,
          ),
          itemBuilder: (context, index) {
            final template = templates[index];
            return _TemplateCard(
              template: template,
              accent: accent,
              onTap: () => onTemplateSelected(template),
            );
          },
        );
      },
    );
  }
}

class _TemplateCard extends StatelessWidget {
  const _TemplateCard({
    required this.template,
    required this.accent,
    required this.onTap,
  });

  final OccasionTemplate template;
  final Color accent;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(16),
      child: InkWell(
        key: ValueKey('occasion-template-${template.id}'),
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(8),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(child: TemplatePoster.fromTemplate(template)),
              const SizedBox(height: 8),
              Text(
                template.title,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  color: Color(0xFF302A3A),
                  fontSize: 11,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                template.category,
                style: TextStyle(color: accent, fontSize: 9),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _EmptyCatalog extends StatelessWidget {
  const _EmptyCatalog();

  @override
  Widget build(BuildContext context) => const Padding(
    padding: EdgeInsets.symmetric(vertical: 30),
    child: Center(
      child: Text(
        'No templates match yet. Try another category or search.',
        textAlign: TextAlign.center,
        style: TextStyle(color: Color(0xFF817A8D), fontSize: 12),
      ),
    ),
  );
}

class CreatorProfileScreen extends StatefulWidget {
  const CreatorProfileScreen({
    super.key,
    required this.initialPreferences,
    required this.onSave,
  });

  final CreatorPreferences initialPreferences;
  final ValueChanged<CreatorPreferences> onSave;

  @override
  State<CreatorProfileScreen> createState() => _CreatorProfileScreenState();
}

class _CreatorProfileScreenState extends State<CreatorProfileScreen> {
  late final _businessName = TextEditingController(
    text: widget.initialPreferences.businessName,
  );
  late final _businessType = TextEditingController(
    text: widget.initialPreferences.businessType,
  );
  late String _region = widget.initialPreferences.region;
  late String _language = widget.initialPreferences.language;

  @override
  void didUpdateWidget(covariant CreatorProfileScreen oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.initialPreferences != widget.initialPreferences) {
      _businessName.text = widget.initialPreferences.businessName;
      _businessType.text = widget.initialPreferences.businessType;
      _region = widget.initialPreferences.region;
      _language = widget.initialPreferences.language;
    }
  }

  @override
  void dispose() {
    _businessName.dispose();
    _businessType.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ListView(
      key: const ValueKey('creator-profile-screen'),
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 28),
      children: [
        const Text(
          'Make it yours',
          style: TextStyle(
            color: Color(0xFF211D35),
            fontSize: 25,
            fontWeight: FontWeight.w900,
          ),
        ),
        const SizedBox(height: 6),
        const Text(
          'Personalization is optional. Your details stay on this device.',
          style: TextStyle(color: Color(0xFF817A8D), fontSize: 12),
        ),
        const SizedBox(height: 22),
        _ProfileField(
          label: 'Country or region',
          child: DropdownButtonFormField<String>(
            key: const ValueKey('profile-region'),
            initialValue: _region,
            items: OccasionCatalog.regions
                .map((item) => DropdownMenuItem(value: item, child: Text(item)))
                .toList(),
            onChanged: (value) => setState(() => _region = value ?? _region),
            decoration: const InputDecoration(
              border: OutlineInputBorder(),
              prefixIcon: Icon(Icons.public_rounded),
            ),
          ),
        ),
        const SizedBox(height: 16),
        _ProfileField(
          label: 'Preferred content language',
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              DropdownButtonFormField<String>(
                key: const ValueKey('profile-language'),
                initialValue: _language,
                items: OccasionCatalog.languages
                    .map(
                      (item) => DropdownMenuItem(value: item, child: Text(item)),
                    )
                    .toList(),
                onChanged: (value) =>
                    setState(() => _language = value ?? _language),
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.translate_rounded),
                ),
              ),
              const Padding(
                padding: EdgeInsets.only(top: 6),
                child: Text(
                  'Festival greetings are currently provided in English.',
                  style: TextStyle(color: Color(0xFF817A8D), fontSize: 10),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 22),
        const Text(
          'Business details (optional)',
          style: TextStyle(
            color: Color(0xFF302A3A),
            fontSize: 14,
            fontWeight: FontWeight.w800,
          ),
        ),
        const SizedBox(height: 10),
        TextField(
          key: const ValueKey('profile-business-name'),
          controller: _businessName,
          decoration: const InputDecoration(
            labelText: 'Business or creator name',
            border: OutlineInputBorder(),
            prefixIcon: Icon(Icons.storefront_outlined),
          ),
        ),
        const SizedBox(height: 12),
        TextField(
          key: const ValueKey('profile-business-type'),
          controller: _businessType,
          decoration: const InputDecoration(
            labelText: 'What do you create or sell?',
            hintText: 'e.g. Bakery, clothing, photography',
            border: OutlineInputBorder(),
            prefixIcon: Icon(Icons.category_outlined),
          ),
        ),
        const SizedBox(height: 18),
        FilledButton.icon(
          key: const ValueKey('save-creator-profile'),
          onPressed: () => widget.onSave(
            CreatorPreferences(
              region: _region,
              language: _language,
              businessName: _businessName.text.trim(),
              businessType: _businessType.text.trim(),
            ),
          ),
          icon: const Icon(Icons.check_rounded),
          label: const Text('Save preferences'),
        ),
      ],
    );
  }
}

class _ProfileField extends StatelessWidget {
  const _ProfileField({required this.label, required this.child});

  final String label;
  final Widget child;

  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text(
        label,
        style: const TextStyle(
          color: Color(0xFF514A5C),
          fontSize: 12,
          fontWeight: FontWeight.w700,
        ),
      ),
      const SizedBox(height: 7),
      child,
    ],
  );
}

class TemplateEditorPage extends StatefulWidget {
  const TemplateEditorPage({
    super.key,
    required this.template,
    required this.preferences,
  });

  final OccasionTemplate template;
  final CreatorPreferences preferences;

  @override
  State<TemplateEditorPage> createState() => _TemplateEditorPageState();
}

class _TemplateEditorPageState extends State<TemplateEditorPage> {
  late final _headline = TextEditingController(text: widget.template.headline);
  late final _subtitle = TextEditingController(text: widget.template.subtitle);
  late final _businessName = TextEditingController(
    text: widget.preferences.businessName,
  );
  late int _background = widget.template.background;
  late int _foreground = widget.template.foreground;
  final _posterKey = GlobalKey();
  bool _isSharing = false;

  static const _palettes = [
    (0xFFFFE8B2, 0xFF8A3D12),
    (0xFFE5DCFF, 0xFF59419B),
    (0xFFD8F2E3, 0xFF176B50),
    (0xFFFFDCE7, 0xFFA72E59),
    (0xFFD9EDFF, 0xFF265B91),
  ];

  @override
  void dispose() {
    _headline.dispose();
    _subtitle.dispose();
    _businessName.dispose();
    super.dispose();
  }

  void _save() {
    final saved = SavedDesign.fromTemplate(
      widget.template,
      businessName: _businessName.text,
      businessType: widget.preferences.businessType,
      headline: _headline.text.trim().isEmpty
          ? widget.template.headline
          : _headline.text.trim(),
      subtitle: _subtitle.text.trim(),
      background: _background,
      foreground: _foreground,
    );
    Navigator.of(context).pop(saved);
  }

  Future<void> _sharePng() async {
    setState(() => _isSharing = true);
    try {
      await WidgetsBinding.instance.endOfFrame;
      final renderObject = _posterKey.currentContext?.findRenderObject();
      if (renderObject is! RenderRepaintBoundary) {
        throw StateError('The design preview is not ready to export.');
      }
      final image = await renderObject.toImage(pixelRatio: 3);
      try {
        final bytes = await image.toByteData(format: ui.ImageByteFormat.png);
        if (bytes == null) {
          throw StateError('Could not render the design as a PNG image.');
        }
        final fileName = widget.template.id.replaceAll(
          RegExp(r'[^a-zA-Z0-9_-]'),
          '-',
        );
        await SharePlus.instance.share(
          ShareParams(
            files: [
              XFile.fromData(
                bytes.buffer.asUint8List(
                  bytes.offsetInBytes,
                  bytes.lengthInBytes,
                ),
                name: 'posthub-$fileName.png',
                mimeType: 'image/png',
              ),
            ],
            text: 'Made with Post Hub',
            downloadFallbackEnabled: true,
          ),
        );
      } finally {
        image.dispose();
      }
    } catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Could not export this design: $error'),
          behavior: SnackBarBehavior.floating,
        ),
      );
    } finally {
      if (mounted) setState(() => _isSharing = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAF7F2),
      appBar: AppBar(
        title: const Text('Customize design'),
        backgroundColor: const Color(0xFFFAF7F2),
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(20, 8, 20, 24),
          children: [
            Center(
              child: RepaintBoundary(
                key: _posterKey,
                child: SizedBox(
                  width: 220,
                  height: 290,
                  child: TemplatePoster(
                    headline: _headline.text.isEmpty
                        ? widget.template.headline
                        : _headline.text,
                    subtitle: _subtitle.text,
                    businessName: _businessName.text,
                    background: _background,
                    foreground: _foreground,
                    icon: widget.template.icon,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 14),
            const Text(
              'Edit your design',
              style: TextStyle(
                color: Color(0xFF211D35),
                fontSize: 18,
                fontWeight: FontWeight.w900,
              ),
            ),
            const SizedBox(height: 10),
            TextField(
              key: const ValueKey('design-headline'),
              controller: _headline,
              onChanged: (_) => setState(() {}),
              maxLength: 44,
              decoration: const InputDecoration(
                labelText: 'Main message',
                border: OutlineInputBorder(),
              ),
            ),
            TextField(
              key: const ValueKey('design-subtitle'),
              controller: _subtitle,
              onChanged: (_) => setState(() {}),
              maxLength: 72,
              decoration: const InputDecoration(
                labelText: 'Supporting message',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              key: const ValueKey('design-business-name'),
              controller: _businessName,
              onChanged: (_) => setState(() {}),
              decoration: const InputDecoration(
                labelText: 'Business name (optional)',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 14),
            const Text(
              'Choose a color style',
              style: TextStyle(
                color: Color(0xFF514A5C),
                fontSize: 12,
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 8),
            Wrap(
              spacing: 10,
              children: [
                for (var index = 0; index < _palettes.length; index++)
                  InkWell(
                    key: ValueKey('design-palette-$index'),
                    onTap: () => setState(() {
                      _background = _palettes[index].$1;
                      _foreground = _palettes[index].$2;
                    }),
                    customBorder: const CircleBorder(),
                    child: Container(
                      width: 36,
                      height: 36,
                      decoration: BoxDecoration(
                        color: Color(_palettes[index].$1),
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: _background == _palettes[index].$1
                              ? Color(_palettes[index].$2)
                              : Colors.white,
                          width: 3,
                        ),
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 20),
            OutlinedButton.icon(
              key: const ValueKey('export-design'),
              onPressed: _isSharing ? null : _sharePng,
              icon: _isSharing
                  ? const SizedBox(
                      width: 17,
                      height: 17,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Icon(Icons.ios_share_rounded),
              label: Text(
                _isSharing ? 'Preparing image…' : 'Export / Share PNG',
              ),
            ),
            const SizedBox(height: 8),
            FilledButton.icon(
              key: const ValueKey('save-design'),
              onPressed: _save,
              icon: const Icon(Icons.bookmark_add_rounded),
              label: const Text('Save to My designs'),
            ),
          ],
        ),
      ),
    );
  }
}

class SavedDesignsScreen extends StatelessWidget {
  const SavedDesignsScreen({
    super.key,
    required this.designs,
    required this.accent,
    required this.onDelete,
  });

  final List<SavedDesign> designs;
  final Color accent;
  final ValueChanged<SavedDesign> onDelete;

  @override
  Widget build(BuildContext context) {
    return ListView(
      key: const ValueKey('saved-designs-screen'),
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 28),
      children: [
        const Text(
          'My designs',
          style: TextStyle(
            color: Color(0xFF211D35),
            fontSize: 25,
            fontWeight: FontWeight.w900,
          ),
        ),
        const SizedBox(height: 6),
        Text(
          designs.isEmpty
              ? 'Your saved designs will appear here.'
              : '${designs.length} saved ${designs.length == 1 ? 'design' : 'designs'} on this device',
          style: const TextStyle(color: Color(0xFF817A8D), fontSize: 12),
        ),
        const SizedBox(height: 18),
        if (designs.isEmpty)
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(18),
            ),
            child: Column(
              children: [
                Icon(Icons.palette_outlined, color: accent, size: 34),
                const SizedBox(height: 10),
                const Text(
                  'Start with an occasion template',
                  style: TextStyle(fontWeight: FontWeight.w800),
                ),
                const SizedBox(height: 4),
                const Text(
                  'Browse templates, add your own message and save a design.',
                  textAlign: TextAlign.center,
                  style: TextStyle(color: Color(0xFF817A8D), fontSize: 11),
                ),
              ],
            ),
          )
        else
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: designs.length,
            gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
              maxCrossAxisExtent: 220,
              mainAxisSpacing: 12,
              crossAxisSpacing: 12,
              childAspectRatio: .68,
            ),
            itemBuilder: (context, index) {
              final design = designs[index];
              return Stack(
                children: [
                  Padding(
                    padding: const EdgeInsets.only(bottom: 24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(child: TemplatePoster.fromSavedDesign(design)),
                        const SizedBox(height: 7),
                        Text(
                          design.title,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            color: Color(0xFF302A3A),
                            fontSize: 11,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                        Text(
                          design.businessName.isEmpty
                              ? design.occasion
                              : design.businessName,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            color: Color(0xFF817A8D),
                            fontSize: 9,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Positioned(
                    top: 4,
                    right: 4,
                    child: IconButton(
                      key: ValueKey('delete-design-${design.id}'),
                      tooltip: 'Delete design',
                      onPressed: () => onDelete(design),
                      style: IconButton.styleFrom(
                        backgroundColor: Colors.white,
                        foregroundColor: const Color(0xFF765F71),
                      ),
                      icon: const Icon(Icons.delete_outline_rounded, size: 18),
                    ),
                  ),
                ],
              );
            },
          ),
        const SizedBox(height: 10),
        const Text(
          'Saved designs are stored locally on this device in this version.',
          style: TextStyle(color: Color(0xFF817A8D), fontSize: 10),
        ),
      ],
    );
  }
}

IconData _posterIcon(String value) => switch (value) {
  'festival' => Icons.wb_twilight_rounded,
  'colors' => Icons.palette_rounded,
  'crescent' => Icons.nightlight_round,
  'flag' => Icons.flag_rounded,
  'heart' => Icons.favorite_rounded,
  'sale' => Icons.local_offer_rounded,
  'store' => Icons.storefront_rounded,
  'cake' => Icons.cake_rounded,
  'sparkle' => Icons.auto_awesome_rounded,
  _ => Icons.star_rounded,
};
