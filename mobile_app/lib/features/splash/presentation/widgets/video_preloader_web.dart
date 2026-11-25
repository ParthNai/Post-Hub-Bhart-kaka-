// ignore_for_file: avoid_web_libraries_in_flutter
import 'dart:html' as html;
import 'dart:ui_web' as ui_web;
import 'package:flutter/material.dart';

Widget createWebVideoPreloader({
  required String videoUrl,
  required bool muted,
  required bool loop,
  required String fit,
}) {
  final cleanFit = (fit == 'contain' || fit == 'fill') ? fit : 'cover';
  final viewId = 'preloader-video-${videoUrl.hashCode.abs()}';

  // ignore: undefined_prefixed_name
  ui_web.platformViewRegistry.registerViewFactory(viewId, (int id) {
    final video = html.VideoElement()
      ..src = videoUrl
      ..autoplay = true
      ..muted = muted
      ..loop = loop
      ..setAttribute('playsinline', 'true')
      ..setAttribute('webkit-playsinline', 'true')
      ..style.width = '100%'
      ..style.height = '100%'
      ..style.objectFit = cleanFit
      ..style.border = 'none'
      ..style.display = 'block';

    // Attempt autoplay immediately
    video.play().catchError((_) {});

    return video;
  });

  return HtmlElementView(viewType: viewId);
}
