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
    this.imageData,
    this.x = 0.5,
    this.y = 0.5,
    this.width,
    this.height,
    this.fontSize = 24.0,
    this.color = const Color(0xFFFDE68A),
    this.fontFamily = 'Poppins',
    this.textAlign = TextAlign.center,
    this.isBold = true,
    this.isSelected = false,
  });

  final String id;
  final PosterElementType type;
  final String text;
  final String? imageAsset;
  final String? imageData; // Base64 encoded image data if picked from gallery
  final double x; // Relative X coordinate (0.0 to 1.0)
  final double y; // Relative Y coordinate (0.0 to 1.0)
  final double? width; // Relative width (0.0 to 1.0)
  final double? height; // Relative height (0.0 to 1.0)
  final double fontSize;
  final Color color;
  final String fontFamily;
  final TextAlign textAlign;
  final bool isBold;
  final bool isSelected;

  PosterElement copyWith({
    String? id,
    PosterElementType? type,
    String? text,
    String? imageAsset,
    String? imageData,
    double? x,
    double? y,
    double? width,
    double? height,
    double? fontSize,
    Color? color,
    String? fontFamily,
    TextAlign? textAlign,
    bool? isBold,
    bool? isSelected,
  }) {
    return PosterElement(
      id: id ?? this.id,
      type: type ?? this.type,
      text: text ?? this.text,
      imageAsset: imageAsset ?? this.imageAsset,
      imageData: imageData ?? this.imageData,
      x: x ?? this.x,
      y: y ?? this.y,
      width: width ?? this.width,
      height: height ?? this.height,
      fontSize: fontSize ?? this.fontSize,
      color: color ?? this.color,
      fontFamily: fontFamily ?? this.fontFamily,
      textAlign: textAlign ?? this.textAlign,
      isBold: isBold ?? this.isBold,
      isSelected: isSelected ?? this.isSelected,
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'type': type.name,
        'text': text,
        'imageAsset': imageAsset,
        'imageData': imageData,
        'x': x,
        'y': y,
        'width': width,
        'height': height,
        'fontSize': fontSize,
        'color': color.toARGB32(),
        'fontFamily': fontFamily,
        'textAlign': textAlign.index,
        'isBold': isBold,
      };

  factory PosterElement.fromJson(Map<String, dynamic> json) {
    return PosterElement(
      id: json['id'] as String,
      type: json['type'] == 'image'
          ? PosterElementType.image
          : PosterElementType.text,
      text: json['text'] as String? ?? '',
      imageAsset: json['imageAsset'] as String?,
      imageData: json['imageData'] as String?,
      x: (json['x'] as num?)?.toDouble() ?? 0.5,
      y: (json['y'] as num?)?.toDouble() ?? 0.5,
      width: (json['width'] as num?)?.toDouble(),
      height: (json['height'] as num?)?.toDouble(),
      fontSize: (json['fontSize'] as num?)?.toDouble() ?? 24.0,
      color: Color((json['color'] as int?) ?? 0xFFFDE68A),
      fontFamily: json['fontFamily'] as String? ?? 'Poppins',
      textAlign: TextAlign.values[(json['textAlign'] as int?) ?? 2],
      isBold: json['isBold'] as bool? ?? true,
    );
  }
}
