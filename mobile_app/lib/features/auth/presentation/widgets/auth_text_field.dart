import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:panchayat_post/core/constants/app_colors.dart';

/// Reusable input field matching the Panchayat Post authentication screens:
/// - Prominent label above field with leading icon
/// - Rounded input container with prefix icon and optional suffix widget
/// - Inline error message and helper text below
class AuthTextField extends StatelessWidget {
  const AuthTextField({
    super.key,
    required this.label,
    required this.hintText,
    required this.controller,
    this.labelIcon,
    this.prefixWidget,
    this.suffixWidget,
    this.obscureText = false,
    this.keyboardType,
    this.textInputAction,
    this.validator,
    this.onChanged,
    this.helperText,
    this.errorText,
    this.autofillHints,
    this.inputFormatters,
  });

  final String label;
  final String hintText;
  final TextEditingController controller;
  final Widget? labelIcon;
  final Widget? prefixWidget;
  final Widget? suffixWidget;
  final bool obscureText;
  final TextInputType? keyboardType;
  final TextInputAction? textInputAction;
  final String? Function(String?)? validator;
  final ValueChanged<String>? onChanged;
  final String? helperText;
  final String? errorText;
  final Iterable<String>? autofillHints;
  final List<TextInputFormatter>? inputFormatters;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Label with icon above the input
        FittedBox(
          fit: BoxFit.scaleDown,
          alignment: Alignment.centerLeft,
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (labelIcon != null) ...[
                labelIcon!,
                const SizedBox(width: 6.0),
              ],
              Text(
                label,
                style: const TextStyle(
                  fontSize: 14.5,
                  fontWeight: FontWeight.w700,
                  color: AppColors.textNavy,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 8.0),

        // Text Form Field
        TextFormField(
          controller: controller,
          obscureText: obscureText,
          keyboardType: keyboardType,
          textInputAction: textInputAction,
          validator: validator,
          onChanged: onChanged,
          autofillHints: autofillHints,
          inputFormatters: inputFormatters,
          style: const TextStyle(
            fontSize: 15.0,
            fontWeight: FontWeight.w500,
            color: AppColors.textNavy,
          ),
          decoration: InputDecoration(
            hintText: hintText,
            hintStyle: const TextStyle(
              fontSize: 14.5,
              fontWeight: FontWeight.w400,
              color: Color(0xFF94A3B8),
            ),
            filled: true,
            fillColor: Colors.white,
            contentPadding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 14.0),
            prefixIcon: prefixWidget != null
                ? Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 14.0),
                    child: prefixWidget,
                  )
                : null,
            prefixIconConstraints: const BoxConstraints(minWidth: 44, minHeight: 44),
            suffixIcon: suffixWidget != null
                ? Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 10.0),
                    child: suffixWidget,
                  )
                : null,
            suffixIconConstraints: const BoxConstraints(minWidth: 44, minHeight: 44),
            errorText: errorText,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12.0),
              borderSide: const BorderSide(color: Color(0xFFE2E8F0), width: 1.2),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12.0),
              borderSide: const BorderSide(color: Color(0xFFE2E8F0), width: 1.2),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12.0),
              borderSide: const BorderSide(color: AppColors.primaryBlue, width: 1.8),
            ),
            errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12.0),
              borderSide: const BorderSide(color: Color(0xFFEF4444), width: 1.2),
            ),
            focusedErrorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12.0),
              borderSide: const BorderSide(color: Color(0xFFEF4444), width: 1.8),
            ),
          ),
        ),

        // Helper text below field if present
        if (helperText != null && errorText == null) ...[
          const SizedBox(height: 5.0),
          Row(
            children: [
              const Icon(
                Icons.info_outline_rounded,
                size: 13.5,
                color: Color(0xFF64748B),
              ),
              const SizedBox(width: 4.0),
              Expanded(
                child: Text(
                  helperText!,
                  style: const TextStyle(
                    fontSize: 12.0,
                    fontWeight: FontWeight.w400,
                    color: Color(0xFF64748B),
                  ),
                ),
              ),
            ],
          ),
        ],
      ],
    );
  }
}
