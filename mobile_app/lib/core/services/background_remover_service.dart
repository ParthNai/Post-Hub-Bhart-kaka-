import 'dart:typed_data';

import 'background_remover_stub.dart'
    if (dart.library.io) 'background_remover_mobile.dart'
    as implementation;

class BackgroundRemoverService {
  BackgroundRemoverService._();

  static final BackgroundRemoverService instance = BackgroundRemoverService._();

  bool get isSupported => implementation.isSupported;

  Future<Uint8List> removeBackground(String filePath) =>
      implementation.removeBackground(filePath);

  Future<Uint8List> removeBackgroundFromBytes(Uint8List bytes) =>
      implementation.removeBackgroundFromBytes(bytes);
}
