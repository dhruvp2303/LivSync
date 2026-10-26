import { useState } from 'react';
import { Users, UserCheck, MessageSquare, Compass, ArrowRight, Clock, CheckCircle2 } from 'lucide-react';

interface Props {
  onGoToDiscover: () => void;
}

export function ConnectionsPage({ onGoToDiscover }: Props) {
  const [activeTab, setActiveTab] = useState<'received' | 'sent' | 'connected'>('received');

  return (
    <div className="min-h-screen bg-slate-50 pb-24 text-slate-900">
      <div className="px-5 pt-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Connections</h1>
            <p className="text-slate-500 text-xs mt-0.5">Your mutual roommate matches and direct requests</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mt-6 flex gap-2 p-1 bg-slate-200/60 rounded-xl max-w-sm">
          <button
            onClick={() => setActiveTab('received')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'received'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Received (0)
          </button>
          <button
            onClick={() => setActiveTab('sent')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'sent'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sent (0)
          </button>
          <button
            onClick={() => setActiveTab('connected')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'connected'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Connected (0)
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center px-6 py-20 max-w-md mx-auto text-center">
        <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-center mb-5 text-indigo-600">
          <UserCheck className="w-7 h-7" />
        </div>
        <h2 className="text-slate-900 font-bold text-lg">No connection requests yet</h2>
        <p className="text-slate-500 text-sm mt-2 leading-relaxed">
          Send a match request to someone whose lifestyle matches yours. Once they accept, you can coordinate apartment visits together.
        </p>
        <button
          onClick={onGoToDiscover}
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm active:scale-[0.98] transition-all"
        >
          <Compass className="w-4 h-4" />
          <span>Explore Candidates</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
