import { motion } from 'motion/react';
import { ArrowLeft, Zap, ScanLine, Sparkles, QrCode, Utensils, ImageIcon, Camera, RefreshCcw, Check, Drumstick, Wheat, Droplet, Info, Salad, Moon, Sliders, Plus, MapPin, ArrowRight, Refrigerator } from 'lucide-react';
import { Page } from '../types';

interface ScannerProps {
  onNavigate: (page: Page) => void;
}

export const Scanner = ({ onNavigate }: ScannerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-screen flex flex-col bg-[#FBF4EA] text-slate-900 relative grain noise overflow-x-hidden"
    >
      <header className="shrink-0 pt-14 px-6">
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
              <ScanLine className="w-5 h-5 text-slate-700" />
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[#1D6B4F] ring-1 ring-black/10 flex items-center justify-center overflow-hidden">
              <img src="https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/b1cbfc0e-79d5-45d7-9749-3bc14aed3a08/1771507502618-bf5a3efd/LOGO-BEIGE.png" alt="Natty" className="h-6 w-auto" />
            </div>
            <div className="leading-tight">
              <p className="text-[12px] text-slate-600 font-sans leading-relaxed">Scanner</p>
              <h1 className="text-[32px] leading-[1.3] font-display font-bold tracking-tight">Code-barres ou assiette</h1>
            </div>
          </div>

          <span className="inline-flex items-center gap-2 rounded-2xl bg-white ring-1 ring-black/10 px-3 py-2">
            <Sparkles className="w-4 h-4 text-[#DF842C]" />
            <span className="text-[13px] font-sans text-slate-700">C’est parti pour tracker !</span>
          </span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pb-[calc(96px+34px)] pt-6 relative">
        <section className="rounded-[28px] bg-[#0F3D2D] ring-1 ring-black/10 shadow-2xl overflow-hidden reveal">
          <div className="relative p-6">
            <div className="absolute -right-10 -top-12 h-44 w-44 rounded-full bg-[#DF842C]/35 blur-3xl"></div>
            <div className="absolute -left-14 -bottom-14 h-52 w-52 rounded-full bg-[#C3D36D]/18 blur-3xl"></div>

            <div className="relative mt-2 rounded-[26px] bg-[#201D16]/35 ring-1 ring-[#FAEBDD]/20 overflow-hidden scan-pulse">
              <div className="relative h-[320px]">
                <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                  <svg viewBox="0 0 360 320" className="absolute inset-0 h-full w-full opacity-100">
                    <defs>
                      <clipPath id="camClip">
                        <rect x="0" y="0" width="360" height="320" rx="26" ry="26"></rect>
                      </clipPath>
                    </defs>
                    <g clipPath="url(#camClip)">
                      <path d="M292 18c33 22 48 67 38 106-10 39-45 72-83 86-38 14-79 10-106-5-27-15-41-41-51-74-10-33-16-72 9-99 25-27 81-44 129-37 48 7 89 38 64 23z" fill="#C3D36D" opacity="0.14" />
                      <path d="M82 266c-29-18-45-49-41-77 4-28 28-52 54-64 26-12 55-12 78-4 23 8 40 24 54 46 14 22 24 49 8 70-16 21-58 36-90 39-32 3-55-7-63-10z" fill="#DF842C" opacity="0.12" />
                      <path d="M40 76c22-18 54-22 78-16 24 6 39 22 38 40-1 18-19 37-44 46-25 9-57 9-78-3-21-12-31-36-24-52 7-16 31-15 30-15z" fill="#FAEBDD" opacity="0.10" />
                    </g>
                  </svg>
                </div>
                <div className="absolute left-4 top-4 h-10 w-10 border-l-2 border-t-2 border-[#C3D36D] rounded-tl-2xl"></div>
                <div className="absolute right-4 top-4 h-10 w-10 border-r-2 border-t-2 border-[#C3D36D] rounded-tr-2xl"></div>
                <div className="absolute left-4 bottom-4 h-10 w-10 border-l-2 border-b-2 border-[#C3D36D] rounded-bl-2xl"></div>
                <div className="absolute right-4 bottom-4 h-10 w-10 border-r-2 border-b-2 border-[#C3D36D] rounded-br-2xl"></div>

                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 px-6">
                  <div className="h-[2px] w-full bg-[#DF842C] shadow-[0_0_0_6px_rgba(223,132,44,0.10)] scan-line"></div>
                </div>

                <div className="absolute left-1/2 top-6 -translate-x-1/2">
                  <span className="inline-flex items-center gap-2 rounded-2xl bg-[#FAEBDD] text-[#201D16] ring-1 ring-black/10 px-3 py-2">
                    <QrCode className="w-4 h-4 text-[#134030]" />
                    <span className="text-[13px] font-sans">Détection en cours…</span>
                  </span>
                </div>

                <div className="absolute left-0 right-0 bottom-5 px-5">
                  <div className="flex items-center justify-center gap-2">
                    <span className="inline-flex items-center gap-2 rounded-2xl bg-white ring-1 ring-black/10 px-3 py-2">
                      <ScanLine className="w-4 h-4 text-[#134030]" />
                      <span className="text-[13px] font-sans text-slate-700">Code-barres</span>
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-2xl bg-[#201D16] text-[#FAEBDD] ring-1 ring-[#FAEBDD]/15 px-3 py-2">
                      <Utensils className="w-4 h-4 text-[#DF842C]" />
                      <span className="text-[13px] font-sans">Assiette</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <button className="h-14 w-14 rounded-2xl bg-[#FAEBDD] ring-1 ring-black/10 flex items-center justify-center transition-transform hover:scale-105">
                <ImageIcon className="w-5 h-5 text-slate-800" />
              </button>

              <button 
                onClick={() => onNavigate('meal-details')}
                className="h-14 flex-1 rounded-[22px] bg-[#FF7A1A] text-white ring-1 ring-black/10 shadow-lg font-sans text-[15px] inline-flex items-center justify-center gap-3 transition-transform hover:scale-105"
              >
                <span className="inline-flex items-center justify-center h-9 w-9 rounded-2xl bg-white/15 ring-1 ring-white/20">
                  <Camera className="w-5 h-5" />
                </span>
                Scanner
              </button>

              <button className="h-14 w-14 rounded-2xl bg-[#FAEBDD] ring-1 ring-black/10 flex items-center justify-center transition-transform hover:scale-105">
                <RefreshCcw className="w-5 h-5 text-slate-800" />
              </button>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[28px] bg-white ring-1 ring-black/10 shadow-lg overflow-hidden reveal">
          <div className="p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[12px] text-slate-600 font-sans leading-relaxed">Détecté 🎯</p>
                <h2 className="text-[28px] leading-[1.35] font-display font-bold tracking-tight">Yaourt grec nature</h2>
                <p className="mt-2 text-[13px] font-sans leading-relaxed text-slate-600">Par portion (150 g) • 0 123 456 789</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-2xl bg-[#EAF3EF] ring-1 ring-black/10 px-3 py-2 text-[#134030]">
                <Check className="w-4 h-4" />
                <span className="text-[13px] font-sans">Confiant</span>
              </span>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-4">
              <div className="rounded-2xl bg-[#FBF4EA] ring-1 ring-black/10 p-3">
                <p className="text-[11px] font-sans text-slate-600">Calories</p>
                <p className="mt-1 text-[18px] font-display font-bold tracking-tight">162</p>
                <p className="text-[11px] font-sans text-slate-500">kcal</p>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-black/10 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-[12px] font-sans text-slate-700">Protéines</p>
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-xl bg-[#EAF3EF]">
                    <Drumstick className="w-3 h-3 text-[#1D6B4F]" />
                  </span>
                </div>
                <p className="mt-2 text-[16px] font-display font-bold">15<span className="text-[12px] font-sans text-slate-500"> g</span></p>
                <div className="mt-2 h-2 rounded-full bg-[#EAF3EF] overflow-hidden">
                  <div className="h-full w-[75%] rounded-full bg-[#1D6B4F]"></div>
                </div>
              </div>
              <div className="rounded-2xl bg-white ring-1 ring-black/10 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-[12px] font-sans text-slate-700">Glucides</p>
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-xl bg-[#F1E3D0]">
                    <Wheat className="w-3 h-3 text-slate-700" />
                  </span>
                </div>
                <p className="mt-2 text-[16px] font-display font-bold">6<span className="text-[12px] font-sans text-slate-500"> g</span></p>
                <div className="mt-2 h-2 rounded-full bg-[#F1E3D0] overflow-hidden">
                  <div className="h-full w-[28%] rounded-full bg-[#DF842C]"></div>
                </div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white ring-1 ring-black/10 p-3">
                <div className="flex items-center justify-between">
                  <p className="text-[12px] font-sans text-slate-700">Lipides</p>
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-xl bg-[#FFF0E8]">
                    <Droplet className="w-3 h-3 text-[#DF842C]" />
                  </span>
                </div>
                <p className="mt-2 text-[16px] font-display font-bold">7<span className="text-[12px] font-sans text-slate-500"> g</span></p>
                <div className="mt-2 h-2 rounded-full bg-[#FFF0E8] overflow-hidden">
                  <div className="h-full w-[52%] rounded-full bg-[#DF842C]"></div>
                </div>
              </div>
              <div className="rounded-2xl bg-[#0F3D2D] ring-1 ring-black/10 p-3 text-[#FBF4EA]">
                <p className="text-[11px] font-sans text-[#FBF4EA]/80">Score Nutri</p>
                <div className="mt-2 flex items-baseline gap-2">
                  <p className="text-[22px] font-display font-bold leading-none">A</p>
                  <p className="text-[12px] font-sans text-[#FBF4EA]/80">très bon</p>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#C3D36D]"></span>
                  <span className="text-[11px] font-sans text-[#FBF4EA]/80">peu sucré</span>
                  <span className="h-2 w-2 rounded-full bg-[#DF842C]"></span>
                  <span className="text-[11px] font-sans text-[#FBF4EA]/80">riche en prot.</span>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-[24px] bg-[#FBF4EA] ring-1 ring-black/10 p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-[14px] font-display font-bold tracking-tight">Ajouter à ton quotidien ✨</h3>
                <button 
                  onClick={() => onNavigate('meal-details')}
                  className="inline-flex items-center gap-2 text-[13px] font-sans text-slate-800 underline underline-offset-4 transition-transform hover:scale-105"
                >
                  <Info className="w-4 h-4 text-[#7C3AED]" />
                  Détails
                </button>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <button className="h-14 rounded-2xl bg-white ring-1 ring-black/10 font-sans text-[15px] inline-flex items-center justify-center gap-2 transition-transform hover:scale-105">
                  <Salad className="w-4 h-4 text-[#DF842C]" />
                  Déjeuner
                </button>
                <button className="h-14 rounded-2xl bg-white ring-1 ring-black/10 font-sans text-[15px] inline-flex items-center justify-center gap-2 transition-transform hover:scale-105">
                  <Moon className="w-4 h-4 text-slate-800" />
                  Dîner
                </button>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex-1 rounded-2xl bg-white ring-1 ring-black/10 px-3 py-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-sans text-slate-600">Quantité</span>
                    <span className="text-[12px] font-sans text-slate-700">150 g</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-[#F1E3D0] overflow-hidden">
                    <div className="h-full w-[62%] rounded-full bg-[#1D6B4F]"></div>
                  </div>
                </div>
                <button className="h-14 w-14 rounded-2xl bg-[#EAF3EF] ring-1 ring-black/10 flex items-center justify-center transition-transform hover:scale-105">
                  <Sliders className="w-5 h-5 text-[#1D6B4F]" />
                </button>
              </div>

              <button className="mt-5 h-14 w-full rounded-2xl bg-[#16A34A] text-white ring-1 ring-black/10 shadow-lg font-sans text-[15px] inline-flex items-center justify-center gap-2 transition-transform hover:scale-105">
                <Plus className="w-4 h-4" />
                Ajouter
              </button>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[28px] bg-[#FFF0E8] ring-1 ring-black/10 shadow-lg p-6 reveal">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[12px] font-sans text-slate-700">Alternative rapide</p>
              <h3 className="text-[18px] font-display font-bold tracking-tight">Besoin d’un repas complet ?</h3>
              <p className="mt-2 text-[13px] font-sans leading-relaxed text-slate-700">Trouve le frigo connecté le plus proche et récupère en passant.</p>
            </div>
            <span className="h-11 w-11 rounded-2xl bg-white ring-1 ring-black/10 flex items-center justify-center">
              <Refrigerator className="w-5 h-5 text-[#DF842C]" />
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 rounded-2xl bg-white ring-1 ring-black/10 px-3 py-2">
              <MapPin className="w-4 h-4 text-[#134030]" />
              <span className="text-[13px] font-sans text-slate-700">Bourse • 600m</span>
            </span>
            <button 
              onClick={() => onNavigate('fridge')}
              className="h-14 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FF7A1A] text-white ring-1 ring-black/10 px-5 font-sans text-[15px] shadow-lg transition-transform hover:scale-105"
            >
              <ArrowRight className="w-4 h-4" />
              Ouvrir le menu
            </button>
          </div>
        </section>
      </main>
    </motion.div>
  );
};
