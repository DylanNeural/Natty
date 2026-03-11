import { Home, ScanLine, CalendarCheck, Refrigerator, User } from 'lucide-react';
import { Page } from '../types';

interface BottomNavigationProps {
  activeTab: Page;
  onTabChange: (tab: Page) => void;
}

export const BottomNavigation = ({ activeTab, onTabChange }: BottomNavigationProps) => {
  const tabs = [
    { id: 'dashboard', label: 'Accueil', icon: Home },
    { id: 'scanner', label: 'Scan', icon: ScanLine },
    { id: 'plan', label: 'Plan', icon: CalendarCheck },
    { id: 'fridge', label: 'Frigo', icon: Refrigerator },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  return (
    <footer className="absolute bottom-0 left-0 right-0 pb-[34px] px-5 z-50 pointer-events-none">
      <nav className="bg-white ring-1 ring-black/10 shadow-[0_18px_60px_-40px_rgba(0,0,0,0.55)] rounded-[26px] px-3 py-2 flex items-center justify-between pointer-events-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id || 
            (tab.id === 'profile' && ['meal-history', 'stats', 'favorites', 'settings'].includes(activeTab)) ||
            (tab.id === 'fridge' && ['fridge-locator', 'cart', 'order-tracking', 'order-confirmation'].includes(activeTab));
            
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id as Page)}
              className={`flex flex-col items-center justify-center gap-1 h-14 w-[64px] rounded-2xl transition-colors ${isActive ? 'bg-[#FBF4EA] ring-1 ring-black/10' : 'hover:bg-[#FBF4EA]'}`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-slate-900' : 'text-slate-700'}`} />
              <span className={`text-[12px] font-medium ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </footer>
  );
};
