import { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Sparkles, 
  Moon, 
  Home, 
  Compass, 
  Award, 
  CreditCard,
  Plus,
  PenLine
} from 'lucide-react';
import type { AuthPage } from '@/types/navigation';
import type {
  PersonalityTrait, EnergyLevel, SocialStyle, SleepSchedule,
  FoodPreference, WorkStyle, GuestPolicy, NoisePreference,
  CleanlinessLevel, Interest, Skill, GenderPreference,
} from '@/types';
import { INTEREST_OPTIONS, SKILL_OPTIONS } from '@/types';

interface Props {
  onNavigate: (page: AuthPage) => void;
  onComplete: (vibeData: VibeData) => void;
  isHasPlace: boolean;
}

export interface VibeData {
  personality: PersonalityTrait | string;
  energyLevel: EnergyLevel | string;
  socialStyle: SocialStyle | string;
  sleepSchedule: SleepSchedule | string;
  cleanliness: CleanlinessLevel;
  foodPreference: FoodPreference | string;
  workStyle: WorkStyle | string;
  guestPolicy: GuestPolicy | string;
  noisePreference: NoisePreference | string;
  smoking: boolean;
  drinking: boolean;
  pets: boolean;
  interests: (Interest | string)[];
  skills: (Skill | string)[];
  budget: number;
  preferredGender: GenderPreference;
  preferredAgeMin: number;
  preferredAgeMax: number;
  customDetails?: Record<string, string>;
}

interface QuizStep {
  title: string;
  subtitle: string;
  icon: typeof Sparkles;
}

const STEPS: QuizStep[] = [
  { title: 'Personality & Energy', subtitle: 'How would you describe your natural rhythm?', icon: Sparkles },
  { title: 'Daily Lifestyle', subtitle: 'Work schedule and cleanliness expectations', icon: Moon },
  { title: 'Living Habits', subtitle: 'Food preferences, noise levels, and guest policies', icon: Home },
  { title: 'Passions & Hobbies', subtitle: 'What do you enjoy doing during your downtime?', icon: Compass },
  { title: 'Household Contributions', subtitle: 'What practical strengths do you bring?', icon: Award },
  { title: 'Budget & Matching Filters', subtitle: 'Target rent range and roommate criteria', icon: CreditCard },
];

type OptionItem<T extends string> = { value: T; label: string; desc?: string };

