import { useState } from 'react';
import { User, Mail, Lock, Phone, ChevronLeft, Sparkles, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import type { AuthPage } from '@/types/navigation';

interface Props {
  onNavigate: (page: AuthPage) => void;
  onSuccess: (userData?: { name: string; email: string }) => void;
}

export function RegisterPage({ onNavigate, onSuccess }: Props) {
  const { signUp, signIn } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [agreed, setAgreed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    setError('');
  };

  const validate = () => {
    if (!form.name.trim()) return 'Full name is required';
    if (!form.email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Enter a valid email address';
    if (!form.password) return 'Password is required';
    if (form.password.length < 6) return 'Password must be at least 6 characters';
    if (!agreed) return 'Please agree to the Terms & Conditions';
    return null;
  };

  const handleRegister = async () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setLoading(true);
    const result = await signUp(form.email, form.password, form.name);
    setLoading(false);
    if (result.error) {
      // If email exists, check if user typed their password
      if (result.error.toLowerCase().includes('already registered') || result.error.toLowerCase().includes('already exists')) {
        setError('An account with this email already exists.');
      } else {
        setError(result.error);
      }
    } else {
      onSuccess({ name: form.name, email: form.email });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      {/* Header */}
      <div className="max-w-md mx-auto w-full px-6 pt-8 pb-2">
        <button
          onClick={() => onNavigate('welcome')}
          className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors inline-flex items-center gap-1 text-sm font-medium"
        >
          <ChevronLeft size={20} />
          <span>Back</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col px-6 pt-2 pb-10 gap-6 max-w-md mx-auto w-full justify-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h1>
          <p className="mt-1 text-slate-500 text-sm">Join the verified roommate community</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
          <Input
            label="Full Name"
            placeholder="e.g. Rohan Verma"
            icon={<User size={16} />}
            value={form.name}
            onChange={set('name')}
            autoComplete="name"
          />
          <Input
            label="Email Address"
            placeholder="e.g. rohan@example.com"
            type="email"
            icon={<Mail size={16} />}
            value={form.email}
            onChange={set('email')}
            autoComplete="email"
          />
          <Input
            label="Phone Number (optional)"
            placeholder="+91 98765 43210"
            type="tel"
            icon={<Phone size={16} />}
            value={form.phone}
            onChange={set('phone')}
            autoComplete="tel"
          />
          <Input
            label="Password"
            placeholder="At least 6 characters"
            type="password"
            icon={<Lock size={16} />}
            value={form.password}
            onChange={set('password')}
            autoComplete="new-password"
          />

          <label className="flex items-start gap-3 cursor-pointer select-none pt-1">
            <div className="relative mt-0.5 flex-shrink-0">
              <input
                type="checkbox"
                checked={agreed}
                onChange={() => setAgreed((v) => !v)}
                className="sr-only"
              />
              <div
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors
                  ${agreed ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white'}`}
              >
                {agreed && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path
                      d="M1 4l3 3 5-6"
                      stroke="white"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              I agree to the{' '}
              <span className="text-indigo-600 font-semibold">Terms &amp; Conditions</span> and{' '}
              <span className="text-indigo-600 font-semibold">Privacy Policy</span>
            </p>
          </label>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 space-y-2.5">
              <p className="text-xs text-red-700 font-medium">{error}</p>
              {error.includes('already exists') && (
                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => onNavigate('login')}
                    className="flex-1 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs text-center"
                  >
                    Log In to Existing Account
                  </button>
                  <button
                    type="button"
                    onClick={() => onSuccess({ name: form.name, email: form.email })}
                    className="flex-1 py-2 px-3 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition text-center"
                  >
                    Continue Setup Anyway
                  </button>
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-1"
          >
            <span>{loading ? 'Creating Account...' : 'Continue to Profile Setup'}</span>
            <ArrowRight size={16} />
          </button>

          {/* Instant Continue / Skip to Setup */}
          <button
            onClick={onSuccess}
            className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs text-slate-700 font-semibold transition flex items-center justify-center gap-1.5"
          >
            <Sparkles size={14} className="text-indigo-600" />
            <span>Continue as Guest</span>
          </button>
        </div>

        <p className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <button
            onClick={() => onNavigate('login')}
            className="text-indigo-600 font-bold hover:underline"
          >
            Log In
          </button>
        </p>
      </div>

      <div className="pb-6 text-center text-xs text-slate-400">
        LivSync Roommate Matching System
      </div>
    </div>
  );
}
