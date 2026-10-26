import 'scoring_weights.dart';
import '../../../core/utilities/time_utils.dart';
import '../../../core/constants/app_constants.dart';
import '../../../shared/models/living_preferences.dart';
import '../../../shared/models/compatibility_result.dart';

/// Pure Dart deterministic compatibility calculation engine.
/// Completely decoupled from UI, widgets, and database code.
class CompatibilityEngine {
  final ScoringWeights weights;

  const CompatibilityEngine({this.weights = ScoringWeights.standard});

  /// Main calculation method
  CompatibilityResult calculate(LivingPreferences? a, LivingPreferences? b) {
    if (a == null || b == null) {
      return CompatibilityResult.insufficientData();
    }

    final factors = <CompatibilityFactor>[];
    final strengths = <String>[];
    final differences = <String>[];
    final discussionPrompts = <String>[];

    double weightedSum = 0.0;
    double availableWeight = 0.0;

    // 1. Budget Factor (Weight: 20%)
    final budgetScore = _scoreBudget(a.budget, b.budget);
    if (budgetScore >= 0) {
      final weight = weights.budget;
      weightedSum += budgetScore * weight;
      availableWeight += weight;
      final isSimilar = budgetScore >= 75;
      factors.add(CompatibilityFactor(
        name: 'Rental Budget',
        factorKey: AppConstants.factorBudget,
        score: budgetScore,
        weight: weight,
        match: isSimilar ? 'similar' : 'different',
        description: isSimilar
            ? 'Close monthly rental budget expectations'
            : 'Significant variance in rental target share',
      ));
      if (isSimilar) {
        strengths.add('Similar monthly budget');
      } else {
        differences.add('Budget expectations differ');
        discussionPrompts.add('Clarify rent distribution and security deposit share.');
      }
    }

    // 2. Location Factor (Weight: 15%)
    final locationScore = _scoreLocation(a.city, b.city);
    if (locationScore >= 0) {
      final weight = weights.location;
      weightedSum += locationScore * weight;
      availableWeight += weight;
      final isSimilar = locationScore >= 70;
      factors.add(CompatibilityFactor(
        name: 'Location Preference',
        factorKey: AppConstants.factorLocation,
        score: locationScore,
        weight: weight,
        match: isSimilar ? 'similar' : 'different',
        description: isSimilar
            ? 'Both interested in ${a.city}'
            : 'Different preferred cities or areas',
      ));
      if (isSimilar && a.city.isNotEmpty) {
        strengths.add('Same target city (${a.city})');
      } else if (a.city.isNotEmpty && b.city.isNotEmpty) {
        differences.add('Preferred location variance');
        discussionPrompts.add('Agree on target neighborhood and commute distance.');
      }
    }

    // 3. Sleep Schedule Factor (Weight: 15%)
    final sleepScore = _scoreSleep(a.sleepTime, a.wakeTime, b.sleepTime, b.wakeTime);
    if (sleepScore >= 0) {
      final weight = weights.sleep;
      weightedSum += sleepScore * weight;
      availableWeight += weight;
      final isSimilar = sleepScore >= 75;
      factors.add(CompatibilityFactor(
        name: 'Sleep Schedule',
        factorKey: AppConstants.factorSleep,
        score: sleepScore,
        weight: weight,
        match: isSimilar ? 'similar' : 'different',
        description: isSimilar
            ? 'Well-aligned sleeping and waking hours'
            : 'Noticeable difference in sleep or wake times',
      ));
      if (isSimilar) {
        strengths.add('Compatible sleep schedule');
      } else {
        differences.add('Different sleep/wake times');
        discussionPrompts.add('Establish clear quiet hours and morning routines.');
      }
    }

    // 4. Cleanliness Factor (Weight: 10%)
    final cleanScore = _scoreCleanliness(a.cleanliness, b.cleanliness);
    if (cleanScore >= 0) {
      final weight = weights.cleanliness;
      weightedSum += cleanScore * weight;
      availableWeight += weight;
      final isSimilar = cleanScore >= 75;
      factors.add(CompatibilityFactor(
        name: 'Cleanliness Standards',
        factorKey: AppConstants.factorCleanliness,
        score: cleanScore,
        weight: weight,
        match: isSimilar ? 'similar' : 'different',
        description: isSimilar
            ? 'Similar cleanliness and tidiness expectations'
            : 'Different standards for household cleanliness',
      ));
      if (isSimilar) {
        strengths.add('Both value similar cleanliness');
      } else {
        differences.add('Cleanliness expectations differ');
        discussionPrompts.add('Discuss cleaning frequency and chore schedules.');
      }
    }

    // 5. Food Preferences (Weight: 5%)
    final foodScore = _scoreFood(a.foodPreference, b.foodPreference);
    if (foodScore >= 0) {
      final weight = weights.food;
      weightedSum += foodScore * weight;
      availableWeight += weight;
      final isSimilar = foodScore >= 70;
      factors.add(CompatibilityFactor(
        name: 'Dietary Preferences',
        factorKey: AppConstants.factorFood,
        score: foodScore,
        weight: weight,
        match: isSimilar ? 'similar' : 'different',
        description: isSimilar
            ? 'Compatible dietary preferences in the kitchen'
            : 'Different dietary choices (cooking/storage boundary needed)',
      ));
      if (isSimilar) {
        strengths.add('Dietary alignment');
      } else {
        differences.add('Different food preferences');
        discussionPrompts.add('Review shared cooking, utensils, and refrigerator storage.');
      }
    }

    // 6. Routine (Weight: 10%)
    final routineScore = _scoreRoutine(a.routine, b.routine);
    if (routineScore >= 0) {
      final weight = weights.routine;
      weightedSum += routineScore * weight;
      availableWeight += weight;
      final isSimilar = routineScore >= 70;
      factors.add(CompatibilityFactor(
        name: 'Study / Work Routine',
        factorKey: AppConstants.factorRoutine,
        score: routineScore,
        weight: weight,
        match: isSimilar ? 'similar' : 'different',
        description: isSimilar
            ? 'Complimentary study or work patterns'
            : 'Different work schedules or shift patterns',
      ));
      if (isSimilar) {
        strengths.add('Compatible work/study routine');
      } else {
        differences.add('Different study or work schedule');
        discussionPrompts.add('Discuss study/work from home space requirements.');
      }
    }

    // 7. Household Habits / Other Shared Preferences (Weight: 25% total - 15% Lifestyle + 10% Other)
    final otherScore = _scoreOther(a, b);
    if (otherScore >= 0) {
      final weight = weights.lifestyle + weights.other;
      weightedSum += otherScore * weight;
      availableWeight += weight;
      final isSimilar = otherScore >= 70;
      factors.add(CompatibilityFactor(
        name: 'Household & Lifestyle',
        factorKey: AppConstants.factorOther,
        score: otherScore,
        weight: weight,
        match: isSimilar ? 'similar' : 'different',
        description: isSimilar
            ? 'High alignment on guests, noise, pets, and smoking'
            : 'Variations in guest visits, noise, or pet policy',
      ));
      if (isSimilar) {
        strengths.add('Similar household rules & lifestyle');
      } else {
        differences.add('Household habits differ');
        discussionPrompts.add('Establish guidelines on guests, parties, and visitors.');
      }
    }

    // Missing Data & Normalization Rule (BRD Section 10.4)
    if (availableWeight == 0.0) {
      return CompatibilityResult.insufficientData();
    }

    final normalizedScore = (weightedSum / availableWeight).clamp(0.0, 100.0);
    final roundedScore = (normalizedScore * 10).round() / 10.0;

    String label;
    if (roundedScore >= AppConstants.highCompatibilityThreshold) {
      label = 'High';
    } else if (roundedScore >= AppConstants.moderateCompatibilityThreshold) {
      label = 'Moderate';
    } else {
      label = 'Lower';
    }

    // Always include fundamental roommate checklist items if empty
    if (discussionPrompts.isEmpty) {
      discussionPrompts.addAll([
        'Clarify bill sharing and utility payment procedures.',
        'Agree on guest policies and quiet hours.',
        'Confirm household chore sharing expectations.',
      ]);
    }

    return CompatibilityResult(
      score: roundedScore,
      label: label,
      factors: factors,
      availableWeight: availableWeight,
      isPartial: (availableWeight - 1.0).abs() > 0.05,
      strengths: strengths,
      differences: differences,
      discussionPrompts: discussionPrompts,
    );
  }

