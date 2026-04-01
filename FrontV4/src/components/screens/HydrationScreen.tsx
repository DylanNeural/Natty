import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Droplets, Plus, X } from 'lucide-react';
import { UserProfile } from '../../types';

interface HydrationScreenProps {
  user: UserProfile;
  onBack: () => void;
}

const HydrationScreen = ({ user, onBack }: HydrationScreenProps) => {
  const [current, setCurrent] = useState(user.waterIntake.current);
  const goal = user.waterIntake.goal;
  const percentage = Math.min(100, (current / goal) * 100);

  const addWater = (amount: number) => setCurrent(prev => Math.max(0, prev + amount));

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="min-h-[100svh] bg-blue-50 p-6 pt-safe pb-32 flex flex-col overflow-y-auto no-scrollbar">
      <header className="flex items-center gap-4 mb-12">
        <button onClick={onBack} className="p-2 bg-white rounded-xl shadow-sm text-blue-600"><ChevronLeft /></button>
        <h1 className="text-2xl font-bold text-blue-900">Hydratation</h1>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center space-y-12">
        <div className="relative w-64 h-64">
          <svg className="w-full h-full -rotate-90">
            <circle cx="128" cy="128" r="120" fill="none" stroke="#00000005" strokeWidth="12" />
            <motion.circle 
              cx="128" cy="128" r="120" 
              fill="none" stroke="#3B82F6" 
              strokeWidth="12" 
              strokeDasharray="753.9" 
              initial={{ strokeDashoffset: 753.9 }}
              animate={{ strokeDashoffset: 753.9 - (753.9 * percentage) / 100 }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <Droplets className="text-blue-500 mb-2" size={40} />
            <span className="text-5xl font-black text-blue-900">{current.toFixed(1)}</span>
            <span className="text-sm font-bold text-blue-900/40 uppercase tracking-widest">sur {goal}L</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 w-full">
          {[
            { amount: 0.25, label: '250ml', icon: '💧' },
            { amount: 0.5, label: '500ml', icon: '🥤' },
            { amount: 1.0, label: '1L', icon: '🍶' },
          ].map(item => (
            <button 
              key={item.label}
              onClick={() => addWater(item.amount)}
              className="bg-white p-4 rounded-3xl shadow-sm border border-blue-100 flex flex-col items-center gap-2 active:scale-95 transition-transform"
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-xs font-bold text-blue-900">{item.label}</span>
              <Plus size={16} className="text-blue-500" />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 bg-blue-600 text-white p-6 rounded-[40px] flex justify-between items-center">
        <div>
          <p className="text-blue-100 text-sm font-medium">Objectif atteint</p>
          <h3 className="text-2xl font-black">{percentage.toFixed(0)}%</h3>
        </div>
        <button onClick={() => setCurrent(0)} className="p-3 bg-white/10 rounded-2xl"><X size={20} /></button>
      </div>
    </motion.div>
  );
};

export default HydrationScreen;
