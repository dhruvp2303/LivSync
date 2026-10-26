import { useState } from 'react';
import { Search, Home, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import type { AuthPage } from '@/types/navigation';
import type { UserIntent } from '@/types';

interface Props {
  onNavigate: (page: AuthPage) => void;
  onSelectIntent: (intent: UserIntent) => void;
}

export function IntentSelectPage({ onNavigate, onSelectIntent }: Props) {
  const [selected, setSelected] = useState<UserIntent | null>(null);

  const handleContinue = () => {
    if (selected) {
      onSelectIntent(selected);
      onNavigate('profile-setup');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900">
      {/* Header */}
      <div className="px-6 pt-10 pb-6 max-w-xl mx-auto w-full">
        <button
          onClick={() => onNavigate('welcome')}
          className="text-slate-500 text-sm mb-6 flex items-center gap-2 hover:text-slate-900 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-3">
          Step 1 of 3 • Living Intent
        </div>

        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
          What are you looking for?
        </h1>
        <p className="mt-2 text-slate-500 text-sm leading-relaxed">
          Select your goal so we can configure your feed with relevant roommate and room profiles.
        </p>
      </div>

      {/* Intent cards */}
      <div className="flex-1 px-6 flex flex-col gap-4 max-w-xl mx-auto w-full justify-center">
        {/* Seeking Room */}
        <button
          onClick={() => setSelected('seeking-room')}
          className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 ${
            selected === 'seeking-room'
              ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-100'
              : 'border-slate-200 bg-white hover:border-slate-300 shadow-sm'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
              selected === 'seeking-room' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              <Search className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">I need a room</h3>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                  selected === 'seeking-room' ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                }`}>
                  {selected === 'seeking-room' && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
              <p className="text-slate-500 text-xs sm:text-sm mt-1 leading-relaxed">
                I am looking for a private or shared room with flatmates who match my schedule and lifestyle.
              </p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {['Find Verified Rooms', 'Lifestyle Matching', 'Join Cohorts'].map(tag => (
                  <span key={tag} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </button>

        {/* Has Place */}
        <button
          onClick={() => setSelected('has-place')}
          className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 ${
            selected === 'has-place'
              ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-100'
              : 'border-slate-200 bg-white hover:border-slate-300 shadow-sm'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
              selected === 'has-place' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              <Home className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">I have a place</h3>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                  selected === 'has-place' ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                }`}>
                  {selected === 'has-place' && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>
              <p className="text-slate-500 text-xs sm:text-sm mt-1 leading-relaxed">
                I have an apartment or spare bedroom and want to find a compatible flatmate to move in.
              </p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {['List Vacant Room', 'Filter Applicants', 'Split Living Expenses'].map(tag => (
                  <span key={tag} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* CTA Bottom Bar */}
      <div className="px-6 py-6 max-w-xl mx-auto w-full">
        <button
          onClick={handleContinue}
          disabled={!selected}
          className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
