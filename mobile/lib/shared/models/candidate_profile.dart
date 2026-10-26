import 'user_profile.dart';
import 'living_preferences.dart';
import 'compatibility_result.dart';

/// Aggregated presentation model representing a discovered roommate candidate.
class CandidateProfile {
  final UserProfile profile;
  final LivingPreferences? preferences;
  final CompatibilityResult compatibility;
  final bool isSaved;
  final String requestStatus; // 'none', 'pending', 'accepted', 'rejected', 'received'

  const CandidateProfile({
    required this.profile,
    this.preferences,
    required this.compatibility,
    this.isSaved = false,
    this.requestStatus = 'none',
  });

  CandidateProfile copyWith({
    UserProfile? profile,
    LivingPreferences? preferences,
    CompatibilityResult? compatibility,
    bool? isSaved,
    String? requestStatus,
  }) {
    return CandidateProfile(
      profile: profile ?? this.profile,
      preferences: preferences ?? this.preferences,
      compatibility: compatibility ?? this.compatibility,
      isSaved: isSaved ?? this.isSaved,
      requestStatus: requestStatus ?? this.requestStatus,
    );
  }
}
