import React from 'react';
import { Settings, User, Scale, Bell, CreditCard, Shield, LogOut } from 'lucide-react';
import Card from '../ui/Card';
import { UserProfile, Screen } from '../../types';

interface ProfileScreenProps {
  user: UserProfile;
  onSettings: () => void;
  onNavigate: (screen: any) => void;
  onLogout: () => void;
}

const ProfileScreen = ({ user, onSettings, onNavigate, onLogout }: ProfileScreenProps) => {
  const settingsItems = [
    { icon: User, label: 'Informations personnelles', screen: 'personal-info' as Screen },
    { icon: Scale, label: 'Objectifs & Macros', screen: 'goals-macros' as Screen },
    { icon: Bell, label: 'Notifications', screen: 'notifications' as Screen },
    { icon: CreditCard, label: 'Paiement & Abonnements', screen: 'subscription' as Screen },
    ...(user.isAdmin ? [{ icon: Shield, label: 'Console Admin', screen: 'admin' as Screen }] : []),
  ];

  return (
  <div className="p-6 space-y-8 pb-32 pt-safe">
    <header className="flex flex-col items-center text-center space-y-4">
      <div className="w-24 h-24 bg-natty-teal rounded-[32px] flex items-center justify-center text-natty-lime font-black text-4xl shadow-xl relative">
        N
        <button onClick={onSettings} className="absolute -bottom-2 -right-2 w-8 h-8 bg-natty-orange text-white rounded-full flex items-center justify-center border-4 border-natty-beige">
          <Settings size={14} />
        </button>
      </div>
      <div>
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <p className="text-sm text-natty-charcoal/40 font-medium">{user.email}</p>
      </div>
      <div className="flex gap-2">
        <span className="bg-natty-lime/20 text-natty-teal text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Athlète</span>
        <span className="bg-natty-orange/20 text-natty-orange text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Premium</span>
      </div>
    </header>

    <div className="grid grid-cols-2 gap-4">
      <Card className="p-4 text-center space-y-1">
        <span className="text-2xl font-black text-natty-teal">12</span>
        <p className="text-[10px] font-bold uppercase tracking-widest text-natty-charcoal/40">Jours actifs</p>
      </Card>
      <Card className="p-4 text-center space-y-1">
        <span className="text-2xl font-black text-natty-teal">45</span>
        <p className="text-[10px] font-bold uppercase tracking-widest text-natty-charcoal/40">Repas loggés</p>
      </Card>
    </div>

    <section className="space-y-4">
      <h3 className="font-bold text-lg">Paramètres</h3>
      <div className="space-y-2">
        {settingsItems.map((item, i) => (
          <button 
            key={i} 
            onClick={() => onNavigate(item.screen)}
            className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white transition-colors text-left"
          >
            <div className="w-10 h-10 bg-natty-charcoal/5 rounded-xl flex items-center justify-center text-natty-teal">
              <item.icon size={20} />
            </div>
            <span className="font-bold text-sm text-natty-charcoal/70">{item.label}</span>
          </button>
        ))}
      </div>
    </section>

    <button
      onClick={onLogout}
      className="w-full h-12 rounded-2xl bg-red-50 text-red-600 font-black text-sm flex items-center justify-center gap-2 border border-red-100"
    >
      <LogOut size={16} />
      Déconnexion
    </button>
  </div>
  );
};

export default ProfileScreen;
