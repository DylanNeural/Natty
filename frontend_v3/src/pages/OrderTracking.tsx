import { motion } from 'motion/react';
import { ArrowLeft, MapPin, Clock, Refrigerator, QrCode, Check, ArrowRight, ShoppingBag, ShieldCheck, Info, Map, Navigation, Phone, MessageSquare } from 'lucide-react';
import { Page } from '../types';

interface OrderTrackingProps {
  onNavigate: (page: Page) => void;
}

export const OrderTracking = ({ onNavigate }: OrderTrackingProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full min-h-screen flex flex-col bg-[#134030] text-[#FAEBDD] relative grain noise overflow-x-hidden"
    >
      {/* Background elements */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#C3D36D] opacity-15 blur-3xl"></div>
      <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-[#DF842C] opacity-10 blur-3xl"></div>

      <header className="shrink-0 pt-14 px-6 relative z-10">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="h-11 w-11 rounded-2xl bg-white/10 ring-1 ring-white/20 flex items-center justify-center active:scale-[0.98] transition-transform"
          >
            <ArrowLeft className="w-5 h-5 text-[#FAEBDD]" />
          </button>
          <div className="text-center">
            <p className="text-[12px] font-sans text-[#FAEBDD]/60 uppercase tracking-widest">Commande #NAT-8421</p>
            <h1 className="text-[20px] font-display font-bold tracking-tight">Suivi de collecte</h1>
          </div>
          <button className="h-11 w-11 rounded-2xl bg-white/10 ring-1 ring-white/20 flex items-center justify-center active:scale-[0.98] transition-transform">
            <Info className="w-5 h-5 text-[#FAEBDD]" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pb-[calc(96px+34px)] pt-8 relative z-10">
        <section className="rounded-[40px] bg-white text-slate-900 p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 top-0 h-24 w-24 bg-[#EAF3EF] opacity-50 rounded-bl-full"></div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-[#EAF3EF] text-[#1D6B4F] mb-4">
              <Refrigerator className="w-8 h-8" />
            </div>
            <h2 className="text-[24px] font-display font-bold tracking-tight">Prêt à être récupéré !</h2>
            <p className="mt-2 text-[14px] font-sans text-slate-600">Scanne ce code sur le frigo Natty Bourse pour déverrouiller la porte.</p>
          </div>

          <div className="mt-8 p-6 rounded-[32px] bg-[#FBF4EA] ring-1 ring-black/5 flex flex-col items-center">
            <div className="bg-white p-6 rounded-[28px] shadow-lg ring-1 ring-black/5 mb-4">
              <QrCode className="w-48 h-48 text-[#134030]" />
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white ring-1 ring-black/5 shadow-sm">
              <div className="h-2 w-2 rounded-full bg-[#1D6B4F] animate-pulse"></div>
              <span className="text-[12px] font-sans font-bold text-slate-700 uppercase tracking-wider">Code valide 15:00 min</span>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white ring-1 ring-black/5 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-[#FFF0E8] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-[#DF842C]" />
              </div>
              <div>
                <p className="text-[14px] font-display font-bold">Natty Bourse • Station F</p>
                <p className="text-[12px] font-sans text-slate-500">600m • 8 min à pied</p>
              </div>
              <button className="ml-auto h-10 w-10 rounded-xl bg-[#FBF4EA] flex items-center justify-center">
                <Navigation className="w-5 h-5 text-[#134030]" />
              </button>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-white ring-1 ring-black/5 shadow-sm">
              <div className="h-10 w-10 rounded-xl bg-[#EAF3EF] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-[#1D6B4F]" />
              </div>
              <div>
                <p className="text-[14px] font-display font-bold">Collecte avant 22h00</p>
                <p className="text-[12px] font-sans text-slate-500">Le frigo sera réapprovisionné demain.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[32px] bg-white/10 ring-1 ring-white/20 p-6 backdrop-blur-md">
          <h3 className="text-[16px] font-display font-bold tracking-tight mb-4">Détails de la commande</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[14px] font-sans">
              <span className="opacity-70">2x Salade César Natty</span>
              <span className="font-bold">21,00€</span>
            </div>
            <div className="flex items-center justify-between text-[14px] font-sans">
              <span className="opacity-70">1x Bowl Poulet & Quinoa</span>
              <span className="font-bold">12,90€</span>
            </div>
            <div className="h-px bg-white/10 mx-2"></div>
            <div className="flex items-center justify-between text-[18px] font-display font-bold">
              <span>Total payé</span>
              <span className="text-[#C3D36D]">36,40€</span>
            </div>
          </div>
        </section>

        <section className="mt-8 grid grid-cols-2 gap-4">
          <button className="h-16 rounded-[28px] bg-white/10 ring-1 ring-white/20 text-[#FAEBDD] font-bold text-[15px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
            <Phone className="w-4 h-4" />
            Appeler
          </button>
          <button className="h-16 rounded-[28px] bg-white/10 ring-1 ring-white/20 text-[#FAEBDD] font-bold text-[15px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
            <MessageSquare className="w-4 h-4" />
            Support
          </button>
        </section>

        <button 
          onClick={() => onNavigate('dashboard')}
          className="mt-8 h-16 w-full rounded-[28px] bg-[#C3D36D] text-[#134030] font-bold text-[16px] shadow-lg flex items-center justify-center gap-3 active:scale-[0.99] transition-transform"
        >
          <span>Retour à l'accueil</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </main>
    </motion.div>
  );
};
