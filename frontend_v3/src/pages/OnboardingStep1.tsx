import { motion } from 'motion/react';
import { X, Check, ArrowRight, Sparkles } from 'lucide-react';
import { Page } from '../types';

interface OnboardingStep1Props {
  onNavigate: (page: Page) => void;
}

export const OnboardingStep1 = ({ onNavigate }: OnboardingStep1Props) => {
  const goals = [
    { id: 'muscle', label: 'Prise de Muscle', description: 'Ajouter du volume, de la force', emoji: '💪', color: 'peer-checked:bg-[#134030] peer-checked:shadow-[0_22px_46px_-26px_rgba(19,64,48,0.65)]', iconBg: 'bg-[#C3D36D]/55' },
    { id: 'cut', label: 'Sèche', description: 'Perdre du gras, garder le muscle', emoji: '🔥', color: 'peer-checked:bg-[#DF842C] peer-checked:shadow-[0_22px_46px_-26px_rgba(223,132,44,0.70)]', iconBg: 'bg-[#DF842C]/20' },
    { id: 'maintenance', label: 'Maintenance', description: 'Rester en forme, équilibré', emoji: '⚖️', color: 'peer-checked:bg-[#201D16] peer-checked:shadow-[0_22px_46px_-26px_rgba(32,29,22,0.70)]', iconBg: 'bg-[#134030]/12' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full h-screen flex flex-col bg-[#FAEBDD] text-[#201D16] relative overflow-hidden grain"
    >
      <header className="shrink-0 pt-14 px-5 relative">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white ring-1 ring-black/10 flex items-center justify-center overflow-hidden">
              <img className="w-8 h-8 object-contain" src="https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/b1cbfc0e-79d5-45d7-9749-3bc14aed3a08/1771508071656-899a2241/LOGO_BEIGE.png" alt="Natty" />
            </div>
            <div className="leading-tight">
              <p className="font-sans text-[12px] tracking-tight text-[#201D16]/70">Créons ton plan nutritionnel 🎯</p>
              <p className="font-display text-[16px] tracking-tight">Quiz Natty</p>
            </div>
          </div>

          <button onClick={() => onNavigate('onboarding-welcome')} className="min-w-11 min-h-11 w-11 h-11 rounded-2xl bg-white ring-1 ring-black/10 flex items-center justify-center hover:bg-[#FAEBDD] transition-colors">
            <X className="w-5 h-5 text-[#201D16]" />
          </button>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <p className="font-sans text-[12px] text-[#201D16]/70">Étape <span className="text-[#201D16] font-medium">1</span>/5</p>
            <p className="font-sans text-[12px] text-[#201D16]/70">Objectif</p>
          </div>
          <div className="mt-2 h-2.5 w-full rounded-full bg-white ring-1 ring-black/10 overflow-hidden">
            <div className="h-full w-1/5 bg-[#134030] rounded-full"></div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-5 pt-8 pb-[calc(34px+96px)] relative">
        <section>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#134030] flex items-center justify-center shrink-0">
              <span className="font-brand text-[14px] tracking-tight text-[#FAEBDD]">N</span>
            </div>
            <div className="flex-1">
              <div className="inline-block max-w-[320px] rounded-[22px] bg-white ring-1 ring-black/10 px-5 py-4">
                <h1 className="font-display text-[32px] tracking-tight leading-[1.12]">Quel est ton objectif principal ?</h1>
                <p className="mt-2 font-sans text-[14px] text-[#201D16]/70">Aide-nous à calibrer tes macros pour que ce soit simple… et précis.</p>
              </div>
              <p className="mt-3 font-sans text-[12px] text-[#201D16]/55">Choisis une option (tu pourras ajuster après).</p>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="space-y-5">
            {goals.map((goal, idx) => (
              <label key={goal.id} className="block">
                <input 
                  type="radio" 
                  name="goal" 
                  value={goal.id} 
                  className="sr-only peer" 
                  onChange={() => setTimeout(() => onNavigate('onboarding-step2'), 300)} 
                />
                <div className={`relative group w-full min-h-[92px] rounded-[24px] bg-white ring-1 ring-black/10 p-5 flex items-center justify-between gap-5 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-18px_rgba(32,29,22,0.35)] hover:scale-[1.01] peer-checked:ring-black/0 ${goal.color}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-14 h-14 rounded-[20px] ${goal.iconBg} flex items-center justify-center ring-1 ring-black/10 transition-colors peer-checked:bg-white/15 peer-checked:ring-white/10`}>
                      <span className="text-[20px]">{goal.emoji}</span>
                    </div>
                    <div>
                      <p className="font-sans text-[16px] font-medium tracking-tight text-[#201D16] peer-checked:text-[#FAEBDD]">{goal.label}</p>
                      <p className="font-sans text-[13px] text-[#201D16]/65 peer-checked:text-[#FAEBDD]/75">{goal.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="hidden peer-checked:flex items-center justify-center w-11 h-11 rounded-2xl bg-[#FAEBDD] text-[#134030]">
                      <Check className="w-5 h-5" />
                    </div>
                    <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-[#FAEBDD] ring-1 ring-black/10 text-[#201D16]/80 group-hover:bg-white transition-colors peer-checked:hidden">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </div>

          <div className="mt-8">
            <div className="rounded-[22px] bg-white ring-1 ring-black/10 p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#C3D36D]/55 ring-1 ring-black/10 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-[#134030]" />
                </div>
                <div>
                  <p className="font-sans text-[14px] font-medium tracking-tight">Pro tip</p>
                  <p className="mt-0.5 font-sans text-[13px] text-[#201D16]/70">Une fois choisi, on enchaîne direct sur ton profil (2/5). Pas besoin de bouton “Suivant”.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8 text-center">
          <p className="font-sans text-[12px] text-[#201D16]/55">Natty calcule tes macros — toi tu gardes le contrôle.</p>
        </div>
      </main>
    </motion.div>
  );
};
