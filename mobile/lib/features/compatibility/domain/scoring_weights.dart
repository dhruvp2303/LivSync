/// Configurable scoring weights for LivSync compatibility calculation.
/// Default values adhere to BRD Section 10.2 specifications.
class ScoringWeights {
  final double budget;
  final double location;
  final double lifestyle;
  final double sleep;
  final double cleanliness;
  final double food;
  final double routine;
  final double other;

  const ScoringWeights({
    this.budget = 0.20,
    this.location = 0.15,
    this.lifestyle = 0.15,
    this.sleep = 0.15,
    this.cleanliness = 0.10,
    this.food = 0.05,
    this.routine = 0.10,
    this.other = 0.10,
  });

  /// Validates that total weights equal 1.0 (100%).
  bool get isValidTotal {
    final total = budget +
        location +
        lifestyle +
        sleep +
        cleanliness +
        food +
        routine +
        other;
    return (total - 1.0).abs() < 0.0001;
  }

  /// Default baseline weights approved by BRD.
  static const ScoringWeights standard = ScoringWeights();
}
