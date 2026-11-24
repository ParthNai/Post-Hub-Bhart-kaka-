import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:google_mlkit_selfie_segmentation/google_mlkit_selfie_segmentation.dart';
import 'package:image/image.dart' as img;

/// On-device AI background removal service powered by Google ML Kit Selfie Segmentation.
/// 100% Free, unlimited, runs locally on the user's phone with zero server costs or API keys.
class BackgroundRemoverService {
  BackgroundRemoverService._();
  static final BackgroundRemoverService instance = BackgroundRemoverService._();

  SelfieSegmenter? _segmenter;

  SelfieSegmenter get segmenter {
    _segmenter ??= SelfieSegmenter(
      mode: SegmenterMode.single,
      enableRawSizeMask: true,
    );
    return _segmenter!;
  }

  /// Checks if background removal is supported on the current runtime platform.
  bool get isSupported => !kIsWeb && (Platform.isAndroid || Platform.isIOS);

  /// Removes background from an image file at [filePath] on-device.
  /// Returns a Base64 encoded transparent PNG string or null on failure.
  Future<String?> removeBackground(String filePath) async {
    if (!isSupported) {
      debugPrint('[BackgroundRemoverService] On-device ML Kit segmentation is only supported on Android/iOS.');
      return null;
    }

    try {
      final inputImage = InputImage.fromFilePath(filePath);
      final mask = await segmenter.processImage(inputImage);
      if (mask == null) return null;

      final fileBytes = await File(filePath).readAsBytes();
      return _applyMaskToImage(fileBytes, mask);
    } catch (e) {
      debugPrint('[BackgroundRemoverService] Error removing background: $e');
      return null;
    }
  }

  /// Removes background from raw image bytes.
  Future<String?> removeBackgroundFromBytes(Uint8List bytes) async {
    if (!isSupported) return null;

    File? tempFile;
    try {
      final tempDir = Directory.systemTemp;
      tempFile = File('${tempDir.path}/bg_cutout_${DateTime.now().millisecondsSinceEpoch}.jpg');
      await tempFile.writeAsBytes(bytes);

      return await removeBackground(tempFile.path);
    } catch (e) {
      debugPrint('[BackgroundRemoverService] Error processing bytes: $e');
      return null;
    } finally {
      if (tempFile != null && await tempFile.exists()) {
        try {
          await tempFile.delete();
        } catch (_) {}
      }
    }
  }

  /// Masks the original image pixels using the ML Kit confidence mask into a transparent PNG.
  String? _applyMaskToImage(Uint8List imageBytes, SegmentationMask mask) {
    final original = img.decodeImage(imageBytes);
    if (original == null) return null;

    final width = original.width;
    final height = original.height;
    final confidences = mask.confidences;
    final maskWidth = mask.width;
    final maskHeight = mask.height;

    // Create 32-bit RGBA image with alpha transparency
    final output = img.Image(width: width, height: height, numChannels: 4);

    for (int y = 0; y < height; y++) {
      final maskY = (y * maskHeight ~/ height).clamp(0, maskHeight - 1);
      for (int x = 0; x < width; x++) {
        final maskX = (x * maskWidth ~/ width).clamp(0, maskWidth - 1);
        final maskIndex = maskY * maskWidth + maskX;
        final confidence = maskIndex < confidences.length ? confidences[maskIndex] : 0.0;

        final pixel = original.getPixel(x, y);

        // Studio-quality alpha edge feathering:
        // confidence > 0.60 -> Full foreground subject
        // confidence 0.30 .. 0.60 -> Anti-aliased feathered edge
        // confidence < 0.30 -> Pure transparent background
        int alpha;
        if (confidence > 0.60) {
          alpha = 255;
        } else if (confidence > 0.30) {
          alpha = ((confidence - 0.30) / 0.30 * 255).round().clamp(0, 255);
        } else {
          alpha = 0;
        }

        output.setPixelRgba(x, y, pixel.r, pixel.g, pixel.b, alpha);
      }
    }

    final pngBytes = img.encodePng(output);
    return base64Encode(pngBytes);
  }

  void close() {
    _segmenter?.close();
    _segmenter = null;
  }
}