function OptionGrid<T extends string>({
  options,
  selected,
  onSelect,
  columns = 3,
  multi = false,
  allowOther = false,
  otherPlaceholder = 'Please specify custom details...',
  otherValue = '',
  onOtherChange,
}: {
  options: OptionItem<T>[];
  selected: T | T[] | string;
  onSelect: (val: T | string) => void;
  columns?: number;
  multi?: boolean;
  allowOther?: boolean;
  otherPlaceholder?: string;
  otherValue?: string;
  onOtherChange?: (val: string) => void;
}) {
  const isSelected = (v: string) => {
    if (multi && Array.isArray(selected)) {
      return (selected as string[]).includes(v);
    }
    return selected === v;
  };

  const isOtherActive = isSelected('other');

  return (
    <div className="space-y-2.5">
      <div className={`grid gap-2.5`} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {options.map(opt => {
          const active = isSelected(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onSelect(opt.value)}
              className={`p-3.5 rounded-xl text-left transition-all border ${
                active
                  ? 'bg-indigo-50/70 border-indigo-600 shadow-sm ring-1 ring-indigo-200'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-bold ${active ? 'text-indigo-700' : 'text-slate-900'}`}>
                  {opt.label}
                </span>
                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors ${
                  active ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                }`}>
                  {active && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
              </div>
              {opt.desc && (
                <div className="text-[11px] text-slate-500 leading-snug">{opt.desc}</div>
              )}
            </button>
          );
        })}

        {allowOther && (
          <button
            type="button"
            onClick={() => onSelect('other')}
            className={`p-3.5 rounded-xl text-left transition-all border ${
              isOtherActive
                ? 'bg-indigo-50/70 border-indigo-600 shadow-sm ring-1 ring-indigo-200'
                : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className={`text-xs font-bold ${isOtherActive ? 'text-indigo-700' : 'text-slate-900'}`}>
                Other
              </span>
              <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-colors ${
                isOtherActive ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
              }`}>
                {isOtherActive && <Check className="w-2.5 h-2.5 stroke-[3]" />}
              </div>
            </div>
            <div className="text-[11px] text-slate-500 leading-snug">Type custom answer</div>
          </button>
        )}
      </div>

      {allowOther && isOtherActive && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-white border border-indigo-300 shadow-xs animate-fade-in">
          <PenLine className="w-4 h-4 text-indigo-600 shrink-0" />
          <input
            type="text"
            placeholder={otherPlaceholder}
            value={otherValue}
            onChange={(e) => onOtherChange?.(e.target.value)}
            className="flex-1 bg-transparent text-xs text-slate-900 placeholder:text-slate-400 outline-none font-medium"
            autoFocus
          />
        </div>
      )}
    </div>
  );
}

export function VibeQuizPage({ onNavigate, onComplete, isHasPlace }: Props) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<VibeData>({
    personality: 'ambivert',
    energyLevel: 'moderate',
    socialStyle: 'balanced',
    sleepSchedule: 'flexible',
    cleanliness: 3 as CleanlinessLevel,
    foodPreference: 'no-preference',
    workStyle: 'working-professional',
    guestPolicy: 'sometimes',
    noisePreference: 'moderate',
    smoking: false,
    drinking: false,
    pets: false,
    interests: [],
    skills: [],
    budget: 12000,
    preferredGender: 'any',
    preferredAgeMin: 20,
    preferredAgeMax: 32,
    customDetails: {},
  });

  const [customInputs, setCustomInputs] = useState<Record<string, string>>({
    personality: '',
    energyLevel: '',
    socialStyle: '',
    sleepSchedule: '',
    workStyle: '',
    foodPreference: '',
    noisePreference: '',
    guestPolicy: '',
  });

  const [customInterestInput, setCustomInterestInput] = useState('');
  const [customSkillInput, setCustomSkillInput] = useState('');

  const update = <K extends keyof VibeData>(key: K, value: VibeData[K]) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const updateCustomInput = (field: string, val: string) => {
    setCustomInputs(prev => ({ ...prev, [field]: val }));
    setData(prev => ({
      ...prev,
      customDetails: {
        ...(prev.customDetails || {}),
        [field]: val,
      },
    }));
  };

  const toggleInterest = (interest: Interest | string) => {
    setData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : prev.interests.length < 10 ? [...prev.interests, interest] : prev.interests,
    }));
  };

  const handleAddCustomInterest = () => {
    const trimmed = customInterestInput.trim();
    if (trimmed && !data.interests.includes(trimmed)) {
      toggleInterest(trimmed);
      setCustomInterestInput('');
    }
  };

  const toggleSkill = (skill: Skill | string) => {
    setData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : prev.skills.length < 8 ? [...prev.skills, skill] : prev.skills,
    }));
  };

  const handleAddCustomSkill = () => {
    const trimmed = customSkillInput.trim();
    if (trimmed && !data.skills.includes(trimmed)) {
      toggleSkill(trimmed);
      setCustomSkillInput('');
    }
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else onComplete(data);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
    else onNavigate('profile-setup');
  };

  const currentStep = STEPS[step];
  const StepIcon = currentStep.icon;

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <p className="text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Personality Type</p>
              <OptionGrid
                options={[
                  { value: 'introvert' as PersonalityTrait, label: 'Introvert', desc: 'Recharge quietly in own space' },
                  { value: 'ambivert' as PersonalityTrait, label: 'Ambivert', desc: 'Balanced between social & solo' },
                  { value: 'extrovert' as PersonalityTrait, label: 'Extrovert', desc: 'Energized by frequent interaction' },
                ]}
                selected={data.personality}
                onSelect={v => update('personality', v)}
                allowOther={true}
                otherPlaceholder="e.g. Quiet while working, friendly & chatty on weekends..."
                otherValue={customInputs.personality}
                onOtherChange={v => updateCustomInput('personality', v)}
              />
            </div>
            <div>
              <p className="text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Daily Energy</p>
              <OptionGrid
                options={[
                  { value: 'calm' as EnergyLevel, label: 'Calm', desc: 'Serene and mellow pace' },
                  { value: 'moderate' as EnergyLevel, label: 'Moderate', desc: 'Steady, adaptable daily rhythm' },
                  { value: 'high-energy' as EnergyLevel, label: 'High Energy', desc: 'Active, dynamic, and upbeat' },
                ]}
                selected={data.energyLevel}
                onSelect={v => update('energyLevel', v)}
                allowOther={true}
                otherPlaceholder="e.g. High energy morning gym, calm evenings..."
                otherValue={customInputs.energyLevel}
                onOtherChange={v => updateCustomInput('energyLevel', v)}
              />
            </div>
            <div>
              <p className="text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Social Habits</p>
              <OptionGrid
                options={[
                  { value: 'homebody' as SocialStyle, label: 'Homebody', desc: 'Prefers quiet evenings at home' },
                  { value: 'balanced' as SocialStyle, label: 'Balanced', desc: 'Occasional hangouts and outings' },
                  { value: 'social-butterfly' as SocialStyle, label: 'Social', desc: 'Frequently active with friends' },
                ]}
                selected={data.socialStyle}
                onSelect={v => update('socialStyle', v)}
                allowOther={true}
                otherPlaceholder="e.g. Small gatherings of 2-3 close friends only..."
                otherValue={customInputs.socialStyle}
                onOtherChange={v => updateCustomInput('socialStyle', v)}
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <p className="text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Sleep Routine</p>
              <OptionGrid
                options={[
                  { value: 'early-bird' as SleepSchedule, label: 'Early Bird', desc: 'Awake before 7:00 AM' },
                  { value: 'flexible' as SleepSchedule, label: 'Flexible', desc: 'Regular standard daytime hours' },
                  { value: 'night-owl' as SleepSchedule, label: 'Night Owl', desc: 'Active late past midnight' },
                ]}
                selected={data.sleepSchedule}
                onSelect={v => update('sleepSchedule', v)}
                allowOther={true}
                otherPlaceholder="e.g. Alternating night shifts, sleeps during afternoons..."
                otherValue={customInputs.sleepSchedule}
                onOtherChange={v => updateCustomInput('sleepSchedule', v)}
              />
            </div>
            <div>
              <p className="text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Work Style</p>
              <OptionGrid
                columns={2}
                options={[
                  { value: 'student' as WorkStyle, label: 'Student', desc: 'College / university schedule' },
                  { value: 'working-professional' as WorkStyle, label: 'Office Professional', desc: 'Standard daytime office commute' },
                  { value: 'freelancer' as WorkStyle, label: 'Freelancer', desc: 'Flexible remote work hours' },
                  { value: 'hybrid' as WorkStyle, label: 'Hybrid / Remote', desc: 'Mix of work-from-home & office' },
                ]}
                selected={data.workStyle}
                onSelect={v => update('workStyle', v)}
                allowOther={true}
                otherPlaceholder="e.g. Medical resident doctor, Pilot, Civil servant..."
                otherValue={customInputs.workStyle}
                onOtherChange={v => updateCustomInput('workStyle', v)}
              />
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-700 text-xs font-bold uppercase tracking-wider">Cleanliness Standard</span>
                <span className="text-indigo-600 font-bold text-xs">{data.cleanliness} / 5</span>
              </div>
              <input
                type="range"
                min={1}
                max={5}
                step={1}
                value={data.cleanliness}
                onChange={e => update('cleanliness', parseInt(e.target.value) as CleanlinessLevel)}
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-medium">
                <span>Casual & Relaxed</span>
                <span>Spotless & Structured</span>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <p className="text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Dietary Preference</p>
              <OptionGrid
                columns={2}
                options={[
                  { value: 'vegetarian' as FoodPreference, label: 'Vegetarian' },
                  { value: 'non-vegetarian' as FoodPreference, label: 'Non-Vegetarian' },
                  { value: 'eggetarian' as FoodPreference, label: 'Eggetarian' },
                  { value: 'vegan' as FoodPreference, label: 'Vegan' },
                  { value: 'no-preference' as FoodPreference, label: 'No Preference' },
                ]}
                selected={data.foodPreference}
                onSelect={v => update('foodPreference', v)}
                allowOther={true}
                otherPlaceholder="e.g. Jain Vegetarian (no onion/garlic), Halal, Keto..."
                otherValue={customInputs.foodPreference}
                onOtherChange={v => updateCustomInput('foodPreference', v)}
              />
            </div>
            <div>
              <p className="text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Ambient Noise</p>
              <OptionGrid
                options={[
                  { value: 'silent' as NoisePreference, label: 'Quiet / Focused', desc: 'Prefers peaceful silence' },
                  { value: 'moderate' as NoisePreference, label: 'Moderate', desc: 'Standard household sounds' },
                  { value: 'lively' as NoisePreference, label: 'Lively', desc: 'Comfortable with music & chatter' },
                ]}
                selected={data.noisePreference}
                onSelect={v => update('noisePreference', v)}
                allowOther={true}
                otherPlaceholder="e.g. Quiet study hours strictly after 10:30 PM..."
                otherValue={customInputs.noisePreference}
                onOtherChange={v => updateCustomInput('noisePreference', v)}
              />
            </div>
            <div>
              <p className="text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Guest Policy</p>
              <OptionGrid
                options={[
                  { value: 'rarely' as GuestPolicy, label: 'Quiet Home', desc: 'Rarely hosts external visitors' },
                  { value: 'sometimes' as GuestPolicy, label: 'Occasional', desc: 'Friends over with prior notice' },
                  { value: 'often' as GuestPolicy, label: 'Open Door', desc: 'Loves frequent gatherings' },
                ]}
                selected={data.guestPolicy}
                onSelect={v => update('guestPolicy', v)}
                allowOther={true}
                otherPlaceholder="e.g. Overnight visitors allowed on weekends with advance notice..."
                otherValue={customInputs.guestPolicy}
                onOtherChange={v => updateCustomInput('guestPolicy', v)}
              />
            </div>
            <div className="flex gap-3">
              {([
                { key: 'smoking' as const, label: 'Smoking Allowed' },
                { key: 'drinking' as const, label: 'Alcohol Friendly' },
                { key: 'pets' as const, label: 'Pet Friendly' },
              ]).map(({ key, label }) => {
                const active = data[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => update(key, !data[key])}
                    className={`flex-1 p-3 rounded-xl text-center border transition-all ${
                      active
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-700 font-bold shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 shadow-sm'
                    }`}
                  >
                    <div className="text-xs font-bold">{label}</div>
                    <div className={`text-[10px] mt-0.5 ${active ? 'text-indigo-600 font-semibold' : 'text-slate-400'}`}>
                      {active ? 'Yes' : 'No'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-slate-700 text-xs font-bold uppercase tracking-wider">
                Select your interests
              </p>
              <span className="text-xs font-semibold text-indigo-600">
                {data.interests.length} / 10 selected
              </span>
            </div>

            {/* Custom Interest Input Box */}
            <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 shadow-xs">
              <input
                type="text"
                placeholder="Type custom interest (e.g. Chess, Astronomy, Stand-up comedy)..."
                value={customInterestInput}
                onChange={e => setCustomInterestInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomInterest();
                  }
                }}
                className="flex-1 px-2.5 py-1 text-xs text-slate-900 placeholder:text-slate-400 outline-none"
              />
              <button
                type="button"
                onClick={handleAddCustomInterest}
                disabled={!customInterestInput.trim()}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-bold transition shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {/* Show any added custom interests first */}
              {data.interests.filter(i => !INTEREST_OPTIONS.includes(i as any)).map(customInt => (
                <button
                  key={customInt}
                  type="button"
                  onClick={() => toggleInterest(customInt)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border bg-indigo-600 border-indigo-600 text-white shadow-sm flex items-center gap-1.5"
                >
                  <span>{customInt}</span>
                  <Check className="w-3 h-3 stroke-[3]" />
                </button>
              ))}

              {INTEREST_OPTIONS.map(interest => {
                const isActive = data.interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                      isActive
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 shadow-sm'
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-slate-700 text-xs font-bold uppercase tracking-wider">
                Household Contributions
              </p>
              <span className="text-xs font-semibold text-indigo-600">
                {data.skills.length} / 8 selected
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Select practical strengths you bring, or type your own custom contribution:
            </p>

            {/* Custom Skill Input Box */}
            <div className="flex items-center gap-2 p-2 rounded-xl bg-white border border-slate-200 shadow-xs">
              <input
                type="text"
                placeholder="Type custom skill (e.g. Barista / Coffee specialist, Plant care)..."
                value={customSkillInput}
                onChange={e => setCustomSkillInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomSkill();
                  }
                }}
                className="flex-1 px-2.5 py-1 text-xs text-slate-900 placeholder:text-slate-400 outline-none"
              />
              <button
                type="button"
                onClick={handleAddCustomSkill}
                disabled={!customSkillInput.trim()}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-bold transition shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {/* Show custom skills first */}
              {data.skills.filter(s => !SKILL_OPTIONS.includes(s as any)).map(customSk => (
                <button
                  key={customSk}
                  type="button"
                  onClick={() => toggleSkill(customSk)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border bg-indigo-600 border-indigo-600 text-white shadow-sm flex items-center gap-1.5"
                >
                  <span>{customSk}</span>
                  <Check className="w-3 h-3 stroke-[3]" />
                </button>
              ))}

              {SKILL_OPTIONS.map(skill => {
                const isActive = data.skills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                      isActive
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 shadow-sm'
                    }`}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-700 text-xs font-bold uppercase tracking-wider">Monthly Budget</span>
                <span className="text-indigo-600 font-extrabold text-sm">₹{data.budget.toLocaleString()} / mo</span>
              </div>
              <input
                type="range"
                min={3000}
                max={30000}
                step={500}
                value={data.budget}
                onChange={e => update('budget', parseInt(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                <span>₹3,000</span>
                <span>₹30,000+</span>
              </div>
            </div>

            <div>
              <p className="text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">
                Roommate Gender Preference
              </p>
              <OptionGrid
                options={[
                  { value: 'male' as GenderPreference, label: 'Male Only' },
                  { value: 'female' as GenderPreference, label: 'Female Only' },
                  { value: 'any' as GenderPreference, label: 'Any / Open' },
                ]}
                selected={data.preferredGender}
                onSelect={v => update('preferredGender', v as GenderPreference)}
              />
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
              <p className="text-slate-700 text-xs font-bold uppercase tracking-wider mb-3">
                Preferred Age Range: <span className="text-indigo-600 font-bold">{data.preferredAgeMin} – {data.preferredAgeMax} yrs</span>
              </p>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-[11px] text-slate-500 font-semibold mb-1 block">Minimum Age</label>
                  <input
                    type="number"
                    min={18}
                    max={50}
                    value={data.preferredAgeMin}
                    onChange={e => update('preferredAgeMin', parseInt(e.target.value) || 18)}
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:border-indigo-600 outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-[11px] text-slate-500 font-semibold mb-1 block">Maximum Age</label>
                  <input
                    type="number"
                    min={18}
                    max={50}
                    value={data.preferredAgeMax}
                    onChange={e => update('preferredAgeMax', parseInt(e.target.value) || 30)}
                    className="w-full px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:border-indigo-600 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900">
      {/* Header */}
      <div className="px-6 pt-10 pb-4 max-w-xl mx-auto w-full">
        <button
          onClick={handleBack}
          className="text-slate-500 text-sm mb-4 flex items-center gap-2 hover:text-slate-900 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Progress Bar */}
        <div className="flex gap-1.5 mb-5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${
                i <= step ? 'bg-indigo-600' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <StepIcon className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">{currentStep.title}</h1>
            <p className="text-slate-500 text-xs mt-0.5">{currentStep.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-4 overflow-y-auto max-w-xl mx-auto w-full">
        {renderStep()}
      </div>

      {/* CTA Footer */}
      <div className="px-6 py-5 max-w-xl mx-auto w-full border-t border-slate-200/60 bg-white sm:bg-transparent">
        <button
          onClick={handleNext}
          className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
        >
          <span>{step < STEPS.length - 1 ? 'Save & Continue' : 'Finish & Discover Roommates'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <p className="text-center text-[11px] text-slate-400 mt-2 font-medium">
          Step {step + 1} of {STEPS.length}
        </p>
      </div>
    </div>
  );
}
