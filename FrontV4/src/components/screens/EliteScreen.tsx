import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Crown, Zap, Users, Star, Clock } from 'lucide-react';
import Button from '../ui/Button';

interface EliteScreenProps {
  onBack: () => void;
}

const EliteScreen = ({ onBack }: EliteScreenProps) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-[100svh] bg-black text-white p-6 pt-safe pb-32 overflow-y-auto no-scrollbar">
      <header className="flex items-center justify-between mb-12">
        <button onClick={onBack} className="p-2 bg-white/10 rounded-xl backdrop-blur-md"><ChevronLeft /></button>
        <div className="flex items-center gap-2 bg-natty-lime/20 px-4 py-2 rounded-full border border-natty-lime/30">
          <Crown size={18} className="text-natty-lime" />
          <span className="text-xs font-black text-natty-lime uppercase tracking-widest">Elite</span>
        </div>
      </header>

      <div className="space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-black leading-[0.9] tracking-tighter">NATTY<br /><span className="text-natty-lime">ELITE.</span></h1>
          <p className="text-white/60 text-lg font-medium">Repousse tes limites avec le programme de nutrition le plus avancé au monde.</p>
        </div>

        <div className="space-y-4">
          {[
            { title: 'IA Nutritionnelle 2.0', desc: 'Analyses prédictives basées sur ton métabolisme réel.', icon: Zap },
            { title: 'Coaching Elite', desc: 'Accès direct à des nutritionnistes du sport 24/7.', icon: Users },
            { title: 'Recettes Exclusives', desc: 'Plus de 500 recettes optimisées pour tes macros.', icon: Star },
            { title: 'Livraison Prioritaire', desc: 'Tes repas Natty livrés en 15 min dans ton club.', icon: Clock },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 p-6 bg-white/5 rounded-[40px] border border-white/10">
              <div className="w-12 h-12 bg-natty-lime text-natty-teal rounded-2xl flex items-center justify-center shrink-0">
                <item.icon size={24} />
              </div>
              <div>
                <h4 className="font-bold text-lg">{item.title}</h4>
                <p className="text-sm text-white/40">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-8">
          <Button variant="lime" className="w-full py-6 text-xl text-natty-teal font-black shadow-[0_0_30px_rgba(197,217,55,0.3)]">
            Devenir Elite — 14.99€/mois
          </Button>
          <p className="text-center mt-6 text-xs text-white/20">7 jours d'essai gratuit. Annulable à tout moment.</p>
        </div>
      </div>
    </motion.div>
  );
};

export default EliteScreen;
