import type {
  UserProfile,
  VibeMatch,
  VibeMatchFactor,
  Interest,
} from '@/types';

/**
 * LivSync Vibe Matching Engine
 * ────────────────────────────
 * Scores similarity and complementarity across lifestyle, personality,
 * interests, budget, skills, and household basics.
 */

const WEIGHTS = {
  lifestyle: 0.25,
  personality: 0.20,
  interests: 0.20,
  budget: 0.15,
  complementary: 0.10,
  basics: 0.10,
};

// ── Lifestyle Score ──────────────────────────────────────────
function scoreLifestyle(a: UserProfile, b: UserProfile): VibeMatchFactor {
  let score = 0;
  let total = 0;

  total += 30;
  if (a.sleepSchedule === b.sleepSchedule) score += 30;
  else if (a.sleepSchedule === 'flexible' || b.sleepSchedule === 'flexible') score += 21;
  else score += 9;

  total += 30;
  const cleanDiff = Math.abs(a.cleanliness - b.cleanliness);
  score += Math.max(0, 30 - cleanDiff * 8);

  total += 20;
  if (a.noisePreference === b.noisePreference) score += 20;
  else if (a.noisePreference === 'moderate' || b.noisePreference === 'moderate') score += 12;
  else score += 4;

  total += 20;
  if (a.guestPolicy === b.guestPolicy) score += 20;
  else if (a.guestPolicy === 'sometimes' || b.guestPolicy === 'sometimes') score += 12;
  else score += 4;

  const pct = Math.round((score / total) * 100);
  return {
    name: 'Lifestyle Alignment',
    score: pct,
    icon: 'lifestyle',
    description:
      pct >= 80
        ? 'Highly synchronized daily routines'
        : pct >= 60
        ? 'Compatible routines with minor differences'
        : 'Different daily patterns and habits',
    type: pct >= 60 ? 'similar' : 'different',
  };
}

// ── Personality Score ────────────────────────────────────────
function scorePersonality(a: UserProfile, b: UserProfile): VibeMatchFactor {
  let score = 0;

  if (a.personality === b.personality) score += 35;
  else if (a.personality === 'ambivert' || b.personality === 'ambivert') score += 25;
  else score += 14;

  if (a.energyLevel === b.energyLevel) score += 35;
  else if (a.energyLevel === 'moderate' || b.energyLevel === 'moderate') score += 25;
  else score += 10;

  if (a.socialStyle === b.socialStyle) score += 30;
  else if (a.socialStyle === 'balanced' || b.socialStyle === 'balanced') score += 20;
  else score += 8;

  return {
    name: 'Personality Fit',
    score,
    icon: 'personality',
    description:
      score >= 80
        ? 'Harmonious social energy and temperament'
        : score >= 55
        ? 'Well-balanced personalities'
        : 'Different social preferences',
    type: score >= 55 ? 'similar' : 'different',
  };
}

// ── Interests Score ──────────────────────────────────────────
function scoreInterests(
  a: UserProfile,
  b: UserProfile
): { factor: VibeMatchFactor; mutual: Interest[] } {
  const mutual = a.interests.filter((i) => b.interests.includes(i));
  const maxPossible = Math.max(a.interests.length, b.interests.length, 1);
  const overlap = mutual.length / maxPossible;

  const score = Math.min(100, Math.round(overlap * 100 + (mutual.length >= 3 ? 15 : 0)));

  return {
    mutual,
    factor: {
      name: 'Shared Interests',
      score,
      icon: 'interests',
      description:
        mutual.length >= 4
          ? `${mutual.length} common hobbies and topics`
          : mutual.length >= 2
          ? `${mutual.length} shared interests`
          : mutual.length === 1
          ? '1 shared interest'
          : 'Distinct interests and pastimes',
      type: mutual.length >= 2 ? 'similar' : mutual.length === 0 ? 'different' : 'complementary',
    },
  };
}

// ── Budget Score ─────────────────────────────────────────────
function scoreBudget(a: UserProfile, b: UserProfile): VibeMatchFactor {
  const diff = Math.abs(a.budget - b.budget);
  const avg = (a.budget + b.budget) / 2 || 1;
  const pctDiff = diff / avg;

  let score: number;
  if (pctDiff <= 0.1) score = 100;
  else if (pctDiff <= 0.2) score = 85;
  else if (pctDiff <= 0.35) score = 65;
  else if (pctDiff <= 0.5) score = 45;
  else score = Math.max(10, Math.round(100 - pctDiff * 100));

  return {
    name: 'Budget Compatibility',
    score,
    icon: 'budget',
    description:
      score >= 85
        ? 'Direct rent target alignment'
        : score >= 60
        ? 'Compatible budget range overlap'
        : 'Distinct budget brackets',
    type: score >= 60 ? 'similar' : 'different',
  };
}

