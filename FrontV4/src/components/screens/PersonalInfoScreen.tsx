import React from 'react';
import { ChevronLeft, Save } from 'lucide-react';
import { motion } from 'motion/react';
import { UserProfile } from '../../types';
import Button from '../ui/Button';

interface PersonalInfoScreenProps {
  user: UserProfile;
  onBack: () => void;
}

const PersonalInfoScreen = ({ user, onBack }: PersonalInfoScreenProps) => {
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
        <h1 className="text-lg font-black uppercase tracking-widest">Profil</h1>
        <div className="w-10" />
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-black">Informations personnelles</h2>
          <p className="text-natty-charcoal/40 font-medium">Gère tes données de base pour une meilleure personnalisation.</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-natty-charcoal/40 ml-2">Nom complet</label>
            <input 
              type="text" 
              defaultValue={user.name}
              className="w-full bg-white border-none rounded-2xl p-4 font-bold text-sm focus:ring-2 focus:ring-natty-teal transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-natty-charcoal/40 ml-2">Email</label>
            <input 
              type="email" 
              defaultValue={user.email}
              className="w-full bg-white border-none rounded-2xl p-4 font-bold text-sm focus:ring-2 focus:ring-natty-teal transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-natty-charcoal/40 ml-2">Âge</label>
              <input 
                type="number" 
                defaultValue={user.age}
                className="w-full bg-white border-none rounded-2xl p-4 font-bold text-sm focus:ring-2 focus:ring-natty-teal transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-natty-charcoal/40 ml-2">Genre</label>
              <select 
                defaultValue={user.gender}
                className="w-full bg-white border-none rounded-2xl p-4 font-bold text-sm focus:ring-2 focus:ring-natty-teal transition-all appearance-none"
              >
                <option value="femme">Femme</option>
                <option value="homme">Homme</option>
                <option value="autre">Autre</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Button onClick={onBack} className="w-full flex items-center justify-center gap-2">
          <Save size={18} />
          Enregistrer les modifications
        </Button>
      </div>
    </motion.div>
  );
};

export default PersonalInfoScreen;
