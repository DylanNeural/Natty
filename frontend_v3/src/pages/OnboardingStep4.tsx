import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Check, ArrowRight, Sparkles } from 'lucide-react';
import { Page } from '../types';

interface OnboardingStep4Props {
  onNavigate: (page: Page) => void;
}

export const OnboardingStep4 = ({ onNavigate }: OnboardingStep4Props) => {
  const [selected, setSelected] = useState<string[]>(['veggie']);

  const toggleOption = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const options = [
    { id: 'veggie', label: 'Végétarien', description: 'Options veggie-friendly, sans prise de tête.', emoji: '🌱', color: 'peer-checked:bg-[#134030] peer-checked:shadow-[0_0_0_4px_rgba(195,211,109,0.35),0_18px_60px_-40px_rgba(0,0,0,0.5)]' },
    { id: 'gluten', label: 'Sans gluten', description: 'Filtre les recettes et les produits compatibles.', emoji: '🌾', color: 'peer-checked:bg-[#DF842C]' },
    { id: 'lactose', label: 'Sans lactose', description: 'On évite les surprises, tout reste délicieux.', emoji: '🥛', color: 'peer-checked:bg-[#134030] peer-checked:shadow-[0_0_0_4px_rgba(195,211,109,0.35),0_18px_60px_-40px_rgba(0,0,0,0.5)]' },
    { id: 'carnivore', label: 'Carnivore', description: 'Priorité aux options riches en protéines.', emoji: '🍗', color: 'peer-checked:bg-[#DF842C]' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full h-screen flex flex-col bg-[#FAEBDD] text-[#201D16] relative overflow-hidden font-sans"
    >
      <header className="shrink-0 pt-14 px-6 relative">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('onboarding-step3')}
            className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-[#FAEBDD] ring-1 ring-black/10 shadow-sm hover:shadow-none transition"
          >
            <ChevronLeft className="w-6 h-6 text-[#201D16]" />
          </button>

          <div className="flex items-center gap-2">
            <img src="https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/b1cbfc0e-79d5-45d7-9749-3bc14aed3a08/1771508071656-899a2241/LOGO_BEIGE.png" alt="Natty" className="h-7 w-auto" />
          </div>

          <button
            onClick={() => onNavigate('onboarding-step5')}
            className="inline-flex items-center justify-center h-14 px-5 rounded-2xl bg-[#FAEBDD] ring-1 ring-black/10 shadow-sm hover:shadow-none transition text-[14px] font-medium"
          >
            Passer
          </button>
        </div>

        <div className="mt-7">
          <div className="flex items-end justify-between">
            <p className="text-[12px] tracking-wide text-[#201D16]/70">Étape <span className="font-semibold text-[#201D16]">4</span> sur <span className="font-semibold text-[#201D16]">5</span></p>
            <p className="text-[12px] text-[#201D16]/70">Préférences</p>
          </div>
          <div className="mt-2 h-3 w-full rounded-full bg-[#201D16]/10 ring-1 ring-black/10 overflow-hidden">
            <div className="h-full w-4/5 rounded-full bg-[#134030]"></div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pt-8 pb-[34px] relative">
        <section className="relative">
          <div className="inline-flex items-center gap-3 rounded-2xl bg-[#FAEBDD] ring-1 ring-black/10 shadow-sm px-5 py-3">
            <span className="text-[18px]">🎯</span>
            <p className="text-[12px] font-medium text-[#201D16]/80">Presque là — on personnalise tes suggestions.</p>
          </div>

          <h1 className="mt-6 font-brand text-[32px] leading-[1.05] tracking-tight text-[#134030]">
            Tu manges comment, en général ?
          </h1>
          <p className="mt-4 text-[14px] leading-6 text-[#201D16]/75 max-w-[34ch]">
            Sélectionne <span className="font-medium text-[#201D16]">autant d’options que tu veux</span>. Tu pourras modifier plus tard.
          </p>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-5">
          {options.map((option) => (
            <label key={option.id} className="group block">
              <input 
                type="checkbox" 
                className="peer sr-only" 
                checked={selected.includes(option.id)}
                onChange={() => toggleOption(option.id)}
              />
              <div className={`relative rounded-[28px] p-5 ring-1 ring-black/10 shadow-sm bg-[#FAEBDD] transition-all duration-300 ${option.color} peer-checked:text-[#FAEBDD]`}>
                <div className="flex items-start gap-3">
                  <div className={`shrink-0 h-14 w-14 rounded-2xl flex items-center justify-center ring-1 ring-black/10 ${selected.includes(option.id) ? 'bg-[#C3D36D]' : 'bg-[#C3D36D]/55'}`}>
                    <span className="text-[24px]">{option.emoji}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-display font-semibold tracking-tight text-[16px] peer-checked:text-[#FAEBDD]">
                        {option.label}
                      </p>
                      <span className={`inline-flex items-center justify-center h-9 w-9 rounded-2xl ring-1 ring-black/10 bg-[#FAEBDD] transition ${selected.includes(option.id) ? 'bg-[#FF8C00]' : ''}`}>
                        <Check className={`text-[24px] text-[#201D16] transition ${selected.includes(option.id) ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`} />
                      </span>
                    </div>
                    <p className={`mt-1 text-[13px] leading-5 ${selected.includes(option.id) ? 'text-[#FAEBDD]/80' : 'text-[#201D16]/70'}`}>
                      {option.description}
                    </p>
                  </div>
                </div>
              </div>
            </label>
          ))}
        </section>

        <section className="mt-6">
          <div className="rounded-[28px] bg-[#FAEBDD] ring-1 ring-black/10 shadow-sm p-5">
            <div className="flex items-start gap-3">
              <span className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-[#134030] text-[#FAEBDD] ring-1 ring-black/10">
                <Sparkles className="w-6 h-6" />
              </span>
              <div className="min-w-0">
                <p className="font-display font-semibold tracking-tight text-[28px] leading-[1.05] text-[#201D16]">Astuce Natty</p>
                <p className="mt-1 text-[13px] leading-5 text-[#201D16]/70">
                  Même si tu ne choisis rien, on te propose un plan par défaut. C’est juste pour affiner.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6">
          <button
            onClick={() => onNavigate('onboarding-step5')}
            className="h-14 w-full rounded-[28px] bg-[#FF8C00] text-[#201D16] ring-1 ring-black/10 shadow-sm hover:shadow-none transition flex items-center justify-center gap-3 font-display font-semibold tracking-tight text-[16px]"
          >
            Continuer vers tes macros ✨
            <ArrowRight className="w-6 h-6" />
          </button>
          <p className="mt-4 text-center text-[12px] text-[#201D16]/60">
            Tu peux modifier ces préférences dans Profil → Nutrition.
          </p>
        </section>
      </main>
    </motion.div>
  );
};
