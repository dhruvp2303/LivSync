import 'package:flutter/material.dart';

/// Centralized color palette for LivSync application.
/// Derived strictly from the provided design system specifications.
class AppColors {
  AppColors._();

  // Brand Primaries
  static const Color primary = Color(0xFF5B5BFF);
  static const Color primaryPurple = Color(0xFF5B5FFB);
  static const Color secondary = Color(0xFF8B5CF6);
  static const Color primaryLight = Color(0xFFEEF2FF);
  static const Color secondaryLight = Color(0xFFF3E8FF);

  // Status & Semantic Colors
  static const Color success = Color(0xFF22C55E);
  static const Color successLight = Color(0xFFDCFCE7);
  static const Color warning = Color(0xFFF59E0B);
  static const Color warningLight = Color(0xFFFEF3C7);
  static const Color error = Color(0xFFEF4444);
  static const Color errorLight = Color(0xFFFEE2E2);

  // Neutral Backgrounds & Surfaces
  static const Color background = Color(0xFFF8FAFC);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color surfaceElevated = Color(0xFFFFFFFF);

  // Typography & Text
  static const Color textPrimary = Color(0xFF0F172A);
  static const Color textSecondary = Color(0xFF64748B);
  static const Color textMuted = Color(0xFF94A3B8);
  static const Color textLight = Color(0xFFFFFFFF);

  // Borders, Outlines & Dividers
  static const Color border = Color(0xFFE2E8F0);
  static const Color borderLight = Color(0xFFF1F5F9);
  static const Color divider = Color(0xFFE2E8F0);

  // Actions & Gestures
  static const Color passRed = Color(0xFFEF4444);
  static const Color saveAmber = Color(0xFFF59E0B);
  static const Color requestPurple = Color(0xFF5B5BFF);

  // Gradients
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [primary, secondary],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient cardOverlayGradient = LinearGradient(
    colors: [Colors.transparent, Color(0xCC0F172A)],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );

  static const LinearGradient splashGradient = LinearGradient(
    colors: [Color(0xFF4338CA), Color(0xFF5B5BFF), Color(0xFF7C3AED)],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );
}
