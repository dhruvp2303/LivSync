import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/routing/app_routes.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_typography.dart';
import '../../../shared/models/candidate_profile.dart';
import '../../../shared/widgets/compatibility_badge.dart';
import '../../discovery/providers/discovery_provider.dart';
import '../../requests/providers/requests_provider.dart';

/// Screen 10: Matches and Saved Roommate Connections.
class MatchesScreen extends ConsumerWidget {
  const MatchesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final discoveryState = ref.watch(discoveryNotifierProvider);
    final requestsState = ref.watch(requestsNotifierProvider);

    // 1. Saved candidates from discovery
    final savedCandidates =
        discoveryState.candidates.where((c) => c.isSaved).toList();

    // 2. Connected candidates (where request was accepted)
    final acceptedCandidates = <CandidateProfile>[];
    for (final item in requestsState.receivedRequests) {
      final req = item['request'];
      final candidate = item['candidate'] as CandidateProfile?;
      if (req.status == 'accepted' && candidate != null) {
        acceptedCandidates.add(candidate);
      }
    }
    for (final item in requestsState.sentRequests) {
      final req = item['request'];
      final candidate = item['candidate'] as CandidateProfile?;
      if (req.status == 'accepted' && candidate != null) {
        if (!acceptedCandidates.any((c) => c.profile.id == candidate.profile.id)) {
          acceptedCandidates.add(candidate);
        }
      }
    }

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(
          'Matches',
          style: AppTypography.h2.copyWith(fontSize: 22),
        ),
      ),
      body: (savedCandidates.isEmpty && acceptedCandidates.isEmpty)
          ? _buildEmptyState()
          : SingleChildScrollView(
              padding: const EdgeInsets.all(AppSpacing.l),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // 1. Connected Roommates Section
                  if (acceptedCandidates.isNotEmpty) ...[
                    Row(
                      children: [
                        const Icon(
                          Icons.diversity_1_rounded,
                          color: AppColors.primary,
                          size: 20,
                        ),
                        const SizedBox(width: AppSpacing.xs),
                        Text(
                          'Connected Roommates',
                          style: AppTypography.h3.copyWith(fontSize: 18),
                        ),
                      ],
                    ),
                    const SizedBox(height: AppSpacing.s),
                    ...acceptedCandidates.map((c) => _buildConnectedCard(context, c)),
                    const SizedBox(height: AppSpacing.xl),
                  ],

                  // 2. Saved Bookmarks Section
                  Row(
                    children: [
                      const Icon(
                        Icons.star_rounded,
                        color: AppColors.saveAmber,
                        size: 20,
                      ),
                      const SizedBox(width: AppSpacing.xs),
                      Text(
                        'Saved Profiles (${savedCandidates.length})',
                        style: AppTypography.h3.copyWith(fontSize: 18),
                      ),
                    ],
                  ),
                  const SizedBox(height: AppSpacing.s),

                  if (savedCandidates.isEmpty)
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(AppSpacing.l),
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: AppSpacing.borderRadiusCard,
                        border: Border.all(color: AppColors.border),
                      ),
                      child: Text(
                        'No saved profiles yet. Tap the star icon on any discovery card to bookmark them.',
                        style: AppTypography.caption,
                      ),
                    )
                  else
                    ...savedCandidates.map((c) => _buildSavedCard(context, ref, c)),
                ],
              ),
            ),
    );
  }

  Widget _buildConnectedCard(BuildContext context, CandidateProfile candidate) {
    final profile = candidate.profile;

    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.m),
      padding: const EdgeInsets.all(AppSpacing.m),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: AppSpacing.borderRadiusCard,
        border: Border.all(color: const Color(0xFFBBF7D0), width: 1.5),
        boxShadow: AppSpacing.cardShadow,
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 28,
            backgroundColor: AppColors.primaryLight,
            backgroundImage: profile.avatarUrl != null
                ? NetworkImage(profile.avatarUrl!)
                : null,
            child: profile.avatarUrl == null
                ? const Icon(Icons.person, color: AppColors.primary)
                : null,
          ),
          const SizedBox(width: AppSpacing.m),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(profile.displayName, style: AppTypography.cardTitle),
                    const SizedBox(width: 4),
                    const Icon(
                      Icons.verified_rounded,
                      color: Color(0xFF38BDF8),
                      size: 16,
                    ),
                  ],
                ),
                Text(
                  'Connected Roommate',
                  style: AppTypography.caption.copyWith(
                    color: AppColors.success,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            ),
          ),
          IconButton(
            icon: const Icon(
              Icons.chat_bubble_outline_rounded,
              color: AppColors.primary,
            ),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(
                    'Chat with ${profile.displayName} is unlocked for connected roommates! (Roadmap Phase)',
                  ),
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildSavedCard(
    BuildContext context,
    WidgetRef ref,
    CandidateProfile candidate,
  ) {
    final profile = candidate.profile;
    final compat = candidate.compatibility;

    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.m),
      padding: const EdgeInsets.all(AppSpacing.m),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: AppSpacing.borderRadiusCard,
        border: Border.all(color: AppColors.border),
        boxShadow: AppSpacing.cardShadow,
      ),
      child: InkWell(
        onTap: () {
          Navigator.pushNamed(
            context,
            AppRoutes.profileDetail,
            arguments: candidate,
          );
        },
        child: Row(
          children: [
            CircleAvatar(
              radius: 26,
              backgroundColor: AppColors.primaryLight,
              backgroundImage: profile.avatarUrl != null
                  ? NetworkImage(profile.avatarUrl!)
                  : null,
              child: profile.avatarUrl == null
                  ? const Icon(Icons.person, color: AppColors.primary)
                  : null,
            ),
            const SizedBox(width: AppSpacing.m),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '${profile.displayName}, ${profile.age ?? 21}',
                    style: AppTypography.cardTitle,
                  ),
                  Text(
                    profile.city,
                    style: AppTypography.caption,
                  ),
                ],
              ),
            ),
            CompatibilityBadge(score: compat.score),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.xxl),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: const BoxDecoration(
                color: AppColors.primaryLight,
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.favorite_outline_rounded,
                color: AppColors.primary,
                size: 40,
              ),
            ),
            const SizedBox(height: AppSpacing.l),
            Text('No Matches Yet', style: AppTypography.h2),
            const SizedBox(height: AppSpacing.xs),
            Text(
              'Profiles you save or accepted requests will appear here for quick access.',
              textAlign: TextAlign.center,
              style: AppTypography.bodyMedium,
            ),
          ],
        ),
      ),
    );
  }
}
