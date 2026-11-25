import 'dart:io';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:panchayat_post/core/constants/app_assets.dart';
import 'package:panchayat_post/core/localization/app_localizations.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';
import 'package:panchayat_post/features/editor/data/services/download_history_service.dart';
import 'package:panchayat_post/features/editor/data/services/poster_export_service.dart';
import 'package:panchayat_post/features/editor/domain/models/download_history_record.dart';
import 'package:panchayat_post/features/editor/domain/models/poster_template_project.dart';

/// Screen 21: Export Success & Download History
/// Exact pixel-accurate implementation matching reference image media_1795516029979_5b02177c.jpg
class ExportSuccessHistoryScreen extends StatefulWidget {
  final ExportResult? initialExportResult;
  final DownloadHistoryService? historyService;
  final PosterExportService? exportService;

  const ExportSuccessHistoryScreen({
    super.key,
    this.initialExportResult,
    this.historyService,
    this.exportService,
  });

  @override
  State<ExportSuccessHistoryScreen> createState() =>
      _ExportSuccessHistoryScreenState();
}

class _ExportSuccessHistoryScreenState extends State<ExportSuccessHistoryScreen> {
  // Theme & layout constants from Screen 21 reference
  static const Color _kBg = Color(0xFFF9FAFC);
  static const Color _kCardBg = Colors.white;
  static const Color _kBorderColor = Color(0xFFE5E7EB);
  static const Color _kPurplePrimary = Color(0xFF6C5CE7);
  static const Color _kPurpleDark = Color(0xFF5842BD);
  static const Color _kPurpleTint = Color(0xFFF3E8FF);
  static const Color _kPurpleBorder = Color(0xFFE9D5FF);
  static const Color _kNavyText = Color(0xFF1A1D2E);
  static const Color _kMutedText = Color(0xFF6B7280);
  static const Color _kSlateText = Color(0xFF374151);

  late final DownloadHistoryService _historyService;
  late final PosterExportService _exportService;

  ExportResult? _currentExport;
  List<DownloadHistoryRecord> _historyRecords = [];
  bool _isLoading = true;
  String _selectedFilter = 'All'; // 'All', 'JPG', 'PNG', 'PDF'
  int _selectedNavIndex = 4; // 'Profile' / 'My Designs' active in bottom nav

  @override
  void initState() {
    super.initState();
    _historyService = widget.historyService ?? DownloadHistoryService();
    _exportService = widget.exportService ?? PosterExportService();
    _currentExport = widget.initialExportResult;
    _loadHistory();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final args = ModalRoute.of(context)?.settings.arguments;
    if (args is ExportResult && _currentExport == null) {
      _currentExport = args;
      _loadHistory();
    }
  }

  Future<void> _loadHistory() async {
    setState(() => _isLoading = true);
    final records = await _historyService.getHistory();
    if (!mounted) return;

    // If no explicit current export was passed, use the latest record or default Navratri record
    if (_currentExport == null && records.isNotEmpty) {
      final latest = records.first;
      _currentExport = ExportResult(
        record: latest,
        originalProject: PosterTemplateProject.createDefaultRepublicDayProject(
          title: latest.title,
        ),
      );
    }

    setState(() {
      _historyRecords = records;
      _isLoading = false;
    });
  }

  List<DownloadHistoryRecord> get _filteredRecords {
    if (_selectedFilter == 'All') {
      return _historyRecords;
    }
    return _historyRecords
        .where((r) => r.format.toUpperCase() == _selectedFilter.toUpperCase())
        .toList();
  }

