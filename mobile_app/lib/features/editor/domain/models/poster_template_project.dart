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
    DateTime? createdAt,
    this.userId = 'default_user',
    this.category = 'Festivals',
    this.isFavorite = false,
    this.previewAsset,
    this.frameId = 'gold_vip',
    this.frameImageUrl,
    this.frameUserPhoto,
  }) : createdAt = createdAt ?? updatedAt;

  final String id;
  final String templateId;
  final String title;
  final String backgroundAsset;
  final Color backgroundColor;
  final List<PosterElement> elements;
  final DateTime updatedAt;
  final DateTime createdAt;
  final String userId;
  final String category;
  final bool isFavorite;
  final String? previewAsset;
  final String? frameId;
  final String? frameImageUrl;
  final String? frameUserPhoto;

  PosterTemplateProject copyWith({
    String? id,
    String? templateId,
    String? title,
    String? backgroundAsset,
    Color? backgroundColor,
    List<PosterElement>? elements,
    DateTime? updatedAt,
    DateTime? createdAt,
    String? userId,
    String? category,
    bool? isFavorite,
    String? previewAsset,
    String? frameId,
    String? frameImageUrl,
    String? frameUserPhoto,
  }) {
    return PosterTemplateProject(
      id: id ?? this.id,
      templateId: templateId ?? this.templateId,
      title: title ?? this.title,
      backgroundAsset: backgroundAsset ?? this.backgroundAsset,
      backgroundColor: backgroundColor ?? this.backgroundColor,
      elements: elements ?? this.elements,
      updatedAt: updatedAt ?? this.updatedAt,
      createdAt: createdAt ?? this.createdAt,
      userId: userId ?? this.userId,
      category: category ?? this.category,
      isFavorite: isFavorite ?? this.isFavorite,
      previewAsset: previewAsset ?? this.previewAsset,
      frameId: frameId ?? this.frameId,
      frameImageUrl: frameImageUrl ?? this.frameImageUrl,
      frameUserPhoto: frameUserPhoto ?? this.frameUserPhoto,
    );
  }

  /// Creates a distinct copy of this project with a new ID and updated timestamp.
  PosterTemplateProject duplicate({String? newTitle}) {
    final now = DateTime.now();
    return copyWith(
      id: 'proj_${now.millisecondsSinceEpoch}',
      title: newTitle ?? '$title (Copy)',
      updatedAt: now,
      createdAt: now,
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
        'createdAt': createdAt.toIso8601String(),
        'userId': userId,
        'category': category,
        'isFavorite': isFavorite,
        'previewAsset': previewAsset,
        'frameId': frameId,
        'frameImageUrl': frameImageUrl,
        'frameUserPhoto': frameUserPhoto,
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
      createdAt: DateTime.tryParse(map['createdAt'] as String? ?? '') ??
          DateTime.tryParse(map['updatedAt'] as String? ?? '') ??
          DateTime.now(),
      userId: map['userId'] as String? ?? 'default_user',
      category: map['category'] as String? ?? 'Festivals',
      isFavorite: map['isFavorite'] as bool? ?? false,
      previewAsset: map['previewAsset'] as String?,
      frameId: map['frameId'] as String? ?? 'gold_vip',
      frameImageUrl: map['frameImageUrl'] as String?,
      frameUserPhoto: map['frameUserPhoto'] as String?,
    );
  }

  String toJson() => jsonEncode(toMap());

  factory PosterTemplateProject.fromJson(String source) =>
      PosterTemplateProject.fromMap(jsonDecode(source) as Map<String, dynamic>);

  /// Creates a dynamic design project from any festival, panchayat, or admin poster template.
  /// Keeps the canvas clean with the template's background artwork and default VIP frame,
  /// without forcing template names or unwanted image overlays on the poster.
  static PosterTemplateProject createProjectFromTemplate({
    required String templateId,
    required String imageAsset,
    required String title,
    String? category,
    String? frameId = 'gold_vip',
    String? frameImageUrl,
  }) {
    return PosterTemplateProject(
      id: 'proj_${DateTime.now().millisecondsSinceEpoch}',
      templateId: templateId,
      title: title,
      backgroundAsset: imageAsset,
      backgroundColor: const Color(0xFF1E293B),
      category: category ?? 'General',
      frameId: frameId,
      frameImageUrl: frameImageUrl,
      updatedAt: DateTime.now(),
      elements: const [], // Clean canvas! No unwanted title text or stickers!
    );
  }

  /// Creates default project for Screen 12 matching the reference image.
  static PosterTemplateProject createDefaultNavratriProject({
    String? templateId,
    String? imageAsset,
    String? title,
    String? frameId = 'gold_vip',
    String? frameImageUrl,
  }) {
    return PosterTemplateProject(
      id: 'proj_${DateTime.now().millisecondsSinceEpoch}',
      templateId: templateId ?? 'navratri_shubh',
      title: title ?? 'Navratri Celebration',
      backgroundAsset: imageAsset ?? AppAssets.festivalPosterShubhNavratri,
      backgroundColor: const Color(0xFF2E0854),
      frameId: frameId,
      frameImageUrl: frameImageUrl,
      updatedAt: DateTime.now(),
      elements: const [
        PosterElement(
          id: 'elem_headline',
          type: PosterElementType.text,
          text: 'શુભ નવરાત્રી',
          x: 0.5,
          y: 0.20,
          fontSize: 28.0,
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
          y: 0.32,
          fontSize: 13.0,
          color: Colors.white,
          fontFamily: 'Poppins',
          textAlign: TextAlign.center,
          isBold: false,
        ),
      ],
    );
  }
}
