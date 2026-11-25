import 'dart:io';
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
      return const [];
    }

    try {
      final list = jsonList
          .map((s) => DownloadHistoryRecord.fromJson(s))
          .toList();
      // Ensure sorted by exportedAt descending
      list.sort((a, b) => b.exportedAt.compareTo(a.exportedAt));
      return list;
    } catch (_) {
      return const [];
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

}
