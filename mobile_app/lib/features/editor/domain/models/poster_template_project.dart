import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:panchayat_post/core/constants/app_assets.dart';
import 'package:panchayat_post/features/editor/domain/models/poster_element.dart';

/// Complete project model representing a customizable poster design.
class PosterTemplateProject {
  const PosterTemplateProject({
    required this.id,
    required this.templateId,
    required this.title,
    required this.backgroundAsset,
    this.backgroundColor = const Color(0xFF2E0854),
    this.elements = const [],
    required this.updatedAt,
    this.userId = 'default_user',
  });

  final String id;
  final String templateId;
  final String title;
  final String backgroundAsset;
  final Color backgroundColor;
  final List<PosterElement> elements;
  final DateTime updatedAt;
  final String userId;

  PosterTemplateProject copyWith({
    String? id,
    String? templateId,
    String? title,
    String? backgroundAsset,
    Color? backgroundColor,
    List<PosterElement>? elements,
    DateTime? updatedAt,
    String? userId,
  }) {
    return PosterTemplateProject(
      id: id ?? this.id,
      templateId: templateId ?? this.templateId,
      title: title ?? this.title,
      backgroundAsset: backgroundAsset ?? this.backgroundAsset,
      backgroundColor: backgroundColor ?? this.backgroundColor,
      elements: elements ?? this.elements,
      updatedAt: updatedAt ?? this.updatedAt,
      userId: userId ?? this.userId,
    );
  }

  Map<String, dynamic> toMap() => {
        'id': id,
        'templateId': templateId,
        'title': title,
        'backgroundAsset': backgroundAsset,
        'backgroundColor': backgroundColor.toARGB32(),
        'elements': elements.map((e) => e.toJson()).toList(),
        'updatedAt': updatedAt.toIso8601String(),
        'userId': userId,
      };

  factory PosterTemplateProject.fromMap(Map<String, dynamic> map) {
    return PosterTemplateProject(
      id: map['id'] as String,
      templateId: map['templateId'] as String,
      title: map['title'] as String,
      backgroundAsset: map['backgroundAsset'] as String,
      backgroundColor: Color((map['backgroundColor'] as int?) ?? 0xFF2E0854),
      elements: (map['elements'] as List<dynamic>?)
              ?.map((e) => PosterElement.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
      updatedAt: DateTime.tryParse(map['updatedAt'] as String? ?? '') ??
          DateTime.now(),
      userId: map['userId'] as String? ?? 'default_user',
    );
  }

  String toJson() => jsonEncode(toMap());

  factory PosterTemplateProject.fromJson(String source) =>
      PosterTemplateProject.fromMap(jsonDecode(source) as Map<String, dynamic>);

  /// Creates default project for Screen 12 matching the reference image exactly.
  static PosterTemplateProject createDefaultNavratriProject({
    String? templateId,
    String? imageAsset,
    String? title,
  }) {
    return PosterTemplateProject(
      id: 'proj_${DateTime.now().millisecondsSinceEpoch}',
      templateId: templateId ?? 'navratri_shubh',
      title: title ?? 'શુભ નવરાત્રી',
      backgroundAsset: imageAsset ?? AppAssets.editorCanvasNavratri,
      backgroundColor: const Color(0xFF2E0854),
      updatedAt: DateTime.now(),
      elements: const [
        PosterElement(
          id: 'elem_headline',
          type: PosterElementType.text,
          text: 'શુભ નવરાત્રી',
          x: 0.5,
          y: 0.22,
          fontSize: 32.0,
          color: Color(0xFFFDE68A), // Golden Yellow
          fontFamily: 'Poppins',
          textAlign: TextAlign.center,
          isBold: true,
          isSelected: true,
        ),
        PosterElement(
          id: 'elem_supporting',
          type: PosterElementType.text,
          text: 'માતાજીના આશીર્વાદથી\nતમારું જીવન હંમેશા ખુશીઓથી ભરેલું રહે...',
          x: 0.5,
          y: 0.38,
          fontSize: 13.5,
          color: Colors.white,
          fontFamily: 'Poppins',
          textAlign: TextAlign.center,
          isBold: false,
        ),
      ],
    );
  }
}
