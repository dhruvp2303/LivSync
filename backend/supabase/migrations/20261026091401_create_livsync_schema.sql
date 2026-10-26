
/*
# LivSync Application Schema

## Summary
Creates the full database schema for LivSync, a roommate compatibility and discovery app.

## Tables Created

### 1. `profiles`
Public-facing profile data for each user.
- `id` — UUID primary key (matches auth.users.id)
- `display_name` — User's display name
- `avatar_url` — Optional profile photo URL
- `city` — City/area where the user is located
- `occupation` — Job or student status
- `bio` — Optional short bio
- `profile_complete` — Whether onboarding is complete
- `is_visible` — Whether this profile appears in discovery
- `created_at`, `updated_at` — timestamps

### 2. `preferences`
Living preference data used for compatibility scoring.
- `id` — UUID primary key
- `user_id` — FK to auth.users (owner)
- `budget` — Monthly rental budget (numeric, their share)
- `city` — Preferred city/area
- `food_preference` — vegetarian / non-vegetarian / eggetarian / no-preference
- `sleep_time` — e.g. "11:00 PM"
- `wake_time` — e.g. "07:00 AM"
- `cleanliness` — scale 1-5
- `routine` — student / professional / shift-worker / freelancer
- `guests` — never / occasionally / often
- `smoking` — boolean
- `pets` — boolean
- `noise_level` — quiet / moderate / lively
- `updated_at` — timestamp

### 3. `saved_profiles`
Profiles saved by a user for later review.
- `id` — UUID primary key
- `user_id` — who saved it
- `candidate_id` — who was saved
- `created_at` — timestamp

### 4. `roommate_requests`
Roommate connection requests between users.
- `id` — UUID primary key
- `sender_id` — user sending the request
- `recipient_id` — user receiving the request
- `status` — pending / accepted / rejected
- `message` — optional message
- `created_at`, `updated_at` — timestamps

## Security
- RLS enabled on all tables
- Users can only read/write their own data
- Profiles are publicly readable for discovery
- Requests are visible to sender and recipient only
*/

-- PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT '',
  avatar_url text,
  city text DEFAULT '',
  occupation text DEFAULT '',
  bio text DEFAULT '',
  profile_complete boolean NOT NULL DEFAULT false,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON profiles TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON profiles TO authenticated;

DROP POLICY IF EXISTS "select_profiles" ON profiles;
CREATE POLICY "select_profiles" ON profiles FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile" ON profiles FOR DELETE
TO authenticated USING (auth.uid() = id);

-- PREFERENCES TABLE
CREATE TABLE IF NOT EXISTS preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  budget integer DEFAULT 5000,
  city text DEFAULT '',
  food_preference text DEFAULT 'no-preference',
  sleep_time text DEFAULT '11:00 PM',
  wake_time text DEFAULT '07:00 AM',
  cleanliness integer DEFAULT 3,
  routine text DEFAULT 'student',
  guests text DEFAULT 'occasionally',
  smoking boolean DEFAULT false,
  pets boolean DEFAULT false,
  noise_level text DEFAULT 'moderate',
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE preferences ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON preferences TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON preferences TO authenticated;

DROP POLICY IF EXISTS "select_all_preferences" ON preferences;
CREATE POLICY "select_all_preferences" ON preferences FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_preferences" ON preferences;
CREATE POLICY "insert_own_preferences" ON preferences FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_preferences" ON preferences;
CREATE POLICY "update_own_preferences" ON preferences FOR UPDATE
TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_preferences" ON preferences;
CREATE POLICY "delete_own_preferences" ON preferences FOR DELETE
TO authenticated USING (auth.uid() = user_id);

-- SAVED PROFILES TABLE
CREATE TABLE IF NOT EXISTS saved_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  candidate_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, candidate_id)
);

ALTER TABLE saved_profiles ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, DELETE ON saved_profiles TO authenticated;

DROP POLICY IF EXISTS "select_own_saved" ON saved_profiles;
CREATE POLICY "select_own_saved" ON saved_profiles FOR SELECT
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_saved" ON saved_profiles;
CREATE POLICY "insert_own_saved" ON saved_profiles FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_saved" ON saved_profiles;
CREATE POLICY "delete_own_saved" ON saved_profiles FOR DELETE
TO authenticated USING (auth.uid() = user_id);

-- ROOMMATE REQUESTS TABLE
CREATE TABLE IF NOT EXISTS roommate_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','rejected')),
  message text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(sender_id, recipient_id)
);

ALTER TABLE roommate_requests ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON roommate_requests TO authenticated;
GRANT INSERT ON roommate_requests TO authenticated;
GRANT UPDATE ON roommate_requests TO authenticated;
GRANT DELETE ON roommate_requests TO authenticated;

DROP POLICY IF EXISTS "select_own_requests" ON roommate_requests;
CREATE POLICY "select_own_requests" ON roommate_requests FOR SELECT
TO authenticated USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

DROP POLICY IF EXISTS "insert_own_requests" ON roommate_requests;
CREATE POLICY "insert_own_requests" ON roommate_requests FOR INSERT
TO authenticated WITH CHECK (auth.uid() = sender_id);

DROP POLICY IF EXISTS "update_recipient_requests" ON roommate_requests;
CREATE POLICY "update_recipient_requests" ON roommate_requests FOR UPDATE
TO authenticated USING (auth.uid() = recipient_id) WITH CHECK (auth.uid() = recipient_id);

DROP POLICY IF EXISTS "delete_own_requests" ON roommate_requests;
CREATE POLICY "delete_own_requests" ON roommate_requests FOR DELETE
TO authenticated USING (auth.uid() = sender_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_preferences_user_id ON preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_profiles_user_id ON saved_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_roommate_requests_sender ON roommate_requests(sender_id);
CREATE INDEX IF NOT EXISTS idx_roommate_requests_recipient ON roommate_requests(recipient_id);
CREATE INDEX IF NOT EXISTS idx_roommate_requests_status ON roommate_requests(status);
