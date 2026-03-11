import { motion } from 'motion/react';
import { ArrowLeft, ShoppingCart, Trash2, Plus, Minus, ArrowRight, Refrigerator, MapPin, Clock, CreditCard, ShieldCheck, ChevronRight } from 'lucide-react';
import { Page } from '../types';

interface CartProps {
  onNavigate: (page: Page) => void;
}

export const Cart = ({ onNavigate }: CartProps) => {
  const cartItems = [
    { id: 1, title: 'Bowl Poulet & Quinoa', price: 12.90, qty: 1, img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200' },
    { id: 2, title: 'Salade César Natty', price: 10.50, qty: 2, img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=200' },
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const delivery = 2.50;
  const total = subtotal + delivery;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="w-full min-h-screen flex flex-col bg-[#FBF4EA] text-slate-900 relative grain noise overflow-x-hidden"
    >
      <header className="shrink-0 pt-14 px-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('fridge')}
            className="h-11 w-11 rounded-2xl bg-white ring-1 ring-black/10 shadow-sm flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <h1 className="text-[28px] font-display font-bold tracking-tight">Panier</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pb-[calc(96px+34px)] pt-8 relative">
        <section className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="rounded-[28px] bg-white ring-1 ring-black/10 shadow-sm p-4 flex items-center gap-4">
              <div className="h-20 w-20 rounded-2xl bg-slate-100 overflow-hidden shrink-0">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[16px] font-display font-bold tracking-tight truncate">{item.title}</h3>
                <p className="text-[14px] font-sans text-[#1D6B4F] font-bold">{item.price.toFixed(2)}€</p>
                <div className="mt-2 flex items-center gap-3">
                  <button className="h-8 w-8 rounded-xl bg-[#FBF4EA] ring-1 ring-black/10 flex items-center justify-center">
                    <Minus className="w-4 h-4 text-slate-700" />
                  </button>
                  <span className="text-[14px] font-sans font-bold">{item.qty}</span>
                  <button className="h-8 w-8 rounded-xl bg-[#FBF4EA] ring-1 ring-black/10 flex items-center justify-center">
                    <Plus className="w-4 h-4 text-slate-700" />
                  </button>
                </div>
              </div>
              <button className="h-10 w-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-[32px] bg-white ring-1 ring-black/10 shadow-lg p-6 space-y-4">
          <div className="flex items-center justify-between text-[14px] font-sans text-slate-600">
            <span>Sous-total</span>
            <span className="font-bold text-slate-900">{subtotal.toFixed(2)}€</span>
          </div>
          <div className="flex items-center justify-between text-[14px] font-sans text-slate-600">
            <span>Frais de service</span>
            <span className="font-bold text-slate-900">{delivery.toFixed(2)}€</span>
          </div>
          <div className="h-px bg-black/5 mx-2"></div>
          <div className="flex items-center justify-between text-[18px] font-display font-bold">
            <span>Total</span>
            <span className="text-[#1D6B4F]">{total.toFixed(2)}€</span>
          </div>
        </section>

        <section className="mt-8 space-y-4">
          <div className="rounded-2xl bg-[#EAF3EF] ring-1 ring-[#1D6B4F]/10 p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shrink-0">
              <Refrigerator className="w-5 h-5 text-[#1D6B4F]" />
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-sans font-bold text-[#1D6B4F]">Frigo Station F</p>
              <p className="text-[11px] font-sans text-[#1D6B4F]/70">Récupération immédiate possible</p>
            </div>
            <ChevronRight className="w-5 h-5 text-[#1D6B4F]/40" />
          </div>

          <button 
            onClick={() => onNavigate('checkout')}
            className="h-16 w-full rounded-[28px] bg-[#1D6B4F] text-white font-bold text-[16px] shadow-lg flex items-center justify-center gap-3 active:scale-[0.99] transition-transform"
          >
            <span>Passer commande</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </section>
      </main>
    </motion.div>
  );
};
