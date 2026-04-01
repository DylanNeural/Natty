import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, LockKeyhole, AlertCircle } from 'lucide-react';
import Button from '../ui/Button';
import { login } from '../../services/apiService';

interface LoginScreenProps {
  onLogin: () => void;
  onSignup: () => void;
  onForgot: () => void;
}

const LoginScreen = ({ onLogin, onSignup, onForgot }: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    
    if (!email || !password) {
      setError('Email et mot de passe sont obligatoires');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      onLogin();
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleLogin();
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-[100svh] bg-natty-beige p-8 flex flex-col pt-safe pb-safe">
      <div className="flex-1 flex flex-col justify-center">
        <div className="w-16 h-16 bg-natty-teal rounded-2xl flex items-center justify-center text-natty-lime font-black text-3xl mb-8">N</div>
        <h1 className="text-4xl font-black text-natty-teal mb-2">Bon retour !</h1>
        <p className="text-natty-charcoal/60 font-medium mb-12">Connecte-toi pour continuer ton aventure Natty.</p>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm font-bold text-red-600">{error}</p>
          </div>
        )}
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-natty-charcoal/60 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-natty-charcoal/20" size={20} />
              <input
                type="email"
                placeholder="ton@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
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
          <button onClick={onForgot} className="text-xs font-bold text-natty-teal/60 hover:text-natty-teal transition-colors ml-1">Mot de passe oublié ?</button>
        </div>
      </div>
      
      <div className="space-y-4">
        <Button onClick={handleLogin} variant="primary" className="w-full h-16 text-lg" disabled={loading}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </Button>
        <button onClick={onSignup} disabled={loading} className="w-full py-4 text-sm font-bold text-natty-charcoal/60 disabled:opacity-50">
          Pas encore de compte ? <span className="text-natty-teal">S'inscrire</span>
        </button>
      </div>
    </motion.div>
  );
};

export default LoginScreen;