// ── Complementary Skills ─────────────────────────────────────
function scoreComplementary(
  a: UserProfile,
  b: UserProfile
): { factor: VibeMatchFactor; strengths: string[] } {
  const strengths: string[] = [];

  const bUniqueSkills = b.skills.filter((s) => !a.skills.includes(s));
  const aUniqueSkills = a.skills.filter((s) => !b.skills.includes(s));

  if (bUniqueSkills.includes('Great Cook') && !a.skills.includes('Great Cook')) {
    strengths.push('Enjoys cooking and culinary prep');
  }
  if (bUniqueSkills.includes('Cleanliness Pro') && !a.skills.includes('Cleanliness Pro')) {
    strengths.push('Proactive with cleanliness and sanitation');
  }
  if (bUniqueSkills.includes('Budget Manager') && !a.skills.includes('Budget Manager')) {
    strengths.push('Structured with utility and bill tracking');
  }
  if (bUniqueSkills.includes('Social Connector') && a.socialStyle === 'homebody') {
    strengths.push('Active connector for professional networking');
  }
  if (bUniqueSkills.includes('Morning Motivator') && a.sleepSchedule === 'night-owl') {
    strengths.push('Morning schedule helps maintain routine');
  }

  const totalUniqueExchange = bUniqueSkills.length + aUniqueSkills.length;
  const sharedSkills = a.skills.filter((s) => b.skills.includes(s));

  let score: number;
  if (totalUniqueExchange >= 4 && sharedSkills.length >= 1) score = 95;
  else if (totalUniqueExchange >= 3) score = 80;
  else if (totalUniqueExchange >= 2) score = 65;
  else if (sharedSkills.length >= 2) score = 60;
  else score = 40;

  return {
    strengths,
    factor: {
      name: 'Complementary Skills',
      score,
      icon: 'skills',
      description:
        strengths.length > 0
          ? 'Complementary strengths that balance flat duties'
          : sharedSkills.length >= 2
          ? 'Shared household maintenance capabilities'
          : 'Independent living styles',
      type: strengths.length > 0 ? 'complementary' : sharedSkills.length >= 2 ? 'similar' : 'different',
    },
  };
}

// ── Living Basics ────────────────────────────────────────────
function scoreBasics(a: UserProfile, b: UserProfile): VibeMatchFactor {
  let score = 0;

  if (a.foodPreference === b.foodPreference) score += 30;
  else if (a.foodPreference === 'no-preference' || b.foodPreference === 'no-preference') score += 22;
  else score += 10;

  if (a.smoking === b.smoking) score += 25;
  else score += 5;

  if (a.drinking === b.drinking) score += 20;
  else score += 10;

  if (a.pets === b.pets) score += 25;
  else score += 10;

  return {
    name: 'Household Policies',
    score,
    icon: 'basics',
    description:
      score >= 80
        ? 'High consensus on food, pets, and habits'
        : score >= 55
        ? 'Standard compatibility on home policies'
        : 'Different household preferences',
    type: score >= 55 ? 'similar' : 'different',
  };
}

// ── Main Matching Function ───────────────────────────────────
export function calculateVibeMatch(
  currentUser: UserProfile,
  candidate: UserProfile
): { vibeMatch: VibeMatch; mutualInterests: Interest[] } {
  const lifestyle = scoreLifestyle(currentUser, candidate);
  const personality = scorePersonality(currentUser, candidate);
  const { factor: interests, mutual } = scoreInterests(currentUser, candidate);
  const budget = scoreBudget(currentUser, candidate);
  const { factor: complementary, strengths } = scoreComplementary(currentUser, candidate);
  const basics = scoreBasics(currentUser, candidate);

  const factors = [lifestyle, personality, interests, budget, complementary, basics];

  const overallScore = Math.round(
    lifestyle.score * WEIGHTS.lifestyle +
      personality.score * WEIGHTS.personality +
      interests.score * WEIGHTS.interests +
      budget.score * WEIGHTS.budget +
      complementary.score * WEIGHTS.complementary +
      basics.score * WEIGHTS.basics
  );

  const differences = factors.filter((f) => f.type === 'different').map((f) => f.description);

  const similarities = factors.filter((f) => f.type === 'similar').map((f) => f.description);

  const label: VibeMatch['label'] =
    overallScore >= 85
      ? 'Excellent Match'
      : overallScore >= 70
      ? 'High Compatibility'
      : overallScore >= 55
      ? 'Good Match'
      : 'Potential Match';

  return {
    mutualInterests: mutual,
    vibeMatch: {
      overallScore,
      label,
      factors,
      strengths: similarities,
      complementary: strengths,
      differences,
    },
  };
}
