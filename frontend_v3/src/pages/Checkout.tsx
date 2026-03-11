import { motion } from 'motion/react';
import { ArrowLeft, CreditCard, ShieldCheck, Check, ArrowRight, MapPin, Clock, Refrigerator, Zap, Sparkles, Star, Plus } from 'lucide-react';
import { Page } from '../types';

interface CheckoutProps {
  onNavigate: (page: Page) => void;
}

export const Checkout = ({ onNavigate }: CheckoutProps) => {
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
            onClick={() => onNavigate('cart')}
            className="h-11 w-11 rounded-2xl bg-white ring-1 ring-black/10 shadow-sm flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <h1 className="text-[28px] font-display font-bold tracking-tight">Paiement</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pb-[calc(96px+34px)] pt-8 relative">
        <section className="space-y-6">
          <div className="rounded-[32px] bg-white ring-1 ring-black/10 shadow-lg p-6 space-y-4">
            <h2 className="text-[18px] font-display font-bold tracking-tight">Résumé de la commande</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[14px] font-sans text-slate-600">
                <span>2x Salade César Natty</span>
                <span className="font-bold text-slate-900">21,00€</span>
              </div>
              <div className="flex items-center justify-between text-[14px] font-sans text-slate-600">
                <span>1x Bowl Poulet & Quinoa</span>
                <span className="font-bold text-slate-900">12,90€</span>
              </div>
              <div className="flex items-center justify-between text-[14px] font-sans text-slate-600">
                <span>Frais de service</span>
                <span className="font-bold text-slate-900">2,50€</span>
              </div>
              <div className="h-px bg-black/5 mx-2"></div>
              <div className="flex items-center justify-between text-[20px] font-display font-bold">
                <span>Total</span>
                <span className="text-[#1D6B4F]">36,40€</span>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] bg-white ring-1 ring-black/10 shadow-lg p-6 space-y-4">
            <h2 className="text-[18px] font-display font-bold tracking-tight">Mode de paiement</h2>
            <div className="rounded-2xl bg-[#FBF4EA] ring-2 ring-[#1D6B4F] p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5 text-[#1D6B4F]" />
              </div>
              <div className="flex-1">
                <p className="text-[14px] font-sans font-bold text-slate-900">Apple Pay</p>
                <p className="text-[12px] font-sans text-slate-500">•••• •••• •••• 4242</p>
              </div>
              <Check className="w-5 h-5 text-[#1D6B4F]" />
            </div>
            <button className="w-full h-14 rounded-2xl bg-white ring-1 ring-black/10 text-slate-700 font-sans font-bold flex items-center justify-center gap-3">
              <Plus className="w-5 h-5" />
              Ajouter une carte
            </button>
          </div>

          <div className="rounded-[32px] bg-[#EAF3EF] ring-1 ring-[#1D6B4F]/10 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[#1D6B4F]" />
              <h2 className="text-[16px] font-display font-bold tracking-tight text-[#1D6B4F]">Paiement Sécurisé</h2>
            </div>
            <p className="text-[13px] font-sans text-[#1D6B4F]/70 leading-relaxed">
              Tes données bancaires sont cryptées et ne sont jamais stockées sur nos serveurs.
            </p>
          </div>

          <button 
            onClick={() => onNavigate('order-tracking')}
            className="h-16 w-full rounded-[28px] bg-[#1D6B4F] text-white font-bold text-[16px] shadow-lg flex items-center justify-center gap-3 active:scale-[0.99] transition-transform"
          >
            <span>Payer 36,40€</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </section>
      </main>
    </motion.div>
  );
};
