# panchayat_post

A new Flutter project.

## Getting Started

This project is a starting point for a Flutter application.

A few resources to get you started if this is your first Flutter project:

- [Learn Flutter](https://docs.flutter.dev/get-started/learn-flutter)
- [Write your first Flutter app](https://docs.flutter.dev/get-started/codelab)
- [Flutter learning resources](https://docs.flutter.dev/reference/learning-resources)

For help getting started with Flutter development, view the
[online documentation](https://docs.flutter.dev/), which offers tutorials,
samples, guidance on mobile development, and a full API reference.

## Photo frame background removal

On Android and iOS, photos selected for a festival frame are segmented on-device
with Google ML Kit Selfie Segmentation. The photo is not sent to a background
removal service. Web and desktop builds do not support this ML Kit feature; they
offer the original photo as an explicit fallback.

The first iOS build downloads the three ML Kit model resource bundles from the
upstream release and copies them into the app. An internet connection is
required for that initial build; the downloaded bundles are cached locally and
excluded from version control.

## Screenshot protection

Android enables `FLAG_SECURE` for the whole app, blocking screenshots and screen
recordings and hiding the app preview in the recent-apps switcher. This setting
does not apply to iOS or web; iOS does not provide a supported API to block
screenshots.

## Saving generated posters

Festival posters are rendered from the preview and saved to the device gallery
on Android and iOS. The operating system may ask for photo-library access on
the first save. Web and desktop builds do not support gallery saving.

## Android push notifications

The Android app uses OneSignal for push subscriptions and notification display.
Create an Android app in OneSignal, configure its Firebase credentials, and
place that app's `google-services.json` at `android/app/google-services.json`.
The file is intentionally ignored by Git. Register the Firebase Android app
with package `com.panchayatpost.panchayat_post` and use the same Firebase
project configured in OneSignal.

Build or run the app with the public OneSignal App ID:

```shell
flutter run --dart-define=ONESIGNAL_APP_ID=<onesignal-app-id>
```

Configure `ONESIGNAL_APP_ID` and `ONESIGNAL_REST_API_KEY` in the backend's
private `.env` file. Keep the REST API key server-side; never put it in Flutter
or commit it. The app requests notification permission on first launch.
