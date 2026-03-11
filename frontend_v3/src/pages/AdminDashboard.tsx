import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Users, 
  Refrigerator, 
  ShoppingBag, 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity, 
  AlertCircle,
  ChevronRight,
  Search,
  Bell,
  Settings
} from 'lucide-react';
import { Page } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  AreaChart,
  Area
} from 'recharts';

interface AdminDashboardProps {
  onNavigate: (page: Page) => void;
}

const revenueData = [
  { name: 'Lun', value: 1200 },
  { name: 'Mar', value: 1900 },
  { name: 'Mer', value: 1500 },
  { name: 'Jeu', value: 2100 },
  { name: 'Ven', value: 2800 },
  { name: 'Sam', value: 3200 },
  { name: 'Dim', value: 2900 },
];

const scanData = [
  { name: '08h', value: 45 },
  { name: '10h', value: 120 },
  { name: '12h', value: 340 },
  { name: '14h', value: 210 },
  { name: '16h', value: 180 },
  { name: '18h', value: 450 },
  { name: '20h', value: 290 },
];

export const AdminDashboard = ({ onNavigate }: AdminDashboardProps) => {
  const stats = [
    { label: 'Revenu Total', value: '14,280€', change: '+12.5%', trend: 'up', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Utilisateurs Actifs', value: '2,840', change: '+5.2%', trend: 'up', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Scans IA (24h)', value: '1,245', change: '-2.1%', trend: 'down', icon: Activity, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Frigos Alertes', value: '2', change: 'Stable', trend: 'neutral', icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  const navItems = [
    { id: 'admin-dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'admin-users', label: 'Utilisateurs', icon: Users },
    { id: 'admin-fridges', label: 'Frigos Natty', icon: Refrigerator },
    { id: 'admin-orders', label: 'Commandes', icon: ShoppingBag },
  ];

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      {/* Admin Sidebar/Nav (Mobile friendly top bar) */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#1D6B4F] flex items-center justify-center shadow-lg shadow-[#1D6B4F]/20">
                <span className="text-white font-display font-bold text-xl">N</span>
              </div>
              <div>
                <h1 className="text-lg font-display font-bold tracking-tight">Natty Admin</h1>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Console de Gestion</p>
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
                  item.id === 'admin-dashboard' 
                    ? 'bg-[#1D6B4F] text-white shadow-md shadow-[#1D6B4F]/20' 
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-6 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-5 rounded-[24px] border border-slate-200 shadow-sm"
            >
              <div className={`h-10 w-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
              <div className="flex items-end justify-between">
                <h3 className="text-xl font-display font-bold">{stat.value}</h3>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 ${
                  stat.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 
                  stat.trend === 'down' ? 'bg-rose-50 text-rose-600' : 
                  'bg-slate-50 text-slate-500'
                }`}>
                  {stat.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                  {stat.trend === 'down' && <TrendingDown className="w-3 h-3" />}
                  {stat.change}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Revenue Chart */}
        <section className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-display font-bold">Revenus Hebdomadaires</h3>
              <p className="text-sm text-slate-500">Performance des ventes frigos</p>
            </div>
            <select className="bg-slate-50 border-none rounded-xl text-xs font-bold px-3 py-2 outline-none ring-1 ring-slate-200">
              <option>7 derniers jours</option>
              <option>30 derniers jours</option>
            </select>
          </div>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1D6B4F" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#1D6B4F" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="value" stroke="#1D6B4F" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Activity Chart */}
        <section className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-display font-bold">Pics d'Activité Scans</h3>
              <p className="text-sm text-slate-500">Utilisation de l'IA par heure</p>
            </div>
            <Activity className="w-5 h-5 text-slate-400" />
          </div>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scanData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#1D6B4F" radius={[6, 6, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Recent Alerts */}
        <section className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
          <h3 className="text-lg font-display font-bold mb-4">Alertes Systèmes</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-rose-50 border border-rose-100">
              <div className="h-10 w-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-rose-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-rose-900">Température élevée</p>
                <p className="text-xs text-rose-700">Frigo #04 (Station F) - 6.2°C</p>
              </div>
              <button className="text-xs font-bold text-rose-600 bg-white px-3 py-1.5 rounded-lg shadow-sm">Gérer</button>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-amber-50 border border-amber-100">
              <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                <Refrigerator className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-amber-900">Stock faible</p>
                <p className="text-xs text-amber-700">Frigo #01 (Bourse) - 12% restants</p>
              </div>
              <button className="text-xs font-bold text-amber-600 bg-white px-3 py-1.5 rounded-lg shadow-sm">Remplir</button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
