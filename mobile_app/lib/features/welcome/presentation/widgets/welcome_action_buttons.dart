import 'package:flutter/material.dart';
import 'package:panchayat_post/core/constants/app_colors.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';

/// Primary and secondary action buttons for Screen 02 Welcome Screen:
/// - Primary button: "ચાલો શરૂ કરીએ →" (Navigates to Screen 03: Create Account)
/// - Secondary button: "👤 પહેલેથી એકાઉન્ટ છે? Login" (Navigates to Screen 04: Login)
class WelcomeActionButtons extends StatefulWidget {
  const WelcomeActionButtons({super.key});

  @override
  State<WelcomeActionButtons> createState() => _WelcomeActionButtonsState();
}

class _WelcomeActionButtonsState extends State<WelcomeActionButtons> {
  bool _isNavigating = false;

  void _navigateTo(String routeName) {
    if (_isNavigating) return;
    setState(() => _isNavigating = true);

    Navigator.of(context).pushNamed(routeName).then((_) {
      if (mounted) {
        setState(() => _isNavigating = false);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final strings = LocaleScope.of(context).strings;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24.0),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // 1. Primary Button — "ચાલો શરૂ કરીએ →"
          SizedBox(
            width: double.infinity,
            height: 54.0,
            child: ElevatedButton(
              onPressed: () => _navigateTo(AppRoutes.createAccount),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primaryBlue,
                foregroundColor: Colors.white,
                elevation: 3.0,
                shadowColor: AppColors.primaryBlue.withValues(alpha: 0.35),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(28.0),
                ),
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
              ),
              child: FittedBox(
                fit: BoxFit.scaleDown,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      strings.primaryButton,
                      style: const TextStyle(
                        fontSize: 18.0,
                        fontWeight: FontWeight.w700,
                        letterSpacing: 0.2,
                      ),
                    ),
                    const SizedBox(width: 10.0),
                    const Icon(
                      Icons.arrow_forward_rounded,
                      size: 22.0,
                      color: Colors.white,
                    ),
                  ],
                ),
              ),
            ),
          ),

          const SizedBox(height: 14.0),

          // 2. Secondary Button — "👤 પહેલેથી એકાઉન્ટ છે? Login"
          SizedBox(
            width: double.infinity,
            height: 52.0,
            child: OutlinedButton(
              onPressed: () => _navigateTo(AppRoutes.login),
              style: OutlinedButton.styleFrom(
                backgroundColor: Colors.white,
                side: const BorderSide(color: AppColors.textNavy, width: 1.6),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(28.0),
                ),
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
              ),
              child: FittedBox(
                fit: BoxFit.scaleDown,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(
                      Icons.person,
                      size: 20.0,
                      color: AppColors.textNavy,
                    ),
                    const SizedBox(width: 8.0),
                    Text.rich(
                      TextSpan(
                        children: [
                          TextSpan(
                            text: strings.secondaryButtonPrefix,
                            style: const TextStyle(
                              color: AppColors.textNavy,
                              fontSize: 15.5,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                          TextSpan(
                            text: strings.secondaryButtonAction,
                            style: const TextStyle(
                              color: AppColors.primaryBlue,
                              fontSize: 15.5,
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
