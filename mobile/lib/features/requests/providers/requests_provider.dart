import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../data/repositories/profile_repository.dart';
import '../../../shared/models/roommate_request.dart';
import '../../../shared/models/candidate_profile.dart';
import '../../authentication/providers/auth_provider.dart';

class RequestsState {
  final List<Map<String, dynamic>> receivedRequests;
  final List<Map<String, dynamic>> sentRequests;
  final bool isLoading;

  const RequestsState({
    this.receivedRequests = const [],
    this.sentRequests = const [],
    this.isLoading = false,
  });

  RequestsState copyWith({
    List<Map<String, dynamic>>? receivedRequests,
    List<Map<String, dynamic>>? sentRequests,
    bool? isLoading,
  }) {
    return RequestsState(
      receivedRequests: receivedRequests ?? this.receivedRequests,
      sentRequests: sentRequests ?? this.sentRequests,
      isLoading: isLoading ?? this.isLoading,
    );
  }
}

class RequestsNotifier extends StateNotifier<RequestsState> {
  final ProfileRepository _profileRepo;
  final Ref _ref;

  RequestsNotifier(this._profileRepo, this._ref)
      : super(const RequestsState(isLoading: true)) {
    loadRequests();
  }

  Future<void> loadRequests() async {
    state = state.copyWith(isLoading: true);

    try {
      final currentUser = _ref.read(authNotifierProvider).value;
      final currentPrefs = _ref.read(preferencesNotifierProvider).value;

      if (currentUser == null) {
        state = state.copyWith(isLoading: false);
        return;
      }

      final candidates = await _profileRepo.getCandidates(
        currentUserId: currentUser.id,
        userPreferences: currentPrefs,
      );

      final candidateMap = {for (var c in candidates) c.profile.id: c};

      final received = await _profileRepo.getReceivedRequests(currentUser.id);
      final sent = await _profileRepo.getSentRequests(currentUser.id);

      final receivedList = received.map((req) {
        final cand = candidateMap[req.senderId];
        return {
          'request': req,
          'candidate': cand,
        };
      }).toList();

      final sentList = sent.map((req) {
        final cand = candidateMap[req.recipientId];
        return {
          'request': req,
          'candidate': cand,
        };
      }).toList();

      state = state.copyWith(
        receivedRequests: receivedList,
        sentRequests: sentList,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false);
    }
  }

  Future<void> respondToRequest(String requestId, String status) async {
    await _profileRepo.updateRequestStatus(
      requestId: requestId,
      status: status,
    );
    await loadRequests();
  }
}

final requestsNotifierProvider =
    StateNotifierProvider<RequestsNotifier, RequestsState>((ref) {
  final profileRepo = ref.watch(profileRepositoryProvider);
  return RequestsNotifier(profileRepo, ref);
});
