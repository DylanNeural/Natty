
import React, { useState } from 'react';

interface Props {
  onNavigate: () => void;
}

export const DietaryPreferences: React.FC<Props> = ({ onNavigate }) => {
  const [selectedDiets, setSelectedDiets] = useState<string[]>(['Végétarien']);
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>(['Gluten']);

  const toggleDiet = (diet: string) => {
    if (selectedDiets.includes(diet)) {
      setSelectedDiets(selectedDiets.filter(d => d !== diet));
    } else {
      setSelectedDiets([...selectedDiets, diet]);
    }
  };

  const toggleAllergy = (allergy: string) => {
    if (selectedAllergies.includes(allergy)) {
      setSelectedAllergies(selectedAllergies.filter(a => a !== allergy));
    } else {
      setSelectedAllergies([...selectedAllergies, allergy]);
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-background-light dark:bg-background-dark font-display relative overflow-hidden">
      
       {/* Decorative Elements */}
       <div className="absolute top-20 -left-20 size-64 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>
       <div className="absolute bottom-40 -right-20 size-64 bg-accent/10 rounded-full blur-3xl pointer-events-none"></div>

      <header className="relative z-10 flex items-center justify-between p-6 pb-2">
        <button onClick={onNavigate} aria-label="Retour" className="p-2 -ml-2 rounded-full active:bg-gray-100 dark:active:bg-white/10 transition-colors">
          <span className="material-symbols-outlined text-text-light dark:text-text-dark" aria-hidden="true">arrow_back</span>
        </button>
        <div className="flex gap-1">
             <div className="size-2 rounded-full bg-primary/20"></div>
             <div className="size-2 rounded-full bg-primary/20"></div>
             <div className="size-2 rounded-full bg-primary"></div>
             <div className="size-2 rounded-full bg-primary/20"></div>
        </div>
      </header>

      <main className="relative z-10 flex-grow flex flex-col px-6 pb-32 overflow-y-auto no-scrollbar">
        <div className="pt-2 pb-8">
            <h1 className="text-4xl font-bold text-text-light dark:text-text-dark mb-3">Nutrition <br /><span className="text-secondary">Sur Mesure</span></h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
            Dites-nous ce que vous mangez (et ce que vous évitez) pour un menu parfait.
            </p>
        </div>

        <div className="space-y-8 animate-fade-in-up">
          <Section title="Vos Préférences" icon="restaurant_menu">
            <div className="flex flex-wrap gap-3">
                {['Omnivore', 'Végétarien', 'Vegan', 'Pescatarien', 'Keto', 'Paleo'].map(diet => (
                    <Chip 
                        key={diet} 
                        label={diet} 
                        selected={selectedDiets.includes(diet)} 
                        onClick={() => toggleDiet(diet)} 
                    />
                ))}
            </div>
          </Section>

          <Section title="Allergies & Intolérances" icon="warning">
             <div className="flex flex-wrap gap-3">
                {['Aucune', 'Gluten', 'Lactose', 'Arachides', 'Soja', 'Fruits de mer', 'Oeufs'].map(allergy => (
                    <Chip 
                        key={allergy} 
                        label={allergy} 
                        selected={selectedAllergies.includes(allergy)} 
                        onClick={() => toggleAllergy(allergy)} 
                        variant="warning"
                    />
                ))}
            </div>
          </Section>

          <div className="pt-2">
            <h2 className="text-lg font-bold mb-3 text-text-light dark:text-text-dark flex items-center gap-2">
                <span className="material-symbols-outlined text-gray-400" aria-hidden="true">edit_note</span>
                Restrictions Spécifiques
            </h2>
            <div className="relative">
                <input 
                type="text" 
                placeholder="Ex: Je déteste la coriandre..."
                aria-label="Restrictions spécifiques"
                className="w-full rounded-2xl border-0 bg-white dark:bg-card-dark px-5 py-4 text-text-light dark:text-text-dark placeholder-gray-400 shadow-sm focus:ring-2 focus:ring-primary/50 transition-all"
                />
                <button aria-label="Ajouter" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-500 active:text-primary transition-colors">
                    <span className="material-symbols-outlined text-xl" aria-hidden="true">add</span>
                </button>
            </div>
          </div>
        </div>
      </main>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background-light via-background-light to-transparent dark:from-background-dark dark:via-background-dark pt-12 z-20">
        <button 
            onClick={onNavigate} 
            className="w-full rounded-full h-16 bg-gradient-to-r from-primary to-secondary text-white font-bold text-lg shadow-xl shadow-primary/30 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          Valider mon profil
          <span className="material-symbols-outlined" aria-hidden="true">check_circle</span>
        </button>
      </div>
    </div>
  );
};

const Section: React.FC<{title: string; icon: string; children: React.ReactNode}> = ({ title, icon, children }) => (
  <div>
    <h2 className="text-lg font-bold mb-4 text-text-light dark:text-text-dark flex items-center gap-2">
        <span className="material-symbols-outlined text-primary" aria-hidden="true">{icon}</span>
        {title}
    </h2>
    <div>{children}</div>
  </div>
);

const Chip: React.FC<{label: string; selected: boolean; onClick: () => void; variant?: 'default' | 'warning'}> = ({ label, selected, onClick, variant = 'default' }) => {
    const activeColor = variant === 'warning' ? 'bg-warning text-white border-warning' : 'bg-primary text-white border-primary';
    
    return (
        <button 
            onClick={onClick}
            aria-pressed={selected}
            className={`px-5 py-3 rounded-2xl font-medium text-sm transition-all duration-200 border border-gray-200 dark:border-gray-800 shadow-sm active:scale-95 ${selected ? `${activeColor} shadow-lg` : 'bg-white dark:bg-card-dark text-text-light dark:text-gray-300'}`}
        >
            {label}
        </button>
    );
};
