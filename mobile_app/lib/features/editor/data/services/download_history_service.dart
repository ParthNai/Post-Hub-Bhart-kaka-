import 'dart:io';
import 'package:panchayat_post/core/constants/app_assets.dart';
import 'package:panchayat_post/features/editor/domain/models/download_history_record.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Local persistent storage service for Download and Export History.
class DownloadHistoryService {
  static const String _key = 'panchayat_post_download_history';

  final SharedPreferences? prefsInstance;

  DownloadHistoryService({this.prefsInstance});

  Future<SharedPreferences> _getPrefs() async {
    return prefsInstance ?? await SharedPreferences.getInstance();
  }

  /// Retrieves history records in reverse chronological order.
  Future<List<DownloadHistoryRecord>> getHistory({String? userId}) async {
    final prefs = await _getPrefs();
    final userKey = userId != null ? '${_key}_$userId' : _key;
    final jsonList = prefs.getStringList(userKey);

    if (jsonList == null || jsonList.isEmpty) {
      final initial = _getDefaultInitialRecords();
      await saveAll(initial, userId: userId);
      return initial;
    }

    try {
      final list = jsonList
          .map((s) => DownloadHistoryRecord.fromJson(s))
          .toList();
      // Ensure sorted by exportedAt descending
      list.sort((a, b) => b.exportedAt.compareTo(a.exportedAt));
      return list;
    } catch (_) {
      return _getDefaultInitialRecords();
    }
  }

  /// Saves a newly exported record at the top of history.
  Future<void> addRecord(DownloadHistoryRecord record, {String? userId}) async {
    final current = await getHistory(userId: userId);
    // Remove duplicate ID if re-exporting same ID
    current.removeWhere((r) => r.id == record.id);
    current.insert(0, record);
    await saveAll(current, userId: userId);
  }

  /// Deletes a download history record by ID and optionally its physical file.
  Future<bool> deleteRecord(String id, {String? userId, bool deleteFile = true}) async {
    final current = await getHistory(userId: userId);
    final index = current.indexWhere((r) => r.id == id);
    if (index == -1) return false;

    final record = current.removeAt(index);
    if (deleteFile && record.filePath.isNotEmpty) {
      try {
        final file = File(record.filePath);
        if (file.existsSync()) {
          file.deleteSync();
        }
      } catch (_) {
        // Safe fail-through
      }
    }

    await saveAll(current, userId: userId);
    return true;
  }

  /// Persists full list of records.
  Future<void> saveAll(List<DownloadHistoryRecord> records, {String? userId}) async {
    final prefs = await _getPrefs();
    final userKey = userId != null ? '${_key}_$userId' : _key;
    final jsonList = records.map((r) => r.toJson()).toList();
    await prefs.setStringList(userKey, jsonList);
  }

  /// Clears history completely (for empty state testing or user account reset).
  Future<void> clearHistory({String? userId}) async {
    final prefs = await _getPrefs();
    final userKey = userId != null ? '${_key}_$userId' : _key;
    await prefs.setStringList(userKey, []);
  }

  /// Default baseline downloads matching the Screen 21 reference image.
  static List<DownloadHistoryRecord> _getDefaultInitialRecords() {
    return [
      DownloadHistoryRecord(
        id: 'dl_diwali_2025',
        posterId: 'template_diwali_01',
        title: 'Diwali Wishes Poster',
        filePath: '',
        format: 'JPG',
        width: 1080,
        height: 1080,
        fileSizeBytes: (1.8 * 1024 * 1024).toInt(),
        exportedAt: DateTime(2025, 10, 8, 16, 15),
        thumbnailAsset: AppAssets.myDesignHappyDiwali,
        category: 'Festivals',
      ),
      DownloadHistoryRecord(
        id: 'dl_independence_2025',
        posterId: 'template_republic_01',
        title: 'Independence Day Poster',
        filePath: '',
        format: 'JPG',
        width: 1080,
        height: 1080,
        fileSizeBytes: (2.1 * 1024 * 1024).toInt(),
        exportedAt: DateTime(2025, 8, 15, 9, 20),
        thumbnailAsset: AppAssets.editorCanvasRepublicDay,
        category: 'National',
      ),
      DownloadHistoryRecord(
        id: 'dl_ganesh_2025',
        posterId: 'template_ganesh_01',
        title: 'Ganesh Chaturthi Wishes',
        filePath: '',
        format: 'JPG',
        width: 1080,
        height: 1080,
        fileSizeBytes: (1.9 * 1024 * 1024).toInt(),
        exportedAt: DateTime(2025, 8, 27, 11, 45),
        thumbnailAsset: AppAssets.festivalAllGanesh,
        category: 'Festivals',
      ),
    ];
  }
}
