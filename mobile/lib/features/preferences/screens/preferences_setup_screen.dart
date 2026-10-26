import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/routing/app_routes.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_typography.dart';
import '../../../shared/models/living_preferences.dart';
import '../../../shared/widgets/app_button.dart';
import '../../../shared/widgets/preference_chip.dart';
import '../../authentication/providers/auth_provider.dart';

/// Screen 6: Preferences Setup (Step 2 of 2) matching reference mockups.
class PreferencesSetupScreen extends ConsumerStatefulWidget {
  const PreferencesSetupScreen({super.key});

  @override
  ConsumerState<PreferencesSetupScreen> createState() => _PreferencesSetupScreenState();
}

class _PreferencesSetupScreenState extends ConsumerState<PreferencesSetupScreen> {
  int _selectedBudget = 7000;
  String _selectedFood = 'vegetarian';
  String _selectedSleepTime = '11:00 PM';
  String _selectedWakeTime = '07:00 AM';
  int _cleanlinessRating = 4;
  String _selectedRoutine = 'student';
  bool _smoking = false;
  bool _pets = false;
  String _guests = 'occasionally';
  String _noiseLevel = 'quiet';

  bool _isLoading = false;

  final List<int> _budgetChips = [3000, 5000, 7000, 10000];

  final List<Map<String, String>> _foodChips = [
    {'label': 'Vegetarian', 'value': 'vegetarian'},
    {'label': 'Non-Vegetarian', 'value': 'non-vegetarian'},
    {'label': 'Eggetarian', 'value': 'eggetarian'},
  ];

  final List<String> _sleepOptions = [
    '09:00 PM',
    '10:00 PM',
    '11:00 PM',
    '12:00 AM',
    '01:00 AM',
    '02:00 AM',
  ];

  final List<String> _wakeOptions = [
    '05:00 AM',
    '06:00 AM',
    '07:00 AM',
    '08:00 AM',
    '09:00 AM',
    '10:00 AM',
  ];

  final List<Map<String, String>> _routineChips = [
    {'label': 'Student', 'value': 'student'},
    {'label': 'Professional', 'value': 'professional'},
    {'label': 'Freelancer', 'value': 'freelancer'},
    {'label': 'Shift Worker', 'value': 'shift-worker'},
  ];

  @override
  void initState() {
    super.initState();
    final prefs = ref.read(preferencesNotifierProvider).value;
    if (prefs != null) {
      if (prefs.budget != null) _selectedBudget = prefs.budget!;
      _selectedFood = prefs.foodPreference;
      if (prefs.sleepTime != null) _selectedSleepTime = prefs.sleepTime!;
      if (prefs.wakeTime != null) _selectedWakeTime = prefs.wakeTime!;
      if (prefs.cleanliness != null) _cleanlinessRating = prefs.cleanliness!;
      _selectedRoutine = prefs.routine;
      if (prefs.smoking != null) _smoking = prefs.smoking!;
      if (prefs.pets != null) _pets = prefs.pets!;
      _guests = prefs.guests;
      _noiseLevel = prefs.noiseLevel;
    }
  }

  Future<void> _handleCompletePreferences() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final currentUser = ref.read(authNotifierProvider).value;
      if (currentUser != null) {
        final prefs = LivingPreferences(
          id: 'pref_${currentUser.id}',
          userId: currentUser.id,
          budget: _selectedBudget,
          city: currentUser.city,
          foodPreference: _selectedFood,
          sleepTime: _selectedSleepTime,
          wakeTime: _selectedWakeTime,
          cleanliness: _cleanlinessRating,
          routine: _selectedRoutine,
          guests: _guests,
          smoking: _smoking,
          pets: _pets,
          noiseLevel: _noiseLevel,
          updatedAt: DateTime.now(),
        );

        await ref.read(preferencesNotifierProvider.notifier).savePreferences(prefs);

        // Mark profile complete
        final updatedUser = currentUser.copyWith(
          isProfileComplete: true,
          updatedAt: DateTime.now(),
        );
        await ref.read(authNotifierProvider.notifier).updateProfile(updatedUser);
      }

      if (!mounted) return;

      // Navigate to Main Roommate Experience
      Navigator.pushNamedAndRemoveUntil(
        context,
        AppRoutes.mainNavigation,
        (route) => false,
      );
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
                'Step 2 of 2',
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
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Progress Bar (100%)
              Container(
                width: double.infinity,
                height: 4,
                decoration: BoxDecoration(
                  color: AppColors.primary,
                  borderRadius: AppSpacing.borderRadiusFull,
                ),
              ),
              const SizedBox(height: AppSpacing.xl),

              Text(
                'Your Preferences',
                style: AppTypography.h1.copyWith(fontSize: 28),
              ),
              const SizedBox(height: AppSpacing.xs),
              Text(
                'This helps us find better matches for you.',
                style: AppTypography.subtitle,
              ),
              const SizedBox(height: AppSpacing.xxl),

              // 1. Monthly Budget
              _buildSectionTitle('Monthly Budget (INR)'),
              const SizedBox(height: AppSpacing.s),
              Wrap(
                spacing: AppSpacing.s,
                runSpacing: AppSpacing.s,
                children: _budgetChips.map((b) {
                  final isSelected = _selectedBudget == b;
                  return PreferenceChip(
                    label: b == 10000 ? '₹10,000+' : '₹$b',
                    isSelected: isSelected,
                    onTap: () {
                      setState(() {
                        _selectedBudget = b;
                      });
                    },
                  );
                }).toList(),
              ),
              const SizedBox(height: AppSpacing.xl),

