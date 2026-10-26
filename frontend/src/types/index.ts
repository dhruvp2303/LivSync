// ── User Intent ──────────────────────────────────────────────
export type UserIntent = 'seeking-room' | 'has-place';

// ── Vibe & Personality ───────────────────────────────────────
export type PersonalityTrait =
  | 'introvert' | 'extrovert' | 'ambivert';

export type EnergyLevel =
  | 'calm' | 'moderate' | 'high-energy';

export type SocialStyle =
  | 'homebody' | 'social-butterfly' | 'balanced';

export type CleanlinessLevel = 1 | 2 | 3 | 4 | 5;

export type SleepSchedule =
  | 'early-bird' | 'night-owl' | 'flexible';

export type FoodPreference =
  | 'vegetarian' | 'non-vegetarian' | 'eggetarian' | 'vegan' | 'no-preference';

export type WorkStyle =
  | 'student' | 'working-professional' | 'freelancer' | 'shift-worker' | 'hybrid';

export type GuestPolicy =
  | 'rarely' | 'sometimes' | 'often';

export type NoisePreference =
  | 'silent' | 'moderate' | 'lively';

export type GenderPreference =
  | 'male' | 'female' | 'any';

// ── Interests / Tags ─────────────────────────────────────────
export const INTEREST_OPTIONS = [
  'Music', 'Gaming', 'Cooking', 'Fitness', 'Reading',
  'Movies', 'Travel', 'Photography', 'Art', 'Sports',
  'Yoga', 'Dancing', 'Coding', 'Startups', 'Podcasts',
  'Anime', 'Gardening', 'Volunteering', 'Fashion', 'Food Explorer',
] as const;

export type Interest = typeof INTEREST_OPTIONS[number];

// ── Skill / Contribution Tags ────────────────────────────────
export const SKILL_OPTIONS = [
  'Great Cook', 'Cleanliness Pro', 'Handy Fixer', 'Budget Manager',
  'Night Driver', 'Social Connector', 'Calm Mediator', 'Morning Motivator',
  'Tech Savvy', 'Pet Lover',
] as const;

export type Skill = typeof SKILL_OPTIONS[number];

// ── User Profile ─────────────────────────────────────────────
export interface UserProfile {
  id: string;
  displayName: string;
  email?: string;
  isDemo?: boolean;
  age: number;
  gender: 'male' | 'female' | 'non-binary';
  avatarUrl: string;
  city: string;
  occupation: string;
  bio: string;
  intent: UserIntent;
  createdAt: string;

  // Vibe profile
  personality: PersonalityTrait;
  energyLevel: EnergyLevel;
  socialStyle: SocialStyle;
  cleanliness: CleanlinessLevel;
  sleepSchedule: SleepSchedule;
  foodPreference: FoodPreference;
  workStyle: WorkStyle;
  guestPolicy: GuestPolicy;
  noisePreference: NoisePreference;
  smoking: boolean;
  drinking: boolean;
  pets: boolean;

  // Interests & skills
  interests: Interest[];
  skills: Skill[];

  // Budget
  budget: number;

  // Preferences for a roommate
  preferredGender: GenderPreference;
  preferredAgeMin: number;
  preferredAgeMax: number;

  // For "has-place" users: room info
  roomInfo?: RoomInfo;
}

// ── Room Info (for users who have a place) ───────────────────
export interface RoomInfo {
  locality: string;
  rentPerPerson: number;
  totalCapacity: number;
  currentOccupants: number;
  furnishing: 'fully-furnished' | 'semi-furnished' | 'unfurnished';
  amenities: string[];
  photoUrls: string[];
  description: string;
}

// ── Compatibility ────────────────────────────────────────────
export type VibeLabel = 'Excellent Match' | 'High Compatibility' | 'Good Match' | 'Potential Match';

export interface VibeMatch {
  overallScore: number; // 0-100
  label: VibeLabel;
  factors: VibeMatchFactor[];
  strengths: string[];
  complementary: string[]; // e.g., "They love cooking, you don't!"
  differences: string[];
}

export interface VibeMatchFactor {
  name: string;
  score: number; // 0-100
  icon: string;
  description: string;
  type: 'similar' | 'complementary' | 'different';
}

// ── Candidate Card ───────────────────────────────────────────
export interface CandidateCard {
  profile: UserProfile;
  vibeMatch: VibeMatch;
  isSaved: boolean;
  connectionStatus: 'none' | 'sent' | 'received' | 'connected';
  mutualInterests: Interest[];
}

// ── Living Group ─────────────────────────────────────────────
export interface LivingGroup {
  id: string;
  name: string;
  members: UserProfile[];
  maxSize: number;
  budgetRange: { min: number; max: number };
  city: string;
  vibeScore: number;
  createdAt: string;
}

// ── Connection Request ───────────────────────────────────────
export interface ConnectionRequest {
  id: string;
  senderId: string;
  recipientId: string;
  message: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

// ── Filter Options ───────────────────────────────────────────
export interface FilterOptions {
  city: string;
  minBudget: number;
  maxBudget: number;
  workStyle: WorkStyle | 'all';
  foodPreference: FoodPreference | 'all';
  gender: GenderPreference;
  sleepSchedule: SleepSchedule | 'all';
  smoking: 'any' | 'no' | 'yes';
  pets: 'any' | 'no' | 'yes';
  interests: Interest[];
  sortBy: 'vibe-score' | 'budget-asc' | 'budget-desc' | 'newest';
}
