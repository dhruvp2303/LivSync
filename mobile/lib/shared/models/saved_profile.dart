/// Saved / Bookmarked profile entity.
class SavedProfile {
  final String id;
  final String userId;
  final String candidateId;
  final DateTime createdAt;

  const SavedProfile({
    required this.id,
    required this.userId,
    required this.candidateId,
    required this.createdAt,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'user_id': userId,
      'candidate_id': candidateId,
      'created_at': createdAt.toIso8601String(),
    };
  }

  factory SavedProfile.fromMap(Map<String, dynamic> map, String docId) {
    return SavedProfile(
      id: docId,
      userId: map['user_id'] as String? ?? '',
      candidateId: map['candidate_id'] as String? ?? '',
      createdAt: map['created_at'] != null
          ? DateTime.tryParse(map['created_at'].toString()) ?? DateTime.now()
          : DateTime.now(),
    );
  }
}
