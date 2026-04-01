import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Check, Home } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Product } from '../../types';

interface PaymentScreenProps {
  product: Product;
  onBack: () => void;
  onComplete: () => void;
}

const PaymentScreen = ({ product, onBack, onComplete }: PaymentScreenProps) => {
  const [loading, setLoading] = useState(false);

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onComplete();
    }, 2000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-[100svh] bg-white z-[60] fixed inset-0 p-6 pt-safe pb-safe flex flex-col overflow-y-auto no-scrollbar">
      <header className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2"><ChevronLeft /></button>
        <h1 className="text-xl font-bold">Paiement sécurisé</h1>
      </header>

      <div className="flex-1 space-y-8">
        <Card className="bg-natty-beige/30 border-none flex gap-4 items-center">
          <img src={product.image} alt={product.name} className="w-20 h-20 rounded-2xl object-cover" referrerPolicy="no-referrer" />
          <div>
            <h3 className="font-bold">{product.name}</h3>
            <p className="text-sm text-natty-charcoal/40">{product.brand}</p>
            <p className="text-lg font-black text-natty-teal mt-1">{product.price.toFixed(2)}€</p>
          </div>
        </Card>

        <section className="space-y-4">
          <h3 className="font-bold text-lg">Mode de paiement</h3>
          <div className="space-y-3">
            <button className="w-full p-4 rounded-2xl border-2 border-natty-teal bg-natty-teal/5 flex items-center gap-4">
              <div className="w-12 h-8 bg-black rounded flex items-center justify-center text-white text-[10px] font-bold">VISA</div>
              <span className="flex-1 text-left font-bold">•••• 4242</span>
              <div className="w-5 h-5 rounded-full bg-natty-teal flex items-center justify-center"><Check size={12} className="text-white" /></div>
            </button>
            <button className="w-full p-4 rounded-2xl border-2 border-black/5 flex items-center gap-4 opacity-50">
              <div className="w-12 h-8 bg-black rounded flex items-center justify-center text-white"><Home size={16} /></div>
              <span className="flex-1 text-left font-bold">Apple Pay</span>
            </button>
          </div>
        </section>

        <Card className="bg-natty-lime/10 border-none space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Sous-total</span>
            <span>{product.price.toFixed(2)}€</span>
          </div>
          <div className="flex justify-between text-sm font-medium">
            <span>Frais Natty</span>
            <span>0.00€</span>
          </div>
          <div className="h-px bg-black/5 my-2" />
          <div className="flex justify-between text-lg font-black">
            <span>Total</span>
            <span>{product.price.toFixed(2)}€</span>
          </div>
        </Card>
      </div>

      <Button 
        onClick={handlePay} 
        variant="orange" 
        className="w-full mb-8" 
        disabled={loading}
      >
        {loading ? 'Traitement...' : `Payer ${product.price.toFixed(2)}€`}
      </Button>
    </motion.div>
  );
};

export default PaymentScreen;
