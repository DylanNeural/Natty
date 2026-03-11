import { motion } from 'motion/react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  ArrowLeft, 
  LayoutDashboard, 
  Users, 
  Refrigerator,
  Clock,
  CheckCircle2,
  XCircle,
  MoreVertical,
  ChevronRight,
  DollarSign,
  Bell,
  Package
} from 'lucide-react';
import { Page } from '../types';

interface AdminOrdersProps {
  onNavigate: (page: Page) => void;
}

const orders = [
  { id: 'NAT-8421', user: 'Dylan P.', items: '2x Salade César, 1x Bowl Poulet', amount: '36,40€', status: 'Payé', time: 'Il y a 12 min', location: 'Natty Bourse' },
  { id: 'NAT-8420', user: 'Marie L.', items: '1x Yaourt Grec, 1x Jus Détox', amount: '8,50€', status: 'Collecté', time: 'Il y a 45 min', location: 'Natty Opera' },
  { id: 'NAT-8419', user: 'Thomas B.', items: '3x Saumon Teriyaki', amount: '38,70€', status: 'Payé', time: 'Il y a 1h', location: 'Natty Defense' },
  { id: 'NAT-8418', user: 'Sophie K.', items: '1x Bowl Quinoa', amount: '12,90€', status: 'Annulé', time: 'Il y a 3h', location: 'Natty Bourse' },
  { id: 'NAT-8417', user: 'Jean D.', items: '2x Wrap Poulet, 2x Eau', amount: '22,00€', status: 'Collecté', time: 'Il y a 5h', location: 'Natty Opera' },
];

export const AdminOrders = ({ onNavigate }: AdminOrdersProps) => {
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
              <h1 className="text-lg font-display font-bold tracking-tight">Commandes</h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Flux de Ventes</p>
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
                item.id === 'admin-orders' 
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
              placeholder="Rechercher une commande..." 
              className="w-full h-12 rounded-xl bg-white border border-slate-200 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1D6B4F]/20 transition-all"
            />
          </div>
          <button className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order, idx) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white p-5 rounded-[24px] border border-slate-200 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">#{order.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    order.status === 'Payé' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 
                    order.status === 'Collecté' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                    'bg-rose-50 text-rose-600 border border-rose-100'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {order.time}
                </span>
              </div>

              <div className="flex items-start gap-4 mb-4">
                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5 text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold truncate">{order.user}</h3>
                  <p className="text-xs text-slate-500 truncate">{order.items}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-display font-bold text-[#1D6B4F]">{order.amount}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{order.location}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 h-10 rounded-xl bg-slate-50 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors">
                  Détails
                </button>
                <button className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary Card */}
        <section className="bg-[#1D6B4F] text-white p-6 rounded-[32px] shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-white/5"></div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-1">Ventes du jour</p>
              <h3 className="text-2xl font-display font-bold">1,240.50€</h3>
              <p className="text-[11px] text-white/40 mt-1">+15% par rapport à hier</p>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center">
              <DollarSign className="w-7 h-7 text-[#C3D36D]" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
