import 'dart:typed_data';

import 'package:flutter_test/flutter_test.dart';
import 'package:image/image.dart' as img;
import 'package:panchayat_post/core/services/image_background_mask.dart';

void main() {
  test('applies the person mask as a transparent PNG alpha channel', () {
    final source = img.Image(width: 3, height: 1, numChannels: 4)
      ..setPixelRgba(0, 0, 220, 40, 30, 255)
      ..setPixelRgba(1, 0, 40, 220, 30, 255)
      ..setPixelRgba(2, 0, 30, 40, 220, 255);

    final result = applySegmentationMask(
      Uint8List.fromList(img.encodePng(source)),
      maskWidth: 3,
      maskHeight: 1,
      confidences: const [1.0, 0.5, 0.0],
    );
    final output = img.decodePng(result)!;

    expect(output.getPixel(0, 0).a, 255);
    expect(output.getPixel(1, 0).a, greaterThan(0));
    expect(output.getPixel(1, 0).a, lessThan(255));
    expect(output.getPixel(2, 0).a, 0);
  });

  test(
    'rejects a mask whose confidence data does not match its dimensions',
    () {
      final source = img.Image(width: 1, height: 1, numChannels: 4);

      expect(
        () => applySegmentationMask(
          Uint8List.fromList(img.encodePng(source)),
          maskWidth: 2,
          maskHeight: 1,
          confidences: const [1.0],
        ),
        throwsArgumentError,
      );
    },
  );
}
