import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';
import 'package:panchayat_post/core/services/app_init_service.dart';
import 'package:panchayat_post/core/services/one_signal_notification_service.dart';
import 'package:panchayat_post/core/theme/app_theme.dart';
import 'package:panchayat_post/features/splash/presentation/screens/splash_screen.dart';

void main() {
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

  runApp(const PanchayatPostApp());
  WidgetsBinding.instance.addPostFrameCallback((_) {
    OneSignalNotificationService.initialize();
  });
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

  @override
  void initState() {
    super.initState();
    _localeController = widget.localeController ?? LocaleController();
  }

  @override
  Widget build(BuildContext context) {
    return LocaleScope(
      controller: _localeController,
      child: MaterialApp(
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
