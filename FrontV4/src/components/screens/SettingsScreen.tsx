import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, User, Mail, CreditCard, Bell, HelpCircle, BookOpen, Info, ChevronRight, LogOut } from 'lucide-react';

import { UserProfile, Screen } from '../../types';

interface SettingsScreenProps {
  onBack: () => void;
  onNavigate: (s: any) => void;
}

const SettingsScreen = ({ onBack, onNavigate }: SettingsScreenProps) => {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-[100svh] bg-natty-beige flex flex-col pt-safe pb-safe">
      <header className="p-6 flex justify-between items-center">
        <button onClick={onBack} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
          <ChevronLeft />
        </button>
        <h2 className="font-black text-xl text-natty-teal">Paramètres</h2>
        <div className="w-12 h-12" />
      </header>

      <div className="px-6 space-y-8 overflow-y-auto no-scrollbar flex-1">
        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-natty-charcoal/40 ml-4">Compte</h4>
          <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-black/5">
            {[
              { icon: User, label: 'Informations personnelles', screen: 'personal-info' as any },
              { icon: Mail, label: 'Email & Sécurité', screen: 'personal-info' as any },
              { icon: CreditCard, label: 'Méthodes de paiement', screen: 'subscription' as any },
              { icon: Bell, label: 'Notifications', screen: 'notifications' as any },
            ].map((item, i) => (
              <button 
                key={item.label} 
                onClick={() => onNavigate(item.screen as Screen)}
                className={`w-full flex items-center gap-4 p-5 hover:bg-natty-charcoal/5 transition-colors ${i !== 3 ? 'border-b border-black/5' : ''}`}
              >
                <div className="p-2 bg-natty-teal/5 text-natty-teal rounded-xl"><item.icon size={20} /></div>
                <span className="flex-1 text-left font-bold text-natty-charcoal/70">{item.label}</span>
                <ChevronRight size={20} className="text-natty-charcoal/20" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-natty-charcoal/40 ml-4">Application</h4>
          <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-black/5">
            {[
              { icon: HelpCircle, label: 'Aide & Support', screen: 'support' as any },
              { icon: BookOpen, label: 'Conditions d\'utilisation', screen: 'support' as any },
              { icon: Info, label: 'À propos de Natty', screen: 'support' as any },
            ].map((item, i) => (
              <button 
                key={item.label} 
                onClick={() => onNavigate(item.screen as Screen)}
                className={`w-full flex items-center gap-4 p-5 hover:bg-natty-charcoal/5 transition-colors ${i !== 2 ? 'border-b border-black/5' : ''}`}
              >
                <div className="p-2 bg-natty-teal/5 text-natty-teal rounded-xl"><item.icon size={20} /></div>
                <span className="flex-1 text-left font-bold text-natty-charcoal/70">{item.label}</span>
                <ChevronRight size={20} className="text-natty-charcoal/20" />
              </button>
            ))}
          </div>
        </div>

        <button onClick={() => window.location.reload()} className="w-full flex items-center gap-4 p-6 bg-red-50 text-red-500 rounded-[32px] font-black uppercase tracking-widest text-xs mb-12">
          <LogOut size={20} />
          Déconnexion
        </button>
      </div>
    </motion.div>
  );
};

export default SettingsScreen;
