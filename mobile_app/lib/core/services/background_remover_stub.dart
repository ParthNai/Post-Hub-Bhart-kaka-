import 'dart:typed_data';

bool get isSupported => false;

Future<Uint8List> removeBackground(String filePath) async {
  throw UnsupportedError(
    'Automatic background removal is available on Android and iOS only.',
  );
}

Future<Uint8List> removeBackgroundFromBytes(Uint8List bytes) async {
  throw UnsupportedError(
    'Automatic background removal is available on Android and iOS only.',
  );
}
