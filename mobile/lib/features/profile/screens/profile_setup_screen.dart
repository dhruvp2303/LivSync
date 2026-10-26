import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/routing/app_routes.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_typography.dart';
import '../../../shared/widgets/app_button.dart';
import '../../../shared/widgets/app_text_field.dart';
import '../../authentication/providers/auth_provider.dart';

/// Screen 5: Profile Setup (Step 1 of 2) matching reference mockups.
class ProfileSetupScreen extends ConsumerStatefulWidget {
  const ProfileSetupScreen({super.key});

  @override
  ConsumerState<ProfileSetupScreen> createState() => _ProfileSetupScreenState();
}

class _ProfileSetupScreenState extends ConsumerState<ProfileSetupScreen> {
  final _formKey = GlobalKey<FormState>();
  late TextEditingController _nameController;
  late TextEditingController _ageController;
  late TextEditingController _cityController;
  late TextEditingController _occupationController;
  String _selectedGender = 'Male';
  String? _avatarUrl;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    final user = ref.read(authNotifierProvider).value;
    _nameController = TextEditingController(text: user?.displayName ?? 'Bhavin Patel');
    _ageController = TextEditingController(text: user?.age?.toString() ?? '22');
    _cityController = TextEditingController(text: user?.city.isNotEmpty == true ? user!.city : 'Ahmedabad');
    _occupationController = TextEditingController(text: user?.occupation.isNotEmpty == true ? user!.occupation : 'Student');
    _selectedGender = user?.gender ?? 'Male';
    _avatarUrl = user?.avatarUrl ?? 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
  }

  @override
  void dispose() {
    _nameController.dispose();
    _ageController.dispose();
    _cityController.dispose();
    _occupationController.dispose();
    super.dispose();
  }

  Future<void> _handleSaveAndContinue() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
    });

    try {
      final currentUser = ref.read(authNotifierProvider).value;
      if (currentUser != null) {
        final updated = currentUser.copyWith(
          displayName: _nameController.text.trim(),
          age: int.tryParse(_ageController.text.trim()),
          gender: _selectedGender,
          city: _cityController.text.trim(),
          occupation: _occupationController.text.trim(),
          avatarUrl: _avatarUrl,
          updatedAt: DateTime.now(),
        );

        await ref.read(authNotifierProvider.notifier).updateProfile(updated);
      }

      if (!mounted) return;
      // Navigate to Step 2: Living Preferences Setup
      Navigator.pushNamed(context, AppRoutes.preferencesSetup);
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.surface,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 20),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: AppSpacing.xl),
            child: Center(
              child: Text(
                'Step 1 of 2',
                style: AppTypography.caption.copyWith(
                  color: AppColors.primary,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: AppSpacing.xl),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Progress Bar
                Container(
                  width: double.infinity,
                  height: 4,
                  decoration: BoxDecoration(
                    color: AppColors.border,
                    borderRadius: AppSpacing.borderRadiusFull,
                  ),
                  child: FractionallySizedBox(
                    alignment: Alignment.centerLeft,
                    widthFactor: 0.5,
                    child: Container(
                      decoration: const BoxDecoration(
                        color: AppColors.primary,
                        borderRadius: AppSpacing.borderRadiusFull,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: AppSpacing.xl),

                Text(
                  'Tell us about\nyourself',
                  style: AppTypography.h1.copyWith(fontSize: 28),
                ),
                const SizedBox(height: AppSpacing.xs),
                Text(
                  'Complete your basic details to help roommates know you.',
                  style: AppTypography.subtitle,
                ),
                const SizedBox(height: AppSpacing.xxl),

                // Avatar with Camera Icon
                Center(
                  child: Stack(
                    children: [
                      Container(
                        width: 104,
                        height: 104,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: AppColors.primaryLight,
                          border: Border.all(
                            color: AppColors.primary,
                            width: 2.5,
                          ),
                          image: _avatarUrl != null
                              ? DecorationImage(
                                  image: NetworkImage(_avatarUrl!),
                                  fit: BoxFit.cover,
                                )
                              : null,
                        ),
                        child: _avatarUrl == null
                            ? const Icon(
                                Icons.person,
                                size: 54,
                                color: AppColors.primary,
                              )
                            : null,
                      ),
                      Positioned(
                        bottom: 0,
                        right: 0,
                        child: GestureDetector(
                          onTap: () {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Photo selector triggered.'),
                              ),
                            );
                          },
                          child: Container(
                            width: 34,
                            height: 34,
                            decoration: BoxDecoration(
                              color: AppColors.primary,
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: Colors.white,
                                width: 2,
                              ),
                              boxShadow: AppSpacing.buttonShadow,
                            ),
                            child: const Icon(
                              Icons.camera_alt_rounded,
                              color: Colors.white,
                              size: 18,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: AppSpacing.xxl),

                // Full Name
                AppTextField(
                  label: 'Full Name',
                  hint: 'Bhavin Patel',
                  controller: _nameController,
                  prefixIcon: Icons.person_outline_rounded,
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Name is required';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: AppSpacing.l),

                // Age and Gender Row
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Age
                    Expanded(
                      flex: 4,
                      child: AppTextField(
                        label: 'Age',
                        hint: '22',
                        controller: _ageController,
                        keyboardType: TextInputType.number,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'Required';
                          }
                          final n = int.tryParse(value);
                          if (n == null || n < 18 || n > 99) {
                            return '18-99';
                          }
                          return null;
                        },
                      ),
                    ),
                    const SizedBox(width: AppSpacing.m),

                    // Gender Dropdown
                    Expanded(
                      flex: 6,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Gender',
                            style: AppTypography.caption.copyWith(
                              color: AppColors.textPrimary,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          const SizedBox(height: AppSpacing.xs),
                          Container(
                            height: 54,
                            padding: const EdgeInsets.symmetric(
                              horizontal: AppSpacing.m,
                            ),
                            decoration: BoxDecoration(
                              color: AppColors.surface,
                              borderRadius: AppSpacing.borderRadiusM,
                              border: Border.all(
                                color: AppColors.border,
                                width: 1,
                              ),
                            ),
                            child: DropdownButtonHideUnderline(
                              child: DropdownButton<String>(
                                value: _selectedGender,
                                isExpanded: true,
                                icon: const Icon(
                                  Icons.keyboard_arrow_down_rounded,
                                  color: AppColors.textSecondary,
                                ),
                                style: AppTypography.bodyLarge.copyWith(
                                  color: AppColors.textPrimary,
                                ),
                                items: const [
                                  DropdownMenuItem(value: 'Male', child: Text('Male')),
                                  DropdownMenuItem(value: 'Female', child: Text('Female')),
                                  DropdownMenuItem(value: 'Other', child: Text('Other')),
                                ],
                                onChanged: (val) {
                                  if (val != null) {
                                    setState(() {
                                      _selectedGender = val;
                                    });
                                  }
                                },
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: AppSpacing.l),

                // City
                AppTextField(
                  label: 'City',
                  hint: 'Ahmedabad',
                  controller: _cityController,
                  prefixIcon: Icons.location_on_outlined,
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'City is required';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: AppSpacing.l),

                // Occupation
                AppTextField(
                  label: 'Occupation',
                  hint: 'Student or Job title',
                  controller: _occupationController,
                  prefixIcon: Icons.work_outline_rounded,
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) {
                      return 'Occupation is required';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: AppSpacing.xxl),

                // Continue Button
                AppButton(
                  label: 'Continue',
                  isLoading: _isLoading,
                  onPressed: _handleSaveAndContinue,
                ),
                const SizedBox(height: AppSpacing.xl),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
