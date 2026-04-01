import React from 'react';
import { ChevronLeft, CreditCard, CheckCircle2, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { UserProfile } from '../../types';
import Button from '../ui/Button';

interface SubscriptionScreenProps {
  user: UserProfile;
  onBack: () => void;
}

const SubscriptionScreen = ({ user, onBack }: SubscriptionScreenProps) => {
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
        <h1 className="text-lg font-black uppercase tracking-widest text-natty-charcoal/40">Abonnement</h1>
        <div className="w-10" />
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-black">Paiement & Abonnements</h2>
          <p className="text-natty-charcoal/40 font-medium">Gère tes préférences de paiement et ton statut Premium.</p>
        </div>

        <section className="bg-natty-teal rounded-[32px] p-6 text-white space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">Statut actuel</p>
              <h3 className="text-2xl font-black">{user.isPremium ? 'NATTY ELITE' : 'NATTY FREE'}</h3>
            </div>
            <div className="w-12 h-12 bg-natty-lime rounded-2xl flex items-center justify-center text-natty-teal">
              <Star size={24} fill="currentColor" />
            </div>
          </div>

          <div className="space-y-3 relative z-10">
            {[
              'Accès illimité aux frigos',
              'Analyses nutritionnelles avancées',
              'Coaching personnalisé par IA',
              'Réductions exclusives'
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-natty-lime" />
                <span className="text-sm font-bold text-white/80">{feature}</span>
              </div>
            ))}
          </div>

          {!user.isPremium && (
            <Button variant="lime" className="w-full relative z-10">Passer à l'Elite — 9.99€/mois</Button>
          )}
        </section>

        <section className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-natty-charcoal/40 ml-2">Méthode de paiement</h3>
          <div className="bg-white p-4 rounded-2xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-8 bg-natty-charcoal/5 rounded-lg flex items-center justify-center text-natty-teal">
                <CreditCard size={20} />
              </div>
              <div>
                <p className="text-sm font-bold">•••• •••• •••• 4242</p>
                <p className="text-[10px] font-bold text-natty-charcoal/40 uppercase tracking-widest">Expire 12/26</p>
              </div>
            </div>
            <button className="text-[10px] font-black uppercase tracking-widest text-natty-orange">Modifier</button>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default SubscriptionScreen;
