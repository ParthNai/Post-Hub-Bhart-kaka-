import 'package:flutter/foundation.dart';
import 'package:onesignal_flutter/onesignal_flutter.dart';

typedef PushSubscriptionIdCallback = void Function(String? subscriptionId);

class OneSignalPushSubscriptionObserver {
  OneSignalPushSubscriptionObserver(this.onChanged);

  final PushSubscriptionIdCallback onChanged;
  late final OnPushSubscriptionChangeObserver _sdkObserver =
      _handleSubscriptionChange;

  void _handleSubscriptionChange(OSPushSubscriptionChangedState state) {
    onChanged(state.current.id);
  }
}

class OneSignalNotificationService {
  OneSignalNotificationService._();

  static final instance = OneSignalNotificationService._();
  static const _appId = '558ad57a-68a5-4149-90e4-72feaed0d583';

  bool _initialized = false;

  bool get isInitialized => _initialized;

  String? get pushSubscriptionId {
    _requireInitialized();
    return OneSignal.User.pushSubscription.id;
  }

  Future<void> initialize() async {
    if (kIsWeb ||
        defaultTargetPlatform != TargetPlatform.android ||
        _initialized) {
      return;
    }

    setLogLevel(kDebugMode ? OSLogLevel.verbose : OSLogLevel.none);
    await OneSignal.initialize(_appId);
    _initialized = true;
  }

  void addPushSubscriptionObserver(OneSignalPushSubscriptionObserver observer) {
    _requireInitialized();
    OneSignal.User.pushSubscription.addObserver(observer._sdkObserver);
  }

  void removePushSubscriptionObserver(
    OneSignalPushSubscriptionObserver observer,
  ) {
    _requireInitialized();
    OneSignal.User.pushSubscription.removeObserver(observer._sdkObserver);
  }

  Future<bool> requestPushPermission() async {
    _requireInitialized();
    return OneSignal.Notifications.requestPermission(true);
  }

  Future<void> login(String externalId) async {
    _requireInitialized();
    await OneSignal.login(externalId);
  }

  Future<void> logout() async {
    _requireInitialized();
    await OneSignal.logout();
  }

  Future<void> addEmail(String email) async {
    _requireInitialized();
    await OneSignal.User.addEmail(email);
  }

  Future<void> addSms(String phoneNumber) async {
    _requireInitialized();
    await OneSignal.User.addSms(phoneNumber);
  }

  Future<void> addTag(String key, String value) async {
    _requireInitialized();
    await OneSignal.User.addTagWithKey(key, value);
  }

  void setLogLevel(OSLogLevel level) {
    OneSignal.Debug.setLogLevel(level);
  }

  static bool isServerAssignedSubscriptionId(String? subscriptionId) {
    return subscriptionId != null &&
        subscriptionId.isNotEmpty &&
        !subscriptionId.startsWith('local-');
  }

  void _requireInitialized() {
    if (!_initialized) {
      throw StateError('OneSignal must be initialized before use.');
    }
  }
}
