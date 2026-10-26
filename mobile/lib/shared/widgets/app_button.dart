import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/theme/app_typography.dart';

enum AppButtonType { primary, secondary, outline, ghost }

/// Reusable polished button supporting gradients, outlines, and loading spinners.
class AppButton extends StatelessWidget {
  final String label;
  final VoidCallback? onPressed;
  final AppButtonType type;
  final bool isLoading;
  final IconData? icon;
  final double? width;
  final double height;

  const AppButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.type = AppButtonType.primary,
    this.isLoading = false,
    this.icon,
    this.width,
    this.height = 54.0,
  });

  @override
  Widget build(BuildContext context) {
    final isEnabled = onPressed != null && !isLoading;

    if (type == AppButtonType.primary) {
      return Container(
        width: width ?? double.infinity,
        height: height,
        decoration: BoxDecoration(
          gradient: isEnabled ? AppColors.primaryGradient : null,
          color: isEnabled ? null : AppColors.border,
          borderRadius: AppSpacing.borderRadiusFull,
          boxShadow: isEnabled ? AppSpacing.buttonShadow : null,
        ),
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            onTap: isEnabled ? onPressed : null,
            borderRadius: AppSpacing.borderRadiusFull,
            child: Center(
              child: isLoading
                  ? const SizedBox(
                      width: 22,
                      height: 22,
                      child: CircularProgressIndicator(
                        strokeWidth: 2.5,
                        valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                      ),
                    )
                  : Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        if (icon != null) ...[
                          Icon(icon, color: Colors.white, size: 20),
                          const SizedBox(width: AppSpacing.xs),
                        ],
                        Text(label, style: AppTypography.button),
                      ],
                    ),
            ),
          ),
        ),
      );
    }

    if (type == AppButtonType.outline) {
      return SizedBox(
        width: width ?? double.infinity,
        height: height,
        child: OutlinedButton(
          onPressed: isEnabled ? onPressed : null,
          style: OutlinedButton.styleFrom(
            side: BorderSide(
              color: isEnabled ? AppColors.primary : AppColors.border,
              width: 1.5,
            ),
            shape: const RoundedRectangleBorder(
              borderRadius: AppSpacing.borderRadiusFull,
            ),
          ),
          child: isLoading
              ? const SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(strokeWidth: 2),
                )
              : Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    if (icon != null) ...[
                      Icon(icon, color: AppColors.primary, size: 20),
                      const SizedBox(width: AppSpacing.xs),
                    ],
                    Text(
                      label,
                      style: AppTypography.button.copyWith(
                        color: isEnabled ? AppColors.primary : AppColors.textMuted,
                      ),
                    ),
                  ],
                ),
        ),
      );
    }

    // Secondary / Ghost Button
    return SizedBox(
      width: width ?? double.infinity,
      height: height,
      child: TextButton(
        onPressed: isEnabled ? onPressed : null,
        child: Text(
          label,
          style: AppTypography.button.copyWith(
            color: isEnabled ? AppColors.primary : AppColors.textMuted,
          ),
        ),
      ),
    );
  }
}
