import 'dart:typed_data';

/// On-device AI background removal service placeholder.
class BackgroundRemoverService {
  BackgroundRemoverService._();
  static final BackgroundRemoverService instance = BackgroundRemoverService._();

  bool get isSupported => false;

  Future<String?> removeBackground(String filePath) async {
    return null;
  }

  Future<String?> removeBackgroundFromBytes(Uint8List bytes) async {
    return null;
  }
}
