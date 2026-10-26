import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/theme/app_typography.dart';

/// Pill badge displaying compatibility percentage with appropriate semantic coloring.
class CompatibilityBadge extends StatelessWidget {
  final double score;
  final bool showLabel;
  final double fontSize;

  const CompatibilityBadge({
    super.key,
    required this.score,
    this.showLabel = true,
    this.fontSize = 12.0,
  });

  @override
  Widget build(BuildContext context) {
    final int rounded = score.round();
    Color bgColor;
    Color textColor;

    if (rounded >= 80) {
      bgColor = AppColors.successLight;
      textColor = const Color(0xFF15803D); // Forest green
    } else if (rounded >= 60) {
      bgColor = AppColors.warningLight;
      textColor = const Color(0xFFB45309); // Deep amber
    } else {
      bgColor = const Color(0xFFF1F5F9);
      textColor = AppColors.textSecondary;
    }

    final text = showLabel ? '$rounded% Match' : '$rounded%';

    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.s,
        vertical: AppSpacing.xxs + 1,
      ),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: AppSpacing.borderRadiusFull,
      ),
      child: Text(
        text,
        style: AppTypography.badge.copyWith(
          color: textColor,
          fontSize: fontSize,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }
}
