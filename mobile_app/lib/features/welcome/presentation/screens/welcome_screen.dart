import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:panchayat_post/core/constants/app_assets.dart';
import 'package:panchayat_post/core/constants/app_colors.dart';
import '../widgets/welcome_action_buttons.dart';
import '../widgets/welcome_background_painter.dart';
import '../widgets/welcome_content_widget.dart';
import '../widgets/welcome_header_widget.dart';
import '../widgets/welcome_hero_widget.dart';
import '../widgets/welcome_legal_footer.dart';

/// Screen 02: Welcome Screen for Panchayat Post.
/// Reproduces the approved Screen 02 UI reference image with exact visual fidelity:
/// - Screen-filling background with top decorative corner waves and bottom village silhouette
/// - Header with official logo + stacked title and interactive language selector badge
/// - Poster-preview hero section featuring the 5 fanned-out celebration cards with smooth entrance animation
/// - Localized heading ("તમારા ગામની દરેક વાત, હવે સુંદર પોસ્ટ સાથે!") and subtitle
/// - Primary button: "ચાલો શરૂ કરીએ →"
/// - Secondary button: "👤 પહેલેથી એકાઉન્ટ છે? Login"
/// - Working Privacy Policy and Terms & Conditions legal footer links
class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return AnnotatedRegion<SystemUiOverlayStyle>(
      value: const SystemUiOverlayStyle(
        statusBarColor: Colors.transparent,
        statusBarIconBrightness: Brightness.dark,
        statusBarBrightness: Brightness.light,
        systemNavigationBarColor: Colors.transparent,
        systemNavigationBarIconBrightness: Brightness.dark,
      ),
      child: Scaffold(
        backgroundColor: AppColors.background,
        body: Stack(
          fit: StackFit.expand,
          children: [
            // 1. Top decorative corner waves painter
            const Positioned(
              top: 0,
              left: 0,
              right: 0,
              height: 180,
              child: CustomPaint(
                painter: WelcomeBackgroundPainter(),
              ),
            ),

            // 2. Bottom Village & Panchayat Bhawan silhouette illustration
            Positioned(
              left: 0,
              right: 0,
              bottom: 0,
              height: 165,
              child: Image.asset(
                AppAssets.welcomeVillageFooter,
                fit: BoxFit.cover,
                alignment: Alignment.bottomCenter,
                filterQuality: FilterQuality.high,
              ),
            ),

            // 3. Foreground scrollable content respecting safe areas
            SafeArea(
              child: LayoutBuilder(
                builder: (context, constraints) {
                  final heroHeight = (constraints.maxHeight * 0.28).clamp(170.0, 255.0);

                  return SingleChildScrollView(
                    physics: const ClampingScrollPhysics(),
                    child: ConstrainedBox(
                      constraints: BoxConstraints(
                        minHeight: constraints.maxHeight,
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const WelcomeHeaderWidget(),
                              const SizedBox(height: 6.0),
                              WelcomeHeroWidget(height: heroHeight),
                              const SizedBox(height: 12.0),
                              const WelcomeContentWidget(),
                            ],
                          ),
                          Column(
                            mainAxisSize: MainAxisSize.min,
                            children: const [
                              SizedBox(height: 16.0),
                              WelcomeActionButtons(),
                              SizedBox(height: 14.0),
                              WelcomeLegalFooter(),
                              SizedBox(height: 6.0),
                            ],
                          ),
                        ],
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
