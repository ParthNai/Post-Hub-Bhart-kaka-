import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:onesignal_flutter/onesignal_flutter.dart';

class OneSignalNotificationService {
  OneSignalNotificationService._();

  static const _appId = String.fromEnvironment('ONESIGNAL_APP_ID');

  static void initialize() {
    if (kIsWeb || defaultTargetPlatform != TargetPlatform.android) return;
    if (_appId.trim().isEmpty) {
      debugPrint(
        'Push notifications are disabled: build with ONESIGNAL_APP_ID configured.',
      );
      return;
    }

    try {
      OneSignal.initialize(_appId);
      unawaited(_requestPermission());
    } catch (error, stackTrace) {
      debugPrint('OneSignal initialization failed: $error\n$stackTrace');
    }
  }

  static Future<void> _requestPermission() async {
    try {
      final granted = await OneSignal.Notifications.requestPermission(false);
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
