import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Map as MapIcon, User, ArrowRight, Zap, CreditCard } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Fridge, Product } from '../../types';

interface FridgeDetailProps {
  fridge: Fridge;
  onBack: () => void;
  onSelectProduct: (p: Product) => void;
}

const FridgeDetail = ({ fridge, onBack, onSelectProduct }: FridgeDetailProps) => {
  return (
    <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="min-h-[100svh] bg-natty-beige z-50 fixed inset-0 overflow-y-auto pt-safe pb-safe no-scrollbar">
      <div className="h-64 bg-natty-teal relative -mt-safe">
        <button onClick={onBack} className="absolute top-12 left-6 w-10 h-10 bg-black/20 text-white rounded-xl flex items-center justify-center backdrop-blur-md">
          <ChevronLeft />
        </button>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <div className="w-32 h-32 bg-natty-lime/20 rounded-full flex items-center justify-center text-natty-lime font-black text-6xl opacity-50">N</div>
        </div>
        <div className="absolute -bottom-12 left-6 right-6">
          <Card className="p-6 shadow-xl">
            <div className="flex justify-between items-start mb-2">
              <span className="bg-natty-lime text-natty-teal text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-natty-teal rounded-full animate-pulse" /> Ouvert
              </span>
            </div>
            <h1 className="text-3xl font-bold text-natty-teal mb-2">{fridge.name}</h1>
            <div className="flex gap-4 text-sm text-natty-charcoal/50 font-medium">
              <span className="flex items-center gap-1"><MapIcon size={14} /> {fridge.distance}</span>
              <span className="flex items-center gap-1"><User size={14} /> {fridge.walkTime}</span>
              <span>{fridge.address}</span>
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-20 px-6 pb-32 space-y-8">
        <div className="flex justify-between items-end border-b border-natty-charcoal/10 pb-4">
          <h3 className="font-bold text-lg">Stock disponible</h3>
          <span className="text-natty-teal font-black">{fridge.stockCount} produits</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {fridge.products.map(p => (
            <Card key={p.id} onClick={() => onSelectProduct(p)} className="p-0 overflow-hidden flex flex-col">
              <img src={p.image} alt={p.name} className="w-full h-32 object-cover" referrerPolicy="no-referrer" />
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex-1">
                  <h4 className="font-bold leading-tight mb-1">{p.name}</h4>
                  <p className="text-[10px] text-natty-charcoal/40 font-bold uppercase tracking-wider">{p.brand}</p>
                </div>
                <div className="mt-4 flex justify-between items-end">
                  <div>
                    <span className="text-lg font-black text-natty-teal">{p.price.toFixed(2)}€</span>
                    <p className="text-[10px] text-natty-charcoal/40 font-bold">{p.calories} kcal · {p.protein}g prot.</p>
                  </div>
                  <button className="w-8 h-8 bg-natty-lime text-natty-teal rounded-lg flex items-center justify-center active:scale-90 transition-transform">
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="bg-natty-teal text-white p-6 rounded-[40px] space-y-4">
           <div className="flex items-center gap-3">
             <Zap className="text-natty-lime" />
             <p className="font-bold">Déverrouillage automatique à l'arrivée via BLE</p>
           </div>
           <Button variant="orange" className="w-full" icon={CreditCard}>Réserver & Payer</Button>
           <p className="text-center text-xs text-white/40 font-medium">Ou scanner le QR code sur place</p>
        </div>
      </div>
    </motion.div>
  );
};

export default FridgeDetail;
