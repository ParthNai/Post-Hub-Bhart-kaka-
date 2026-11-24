import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:panchayat_post/features/editor/domain/models/poster_template_project.dart';

/// Single persistent download/export history record.
class DownloadHistoryRecord {
  final String id;
  final String posterId;
  final String title;
  final String filePath;
  final String format; // 'PNG', 'JPG', 'PDF'
  final int width;
  final int height;
  final int fileSizeBytes;
  final DateTime exportedAt;
  final String? thumbnailAsset;
  final String? category;

  const DownloadHistoryRecord({
    required this.id,
    required this.posterId,
    required this.title,
    required this.filePath,
    required this.format,
    required this.width,
    required this.height,
    required this.fileSizeBytes,
    required this.exportedAt,
    this.thumbnailAsset,
    this.category,
  });

  String get formattedFileSize {
    if (fileSizeBytes >= 1024 * 1024) {
      return '${(fileSizeBytes / (1024 * 1024)).toStringAsFixed(1)} MB';
    } else {
      return '${(fileSizeBytes / 1024).toStringAsFixed(1)} KB';
    }
  }

  String get dimensionsText => '$width × $height px';

  String get formattedDate {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    final month = months[exportedAt.month - 1];
    final day = exportedAt.day.toString().padLeft(2, '0');
    final year = exportedAt.year;
    final rawHour = exportedAt.hour;
    final hour = rawHour % 12 == 0 ? 12 : rawHour % 12;
    final minute = exportedAt.minute.toString().padLeft(2, '0');
    final period = rawHour >= 12 ? 'PM' : 'AM';
    final hourStr = hour.toString().padLeft(2, '0');
    return '$month $day, $year • $hourStr:$minute $period';
  }

  DownloadHistoryRecord copyWith({
    String? id,
    String? posterId,
    String? title,
    String? filePath,
    String? format,
    int? width,
    int? height,
    int? fileSizeBytes,
    DateTime? exportedAt,
    String? thumbnailAsset,
    String? category,
  }) {
    return DownloadHistoryRecord(
      id: id ?? this.id,
      posterId: posterId ?? this.posterId,
      title: title ?? this.title,
      filePath: filePath ?? this.filePath,
      format: format ?? this.format,
      width: width ?? this.width,
      height: height ?? this.height,
      fileSizeBytes: fileSizeBytes ?? this.fileSizeBytes,
      exportedAt: exportedAt ?? this.exportedAt,
      thumbnailAsset: thumbnailAsset ?? this.thumbnailAsset,
      category: category ?? this.category,
    );
  }

  Map<String, dynamic> toMap() => {
    'id': id,
    'posterId': posterId,
    'title': title,
    'filePath': filePath,
    'format': format,
    'width': width,
    'height': height,
    'fileSizeBytes': fileSizeBytes,
    'exportedAt': exportedAt.toIso8601String(),
    'thumbnailAsset': thumbnailAsset,
    'category': category,
  };

  factory DownloadHistoryRecord.fromMap(Map<String, dynamic> map) => DownloadHistoryRecord(
    id: map['id'] as String,
    posterId: map['posterId'] as String? ?? 'poster_01',
    title: map['title'] as String? ?? 'Poster',
    filePath: map['filePath'] as String? ?? '',
    format: map['format'] as String? ?? 'JPG',
    width: map['width'] as int? ?? 1080,
    height: map['height'] as int? ?? 1080,
    fileSizeBytes: map['fileSizeBytes'] as int? ?? 1024 * 1024,
    exportedAt: DateTime.tryParse(map['exportedAt'] as String? ?? '') ?? DateTime.now(),
    thumbnailAsset: map['thumbnailAsset'] as String?,
    category: map['category'] as String?,
  );

  String toJson() => json.encode(toMap());

  factory DownloadHistoryRecord.fromJson(String source) =>
      DownloadHistoryRecord.fromMap(json.decode(source) as Map<String, dynamic>);
}

/// Package containing the result of an export operation to display in Screen 21.
class ExportResult {
  final DownloadHistoryRecord record;
  final PosterTemplateProject? originalProject;
  final Uint8List? fileBytes;

  const ExportResult({
    required this.record,
    this.originalProject,
    this.fileBytes,
  });
}
