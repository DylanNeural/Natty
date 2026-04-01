import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Share2 } from 'lucide-react';
import Button from '../ui/Button';
import { Product } from '../../types';

interface ProductDetailScreenProps {
  product: Product;
  onBack: () => void;
  onBuy: () => void;
}

const ProductDetailScreen = ({ product, onBack, onBuy }: ProductDetailScreenProps) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="h-[100svh] bg-natty-beige flex flex-col pt-safe pb-safe">
      <header className="p-6 flex justify-between items-center">
        <button onClick={onBack} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
          <ChevronLeft />
        </button>
        <h2 className="font-black text-xl text-natty-teal">Détails Produit</h2>
        <button className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
          <Share2 size={20} />
        </button>
      </header>

      <div className="px-6 space-y-8 pb-12 overflow-y-auto no-scrollbar">
        <div className="relative h-80 -mx-6 -mt-6 mb-8">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-t from-natty-beige to-transparent" />
          <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-black text-natty-teal">{product.name}</h1>
              <p className="text-natty-charcoal/40 font-bold uppercase tracking-widest text-xs">{product.brand}</p>
            </div>
            <div className="w-14 h-14 bg-natty-lime rounded-2xl flex items-center justify-center text-natty-teal font-black text-3xl shadow-xl">
              {product.nutriScore || 'A'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Calories', value: `${product.calories}kcal`, color: 'text-natty-teal', bg: 'bg-natty-teal/5' },
            { label: 'Protéines', value: `${product.protein}g`, color: 'text-natty-teal', bg: 'bg-natty-lime/20' },
            { label: 'Glucides', value: `${product.carbs}g`, color: 'text-natty-orange', bg: 'bg-natty-orange/10' },
            { label: 'Lipides', value: `${product.fat}g`, color: 'text-natty-charcoal/60', bg: 'bg-natty-charcoal/5' },
          ].map(stat => (
            <div key={stat.label} className={`${stat.bg} p-4 rounded-3xl text-center`}>
              <span className={`block text-sm font-black ${stat.color}`}>{stat.value}</span>
              <span className="text-[8px] uppercase font-bold text-natty-charcoal/40 tracking-wider">{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h4 className="font-black text-natty-teal uppercase tracking-widest text-sm">Description</h4>
          <p className="text-sm text-natty-charcoal/60 leading-relaxed">
            {product.description || "Un repas équilibré conçu pour optimiser tes performances et ta récupération. Ingrédients frais et naturels uniquement."}
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="font-black text-natty-teal uppercase tracking-widest text-sm">Ingrédients</h4>
          <div className="flex flex-wrap gap-2">
            {(product.ingredients || ['Poulet', 'Riz', 'Légumes']).map(ing => (
              <span key={ing} className="px-4 py-2 bg-white rounded-full text-xs font-bold text-natty-charcoal/60 shadow-sm border border-black/5">{ing}</span>
            ))}
          </div>
        </div>

        <div className="bg-natty-teal text-white p-6 rounded-[40px] flex items-center justify-between shadow-xl">
          <div>
            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Prix</p>
            <p className="text-3xl font-black">{product.price.toFixed(2)}€</p>
          </div>
          <Button onClick={onBuy} variant="lime" className="px-8 h-14">Acheter</Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetailScreen;
