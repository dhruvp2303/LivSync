# LivSync — Roommate Compatibility & Discovery Platform

> **“Find a roommate who matches the way you live.”**
> *Compatibility before commitment.*

---

## 📁 Project Architecture

The project has been organized into a professional, modular monorepo structure:

```
LivSync/
├── frontend/             # Web & Mobile-Web Client (React 18 + Vite + TypeScript + Tailwind)
│   ├── src/
│   │   ├── components/   # Reusable UI components & Bottom Navigation
│   │   ├── context/      # Authentication & state management
│   │   ├── data/         # Seed candidate profiles with lifestyle data
│   │   ├── lib/          # Supabase client integration
│   │   ├── pages/        # Discover, Saved, Requests, Matches, Profile, Download
│   │   ├── services/     # RoommateService bridging backend and local caching
│   │   ├── types/        # TypeScript data models and navigation types
│   │   ├── utils/        # 8-factor deterministic compatibility engine
│   │   ├── App.tsx       # Root application orchestrator
│   │   ├── main.tsx      # Entry point
│   │   └── index.css     # Design tokens and custom theme styling
│   ├── index.html        # Clean HTML5 shell
│   ├── package.json      # Dependencies and scripts
│   ├── tailwind.config.js# Curated purple/violet palette configuration
│   └── vite.config.ts    # Build & dev server configuration
│
├── backend/              # Database Schemas, Migrations & Security Rules
│   ├── supabase/
│   │   └── migrations/   # PostgreSQL DDL, tables, indexes & RLS policies
│   └── rules/
│       ├── firestore.rules # Cloud Firestore security rules
│       └── storage.rules   # Cloud Storage security rules
│
└── mobile/               # Native Mobile Application (Flutter & Material 3)
    ├── lib/              # Riverpod architecture, models & screens
    ├── test/             # Unit tests for compatibility algorithm
    ├── analysis_options.yaml
    └── pubspec.yaml      # Flutter dependencies
```

---

## 🚀 Quick Start (Frontend Web App)

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies (if needed)
npm install

# 3. Start local development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.
To access the direct mobile APK download landing page, visit [http://localhost:5173/#download](http://localhost:5173/#download).

---

## 🗄️ Backend & Database

Database migrations are located in [`backend/supabase/migrations/`](file:///c:/Users/Dhruv/OneDrive/Desktop/LivSync/backend/supabase/migrations/).
Row Level Security (RLS) rules and Cloud security policies are preserved in [`backend/rules/`](file:///c:/Users/Dhruv/OneDrive/Desktop/LivSync/backend/rules/).

---

## 📱 Mobile App (Flutter)

Located in [`mobile/`](file:///c:/Users/Dhruv/OneDrive/Desktop/LivSync/mobile/).
To run unit tests or launch on an Android emulator:

```bash
cd mobile
flutter pub get
flutter test
flutter run
```
