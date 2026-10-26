/// Represents the calculated compatibility between two profiles.
class CompatibilityResult {
  final double score; // 0.0 to 100.0
  final String label; // 'High', 'Moderate', 'Lower'
  final List<CompatibilityFactor> factors;
  final double availableWeight; // Fraction of weights that had valid data (0.0 to 1.0)
  final bool isPartial;
  final List<String> strengths;
  final List<String> differences;
  final List<String> discussionPrompts;

  const CompatibilityResult({
    required this.score,
    required this.label,
    required this.factors,
    required this.availableWeight,
    required this.isPartial,
    required this.strengths,
    required this.differences,
    required this.discussionPrompts,
  });

  /// Factory for an insufficient data state
  factory CompatibilityResult.insufficientData() {
    return const CompatibilityResult(
      score: 0.0,
      label: 'Insufficient Data',
      factors: [],
      availableWeight: 0.0,
      isPartial: true,
      strengths: [],
      differences: [],
      discussionPrompts: [
        'Complete more profile preferences to calculate compatibility.',
      ],
    );
  }
}

/// A breakdown factor score for a specific dimension.
class CompatibilityFactor {
  final String name;
  final String factorKey;
  final double score; // 0.0 to 100.0
  final double weight; // e.g. 0.20
  final String match; // 'similar', 'different', 'unknown'
  final String description;

  const CompatibilityFactor({
    required this.name,
    required this.factorKey,
    required this.score,
    required this.weight,
    required this.match,
    required this.description,
  });
}
