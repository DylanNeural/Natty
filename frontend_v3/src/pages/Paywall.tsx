import { motion } from 'motion/react';
import { ChevronLeft, Crown, Check, Zap, Sparkles, ShieldCheck, Star, ArrowRight, X } from 'lucide-react';
import { Page } from '../types';

interface PaywallProps {
  onNavigate: (page: Page) => void;
}

export const Paywall = ({ onNavigate }: PaywallProps) => {
  const features = [
    { title: 'Scan illimité', desc: 'Photos & codes-barres sans limite.', icon: Zap, color: 'text-[#DF842C]' },
    { title: 'Frigo Connecté', desc: 'Accès exclusif aux plats du jour.', icon: Star, color: 'text-[#134030]' },
    { title: 'Macros Précises', desc: 'Calculs avancés par IA.', icon: Sparkles, color: 'text-[#DF842C]' },
    { title: 'Support Prioritaire', desc: 'On répond à tes questions en 2h.', icon: ShieldCheck, color: 'text-[#134030]' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="w-full h-screen flex flex-col bg-[#134030] text-[#FAEBDD] relative overflow-hidden font-sans"
    >
      {/* Background elements */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#C3D36D] opacity-20 blur-3xl"></div>
      <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-[#DF842C] opacity-15 blur-3xl"></div>

      <header className="shrink-0 pt-14 px-6 relative z-10">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('onboarding-step5')}
            className="h-11 w-11 rounded-2xl bg-white/10 ring-1 ring-white/20 flex items-center justify-center active:scale-[0.98] transition-transform"
          >
            <ChevronLeft className="w-5 h-5 text-[#FAEBDD]" />
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className="h-11 w-11 rounded-2xl bg-white/10 ring-1 ring-white/20 flex items-center justify-center active:scale-[0.98] transition-transform"
          >
            <X className="w-5 h-5 text-[#FAEBDD]" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pt-8 pb-[34px] relative z-10">
        <section className="text-center">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-[32px] bg-[#C3D36D] text-[#134030] shadow-xl mb-6">
            <Crown className="w-10 h-10" />
          </div>
          <h1 className="text-[36px] leading-[1.05] tracking-tight font-brand">
            Passe à Natty Pro ✨
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-[#FAEBDD]/80">
            Libère tout le potentiel de ta nutrition avec des outils avancés et un accès exclusif.
          </p>
        </section>

        <section className="mt-10 space-y-4">
          {features.map((feature, idx) => (
            <div key={idx} className="rounded-[28px] bg-white/5 ring-1 ring-white/10 p-5 flex items-start gap-4">
              <div className={`shrink-0 h-12 w-12 rounded-2xl bg-[#FAEBDD] flex items-center justify-center ${feature.color}`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-[16px] font-semibold tracking-tight">{feature.title}</h3>
                <p className="mt-1 text-[13px] text-[#FAEBDD]/60 leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-10">
          <div className="rounded-[32px] bg-[#FAEBDD] text-[#134030] p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute right-0 top-0 h-20 w-20 bg-[#C3D36D] opacity-20 rounded-bl-full"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full bg-[#134030] text-[#FAEBDD] text-[11px] font-bold uppercase tracking-wider">Offre de lancement</span>
                <span className="text-[14px] font-semibold">-50%</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-[42px] font-brand leading-none">9,99€</span>
                <span className="text-[16px] font-medium opacity-60">/ mois</span>
              </div>
              <p className="mt-2 text-[13px] font-medium opacity-70">Sans engagement, annule quand tu veux.</p>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <button
            onClick={() => onNavigate('checkout')}
            className="h-16 w-full rounded-[28px] bg-[#C3D36D] text-[#134030] font-bold text-[16px] shadow-lg flex items-center justify-center gap-3 active:scale-[0.99] transition-transform"
          >
            <span>Commencer l'essai gratuit</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="mt-4 text-center text-[12px] text-[#FAEBDD]/50">
            7 jours gratuits, puis 9,99€/mois. Paiement sécurisé.
          </p>
        </section>
      </main>
    </motion.div>
  );
};
