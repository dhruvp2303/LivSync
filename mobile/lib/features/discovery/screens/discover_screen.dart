import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/routing/app_routes.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_typography.dart';
import '../../../shared/models/candidate_profile.dart';
import '../../../shared/widgets/compatibility_badge.dart';
import '../../../shared/widgets/preference_chip.dart';
import '../../authentication/providers/auth_provider.dart';
import '../providers/discovery_provider.dart';

/// Screen 7: Discovery Feed Screen matching reference mockups.
class DiscoverScreen extends ConsumerWidget {
  const DiscoverScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final currentUser = ref.watch(authNotifierProvider).value;
    final discoveryState = ref.watch(discoveryNotifierProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Header
            Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.xl,
                vertical: AppSpacing.m,
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Hi ${currentUser?.displayName.split(' ').first ?? 'Bhavin'} 👋',
                        style: AppTypography.h2.copyWith(fontSize: 22),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        'Here are your best matches',
                        style: AppTypography.caption.copyWith(
                          color: AppColors.textSecondary,
                          fontSize: 13,
                        ),
                      ),
                    ],
                  ),
                  // Filter Button
                  GestureDetector(
                    onTap: () => _showFilterSheet(context, ref),
                    child: Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: AppSpacing.borderRadiusM,
                        border: Border.all(color: AppColors.border),
                        boxShadow: AppSpacing.cardShadow,
                      ),
                      child: const Icon(
                        Icons.tune_rounded,
                        color: AppColors.textPrimary,
                        size: 20,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Main Card / Feed Area
            Expanded(
              child: discoveryState.isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : !discoveryState.hasMore
                      ? _buildEmptyState(context, ref)
                      : _buildCandidateCard(
                          context,
                          ref,
                          discoveryState.currentCandidate!,
                        ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCandidateCard(
    BuildContext context,
    WidgetRef ref,
    CandidateProfile candidate,
  ) {
    final profile = candidate.profile;
    final prefs = candidate.preferences;
    final compat = candidate.compatibility;

    return Padding(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.l,
        vertical: AppSpacing.xs,
      ),
      child: Column(
        children: [
          // The Main Card Container
          Expanded(
            child: GestureDetector(
              onTap: () {
                Navigator.pushNamed(
                  context,
                  AppRoutes.profileDetail,
                  arguments: candidate,
                );
              },
              child: Container(
                width: double.infinity,
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: AppSpacing.borderRadiusCard,
                  boxShadow: AppSpacing.cardShadow,
                  border: Border.all(color: AppColors.border),
                ),
                child: ClipRRect(
                  borderRadius: AppSpacing.borderRadiusCard,
                  child: Stack(
                    children: [
                      // Photo
                      Positioned.fill(
                        child: profile.avatarUrl != null
                            ? Image.network(
                                profile.avatarUrl!,
                                fit: BoxFit.cover,
                                errorBuilder: (_, __, ___) => Container(
                                  color: AppColors.primaryLight,
                                  child: const Icon(
                                    Icons.person,
                                    size: 80,
                                    color: AppColors.primary,
                                  ),
                                ),
                              )
                            : Container(
                                color: AppColors.primaryLight,
                                child: const Icon(
                                  Icons.person,
                                  size: 80,
                                  color: AppColors.primary,
                                ),
                              ),
                      ),

                      // Gradient Overlay for text contrast
                      Positioned.fill(
                        child: Container(
                          decoration: const BoxDecoration(
                            gradient: LinearGradient(
                              colors: [
                                Colors.transparent,
                                Color(0x66000000),
                                Color(0xE60F172A),
                              ],
                              stops: [0.35, 0.65, 1.0],
                              begin: Alignment.topCenter,
                              end: Alignment.bottomCenter,
                            ),
                          ),
                        ),
                      ),

                      // Top Right Match Badge
                      Positioned(
                        top: AppSpacing.m,
                        right: AppSpacing.m,
                        child: CompatibilityBadge(
                          score: compat.score,
                          fontSize: 13,
                        ),
                      ),

                      // Card Bottom Content
                      Positioned(
                        left: AppSpacing.l,
                        right: AppSpacing.l,
                        bottom: AppSpacing.l,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Name & Age with Verified Badge
                            Row(
                              children: [
                                Text(
                                  '${profile.displayName}${profile.age != null ? ', ${profile.age}' : ''}',
                                  style: AppTypography.h2.copyWith(
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(width: AppSpacing.xs),
                                const Icon(
                                  Icons.verified_rounded,
                                  color: Color(0xFF38BDF8),
                                  size: 20,
                                ),
                              ],
                            ),
                            const SizedBox(height: 2),

                            // Occupation & City
                            Text(
                              '${profile.occupation} • ${profile.city}',
                              style: AppTypography.bodyMedium.copyWith(
                                color: const Color(0xFFCBD5E1),
                              ),
                            ),
                            const SizedBox(height: AppSpacing.s),

                            // Lifestyle Tags
                            Wrap(
                              spacing: AppSpacing.xs,
                              runSpacing: AppSpacing.xs,
                              children: [
                                if (prefs?.foodPreference != null &&
                                    prefs!.foodPreference != 'no-preference')
                                  LifestyleTag(
                                    label: prefs.foodPreference.capitalize(),
                                  ),
                                if (prefs?.smoking == false)
                                  const LifestyleTag(label: 'Non-smoker'),
                                if (prefs?.routine != null)
                                  LifestyleTag(
                                    label: prefs!.routine.capitalize(),
                                  ),
                              ],
                            ),
                            const SizedBox(height: AppSpacing.m),

                            // Why You Match box
                            Container(
                              width: double.infinity,
                              padding: const EdgeInsets.all(AppSpacing.s + 2),
                              decoration: BoxDecoration(
                                color: const Color(0x33FFFFFF),
                                borderRadius: AppSpacing.borderRadiusM,
                                border: Border.all(
                                  color: const Color(0x33FFFFFF),
                                ),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'Why you match?',
                                    style: AppTypography.caption.copyWith(
                                      color: Colors.white,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 11,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  if (compat.strengths.isNotEmpty)
                                    ...compat.strengths.take(3).map((s) => Padding(
                                          padding: const EdgeInsets.only(top: 2),
                                          child: Row(
                                            children: [
                                              const Icon(
                                                Icons.check_circle_rounded,
                                                color: AppColors.success,
                                                size: 14,
                                              ),
                                              const SizedBox(width: 6),
                                              Expanded(
                                                child: Text(
                                                  s,
                                                  style: AppTypography.caption.copyWith(
                                                    color: Colors.white,
                                                    fontSize: 12,
                                                  ),
                                                ),
                                              ),
                                            ],
                                          ),
                                        ))
                                  else
                                    Text(
                                      'Review lifestyle breakdown in profile.',
                                      style: AppTypography.caption.copyWith(
                                        color: Colors.white70,
                                        fontSize: 12,
                                      ),
                                    ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),

          const SizedBox(height: AppSpacing.m),

          // 3 Action Buttons: Pass (✕), Bookmark (★), Request (♥)
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Pass Button (✕)
              _buildCircleButton(
                icon: Icons.close_rounded,
                iconColor: AppColors.passRed,
                bgColor: Colors.white,
                borderColor: const Color(0xFFFEE2E2),
                size: 54,
                onTap: () {
                  ref.read(discoveryNotifierProvider.notifier).nextCandidate();
                },
              ),
              const SizedBox(width: AppSpacing.xl),

              // Star Bookmark Button (★)
              _buildCircleButton(
                icon: candidate.isSaved
                    ? Icons.star_rounded
                    : Icons.star_outline_rounded,
                iconColor: AppColors.saveAmber,
                bgColor: Colors.white,
                borderColor: const Color(0xFFFEF3C7),
                size: 54,
                onTap: () async {
                  await ref
                      .read(discoveryNotifierProvider.notifier)
                      .toggleSaveCurrentCandidate();

                  if (context.mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(
                          candidate.isSaved
                              ? 'Profile removed from saved.'
                              : 'Saved to your profile bookmarks!',
                        ),
                        duration: const Duration(seconds: 1),
                      ),
                    );
                  }
                },
              ),
              const SizedBox(width: AppSpacing.xl),

              // Request Button (♥)
              _buildCircleButton(
                icon: candidate.requestStatus == 'pending'
                    ? Icons.done_all_rounded
                    : Icons.favorite_rounded,
                iconColor: Colors.white,
                gradient: AppColors.primaryGradient,
                size: 60,
                onTap: () async {
                  if (candidate.requestStatus == 'pending') {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Request already sent!'),
                        duration: Duration(seconds: 1),
                      ),
                    );
                    return;
                  }

                  await ref
                      .read(discoveryNotifierProvider.notifier)
                      .sendRequestToCurrentCandidate(
                        message: 'Hey, I saw our match score and would love to connect!',
                      );

                  if (context.mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Roommate connection request sent! 🎉'),
                        duration: Duration(seconds: 2),
                      ),
                    );
                  }
                  ref.read(discoveryNotifierProvider.notifier).nextCandidate();
                },
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.m),
        ],
      ),
    );
  }

  Widget _buildCircleButton({
    required IconData icon,
    required Color iconColor,
    Color? bgColor,
    Gradient? gradient,
    Color? borderColor,
    required double size,
    required VoidCallback onTap,
  }) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: bgColor,
        gradient: gradient,
        border: borderColor != null ? Border.all(color: borderColor, width: 1.5) : null,
        boxShadow: const [
          BoxShadow(
            color: Color(0x140F172A),
            blurRadius: 12,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          customBorder: const CircleBorder(),
          onTap: onTap,
          child: Center(
            child: Icon(icon, color: iconColor, size: size * 0.48),
          ),
        ),
      ),
    );
  }

  Widget _buildEmptyState(BuildContext context, WidgetRef ref) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.xxl),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 90,
              height: 90,
              decoration: const BoxDecoration(
                color: AppColors.primaryLight,
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.check_circle_outline_rounded,
                color: AppColors.primary,
                size: 48,
              ),
            ),
            const SizedBox(height: AppSpacing.l),
            Text(
              "You're all caught up!",
              style: AppTypography.h2.copyWith(fontSize: 20),
            ),
            const SizedBox(height: AppSpacing.xs),
            Text(
              "You've reviewed all available candidates. Refresh to see them again or adjust filters.",
              textAlign: TextAlign.center,
              style: AppTypography.bodyMedium,
            ),
            const SizedBox(height: AppSpacing.xl),
            ElevatedButton.icon(
              onPressed: () {
                ref.read(discoveryNotifierProvider.notifier).loadCandidates();
              },
              icon: const Icon(Icons.refresh_rounded, size: 20),
              label: const Text('Refresh Feed'),
            ),
          ],
        ),
      ),
    );
  }

  void _showFilterSheet(BuildContext context, WidgetRef ref) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return Padding(
          padding: const EdgeInsets.all(AppSpacing.xl),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Filter Roommates',
                style: AppTypography.h3,
              ),
              const SizedBox(height: AppSpacing.m),
              Text(
                'Filter by City',
                style: AppTypography.caption.copyWith(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: AppSpacing.xs),
              Wrap(
                spacing: AppSpacing.s,
                children: ['All', 'Ahmedabad', 'Mumbai', 'Bangalore'].map((c) {
                  return PreferenceChip(
                    label: c,
                    isSelected: c == 'All' || c == 'Ahmedabad',
                    onTap: () {
                      ref.read(discoveryNotifierProvider.notifier).setFilter(
                            city: c == 'All' ? null : c,
                          );
                      Navigator.pop(ctx);
                    },
                  );
                }).toList(),
              ),
              const SizedBox(height: AppSpacing.xl),
            ],
          ),
        );
      },
    );
  }
}

extension StringExtension on String {
  String capitalize() {
    if (isEmpty) return this;
    return '${this[0].toUpperCase()}${substring(1)}';
  }
}
