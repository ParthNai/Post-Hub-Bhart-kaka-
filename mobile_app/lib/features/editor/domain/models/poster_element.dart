import 'package:flutter/material.dart';

enum PosterElementType {
  text,
  image,
}

/// Represents an individual editable element positioned on the poster canvas.
class PosterElement {
  const PosterElement({
    required this.id,
    required this.type,
    this.text = '',
    this.imageAsset,
    this.x = 0.5,
    this.y = 0.5,
    this.fontSize = 24.0,
    this.color = const Color(0xFFFDE68A),
    this.fontFamily = 'Poppins',
    this.textAlign = TextAlign.center,
    this.isBold = true,
    this.isItalic = false,
    this.isSelected = false,
    this.rotation = 0.0,
    this.width,
    this.height,
    this.isVisible = true,
    this.backgroundColor,
    this.secondaryText,
    this.secondaryColor,
  });

  final String id;
  final PosterElementType type;
  final String text;
  final String? imageAsset;
  final double x; // Relative X coordinate (0.0 to 1.0)
  final double y; // Relative Y coordinate (0.0 to 1.0)
  final double fontSize;
  final Color color;
  final String fontFamily;
  final TextAlign textAlign;
  final bool isBold;
  final bool isItalic;
  final bool isSelected;
  final double rotation;
  final double? width;
  final double? height;
  final bool isVisible;
  final Color? backgroundColor;
  final String? secondaryText;
  final Color? secondaryColor;

  PosterElement copyWith({
    String? id,
    PosterElementType? type,
    String? text,
    String? imageAsset,
    double? x,
    double? y,
    double? fontSize,
    Color? color,
    String? fontFamily,
    TextAlign? textAlign,
    bool? isBold,
    bool? isItalic,
    bool? isSelected,
    double? rotation,
    double? width,
    double? height,
    bool? isVisible,
    Color? backgroundColor,
    String? secondaryText,
    Color? secondaryColor,
    bool clearSecondaryText = false,
  }) {
    return PosterElement(
      id: id ?? this.id,
      type: type ?? this.type,
      text: text ?? this.text,
      imageAsset: imageAsset ?? this.imageAsset,
      x: x ?? this.x,
      y: y ?? this.y,
      fontSize: fontSize ?? this.fontSize,
      color: color ?? this.color,
      fontFamily: fontFamily ?? this.fontFamily,
      textAlign: textAlign ?? this.textAlign,
      isBold: isBold ?? this.isBold,
      isItalic: isItalic ?? this.isItalic,
      isSelected: isSelected ?? this.isSelected,
      rotation: rotation ?? this.rotation,
      width: width ?? this.width,
      height: height ?? this.height,
      isVisible: isVisible ?? this.isVisible,
      backgroundColor: backgroundColor ?? this.backgroundColor,
      secondaryText: clearSecondaryText ? null : (secondaryText ?? this.secondaryText),
      secondaryColor: clearSecondaryText ? null : (secondaryColor ?? this.secondaryColor),
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'type': type.name,
        'text': text,
        'imageAsset': imageAsset,
        'x': x,
        'y': y,
        'fontSize': fontSize,
        'color': color.toARGB32(),
        'fontFamily': fontFamily,
        'textAlign': textAlign.index,
        'isBold': isBold,
        'isItalic': isItalic,
        'rotation': rotation,
        'width': width,
        'height': height,
        'isVisible': isVisible,
        if (backgroundColor != null) 'backgroundColor': backgroundColor!.toARGB32(),
        if (secondaryText != null) 'secondaryText': secondaryText,
        if (secondaryColor != null) 'secondaryColor': secondaryColor!.toARGB32(),
      };

  factory PosterElement.fromJson(Map<String, dynamic> json) {
    return PosterElement(
      id: json['id'] as String,
      type: json['type'] == 'image'
          ? PosterElementType.image
          : PosterElementType.text,
      text: json['text'] as String? ?? '',
      imageAsset: json['imageAsset'] as String?,
      x: (json['x'] as num?)?.toDouble() ?? 0.5,
      y: (json['y'] as num?)?.toDouble() ?? 0.5,
      fontSize: (json['fontSize'] as num?)?.toDouble() ?? 24.0,
      color: Color((json['color'] as int?) ?? 0xFFFDE68A),
      fontFamily: json['fontFamily'] as String? ?? 'Poppins',
      textAlign: TextAlign.values[(json['textAlign'] as int?) ?? 2],
      isBold: json['isBold'] as bool? ?? true,
      isItalic: json['isItalic'] as bool? ?? false,
      rotation: (json['rotation'] as num?)?.toDouble() ?? 0.0,
      width: (json['width'] as num?)?.toDouble(),
      height: (json['height'] as num?)?.toDouble(),
      isVisible: json['isVisible'] as bool? ?? true,
      backgroundColor: json['backgroundColor'] != null
          ? Color(json['backgroundColor'] as int)
          : null,
      secondaryText: json['secondaryText'] as String?,
      secondaryColor: json['secondaryColor'] != null
          ? Color(json['secondaryColor'] as int)
          : null,
    );
  }
}
