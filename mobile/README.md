# LivSync — Roommate Compatibility Mobile Application

> *"Find a roommate who matches the way you live."*

LivSync is a complete, modular Flutter mobile application built for students, working professionals, and individuals relocating to a new city. It matches roommates using lifestyle, habit, and schedule compatibility, rather than just rent and location.

---

## 📱 Feature Overview

### 1. Multi-Step Onboarding & Authentication
* **Screen 01 — Splash Screen:** Brand gradient, animated logo, automatic session restoration.
* **Screen 02 — Welcome & Onboarding:** Lifestyle value proposition, roommate visuals, page dots, Get Started.
* **Screen 03 — Login Screen:** Email/password with toggle visibility, validation, error banners, and Google/Phone options.
* **Screen 04 — Register Screen:** Full name, email, phone, password, terms agreement, duplicate checking.
* **Screen 05 — Profile Setup (Step 1 of 2):** Avatar preview, Full Name, Age, Gender dropdown, City, Occupation.
* **Screen 06 — Living Preferences (Step 2 of 2):** Budget chips (`₹3000`, `₹5000`, `₹7000`, `₹10000+`), food preference chips, sleep & wake time pickers, cleanliness rating slider (1–5), routine chips, household rules.

### 2. Matching & Roommate Discovery
* **Screen 07 — Discovery Feed:** Candidate cards with hero photo, verified blue badge, university/occupation, city, lifestyle tag pills, green `94% Match` compatibility badge, and dynamic "Why you match?" similarity points.
  * **Interactive Action Controls:** Pass (`✕`), Bookmark / Save (`★`), and Send Request (`♥`).
* **Screen 08 & 11 — Profile Detail & Deep-Dive:**
  * Full bio, declared preferences table.
  * **Factor-by-factor compatibility score breakdown** (Budget 20%, Location 15%, Sleep 15%, Cleanliness 10%, Diet 5%, Routine 10%, Household habits 25%).
  * **Key similarities** (green checkmarks) and **Potential differences** (amber alerts).
  * **Pre-living Conversation Checklist:** Actionable discussion prompts for bill sharing, chore schedules, quiet hours, and visitors.
  * Sticky bottom action bar with Save and Send Request triggers.

### 3. Requests, Connections & Account Control
* **Screen 09 — Requests Management:**
  * **Received Tab:** Incoming roommate requests with Accept & Reject actions.
  * **Sent Tab:** Outgoing requests with Pending, Accepted, or Rejected statuses.
* **Screen 10 — Matches & Saved Profiles:**
  * Connected roommates (mutual accepted matches) with chat unlock indicator.
  * Saved candidate bookmarks with one-tap detail view.
* **Screen 11 — Profile & Settings:**
  * View & edit profile details and living preferences.
  * Discovery visibility toggle (`is_visible`).
  * Privacy documentation dialog.
  * Sign Out and irreversible Account Deletion workflows.

---

## 🧮 Compatibility Scoring Engine

The scoring engine (`lib/features/compatibility/domain/compatibility_engine.dart`) is a deterministic, testable, pure Dart service:

| Factor | Weight | Evaluation Method |
| :--- | :---: | :--- |
| **Rental Budget** | **20%** | Overlap ratio between monthly budget targets |
| **Location Preference** | **15%** | City/area match |
| **Lifestyle & Habits** | **15%** | Smoking, pets, guests, noise level |
| **Sleeping Schedule** | **15%** | Circular 24-hour hour distance on sleep & wake times |
| **Cleanliness** | **10%** | Scale difference (1 to 5) |
| **Study / Work Routine** | **10%** | Routine compatibility (Student, Professional, etc.) |
| **Other Shared Prefs** | **10%** | Household policies and quiet hours |
| **Dietary Preferences** | **5%** | Vegetarian, non-veg, eggetarian alignment |

* **Missing Data Policy:** Normalizes scores by the sum of available weights so unanswered fields do not bias the score toward 0% or 100%.

---

## 📂 Project Architecture

```
lib/
├── main.dart                  # App entry point with ProviderScope
├── app.dart                   # MaterialApp with theme and route tables
├── core/
│   ├── theme/                 # AppColors, AppTypography, AppSpacing, AppTheme
│   ├── constants/             # AppConstants, scoring thresholds
│   ├── routing/               # AppRoutes named route definitions
│   └── utilities/             # TimeUtils (circular time calculations)
├── shared/
│   ├── models/                # UserProfile, LivingPreferences, RoommateRequest,
│   │                          # CompatibilityResult, CandidateProfile
│   └── widgets/               # AppButton, AppTextField, CompatibilityBadge,
│                              # PreferenceChip, LifestyleTag
├── features/
│   ├── onboarding/            # SplashScreen, WelcomeScreen
│   ├── authentication/        # LoginScreen, RegisterScreen, AuthNotifier
│   ├── profile/               # ProfileSetupScreen
│   ├── preferences/           # PreferencesSetupScreen
│   ├── discovery/             # DiscoverScreen, ProfileDetailScreen, DiscoveryNotifier
│   ├── requests/              # RequestsScreen, RequestsNotifier
│   ├── matches/               # MatchesScreen
│   ├── settings/              # ProfileSettingsScreen
│   ├── home/                  # MainNavigationScreen (Persistent 4-tab bar)
│   └── compatibility/         # CompatibilityEngine, ScoringWeights
└── data/
    └── repositories/          # AuthRepository, ProfileRepository
```

---

## 🚀 Running the Project

### Prerequisites
1. Install [Flutter SDK](https://flutter.dev/docs/get-started/install) (`>= 3.10.0`).
2. Add Flutter to your system `PATH`.
3. An Android emulator or physical device with USB debugging enabled.

### Quick Start
```bash
# Navigate to the app directory
cd livsync_app

# Fetch dependencies
flutter pub get

# Run unit tests
flutter test test/features/compatibility/compatibility_engine_test.dart

# Run on connected Android device / emulator
flutter run
```

### Building the APK
```bash
flutter build apk --debug
```
The output APK will be generated at `build/app/outputs/flutter-apk/app-debug.apk`.

---

## 🔒 Firebase Security Rules

Production least-privilege security rules are located in:
* [`firestore.rules`](file:///c:/Users/Dhruv/OneDrive/Desktop/LivSync/livsync_app/firestore.rules): Enforces document ownership, discovery visibility filters, and recipient-only request status modifications.
* [`storage.rules`](file:///c:/Users/Dhruv/OneDrive/Desktop/LivSync/livsync_app/storage.rules): Restricts avatar uploads to the user's private path with a 5MB size limit.
