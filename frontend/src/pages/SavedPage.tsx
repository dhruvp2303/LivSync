import { Bookmark, Compass, ArrowRight } from 'lucide-react';

interface Props {
  onGoToDiscover: () => void;
}

export function SavedPage({ onGoToDiscover }: Props) {
  return (
    <div className="min-h-screen bg-slate-50 pb-24 text-slate-900">
      <div className="px-5 pt-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Bookmark className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Saved Profiles</h1>
            <p className="text-slate-500 text-xs mt-0.5">Roommates and spaces you have bookmarked</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center px-6 py-20 max-w-md mx-auto text-center">
        <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-center mb-5 text-indigo-600">
          <Bookmark className="w-7 h-7" />
        </div>
        <h2 className="text-slate-900 font-bold text-lg">No saved profiles yet</h2>
        <p className="text-slate-500 text-sm mt-2 leading-relaxed">
          When you explore candidates on Discover, tap the bookmark icon on any profile to save it for easy comparison.
        </p>
        <button
          onClick={onGoToDiscover}
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm active:scale-[0.98] transition-all"
        >
          <Compass className="w-4 h-4" />
          <span>Discover Roommates</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
