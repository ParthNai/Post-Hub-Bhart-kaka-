import 'package:flutter/material.dart';
import 'package:panchayat_post/core/constants/app_colors.dart';
import 'package:panchayat_post/core/localization/app_localizations.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';
import 'package:panchayat_post/features/splash/presentation/widgets/brand_logo_widget.dart';

/// Top header for Screen 03 Create Account:
/// - Left: Circular back button (<)
/// - Center: Panchayat Post logo + stacked "Panchayat\nPost" branding
/// - Right: Language selector pill (🌐 ગુજરાતી ˅)
class AuthHeaderWidget extends StatelessWidget {
  const AuthHeaderWidget({
    super.key,
    this.onBackPressed,
    this.showBackButton = true,
  });

  final VoidCallback? onBackPressed;
  final bool showBackButton;

  void _showLanguageSelector(BuildContext context) {
    final localeCtrl = LocaleScope.of(context);

    showModalBottomSheet<void>(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24.0)),
      ),
      builder: (sheetContext) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 24.0),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.language, color: AppColors.primaryBlue, size: 24),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        localeCtrl.strings.selectLanguageTitle,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w700,
                          color: AppColors.textNavy,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                ...AppStrings.supportedLanguages.map((lang) {
                  final isSelected = lang['code'] == localeCtrl.currentLanguageCode;
                  return InkWell(
                    borderRadius: BorderRadius.circular(12),
                    onTap: () {
                      final code = lang['code']!;
                      Navigator.pop(sheetContext);
                      localeCtrl.setLanguage(code);
                    },
                    child: Container(
                      margin: const EdgeInsets.symmetric(vertical: 4.0),
                      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 14.0),
                      decoration: BoxDecoration(
                        color: isSelected ? AppColors.waveCream : Colors.transparent,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: isSelected ? AppColors.accentOrange : const Color(0xFFE5E7EB),
                          width: isSelected ? 1.5 : 1.0,
                        ),
                      ),
                      child: Row(
                        children: [
                          Text(
                            lang['name']!,
                            style: TextStyle(
                              fontSize: 17,
                              fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                              color: isSelected ? AppColors.accentOrange : AppColors.textNavy,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              '(${lang['englishName']})',
                              style: const TextStyle(
                                fontSize: 14,
                                color: AppColors.textSlate,
                              ),
                            ),
                          ),
                          if (isSelected)
                            const Icon(
                              Icons.check_circle_rounded,
                              color: AppColors.accentOrange,
                              size: 22,
                            ),
                        ],
                      ),
                    ),
                  );
                }),
                const SizedBox(height: 8),
              ],
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final localeCtrl = LocaleScope.of(context);

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 12.0, vertical: 8.0),
      child: LayoutBuilder(
        builder: (context, constraints) {
          final targetWidth = constraints.maxWidth < 380.0 ? 380.0 : constraints.maxWidth;
          return ConstrainedBox(
            constraints: BoxConstraints(maxWidth: constraints.maxWidth),
            child: FittedBox(
              fit: BoxFit.scaleDown,
              child: SizedBox(
                width: targetWidth,
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    // Left: Circular Back Button or Home Icon
                    showBackButton
                        ? Material(
                            color: Colors.white,
                            shape: const CircleBorder(),
                            elevation: 1.0,
                            shadowColor: Colors.black.withValues(alpha: 0.12),
                            child: InkWell(
                              customBorder: const CircleBorder(),
                              onTap: onBackPressed ??
                                  () {
                                    if (Navigator.of(context).canPop()) {
                                      Navigator.of(context).pop();
                                    } else {
                                      Navigator.of(context).pushReplacementNamed(AppRoutes.welcome);
                                    }
                                  },
                              child: Container(
                                width: 40,
                                height: 40,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  border: Border.all(color: const Color(0xFFE5E7EB), width: 1.0),
                                ),
                                child: const Icon(
                                  Icons.arrow_back_ios_new_rounded,
                                  size: 16,
                                  color: AppColors.textNavy,
                                ),
                              ),
                            ),
                          )
                        : Container(
                            width: 40,
                            height: 40,
                            decoration: BoxDecoration(
                              color: const Color(0xFFEFF6FF),
                              shape: BoxShape.circle,
                              border: Border.all(color: const Color(0xFFBFDBFE), width: 1.0),
                            ),
                            child: const Icon(
                              Icons.home_rounded,
                              size: 20,
                              color: AppColors.primaryBlue,
                            ),
                          ),

                    // Center: Logo + stacked "Panchayat\nPost"
                    Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const BrandLogoWidget(
                          width: 38,
                          height: 32,
                        ),
                        const SizedBox(width: 6),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisSize: MainAxisSize.min,
                          children: const [
                            Text(
                              'Panchayat',
                              style: TextStyle(
                                fontSize: 15.5,
                                fontWeight: FontWeight.w800,
                                color: AppColors.textNavy,
                                height: 1.05,
                                letterSpacing: -0.3,
                              ),
                            ),
                            Text(
                              'Post',
                              style: TextStyle(
                                fontSize: 15.5,
                                fontWeight: FontWeight.w800,
                                color: AppColors.textNavy,
                                height: 1.05,
                                letterSpacing: -0.3,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),

                    // Right: Language Selector Pill
                    Material(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(22.0),
                      elevation: 1.0,
                      shadowColor: Colors.black.withValues(alpha: 0.12),
                      child: InkWell(
                        onTap: () => _showLanguageSelector(context),
                        borderRadius: BorderRadius.circular(22.0),
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10.0, vertical: 6.0),
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(22.0),
                            border: Border.all(color: const Color(0xFFE5E7EB), width: 1.0),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(
                                Icons.language,
                                size: 15.0,
                                color: AppColors.textNavy,
                              ),
                              const SizedBox(width: 4.0),
                              Text(
                                localeCtrl.strings.languageName,
                                style: const TextStyle(
                                  fontSize: 13.0,
                                  fontWeight: FontWeight.w700,
                                  color: AppColors.textNavy,
                                ),
                              ),
                              const SizedBox(width: 2.0),
                              const Icon(
                                Icons.keyboard_arrow_down_rounded,
                                size: 17.0,
                                color: AppColors.textNavy,
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
