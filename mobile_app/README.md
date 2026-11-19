# PostHub mobile app

The app opens directly on the login screen and checks for newly published login
design changes every 30 seconds while open. It also refreshes immediately when
the app returns to the foreground, so users do not need to restart it. Email
and password sign-in uses
`POST /api/app/auth/login`; the returned member bearer token is kept in secure
storage. Password recovery and account creation are UI placeholders. The Google
button opens a clearly marked demo preview; it does not authenticate with
Google or create a backend session.

After login, the app opens the published **Home** screen from the admin app
configuration. Its title, colors, banner, section visibility and order,
category rail, and template grid settings are read from the Home screen's
published admin configuration.

The app also includes a browse-first occasion catalog with templates for
festivals, celebrations, and business promotions. Region and optional business
preferences are stored locally; users can browse without filling in a profile.
Templates can be customized with a message, business name, and color palette,
then saved locally or exported/shared as a PNG. The included catalog and copy
are curated demo content, the preferred-language setting does not translate
the interface yet, and AI generation is not connected.

## Run locally

Start the PostHub web/API server on port 3000, then run the Flutter app from
this directory:

```shell
flutter pub get
flutter run
```

Chrome and iOS simulator use `http://localhost:3000` by default. The Android
emulator uses `http://10.0.2.2:3000`. To use another API host:

```shell
flutter run -d chrome --dart-define=POSTHUB_API_BASE_URL=https://your-api-host
```

For Flutter web in production, set `APP_WEB_ORIGINS` on the API server to a
comma-separated list of the deployed web-app origins.

Run the widget tests with:

```shell
flutter test
```
