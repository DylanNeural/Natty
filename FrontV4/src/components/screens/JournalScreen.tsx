import React from 'react';
import { Filter } from 'lucide-react';
import Card from '../ui/Card';

const JournalScreen = () => (
  <div className="p-6 space-y-8 pb-32 pt-safe">
    <header className="flex justify-between items-end">
      <div>
        <h1 className="text-3xl font-bold">Mon Journal</h1>
        <p className="text-sm text-natty-charcoal/60 font-medium">Historique nutritionnel</p>
      </div>
      <button className="w-10 h-10 bg-natty-teal text-white rounded-xl flex items-center justify-center"><Filter size={20} /></button>
    </header>

    <div className="space-y-6">
      {[
        { time: '08:30', name: 'Petit-déjeuner', kcal: 420, items: ['Avoine', 'Banane', 'Whey'] },
        { time: '12:45', name: 'Déjeuner', kcal: 650, items: ['Bowl Protéiné Natty', 'Eau'] },
        { time: '16:00', name: 'Collation', kcal: 210, items: ['Barre Énergétique'] },
      ].map((meal, i) => (
        <div key={i} className="flex gap-4">
          <div className="flex flex-col items-center">
            <span className="text-xs font-bold text-natty-charcoal/50">{meal.time}</span>
            <div className="w-0.5 flex-1 bg-natty-charcoal/10 my-2" />
          </div>
          <Card className="flex-1 p-4">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold">{meal.name}</h4>
              <span className="text-sm font-black text-natty-teal">{meal.kcal} kcal</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {meal.items.map(item => (
                <span key={item} className="text-[10px] font-bold bg-natty-charcoal/10 px-2 py-1 rounded-md text-natty-charcoal/70">{item}</span>
              ))}
            </div>
          </Card>
        </div>
      ))}
    </div>
  </div>
);

export default JournalScreen;
