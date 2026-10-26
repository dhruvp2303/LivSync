import '../../shared/models/user_profile.dart';
import '../../shared/models/living_preferences.dart';
import '../../shared/models/candidate_profile.dart';
import '../../shared/models/roommate_request.dart';
import '../../features/compatibility/domain/compatibility_engine.dart';

/// Abstract contract for profiles, preferences, and candidate queries.
abstract class ProfileRepository {
  Future<UserProfile?> getProfile(String uid);
  Future<void> saveProfile(UserProfile profile);

  Future<LivingPreferences?> getPreferences(String uid);
  Future<void> savePreferences(LivingPreferences preferences);

  Future<List<CandidateProfile>> getCandidates({
    required String currentUserId,
    required LivingPreferences? userPreferences,
  });

  Future<void> toggleSaveCandidate(String currentUserId, String candidateId);
  Future<List<CandidateProfile>> getSavedProfiles({
    required String currentUserId,
    required LivingPreferences? userPreferences,
  });

  Future<List<RoommateRequest>> getReceivedRequests(String userId);
  Future<List<RoommateRequest>> getSentRequests(String userId);
  Future<void> sendRequest({
    required String senderId,
    required String recipientId,
    String message = '',
  });
  Future<void> updateRequestStatus({
    required String requestId,
    required String status,
  });
}

/// In-memory repository seeded with candidate profiles from the reference design sheets.
class MockProfileRepository implements ProfileRepository {
  final CompatibilityEngine _engine = const CompatibilityEngine();

  final Map<String, UserProfile> _profiles = {};
  final Map<String, LivingPreferences> _preferences = {};
  final Set<String> _savedCandidateIds = {};
  final List<RoommateRequest> _requests = [];

  MockProfileRepository() {
    _seedCandidates();
  }

  void _seedCandidates() {
    final now = DateTime.now();

    // Default current user (Bhavin) preferences
    _preferences['user_bhavin_1'] = LivingPreferences(
      id: 'pref_bhavin',
      userId: 'user_bhavin_1',
      budget: 7000,
      city: 'Ahmedabad',
      foodPreference: 'vegetarian',
      sleepTime: '11:00 PM',
      wakeTime: '07:00 AM',
      cleanliness: 4,
      routine: 'student',
      guests: 'occasionally',
      smoking: false,
      pets: false,
      noiseLevel: 'quiet',
      updatedAt: now,
    );

    // Candidate 1: Jaydeep (Featured in mockup Screen 07 & 11)
    const jaydeepId = 'candidate_jaydeep';
    _profiles[jaydeepId] = UserProfile(
      id: jaydeepId,
      displayName: 'Jaydeep',
      avatarUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      city: 'Ahmedabad',
      occupation: 'Student at Nirma University',
      bio: "I'm a calm, friendly and tidy person. I love coding and watching movies.",
      age: 21,
      gender: 'Male',
      isProfileComplete: true,
      isVisible: true,
      createdAt: now.subtract(const Duration(days: 5)),
      updatedAt: now,
    );
    _preferences[jaydeepId] = LivingPreferences(
      id: 'pref_jaydeep',
      userId: jaydeepId,
      budget: 7000,
      city: 'Ahmedabad',
      foodPreference: 'vegetarian',
      sleepTime: '11:00 PM',
      wakeTime: '07:00 AM',
      cleanliness: 4,
      routine: 'student',
      guests: 'occasionally',
      smoking: false,
      pets: false,
      noiseLevel: 'quiet',
      updatedAt: now,
    );

    // Candidate 2: Rahul (Screen 08 & 09)
    const rahulId = 'candidate_rahul';
    _profiles[rahulId] = UserProfile(
      id: rahulId,
      displayName: 'Rahul',
      avatarUrl: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      city: 'Ahmedabad',
      occupation: 'Software Developer',
      bio: 'Working professional looking for quiet place near corporate road.',
      age: 23,
      gender: 'Male',
      isProfileComplete: true,
      isVisible: true,
      createdAt: now.subtract(const Duration(days: 8)),
      updatedAt: now,
    );
    _preferences[rahulId] = LivingPreferences(
      id: 'pref_rahul',
      userId: rahulId,
      budget: 8000,
      city: 'Ahmedabad',
      foodPreference: 'vegetarian',
      sleepTime: '11:30 PM',
      wakeTime: '07:30 AM',
      cleanliness: 4,
      routine: 'professional',
      guests: 'occasionally',
      smoking: false,
      pets: false,
      noiseLevel: 'quiet',
      updatedAt: now,
    );

    // Candidate 3: Aman (Screen 08 & 09)
    const amanId = 'candidate_aman';
    _profiles[amanId] = UserProfile(
      id: amanId,
      displayName: 'Aman',
      avatarUrl: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      city: 'Ahmedabad',
      occupation: 'Student at AU',
      bio: 'Design student looking for an easy-going roommate.',
      age: 21,
      gender: 'Male',
      isProfileComplete: true,
      isVisible: true,
      createdAt: now.subtract(const Duration(days: 12)),
      updatedAt: now,
    );
    _preferences[amanId] = LivingPreferences(
      id: 'pref_aman',
      userId: amanId,
      budget: 6500,
      city: 'Ahmedabad',
      foodPreference: 'vegetarian',
      sleepTime: '12:00 AM',
      wakeTime: '08:00 AM',
      cleanliness: 3,
      routine: 'student',
      guests: 'occasionally',
      smoking: false,
      pets: false,
      noiseLevel: 'moderate',
      updatedAt: now,
    );

    // Candidate 4: Neel (Screen 09)
    const neelId = 'candidate_neel';
    _profiles[neelId] = UserProfile(
      id: neelId,
      displayName: 'Neel',
      avatarUrl: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      city: 'Ahmedabad',
      occupation: 'Freelancer',
      bio: 'Remote UI designer who values clean workspaces and quiet nights.',
      age: 24,
      gender: 'Male',
      isProfileComplete: true,
      isVisible: true,
      createdAt: now.subtract(const Duration(days: 14)),
      updatedAt: now,
    );
    _preferences[neelId] = LivingPreferences(
      id: 'pref_neel',
      userId: neelId,
      budget: 10000,
      city: 'Ahmedabad',
      foodPreference: 'no-preference',
      sleepTime: '01:00 AM',
      wakeTime: '09:00 AM',
      cleanliness: 4,
      routine: 'freelancer',
      guests: 'never',
      smoking: false,
      pets: false,
      noiseLevel: 'quiet',
      updatedAt: now,
    );

    // Seed initial incoming requests (matches Screen 08_Requests mockup)
    _requests.add(RoommateRequest(
      id: 'req_1',
      senderId: rahulId,
      recipientId: 'user_bhavin_1',
      status: 'pending',
      message: 'Hey Bhavin, looks like we have very similar routines!',
      createdAt: now.subtract(const Duration(hours: 3)),
      updatedAt: now.subtract(const Duration(hours: 3)),
    ));

    _requests.add(RoommateRequest(
      id: 'req_2',
      senderId: amanId,
      recipientId: 'user_bhavin_1',
      status: 'pending',
      message: 'Looking for a flat near university.',
      createdAt: now.subtract(const Duration(days: 1)),
      updatedAt: now.subtract(const Duration(days: 1)),
    ));
  }

