import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../data/repositories/profile_repository.dart';
import '../../../shared/models/candidate_profile.dart';
import '../../authentication/providers/auth_provider.dart';

/// State model for discovery feed
class DiscoveryState {
  final List<CandidateProfile> candidates;
  final int currentIndex;
  final bool isLoading;
  final String? errorMessage;
  final String? filterCity;
  final int? maxBudget;

  const DiscoveryState({
    this.candidates = const [],
    this.currentIndex = 0,
    this.isLoading = false,
    this.errorMessage,
    this.filterCity,
    this.maxBudget,
  });

  CandidateProfile? get currentCandidate {
    if (currentIndex >= 0 && currentIndex < candidates.length) {
      return candidates[currentIndex];
    }
    return null;
  }

  bool get hasMore => currentIndex < candidates.length;

  DiscoveryState copyWith({
    List<CandidateProfile>? candidates,
    int? currentIndex,
    bool? isLoading,
    String? errorMessage,
    String? filterCity,
    int? maxBudget,
  }) {
    return DiscoveryState(
      candidates: candidates ?? this.candidates,
      currentIndex: currentIndex ?? this.currentIndex,
      isLoading: isLoading ?? this.isLoading,
      errorMessage: errorMessage,
      filterCity: filterCity ?? this.filterCity,
      maxBudget: maxBudget ?? this.maxBudget,
    );
  }
}

class DiscoveryNotifier extends StateNotifier<DiscoveryState> {
  final ProfileRepository _profileRepo;
  final Ref _ref;

  DiscoveryNotifier(this._profileRepo, this._ref)
      : super(const DiscoveryState(isLoading: true)) {
    loadCandidates();
  }

  Future<void> loadCandidates() async {
    state = state.copyWith(isLoading: true, errorMessage: null);

    try {
      final currentUser = _ref.read(authNotifierProvider).value;
      final currentPrefs = _ref.read(preferencesNotifierProvider).value;

      if (currentUser == null) {
        state = state.copyWith(isLoading: false, candidates: []);
        return;
      }

      final list = await _profileRepo.getCandidates(
        currentUserId: currentUser.id,
        userPreferences: currentPrefs,
      );

      // Apply optional filters if set
      var filtered = list;
      if (state.filterCity != null && state.filterCity!.isNotEmpty) {
        filtered = filtered
            .where((c) =>
                c.profile.city.toLowerCase() == state.filterCity!.toLowerCase())
            .toList();
      }
      if (state.maxBudget != null) {
        filtered = filtered
            .where((c) =>
                c.preferences?.budget == null ||
                c.preferences!.budget! <= state.maxBudget!)
            .toList();
      }

      state = state.copyWith(
        candidates: filtered,
        currentIndex: 0,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: e.toString(),
      );
    }
  }

  void nextCandidate() {
    if (state.currentIndex < state.candidates.length) {
      state = state.copyWith(currentIndex: state.currentIndex + 1);
    }
  }

  Future<void> toggleSaveCurrentCandidate() async {
    final candidate = state.currentCandidate;
    final currentUser = _ref.read(authNotifierProvider).value;
    if (candidate == null || currentUser == null) return;

    await _profileRepo.toggleSaveCandidate(currentUser.id, candidate.profile.id);

    // Update in state list
    final updatedList = state.candidates.map((c) {
      if (c.profile.id == candidate.profile.id) {
        return c.copyWith(isSaved: !c.isSaved);
      }
      return c;
    }).toList();

    state = state.copyWith(candidates: updatedList);
  }

  Future<void> sendRequestToCurrentCandidate({String message = ''}) async {
    final candidate = state.currentCandidate;
    final currentUser = _ref.read(authNotifierProvider).value;
    if (candidate == null || currentUser == null) return;

    await _profileRepo.sendRequest(
      senderId: currentUser.id,
      recipientId: candidate.profile.id,
      message: message,
    );

    // Update in state list
    final updatedList = state.candidates.map((c) {
      if (c.profile.id == candidate.profile.id) {
        return c.copyWith(requestStatus: 'pending');
      }
      return c;
    }).toList();

    state = state.copyWith(candidates: updatedList);
  }

  void setFilter({String? city, int? maxBudget}) {
    state = state.copyWith(
      filterCity: city,
      maxBudget: maxBudget,
    );
    loadCandidates();
  }
}

final discoveryNotifierProvider =
    StateNotifierProvider<DiscoveryNotifier, DiscoveryState>((ref) {
  final profileRepo = ref.watch(profileRepositoryProvider);
  return DiscoveryNotifier(profileRepo, ref);
});