              // 2. Food Preference
              _buildSectionTitle('Food Preference'),
              const SizedBox(height: AppSpacing.s),
              Wrap(
                spacing: AppSpacing.s,
                runSpacing: AppSpacing.s,
                children: _foodChips.map((f) {
                  final isSelected = _selectedFood == f['value'];
                  return PreferenceChip(
                    label: f['label']!,
                    isSelected: isSelected,
                    onTap: () {
                      setState(() {
                        _selectedFood = f['value']!;
                      });
                    },
                  );
                }).toList(),
              ),
              const SizedBox(height: AppSpacing.xl),

              // 3. Sleep & Wake Time
              Row(
                children: [
                  // Sleep Time
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildSectionTitle('Sleep Time'),
                        const SizedBox(height: AppSpacing.xs),
                        _buildDropdown(
                          value: _selectedSleepTime,
                          options: _sleepOptions,
                          onChanged: (val) {
                            if (val != null) setState(() => _selectedSleepTime = val);
                          },
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: AppSpacing.m),
                  // Wake Up Time
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _buildSectionTitle('Wake Up Time'),
                        const SizedBox(height: AppSpacing.xs),
                        _buildDropdown(
                          value: _selectedWakeTime,
                          options: _wakeOptions,
                          onChanged: (val) {
                            if (val != null) setState(() => _selectedWakeTime = val);
                          },
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.xl),

              // 4. Cleanliness Level
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  _buildSectionTitle('Cleanliness Standard'),
                  Text(
                    _cleanlinessLabel(_cleanlinessRating),
                    style: AppTypography.caption.copyWith(
                      color: AppColors.primary,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              SliderTheme(
                data: SliderTheme.of(context).copyWith(
                  activeTrackColor: AppColors.primary,
                  inactiveTrackColor: AppColors.border,
                  thumbColor: AppColors.primary,
                  overlayColor: AppColors.primaryLight,
                  trackHeight: 6,
                ),
                child: Slider(
                  value: _cleanlinessRating.toDouble(),
                  min: 1,
                  max: 5,
                  divisions: 4,
                  onChanged: (val) {
                    setState(() {
                      _cleanlinessRating = val.toInt();
                    });
                  },
                ),
              ),
              const SizedBox(height: AppSpacing.l),

              // 5. Routine
              _buildSectionTitle('Daily Routine'),
              const SizedBox(height: AppSpacing.s),
              Wrap(
                spacing: AppSpacing.s,
                runSpacing: AppSpacing.s,
                children: _routineChips.map((r) {
                  final isSelected = _selectedRoutine == r['value'];
                  return PreferenceChip(
                    label: r['label']!,
                    isSelected: isSelected,
                    onTap: () {
                      setState(() {
                        _selectedRoutine = r['value']!;
                      });
                    },
                  );
                }).toList(),
              ),
              const SizedBox(height: AppSpacing.xl),

              // 6. Household Policies
              _buildSectionTitle('Household Habits'),
              const SizedBox(height: AppSpacing.s),
              Wrap(
                spacing: AppSpacing.s,
                runSpacing: AppSpacing.s,
                children: [
                  PreferenceChip(
                    label: _smoking ? 'Smoker' : 'Non-smoker',
                    isSelected: !_smoking,
                    icon: Icons.smoking_rooms_outlined,
                    onTap: () => setState(() => _smoking = !_smoking),
                  ),
                  PreferenceChip(
                    label: _pets ? 'Has Pets' : 'No Pets',
                    isSelected: !_pets,
                    icon: Icons.pets_outlined,
                    onTap: () => setState(() => _pets = !_pets),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.xxl),

              // Complete Button
              AppButton(
                label: 'Save & Continue',
                isLoading: _isLoading,
                onPressed: _handleCompletePreferences,
              ),
              const SizedBox(height: AppSpacing.xxl),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: AppTypography.caption.copyWith(
        color: AppColors.textPrimary,
        fontWeight: FontWeight.w600,
      ),
    );
  }

  Widget _buildDropdown({
    required String value,
    required List<String> options,
    required void Function(String?) onChanged,
  }) {
    return Container(
      height: 52,
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.m),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: AppSpacing.borderRadiusM,
        border: Border.all(color: AppColors.border, width: 1),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          value: value,
          isExpanded: true,
          icon: const Icon(
            Icons.keyboard_arrow_down_rounded,
            color: AppColors.textSecondary,
          ),
          style: AppTypography.bodyLarge.copyWith(color: AppColors.textPrimary),
          items: options
              .map((o) => DropdownMenuItem(value: o, child: Text(o)))
              .toList(),
          onChanged: onChanged,
        ),
      ),
    );
  }

  String _cleanlinessLabel(int score) {
    switch (score) {
      case 1:
        return 'Relaxed';
      case 2:
        return 'Moderate';
      case 3:
        return 'Tidy';
      case 4:
        return 'Very Clean';
      case 5:
        return 'Immaculate';
      default:
        return 'Tidy';
    }
  }
}
