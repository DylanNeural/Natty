import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Trophy, Clock, Award, Zap } from 'lucide-react';

interface NotificationsScreenProps {
  onBack: () => void;
}

const NotificationsScreen = ({ onBack }: NotificationsScreenProps) => {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-[100svh] bg-natty-beige flex flex-col pt-safe pb-safe">
      <header className="p-6 flex justify-between items-center">
        <button onClick={onBack} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
          <ChevronLeft />
        </button>
        <h2 className="font-black text-xl text-natty-teal">Notifications</h2>
        <button className="text-xs font-black text-natty-teal uppercase tracking-widest">Tout lire</button>
      </header>

      <div className="px-6 space-y-4 flex-1 overflow-y-auto no-scrollbar pb-12">
        {[
          { title: 'Nouveau défi disponible !', desc: 'Le défi "10k pas" vient de commencer. Rejoins-le vite !', time: 'Il y a 10 min', icon: Trophy, color: 'bg-natty-lime text-natty-teal', unread: true },
          { title: 'Ton repas est prêt', desc: 'N\'oublie pas de récupérer ton Natty Bowl au frigo.', time: 'Il y a 1h', icon: Clock, color: 'bg-natty-orange/10 text-natty-orange', unread: true },
          { title: 'Objectif atteint !', desc: 'Bravo ! Tu as atteint ton objectif d\'hydratation aujourd\'hui.', time: 'Hier', icon: Award, color: 'bg-natty-teal text-white', unread: false },
          { title: 'Promo Flash ⚡️', desc: '-15% sur tous les snacks cet après-midi dans ton club.', time: 'Hier', icon: Zap, color: 'bg-yellow-100 text-yellow-600', unread: false },
        ].map((notif, i) => (
          <div key={i} className={`p-5 rounded-[32px] flex gap-4 transition-all ${notif.unread ? 'bg-white shadow-sm border border-natty-teal/10' : 'bg-natty-charcoal/5 opacity-60'}`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${notif.color}`}>
              <notif.icon size={24} />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-sm text-natty-teal">{notif.title}</h4>
                <span className="text-[10px] font-medium text-natty-charcoal/40">{notif.time}</span>
              </div>
              <p className="text-xs text-natty-charcoal/60 leading-relaxed">{notif.desc}</p>
            </div>
            {notif.unread && <div className="w-2 h-2 bg-natty-teal rounded-full mt-2" />}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default NotificationsScreen;
