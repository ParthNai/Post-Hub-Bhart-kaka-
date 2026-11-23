/// Domain entity representing an Account Recovery / Password Reset Request.
class RecoveryRequest {
  RecoveryRequest({
    required this.referenceId,
    required this.username,
    required this.createdAt,
    this.updatedAt,
    this.status = 'Submitted',
    this.statusMessage,
    this.supportHelpline = '1800-123-7262',
    this.supportEmail = 'support@panchayatpost.in',
  });

  final String referenceId;
  final String username;
  final DateTime createdAt;
  final DateTime? updatedAt;
  final String status;
  final String? statusMessage;
  final String supportHelpline;
  final String supportEmail;

  /// Returns masked username (e.g. "ra••••ch" or "••••") to avoid exposing full username.
  String get maskedUsername {
    final clean = username.trim();
    if (clean.length <= 3) return '••••';
    if (clean.length <= 5) {
      return '${clean[0]}•••${clean[clean.length - 1]}';
    }
    return '${clean.substring(0, 2)}••••${clean.substring(clean.length - 2)}';
  }

  RecoveryRequest copyWith({
    String? referenceId,
    String? username,
    DateTime? createdAt,
    DateTime? updatedAt,
    String? status,
    String? statusMessage,
    String? supportHelpline,
    String? supportEmail,
  }) {
    return RecoveryRequest(
      referenceId: referenceId ?? this.referenceId,
      username: username ?? this.username,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      status: status ?? this.status,
      statusMessage: statusMessage ?? this.statusMessage,
      supportHelpline: supportHelpline ?? this.supportHelpline,
      supportEmail: supportEmail ?? this.supportEmail,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'referenceId': referenceId,
      'username': username,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt?.toIso8601String(),
      'status': status,
      'statusMessage': statusMessage,
      'supportHelpline': supportHelpline,
      'supportEmail': supportEmail,
    };
  }

  factory RecoveryRequest.fromJson(Map<String, dynamic> json) {
    return RecoveryRequest(
      referenceId: json['referenceId'] as String,
      username: json['username'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: json['updatedAt'] != null ? DateTime.parse(json['updatedAt'] as String) : null,
      status: (json['status'] as String?) ?? 'Submitted',
      statusMessage: json['statusMessage'] as String?,
      supportHelpline: (json['supportHelpline'] as String?) ?? '1800-123-7262',
      supportEmail: (json['supportEmail'] as String?) ?? 'support@panchayatpost.in',
    );
  }
}
