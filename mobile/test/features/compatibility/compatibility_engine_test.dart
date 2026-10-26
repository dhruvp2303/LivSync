import 'package:flutter_test/flutter_test.dart';
import 'package:livsync_app/core/constants/app_constants.dart';
import 'package:livsync_app/features/compatibility/domain/compatibility_engine.dart';
import 'package:livsync_app/features/compatibility/domain/scoring_weights.dart';
import 'package:livsync_app/shared/models/living_preferences.dart';

void main() {
  group('ScoringWeights Tests', () {
    test('Standard weights sum to exactly 1.0 (100%)', () {
      const weights = ScoringWeights.standard;
      expect(weights.isValidTotal, isTrue);
      final total = weights.budget +
          weights.location +
          weights.lifestyle +
          weights.sleep +
          weights.cleanliness +
          weights.food +
          weights.routine +
          weights.other;
      expect(total, closeTo(1.0, 0.0001));
    });
  });

  group('CompatibilityEngine Tests', () {
    const engine = CompatibilityEngine();

    test('Identical preferences result in 100% compatibility', () {
      final now = DateTime.now();
      final p1 = LivingPreferences(
        id: 'pref-1',
        userId: 'user-1',
        budget: 7000,
        city: 'Ahmedabad',
        foodPreference: 'vegetarian',
        sleepTime: '11:00 PM',
        wakeTime: '07:00 AM',
        cleanliness: 4,
        routine: 'student',
        guests: 'occasionally',
        smoking: false,
        pets: false,
        noiseLevel: 'quiet',
        updatedAt: now,
      );

      final result = engine.calculate(p1, p1);

      expect(result.score, equals(100.0));
      expect(result.label, equals('High'));
      expect(result.isPartial, isFalse);
      expect(result.availableWeight, closeTo(1.0, 0.001));
      expect(result.strengths.isNotEmpty, isTrue);
      expect(result.differences.isEmpty, isTrue);
    });

    test('Significant conflict produces Lower compatibility score', () {
      final now = DateTime.now();
      final p1 = LivingPreferences(
        id: 'pref-1',
        userId: 'user-1',
        budget: 4000,
        city: 'Ahmedabad',
        foodPreference: 'vegetarian',
        sleepTime: '10:00 PM',
        wakeTime: '06:00 AM',
        cleanliness: 5,
        routine: 'student',
        guests: 'never',
        smoking: false,
        pets: false,
        noiseLevel: 'quiet',
        updatedAt: now,
      );

      final p2 = LivingPreferences(
        id: 'pref-2',
        userId: 'user-2',
        budget: 15000,
        city: 'Mumbai',
        foodPreference: 'non-vegetarian',
        sleepTime: '03:00 AM',
        wakeTime: '12:00 PM',
        cleanliness: 1,
        routine: 'shift-worker',
        guests: 'often',
        smoking: true,
        pets: true,
        noiseLevel: 'lively',
        updatedAt: now,
      );

      final result = engine.calculate(p1, p2);

      expect(result.score, lessThan(AppConstants.moderateCompatibilityThreshold));
      expect(result.label, equals('Lower'));
      expect(result.differences.isNotEmpty, isTrue);
      expect(result.discussionPrompts.isNotEmpty, isTrue);
    });

    test('Missing preference fields are correctly normalized without artificial bias', () {
      final now = DateTime.now();
      // p1 only specified budget and sleep
      final p1 = LivingPreferences(
        id: 'pref-1',
        userId: 'user-1',
        budget: 7000,
        city: '',
        foodPreference: 'no-preference',
        sleepTime: '11:00 PM',
        wakeTime: '07:00 AM',
        cleanliness: null,
        routine: 'student',
        guests: 'occasionally',
        smoking: null,
        pets: null,
        noiseLevel: 'moderate',
        updatedAt: now,
      );

      final p2 = LivingPreferences(
        id: 'pref-2',
        userId: 'user-2',
        budget: 7000,
        city: '',
        foodPreference: 'no-preference',
        sleepTime: '11:00 PM',
        wakeTime: '07:00 AM',
        cleanliness: null,
        routine: 'student',
        guests: 'occasionally',
        smoking: null,
        pets: null,
        noiseLevel: 'moderate',
        updatedAt: now,
      );

      final result = engine.calculate(p1, p2);

      expect(result.score, greaterThan(80.0));
      expect(result.isPartial, isTrue);
      expect(result.availableWeight, lessThan(1.0));
    });

    test('Null inputs return insufficientData state', () {
      final result = engine.calculate(null, null);
      expect(result.score, equals(0.0));
      expect(result.label, equals('Insufficient Data'));
      expect(result.isPartial, isTrue);
    });
  });
}
