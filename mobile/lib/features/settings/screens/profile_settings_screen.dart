import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/routing/app_routes.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_typography.dart';
import '../../../shared/widgets/app_button.dart';
import '../../authentication/providers/auth_provider.dart';

/// Screen 11: User Profile & Account Settings Screen.
class ProfileSettingsScreen extends ConsumerStatefulWidget {
  const ProfileSettingsScreen({super.key});

  @override
  ConsumerState<ProfileSettingsScreen> createState() => _ProfileSettingsScreenState();
}

class _ProfileSettingsScreenState extends ConsumerState<ProfileSettingsScreen> {
  @override
  Widget build(BuildContext context) {
    final user = ref.watch(authNotifierProvider).value;
    final prefs = ref.watch(preferencesNotifierProvider).value;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(
          'Profile & Settings',
          style: AppTypography.h2.copyWith(fontSize: 22),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.xl),
        child: Column(
          children: [
            // User Hero Card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(AppSpacing.xl),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: AppSpacing.borderRadiusCard,
                border: Border.all(color: AppColors.border),
                boxShadow: AppSpacing.cardShadow,
              ),
              child: Column(
                children: [
                  CircleAvatar(
                    radius: 44,
                    backgroundColor: AppColors.primaryLight,
                    backgroundImage: user?.avatarUrl != null
                        ? NetworkImage(user!.avatarUrl!)
                        : null,
                    child: user?.avatarUrl == null
                        ? const Icon(Icons.person, size: 44, color: AppColors.primary)
                        : null,
                  ),
                  const SizedBox(height: AppSpacing.m),
                  Text(
                    user?.displayName ?? 'Bhavin Patel',
                    style: AppTypography.h2,
                  ),
                  const SizedBox(height: 2),
                  Text(
                    '${user?.occupation ?? "Student"} • ${user?.city ?? "Ahmedabad"}',
                    style: AppTypography.bodyMedium,
                  ),
                  const SizedBox(height: AppSpacing.m),
                  OutlinedButton.icon(
                    style: OutlinedButton.styleFrom(
                      foregroundColor: AppColors.primary,
                      side: const BorderSide(color: AppColors.primary),
                      shape: const RoundedRectangleBorder(
                        borderRadius: AppSpacing.borderRadiusFull,
                      ),
                      padding: const EdgeInsets.symmetric(
                        horizontal: AppSpacing.l,
                        vertical: AppSpacing.xs,
                      ),
                      minimumSize: const Size(0, 38),
                    ),
                    icon: const Icon(Icons.edit_outlined, size: 16),
                    label: const Text('Edit Profile'),
                    onPressed: () {
                      Navigator.pushNamed(context, AppRoutes.profileSetup);
                    },
                  ),
                ],
              ),
            ),

            const SizedBox(height: AppSpacing.xl),

            // Settings Menu Items
            Container(
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: AppSpacing.borderRadiusCard,
                border: Border.all(color: AppColors.border),
              ),
              child: Column(
                children: [
                  // Edit Preferences
                  _buildMenuTile(
                    icon: Icons.tune_rounded,
                    title: 'Living Preferences',
                    subtitle: 'Budget, sleep schedule, cleanliness, diet',
                    onTap: () {
                      Navigator.pushNamed(context, AppRoutes.preferencesSetup);
                    },
                  ),
                  const Divider(height: 1),

                  // Discovery Visibility Switch
                  ListTile(
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: AppSpacing.l,
                      vertical: AppSpacing.xs,
                    ),
                    leading: Container(
                      width: 40,
                      height: 40,
                      decoration: const BoxDecoration(
                        color: AppColors.primaryLight,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(
                        Icons.visibility_outlined,
                        color: AppColors.primary,
                        size: 20,
                      ),
                    ),
                    title: Text(
                      'Visible in Discovery',
                      style: AppTypography.cardTitle.copyWith(fontSize: 15),
                    ),
                    subtitle: Text(
                      user?.isVisible == true
                          ? 'Other candidates can find you'
                          : 'Your profile is currently hidden',
                      style: AppTypography.caption,
                    ),
                    trailing: Switch.adaptive(
                      value: user?.isVisible ?? true,
                      activeColor: AppColors.primary,
                      onChanged: (val) {
                        if (user != null) {
                          ref
                              .read(authNotifierProvider.notifier)
                              .updateProfile(user.copyWith(isVisible: val));
                        }
                      },
                    ),
                  ),
                  const Divider(height: 1),

                  // Privacy Information
                  _buildMenuTile(
                    icon: Icons.privacy_tip_outlined,
                    title: 'Privacy & Safety',
                    subtitle: 'Data access, scoring transparency',
                    onTap: () => _showPrivacyDialog(context),
                  ),
                ],
              ),
            ),

