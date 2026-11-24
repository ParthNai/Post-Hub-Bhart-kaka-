import 'dart:async';
import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:panchayat_post/core/services/app_config_service.dart';
import 'package:panchayat_post/core/services/session_service.dart';

class HomeContentException implements Exception {
  const HomeContentException(this.message);

  final String message;

  @override
  String toString() => message;
}

class HomeContentService {
  HomeContentService({required this.sessionService, http.Client? httpClient})
    : _httpClient = httpClient ?? http.Client(),
      _ownsClient = httpClient == null;

  final SessionService sessionService;
  final http.Client _httpClient;
  final bool _ownsClient;

  Future<HomeExploreContent> load() async {
    final token = await sessionService.getAuthToken();
    final headers = <String, String>{'Accept': 'application/json'};
    if (token != null && token.trim().isNotEmpty) {
      headers['Authorization'] = token;
    }

    final baseUrl = AppConfigService.instance.serverBaseUrl.replaceAll(
      RegExp(r'/+$'),
      '',
    );
    final uri = Uri.parse('$baseUrl/api/explore');
    late final http.Response response;
    try {
      response = await _httpClient
          .get(
            uri,
            headers: headers,
          )
          .timeout(const Duration(seconds: 15));
    } on TimeoutException {
      throw const HomeContentException(
        'The admin content request timed out. Check your connection and try again.',
      );
    } on http.ClientException {
      throw const HomeContentException(
        'Could not connect to the server. Check your connection and try again.',
      );
    }

    if (response.statusCode < 200 || response.statusCode >= 300) {
      final message = _readErrorMessage(response.body);
      throw HomeContentException(
        message ??
            'Could not load admin content (HTTP ${response.statusCode}).',
      );
    }

    late final Object? decoded;
    try {
      decoded = jsonDecode(response.body);
    } on FormatException {
      throw const HomeContentException(
        'The server returned an invalid admin content response.',
      );
    }
    if (decoded is! Map<String, dynamic>) {
      throw const HomeContentException(
        'The server returned an invalid admin content response.',
      );
    }

    try {
      return HomeExploreContent.fromApiResponse(decoded);
    } on FormatException catch (error) {
      throw HomeContentException(
        'The server returned incomplete admin content: ${error.message}',
      );
    }
  }

  String? _readErrorMessage(String body) {
    try {
      final decoded = jsonDecode(body);
      if (decoded is Map<String, dynamic>) {
        final message = decoded['message'];
        if (message is String && message.trim().isNotEmpty) {
          return message.trim();
        }
      }
    } on FormatException {
      return null;
    }
    return null;
  }

  void dispose() {
    if (_ownsClient) _httpClient.close();
  }
}

class HomeExploreContent {
  const HomeExploreContent({required this.templates, required this.festivals});

  final List<HomeContentTemplate> templates;
  final List<HomeContentFestival> festivals;

  factory HomeExploreContent.fromApiResponse(Map<String, dynamic> response) {
    final data = response['data'];
    if (data is! Map<String, dynamic>) {
      throw const FormatException('missing data object');
    }

    return HomeExploreContent(
      templates: _parseTemplates(data['subCategories']),
      festivals: _parseFestivals(data['upComingFestivals']),
    );
  }

  static List<HomeContentTemplate> _parseTemplates(Object? value) {
    if (value is! List) {
      throw const FormatException('missing subCategories list');
    }

    final templates = <HomeContentTemplate>[];
    for (final item in value) {
      if (item is! Map<String, dynamic>) {
        throw const FormatException('invalid template item');
      }
      final title = _string(item['subcategoryName']);
      final imageUrl = _firstImagePath(item['images']);
      if (title.isNotEmpty && imageUrl != null) {
        templates.add(HomeContentTemplate(title: title, imageUrl: imageUrl));
      }
    }
    return templates;
  }

  static List<HomeContentFestival> _parseFestivals(Object? value) {
    if (value is! List) {
      throw const FormatException('missing upComingFestivals list');
    }

    final festivals = <HomeContentFestival>[];
    for (final item in value) {
      if (item is! Map<String, dynamic>) {
        throw const FormatException('invalid festival item');
      }

      final festival = item['festival'];
      final festivalData = festival is Map<String, dynamic>
          ? festival
          : const <String, dynamic>{};
      final title = _string(festivalData['festivalName']).isNotEmpty
          ? _string(festivalData['festivalName'])
          : _string(item['postName']);
      if (title.isEmpty) continue;

      festivals.add(
        HomeContentFestival(
          title: title,
          date: _string(item['postStartDate']),
          imageUrl:
              _firstImagePath(festivalData['festivalImages']) ??
              _firstImagePath(item['postImages']),
        ),
      );
    }
    return festivals;
  }

  static String? _firstImagePath(Object? value) {
    if (value is! List) return null;
    for (final image in value) {
      if (image is String && image.trim().isNotEmpty) return image.trim();
      if (image is Map<String, dynamic>) {
        final path = _string(image['path']);
        if (path.isNotEmpty) return path;
      }
    }
    return null;
  }

  static String _string(Object? value) => value is String ? value.trim() : '';
}

class HomeContentTemplate {
  const HomeContentTemplate({required this.title, required this.imageUrl});

  final String title;
  final String imageUrl;
}

class HomeContentFestival {
  const HomeContentFestival({
    required this.title,
    required this.date,
    required this.imageUrl,
  });

  final String title;
  final String date;
  final String? imageUrl;
}
