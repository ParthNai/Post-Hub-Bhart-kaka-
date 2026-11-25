import 'dart:convert';

import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:panchayat_post/core/services/session_service.dart';
import 'package:panchayat_post/features/home/data/home_content_service.dart';
import 'package:shared_preferences/shared_preferences.dart';

void main() {
  setUp(() {
    SharedPreferences.setMockInitialValues({});
  });

  test(
    'loads admin templates and upcoming festivals from the explore API',
    () async {
      final sessionService = SessionService();
      await sessionService.saveSession(
        token: 'test-token',
        userId: 'test-user',
      );
      final client = MockClient((request) async {
        expect(request.url.path, '/api/explore');
        expect(request.headers['Authorization'], 'test-token');
        return http.Response(
          jsonEncode({
            'data': {
              'subCategories': [
                {
                  'subcategoryName': 'Admin template',
                  'images': [
                    {'path': 'uploaded/image/template.png'},
                  ],
                },
              ],
              'upComingFestivals': [
                {
                  'postName': 'Admin event',
                  'postStartDate': '2026-12-01T00:00:00.000Z',
                  'festival': {
                    'festivalName': 'Admin festival',
                    'festivalImages': ['uploaded/image/festival.png'],
                  },
                },
              ],
            },
          }),
          200,
          headers: {'content-type': 'application/json'},
        );
      });
      final service = HomeContentService(
        sessionService: sessionService,
        httpClient: client,
      );

      final content = await service.load();

      expect(content.templates, hasLength(1));
      expect(content.templates.single.title, 'Admin template');
      expect(content.templates.single.imageUrl, 'uploaded/image/template.png');
      expect(content.festivals, hasLength(1));
      expect(content.festivals.single.title, 'Admin festival');
      expect(content.festivals.single.imageUrl, 'uploaded/image/festival.png');
      service.dispose();
    },
  );

  test(
    'reports an authentication error when there is no user session',
    () async {
      final client = MockClient((request) async {
        return http.Response(
          jsonEncode({'message': 'Please sign in to continue'}),
          401,
          headers: {'content-type': 'application/json'},
        );
      });
      final service = HomeContentService(
        sessionService: SessionService(),
        httpClient: client,
      );

      await expectLater(
        service.load(),
        throwsA(
          isA<HomeContentException>().having(
            (error) => error.message.toLowerCase(),
            'message',
            contains('sign in'),
          ),
        ),
      );
      service.dispose();
    },
  );
}