  // --- Factor Score Calculations ---

  double _scoreBudget(int? a, int? b) {
    if (a == null || b == null || a <= 0 || b <= 0) return -1.0;
    final diff = (a - b).abs();
    final avg = (a + b) / 2.0;
    final ratio = diff / avg;

    if (ratio <= 0.10) return 100.0;
    if (ratio <= 0.20) return 80.0;
    if (ratio <= 0.40) return 55.0;
    if (ratio <= 0.60) return 30.0;
    return 10.0;
  }

  double _scoreLocation(String? a, String? b) {
    if (a == null || b == null) return -1.0;
    final cleanA = a.trim().toLowerCase();
    final cleanB = b.trim().toLowerCase();
    if (cleanA.isEmpty || cleanB.isEmpty) return -1.0;
    return cleanA == cleanB ? 100.0 : 25.0;
  }

  double _scoreSleep(String? aSleep, String? aWake, String? bSleep, String? bWake) {
    final aSH = TimeUtils.parseHourOfDay(aSleep);
    final aWH = TimeUtils.parseHourOfDay(aWake);
    final bSH = TimeUtils.parseHourOfDay(bSleep);
    final bWH = TimeUtils.parseHourOfDay(bWake);

    if (aSH == null || aWH == null || bSH == null || bWH == null) {
      return -1.0;
    }

    final sleepDiff = TimeUtils.circularHourDifference(aSH, bSH);
    final wakeDiff = TimeUtils.circularHourDifference(aWH, bWH);
    final avgDiff = (sleepDiff + wakeDiff) / 2.0;

    if (avgDiff <= 1.0) return 100.0;
    if (avgDiff <= 2.0) return 80.0;
    if (avgDiff <= 3.0) return 55.0;
    if (avgDiff <= 5.0) return 30.0;
    return 10.0;
  }

