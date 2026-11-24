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
  final String frameId;

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
      frameId: frameId,
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
    );
  }

  String toJson() => jsonEncode(toMap());

  factory PosterTemplateProject.fromJson(String source) =>
      PosterTemplateProject.fromMap(jsonDecode(source) as Map<String, dynamic>);

  /// Creates a clean festival poster project with the chosen artwork and no unwanted text overlays.
  static PosterTemplateProject createProjectFromTemplate({
    required String templateId,
    required String title,
    required String imageAsset,
    String frameId = 'admin_kesariya',
  }) {
    return createFromFestivalTemplate(
      templateId: templateId,
      title: title,
      imageAsset: imageAsset,
      frameId: frameId,
    );
  }

  /// Creates a clean festival poster project with the chosen artwork and no unwanted text overlays.
  static PosterTemplateProject createFromFestivalTemplate({
    required String templateId,
    required String title,
    required String imageAsset,
    String frameId = 'admin_kesariya',
  }) {
    return PosterTemplateProject(
      id: 'proj_${DateTime.now().millisecondsSinceEpoch}',
      templateId: templateId,
      title: title,
      backgroundAsset: imageAsset,
      backgroundColor: const Color(0xFF1E293B),
      frameId: frameId,
      updatedAt: DateTime.now(),
      elements: const [],
    );
  }

  /// Creates default project for Screen 12 matching the reference image exactly.
  static PosterTemplateProject createDefaultNavratriProject({
    String? templateId,
    String? imageAsset,
    String? title,
    String? frameId,
  }) {
    return PosterTemplateProject(
      id: 'proj_${DateTime.now().millisecondsSinceEpoch}',
      templateId: templateId ?? 'navratri_shubh',
      title: title ?? 'Navratri Celebration',
      backgroundAsset: imageAsset ?? AppAssets.festivalPosterShubhNavratri,
      backgroundColor: const Color(0xFF2E0854),
      frameId: frameId ?? 'admin_kesariya',
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

  /// Creates default project for Screen 17 Quick Customize matching the reference image exactly.
  static PosterTemplateProject createDefaultQuickCustomizeProject({
    String? templateId,
    String? imageAsset,
    String? title,
  }) {
    return PosterTemplateProject(
      id: 'proj_${DateTime.now().millisecondsSinceEpoch}',
      templateId: templateId ?? 'quick_customize_navratri',
      title: title ?? 'Navratri Celebration',
      backgroundAsset: imageAsset ?? AppAssets.quickCustomizeNavratri,
      backgroundColor: const Color(0xFFFDF7EE),
      updatedAt: DateTime.now(),
      elements: const [
        PosterElement(
          id: 'elem_main_heading',
          type: PosterElementType.text,
          text: 'Happy Navratri',
          x: 0.76,
          y: 0.16,
          fontSize: 28.0,
          color: Color(0xFF6B1D2F),
          fontFamily: 'Poppins',
          textAlign: TextAlign.center,
          isBold: true,
          isSelected: true,
        ),
        PosterElement(
          id: 'elem_subheading',
          type: PosterElementType.text,
          text: 'May Maa Amba remove all the negativity and fill our lives with happiness.',
          x: 0.76,
          y: 0.32,
          fontSize: 11.5,
          color: Color(0xFF4A3E3D),
          fontFamily: 'Poppins',
          textAlign: TextAlign.center,
          isBold: false,
        ),
        PosterElement(
          id: 'elem_user_name',
          type: PosterElementType.text,
          text: 'Rajan Patel',
          x: 0.82,
          y: 0.88,
          fontSize: 12.0,
          color: Color(0xFF252238),
          fontFamily: 'Poppins',
          textAlign: TextAlign.right,
          isBold: true,
        ),
        PosterElement(
          id: 'elem_business_details',
          type: PosterElementType.text,
          text: 'Panchayat Post • +91 98765 43210',
          x: 0.50,
          y: 0.94,
          fontSize: 10.0,
          color: Color(0xFF475569),
          fontFamily: 'Poppins',
          textAlign: TextAlign.center,
          isBold: false,
        ),
      ],
    );
  }

  /// Creates default project for Screen 18 Main Poster Editor matching reference image exactly.
  static PosterTemplateProject createDefaultRepublicDayProject({
    String? templateId,
    String? imageAsset,
    String? title,
  }) {
    return PosterTemplateProject(
      id: 'proj_${DateTime.now().millisecondsSinceEpoch}',
      templateId: templateId ?? 'republic_day_main',
      title: title ?? 'Republic Day Celebration',
      backgroundAsset: imageAsset ?? AppAssets.editorCanvasRepublicDay,
      backgroundColor: const Color(0xFFF8FAFC),
      updatedAt: DateTime.now(),
      elements: const [
        PosterElement(
          id: 'elem_headline',
          type: PosterElementType.text,
          text: 'Happy\nRepublic Day',
          x: 0.50,
          y: 0.24,
          fontSize: 32.0,
          color: Color(0xFF0F172A),
          secondaryText: 'Day',
          secondaryColor: Color(0xFFEA580C),
          fontFamily: 'Poppins',
          textAlign: TextAlign.center,
          isBold: true,
          isSelected: true,
        ),
        PosterElement(
          id: 'elem_subheading',
          type: PosterElementType.text,
          text: "Let's celebrate the spirit\nof freedom and unity.",
          x: 0.50,
          y: 0.35,
          fontSize: 13.0,
          color: Color(0xFF1E293B),
          fontFamily: 'Poppins',
          textAlign: TextAlign.center,
          isBold: false,
          isItalic: true,
        ),
        PosterElement(
          id: 'elem_org_title',
          type: PosterElementType.text,
          text: 'Panchayat Post\nConnect • Share • Grow',
          x: 0.50,
          y: 0.12,
          fontSize: 15.0,
          color: Color(0xFF1E293B),
          fontFamily: 'Poppins',
          textAlign: TextAlign.center,
          isBold: true,
        ),
        PosterElement(
          id: 'elem_author',
          type: PosterElementType.text,
          text: 'By: Mayank Prajapati',
          x: 0.26,
          y: 0.86,
          fontSize: 11.0,
          color: Colors.white,
          fontFamily: 'Poppins',
          textAlign: TextAlign.left,
          isBold: true,
        ),
        PosterElement(
          id: 'elem_contact',
          type: PosterElementType.text,
          text: '+91 96248 18530  |  info@myyunora.com',
          x: 0.50,
          y: 0.94,
          fontSize: 10.5,
          color: Colors.white,
          fontFamily: 'Poppins',
          textAlign: TextAlign.center,
          isBold: false,
        ),
      ],
    );
  }
}
