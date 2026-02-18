
import React, { useState } from 'react';
import { Screen } from '../App';

interface Props {
  onNavigate?: (screen: Screen) => void;
}

interface Fridge {
  id: number;
  name: string;
  type: 'FRIDGE' | 'STORE';
  distance: string;
  walkTime: string;
  status: 'OPEN' | 'CLOSED';
  closingTime?: string;
  battery?: 'FULL' | 'LOW';
  features?: string[];
  top: string;
  left: string;
  image: string;
}

export const MapScreen: React.FC<Props> = ({ onNavigate }) => {
  const [selectedFridge, setSelectedFridge] = useState<Fridge | null>(null);

  const fridges: Fridge[] = [
    { 
      id: 1, 
      name: 'Frigo Bureau Centre-Ville', 
      type: 'FRIDGE', 
      distance: '1,2 km', 
      walkTime: '15 min', 
      status: 'OPEN', 
      closingTime: '22h', 
      battery: 'FULL', 
      top: '40%', 
      left: '30%',
      image: 'https://images.unsplash.com/photo-1596524430615-b46475ddff6e?q=80&w=2940&auto=format&fit=crop'
    },
    { 
      id: 2, 
      name: 'Magasin Gym du Parc', 
      type: 'STORE', 
      distance: '5 min', 
      walkTime: '5 min', 
      status: 'OPEN', 
      closingTime: '20h', 
      features: ['Ferme bientôt'], 
      top: '65%', 
      left: '75%',
      image: 'https://images.unsplash.com/photo-1579847188732-2155775053f0?q=80&w=2940&auto=format&fit=crop'
    },
    { 
      id: 3, 
      name: 'Natty Fridge - Central Park', 
      type: 'FRIDGE', 
      distance: '500m', 
      walkTime: '5 min', 
      status: 'OPEN', 
      closingTime: '22h', 
      top: '35%', 
      left: '40%',
      image: 'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?q=80&w=2940&auto=format&fit=crop'
    },
  ];

  const handlePinClick = (fridge: Fridge) => {
    setSelectedFridge(fridge);
  };

  const closeDetail = () => {
    setSelectedFridge(null);
  };

  return (
    <div className="relative h-full w-full bg-gray-900 overflow-hidden font-display">
      {/* Map Background - Sexy Dark Theme */}
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2948&auto=format&fit=crop")',
            filter: 'contrast(1.2) saturate(0.9) brightness(0.8)'
        }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-primary/20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
      </div>

      {/* Pins */}
      {fridges.map(fridge => (
        <div key={fridge.id} className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10" style={{ top: fridge.top, left: fridge.left }}>
            {selectedFridge?.id === fridge.id && (
                <div className="absolute inset-0 rounded-full bg-white/40 animate-ping"></div>
            )}
            <button 
            onClick={() => handlePinClick(fridge)}
            aria-label={`Voir les détails de ${fridge.name}`}
            className={`relative flex items-center justify-center rounded-full shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all active:scale-90 border-4 border-white dark:border-gray-900 ${fridge.type === 'FRIDGE' ? 'bg-primary text-white size-14' : 'bg-warning text-white size-12'}`}
            >
            <span className="material-symbols-outlined text-2xl" aria-hidden="true">{fridge.type === 'FRIDGE' ? 'kitchen' : 'storefront'}</span>
            </button>
            {/* Tooltip for pin */}
            <div className={`absolute -bottom-8 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded-full whitespace-nowrap shadow-lg transition-opacity ${selectedFridge?.id === fridge.id ? 'opacity-0' : 'opacity-100'}`}>
                <p className="text-[10px] font-bold text-gray-800 dark:text-white">{fridge.walkTime}</p>
            </div>
        </div>
      ))}

      {/* Search Bar - Floating Glass */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-col gap-3">
        <div className="flex h-14 w-full items-center rounded-2xl bg-white/60 dark:bg-black/60 backdrop-blur-xl shadow-2xl px-4 gap-3 border border-white/30 dark:border-white/10">
          <span className="material-symbols-outlined text-gray-600 dark:text-gray-300 text-2xl" aria-hidden="true">search</span>
          <input className="flex-1 bg-transparent border-none focus:ring-0 text-text-light dark:text-text-dark placeholder-gray-600 dark:placeholder-gray-300 text-base font-medium" placeholder="Rechercher..." aria-label="Rechercher un frigo ou un magasin" />
          <div className="h-6 w-px bg-gray-400/30 mx-1"></div>
          <button className="p-2 rounded-lg text-gray-600 dark:text-gray-300 active:bg-white/10 transition-colors" aria-label="Filtres">
             <span className="material-symbols-outlined text-xl" aria-hidden="true">tune</span>
          </button>
        </div>
        
        {/* Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 px-1">
          <Chip label="Tout" active />
          <Chip label="Frigos" icon="kitchen" />
          <Chip label="Magasins" icon="storefront" />
          <Chip label="Ouvert" icon="schedule" />
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute right-4 bottom-36 flex flex-col gap-3 z-10">
         <button className="size-12 rounded-2xl bg-white/10 backdrop-blur-xl shadow-xl flex items-center justify-center text-white border border-white/20 active:bg-white/20 transition-colors" aria-label="Changer le type de carte">
            <span className="material-symbols-outlined" aria-hidden="true">layers</span>
         </button>
         <button className="size-12 rounded-2xl bg-white/80 dark:bg-primary/90 backdrop-blur-xl shadow-xl flex items-center justify-center text-primary dark:text-white border border-white/20 active:scale-95 transition-transform" aria-label="Ma position">
            <span className="material-symbols-outlined" aria-hidden="true">my_location</span>
         </button>
      </div>

      {/* Bottom Sheet Detail */}
      {selectedFridge && (
        <div className="absolute bottom-0 left-0 right-0 z-30 pt-4 animate-slide-up">
          <div className="bg-white dark:bg-[#1A1A1A] rounded-t-[2.5rem] shadow-[0_-10px_60px_rgba(0,0,0,0.5)] pb-24 overflow-hidden border-t border-white/10">
            {/* Header Image */}
            <div className="h-48 w-full bg-cover bg-center relative" style={{backgroundImage: `url("${selectedFridge.image}")`}}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
                <button onClick={closeDetail} aria-label="Fermer les détails" className="absolute top-4 right-4 size-9 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white active:bg-black/60 transition-colors border border-white/10">
                    <span className="material-symbols-outlined text-xl" aria-hidden="true">close</span>
                </button>
            </div>
            
            <div className="px-6 -mt-12 relative z-10">
                <div className="flex justify-between items-end">
                    <div className="bg-white dark:bg-[#1A1A1A] p-2 rounded-[1.2rem] shadow-xl">
                        <div className={`size-16 rounded-xl flex items-center justify-center ${selectedFridge.type === 'FRIDGE' ? 'bg-primary text-white' : 'bg-warning text-white'}`}>
                            <span className="material-symbols-outlined text-3xl" aria-hidden="true">{selectedFridge.type === 'FRIDGE' ? 'kitchen' : 'storefront'}</span>
                        </div>
                    </div>
                    <div className="mb-2 flex gap-2">
                        <span className="px-3 py-1 bg-green-500/20 text-green-500 backdrop-blur-md text-xs font-bold rounded-full border border-green-500/30">Ouvert</span>
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/30">{selectedFridge.distance}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-1 mt-3">
                   <h2 className="text-2xl font-bold text-text-light dark:text-white">{selectedFridge.name}</h2>
                   <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1 font-medium">
                       <span className="material-symbols-outlined text-lg text-primary" aria-hidden="true">directions_walk</span>
                       {selectedFridge.walkTime} de marche • Ferme à {selectedFridge.closingTime}
                   </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                    <button className="h-14 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2 active:bg-primary/90 transition-colors active:scale-95">
                        <span className="material-symbols-outlined" aria-hidden="true">directions</span>
                        Itinéraire
                    </button>
                    <button 
                      onClick={() => onNavigate && onNavigate(Screen.MENU)}
                      className="h-14 bg-gray-50 dark:bg-white/5 text-text-light dark:text-white font-bold rounded-2xl flex items-center justify-center gap-2 border border-gray-100 dark:border-white/10 active:bg-gray-100 dark:active:bg-white/10 transition-colors active:scale-95"
                    >
                        <span className="material-symbols-outlined" aria-hidden="true">inventory_2</span>
                        Voir le stock
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Bottom List Summary (when no pin selected) */}
      {!selectedFridge && (
        <div className="absolute bottom-0 left-0 right-0 z-20 pb-24">
           <div className="px-4 pb-4 overflow-x-auto no-scrollbar flex gap-4 snap-x snap-mandatory">
             {fridges.map(f => (
                <button 
                    key={f.id} 
                    onClick={() => setSelectedFridge(f)} 
                    aria-label={`Voir les détails de ${f.name}`}
                    className="snap-center min-w-[280px] max-w-[280px] bg-white/80 dark:bg-black/60 backdrop-blur-xl rounded-[2rem] p-3 flex gap-3 cursor-pointer shadow-2xl border border-white/40 dark:border-white/10 transform transition-all active:scale-[0.98] text-left"
                >
                   <div className="size-20 rounded-2xl bg-cover bg-center shrink-0 shadow-inner" style={{backgroundImage: `url("${f.image}")`}}></div>
                   <div className="flex flex-col justify-center min-w-0 py-1">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className={`size-2 rounded-full ${f.status === 'OPEN' ? 'bg-secondary shadow-[0_0_8px_rgba(46,171,75,0.8)]' : 'bg-red-500'}`}></span>
                        <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">Ouvert</span>
                      </div>
                      <h3 className="font-bold text-text-light dark:text-white text-sm leading-tight line-clamp-2 mb-1">{f.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{f.distance} • {f.walkTime}</p>
                   </div>
                </button>
             ))}
           </div>
        </div>
      )}
    </div>
  );
};

const Chip: React.FC<{label: string; icon?: string; active?: boolean}> = ({ label, icon, active }) => (
  <button className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 transition-all shadow-lg active:scale-95 ${active ? 'bg-primary text-white shadow-primary/40' : 'bg-white/70 dark:bg-black/60 backdrop-blur-xl text-text-light dark:text-white border border-white/20'}`}>
    {icon && <span className="material-symbols-outlined text-lg" aria-hidden="true">{icon}</span>}
    <span className="text-sm font-bold">{label}</span>
  </button>
);
