import { useState, useEffect, useCallback } from 'react';
import { Sparkles, MessageCircle, MapPin, Briefcase, Calendar, CheckCircle2, ChevronRight, Compass } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { roommateService } from '@/services/roommateService';
import { CompatibilityBadge, Tag } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { CandidateProfile } from '@/types';

interface MatchesPageProps {
  onViewProfile: (candidate: CandidateProfile) => void;
  onGoToDiscover: () => void;
}

export function MatchesPage({ onViewProfile, onGoToDiscover }: MatchesPageProps) {
  const { user, preferences } = useAuth();
  const [matches, setMatches] = useState<CandidateProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMatches = useCallback(async () => {
    setLoading(true);
    const confirmed = await roommateService.getConfirmedMatches(user?.id ?? null, preferences);
    setMatches(confirmed);
    setLoading(false);
  }, [user, preferences]);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 pt-6 pb-4 sticky top-0 z-10 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A] flex items-center gap-2">
              Confirmed Matches
              <span className="text-xs bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold">
                {matches.length}
              </span>
            </h1>
            <p className="text-sm text-[#647488] mt-0.5">
              Roommates who mutually connected with you
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Sparkles size={20} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-4 flex-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-3 border-[#5B5BFF] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-[#647488]">Checking your confirmed matches…</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-gray-100 text-center flex flex-col items-center my-6 shadow-sm">
            <div className="w-18 h-18 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-lg font-bold text-[#0F172A]">No confirmed matches yet</h3>
            <p className="text-sm text-[#647488] max-w-xs mt-1.5 mb-6 leading-relaxed">
              When a roommate request you sent is accepted—or when you accept a request from someone else—they will appear here as a confirmed connection.
            </p>
            <Button onClick={onGoToDiscover} size="md">
              <Compass size={16} />
              Discover Roommates
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="bg-gradient-to-r from-emerald-500/10 via-[#5B5BFF]/10 to-transparent p-4 rounded-2xl border border-emerald-500/20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <Sparkles size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0F172A]">Great news! You have mutual connections</h4>
                <p className="text-xs text-[#647488]">
                  Schedule a call or meet in a public cafe to finalize apartment hunting plans.
                </p>
              </div>
            </div>

            {matches.map((c) => {
              const photo = c.profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.profile.display_name)}&background=5B5BFF&color=fff&size=300`;
              const similarities = c.compatibility.factors.filter((f) => f.match === 'similar');

              return (
                <div
                  key={c.profile.id}
                  onClick={() => onViewProfile(c)}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer"
                >
                  <div className="relative h-44 bg-gray-100">
                    <img
                      src={photo}
                      alt={c.profile.display_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.profile.display_name)}&background=5B5BFF&color=fff&size=300`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <div className="bg-emerald-500 text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
                        <CheckCircle2 size={13} />
                        Connected
                      </div>
                      <CompatibilityBadge score={c.compatibility.score} />
                    </div>

                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <h3 className="text-xl font-bold">{c.profile.display_name}</h3>
                      <div className="flex items-center gap-3 text-xs text-white/90 mt-1">
                        <span className="flex items-center gap-1">
                          <Briefcase size={12} /> {c.profile.occupation || 'Professional'}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={12} /> {c.profile.city || 'Ahmedabad'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 flex flex-col gap-3">
                    {c.requestMessage && (
                      <div className="bg-gray-50 rounded-xl p-3 text-xs text-[#0F172A] italic border-l-2 border-emerald-500">
                        "{c.requestMessage}"
                      </div>
                    )}

                    {similarities.length > 0 && (
                      <div>
                        <p className="text-[11px] font-bold text-[#647488] uppercase tracking-wider mb-1.5">
                          Shared Habits &amp; Alignment
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {similarities.slice(0, 3).map((f) => (
                            <span
                              key={f.name}
                              className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200/50 text-[11px] font-medium px-2.5 py-0.5 rounded-full"
                            >
                              <CheckCircle2 size={11} className="text-emerald-600" />
                              <span>{f.name}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#5B5BFF] flex items-center gap-1">
                        View Full Compatibility Profile <ChevronRight size={14} />
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`Contact information exchanged with ${c.profile.display_name}! Reach out via email or phone to arrange your visit.`);
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
                      >
                        <MessageCircle size={14} />
                        Contact Info
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
