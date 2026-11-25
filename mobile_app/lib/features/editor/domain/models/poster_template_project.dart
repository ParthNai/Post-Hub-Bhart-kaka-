import 'dart:convert';
import 'package:flutter/material.dart';
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
    this.status = 'draft',
    this.fileSizeBytes,
    this.lastExportedPath,
    this.lastExportedAt,
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
  final String status; // 'draft', 'completed', 'exported'
  final int? fileSizeBytes;
  final String? lastExportedPath;
  final DateTime? lastExportedAt;

  bool get isDraft => status.toLowerCase() == 'draft';
  bool get isCompleted => status.toLowerCase() == 'completed';
  bool get isExported => status.toLowerCase() == 'exported';

  String get formattedFileSize {
    if (fileSizeBytes == null || fileSizeBytes! <= 0) return '1.8 MB';
    if (fileSizeBytes! >= 1024 * 1024) {
      return '${(fileSizeBytes! / (1024 * 1024)).toStringAsFixed(1)} MB';
    }
    return '${(fileSizeBytes! / 1024).toStringAsFixed(0)} KB';
  }

  String get formattedDate {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    final m = months[updatedAt.month - 1];
    final d = updatedAt.day;
    final y = updatedAt.year;
    return '$m $d, $y';
  }

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
    String? status,
    int? fileSizeBytes,
    String? lastExportedPath,
    DateTime? lastExportedAt,
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
      status: status ?? this.status,
      fileSizeBytes: fileSizeBytes ?? this.fileSizeBytes,
      lastExportedPath: lastExportedPath ?? this.lastExportedPath,
      lastExportedAt: lastExportedAt ?? this.lastExportedAt,
    );
  }

  /// Creates a distinct copy of this project with a new ID and updated timestamp.
  PosterTemplateProject duplicate({String? newTitle}) {
    final now = DateTime.now();
    return copyWith(
      id: 'proj_${now.millisecondsSinceEpoch}',
      title: newTitle ?? '$title (Copy)',
      status: 'draft',
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
        'status': status,
        'fileSizeBytes': fileSizeBytes,
        'lastExportedPath': lastExportedPath,
        'lastExportedAt': lastExportedAt?.toIso8601String(),
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
      status: map['status'] as String? ?? 'draft',
      fileSizeBytes: map['fileSizeBytes'] as int?,
      lastExportedPath: map['lastExportedPath'] as String?,
      lastExportedAt: map['lastExportedAt'] != null
          ? DateTime.tryParse(map['lastExportedAt'] as String)
          : null,
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
  /// Creates a clean project for Screen 12 using admin-imported media without demo text.
  static PosterTemplateProject createDefaultNavratriProject({
    String? templateId,
    String? imageAsset,
    String? title,
  }) {
    return PosterTemplateProject(
      id: 'proj_${DateTime.now().millisecondsSinceEpoch}',
      templateId: templateId ?? 'custom_poster',
      title: title ?? 'Poster',
      backgroundAsset: imageAsset ?? '',
      backgroundColor: const Color(0xFF1E293B),
      updatedAt: DateTime.now(),
      elements: const [],
    );
  }

  /// Creates a clean project for Screen 17 Quick Customize without demo data.
  static PosterTemplateProject createDefaultQuickCustomizeProject({
    String? templateId,
    String? imageAsset,
    String? title,
  }) {
    return PosterTemplateProject(
      id: 'proj_${DateTime.now().millisecondsSinceEpoch}',
      templateId: templateId ?? 'quick_customize',
      title: title ?? 'Poster',
      backgroundAsset: imageAsset ?? '',
      backgroundColor: const Color(0xFFF8FAFC),
      updatedAt: DateTime.now(),
      elements: const [],
    );
  }

  /// Creates a clean project for Screen 18 Main Poster Editor without demo data.
  static PosterTemplateProject createDefaultRepublicDayProject({
    String? templateId,
    String? imageAsset,
    String? title,
  }) {
    return PosterTemplateProject(
      id: 'proj_${DateTime.now().millisecondsSinceEpoch}',
      templateId: templateId ?? 'main_poster',
      title: title ?? 'Poster',
      backgroundAsset: imageAsset ?? '',
      backgroundColor: const Color(0xFFF8FAFC),
      updatedAt: DateTime.now(),
      elements: const [],
    );
  }
}
