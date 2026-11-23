import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'app_localizations.dart';

/// Global controller managing user's selected language preference.
/// Persists the selected language in SharedPreferences so it survives app restarts.
class LocaleController extends ChangeNotifier {
  LocaleController({
    SharedPreferences? preferences,
    String initialLanguage = AppStrings.defaultLanguageCode,
  })  : _prefs = preferences,
        _currentLanguageCode = initialLanguage;

  static const String _keyLanguageCode = 'selected_language_code';
  SharedPreferences? _prefs;
  String _currentLanguageCode;

  String get currentLanguageCode => _currentLanguageCode;
  AppStrings get strings => AppStrings.of(_currentLanguageCode);

  /// Loads saved language code asynchronously if previously stored.
  Future<void> loadSavedLanguage() async {
    _prefs ??= await SharedPreferences.getInstance();
    final savedCode = _prefs?.getString(_keyLanguageCode);
    if (savedCode != null && (savedCode == 'gu' || savedCode == 'hi' || savedCode == 'en')) {
      if (_currentLanguageCode != savedCode) {
        _currentLanguageCode = savedCode;
        notifyListeners();
      }
    }
  }

  /// Changes language immediately and persists the choice.
  Future<void> setLanguage(String code) async {
    if (code == _currentLanguageCode) return;
    _currentLanguageCode = code;
    notifyListeners();

    _prefs ??= await SharedPreferences.getInstance();
    await _prefs?.setString(_keyLanguageCode, code);
  }
}

/// InheritedWidget to provide LocaleController down the widget tree.
class LocaleScope extends InheritedNotifier<LocaleController> {
  const LocaleScope({
    super.key,
    required LocaleController controller,
    required super.child,
  }) : super(notifier: controller);

  static LocaleController of(BuildContext context) {
    final scope = context.dependOnInheritedWidgetOfExactType<LocaleScope>();
    assert(scope != null, 'No LocaleScope found in context');
    return scope!.notifier!;
  }

  static LocaleController? maybeOf(BuildContext context) {
    final scope = context.dependOnInheritedWidgetOfExactType<LocaleScope>();
    return scope?.notifier;
  }
}
