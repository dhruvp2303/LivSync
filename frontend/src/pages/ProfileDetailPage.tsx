import { useState } from 'react';
import {
  ChevronLeft,
  MapPin,
  Briefcase,
  CheckCircle2,
  Bookmark,
  Send,
  Home,
  Users,
  Moon,
  Sun,
  Clock,
  Sparkles,
  Volume2,
  ShieldCheck,
  Check,
} from 'lucide-react';
import type { CandidateCard } from '@/types';

interface Props {
  candidate: CandidateCard;
  onBack: () => void;
}

export function ProfileDetailPage({ candidate, onBack }: Props) {
  const { profile, vibeMatch } = candidate;
  const [requestSent, setRequestSent] = useState(false);
  const [saved, setSaved] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 65) return 'text-indigo-700 bg-indigo-50 border-indigo-200';
    return 'text-slate-700 bg-slate-100 border-slate-200';
  };

  const getScoreBar = (score: number) => {
    if (score >= 80) return 'bg-emerald-600';
    if (score >= 65) return 'bg-indigo-600';
    return 'bg-slate-500';
  };

  const handleSendRequest = () => {
    setRequestSent(true);
    setTimeout(() => setRequestSent(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16 text-slate-900">
      {/* Top Hero Image & Navigation */}
      <div className="relative">
        {profile.avatarUrl ? (
          <img
            src={profile.avatarUrl}
            alt={profile.displayName}
            className="w-full h-72 sm:h-80 object-cover"
          />
        ) : (
          <div className="w-full h-72 sm:h-80 bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-900 flex flex-col items-center justify-center text-white p-6">
            <div className="w-24 h-24 rounded-3xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-4xl font-extrabold shadow-lg mb-2">
              {profile.displayName?.trim() ? profile.displayName.trim().charAt(0).toUpperCase() : '?'}
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent pointer-events-none" />

        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-5 left-5 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-800 hover:bg-white shadow-xs transition"
          aria-label="Back"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Intent Badge */}
        <div className="absolute top-5 right-5">
          <span
            className={`px-3 py-1 rounded-lg text-xs font-semibold backdrop-blur-md shadow-xs ${
              profile.intent === 'has-place'
                ? 'bg-indigo-600 text-white'
                : 'bg-white/95 text-slate-900'
            }`}
          >
            {profile.intent === 'has-place' ? 'Has an Apartment' : 'Seeking Flatmates'}
          </span>
        </div>

        {/* Name & Basic Info Overlay */}
        <div className="absolute bottom-5 left-5 right-5 text-white">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {profile.displayName}
            </h1>
            <span className="text-xl font-medium text-slate-300">, {profile.age}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-200 mt-1">
            <span className="flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-slate-300" />
              <span>{profile.occupation}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-300" />
              <span>{profile.city}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 space-y-5 -mt-3 relative z-10">
        {/* Compatibility Overview Banner */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Compatibility Match
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-black text-slate-900">
                {vibeMatch.overallScore}%
              </span>
              <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-md">
                {vibeMatch.label}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {vibeMatch.strengths[0] || 'High lifestyle alignment based on 6 core factors'}
            </p>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
            <Sparkles className="w-7 h-7 text-indigo-600" />
          </div>
        </div>

        {/* Bio */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            About {profile.displayName.split(' ')[0]}
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">{profile.bio}</p>
        </div>

        {/* Factor Breakdown */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3.5">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Factor Breakdown
          </h2>

          <div className="space-y-3">
            {vibeMatch.factors.map((factor) => (
              <div key={factor.name} className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="text-slate-800">{factor.name}</span>
                  <span className="text-slate-900 font-bold">{factor.score}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getScoreBar(factor.score)} rounded-full`}
                    style={{ width: `${factor.score}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">{factor.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Complementary Strengths */}
        {vibeMatch.complementary.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2.5">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Complementary Strengths
            </h2>
            <div className="space-y-2">
              {vibeMatch.complementary.map((strength, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-xs text-emerald-900"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-medium">{strength}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Shared Interests */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2.5">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Interests & Pastimes
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {profile.interests.map((interest) => {
              const isMutual = candidate.mutualInterests.includes(interest);
              return (
                <span
                  key={interest}
                  className={`px-3 py-1 rounded-lg text-xs font-medium border ${
                    isMutual
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {isMutual && <span className="mr-1 text-indigo-600 font-bold">•</span>}
                  {interest}
                </span>
              );
            })}
          </div>
        </div>

        {/* Household Attributes / Quick Facts */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2.5">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Living Routine & Preferences
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                Sleep Schedule
              </span>
              <p className="text-xs font-semibold text-slate-800 capitalize mt-0.5">
                {profile.sleepSchedule.replace('-', ' ')}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                Dietary Preference
              </span>
              <p className="text-xs font-semibold text-slate-800 capitalize mt-0.5">
                {profile.foodPreference}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                Cleanliness Level
              </span>
              <p className="text-xs font-semibold text-slate-800 mt-0.5">
                Level {profile.cleanliness} of 5
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                Monthly Budget
              </span>
              <p className="text-xs font-semibold text-slate-800 mt-0.5">
                ₹{profile.budget.toLocaleString()}/month
              </p>
            </div>
          </div>
        </div>

        {/* Apartment Details (if has-place) */}
        {profile.intent === 'has-place' && profile.roomInfo && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Available Apartment
              </h2>
              <span className="text-xs font-bold text-indigo-600">
                ₹{profile.roomInfo.rentPerPerson.toLocaleString()}/person
              </span>
            </div>

            {profile.roomInfo.photoUrls.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {profile.roomInfo.photoUrls.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt="Apartment Interior"
                    className="w-full h-32 object-cover rounded-xl border border-slate-200"
                  />
                ))}
              </div>
            )}

            <p className="text-xs text-slate-600 leading-relaxed">
              {profile.roomInfo.description}
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {profile.roomInfo.amenities.map((amenity) => (
                <span
                  key={amenity}
                  className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200/60"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 space-y-2">
          {requestSent ? (
            <div className="w-full py-3.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs">
              <Check className="w-4 h-4" />
              <span>Connection Request Sent!</span>
            </div>
          ) : (
            <button
              onClick={handleSendRequest}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-xs transition active:scale-98 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Send Roommate Request</span>
            </button>
          )}

          <button
            onClick={() => setSaved(!saved)}
            className={`w-full py-3 rounded-xl border text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
              saved
                ? 'bg-slate-100 text-indigo-700 border-indigo-200'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-indigo-600 text-indigo-600' : ''}`} />
            <span>{saved ? 'Saved to Bookmarks' : 'Save for Later'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
