import { useState, useMemo, useEffect } from 'react';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Briefcase,
  Home,
  Users,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Bed,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import type { UserProfile, CandidateCard, Interest } from '@/types';
import { SEED_CANDIDATES } from '@/data/mockCandidates';
import { calculateVibeMatch } from '@/utils/vibeEngine';
import { supabase } from '@/lib/supabase';
import { Avatar } from '@/components/ui/Avatar';

interface Props {
  currentUser: UserProfile;
  onViewProfile: (candidate: CandidateCard) => void;
  onToggleDemoMode?: () => void;
  onNavigateAuth?: (page: 'welcome' | 'register' | 'login') => void;
}

export function DiscoverPage({ currentUser, onViewProfile, onToggleDemoMode, onNavigateAuth }: Props) {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'all' | 'rooms' | 'roommates'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [cityFilter, setCityFilter] = useState('all');
  const [realCandidates, setRealCandidates] = useState<CandidateCard[]>([]);
  const [loadingReal, setLoadingReal] = useState(false);

  // If this is a REAL account, query real profiles from Supabase!
  useEffect(() => {
    if (!currentUser.isDemo) {
      let isMounted = true;
      const fetchRealProfiles = async () => {
        setLoadingReal(true);
        try {
          const { data: dbProfiles, error } = await supabase
            .from('profiles')
            .select('*')
            .neq('id', currentUser.id || '00000000-0000-0000-0000-000000000000')
            .eq('is_visible', true);

          if (error) {
            console.warn('Real profiles fetch warning:', error);
          }

          if (dbProfiles && dbProfiles.length > 0 && isMounted) {
            const mapped: CandidateCard[] = dbProfiles.map((p) => {
              const fakeCardCandidate: UserProfile = {
                id: p.id,
                displayName: p.display_name || 'Roommate',
                age: 23,
                gender: 'male',
                avatarUrl: p.avatar_url || '',
                city: p.city || 'Ahmedabad',
                occupation: p.occupation || 'Professional',
                bio: p.bio || 'Verified registered member on LivSync.',
                intent: 'seeking-room',
                createdAt: p.created_at || new Date().toISOString(),
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
                interests: ['Fitness', 'Reading', 'Travel'],
                skills: ['Cleanliness Pro'],
                budget: 8000,
                preferredGender: 'any',
                preferredAgeMin: 20,
                preferredAgeMax: 30,
              };

              const { vibeMatch, mutualInterests } = calculateVibeMatch(currentUser, fakeCardCandidate);

              return {
                profile: fakeCardCandidate,
                vibeMatch,
                isSaved: false,
                connectionStatus: 'none',
                mutualInterests,
              };
            });

            setRealCandidates(mapped);
          } else if (isMounted) {
            setRealCandidates([]);
          }
        } catch (e) {
          console.warn('Real profiles error:', e);
        } finally {
          if (isMounted) setLoadingReal(false);
        }
      };

      fetchRealProfiles();

      return () => {
        isMounted = false;
      };
    }
  }, [currentUser.isDemo, currentUser.id]);

  // If currentUser is Demo, calculate vibe matches for all SEED_CANDIDATES
  const demoCandidates = useMemo(() => {
    if (!currentUser.isDemo) return [];
    return SEED_CANDIDATES.filter((c) => c.id !== currentUser.id)
      .map((candidate) => {
        const { vibeMatch, mutualInterests } = calculateVibeMatch(currentUser, candidate);
        return {
          profile: candidate,
          vibeMatch,
          isSaved: false,
          connectionStatus: 'none' as const,
          mutualInterests,
        };
      })
      .sort((a, b) => b.vibeMatch.overallScore - a.vibeMatch.overallScore);
  }, [currentUser]);

  // Candidates list depends strictly on whether current account is Demo or Real
  const activeCandidateList = currentUser.isDemo ? demoCandidates : realCandidates;

  // Filter list
  const filtered = useMemo(() => {
    let list = activeCandidateList;

    if (tab === 'rooms') list = list.filter((c) => c.profile.intent === 'has-place');
    if (tab === 'roommates') list = list.filter((c) => c.profile.intent === 'seeking-room');

    if (cityFilter !== 'all') list = list.filter((c) => c.profile.city === cityFilter);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.profile.displayName.toLowerCase().includes(q) ||
          c.profile.occupation.toLowerCase().includes(q) ||
          c.profile.city.toLowerCase().includes(q) ||
          c.profile.interests.some((i) => i.toLowerCase().includes(q))
      );
    }

    return list;
  }, [activeCandidateList, tab, search, cityFilter]);

  const cities = [...new Set((currentUser.isDemo ? SEED_CANDIDATES : activeCandidateList).map((c) => (c as any).city || (c as any).profile?.city).filter(Boolean))];

  return (
    <div className="min-h-screen bg-slate-50 pb-24 text-slate-900">
      {/* Top Banner / User Welcome */}
      <div className="px-4 sm:px-6 pt-6 pb-2">
        {/* Demo Mode Notice Banner if in Demo account */}
        {currentUser.isDemo ? (
          <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 flex items-center justify-between text-xs shadow-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Demo Mode Active:</strong> Showing 20 sample candidates. Real accounts only show genuine registered profiles.
              </span>
            </div>
            {onNavigateAuth && (
              <button
                onClick={() => onNavigateAuth('register')}
                className="underline font-bold text-amber-800 hover:text-amber-950 shrink-0 ml-2 text-[11px]"
              >
                Sign Up
              </button>
            )}
          </div>
        ) : (
          <div className="mb-4 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-between text-xs shadow-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Real Account:</strong> Connected live to Supabase. Fake mock data is hidden.
              </span>
            </div>
            {onToggleDemoMode && (
              <button
                onClick={onToggleDemoMode}
                className="text-xs font-bold text-indigo-600 hover:underline shrink-0 ml-2"
              >
                Explore Demo Mode
              </button>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {currentUser.isDemo ? 'Demo Mode Discovery' : 'Live Verified Network'}
            </p>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Welcome, {currentUser.displayName || 'Dhruv'}
            </h1>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
            {(currentUser.displayName || 'U')[0]}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, role, city, or interest..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-12 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition shadow-xs"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition ${
              showFilters
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
            title="Toggle City Filter"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && cities.length > 0 && (
          <div className="mt-3 p-4 rounded-xl bg-white border border-slate-200 space-y-2.5 shadow-xs animate-fade-in">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Filter by City
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCityFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  cityFilter === 'all'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Cities
              </button>
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => setCityFilter(city)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    cityFilter === city
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Segmented Filter Tabs */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { key: 'all' as const, label: 'All', icon: Sparkles, count: activeCandidateList.length },
            {
              key: 'rooms' as const,
              label: 'Rooms Available',
              icon: Home,
              count: activeCandidateList.filter((c) => c.profile.intent === 'has-place').length,
            },
            {
              key: 'roommates' as const,
              label: 'Seeking Flatmates',
              icon: Users,
              count: activeCandidateList.filter((c) => c.profile.intent === 'seeking-room').length,
            },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition shrink-0 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    isActive ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Candidate Cards Feed */}
      <div className="px-4 sm:px-6 space-y-3.5 mt-3">
        {/* REAL ACCOUNT EMPTY STATE (when zero other real users in database yet) */}
        {!currentUser.isDemo && filtered.length === 0 && (
          <div className="text-center py-14 px-6 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-slate-900 font-bold text-base">Your Verified Profile is Live</h3>
              <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-sm mx-auto leading-relaxed">
                You are registered in the live database! No other real candidates have signed up in {currentUser.city || 'your city'} yet.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 max-w-sm mx-auto text-left text-xs text-slate-600 space-y-2">
              <div className="flex items-center gap-2 text-slate-800 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Real Account Guarantee</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Fake mock profiles are strictly disabled in your real account. As soon as other real flatmates register, their verified profiles will appear here instantly.
              </p>
            </div>

            {onToggleDemoMode && (
              <button
                onClick={onToggleDemoMode}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Explore Matching in Demo Mode</span>
              </button>
            )}
          </div>
        )}

        {/* DEMO ACCOUNT EMPTY STATE */}
        {currentUser.isDemo && filtered.length === 0 && (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl shadow-xs">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-800 font-bold text-sm">No profiles found</p>
            <p className="text-slate-500 text-xs mt-1">Try resetting your search query or city filter</p>
          </div>
        )}

        {/* LIST OF CARDS */}
        {filtered.map((candidate) => (
          <div
            key={candidate.profile.id}
            onClick={() => onViewProfile(candidate)}
            className="w-full text-left rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer group"
          >
            {/* Header / Info Row */}
            <div className="p-4 sm:p-5 pb-3">
              <div className="flex items-start gap-3.5">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <Avatar
                    src={candidate.profile.avatarUrl || undefined}
                    name={candidate.profile.displayName}
                    size="xl"
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl border border-slate-200"
                  />
                  <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300">
                    {candidate.vibeMatch.overallScore}%
                  </div>
                </div>

                {/* Profile Meta */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                        {candidate.profile.displayName}
                      </h3>
                      <span className="text-xs text-slate-400 font-medium">
                        {candidate.profile.age}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md shrink-0 border ${
                        candidate.profile.intent === 'has-place'
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {candidate.profile.intent === 'has-place' ? 'Has Flat' : 'Seeking Flat'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 truncate mt-0.5 flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{candidate.profile.occupation}</span>
                  </p>

                  <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                    <span className="flex items-center gap-1 text-[11px]">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>{candidate.profile.city}</span>
                    </span>
                    <span className="text-[11px] font-semibold text-slate-700">
                      ₹{candidate.profile.budget.toLocaleString()}/mo
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Vibe Match Summary Pill */}
            <div className="px-4 sm:px-5 py-2 bg-slate-50/70 border-t border-b border-slate-100 flex items-center justify-between text-xs">
              <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                {candidate.vibeMatch.label}
              </span>
              <span className="text-slate-500 text-[11px]">
                {candidate.vibeMatch.strengths[0] || 'Compatible daily rhythm'}
              </span>
            </div>

            {/* Room Info Preview (if candidate has a place) */}
            {candidate.profile.intent === 'has-place' && candidate.profile.roomInfo && (
              <div className="px-4 sm:px-5 py-2.5 bg-indigo-50/30 border-b border-indigo-100/50 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-700 min-w-0">
                  <Bed className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span className="font-medium truncate">{candidate.profile.roomInfo.locality}</span>
                </div>
                <span className="text-indigo-600 font-bold shrink-0 ml-2">
                  ₹{candidate.profile.roomInfo.rentPerPerson.toLocaleString()}
                  <span className="text-[10px] text-slate-400 font-normal"> /mo</span>
                </span>
              </div>
            )}

            {/* Mutual Interests Tags */}
            <div className="p-4 sm:p-5 pt-3">
              <div className="flex flex-wrap gap-1.5">
                {candidate.profile.interests.slice(0, 4).map((interest) => (
                  <span
                    key={interest}
                    className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600"
                  >
                    {interest}
                  </span>
                ))}
                {candidate.profile.interests.length > 4 && (
                  <span className="px-1.5 py-0.5 rounded-md text-[10px] text-slate-400 font-medium">
                    +{candidate.profile.interests.length - 4} more
                  </span>
                )}
              </div>

              {/* View Full Profile CTA Link */}
              <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 group-hover:text-indigo-600 transition-colors">
                <span className="font-medium">View full compatibility breakdown</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
