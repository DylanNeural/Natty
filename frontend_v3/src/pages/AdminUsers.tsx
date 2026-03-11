import { motion } from 'motion/react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  ArrowLeft, 
  LayoutDashboard, 
  Refrigerator, 
  ShoppingBag,
  Mail,
  Calendar,
  Shield,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Bell
} from 'lucide-react';
import { Page } from '../types';

interface AdminUsersProps {
  onNavigate: (page: Page) => void;
}

const users = [
  { id: 1, name: 'Dylan P.', email: 'dylan-psupp@outlook.fr', status: 'Premium', joined: '11 Mars 2026', scans: 42, orders: 8, avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100' },
  { id: 2, name: 'Marie L.', email: 'marie.l@gmail.com', status: 'Gratuit', joined: '10 Mars 2026', scans: 12, orders: 2, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100' },
  { id: 3, name: 'Thomas B.', email: 't.bernard@yahoo.fr', status: 'Premium', joined: '08 Mars 2026', scans: 89, orders: 15, avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100' },
  { id: 4, name: 'Sophie K.', email: 'sophie.k@icloud.com', status: 'Gratuit', joined: '05 Mars 2026', scans: 5, orders: 0, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100' },
  { id: 5, name: 'Lucas M.', email: 'lucas.m@natty.fr', status: 'Admin', joined: '01 Jan 2026', scans: 156, orders: 4, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100' },
];

export const AdminUsers = ({ onNavigate }: AdminUsersProps) => {
  const navItems = [
    { id: 'admin-dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'admin-users', label: 'Utilisateurs', icon: Users },
    { id: 'admin-fridges', label: 'Frigos Natty', icon: Refrigerator },
    { id: 'admin-orders', label: 'Commandes', icon: ShoppingBag },
  ];

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#1D6B4F] flex items-center justify-center shadow-lg shadow-[#1D6B4F]/20">
              <span className="text-white font-display font-bold text-xl">N</span>
            </div>
            <div>
              <h1 className="text-lg font-display font-bold tracking-tight">Utilisateurs</h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Gestion de la Communauté</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button 
              onClick={() => onNavigate('profile')}
              className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as Page)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                item.id === 'admin-users' 
                  ? 'bg-[#1D6B4F] text-white shadow-md shadow-[#1D6B4F]/20' 
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Search & Filter */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Rechercher un utilisateur..." 
              className="w-full h-12 rounded-xl bg-white border border-slate-200 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1D6B4F]/20 transition-all"
            />
          </div>
          <button className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Users List */}
        <div className="space-y-4">
          {users.map((user, idx) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white p-4 rounded-[24px] border border-slate-200 shadow-sm flex items-center gap-4"
            >
              <div className="h-12 w-12 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-sm font-bold truncate">{user.name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    user.status === 'Premium' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 
                    user.status === 'Admin' ? 'bg-slate-900 text-white' :
                    'bg-slate-50 text-slate-500 border border-slate-200'
                  }`}>
                    {user.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {user.email}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Activité</p>
                <div className="flex items-center gap-2">
                  <div className="text-center">
                    <p className="text-[12px] font-bold">{user.scans}</p>
                    <p className="text-[8px] text-slate-400 font-bold uppercase">Scans</p>
                  </div>
                  <div className="w-px h-6 bg-slate-100"></div>
                  <div className="text-center">
                    <p className="text-[12px] font-bold">{user.orders}</p>
                    <p className="text-[8px] text-slate-400 font-bold uppercase">Cmds</p>
                  </div>
                </div>
              </div>
              <button className="h-10 w-10 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <section className="bg-slate-900 text-white p-6 rounded-[32px] shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5"></div>
          <div className="relative z-10">
            <h3 className="text-lg font-display font-bold mb-2">Actions de Masse</h3>
            <p className="text-sm text-slate-400 mb-6">Gérer plusieurs utilisateurs en même temps.</p>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 h-12 rounded-2xl text-sm font-bold transition-all">
                <Mail className="w-4 h-4" />
                Emailing
              </button>
              <button className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 h-12 rounded-2xl text-sm font-bold transition-all">
                <Shield className="w-4 h-4" />
                Rôles
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
