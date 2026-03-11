import { motion } from 'motion/react';
import { ArrowLeft, MapPin, Refrigerator, Search, Sliders, Star, Clock, Flame, Drumstick, Wheat, Droplet, Plus, ArrowRight, ShoppingCart, Sparkles, Zap, Info, Check, ShieldCheck, Waves, Candy } from 'lucide-react';
import { Page } from '../types';

interface FridgeProps {
  onNavigate: (page: Page) => void;
}

export const Fridge = ({ onNavigate }: FridgeProps) => {
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
              <Refrigerator className="w-5 h-5 text-slate-700" />
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-[#1D6B4F] ring-1 ring-black/10 flex items-center justify-center overflow-hidden">
              <img src="https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/b1cbfc0e-79d5-45d7-9749-3bc14aed3a08/1771507502618-bf5a3efd/LOGO-BEIGE.png" alt="Natty" className="h-6 w-auto" />
            </div>
            <div className="leading-tight">
              <p className="text-[12px] text-slate-600 font-sans leading-relaxed">Frigo Connecté</p>
              <h1 className="text-[32px] leading-[1.3] font-display font-bold tracking-tight">Le menu du jour</h1>
            </div>
          </div>

          <span className="inline-flex items-center gap-2 rounded-2xl bg-white ring-1 ring-black/10 px-3 py-2">
            <Sparkles className="w-4 h-4 text-[#DF842C]" />
            <span className="text-[13px] font-sans text-slate-700">Frais & Natty ✨</span>
          </span>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <div className="flex-1 h-14 rounded-2xl bg-white ring-1 ring-black/10 shadow-sm flex items-center px-4 gap-3">
            <Search className="w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Un plat, un ingrédient..." 
              className="flex-1 bg-transparent border-none outline-none text-[15px] font-sans text-slate-800 placeholder:text-slate-400"
            />
          </div>
          <button className="h-14 w-14 rounded-2xl bg-white ring-1 ring-black/10 shadow-sm flex items-center justify-center transition-transform hover:scale-105">
            <Sliders className="w-5 h-5 text-slate-700" />
          </button>
        </div>

        <div className="mt-5 flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
          <span className="inline-flex items-center gap-2 rounded-2xl bg-[#201D16] text-[#FAEBDD] ring-1 ring-[#FAEBDD]/15 px-4 py-2.5 whitespace-nowrap">
            <MapPin className="w-4 h-4 text-[#DF842C]" />
            <span className="text-[13px] font-sans">Bourse • 600m</span>
          </span>
          <span className="inline-flex items-center gap-2 rounded-2xl bg-white ring-1 ring-black/10 px-4 py-2.5 whitespace-nowrap text-slate-700">
            <Star className="w-4 h-4 text-[#DF842C]" />
            <span className="text-[13px] font-sans">Favoris</span>
          </span>
          <span className="inline-flex items-center gap-2 rounded-2xl bg-white ring-1 ring-black/10 px-4 py-2.5 whitespace-nowrap text-slate-700">
            <Clock className="w-4 h-4 text-[#1D6B4F]" />
            <span className="text-[13px] font-sans">Ouvert</span>
          </span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pb-[calc(96px+34px)] pt-4 relative max-w-7xl mx-auto w-full">
        <section className="space-y-6">
          {[
            {
              title: 'Bowl Poulet & Quinoa',
              desc: 'Poulet grillé, quinoa, légumes rôtis, sauce citronnée.',
              kcal: 720,
              macros: { p: 46, g: 68, l: 22 },
              price: '12.90',
              tag: 'Best-seller 🔥',
              color: 'bg-[#EAF3EF]',
              accent: 'bg-[#1D6B4F]',
              img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400'
            },
            {
              title: 'Saumon Teriyaki',
              desc: 'Saumon frais, riz noir, edamames, brocolis.',
              kcal: 640,
              macros: { p: 38, g: 52, l: 28 },
              price: '14.50',
              tag: 'Riche en Omega-3 🐟',
              color: 'bg-[#FFF0E8]',
              accent: 'bg-[#DF842C]',
              img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=400'
            },
            {
              title: 'Salade Falafel & Houmous',
              desc: 'Falafels maison, houmous, crudités, sauce tahini.',
              kcal: 580,
              macros: { p: 22, g: 74, l: 18 },
              price: '11.50',
              tag: 'Végétarien 🌱',
              color: 'bg-[#F1E3D0]',
              accent: 'bg-slate-800',
              img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400'
            }
          ].map((item, idx) => (
            <div key={idx} className="rounded-[32px] bg-white ring-1 ring-black/10 shadow-lg overflow-hidden reveal">
              <div className="relative h-48 overflow-hidden">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute left-4 top-4">
                  <span className={`inline-flex items-center gap-2 rounded-2xl ${item.color} ring-1 ring-black/10 px-3 py-2 text-slate-800`}>
                    <Sparkles className="w-4 h-4 text-[#DF842C]" />
                    <span className="text-[13px] font-sans">{item.tag}</span>
                  </span>
                </div>
                <div className="absolute right-4 bottom-4">
                  <span className="inline-flex items-center gap-2 rounded-2xl bg-white ring-1 ring-black/10 px-3 py-2 text-slate-800">
                    <Flame className="w-4 h-4 text-[#DF842C]" />
                    <span className="text-[13px] font-sans font-bold">{item.kcal} kcal</span>
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-[20px] font-display font-bold tracking-tight">{item.title}</h3>
                    <p className="mt-1 text-[13px] font-sans leading-relaxed text-slate-600">{item.desc}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[20px] font-display font-bold tracking-tight">{item.price}€</p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  <div className={`rounded-2xl ${item.color} ring-1 ring-black/10 p-3`}>
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-sans text-slate-700">Prot.</p>
                      <Drumstick className="w-3 h-3 text-slate-600" />
                    </div>
                    <p className="mt-1 text-[16px] font-display font-bold">{item.macros.p}<span className="text-[11px] font-sans font-normal text-slate-500"> g</span></p>
                  </div>
                  <div className={`rounded-2xl ${item.color} ring-1 ring-black/10 p-3`}>
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-sans text-slate-700">Gluc.</p>
                      <Wheat className="w-3 h-3 text-slate-600" />
                    </div>
                    <p className="mt-1 text-[16px] font-display font-bold">{item.macros.g}<span className="text-[11px] font-sans font-normal text-slate-500"> g</span></p>
                  </div>
                  <div className={`rounded-2xl ${item.color} ring-1 ring-black/10 p-3`}>
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-sans text-slate-700">Lip.</p>
                      <Droplet className="w-3 h-3 text-slate-600" />
                    </div>
                    <p className="mt-1 text-[16px] font-display font-bold">{item.macros.l}<span className="text-[11px] font-sans font-normal text-slate-500"> g</span></p>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <button 
                    onClick={() => onNavigate('meal-details')}
                    className="h-14 flex-1 rounded-2xl bg-[#FBF4EA] ring-1 ring-black/10 font-sans text-[15px] text-slate-800 inline-flex items-center justify-center gap-2 transition-transform hover:scale-105"
                  >
                    <Info className="w-4 h-4 text-[#7C3AED]" />
                    Détails
                  </button>
                  <button 
                    onClick={() => onNavigate('cart')}
                    className={`h-14 flex-1 rounded-2xl ${item.accent} text-white ring-1 ring-black/10 shadow-lg font-sans text-[15px] inline-flex items-center justify-center gap-2 transition-transform hover:scale-105`}
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-8 rounded-[32px] bg-[#0F3D2D] text-[#FBF4EA] ring-1 ring-black/10 shadow-2xl overflow-hidden reveal">
          <div className="p-8 relative">
            <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-[#DF842C]/35 blur-3xl"></div>
            <div className="absolute -left-14 -bottom-14 h-52 w-52 rounded-full bg-[#C3D36D]/18 blur-3xl"></div>
            
            <div className="relative">
              <div className="flex items-center gap-3">
                <span className="h-11 w-11 rounded-2xl bg-[#1D6B4F] ring-1 ring-white/10 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-[#C3D36D]" />
                </span>
                <h3 className="text-[20px] font-display font-bold tracking-tight">Ton panier est prêt ✨</h3>
              </div>
              <p className="mt-3 text-[14px] font-sans text-[#FBF4EA]/80 leading-relaxed">
                Tu as sélectionné 2 plats. Récupère-les au frigo Natty Bourse dès maintenant ou planifie ta collecte.
              </p>
              
              <div className="mt-6 flex items-center justify-between gap-4">
                <div className="flex -space-x-3">
                  <div className="h-12 w-12 rounded-2xl ring-2 ring-[#0F3D2D] bg-white overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=100" alt="Plat 1" className="w-full h-full object-cover" />
                  </div>
                  <div className="h-12 w-12 rounded-2xl ring-2 ring-[#0F3D2D] bg-white overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=100" alt="Plat 2" className="w-full h-full object-cover" />
                  </div>
                  <div className="h-12 w-12 rounded-2xl ring-2 ring-[#0F3D2D] bg-[#1D6B4F] flex items-center justify-center text-[13px] font-bold">
                    +1
                  </div>
                </div>
                <button 
                  onClick={() => onNavigate('checkout')}
                  className="h-14 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#DF842C] text-white ring-1 ring-black/10 px-6 font-sans text-[15px] shadow-lg transition-transform hover:scale-105"
                >
                  Payer 27.40€
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </motion.div>
  );
};
