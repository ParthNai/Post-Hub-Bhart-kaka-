import 'dart:convert';
import 'dart:math' as math;
import 'dart:ui' as ui;

import 'package:cross_file/cross_file.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:share_plus/share_plus.dart';

import 'auth_service.dart';
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
  if (colorStr.trim() == 'transparent') {
    return Colors.transparent;
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
  return Colors.transparent;
}

Widget _buildPosterBackground(String url, int fallbackColor) {
  final trimmed = url.trim();
  if (trimmed.isEmpty) {
    return Container(color: Color(fallbackColor));
  }

  // Handle base64 data URI (data:image/...)
  if (trimmed.startsWith('data:image')) {
    try {
      final commaIndex = trimmed.indexOf(',');
      final base64Data = commaIndex != -1 ? trimmed.substring(commaIndex + 1) : trimmed;
      final cleanBase64 = base64Data.replaceAll(RegExp(r'\s+'), '');
      final bytes = base64Decode(cleanBase64);
      return Image.memory(
        bytes,
        fit: BoxFit.fill,
        errorBuilder: (_, __, ___) => Container(color: Color(fallbackColor)),
      );
    } catch (_) {
      return Container(color: Color(fallbackColor));
    }
  }

  // Handle relative URL (/templates/...) by prepending backend URL
  String fullUrl = trimmed;
  if (trimmed.startsWith('/')) {
    fullUrl = '${defaultApiBaseUrl()}$trimmed';
  }

  return Image.network(
    fullUrl,
    fit: BoxFit.fill,
    errorBuilder: (_, __, ___) => Container(color: Color(fallbackColor)),
  );
}

