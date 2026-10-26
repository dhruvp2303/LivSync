import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_typography.dart';
import '../../../shared/models/candidate_profile.dart';
import '../../../shared/widgets/app_button.dart';
import '../../../shared/widgets/compatibility_badge.dart';
import '../../../shared/widgets/preference_chip.dart';
import '../providers/discovery_provider.dart';

/// Screen 8: Candidate Profile Detail & Compatibility Deep-Dive Screen.
class ProfileDetailScreen extends ConsumerStatefulWidget {
  final CandidateProfile candidate;

  const ProfileDetailScreen({super.key, required this.candidate});

  @override
  ConsumerState<ProfileDetailScreen> createState() => _ProfileDetailScreenState();
}

class _ProfileDetailScreenState extends ConsumerState<ProfileDetailScreen> {
  late bool _isSaved;
  late String _requestStatus;

  @override
  void initState() {
    super.initState();
    _isSaved = widget.candidate.isSaved;
    _requestStatus = widget.candidate.requestStatus;
  }

  @override
  Widget build(BuildContext context) {
    final candidate = widget.candidate;
    final profile = candidate.profile;
    final prefs = candidate.preferences;
    final compat = candidate.compatibility;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: Stack(
        children: [
          // Scrollable Body
          SingleChildScrollView(
            padding: const EdgeInsets.only(bottom: 100),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // 1. Hero Image Header
                Stack(
                  children: [
                    Container(
                      width: double.infinity,
                      height: 340,
                      decoration: BoxDecoration(
                        color: AppColors.primaryLight,
                        image: profile.avatarUrl != null
                            ? DecorationImage(
                                image: NetworkImage(profile.avatarUrl!),
                                fit: BoxFit.cover,
                              )
                            : null,
                      ),
                      child: profile.avatarUrl == null
                          ? const Center(
                              child: Icon(
                                Icons.person,
                                size: 100,
                                color: AppColors.primary,
                              ),
                            )
                          : null,
                    ),
                    // Gradient overlay
                    Positioned.fill(
                      child: Container(
                        decoration: const BoxDecoration(
                          gradient: LinearGradient(
                            colors: [
                              Color(0x88000000),
                              Colors.transparent,
                              Color(0x99000000),
                            ],
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                          ),
                        ),
                      ),
                    ),
                    // Top App Bar Icons
                    SafeArea(
                      child: Padding(
                        padding: const EdgeInsets.symmetric(
                          horizontal: AppSpacing.m,
                          vertical: AppSpacing.xs,
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            CircleAvatar(
                              backgroundColor: Colors.white,
                              radius: 20,
                              child: IconButton(
                                icon: const Icon(
                                  Icons.arrow_back_ios_new_rounded,
                                  size: 18,
                                  color: AppColors.textPrimary,
                                ),
                                onPressed: () => Navigator.pop(context),
                              ),
                            ),
                            CircleAvatar(
                              backgroundColor: Colors.white,
                              radius: 20,
                              child: IconButton(
                                icon: const Icon(
                                  Icons.more_horiz_rounded,
                                  size: 20,
                                  color: AppColors.textPrimary,
                                ),
                                onPressed: () {},
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    // Bottom Match Badge
                    Positioned(
                      bottom: AppSpacing.m,
                      right: AppSpacing.l,
                      child: CompatibilityBadge(
                        score: compat.score,
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),

                // 2. Profile Details & Bio
                Container(
                  padding: const EdgeInsets.all(AppSpacing.xl),
                  color: AppColors.surface,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Name & Age
                      Row(
                        children: [
                          Text(
                            '${profile.displayName}${profile.age != null ? ', ${profile.age}' : ''}',
                            style: AppTypography.h1.copyWith(fontSize: 26),
                          ),
                          const SizedBox(width: AppSpacing.xs),
                          const Icon(
                            Icons.verified_rounded,
                            color: Color(0xFF38BDF8),
                            size: 22,
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),

                      // University / Occupation
                      Row(
                        children: [
                          const Icon(
                            Icons.school_outlined,
                            size: 16,
                            color: AppColors.textSecondary,
                          ),
                          const SizedBox(width: 6),
                          Text(
                            profile.occupation,
                            style: AppTypography.bodyMedium,
                          ),
                        ],
                      ),
                      const SizedBox(height: 2),

                      // City
                      Row(
                        children: [
                          const Icon(
                            Icons.location_on_outlined,
                            size: 16,
                            color: AppColors.textSecondary,
                          ),
                          const SizedBox(width: 6),
                          Text(
                            profile.city,
                            style: AppTypography.bodyMedium,
                          ),
                        ],
                      ),
                      const SizedBox(height: AppSpacing.m),

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
                          if (prefs?.pets == false)
                            const LifestyleTag(label: 'No pets'),
                          if (prefs?.routine != null)
                            LifestyleTag(label: prefs!.routine.capitalize()),
                          if (prefs?.noiseLevel == 'quiet')
                            const LifestyleTag(label: 'Quiet Hours'),
                        ],
                      ),
                      const SizedBox(height: AppSpacing.xl),

                      // About Me
                      Text('About', style: AppTypography.h3),
                      const SizedBox(height: AppSpacing.xs),
                      Text(
                        profile.bio.isNotEmpty
                            ? profile.bio
                            : "I'm looking for a compatible roommate with aligned habits.",
                        style: AppTypography.bodyLarge.copyWith(
                          color: AppColors.textSecondary,
                          height: 1.5,
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: AppSpacing.s),

                // 3. Compatibility Breakdown Section
                Container(
                  padding: const EdgeInsets.all(AppSpacing.xl),
                  color: AppColors.surface,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('Compatibility Breakdown', style: AppTypography.h3),
                          CompatibilityBadge(score: compat.score),
                        ],
                      ),
                      const SizedBox(height: AppSpacing.xs),
                      Text(
                        'A rule-based score comparing declared living preferences.',
                        style: AppTypography.caption,
                      ),
                      const SizedBox(height: AppSpacing.l),

                      // Factor Progress Bars
                      ...compat.factors.map((f) => _buildFactorBar(f.name, f.score)),

                      const SizedBox(height: AppSpacing.xl),

                      // Similarities
                      if (compat.strengths.isNotEmpty) ...[
                        Text(
                          'Key Similarities',
                          style: AppTypography.cardTitle.copyWith(fontSize: 16),
                        ),
                        const SizedBox(height: AppSpacing.s),
                        ...compat.strengths.map((s) => Padding(
                              padding: const EdgeInsets.only(bottom: 8),
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Icon(
                                    Icons.check_circle_rounded,
                                    color: AppColors.success,
                                    size: 18,
                                  ),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: Text(
                                      s,
                                      style: AppTypography.bodyMedium.copyWith(
                                        color: AppColors.textPrimary,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            )),
                        const SizedBox(height: AppSpacing.m),
                      ],

                      // Potential Differences
                      if (compat.differences.isNotEmpty) ...[
                        Text(
                          'Potential Differences',
                          style: AppTypography.cardTitle.copyWith(
                            fontSize: 16,
                            color: AppColors.warning,
                          ),
                        ),
                        const SizedBox(height: AppSpacing.s),
                        ...compat.differences.map((d) => Padding(
                              padding: const EdgeInsets.only(bottom: 8),
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Icon(
                                    Icons.info_outline_rounded,
                                    color: AppColors.warning,
                                    size: 18,
                                  ),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: Text(
                                      d,
                                      style: AppTypography.bodyMedium.copyWith(
                                        color: AppColors.textPrimary,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            )),
                        const SizedBox(height: AppSpacing.m),
                      ],

                      // Discussion Checklist
                      const Divider(),
                      const SizedBox(height: AppSpacing.s),
                      Text(
                        'Before Deciding, Discuss:',
                        style: AppTypography.cardTitle.copyWith(fontSize: 15),
                      ),
                      const SizedBox(height: AppSpacing.s),
                      ...compat.discussionPrompts.map((prompt) => Padding(
                            padding: const EdgeInsets.only(bottom: 6),
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text('• ', style: TextStyle(fontWeight: FontWeight.bold)),
                                Expanded(
                                  child: Text(
                                    prompt,
                                    style: AppTypography.caption.copyWith(
                                      color: AppColors.textSecondary,
                                      fontSize: 13,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          )),
                    ],
                  ),
                ),

                const SizedBox(height: AppSpacing.s),

                // 4. Declared Preferences Overview Table
                if (prefs != null)
                  Container(
                    padding: const EdgeInsets.all(AppSpacing.xl),
                    color: AppColors.surface,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Declared Preferences', style: AppTypography.h3),
                        const SizedBox(height: AppSpacing.m),
                        _buildPreferenceRow('Monthly Budget', '₹${prefs.budget ?? "Not specified"}'),
                        _buildPreferenceRow('Food Preference', prefs.foodPreference.capitalize()),
                        _buildPreferenceRow('Sleep Schedule', '${prefs.sleepTime ?? "—"} to ${prefs.wakeTime ?? "—"}'),
                        _buildPreferenceRow('Cleanliness', '${prefs.cleanliness ?? 3} / 5'),
                        _buildPreferenceRow('Routine', prefs.routine.capitalize()),
                        _buildPreferenceRow('Guests', prefs.guests.capitalize()),
                        _buildPreferenceRow('Smoking', prefs.smoking == true ? 'Allowed' : 'Non-smoking'),
                        _buildPreferenceRow('Pets', prefs.pets == true ? 'Allowed' : 'No pets'),
                      ],
                    ),
                  ),
              ],
            ),
          ),

          // Bottom Sticky Action Bar
          Positioned(
            left: 0,
            right: 0,
            bottom: 0,
            child: Container(
              padding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.xl,
                vertical: AppSpacing.m,
              ),
              decoration: BoxDecoration(
                color: AppColors.surface,
                boxShadow: AppSpacing.bottomNavShadow,
                border: const Border(
                  top: BorderSide(color: AppColors.border, width: 1),
                ),
              ),
              child: Row(
                children: [
                  // Star / Bookmark Button
                  Container(
                    width: 52,
                    height: 52,
                    decoration: BoxDecoration(
                      color: _isSaved ? AppColors.warningLight : AppColors.surface,
                      borderRadius: AppSpacing.borderRadiusM,
                      border: Border.all(
                        color: _isSaved ? AppColors.warning : AppColors.border,
                        width: 1.5,
                      ),
                    ),
                    child: IconButton(
                      icon: Icon(
                        _isSaved ? Icons.star_rounded : Icons.star_outline_rounded,
                        color: _isSaved ? AppColors.warning : AppColors.textSecondary,
                      ),
                      onPressed: () {
                        setState(() {
                          _isSaved = !_isSaved;
                        });
                        ref
                            .read(discoveryNotifierProvider.notifier)
                            .toggleSaveCurrentCandidate();
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text(_isSaved ? 'Saved to bookmarks!' : 'Removed from bookmarks.'),
                            duration: const Duration(seconds: 1),
                          ),
                        );
                      },
                    ),
                  ),
                  const SizedBox(width: AppSpacing.m),

                  // Send Request Button
                  Expanded(
                    child: AppButton(
                      label: _requestStatus == 'pending'
                          ? 'Request Sent'
                          : _requestStatus == 'accepted'
                              ? 'Connected'
                              : 'Send Roommate Request',
                      icon: _requestStatus == 'pending'
                          ? Icons.done_all_rounded
                          : Icons.favorite_rounded,
                      onPressed: _requestStatus != 'none'
                          ? null
                          : () {
                              setState(() {
                                _requestStatus = 'pending';
                              });
                              ref
                                  .read(discoveryNotifierProvider.notifier)
                                  .sendRequestToCurrentCandidate(
                                    message: 'Hey, I checked your profile and would like to connect!',
                                  );
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('Roommate connection request sent! 🎉'),
                                ),
                              );
                            },
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFactorBar(String name, double score) {
    final int rounded = score.round();
    Color barColor;
    if (rounded >= 80) {
      barColor = AppColors.success;
    } else if (rounded >= 60) {
      barColor = AppColors.warning;
    } else {
      barColor = const Color(0xFF94A3B8);
    }

    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                name,
                style: AppTypography.bodyMedium.copyWith(
                  color: AppColors.textPrimary,
                  fontWeight: FontWeight.w500,
                ),
              ),
              Text(
                '$rounded%',
                style: AppTypography.caption.copyWith(
                  fontWeight: FontWeight.bold,
                  color: barColor,
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: LinearProgressIndicator(
              value: (score / 100.0).clamp(0.0, 1.0),
              backgroundColor: AppColors.border,
              valueColor: AlwaysStoppedAnimation<Color>(barColor),
              minHeight: 7,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPreferenceRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: AppTypography.bodyMedium),
          Text(
            value,
            style: AppTypography.bodyMedium.copyWith(
              color: AppColors.textPrimary,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}
