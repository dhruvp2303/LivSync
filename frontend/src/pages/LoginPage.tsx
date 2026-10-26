import { useState } from 'react';
import { Mail, Lock, ChevronLeft, Sparkles, ArrowRight } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import type { AuthPage } from '@/types/navigation';

interface Props {
  onNavigate: (page: AuthPage) => void;
  onSuccess: () => void;
}

export function LoginPage({ onNavigate, onSuccess }: Props) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validate = () => {
    if (!email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email';
    if (!password) return 'Password is required';
    return null;
  };

  const handleLogin = async () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);
    if (result.error) {
      setError(
        result.error.includes('Invalid')
          ? 'Incorrect email or password. Please try again.'
          : result.error
      );
    } else {
      onSuccess();
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

      <div className="flex-1 flex flex-col px-6 pt-4 pb-10 gap-6 max-w-md mx-auto w-full justify-center">
        <div>
          <Logo size="md" className="mb-4" />
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h1>
          <p className="mt-1 text-slate-500 text-sm">Sign in to access your matched roommates and conversations</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
          <Input
            label="Email Address"
            placeholder="e.g. rohan@example.com"
            type="email"
            icon={<Mail size={16} />}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            autoComplete="email"
          />
          <div>
            <Input
              label="Password"
              placeholder="Enter your password"
              type="password"
              icon={<Lock size={16} />}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              autoComplete="current-password"
            />
            <div className="flex justify-end mt-1.5">
              <button
                type="button"
                className="text-xs text-indigo-600 font-medium hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-xs text-red-700">
              {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight size={16} />
          </button>

          {/* Instant demo explore button */}
          <button
            onClick={onSuccess}
            className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs text-slate-700 font-semibold transition flex items-center justify-center gap-1.5"
          >
            <Sparkles size={14} className="text-indigo-600" />
            <span>Continue as Demo Profile</span>
          </button>
        </div>

        <p className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <button
            onClick={() => onNavigate('register')}
            className="text-indigo-600 font-bold hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>

      <div className="pb-6 text-center text-xs text-slate-400">
        LivSync Roommate Matching System
      </div>
    </div>
  );
}
