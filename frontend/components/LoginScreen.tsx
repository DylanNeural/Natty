import React, { useState } from 'react';
import { login, register, User } from '../services/api';
import ReCAPTCHA from "react-google-recaptcha";

interface Props {
  onAuthSuccess: (user: User, token: string, origin: 'login' | 'register') => void;
  restoringSession?: boolean;
}

export const LoginScreen: React.FC<Props> = ({ onAuthSuccess, restoringSession = false }) => {
  const recaptchaEnabled = (import.meta.env.VITE_RECAPTCHA_ENABLED as string | undefined) === 'true';
  const recaptchaSiteKey = (import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined) || '';

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔐 CAPTCHA
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  // 🔐 Validation front
  const validateForm = () => {
    if (mode === "register" && !name.trim()) {
      setError("Le nom est requis pour créer un compte");
      return false;
    }

    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return false;
    }

    if (!email.includes("@")) {
      setError("Adresse e-mail invalide");
      return false;
    }

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    setError(null);

    if (!validateForm()) return;

    // 🔐 Blocage si captcha activé et non validé
    if (recaptchaEnabled && !captchaToken) {
      setError("Veuillez valider le captcha");
      return;
    }

    const effectiveCaptchaToken = recaptchaEnabled ? (captchaToken || "") : "bypass-token";

    try {
      setIsLoading(true);

      const response =
        mode === "login"
          ? await login(email, password, effectiveCaptchaToken)
          : await register(name.trim(), email, password, effectiveCaptchaToken);

      onAuthSuccess(response.user, response.token, mode);
    } catch {
      setError("Identifiants invalides ou compte inexistant");
      if (recaptchaEnabled) {
        setCaptchaToken(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'register' : 'login'));
    setError(null);
    setCaptchaToken(null);
  };

  return (
    <div className="relative flex h-full w-full flex-col items-center p-4 bg-background-light dark:bg-background-dark overflow-y-auto">
      <div className="z-10 flex w-full flex-1 flex-col items-center justify-center pt-8 max-w-md my-auto">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative p-4 mb-4">
            <div className="absolute inset-0 bg-primary/20 rounded-2xl rotate-6"></div>
            <div className="absolute inset-0 bg-primary/20 rounded-2xl -rotate-6"></div>
            <div className="relative p-4 bg-primary rounded-2xl shadow-xl shadow-primary/30">
              <span className="material-symbols-outlined !text-3xl text-accent" aria-hidden="true">
                lock
              </span>
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
                <span className="material-symbols-outlined text-[22px]" aria-hidden="true">
                  badge
                </span>
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

          <div className="group relative transition-all duration-300">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 size-6 flex items-center justify-center text-gray-400 transition-colors group-focus-within:text-primary">
              <span className="material-symbols-outlined text-[22px]" aria-hidden="true">
                mail
              </span>
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

          <div className="group relative transition-all duration-300">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 size-6 flex items-center justify-center text-gray-400 transition-colors group-focus-within:text-primary">
              <span className="material-symbols-outlined text-[22px]" aria-hidden="true">
                key
              </span>
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
            <button
              aria-label="Afficher le mot de passe"
              className="absolute right-0 top-0 bottom-0 px-4 flex items-center justify-center text-gray-400"
              tabIndex={-1}
            >
              <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
                visibility_off
              </span>
            </button>
          </div>

          {error && (
            <div className="text-sm text-red-500 font-semibold bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-3">
              {error}
            </div>
          )}

          {/* 🔐 CAPTCHA */}
          {recaptchaEnabled ? (
            recaptchaSiteKey ? (
              <ReCAPTCHA
                sitekey={recaptchaSiteKey}
                onChange={(token) => setCaptchaToken(token)}
                onExpired={() => setCaptchaToken(null)}
              />
            ) : (
              <div className="text-sm text-red-500 font-semibold bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-3">
                Configuration captcha manquante (VITE_RECAPTCHA_SITE_KEY).
              </div>
            )
          ) : (
            <div className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-3">
              Captcha désactivé pour cette version.
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isLoading || restoringSession}
            className="flex w-full cursor-pointer items-center justify-center rounded-2xl h-14 bg-gradient-to-r from-primary to-primary/90 text-white text-base font-bold shadow-lg shadow-primary/30 active:scale-95 transition-all duration-200 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Patientez...' : mode === 'login' ? 'Se connecter' : 'Créer un compte'}
          </button>

          <div className="flex items-center my-4">
            <hr className="flex-grow border-t border-gray-200 dark:border-gray-800" />
            <span className="mx-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
              Ou continuer avec
            </span>
            <hr className="flex-grow border-t border-gray-200 dark:border-gray-800" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button disabled className="flex items-center justify-center rounded-2xl h-14 bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-800 text-text-light dark:text-text-dark font-bold disabled:opacity-60">
              Google
            </button>
            <button disabled className="flex items-center justify-center rounded-2xl h-14 bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-800 text-text-light dark:text-text-dark font-bold disabled:opacity-60">
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
