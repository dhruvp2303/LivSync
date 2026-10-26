/// Model representing declared living preferences used for compatibility matching.
class LivingPreferences {
  final String id;
  final String userId;
  final int? budget;
  final String city;
  final String foodPreference;
  final String? sleepTime;
  final String? wakeTime;
  final int? cleanliness; // Scale 1 to 5
  final String routine; // student, professional, freelancer, shift-worker
  final String guests; // never, occasionally, often
  final bool? smoking;
  final bool? pets;
  final String noiseLevel; // quiet, moderate, lively
  final DateTime updatedAt;

  const LivingPreferences({
    required this.id,
    required this.userId,
    this.budget,
    this.city = '',
    this.foodPreference = 'no-preference',
    this.sleepTime,
    this.wakeTime,
    this.cleanliness,
    this.routine = 'student',
    this.guests = 'occasionally',
    this.smoking,
    this.pets,
    this.noiseLevel = 'moderate',
    required this.updatedAt,
  });

  LivingPreferences copyWith({
    String? id,
    String? userId,
    int? budget,
    String? city,
    String? foodPreference,
    String? sleepTime,
    String? wakeTime,
    int? cleanliness,
    String? routine,
    String? guests,
    bool? smoking,
    bool? pets,
    String? noiseLevel,
    DateTime? updatedAt,
  }) {
    return LivingPreferences(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      budget: budget ?? this.budget,
      city: city ?? this.city,
      foodPreference: foodPreference ?? this.foodPreference,
      sleepTime: sleepTime ?? this.sleepTime,
      wakeTime: wakeTime ?? this.wakeTime,
      cleanliness: cleanliness ?? this.cleanliness,
      routine: routine ?? this.routine,
      guests: guests ?? this.guests,
      smoking: smoking ?? this.smoking,
      pets: pets ?? this.pets,
      noiseLevel: noiseLevel ?? this.noiseLevel,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'user_id': userId,
      'budget': budget,
      'city': city,
      'food_preference': foodPreference,
      'sleep_time': sleepTime,
      'wake_time': wakeTime,
      'cleanliness': cleanliness,
      'routine': routine,
      'guests': guests,
      'smoking': smoking,
      'pets': pets,
      'noise_level': noiseLevel,
      'updated_at': updatedAt.toIso8601String(),
    };
  }

  factory LivingPreferences.fromMap(Map<String, dynamic> map, String docId) {
    return LivingPreferences(
      id: docId,
      userId: map['user_id'] as String? ?? docId,
      budget: (map['budget'] as num?)?.toInt(),
      city: map['city'] as String? ?? '',
      foodPreference: map['food_preference'] as String? ?? 'no-preference',
      sleepTime: map['sleep_time'] as String?,
      wakeTime: map['wake_time'] as String?,
      cleanliness: (map['cleanliness'] as num?)?.toInt(),
      routine: map['routine'] as String? ?? 'student',
      guests: map['guests'] as String? ?? 'occasionally',
      smoking: map['smoking'] as bool?,
      pets: map['pets'] as bool?,
      noiseLevel: map['noise_level'] as String? ?? 'moderate',
      updatedAt: map['updated_at'] != null
          ? DateTime.tryParse(map['updated_at'].toString()) ?? DateTime.now()
          : DateTime.now(),
    );
  }
}
