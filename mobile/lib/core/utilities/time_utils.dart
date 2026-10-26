import 'dart:math';

/// Utility methods for time parsing and circular hour distance calculation.
class TimeUtils {
  TimeUtils._();

  /// Parses a time string (e.g. "11:00 PM", "07:00 AM", "23:00") into hour of day (0..23).
  static double? parseHourOfDay(String? timeStr) {
    if (timeStr == null || timeStr.trim().isEmpty) return null;

    final trimmed = timeStr.trim();
    final ampmMatch = RegExp(r'^(\d{1,2}):(\d{2})\s*(AM|PM)?$', caseSensitive: false)
        .firstMatch(trimmed);

    if (ampmMatch != null) {
      int hour = int.tryParse(ampmMatch.group(1)!) ?? 0;
      final int minute = int.tryParse(ampmMatch.group(2)!) ?? 0;
      final String? ampm = ampmMatch.group(3)?.toUpperCase();

      if (ampm == 'PM' && hour != 12) {
        hour += 12;
      } else if (ampm == 'AM' && hour == 12) {
        hour = 0;
      }
      return hour + (minute / 60.0);
    }

    // Fallback 24-hour match "HH:MM"
    final hourMatch = RegExp(r'^(\d{1,2})').firstMatch(trimmed);
    if (hourMatch != null) {
      return double.tryParse(hourMatch.group(1)!);
    }
    return null;
  }

  /// Calculates the shortest difference in hours on a 24-hour cycle.
  /// E.g. difference between 23:00 and 01:00 is 2 hours.
  static double circularHourDifference(double h1, double h2) {
    final diff = (h1 - h2).abs();
    return min(diff, 24.0 - diff);
  }
}
