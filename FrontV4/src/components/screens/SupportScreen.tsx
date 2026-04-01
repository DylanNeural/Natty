import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, HelpCircle, MessageSquare, ChevronRight, Mail } from 'lucide-react';
import Card from '../ui/Card';

interface SupportScreenProps {
  onBack: () => void;
}

const SupportScreen = ({ onBack }: SupportScreenProps) => {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-[100svh] bg-natty-beige flex flex-col pt-safe pb-safe">
      <header className="p-6 flex justify-between items-center">
        <button onClick={onBack} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
          <ChevronLeft />
        </button>
        <h2 className="font-black text-xl text-natty-teal">Support</h2>
        <div className="w-12 h-12" />
      </header>

      <div className="px-6 space-y-8 flex-1 overflow-y-auto no-scrollbar">
        <div className="text-center space-y-4 py-8">
          <div className="w-20 h-20 bg-natty-lime rounded-full flex items-center justify-center mx-auto text-natty-teal shadow-lg">
            <HelpCircle size={40} />
          </div>
          <h1 className="text-3xl font-black text-natty-teal">Besoin d'aide ?</h1>
          <p className="text-natty-charcoal/40 font-medium px-8">Notre équipe est là pour t'accompagner 7j/7.</p>
        </div>

        <div className="space-y-4">
          <Card className="flex items-center gap-4">
            <div className="p-3 bg-natty-teal text-white rounded-2xl"><MessageSquare size={24} /></div>
            <div className="flex-1">
              <h3 className="font-bold">Chat en direct</h3>
              <p className="text-xs text-natty-charcoal/40">Réponse en moins de 5 min</p>
            </div>
            <ChevronRight size={20} className="text-natty-charcoal/20" />
          </Card>
          <Card className="flex items-center gap-4">
            <div className="p-3 bg-natty-lime text-natty-teal rounded-2xl"><Mail size={24} /></div>
            <div className="flex-1">
              <h3 className="font-bold">Email</h3>
              <p className="text-xs text-natty-charcoal/40">support@natty.com</p>
            </div>
            <ChevronRight size={20} className="text-natty-charcoal/20" />
          </Card>
        </div>

        <div className="space-y-4">
          <h4 className="font-black text-natty-teal uppercase tracking-widest text-sm ml-2">FAQ Populaire</h4>
          <div className="space-y-3">
            {[
              "Comment déverrouiller un frigo ?",
              "Quels sont les modes de paiement ?",
              "Comment fonctionne le parrainage ?",
              "Problème avec ma commande"
            ].map(q => (
              <button key={q} className="w-full text-left p-5 bg-white rounded-3xl font-bold text-sm text-natty-charcoal/70 shadow-sm border border-black/5 flex justify-between items-center">
                {q}
                <ChevronRight size={18} className="text-natty-charcoal/20" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SupportScreen;
