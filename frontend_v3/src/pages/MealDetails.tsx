import { motion } from 'motion/react';
import { ArrowLeft, Share2, ScanLine, Clock, Flame, Drumstick, Wheat, Droplet, Pencil, Minus, Plus, X, Sparkles, MapPin, Utensils, ShieldCheck, Candy, Waves, Info, Leaf, ShoppingCart, Refrigerator } from 'lucide-react';
import { Page } from '../types';

interface MealDetailsProps {
  onNavigate: (page: Page) => void;
}

export const MealDetails = ({ onNavigate }: MealDetailsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full min-h-screen flex flex-col bg-[#FBF4EA] text-slate-900 relative grain noise overflow-x-hidden"
    >
      <header className="shrink-0 pt-14 px-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigate('scanner')}
              className="h-14 px-4 rounded-[20px] bg-white ring-1 ring-black/10 shadow-sm inline-flex items-center justify-center gap-2 font-sans text-[14px] text-slate-800 hover:-translate-y-0.5 active:scale-[0.99] transition"
            >
              <ArrowLeft className="w-5 h-5 text-slate-700" />
              <span>Retour</span>
            </button>

            <div className="leading-tight">
              <p className="text-[12px] text-slate-600 font-sans">Repas</p>
              <h1 className="text-[32px] font-display font-bold tracking-tight leading-none">Détails</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="h-14 w-14 rounded-2xl bg-white ring-1 ring-black/10 shadow-sm flex items-center justify-center hover:-translate-y-0.5 active:scale-[0.99] transition">
              <iconify-icon icon="lucide:bookmark" class="text-[20px] text-slate-700"></iconify-icon>
            </button>
            <button className="h-14 w-14 rounded-2xl bg-white ring-1 ring-black/10 shadow-sm flex items-center justify-center hover:-translate-y-0.5 active:scale-[0.99] transition">
              <Share2 className="w-5 h-5 text-slate-700" />
            </button>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-2xl bg-white ring-1 ring-black/10 px-3 py-2">
            <ScanLine className="w-4 h-4 text-[#1D6B4F]" />
            <span className="text-[13px] font-sans text-slate-700">Scanné</span>
          </span>
          <span className="inline-flex items-center gap-2 rounded-2xl bg-white ring-1 ring-black/10 px-3 py-2">
            <Clock className="w-4 h-4 text-[#E8956F]" />
            <span className="text-[13px] font-sans text-slate-700">Déjeuner</span>
          </span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-5 pb-[calc(96px+34px)] pt-6 relative">
        <section className="rounded-[28px] bg-white ring-1 ring-black/10 shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[12px] text-slate-600 font-sans">Bowl</p>
                <h2 className="text-[22px] font-display font-bold tracking-tight leading-tight">Poulet • quinoa • légumes</h2>
                <p className="mt-1 text-[12px] font-sans text-slate-600">Portion estimée à partir de ta sélection — bien joué 👌</p>
              </div>
              <div className="shrink-0">
                <span className="inline-flex items-center gap-2 rounded-2xl bg-[#FBF4EA] ring-1 ring-black/10 px-3 py-2">
                  <Flame className="w-4 h-4 text-[#E8956F]" />
                  <span className="text-[13px] font-sans text-slate-700">720 kcal</span>
                </span>
              </div>
            </div>

            <div className="mt-6 rounded-[24px] bg-[#FBF4EA] ring-1 ring-black/10 p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[14px] font-display font-bold tracking-tight text-slate-900">Tes macros t'applaudissent 🎉</p>
                  <p className="mt-1 text-[12px] font-sans text-slate-600">Un bowl qui coche les cases : énergie, protéines, équilibre.</p>
                </div>
                <div className="shrink-0">
                  <div className="h-[76px] w-[76px] rounded-[24px] bg-white ring-1 ring-black/10 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 h-16 w-16 rounded-full bg-[#C3D36D] opacity-55"></div>
                    <div className="absolute -left-7 -bottom-7 h-20 w-20 rounded-full bg-[#DF842C] opacity-25"></div>
                    <svg className="relative" width="52" height="52" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 30c0 14 10 24 22 24s22-10 22-24" stroke="#134030" strokeWidth="4" strokeLinecap="round"/>
                      <path d="M16 30c0 10 7 18 16 18s16-8 16-18" stroke="#134030" strokeWidth="4" strokeLinecap="round" opacity="0.5"/>
                      <path d="M22 26c2-5 8-9 10-9s8 4 10 9" stroke="#DF842C" strokeWidth="4" strokeLinecap="round"/>
                      <path d="M20 34c2 4 6 7 12 7s10-3 12-7" stroke="#C3D36D" strokeWidth="4" strokeLinecap="round"/>
                      <path d="M28 16c0-2 2-4 4-4s4 2 4 4" stroke="#134030" strokeWidth="4" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="rounded-2xl bg-[#FBF4EA] ring-1 ring-black/10 p-4 macro-card">
                <div className="flex items-center justify-between">
                  <p className="text-[12px] font-sans text-slate-700">Glucides 🌾</p>
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-xl bg-[#F1E3D0]">
                    <Wheat className="w-3.5 h-3.5 text-slate-700" />
                  </span>
                </div>
                <p className="mt-2 text-[16px] font-display font-bold">68<span className="text-[12px] font-sans font-normal text-slate-500"> g</span></p>
                <p className="mt-1 text-[11px] font-sans text-slate-500">Bien maîtrisés ✨ ~ 38%</p>
              </div>
              <div className="rounded-2xl bg-[#EAF3EF] ring-1 ring-black/10 p-4 macro-card">
                <div className="flex items-center justify-between">
                  <p className="text-[12px] font-sans text-slate-700">Protéines 💪</p>
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-xl bg-white ring-1 ring-black/10">
                    <Drumstick className="w-3.5 h-3.5 text-[#1D6B4F]" />
                  </span>
                </div>
                <p className="mt-2 text-[16px] font-display font-bold">46<span className="text-[12px] font-sans font-normal text-slate-500"> g</span></p>
                <p className="mt-1 text-[11px] font-sans text-slate-500">Au top ! 🔥 ~ 26%</p>
              </div>
              <div className="rounded-2xl bg-[#FFF0E8] ring-1 ring-black/10 p-4 macro-card">
                <div className="flex items-center justify-between">
                  <p className="text-[12px] font-sans text-slate-700">Lipides 🫒</p>
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-xl bg-white ring-1 ring-black/10">
                    <Droplet className="w-3.5 h-3.5 text-[#E8956F]" />
                  </span>
                </div>
                <p className="mt-2 text-[16px] font-display font-bold">22<span className="text-[12px] font-sans font-normal text-slate-500"> g</span></p>
                <p className="mt-1 text-[11px] font-sans text-slate-500">Équilibrés 👌 ~ 28%</p>
              </div>
            </div>

            <div className="mt-6 rounded-[24px] bg-[#FBF4EA] ring-1 ring-black/10 p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[12px] font-sans text-slate-600">Quantité</p>
                  <p className="text-[16px] font-display font-bold tracking-tight">1 portion</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="h-14 w-14 rounded-2xl bg-white ring-1 ring-black/10 flex items-center justify-center hover:-translate-y-0.5 active:scale-[0.99] transition">
                    <Minus className="w-5 h-5 text-slate-800" />
                  </button>
                  <div className="h-14 min-w-[84px] rounded-2xl bg-white ring-1 ring-black/10 flex items-center justify-center px-4">
                    <span className="text-[14px] font-sans text-slate-800">1×</span>
                  </div>
                  <button className="h-14 w-14 rounded-2xl bg-white ring-1 ring-black/10 flex items-center justify-center hover:-translate-y-0.5 active:scale-[0.99] transition">
                    <Plus className="w-5 h-5 text-slate-800" />
                  </button>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white ring-1 ring-black/10 p-3">
                  <p className="text-[11px] font-sans text-slate-600">Calories</p>
                  <p className="mt-1 text-[16px] font-display font-bold">720<span className="text-[12px] font-sans font-normal text-slate-500"> kcal</span></p>
                </div>
                <div className="rounded-2xl bg-white ring-1 ring-black/10 p-3">
                  <p className="text-[11px] font-sans text-slate-600">Poids</p>
                  <p className="mt-1 text-[16px] font-display font-bold">~ 520<span className="text-[12px] font-sans font-normal text-slate-500"> g</span></p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-[28px] bg-white ring-1 ring-black/10 shadow-lg p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[12px] text-slate-600 font-sans">Ingrédients</p>
              <h3 className="text-[18px] font-display font-bold tracking-tight">Détail</h3>
            </div>
            <button className="h-14 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FBF4EA] ring-1 ring-black/10 px-5 text-[14px] font-sans text-slate-700 hover:-translate-y-0.5 active:scale-[0.99] transition">
              <Pencil className="w-4 h-4" />
              Modifier
            </button>
          </div>

          <div className="mt-5 space-y-4">
            {[
              { label: 'Poulet grillé', qty: '150 g', kcal: 248, icon: Drumstick, color: 'text-[#1D6B4F]' },
              { label: 'Quinoa cuit', qty: '140 g', kcal: 168, icon: Wheat, color: 'text-slate-800' },
              { label: 'Légumes rôtis', qty: '200 g', kcal: 124, icon: Leaf, color: 'text-[#E8956F]' },
              { label: 'Sauce (huile + citron)', qty: '20 g', kcal: 180, icon: Droplet, color: 'text-[#E8956F]' },
            ].map((ing, idx) => (
              <div key={idx} className="rounded-2xl bg-[#FBF4EA] ring-1 ring-black/10 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="h-11 w-11 rounded-2xl bg-white ring-1 ring-black/10 flex items-center justify-center">
                      <ing.icon className={`w-5 h-5 ${ing.color}`} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-[14px] font-display font-bold truncate">{ing.label}</p>
                      <p className="text-[12px] font-sans text-slate-600">{ing.qty}</p>
                    </div>
                  </div>
                  <p className="text-[12px] font-sans text-slate-600">~ {ing.kcal} kcal</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl bg-white ring-1 ring-black/10 p-6">
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-sans text-slate-600">Note</p>
              <span className="inline-flex items-center gap-1 rounded-xl bg-[#EAF3EF] px-2 py-1 text-[#1D6B4F] ring-1 ring-black/10 text-[12px] font-sans">
                <Info className="w-3 h-3" />
                Estimation
              </span>
            </div>
            <p className="mt-2 text-[13px] font-sans text-slate-700 leading-relaxed">
              Ajuste la quantité si tu n’as pas mangé toute la portion — les calories et macros se mettront à jour.
            </p>
          </div>
        </section>

        <section className="mt-6">
          <div className="grid grid-cols-2 gap-5">
            <button 
              onClick={() => onNavigate('scanner')}
              className="h-14 rounded-2xl bg-white ring-1 ring-black/10 shadow-sm inline-flex items-center justify-center gap-2 font-sans text-[14px] text-slate-800 hover:-translate-y-0.5 active:scale-[0.99] transition"
            >
              <X className="w-4 h-4 text-slate-700" />
              Retour
            </button>
            <button 
              onClick={() => onNavigate('cart')}
              className="h-14 rounded-2xl bg-[#DF842C] text-white ring-1 ring-black/10 shadow-lg inline-flex items-center justify-center gap-2 font-sans text-[14px] hover:-translate-y-0.5 active:scale-[0.99] transition"
            >
              <Sparkles className="w-4 h-4" />
              Ajouter au panier ✨
            </button>
          </div>

          <div className="mt-5 rounded-[28px] bg-[#0F3D2D] text-[#FBF4EA] ring-1 ring-black/10 shadow-2xl overflow-hidden">
            <div className="p-6 relative">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#E8956F]/35 blur-2xl"></div>
              <div className="absolute -left-12 -bottom-12 h-44 w-44 rounded-full bg-[#FBF4EA]/20 blur-2xl"></div>
              <div className="relative">
                <p className="text-[12px] font-sans text-[#FBF4EA]/80">Envie d’un plat prêt ?</p>
                <h3 className="text-[18px] font-display font-bold tracking-tight">Voir les plats du frigo Natty</h3>
                <p className="mt-1 text-[12px] font-sans text-[#FBF4EA]/80">Commande et récupère au frigo connecté le plus proche.</p>
                <div className="mt-5 flex items-center justify-between gap-4">
                  <span className="inline-flex items-center gap-2 rounded-2xl bg-[#1D6B4F] ring-1 ring-black/10 px-3 py-2">
                    <MapPin className="w-4 h-4 text-[#E8956F]" />
                    <span className="text-[13px] font-sans">Bourse • 600m</span>
                  </span>
                  <button 
                    onClick={() => onNavigate('fridge')}
                    className="h-14 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#E8956F] text-white ring-1 ring-black/10 px-5 font-sans text-[14px] shadow-lg hover:-translate-y-0.5 active:scale-[0.99] transition"
                  >
                    <Utensils className="w-4 h-4" />
                    Ouvrir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </motion.div>
  );
};
