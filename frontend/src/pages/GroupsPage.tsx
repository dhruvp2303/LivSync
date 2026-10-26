import { Building2, Users, Lightbulb, Plus, CheckCircle2, ArrowRight } from 'lucide-react';

interface Props {
  onGoToDiscover: () => void;
}

export function GroupsPage({ onGoToDiscover }: Props) {
  return (
    <div className="min-h-screen bg-slate-50 pb-24 text-slate-900">
      <div className="px-5 pt-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Living Groups</h1>
            <p className="text-slate-500 text-xs mt-0.5">Team up with verified flatmates and rent complete apartments together</p>
          </div>
        </div>
      </div>

      <div className="px-5 mt-6 max-w-4xl mx-auto space-y-6">
        {/* Concept explanation */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Lightbulb className="w-4 h-4" />
            </div>
            <h3 className="text-slate-900 font-bold text-sm">How Living Groups Work</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { step: '1', title: 'Smart Clustering', text: 'Multiple seekers looking for 2BHK/3BHK flats in the same locality.' },
              { step: '2', title: 'Compatibility Matching', text: 'LivSync groups individuals based on sleep hours, food habits, and budgets.' },
              { step: '3', title: 'Group Visits', text: 'Visit and lease larger, higher-end apartments together with split rent.' },
              { step: '4', title: 'Seamless Move-In', text: 'Move in with a pre-vetted, harmonious group of roommates.' },
            ].map(item => (
              <div key={item.step} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {item.step}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                  <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested Group */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-slate-900 font-bold text-sm uppercase tracking-wider">Recommended Cohort</h2>
            <span className="text-xs text-indigo-600 font-semibold">Matched for you</span>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-slate-900 font-bold text-base">Ahmedabad Tech & Design Cohort</h3>
                <p className="text-xs text-slate-500 mt-0.5">Navrangpura & SG Highway • 3 Available Spots</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-bold">
                88% Compatibility
              </span>
            </div>
            <p className="text-slate-600 text-sm mb-4 leading-relaxed">
              3 professionals with clean habits, daytime working hours, and ₹15k–₹25k budget seeking a 3BHK flat near SG Highway.
            </p>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex -space-x-2">
                {['Rohan', 'Priya', 'Vikram'].map((name, i) => (
                  <div
                    key={name}
                    className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold border-2 border-white shadow-sm"
                    title={name}
                  >
                    {name[0]}
                  </div>
                ))}
                <div className="w-9 h-9 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-slate-600 text-[11px] font-bold shadow-sm">
                  +1
                </div>
              </div>
              <span className="text-xs text-slate-500 font-medium">3 verified members in group</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-5">
              {['₹15k–₹25k Budget', 'Professionals', 'Quiet Hours: 11 PM', 'High Cleanliness'].map(tag => (
                <span key={tag} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex gap-3">
              <button className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm active:scale-[0.98] transition-all">
                Request to Join Group
              </button>
              <button 
                onClick={onGoToDiscover}
                className="px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors"
              >
                View Members
              </button>
            </div>
          </div>
        </div>

        {/* Create Group */}
        <div>
          <button className="w-full p-6 rounded-2xl border-2 border-dashed border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/20 text-center transition-all group shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-indigo-100 text-slate-600 group-hover:text-indigo-600 flex items-center justify-center mx-auto mb-2 transition-colors">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-slate-900 font-bold text-sm group-hover:text-indigo-600 transition-colors">
              Start a New Living Group
            </span>
            <p className="text-slate-500 text-xs mt-1">Set your preferred neighborhood and invite matching candidates</p>
          </button>
        </div>
      </div>
    </div>
  );
}
