import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, Activity, Droplets, Clock, Crown, Footprints, Flame, Moon } from 'lucide-react';
import Card from '../ui/Card';
import { UserProfile, Screen } from '../../types';

interface PerformanceHubProps {
  user: UserProfile;
  onNavigate: (s: Screen) => void;
}

const PerformanceHub = ({ user, onNavigate }: PerformanceHubProps) => {
  const waterCurrent = user.waterIntake?.current || 0;
  const waterGoal = user.waterIntake?.goal || 2.5;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 space-y-8 pb-32 pt-safe">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-natty-teal">Performance Hub</h1>
          <p className="text-sm text-natty-charcoal/40 font-medium">Optimise tes résultats</p>
        </div>
        <div className="w-12 h-12 bg-natty-lime rounded-2xl flex items-center justify-center text-natty-teal">
          <TrendingUp size={24} />
        </div>
      </header>

      <section className="space-y-4">
        <h3 className="font-bold text-lg">Mes Métriques</h3>
        <div className="grid grid-cols-2 gap-4">
          <Card onClick={() => onNavigate('statistics')} className="p-5 space-y-4 bg-gradient-to-br from-natty-teal to-natty-teal/80 text-white border-none shadow-lg shadow-natty-teal/20">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Activity size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Stats</h3>
              <p className="text-xs text-white/60">Analyse tes progrès</p>
            </div>
          </Card>
          <Card onClick={() => onNavigate('hydration')} className="p-5 space-y-4 bg-gradient-to-br from-blue-600 to-blue-400 text-white border-none shadow-lg shadow-blue-500/20">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Droplets size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Eau</h3>
              <p className="text-xs text-white/60">{waterCurrent}L / {waterGoal}L</p>
            </div>
          </Card>
          <Card onClick={() => onNavigate('fasting')} className="p-5 space-y-4 bg-gradient-to-br from-natty-orange to-orange-400 text-white border-none shadow-lg shadow-natty-orange/20">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Clock size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Jeûne</h3>
              <p className="text-xs text-white/60">{user.fasting.protocol}</p>
            </div>
          </Card>
          <Card onClick={() => onNavigate('elite')} className="p-5 space-y-4 bg-gradient-to-br from-natty-charcoal to-black text-white border-none relative overflow-hidden shadow-lg shadow-black/20">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-natty-lime/20 rounded-full blur-2xl" />
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Crown size={24} className="text-natty-lime" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Elite</h3>
              <p className="text-xs text-white/60">Accès exclusif</p>
            </div>
          </Card>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="font-bold text-lg">Activité Quotidienne</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-4 p-4 bg-white rounded-3xl border border-black/5">
            <div className="w-12 h-12 bg-natty-lime/20 text-natty-teal rounded-2xl flex items-center justify-center">
              <Footprints size={24} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-end mb-1">
                <span className="font-bold">Pas</span>
                <span className="text-sm font-black">8 432 / 10k</span>
              </div>
              <div className="h-1.5 w-full bg-natty-charcoal/5 rounded-full overflow-hidden">
                <div className="h-full bg-natty-lime w-[84%]" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-white rounded-3xl border border-black/5">
            <div className="w-12 h-12 bg-natty-orange/20 text-natty-orange rounded-2xl flex items-center justify-center">
              <Flame size={24} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-end mb-1">
                <span className="font-bold">Calories brûlées</span>
                <span className="text-sm font-black">450 kcal</span>
              </div>
              <div className="h-1.5 w-full bg-natty-charcoal/5 rounded-full overflow-hidden">
                <div className="h-full bg-natty-orange w-[60%]" />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-white rounded-3xl border border-black/5">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
              <Moon size={24} />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-end mb-1">
                <span className="font-bold">Sommeil</span>
                <span className="text-sm font-black">7h 15m</span>
              </div>
              <div className="h-1.5 w-full bg-natty-charcoal/5 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-[90%]" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default PerformanceHub;
