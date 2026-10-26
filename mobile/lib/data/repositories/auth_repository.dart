import 'dart:async';
import '../../shared/models/user_profile.dart';

/// Abstract contract for authentication operations.
abstract class AuthRepository {
  Stream<UserProfile?> get authStateChanges;
  UserProfile? get currentUser;

  Future<UserProfile> signInWithEmailPassword(String email, String password);

  Future<UserProfile> registerWithEmailPassword({
    required String email,
    required String password,
    required String displayName,
  });

  Future<void> signOut();

  Future<void> resetPassword(String email);

  Future<void> updateProfile(UserProfile profile);
}

/// In-memory mock authentication repository for instant local development and testing.
/// Pre-seeded with the reference mockup user Bhavin Patel.
class MockAuthRepository implements AuthRepository {
  final _controller = StreamController<UserProfile?>.broadcast();
  UserProfile? _currentUser;

  MockAuthRepository({bool preseedUser = true}) {
    if (preseedUser) {
      _currentUser = UserProfile(
        id: 'user_bhavin_1',
        displayName: 'Bhavin Patel',
        avatarUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
        city: 'Ahmedabad',
        occupation: 'Student at GTU',
        bio: 'Tech enthusiast and student looking for a tidy, focused roommate.',
        age: 22,
        gender: 'Male',
        isProfileComplete: true,
        isVisible: true,
        createdAt: DateTime.now().subtract(const Duration(days: 10)),
        updatedAt: DateTime.now(),
      );
    }
  }

  @override
  Stream<UserProfile?> get authStateChanges => _controller.stream;

  @override
  UserProfile? get currentUser => _currentUser;

  @override
  Future<UserProfile> signInWithEmailPassword(String email, String password) async {
    await Future.delayed(const Duration(milliseconds: 600));
    if (password.length < 6) {
      throw Exception('Invalid password. Minimum 6 characters required.');
    }
    _currentUser = UserProfile(
      id: 'user_bhavin_1',
      displayName: 'Bhavin Patel',
      avatarUrl: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      city: 'Ahmedabad',
      occupation: 'Student at GTU',
      bio: 'Tech enthusiast and student looking for a tidy, focused roommate.',
      age: 22,
      gender: 'Male',
      isProfileComplete: true,
      isVisible: true,
      createdAt: DateTime.now().subtract(const Duration(days: 10)),
      updatedAt: DateTime.now(),
    );
    _controller.add(_currentUser);
    return _currentUser!;
  }

  @override
  Future<UserProfile> registerWithEmailPassword({
    required String email,
    required String password,
    required String displayName,
  }) async {
    await Future.delayed(const Duration(milliseconds: 600));
    _currentUser = UserProfile(
      id: 'user_${DateTime.now().millisecondsSinceEpoch}',
      displayName: displayName,
      city: '',
      occupation: '',
      isProfileComplete: false,
      isVisible: true,
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
    );
    _controller.add(_currentUser);
    return _currentUser!;
  }

  @override
  Future<void> signOut() async {
    await Future.delayed(const Duration(milliseconds: 300));
    _currentUser = null;
    _controller.add(null);
  }

  @override
  Future<void> resetPassword(String email) async {
    await Future.delayed(const Duration(milliseconds: 500));
  }

  @override
  Future<void> updateProfile(UserProfile profile) async {
    _currentUser = profile;
    _controller.add(_currentUser);
  }

  void dispose() {
    _controller.close();
  }
}
