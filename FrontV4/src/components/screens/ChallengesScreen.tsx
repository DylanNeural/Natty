import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Trophy, Footprints, Droplets, Clock, Lock } from 'lucide-react';
import Card from '../ui/Card';

interface ChallengesScreenProps {
  onBack: () => void;
}

const ChallengesScreen = ({ onBack }: ChallengesScreenProps) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="h-[100svh] bg-natty-beige flex flex-col pt-safe pb-safe">
      <header className="p-6 flex justify-between items-center">
        <button onClick={onBack} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
          <ChevronLeft />
        </button>
        <h2 className="font-black text-xl text-natty-teal">Défis</h2>
        <div className="w-12 h-12" />
      </header>

      <div className="px-6 space-y-6 flex-1 overflow-y-auto no-scrollbar pb-12">
        <Card className="bg-natty-teal text-white p-8 space-y-6 overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="text-3xl font-black leading-tight">Gagne des<br />récompenses.</h3>
            <p className="text-white/60 font-medium">Relève des défis quotidiens et débloque des réductions exclusives.</p>
          </div>
          <Trophy className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5 rotate-12" />
        </Card>

        <div className="space-y-4">
          <h4 className="font-black text-natty-teal uppercase tracking-widest text-sm ml-2">En cours</h4>
          <Card className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-natty-lime text-natty-teal rounded-2xl"><Footprints size={24} /></div>
              <span className="text-[10px] font-black bg-natty-teal text-white px-3 py-1 rounded-full uppercase tracking-widest">7 jours restants</span>
            </div>
            <div>
              <h3 className="text-xl font-black text-natty-teal">10k Pas par jour</h3>
              <p className="text-sm text-natty-charcoal/60">Marche 10 000 pas chaque jour pendant une semaine.</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span>Progression</span>
                <span>4 / 7 jours</span>
              </div>
              <div className="h-2 w-full bg-natty-charcoal/5 rounded-full overflow-hidden">
                <div className="h-full bg-natty-lime w-[57%]" />
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <h4 className="font-black text-natty-teal uppercase tracking-widest text-sm ml-2">À venir</h4>
          {[
            { title: 'Hydratation Max', desc: 'Bois 2.5L d\'eau par jour pendant 5 jours.', icon: Droplets, color: 'text-blue-500' },
            { title: 'Fasting Master', desc: 'Complète 3 jeûnes de 16h cette semaine.', icon: Clock, color: 'text-natty-orange' },
          ].map(challenge => (
            <Card key={challenge.title} className="flex items-center gap-4 opacity-60 grayscale">
              <div className={`p-3 bg-white rounded-2xl shadow-sm ${challenge.color}`}><challenge.icon size={24} /></div>
              <div className="flex-1">
                <h3 className="font-bold">{challenge.title}</h3>
                <p className="text-xs text-natty-charcoal/40">{challenge.desc}</p>
              </div>
              <Lock size={16} className="text-natty-charcoal/20" />
            </Card>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ChallengesScreen;
