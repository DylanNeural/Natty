import { 
  LayoutDashboard, 
  Scan, 
  Calendar, 
  Refrigerator, 
  User, 
  Settings, 
  History, 
  BarChart3, 
  Heart, 
  ShieldAlert,
  LogOut,
  Bell
} from 'lucide-react';
import { Page } from '../types';

interface SidebarProps {
  activeTab: Page;
  onTabChange: (page: Page) => void;
}

export const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'scanner', label: 'Scanner IA', icon: Scan },
    { id: 'plan', label: 'Mon Plan', icon: Calendar },
    { id: 'fridge', label: 'Frigos Natty', icon: Refrigerator },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  const secondaryItems = [
    { id: 'stats', label: 'Statistiques', icon: BarChart3 },
    { id: 'favorites', label: 'Favoris', icon: Heart },
    { id: 'meal-history', label: 'Historique', icon: History },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  const adminItems = [
    { id: 'admin-dashboard', label: 'Console Admin', icon: ShieldAlert },
  ];

  const isActive = (id: string) => {
    if (activeTab === id) return true;
    if (id === 'profile' && ['meal-history', 'stats', 'favorites', 'settings'].includes(activeTab)) return true;
    if (id === 'fridge' && ['fridge-locator', 'cart', 'order-tracking', 'order-confirmation'].includes(activeTab)) return true;
    return false;
  };

  return (
    <aside className="hidden md:flex flex-col w-72 bg-white border-r border-black/5 h-screen sticky top-0 shrink-0">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-10 w-10 rounded-xl bg-[#1D6B4F] flex items-center justify-center shadow-lg shadow-[#1D6B4F]/20">
            <span className="text-white font-display font-bold text-xl">N</span>
          </div>
          <h1 className="text-xl font-display font-bold tracking-tight">Natty</h1>
        </div>

        <nav className="space-y-1">
          <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Menu Principal</p>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id as Page)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                isActive(item.id)
                  ? 'bg-[#1D6B4F] text-white shadow-lg shadow-[#1D6B4F]/20'
                  : 'text-slate-600 hover:bg-[#FBF4EA] hover:text-slate-900'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive(item.id) ? 'text-white' : 'text-slate-400'}`} />
              {item.label}
            </button>
          ))}
        </nav>

        <nav className="mt-10 space-y-1">
          <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Personnel</p>
          {secondaryItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id as Page)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                activeTab === item.id
                  ? 'bg-[#FBF4EA] text-[#1D6B4F] ring-1 ring-black/5'
                  : 'text-slate-600 hover:bg-[#FBF4EA] hover:text-slate-900'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-[#1D6B4F]' : 'text-slate-400'}`} />
              {item.label}
            </button>
          ))}
        </nav>

        <nav className="mt-10 space-y-1">
          <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Administration</p>
          {adminItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id as Page)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                activeTab.startsWith('admin')
                  ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-100'
                  : 'text-slate-600 hover:bg-rose-50 hover:text-rose-600'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab.startsWith('admin') ? 'text-rose-600' : 'text-slate-400'}`} />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-8 border-t border-black/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-full bg-slate-100 border border-black/5 overflow-hidden">
            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" alt="Avatar" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">Dylan P.</p>
            <p className="text-xs text-slate-500 truncate">Premium Member</p>
          </div>
          <button className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors">
            <Bell className="w-4 h-4" />
          </button>
        </div>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-rose-600 hover:bg-rose-50 transition-all">
          <LogOut className="w-5 h-5" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
};
