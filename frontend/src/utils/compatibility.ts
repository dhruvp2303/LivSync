import type { Preferences, CompatibilityResult, CompatibilityFactor } from '@/types';

// Scoring weights (provisional — require stakeholder approval)
const WEIGHTS = {
  budget: 0.20,
  location: 0.15,
  lifestyle: 0.15,
  sleep: 0.15,
  cleanliness: 0.10,
  food: 0.05,
  routine: 0.10,
  other: 0.10,
};

function scoreBudget(a: number, b: number): number {
  if (!a || !b) return -1;
  const diff = Math.abs(a - b);
  const avg = (a + b) / 2;
  const ratio = diff / avg;
  if (ratio <= 0.1) return 100;
  if (ratio <= 0.2) return 80;
  if (ratio <= 0.4) return 55;
  if (ratio <= 0.6) return 30;
  return 10;
}

function scoreLocation(a: string, b: string): number {
  if (!a || !b) return -1;
  const normalize = (s: string) => s.trim().toLowerCase();
  return normalize(a) === normalize(b) ? 100 : 0;
}

function scoreSleep(aSleep: string, aWake: string, bSleep: string, bWake: string): number {
  if (!aSleep || !aWake || !bSleep || !bWake) return -1;
  const parseHour = (t: string): number => {
    const m = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!m) return 0;
    let h = parseInt(m[1]);
    const ampm = m[3].toUpperCase();
    if (ampm === 'PM' && h !== 12) h += 12;
    if (ampm === 'AM' && h === 12) h = 0;
    return h;
  };
  const diffHours = (x: number, y: number) => Math.min(Math.abs(x - y), 24 - Math.abs(x - y));
  const sleepDiff = diffHours(parseHour(aSleep), parseHour(bSleep));
  const wakeDiff = diffHours(parseHour(aWake), parseHour(bWake));
  const avgDiff = (sleepDiff + wakeDiff) / 2;
  if (avgDiff <= 1) return 100;
  if (avgDiff <= 2) return 80;
  if (avgDiff <= 3) return 55;
  if (avgDiff <= 5) return 30;
  return 10;
}

function scoreCleanliness(a: number, b: number): number {
  if (!a || !b) return -1;
  const diff = Math.abs(a - b);
  if (diff === 0) return 100;
  if (diff === 1) return 75;
  if (diff === 2) return 40;
  return 10;
}

function scoreFood(a: string, b: string): number {
  if (!a || !b || a === 'no-preference' || b === 'no-preference') return -1;
  if (a === b) return 100;
  if ((a === 'vegetarian' && b === 'eggetarian') || (a === 'eggetarian' && b === 'vegetarian')) return 70;
  if (a === 'non-vegetarian' && b !== 'non-vegetarian') return 40;
  if (b === 'non-vegetarian' && a !== 'non-vegetarian') return 40;
  return 60;
}

function scoreRoutine(a: string, b: string): number {
  if (!a || !b) return -1;
  if (a === b) return 100;
  if (
    (a === 'student' && b === 'professional') ||
    (a === 'professional' && b === 'student')
  ) return 60;
  if (a === 'shift-worker' || b === 'shift-worker') return 40;
  return 70;
}

function scoreOther(a: Preferences, b: Preferences): number {
  let total = 0;
  let count = 0;
  if (a.smoking !== undefined && b.smoking !== undefined) {
    total += a.smoking === b.smoking ? 100 : 0;
    count++;
  }
  if (a.pets !== undefined && b.pets !== undefined) {
    total += a.pets === b.pets ? 100 : 30;
    count++;
  }
  if (a.guests && b.guests) {
    const gMap: Record<string, number> = { never: 0, occasionally: 1, often: 2 };
    const diff = Math.abs((gMap[a.guests] ?? 1) - (gMap[b.guests] ?? 1));
    total += diff === 0 ? 100 : diff === 1 ? 60 : 20;
    count++;
  }
  if (a.noise_level && b.noise_level) {
    const nMap: Record<string, number> = { quiet: 0, moderate: 1, lively: 2 };
    const diff = Math.abs((nMap[a.noise_level] ?? 1) - (nMap[b.noise_level] ?? 1));
    total += diff === 0 ? 100 : diff === 1 ? 60 : 20;
    count++;
  }
  return count > 0 ? total / count : -1;
}

