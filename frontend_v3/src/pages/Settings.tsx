import { motion } from 'motion/react';
import { ArrowLeft, Bell, Lock, Globe, Moon, Sun, HelpCircle, Info, LogOut, ChevronRight, User, ShieldCheck, Mail, Phone, MapPin, Camera, Pencil, Star, Heart, History, Refrigerator, Utensils, Drumstick, Wheat, Droplet, Flame } from 'lucide-react';
import { Page } from '../types';

interface SettingsProps {
  onNavigate: (page: Page) => void;
}

export const Settings = ({ onNavigate }: SettingsProps) => {
  const sections = [
    {
      title: 'Compte',
      items: [
        { label: 'Profil', icon: User, color: 'text-[#1D6B4F]', bg: 'bg-[#EAF3EF]' },
        { label: 'Sécurité', icon: Lock, color: 'text-[#DF842C]', bg: 'bg-[#FFF0E8]' },
        { label: 'Notifications', icon: Bell, color: 'text-slate-800', bg: 'bg-[#F1E3D0]' },
      ]
    },
    {
      title: 'Préférences',
      items: [
        { label: 'Langue', icon: Globe, color: 'text-[#1D6B4F]', bg: 'bg-[#EAF3EF]' },
        { label: 'Apparence', icon: Moon, color: 'text-[#DF842C]', bg: 'bg-[#FFF0E8]' },
      ]
    },
    {
      title: 'Support',
      items: [
        { label: 'Aide', icon: HelpCircle, color: 'text-slate-800', bg: 'bg-[#F1E3D0]' },
        { label: 'À propos', icon: Info, color: 'text-[#1D6B4F]', bg: 'bg-[#EAF3EF]' },
      ]
    }
  ];

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
            onClick={() => onNavigate('profile')}
            className="h-11 w-11 rounded-2xl bg-white ring-1 ring-black/10 shadow-sm flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <h1 className="text-[28px] font-display font-bold tracking-tight">Réglages</h1>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pb-[calc(96px+34px)] pt-8 relative">
        <div className="space-y-8">
          {sections.map((section, sIdx) => (
            <section key={sIdx}>
              <h2 className="text-[14px] font-sans font-bold text-slate-500 uppercase tracking-widest mb-4 ml-2">{section.title}</h2>
              <div className="rounded-[32px] bg-white ring-1 ring-black/10 shadow-lg p-4 space-y-2">
                {section.items.map((item, iIdx) => (
                  <button key={iIdx} className="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-[#FBF4EA] transition-colors">
                    <div className="flex items-center gap-4">
                      <span className={`h-11 w-11 rounded-2xl ${item.bg} flex items-center justify-center`}>
                        <item.icon className={`w-5 h-5 ${item.color}`} />
                      </span>
                      <span className="text-[15px] font-sans font-semibold text-slate-800">{item.label}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </button>
                ))}
              </div>
            </section>
          ))}

          <button className="w-full h-16 rounded-[28px] bg-[#FFF0E8] ring-1 ring-[#DF842C]/20 text-[#DF842C] font-sans font-bold flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] active:scale-[0.98]">
            <LogOut className="w-5 h-5" />
            Se déconnecter
          </button>
        </div>
      </main>
    </motion.div>
  );
};
