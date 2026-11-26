import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:onesignal_flutter/onesignal_flutter.dart';

class OneSignalNotificationService {
  OneSignalNotificationService._();

  static const _appId = String.fromEnvironment(
    'ONESIGNAL_APP_ID',
    defaultValue: '558ad57a-68a5-4149-90e4-72feaed0d583',
  );

  static void initialize() {
    if (kIsWeb || defaultTargetPlatform != TargetPlatform.android) return;
    try {
      OneSignal.initialize(_appId);
      unawaited(_requestPermission());
    } catch (error, stackTrace) {
      debugPrint('OneSignal initialization failed: $error\n$stackTrace');
    }
  }

  static Future<void> _requestPermission() async {
    try {
      final granted = await OneSignal.Notifications.requestPermission(true);
      if (!granted) {
        debugPrint('Push notification permission was not granted.');
      }
    } catch (error, stackTrace) {
      debugPrint(
        'Push notification permission request failed: $error\n$stackTrace',
      );
    }
  }
}
