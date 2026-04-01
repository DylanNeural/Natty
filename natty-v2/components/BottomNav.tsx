
import React from 'react';
import { Screen } from '../App';

interface Props {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export const BottomNav: React.FC<Props> = ({ currentScreen, onNavigate }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 pointer-events-none flex items-end justify-center pb-6 z-50">
      <div className="pointer-events-auto relative flex w-auto min-w-[320px] max-w-md items-center justify-between rounded-full bg-[#30520e] px-6 h-14 shadow-2xl shadow-primary/30 backdrop-blur-xl border border-white/10">
        
        <NavItem 
          icon="grid_view" 
          label="Tableau de bord"
          isActive={currentScreen === Screen.DASHBOARD} 
          onClick={() => onNavigate(Screen.DASHBOARD)} 
        />

        <NavItem 
          icon="location_on" 
          label="Carte"
          isActive={currentScreen === Screen.MAP} 
          onClick={() => onNavigate(Screen.MAP)} 
        />
        
        {/* Central Item - Scanner (Floating & Distinct) */}
        <div className="relative -top-6 group mx-2">
             <button 
               onClick={() => onNavigate(Screen.IMAGE_EDITOR)}
               aria-label="Scanner une assiette"
               className={`relative size-16 rounded-full flex items-center justify-center transform transition-all duration-300 shadow-[0_8px_25px_rgba(46,171,75,0.5)] border-[4px] border-[#F7F8FC] dark:border-[#101419] ${currentScreen === Screen.IMAGE_EDITOR ? 'bg-[#2eab4b] text-white scale-105' : 'bg-[#2eab4b] text-white active:scale-95 hover:scale-105'}`}
             >
                <span className={`material-symbols-outlined text-[28px] ${currentScreen === Screen.IMAGE_EDITOR ? 'filled' : ''}`} aria-hidden="true">center_focus_strong</span>
             </button>
        </div>

        <NavItem 
          icon="groups" 
          label="Club Social"
          isActive={currentScreen === Screen.SOCIAL_CLUB} 
          onClick={() => onNavigate(Screen.SOCIAL_CLUB)} 
        />

        <NavItem 
          icon="person" 
          label="Profil"
          isActive={currentScreen === Screen.PROFILE} 
          onClick={() => onNavigate(Screen.PROFILE)} 
        />
      </div>
    </div>
  );
};

const NavItem: React.FC<{icon: string; label: string; isActive: boolean; onClick: () => void}> = ({ icon, label, isActive, onClick }) => (
  <button 
    onClick={onClick}
    aria-label={label}
    className="relative flex items-center justify-center size-10 active:scale-90 transition-transform"
  >
    <span className={`material-symbols-outlined text-[24px] transition-all duration-300 ${isActive ? 'text-[#2eab4b] filled -translate-y-1' : 'text-white/50'}`} aria-hidden="true">{icon}</span>
    {isActive && <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-[#2eab4b]"></div>}
  </button>
);
