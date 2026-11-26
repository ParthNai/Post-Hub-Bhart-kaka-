import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:panchayat_post/features/editor/presentation/widgets/poster_frame_overlay.dart';

void main() {
  test('admin frame entries are unique by id', () {
    final originalFrames = PosterFrames.list;
    addTearDown(() {
      PosterFrames.list = originalFrames;
    });

    PosterFrames.list = [
      const PosterFrameDef(
        id: 'none',
        name: 'No Frame',
        previewColor: Colors.grey,
      ),
    ];

    const uploadedFrame = PosterFrameDef(
      id: 'frame-123',
      name: 'kp',
      previewColor: Colors.orange,
      imageUrl: 'https://example.test/frame.png',
    );
    PosterFrames.addAdminFrames([uploadedFrame, uploadedFrame]);

    expect(
      PosterFrames.list.where((frame) => frame.id == 'frame-123'),
      hasLength(1),
    );
    expect(
      PosterFrames.list.where((frame) => frame.name == 'kp'),
      hasLength(1),
    );
  });
}
