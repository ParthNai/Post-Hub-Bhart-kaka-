import 'package:flutter/material.dart';
import 'package:panchayat_post/core/constants/app_colors.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/core/widgets/legal_dialog_helper.dart';

/// Footer widget rendering working Privacy Policy and Terms & Conditions links.
/// Uses FittedBox to guarantee clean responsive presentation without horizontal overflow.
class WelcomeLegalFooter extends StatelessWidget {
  const WelcomeLegalFooter({super.key});

  @override
  Widget build(BuildContext context) {
    final strings = LocaleScope.of(context).strings;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
      child: FittedBox(
        fit: BoxFit.scaleDown,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Privacy Policy
            InkWell(
              onTap: () => LegalDialogHelper.showPolicyDialog(context, isPrivacy: true),
              borderRadius: BorderRadius.circular(6.0),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 6.0, vertical: 4.0),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(
                      Icons.verified_user_outlined,
                      size: 15.0,
                      color: AppColors.textSlate,
                    ),
                    const SizedBox(width: 4.0),
                    Text(
                      strings.privacyPolicy,
                      style: const TextStyle(
                        fontSize: 12.8,
                        fontWeight: FontWeight.w500,
                        color: AppColors.textSlate,
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 8.0),
              child: Text(
                '|',
                style: TextStyle(color: Color(0xFFD1D5DB), fontSize: 13.0),
              ),
            ),

            // Terms & Conditions
            InkWell(
              onTap: () => LegalDialogHelper.showPolicyDialog(context, isPrivacy: false),
              borderRadius: BorderRadius.circular(6.0),
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 6.0, vertical: 4.0),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(
                      Icons.article_outlined,
                      size: 15.0,
                      color: AppColors.textSlate,
                    ),
                    const SizedBox(width: 4.0),
                    Text(
                      strings.termsAndConditions,
                      style: const TextStyle(
                        fontSize: 12.8,
                        fontWeight: FontWeight.w500,
                        color: AppColors.textSlate,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
