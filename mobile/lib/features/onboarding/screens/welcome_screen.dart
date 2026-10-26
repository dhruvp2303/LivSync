import 'package:flutter/material.dart';
import '../../../core/routing/app_routes.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_typography.dart';
import '../../../shared/widgets/app_button.dart';

/// Screen 2: Welcome and Onboarding Carousel Screen.
class WelcomeScreen extends StatefulWidget {
  const WelcomeScreen({super.key});

  @override
  State<WelcomeScreen> createState() => _WelcomeScreenState();
}

class _WelcomeScreenState extends State<WelcomeScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  final List<Map<String, dynamic>> _onboardingData = [
    {
      'title': 'Find Roommates That Match Your Lifestyle',
      'subtitle': 'We match you based on your preferences, budget, routine, and living habits.',
      'icon': Icons.home_work_rounded,
      'accentColor': AppColors.primary,
    },
    {
      'title': 'Transparent Compatibility Scoring',
      'subtitle': 'See clear explanations of shared habits, sleep alignment, and points to discuss before deciding.',
      'icon': Icons.verified_user_rounded,
      'accentColor': AppColors.secondary,
    },
    {
      'title': 'Connect Safely & Effortlessly',
      'subtitle': 'Send roommate connection requests and find someone you genuinely enjoy living with.',
      'icon': Icons.chat_bubble_outline_rounded,
      'accentColor': AppColors.success,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.surface,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: AppSpacing.xl),
          child: Column(
            children: [
              const SizedBox(height: AppSpacing.m),
              // Top Logo Indicator
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    width: 32,
                    height: 32,
                    decoration: BoxDecoration(
                      color: AppColors.primaryLight,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Icon(
                      Icons.diversity_3_rounded,
                      color: AppColors.primary,
                      size: 20,
                    ),
                  ),
                  const SizedBox(width: AppSpacing.xs),
                  Text(
                    'LivSync',
                    style: AppTypography.cardTitle.copyWith(
                      fontWeight: FontWeight.bold,
                      color: AppColors.primary,
                    ),
                  ),
                ],
              ),
              const Spacer(),
              // Page Carousel
              SizedBox(
                height: 360,
                child: PageView.builder(
                  controller: _pageController,
                  onPageChanged: (index) {
                    setState(() {
                      _currentPage = index;
                    });
                  },
                  itemCount: _onboardingData.length,
                  itemBuilder: (context, index) {
                    final item = _onboardingData[index];
                    return Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        // Illustration card
                        Container(
                          width: 200,
                          height: 200,
                          decoration: BoxDecoration(
                            color: AppColors.primaryLight,
                            shape: BoxShape.circle,
                            border: Border.all(
                              color: const Color(0xFFE0E7FF),
                              width: 8,
                            ),
                          ),
                          child: Center(
                            child: Icon(
                              item['icon'] as IconData,
                              size: 80,
                              color: item['accentColor'] as Color,
                            ),
                          ),
                        ),
                        const SizedBox(height: AppSpacing.xxl),
                        Text(
                          item['title'] as String,
                          textAlign: TextAlign.center,
                          style: AppTypography.h2.copyWith(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: AppSpacing.s),
                        Text(
                          item['subtitle'] as String,
                          textAlign: TextAlign.center,
                          style: AppTypography.bodyMedium.copyWith(
                            height: 1.4,
                          ),
                        ),
                      ],
                    );
                  },
                ),
              ),
              // Dot Indicator
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(
                  _onboardingData.length,
                  (index) => AnimatedContainer(
                    duration: const Duration(milliseconds: 300),
                    margin: const EdgeInsets.symmetric(horizontal: 4),
                    width: _currentPage == index ? 24 : 8,
                    height: 8,
                    decoration: BoxDecoration(
                      color: _currentPage == index
                          ? AppColors.primary
                          : const Color(0xFFCBD5E1),
                      borderRadius: AppSpacing.borderRadiusFull,
                    ),
                  ),
                ),
              ),
              const Spacer(),
              // Action Buttons
              AppButton(
                label: 'Get Started',
                onPressed: () {
                  Navigator.pushNamed(context, AppRoutes.register);
                },
              ),
              const SizedBox(height: AppSpacing.m),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    'Already have an account? ',
                    style: AppTypography.bodyMedium,
                  ),
                  GestureDetector(
                    onTap: () {
                      Navigator.pushNamed(context, AppRoutes.login);
                    },
                    child: Text(
                      'Login',
                      style: AppTypography.bodyMedium.copyWith(
                        color: AppColors.primary,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: AppSpacing.l),
            ],
          ),
        ),
      ),
    );
  }
}
