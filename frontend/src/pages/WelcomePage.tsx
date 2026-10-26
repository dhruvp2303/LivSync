import { useState } from 'react';
import { Home, Users, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import type { AuthPage } from '@/types/navigation';

interface Props {
  onNavigate: (page: AuthPage) => void;
  onExploreDemo?: () => void;
}

const SLIDES = [
  {
    icon: Home,
    title: 'Not just a room.',
    subtitle: 'A compatible home.',
    description: 'LivSync helps you find verified flats and compatible roommates who match the way you live.',
    tag: 'Verified Listings',
  },
  {
    icon: Users,
    title: 'Lifestyle matching.',
    subtitle: 'Beyond rent and location.',
    description: 'We evaluate sleeping routines, cleanliness standards, work styles, and habits before you commit.',
    tag: 'Compatibility Engine',
  },
  {
    icon: Sparkles,
    title: 'Balanced living.',
    subtitle: 'Similar and complementary.',
    description: 'Find flatmates who complement your routine, share household duties, and respect your personal space.',
    tag: 'Complementary Matching',
  },
];

export function WelcomePage({ onNavigate, onExploreDemo }: Props) {
  const [slide, setSlide] = useState(0);
  const current = SLIDES[slide];
  const IconComponent = current.icon;

  const handleNext = () => {
    if (slide < SLIDES.length - 1) {
      setSlide(slide + 1);
    } else {
      onNavigate('register');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between py-6 px-4 sm:px-6 relative overflow-hidden">
      {/* Top Header / Skip */}
      <div className="flex items-center justify-between max-w-md mx-auto w-full pt-2">
        <Logo size="sm" />

        <button
          onClick={() => onNavigate('register')}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-200/50 transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Main Slide Card Area */}
      <div className="max-w-md mx-auto w-full my-auto py-8">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 shadow-xs flex flex-col items-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-6">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>{current.tag}</span>
          </div>

          {/* Icon Circle */}
          <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center text-indigo-600 mb-6 shadow-xs border border-slate-200/60">
            <IconComponent className="w-9 h-9" strokeWidth={1.8} />
          </div>

          {/* Headline & Subtitle */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
            {current.title}
            <br />
            <span className="text-indigo-600 font-extrabold">{current.subtitle}</span>
          </h1>

          <p className="mt-3 text-sm text-slate-600 leading-relaxed max-w-xs">
            {current.description}
          </p>

          {/* Slide dots */}
          <div className="flex items-center gap-2 mt-8">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                className={`h-2 rounded-full transition-all duration-200 ${
                  i === slide ? 'w-6 bg-indigo-600' : 'w-2 bg-slate-200 hover:bg-slate-300'
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons Section */}
      <div className="max-w-md mx-auto w-full space-y-3 pb-4">
        {/* Next / Get Started */}
        <button
          onClick={handleNext}
          className="w-full py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-xs transition-all active:scale-98 flex items-center justify-center gap-2"
        >
          <span>{slide < SLIDES.length - 1 ? 'Next' : 'Get Started'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Explore Demo */}
        {onExploreDemo && (
          <button
            onClick={onExploreDemo}
            className="w-full py-3 px-6 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold text-xs transition-all shadow-xs"
          >
            Explore Demo Profiles
          </button>
        )}

        {/* Sign In link */}
        <p className="text-center text-xs text-slate-500 pt-2">
          Already have an account?{' '}
          <button
            onClick={() => onNavigate('login')}
            className="text-indigo-600 font-semibold hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
