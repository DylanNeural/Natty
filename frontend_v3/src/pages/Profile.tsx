import { motion } from 'motion/react';
import { ArrowLeft, Settings, Bell, HelpCircle, LogOut, ChevronRight, User, Target, Activity, ShieldCheck, CreditCard, Sparkles, Zap, Info, Check, Plus, Moon, Sun, Globe, Lock, Mail, Phone, MapPin, Camera, Pencil, Star, Heart, History, Refrigerator, Utensils, Drumstick, Wheat, Droplet, Flame, ShieldAlert } from 'lucide-react';
import { Page } from '../types';

interface ProfileProps {
  onNavigate: (page: Page) => void;
}

export const Profile = ({ onNavigate }: ProfileProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full min-h-screen flex flex-col bg-[#FBF4EA] text-slate-900 relative grain noise overflow-x-hidden"
    >
      <header className="shrink-0 pt-14 px-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="h-11 w-11 rounded-2xl bg-white ring-1 ring-black/10 shadow-sm flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>

          <div className="flex items-center gap-3">
            <button className="h-14 w-14 rounded-2xl bg-white ring-1 ring-black/10 shadow-sm flex items-center justify-center transition-transform hover:scale-105">
              <Zap className="w-5 h-5 text-slate-700" />
            </button>
            <button className="h-14 w-14 rounded-2xl bg-white ring-1 ring-black/10 shadow-sm flex items-center justify-center transition-transform hover:scale-105">
              <Settings className="w-5 h-5 text-slate-700" />
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center">
          <div className="relative">
            <div className="h-32 w-32 rounded-[40px] bg-[#1D6B4F] ring-4 ring-white shadow-2xl flex items-center justify-center overflow-hidden">
              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <button className="absolute -right-2 -bottom-2 h-11 w-11 rounded-2xl bg-[#DF842C] text-white ring-4 ring-white shadow-lg flex items-center justify-center transition-transform hover:scale-110">
              <Camera className="w-5 h-5" />
            </button>
          </div>
          <h1 className="mt-5 text-[32px] font-display font-bold tracking-tight">Dylan P.</h1>
          <p className="text-[14px] font-sans text-slate-600">Membre Natty Pro ✨</p>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white ring-1 ring-black/10 p-4 flex flex-col items-center shadow-sm">
            <p className="text-[11px] font-sans text-slate-500 uppercase tracking-wider">Poids</p>
            <p className="mt-1 text-[20px] font-display font-bold">78<span className="text-[12px] font-sans font-normal text-slate-500"> kg</span></p>
          </div>
          <div className="rounded-2xl bg-white ring-1 ring-black/10 p-4 flex flex-col items-center shadow-sm">
            <p className="text-[11px] font-sans text-slate-500 uppercase tracking-wider">Taille</p>
            <p className="mt-1 text-[20px] font-display font-bold">182<span className="text-[12px] font-sans font-normal text-slate-500"> cm</span></p>
          </div>
          <div className="rounded-2xl bg-white ring-1 ring-black/10 p-4 flex flex-col items-center shadow-sm">
            <p className="text-[11px] font-sans text-slate-500 uppercase tracking-wider">Âge</p>
            <p className="mt-1 text-[20px] font-display font-bold">28<span className="text-[12px] font-sans font-normal text-slate-500"> ans</span></p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pb-[calc(96px+34px)] pt-8 relative max-w-7xl mx-auto w-full">
        <section className="space-y-6">
          <div className="rounded-[32px] bg-white ring-1 ring-black/10 shadow-lg p-6 reveal">
            <h2 className="text-[18px] font-display font-bold tracking-tight">Mon Compte</h2>
            <div className="mt-5 space-y-4">
              {[
                { label: 'Infos Personnelles', icon: User, color: 'text-[#1D6B4F]', bg: 'bg-[#EAF3EF]', page: 'profile' },
                { label: 'Objectifs & Macros', icon: Target, color: 'text-[#DF842C]', bg: 'bg-[#FFF0E8]', page: 'stats' },
                { label: 'Historique des Repas', icon: History, color: 'text-slate-800', bg: 'bg-[#F1E3D0]', page: 'meal-history' },
                { label: 'Mes Favoris', icon: Heart, color: 'text-red-500', bg: 'bg-red-50', page: 'favorites' },
                { label: 'Mes Commandes Frigo', icon: Refrigerator, color: 'text-[#1D6B4F]', bg: 'bg-[#EAF3EF]', page: 'order-tracking' },
                { label: 'Console Admin', icon: ShieldAlert, color: 'text-rose-600', bg: 'bg-rose-50', page: 'admin-dashboard' },
              ].map((item, idx) => (
                <button 
                  key={idx} 
                  onClick={() => item.page && onNavigate(item.page as Page)}
                  className="w-full flex items-center justify-between p-2 rounded-2xl hover:bg-[#FBF4EA] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className={`h-12 w-12 rounded-2xl ${item.bg} flex items-center justify-center`}>
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                    </span>
                    <span className="text-[15px] font-sans text-slate-800">{item.label}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] bg-white ring-1 ring-black/10 shadow-lg p-6 reveal">
            <h2 className="text-[18px] font-display font-bold tracking-tight">Préférences</h2>
            <div className="mt-5 space-y-4">
              {[
                { label: 'Notifications', icon: Bell, color: 'text-[#DF842C]', bg: 'bg-[#FFF0E8]' },
                { label: 'Sécurité & Confidentialité', icon: Lock, color: 'text-[#1D6B4F]', bg: 'bg-[#EAF3EF]' },
                { label: 'Abonnement Natty Pro', icon: CreditCard, color: 'text-slate-800', bg: 'bg-[#F1E3D0]' },
              ].map((item, idx) => (
                <button key={idx} className="w-full flex items-center justify-between p-2 rounded-2xl hover:bg-[#FBF4EA] transition-colors">
                  <div className="flex items-center gap-4">
                    <span className={`h-12 w-12 rounded-2xl ${item.bg} flex items-center justify-center`}>
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                    </span>
                    <span className="text-[15px] font-sans text-slate-800">{item.label}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] bg-white ring-1 ring-black/10 shadow-lg p-6 reveal">
            <h2 className="text-[18px] font-display font-bold tracking-tight">Aide & Support</h2>
            <div className="mt-5 space-y-4">
              {[
                { label: 'Centre d’aide', icon: HelpCircle, color: 'text-[#1D6B4F]', bg: 'bg-[#EAF3EF]' },
                { label: 'Nous Contacter', icon: Mail, color: 'text-[#DF842C]', bg: 'bg-[#FFF0E8]' },
              ].map((item, idx) => (
                <button key={idx} className="w-full flex items-center justify-between p-2 rounded-2xl hover:bg-[#FBF4EA] transition-colors">
                  <div className="flex items-center gap-4">
                    <span className={`h-12 w-12 rounded-2xl ${item.bg} flex items-center justify-center`}>
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                    </span>
                    <span className="text-[15px] font-sans text-slate-800">{item.label}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </button>
              ))}
            </div>
          </div>

          <button className="w-full h-16 rounded-[28px] bg-[#FFF0E8] ring-1 ring-[#DF842C]/20 text-[#DF842C] font-sans font-bold flex items-center justify-center gap-3 transition-transform hover:scale-[1.02] active:scale-[0.98]">
            <LogOut className="w-5 h-5" />
            Se déconnecter
          </button>
        </section>

        <section className="mt-12 text-center pb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-xl bg-[#1D6B4F] ring-1 ring-black/10 flex items-center justify-center overflow-hidden">
              <img src="https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/b1cbfc0e-79d5-45d7-9749-3bc14aed3a08/1771507502618-bf5a3efd/LOGO-BEIGE.png" alt="Natty" className="h-5 w-auto" />
            </div>
            <p className="text-[18px] font-display font-bold tracking-tight">Natty App</p>
          </div>
          <p className="text-[12px] font-sans text-slate-500">Version 2.4.0 (Build 128)</p>
          <p className="mt-1 text-[12px] font-sans text-slate-500">Fait avec ❤️ pour ta santé.</p>
        </section>
      </main>
    </motion.div>
  );
};
