import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Card from '../ui/Card';

interface StatisticsScreenProps {
  onBack: () => void;
}

const StatisticsScreen = ({ onBack }: StatisticsScreenProps) => {
  const data = [
    { name: 'Lun', kcal: 1800, prot: 140 },
    { name: 'Mar', kcal: 2100, prot: 160 },
    { name: 'Mer', kcal: 1950, prot: 150 },
    { name: 'Jeu', kcal: 2300, prot: 180 },
    { name: 'Ven', kcal: 2000, prot: 155 },
    { name: 'Sam', kcal: 2500, prot: 170 },
    { name: 'Dim', kcal: 1900, prot: 145 },
  ];

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="min-h-[100svh] bg-natty-beige p-6 pt-safe pb-32 space-y-8 overflow-y-auto no-scrollbar">
      <header className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 bg-white rounded-xl shadow-sm"><ChevronLeft /></button>
        <h1 className="text-2xl font-bold">Analyses</h1>
      </header>

      <Card className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-bold">Calories (7 derniers jours)</h3>
          <div className="flex gap-2">
            <span className="w-3 h-3 bg-natty-teal rounded-full" />
            <span className="text-[10px] font-bold uppercase text-natty-charcoal/40 tracking-widest">Kcal</span>
          </div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorKcal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1C3D3D" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#1C3D3D" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#00000010" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                itemStyle={{ fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="kcal" stroke="#1C3D3D" strokeWidth={3} fillOpacity={1} fill="url(#colorKcal)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="font-bold">Protéines (g)</h3>
          <div className="flex gap-2">
            <span className="w-3 h-3 bg-natty-lime rounded-full" />
            <span className="text-[10px] font-bold uppercase text-natty-charcoal/40 tracking-widest">Grams</span>
          </div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#00000010" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} />
              <Tooltip 
                cursor={{ fill: '#C5D93720' }}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="prot" fill="#C5D937" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  );
};

export default StatisticsScreen;
