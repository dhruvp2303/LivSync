export type AuthPage =
  | 'splash'
  | 'welcome'
  | 'login'
  | 'register'
  | 'intent-select'     // NEW: "Looking for a room" vs "Have a place"
  | 'profile-setup'
  | 'vibe-quiz';        // NEW: Personality / lifestyle quiz

export type Page =
  | 'discover'
  | 'saved'
  | 'connections'       // Renamed from "requests" → human-centric
  | 'groups'            // NEW: Living groups
  | 'profile';
