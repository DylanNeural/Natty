import { motion } from 'motion/react';
import { FastForward, LogIn, ArrowRight, Leaf, PartyPopper, Sparkles, Lock, Zap, Target, Scan } from 'lucide-react';
import { Page } from '../types';

interface OnboardingWelcomeProps {
  onNavigate: (page: Page) => void;
}

export const OnboardingWelcome = ({ onNavigate }: OnboardingWelcomeProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-screen flex flex-col bg-[#FAEBDD] text-[#201D16] relative overflow-hidden"
    >
      <header className="shrink-0 pt-14 px-5">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-[#134030] ring-1 ring-black/10 shadow-[0_18px_60px_-40px_rgba(0,0,0,0.5)] flex items-center justify-center">
              <img
                src="https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/b1cbfc0e-79d5-45d7-9749-3bc14aed3a08/1771508071656-899a2241/LOGO_BEIGE.png"
                alt="Natty"
                className="h-7 w-auto"
              />
            </div>
            <div className="leading-tight">
              <p className="text-[12px] font-medium text-[#201D16]/70 font-sans">Onboarding</p>
              <p className="text-[14px] font-semibold tracking-tight font-sans">Natty</p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('onboarding-step1')}
            className="h-14 inline-flex items-center justify-center gap-2 rounded-2xl px-5 text-[14px] font-semibold text-[#134030] ring-1 ring-black/10 bg-[#FAEBDD] transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_10px_30px_rgba(32,29,22,0.12)] focus:outline-none focus:ring-4 focus:ring-[#134030]/25 active:scale-[0.98] font-sans"
          >
            <FastForward className="w-4 h-4" />
            <span>Commençons</span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-5 pt-8">
        <section>
          <h1 className="text-[32px] leading-[1.05] tracking-tight text-[#201D16] font-brand">
            Prêt à transformer<br />ta nutrition? 🌱
          </h1>
          <p className="mt-4 text-[15px] leading-6 text-[#201D16]/80 font-sans font-medium">
            Réponds à quelques questions rapides — on calcule tes macros et on te propose les repas qui collent à ton objectif.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 bg-[#C3D36D] text-[#134030] ring-1 ring-black/10">
              <Zap className="w-4 h-4" />
              <span className="text-[12px] font-semibold font-sans">2 min</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 bg-[#FAEBDD] text-[#201D16] ring-1 ring-black/10">
              <Target className="w-4 h-4" />
              <span className="text-[12px] font-semibold font-sans">Objectif clair</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 bg-[#FAEBDD] text-[#201D16] ring-1 ring-black/10">
              <Scan className="w-4 h-4" />
              <span className="text-[12px] font-semibold font-sans">Scan & log</span>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="relative overflow-hidden rounded-[28px] bg-[#134030] ring-1 ring-black/10 shadow-[0_18px_60px_-40px_rgba(0,0,0,0.5)] p-6">
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#C3D36D] opacity-95" aria-hidden="true"></div>
            <div className="absolute -left-16 -bottom-20 h-72 w-72 rounded-full bg-[#DF842C] opacity-95" aria-hidden="true"></div>
            <div className="absolute left-8 top-10 h-32 w-32 rounded-[40px] bg-[#FAEBDD] opacity-90 rotate-12" aria-hidden="true"></div>
            <div className="absolute right-12 bottom-14 h-24 w-24 rounded-full bg-[#FAEBDD] opacity-75 -rotate-12" aria-hidden="true"></div>

            <div className="relative">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[#FAEBDD]/80 text-[12px] font-medium font-sans">Ta routine, simplifiée</p>
                  <p className="mt-1 text-[#FAEBDD] text-[18px] font-semibold tracking-tight font-sans">Macros, repas, scan — au même endroit</p>
                </div>
                <div className="h-11 w-11 rounded-2xl bg-[#FAEBDD] text-[#134030] ring-1 ring-black/10 flex items-center justify-center">
                  <Leaf className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="rounded-2xl bg-[#FAEBDD] ring-1 ring-black/10 p-3">
                  <p className="text-[12px] font-semibold text-[#134030] font-sans">Protéines</p>
                  <p className="mt-1 text-[18px] font-semibold tracking-tight text-[#201D16] font-sans">120g</p>
                  <p className="mt-1 text-[12px] text-[#201D16]/70 font-sans">objectif</p>
                </div>
                <div className="rounded-2xl bg-[#FAEBDD] ring-1 ring-black/10 p-3">
                  <p className="text-[12px] font-semibold text-[#134030] font-sans">Glucides</p>
                  <p className="mt-1 text-[18px] font-semibold tracking-tight text-[#201D16] font-sans">210g</p>
                  <p className="mt-1 text-[12px] text-[#201D16]/70 font-sans">objectif</p>
                </div>
                <div className="rounded-2xl bg-[#FAEBDD] ring-1 ring-black/10 p-3">
                  <p className="text-[12px] font-semibold text-[#134030] font-sans">Lipides</p>
                  <p className="mt-1 text-[18px] font-semibold tracking-tight text-[#201D16] font-sans">65g</p>
                  <p className="mt-1 text-[12px] text-[#201D16]/70 font-sans">objectif</p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#FAEBDD]/90">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-[12px] font-medium font-sans">Tu peux ajuster plus tard</span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-2xl bg-[#201D16] text-[#FAEBDD] px-3 py-2 ring-1 ring-black/10">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-[12px] font-semibold font-sans">Personnalisé</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="rounded-[28px] bg-[#FAEBDD] ring-1 ring-black/10 p-6">
            <div className="flex items-start gap-3">
              <div className="h-11 w-11 shrink-0 rounded-2xl bg-[#C3D36D] text-[#134030] ring-1 ring-black/10 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[14px] font-semibold tracking-tight font-sans">Données en sécurité</p>
                <p className="mt-1 text-[13px] leading-5 text-[#201D16]/75 font-sans">
                  On utilise tes réponses uniquement pour calculer ton plan et te recommander les bons repas.
                </p>
              </div>
            </div>
          </div>
        </section>
        <div className="h-8"></div>
      </main>

      <footer className="shrink-0 pb-[34px] px-5">
        <button
          onClick={() => onNavigate('onboarding-step1')}
          className="h-14 w-full inline-flex items-center justify-center gap-3 rounded-[28px] bg-[#134030] text-[#FAEBDD] ring-1 ring-black/10 shadow-[0_18px_60px_-40px_rgba(0,0,0,0.5)] px-6 text-[16px] font-semibold tracking-tight transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_26px_70px_-50px_rgba(0,0,0,0.65)] focus:outline-none focus:ring-4 focus:ring-[#C3D36D]/60 active:scale-[0.99] font-sans"
        >
          <span>Commençons</span>
          <span className="h-10 w-10 rounded-2xl bg-[#C3D36D] text-[#134030] ring-1 ring-black/10 inline-flex items-center justify-center">
            <ArrowRight className="w-5 h-5" />
          </span>
        </button>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-[12px] text-[#201D16]/60 font-sans">Déjà un compte ?</p>
          <button
            onClick={() => onNavigate('dashboard')}
            className="h-14 inline-flex items-center justify-center gap-2 rounded-2xl px-5 text-[14px] font-semibold text-[#201D16] ring-1 ring-black/10 bg-[#FAEBDD] transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_10px_30px_rgba(32,29,22,0.12)] focus:outline-none focus:ring-4 focus:ring-[#134030]/25 active:scale-[0.98] font-sans"
          >
            <LogIn className="w-5 h-5" />
            <span>Se connecter</span>
          </button>
        </div>
      </footer>
    </motion.div>
  );
};
