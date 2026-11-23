import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:panchayat_post/main.dart';
import 'package:panchayat_post/features/splash/presentation/screens/splash_screen.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('PanchayatPostApp launches, mounts SplashScreen and navigates to Welcome', (WidgetTester tester) async {
    SharedPreferences.setMockInitialValues({});

    await tester.pumpWidget(const PanchayatPostApp());
    expect(find.byType(SplashScreen), findsOneWidget);

    // Fast-forward past minimum splash delay
    await tester.pump(const Duration(milliseconds: 2600));
    // Pump navigation route transition
    await tester.pump(const Duration(milliseconds: 500));

    // Default first-time launch lands on Screen 02 Welcome screen
    expect(find.text('ચાલો શરૂ કરીએ'), findsOneWidget);
    expect(find.text('Panchayat'), findsOneWidget);
  });
}
