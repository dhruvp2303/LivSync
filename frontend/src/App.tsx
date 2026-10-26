import { useState, useEffect } from 'react';
import { SplashPage } from '@/pages/SplashPage';
import { WelcomePage } from '@/pages/WelcomePage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { IntentSelectPage } from '@/pages/IntentSelectPage';
import { ProfileSetupPage, type ProfileData } from '@/pages/ProfileSetupPage';
import { VibeQuizPage, type VibeData } from '@/pages/VibeQuizPage';
import { DiscoverPage } from '@/pages/DiscoverPage';
import { ProfileDetailPage } from '@/pages/ProfileDetailPage';
import { SavedPage } from '@/pages/SavedPage';
import { ConnectionsPage } from '@/pages/ConnectionsPage';
import { GroupsPage } from '@/pages/GroupsPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { DownloadPage } from '@/pages/DownloadPage';
import { AppLayout } from '@/components/layout/AppLayout';
import type { AuthPage, Page } from '@/types/navigation';
import type { CandidateCard, UserProfile, UserIntent } from '@/types';

import { DEMO_USER } from '@/data/mockCandidates';

// Clean, realistic current user profile
const INITIAL_DEMO_USER: UserProfile = DEMO_USER;

export default function App() {
  const [isDownloadView, setIsDownloadView] = useState(
    () =>
      typeof window !== 'undefined' &&
      (window.location.pathname.includes('download') || window.location.hash.includes('download'))
  );

  useEffect(() => {
    const handleUrlChange = () => {
      setIsDownloadView(
        window.location.pathname.includes('download') ||
        window.location.hash.includes('download')
      );
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Navigation states
  const [authPage, setAuthPage] = useState<AuthPage>('splash');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mainPage, setMainPage] = useState<Page>('discover');
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateCard | null>(null);

  // User Profile State
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_DEMO_USER);

  // Onboarding temporary state
  const [pendingIntent, setPendingIntent] = useState<UserIntent>('seeking-room');
  const [pendingBasic, setPendingBasic] = useState<ProfileData | null>(null);

  // Native hardware / gesture back button handler
  const handleBackPress = (): boolean => {
    if (selectedCandidate) {
      setSelectedCandidate(null);
      return true;
    }
    if (mainPage !== 'discover') {
      setMainPage('discover');
      return true;
    }
    if (!isAuthenticated) {
      if (authPage === 'profile-setup') {
        setAuthPage('intent-select');
        return true;
      }
      if (authPage === 'intent-select') {
        setAuthPage('register');
        return true;
      }
      if (authPage === 'vibe-quiz') {
        setAuthPage('profile-setup');
        return true;
      }
      if (authPage === 'register' || authPage === 'login') {
        setAuthPage('welcome');
        return true;
      }
    }
    return false;
  };

  if (isDownloadView) {
    return (
      <DownloadPage
        onOpenWebApp={() => {
          setIsDownloadView(false);
          window.history.pushState({}, '', '/');
        }}
      />
    );
  }

  const renderContent = () => {
    // ── ONBOARDING / AUTH FLOW ──────────────────────────────────────────
    if (!isAuthenticated) {
      if (authPage === 'splash') {
        return <SplashPage onNavigate={(page) => setAuthPage(page)} />;
      }

      if (authPage === 'welcome') {
        return (
          <WelcomePage
            onNavigate={(page) => setAuthPage(page)}
            onExploreDemo={() => {
              setCurrentUser({
                ...DEMO_USER,
                isDemo: true,
              });
              setIsAuthenticated(true);
              setMainPage('discover');
            }}
          />
        );
      }

      if (authPage === 'login') {
        return (
          <LoginPage
            onNavigate={(page) => setAuthPage(page)}
            onSuccess={async () => {
              try {
                const { data: { user: sbUser } } = await supabase.auth.getUser();
                if (sbUser) {
                  const { data: prof } = await supabase.from('profiles').select('*').eq('id', sbUser.id).maybeSingle();
                  setCurrentUser({
                    id: sbUser.id,
                    displayName: prof?.display_name || sbUser.email?.split('@')[0] || 'Dhruv',
                    email: sbUser.email,
                    isDemo: false,
                    age: 23,
                    gender: 'male',
                    avatarUrl: prof?.avatar_url || '',
                    city: prof?.city || 'Ahmedabad',
                    occupation: prof?.occupation || 'Professional',
                    bio: prof?.bio || '',
                    intent: 'seeking-room',
                    createdAt: sbUser.created_at || new Date().toISOString(),
                    personality: 'ambivert',
                    energyLevel: 'moderate',
                    socialStyle: 'balanced',
                    cleanliness: 4,
                    sleepSchedule: 'flexible',
                    foodPreference: 'vegetarian',
                    workStyle: 'working-professional',
                    guestPolicy: 'sometimes',
                    noisePreference: 'moderate',
                    smoking: false,
                    drinking: false,
                    pets: false,
                    interests: ['Fitness', 'Travel', 'Reading'],
                    skills: ['Cleanliness Pro'],
                    budget: 8000,
                    preferredGender: 'any',
                    preferredAgeMin: 20,
                    preferredAgeMax: 30,
                  });
                } else {
                  setCurrentUser((prev) => ({ ...prev, isDemo: false }));
                }
              } catch (e) {
                console.warn(e);
              }
              setIsAuthenticated(true);
              setMainPage('discover');
            }}
          />
        );
      }

      if (authPage === 'register') {
        return (
          <RegisterPage
            onNavigate={(page) => setAuthPage(page)}
            onSuccess={(userData) => {
              if (userData) {
                setPendingBasic({
                  displayName: userData.name,
                  age: 23,
                  gender: 'male',
                  city: 'Ahmedabad',
                  occupation: '',
                  bio: '',
                });
              }
              setAuthPage('intent-select');
            }}
          />
        );
      }

      if (authPage === 'intent-select') {
        return (
          <IntentSelectPage
            onNavigate={(page) => setAuthPage(page)}
            onSelectIntent={(intent) => {
              setPendingIntent(intent);
              setAuthPage('profile-setup');
            }}
          />
        );
      }

      if (authPage === 'profile-setup') {
        return (
          <ProfileSetupPage
            onNavigate={(page) => setAuthPage(page)}
            initialData={pendingBasic || undefined}
            onSaveProfile={(data) => {
              setPendingBasic(data);
              setAuthPage('vibe-quiz');
            }}
          />
        );
      }

      if (authPage === 'vibe-quiz') {
        return (
          <VibeQuizPage
            onNavigate={(page) => setAuthPage(page)}
            isHasPlace={pendingIntent === 'has-place'}
            onComplete={async (vibeData: VibeData) => {
              let realId = 'user-' + Date.now();
              try {
                const { data: { user: sbUser } } = await supabase.auth.getUser();
                if (sbUser) {
                  realId = sbUser.id;
                  await supabase.from('profiles').upsert({
                    id: sbUser.id,
                    display_name: pendingBasic?.displayName || 'User',
                    avatar_url: pendingBasic?.avatarUrl,
                    city: pendingBasic?.city || 'Ahmedabad',
                    occupation: pendingBasic?.occupation || 'Professional',
                    bio: pendingBasic?.bio || '',
                    profile_complete: true,
                    is_visible: true,
                  });
                }
              } catch (e) {
                console.warn('Supabase profile save error:', e);
              }

              const newUser: UserProfile = {
                id: realId,
                isDemo: false, // REAL USER!
                displayName: pendingBasic?.displayName || 'User',
                age: pendingBasic?.age || 23,
                gender: pendingBasic?.gender || 'male',
                avatarUrl: pendingBasic?.avatarUrl || '',
                city: pendingBasic?.city || 'Ahmedabad',
                occupation: pendingBasic?.occupation || 'Professional',
                bio: pendingBasic?.bio || 'Looking for great flatmates!',
                intent: pendingIntent,
                createdAt: new Date().toISOString(),
                personality: vibeData.personality,
                energyLevel: vibeData.energyLevel,
                socialStyle: vibeData.socialStyle,
                cleanliness: vibeData.cleanliness,
                sleepSchedule: vibeData.sleepSchedule,
                foodPreference: vibeData.foodPreference,
                workStyle: vibeData.workStyle,
                guestPolicy: vibeData.guestPolicy,
                noisePreference: vibeData.noisePreference,
                smoking: vibeData.smoking,
                drinking: vibeData.drinking,
                pets: vibeData.pets,
                interests: vibeData.interests,
                skills: vibeData.skills,
                budget: vibeData.budget || 7000,
                preferredGender: vibeData.preferredGender,
                preferredAgeMin: vibeData.preferredAgeMin,
                preferredAgeMax: vibeData.preferredAgeMax,
                ...(pendingIntent === 'has-place'
                  ? {
                      roomInfo: {
                        locality: 'Navrangpura, Ahmedabad',
                        rentPerPerson: vibeData.budget || 8000,
                        totalCapacity: 3,
                        currentOccupants: 1,
                        furnishing: 'fully-furnished',
                        amenities: ['WiFi', 'AC', 'Washing Machine', 'Cook Available'],
                        photoUrls: [
                          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop',
                        ],
                        description: 'Spacious, sunny room in a 3BHK flat near commerce six roads.',
                      },
                    }
                  : {}),
              };

              setCurrentUser(newUser);
              setIsAuthenticated(true);
              setMainPage('discover');
            }}
          />
        );
      }
    }

    // ── CANDIDATE PROFILE DETAIL MODAL/VIEW ─────────────────────────────
    if (selectedCandidate) {
      return (
        <div className="w-full">
          <ProfileDetailPage
            candidate={selectedCandidate}
            onBack={() => setSelectedCandidate(null)}
          />
        </div>
      );
    }

    // ── MAIN APPLICATION VIEW ───────────────────────────────────────────
    return (
      <div className="w-full flex flex-col">
        {mainPage === 'discover' && (
          <DiscoverPage
            currentUser={currentUser}
            onViewProfile={(candidate) => setSelectedCandidate(candidate)}
            onToggleDemoMode={() => {
              setCurrentUser((prev) => ({
                ...prev,
                isDemo: !prev.isDemo,
              }));
            }}
            onNavigateAuth={(page) => {
              setIsAuthenticated(false);
              setAuthPage(page);
            }}
          />
        )}

        {mainPage === 'saved' && (
          <SavedPage onGoToDiscover={() => setMainPage('discover')} />
        )}

        {mainPage === 'connections' && (
          <ConnectionsPage onGoToDiscover={() => setMainPage('discover')} />
        )}

        {mainPage === 'groups' && (
          <GroupsPage onGoToDiscover={() => setMainPage('discover')} />
        )}

        {mainPage === 'profile' && (
          <ProfilePage
            currentUser={currentUser}
            onUpdateUser={(updated) => setCurrentUser(updated)}
            onNavigateAuth={(page) => {
              setIsAuthenticated(false);
              setAuthPage(page);
            }}
          />
        )}
      </div>
    );
  };

  return (
    <AppLayout
      activePage={mainPage}
      onPageChange={(page) => setMainPage(page)}
      onBackPress={handleBackPress}
      pendingRequestsCount={1}
      isAuthenticated={isAuthenticated}
    >
      {renderContent()}
    </AppLayout>
  );
}
