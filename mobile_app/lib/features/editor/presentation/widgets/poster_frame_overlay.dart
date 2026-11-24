import 'package:flutter/material.dart';
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
  });

  final String frameId;
  final UserProfile? user;
  final double w;
  final double h;
  final String? adminImageUrl;

  @override
  Widget build(BuildContext context) {
    if (frameId == 'none') return const SizedBox.shrink();

    // If it's a custom admin uploaded image frame
    if (adminImageUrl != null && adminImageUrl!.isNotEmpty) {
      return _buildAdminImageFrame();
    }

    switch (frameId) {
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

            // Panchayat Emblem Icon
            Padding(
              padding: EdgeInsets.only(left: 4.0 * _scale),
              child: Container(
                padding: EdgeInsets.all(4.0 * _scale),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: const Color(0xFFF59E0B).withValues(alpha: 0.18),
                  border: Border.all(color: const Color(0xFFF59E0B), width: 1.2),
                ),
                child: Icon(
                  Icons.account_balance_rounded,
                  color: const Color(0xFFFDE047),
                  size: (frameH * 0.26).clamp(14.0, 22.0),
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
    return Positioned.fill(
      child: IgnorePointer(
        child: adminImageUrl!.startsWith('http')
            ? Image.network(
                adminImageUrl!,
                fit: BoxFit.fill,
                errorBuilder: (_, _, _) => const SizedBox.shrink(),
              )
            : Image.asset(
                adminImageUrl!,
                fit: BoxFit.fill,
                errorBuilder: (_, _, _) => const SizedBox.shrink(),
              ),
      ),
    );
  }

  Widget _buildCircularPhoto(double size, Color ringColor) {
    return Container(
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
        child: user?.profilePhotoUrl != null && user!.profilePhotoUrl!.isNotEmpty
            ? (user!.profilePhotoUrl!.startsWith('http')
                ? Image.network(
                    user!.profilePhotoUrl!,
                    fit: BoxFit.cover,
                    errorBuilder: (_, _, _) => _fallbackAvatar(),
                  )
                : Image.asset(
                    user!.profilePhotoUrl!,
                    fit: BoxFit.cover,
                    errorBuilder: (_, _, _) => _fallbackAvatar(),
                  ))
            : _fallbackAvatar(),
      ),
    );
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
