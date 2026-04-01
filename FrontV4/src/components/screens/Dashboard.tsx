import React, { useState, useEffect } from 'react';
import { Bell, Droplets, Clock, Zap, Map as MapIcon, Users } from 'lucide-react';
import Card from '../ui/Card';
import { UserProfile, Screen } from '../../types';
import { getActiveChallenge, getArticles } from '../../services/apiService';

interface DashboardProps {
  user: UserProfile;
  onNavigate: (s: Screen) => void;
}

const Dashboard = ({ user, onNavigate }: DashboardProps) => {
  const [activeChallenge, setActiveChallenge] = useState<any>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiTip, setAiTip] = useState('Après l\'effort, privilégiez les protéines dans les 30 premières minutes pour optimiser votre récupération musculaire.');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [challengeRes, articlesRes] = await Promise.all([
        getActiveChallenge(),
        getArticles()
      ]);
      
      setActiveChallenge(challengeRes);
      setArticles(articlesRes.articles || []);

      // Simule des conseils IA différents selon les stats
      const calories = user.stats?.calories || 0;
      const waterCurrent = user.waterIntake?.current || 0;
      const waterGoal = user.waterIntake?.goal || 2.5;
      const protein = user.stats?.protein || 0;

      if (calories > 2000) {
        setAiTip('Vous avez dépassé votre apport calorique. Demain, privilégiez les aliments légers et riches en fibres.');
      } else if (waterCurrent < waterGoal * 0.5) {
        setAiTip('Vous n\'avez bu que 50% de votre objectif hydrique. Augmentez progressivement votre consommation d\'eau.');
      } else if (protein < 100) {
        setAiTip('Votre apport en protéines est insuffisant. Intégrez plus de viande, œufs ou légumineuses à votre repas.');
      }
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFormattedDate = () => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('fr-FR', options);
  };

  return (
    <div className="space-y-6 pb-24 pb-safe">
      <header className="flex justify-between items-center p-6 bg-natty-beige sticky top-0 z-10 pt-safe">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-natty-teal rounded-xl flex items-center justify-center text-natty-lime font-black text-xl">N</div>
          <div>
            <h2 className="font-bold text-xl">Bonjour, {user.name} 👋</h2>
            <p className="text-xs text-natty-charcoal/60">{getFormattedDate()}</p>
          </div>
        </div>
        <button onClick={() => onNavigate('notifications')} className="w-10 h-10 bg-natty-teal text-white rounded-full flex items-center justify-center relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-natty-beige rounded-full"></span>
        </button>
      </header>

      <div className="px-6 space-y-6">
        <Card className="grid grid-cols-3 gap-4 p-4">
          <div className="flex flex-col items-center justify-center border-r border-black/5">
            <div className="relative w-16 h-16 flex items-center justify-center mb-2">
              <svg className="w-full h-full -rotate-90">
                <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="text-natty-charcoal/5" />
                <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="175.9" strokeDashoffset={175.9 * (1 - ((user.stats?.calories || 0) / 2000))} className="text-natty-lime" />
              </svg>
              <span className="absolute text-xs font-bold">{Math.round(((user.stats?.calories || 0) / 2000) * 100)}%</span>
            </div>
            <span className="text-lg font-black">{user.stats?.calories || 0}</span>
            <span className="text-[10px] uppercase tracking-wider text-natty-charcoal/60 font-bold">kcal</span>
          </div>
          <div className="flex flex-col items-center justify-center border-r border-black/5">
            <Droplets className="text-blue-500 mb-2" size={24} />
            <span className="text-lg font-black">{(user.waterIntake?.current || 0).toFixed(1)} / {(user.waterIntake?.goal || 2.5).toFixed(1)} L</span>
            <span className="text-[10px] uppercase tracking-wider text-natty-charcoal/60 font-bold">Hydratation</span>
          </div>
          <div className="flex flex-col items-center justify-center">
            <Clock className="text-natty-orange mb-2" size={24} />
            <span className="text-lg font-black">{user.stats?.protein || 0}g</span>
            <span className="text-[10px] uppercase tracking-wider text-natty-charcoal/60 font-bold">Protéines</span>
          </div>
        </Card>

        <div className="bg-natty-lime/20 p-6 rounded-3xl border border-natty-lime/30 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-2 text-natty-teal">
            <Zap size={18} fill="currentColor" />
            <span className="font-bold text-sm">Conseil IA</span>
          </div>
          <p className="text-natty-teal font-medium leading-snug">{aiTip}</p>
        </div>

        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <h3 className="font-bold text-lg">Découvrir</h3>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <Card onClick={() => onNavigate('social')} className="p-4 bg-white border-none flex items-center gap-4">
              <div className="w-12 h-12 bg-natty-teal/10 rounded-2xl flex items-center justify-center">
                <Users size={24} className="text-natty-teal" />
              </div>
              <div className="flex-1">
                <span className="font-bold text-sm text-natty-teal block">Communauté</span>
                <p className="text-[10px] text-natty-charcoal/60 font-medium">Rejoins les sportifs de ta ville</p>
              </div>
            </Card>
          </div>
        </section>

        {activeChallenge && (
          <section className="space-y-4">
            <div className="flex justify-between items-end">
              <h3 className="font-bold text-lg">Défi en cours</h3>
              <span className="text-natty-lime font-bold text-sm">{activeChallenge.currentDay} / {activeChallenge.totalDays} jours</span>
            </div>
            <Card onClick={() => onNavigate('challenges')} className="p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold">{activeChallenge.title}</h4>
              </div>
              <div className="h-2 w-full bg-natty-charcoal/5 rounded-full overflow-hidden">
                <div className="h-full bg-natty-lime transition-all" style={{ width: `${activeChallenge.progress}%` }} />
              </div>
            </Card>
          </section>
        )}

        {articles.length > 0 && (
          <section className="space-y-4">
            <div className="flex justify-between items-end">
              <h3 className="font-bold text-lg">Articles Santé</h3>
              <button onClick={() => onNavigate('home')} className="text-natty-teal font-bold text-sm">Voir tout</button>
            </div>
            <div className="overflow-x-auto flex gap-4 pb-4 -mx-6 px-6 no-scrollbar">
              {articles.map(article => (
                <Card key={article.id} className="min-w-[280px] p-0 overflow-hidden border-none shadow-md cursor-pointer hover:shadow-lg transition-shadow">
                  <img src={article.image} alt={article.title} className="w-full h-32 object-cover" referrerPolicy="no-referrer" />
                  <div className="p-4 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-natty-teal bg-natty-teal/10 px-2 py-1 rounded-md">{article.category}</span>
                    <h4 className="font-bold leading-tight text-natty-charcoal">{article.title}</h4>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
