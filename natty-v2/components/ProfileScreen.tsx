
import React from 'react';

interface Props {
  onLogout: () => void;
}

export const ProfileScreen: React.FC<Props> = ({ onLogout }) => {
  return (
    <div className="flex flex-col h-full bg-background-light dark:bg-background-dark pb-32">
      <header className="flex items-center justify-center p-4 relative">
        <h1 className="text-xl font-bold text-primary dark:text-text-dark">Profil & Paramètres</h1>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pt-4 no-scrollbar">
        {/* Profile Card */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4 group">
             <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"></div>
             <div className="relative size-36 rounded-full border-4 border-white dark:border-card-dark bg-cover bg-center shadow-2xl" 
                  role="img"
                  aria-label="Photo de profil de Alex Johnson"
                  style={{backgroundImage: 'url("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2787&auto=format&fit=crop")'}}></div>
             <button aria-label="Modifier la photo de profil" className="absolute bottom-1 right-1 p-2.5 rounded-full bg-warning text-white shadow-lg border-4 border-background-light dark:border-background-dark active:scale-90 transition-transform">
               <span className="material-symbols-outlined text-xl" aria-hidden="true">edit</span>
             </button>
          </div>
          <h2 className="text-3xl font-bold text-text-light dark:text-text-dark">Alex Johnson</h2>
          <div className="flex items-center gap-1 mt-2 bg-gradient-to-r from-secondary/10 to-primary/10 px-4 py-1.5 rounded-full border border-secondary/20">
            <span className="material-symbols-outlined text-secondary text-sm filled" aria-hidden="true">verified</span>
            <p className="text-secondary font-bold text-sm">Membre Pro</p>
          </div>
        </div>

        {/* Toggle */}
        <div className="flex p-1.5 bg-white dark:bg-card-dark border border-gray-100 dark:border-gray-800 rounded-full mb-8 mx-8 shadow-sm">
           <button className="flex-1 py-2.5 rounded-full bg-primary text-white font-bold text-sm shadow-md transition-all" aria-pressed="true">Profil</button>
           <button className="flex-1 py-2.5 rounded-full text-gray-500 dark:text-gray-400 font-bold text-sm active:text-primary transition-all" aria-pressed="false">Paramètres</button>
        </div>

        {/* Info Section */}
        <div className="space-y-6">
          <Section title="Informations Personnelles">
            <ListItem icon="person" label="Nom" value="Alex Johnson" />
            <ListItem icon="cake" label="Âge" value="28 ans" />
            <ListItem icon="weight" label="Poids" value="75 kg" />
          </Section>

          <Section title="Objectifs & Régime">
            <ListItem icon="flag" label="Objectif Principal" value="Prise de muscle" color="text-warning" />
            <ListItem icon="restaurant_menu" label="Préférences" value="Végan" color="text-secondary" />
          </Section>

          <Section title="Accès Coach">
            <div 
              className="flex items-center gap-4 bg-white dark:bg-card-dark p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 active:bg-gray-50 dark:active:bg-gray-800 transition-colors cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label="Gérer l'accès au coach Sarah Jenkins"
            >
              <img className="size-14 rounded-full object-cover ring-2 ring-gray-100 dark:ring-gray-700" src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2940&auto=format&fit=crop" alt="Coach Sarah Jenkins" />
              <div className="flex-1">
                <p className="font-bold text-text-light dark:text-text-dark text-lg">Sarah Jenkins</p>
                <p className="text-xs text-secondary font-bold uppercase tracking-wide">Coach Performance</p>
              </div>
              <button className="px-5 py-2.5 bg-primary text-white font-bold text-sm rounded-xl active:bg-primary/90 transition-colors shadow-md shadow-primary/20">Gérer</button>
            </div>
          </Section>

          <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-bold text-lg active:bg-gray-200 dark:active:bg-gray-700 transition-colors mt-4">
             <span className="material-symbols-outlined" aria-hidden="true">logout</span>
             Déconnexion
          </button>
          
          <div className="text-center pb-4 text-sm text-gray-400 mt-4">
            <a href="#" className="underline active:text-primary">Support</a> • <a href="#" className="underline active:text-primary">Feedback</a>
          </div>
        </div>
      </main>
    </div>
  );
};

const Section: React.FC<{title: string; children: React.ReactNode}> = ({ title, children }) => (
  <div className="flex flex-col gap-3">
    <h3 className="text-lg font-bold text-text-light dark:text-text-dark px-1">{title}</h3>
    <div className="flex flex-col gap-3">{children}</div>
  </div>
);

const ListItem: React.FC<{icon: string; label: string; value: string; color?: string}> = ({ icon, label, value, color = "text-text-light dark:text-text-dark" }) => (
  <div className="flex items-center justify-between p-4 bg-white dark:bg-card-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 active:scale-[0.98] transition-all cursor-pointer" role="button" tabIndex={0} aria-label={`${label}: ${value}`}>
    <div className="flex items-center gap-4">
      <div className="size-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400">
        <span className="material-symbols-outlined" aria-hidden="true">{icon}</span>
      </div>
      <span className="font-medium text-text-light dark:text-text-dark text-base">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      <span className={`font-bold ${color}`}>{value}</span>
      <span className="material-symbols-outlined text-gray-300" aria-hidden="true">chevron_right</span>
    </div>
  </div>
);
