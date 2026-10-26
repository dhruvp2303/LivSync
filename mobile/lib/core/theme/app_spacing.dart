import 'package:flutter/material.dart';

/// Centralized 8-point spacing grid, corner radii, and shadow tokens.
class AppSpacing {
  AppSpacing._();

  // Spacing Increments
  static const double xxs = 4.0;
  static const double xs = 8.0;
  static const double s = 12.0;
  static const double m = 16.0;
  static const double l = 20.0;
  static const double xl = 24.0;
  static const double xxl = 32.0;
  static const double xxxl = 40.0;
  static const double massive = 48.0;

  // Corner Radii
  static const double radiusS = 8.0;
  static const double radiusM = 12.0;
  static const double radiusL = 16.0;
  static const double radiusXL = 20.0;
  static const double radiusCard = 24.0;
  static const double radiusFull = 999.0;

  // Card Borders & Corner Radius
  static const BorderRadius borderRadiusS = BorderRadius.all(Radius.circular(radiusS));
  static const BorderRadius borderRadiusM = BorderRadius.all(Radius.circular(radiusM));
  static const BorderRadius borderRadiusL = BorderRadius.all(Radius.circular(radiusL));
  static const BorderRadius borderRadiusXL = BorderRadius.all(Radius.circular(radiusXL));
  static const BorderRadius borderRadiusCard = BorderRadius.all(Radius.circular(radiusCard));
  static const BorderRadius borderRadiusFull = BorderRadius.all(Radius.circular(radiusFull));

  // Subtle Box Shadows
  static const List<BoxShadow> cardShadow = [
    BoxShadow(
      color: Color(0x0A0F172A),
      offset: Offset(0, 4),
      blurRadius: 16,
      spreadRadius: 0,
    ),
    BoxShadow(
      color: Color(0x050F172A),
      offset: Offset(0, 1),
      blurRadius: 4,
      spreadRadius: 0,
    ),
  ];

  static const List<BoxShadow> buttonShadow = [
    BoxShadow(
      color: Color(0x335B5BFF),
      offset: Offset(0, 4),
      blurRadius: 12,
      spreadRadius: 0,
    ),
  ];

  static const List<BoxShadow> bottomNavShadow = [
    BoxShadow(
      color: Color(0x0D0F172A),
      offset: Offset(0, -4),
      blurRadius: 16,
      spreadRadius: 0,
    ),
  ];
}
