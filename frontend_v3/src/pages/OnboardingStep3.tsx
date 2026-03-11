import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, HelpCircle, Circle, CheckCircle2, Shield, Dumbbell, Flame, Activity, Rocket, Zap } from 'lucide-react';
import { Page } from '../types';

interface OnboardingStep3Props {
  onNavigate: (page: Page) => void;
}

export const OnboardingStep3 = ({ onNavigate }: OnboardingStep3Props) => {
  const [selected, setSelected] = useState<string | null>(null);

  const activities = [
    { id: 'sedentaire', label: 'Sédentaire 🛋️', description: 'Bureau, canapé, zen mode', icon: 'couch', tags: ['0–2 séances', 'énergie calme'] },
    { id: 'sportif', label: 'Sportif 🏃', description: '3–4 séances par semaine', icon: 'run', tags: ['régulier', 'bon rythme'] },
    { id: 'tres-actif', label: 'Très Actif 💥', description: 'Sport presque tous les jours !', icon: 'bolt', tags: ['5+ séances', 'haut niveau'] },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full h-screen flex flex-col bg-[#FAEBDD] text-[#201D16] relative overflow-hidden grain"
    >
      <header className="shrink-0 pt-14 px-5 relative">
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('onboarding-step2')}
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#FFF7EE] ring-1 ring-black/10 shadow-sm active:scale-[0.98] transition duration-300"
          >
            <ChevronLeft className="w-6 h-6 text-[#134030]" />
          </button>

          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate('onboarding-step4')} className="text-[14px] font-sans font-medium text-[#134030]/80 hover:text-[#134030] transition">Passer</button>
            <button className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#FFF7EE] ring-1 ring-black/10 shadow-sm active:scale-[0.98] transition duration-300" aria-label="Aide">
              <HelpCircle className="w-5 h-5 text-[#134030]" />
            </button>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between">
            <p className="font-sans text-[13px] font-medium text-[#134030]/80">Étape <span className="text-[#134030]">3</span> / 5</p>
            <p className="font-sans text-[12px] font-medium text-[#134030]/70">~15 sec</p>
          </div>

          <div className="mt-3 h-3 rounded-full bg-[#134030]/10 ring-1 ring-black/5 overflow-hidden">
            <div className="h-full w-3/5 rounded-full bg-[#134030]" aria-label="Progression 3 sur 5"></div>
          </div>

          <div className="mt-5">
            <h1 className="font-brand text-[32px] leading-[1.05] tracking-tight text-[#134030]">Quel est ton niveau d’activité ?</h1>
            <p className="mt-3 font-sans text-[14px] leading-6 text-[#201D16]/75">Choisis ce qui ressemble le plus à ta semaine (on ajuste après si besoin). 🏃</p>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-5 pt-6 pb-[calc(34px+124px)] relative">
        <div className="space-y-5">
          {activities.map((activity) => (
            <label key={activity.id} className="block">
              <input 
                className="sr-only peer" 
                type="radio" 
                name="activity" 
                value={activity.id} 
                checked={selected === activity.id}
                onChange={() => setSelected(activity.id)}
              />
              <div className="w-full rounded-[28px] bg-[#FFF7EE] ring-1 ring-black/10 shadow-lg p-5 transition duration-300 ease-out active:scale-[0.99] peer-checked:scale-[1.05] peer-checked:ring-2 peer-checked:ring-[#134030] peer-checked:shadow-[0_18px_50px_rgba(195,211,109,0.45)]">
                <div className="flex items-start gap-5">
                  <div className={`shrink-0 w-[82px] h-[82px] rounded-3xl ring-1 ring-black/5 flex items-center justify-center transition duration-300 ease-out peer-checked:scale-[1.03] ${activity.id === 'sedentaire' ? 'bg-[#FAEBDD]' : activity.id === 'sportif' ? 'bg-[#C3D36D]/35' : 'bg-[#DF842C]/20'}`}>
                    {activity.id === 'sedentaire' && (
                      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 26.5c1.8-3.9 6.5-6 12-6 5.5 0 10.2 2.1 12 6" stroke="#134030" strokeWidth="2.6" strokeLinecap="round"/>
                        <path d="M16 33.5c2.2-1.9 5-3 8-3s5.8 1.1 8 3" stroke="#134030" strokeWidth="2.6" strokeLinecap="round" opacity="0.9"/>
                        <path d="M18 16.5c0-1.8 1.5-3.3 3.3-3.3h5.4c1.8 0 3.3 1.5 3.3 3.3v1.4c0 1.8-1.5 3.3-3.3 3.3h-5.4c-1.8 0-3.3-1.5-3.3-3.3v-1.4Z" fill="#C3D36D" stroke="#134030" strokeWidth="2"/>
                        <path d="M14.2 24.3c1.4-2.8 5.2-5.2 9.8-5.2 4.6 0 8.4 2.4 9.8 5.2" stroke="#DF842C" strokeWidth="2.4" strokeLinecap="round"/>
                      </svg>
                    )}
                    {activity.id === 'sportif' && (
                      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.5 32.5c2.1-4.7 6-7.2 8.5-7.2s6.4 2.5 8.5 7.2" stroke="#134030" strokeWidth="2.6" strokeLinecap="round"/>
                        <path d="M20 18.5c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4Z" fill="#C3D36D" stroke="#134030" strokeWidth="2"/>
                        <path d="M10.8 28.2l6.2-3.2" stroke="#DF842C" strokeWidth="2.6" strokeLinecap="round"/>
                        <path d="M37.2 28.2l-6.2-3.2" stroke="#DF842C" strokeWidth="2.6" strokeLinecap="round"/>
                        <path d="M19 26.5l-4.8 9" stroke="#134030" strokeWidth="2.6" strokeLinecap="round"/>
                        <path d="M29 26.5l4.8 9" stroke="#134030" strokeWidth="2.6" strokeLinecap="round"/>
                      </svg>
                    )}
                    {activity.id === 'tres-actif' && (
                      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M24 10l2.6 7.2 7.4-.1-6 4.4 2.3 7.3-6.3-4.1-6.3 4.1 2.3-7.3-6-4.4 7.4.1L24 10Z" fill="#DF842C" stroke="#134030" strokeWidth="2" strokeLinejoin="round"/>
                        <path d="M14.5 35c2.2-5.2 6.3-8 9.5-8s7.3 2.8 9.5 8" stroke="#134030" strokeWidth="2.6" strokeLinecap="round"/>
                        <path d="M18 27.2l-5.3 6.3" stroke="#DF842C" strokeWidth="2.6" strokeLinecap="round"/>
                        <path d="M30 27.2l5.3 6.3" stroke="#DF842C" strokeWidth="2.6" strokeLinecap="round"/>
                      </svg>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="font-sans text-[16px] font-semibold tracking-tight text-[#201D16]">{activity.label}</h2>
                      <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#FAEBDD] ring-1 ring-black/5 transition duration-300 ease-out">
                        {selected === activity.id ? (
                          <CheckCircle2 className="w-6 h-6 text-[#134030]" />
                        ) : (
                          <Circle className="w-6 h-6 text-[#134030]/35" />
                        )}
                      </span>
                    </div>
                    <p className="mt-2 font-sans text-[14px] leading-6 text-[#201D16]/70">{activity.description}</p>

                    <div className="mt-4 flex items-center gap-3">
                      {activity.tags.map((tag, i) => (
                        <span key={i} className="inline-flex items-center gap-1 rounded-full bg-[#FAEBDD] px-2.5 py-1 text-[12px] font-sans font-medium text-[#134030] ring-1 ring-black/5">
                          {i === 0 ? (
                            activity.id === 'sedentaire' ? <ChevronLeft className="w-3 h-3" /> : activity.id === 'sportif' ? <Dumbbell className="w-3 h-3" /> : <Activity className="w-3 h-3" />
                          ) : (
                            activity.id === 'sedentaire' ? <Zap className="w-3 h-3" /> : activity.id === 'sportif' ? <Flame className="w-3 h-3" /> : <Rocket className="w-3 h-3" />
                          )}
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {selected === activity.id && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-3">
                  <div className="rounded-2xl bg-[#134030] px-5 py-4 text-[#FFF7EE] ring-1 ring-black/10 transition duration-300 ease-out">
                    <p className="font-sans text-[13px] leading-5">
                      {activity.id === 'sedentaire' && <><span className="font-semibold">On adapte</span> tes calories pour progresser sans te prendre la tête.</>}
                      {activity.id === 'sportif' && <>On met un peu plus de <span className="font-semibold">carburant</span> les jours d’entraînement. 🔥</>}
                      {activity.id === 'tres-actif' && <>On optimise tes macros pour <span className="font-semibold">performer</span> + récupérer vite. ⚡</>}
                    </p>
                  </div>
                </motion.div>
              )}
            </label>
          ))}

          <div className="pt-2">
            <p className="font-sans text-[12px] leading-5 text-[#201D16]/60">Astuce : si tes semaines varient, choisis ton <span className="font-medium">rythme le plus fréquent</span>.</p>
          </div>
        </div>
      </main>

      <footer className="shrink-0 pb-[34px] px-5 relative">
        <div className="rounded-[28px] bg-[#FFF7EE] ring-1 ring-black/10 shadow-lg p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => selected && onNavigate('onboarding-step4')}
              disabled={!selected}
              className={`flex-1 h-14 rounded-2xl bg-[#134030] text-[#FFF7EE] font-sans text-[15px] font-semibold tracking-tight shadow-sm active:scale-[0.99] transition duration-300 inline-flex items-center justify-center ${!selected ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              Continuer
            </button>
            <button className="shrink-0 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#FAEBDD] ring-1 ring-black/5 active:scale-[0.98] transition duration-300" aria-label="Confidentialité">
              <Shield className="w-5 h-5 text-[#134030]" />
            </button>
          </div>
          <p className="mt-3 px-1 font-sans text-[12px] text-[#201D16]/55">Tes réponses servent uniquement à personnaliser tes objectifs.</p>
        </div>
      </footer>
    </motion.div>
  );
};
