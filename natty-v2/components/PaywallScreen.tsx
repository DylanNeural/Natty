
import React from 'react';

interface Props {
  onNavigate: () => void;
}

export const PaywallScreen: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="relative flex flex-col h-full w-full bg-[#101419] text-white font-display overflow-hidden">
      
      {/* Background Gradient */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-warning/20 to-transparent pointer-events-none"></div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-warning filled">workspace_premium</span>
            <span className="font-bold text-sm tracking-wide uppercase text-warning">Natty Pro</span>
        </div>
        <button 
            onClick={onNavigate}
            className="text-gray-400 font-medium text-sm hover:text-white transition-colors"
        >
            Passer
        </button>
      </header>

      <main className="relative z-10 flex-1 px-6 pb-28 overflow-y-auto no-scrollbar">
        <div className="pt-4 mb-8">
            <h1 className="text-4xl font-bold leading-[1.1] mb-4">
                Meilleures habitudes. <br/>
                Entraînement intelligent. <br/>
                <span className="text-warning">Progrès constants.</span>
            </h1>
            <p className="text-gray-400 leading-relaxed">
                La régularité fait la différence. Restez sur la bonne voie avec un abonnement Pro.
            </p>
        </div>

        {/* Pricing Card */}
        <div className="bg-white text-[#101419] rounded-2xl p-5 mb-10 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 bg-warning text-white text-xs font-bold px-3 py-1 rounded-br-xl">
                30 jours gratuits
            </div>
            <div className="flex justify-between items-end mt-4">
                <div>
                    <h3 className="text-2xl font-bold">Annuel</h3>
                    <p className="text-sm text-gray-600 font-medium">Facturé 79.99€/an</p>
                </div>
                <div className="text-right">
                    <p className="text-xl font-bold">6.67€</p>
                    <p className="text-xs text-gray-500 font-medium">/mois</p>
                </div>
            </div>
        </div>

        {/* Timeline */}
        <div className="mb-10">
            <h3 className="font-bold text-lg mb-6">Essayez gratuitement pendant 30 jours</h3>
            <div className="relative pl-4 space-y-8">
                {/* Vertical Line */}
                <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-gray-800"></div>

                <TimelineItem 
                    icon="lock_open" 
                    title="Aujourd'hui" 
                    desc="Débloquez toutes les fonctionnalités Natty Pro immédiatement."
                    active
                />
                <TimelineItem 
                    icon="notifications" 
                    title="Dans 28 jours" 
                    desc="Nous vous rappellerons que votre essai gratuit se termine bientôt."
                />
                <TimelineItem 
                    icon="bolt" 
                    title="Dans 30 jours" 
                    desc="Votre abonnement annuel commence. Vous serez débité de 79.99€."
                    iconColor="text-warning"
                    iconBg="bg-warning/20"
                />
            </div>
        </div>

        {/* Features Grid */}
        <div className="mb-6">
            <h3 className="font-bold text-lg mb-4">Ce que vous débloquez</h3>
            <div className="grid grid-cols-1 gap-4">
                <FeatureRow icon="center_focus_strong" text="Natty Vision Illimité (Scanner)" />
                <FeatureRow icon="support_agent" text="Chat illimité avec Coach Sarah" />
                <FeatureRow icon="insights" text="Analyses de progression avancées" />
                <FeatureRow icon="percent" text="-10% sur toutes les commandes Frigo" />
            </div>
        </div>
      </main>

      {/* Sticky CTA */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#101419] via-[#101419] to-transparent z-20">
        <button 
            onClick={onNavigate}
            className="w-full h-14 bg-warning hover:bg-warning/90 text-[#101419] font-bold text-lg rounded-full shadow-lg shadow-warning/20 active:scale-95 transition-all"
        >
            Démarrer l'essai gratuit
        </button>
        <p className="text-[10px] text-center text-gray-500 mt-4 px-4 leading-tight">
            Vous ne serez pas débité avant le 21 Oct. Annulez à tout moment jusqu'à 24h avant la fin de votre essai.
        </p>
      </div>
    </div>
  );
};

const TimelineItem: React.FC<{icon: string; title: string; desc: string; active?: boolean; iconColor?: string; iconBg?: string}> = ({ icon, title, desc, active, iconColor = "text-white", iconBg = "bg-gray-800" }) => (
    <div className="relative flex gap-4 items-start">
        <div className={`relative z-10 size-6 rounded-full flex items-center justify-center shrink-0 ${active ? 'bg-white text-[#101419]' : iconBg} ${iconColor} border-4 border-[#101419]`}>
            <span className="material-symbols-outlined text-sm font-bold">{icon}</span>
        </div>
        <div>
            <p className="font-bold text-sm mb-0.5">{title}</p>
            <p className="text-sm text-gray-400 leading-snug">{desc}</p>
        </div>
    </div>
);

const FeatureRow: React.FC<{icon: string; text: string}> = ({ icon, text }) => (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
        <span className="material-symbols-outlined text-warning">{icon}</span>
        <span className="text-sm font-medium text-gray-200">{text}</span>
    </div>
);
