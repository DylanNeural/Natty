import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, LockKeyhole, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';
import { register } from '../../services/apiService';
import HCaptcha from '../ui/HCaptcha';

interface SignupScreenProps {
  onSignup: () => void;
  onLogin: () => void;
}

const SignupScreen = ({ onSignup, onLogin }: SignupScreenProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const captchaSiteKey = (import.meta as any).env.VITE_CAPTCHA_SITE_KEY as string | undefined;

  const handleSignup = async () => {
    setError('');
    
    if (!name || !email || !password) {
      setError('Tous les champs sont obligatoires');
      return;
    }

    if (password.length < 8) {
      setError('Le mot de passe doit avoir au moins 8 caractères');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Email invalide');
      return;
    }

    if (!captchaSiteKey) {
      setError('Captcha non configuré (VITE_CAPTCHA_SITE_KEY manquant)');
      return;
    }

    if (!captchaToken) {
      setError('Veuillez valider le captcha avant de vous inscrire.');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, captchaToken);
      onSignup();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleSignup();
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-[100svh] bg-natty-beige p-8 flex flex-col pt-safe pb-safe">
      <div className="flex-1 flex flex-col justify-center">
        <div className="w-16 h-16 bg-natty-teal rounded-2xl flex items-center justify-center text-natty-lime font-black text-3xl mb-8">N</div>
        <h1 className="text-4xl font-black text-natty-teal mb-2">Rejoins-nous.</h1>
        <p className="text-natty-charcoal/60 font-medium mb-12">Crée ton compte pour commencer ton suivi.</p>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm font-bold text-red-600">{error}</p>
          </div>
        )}
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-natty-charcoal/60 ml-1">Nom complet</label>
            <div className="relative">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-natty-charcoal/20" size={20} />
              <input
                type="text"
                placeholder="Léa Natty"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                className="w-full h-14 bg-white rounded-2xl pl-14 pr-6 font-bold border-2 border-transparent focus:border-natty-teal outline-none transition-all disabled:opacity-50"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-natty-charcoal/60 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-natty-charcoal/20" size={20} />
              <input
                type="email"
                placeholder="ton@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full h-14 bg-white rounded-2xl pl-14 pr-6 font-bold border-2 border-transparent focus:border-natty-teal outline-none transition-all disabled:opacity-50"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-natty-charcoal/60 ml-1">Mot de passe</label>
            <div className="relative">
              <LockKeyhole className="absolute left-5 top-1/2 -translate-y-1/2 text-natty-charcoal/20" size={20} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={loading}
                className="w-full h-14 bg-white rounded-2xl pl-14 pr-6 font-bold border-2 border-transparent focus:border-natty-teal outline-none transition-all disabled:opacity-50"
              />
            </div>
          </div>

          {captchaSiteKey && (
            <div className="pt-2">
              <HCaptcha
                siteKey={captchaSiteKey}
                onVerify={(token) => setCaptchaToken(token)}
                onExpire={() => setCaptchaToken('')}
                onError={() => {
                  setCaptchaToken('');
                  setError('Erreur captcha, veuillez réessayer.');
                }}
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        <Button onClick={handleSignup} variant="primary" className="w-full h-16 text-lg" disabled={loading}>
          {loading ? 'Inscription...' : 'S\'inscrire'}
        </Button>
        <button onClick={onLogin} disabled={loading} className="w-full py-4 text-sm font-bold text-natty-charcoal/60 disabled:opacity-50">
          Déjà un compte ? <span className="text-natty-teal">Se connecter</span>
        </button>
      </div>
    </motion.div>
  );
};

export default SignupScreen;
