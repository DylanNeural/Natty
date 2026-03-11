import { motion } from 'motion/react';
import { ArrowLeft, TrendingUp, Calendar, ChevronRight, Drumstick, Wheat, Droplet, Flame, Target, Award, Zap, Sparkles, BarChart3, PieChart } from 'lucide-react';
import { Page } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

interface StatsProps {
  onNavigate: (page: Page) => void;
}

const weightData = [
  { day: 'Lun', weight: 79.2 },
  { day: 'Mar', weight: 78.8 },
  { day: 'Mer', weight: 78.5 },
  { day: 'Jeu', weight: 78.6 },
  { day: 'Ven', weight: 78.2 },
  { day: 'Sam', weight: 78.0 },
  { day: 'Dim', weight: 77.8 },
];

const macroData = [
  { name: 'Prot.', value: 145, target: 160, color: '#1D6B4F' },
  { name: 'Gluc.', value: 210, target: 240, color: '#DF842C' },
  { name: 'Lip.', value: 65, target: 80, color: '#E8956F' },
];

export const Stats = ({ onNavigate }: StatsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="w-full min-h-screen flex flex-col bg-[#FBF4EA] text-slate-900 relative grain noise overflow-x-hidden"
    >
      <header className="shrink-0 pt-14 px-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('profile')}
            className="h-11 w-11 rounded-2xl bg-white ring-1 ring-black/10 shadow-sm flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <h1 className="text-[28px] font-display font-bold tracking-tight">Statistiques</h1>
        </div>

        <div className="mt-6 flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
          {['7 jours', '30 jours', '3 mois', 'Année'].map((period, idx) => (
            <button 
              key={idx}
              className={`px-5 py-2.5 rounded-2xl text-[13px] font-sans whitespace-nowrap transition-all ${idx === 0 ? 'bg-[#201D16] text-[#FAEBDD] ring-1 ring-[#FAEBDD]/15 shadow-lg' : 'bg-white text-slate-700 ring-1 ring-black/10'}`}
            >
              {period}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pb-[calc(96px+34px)] pt-6 relative max-w-7xl mx-auto w-full">
        <section className="rounded-[32px] bg-white ring-1 ring-black/10 shadow-lg p-6 reveal">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[12px] font-sans text-slate-500 uppercase tracking-wider">Évolution du poids</p>
              <h2 className="text-[24px] font-display font-bold tracking-tight">-1.4 kg <span className="text-[14px] font-sans font-normal text-green-600">cette semaine</span></h2>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-[#EAF3EF] flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-[#1D6B4F]" />
            </div>
          </div>

          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weightData}>
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1D6B4F" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#1D6B4F" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#00000008" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  dy={10}
                />
                <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#1D6B4F" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorWeight)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-[32px] bg-[#0F3D2D] text-[#FBF4EA] p-6 shadow-xl relative overflow-hidden">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/5"></div>
            <Target className="w-6 h-6 text-[#C3D36D] mb-3" />
            <p className="text-[12px] font-sans opacity-70 uppercase tracking-wider">Objectif</p>
            <p className="text-[20px] font-display font-bold">75.0 kg</p>
            <div className="mt-4 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full w-[65%] bg-[#C3D36D]"></div>
            </div>
            <p className="mt-2 text-[11px] font-sans opacity-60">Encore 2.8 kg à perdre</p>
          </div>

          <div className="rounded-[32px] bg-white ring-1 ring-black/10 p-6 shadow-lg">
            <Award className="w-6 h-6 text-[#DF842C] mb-3" />
            <p className="text-[12px] font-sans text-slate-500 uppercase tracking-wider">Série</p>
            <p className="text-[20px] font-display font-bold">12 jours</p>
            <div className="mt-4 flex gap-1">
              {[1, 1, 1, 1, 1, 0, 0].map((v, i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full ${v ? 'bg-[#DF842C]' : 'bg-slate-100'}`}></div>
              ))}
            </div>
            <p className="mt-2 text-[11px] font-sans text-slate-400">Record : 15 jours</p>
          </div>
        </section>

        <section className="mt-6 rounded-[32px] bg-white ring-1 ring-black/10 shadow-lg p-6 reveal">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[18px] font-display font-bold tracking-tight">Moyenne des Macros</h3>
            <BarChart3 className="w-5 h-5 text-slate-400" />
          </div>

          <div className="space-y-6">
            {macroData.map((macro, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[14px] font-sans font-semibold text-slate-700">{macro.name}</span>
                  <span className="text-[14px] font-sans text-slate-500">
                    <span className="font-bold text-slate-900">{macro.value}g</span> / {macro.target}g
                  </span>
                </div>
                <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(macro.value / macro.target) * 100}%` }}
                    transition={{ duration: 1, delay: 0.2 * idx }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: macro.color }}
                  ></motion.div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 rounded-2xl bg-[#FBF4EA] ring-1 ring-black/5 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#DF842C] shrink-0 mt-0.5" />
            <p className="text-[13px] font-sans text-slate-700 leading-relaxed">
              <span className="font-bold">Analyse IA :</span> Tes apports en protéines sont excellents cette semaine. Augmente légèrement tes glucides les jours d'entraînement pour optimiser ta récupération.
            </p>
          </div>
        </section>

        <section className="mt-6 rounded-[32px] bg-[#FFF0E8] ring-1 ring-black/10 shadow-lg p-6 reveal">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[18px] font-display font-bold tracking-tight">Répartition Hebdo</h3>
            <PieChart className="w-5 h-5 text-[#DF842C]" />
          </div>
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-full border-[12px] border-[#1D6B4F] border-r-[#DF842C] border-b-[#E8956F] flex items-center justify-center">
              <span className="text-[14px] font-display font-bold">Natty</span>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#1D6B4F]"></div>
                <span className="text-[12px] font-sans text-slate-600">Protéines (35%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#DF842C]"></div>
                <span className="text-[12px] font-sans text-slate-600">Glucides (45%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#E8956F]"></div>
                <span className="text-[12px] font-sans text-slate-600">Lipides (20%)</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </motion.div>
  );
};
