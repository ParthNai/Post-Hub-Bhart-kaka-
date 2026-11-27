import 'package:flutter_test/flutter_test.dart';
import 'package:panchayat_post/core/services/one_signal_notification_service.dart';

void main() {
  group('server-assigned push subscription IDs', () {
    test('rejects missing and local placeholder IDs', () {
      expect(
        OneSignalNotificationService.isServerAssignedSubscriptionId(null),
        isFalse,
      );
      expect(
        OneSignalNotificationService.isServerAssignedSubscriptionId(''),
        isFalse,
      );
      expect(
        OneSignalNotificationService.isServerAssignedSubscriptionId(
          'local-pending-id',
        ),
        isFalse,
      );
    });

    test('accepts a server-assigned subscription ID', () {
      expect(
        OneSignalNotificationService.isServerAssignedSubscriptionId(
          'c6ec7d19-7fd4-4c7a-9c2b-111111111111',
        ),
        isTrue,
      );
    });
  });
}
