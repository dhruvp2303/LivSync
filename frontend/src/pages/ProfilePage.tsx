import { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Briefcase, 
  Home, 
  Search, 
  RotateCcw, 
  LogOut, 
  ChevronRight, 
  Zap, 
  Moon, 
  Utensils, 
  CreditCard, 
  Award, 
  Compass, 
  Check, 
  ShieldCheck, 
  Edit3, 
  Save, 
  Star,
  Camera,
  Trash2
} from 'lucide-react';
import { useRef } from 'react';
import type { UserProfile } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import type { AuthPage } from '@/types/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

interface Props {
  currentUser: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onNavigateAuth: (page: AuthPage) => void;
  onSwitchUser?: () => void;
}

export function ProfilePage({ currentUser, onUpdateUser, onNavigateAuth }: Props) {
  const { deleteCurrentAccount, signOut } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    displayName: currentUser.displayName,
    city: currentUser.city,
    occupation: currentUser.occupation,
    bio: currentUser.bio,
    budget: currentUser.budget,
  });
  const [isPublic, setIsPublic] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    onUpdateUser({
      ...currentUser,
      displayName: form.displayName,
      city: form.city,
      occupation: form.occupation,
      bio: form.bio,
      budget: Number(form.budget),
    });
    setEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const photoInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        if (typeof reader.result === 'string') {
          const newAvatar = reader.result;
          onUpdateUser({
            ...currentUser,
            avatarUrl: newAvatar,
          });
          try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              await supabase.from('profiles').update({ avatar_url: newAvatar }).eq('id', user.id);
            }
          } catch (err) {
            console.warn(err);
          }
          setSavedSuccess(true);
          setTimeout(() => setSavedSuccess(false), 2500);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = async () => {
    onUpdateUser({
      ...currentUser,
      avatarUrl: '',
    });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('profiles').update({ avatar_url: '' }).eq('id', user.id);
      }
    } catch (err) {
      console.warn(err);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-28 text-slate-900">
      {/* Hero Banner */}
      <div className="relative h-44 bg-gradient-to-r from-indigo-500 via-violet-500 to-sky-400 flex items-end px-5 pb-4 shadow-sm">
        <div className="absolute top-6 right-5 flex gap-2">
          <button
            onClick={() => onNavigateAuth('vibe-quiz')}
            className="px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-semibold border border-white/30 flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Retake Quiz</span>
          </button>
        </div>
      </div>

      {/* User Info Header */}
      <div className="px-5 -mt-14 relative z-10 max-w-4xl mx-auto">
        <div className="flex items-end justify-between">
          <div className="flex items-end gap-3">
            <div className="relative group cursor-pointer" onClick={() => photoInputRef.current?.click()} title="Click to upload/change profile picture">
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarFileChange}
                className="hidden"
              />
              <Avatar
                src={currentUser.avatarUrl || undefined}
                name={currentUser.displayName}
                size="3xl"
                className="rounded-3xl border-4 border-white shadow-lg"
              />
              <div className="absolute inset-0 bg-black/25 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Camera className="w-6 h-6" />
              </div>
              <span className="absolute bottom-1 right-1 w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center border-2 border-white shadow-sm">
                <Camera className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="mb-2 flex flex-col gap-1">
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold transition shadow-2xs w-fit"
              >
                <Camera className="w-3 h-3" />
                <span>{currentUser.avatarUrl ? 'Change Profile Picture' : 'Add Profile Picture'}</span>
              </button>
              {currentUser.avatarUrl && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 text-slate-500 hover:text-rose-600 text-[11px] font-medium transition w-fit"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Use Initial Letter</span>
                </button>
              )}
            </div>
          </div>

          <button
            onClick={() => (editing ? handleSave() : setEditing(true))}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            {editing ? (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </>
            ) : (
              <>
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </>
            )}
          </button>
        </div>

        {savedSuccess && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium text-center shadow-sm">
            Profile updated successfully
          </div>
        )}

        <div className="mt-4">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{currentUser.displayName}</h1>
            <span className="text-slate-500 text-lg font-medium">, {currentUser.age}</span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
              <ShieldCheck className="w-3 h-3" /> Verified
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold">
              {currentUser.intent === 'has-place' ? (
                <>
                  <Home className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Has a Place</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Seeking a Room</span>
                </>
              )}
            </span>
            <span className="text-xs text-slate-600 flex items-center gap-1 font-medium bg-white px-2.5 py-1 rounded-full border border-slate-200/80">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentUser.city}</span>
            </span>
            <span className="text-xs text-slate-600 flex items-center gap-1 font-medium bg-white px-2.5 py-1 rounded-full border border-slate-200/80">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentUser.occupation}</span>
            </span>
          </div>

          {editing ? (
            <div className="mt-4 space-y-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Display Name</label>
                <input
                  type="text"
                  value={form.displayName}
                  onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Occupation</label>
                <input
                  type="text"
                  value={form.occupation}
                  onChange={(e) => setForm({ ...form, occupation: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Bio</label>
                <textarea
                  rows={3}
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Monthly Budget (₹)</label>
                <input
                  type="number"
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600"
                />
              </div>
            </div>
          ) : (
            <p className="mt-3 text-slate-600 text-sm leading-relaxed max-w-2xl bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
              {currentUser.bio || 'No bio added yet.'}
            </p>
          )}
        </div>
      </div>

      {/* Vibe DNA Grid */}
      <div className="px-5 mt-6 max-w-4xl mx-auto">
        <h2 className="text-xs font-bold tracking-wider uppercase text-slate-500 mb-3">
          Your Lifestyle Profile
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-slate-300 transition-all">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 mb-2">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Personality</div>
            <div className="text-sm font-bold capitalize text-slate-900 mt-0.5">
              {currentUser.personality}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-slate-300 transition-all">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 mb-2">
              <Zap className="w-4 h-4" />
            </div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Energy Level</div>
            <div className="text-sm font-bold capitalize text-slate-900 mt-0.5">
              {currentUser.energyLevel}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-slate-300 transition-all">
            <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600 mb-2">
              <Moon className="w-4 h-4" />
            </div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Sleep Schedule</div>
            <div className="text-sm font-bold capitalize text-slate-900 mt-0.5">
              {currentUser.sleepSchedule.replace('-', ' ')}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-slate-300 transition-all">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 mb-2">
              <Star className="w-4 h-4" />
            </div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Cleanliness</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1">
              <span>{currentUser.cleanliness} / 5</span>
              <span className="text-xs text-slate-400 font-normal">
                ({currentUser.cleanliness >= 4 ? 'Very Tidy' : currentUser.cleanliness === 3 ? 'Balanced' : 'Casual'})
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-slate-300 transition-all">
            <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 mb-2">
              <Utensils className="w-4 h-4" />
            </div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Food Preference</div>
            <div className="text-sm font-bold capitalize text-slate-900 mt-0.5">
              {currentUser.foodPreference}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm hover:border-slate-300 transition-all">
            <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 mb-2">
              <CreditCard className="w-4 h-4" />
            </div>
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Monthly Budget</div>
            <div className="text-sm font-bold text-indigo-600 mt-0.5">
              ₹{currentUser.budget.toLocaleString()}/mo
            </div>
          </div>
        </div>
      </div>

      {/* Skills & Superpowers */}
      <div className="px-5 mt-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-4 h-4 text-indigo-600" />
          <h2 className="text-xs font-bold tracking-wider uppercase text-slate-500">
            Household Contributions
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {currentUser.skills && currentUser.skills.length > 0 ? (
            currentUser.skills.map((skill) => (
              <span
                key={skill}
                className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <Check className="w-3.5 h-3.5 text-indigo-600" />
                <span>{skill}</span>
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-500">No skills specified yet.</span>
          )}
        </div>
      </div>

      {/* Interests */}
      <div className="px-5 mt-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-3">
          <Compass className="w-4 h-4 text-indigo-600" />
          <h2 className="text-xs font-bold tracking-wider uppercase text-slate-500">
            Passions & Interests
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {currentUser.interests && currentUser.interests.length > 0 ? (
            currentUser.interests.map((interest) => (
              <span
                key={interest}
                className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-medium shadow-sm"
              >
                {interest}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-500">No interests added yet.</span>
          )}
        </div>
      </div>

      {/* Room Details if user has-place */}
      {currentUser.intent === 'has-place' && currentUser.roomInfo && (
        <div className="px-5 mt-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <Home className="w-4 h-4 text-indigo-600" />
            <h2 className="text-xs font-bold tracking-wider uppercase text-slate-500">
              Your Listed Space
            </h2>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">{currentUser.roomInfo.locality}</h3>
                <p className="text-xs text-slate-500 capitalize">{currentUser.roomInfo.furnishing.replace('-', ' ')}</p>
              </div>
              <div className="text-right">
                <span className="text-base font-extrabold text-indigo-600">₹{currentUser.roomInfo.rentPerPerson}</span>
                <span className="text-[11px] text-slate-400 block">/ person</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {currentUser.roomInfo.description}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {currentUser.roomInfo.amenities.map(a => (
                <span key={a} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-[11px] font-medium text-slate-700">
                  <Check className="w-3 h-3 text-indigo-600" />
                  <span>{a}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Settings & Privacy */}
      <div className="px-5 mt-8 max-w-4xl mx-auto">
        <h2 className="text-xs font-bold tracking-wider uppercase text-slate-500 mb-3">
          Preferences & Account
        </h2>
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
          <div className="p-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-slate-900">Profile Visibility</div>
              <div className="text-xs text-slate-500">Show your profile in the Discover feed</div>
            </div>
            <button
              onClick={() => setIsPublic(!isPublic)}
              className={`w-11 h-6 rounded-full transition-colors relative ${
                isPublic ? 'bg-indigo-600' : 'bg-slate-200'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 shadow-sm ${
                  isPublic ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          <button
            onClick={() => onNavigateAuth('intent-select')}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
          >
            <div>
              <div className="text-sm font-semibold text-slate-900">Switch Intent</div>
              <div className="text-xs text-slate-500">
                Change between "Looking for room" & "Have a room"
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={async () => {
              try {
                await deleteCurrentAccount();
              } catch (e) {
                console.warn(e);
              }
              onNavigateAuth('welcome');
            }}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-red-50/50 transition-colors text-red-600"
          >
            <div>
              <div className="text-sm font-semibold text-red-600">Delete Account & Clear All Data</div>
              <div className="text-xs text-red-500/80">
                Permanently delete account from database and reset application
              </div>
            </div>
            <RotateCcw className="w-4 h-4 text-red-500" />
          </button>

          <button
            onClick={async () => {
              await signOut();
              onNavigateAuth('welcome');
            }}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
          >
            <div>
              <div className="text-sm font-semibold text-slate-900">Sign Out</div>
              <div className="text-xs text-slate-500">Return to welcome screen</div>
            </div>
            <LogOut className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