  void _showViewPosterDialog(DownloadHistoryRecord record, {Uint8List? rawBytes}) {
    showDialog<void>(
      context: context,
      builder: (ctx) => Dialog(
        backgroundColor: Colors.transparent,
        insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 36),
        child: Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            boxShadow: const [
              BoxShadow(
                color: Colors.black26,
                blurRadius: 20,
                offset: Offset(0, 8),
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 12, 12, 8),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        record.title,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: _kNavyText,
                        ),
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close_rounded, color: _kNavyText),
                      onPressed: () => Navigator.of(ctx).pop(),
                    ),
                  ],
                ),
              ),
              const Divider(height: 1, color: _kBorderColor),
              Padding(
                padding: const EdgeInsets.all(12),
                child: AspectRatio(
                  aspectRatio: record.width / record.height,
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(10),
                    child: _buildPosterImageWidget(record, rawBytes: rawBytes),
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 12),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '${record.format} • ${record.dimensionsText}',
                      style: const TextStyle(
                        fontSize: 12,
                        color: _kMutedText,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    Text(
                      record.formattedFileSize,
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: _kNavyText,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPosterImageWidget(DownloadHistoryRecord record, {Uint8List? rawBytes}) {
    if (rawBytes != null && rawBytes.isNotEmpty) {
      return Image.memory(
        rawBytes,
        fit: BoxFit.cover,
        errorBuilder: (c, o, s) => _buildFallbackThumbnail(),
      );
    }

    if (record.filePath.isNotEmpty) {
      final file = File(record.filePath);
      if (file.existsSync()) {
        return Image.file(file, fit: BoxFit.cover);
      }
    }

    if (record.thumbnailAsset != null && record.thumbnailAsset!.isNotEmpty) {
      return Image.asset(
        record.thumbnailAsset!,
        fit: BoxFit.cover,
        errorBuilder: (c, o, s) => _buildFallbackThumbnail(),
      );
    }

    return _buildFallbackThumbnail();
  }

  Widget _buildFallbackThumbnail() {
    return Container(
      color: Colors.purple.shade50,
      alignment: Alignment.center,
      child: const Icon(Icons.image_outlined, size: 36, color: _kPurplePrimary),
    );
  }

  Future<void> _sharePoster(DownloadHistoryRecord record, {Uint8List? rawBytes}) async {
    try {
      File file;
      if (record.filePath.isNotEmpty && File(record.filePath).existsSync()) {
        file = File(record.filePath);
      } else {
        final bytes = rawBytes ??
            Uint8List.fromList([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
        file = await _exportService.savePosterToFile(
          bytes: bytes,
          filename: '${record.id}_share',
          format: record.format.toLowerCase(),
        );
      }
      await _exportService.sharePosterFile(
        file: file,
        text: 'Check out my ${record.title} created on Panchayat Post!',
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Sharing failed: $e'),
          backgroundColor: Colors.red.shade700,
        ),
      );
    }
  }

  void _exportAgain(DownloadHistoryRecord record) {
    final project = _currentExport?.originalProject ??
        PosterTemplateProject.createDefaultRepublicDayProject(
          title: record.title,
        );

    Navigator.of(context).pushNamed(
      AppRoutes.exportPoster,
      arguments: project,
    );
  }

  void _confirmDeleteRecord(DownloadHistoryRecord record) {
    final s = LocaleScope.of(context).strings;

    showDialog<void>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Text(
          s.deleteDownloadTitle,
          style: const TextStyle(fontWeight: FontWeight.bold, color: _kNavyText),
        ),
        content: Text(
          s.deleteDownloadConfirm,
          style: const TextStyle(color: _kSlateText, fontSize: 14),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: Text(s.cancelButton, style: const TextStyle(color: _kMutedText)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFEF4444),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              elevation: 0,
            ),
            onPressed: () async {
              Navigator.of(ctx).pop();
              await _historyService.deleteRecord(record.id);
              await _loadHistory();
              if (mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Download removed from history.')),
                );
              }
            },
            child: Text(s.deleteButton),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final s = LocaleScope.of(context).strings;

    return Scaffold(
      backgroundColor: _kBg,
      body: SafeArea(
        child: Column(
          children: [
            _buildHeader(s),
            Expanded(
              child: _isLoading
                  ? const Center(
                      child: CircularProgressIndicator(
                        valueColor: AlwaysStoppedAnimation<Color>(_kPurplePrimary),
                      ),
                    )
                  : RefreshIndicator(
                      onRefresh: _loadHistory,
                      color: _kPurplePrimary,
                      child: SingleChildScrollView(
                        physics: const AlwaysScrollableScrollPhysics(
                          parent: BouncingScrollPhysics(),
                        ),
                        padding: const EdgeInsets.fromLTRB(16, 4, 16, 24),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            if (_currentExport != null) ...[
                              _buildSuccessBanner(s),
                              const SizedBox(height: 16),
                              _buildFeaturedExportCard(s, _currentExport!),
                              const SizedBox(height: 24),
                            ],
                            _buildRecentDownloadsHeader(s),
                            const SizedBox(height: 12),
                            if (_filteredRecords.isEmpty)
                              _buildEmptyStateCard(s)
                            else ...[
                              ..._filteredRecords.map((record) => _buildHistoryItem(s, record)),
                              const SizedBox(height: 16),
                              // Showcase empty / create poster banner from reference
                              _buildEmptyStateCard(s),
                            ],
                          ],
                        ),
                      ),
                    ),
            ),
            _buildBottomNav(),
          ],
        ),
      ),
    );
  }

  // --- 1. Header Bar ---
  Widget _buildHeader(AppStrings s) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          InkWell(
            key: const Key('btn_downloads_back'),
            onTap: () => Navigator.of(context).pop(),
            borderRadius: BorderRadius.circular(12),
            child: Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: _kBorderColor, width: 1),
                boxShadow: const [
                  BoxShadow(
                    color: Color(0x0A000000),
                    blurRadius: 4,
                    offset: Offset(0, 2),
                  ),
                ],
              ),
              child: const Icon(
                Icons.arrow_back_ios_new_rounded,
                size: 18,
                color: _kNavyText,
              ),
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  s.myDownloadsTitle,
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: _kNavyText,
                    letterSpacing: -0.2,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  s.myDownloadsSubtitle,
                  style: const TextStyle(
                    fontSize: 13,
                    color: _kMutedText,
                  ),
                ),
              ],
            ),
          ),
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: _kBorderColor, width: 1),
              boxShadow: const [
                BoxShadow(
                  color: Color(0x0A000000),
                  blurRadius: 4,
                  offset: Offset(0, 2),
                ),
              ],
            ),
            child: const Icon(
              Icons.history_rounded,
              size: 22,
              color: _kPurplePrimary,
            ),
          ),
        ],
      ),
    );
  }

  // --- 2. Success Confirmation Banner ---
  Widget _buildSuccessBanner(AppStrings s) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: const Color(0xFFF5F3FF),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: _kPurpleBorder, width: 1),
      ),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: const BoxDecoration(
              color: _kPurplePrimary,
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.check_rounded,
              size: 26,
              color: Colors.white,
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  s.posterExportedSuccessfully,
                  style: const TextStyle(
                    fontSize: 15.5,
                    fontWeight: FontWeight.bold,
                    color: _kNavyText,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  s.posterReadyToUse,
                  style: const TextStyle(
                    fontSize: 12.5,
                    color: _kMutedText,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // --- 3. Featured Exported Poster Card ---
  Widget _buildFeaturedExportCard(AppStrings s, ExportResult exportResult) {
    final record = exportResult.record;

    return Container(
      decoration: BoxDecoration(
        color: _kCardBg,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: _kBorderColor),
        boxShadow: const [
          BoxShadow(
            color: Color(0x06000000),
            blurRadius: 10,
            offset: Offset(0, 3),
          ),
        ],
      ),
      padding: const EdgeInsets.all(14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              // Poster Thumbnail
              Container(
                width: 96,
                height: 96,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: _kBorderColor),
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(13),
                  child: _buildPosterImageWidget(
                    record,
                    rawBytes: exportResult.fileBytes,
                  ),
                ),
              ),
              const SizedBox(width: 14),
              // Details Column
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      record.title,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: _kNavyText,
                        height: 1.25,
                      ),
                    ),
                    const SizedBox(height: 6),
                    // Format Pill Badge
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: _kPurpleTint,
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(
                            Icons.image_outlined,
                            size: 13,
                            color: _kPurplePrimary,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            record.format.toUpperCase(),
                            style: const TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                              color: _kPurplePrimary,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 6),
                    // Dimensions Row
                    Row(
                      children: [
                        const Icon(
                          Icons.aspect_ratio_rounded,
                          size: 14,
                          color: _kSlateText,
                        ),
                        const SizedBox(width: 6),
                        Expanded(
                          child: Text(
                            record.dimensionsText,
                            style: const TextStyle(
                              fontSize: 12.5,
                              fontWeight: FontWeight.w500,
                              color: _kSlateText,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    // Date & Time Row
                    Row(
                      children: [
                        const Icon(
                          Icons.calendar_today_outlined,
                          size: 13,
                          color: _kSlateText,
                        ),
                        const SizedBox(width: 6),
                        Expanded(
                          child: Text(
                            record.formattedDate,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              fontSize: 12,
                              color: _kSlateText,
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    // File Size Row
                    Row(
                      children: [
                        const Icon(
                          Icons.storage_rounded,
                          size: 13,
                          color: _kSlateText,
                        ),
                        const SizedBox(width: 6),
                        Expanded(
                          child: Text(
                            record.formattedFileSize,
                            style: const TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              color: _kSlateText,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          // 3 Action Buttons Row
          Row(
            children: [
              // Button 1: View Poster
              Expanded(
                child: SizedBox(
                  height: 42,
                  child: OutlinedButton.icon(
                    key: const Key('btn_view_poster'),
                    style: OutlinedButton.styleFrom(
                      backgroundColor: _kPurpleTint,
                      foregroundColor: _kPurpleDark,
                      side: BorderSide.none,
                      padding: const EdgeInsets.symmetric(horizontal: 4),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    icon: const Icon(Icons.visibility_outlined, size: 16),
                    label: FittedBox(
                      fit: BoxFit.scaleDown,
                      child: Text(
                        s.viewPosterButton,
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    onPressed: () => _showViewPosterDialog(
                      record,
                      rawBytes: exportResult.fileBytes,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              // Button 2: Share Poster
              Expanded(
                child: SizedBox(
                  height: 42,
                  child: OutlinedButton.icon(
                    key: const Key('btn_share_poster'),
                    style: OutlinedButton.styleFrom(
                      backgroundColor: _kPurpleTint,
                      foregroundColor: _kPurpleDark,
                      side: BorderSide.none,
                      padding: const EdgeInsets.symmetric(horizontal: 4),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    icon: const Icon(Icons.share_outlined, size: 16),
                    label: FittedBox(
                      fit: BoxFit.scaleDown,
                      child: Text(
                        s.sharePosterButton,
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    onPressed: () => _sharePoster(
                      record,
                      rawBytes: exportResult.fileBytes,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              // Button 3: Export Again
              Expanded(
                child: SizedBox(
                  height: 42,
                  child: ElevatedButton.icon(
                    key: const Key('btn_export_again'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _kPurplePrimary,
                      foregroundColor: Colors.white,
                      elevation: 0,
                      padding: const EdgeInsets.symmetric(horizontal: 4),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    icon: const Icon(Icons.refresh_rounded, size: 16),
                    label: FittedBox(
                      fit: BoxFit.scaleDown,
                      child: Text(
                        s.exportAgainButton,
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    onPressed: () => _exportAgain(record),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // --- 4. Recent Downloads Section Header & Filter ---
  Widget _buildRecentDownloadsHeader(AppStrings s) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Expanded(
          child: Row(
            children: [
              Container(
                width: 3.5,
                height: 18,
                decoration: BoxDecoration(
                  color: _kPurplePrimary,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  s.recentDownloadsTitle,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.bold,
                    color: _kNavyText,
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(width: 8),
        // Filter Dropdown Pill
        PopupMenuButton<String>(
          key: const Key('btn_filter_dropdown'),
          initialValue: _selectedFilter,
          onSelected: (val) => setState(() => _selectedFilter = val),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          itemBuilder: (ctx) => [
            const PopupMenuItem(value: 'All', child: Text('All')),
            const PopupMenuItem(value: 'JPG', child: Text('JPG')),
            const PopupMenuItem(value: 'PNG', child: Text('PNG')),
            const PopupMenuItem(value: 'PDF', child: Text('PDF')),
          ],
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: _kBorderColor),
              boxShadow: const [
                BoxShadow(
                  color: Color(0x04000000),
                  blurRadius: 4,
                  offset: Offset(0, 1),
                ),
              ],
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(
                  Icons.filter_list_rounded,
                  size: 16,
                  color: _kPurplePrimary,
                ),
                const SizedBox(width: 6),
                Text(
                  _selectedFilter,
                  style: const TextStyle(
                    fontSize: 12.5,
                    fontWeight: FontWeight.w600,
                    color: _kNavyText,
                  ),
                ),
                const SizedBox(width: 4),
                const Icon(
                  Icons.keyboard_arrow_down_rounded,
                  size: 16,
                  color: _kNavyText,
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  // --- 5. History List Item Card ---
  Widget _buildHistoryItem(AppStrings s, DownloadHistoryRecord record) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: _kCardBg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: _kBorderColor),
        boxShadow: const [
          BoxShadow(
            color: Color(0x04000000),
            blurRadius: 6,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          // Thumbnail
          Container(
            width: 58,
            height: 58,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: _kBorderColor),
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(9),
              child: _buildPosterImageWidget(record),
            ),
          ),
          const SizedBox(width: 12),
          // Info Column
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  record.title,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 14.5,
                    fontWeight: FontWeight.bold,
                    color: _kNavyText,
                  ),
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(
                      Icons.image_outlined,
                      size: 13,
                      color: _kSlateText,
                    ),
                    const SizedBox(width: 4),
                    Expanded(
                      child: Text(
                        '${record.format} • ${record.dimensionsText}',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 12,
                          color: _kSlateText,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 3),
                Row(
                  children: [
                    const Icon(
                      Icons.calendar_today_outlined,
                      size: 12,
                      color: _kMutedText,
                    ),
                    const SizedBox(width: 4),
                    Expanded(
                      child: Text(
                        '${record.formattedDate} • ${record.formattedFileSize}',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 11,
                          color: _kMutedText,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          // Trailing Options Menu Button
          PopupMenuButton<String>(
            key: Key('menu_${record.id}'),
            icon: const Icon(Icons.more_vert_rounded, color: _kNavyText, size: 20),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            onSelected: (action) {
              switch (action) {
                case 'view':
                  _showViewPosterDialog(record);
                  break;
                case 'share':
                  _sharePoster(record);
                  break;
                case 'export_again':
                  _exportAgain(record);
                  break;
                case 'delete':
                  _confirmDeleteRecord(record);
                  break;
              }
            },
            itemBuilder: (ctx) => [
              PopupMenuItem(
                value: 'view',
                child: Row(
                  children: [
                    const Icon(Icons.visibility_outlined, size: 18, color: _kPurpleDark),
                    const SizedBox(width: 10),
                    Text(s.viewPosterButton, style: const TextStyle(fontSize: 13)),
                  ],
                ),
              ),
              PopupMenuItem(
                value: 'share',
                child: Row(
                  children: [
                    const Icon(Icons.share_outlined, size: 18, color: _kPurpleDark),
                    const SizedBox(width: 10),
                    Text(s.sharePosterButton, style: const TextStyle(fontSize: 13)),
                  ],
                ),
              ),
              PopupMenuItem(
                value: 'export_again',
                child: Row(
                  children: [
                    const Icon(Icons.refresh_rounded, size: 18, color: _kPurpleDark),
                    const SizedBox(width: 10),
                    Text(s.exportAgainButton, style: const TextStyle(fontSize: 13)),
                  ],
                ),
              ),
              const PopupMenuDivider(),
              PopupMenuItem(
                value: 'delete',
                child: Row(
                  children: [
                    const Icon(Icons.delete_outline_rounded, size: 18, color: Color(0xFFEF4444)),
                    const SizedBox(width: 10),
                    Text(
                      s.deleteDownloadTitle,
                      style: const TextStyle(fontSize: 13, color: Color(0xFFEF4444), fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // --- 6. Empty State / Create Poster Banner ---
  Widget _buildEmptyStateCard(AppStrings s) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: _kCardBg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: _kBorderColor),
        boxShadow: const [
          BoxShadow(
            color: Color(0x04000000),
            blurRadius: 6,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          // Illustration / Icon Box
          Container(
            width: 72,
            height: 72,
            decoration: BoxDecoration(
              color: _kPurpleTint,
              borderRadius: BorderRadius.circular(14),
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(14),
              child: Image.asset(
                AppAssets.myDesignEmptyBox,
                fit: BoxFit.contain,
                errorBuilder: (c, o, s) => const Icon(
                  Icons.download_done_rounded,
                  size: 36,
                  color: _kPurplePrimary,
                ),
              ),
            ),
          ),
          const SizedBox(width: 14),
          // Content & Button
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  s.noDownloadsYet,
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: _kNavyText,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  s.noDownloadsSubtitle,
                  style: const TextStyle(
                    fontSize: 11.5,
                    color: _kMutedText,
                  ),
                ),
                const SizedBox(height: 10),
                SizedBox(
                  height: 36,
                  child: ElevatedButton.icon(
                    key: const Key('btn_create_poster_empty'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _kPurplePrimary,
                      foregroundColor: Colors.white,
                      elevation: 0,
                      padding: const EdgeInsets.symmetric(horizontal: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                    icon: const Icon(Icons.add, size: 16),
                    label: Text(
                      s.createPosterButton,
                      style: const TextStyle(
                        fontSize: 12.5,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    onPressed: () {
                      Navigator.of(context).pushNamed(AppRoutes.festivals);
                    },
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // --- 7. Bottom Navigation Bar ---
  Widget _buildBottomNav() {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(
          top: BorderSide(color: _kBorderColor, width: 1),
        ),
      ),
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildNavItem(0, Icons.home_outlined, Icons.home_rounded, 'Home', AppRoutes.home),
          _buildNavItem(1, Icons.calendar_today_outlined, Icons.calendar_today_rounded, 'Festivals', AppRoutes.festivals),
          _buildNavItem(2, Icons.layers_outlined, Icons.layers_rounded, 'Templates', AppRoutes.festivals),
          _buildNavItem(3, Icons.photo_library_outlined, Icons.photo_library_rounded, 'My Designs', AppRoutes.myDesigns),
          _buildNavItem(4, Icons.person_outline_rounded, Icons.person_rounded, 'Profile', AppRoutes.profile),
        ],
      ),
    );
  }

  Widget _buildNavItem(int index, IconData outlineIcon, IconData filledIcon, String label, String route) {
    final bool isSelected = _selectedNavIndex == index;
    final color = isSelected ? _kPurplePrimary : _kMutedText;

    return Expanded(
      child: InkWell(
        onTap: () {
          setState(() => _selectedNavIndex = index);
          if (ModalRoute.of(context)?.settings.name != route) {
            Navigator.of(context).pushReplacementNamed(route);
          }
        },
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 2, vertical: 2),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(isSelected ? filledIcon : outlineIcon, color: color, size: 22),
              const SizedBox(height: 2),
              Text(
                label,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  fontSize: 10.5,
                  fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                  color: color,
                ),
              ),
              if (isSelected)
                Container(
                  margin: const EdgeInsets.only(top: 2),
                  width: 18,
                  height: 2,
                  decoration: BoxDecoration(
                    color: _kPurplePrimary,
                    borderRadius: BorderRadius.circular(1),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
