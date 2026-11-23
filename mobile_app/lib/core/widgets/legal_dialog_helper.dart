import 'package:flutter/material.dart';
import 'package:panchayat_post/core/constants/app_colors.dart';

/// Helper utility to display the full, production-quality Privacy Policy
/// and Terms & Conditions modal dialogs for Panchayat Post.
class LegalDialogHelper {
  LegalDialogHelper._();

  static void showPolicyDialog(BuildContext context, {required bool isPrivacy}) {
    final title = isPrivacy ? 'Privacy Policy' : 'Terms & Conditions';
    final content = isPrivacy
        ? 'Panchayat Post respects your privacy. We are dedicated to protecting your personal information and ensuring transparency in how your data is handled.\n\n'
          '1. Information We Collect: Basic account information such as full name and unique username to personalize your poster creations and village announcements.\n'
          '2. Security: User passwords are encrypted with industry-standard cryptographic salted hashing (SHA-256) before storage. Plain-text passwords are never saved or transmitted.\n'
          '3. Data Usage: Content is used solely for generating and sharing village festival, governance, and celebration posters.\n'
          '4. No Third-Party Selling: We never sell or distribute your personal information to unauthorized third-party advertisers.\n'
          '5. Account Control: Users have the right to request deletion or update of their account details at any time.'
        : 'Welcome to Panchayat Post. By accessing or using our application, you agree to comply with and be bound by the following Terms & Conditions.\n\n'
          '1. Acceptable Use: Panchayat Post is created to celebrate Indian festivals, village governance achievements, local initiatives, and positive community news.\n'
          '2. User Responsibility: Users agree not to post defamatory, offensive, hateful, or infringing materials.\n'
          '3. Intellectual Property: The Panchayat Post brand, logos, and custom layout designs are protected under Indian copyright and intellectual property laws.\n'
          '4. Account Security: You are responsible for maintaining the confidentiality of your username and password credentials.\n'
          '5. Service Availability: We continuously work to keep the platform reliable, fast, and accessible for all villages across India.';

    showDialog<void>(
      context: context,
      builder: (dialogCtx) {
        return AlertDialog(
          backgroundColor: Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18.0)),
          title: Row(
            children: [
              Icon(
                isPrivacy ? Icons.verified_user_outlined : Icons.article_outlined,
                color: AppColors.primaryBlue,
                size: 24,
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  title,
                  style: const TextStyle(
                    fontSize: 18.0,
                    fontWeight: FontWeight.w700,
                    color: AppColors.textNavy,
                  ),
                ),
              ),
            ],
          ),
          content: SingleChildScrollView(
            child: Text(
              content,
              style: const TextStyle(
                fontSize: 13.5,
                color: AppColors.textSlate,
                height: 1.45,
              ),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(dialogCtx),
              child: const Text(
                'Close',
                style: TextStyle(
                  color: AppColors.primaryBlue,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          ],
        );
      },
    );
  }
}
