import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'video_preloader_stub.dart'
    if (dart.library.html) 'video_preloader_web.dart' as impl;

class VideoPreloaderView extends StatelessWidget {
  const VideoPreloaderView({
    super.key,
    required this.videoUrl,
    this.muted = true,
    this.loop = false,
    this.fit = 'cover',
    this.onEnded,
  });

  final String videoUrl;
  final bool muted;
  final bool loop;
  final String fit;
  final VoidCallback? onEnded;

  @override
  Widget build(BuildContext context) {
    if (kIsWeb) {
      return impl.createWebVideoPreloader(
        videoUrl: videoUrl,
        muted: muted,
        loop: loop,
        fit: fit,
        onEnded: onEnded,
      );
    }
    return const SizedBox.shrink();
  }
}
