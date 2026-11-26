import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

/// Reusable 4-digit numeric PIN input component.
/// Displays exactly 4 separate input boxes in a horizontal row with auto-advance,
/// backspace handling, paste support, and obscured digit rendering.
class FourDigitPinField extends StatefulWidget {
  const FourDigitPinField({
    super.key,
    required this.onChanged,
    this.onCompleted,
    this.hasError = false,
    this.errorMessage,
    this.obscureText = true,
    this.initialValue = '',
    this.autofocus = false,
  });

  final ValueChanged<String> onChanged;
  final ValueChanged<String>? onCompleted;
  final bool hasError;
  final String? errorMessage;
  final bool obscureText;
  final String initialValue;
  final bool autofocus;

  @override
  State<FourDigitPinField> createState() => _FourDigitPinFieldState();
}

class _FourDigitPinFieldState extends State<FourDigitPinField> {
  late final List<TextEditingController> _controllers;
  late final List<FocusNode> _focusNodes;

  @override
  void initState() {
    super.initState();
    _controllers = List.generate(4, (_) => TextEditingController());
    _focusNodes = List.generate(4, (_) => FocusNode());

    if (widget.initialValue.isNotEmpty) {
      final digits = widget.initialValue.replaceAll(RegExp(r'\D'), '');
      for (int i = 0; i < 4 && i < digits.length; i++) {
        _controllers[i].text = digits[i];
      }
    }

    if (widget.autofocus && _focusNodes.isNotEmpty) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (mounted) _focusNodes[0].requestFocus();
      });
    }
  }

  @override
  void dispose() {
    for (final c in _controllers) {
      c.dispose();
    }
    for (final fn in _focusNodes) {
      fn.dispose();
    }
    super.dispose();
  }

  String get _currentPin {
    return _controllers.map((c) => c.text).join();
  }

  void _notify() {
    final pin = _currentPin;
    widget.onChanged(pin);
    if (pin.length == 4 && widget.onCompleted != null) {
      widget.onCompleted!(pin);
    }
  }

  void _handlePaste(String text) {
    final digits = text.replaceAll(RegExp(r'\D'), '');
    if (digits.length >= 4) {
      for (int i = 0; i < 4; i++) {
        _controllers[i].text = digits[i];
      }
      _focusNodes[3].requestFocus();
      _notify();
    }
  }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final totalWidth = constraints.maxWidth;
        // Dynamically compute width for 4 boxes with spacing
        final boxWidth = ((totalWidth - 36) / 4).clamp(48.0, 72.0);

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: List.generate(4, (index) {
                return _buildDigitBox(index, boxWidth);
              }),
            ),
            if (widget.hasError && widget.errorMessage != null && widget.errorMessage!.isNotEmpty) ...[
              const SizedBox(height: 6),
              Row(
                children: [
                  const Icon(Icons.error_outline_rounded, size: 14, color: Color(0xFFEF4444)),
                  const SizedBox(width: 4),
                  Expanded(
                    child: Text(
                      widget.errorMessage!,
                      style: const TextStyle(
                        color: Color(0xFFEF4444),
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ],
        );
      },
    );
  }

  Widget _buildDigitBox(int index, double boxWidth) {
    return Focus(
      onKeyEvent: (node, event) {
        if (event is KeyDownEvent && event.logicalKey == LogicalKeyboardKey.backspace) {
          if (_controllers[index].text.isEmpty && index > 0) {
            _focusNodes[index - 1].requestFocus();
            _controllers[index - 1].selection = TextSelection.fromPosition(
              TextPosition(offset: _controllers[index - 1].text.length),
            );
            return KeyEventResult.handled;
          }
        }
        return KeyEventResult.ignored;
      },
      child: AnimatedBuilder(
        animation: Listenable.merge([_focusNodes[index], _controllers[index]]),
        builder: (context, _) {
          final isFocused = _focusNodes[index].hasFocus;
          final hasValue = _controllers[index].text.isNotEmpty;

          Color borderColor = const Color(0xFFE2E8F0);
          double borderWidth = 1.0;

          if (widget.hasError) {
            borderColor = const Color(0xFFEF4444);
            borderWidth = 1.5;
          } else if (isFocused) {
            borderColor = const Color(0xFF2563EB);
            borderWidth = 1.8;
          } else if (hasValue) {
            borderColor = const Color(0xFFCBD5E1);
          }

          return Container(
            width: boxWidth,
            height: 56,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(
                color: borderColor,
                width: borderWidth,
              ),
              boxShadow: isFocused
                  ? [
                      BoxShadow(
                        color: const Color(0xFF2563EB).withValues(alpha: 0.12),
                        blurRadius: 8,
                        offset: const Offset(0, 2),
                      ),
                    ]
                  : null,
            ),
            alignment: Alignment.center,
            child: TextField(
              controller: _controllers[index],
              focusNode: _focusNodes[index],
              keyboardType: TextInputType.number,
              textAlign: TextAlign.center,
              maxLength: 1,
              obscureText: widget.obscureText,
              obscuringCharacter: '●',
              style: const TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
                color: Color(0xFF0F172A),
                letterSpacing: 2,
              ),
              inputFormatters: [
                FilteringTextInputFormatter.digitsOnly,
                LengthLimitingTextInputFormatter(1),
              ],
              decoration: const InputDecoration(
                counterText: '',
                border: InputBorder.none,
                contentPadding: EdgeInsets.zero,
                isDense: true,
              ),
              onChanged: (val) {
                if (val.length > 1) {
                  _handlePaste(val);
                  return;
                }
                if (val.isNotEmpty) {
                  if (index < 3) {
                    _focusNodes[index + 1].requestFocus();
                  } else {
                    _focusNodes[index].unfocus();
                  }
                }
                _notify();
              },
            ),
          );
        },
      ),
    );
  }
}
