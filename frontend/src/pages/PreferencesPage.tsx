import { useState } from 'react';
import { Clock, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import type { FoodPreference, Routine, GuestPolicy, NoiseLevel } from '@/types';
import type { AuthPage } from '@/types/navigation';

interface Props {
  onNavigate: (page: AuthPage) => void;
  onSuccess: () => void;
}

const BUDGETS = [3000, 5000, 7000, 10000];
const SLEEP_TIMES = ['09:00 PM', '10:00 PM', '11:00 PM', '12:00 AM', '01:00 AM'];
const WAKE_TIMES = ['05:00 AM', '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM'];

function Chip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all duration-150
        ${selected
          ? 'bg-[#5B5BFF] border-[#5B5BFF] text-white shadow-sm'
          : 'bg-white border-gray-200 text-[#647488] hover:border-[#5B5BFF] hover:text-[#5B5BFF]'
        }`}
    >
      {label}
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-semibold text-[#0F172A] mb-2">{children}</p>
  );
}

export function PreferencesPage({ onNavigate, onSuccess }: Props) {
  const { user, refreshPreferences } = useAuth();

  const [budget, setBudget] = useState(7000);
  const [food, setFood] = useState<FoodPreference>('vegetarian');
  const [sleepTime, setSleepTime] = useState('11:00 PM');
  const [wakeTime, setWakeTime] = useState('07:00 AM');
  const [cleanliness, setCleanliness] = useState(3);
  const [routine, setRoutine] = useState<Routine>('student');
  const [guests, setGuests] = useState<GuestPolicy>('occasionally');
  const [smoking, setSmoking] = useState(false);
  const [pets, setPets] = useState(false);
  const [noise, setNoise] = useState<NoiseLevel>('moderate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cleanLabels = ['Very Messy', 'Messy', 'Average', 'Clean', 'Very Clean'];

  const handleComplete = async () => {
    setLoading(true);
    setError('');

    if (user) {
      const { error: prefErr } = await supabase.from('preferences').upsert({
        user_id: user.id,
        budget,
        food_preference: food,
        sleep_time: sleepTime,
        wake_time: wakeTime,
        cleanliness,
        routine,
        guests,
        smoking,
        pets,
        noise_level: noise,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

      if (prefErr) { setError(prefErr.message); setLoading(false); return; }

      const { error: profileErr } = await supabase.from('profiles').update({
        profile_complete: true,
        updated_at: new Date().toISOString(),
      }).eq('id', user.id);

      if (profileErr) { setError(profileErr.message); setLoading(false); return; }
      await refreshPreferences();
    }
    setLoading(false);
    onSuccess();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-6 pb-2 bg-white">
        <button
          onClick={() => onNavigate('profile-setup')}
          className="p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft size={24} className="text-[#0F172A]" />
        </button>
        <span className="text-sm text-[#647488] font-medium">Step 2 of 2</span>
      </div>
      <div className="mx-6 h-1.5 bg-gray-100 rounded-full overflow-hidden mb-0.5">
        <div className="h-full w-full bg-[#5B5BFF] rounded-full" />
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-5 pb-32 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Your Preferences</h1>
          <p className="mt-1 text-[#647488] text-sm">
            This helps us find better matches for you
          </p>
        </div>

        {/* Budget */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <SectionLabel>Monthly Budget (₹)</SectionLabel>
          <div className="flex gap-2 flex-wrap">
            {BUDGETS.map((b) => (
              <Chip
                key={b}
                label={b === 10000 ? '10000+' : `${b}`}
                selected={budget === b}
                onClick={() => setBudget(b)}
              />
            ))}
          </div>
        </div>

        {/* Food */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <SectionLabel>Food Preference</SectionLabel>
          <div className="flex gap-2 flex-wrap">
            {(['vegetarian', 'non-vegetarian', 'eggetarian', 'no-preference'] as FoodPreference[]).map((f) => (
              <Chip
                key={f}
                label={f === 'no-preference' ? 'No Preference' : f.charAt(0).toUpperCase() + f.slice(1)}
                selected={food === f}
                onClick={() => setFood(f)}
              />
            ))}
          </div>
        </div>

        {/* Sleep */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-4">
          <div>
            <SectionLabel>
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="text-[#647488]" /> Sleep Time
              </span>
            </SectionLabel>
            <select
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#5B5BFF]"
              value={sleepTime}
              onChange={(e) => setSleepTime(e.target.value)}
            >
              {SLEEP_TIMES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <SectionLabel>
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="text-[#647488]" /> Wake Up Time
              </span>
            </SectionLabel>
            <select
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#5B5BFF]"
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
            >
              {WAKE_TIMES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Cleanliness */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <SectionLabel>Cleanliness: {cleanLabels[cleanliness - 1]}</SectionLabel>
          <input
            type="range"
            min={1}
            max={5}
            value={cleanliness}
            onChange={(e) => setCleanliness(Number(e.target.value))}
            className="w-full accent-[#5B5BFF]"
          />
          <div className="flex justify-between text-xs text-[#647488] mt-1">
            <span>Very Messy</span>
            <span>Very Clean</span>
          </div>
        </div>

        {/* Routine */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <SectionLabel>Daily Routine</SectionLabel>
          <div className="flex gap-2 flex-wrap">
            {(['student', 'professional', 'shift-worker', 'freelancer'] as Routine[]).map((r) => (
              <Chip
                key={r}
                label={r.charAt(0).toUpperCase() + r.slice(1)}
                selected={routine === r}
                onClick={() => setRoutine(r)}
              />
            ))}
          </div>
        </div>

        {/* Shared Preferences */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-4">
          <div>
            <SectionLabel>Guests</SectionLabel>
            <div className="flex gap-2">
              {(['never', 'occasionally', 'often'] as GuestPolicy[]).map((g) => (
                <Chip
                  key={g}
                  label={g.charAt(0).toUpperCase() + g.slice(1)}
                  selected={guests === g}
                  onClick={() => setGuests(g)}
                />
              ))}
            </div>
          </div>

          <div>
            <SectionLabel>Noise Level</SectionLabel>
            <div className="flex gap-2">
              {(['quiet', 'moderate', 'lively'] as NoiseLevel[]).map((n) => (
                <Chip
                  key={n}
                  label={n.charAt(0).toUpperCase() + n.slice(1)}
                  selected={noise === n}
                  onClick={() => setNoise(n)}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-8">
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() => setSmoking((v) => !v)}
                className={`w-10 h-6 rounded-full transition-colors relative ${smoking ? 'bg-[#5B5BFF]' : 'bg-gray-200'}`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${smoking ? 'translate-x-5' : 'translate-x-1'}`} />
              </div>
              <span className="text-sm font-semibold text-[#0F172A]">Smoking OK</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                onClick={() => setPets((v) => !v)}
                className={`w-10 h-6 rounded-full transition-colors relative ${pets ? 'bg-[#5B5BFF]' : 'bg-gray-200'}`}
              >
                <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${pets ? 'translate-x-5' : 'translate-x-1'}`} />
              </div>
              <span className="text-sm font-semibold text-[#0F172A]">Pets OK</span>
            </label>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}
      </div>

      {/* Fixed footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4">
        <Button fullWidth size="lg" loading={loading} onClick={handleComplete}>
          Save &amp; Complete
        </Button>
      </div>
    </div>
  );
}
