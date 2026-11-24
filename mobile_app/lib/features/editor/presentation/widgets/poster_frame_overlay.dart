import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:panchayat_post/core/services/app_config_service.dart';
import 'package:panchayat_post/features/auth/domain/models/user_profile.dart';

/// Reusable poster frame definition metadata.
class PosterFrameDef {
  const PosterFrameDef({
    required this.id,
    required this.name,
    required this.previewColor,
    this.badgeText,
    this.imageUrl,
  });

  final String id;
  final String name;
  final Color previewColor;
  final String? badgeText;
  final String? imageUrl;
}

/// Available built-in and designer poster frames.
class PosterFrames {
  static const List<PosterFrameDef> list = [
    PosterFrameDef(
      id: 'none',
      name: 'No Frame',
      previewColor: Color(0xFF94A3B8),
      badgeText: 'Clean',
    ),
    PosterFrameDef(
      id: 'cutout_leader',
      name: 'Cutout Leader',
      previewColor: Color(0xFFEA580C),
      badgeText: 'Trending',
    ),
    PosterFrameDef(
      id: 'gold_vip',
      name: 'VIP Gold',
      previewColor: Color(0xFFEAB308),
      badgeText: 'Popular',
    ),
    PosterFrameDef(
      id: 'tricolor',
      name: 'Tricolor Bharat',
      previewColor: Color(0xFFFF9933),
      badgeText: 'National',
    ),
    PosterFrameDef(
      id: 'royal_blue',
      name: 'Royal Executive',
      previewColor: Color(0xFF2563EB),
      badgeText: 'Leader',
    ),
    PosterFrameDef(
      id: 'kesariya_ribbon',
      name: 'Kesariya Festive',
      previewColor: Color(0xFFEA580C),
      badgeText: 'Festive',
    ),
    PosterFrameDef(
      id: 'dark_glass',
      name: 'Dark Glass',
      previewColor: Color(0xFF0F172A),
      badgeText: 'Modern',
    ),
  ];
}

/// Pixel-perfect visual frame overlay rendering on the poster canvas.
/// Supports both built-in Panchayat & VIP designer frames and admin-uploaded image frames.
class PosterFrameOverlay extends StatelessWidget {
  const PosterFrameOverlay({
    super.key,
    required this.frameId,
    this.user,
    required this.w,
    required this.h,
    this.adminImageUrl,
    this.customPhotoUrl,
    this.onTapPhoto,
  });

  final String frameId;
  final UserProfile? user;
  final double w;
  final double h;
  final String? adminImageUrl;
  final String? customPhotoUrl;
  final VoidCallback? onTapPhoto;

  @override
  Widget build(BuildContext context) {
    if (frameId == 'none') return const SizedBox.shrink();

    // If it's a custom admin uploaded image frame
    if (adminImageUrl != null && adminImageUrl!.isNotEmpty) {
      return _buildAdminImageFrame();
    }

    switch (frameId) {
      case 'cutout_leader':
        return _buildCutoutLeaderFrame();
      case 'gold_vip':
        return _buildGoldVipFrame();
      case 'tricolor':
        return _buildTricolorFrame();
      case 'royal_blue':
        return _buildRoyalBlueFrame();
      case 'kesariya_ribbon':
        return _buildKesariyaRibbonFrame();
      case 'dark_glass':
        return _buildDarkGlassFrame();
      default:
        return _buildGoldVipFrame();
    }
  }

  String get _displayName =>
      user?.effectiveDisplayName.isNotEmpty == true
          ? user!.effectiveDisplayName
          : 'રાહુલ પટેલ';

  String get _designation {
    if (user?.villageCity != null && user!.villageCity!.isNotEmpty) {
      return 'સરપંચ - ${user!.villageCity}';
    }
    return 'સરપંચ - ગ્રામ પંચાયત';
  }

  String get _phone {
    final raw = user?.username ?? '';
    if (raw.length == 10 && int.tryParse(raw) != null) {
      return '+91 $raw';
    }
    return '+91 98765 43210';
  }

  double get _scale => (w / 340.0).clamp(0.6, 1.8);

  String? get _effectivePhotoUrl {
    if (customPhotoUrl != null && customPhotoUrl!.isNotEmpty) {
      return customPhotoUrl;
    }
    return user?.profilePhotoUrl;
  }

