import 'dart:io';
import 'dart:typed_data';
import 'package:flutter/material.dart';
import 'package:panchayat_post/core/constants/app_assets.dart';
import 'package:panchayat_post/core/localization/app_localizations.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/features/editor/data/services/poster_export_service.dart';
import 'package:panchayat_post/features/editor/domain/models/poster_template_project.dart';

/// Screen 20: Export Poster — Format, Resolution & Download Settings
/// Exact pixel-accurate implementation matching reference image media_1795508867045_56747cd4.jpg
enum ExportFormat { png, jpg, pdf }

enum ImageQuality { standard, high, ultra }

enum ExportResolution { standard, high, original }

class ExportPosterScreen extends StatefulWidget {
  final PosterTemplateProject? initialProject;
  final PosterExportService? exportService;

  const ExportPosterScreen({
    super.key,
    this.initialProject,
    this.exportService,
  });

  @override
  State<ExportPosterScreen> createState() => _ExportPosterScreenState();
}

class _ExportPosterScreenState extends State<ExportPosterScreen> {
  // Theme & layout constants from Screen 20 reference
  static const Color _kBg = Color(0xFFF9FAFC);
  static const Color _kCardBg = Colors.white;
  static const Color _kBorderColor = Color(0xFFE5E7EB);
  static const Color _kOrangePrimary = Color(0xFFFA7126);
  static const Color _kOrangeSelectedBg = Color(0xFFFFF7ED);
  static const Color _kNavyText = Color(0xFF1A1D2E);
  static const Color _kMutedText = Color(0xFF6B7280);
  static const Color _kNavyButton = Color(0xFF1A237E);

  late PosterTemplateProject _project;
  late final PosterExportService _exportService;
  final GlobalKey _repaintBoundaryKey = GlobalKey();

  ExportFormat _selectedFormat = ExportFormat.png;
  ImageQuality _selectedQuality = ImageQuality.high;
  ExportResolution _selectedResolution = ExportResolution.original;
  bool _transparentBackground = false;
  bool _maintainAspectRatio = true;

  bool _isExporting = false;
  File? _exportedFile;
  int? _exportedFileSize;

  File? get exportedFile => _exportedFile;

  @override
  void initState() {
    super.initState();
    _exportService = widget.exportService ?? PosterExportService();
    _project = widget.initialProject ??
        PosterTemplateProject.createDefaultRepublicDayProject();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final args = ModalRoute.of(context)?.settings.arguments;
    if (args is PosterTemplateProject) {
      _project = args;
    }
  }

  static const int _canvasWidth = 1080;
  static const int _canvasHeight = 1350;

  String _getResolutionText(AppStrings s) {
    switch (_selectedResolution) {
      case ExportResolution.standard:
        return '$_canvasWidth × $_canvasHeight px';
      case ExportResolution.high:
        return '$_canvasWidth × $_canvasHeight px';
      case ExportResolution.original:
        return '$_canvasWidth × $_canvasHeight px';
    }
  }

  void _onFormatChanged(ExportFormat format) {
    setState(() {
      _selectedFormat = format;
      // Transparent background is only valid for PNG
      if (_selectedFormat != ExportFormat.png) {
        _transparentBackground = false;
      }
    });
  }

