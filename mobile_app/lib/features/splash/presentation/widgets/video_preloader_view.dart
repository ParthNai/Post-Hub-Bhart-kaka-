import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'video_preloader_stub.dart'
    if (dart.library.html) 'video_preloader_web.dart' as impl;

class VideoPreloaderView extends StatelessWidget {
  const VideoPreloaderView({
    super.key,
    required this.videoUrl,
    this.muted = true,
    this.loop = true,
    this.fit = 'cover',
  });

  final String videoUrl;
  final bool muted;
  final bool loop;
  final String fit;

  @override
  Widget build(BuildContext context) {
    if (kIsWeb) {
      return impl.createWebVideoPreloader(
        videoUrl: videoUrl,
        muted: muted,
        loop: loop,
        fit: fit,
      );
    }
    return const SizedBox.shrink();
  }
}
