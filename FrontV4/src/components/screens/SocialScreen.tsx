import React from 'react';
import { Plus, MoreHorizontal, Flame, BookOpen, Share2, Trophy } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Screen } from '../../types';

interface SocialScreenProps {
  onNavigate?: (s: Screen) => void;
}

const SocialScreen = ({ onNavigate }: SocialScreenProps) => {
  return (
    <div className="p-6 space-y-8 pb-32 pt-safe">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-natty-teal">Communauté</h1>
          <p className="text-sm text-natty-charcoal/40 font-medium">Défis & Partage</p>
        </div>
        <button className="w-12 h-12 bg-natty-teal text-white rounded-2xl flex items-center justify-center">
          <Plus size={24} />
        </button>
      </header>

      <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6">
        {['Tous', 'Défis', 'Recettes', 'Progrès', 'Conseils'].map((tab, i) => (
          <button key={tab} className={`px-6 py-3 rounded-full font-bold text-sm whitespace-nowrap ${i === 0 ? 'bg-natty-teal text-white' : 'bg-natty-charcoal/5 text-natty-charcoal/40'}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        <Card className="p-0 overflow-hidden">
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-natty-teal rounded-full flex items-center justify-center text-natty-lime font-bold">M</div>
            <div className="flex-1">
              <h4 className="font-bold">Marc Fitness</h4>
              <p className="text-[10px] text-natty-charcoal/40 font-bold uppercase tracking-widest">Il y a 2h · Toulouse</p>
            </div>
            <button className="text-natty-charcoal/30"><MoreHorizontal size={20} /></button>
          </div>
          <img src="https://picsum.photos/seed/workout/600/400" alt="Workout" className="w-full h-64 object-cover" referrerPolicy="no-referrer" />
          <div className="p-4 space-y-3">
            <div className="flex gap-4">
              <button className="flex items-center gap-1 text-natty-teal font-bold"><Flame size={20} /> 124</button>
              <button className="flex items-center gap-1 text-natty-charcoal/40 font-bold"><BookOpen size={20} /> 12</button>
              <button className="flex items-center gap-1 text-natty-charcoal/40 font-bold ml-auto"><Share2 size={20} /></button>
            </div>
            <p className="text-sm leading-relaxed"><span className="font-bold">Marc Fitness</span> Nouvelle séance validée ! Le Bowl Protéiné de chez Natty après ça, c'est le paradis. 🥗🔥</p>
          </div>
        </Card>

        <Card className="bg-natty-lime/10 border-natty-lime/20 p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-natty-lime text-natty-teal rounded-2xl"><Trophy size={24} /></div>
            <span className="text-[10px] font-black bg-natty-teal text-white px-2 py-1 rounded-md uppercase tracking-widest">Nouveau Défi</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-natty-teal">10k Pas par jour</h3>
            <p className="text-sm text-natty-teal/60">Marche 10 000 pas chaque jour pendant 7 jours et gagne un bon de -20% sur ton prochain repas.</p>
          </div>
          <Button variant="primary" className="w-full">Rejoindre le défi</Button>
        </Card>
      </div>
    </div>
  );
};

export default SocialScreen;
