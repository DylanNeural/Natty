import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ArrowRight, 
  Check, 
  Scale, 
  Dumbbell, 
  Zap, 
  Info, 
  Home, 
  Clock, 
  Droplets 
} from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { Goal, UserProfile } from '../../types';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [restrictions, setRestrictions] = useState<string[]>([]);
  const [activity, setActivity] = useState<'debutant' | 'regulier' | 'athlete' | null>(null);
  const [age, setAge] = useState<number>(25);
  const [weight, setWeight] = useState<number>(70);
  const [height, setHeight] = useState<number>(175);
  const [gender, setGender] = useState<'homme' | 'femme' | 'autre' | null>(null);

  const toggleRestriction = (res: string) => {
    setRestrictions(prev => prev.includes(res) ? prev.filter(r => r !== res) : [...prev, res]);
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => Math.max(0, s - 1));

  const renderStep = () => {
    switch(step) {
      case 0:
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col -mx-6 -mt-6">
            <div className="relative flex-1 overflow-hidden rounded-b-[60px] shadow-2xl">
              <img 
                src="https://picsum.photos/seed/natty-hero/1000/1200" 
                alt="Natty Hero" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-natty-teal via-natty-teal/20 to-transparent" />
              <div className="absolute bottom-12 left-8 right-8">
                <div className="w-16 h-16 bg-natty-lime rounded-2xl flex items-center justify-center text-natty-teal font-black text-3xl mb-6 shadow-xl">N</div>
                <h1 className="text-5xl font-black text-white leading-[0.9] tracking-tighter mb-4">NATTY.<br />FUEL YOUR<br />AMBITION.</h1>
                <p className="text-white/60 font-medium text-lg">La nutrition de précision, directement dans ton club de sport.</p>
              </div>
            </div>
            <div className="px-6 py-8 pb-safe">
              <Button onClick={nextStep} variant="lime" className="w-full py-6 text-lg" icon={ArrowRight}>Commencer l'aventure</Button>
              <p className="text-center mt-6 text-sm text-natty-charcoal/60 font-medium">Déjà membre ? <span className="text-natty-teal font-bold">Se connecter</span></p>
            </div>
          </motion.div>
        );
      case 1:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
            <div className="relative h-48 -mx-6 -mt-6 mb-8 overflow-hidden rounded-b-[40px]">
              <img 
                src="https://picsum.photos/seed/fitness/800/600" 
                alt="Fitness" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-natty-beige to-transparent" />
            </div>
            <div className="flex justify-between items-center">
              <button onClick={prevStep} className="p-2 -ml-2"><ChevronLeft /></button>
              <span className="text-sm font-medium text-natty-charcoal/60">1 sur 8</span>
            </div>
            <h1 className="text-4xl font-bold text-natty-teal leading-tight">Quel est<br />ton objectif ?</h1>
            <div className="space-y-4">
              {[
                { id: 'perte-de-poids', label: 'Perte de poids', sub: 'Brûle les graisses, reste énergique', icon: Scale, color: 'bg-natty-lime' },
                { id: 'prise-de-muscle', label: 'Prise de muscle', sub: 'Optimise tes macros et ta récup', icon: Dumbbell, color: 'bg-natty-teal' },
                { id: 'boost-energie', label: "Boost d'énergie", sub: 'Carburant naturel pour performer', icon: Zap, color: 'bg-natty-teal' },
              ].map((item) => (
                <Card 
                  key={item.id} 
                  onClick={() => setGoal(item.id as Goal)}
                  className={`flex items-center gap-4 ${goal === item.id ? 'ring-2 ring-natty-lime bg-natty-lime/5' : ''}`}
                >
                  <div className={`p-3 rounded-2xl ${goal === item.id ? 'bg-natty-lime text-natty-teal' : 'bg-natty-teal text-white'}`}>
                    <item.icon size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{item.label}</h3>
                    <p className="text-sm text-natty-charcoal/60">{item.sub}</p>
                  </div>
                  {goal === item.id && <div className="bg-natty-lime rounded-full p-1"><Check size={16} className="text-natty-teal" /></div>}
                </Card>
              ))}
            </div>
            <Button onClick={nextStep} disabled={!goal} className="w-full" icon={ArrowRight}>Continuer</Button>
          </motion.div>
        );
      case 2:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
            <div className="relative h-48 -mx-6 -mt-6 mb-8 overflow-hidden rounded-b-[40px]">
              <img 
                src="https://picsum.photos/seed/food/800/600" 
                alt="Healthy Food" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-natty-beige to-transparent" />
            </div>
            <div className="flex justify-between items-center">
              <button onClick={prevStep} className="p-2 -ml-2"><ChevronLeft /></button>
              <span className="text-sm font-medium text-natty-charcoal/60">2 sur 8</span>
            </div>
            <h1 className="text-4xl font-bold text-natty-teal leading-tight">Des restrictions<br />alimentaires ?</h1>
            <p className="text-natty-charcoal/60">Sélectionne tout ce qui s'applique à toi.</p>
            <div className="flex flex-wrap gap-3">
              {['Gluten', 'Lactose', 'Noix', 'Végétarien', 'Vegan', 'Halal', 'Sans sucre'].map(res => (
                <button
                  key={res}
                  onClick={() => toggleRestriction(res)}
                  className={`px-6 py-3 rounded-full border-2 transition-all ${restrictions.includes(res) ? 'bg-natty-teal border-natty-teal text-white' : 'border-natty-teal/20 text-natty-teal'}`}
                >
                  {res}
                </button>
              ))}
              <button
                onClick={() => setRestrictions([])}
                className={`px-6 py-3 rounded-full border-2 transition-all flex items-center gap-2 ${restrictions.length === 0 ? 'bg-natty-teal border-natty-teal text-white' : 'border-natty-teal/20 text-natty-teal'}`}
              >
                {restrictions.length === 0 && <Check size={16} />} Aucune restriction
              </button>
            </div>
            <Card className="bg-white/50 border-none flex gap-3 items-start">
               <Info size={20} className="text-natty-charcoal/40 mt-1" />
               <p className="text-sm text-natty-charcoal/60">Tu pourras modifier tes restrictions à tout moment dans ton profil.</p>
            </Card>
            <Button onClick={nextStep} className="w-full" icon={ArrowRight}>Continuer</Button>
          </motion.div>
        );
      case 3:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
            <div className="flex justify-between items-center">
              <button onClick={prevStep} className="p-2 -ml-2"><ChevronLeft /></button>
              <span className="text-sm font-medium text-natty-charcoal/60">3 sur 8</span>
            </div>
            <h1 className="text-4xl font-bold text-natty-teal leading-tight">Ton niveau<br />d'activité ?</h1>
            <div className="space-y-4">
              {[
                { id: 'debutant', label: 'Débutant', sub: 'Moins de 2 séances / semaine', icon: Scale },
                { id: 'regulier', label: 'Régulier', sub: '2 à 4 séances / semaine', icon: Zap },
                { id: 'athlete', label: 'Athlète', sub: '5 séances et + / semaine', icon: Dumbbell },
              ].map((item) => (
                <Card 
                  key={item.id} 
                  onClick={() => setActivity(item.id as any)}
                  className={`flex items-center gap-4 ${activity === item.id ? 'bg-natty-teal text-white' : ''}`}
                >
                  <div className={`p-3 rounded-2xl ${activity === item.id ? 'bg-natty-lime text-natty-teal' : 'bg-natty-charcoal/5 text-natty-teal'}`}>
                    <item.icon size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{item.label}</h3>
                    <p className={`text-sm ${activity === item.id ? 'text-white/70' : 'text-natty-charcoal/60'}`}>{item.sub}</p>
                  </div>
                </Card>
              ))}
            </div>
            <Button onClick={nextStep} disabled={!activity} className="w-full" icon={ArrowRight}>Continuer</Button>
          </motion.div>
        );
      case 4:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
            <div className="flex justify-between items-center">
              <button onClick={prevStep} className="p-2 -ml-2"><ChevronLeft /></button>
              <span className="text-sm font-medium text-natty-charcoal/60">4 sur 8</span>
            </div>
            <h1 className="text-4xl font-bold text-natty-teal leading-tight">Quel est<br />ton âge ?</h1>
            <div className="flex flex-col items-center justify-center py-12">
              <span className="text-8xl font-black text-natty-teal mb-4">{age}</span>
              <input 
                type="range" 
                min="15" 
                max="80" 
                value={age} 
                onChange={(e) => setAge(parseInt(e.target.value))}
                className="w-full accent-natty-teal"
              />
            </div>
            <Button onClick={nextStep} className="w-full" icon={ArrowRight}>Continuer</Button>
          </motion.div>
        );
      case 5:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
            <div className="flex justify-between items-center">
              <button onClick={prevStep} className="p-2 -ml-2"><ChevronLeft /></button>
              <span className="text-sm font-medium text-natty-charcoal/60">5 sur 8</span>
            </div>
            <h1 className="text-4xl font-bold text-natty-teal leading-tight">Ton poids et<br />ta taille ?</h1>
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-xs font-black uppercase tracking-widest text-natty-charcoal/40">Poids (kg)</label>
                  <span className="text-3xl font-black text-natty-teal">{weight}</span>
                </div>
                <input type="range" min="40" max="150" value={weight} onChange={(e) => setWeight(parseInt(e.target.value))} className="w-full accent-natty-teal" />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-xs font-black uppercase tracking-widest text-natty-charcoal/40">Taille (cm)</label>
                  <span className="text-3xl font-black text-natty-teal">{height}</span>
                </div>
                <input type="range" min="140" max="220" value={height} onChange={(e) => setHeight(parseInt(e.target.value))} className="w-full accent-natty-teal" />
              </div>
            </div>
            <Button onClick={nextStep} className="w-full" icon={ArrowRight}>Continuer</Button>
          </motion.div>
        );
      case 6:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
            <div className="flex justify-between items-center">
              <button onClick={prevStep} className="p-2 -ml-2"><ChevronLeft /></button>
              <span className="text-sm font-medium text-natty-charcoal/60">6 sur 8</span>
            </div>
            <h1 className="text-4xl font-bold text-natty-teal leading-tight">Ton genre ?</h1>
            <div className="grid grid-cols-1 gap-4">
              {['homme', 'femme', 'autre'].map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g as any)}
                  className={`w-full py-6 rounded-[32px] font-black uppercase tracking-widest text-sm border-2 transition-all ${gender === g ? 'bg-natty-teal border-natty-teal text-white' : 'border-natty-teal/10 text-natty-teal'}`}
                >
                  {g}
                </button>
              ))}
            </div>
            <Button onClick={nextStep} disabled={!gender} className="w-full" icon={ArrowRight}>Continuer</Button>
          </motion.div>
        );
      case 7:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
            <div className="flex justify-between items-center">
              <button onClick={prevStep} className="p-2 -ml-2"><ChevronLeft /></button>
              <span className="text-sm font-medium text-natty-charcoal/60">7 sur 8</span>
            </div>
            <h1 className="text-4xl font-bold text-natty-teal leading-tight">Connecte<br />tes appareils.</h1>
            <p className="text-natty-charcoal/60">Pour des recommandations encore plus précises. Tu pourras le faire plus tard.</p>
            <div className="space-y-4">
              <Card className="flex items-center gap-4">
                <div className="bg-black text-white p-3 rounded-xl"><Home size={24} /></div>
                <div className="flex-1">
                  <h3 className="font-bold">Apple Health</h3>
                  <p className="text-sm text-natty-charcoal/60">iPhone & Apple Watch</p>
                </div>
                <div className="px-3 py-1 bg-natty-charcoal/5 rounded-full text-[10px] font-bold uppercase tracking-wider opacity-50">Optionnel</div>
              </Card>
              <Card className="flex items-center gap-4">
                <div className="bg-[#00A9E0] text-white p-3 rounded-xl"><Zap size={24} /></div>
                <div className="flex-1">
                  <h3 className="font-bold">Garmin Connect</h3>
                  <p className="text-sm text-natty-charcoal/60">Montres & GPS Garmin</p>
                </div>
                <div className="px-3 py-1 bg-natty-charcoal/5 rounded-full text-[10px] font-bold uppercase tracking-wider opacity-50">Optionnel</div>
              </Card>
            </div>
            <Button onClick={nextStep} className="w-full" icon={ArrowRight}>Continuer</Button>
          </motion.div>
        );
      case 8:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
            <div className="flex justify-between items-center">
              <button onClick={prevStep} className="p-2 -ml-2"><ChevronLeft /></button>
              <span className="text-sm font-medium text-natty-charcoal/60">8 sur 8</span>
            </div>
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-natty-lime rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                <Check size={48} className="text-natty-teal" />
              </div>
              <h1 className="text-4xl font-black text-natty-teal mb-4">C'est prêt !</h1>
              <p className="text-natty-charcoal/60 font-medium">Ton profil est configuré. On a hâte de t'aider à atteindre tes objectifs.</p>
            </div>
            <Button 
              onClick={() => onComplete({
                name: 'Léa',
                email: 'lea@natty.com',
                goal: goal!,
                restrictions,
                activityLevel: activity!,
                isPremium: false,
                age,
                weight,
                height,
                gender: gender!,
                waterIntake: { current: 0, goal: 2.5, history: [] },
                fasting: { protocol: '16:8', isActive: false },
                stats: {
                  daysActive: 1,
                  mealsLogged: 0,
                  challengesCompleted: 0,
                  calories: 0,
                  protein: 0,
                  carbs: 0,
                  fat: 0,
                  steps: 0,
                  sleep: 0
                }
              })} 
              variant="primary" 
              className="w-full h-16 text-lg"
            >
              C'est parti !
            </Button>
          </motion.div>
        );
      default: return null;
    }
  };

  return (
    <div className={`min-h-[100svh] ${step === 0 ? '' : 'p-6 pb-12 pt-safe'}`}>
      {step > 0 && (
        <div className="h-1 w-full bg-natty-charcoal/5 rounded-full overflow-hidden mb-8">
          <motion.div 
            className="h-full bg-natty-lime" 
            initial={{ width: '0%' }}
            animate={{ width: `${(step / 8) * 100}%` }}
          />
        </div>
      )}
      <AnimatePresence mode="wait">
        {renderStep()}
      </AnimatePresence>
    </div>
  );
};

export default Onboarding;
