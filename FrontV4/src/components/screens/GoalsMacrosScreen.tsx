import React from 'react';
import { ChevronLeft, Target, Zap, Dumbbell } from 'lucide-react';
import { motion } from 'motion/react';
import { UserProfile, Goal } from '../../types';
import Card from '../ui/Card';

interface GoalsMacrosScreenProps {
  user: UserProfile;
  onBack: () => void;
  onUpdateGoal: (goal: Goal) => void;
}

const GoalsMacrosScreen = ({ user, onBack, onUpdateGoal }: GoalsMacrosScreenProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="h-[100svh] bg-natty-beige flex flex-col pt-safe pb-safe"
    >
      <header className="p-6 flex items-center justify-between">
        <button onClick={onBack} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-lg font-black uppercase tracking-widest text-natty-charcoal/40">Objectifs</h1>
        <div className="w-10" />
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-black">Objectifs & Macros</h2>
          <p className="text-natty-charcoal/40 font-medium">Tes besoins nutritionnels calculés sur mesure.</p>
        </div>

        <section className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-natty-charcoal/40 ml-2">Modifier ton objectif</h3>
          <div className="grid grid-cols-1 gap-3">
            {[
              { id: 'perte-de-poids', label: 'Perte de poids', icon: Target, color: 'bg-natty-teal' },
              { id: 'prise-de-muscle', label: 'Prise de muscle', icon: Dumbbell, color: 'bg-natty-orange' },
              { id: 'boost-energie', label: 'Boost énergie', icon: Zap, color: 'bg-natty-lime' },
            ].map((goal) => (
              <button 
                key={goal.id}
                onClick={() => onUpdateGoal(goal.id as Goal)}
                className={`flex items-center justify-between p-4 rounded-2xl transition-all ${user.goal === goal.id ? 'bg-white shadow-xl ring-2 ring-natty-teal' : 'bg-white/50 opacity-60 hover:opacity-100'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 ${goal.color} rounded-xl flex items-center justify-center text-white`}>
                    <goal.icon size={20} />
                  </div>
                  <span className="font-black text-sm uppercase tracking-wider">{goal.label}</span>
                </div>
                {user.goal === goal.id && (
                  <motion.div 
                    layoutId="active-goal"
                    className="w-2 h-2 bg-natty-teal rounded-full" 
                  />
                )}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-natty-charcoal/40 ml-2">Répartition des Macros</h3>
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-4 text-center space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-natty-charcoal/40">Protéines</p>
              <span className="text-xl font-black text-natty-teal">{user.stats.protein}g</span>
            </Card>
            <Card className="p-4 text-center space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-natty-charcoal/40">Glucides</p>
              <span className="text-xl font-black text-natty-orange">{user.stats.carbs}g</span>
            </Card>
            <Card className="p-4 text-center space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-natty-charcoal/40">Lipides</p>
              <span className="text-xl font-black text-natty-lime">{user.stats.fat}g</span>
            </Card>
          </div>
          <div className="bg-natty-teal/5 p-4 rounded-2xl border border-natty-teal/10">
            <p className="text-xs text-natty-teal font-bold text-center">Total : {user.stats.calories} kcal / jour</p>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default GoalsMacrosScreen;