Widget _buildAvatarImage(String photo) {
  final trimmed = photo.trim();
  if (trimmed.startsWith('data:image')) {
    try {
      final commaIndex = trimmed.indexOf(',');
      final base64Data = commaIndex != -1 ? trimmed.substring(commaIndex + 1) : trimmed;
      final cleanBase64 = base64Data.replaceAll(RegExp(r'\s+'), '');
      return Image.memory(
        base64Decode(cleanBase64),
        fit: BoxFit.cover,
        alignment: Alignment.topCenter,
        errorBuilder: (_, __, ___) => Container(
          color: Colors.white24,
          child: const Icon(Icons.person, color: Colors.white, size: 24),
        ),
      );
    } catch (_) {}
  }

  String fullUrl = trimmed;
  if (trimmed.startsWith('/')) {
    fullUrl = '${defaultApiBaseUrl()}$trimmed';
  }

  return Image.network(
    fullUrl,
    fit: BoxFit.cover,
    alignment: Alignment.topCenter,
    errorBuilder: (_, __, ___) => Container(
      color: Colors.white24,
      child: const Icon(Icons.person, color: Colors.white, size: 24),
    ),
  );
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
    this.selectedZoneId,
    this.onSelectZone,
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
  final String? selectedZoneId;
  final ValueChanged<String?>? onSelectZone;

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
    userName: userName ?? design.userName,
    userAvatarUrl: userAvatarUrl ?? design.userAvatarUrl,
    userPhone: userPhone ?? design.userPhone,
    userDesignation: userDesignation ?? design.userDesignation,
  );

  Widget _buildShapeZone(FlutterSlotZone zone, double w, double h) {
    final isPill = zone.shapeType == 'pill';
    final isCircle = zone.shapeType == 'circle';
    final bgColor = _parseZoneBackground(zone.backgroundColor, zone.opacity);
    final borderColor = _parseHex(zone.borderColor, fallback: Colors.transparent);
    final borderWidth = zone.borderWidth;

    return Container(
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: isCircle
            ? BorderRadius.circular(999)
            : BorderRadius.circular(isPill ? 999 : 8),
        border: borderWidth > 0 && zone.borderColor.isNotEmpty && zone.borderColor != 'transparent'
            ? Border.all(color: borderColor, width: borderWidth)
            : null,
        boxShadow: zone.shadow
            ? [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.3),
                  blurRadius: 6,
                  offset: const Offset(0, 2),
                ),
              ]
            : null,
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
        : ((zone.sampleAvatarUrl != null && zone.sampleAvatarUrl!.isNotEmpty)
            ? zone.sampleAvatarUrl!
            : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80');

    final borderColor = _parseHex(zone.borderColor, fallback: Colors.white);
    final borderWidth = isCutout ? 0.0 : zone.borderWidth;

    Widget imageWidget = _buildAvatarImage(photo);

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
      case 'business':
        text = businessName.isNotEmpty ? businessName : 'Post Hub Studio';
        break;
      case 'headline':
      case 'title':
        text = headline.isNotEmpty ? headline : (zone.customText ?? zone.label);
        break;
      case 'subtitle':
      case 'subheadline':
        text = subtitle.isNotEmpty ? subtitle : (zone.customText ?? zone.label);
        break;
      case 'custom':
      default:
        final lbl = zone.label.toLowerCase();
        if (headline.isNotEmpty &&
            (lbl.contains('title') ||
                lbl.contains('headline') ||
                lbl == 'main message' ||
                lbl.contains('banner'))) {
          text = headline;
        } else if (subtitle.isNotEmpty &&
            (lbl.contains('sub') ||
                lbl.contains('message') ||
                lbl.contains('greeting'))) {
          text = subtitle;
        } else {
          text = zone.customText ?? zone.label;
        }
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

  Widget _canvaHandle() => Container(
    width: 8,
    height: 8,
    decoration: BoxDecoration(
      color: Colors.white,
      shape: BoxShape.circle,
      border: Border.all(color: const Color(0xFF00C4CC), width: 2),
      boxShadow: const [BoxShadow(color: Colors.black38, blurRadius: 2)],
    ),
  );

  Widget _buildSlotZoneWidget(FlutterSlotZone zone, double w, double h) {
    Widget inner;
    switch (zone.type) {
      case 'photo':
        inner = _buildPhotoZone(zone, w, h);
        break;
      case 'text':
        inner = _buildTextZone(zone, w, h);
        break;
      case 'shape':
      default:
        inner = _buildShapeZone(zone, w, h);
        break;
    }

    final isSelected = selectedZoneId == zone.id;
    if (isSelected) {
      inner = Stack(
        clipBehavior: Clip.none,
        children: [
          inner,
          Positioned.fill(
            child: IgnorePointer(
              child: Container(
                decoration: BoxDecoration(
                  border: Border.all(color: const Color(0xFF00C4CC), width: 2),
                  borderRadius: BorderRadius.circular(4),
                ),
              ),
            ),
          ),
          Positioned(top: -4, left: -4, child: _canvaHandle()),
          Positioned(top: -4, right: -4, child: _canvaHandle()),
          Positioned(bottom: -4, left: -4, child: _canvaHandle()),
          Positioned(bottom: -4, right: -4, child: _canvaHandle()),
        ],
      );
    }

    if (onSelectZone != null) {
      return GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: () => onSelectZone!(zone.id),
        child: inner,
      );
    }
    return inner;
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
                    child: GestureDetector(
                      onTap: () => onSelectZone?.call(null),
                      behavior: HitTestBehavior.opaque,
                      child: hasBackground
                          ? _buildPosterBackground(backgroundImageUrl!, background)
                          : Container(color: Color(background)),
                    ),
                  ),
                  if (hasSlots) ...[
                    for (final zone in slotZones)
                      Positioned(
                        left: w * (zone.x / 100),
                        top: h * (zone.y / 100),
                        width: (w * (zone.width / 100)).clamp(1.0, w),
                        height: (h * (zone.height / 100)).clamp(1.0, h),
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
  late final _userName = TextEditingController(text: 'Parth Patel');
  late final _userPhone = TextEditingController(text: '+91 98765 43210');
  late final _userDesignation = TextEditingController(
    text: widget.template.category.toLowerCase().contains('festival')
        ? 'शुभकामनाएं | Director'
        : 'युवा नेता / Founder',
  );
  late final _customPhotoUrlController = TextEditingController();

  late int _background = widget.template.background;
  late int _foreground = widget.template.foreground;
  final _posterKey = GlobalKey();
  bool _isSharing = false;

  String? _selectedZoneId;
  String _activeTab = 'text'; // 'text', 'photo', 'frames'
  String _userAvatarUrl =
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80';
  String _photoShape = 'cutout'; // 'cutout', 'circle', 'squircle'
  late List<FlutterSlotZone> _customZones = List.from(widget.template.slotZones);
  String _selectedFramePresetId = 'default';

  static const _leaderPresets = [
    (
      id: 'modi-ji',
      name: 'PM Modi Ji',
      role: 'National Leader',
      url:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Narendra_Modi_2021.jpg/440px-Narendra_Modi_2021.jpg',
      shape: 'cutout',
    ),
    (
      id: 'candidate-cutout',
      name: 'Candidate Cutout',
      role: 'Political / Youth',
      url:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      shape: 'cutout',
    ),
    (
      id: 'parth-pro',
      name: 'Business Pro',
      role: 'Founder / CEO',
      url:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      shape: 'circle',
    ),
    (
      id: 'female-leader',
      name: 'Female Leader',
      role: 'Executive',
      url:
          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      shape: 'circle',
    ),
    (
      id: 'default-woman',
      name: 'Default Avatar',
      role: 'Cutout Portrait',
      url:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80',
      shape: 'cutout',
    ),
  ];

  static const _palettes = [
    (0xFFFFE8B2, 0xFF8A3D12),
    (0xFFE5DCFF, 0xFF59419B),
    (0xFFD8F2E3, 0xFF176B50),
    (0xFFFFDCE7, 0xFFA72E59),
    (0xFFD9EDFF, 0xFF265B91),
  ];

  @override
  void initState() {
    super.initState();
    final photoZone = widget.template.slotZones.where((z) => z.type == 'photo').firstOrNull;
    if (photoZone?.sampleAvatarUrl != null && photoZone!.sampleAvatarUrl!.isNotEmpty) {
      _userAvatarUrl = photoZone.sampleAvatarUrl!;
    }
  }

  @override
  void dispose() {
    _headline.dispose();
    _subtitle.dispose();
    _businessName.dispose();
    _userName.dispose();
    _userPhone.dispose();
    _userDesignation.dispose();
    _customPhotoUrlController.dispose();
    super.dispose();
  }

  void _applyPhotoPreset(String url, String shape) {
    setState(() {
      _userAvatarUrl = url;
      _photoShape = shape;
      // Also update shape of any photo zones in custom zones
      _customZones = _customZones.map((z) {
        if (z.type == 'photo') {
          return z.copyWith(photoShape: shape);
        }
        return z;
      }).toList();
    });
  }

  void _applyPhotoShape(String shape) {
    setState(() {
      _photoShape = shape;
      _customZones = _customZones.map((z) {
        if (z.type == 'photo') {
          return z.copyWith(photoShape: shape);
        }
        return z;
      }).toList();
    });
  }

  void _applyFramePreset(String presetId) {
    setState(() {
      _selectedFramePresetId = presetId;
      final timestamp = DateTime.now().millisecondsSinceEpoch;
      final existingTopZones = widget.template.slotZones.where((z) {
        final id = z.id.toLowerCase();
        final lbl = z.label.toLowerCase();
        return !id.contains('bottom') &&
            !id.contains('footer') &&
            !id.contains('pill') &&
            !lbl.contains('footer') &&
            !lbl.contains('pill') &&
            z.y < 70;
      }).toList();

      switch (presetId) {
        case 'corp_pill':
          _customZones = [
            ...existingTopZones,
            FlutterSlotZone(
              id: 'zone-pill-bg-$timestamp',
              type: 'shape',
              label: 'Corporate Pill Bar',
              shapeType: 'pill',
              x: 4,
              y: 88,
              width: 92,
              height: 9.5,
              backgroundColor: '#0F172A',
              borderColor: '#38BDF8',
              borderWidth: 1.5,
              shadow: true,
              opacity: 0.96,
            ),
            FlutterSlotZone(
              id: 'zone-pill-photo-$timestamp',
              type: 'photo',
              label: 'User Avatar',
              photoShape: 'circle',
              x: 6,
              y: 88.5,
              width: 14,
              height: 8.5,
              borderColor: '#38BDF8',
              borderWidth: 2,
              shadow: true,
            ),
            FlutterSlotZone(
              id: 'zone-pill-name-$timestamp',
              type: 'text',
              label: 'User Name',
              textBinding: 'name',
              x: 23,
              y: 89,
              width: 42,
              height: 4,
              fontSize: 14,
              textColor: '#FFFFFF',
              fontWeight: '800',
              alignment: 'left',
            ),
            FlutterSlotZone(
              id: 'zone-pill-contact-$timestamp',
              type: 'text',
              label: 'Contact',
              textBinding: 'phone',
              x: 23,
              y: 93,
              width: 42,
              height: 4,
              fontSize: 11,
              textColor: '#FACC15',
              fontWeight: '700',
              alignment: 'left',
            ),
            FlutterSlotZone(
              id: 'zone-pill-badge-$timestamp',
              type: 'text',
              label: 'Designation',
              textBinding: 'designation',
              x: 66,
              y: 90,
              width: 28,
              height: 5,
              fontSize: 11,
              textColor: '#38BDF8',
              fontWeight: '700',
              alignment: 'right',
            ),
          ];
          break;

        case 'political_ribbon':
          _customZones = [
            ...existingTopZones,
            FlutterSlotZone(
              id: 'zone-poly-bg-$timestamp',
              type: 'shape',
              label: 'Political Banner',
              shapeType: 'rectangle',
              x: 0,
              y: 86,
              width: 100,
              height: 14,
              backgroundColor: 'rgba(17, 24, 39, 0.95)',
              borderColor: '#FF9933',
              borderWidth: 2,
              shadow: true,
              opacity: 0.95,
            ),
            FlutterSlotZone(
              id: 'zone-poly-photo-$timestamp',
              type: 'photo',
              label: 'Candidate Photo',
              photoShape: 'cutout',
              x: 4,
              y: 72,
              width: 28,
              height: 28,
              borderWidth: 0,
              shadow: false,
            ),
            FlutterSlotZone(
              id: 'zone-poly-name-$timestamp',
              type: 'text',
              label: 'Candidate Name',
              textBinding: 'name',
              x: 34,
              y: 88,
              width: 62,
              height: 5.5,
              fontSize: 16,
              textColor: '#FFFFFF',
              fontWeight: '800',
              alignment: 'left',
            ),
            FlutterSlotZone(
              id: 'zone-poly-phone-$timestamp',
              type: 'text',
              label: 'WhatsApp Contact',
              textBinding: 'phone',
              x: 34,
              y: 93.5,
              width: 62,
              height: 4.5,
              fontSize: 12,
              textColor: '#22C55E',
              fontWeight: '700',
              alignment: 'left',
            ),
          ];
          break;

        case 'executive_gold':
          _customZones = [
            ...existingTopZones,
            FlutterSlotZone(
              id: 'zone-gold-bg-$timestamp',
              type: 'shape',
              label: 'Luxury Gold Bar',
              shapeType: 'rectangle',
              x: 3,
              y: 87,
              width: 94,
              height: 11,
              backgroundColor: '#1E1B2E',
              borderColor: '#F59E0B',
              borderWidth: 1.5,
              shadow: true,
              opacity: 0.95,
            ),
            FlutterSlotZone(
              id: 'zone-gold-name-$timestamp',
              type: 'text',
              label: 'Business / Name',
              textBinding: 'name',
              x: 6,
              y: 88.5,
              width: 50,
              height: 4.5,
              fontSize: 14,
              textColor: '#FFFFFF',
              fontWeight: '800',
              alignment: 'left',
            ),
            FlutterSlotZone(
              id: 'zone-gold-phone-$timestamp',
              type: 'text',
              label: 'Contact',
              textBinding: 'phone',
              x: 58,
              y: 88.5,
              width: 36,
              height: 4.5,
              fontSize: 12,
              textColor: '#F59E0B',
              fontWeight: '700',
              alignment: 'right',
            ),
            FlutterSlotZone(
              id: 'zone-gold-desig-$timestamp',
              type: 'text',
              label: 'Designation',
              textBinding: 'designation',
              x: 6,
              y: 93,
              width: 88,
              height: 4,
              fontSize: 11,
              textColor: '#D1D5DB',
              fontWeight: '600',
              alignment: 'left',
            ),
          ];
          break;

        case 'clean_bar':
          _customZones = [
            ...existingTopZones,
            FlutterSlotZone(
              id: 'zone-clean-bg-$timestamp',
              type: 'shape',
              label: 'Minimal Clean Strip',
              shapeType: 'rectangle',
              x: 4,
              y: 90,
              width: 92,
              height: 8,
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              borderWidth: 0,
              opacity: 0.88,
              shadow: true,
            ),
            FlutterSlotZone(
              id: 'zone-clean-name-$timestamp',
              type: 'text',
              label: 'Name',
              textBinding: 'name',
              x: 8,
              y: 91.5,
              width: 45,
              height: 5,
              fontSize: 13,
              textColor: '#FFFFFF',
              fontWeight: '700',
              alignment: 'left',
            ),
            FlutterSlotZone(
              id: 'zone-clean-phone-$timestamp',
              type: 'text',
              label: 'Phone',
              textBinding: 'phone',
              x: 55,
              y: 91.5,
              width: 38,
              height: 5,
              fontSize: 12,
              textColor: '#FACC15',
              fontWeight: '700',
              alignment: 'right',
            ),
          ];
          break;

        case 'none':
          _customZones = existingTopZones;
          break;

        case 'default':
        default:
          _customZones = List.from(widget.template.slotZones);
          break;
      }
    });
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
      slotZones: _customZones,
      userName: _userName.text,
      userAvatarUrl: _userAvatarUrl,
      userPhone: _userPhone.text,
      userDesignation: _userDesignation.text,
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
            text: 'Made with Post Hub Canva Studio',
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
      backgroundColor: const Color(0xFF0F0E17),
      appBar: AppBar(
        title: const Text(
          'Customize design',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.w800,
            fontSize: 16,
          ),
        ),
        backgroundColor: const Color(0xFF1B182B),
        iconTheme: const IconThemeData(color: Colors.white),
        actions: [
          IconButton(
            key: const ValueKey('export-design'),
            tooltip: 'Export PNG',
            onPressed: _isSharing ? null : _sharePng,
            icon: _isSharing
                ? const SizedBox(
                    width: 18,
                    height: 18,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      color: Color(0xFF00C4CC),
                    ),
                  )
                : const Icon(Icons.ios_share_rounded, color: Color(0xFF00C4CC)),
          ),
          Padding(
            padding: const EdgeInsets.only(right: 8),
            child: FilledButton(
              key: const ValueKey('save-design'),
              style: FilledButton.styleFrom(
                backgroundColor: const Color(0xFF7956C9),
                padding: const EdgeInsets.symmetric(horizontal: 14),
              ),
              onPressed: _save,
              child: const Text('Save', style: TextStyle(fontWeight: FontWeight.w800)),
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(16, 10, 16, 24),
          children: [
            // 1. CANVA HERO CANVAS STAGE
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: const Color(0xFF171424),
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: Colors.white12),
                boxShadow: const [
                  BoxShadow(
                    color: Colors.black45,
                    blurRadius: 14,
                    offset: Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                children: [
                  Center(
                    child: RepaintBoundary(
                      key: _posterKey,
                      child: SizedBox(
                        width: 200,
                        height: 260,
                        child: TemplatePoster(
                          headline: _headline.text.isEmpty
                              ? widget.template.headline
                              : _headline.text,
                          subtitle: _subtitle.text,
                          businessName: _businessName.text.isNotEmpty
                              ? _businessName.text
                              : widget.preferences.businessName,
                          background: _background,
                          foreground: _foreground,
                          icon: widget.template.icon,
                          backgroundImageUrl: widget.template.backgroundImageUrl,
                          slotZones: _customZones,
                          userName: _userName.text,
                          userAvatarUrl: _userAvatarUrl,
                          userPhone: _userPhone.text,
                          userDesignation: _userDesignation.text,
                          selectedZoneId: _selectedZoneId,
                          onSelectZone: (zoneId) {
                            setState(() {
                              _selectedZoneId = zoneId;
                              if (zoneId != null) {
                                final zone = _customZones.firstWhere(
                                  (z) => z.id == zoneId,
                                  orElse: () => _customZones.first,
                                );
                                if (zone.type == 'photo') {
                                  _activeTab = 'photo';
                                } else if (zone.type == 'text') {
                                  _activeTab = 'text';
                                } else {
                                  _activeTab = 'frames';
                                }
                              }
                            });
                          },
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 6),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(
                        Icons.touch_app_rounded,
                        size: 13,
                        color: Color(0xFF00C4CC),
                      ),
                      const SizedBox(width: 5),
                      Flexible(
                        child: Text(
                          _selectedZoneId != null
                              ? 'Selected: ${_selectedZoneId!}'
                              : 'Tap poster elements to customize',
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            color: _selectedZoneId != null
                                ? const Color(0xFF00C4CC)
                                : const Color(0xFF9E99AF),
                            fontSize: 10.5,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 12),

            // 2. CANVA TOOL SELECTOR TABS
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  _buildTabChip('text', '🔤 Text & Details', Icons.text_fields_rounded),
                  const SizedBox(width: 8),
                  _buildTabChip('photo', '📸 Photo & Cutouts', Icons.person_rounded),
                  const SizedBox(width: 8),
                  _buildTabChip('frames', '🖼️ Bottom Frames', Icons.view_compact_rounded),
                ],
              ),
            ),

            const SizedBox(height: 12),

            // 3. TEXT & DETAILS PANEL (Default Tab)
            if (_activeTab == 'text') ...[
              _buildSectionCard(
                title: 'Text & Personal Details',
                icon: Icons.edit_note_rounded,
                badge: 'Live Stamped',
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    TextField(
                      controller: _userName,
                      style: const TextStyle(color: Colors.white),
                      onChanged: (_) => setState(() {}),
                      decoration: const InputDecoration(
                        labelText: 'Your / Candidate Name',
                        labelStyle: TextStyle(color: Color(0xFF00C4CC)),
                        prefixIcon: Icon(Icons.person, color: Color(0xFF00C4CC)),
                        border: OutlineInputBorder(),
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: Colors.white24),
                        ),
                      ),
                    ),
                    const SizedBox(height: 10),
                    TextField(
                      controller: _userPhone,
                      style: const TextStyle(color: Colors.white),
                      onChanged: (_) => setState(() {}),
                      decoration: const InputDecoration(
                        labelText: 'Mobile / WhatsApp Number',
                        labelStyle: TextStyle(color: Color(0xFFFACC15)),
                        prefixIcon: Icon(Icons.phone, color: Color(0xFFFACC15)),
                        border: OutlineInputBorder(),
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: Colors.white24),
                        ),
                      ),
                    ),
                    const SizedBox(height: 10),
                    TextField(
                      controller: _userDesignation,
                      style: const TextStyle(color: Colors.white),
                      onChanged: (_) => setState(() {}),
                      decoration: const InputDecoration(
                        labelText: 'Designation / Slogan (Optional)',
                        labelStyle: TextStyle(color: Color(0xFFB4AFD0)),
                        prefixIcon: Icon(Icons.badge, color: Color(0xFFB4AFD0)),
                        border: OutlineInputBorder(),
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: Colors.white24),
                        ),
                      ),
                    ),
                    const SizedBox(height: 10),
                    TextField(
                      key: const ValueKey('design-headline'),
                      controller: _headline,
                      style: const TextStyle(color: Colors.white),
                      onChanged: (_) => setState(() {}),
                      maxLength: 44,
                      decoration: const InputDecoration(
                        labelText: 'Main message',
                        labelStyle: TextStyle(color: Colors.white70),
                        border: OutlineInputBorder(),
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: Colors.white24),
                        ),
                      ),
                    ),
                    TextField(
                      key: const ValueKey('design-subtitle'),
                      controller: _subtitle,
                      style: const TextStyle(color: Colors.white),
                      onChanged: (_) => setState(() {}),
                      maxLength: 72,
                      decoration: const InputDecoration(
                        labelText: 'Supporting message',
                        labelStyle: TextStyle(color: Colors.white70),
                        border: OutlineInputBorder(),
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: Colors.white24),
                        ),
                      ),
                    ),
                    const SizedBox(height: 6),
                    TextField(
                      key: const ValueKey('design-business-name'),
                      controller: _businessName,
                      style: const TextStyle(color: Colors.white),
                      onChanged: (_) => setState(() {}),
                      decoration: const InputDecoration(
                        labelText: 'Business name (optional)',
                        labelStyle: TextStyle(color: Colors.white70),
                        border: OutlineInputBorder(),
                        enabledBorder: OutlineInputBorder(
                          borderSide: BorderSide(color: Colors.white24),
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      'Choose a color style',
                      style: TextStyle(
                        color: Color(0xFFB4AFD0),
                        fontSize: 11.5,
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
                              width: 34,
                              height: 34,
                              decoration: BoxDecoration(
                                color: Color(_palettes[index].$1),
                                shape: BoxShape.circle,
                                border: Border.all(
                                  color: _background == _palettes[index].$1
                                      ? const Color(0xFF00C4CC)
                                      : Colors.white24,
                                  width: _background == _palettes[index].$1 ? 3 : 1.5,
                                ),
                              ),
                            ),
                          ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),
            ],

            // 4. PHOTO & CUTOUTS PANEL (Visible when 'photo' tab is selected)
            if (_activeTab == 'photo') ...[
              _buildSectionCard(
                title: 'Photo & Leader Cutouts',
                icon: Icons.person_pin_rounded,
                badge: '1-Click Replace',
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Select Persona or Leader Cutout:',
                      style: TextStyle(
                        color: Color(0xFFB4AFD0),
                        fontSize: 11.5,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 8),
                    SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      child: Row(
                        children: [
                          for (final leader in _leaderPresets)
                            Padding(
                              padding: const EdgeInsets.only(right: 10),
                              child: InkWell(
                                onTap: () =>
                                    _applyPhotoPreset(leader.url, leader.shape),
                                borderRadius: BorderRadius.circular(12),
                                child: Container(
                                  width: 84,
                                  padding: const EdgeInsets.all(6),
                                  decoration: BoxDecoration(
                                    color: _userAvatarUrl == leader.url
                                        ? const Color(0xFF7956C9).withValues(alpha: 0.3)
                                        : const Color(0xFF231F36),
                                    borderRadius: BorderRadius.circular(12),
                                    border: Border.all(
                                      color: _userAvatarUrl == leader.url
                                          ? const Color(0xFF00C4CC)
                                          : Colors.white12,
                                      width: _userAvatarUrl == leader.url ? 2 : 1,
                                    ),
                                  ),
                                  child: Column(
                                    children: [
                                      ClipRRect(
                                        borderRadius: BorderRadius.circular(8),
                                        child: SizedBox(
                                          width: 48,
                                          height: 48,
                                          child: _buildAvatarImage(leader.url),
                                        ),
                                      ),
                                      const SizedBox(height: 4),
                                      Text(
                                        leader.name,
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                        style: const TextStyle(
                                          color: Colors.white,
                                          fontSize: 10,
                                          fontWeight: FontWeight.w700,
                                        ),
                                      ),
                                      Text(
                                        leader.role,
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                        style: const TextStyle(
                                          color: Color(0xFF9E99AF),
                                          fontSize: 8.5,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      'Photo Shape & Crop:',
                      style: TextStyle(
                        color: Color(0xFFB4AFD0),
                        fontSize: 11.5,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Row(
                      children: [
                        _buildShapeOption('cutout', 'Cutout (Fade)'),
                        const SizedBox(width: 8),
                        _buildShapeOption('circle', 'Circle Frame'),
                        const SizedBox(width: 8),
                        _buildShapeOption('squircle', 'Squircle'),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: _customPhotoUrlController,
                            style: const TextStyle(color: Colors.white, fontSize: 12),
                            decoration: InputDecoration(
                              hintText: 'Paste custom image URL...',
                              hintStyle: const TextStyle(color: Colors.white38),
                              isDense: true,
                              filled: true,
                              fillColor: const Color(0xFF231F36),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(8),
                                borderSide: BorderSide.none,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        FilledButton(
                          style: FilledButton.styleFrom(
                            backgroundColor: const Color(0xFF7956C9),
                            padding: const EdgeInsets.symmetric(horizontal: 14),
                          ),
                          onPressed: () {
                            final url = _customPhotoUrlController.text.trim();
                            if (url.isNotEmpty) {
                              _applyPhotoPreset(url, _photoShape);
                            }
                          },
                          child: const Text('Apply'),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),
            ],

            // 5. BOTTOM FRAMES PANEL (Visible when 'frames' tab is selected)
            if (_activeTab == 'frames') ...[
              _buildSectionCard(
                title: 'Bottom Frames & Footer Strips',
                icon: Icons.view_compact_rounded,
                badge: '1-Tap Apply',
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Choose Footer Strip Layout:',
                      style: TextStyle(
                        color: Color(0xFFB4AFD0),
                        fontSize: 11.5,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 10),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: [
                        _buildFramePresetChip(
                          'default',
                          'Original Template',
                          Icons.auto_awesome,
                        ),
                        _buildFramePresetChip(
                          'corp_pill',
                          'Corporate Pro Pill',
                          Icons.rounded_corner_rounded,
                        ),
                        _buildFramePresetChip(
                          'political_ribbon',
                          'Political Banner',
                          Icons.flag_rounded,
                        ),
                        _buildFramePresetChip(
                          'executive_gold',
                          'Executive Gold',
                          Icons.star_rounded,
                        ),
                        _buildFramePresetChip(
                          'clean_bar',
                          'Minimal Strip',
                          Icons.horizontal_rule_rounded,
                        ),
                        _buildFramePresetChip(
                          'none',
                          'No Footer Frame',
                          Icons.clear_rounded,
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),
            ],

            // 6. BOTTOM ACTIONS
            OutlinedButton.icon(
              key: const ValueKey('export-design-bottom'),
              style: OutlinedButton.styleFrom(
                foregroundColor: const Color(0xFF00C4CC),
                side: const BorderSide(color: Color(0xFF00C4CC)),
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
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
                style: const TextStyle(fontWeight: FontWeight.w700),
              ),
            ),
            const SizedBox(height: 8),
            FilledButton.icon(
              key: const ValueKey('save-design-bottom'),
              style: FilledButton.styleFrom(
                backgroundColor: const Color(0xFF7956C9),
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
              onPressed: _save,
              icon: const Icon(Icons.bookmark_add_rounded),
              label: const Text(
                'Save to My designs',
                style: TextStyle(fontWeight: FontWeight.w800),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTabChip(String id, String label, IconData icon) {
    final isActive = _activeTab == id;
    return InkWell(
      onTap: () => setState(() => _activeTab = id),
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
        decoration: BoxDecoration(
          color: isActive
              ? const Color(0xFF7956C9)
              : const Color(0xFF1E1B2E),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isActive ? const Color(0xFF00C4CC) : Colors.white12,
            width: isActive ? 1.5 : 1,
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 13,
              color: isActive ? Colors.white : const Color(0xFF9E99AF),
            ),
            const SizedBox(width: 5),
            Text(
              label,
              style: TextStyle(
                color: isActive ? Colors.white : const Color(0xFFB4AFD0),
                fontSize: 11.5,
                fontWeight: isActive ? FontWeight.w800 : FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildShapeOption(String shape, String label) {
    final isSelected = _photoShape == shape;
    return Expanded(
      child: InkWell(
        onTap: () => _applyPhotoShape(shape),
        borderRadius: BorderRadius.circular(8),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 7),
          decoration: BoxDecoration(
            color: isSelected ? const Color(0xFF7956C9) : const Color(0xFF231F36),
            borderRadius: BorderRadius.circular(8),
            border: Border.all(
              color: isSelected ? const Color(0xFF00C4CC) : Colors.white12,
            ),
          ),
          child: Text(
            label,
            textAlign: TextAlign.center,
            style: TextStyle(
              color: isSelected ? Colors.white : const Color(0xFF9E99AF),
              fontSize: 10.5,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildFramePresetChip(String id, String label, IconData icon) {
    final isSelected = _selectedFramePresetId == id;
    return InkWell(
      onTap: () => _applyFramePreset(id),
      borderRadius: BorderRadius.circular(10),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected
              ? const Color(0xFF7956C9).withValues(alpha: 0.3)
              : const Color(0xFF231F36),
          borderRadius: BorderRadius.circular(10),
          border: Border.all(
            color: isSelected ? const Color(0xFF00C4CC) : Colors.white12,
            width: isSelected ? 1.5 : 1,
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 14,
              color: isSelected ? const Color(0xFF00C4CC) : const Color(0xFF9E99AF),
            ),
            const SizedBox(width: 6),
            Text(
              label,
              style: TextStyle(
                color: isSelected ? Colors.white : const Color(0xFFD1D5DB),
                fontSize: 11,
                fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionCard({
    required String title,
    required IconData icon,
    String? badge,
    required Widget child,
  }) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFF1B182B),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white10),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 16, color: const Color(0xFF00C4CC)),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  title,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 13,
                    fontWeight: FontWeight.w800,
                  ),
                ),
              ),
              if (badge != null) ...[
                const SizedBox(width: 6),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: const Color(0xFF7956C9).withValues(alpha: 0.25),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    badge,
                    style: const TextStyle(
                      color: Color(0xFFD8B4FE),
                      fontSize: 9.5,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ],
          ),
          const SizedBox(height: 12),
          child,
        ],
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
