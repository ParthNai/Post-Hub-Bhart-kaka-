import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:panchayat_post/core/localization/locale_controller.dart';
import 'package:panchayat_post/core/routes/app_routes.dart';
import 'package:panchayat_post/features/festivals/data/services/festival_service.dart';
import 'package:panchayat_post/features/festivals/presentation/screens/festivals_screen.dart';

Widget buildTestableFestivalsScreen({
  Size size = const Size(390, 844),
  LocaleController? localeController,
  FestivalService? festivalService,
}) {
  return LocaleScope(
    controller: localeController ?? LocaleController(),
    child: MaterialApp(
      routes: {
        for (final entry in AppRoutes.routes.entries)
          if (entry.key != AppRoutes.splash) entry.key: entry.value,
      },
      home: MediaQuery(
        data: MediaQueryData(size: size),
        child: FestivalsScreen(
          festivalService: festivalService,
        ),
      ),
    ),
  );
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  late LocaleController englishController;

  setUp(() {
    englishController = LocaleController(initialLanguage: 'en');
  });

  group('Screen 10: Festival & Upcoming Events Listing UI & Component Tests', () {
    testWidgets('Renders all approved Screen 10 UI elements accurately matching reference', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableFestivalsScreen(localeController: englishController));
      await tester.pumpAndSettle();

      // A. Header (Strict: Original Logo badge only, NO "Panchayat Post" text beside logo)
      expect(find.byKey(const Key('festival_back_button')), findsOneWidget);
      expect(find.byIcon(Icons.arrow_back_rounded), findsOneWidget);
      expect(find.text('Festivals'), findsWidgets); // Header title & Nav tab
      expect(find.text('Discover beautiful festival designs'), findsOneWidget);
      expect(find.byIcon(Icons.notifications_none_rounded), findsOneWidget);

      // B. Search Bar with Filter
      expect(find.text('Search festivals, occasions...'), findsOneWidget);
      expect(find.byIcon(Icons.search_rounded), findsOneWidget);
      expect(find.byIcon(Icons.tune_rounded), findsOneWidget);

      // C. Featured Festival Banner
      expect(find.text('UPCOMING FESTIVAL'), findsOneWidget);
      expect(find.text('Navratri'), findsWidgets);
      expect(find.text('Celebration'), findsOneWidget);
      expect(find.text('Explore beautiful festive designs'), findsOneWidget);
      expect(find.text('View Designs'), findsWidgets);

      // D. Explore Categories Section
      expect(find.text('Explore Categories'), findsOneWidget);
      expect(find.text('All'), findsOneWidget);
      expect(find.text('Hindu Festivals'), findsOneWidget);
      expect(find.text('National Days'), findsOneWidget);

      // E. Upcoming Festivals Section (2-Column Grid)
      expect(find.text('Upcoming Festivals'), findsOneWidget);
      expect(find.text('View Calendar'), findsOneWidget);

      expect(find.text('Independence Day'), findsOneWidget);
      expect(find.text('Diwali'), findsOneWidget);
      expect(find.text('Ganesh Chaturthi'), findsOneWidget);

      expect(find.text('Oct 1, 2025'), findsOneWidget);
      expect(find.text('Aug 15, 2025'), findsOneWidget);
      expect(find.text('Oct 20, 2025'), findsOneWidget);
      expect(find.text('Aug 27, 2025'), findsOneWidget);
      expect(find.text('Upcoming'), findsWidgets);

      // F. Bottom Navigation Bar
      expect(find.text('Home'), findsOneWidget);
      expect(find.text('Templates'), findsOneWidget);
      expect(find.text('My Designs'), findsOneWidget);
      expect(find.text('Profile'), findsOneWidget);
      expect(find.byIcon(Icons.home_rounded), findsOneWidget);
      expect(find.byIcon(Icons.calendar_month_rounded), findsWidgets);
    });

    testWidgets('Tapping Notification Bell opens notifications sheet', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableFestivalsScreen(localeController: englishController));
      await tester.pumpAndSettle();

      final bell = find.byIcon(Icons.notifications_none_rounded);
      expect(bell, findsOneWidget);

      await tester.tap(bell);
      await tester.pumpAndSettle();

      expect(find.textContaining('Notifications'), findsWidgets);
      expect(find.text('Mark all read'), findsOneWidget);
    });

    testWidgets('Tapping Filter button opens filter modal with status options', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableFestivalsScreen(localeController: englishController));
      await tester.pumpAndSettle();

      final filterBtn = find.byIcon(Icons.tune_rounded);
      expect(filterBtn, findsOneWidget);

      await tester.tap(filterBtn);
      await tester.pumpAndSettle();

      expect(find.textContaining('Filter'), findsWidgets);
      expect(find.text('Reset All'), findsOneWidget);
      expect(find.text('Apply Filter'), findsOneWidget);
    });

    testWidgets('Tapping View Calendar opens chronological festival calendar sheet', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableFestivalsScreen(localeController: englishController));
      await tester.pumpAndSettle();

      final calendarAction = find.text('View Calendar');
      expect(calendarAction, findsOneWidget);

      await tester.tap(calendarAction);
      await tester.pumpAndSettle();

      expect(find.text('Festival Calendar 2026'), findsOneWidget);
      expect(find.text('Oct 1, 2025'), findsWidgets);
    });

    testWidgets('Tapping a category chip filters the upcoming festival grid', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableFestivalsScreen(localeController: englishController));
      await tester.pumpAndSettle();

      final nationalChip = find.text('National Days');
      expect(nationalChip, findsOneWidget);

      await tester.tap(nationalChip);
      await tester.pumpAndSettle();

      // National Day matches, Diwali is filtered out
      expect(find.text('Independence Day'), findsOneWidget);
      expect(find.text('Diwali'), findsNothing);
    });

    testWidgets('Searching for a festival dynamically filters results', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableFestivalsScreen(localeController: englishController));
      await tester.pumpAndSettle();

      final searchField = find.byType(TextField).first;
      await tester.enterText(searchField, 'Diwali');
      await tester.pumpAndSettle();

      // Search results list has Diwali card, Independence Day is filtered out
      expect(find.widgetWithText(Container, 'Diwali'), findsWidgets);
      expect(find.text('Independence Day'), findsNothing);
    });

    testWidgets('Search with no match displays clean empty state', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableFestivalsScreen(localeController: englishController));
      await tester.pumpAndSettle();

      final searchField = find.byType(TextField).first;
      await tester.enterText(searchField, 'UnknownNonExistentOccasion');
      await tester.pumpAndSettle();

      expect(find.byIcon(Icons.search_off_rounded), findsOneWidget);
      expect(find.text('Clear Search'), findsOneWidget);
    });

    testWidgets('Tapping View Designs on a festival card opens festival details screen', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      await tester.pumpWidget(buildTestableFestivalsScreen(localeController: englishController));
      await tester.pumpAndSettle();

      // Tap View Designs on Navratri banner
      final viewDesignsBtn = find.text('View Designs').first;
      await tester.tap(viewDesignsBtn);
      await tester.pumpAndSettle();

      expect(find.textContaining('Festival Details'), findsWidgets);
    });

    testWidgets('Tapping Back Button returns to previous screen', (tester) async {
      tester.view.physicalSize = const Size(390, 844);
      tester.view.devicePixelRatio = 1.0;
      addTearDown(tester.view.resetPhysicalSize);

      bool returnedBack = false;

      await tester.pumpWidget(
        LocaleScope(
          controller: englishController,
          child: MaterialApp(
            home: Scaffold(
              body: Builder(
                builder: (ctx) => ElevatedButton(
                  onPressed: () {
                    Navigator.of(ctx).push(
                      MaterialPageRoute(
                        builder: (_) => const FestivalsScreen(),
                      ),
                    ).then((_) {
                      returnedBack = true;
                    });
                  },
                  child: const Text('Open Festivals'),
                ),
              ),
            ),
          ),
        ),
      );
      await tester.pumpAndSettle();

      await tester.tap(find.text('Open Festivals'));
      await tester.pumpAndSettle();

      expect(find.text('Discover beautiful festival designs'), findsOneWidget);

      final backBtn = find.byKey(const Key('festival_back_button'));
      await tester.tap(backBtn);
      await tester.pumpAndSettle();

      expect(returnedBack, isTrue);
      expect(find.text('Open Festivals'), findsOneWidget);
    });
  });

  group('Screen 10: Responsive Layout Across Mobile Screen Sizes', () {
    const screenSizes = [
      Size(360, 640),  // Small Android
      Size(390, 844),  // Standard iPhone
      Size(412, 915),  // Large Android
      Size(768, 1024), // Tablet
    ];

    for (final size in screenSizes) {
      testWidgets('Zero overflow on screen size ${size.width}x${size.height}', (tester) async {
        tester.view.physicalSize = size;
        tester.view.devicePixelRatio = 1.0;
        addTearDown(tester.view.resetPhysicalSize);

        await tester.pumpWidget(buildTestableFestivalsScreen(
          size: size,
          localeController: englishController,
        ));
        await tester.pumpAndSettle();

        expect(tester.takeException(), isNull);
        expect(find.text('Festivals'), findsWidgets);
        expect(find.text('Search festivals, occasions...'), findsOneWidget);
        expect(find.text('UPCOMING FESTIVAL'), findsOneWidget);
        expect(find.text('Explore Categories'), findsOneWidget);
        expect(find.text('Upcoming Festivals'), findsOneWidget);
      });
    }
  });
}
