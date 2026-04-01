import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Clock, Zap, Droplets, X } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface FastingScreenProps {
  onBack: () => void;
}

const FastingScreen = ({ onBack }: FastingScreenProps) => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(16 * 3600); // 16 hours in seconds

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = (1 - timeLeft / (16 * 3600)) * 100;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="min-h-[100svh] bg-natty-orange/5 p-6 pt-safe pb-32 flex flex-col overflow-y-auto no-scrollbar">
      <header className="flex items-center gap-4 mb-12">
        <button onClick={onBack} className="p-2 bg-white rounded-xl shadow-sm text-natty-orange"><ChevronLeft /></button>
        <h1 className="text-2xl font-bold text-natty-orange">Jeûne Intermittent</h1>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center space-y-12">
        <div className="relative w-72 h-72">
          <svg className="w-full h-full -rotate-90">
            <circle cx="144" cy="144" r="130" fill="none" stroke="#00000005" strokeWidth="16" />
            <motion.circle 
              cx="144" cy="144" r="130" 
              fill="none" stroke="#F27D26" 
              strokeWidth="16" 
              strokeDasharray="816.8" 
              initial={{ strokeDashoffset: 816.8 }}
              animate={{ strokeDashoffset: 816.8 - (816.8 * progress) / 100 }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <Clock className="text-natty-orange mb-4" size={48} />
            <span className="text-5xl font-black text-natty-orange font-mono">{formatTime(timeLeft)}</span>
            <p className="text-sm font-bold text-natty-orange/40 uppercase tracking-widest mt-2">Temps restant</p>
          </div>
        </div>

        <div className="space-y-4 w-full">
          <div className="bg-white p-6 rounded-[40px] shadow-sm border border-natty-orange/10 flex justify-between items-center">
            <div>
              <h4 className="font-bold">Protocole 16:8</h4>
              <p className="text-xs text-natty-charcoal/40">Jeûne de 16h, fenêtre de 8h</p>
            </div>
            <button className="text-natty-orange font-bold text-sm">Modifier</button>
          </div>
          
          <Button 
            onClick={() => setIsActive(!isActive)}
            variant="orange" 
            className="w-full py-6 text-xl"
          >
            {isActive ? 'Mettre en pause' : 'Démarrer le jeûne'}
          </Button>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-4">
        <Card className="p-4 bg-white border-none flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center"><Zap size={20} /></div>
          <div>
            <p className="text-[10px] font-bold text-natty-charcoal/40 uppercase">Autophagie</p>
            <p className="font-bold">Dans 4h</p>
          </div>
        </Card>
        <Card className="p-4 bg-white border-none flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center"><Droplets size={20} /></div>
          <div>
            <p className="text-[10px] font-bold text-natty-charcoal/40 uppercase">Hydratation</p>
            <p className="font-bold">Essentiel</p>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default FastingScreen;
