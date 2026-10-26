import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import type { AuthPage } from '@/types/navigation';

interface Props {
  onNavigate: (page: AuthPage) => void;
}

export function SplashPage({ onNavigate }: Props) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 900);
    const t3 = setTimeout(() => onNavigate('welcome'), 2200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onNavigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden select-none">
      {/* Brand Icon & Title */}
      <div
        className={`flex flex-col items-center gap-4 transition-all duration-700 ease-out ${
          phase >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
          <Sparkles className="w-8 h-8" strokeWidth={2} />
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Liv<span className="text-indigo-600">Sync</span>
          </h1>
          <p
            className={`mt-1.5 text-slate-500 text-xs font-semibold tracking-wide uppercase transition-all duration-700 delay-200 ${
              phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
          >
            Roommate Compatibility Network
          </p>
        </div>
      </div>

      {/* Subtle Loading Indicator */}
      <div
        className={`flex gap-1.5 mt-8 transition-all duration-500 delay-300 ${
          phase >= 1 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"
            style={{ animationDelay: `${i * 0.15}s`, animationDuration: '1s' }}
          />
        ))}
      </div>
    </div>
  );
}
