
import React, { useState } from 'react';

interface Props {
  onNavigate: () => void;
}

export const OnboardingGoals: React.FC<Props> = ({ onNavigate }) => {
  const [selectedGoal, setSelectedGoal] = useState<number | null>(null);

  const goals = [
    { id: 1, icon: 'fitness_center', title: 'Masse Musculaire', desc: 'Construisez un physique puissant.', color: 'text-white', bg: 'bg-primary', img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2940&auto=format&fit=crop' },
    { id: 2, icon: 'scale', title: 'Perte de Poids', desc: 'Séchez et révélez vos abdos.', color: 'text-white', bg: 'bg-secondary', img: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=2940&auto=format&fit=crop' },
    { id: 3, icon: 'local_fire_department', title: "Énergie Max", desc: 'Boostez votre quotidien.', color: 'text-white', bg: 'bg-warning', img: 'https://images.unsplash.com/photo-1606902965551-dce093cda6e7?q=80&w=2787&auto=format&fit=crop' },
    { id: 4, icon: 'nutrition', title: 'Santé Globale', desc: 'Le carburant pour durer.', color: 'text-white', bg: 'bg-primary', img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2906&auto=format&fit=crop' },
    { id: 5, icon: 'trending_up', title: 'Performance', desc: 'Explosez vos records.', color: 'text-white', bg: 'bg-warning', img: 'https://images.unsplash.com/photo-1517963879466-e025cedc96de?q=80&w=2835&auto=format&fit=crop' },
    { id: 6, icon: 'self_improvement', title: 'Bien-être', desc: 'Équilibre corps et esprit.', color: 'text-white', bg: 'bg-secondary', img: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=2940&auto=format&fit=crop' },
  ];

  const handleSelect = (id: number) => {
    setSelectedGoal(id);
  };

  return (
    <div className="relative flex h-full w-full flex-col bg-background-light dark:bg-background-dark font-display overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-warning/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      {/* Header & Progress */}
      <div className="relative z-10 flex flex-col px-6 pt-6 pb-2">
        <div className="flex items-center justify-between mb-4">
            <button onClick={() => {}} aria-label="Retour" className="p-2 -ml-2 rounded-full text-text-light dark:text-text-dark active:bg-black/5 dark:active:bg-white/10 transition-colors">
                <span className="material-symbols-outlined" aria-hidden="true">arrow_back</span>
            </button>
            <p className="text-secondary text-sm font-bold uppercase tracking-widest">Étape 2/4</p>
            <div className="w-8"></div>
        </div>
        
        <div className="flex w-full gap-1.5 mb-6">
          <div className="h-1.5 flex-1 rounded-full bg-primary/20"></div>
          <div className="h-1.5 flex-1 rounded-full bg-primary shadow-[0_0_10px_rgba(48,82,14,0.5)]"></div>
          <div className="h-1.5 flex-1 rounded-full bg-primary/20"></div>
          <div className="h-1.5 flex-1 rounded-full bg-primary/20"></div>
        </div>

        <h1 className="text-4xl font-bold leading-tight text-text-light dark:text-white mb-2">
          Quel est votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">but ultime ?</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed">
          Nous allons calibrer votre nutrition pour maximiser vos résultats.
        </p>
      </div>

      {/* Grid of Goals */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 pb-32 no-scrollbar">
        <div className="grid grid-cols-2 gap-4 pt-4">
          {goals.map((goal) => (
            <div 
              key={goal.id} 
              onClick={() => handleSelect(goal.id)}
              className={`group relative flex flex-col justify-end p-4 h-44 rounded-[1.5rem] overflow-hidden transition-all duration-200 active:scale-95 ${selectedGoal === goal.id ? 'ring-4 ring-primary shadow-2xl scale-[1.02]' : 'shadow-md'}`}
              role="button"
              aria-pressed={selectedGoal === goal.id}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelect(goal.id) }}
            >
              {/* Background Image with Overlay */}
              <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: `url('${goal.img}')`}}></div>
              <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent ${selectedGoal === goal.id ? 'opacity-90' : 'opacity-80'}`}></div>
              
              {/* Active Indicator */}
              <div className={`absolute top-3 right-3 size-6 rounded-full flex items-center justify-center transition-all duration-300 ${selectedGoal === goal.id ? 'bg-primary scale-100' : 'bg-white/20 scale-0'}`}>
                <span className="material-symbols-outlined text-white text-sm" aria-hidden="true">check</span>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <div className={`mb-2 size-10 rounded-xl flex items-center justify-center backdrop-blur-md ${selectedGoal === goal.id ? 'bg-primary text-white' : 'bg-white/20 text-white'}`}>
                    <span className="material-symbols-outlined text-2xl" aria-hidden="true">{goal.icon}</span>
                </div>
                <h2 className="text-white font-bold text-lg leading-tight mb-0.5">{goal.title}</h2>
                <p className="text-white/70 text-xs font-medium leading-tight">{goal.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-light via-background-light to-transparent dark:from-background-dark dark:via-background-dark pt-12 z-20">
        <button 
          onClick={onNavigate} 
          disabled={!selectedGoal}
          className={`w-full rounded-full h-16 font-bold text-lg shadow-xl flex items-center justify-center gap-2 transition-all duration-300 active:scale-95 ${selectedGoal ? 'bg-primary text-white shadow-primary/30 translate-y-0 opacity-100' : 'bg-gray-200 dark:bg-gray-800 text-gray-400 translate-y-4 opacity-50'}`}
        >
          C'est parti
          <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