  @override
  Future<UserProfile?> getProfile(String uid) async {
    return _profiles[uid];
  }

  @override
  Future<void> saveProfile(UserProfile profile) async {
    _profiles[profile.id] = profile;
  }

  @override
  Future<LivingPreferences?> getPreferences(String uid) async {
    return _preferences[uid];
  }

  @override
  Future<void> savePreferences(LivingPreferences preferences) async {
    _preferences[preferences.userId] = preferences;
  }

  @override
  Future<List<CandidateProfile>> getCandidates({
    required String currentUserId,
    required LivingPreferences? userPreferences,
  }) async {
    final list = <CandidateProfile>[];

    for (final entry in _profiles.entries) {
      if (entry.key == currentUserId) continue; // Exclude self
      final profile = entry.value;
      if (!profile.isVisible || !profile.isProfileComplete) continue;

      final candPrefs = _preferences[entry.key];
      final compatibility = _engine.calculate(userPreferences, candPrefs);

      // Check request status
      String reqStatus = 'none';
      for (final r in _requests) {
        if (r.senderId == currentUserId && r.recipientId == entry.key) {
          reqStatus = r.status;
          break;
        } else if (r.senderId == entry.key && r.recipientId == currentUserId) {
          reqStatus = 'received';
          break;
        }
      }

      list.add(CandidateProfile(
        profile: profile,
        preferences: candPrefs,
        compatibility: compatibility,
        isSaved: _savedCandidateIds.contains(entry.key),
        requestStatus: reqStatus,
      ));
    }

    // Sort by highest compatibility score first
    list.sort((a, b) => b.compatibility.score.compareTo(a.compatibility.score));
    return list;
  }

  @override
  Future<void> toggleSaveCandidate(String currentUserId, String candidateId) async {
    if (_savedCandidateIds.contains(candidateId)) {
      _savedCandidateIds.remove(candidateId);
    } else {
      _savedCandidateIds.add(candidateId);
    }
  }

  @override
  Future<List<CandidateProfile>> getSavedProfiles({
    required String currentUserId,
    required LivingPreferences? userPreferences,
  }) async {
    final candidates = await getCandidates(
      currentUserId: currentUserId,
      userPreferences: userPreferences,
    );
    return candidates.where((c) => _savedCandidateIds.contains(c.profile.id)).toList();
  }

  @override
  Future<List<RoommateRequest>> getReceivedRequests(String userId) async {
    return _requests
        .where((r) => r.recipientId == userId)
        .toList()
      ..sort((a, b) => b.createdAt.compareTo(a.createdAt));
  }

  @override
  Future<List<RoommateRequest>> getSentRequests(String userId) async {
    return _requests
        .where((r) => r.senderId == userId)
        .toList()
      ..sort((a, b) => b.createdAt.compareTo(a.createdAt));
  }

  @override
  Future<void> sendRequest({
    required String senderId,
    required String recipientId,
    String message = '',
  }) async {
    // Prevent duplicate active request
    final exists = _requests.any((r) =>
        r.senderId == senderId &&
        r.recipientId == recipientId &&
        r.status == 'pending');
    if (exists) return;

    final now = DateTime.now();
    _requests.add(RoommateRequest(
      id: 'req_${now.millisecondsSinceEpoch}',
      senderId: senderId,
      recipientId: recipientId,
      status: 'pending',
      message: message,
      createdAt: now,
      updatedAt: now,
    ));
  }

  @override
  Future<void> updateRequestStatus({
    required String requestId,
    required String status,
  }) async {
    final index = _requests.indexWhere((r) => r.id == requestId);
    if (index != -1) {
      final req = _requests[index];
      _requests[index] = req.copyWith(
        status: status,
        updatedAt: DateTime.now(),
      );
    }
  }
}
