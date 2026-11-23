/// Represents a registered user account and profile in Panchayat Post.
class UserProfile {
  UserProfile({
    required this.userId,
    required this.fullName,
    required this.username,
    required this.passwordHash,
    required this.createdAt,
    this.displayName,
    this.profilePhotoUrl,
    this.villageCity,
    this.state,
    this.isProfileComplete = false,
    this.updatedAt,
    this.status = 'active',
    this.acceptedLegalVersion = '1.0',
    required this.acceptedLegalTimestamp,
  });

  final String userId;
  final String fullName;
  final String username;
  final String passwordHash;
  final DateTime createdAt;
  final String? displayName;
  final String? profilePhotoUrl;
  final String? villageCity;
  final String? state;
  final bool isProfileComplete;
  final DateTime? updatedAt;
  final String status;
  final String acceptedLegalVersion;
  final DateTime acceptedLegalTimestamp;

  /// Effective display name falling back to full name or username.
  String get effectiveDisplayName {
    if (displayName != null && displayName!.trim().isNotEmpty) {
      return displayName!.trim();
    }
    if (fullName.trim().isNotEmpty) {
      return fullName.trim();
    }
    return username;
  }

  UserProfile copyWith({
    String? userId,
    String? fullName,
    String? username,
    String? passwordHash,
    DateTime? createdAt,
    String? displayName,
    String? profilePhotoUrl,
    String? villageCity,
    String? state,
    bool? isProfileComplete,
    DateTime? updatedAt,
    String? status,
    String? acceptedLegalVersion,
    DateTime? acceptedLegalTimestamp,
  }) {
    return UserProfile(
      userId: userId ?? this.userId,
      fullName: fullName ?? this.fullName,
      username: username ?? this.username,
      passwordHash: passwordHash ?? this.passwordHash,
      createdAt: createdAt ?? this.createdAt,
      displayName: displayName ?? this.displayName,
      profilePhotoUrl: profilePhotoUrl ?? this.profilePhotoUrl,
      villageCity: villageCity ?? this.villageCity,
      state: state ?? this.state,
      isProfileComplete: isProfileComplete ?? this.isProfileComplete,
      updatedAt: updatedAt ?? this.updatedAt,
      status: status ?? this.status,
      acceptedLegalVersion: acceptedLegalVersion ?? this.acceptedLegalVersion,
      acceptedLegalTimestamp: acceptedLegalTimestamp ?? this.acceptedLegalTimestamp,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'userId': userId,
      'fullName': fullName,
      'username': username,
      'passwordHash': passwordHash,
      'createdAt': createdAt.toIso8601String(),
      'displayName': displayName,
      'profilePhotoUrl': profilePhotoUrl,
      'villageCity': villageCity,
      'state': state,
      'isProfileComplete': isProfileComplete,
      'updatedAt': updatedAt?.toIso8601String(),
      'status': status,
      'acceptedLegalVersion': acceptedLegalVersion,
      'acceptedLegalTimestamp': acceptedLegalTimestamp.toIso8601String(),
    };
  }

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    return UserProfile(
      userId: json['userId'] as String,
      fullName: json['fullName'] as String,
      username: json['username'] as String,
      passwordHash: json['passwordHash'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
      displayName: json['displayName'] as String?,
      profilePhotoUrl: json['profilePhotoUrl'] as String?,
      villageCity: json['villageCity'] as String?,
      state: json['state'] as String?,
      isProfileComplete: (json['isProfileComplete'] as bool?) ?? false,
      updatedAt: json['updatedAt'] != null ? DateTime.parse(json['updatedAt'] as String) : null,
      status: (json['status'] as String?) ?? 'active',
      acceptedLegalVersion: (json['acceptedLegalVersion'] as String?) ?? '1.0',
      acceptedLegalTimestamp: DateTime.parse(json['acceptedLegalTimestamp'] as String),
    );
  }
}
