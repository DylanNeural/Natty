import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Product } from '../../types';

interface ScanResultsScreenProps {
  onBack: () => void;
  onSelectProduct: (p: Product) => void;
}

const ScanResultsScreen = ({ onBack, onSelectProduct }: ScanResultsScreenProps) => {
  const mockProduct: Product = {
    id: 'p1',
    name: 'Natty Bowl Poulet',
    brand: 'Natty Fuel',
    price: 12.50,
    calories: 450,
    protein: 35,
    carbs: 45,
    fat: 12,
    image: 'https://picsum.photos/seed/bowl/400/400',
    category: 'repas',
    nutriScore: 'A',
    ingredients: ['Poulet grillé', 'Quinoa', 'Avocat', 'Pois chiches', 'Épinards'],
    allergens: ['Aucun']
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="h-[100svh] bg-natty-beige flex flex-col pt-safe pb-safe overflow-y-auto no-scrollbar">
      <header className="p-6 flex justify-between items-center">
        <button onClick={onBack} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
          <ChevronLeft />
        </button>
        <h2 className="font-black text-xl text-natty-teal">Résultats du Scan</h2>
        <div className="w-12 h-12" />
      </header>

      <div className="px-6 space-y-6 pb-12">
        <Card className="p-0 overflow-hidden">
          <img src={mockProduct.image} alt={mockProduct.name} className="w-full h-64 object-cover" referrerPolicy="no-referrer" />
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-black text-natty-teal">{mockProduct.name}</h3>
                <p className="text-natty-charcoal/40 font-bold uppercase tracking-widest text-xs">{mockProduct.brand}</p>
              </div>
              <div className="w-12 h-12 bg-natty-lime rounded-xl flex items-center justify-center text-natty-teal font-black text-2xl shadow-sm">
                {mockProduct.nutriScore}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div className="bg-natty-teal/5 p-3 rounded-2xl text-center">
                <span className="block text-xs font-black text-natty-teal">{mockProduct.calories}</span>
                <span className="text-[8px] uppercase font-bold text-natty-charcoal/40">kcal</span>
              </div>
              <div className="bg-natty-lime/20 p-3 rounded-2xl text-center">
                <span className="block text-xs font-black text-natty-teal">{mockProduct.protein}g</span>
                <span className="text-[8px] uppercase font-bold text-natty-charcoal/40">Prot</span>
              </div>
              <div className="bg-natty-orange/10 p-3 rounded-2xl text-center">
                <span className="block text-xs font-black text-natty-orange">{mockProduct.carbs}g</span>
                <span className="text-[8px] uppercase font-bold text-natty-charcoal/40">Gluc</span>
              </div>
              <div className="bg-natty-charcoal/5 p-3 rounded-2xl text-center">
                <span className="block text-xs font-black text-natty-charcoal/60">{mockProduct.fat}g</span>
                <span className="text-[8px] uppercase font-bold text-natty-charcoal/40">Lip</span>
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <h4 className="font-black text-natty-teal uppercase tracking-widest text-sm">Ingrédients</h4>
          <div className="flex flex-wrap gap-2">
            {mockProduct.ingredients?.map(ing => (
              <span key={ing} className="px-4 py-2 bg-white rounded-full text-xs font-bold text-natty-charcoal/60 shadow-sm border border-black/5">{ing}</span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-black text-natty-teal uppercase tracking-widest text-sm">Allergènes</h4>
          <div className="flex flex-wrap gap-2">
            {mockProduct.allergens?.map(all => (
              <span key={all} className="px-4 py-2 bg-red-50 text-red-500 rounded-full text-xs font-bold shadow-sm border border-red-100">{all}</span>
            ))}
          </div>
        </div>

        <Button onClick={() => onSelectProduct(mockProduct)} variant="primary" className="w-full h-16 text-lg">Acheter maintenant</Button>
      </div>
    </motion.div>
  );
};

export default ScanResultsScreen;
