import { motion } from 'motion/react';
import { ChevronLeft, CheckCircle2, Sparkles, Dumbbell, Salad, Zap, ArrowRight } from 'lucide-react';
import { Page } from '../types';

interface OnboardingStep2Props {
  onNavigate: (page: Page) => void;
}

export const OnboardingStep2 = ({ onNavigate }: OnboardingStep2Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full h-screen flex flex-col bg-[#FAEBDD] text-[#201D16] relative overflow-hidden grain"
    >
      <header className="shrink-0 pt-14 px-5">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('onboarding-step1')}
            className="inline-flex items-center justify-center h-14 px-4 rounded-2xl bg-white border border-[#134030]/10 shadow-[0_1px_0_rgba(0,0,0,0.03)] active:scale-[0.99] transition-all duration-200"
          >
            <ChevronLeft className="w-5 h-5 text-[#134030]" />
            <span className="ml-1 text-sm font-semibold text-[#134030]">Retour</span>
          </button>

          <img
            src="https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/b1cbfc0e-79d5-45d7-9749-3bc14aed3a08/1771508071656-899a2241/LOGO_BEIGE.png"
            alt="Natty"
            className="h-8 w-auto"
          />

          <button
            onClick={() => onNavigate('onboarding-step3')}
            className="inline-flex items-center justify-center h-14 px-4 rounded-2xl bg-white border border-[#134030]/10 text-sm font-semibold text-[#134030] shadow-[0_1px_0_rgba(0,0,0,0.03)] active:scale-[0.99] transition-all duration-200"
          >
            Passer
          </button>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between">
            <div className="text-xs font-semibold tracking-wide text-[#134030]/80">
              Étape <span className="text-[#134030]">2</span> sur <span className="text-[#134030]">5</span>
            </div>
            <div className="text-xs font-semibold text-[#134030]/70">Profil</div>
          </div>

          <div className="mt-2 h-3 rounded-full bg-white border border-[#134030]/10 overflow-hidden">
            <div className="h-full w-2/5 bg-[#C3D36D] rounded-full"></div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-5 pb-[34px]">
        <section className="mt-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 border border-[#134030]/10 shadow-[0_1px_0_rgba(0,0,0,0.03)]">
            <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-[#DF842C] text-white text-sm">2</span>
            <span className="text-sm font-semibold text-[#134030]">Parle-moi de toi</span>
            <span className="text-xs font-semibold text-[#134030]/60">(rapide, promis)</span>
          </div>

          <h1 className="mt-5 text-[32px] leading-[1.05] tracking-tight text-[#134030] font-brand">
            On ajuste tes macros au millimètre.
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-[#201D16]/80 font-medium font-sans">
            Tes infos restent privées. Elles servent juste à calculer ton plan Natty.
          </p>
        </section>

        <section className="mt-7">
          <div className="relative overflow-hidden rounded-[28px] bg-white border border-[#134030]/10 shadow-lg p-5">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#C3D36D]/40"></div>
            <div className="absolute -left-12 -bottom-12 h-44 w-44 rounded-full bg-[#DF842C]/20"></div>

            <div className="relative flex items-start gap-4">
              <div className="shrink-0">
                <div className="h-12 w-12 rounded-2xl bg-[#134030] text-[#FAEBDD] flex items-center justify-center animate-bounce">
                  <Dumbbell className="w-6 h-6" />
                </div>
                <div className="mt-3 h-12 w-12 rounded-2xl bg-[#C3D36D] text-[#134030] flex items-center justify-center">
                  <Salad className="w-6 h-6" />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center h-7 px-3 rounded-full bg-[#134030] text-[#FAEBDD] text-xs font-semibold">Mood</span>
                  <span className="text-sm font-semibold text-[#134030]">Fort & régulier</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[#201D16]/75 font-medium font-sans">
                  Plus ton profil est précis, plus Natty peut te proposer des repas qui collent à ton objectif.
                </p>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <div className="rounded-2xl border border-[#134030]/10 bg-[#FAEBDD] px-3 py-3">
                    <div className="text-[11px] font-semibold text-[#134030]/70">Protéines</div>
                    <div className="mt-1 text-sm font-extrabold text-[#134030]">↗ focus</div>
                  </div>
                  <div className="rounded-2xl border border-[#134030]/10 bg-[#FAEBDD] px-3 py-3">
                    <div className="text-[11px] font-semibold text-[#134030]/70">Calories</div>
                    <div className="mt-1 text-sm font-extrabold text-[#134030]">juste</div>
                  </div>
                  <div className="rounded-2xl border border-[#134030]/10 bg-[#FAEBDD] px-3 py-3">
                    <div className="text-[11px] font-semibold text-[#134030]/70">Énergie</div>
                    <div className="mt-1 text-sm font-extrabold text-[#134030]">⚡ stable</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <form className="space-y-5">
            <div className="rounded-[28px] bg-white border border-[#134030]/10 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <label htmlFor="weight" className="block text-[15px] font-semibold text-[#134030]">Poids</label>
                  <p className="mt-1 text-xs font-medium text-[#201D16]/65">En kg — pour calibrer tes apports.</p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-[#FAEBDD] px-3 py-1.5 border border-[#134030]/10">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-semibold text-emerald-700">OK</span>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3">
                <div className="relative flex-1">
                  <input id="weight" name="weight" inputMode="decimal" placeholder="Ex: 72" className="w-full h-14 rounded-2xl bg-white border border-[#134030]/15 px-4 text-[16px] font-semibold text-[#134030] placeholder:text-[#134030]/35 outline-none transition-all duration-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/20" />
                </div>
                <div className="h-14 w-16 rounded-2xl bg-[#134030] text-[#FAEBDD] flex items-center justify-center text-sm font-bold">kg</div>
              </div>
            </div>

            <div className="rounded-[28px] bg-white border border-[#134030]/10 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <label htmlFor="height" className="block text-[15px] font-semibold text-[#134030]">Taille</label>
                  <p className="mt-1 text-xs font-medium text-[#201D16]/65">En cm — juste pour être précis.</p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 border border-[#134030]/10">
                  <Sparkles className="w-4 h-4 text-[#DF842C]" />
                  <span className="text-xs font-semibold text-[#134030]">Calibrage</span>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3">
                <div className="relative flex-1">
                  <input id="height" name="height" inputMode="numeric" placeholder="Ex: 178" className="w-full h-14 rounded-2xl bg-white border border-[#134030]/15 px-4 text-[16px] font-semibold text-[#134030] placeholder:text-[#134030]/35 outline-none transition-all duration-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/20" />
                </div>
                <div className="h-14 w-16 rounded-2xl bg-[#C3D36D] text-[#134030] flex items-center justify-center text-sm font-extrabold">cm</div>
              </div>
            </div>

            <div className="rounded-[28px] bg-[#134030] text-[#FAEBDD] p-5 shadow-lg">
              <div className="flex items-start gap-3">
                <div className="h-11 w-11 rounded-2xl bg-[#DF842C] text-white flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold tracking-tight">Feedback instant</div>
                  <p className="mt-1 text-xs font-medium text-[#FAEBDD]/80">Dès que tu valides, Natty calcule tes macros et te propose des repas compatibles.</p>
                </div>
              </div>
            </div>

            <div className="h-3"></div>

            <button
              type="button"
              onClick={() => onNavigate('onboarding-step3')}
              className="h-14 w-full rounded-2xl bg-[#DF842C] text-white flex items-center justify-center gap-2 font-semibold text-[16px] shadow-[0_14px_30px_rgba(223,132,44,0.30)] active:scale-[0.99] transition-all duration-200"
            >
              <span>Suivant</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <p className="text-center text-xs font-medium text-[#201D16]/65">
              Astuce : tu peux toujours modifier ces infos plus tard dans ton profil.
            </p>
          </form>
        </section>
      </main>
    </motion.div>
  );
};
