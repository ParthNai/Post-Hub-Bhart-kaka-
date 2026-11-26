import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:google_mlkit_selfie_segmentation/google_mlkit_selfie_segmentation.dart';
import 'package:path_provider/path_provider.dart';

import 'image_background_mask.dart';

bool get isSupported => Platform.isAndroid || Platform.isIOS;

Future<Uint8List> removeBackground(String filePath) async {
  _ensureSupported();
  final bytes = await File(filePath).readAsBytes();
  return _removeBackgroundFromFile(filePath, bytes);
}

Future<Uint8List> removeBackgroundFromBytes(Uint8List bytes) async {
  _ensureSupported();
  final temporaryDirectory = await getTemporaryDirectory();
  final temporaryFile = File(
    '${temporaryDirectory.path}${Platform.pathSeparator}'
    'background-removal-${DateTime.now().microsecondsSinceEpoch}.jpg',
  );

  try {
    await temporaryFile.writeAsBytes(bytes, flush: true);
    return await _removeBackgroundFromFile(temporaryFile.path, bytes);
  } finally {
    if (await temporaryFile.exists()) {
      await temporaryFile.delete();
    }
  }
}

void _ensureSupported() {
  if (!isSupported) {
    throw UnsupportedError(
      'Automatic background removal is available on Android and iOS only.',
    );
  }
}

Future<Uint8List> _removeBackgroundFromFile(
  String filePath,
  Uint8List sourceBytes,
) async {
  final segmenter = SelfieSegmenter(mode: SegmenterMode.single);
  try {
    final mask = await segmenter.processImage(
      InputImage.fromFilePath(filePath),
    );
    if (mask == null) {
      throw StateError('The photo could not be segmented.');
    }

    return await compute(
      _applyMask,
      _MaskJob(
        sourceBytes: sourceBytes,
        maskWidth: mask.width,
        maskHeight: mask.height,
        confidences: mask.confidences,
      ),
    );
  } finally {
    await segmenter.close();
  }
}

Uint8List _applyMask(_MaskJob job) => applySegmentationMask(
  job.sourceBytes,
  maskWidth: job.maskWidth,
  maskHeight: job.maskHeight,
  confidences: job.confidences,
);

class _MaskJob {
  const _MaskJob({
    required this.sourceBytes,
    required this.maskWidth,
    required this.maskHeight,
    required this.confidences,
  });

  final Uint8List sourceBytes;
  final int maskWidth;
  final int maskHeight;
  final List<double> confidences;
}
