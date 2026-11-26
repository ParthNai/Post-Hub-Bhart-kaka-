import 'dart:typed_data';

import 'package:image/image.dart' as img;

Uint8List applySegmentationMask(
  Uint8List sourceBytes, {
  required int maskWidth,
  required int maskHeight,
  required List<double> confidences,
}) {
  if (maskWidth <= 0 ||
      maskHeight <= 0 ||
      confidences.length != maskWidth * maskHeight) {
    throw ArgumentError('The segmentation mask dimensions are invalid.');
  }

  final decoded = img.decodeImage(sourceBytes);
  if (decoded == null) {
    throw const FormatException('The selected photo could not be decoded.');
  }

  final source = img.bakeOrientation(decoded);
  final output = img.Image(
    width: source.width,
    height: source.height,
    numChannels: 4,
  );

  for (var y = 0; y < source.height; y++) {
    final maskY = (y * maskHeight / source.height)
        .floor()
        .clamp(0, maskHeight - 1)
        .toInt();
    for (var x = 0; x < source.width; x++) {
      final maskX = (x * maskWidth / source.width)
          .floor()
          .clamp(0, maskWidth - 1)
          .toInt();
      final confidence = confidences[maskY * maskWidth + maskX]
          .clamp(0.0, 1.0)
          .toDouble();
      final alpha = ((confidence - 0.2) / 0.65).clamp(0.0, 1.0);
      final pixel = source.getPixel(x, y);

      output.setPixelRgba(
        x,
        y,
        pixel.r,
        pixel.g,
        pixel.b,
        (pixel.a * alpha).round(),
      );
    }
  }

  return Uint8List.fromList(img.encodePng(output));
}
