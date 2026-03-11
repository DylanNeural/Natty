import { motion } from 'motion/react';
import { Bell, Settings, Calendar, Flame, Plus, Sparkles, QrCode, Camera, Wheat, Drumstick, Droplet, Utensils, Refrigerator, Coffee, Salad, Moon, Check, Clock, MapPin, Package } from 'lucide-react';
import { Page, Meal, MacroData } from '../types';

interface DashboardProps {
  onNavigate: (page: Page) => void;
}

export const Dashboard = ({ onNavigate }: DashboardProps) => {
  const macros: MacroData[] = [
    { label: 'Glucides', value: 132, target: 250, unit: 'g', color: 'bg-[#DF842C]', bgColor: 'bg-[#FAEBDD]', icon: 'wheat' },
    { label: 'Protéines', value: 78, target: 140, unit: 'g', color: 'bg-[#134030]', bgColor: 'bg-[#EAF3EF]', icon: 'drumstick' },
    { label: 'Lipides', value: 42, target: 70, unit: 'g', color: 'bg-[#DF842C]', bgColor: 'bg-[#FFF0E8]', icon: 'droplet' },
  ];

  const meals: Meal[] = [
    { id: '1', type: 'Petit-déjeuner', emoji: '☀️', title: 'Omelette + fruit', calories: 480, recommendedRange: '450–600 kcal', status: 'added' },
    { id: '2', type: 'Déjeuner', emoji: '🥗', title: 'Bowl poulet / quinoa / légumes', calories: 720, recommendedRange: '650–850 kcal', status: 'planned' },
    { id: '3', type: 'Dîner', emoji: '🌙', title: 'Curry veggie + riz basmati', calories: 600, recommendedRange: '550–750 kcal', status: 'suggestion', location: 'à 600m' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-screen flex flex-col bg-[#FAEBDD] text-[#201D16] relative grain noise overflow-x-hidden"
    >
      <header className="shrink-0 pt-14 px-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-2xl bg-[#134030] ring-1 ring-black/10 flex items-center justify-center overflow-hidden">
              <img
                src="https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/b1cbfc0e-79d5-45d7-9749-3bc14aed3a08/1771508071656-899a2241/LOGO_BEIGE.png"
                alt="Natty"
                className="h-6 w-auto"
              />
            </div>
            <div className="leading-tight">
              <p className="text-[12px] text-black/60 font-sans">Aujourd’hui — on se régale ? 🍽️</p>
              <h1 className="text-4xl font-display font-black tracking-tight leading-[1.1]">Tableau de bord</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="h-11 w-11 rounded-2xl bg-white ring-1 ring-black/10 shadow-sm flex items-center justify-center">
              <Bell className="w-5 h-5 text-[#201D16]" />
            </button>
            <button onClick={() => onNavigate('settings')} className="h-11 w-11 rounded-2xl bg-white ring-1 ring-black/10 shadow-sm flex items-center justify-center">
              <Settings className="w-5 h-5 text-[#201D16]" />
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-2xl bg-white ring-1 ring-black/10 px-3 py-2">
              <Calendar className="w-4 h-4 text-[#134030]" />
              <span className="text-[13px] font-sans text-[#201D16]">Lun 19 fév</span>
            </span>
            <span className="inline-flex items-center gap-2 rounded-2xl bg-white ring-1 ring-black/10 px-3 py-2">
              <Flame className="w-4 h-4 text-[#FF8C00]" />
              <span className="text-[13px] font-sans text-[#201D16]">Objectif 2 050 kcal 🔥</span>
            </span>
          </div>
          <button className="h-14 w-14 rounded-2xl bg-[#FF8C00] text-white ring-1 ring-black/10 shadow-lg flex items-center justify-center transition-transform hover:scale-105">
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="flex-1 px-6 pb-[calc(96px+34px)] pt-8 relative max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Stats & Actions */}
          <div className="lg:col-span-7 space-y-8">
            {/* Kcal hero card */}
            <section className="rounded-[28px] bg-white ring-1 ring-black/10 shadow-lg overflow-hidden reveal">
          <div className="p-6 relative overflow-hidden">
            <svg aria-hidden="true" viewBox="0 0 240 160" className="absolute -right-10 -top-10 h-44 w-56 opacity-80 pointer-events-none">
              <path d="M36 74c28-36 77-50 116-31 43 21 68 78 40 112-22 27-63 9-92-1-37-12-86-6-88-44-1-13 10-23 24-36Z" fill="#C3D36D" fillOpacity="0.55"/>
              <path d="M86 32c26-9 62 1 78 26 14 21 9 44-8 56-21 15-50 5-74-3-26-8-46-20-42-39 4-18 22-34 46-40Z" fill="#DF842C" fillOpacity="0.18"/>
              <path d="M44 126c22-8 48-6 74 2" stroke="#134030" strokeOpacity="0.35" strokeWidth="6" strokeLinecap="round"/>
              <path d="M58 104c18-10 42-12 64-4" stroke="#134030" strokeOpacity="0.22" strokeWidth="6" strokeLinecap="round"/>
            </svg>

            <div className="flex items-start justify-between relative">
              <div>
                <p className="text-[12px] text-black/60 font-sans">Bilan du jour ✨</p>
                <h2 className="text-3xl font-display font-bold tracking-tight leading-[1.1]">Calories restantes (tu gères)</h2>
              </div>
              <span className="inline-flex items-center gap-1 rounded-2xl bg-[#FAEBDD] text-[#201D16] ring-1 ring-black/10 px-3 py-2">
                <Sparkles className="w-4 h-4 text-[#134030]" />
                <span className="text-[12px] font-sans">Mode simple</span>
              </span>
            </div>

            <div className="mt-8 grid grid-cols-3 items-center gap-4 relative">
              <div className="rounded-2xl bg-[#FAEBDD] ring-1 ring-black/10 p-3">
                <p className="text-[11px] font-sans text-black/60">Dans l’assiette</p>
                <p className="mt-1 text-[16px] font-display font-bold">1 240</p>
                <p className="text-[11px] font-sans text-black/50">kcal</p>
              </div>

              <div className="flex items-center justify-center">
                <div className="relative h-[120px] w-[120px]">
                  <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                    <circle cx="60" cy="60" r="48" fill="none" stroke="#F1E3D0" strokeWidth="12" />
                    <circle cx="60" cy="60" r="48" fill="none" stroke="#134030" strokeWidth="12" strokeLinecap="round"
                      strokeDasharray="302" strokeDashoffset="120" />
                    <circle cx="60" cy="60" r="48" fill="none" stroke="#DF842C" strokeWidth="6" strokeLinecap="round"
                      strokeDasharray="302" strokeDashoffset="215" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <p className="text-[24px] font-display font-bold leading-none">810</p>
                    <p className="mt-1 text-[10px] font-sans text-black/60">kcal restantes 🚀</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-[#134030] ring-1 ring-black/10 p-3 text-[#FAEBDD]">
                <p className="text-[11px] font-sans text-[#FAEBDD]/80">Bouge-bouge</p>
                <p className="mt-1 text-[16px] font-display font-bold">190</p>
                <p className="text-[11px] font-sans text-[#FAEBDD]/70">kcal</p>
              </div>
            </div>

            <div className="mt-10 flex items-center justify-between gap-4 relative">
              <button 
                onClick={() => onNavigate('scanner')}
                className="h-14 flex-1 rounded-2xl bg-[#134030] text-[#FAEBDD] ring-1 ring-black/10 shadow-lg font-bold text-[15px] inline-flex items-center justify-center gap-2 transition-transform hover:scale-105"
              >
                <QrCode className="w-5 h-5" />
                Scanner 🥕
              </button>
              <button className="h-14 w-14 rounded-2xl bg-white ring-1 ring-black/10 shadow-lg flex items-center justify-center transition-transform hover:scale-105">
                <Camera className="w-5 h-5 text-[#201D16]" />
              </button>
            </div>
          </div>

          <div className="px-6 pb-6">
            <div className="rounded-[24px] bg-[#FAEBDD] ring-1 ring-black/10 p-6 relative overflow-hidden">
              <div className="flex items-center justify-between relative">
                <div>
                  <h3 className="text-[14px] font-display font-bold tracking-tight">Macros</h3>
                  <p className="text-[12px] font-sans text-black/60">Tes macros t’applaudissent 🎉</p>
                </div>
                <span className="text-[12px] font-sans text-black/60">objectif journalier</span>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4 relative">
                {macros.map((macro, idx) => (
                  <div key={idx} className="rounded-2xl bg-white ring-1 ring-black/10 p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-sans text-[#201D16]">{macro.label}</p>
                      <span className={`inline-flex h-6 w-6 items-center justify-center rounded-xl ${macro.bgColor}`}>
                        {macro.icon === 'wheat' && <Wheat className="w-3.5 h-3.5 text-[#201D16]" />}
                        {macro.icon === 'drumstick' && <Drumstick className="w-3.5 h-3.5 text-[#134030]" />}
                        {macro.icon === 'droplet' && <Droplet className="w-3.5 h-3.5 text-[#DF842C]" />}
                      </span>
                    </div>
                    <p className="mt-2 text-[14px] font-display font-bold">{macro.value}<span className="text-[10px] font-normal text-black/50">/{macro.target}{macro.unit}</span></p>
                    <div className={`mt-2 h-1.5 rounded-full ${macro.bgColor} overflow-hidden`}>
                      <div className={`h-full rounded-full ${macro.color}`} style={{ width: `${(macro.value / macro.target) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

            {/* Hydration */}
            <section className="reveal">
              <div className="rounded-[28px] bg-white ring-1 ring-black/10 shadow-lg p-6 relative overflow-hidden">
            <div className="flex items-start justify-between gap-3 relative">
              <div>
                <p className="text-[12px] text-black/60 font-sans">Aqua check ✨</p>
                <h3 className="text-[18px] font-display font-bold tracking-tight">1,3 L / 2,2 L</h3>
                <p className="mt-1 text-[12px] font-sans text-black/60">Encore 900 ml et tes cellules font la ola.</p>
              </div>
              <button className="h-14 w-14 rounded-2xl bg-[#C3D36D] ring-1 ring-black/10 shadow-lg flex items-center justify-center transition-transform hover:scale-105">
                <Plus className="w-5 h-5 text-[#134030]" />
              </button>
            </div>
            <div className="mt-4 relative">
              <div className="mt-2 h-3 rounded-full bg-[#EAF3EF] ring-1 ring-black/10 overflow-hidden">
                <div className="h-full w-[59%] rounded-full bg-[#134030]"></div>
              </div>
              <div className="mt-4 grid grid-cols-6 gap-2">
                {[1, 2, 3, 4].map(i => <div key={i} className="h-10 rounded-2xl bg-[#134030] ring-1 ring-black/10"></div>)}
                {[5, 6].map(i => <div key={i} className="h-10 rounded-2xl bg-[#F1E3D0] ring-1 ring-black/10"></div>)}
              </div>
            </div>
          </div>
        </section>

            {/* Quick Actions */}
            <section className="grid grid-cols-2 gap-6">
          <button 
            onClick={() => onNavigate('scanner')}
            className="h-[160px] rounded-[28px] bg-[#134030] text-[#FAEBDD] ring-1 ring-black/10 shadow-lg p-6 flex flex-col justify-between relative overflow-hidden text-left transition-transform hover:scale-105 reveal"
          >
            <div className="flex items-center justify-between relative">
              <span className="text-[12px] font-sans text-[#FAEBDD]/80">Scanner assiette 📸</span>
              <span className="h-11 w-11 rounded-2xl bg-[#FAEBDD] text-slate-900 ring-1 ring-black/10 flex items-center justify-center">
                <Utensils className="w-5 h-5" />
              </span>
            </div>
            <p className="text-[14px] font-display font-bold tracking-tight relative">Estime les macros en photo</p>
          </button>

          <button 
            onClick={() => onNavigate('fridge')}
            className="h-[160px] rounded-[28px] bg-[#FFF0E8] text-[#201D16] ring-1 ring-black/10 shadow-lg p-6 flex flex-col justify-between relative overflow-hidden text-left transition-transform hover:scale-105 reveal"
          >
            <div className="flex items-center justify-between relative">
              <span className="text-[12px] font-sans text-black/70">Frigo connecté ❤️</span>
              <span className="h-11 w-11 rounded-2xl bg-white text-[#201D16] ring-1 ring-black/10 flex items-center justify-center">
                <Refrigerator className="w-5 h-5 text-[#FF8C00]" />
              </span>
            </div>
            <p className="text-[14px] font-display font-bold tracking-tight relative">Click & collect, easy.</p>
          </button>
        </section>

          </div>

          {/* Right Column: Meals & Fridge */}
          <div className="lg:col-span-5 space-y-8">
            {/* Meals */}
            <section className="reveal">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="text-[12px] font-sans text-black/60">Ton menu du jour 🍽️</p>
                  <h3 className="text-3xl font-display font-bold tracking-tight leading-[1.1]">Aujourd’hui</h3>
                </div>
                <button onClick={() => onNavigate('meal-history')} className="h-14 inline-flex items-center justify-center rounded-2xl bg-white ring-1 ring-black/10 shadow-lg px-5 text-[14px] font-bold text-[#201D16] transition-transform hover:scale-105">
                  Voir tout
                </button>
              </div>

              <div className="space-y-6">
                {meals.map((meal) => (
                  <div key={meal.id} className="rounded-[28px] bg-white ring-1 ring-black/10 shadow-lg p-6 relative overflow-hidden">
                    <div className="flex items-center justify-between gap-3 relative">
                      <div className="flex items-center gap-3">
                        <div className={`h-12 w-12 rounded-2xl ring-1 ring-black/10 flex items-center justify-center ${meal.type === 'Petit-déjeuner' ? 'bg-[#EAF3EF]' : meal.type === 'Déjeuner' ? 'bg-[#FFF0E8]' : 'bg-[#FAEBDD]'}`}>
                          {meal.type === 'Petit-déjeuner' && <Coffee className="w-5 h-5 text-[#134030]" />}
                          {meal.type === 'Déjeuner' && <Salad className="w-5 h-5 text-[#DF842C]" />}
                          {meal.type === 'Dîner' && <Moon className="w-5 h-5 text-[#201D16]" />}
                        </div>
                        <div>
                          <p className="text-[14px] font-display font-bold">{meal.type} {meal.emoji}</p>
                          <p className="text-[12px] font-sans text-black/60">Recommandé : {meal.recommendedRange}</p>
                        </div>
                      </div>
                      <button className="h-11 w-11 rounded-2xl bg-[#FAEBDD] ring-1 ring-black/10 flex items-center justify-center">
                        <Plus className="w-5 h-5 text-[#201D16]" />
                      </button>
                    </div>
                    <div className="mt-5 flex items-center justify-between relative">
                      <div className="flex items-center gap-2">
                        {meal.status === 'added' && (
                          <span className="inline-flex items-center gap-1 rounded-xl bg-[#EAF3EF] px-2 py-1 text-[#134030] ring-1 ring-black/10 text-[11px] font-bold">
                            <Check className="w-3 h-3" />
                            Ajouté
                          </span>
                        )}
                        {meal.status === 'planned' && (
                          <span className="inline-flex items-center gap-1 rounded-xl bg-[#FAEBDD] px-2 py-1 text-[#201D16] ring-1 ring-black/10 text-[11px] font-bold">
                            <Clock className="w-3 h-3" />
                            Planifié
                          </span>
                        )}
                        {meal.status === 'suggestion' && (
                          <span className="inline-flex items-center gap-1 rounded-xl bg-[#FFF0E8] px-2 py-1 text-[#201D16] ring-1 ring-black/10 text-[11px] font-bold">
                            <Refrigerator className="w-3 h-3 text-[#DF842C]" />
                            Suggestion frigo
                          </span>
                        )}
                        <span className="text-[12px] font-sans text-black/60 truncate max-w-[150px]">{meal.title}</span>
                      </div>
                      <span className="text-[12px] font-sans text-black/60">{meal.calories} kcal</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Connected fridge teaser */}
            <section className="reveal">
              <div className="rounded-[28px] bg-[#134030] text-[#FAEBDD] ring-1 ring-black/10 shadow-lg overflow-hidden relative">
                <div className="p-6 relative">
                  <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#DF842C] opacity-25 blur-2xl"></div>
                  <div className="absolute -left-12 -bottom-12 h-44 w-44 rounded-full bg-[#C3D36D] opacity-20 blur-2xl"></div>

                  <div className="relative">
                    <p className="text-[12px] font-sans text-[#FAEBDD]/80">Click & collect</p>
                    <h3 className="text-[18px] font-display tracking-tight">Frigo à côté = repas à portée ❤️</h3>
                    <p className="mt-1 text-[12px] font-sans text-[#FAEBDD]/80 leading-relaxed">Repas prêts en 2 minutes — tu passes, tu prends, tu kiffes.</p>

                    <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-2 rounded-2xl bg-[#201D16] ring-1 ring-black/10 px-3 py-2">
                          <MapPin className="w-4 h-4 text-[#FF8C00]" />
                          <span className="text-[13px] font-sans">Bourse • 600m</span>
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-2xl bg-[#201D16] ring-1 ring-black/10 px-3 py-2">
                          <Package className="w-4 h-4 text-[#FAEBDD]" />
                          <span className="text-[13px] font-sans">12 plats</span>
                        </span>
                      </div>
                      <button 
                        onClick={() => onNavigate('fridge')}
                        className="min-h-14 w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-[#FF8C00] text-white ring-1 ring-black/10 px-5 font-sans font-semibold text-[15px] shadow-lg transition-transform hover:scale-105"
                      >
                        Ouvrir
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </motion.div>
  );
};
