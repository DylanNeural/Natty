import React, { useState } from 'react';
import { login, register, User } from '../services/api';

interface Props {
  onAuthSuccess: (user: User, token: string, origin: 'login' | 'register') => void;
  restoringSession?: boolean;
}

export const LoginScreen: React.FC<Props> = ({ onAuthSuccess, restoringSession = false }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (mode === 'register' && !name.trim()) {
        setError('Le nom est requis pour créer un compte');
        return;
      }

      const response =
        mode === 'login'
          ? await login(email, password)
          : await register(name.trim(), email, password);

      onAuthSuccess(response.user, response.token, mode);
    } catch (err: any) {
      setError(err?.message || 'Impossible de se connecter pour le moment');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'register' : 'login'));
    setError(null);
  };

  return (
    <div className="relative flex h-full w-full flex-col items-center p-4 bg-background-light dark:bg-background-dark overflow-y-auto">
      <div className="z-10 flex w-full flex-1 flex-col items-center justify-center pt-8 max-w-md my-auto">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative p-4 mb-4">
             <div className="absolute inset-0 bg-primary/20 rounded-2xl rotate-6"></div>
             <div className="absolute inset-0 bg-primary/20 rounded-2xl -rotate-6"></div>
             <div className="relative p-4 bg-primary rounded-2xl shadow-xl shadow-primary/30">
                <span className="material-symbols-outlined !text-3xl text-accent" aria-hidden="true">lock</span>
             </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-text-light dark:text-text-dark">
            {mode === 'login' ? 'Connexion' : 'Créer un compte'}
          </h1>
          <p className="text-text-light/60 dark:text-text-dark/60 mt-2">
            {mode === 'login'
              ? 'Connectez-vous pour accéder à votre espace.'
              : 'Inscrivez-vous pour démarrer votre parcours.'}
          </p>
        </div>

        <div className="w-full flex flex-col gap-4">
          {mode === 'register' && (
            <div className="group relative transition-all duration-300">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 size-6 flex items-center justify-center text-gray-400 transition-colors group-focus-within:text-primary">
                  <span className="material-symbols-outlined text-[22px]" aria-hidden="true">badge</span>
              </div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-14 pl-12 pr-4 rounded-2xl border-2 border-transparent bg-white dark:bg-card-dark text-text-light dark:text-text-dark placeholder-gray-400 font-medium shadow-sm ring-1 ring-gray-200 dark:ring-gray-800 focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 outline-none text-base"
                placeholder="Votre nom complet"
                type="text"
                aria-label="Nom complet"
                disabled={isLoading || restoringSession}
              />
            </div>
          )}
          
          {/* Email Input */}
          <div className="group relative transition-all duration-300">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 size-6 flex items-center justify-center text-gray-400 transition-colors group-focus-within:text-primary">
                <span className="material-symbols-outlined text-[22px]" aria-hidden="true">mail</span>
            </div>
            <input 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-14 pl-12 pr-4 rounded-2xl border-2 border-transparent bg-white dark:bg-card-dark text-text-light dark:text-text-dark placeholder-gray-400 font-medium shadow-sm ring-1 ring-gray-200 dark:ring-gray-800 focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 outline-none text-base" 
              placeholder="votre.email@example.com" 
              type="email"
              aria-label="Adresse e-mail"
              disabled={isLoading || restoringSession}
            />
          </div>

          {/* Password Input */}
           <div className="group relative transition-all duration-300">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 size-6 flex items-center justify-center text-gray-400 transition-colors group-focus-within:text-primary">
                <span className="material-symbols-outlined text-[22px]" aria-hidden="true">key</span>
            </div>
            <input 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-14 pl-12 pr-12 rounded-2xl border-2 border-transparent bg-white dark:bg-card-dark text-text-light dark:text-text-dark placeholder-gray-400 font-medium shadow-sm ring-1 ring-gray-200 dark:ring-gray-800 focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 outline-none text-base" 
              placeholder="Mot de passe" 
              type="password"
              aria-label="Mot de passe"
              disabled={isLoading || restoringSession}
            />
             <button aria-label="Afficher le mot de passe" className="absolute right-0 top-0 bottom-0 px-4 flex items-center justify-center text-gray-400 active:text-text-light dark:active:text-text-dark transition-colors" tabIndex={-1}>
                <span className="material-symbols-outlined text-[20px]" aria-hidden="true">visibility_off</span>
             </button>
          </div>

          {error && (
            <div className="text-sm text-red-500 font-semibold bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-3">
              {error}
            </div>
          )}

          <div className="flex justify-end">
            <button className="text-sm font-semibold text-primary active:text-primary/70 transition-colors py-2" disabled>
              Mot de passe oublié ?
            </button>
          </div>

          <button 
            onClick={handleSubmit}
            disabled={isLoading || restoringSession}
            className="flex w-full cursor-pointer items-center justify-center rounded-2xl h-14 bg-gradient-to-r from-primary to-primary/90 text-white text-base font-bold shadow-lg shadow-primary/30 active:scale-95 transition-all duration-200 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Patientez...' : mode === 'login' ? 'Se connecter' : 'Créer un compte'}
          </button>

          <div className="flex items-center my-4">
            <hr className="flex-grow border-t border-gray-200 dark:border-gray-800"/>
            <span className="mx-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Ou continuer avec</span>
            <hr className="flex-grow border-t border-gray-200 dark:border-gray-800"/>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button disabled className="flex items-center justify-center rounded-2xl h-14 bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-800 text-text-light dark:text-text-dark font-bold active:bg-gray-50 dark:active:bg-gray-800 transition-all shadow-sm active:scale-95 disabled:opacity-60">
                <img alt="Google" className="w-5 h-5 mr-2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWOkm2-0K7umW9VDMVNy9FkcmUV2JsNTthSA0Ny2w9MFDCjLg3OUDBf5cLT1ZQUyj2R64YBAGj39IEgL0604cARYYtWU8wnBlIw1gamZmkhIT8oF5gGlCXwP2kfIi-fU01Hkk3615D6pmpXyGFMjiehzM83xgFLRyOWJimAuIRv51dt1VTQt4ncj7XCEoR2fy8seevkuU3KRF40RnEMO6vF65BvrnuA1vL9PRliAszbO7LlgomCXdkespTP74-eo5ys_P8nytJ5kNV" />
                Google
            </button>
            <button disabled className="flex items-center justify-center rounded-2xl h-14 bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-800 text-text-light dark:text-text-dark font-bold active:bg-gray-50 dark:active:bg-gray-800 transition-all shadow-sm active:scale-95 disabled:opacity-60">
                <img alt="Apple" className="w-5 h-5 mr-2 dark:invert" src="https://lh3.googleusercontent.com/aida-public/AB6AXuByxxa40NpOkI1_NKB8k1SEiywjDMwhhx5zl6uXisUAEsF0DwIVdNcOAHgQgI0g46zNS_ZI9qzIgVssgxbY-k4nEt-26nUDFOR1kGUhEsu5qfOjqUntASb3Qj5xKABHABwcvG73Y5esONliyOY3uM6XDBAUDZMWYY-s4ZQmHFRUAr-279rQ_Zm8wEn-GI0kgtZQDCns1LLuK8ptD3V07CiRwBpxxeHpV0-rv-Av6H8NR8LPpJejfG6BW2uuYbZg7vakI02P5xm1shsr" />
                Apple
            </button>
          </div>
        </div>
      </div>
      <p className="text-xs text-center text-gray-400 mt-auto mb-4">
        {mode === 'login' ? "Pas encore de compte ?" : "Déjà un compte ?"}{' '}
        <button onClick={toggleMode} className="font-bold text-primary active:opacity-70">
          {mode === 'login' ? "S'inscrire" : "Se connecter"}
        </button>
      </p>
    </div>
  );
};
