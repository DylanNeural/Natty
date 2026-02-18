
import React, { useState } from 'react';
import { Screen } from '../App';
import { scanBarcode } from '../services/api';

interface Props {
  onNavigate: (screen: Screen) => void;
  onAskCoach?: (productContext?: unknown) => void;
}

export const Dashboard: React.FC<Props> = ({ onNavigate, onAskCoach }) => {
  const [barcode, setBarcode] = useState('');
  const [scanResult, setScanResult] = useState<any>(null);
  const [scanLoading, setScanLoading] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);

  const handleScan = async () => {
    if (!barcode.trim()) {
      setScanError('Saisis un code-barres');
      return;
    }
    try {
      setScanLoading(true);
      setScanError(null);
      const resp = await scanBarcode(barcode.trim());
      setScanResult(resp.data);
    } catch (err: any) {
      setScanResult(null);
      setScanError(err?.message || 'Impossible de scanner pour le moment');
    } finally {
      setScanLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 px-4 pt-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-center bg-no-repeat bg-cover rounded-full size-12 border-2 border-primary shadow-md ring-2 ring-primary/20" 
               role="img"
               aria-label="Photo de profil de Alex Johnson"
               style={{backgroundImage: 'url("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2787&auto=format&fit=crop")'}}></div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Bonjour,</p>
            <h2 className="text-text-light dark:text-text-dark text-lg font-bold leading-tight -mt-0.5">Alex Johnson</h2>
          </div>
        </div>
        <button 
          onClick={() => onNavigate(Screen.PROFILE)} 
          aria-label="Notifications"
          className="p-2.5 rounded-full bg-white dark:bg-card-dark text-text-light dark:text-text-dark shadow-sm border border-gray-100 dark:border-gray-800 active:bg-gray-50 transition-colors"
        >
          <span className="material-symbols-outlined" aria-hidden="true">notifications</span>
        </button>
      </div>

      {/* Calories Card - Sexy Design & Animation */}
      <div 
        className="relative flex flex-col items-center justify-center rounded-[2rem] bg-black p-6 text-center text-white shadow-2xl shadow-primary/20 overflow-hidden"
        role="region"
        aria-label="Résumé des calories"
      >
        {/* Background Image for Card with Continuous Animation */}
        <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay animate-slow-pan" 
             style={{backgroundImage: 'url("https://images.unsplash.com/photo-1517963879466-e025cedc96de?q=80&w=2835&auto=format&fit=crop")'}}></div>
        
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-black/60"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 blur-3xl rounded-full"></div>

        <div className="relative z-10 w-full">
            <div className="flex justify-between items-start mb-2">
                <div className="flex flex-col items-start">
                    <p className="text-sm text-white/90 font-medium tracking-wide uppercase opacity-80">Calories restantes</p>
                    <p className="text-xs text-white/60">Objectif: 2200 kcal</p>
                </div>
                <div className="p-2 bg-white/10 backdrop-blur-md rounded-full">
                    <span className="material-symbols-outlined text-accent text-xl" aria-hidden="true">local_fire_department</span>
                </div>
            </div>
            
            <div className="flex items-center justify-center py-6">
                <div className="relative">
                     <p className="text-7xl font-bold tracking-tight drop-shadow-lg bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">950</p>
                     <p className="text-sm text-center text-accent font-bold uppercase tracking-widest mt-1">Kcal</p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 w-full bg-black/20 backdrop-blur-sm p-4 rounded-2xl border border-white/5">
            <MacroBar label="Protéines" current={80} total={150} color="bg-warning" />
            <MacroBar label="Glucides" current={150} total={250} color="bg-accent" />
            <MacroBar label="Lipides" current={40} total={70} color="bg-secondary" />
            </div>
        </div>
      </div>

      {/* Quick Actions Row */}
      <div className="grid grid-cols-2 gap-4">
        {/* AI Suggestion / Meal Scanner Entry */}
        <button 
            onClick={() => onNavigate(Screen.IMAGE_EDITOR)}
            className="group relative flex flex-col items-start gap-3 rounded-[2rem] bg-white dark:bg-card-dark border border-gray-100 dark:border-gray-800 p-4 shadow-lg shadow-gray-200/50 dark:shadow-none transition-all active:scale-[0.98] overflow-hidden"
        >
            <div className="flex size-12 items-center justify-center rounded-2xl bg-gray-900 text-white shadow-lg">
                <span className="material-symbols-outlined text-2xl text-secondary" aria-hidden="true">center_focus_strong</span>
            </div>
            <div className="text-left">
                <p className="text-base font-bold text-text-light dark:text-text-dark leading-tight">Scanner <br/>une assiette</p>
                <p className="text-xs text-gray-400 mt-1">Analyser le repas</p>
            </div>
        </button>

        {/* Order Menu Entry */}
        <button 
            onClick={() => onNavigate(Screen.MENU)}
            className="group relative flex flex-col items-start gap-3 rounded-[2rem] bg-primary text-white border border-primary p-4 shadow-lg shadow-primary/30 transition-all active:scale-[0.98] overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="flex size-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md text-white shadow-lg relative z-10">
                <span className="material-symbols-outlined text-2xl" aria-hidden="true">shopping_bag</span>
            </div>
            <div className="text-left relative z-10">
                <p className="text-base font-bold leading-tight">Commander <br/>un repas</p>
                <p className="text-xs text-white/70 mt-1">Click & Collect</p>
            </div>
        </button>
      </div>

      {/* Barcode scanner (backend OpenFoodFacts) */}
      <div className="rounded-3xl bg-white dark:bg-card-dark border border-gray-100 dark:border-gray-800 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Scan code-barres</p>
            <p className="text-lg font-bold text-text-light dark:text-text-dark">OpenFoodFacts</p>
          </div>
          <span className="material-symbols-outlined text-primary">barcode_scanner</span>
        </div>
        <div className="flex gap-2">
          <input
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            className="flex-1 h-12 px-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-text-light dark:text-text-dark placeholder-gray-400 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
            placeholder="Ex: 3274080005003"
            aria-label="Code-barres"
          />
          <button
            onClick={handleScan}
            disabled={scanLoading}
            className="h-12 px-4 rounded-2xl bg-primary text-white font-bold shadow-md shadow-primary/20 active:scale-95 disabled:opacity-60"
          >
            {scanLoading ? 'Scan...' : 'Scanner'}
          </button>
        </div>
        {scanError && <p className="text-sm text-red-500 font-semibold mt-2">{scanError}</p>}
        {scanResult && (
          <div className="mt-4 space-y-2 text-sm text-text-light dark:text-text-dark">
            <p className="font-bold text-base">{scanResult.nom || 'Produit'}</p>
            <p className="text-gray-500 dark:text-gray-400">{scanResult.marque}</p>
            {scanResult.description && <p className="text-gray-500 dark:text-gray-400">{scanResult.description}</p>}
            {Array.isArray(scanResult.ingredients) && scanResult.ingredients.length > 0 && (
              <p className="text-gray-500 dark:text-gray-400">
                Ingrédients: <span className="font-semibold">{scanResult.ingredients.slice(0, 6).join(', ')}</span>
              </p>
            )}
            {scanResult.valeurs_nutritionnelles && (
              <div className="grid grid-cols-2 gap-2 text-gray-700 dark:text-gray-200">
                <NutItem label="Énergie" value={scanResult.valeurs_nutritionnelles.energie_kcal} suffix="kcal" />
                <NutItem label="Protéines" value={scanResult.valeurs_nutritionnelles.proteines_g} suffix="g" />
                <NutItem label="Glucides" value={scanResult.valeurs_nutritionnelles.glucides_g} suffix="g" />
                <NutItem label="Sucres" value={scanResult.valeurs_nutritionnelles.dont_sucres_g} suffix="g" />
                <NutItem label="Lipides" value={scanResult.valeurs_nutritionnelles.lipides_g} suffix="g" />
                <NutItem label="Saturés" value={scanResult.valeurs_nutritionnelles.dont_satures_g} suffix="g" />
                <NutItem label="Fibres" value={scanResult.valeurs_nutritionnelles.fibres_g} suffix="g" />
                <NutItem label="Sel" value={scanResult.valeurs_nutritionnelles.sel_g} suffix="g" />
              </div>
            )}
            <button
              onClick={() => onAskCoach?.(scanResult)}
              className="mt-2 h-10 px-4 rounded-xl bg-primary text-white font-bold shadow-sm"
            >
              Demander au coach
            </button>
          </div>
        )}
      </div>

      {/* Schedule */}
      <div>
        <h3 className="text-text-light dark:text-text-dark text-xl font-bold mb-4 px-1">Programme du jour</h3>
        <div className="flex flex-col gap-4">
          <ScheduleItem 
            icon="check_circle" 
            iconColor="text-secondary" 
            bgColor="bg-green-100 dark:bg-green-900/20"
            title="Petit-déjeuner"
            time="08:00"
            desc="Avoine avec baies - 350 kcal"
            completed
          />
          <ScheduleItem 
            icon="fitness_center" 
            iconColor="text-warning" 
            bgColor="bg-orange-100 dark:bg-orange-900/20"
            title="Entraînement"
            time="18:00"
            desc="Leg Day"
            highlight
          />
          <ScheduleItem 
            icon="restaurant" 
            iconColor="text-gray-400" 
            bgColor="bg-gray-100 dark:bg-gray-800"
            title="Dîner"
            time="20:00"
            desc="En attente de sélection"
          />
        </div>
      </div>
    </div>
  );
};