            const SizedBox(height: AppSpacing.xl),

            // Account Actions
            Container(
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: AppSpacing.borderRadiusCard,
                border: Border.all(color: AppColors.border),
              ),
              child: Column(
                children: [
                  // Sign Out
                  _buildMenuTile(
                    icon: Icons.logout_rounded,
                    iconColor: AppColors.textPrimary,
                    title: 'Sign Out',
                    onTap: () => _showSignOutDialog(context),
                  ),
                  const Divider(height: 1),

                  // Delete Account
                  _buildMenuTile(
                    icon: Icons.delete_outline_rounded,
                    iconColor: AppColors.error,
                    title: 'Delete Account',
                    titleColor: AppColors.error,
                    subtitle: 'Permanently remove your profile and data',
                    onTap: () => _showDeleteDialog(context),
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.xxl),
          ],
        ),
      ),
    );
  }

  Widget _buildMenuTile({
    required IconData icon,
    required String title,
    String? subtitle,
    Color? iconColor,
    Color? titleColor,
    required VoidCallback onTap,
  }) {
    return ListTile(
      contentPadding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.l,
        vertical: AppSpacing.xs,
      ),
      leading: Container(
        width: 40,
        height: 40,
        decoration: BoxDecoration(
          color: (iconColor ?? AppColors.primary).withOpacity(0.1),
          shape: BoxShape.circle,
        ),
        child: Icon(
          icon,
          color: iconColor ?? AppColors.primary,
          size: 20,
        ),
      ),
      title: Text(
        title,
        style: AppTypography.cardTitle.copyWith(
          fontSize: 15,
          color: titleColor ?? AppColors.textPrimary,
        ),
      ),
      subtitle: subtitle != null
          ? Text(subtitle, style: AppTypography.caption)
          : null,
      trailing: const Icon(
        Icons.chevron_right_rounded,
        color: AppColors.textMuted,
      ),
      onTap: onTap,
    );
  }

  void _showPrivacyDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Privacy & Data Notice'),
        content: const Text(
          'LivSync calculates compatibility based solely on declared living preferences.\n\n'
          '• Your private email and phone are never displayed publicly.\n'
          '• Compatibility scores are deterministic and decision-support aids.\n'
          '• You can toggle discovery visibility or delete your profile at any time.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Understood'),
          ),
        ],
      ),
    );
  }

  void _showSignOutDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Sign Out'),
        content: const Text('Are you sure you want to sign out of LivSync?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              minimumSize: const Size(80, 36),
            ),
            onPressed: () async {
              Navigator.pop(ctx);
              await ref.read(authNotifierProvider.notifier).signOut();
              if (context.mounted) {
                Navigator.pushNamedAndRemoveUntil(
                  context,
                  AppRoutes.welcome,
                  (route) => false,
                );
              }
            },
            child: const Text('Sign Out'),
          ),
        ],
      ),
    );
  }

  void _showDeleteDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Delete Account?'),
        content: const Text(
          'This action is irreversible. All your profile data, declared preferences, saved connections, and requests will be deleted.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.error,
              minimumSize: const Size(80, 36),
            ),
            onPressed: () async {
              Navigator.pop(ctx);
              await ref.read(authNotifierProvider.notifier).signOut();
              if (context.mounted) {
                Navigator.pushNamedAndRemoveUntil(
                  context,
                  AppRoutes.welcome,
                  (route) => false,
                );
              }
            },
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }
}
