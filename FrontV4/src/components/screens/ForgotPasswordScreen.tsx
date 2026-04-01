import React from 'react';
import { motion } from 'motion/react';
import { Mail, ChevronLeft } from 'lucide-react';
import Button from '../ui/Button';

interface ForgotPasswordScreenProps {
  onBack: () => void;
}

const ForgotPasswordScreen = ({ onBack }: ForgotPasswordScreenProps) => {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-[100svh] bg-natty-beige p-8 flex flex-col pt-safe pb-safe">
      <div className="flex-1 flex flex-col justify-center">
        <button onClick={onBack} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-8">
          <ChevronLeft />
        </button>
        <h1 className="text-4xl font-black text-natty-teal mb-2">Oubli ?</h1>
        <p className="text-natty-charcoal/40 font-medium mb-12">Pas de soucis, on t'envoie un lien de réinitialisation.</p>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-natty-charcoal/40 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-natty-charcoal/20" size={20} />
              <input type="email" placeholder="ton@email.com" className="w-full h-14 bg-white rounded-2xl pl-14 pr-6 font-bold border-2 border-transparent focus:border-natty-teal outline-none transition-all" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <Button onClick={onBack} variant="primary" className="w-full h-16 text-lg">Envoyer le lien</Button>
      </div>
    </motion.div>
  );
};

export default ForgotPasswordScreen;
