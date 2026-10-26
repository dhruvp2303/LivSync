import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/routing/app_routes.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_typography.dart';
import '../../../shared/models/candidate_profile.dart';
import '../../../shared/models/roommate_request.dart';
import '../../../shared/widgets/app_button.dart';
import '../../../shared/widgets/compatibility_badge.dart';
import '../providers/requests_provider.dart';

/// Screen 9: Requests Management Screen matching reference mockups.
class RequestsScreen extends ConsumerStatefulWidget {
  const RequestsScreen({super.key});

  @override
  ConsumerState<RequestsScreen> createState() => _RequestsScreenState();
}

class _RequestsScreenState extends ConsumerState<RequestsScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final requestsState = ref.watch(requestsNotifierProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(
          'Requests',
          style: AppTypography.h2.copyWith(fontSize: 22),
        ),
        bottom: TabBar(
          controller: _tabController,
          labelColor: AppColors.primary,
          unselectedLabelColor: AppColors.textSecondary,
          labelStyle: AppTypography.button.copyWith(
            fontWeight: FontWeight.bold,
            color: AppColors.primary,
          ),
          unselectedLabelStyle: AppTypography.button.copyWith(
            fontWeight: FontWeight.w500,
            color: AppColors.textSecondary,
          ),
          indicatorColor: AppColors.primary,
          indicatorWeight: 3,
          indicatorSize: TabBarIndicatorSize.tab,
          tabs: const [
            Tab(text: 'Received'),
            Tab(text: 'Sent'),
          ],
        ),
      ),
      body: requestsState.isLoading
          ? const Center(child: CircularProgressIndicator())
          : TabBarView(
              controller: _tabController,
              children: [
                _buildReceivedTab(requestsState.receivedRequests),
                _buildSentTab(requestsState.sentRequests),
              ],
            ),
    );
  }

  Widget _buildReceivedTab(List<Map<String, dynamic>> items) {
    final pendingItems = items.where((i) {
      final req = i['request'] as RoommateRequest;
      return req.status == 'pending';
    }).toList();

    if (pendingItems.isEmpty) {
      return _buildEmptyState(
        'No pending requests',
        'When potential roommates send you a connection request, they will appear here.',
        Icons.mail_outline_rounded,
      );
    }

    return RefreshIndicator(
      onRefresh: () => ref.read(requestsNotifierProvider.notifier).loadRequests(),
      child: ListView.builder(
        padding: const EdgeInsets.all(AppSpacing.l),
        itemCount: pendingItems.length,
        itemBuilder: (context, index) {
          final item = pendingItems[index];
          final req = item['request'] as RoommateRequest;
          final candidate = item['candidate'] as CandidateProfile?;

          return _buildReceivedCard(context, req, candidate);
        },
      ),
    );
  }

  Widget _buildReceivedCard(
    BuildContext context,
    RoommateRequest req,
    CandidateProfile? candidate,
  ) {
    final profile = candidate?.profile;
    final compat = candidate?.compatibility;

    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.m),
      padding: const EdgeInsets.all(AppSpacing.m),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: AppSpacing.borderRadiusCard,
        border: Border.all(color: AppColors.border),
        boxShadow: AppSpacing.cardShadow,
      ),
      child: Column(
        children: [
          GestureDetector(
            onTap: () {
              if (candidate != null) {
                Navigator.pushNamed(
                  context,
                  AppRoutes.profileDetail,
                  arguments: candidate,
                );
              }
            },
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Avatar
                CircleAvatar(
                  radius: 28,
                  backgroundColor: AppColors.primaryLight,
                  backgroundImage: profile?.avatarUrl != null
                      ? NetworkImage(profile!.avatarUrl!)
                      : null,
                  child: profile?.avatarUrl == null
                      ? const Icon(Icons.person, color: AppColors.primary)
                      : null,
                ),
                const SizedBox(width: AppSpacing.m),

                // Name, occupation, city
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Text(
                              '${profile?.displayName ?? "Roommate"}, ${profile?.age ?? 22}',
                              style: AppTypography.cardTitle,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          if (compat != null)
                            CompatibilityBadge(score: compat.score),
                        ],
                      ),
                      const SizedBox(height: 2),
                      Text(
                        profile?.occupation ?? 'Student',
                        style: AppTypography.bodyMedium,
                      ),
                      Text(
                        profile?.city ?? 'Ahmedabad',
                        style: AppTypography.caption,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          if (req.message.isNotEmpty) ...[
            const SizedBox(height: AppSpacing.s),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(AppSpacing.s),
              decoration: BoxDecoration(
                color: AppColors.background,
                borderRadius: AppSpacing.borderRadiusS,
              ),
              child: Text(
                '"${req.message}"',
                style: AppTypography.caption.copyWith(
                  fontStyle: FontStyle.italic,
                  color: AppColors.textPrimary,
                ),
              ),
            ),
          ],

          const SizedBox(height: AppSpacing.m),

          // Accept / Reject Actions
          Row(
            children: [
              Expanded(
                child: SizedBox(
                  height: 42,
                  child: OutlinedButton(
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppColors.textSecondary,
                      side: const BorderSide(color: AppColors.border),
                      shape: const RoundedRectangleBorder(
                        borderRadius: AppSpacing.borderRadiusFull,
                      ),
                    ),
                    onPressed: () async {
                      await ref
                          .read(requestsNotifierProvider.notifier)
                          .respondToRequest(req.id, 'rejected');
                      if (context.mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Request declined.')),
                        );
                      }
                    },
                    child: const Text('Reject'),
                  ),
                ),
              ),
              const SizedBox(width: AppSpacing.m),
              Expanded(
                child: SizedBox(
                  height: 42,
                  child: AppButton(
                    label: 'Accept',
                    height: 42,
                    onPressed: () async {
                      await ref
                          .read(requestsNotifierProvider.notifier)
                          .respondToRequest(req.id, 'accepted');
                      if (context.mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text("Request accepted! You're now connected 🎉"),
                          ),
                        );
                      }
                    },
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSentTab(List<Map<String, dynamic>> items) {
    if (items.isEmpty) {
      return _buildEmptyState(
        'No sent requests',
        'Browse discovery and tap the heart icon to send roommate requests.',
        Icons.send_rounded,
      );
    }

    return RefreshIndicator(
      onRefresh: () => ref.read(requestsNotifierProvider.notifier).loadRequests(),
      child: ListView.builder(
        padding: const EdgeInsets.all(AppSpacing.l),
        itemCount: items.length,
        itemBuilder: (context, index) {
          final item = items[index];
          final req = item['request'] as RoommateRequest;
          final candidate = item['candidate'] as CandidateProfile?;
          final profile = candidate?.profile;

          Color statusColor;
          String statusText;
          if (req.status == 'accepted') {
            statusColor = AppColors.success;
            statusText = 'Accepted';
          } else if (req.status == 'rejected') {
            statusColor = AppColors.error;
            statusText = 'Declined';
          } else {
            statusColor = AppColors.warning;
            statusText = 'Pending';
          }

          return Container(
            margin: const EdgeInsets.only(bottom: AppSpacing.m),
            padding: const EdgeInsets.all(AppSpacing.m),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: AppSpacing.borderRadiusCard,
              border: Border.all(color: AppColors.border),
            ),
            child: Row(
              children: [
                CircleAvatar(
                  radius: 26,
                  backgroundColor: AppColors.primaryLight,
                  backgroundImage: profile?.avatarUrl != null
                      ? NetworkImage(profile!.avatarUrl!)
                      : null,
                  child: profile?.avatarUrl == null
                      ? const Icon(Icons.person, color: AppColors.primary)
                      : null,
                ),
                const SizedBox(width: AppSpacing.m),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        profile?.displayName ?? 'Candidate',
                        style: AppTypography.cardTitle,
                      ),
                      Text(
                        profile?.city ?? 'Ahmedabad',
                        style: AppTypography.caption,
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.s,
                    vertical: AppSpacing.xxs,
                  ),
                  decoration: BoxDecoration(
                    color: statusColor.withOpacity(0.12),
                    borderRadius: AppSpacing.borderRadiusFull,
                  ),
                  child: Text(
                    statusText,
                    style: AppTypography.badge.copyWith(
                      color: statusColor,
                      fontSize: 12,
                    ),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildEmptyState(String title, String subtitle, IconData icon) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.xxl),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 72,
              height: 72,
              decoration: const BoxDecoration(
                color: AppColors.primaryLight,
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: AppColors.primary, size: 36),
            ),
            const SizedBox(height: AppSpacing.l),
            Text(title, style: AppTypography.h3),
            const SizedBox(height: AppSpacing.xs),
            Text(
              subtitle,
              textAlign: TextAlign.center,
              style: AppTypography.bodyMedium,
            ),
          ],
        ),
      ),
    );
  }
}