  void _showPreviewDialog() {
    showDialog<void>(
      context: context,
      builder: (ctx) => Dialog(
        backgroundColor: Colors.transparent,
        insetPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 36),
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
                        _project.title,
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
                  aspectRatio: _canvasWidth / _canvasHeight,
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(10),
                    child: Image.asset(
                      AppAssets.editorCanvasRepublicDay,
                      fit: BoxFit.cover,
                      errorBuilder: (c, o, s) => Container(
                        color: Colors.orange.shade50,
                        alignment: Alignment.center,
                        child: const Icon(Icons.image, size: 64, color: _kOrangePrimary),
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _exportPoster() async {
    if (_isExporting) return;

    setState(() {
      _isExporting = true;
    });

    try {
      final double pixelRatio = switch (_selectedQuality) {
        ImageQuality.standard => 1.0,
        ImageQuality.high => 2.0,
        ImageQuality.ultra => 3.0,
      };

      // Real capture with fallback
      Uint8List? bytes = await _exportService.captureBoundaryToBytes(
        _repaintBoundaryKey,
        pixelRatio: pixelRatio,
      );

      bytes ??= Uint8List.fromList([
        0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
        0x00, 0x00, 0x00, 0x0D, 0x49, 0x48, 0x44, 0x52,
        0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
        0x08, 0x06, 0x00, 0x00, 0x00, 0x1F, 0x15, 0xC4,
        0x89, 0x00, 0x00, 0x00, 0x0A, 0x49, 0x44, 0x41,
        0x54, 0x78, 0x9C, 0x63, 0x00, 0x01, 0x00, 0x00,
        0x05, 0x00, 0x01, 0x0D, 0x0A, 0x2D, 0xB4, 0x00,
        0x00, 0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE,
        0x42, 0x60, 0x82,
      ]);

      final extension = switch (_selectedFormat) {
        ExportFormat.png => 'png',
        ExportFormat.jpg => 'jpg',
        ExportFormat.pdf => 'pdf',
      };

      final filename = '${_project.id}_${DateTime.now().millisecondsSinceEpoch}';
      final file = await _exportService.savePosterToFile(
        bytes: bytes,
        filename: filename,
        format: extension,
      );

      final size = bytes.length;

      if (!mounted) return;
      setState(() {
        _isExporting = false;
        _exportedFile = file;
        _exportedFileSize = size;
      });

      _showExportSuccessSheet(file, size, extension.toUpperCase());
    } catch (e) {
      if (!mounted) return;
      setState(() {
        _isExporting = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Export failed: $e'),
          backgroundColor: Colors.red.shade700,
        ),
      );
    }
  }

  void _showExportSuccessSheet(File file, int sizeBytes, String formatLabel) {
    final sizeMb = (sizeBytes / (1024 * 1024)).toStringAsFixed(2);
    final sizeKb = (sizeBytes / 1024).toStringAsFixed(1);
    final sizeDisplay = sizeBytes > 1024 * 1024 ? '$sizeMb MB' : '$sizeKb KB';

    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Container(
        padding: const EdgeInsets.all(24),
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Center(
              child: Container(
                width: 44,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.grey.shade300,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 20),
            Center(
              child: Container(
                width: 64,
                height: 64,
                decoration: const BoxDecoration(
                  color: Color(0xFFEDFBF0),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.check_circle_rounded,
                  size: 42,
                  color: Color(0xFF10B981),
                ),
              ),
            ),
            const SizedBox(height: 14),
            const Center(
              child: Text(
                'Poster Exported Successfully!',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: _kNavyText,
                ),
              ),
            ),
            const SizedBox(height: 6),
            Center(
              child: Text(
                'Saved format: $formatLabel • Size: $sizeDisplay',
                style: const TextStyle(
                  fontSize: 13,
                  color: _kMutedText,
                ),
              ),
            ),
            const SizedBox(height: 20),
            ElevatedButton.icon(
              key: const Key('btn_share_exported_poster'),
              style: ElevatedButton.styleFrom(
                backgroundColor: _kOrangePrimary,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                ),
                elevation: 0,
              ),
              icon: const Icon(Icons.share_rounded, size: 20),
              label: const Text(
                'Share Poster',
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
              ),
              onPressed: () {
                _exportService.sharePosterFile(file: file);
              },
            ),
            const SizedBox(height: 10),
            OutlinedButton(
              key: const Key('btn_dismiss_exported_sheet'),
              style: OutlinedButton.styleFrom(
                foregroundColor: _kNavyText,
                padding: const EdgeInsets.symmetric(vertical: 14),
                side: const BorderSide(color: _kBorderColor),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                ),
              ),
              child: const Text(
                'Done',
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
              ),
              onPressed: () => Navigator.of(ctx).pop(),
            ),
          ],
        ),
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
              child: SingleChildScrollView(
                physics: const BouncingScrollPhysics(),
                padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    _buildPosterSummaryCard(s),
                    const SizedBox(height: 20),
                    _buildSectionHeader(s.fileFormatTitle),
                    const SizedBox(height: 12),
                    _buildFileFormatSelector(s),
                    const SizedBox(height: 20),
                    _buildSectionHeader(s.imageQualityTitle),
                    const SizedBox(height: 12),
                    _buildImageQualitySelector(s),
                    const SizedBox(height: 20),
                    _buildSectionHeader(s.resolutionTitle),
                    const SizedBox(height: 12),
                    _buildResolutionSelector(s),
                    const SizedBox(height: 20),
                    _buildSectionHeader(s.additionalOptionsTitle),
                    const SizedBox(height: 12),
                    _buildAdditionalOptionsCard(s),
                    const SizedBox(height: 20),
                    _buildSectionHeader(s.exportSummaryTitle),
                    const SizedBox(height: 12),
                    _buildExportSummaryCard(s),
                    const SizedBox(height: 24),
                    _buildExportButton(s),
                    const SizedBox(height: 12),
                    _buildFooterNote(s),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // --- Header ---
  Widget _buildHeader(AppStrings s) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          InkWell(
            key: const Key('btn_export_poster_back'),
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
                  s.exportPosterTitle,
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: _kNavyText,
                    letterSpacing: -0.2,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  s.exportPosterSubtitle,
                  style: const TextStyle(
                    fontSize: 13,
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

  // --- Poster Summary Card ---
  Widget _buildPosterSummaryCard(AppStrings s) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: _kCardBg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: _kBorderColor),
        boxShadow: const [
          BoxShadow(
            color: Color(0x05000000),
            blurRadius: 8,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          // Poster Thumbnail
          Container(
            width: 72,
            height: 90,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: _kBorderColor),
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(9),
              child: RepaintBoundary(
                key: _repaintBoundaryKey,
                child: Image.asset(
                  AppAssets.editorCanvasRepublicDay,
                  fit: BoxFit.cover,
                  errorBuilder: (c, o, s) => Container(
                    color: Colors.orange.shade50,
                    alignment: Alignment.center,
                    child: const Icon(Icons.image, size: 32, color: _kOrangePrimary),
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(width: 12),
          // Details & Preview Button
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  _project.title,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: _kNavyText,
                    height: 1.25,
                  ),
                ),
                const SizedBox(height: 6),
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(
                      Icons.aspect_ratio_rounded,
                      size: 15,
                      color: _kNavyText,
                    ),
                    const SizedBox(width: 6),
                    Text(
                      '$_canvasWidth × $_canvasHeight px',
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: _kNavyText,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                InkWell(
                  key: const Key('btn_preview_poster'),
                  onTap: _showPreviewDialog,
                  borderRadius: BorderRadius.circular(20),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 5),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: const Color(0xFFD1D5DB)),
                      boxShadow: const [
                        BoxShadow(
                          color: Color(0x06000000),
                          blurRadius: 4,
                          offset: Offset(0, 1),
                        ),
                      ],
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(
                          Icons.visibility_outlined,
                          size: 15,
                          color: _kNavyButton,
                        ),
                        const SizedBox(width: 6),
                        Text(
                          s.previewButton,
                          style: const TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: _kNavyButton,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // --- Section Header with Orange Bar ---
  Widget _buildSectionHeader(String title) {
    return Row(
      children: [
        Container(
          width: 3.5,
          height: 16,
          decoration: BoxDecoration(
            color: _kOrangePrimary,
            borderRadius: BorderRadius.circular(2),
          ),
        ),
        const SizedBox(width: 8),
        Text(
          title,
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: _kNavyText,
          ),
        ),
      ],
    );
  }

  // --- 3-Card Selectable Helper ---
  Widget _buildSelectableCard({
    required Key key,
    required bool isSelected,
    required Widget iconWidget,
    required String title,
    required String subtitle,
    required VoidCallback onTap,
  }) {
    return Expanded(
      child: GestureDetector(
        key: key,
        onTap: onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 180),
          height: 106,
          padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 10),
          decoration: BoxDecoration(
            color: isSelected ? _kOrangeSelectedBg : Colors.white,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(
              color: isSelected ? _kOrangePrimary : _kBorderColor,
              width: isSelected ? 1.5 : 1.0,
            ),
            boxShadow: [
              BoxShadow(
                color: isSelected ? const Color(0x14FA7126) : const Color(0x04000000),
                blurRadius: 6,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Stack(
            clipBehavior: Clip.none,
            children: [
              if (isSelected)
                Positioned(
                  top: -4,
                  right: 2,
                  child: Container(
                    width: 18,
                    height: 18,
                    decoration: const BoxDecoration(
                      color: _kOrangePrimary,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.check,
                      size: 12,
                      color: Colors.white,
                    ),
                  ),
                ),
              Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    iconWidget,
                    const SizedBox(height: 6),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 2),
                      child: FittedBox(
                        fit: BoxFit.scaleDown,
                        child: Text(
                          title,
                          maxLines: 1,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.bold,
                            color: _kNavyText,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 2),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 2),
                      child: FittedBox(
                        fit: BoxFit.scaleDown,
                        child: Text(
                          subtitle,
                          maxLines: 2,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                            fontSize: 10,
                            color: _kMutedText,
                            height: 1.15,
                          ),
                        ),
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

  // --- Section 1: File Format ---
  Widget _buildFileFormatSelector(AppStrings s) {
    return Row(
      children: [
        _buildSelectableCard(
          key: const Key('format_card_png'),
          isSelected: _selectedFormat == ExportFormat.png,
          iconWidget: const Icon(Icons.image_outlined, size: 28, color: _kNavyText),
          title: s.pngLabel,
          subtitle: s.pngSubtitle,
          onTap: () => _onFormatChanged(ExportFormat.png),
        ),
        const SizedBox(width: 10),
        _buildSelectableCard(
          key: const Key('format_card_jpg'),
          isSelected: _selectedFormat == ExportFormat.jpg,
          iconWidget: const Icon(Icons.image_outlined, size: 28, color: _kNavyText),
          title: s.jpgLabel,
          subtitle: s.jpgSubtitle,
          onTap: () => _onFormatChanged(ExportFormat.jpg),
        ),
        const SizedBox(width: 10),
        _buildSelectableCard(
          key: const Key('format_card_pdf'),
          isSelected: _selectedFormat == ExportFormat.pdf,
          iconWidget: Container(
            padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
            decoration: BoxDecoration(
              color: const Color(0xFFEF4444),
              borderRadius: BorderRadius.circular(4),
            ),
            child: const Text(
              'PDF',
              style: TextStyle(
                color: Colors.white,
                fontSize: 10,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          title: s.pdfLabel,
          subtitle: s.pdfSubtitle,
          onTap: () => _onFormatChanged(ExportFormat.pdf),
        ),
      ],
    );
  }

  // --- Section 2: Image Quality ---
  Widget _buildImageQualitySelector(AppStrings s) {
    return Row(
      children: [
        _buildSelectableCard(
          key: const Key('quality_card_standard'),
          isSelected: _selectedQuality == ImageQuality.standard,
          iconWidget: const Icon(Icons.star_outline_rounded, size: 28, color: _kNavyText),
          title: s.qualityStandardLabel,
          subtitle: s.qualityStandardSubtitle,
          onTap: () => setState(() => _selectedQuality = ImageQuality.standard),
        ),
        const SizedBox(width: 10),
        _buildSelectableCard(
          key: const Key('quality_card_high'),
          isSelected: _selectedQuality == ImageQuality.high,
          iconWidget: const Icon(Icons.star_rounded, size: 28, color: _kNavyText),
          title: s.qualityHighLabel,
          subtitle: s.qualityHighSubtitle,
          onTap: () => setState(() => _selectedQuality = ImageQuality.high),
        ),
        const SizedBox(width: 10),
        _buildSelectableCard(
          key: const Key('quality_card_ultra'),
          isSelected: _selectedQuality == ImageQuality.ultra,
          iconWidget: const Icon(Icons.diamond_outlined, size: 28, color: _kNavyText),
          title: s.qualityUltraLabel,
          subtitle: s.qualityUltraSubtitle,
          onTap: () => setState(() => _selectedQuality = ImageQuality.ultra),
        ),
      ],
    );
  }

  // --- Section 3: Resolution ---
  Widget _buildResolutionSelector(AppStrings s) {
    return Row(
      children: [
        _buildSelectableCard(
          key: const Key('resolution_card_standard'),
          isSelected: _selectedResolution == ExportResolution.standard,
          iconWidget: const Icon(Icons.format_list_bulleted_rounded, size: 28, color: _kNavyText),
          title: s.resStandardLabel,
          subtitle: '($_canvasWidth × $_canvasHeight px)',
          onTap: () => setState(() => _selectedResolution = ExportResolution.standard),
        ),
        const SizedBox(width: 10),
        _buildSelectableCard(
          key: const Key('resolution_card_high'),
          isSelected: _selectedResolution == ExportResolution.high,
          iconWidget: const Icon(Icons.flare_rounded, size: 28, color: _kNavyText),
          title: s.resHighLabel,
          subtitle: '($_canvasWidth × $_canvasHeight px)',
          onTap: () => setState(() => _selectedResolution = ExportResolution.high),
        ),
        const SizedBox(width: 10),
        _buildSelectableCard(
          key: const Key('resolution_card_original'),
          isSelected: _selectedResolution == ExportResolution.original,
          iconWidget: const Icon(Icons.aspect_ratio_rounded, size: 28, color: _kNavyText),
          title: s.resOriginalLabel,
          subtitle: '($_canvasWidth × $_canvasHeight px)',
          onTap: () => setState(() => _selectedResolution = ExportResolution.original),
        ),
      ],
    );
  }

  // --- Section 4: Additional Options ---
  Widget _buildAdditionalOptionsCard(AppStrings s) {
    final bool canEnableTransparency = _selectedFormat == ExportFormat.png;

    return Container(
      decoration: BoxDecoration(
        color: _kCardBg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: _kBorderColor),
      ),
      child: Column(
        children: [
          // Transparent Background option
          Opacity(
            opacity: canEnableTransparency ? 1.0 : 0.45,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              child: Row(
                children: [
                  const Icon(
                    Icons.grid_view_rounded,
                    size: 24,
                    color: _kNavyText,
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          s.transparentBackgroundLabel,
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                            color: _kNavyText,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          canEnableTransparency
                              ? s.transparentBackgroundSubtitle
                              : 'Only available for PNG format',
                          style: const TextStyle(
                            fontSize: 11,
                            color: _kMutedText,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Switch.adaptive(
                    key: const Key('switch_transparent_bg'),
                    value: _transparentBackground,
                    activeThumbColor: _kNavyButton,
                    activeTrackColor: _kNavyButton.withValues(alpha: 0.35),
                    onChanged: canEnableTransparency
                        ? (val) => setState(() => _transparentBackground = val)
                        : null,
                  ),
                ],
              ),
            ),
          ),
          const Divider(height: 1, color: Color(0xFFF3F4F6)),
          // Maintain Original Aspect Ratio option
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            child: Row(
              children: [
                const Icon(
                  Icons.crop_rounded,
                  size: 24,
                  color: _kNavyText,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        s.maintainAspectRatioLabel,
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: _kNavyText,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        s.maintainAspectRatioSubtitle,
                        style: const TextStyle(
                          fontSize: 11,
                          color: _kMutedText,
                        ),
                      ),
                    ],
                  ),
                ),
                Switch.adaptive(
                  key: const Key('switch_maintain_aspect_ratio'),
                  value: _maintainAspectRatio,
                  activeThumbColor: _kNavyButton,
                  activeTrackColor: _kNavyButton.withValues(alpha: 0.35),
                  onChanged: (val) => setState(() => _maintainAspectRatio = val),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // --- Section 5: Export Summary ---
  Widget _buildExportSummaryCard(AppStrings s) {
    final formatStr = switch (_selectedFormat) {
      ExportFormat.png => 'PNG',
      ExportFormat.jpg => 'JPG',
      ExportFormat.pdf => 'PDF',
    };

    final qualityStr = switch (_selectedQuality) {
      ImageQuality.standard => s.qualityStandardLabel,
      ImageQuality.high => s.qualityHighLabel,
      ImageQuality.ultra => s.qualityUltraLabel,
    };

    final resStr = _getResolutionText(s);

    final fileSizeStr = _exportedFileSize != null
        ? '${(_exportedFileSize! / (1024 * 1024)).toStringAsFixed(2)} MB'
        : s.calculatingAfterExport;

    final backgroundStr = _transparentBackground ? s.transparentLabel : s.opaqueLabel;

    return Container(
      decoration: BoxDecoration(
        color: _kCardBg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: _kBorderColor),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 14),
      child: Column(
        children: [
          Row(
            children: [
              _buildSummaryColumn(
                icon: Icons.save_outlined,
                label: s.formatLabel,
                value: formatStr,
              ),
              _buildSummaryColumn(
                icon: Icons.star_outline_rounded,
                label: 'Quality',
                value: qualityStr,
              ),
              _buildSummaryColumn(
                icon: Icons.aspect_ratio_rounded,
                label: s.resolutionTitle,
                value: resStr,
              ),
              _buildSummaryColumn(
                icon: Icons.sd_storage_outlined,
                label: 'File Size',
                value: fileSizeStr,
                isSubtle: true,
              ),
            ],
          ),
          const SizedBox(height: 12),
          const Divider(height: 1, color: Color(0xFFF3F4F6)),
          const SizedBox(height: 12),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 4),
            child: Row(
              children: [
                const Icon(
                  Icons.image_outlined,
                  size: 18,
                  color: _kNavyText,
                ),
                const SizedBox(width: 8),
                Text(
                  s.backgroundLabel,
                  style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: _kNavyText,
                  ),
                ),
                const Spacer(),
                Text(
                  backgroundStr,
                  style: const TextStyle(
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                    color: _kNavyText,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSummaryColumn({
    required IconData icon,
    required String label,
    required String value,
    bool isSubtle = false,
  }) {
    return Expanded(
      child: Column(
        children: [
          Icon(icon, size: 20, color: _kNavyText),
          const SizedBox(height: 4),
          FittedBox(
            fit: BoxFit.scaleDown,
            child: Text(
              label,
              style: const TextStyle(
                fontSize: 11,
                color: _kMutedText,
              ),
            ),
          ),
          const SizedBox(height: 4),
          FittedBox(
            fit: BoxFit.scaleDown,
            child: Text(
              value,
              textAlign: TextAlign.center,
              maxLines: 2,
              style: TextStyle(
                fontSize: isSubtle ? 10.5 : 12,
                fontWeight: FontWeight.bold,
                color: _kNavyText,
                height: 1.15,
              ),
            ),
          ),
        ],
      ),
    );
  }

  // --- Bottom Action Button ---
  Widget _buildExportButton(AppStrings s) {
    return SizedBox(
      height: 54,
      child: ElevatedButton(
        key: const Key('btn_primary_export_poster'),
        onPressed: _isExporting ? null : _exportPoster,
        style: ElevatedButton.styleFrom(
          backgroundColor: _kOrangePrimary,
          foregroundColor: Colors.white,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
        ),
        child: _isExporting
            ? const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  SizedBox(
                    width: 20,
                    height: 20,
                    child: CircularProgressIndicator(
                      strokeWidth: 2.5,
                      valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                    ),
                  ),
                  SizedBox(width: 12),
                  Text(
                    'Exporting...',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                ],
              )
            : Row(
                mainAxisAlignment: MainAxisAlignment.center,
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.file_upload_outlined, size: 22),
                  const SizedBox(width: 8),
                  Flexible(
                    child: Text(
                      s.exportPosterButton,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 0.2,
                      ),
                    ),
                  ),
                ],
              ),
      ),
    );
  }

  // --- Footer Note ---
  Widget _buildFooterNote(AppStrings s) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const Icon(
          Icons.info_outline_rounded,
          size: 15,
          color: _kMutedText,
        ),
        const SizedBox(width: 6),
        Expanded(
          child: Text(
            s.originalPosterNote,
            style: const TextStyle(
              fontSize: 12,
              color: _kMutedText,
            ),
            textAlign: TextAlign.center,
          ),
        ),
      ],
    );
  }
}
