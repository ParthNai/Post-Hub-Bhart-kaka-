import 'package:flutter/material.dart';
import 'package:panchayat_post/core/constants/app_colors.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/features/auth/data/auth_service.dart';

/// Password Requirements Card matching Screen 03 reference:
/// Light blue card with shield icon, title "પાસવર્ડ માટે સુચના:", and 3 requirement indicators.
/// Dynamic checkmarks highlight as requirements are fulfilled.
class PasswordGuidelinesWidget extends StatelessWidget {
  const PasswordGuidelinesWidget({
    super.key,
    required this.password,
  });

  final String password;

  @override
  Widget build(BuildContext context) {
    final strings = LocaleScope.of(context).strings;

    final hasMinLength = AuthService.validatePasswordMinLength(password);
    final hasUpperLower = AuthService.validatePasswordCases(password);
    final hasNumber = AuthService.validatePasswordNumber(password);

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 12.0, vertical: 10.0),
      decoration: BoxDecoration(
        color: const Color(0xFFEEF5FF),
        borderRadius: BorderRadius.circular(12.0),
        border: Border.all(color: const Color(0xFFCCE0FF), width: 1.0),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header with shield icon
          FittedBox(
            fit: BoxFit.scaleDown,
            alignment: Alignment.centerLeft,
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  padding: const EdgeInsets.all(2.0),
                  decoration: BoxDecoration(
                    color: AppColors.primaryBlue,
                    borderRadius: BorderRadius.circular(4.0),
                  ),
                  child: const Icon(
                    Icons.check,
                    color: Colors.white,
                    size: 13.0,
                  ),
                ),
                const SizedBox(width: 8.0),
                Text(
                  strings.passwordInstructionsTitle,
                  style: const TextStyle(
                    fontSize: 13.0,
                    fontWeight: FontWeight.w700,
                    color: AppColors.primaryBlue,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 8.0),

          // 3 Inline requirement chips with divider
          FittedBox(
            fit: BoxFit.scaleDown,
            alignment: Alignment.centerLeft,
            child: Row(
              children: [
                _buildRuleChip(
                  label: strings.passwordRuleMinChars,
                  isMet: hasMinLength,
                ),
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 6.0),
                  child: Text('|', style: TextStyle(color: Color(0xFF94A3B8), fontSize: 11)),
                ),
                _buildRuleChip(
                  label: strings.passwordRuleCase,
                  isMet: hasUpperLower,
                ),
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 6.0),
                  child: Text('|', style: TextStyle(color: Color(0xFF94A3B8), fontSize: 11)),
                ),
                _buildRuleChip(
                  label: strings.passwordRuleNumber,
                  isMet: hasNumber,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRuleChip({required String label, required bool isMet}) {
    final activeColor = isMet ? AppColors.primaryBlue : const Color(0xFF64748B);

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(
          isMet ? Icons.check_circle : Icons.circle_outlined,
          color: isMet ? AppColors.primaryBlue : const Color(0xFF94A3B8),
          size: 13.5,
        ),
        const SizedBox(width: 4.0),
        Text(
          label,
          style: TextStyle(
            fontSize: 11.5,
            fontWeight: isMet ? FontWeight.w600 : FontWeight.w500,
            color: activeColor,
          ),
        ),
      ],
    );
  }
}