function scoreLifestyle(a: Preferences, b: Preferences): number {
  return scoreOther(a, b);
}

function interpretMatch(score: number): 'similar' | 'different' | 'unknown' {
  if (score < 0) return 'unknown';
  if (score >= 65) return 'similar';
  return 'different';
}

export function calculateCompatibility(
  myPrefs: Preferences,
  theirPrefs: Preferences
): CompatibilityResult {
  const rawScores: Record<string, number> = {
    budget: scoreBudget(myPrefs.budget, theirPrefs.budget),
    location: scoreLocation(myPrefs.city, theirPrefs.city),
    lifestyle: scoreLifestyle(myPrefs, theirPrefs),
    sleep: scoreSleep(myPrefs.sleep_time, myPrefs.wake_time, theirPrefs.sleep_time, theirPrefs.wake_time),
    cleanliness: scoreCleanliness(myPrefs.cleanliness, theirPrefs.cleanliness),
    food: scoreFood(myPrefs.food_preference, theirPrefs.food_preference),
    routine: scoreRoutine(myPrefs.routine, theirPrefs.routine),
    other: scoreOther(myPrefs, theirPrefs),
  };

  const factorMeta: Record<string, { name: string; weight: number; description: (s: number) => string }> = {
    budget: {
      name: 'Monthly Budget',
      weight: WEIGHTS.budget,
      description: (s) => s >= 65 ? 'Similar monthly rental budget' : 'Different budget expectations',
    },
    location: {
      name: 'Location',
      weight: WEIGHTS.location,
      description: (s) => s >= 65 ? 'Same city preference' : 'Different city preferences',
    },
    lifestyle: {
      name: 'Lifestyle',
      weight: WEIGHTS.lifestyle,
      description: (s) => s >= 65 ? 'Compatible lifestyle habits' : 'Some lifestyle differences',
    },
    sleep: {
      name: 'Sleep Schedule',
      weight: WEIGHTS.sleep,
      description: (s) => s >= 65 ? 'Compatible sleep schedules' : 'Different sleep schedules',
    },
    cleanliness: {
      name: 'Cleanliness',
      weight: WEIGHTS.cleanliness,
      description: (s) => s >= 65 ? 'Similar cleanliness standards' : 'Different cleanliness expectations',
    },
    food: {
      name: 'Food Preference',
      weight: WEIGHTS.food,
      description: (s) => s >= 65 ? 'Compatible food preferences' : 'Food preferences worth discussing',
    },
    routine: {
      name: 'Work/Study Routine',
      weight: WEIGHTS.routine,
      description: (s) => s >= 65 ? 'Similar daily routines' : 'Different daily routines',
    },
    other: {
      name: 'Shared Preferences',
      weight: WEIGHTS.other,
      description: (s) => s >= 65 ? 'Aligned on guests, pets & noise' : 'Some differences in shared preferences',
    },
  };

  const factors: CompatibilityFactor[] = [];
  let weightedSum = 0;
  let availableWeight = 0;

  for (const [key, raw] of Object.entries(rawScores)) {
    const meta = factorMeta[key];
    const isAvailable = raw >= 0;
    if (isAvailable) {
      availableWeight += meta.weight;
      weightedSum += raw * meta.weight;
    }
    factors.push({
      name: meta.name,
      score: isAvailable ? raw : 0,
      weight: meta.weight,
      match: interpretMatch(raw),
      description: isAvailable ? meta.description(raw) : `${meta.name} not available`,
    });
  }

  const strengths: string[] = [];
  const differences: string[] = [];
  const missingFactors: string[] = [];

  for (const f of factors) {
    if (f.match === 'similar') {
      strengths.push(f.description);
    } else if (f.match === 'different') {
      differences.push(f.description);
    } else {
      missingFactors.push(`${f.name} information missing`);
    }
  }

  return {
    score,
    label,
    factors,
    availableWeight,
    isPartial: availableWeight < 0.9,
    strengths,
    differences,
    missingFactors,
  };
}
