/// Application-wide constants, labels, and defaults.
class AppConstants {
  AppConstants._();

  static const String appName = 'LivSync';
  static const String appTagline = 'Find a roommate who matches the way you live.';

  // Scoring Thresholds (Provisional bands from BRD Section 10.5)
  static const double highCompatibilityThreshold = 80.0;
  static const double moderateCompatibilityThreshold = 60.0;

  // Factors keys
  static const String factorBudget = 'budget';
  static const String factorLocation = 'location';
  static const String factorLifestyle = 'lifestyle';
  static const String factorSleep = 'sleep';
  static const String factorCleanliness = 'cleanliness';
  static const String factorFood = 'food';
  static const String factorRoutine = 'routine';
  static const String factorOther = 'other';

  // Budget Default Options in INR
  static const List<int> budgetOptions = [3000, 5000, 7000, 10000, 15000, 20000];

  // Food Preference Options
  static const List<String> foodOptions = [
    'vegetarian',
    'non-vegetarian',
    'eggetarian',
    'no-preference',
  ];

  // Routine Options
  static const List<String> routineOptions = [
    'student',
    'professional',
    'freelancer',
    'shift-worker',
  ];

  // Guest Policy Options
  static const List<String> guestOptions = [
    'never',
    'occasionally',
    'often',
  ];

  // Noise Level Options
  static const List<String> noiseOptions = [
    'quiet',
    'moderate',
    'lively',
  ];
}
