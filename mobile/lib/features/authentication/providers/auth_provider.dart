import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../data/repositories/auth_repository.dart';
import '../../../data/repositories/profile_repository.dart';
import '../../../shared/models/user_profile.dart';
import '../../../shared/models/living_preferences.dart';

/// Provides the active AuthRepository instance
final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return MockAuthRepository(preseedUser: true);
});

/// Provides the active ProfileRepository instance
final profileRepositoryProvider = Provider<ProfileRepository>((ref) {
  return MockProfileRepository();
});

/// Manages authentication state and current user profile
class AuthNotifier extends StateNotifier<AsyncValue<UserProfile?>> {
  final AuthRepository _authRepo;
  final ProfileRepository _profileRepo;

  AuthNotifier(this._authRepo, this._profileRepo)
      : super(AsyncValue.data(_authRepo.currentUser)) {
    _init();
  }

  void _init() {
    _authRepo.authStateChanges.listen((user) {
      state = AsyncValue.data(user);
    });
  }

  Future<void> signIn(String email, String password) async {
    state = const AsyncValue.loading();
    try {
      final user = await _authRepo.signInWithEmailPassword(email, password);
      state = AsyncValue.data(user);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }

  Future<void> register(String email, String password, String displayName) async {
    state = const AsyncValue.loading();
    try {
      final user = await _authRepo.registerWithEmailPassword(
        email: email,
        password: password,
        displayName: displayName,
      );
      state = AsyncValue.data(user);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }

  Future<void> updateProfile(UserProfile updated) async {
    await _authRepo.updateProfile(updated);
    await _profileRepo.saveProfile(updated);
    state = AsyncValue.data(updated);
  }

  Future<void> signOut() async {
    await _authRepo.signOut();
    state = const AsyncValue.data(null);
  }
}

final authNotifierProvider =
    StateNotifierProvider<AuthNotifier, AsyncValue<UserProfile?>>((ref) {
  final authRepo = ref.watch(authRepositoryProvider);
  final profileRepo = ref.watch(profileRepositoryProvider);
  return AuthNotifier(authRepo, profileRepo);
});

/// Manages current user living preferences
class PreferencesNotifier extends StateNotifier<AsyncValue<LivingPreferences?>> {
  final ProfileRepository _profileRepo;
  final String? _userId;

  PreferencesNotifier(this._profileRepo, this._userId)
      : super(const AsyncValue.loading()) {
    _load();
  }

  Future<void> _load() async {
    if (_userId == null) {
      state = const AsyncValue.data(null);
      return;
    }
    try {
      final prefs = await _profileRepo.getPreferences(_userId!);
      state = AsyncValue.data(prefs);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> savePreferences(LivingPreferences prefs) async {
    state = const AsyncValue.loading();
    try {
      await _profileRepo.savePreferences(prefs);
      state = AsyncValue.data(prefs);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
      rethrow;
    }
  }
}

final preferencesNotifierProvider =
    StateNotifierProvider<PreferencesNotifier, AsyncValue<LivingPreferences?>>((ref) {
  final profileRepo = ref.watch(profileRepositoryProvider);
  final currentUser = ref.watch(authNotifierProvider).value;
  return PreferencesNotifier(profileRepo, currentUser?.id);
});
