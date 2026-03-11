import { motion } from 'motion/react';
import { ArrowLeft, Heart, Search, Filter, Star, Flame, Drumstick, Wheat, Droplet, Plus, Info, ShoppingCart, Sparkles, Zap, ChevronRight } from 'lucide-react';
import { Page } from '../types';

interface FavoritesProps {
  onNavigate: (page: Page) => void;
}

export const Favorites = ({ onNavigate }: FavoritesProps) => {
  const favorites = [
    {
      id: 1,
      title: 'Bowl Poulet & Quinoa',
      desc: 'Poulet grillé, quinoa, légumes rôtis.',
      kcal: 720,
      macros: { p: 46, g: 68, l: 22 },
      img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200',
      type: 'Frigo Natty',
      color: 'bg-[#EAF3EF]',
      accent: 'text-[#1D6B4F]'
    },
    {
      id: 2,
      title: 'Yaourt grec nature',
      desc: '150g • Riche en probiotiques.',
      kcal: 162,
      macros: { p: 15, g: 6, l: 7 },
      img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&q=80&w=200',
      type: 'Scanné',
      color: 'bg-[#FFF0E8]',
      accent: 'text-[#DF842C]'
    },
    {
      id: 3,
      title: 'Saumon Teriyaki',
      desc: 'Saumon frais, riz noir, edamames.',
      kcal: 640,
      macros: { p: 38, g: 52, l: 28 },
      img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=200',
      type: 'Frigo Natty',
      color: 'bg-[#F1E3D0]',
      accent: 'text-slate-800'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="w-full min-h-screen flex flex-col bg-[#FBF4EA] text-slate-900 relative grain noise overflow-x-hidden"
    >
      <header className="shrink-0 pt-14 px-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('profile')}
            className="h-11 w-11 rounded-2xl bg-white ring-1 ring-black/10 shadow-sm flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <h1 className="text-[28px] font-display font-bold tracking-tight">Favoris</h1>
        </div>

        <div className="mt-6 flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Rechercher tes favoris..." 
              className="w-full h-14 rounded-2xl bg-white ring-1 ring-black/10 px-12 font-sans text-[15px] focus:outline-none focus:ring-2 focus:ring-[#1D6B4F]/20"
            />
          </div>
          <button className="h-14 w-14 rounded-2xl bg-white ring-1 ring-black/10 shadow-sm flex items-center justify-center">
            <Filter className="w-5 h-5 text-slate-700" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pb-[calc(96px+34px)] pt-8 relative max-w-7xl mx-auto w-full">
        <div className="space-y-6">
          {favorites.map((item) => (
            <div key={item.id} className="rounded-[32px] bg-white ring-1 ring-black/10 shadow-lg overflow-hidden reveal">
              <div className="flex items-center p-4 gap-4">
                <div className="h-24 w-24 rounded-2xl bg-slate-100 overflow-hidden shrink-0">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-sans font-bold uppercase tracking-wider ${item.accent}`}>{item.type}</span>
                    <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                  </div>
                  <h3 className="text-[18px] font-display font-bold tracking-tight truncate">{item.title}</h3>
                  <p className="text-[13px] font-sans text-slate-600 truncate">{item.desc}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="inline-flex items-center gap-1 text-[12px] font-sans font-bold text-slate-700">
                      <Flame className="w-3.5 h-3.5 text-[#DF842C]" />
                      {item.kcal} kcal
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-4 pb-4 flex items-center gap-3">
                <button 
                  onClick={() => onNavigate('meal-details')}
                  className="h-12 flex-1 rounded-xl bg-[#FBF4EA] ring-1 ring-black/10 font-sans text-[14px] text-slate-800 inline-flex items-center justify-center gap-2 transition-transform hover:scale-105"
                >
                  <Info className="w-4 h-4 text-[#7C3AED]" />
                  Détails
                </button>
                <button className="h-12 flex-1 rounded-xl bg-[#1D6B4F] text-white ring-1 ring-black/10 shadow-lg font-sans text-[14px] inline-flex items-center justify-center gap-2 transition-transform hover:scale-105">
                  <Plus className="w-4 h-4" />
                  Ajouter
                </button>
              </div>
            </div>
          ))}
        </div>

        <section className="mt-10 rounded-[32px] bg-[#201D16] text-[#FAEBDD] ring-1 ring-[#FAEBDD]/15 shadow-2xl overflow-hidden reveal">
          <div className="p-8 relative">
            <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-[#C3D36D]/25 blur-3xl"></div>
            <div className="relative">
              <div className="flex items-center gap-3">
                <span className="h-11 w-11 rounded-2xl bg-white/10 ring-1 ring-white/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#C3D36D]" />
                </span>
                <h3 className="text-[20px] font-display font-bold tracking-tight">Tes favoris IA ✨</h3>
              </div>
              <p className="mt-3 text-[14px] font-sans text-[#FAEBDD]/80 leading-relaxed">
                Natty a remarqué que tu aimes les bowls riches en protéines. Veux-tu voir d'autres suggestions similaires ?
              </p>
              <button className="mt-6 h-14 w-full rounded-2xl bg-[#DF842C] text-white ring-1 ring-black/10 shadow-lg font-sans text-[15px] inline-flex items-center justify-center gap-2 transition-transform hover:scale-105">
                <Zap className="w-4 h-4" />
                Voir les suggestions
              </button>
            </div>
          </div>
        </section>
      </main>
    </motion.div>
  );
};
