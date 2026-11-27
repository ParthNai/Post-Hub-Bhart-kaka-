import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';
import 'package:panchayat_post/core/services/app_init_service.dart';
import 'package:panchayat_post/core/services/one_signal_notification_service.dart';
import 'package:panchayat_post/core/theme/app_theme.dart';
import 'package:panchayat_post/features/splash/presentation/screens/splash_screen.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Configure system chrome overlays for edge-to-edge immersive brand experience
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
      statusBarBrightness: Brightness.light,
      systemNavigationBarColor: Colors.transparent,
      systemNavigationBarIconBrightness: Brightness.dark,
    ),
  );

  await OneSignalNotificationService.instance.initialize();
  runApp(const PanchayatPostApp());
}

class PanchayatPostApp extends StatefulWidget {
  const PanchayatPostApp({
    super.key,
    this.initService,
    this.localeController,
  });

  final AppInitService? initService;
  final LocaleController? localeController;

  @override
  State<PanchayatPostApp> createState() => _PanchayatPostAppState();
}

class _PanchayatPostAppState extends State<PanchayatPostApp> {
  late final LocaleController _localeController;
  final OneSignalNotificationService _notificationService =
      OneSignalNotificationService.instance;
  final GlobalKey<NavigatorState> _navigatorKey = GlobalKey<NavigatorState>();
  late final OneSignalPushSubscriptionObserver _pushSubscriptionObserver;
  bool _integrationDialogShown = false;

  @override
  void initState() {
    super.initState();
    _localeController = widget.localeController ?? LocaleController();
    _pushSubscriptionObserver = OneSignalPushSubscriptionObserver(
      _showIntegrationDialogIfRegistered,
    );
    if (_notificationService.isInitialized) {
      _notificationService.addPushSubscriptionObserver(
        _pushSubscriptionObserver,
      );
      _showIntegrationDialogIfRegistered(
        _notificationService.pushSubscriptionId,
      );
    }
  }

  @override
  void dispose() {
    if (_notificationService.isInitialized) {
      _notificationService.removePushSubscriptionObserver(
        _pushSubscriptionObserver,
      );
    }
    super.dispose();
  }

  void _showIntegrationDialogIfRegistered(String? subscriptionId) {
    if (!OneSignalNotificationService.isServerAssignedSubscriptionId(
          subscriptionId,
        ) ||
        _integrationDialogShown) {
      return;
    }

    _integrationDialogShown = true;
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      final dialogContext = _navigatorKey.currentContext;
      if (dialogContext == null) return;
      showDialog<void>(
        context: dialogContext,
        barrierDismissible: false,
        builder: (context) => AlertDialog(
          title: const Text('Your OneSignal SDK integration is complete!'),
          content: const Text(
            'You can now send Push Notifications & In-App Messages through OneSignal. Tap below to enable push notifications.',
          ),
          actions: [
            TextButton(
              onPressed: () async {
                Navigator.of(context).pop();
                await _notificationService.requestPushPermission();
              },
              child: const Text('Got it'),
            ),
          ],
        ),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return LocaleScope(
      controller: _localeController,
      child: MaterialApp(
        navigatorKey: _navigatorKey,
        title: 'Panchayat Post',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        initialRoute: AppRoutes.splash,
        onGenerateRoute: (settings) {
          if (settings.name == AppRoutes.splash) {
            return MaterialPageRoute<void>(
              builder: (context) => SplashScreen(initService: widget.initService),
              settings: settings,
            );
          }
          final builder = AppRoutes.routes[settings.name];
          if (builder != null) {
            return MaterialPageRoute<void>(
              builder: builder,
              settings: settings,
            );
          }
          return null;
        },
      ),
    );
  }
}
