import { motion } from 'motion/react';
import { ChevronLeft, Sparkles, Drumstick, BadgeCheck, Zap, Wheat, Flame, Timer, Droplet, Leaf, Utensils, PieChart, Crown, ArrowRight } from 'lucide-react';
import { Page } from '../types';

interface OnboardingStep5Props {
  onNavigate: (page: Page) => void;
}

export const OnboardingStep5 = ({ onNavigate }: OnboardingStep5Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full h-screen flex flex-col bg-[#FAEBDD] text-[#201D16] font-sans"
    >
      <header className="shrink-0 pt-14 px-5 relative">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('onboarding-step4')}
            className="h-11 w-11 rounded-2xl bg-white ring-1 ring-black/10 shadow-sm inline-flex items-center justify-center active:scale-[0.98] transition-transform"
          >
            <ChevronLeft className="w-5 h-5 text-[#201D16]" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[12px] font-semibold text-[#201D16]/70">Étape</span>
            <span className="px-2.5 py-1 rounded-full bg-white ring-1 ring-black/10 text-[12px] font-semibold">5/5</span>
          </div>
        </div>

        <div className="mt-4">
          <div className="h-2 w-full rounded-full bg-white ring-1 ring-black/10 overflow-hidden">
            <div className="h-full w-full bg-[#134030]"></div>
          </div>
          <div className="mt-2 flex items-center justify-between text-[12px] text-[#201D16]/60">
            <span>Dernière étape</span>
            <span>Plan prêt</span>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-5 pt-8 pb-[34px] relative">
        <section className="reveal d1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-[32px] leading-[1.05] tracking-tight font-brand">
                Bravo, c’est fait ! Ton plan est prêt ✨
              </h1>
              <p className="mt-3 text-[14px] leading-relaxed text-[#201D16]/70">
                Tu viens de terminer le quiz — et franchement, tu gères. Voilà ta base du jour (ajustable quand tu veux) 💪
              </p>
            </div>
            <div className="shrink-0 h-14 w-14 rounded-3xl bg-[#C3D36D] ring-1 ring-black/10 flex items-center justify-center shadow-sm">
              <Sparkles className="w-6 h-6 text-[#134030]" />
            </div>
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-5">
          {/* Proteines */}
          <div className="reveal d2 rounded-[28px] bg-white ring-1 ring-black/10 shadow-lg overflow-hidden">
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#134030] text-[#FAEBDD]">
                    <Drumstick className="w-4 h-4" />
                    <span className="text-[12px] font-semibold">Protéines</span>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <div className="text-[28px] tracking-tight font-semibold">150</div>
                    <div className="text-[14px] text-[#201D16]/70">g / jour</div>
                  </div>
                  <p className="mt-2 text-[12px] text-[#201D16]/60">
                    Pour soutenir la récup’ et la construction musculaire.
                  </p>
                </div>

                <div className="shrink-0">
                  <div className="h-14 w-14 rounded-3xl bg-[#FAEBDD] ring-1 ring-black/10 flex items-center justify-center">
                    <BadgeCheck className="w-6 h-6 text-[#134030]" />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-[12px] text-[#201D16]/60">
                  <span>Objectif</span>
                  <span className="font-semibold text-[#201D16]/80">haut</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-[#201D16]/10 overflow-hidden">
                  <div className="h-full w-[78%] rounded-full bg-[#134030]"></div>
                </div>
              </div>
            </div>

            <div className="px-5 pb-5">
              <div className="rounded-[24px] bg-[#FAEBDD] ring-1 ring-black/10 p-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#DF842C]" />
                  <p className="text-[12px] text-[#201D16]/70">
                    Astuce : vise <span className="font-semibold text-[#201D16]">30–40g</span> sur ton repas post-training.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Glucides */}
          <div className="reveal d3 rounded-[28px] bg-white ring-1 ring-black/10 shadow-lg overflow-hidden">
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#DF842C] text-[#201D16]">
                    <Wheat className="w-4 h-4" />
                    <span className="text-[12px] font-semibold">Glucides</span>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <div className="text-[28px] tracking-tight font-semibold">240</div>
                    <div className="text-[14px] text-[#201D16]/70">g / jour</div>
                  </div>
                  <p className="mt-2 text-[12px] text-[#201D16]/60">
                    Ton carburant pour les séances (et le mood).
                  </p>
                </div>

                <div className="shrink-0">
                  <div className="h-14 w-14 rounded-3xl bg-[#FAEBDD] ring-1 ring-black/10 flex items-center justify-center">
                    <Flame className="w-6 h-6 text-[#DF842C]" />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-[12px] text-[#201D16]/60">
                  <span>Énergie</span>
                  <span className="font-semibold text-[#201D16]/80">équilibrée</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-[#201D16]/10 overflow-hidden">
                  <div className="h-full w-[64%] rounded-full bg-[#DF842C]"></div>
                </div>
              </div>
            </div>

            <div className="px-5 pb-5">
              <div className="rounded-[24px] bg-[#FAEBDD] ring-1 ring-black/10 p-4">
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-[#134030]" />
                  <p className="text-[12px] text-[#201D16]/70">
                    Timing : un peu plus de glucides les jours où tu t’entraînes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Lipides */}
          <div className="reveal d4 rounded-[28px] bg-white ring-1 ring-black/10 shadow-lg overflow-hidden">
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C3D36D] text-[#134030]">
                    <Droplet className="w-4 h-4" />
                    <span className="text-[12px] font-semibold">Lipides</span>
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <div className="text-[28px] tracking-tight font-semibold">70</div>
                    <div className="text-[14px] text-[#201D16]/70">g / jour</div>
                  </div>
                  <p className="mt-2 text-[12px] text-[#201D16]/60">
                    Hormones, satiété, et énergie stable.
                  </p>
                </div>

                <div className="shrink-0">
                  <div className="h-14 w-14 rounded-3xl bg-[#FAEBDD] ring-1 ring-black/10 flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-[#134030]" />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between text-[12px] text-[#201D16]/60">
                  <span>Stabilité</span>
                  <span className="font-semibold text-[#201D16]/80">ok</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-[#201D16]/10 overflow-hidden">
                  <div className="h-full w-[52%] rounded-full bg-[#C3D36D]"></div>
                </div>
              </div>
            </div>

            <div className="px-5 pb-5">
              <div className="rounded-[24px] bg-[#FAEBDD] ring-1 ring-black/10 p-4">
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-[#DF842C]" />
                  <p className="text-[12px] text-[#201D16]/70">
                    Mets-les surtout sur tes repas “calmes” (hors post-workout).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Summary + kcal */}
        <section className="mt-7 reveal d5">
          <div className="rounded-[28px] bg-white ring-1 ring-black/10 shadow-sm p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-[12px] font-semibold text-[#201D16]/70">Estimation calories (base)</div>
                <div className="mt-1 flex items-baseline gap-2">
                  <div className="text-[26px] tracking-tight font-semibold">2 350</div>
                  <div className="text-[14px] text-[#201D16]/70">kcal / jour</div>
                </div>
              </div>
              <div className="h-12 w-12 rounded-3xl bg-[#134030] ring-1 ring-black/10 flex items-center justify-center">
                <PieChart className="w-6 h-6 text-[#FAEBDD]" />
              </div>
            </div>

            <div className="mt-5 rounded-[24px] bg-[#FAEBDD] ring-1 ring-black/10 p-4">
              <p className="text-[12px] text-[#201D16]/70">
                Pro tip : commence simple. Natty s’adapte à toi au fil de tes repas et de tes semaines 🔁
              </p>
            </div>
          </div>
        </section>

        {/* CTA area */}
        <section className="mt-8 reveal d6">
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => onNavigate('paywall')}
              className="h-14 rounded-[24px] bg-[#FF8C00] text-[#201D16] font-semibold text-[14px] inline-flex items-center justify-center shadow-lg ring-1 ring-black/10 active:scale-[0.98] transition-transform focus:outline-none focus:ring-4 focus:ring-[#FF8C00]/30"
            >
              Voir Premium
              <Crown className="ml-2 w-5 h-5" />
            </button>

            <button
              onClick={() => onNavigate('dashboard')}
              className="h-14 rounded-[24px] bg-[#FAEBDD] text-[#201D16] font-semibold text-[14px] inline-flex items-center justify-center ring-1 ring-black/10 active:scale-[0.98] transition-transform focus:outline-none focus:ring-4 focus:ring-black/10"
            >
              Passer
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>

          <p className="mt-4 text-center text-[12px] text-[#201D16]/60">
            Tu pourras modifier tes objectifs à tout moment dans ton profil. (Promis, rien n’est gravé dans le marbre.)
          </p>
        </section>

        <div className="h-3"></div>
      </main>
    </motion.div>
  );
};