  Widget _buildResolvedImage(
    String? url, {
    required BoxFit fit,
    required Widget fallback,
    Alignment alignment = Alignment.center,
  }) {
    if (url == null || url.isEmpty) return fallback;

    if (url.startsWith('http://') || url.startsWith('https://')) {
      return Image.network(
        url,
        fit: fit,
        alignment: alignment,
        errorBuilder: (_, _, _) => fallback,
      );
    }

    if (url.startsWith('data:image') || url.length > 200) {
      try {
        final cleanBase64 = url.contains(',') ? url.split(',').last : url;
        final bytes = base64Decode(cleanBase64);
        return Image.memory(
          bytes,
          fit: fit,
          alignment: alignment,
          errorBuilder: (_, _, _) => fallback,
        );
      } catch (_) {
        return fallback;
      }
    }

    return Image.asset(
      url,
      fit: fit,
      alignment: alignment,
      errorBuilder: (_, _, _) => fallback,
    );
  }

  // 0. Transparent Background Cutout Leader Frame (Signature Indian Panchayat / Sarpanch Style)
  Widget _buildCutoutLeaderFrame() {
    final frameH = (h * 0.18).clamp(44.0, 95.0);
    final cutoutH = (frameH * 1.5).clamp(65.0, 140.0);
    final cutoutW = cutoutH * 0.75;

    return Stack(
      clipBehavior: Clip.none,
      children: [
        // Bottom Frame Banner
        Positioned(
          bottom: 0,
          left: 0,
          right: 0,
          height: frameH,
          child: Container(
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                begin: Alignment.centerLeft,
                end: Alignment.centerRight,
                colors: [Color(0xFFEA580C), Color(0xFF9A3412), Color(0xFF7C2D12)],
              ),
              border: const Border(
                top: BorderSide(color: Color(0xFFFDE047), width: 2.5),
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.45),
                  blurRadius: 8.0,
                  offset: const Offset(0, -3),
                ),
              ],
            ),
            padding: EdgeInsets.only(
              left: cutoutW + 10.0 * _scale,
              right: 12.0 * _scale,
              top: 4.0 * _scale,
              bottom: 4.0 * _scale,
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Row(
                  children: [
                    Flexible(
                      child: Text(
                        _displayName,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: (frameH * 0.23).clamp(11.0, 15.5),
                          fontWeight: FontWeight.w900,
                          letterSpacing: 0.2,
                          shadows: const [
                            Shadow(color: Colors.black45, blurRadius: 4, offset: Offset(0, 1)),
                          ],
                        ),
                      ),
                    ),
                    SizedBox(width: 4.0 * _scale),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 5.0, vertical: 1.5),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFDE047),
                        borderRadius: BorderRadius.circular(4.0),
                      ),
                      child: const Text(
                        'સરપંચ',
                        style: TextStyle(color: Color(0xFF7C2D12), fontWeight: FontWeight.w800, fontSize: 8.5),
                      ),
                    ),
                  ],
                ),
                Text(
                  _designation,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    color: const Color(0xFFFEF08A),
                    fontSize: (frameH * 0.17).clamp(8.5, 12.0),
                    fontWeight: FontWeight.w700,
                  ),
                ),
                Text(
                  _phone,
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: (frameH * 0.16).clamp(8.0, 11.0),
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
        ),

        // Transparent Background Cutout User Portrait rising above the banner
        Positioned(
          bottom: 0,
          left: 10.0 * _scale,
          width: cutoutW,
          height: cutoutH,
          child: _buildCutoutPhoto(cutoutW, cutoutH),
        ),
      ],
    );
  }

  Widget _buildCutoutPhoto(double w, double h) {
    final photo = ShaderMask(
      shaderCallback: (Rect bounds) {
        return const LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [Colors.black, Colors.black, Colors.black, Colors.transparent],
          stops: [0.0, 0.70, 0.90, 1.0],
        ).createShader(bounds);
      },
      blendMode: BlendMode.dstIn,
      child: Container(
        alignment: Alignment.bottomCenter,
        child: _buildResolvedImage(
          _effectivePhotoUrl,
          fit: BoxFit.contain,
          alignment: Alignment.bottomCenter,
          fallback: _fallbackCutoutAvatar(h),
        ),
      ),
    );

    if (onTapPhoto != null) {
      return GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: onTapPhoto,
        child: Stack(
          alignment: Alignment.bottomCenter,
          children: [
            photo,
            Positioned(
              top: 6,
              right: 6,
              child: Container(
                padding: const EdgeInsets.all(4.0),
                decoration: const BoxDecoration(
                  color: Color(0xFFEA580C),
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(color: Colors.black26, blurRadius: 4, offset: Offset(0, 1)),
                  ],
                ),
                child: const Icon(Icons.camera_alt_rounded, size: 12.0, color: Colors.white),
              ),
            ),
          ],
        ),
      );
    }

    return photo;
  }

  Widget _fallbackCutoutAvatar(double h) {
    return Container(
      width: h * 0.65,
      height: h * 0.85,
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(16.0),
        border: Border.all(color: const Color(0xFFFDE047), width: 1.5),
      ),
      child: Center(
        child: Icon(Icons.person_rounded, size: h * 0.45, color: Colors.white70),
      ),
    );
  }

  // 1. VIP Gold Panchayat Frame
  Widget _buildGoldVipFrame() {
    final frameH = (h * 0.20).clamp(46.0, 110.0);
    final photoSize = frameH * 0.74;

    return Positioned(
      bottom: 0,
      left: 0,
      right: 0,
      height: frameH,
      child: Container(
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [Color(0xFF0F172A), Color(0xFF1E293B)],
          ),
          border: const Border(
            top: BorderSide(color: Color(0xFFF59E0B), width: 3.0),
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.5),
              blurRadius: 10.0,
              offset: const Offset(0, -3),
            ),
          ],
        ),
        padding: EdgeInsets.symmetric(horizontal: 8.0 * _scale, vertical: 3.0 * _scale),
        child: Row(
          children: [
            // User Photo badge
            _buildCircularPhoto(photoSize, const Color(0xFFF59E0B)),
            SizedBox(width: 8.0 * _scale),

            // User Info Column
            Expanded(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Flexible(
                        child: Text(
                          _displayName,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            color: const Color(0xFFFDE047),
                            fontSize: (frameH * 0.22).clamp(10.0, 15.0),
                            fontWeight: FontWeight.w800,
                            letterSpacing: 0.2,
                            shadows: const [
                              Shadow(color: Colors.black87, blurRadius: 4.0),
                            ],
                          ),
                        ),
                      ),
                      SizedBox(width: 3.0 * _scale),
                      Icon(Icons.stars_rounded, color: const Color(0xFFF59E0B), size: (frameH * 0.20).clamp(10.0, 14.0)),
                    ],
                  ),
                  Text(
                    _designation,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: (frameH * 0.17).clamp(8.0, 11.5),
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.phone_in_talk_rounded, color: const Color(0xFFFDE68A), size: (frameH * 0.16).clamp(8.0, 11.0)),
                      SizedBox(width: 3.0 * _scale),
                      Text(
                        _phone,
                        style: TextStyle(
                          color: const Color(0xFFFEF08A),
                          fontSize: (frameH * 0.16).clamp(8.0, 11.0),
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            // Panchayat Emblem Icon / Dynamic Admin Logo
            Padding(
              padding: EdgeInsets.only(left: 4.0 * _scale),
              child: Container(
                width: (frameH * 0.38).clamp(24.0, 36.0),
                height: (frameH * 0.38).clamp(24.0, 36.0),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: const Color(0xFFF59E0B).withValues(alpha: 0.18),
                  border: Border.all(color: const Color(0xFFF59E0B), width: 1.2),
                ),
                child: ClipOval(
                  child: Builder(
                    builder: (context) {
                      final config = AppConfigService.instance.config;
                      final logoUrl = config.logoUrl ?? config.appIconUrl;
                      if (logoUrl != null && logoUrl.isNotEmpty) {
                        final fullUrl = AppConfigService.instance.resolveMediaUrl(logoUrl);
                        return Image.network(
                          fullUrl,
                          fit: BoxFit.contain,
                          errorBuilder: (context, error, stackTrace) => Icon(
                            Icons.account_balance_rounded,
                            color: const Color(0xFFFDE047),
                            size: (frameH * 0.24).clamp(14.0, 22.0),
                          ),
                        );
                      }
                      return Icon(
                        Icons.account_balance_rounded,
                        color: const Color(0xFFFDE047),
                        size: (frameH * 0.24).clamp(14.0, 22.0),
                      );
                    },
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // 2. Tricolor Bharat Pride Frame
  Widget _buildTricolorFrame() {
    final frameH = (h * 0.20).clamp(46.0, 110.0);
    final photoSize = frameH * 0.72;

    return Positioned(
      bottom: 0,
      left: 0,
      right: 0,
      height: frameH,
      child: Column(
        children: [
          // Saffron top stripe
          Container(height: 3.0 * _scale, color: const Color(0xFFFF9933)),
          Expanded(
            child: Container(
              color: Colors.white,
              padding: EdgeInsets.symmetric(horizontal: 8.0 * _scale, vertical: 2.0 * _scale),
              child: Row(
                children: [
                  _buildCircularPhoto(photoSize, const Color(0xFF000080)),
                  SizedBox(width: 8.0 * _scale),
                  Expanded(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          _displayName,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            color: const Color(0xFF000080),
                            fontSize: (frameH * 0.22).clamp(10.0, 15.0),
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                        Text(
                          _designation,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            color: const Color(0xFF334155),
                            fontSize: (frameH * 0.17).clamp(8.0, 11.5),
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.call, color: const Color(0xFF138808), size: (frameH * 0.16).clamp(8.0, 11.0)),
                            SizedBox(width: 3.0 * _scale),
                            Text(
                              _phone,
                              style: TextStyle(
                                color: const Color(0xFF138808),
                                fontSize: (frameH * 0.16).clamp(8.0, 11.0),
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  Icon(Icons.flag_rounded, color: const Color(0xFFFF9933), size: (frameH * 0.28).clamp(16.0, 24.0)),
                ],
              ),
            ),
          ),
          // Green bottom stripe
          Container(height: 3.0 * _scale, color: const Color(0xFF138808)),
        ],
      ),
    );
  }

  // 3. Royal Blue Executive Frame
  Widget _buildRoyalBlueFrame() {
    final frameH = (h * 0.20).clamp(46.0, 110.0);
    final photoSize = frameH * 0.74;

    return Positioned(
      bottom: 0,
      left: 0,
      right: 0,
      height: frameH,
      child: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [Color(0xFF1D4ED8), Color(0xFF172554)],
          ),
          border: Border(
            top: BorderSide(color: Color(0xFF60A5FA), width: 2.5),
          ),
        ),
        padding: EdgeInsets.symmetric(horizontal: 8.0 * _scale, vertical: 3.0 * _scale),
        child: Row(
          children: [
            _buildCircularPhoto(photoSize, const Color(0xFF60A5FA)),
            SizedBox(width: 8.0 * _scale),
            Expanded(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Flexible(
                        child: Text(
                          _displayName,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: (frameH * 0.22).clamp(10.0, 15.0),
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                      ),
                      SizedBox(width: 3.0 * _scale),
                      Icon(Icons.verified, color: const Color(0xFF38BDF8), size: (frameH * 0.18).clamp(10.0, 14.0)),
                    ],
                  ),
                  Text(
                    _designation,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      color: const Color(0xFF93C5FD),
                      fontSize: (frameH * 0.17).clamp(8.0, 11.5),
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  Text(
                    _phone,
                    style: TextStyle(
                      color: Colors.white70,
                      fontSize: (frameH * 0.16).clamp(8.0, 11.0),
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // 4. Kesariya Festive Ribbon Frame
  Widget _buildKesariyaRibbonFrame() {
    final frameH = (h * 0.20).clamp(46.0, 110.0);
    final photoSize = frameH * 0.74;

    return Positioned(
      bottom: 0,
      left: 0,
      right: 0,
      height: frameH,
      child: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFFEA580C), Color(0xFF9A3412)],
          ),
          border: Border(
            top: BorderSide(color: Color(0xFFFDE047), width: 2.5),
          ),
        ),
        padding: EdgeInsets.symmetric(horizontal: 8.0 * _scale, vertical: 3.0 * _scale),
        child: Row(
          children: [
            _buildCircularPhoto(photoSize, const Color(0xFFFDE047)),
            SizedBox(width: 8.0 * _scale),
            Expanded(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    _displayName,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      color: const Color(0xFFFEF08A),
                      fontSize: (frameH * 0.22).clamp(10.0, 15.0),
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  Text(
                    _designation,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: (frameH * 0.17).clamp(8.0, 11.5),
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  Text(
                    _phone,
                    style: TextStyle(
                      color: const Color(0xFFFEF08A),
                      fontSize: (frameH * 0.16).clamp(8.0, 11.0),
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ],
              ),
            ),
            Icon(Icons.festival_rounded, color: const Color(0xFFFDE047), size: (frameH * 0.28).clamp(16.0, 24.0)),
          ],
        ),
      ),
    );
  }

  // 5. Dark Glass Frame
  Widget _buildDarkGlassFrame() {
    final frameH = (h * 0.19).clamp(44.0, 105.0);
    final photoSize = frameH * 0.72;

    return Positioned(
      bottom: 0,
      left: 0,
      right: 0,
      height: frameH,
      child: Container(
        decoration: BoxDecoration(
          color: const Color(0xEB0F172A),
          border: Border(
            top: BorderSide(color: Colors.white.withValues(alpha: 0.15), width: 1.2),
          ),
        ),
        padding: EdgeInsets.symmetric(horizontal: 10.0 * _scale, vertical: 3.0 * _scale),
        child: Row(
          children: [
            _buildCircularPhoto(photoSize, Colors.white38),
            SizedBox(width: 8.0 * _scale),
            Expanded(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    _displayName,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: (frameH * 0.22).clamp(10.0, 15.0),
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  Text(
                    _designation,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      color: Colors.white70,
                      fontSize: (frameH * 0.17).clamp(8.0, 11.5),
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  Text(
                    _phone,
                    style: TextStyle(
                      color: const Color(0xFF38BDF8),
                      fontSize: (frameH * 0.16).clamp(8.0, 11.0),
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Admin image frame overlay
  Widget _buildAdminImageFrame() {
    final frameH = (h * 0.16).clamp(42.0, 85.0);
    final photoSize = (frameH * 1.05).clamp(44.0, 80.0);

    return Stack(
      clipBehavior: Clip.none,
      children: [
        // 1. The Full Transparent Admin Frame Graphic Overlay
        Positioned.fill(
          child: IgnorePointer(
            child: _buildResolvedImage(
              adminImageUrl,
              fit: BoxFit.fill,
              fallback: const SizedBox.shrink(),
            ),
          ),
        ),

        // 2. Dynamic Leader Info & Photo Overlay at Bottom of Canvas
        Positioned(
          bottom: 6.0 * _scale,
          left: 14.0 * _scale,
          right: 14.0 * _scale,
          height: frameH,
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              _buildCircularPhoto(photoSize, const Color(0xFFFBBF24)),
              SizedBox(width: 10.0 * _scale),
              Expanded(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      _displayName,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: (frameH * 0.24).clamp(11.0, 16.0),
                        fontWeight: FontWeight.w900,
                        shadows: const [
                          Shadow(color: Colors.black, blurRadius: 4, offset: Offset(0, 1)),
                        ],
                      ),
                    ),
                    SizedBox(height: 2.0 * _scale),
                    Text(
                      _designation,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        color: const Color(0xFFFEF08A),
                        fontSize: (frameH * 0.18).clamp(9.0, 12.0),
                        fontWeight: FontWeight.w700,
                        shadows: const [
                          Shadow(color: Colors.black, blurRadius: 4, offset: Offset(0, 1)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                padding: EdgeInsets.symmetric(horizontal: 7.0 * _scale, vertical: 3.0 * _scale),
                decoration: BoxDecoration(
                  color: Colors.black.withValues(alpha: 0.65),
                  borderRadius: BorderRadius.circular(6.0),
                  border: Border.all(color: const Color(0xFFFBBF24), width: 1.0),
                ),
                child: Text(
                  _phone,
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: (frameH * 0.16).clamp(8.5, 11.0),
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildCircularPhoto(double size, Color ringColor) {
    final photo = Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        border: Border.all(color: ringColor, width: 2.0),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.35),
            blurRadius: 6.0,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: ClipOval(
        child: _buildResolvedImage(
          _effectivePhotoUrl,
          fit: BoxFit.cover,
          fallback: _fallbackAvatar(),
        ),
      ),
    );

    if (onTapPhoto != null) {
      return GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: onTapPhoto,
        child: Stack(
          alignment: Alignment.center,
          children: [
            photo,
            Positioned(
              bottom: 0,
              right: 0,
              child: Container(
                padding: const EdgeInsets.all(3.0),
                decoration: BoxDecoration(
                  color: ringColor,
                  shape: BoxShape.circle,
                  boxShadow: const [
                    BoxShadow(color: Colors.black26, blurRadius: 3),
                  ],
                ),
                child: const Icon(Icons.camera_alt_rounded, size: 10.0, color: Colors.white),
              ),
            ),
          ],
        ),
      );
    }

    return photo;
  }

  Widget _fallbackAvatar() {
    return Container(
      color: const Color(0xFF1E293B),
      child: Center(
        child: Text(
          _displayName.characters.isNotEmpty ? _displayName.characters.first : 'P',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.w800,
            fontSize: 16.0 * _scale,
          ),
        ),
      ),
    );
  }
}
