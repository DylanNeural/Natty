import { motion } from 'motion/react';
import { 
  Refrigerator, 
  MapPin, 
  Thermometer, 
  Battery, 
  Package, 
  ArrowLeft, 
  LayoutDashboard, 
  Users, 
  ShoppingBag,
  AlertCircle,
  CheckCircle2,
  RefreshCcw,
  MoreVertical,
  Bell,
  Settings
} from 'lucide-react';
import { Page } from '../types';

interface AdminFridgesProps {
  onNavigate: (page: Page) => void;
}

const fridges = [
  { id: 'NAT-01', name: 'Natty Bourse', location: 'Station F, Paris', status: 'En ligne', temp: '3.2°C', stock: 88, battery: 95, lastSync: 'Il y a 2 min' },
  { id: 'NAT-02', name: 'Natty Opera', location: 'Galeries Lafayette, Paris', status: 'En ligne', temp: '3.5°C', stock: 42, battery: 82, lastSync: 'Il y a 5 min' },
  { id: 'NAT-03', name: 'Natty Defense', location: 'Tour First, Puteaux', status: 'En ligne', temp: '3.1°C', stock: 65, battery: 100, lastSync: 'Il y a 1 min' },
  { id: 'NAT-04', name: 'Natty Lyon', location: 'Gare Part-Dieu, Lyon', status: 'Alerte', temp: '6.2°C', stock: 12, battery: 45, lastSync: 'Il y a 12 min' },
  { id: 'NAT-05', name: 'Natty Lille', location: 'Euralille, Lille', status: 'Hors ligne', temp: '--', stock: 0, battery: 0, lastSync: 'Il y a 2h' },
];

export const AdminFridges = ({ onNavigate }: AdminFridgesProps) => {
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
              <h1 className="text-lg font-display font-bold tracking-tight">Frigos Natty</h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Monitoring Hardware</p>
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
                item.id === 'admin-fridges' 
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
        {/* Map Placeholder / Overview */}
        <div className="bg-slate-200 h-48 rounded-[32px] relative overflow-hidden flex items-center justify-center border border-slate-300">
          <img 
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800" 
            className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale"
            alt="Map"
          />
          <div className="relative z-10 text-center">
            <div className="flex -space-x-2 justify-center mb-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-8 w-8 rounded-full bg-[#1D6B4F] border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">
                  {i}
                </div>
              ))}
            </div>
            <p className="text-sm font-bold text-slate-800 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">5 Frigos Actifs en France</p>
          </div>
        </div>

        {/* Fridges List */}
        <div className="space-y-4">
          {fridges.map((fridge, idx) => (
            <motion.div
              key={fridge.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-5 rounded-[32px] border border-slate-200 shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${
                    fridge.status === 'En ligne' ? 'bg-emerald-50 text-emerald-600' : 
                    fridge.status === 'Alerte' ? 'bg-rose-50 text-rose-600' : 
                    'bg-slate-100 text-slate-400'
                  }`}>
                    <Refrigerator className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold">{fridge.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {fridge.location}
                    </p>
                  </div>
                </div>
                <div className={`text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                  fridge.status === 'En ligne' ? 'bg-emerald-50 text-emerald-600' : 
                  fridge.status === 'Alerte' ? 'bg-rose-50 text-rose-600' : 
                  'bg-slate-100 text-slate-400'
                }`}>
                  <div className={`h-1.5 w-1.5 rounded-full ${
                    fridge.status === 'En ligne' ? 'bg-emerald-600' : 
                    fridge.status === 'Alerte' ? 'bg-rose-600 animate-pulse' : 
                    'bg-slate-400'
                  }`}></div>
                  {fridge.status}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-slate-50 p-3 rounded-2xl text-center">
                  <Thermometer className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                  <p className="text-[14px] font-bold">{fridge.temp}</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">Temp</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl text-center">
                  <Package className="w-4 h-4 text-[#DF842C] mx-auto mb-1" />
                  <p className="text-[14px] font-bold">{fridge.stock}%</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">Stock</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl text-center">
                  <Battery className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
                  <p className="text-[14px] font-bold">{fridge.battery}%</p>
                  <p className="text-[9px] text-slate-400 font-bold uppercase">Bat.</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <p className="text-[11px] text-slate-400 font-medium">Dernière synchro : {fridge.lastSync}</p>
                <div className="flex gap-2">
                  <button className="h-9 w-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors">
                    <RefreshCcw className="w-4 h-4" />
                  </button>
                  <button className="h-9 px-4 rounded-xl bg-[#1D6B4F] text-white text-xs font-bold shadow-md shadow-[#1D6B4F]/20">
                    Gérer
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <button className="w-full h-16 rounded-[28px] border-2 border-dashed border-slate-300 text-slate-400 font-bold text-[15px] flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
          <Refrigerator className="w-5 h-5" />
          Ajouter un nouveau Frigo
        </button>
      </main>
    </div>
  );
};
