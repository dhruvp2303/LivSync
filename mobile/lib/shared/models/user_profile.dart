/// Model representing a user's public and account profile.
class UserProfile {
  final String id;
  final String displayName;
  final String? avatarUrl;
  final String city;
  final String occupation;
  final String bio;
  final int? age;
  final String? gender;
  final bool isProfileComplete;
  final bool isVisible;
  final DateTime createdAt;
  final DateTime updatedAt;

  const UserProfile({
    required this.id,
    required this.displayName,
    this.avatarUrl,
    this.city = '',
    this.occupation = '',
    this.bio = '',
    this.age,
    this.gender,
    this.isProfileComplete = false,
    this.isVisible = true,
    required this.createdAt,
    required this.updatedAt,
  });

  UserProfile copyWith({
    String? id,
    String? displayName,
    String? avatarUrl,
    String? city,
    String? occupation,
    String? bio,
    int? age,
    String? gender,
    bool? isProfileComplete,
    bool? isVisible,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return UserProfile(
      id: id ?? this.id,
      displayName: displayName ?? this.displayName,
      avatarUrl: avatarUrl ?? this.avatarUrl,
      city: city ?? this.city,
      occupation: occupation ?? this.occupation,
      bio: bio ?? this.bio,
      age: age ?? this.age,
      gender: gender ?? this.gender,
      isProfileComplete: isProfileComplete ?? this.isProfileComplete,
      isVisible: isVisible ?? this.isVisible,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'display_name': displayName,
      'avatar_url': avatarUrl,
      'city': city,
      'occupation': occupation,
      'bio': bio,
      'age': age,
      'gender': gender,
      'profile_complete': isProfileComplete,
      'is_visible': isVisible,
      'created_at': createdAt.toIso8601String(),
      'updated_at': updatedAt.toIso8601String(),
    };
  }

  factory UserProfile.fromMap(Map<String, dynamic> map, String docId) {
    return UserProfile(
      id: docId,
      displayName: map['display_name'] as String? ?? '',
      avatarUrl: map['avatar_url'] as String?,
      city: map['city'] as String? ?? '',
      occupation: map['occupation'] as String? ?? '',
      bio: map['bio'] as String? ?? '',
      age: (map['age'] as num?)?.toInt(),
      gender: map['gender'] as String?,
      isProfileComplete: map['profile_complete'] as bool? ?? false,
      isVisible: map['is_visible'] as bool? ?? true,
      createdAt: map['created_at'] != null
          ? DateTime.tryParse(map['created_at'].toString()) ?? DateTime.now()
          : DateTime.now(),
      updatedAt: map['updated_at'] != null
          ? DateTime.tryParse(map['updated_at'].toString()) ?? DateTime.now()
          : DateTime.now(),
    );
  }
}