  double _scoreCleanliness(int? a, int? b) {
    if (a == null || b == null) return -1.0;
    final diff = (a - b).abs();
    if (diff == 0) return 100.0;
    if (diff == 1) return 75.0;
    if (diff == 2) return 40.0;
    return 10.0;
  }

  double _scoreFood(String? a, String? b) {
    if (a == null || b == null) return -1.0;
    final normA = a.trim().toLowerCase();
    final normB = b.trim().toLowerCase();

    if (normA == 'no-preference' || normB == 'no-preference') return 85.0;
    if (normA == normB) return 100.0;

    if ((normA == 'vegetarian' && normB == 'eggetarian') ||
        (normA == 'eggetarian' && normB == 'vegetarian')) {
      return 70.0;
    }

    if (normA == 'non-vegetarian' || normB == 'non-vegetarian') {
      return 40.0;
    }

    return 60.0;
  }

  double _scoreRoutine(String? a, String? b) {
    if (a == null || b == null) return -1.0;
    final normA = a.trim().toLowerCase();
    final normB = b.trim().toLowerCase();

    if (normA == normB) return 100.0;
    if ((normA == 'student' && normB == 'professional') ||
        (normA == 'professional' && normB == 'student')) {
      return 65.0;
    }
    if (normA == 'shift-worker' || normB == 'shift-worker') {
      return 40.0;
    }
    return 70.0;
  }

  double _scoreOther(LivingPreferences a, LivingPreferences b) {
    int count = 0;
    double sum = 0.0;

    // Smoking
    if (a.smoking != null && b.smoking != null) {
      sum += a.smoking == b.smoking ? 100.0 : 0.0;
      count++;
    }

    // Pets
    if (a.pets != null && b.pets != null) {
      sum += a.pets == b.pets ? 100.0 : 30.0;
      count++;
    }

    // Guests
    final guestOrder = {'never': 0, 'occasionally': 1, 'often': 2};
    if (guestOrder.containsKey(a.guests) && guestOrder.containsKey(b.guests)) {
      final diff = (guestOrder[a.guests]! - guestOrder[b.guests]!).abs();
      sum += diff == 0 ? 100.0 : (diff == 1 ? 65.0 : 25.0);
      count++;
    }

    // Noise
    final noiseOrder = {'quiet': 0, 'moderate': 1, 'lively': 2};
    if (noiseOrder.containsKey(a.noiseLevel) && noiseOrder.containsKey(b.noiseLevel)) {
      final diff = (noiseOrder[a.noiseLevel]! - noiseOrder[b.noiseLevel]!).abs();
      sum += diff == 0 ? 100.0 : (diff == 1 ? 65.0 : 25.0);
      count++;
    }

    if (count == 0) return -1.0;
    return sum / count;
  }
}