const MacroBar: React.FC<{label: string; current: number; total: number; color: string}> = ({ label, current, total, color }) => (
  <div className="flex flex-col gap-1.5 items-center" role="progressbar" aria-valuenow={current} aria-valuemax={total} aria-label={label}>
    <div className="flex justify-between w-full text-xs font-medium px-1">
        <span className="text-white/70">{label}</span>
    </div>
    <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden backdrop-blur-sm">
      <div className={`h-full rounded-full ${color} shadow-[0_0_10px_rgba(255,255,255,0.3)]`} style={{ width: `${(current/total)*100}%` }}></div>
    </div>
    <p className="text-xs text-white font-bold">{current}g</p>
  </div>
);

const ScheduleItem: React.FC<{icon: string; iconColor: string; bgColor: string; title: string; time: string; desc: string; completed?: boolean; highlight?: boolean}> = ({ icon, iconColor, bgColor, title, time, desc, completed, highlight }) => (
  <div className={`flex items-center gap-4 group cursor-pointer active:scale-[0.98] transition-transform ${completed ? 'opacity-60 grayscale-[0.5]' : ''}`}>
    <div className={`flex items-center justify-center size-14 rounded-2xl ${bgColor} ${iconColor} shadow-sm`}>
      <span className={`material-symbols-outlined text-2xl ${completed ? 'filled' : ''}`} aria-hidden="true">{icon}</span>
    </div>
    <div className={`flex-1 rounded-2xl p-4 ${highlight ? 'bg-white dark:bg-card-dark border-l-4 border-warning shadow-lg shadow-warning/5' : 'bg-white dark:bg-card-dark shadow-sm border border-gray-100 dark:border-gray-800'}`}>
      <div className="flex justify-between items-center mb-1">
        <p className={`text-base font-bold text-text-light dark:text-text-dark`}>{title}</p>
        <p className={`${highlight ? 'text-warning font-bold' : 'text-gray-400 font-medium'} text-sm`}>{time}</p>
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm">{desc}</p>
    </div>
  </div>
);

const NutItem: React.FC<{label: string; value?: number | string; suffix?: string}> = ({ label, value, suffix = '' }) => (
  <div className="flex items-center justify-between rounded-xl bg-gray-50 dark:bg-gray-800 px-3 py-2">
    <span className="text-xs text-gray-500">{label}</span>
    <span className="text-sm font-semibold">{value ?? '-' }{value ? ` ${suffix}` : ''}</span>
  </div>
);
