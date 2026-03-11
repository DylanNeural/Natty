import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Clock, ChevronRight, Zap, Sparkles, Drumstick, Wheat, Droplet, Flame, Check, Plus, Info, Salad, Moon, Coffee, Apple, Search, Filter } from 'lucide-react';
import { Page } from '../types';

interface MealHistoryProps {
  onNavigate: (page: Page) => void;
}

export const MealHistory = ({ onNavigate }: MealHistoryProps) => {
  const history = [
    { date: 'Aujourd\'hui', meals: [
      { time: '12:45', title: 'Déjeuner', desc: 'Bowl Poulet & Quinoa', kcal: 720, icon: Salad, color: 'bg-[#EAF3EF]', accent: 'text-[#1D6B4F]' },
      { time: '08:30', title: 'Petit-déjeuner', desc: 'Omelette & Avocat', kcal: 420, icon: Coffee, color: 'bg-[#F1E3D0]', accent: 'text-slate-800' },
    ]},
    { date: 'Hier', meals: [
      { time: '20:00', title: 'Dîner', desc: 'Saumon & Riz noir', kcal: 640, icon: Moon, color: 'bg-[#FBF4EA]', accent: 'text-slate-700' },
      { time: '16:00', title: 'Collation', desc: 'Yaourt grec & Amandes', kcal: 280, icon: Apple, color: 'bg-[#FFF0E8]', accent: 'text-[#DF842C]' },
      { time: '13:00', title: 'Déjeuner', desc: 'Salade César', kcal: 580, icon: Salad, color: 'bg-[#EAF3EF]', accent: 'text-[#1D6B4F]' },
    ]},
    { date: 'Lundi 9 Mars', meals: [
      { time: '20:30', title: 'Dîner', desc: 'Pâtes complètes & Pesto', kcal: 690, icon: Moon, color: 'bg-[#FBF4EA]', accent: 'text-slate-700' },
    ]}
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="w-full min-h-screen flex flex-col bg-[#FBF4EA] text-slate-900 relative grain noise overflow-x-hidden"
    >
      <header className="shrink-0 pt-14 px-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('profile')}
            className="h-11 w-11 rounded-2xl bg-white ring-1 ring-black/10 shadow-sm flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <h1 className="text-[28px] font-display font-bold tracking-tight">Historique</h1>
        </div>

        <div className="mt-6 flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Rechercher un repas..." 
              className="w-full h-14 rounded-2xl bg-white ring-1 ring-black/10 px-12 font-sans text-[15px] focus:outline-none focus:ring-2 focus:ring-[#1D6B4F]/20"
            />
          </div>
          <button className="h-14 w-14 rounded-2xl bg-white ring-1 ring-black/10 shadow-sm flex items-center justify-center">
            <Filter className="w-5 h-5 text-slate-700" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pb-[calc(96px+34px)] pt-8 relative">
        <div className="space-y-8">
          {history.map((day, dIdx) => (
            <section key={dIdx}>
              <h2 className="text-[14px] font-sans font-bold text-slate-500 uppercase tracking-widest mb-4 ml-2">{day.date}</h2>
              <div className="space-y-4">
                {day.meals.map((meal, mIdx) => (
                  <div key={mIdx} className="rounded-[28px] bg-white ring-1 ring-black/10 shadow-sm p-5 flex items-center gap-4">
                    <div className={`h-16 w-16 rounded-2xl ${meal.color} ring-1 ring-black/10 flex items-center justify-center shrink-0`}>
                      <meal.icon className={`w-6 h-6 ${meal.accent}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-sans text-slate-500 uppercase tracking-wider">{meal.time}</p>
                      <h3 className="text-[16px] font-display font-bold tracking-tight truncate">{meal.title}</h3>
                      <p className="text-[13px] font-sans text-slate-600 truncate">{meal.desc}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[14px] font-display font-bold">{meal.kcal} kcal</p>
                      <ChevronRight className="mt-1 w-5 h-5 text-slate-300 ml-auto" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </motion.div>
  );
};
