import { useState, useRef } from 'react';
import { ArrowLeft, ArrowRight, User, Briefcase, MapPin, Calendar, Camera, Upload, Trash2 } from 'lucide-react';
import type { AuthPage } from '@/types/navigation';
import { Avatar } from '@/components/ui/Avatar';

interface Props {
  onNavigate: (page: AuthPage) => void;
  onSaveProfile: (data: ProfileData) => void;
  initialData?: Partial<ProfileData>;
}

export interface ProfileData {
  displayName: string;
  avatarUrl?: string;
  age: number;
  gender: 'male' | 'female' | 'non-binary';
  city: string;
  occupation: string;
  bio: string;
}

const CITIES = ['Ahmedabad', 'Mumbai', 'Bengaluru', 'Pune', 'Delhi', 'Hyderabad', 'Chennai', 'Kolkata', 'Jaipur', 'Lucknow'];

export function ProfileSetupPage({ onNavigate, onSaveProfile, initialData }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<ProfileData>({
    displayName: initialData?.displayName || '',
    avatarUrl: initialData?.avatarUrl || '',
    age: initialData?.age || 23,
    gender: initialData?.gender || 'male',
    city: initialData?.city || 'Ahmedabad',
    occupation: initialData?.occupation || '',
    bio: initialData?.bio || '',
  });

  const isValid = form.displayName.trim() && form.age >= 18 && form.age <= 60 && form.occupation.trim();

  const handleSubmit = () => {
    if (isValid) {
      onSaveProfile(form);
      onNavigate('vibe-quiz');
    }
  };

  const update = (key: keyof ProfileData, value: string | number) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          update('avatarUrl', reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900">
      {/* Header */}
      <div className="px-6 pt-10 pb-4 max-w-xl mx-auto w-full">
        <button
          onClick={() => onNavigate('intent-select')}
          className="text-slate-500 text-sm mb-4 flex items-center gap-2 hover:text-slate-900 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex gap-1.5">
            <div className="w-8 h-1.5 rounded-full bg-indigo-600" />
            <div className="w-8 h-1.5 rounded-full bg-indigo-600" />
            <div className="w-8 h-1.5 rounded-full bg-slate-200" />
          </div>
          <span className="text-slate-500 text-xs font-semibold">Step 2 of 3 • Basic Details</span>
        </div>

        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Tell us about yourself
        </h1>
        <p className="mt-1 text-slate-500 text-sm">
          Add your profile photo and personal details for verified roommates to see.
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 pb-6 overflow-y-auto max-w-xl mx-auto w-full space-y-5">
        {/* Profile Picture Upload Section */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <label className="text-slate-700 text-xs font-bold uppercase tracking-wider mb-3 block">
            Profile Picture
          </label>
          <div className="flex items-center gap-4">
            {/* Avatar Preview with Camera badge */}
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()} title="Click to upload profile picture">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Avatar
                src={form.avatarUrl || undefined}
                name={form.displayName || 'Dhruv'}
                size="2xl"
                className="rounded-2xl border-2 border-indigo-100 shadow-sm"
              />
              <div className="absolute inset-0 bg-black/25 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Camera className="w-5 h-5" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs border-2 border-white">
                <Camera className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="flex-1 space-y-2">
              {form.avatarUrl ? (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition shadow-xs"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Change Photo</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => update('avatarUrl', '')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-semibold transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Use Initial Letter</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-emerald-600 font-medium">
                    Custom photo uploaded successfully.
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Add your profile picture</span>
                  </button>
                  <p className="text-[11px] text-slate-500">
                    We display the first letter of your name ({form.displayName.trim() ? form.displayName.trim().charAt(0).toUpperCase() : 'your initial'}) by default, or you can add your custom photo.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="text-slate-700 text-xs font-bold uppercase tracking-wider mb-1.5 block">
            Full Name
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="e.g. Dhruv Chandreshbhai Patel"
              value={form.displayName}
              onChange={e => update('displayName', e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm shadow-sm"
            />
          </div>
        </div>

        {/* Age & Gender row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-slate-700 text-xs font-bold uppercase tracking-wider mb-1.5 block">
              Age
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="number"
                min={18}
                max={60}
                placeholder="e.g. 23"
                value={form.age || ''}
                onChange={e => update('age', parseInt(e.target.value) || 0)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm shadow-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-slate-700 text-xs font-bold uppercase tracking-wider mb-1.5 block">
              Gender
            </label>
            <div className="flex gap-1.5">
              {(['male', 'female', 'non-binary'] as const).map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => update('gender', g)}
                  className={`flex-1 py-3 px-2 rounded-xl text-xs font-semibold capitalize transition-all border ${
                    form.gender === g
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  {g === 'non-binary' ? 'Other' : g}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Occupation */}
        <div>
          <label className="text-slate-700 text-xs font-bold uppercase tracking-wider mb-1.5 block">
            Profession / Occupation
          </label>
          <div className="relative">
            <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="e.g. Software Engineer, Architecture Student, Designer"
              value={form.occupation}
              onChange={e => update('occupation', e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm shadow-sm"
            />
          </div>
        </div>

        {/* City */}
        <div>
          <label className="text-slate-700 text-xs font-bold uppercase tracking-wider mb-1.5 block">
            Target City
          </label>
          <div className="flex flex-wrap gap-2">
            {CITIES.map(city => (
              <button
                key={city}
                type="button"
                onClick={() => update('city', city)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  form.city === city
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="text-slate-700 text-xs font-bold uppercase tracking-wider mb-1.5 block">
            Short Bio (Optional)
          </label>
          <div className="relative">
            <textarea
              rows={3}
              placeholder="Tell future flatmates about your daily routine, habits, hobbies, and vibe..."
              value={form.bio}
              onChange={e => update('bio', e.target.value)}
              className="w-full p-3.5 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-sm shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 py-5 max-w-xl mx-auto w-full border-t border-slate-200/60 bg-white sm:bg-transparent">
        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
        >
          <span>Continue to Lifestyle Quiz</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
