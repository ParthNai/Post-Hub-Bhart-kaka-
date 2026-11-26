import 'dart:io';
import 'dart:ui' as ui;

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:gal/gal.dart';
import 'package:path_provider/path_provider.dart';
import 'package:share_plus/share_plus.dart';

/// Real poster image export and sharing service.
class PosterExportService {
  PosterExportService();

  /// Captures the widget subtree wrapped with [repaintBoundaryKey] as image bytes.
  Future<Uint8List?> captureBoundaryToBytes(
    GlobalKey repaintBoundaryKey, {
    double pixelRatio = 2.0,
  }) async {
    await WidgetsBinding.instance.endOfFrame;
    final boundary =
        repaintBoundaryKey.currentContext?.findRenderObject()
            as RenderRepaintBoundary?;

    if (boundary == null) return null;

    final image = await boundary.toImage(pixelRatio: pixelRatio);
    try {
      final ByteData? byteData = await image.toByteData(
        format: ui.ImageByteFormat.png,
      );
      return byteData?.buffer.asUint8List();
    } finally {
      image.dispose();
    }
  }

  Future<void> savePosterToGallery({
    required Uint8List bytes,
    required String filename,
  }) async {
    if (kIsWeb ||
        (defaultTargetPlatform != TargetPlatform.android &&
            defaultTargetPlatform != TargetPlatform.iOS)) {
      throw UnsupportedError(
        'Saving to the device gallery is available on Android and iOS.',
      );
    }

    await Gal.putImageBytes(bytes, name: filename);
  }

  /// Writes raw image bytes to the local file system with the requested filename and format.
  Future<File> savePosterToFile({
    required Uint8List bytes,
    required String filename,
    required String format,
  }) async {
    final Directory directory = await _getExportDirectory();
    final sanitizedFormat = format.toLowerCase().replaceAll('.', '');
    final filePath = '${directory.path}/$filename.$sanitizedFormat';
    final file = File(filePath);
    await file.writeAsBytes(bytes, flush: true);
    return file;
  }

  /// Shares the given poster file via native device sharing or app-specific target.
  Future<ShareResult> sharePosterFile({
    required File file,
    String? text,
    String? platform,
  }) async {
    final xFile = XFile(file.path, mimeType: 'image/png');
    final caption = text ?? 'Check out this poster created on Panchayat Post!';

    return SharePlus.instance.share(
      ShareParams(
        files: [xFile],
        text: caption,
        subject: 'Panchayat Post Design',
      ),
    );
  }

  Future<Directory> _getExportDirectory() async {
    try {
      return await getApplicationDocumentsDirectory();
    } catch (_) {
      return Directory.systemTemp;
    }
  }
}
