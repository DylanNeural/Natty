import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Clock, ChevronRight, Zap, Sparkles, Drumstick, Wheat, Droplet, Flame, Check, Plus, Info, Salad, Moon, Coffee, Apple } from 'lucide-react';
import { Page } from '../types';

interface PlanProps {
  onNavigate: (page: Page) => void;
}

export const Plan = ({ onNavigate }: PlanProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-screen flex flex-col bg-[#FBF4EA] text-slate-900 relative grain noise overflow-x-hidden"
    >
      <header className="shrink-0 pt-14 px-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="h-11 w-11 rounded-2xl bg-white ring-1 ring-black/10 shadow-sm flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>

          <div className="flex items-center gap-3">
            <button className="h-14 w-14 rounded-2xl bg-white ring-1 ring-black/10 shadow-sm flex items-center justify-center transition-transform hover:scale-105">
              <Zap className="w-5 h-5 text-slate-700" />
            </button>
            <button className="h-14 w-14 rounded-2xl bg-white ring-1 ring-black/10 shadow-sm flex items-center justify-center transition-transform hover:scale-105">
              <Calendar className="w-5 h-5 text-slate-700" />
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[#1D6B4F] ring-1 ring-black/10 flex items-center justify-center overflow-hidden">
              <img src="https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/b1cbfc0e-79d5-45d7-9749-3bc14aed3a08/1771507502618-bf5a3efd/LOGO-BEIGE.png" alt="Natty" className="h-6 w-auto" />
            </div>
            <div className="leading-tight">
              <p className="text-[12px] text-slate-600 font-sans leading-relaxed">Ton Programme</p>
              <h1 className="text-[32px] leading-[1.3] font-display font-bold tracking-tight">Planning Hebdo</h1>
            </div>
          </div>

          <span className="inline-flex items-center gap-2 rounded-2xl bg-white ring-1 ring-black/10 px-3 py-2">
            <Sparkles className="w-4 h-4 text-[#DF842C]" />
            <span className="text-[13px] font-sans text-slate-700">Semaine 2 ✨</span>
          </span>
        </div>

        <div className="mt-6 flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, idx) => (
            <button 
              key={idx}
              className={`h-16 min-w-[64px] rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${idx === 2 ? 'bg-[#201D16] text-[#FAEBDD] ring-1 ring-[#FAEBDD]/15 shadow-lg scale-105' : 'bg-white text-slate-700 ring-1 ring-black/10'}`}
            >
              <span className="text-[11px] font-sans opacity-60 uppercase tracking-wider">{day}</span>
              <span className="text-[18px] font-display font-bold">{10 + idx}</span>
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pb-[calc(96px+34px)] pt-4 relative max-w-7xl mx-auto w-full">
        <section className="rounded-[32px] bg-white ring-1 ring-black/10 shadow-lg p-6 reveal">
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] font-display font-bold tracking-tight">Objectif du jour 🎯</h2>
            <span className="inline-flex items-center gap-2 rounded-2xl bg-[#EAF3EF] ring-1 ring-black/10 px-3 py-2 text-[#1D6B4F]">
              <Check className="w-4 h-4" />
              <span className="text-[13px] font-sans">En cours</span>
            </span>
          </div>
          
          <div className="mt-5 grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-[#FBF4EA] ring-1 ring-black/10 p-4">
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-sans text-slate-700">Calories</p>
                <Flame className="w-4 h-4 text-[#DF842C]" />
              </div>
              <p className="mt-2 text-[22px] font-display font-bold tracking-tight">1 840<span className="text-[12px] font-sans font-normal text-slate-500"> / 2 400</span></p>
              <div className="mt-3 h-2 rounded-full bg-white ring-1 ring-black/5 overflow-hidden">
                <div className="h-full w-[76%] rounded-full bg-[#1D6B4F]"></div>
              </div>
            </div>
            <div className="rounded-2xl bg-[#EAF3EF] ring-1 ring-black/10 p-4">
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-sans text-slate-700">Protéines</p>
                <Drumstick className="w-4 h-4 text-[#1D6B4F]" />
              </div>
              <p className="mt-2 text-[22px] font-display font-bold tracking-tight">124<span className="text-[12px] font-sans font-normal text-slate-500"> / 160g</span></p>
              <div className="mt-3 h-2 rounded-full bg-white ring-1 ring-black/5 overflow-hidden">
                <div className="h-full w-[78%] rounded-full bg-[#1D6B4F]"></div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 space-y-4">
          {[
            { time: '08:30', title: 'Petit-déjeuner', desc: 'Omelette & Avocat', kcal: 420, icon: Coffee, color: 'bg-[#F1E3D0]', accent: 'text-slate-800', done: true },
            { time: '12:45', title: 'Déjeuner', desc: 'Bowl Poulet & Quinoa', kcal: 720, icon: Salad, color: 'bg-[#EAF3EF]', accent: 'text-[#1D6B4F]', done: true },
            { time: '16:00', title: 'Collation', desc: 'Yaourt grec & Amandes', kcal: 280, icon: Apple, color: 'bg-[#FFF0E8]', accent: 'text-[#DF842C]', done: false },
            { time: '20:00', title: 'Dîner', desc: 'Saumon & Riz noir', kcal: 640, icon: Moon, color: 'bg-[#FBF4EA]', accent: 'text-slate-700', done: false },
          ].map((meal, idx) => (
            <div key={idx} className="rounded-[28px] bg-white ring-1 ring-black/10 shadow-sm p-5 flex items-center gap-4 reveal">
              <div className={`h-16 w-16 rounded-2xl ${meal.color} ring-1 ring-black/10 flex items-center justify-center shrink-0`}>
                <meal.icon className={`w-6 h-6 ${meal.accent}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-sans text-slate-500 uppercase tracking-wider">{meal.time}</p>
                  {meal.done && (
                    <span className="inline-flex items-center gap-1 rounded-xl bg-[#EAF3EF] px-2 py-0.5 text-[#1D6B4F] text-[11px] font-sans">
                      <Check className="w-3 h-3" />
                      Fait
                    </span>
                  )}
                </div>
                <h3 className="text-[16px] font-display font-bold tracking-tight truncate">{meal.title}</h3>
                <p className="text-[13px] font-sans text-slate-600 truncate">{meal.desc}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[14px] font-display font-bold">{meal.kcal} kcal</p>
                <button className="mt-1 h-8 w-8 rounded-xl bg-[#FBF4EA] ring-1 ring-black/10 flex items-center justify-center transition-transform hover:scale-110">
                  <Plus className="w-4 h-4 text-slate-700" />
                </button>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-[32px] bg-[#201D16] text-[#FAEBDD] ring-1 ring-[#FAEBDD]/15 shadow-2xl overflow-hidden reveal">
          <div className="p-8 relative">
            <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-[#DF842C]/35 blur-3xl"></div>
            <div className="absolute -left-14 -bottom-14 h-52 w-52 rounded-full bg-[#C3D36D]/18 blur-3xl"></div>
            
            <div className="relative">
              <div className="flex items-center gap-3">
                <span className="h-11 w-11 rounded-2xl bg-white/10 ring-1 ring-white/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#C3D36D]" />
                </span>
                <h3 className="text-[20px] font-display font-bold tracking-tight">Génère ton menu IA ✨</h3>
              </div>
              <p className="mt-3 text-[14px] font-sans text-[#FAEBDD]/80 leading-relaxed">
                Pas d'inspiration ? Laisse Natty créer ton planning idéal basé sur tes goûts et tes objectifs.
              </p>
              
              <button className="mt-6 h-14 w-full rounded-2xl bg-[#DF842C] text-white ring-1 ring-black/10 shadow-lg font-sans text-[15px] inline-flex items-center justify-center gap-2 transition-transform hover:scale-105">
                <Zap className="w-4 h-4" />
                Générer mon menu
              </button>
            </div>
          </div>
        </section>
      </main>
    </motion.div>
  );
};
