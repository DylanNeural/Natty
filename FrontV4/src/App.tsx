/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  Home, 
  Map as MapIcon, 
  BookOpen, 
  User, 
  Scan, 
  TrendingUp,
  Users,
  Check
} from 'lucide-react';

import { Screen, UserProfile, Fridge, Product, Goal } from './types';
import Button from './components/ui/Button';

// Import Screens
import SplashScreen from './components/screens/SplashScreen';
import LoginScreen from './components/screens/LoginScreen';
import SignupScreen from './components/screens/SignupScreen';
import ForgotPasswordScreen from './components/screens/ForgotPasswordScreen';
import Onboarding from './components/screens/Onboarding';
import Dashboard from './components/screens/Dashboard';
import PerformanceHub from './components/screens/PerformanceHub';
import StatisticsScreen from './components/screens/StatisticsScreen';
import HydrationScreen from './components/screens/HydrationScreen';
import FastingScreen from './components/screens/FastingScreen';
import EliteScreen from './components/screens/EliteScreen';
import SocialScreen from './components/screens/SocialScreen';
import MapScreen from './components/screens/MapScreen';
import FridgeDetail from './components/screens/FridgeDetail';
import ProductDetailScreen from './components/screens/ProductDetailScreen';
import ScanScreen from './components/screens/ScanScreen';
import ScanResultsScreen from './components/screens/ScanResultsScreen';
import JournalScreen from './components/screens/JournalScreen';
import ProfileScreen from './components/screens/ProfileScreen';
import SettingsScreen from './components/screens/SettingsScreen';
import SupportScreen from './components/screens/SupportScreen';
import ChallengesScreen from './components/screens/ChallengesScreen';
import NotificationsScreen from './components/screens/NotificationsScreen';
import PaymentScreen from './components/screens/PaymentScreen';
import PersonalInfoScreen from './components/screens/PersonalInfoScreen';
import GoalsMacrosScreen from './components/screens/GoalsMacrosScreen';
import SubscriptionScreen from './components/screens/SubscriptionScreen';
import AdminScreen from './components/screens/AdminScreen';

import { getProfile, logout as apiLogout } from './services/apiService';

const normalizeUserProfile = (rawUser: any): UserProfile => {
  const safeUser = rawUser || {};

  return {
    ...safeUser,
    isAdmin: !!safeUser.isAdmin,
    waterIntake: {
      current: safeUser.waterIntake?.current || 0,
      goal: safeUser.waterIntake?.goal || 2.5,
      history: safeUser.waterIntake?.history || [],
    },
    fasting: {
      protocol: safeUser.fasting?.protocol || '16:8',
      isActive: safeUser.fasting?.isActive || false,
      startTime: safeUser.fasting?.startTime,
      endTime: safeUser.fasting?.endTime,
    },
    stats: {
      daysActive: safeUser.stats?.daysActive || 1,
      mealsLogged: safeUser.stats?.mealsLogged || 0,
      challengesCompleted: safeUser.stats?.challengesCompleted || 0,
      calories: safeUser.stats?.calories || 0,
      protein: safeUser.stats?.protein || 0,
      carbs: safeUser.stats?.carbs || 0,
      fat: safeUser.stats?.fat || 0,
      steps: safeUser.stats?.steps || 0,
      sleep: safeUser.stats?.sleep || 0,
    },
  } as UserProfile;
};

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('natty_user');
    return saved ? normalizeUserProfile(JSON.parse(saved)) : null;
  });
  const [selectedFridge, setSelectedFridge] = useState<Fridge | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('natty_user', JSON.stringify(user));
    }
  }, [user]);

  // Redirect to appropriate screen on mount based on auth state
  useEffect(() => {
    if (screen === 'splash') {
      const timer = setTimeout(async () => {
        try {
          const profile = await getProfile();
          setUser(normalizeUserProfile(profile));
          setScreen('home');
        } catch {
          localStorage.removeItem('natty_user');
          setUser(null);
          setScreen('login');
        }
      }, 1500); // Show splash screen for 1.5s

      return () => clearTimeout(timer);
    }
  }, [screen]);

  const handleLogin = () => {
    // User data is already set from API response and stored in localStorage
    const saved = localStorage.getItem('natty_user');
    if (saved) {
      const userData = normalizeUserProfile(JSON.parse(saved));
      setUser(userData);
    }
    setScreen('home');
  };

  const handleLogout = async () => {
    try {
      await apiLogout();
    } finally {
      localStorage.removeItem('natty_user');
      setUser(null);
      setScreen('login');
    }
  };

  const handleOnboardingComplete = (profile: UserProfile) => {
    const normalizedProfile = normalizeUserProfile(profile);
    setUser(normalizedProfile);
    setScreen('home');
  };

  const updateGoal = (newGoal: Goal) => {
    if (!user) return;
    
    // Simple macro recalculation based on goal
    let newStats = { ...user.stats };
    if (newGoal === 'perte-de-poids') {
      newStats = { ...newStats, calories: 1800, protein: 160, carbs: 150, fat: 60 };
    } else if (newGoal === 'prise-de-muscle') {
      newStats = { ...newStats, calories: 2800, protein: 180, carbs: 350, fat: 75 };
    } else {
      newStats = { ...newStats, calories: 2200, protein: 140, carbs: 280, fat: 65 };
    }

    setUser({
      ...user,
      goal: newGoal,
      stats: newStats
    });
  };

  const renderScreen = () => {
    switch(screen) {
      case 'splash': return <SplashScreen onFinish={() => setScreen('login')} />;
      case 'login': return <LoginScreen onLogin={handleLogin} onSignup={() => setScreen('signup')} onForgot={() => setScreen('forgot-password')} />;
      case 'signup': return <SignupScreen onSignup={() => setScreen('onboarding')} onLogin={() => setScreen('login')} />;
      case 'forgot-password': return <ForgotPasswordScreen onBack={() => setScreen('login')} />;
      case 'onboarding': return <Onboarding onComplete={handleOnboardingComplete} />;
      case 'home': return user ? <Dashboard user={user} onNavigate={setScreen} /> : null;
      case 'performance-hub': return user ? <PerformanceHub user={user} onNavigate={setScreen} /> : null;
      case 'statistics': return <StatisticsScreen onBack={() => setScreen('performance-hub')} />;
      case 'hydration': return user ? <HydrationScreen user={user} onBack={() => setScreen('performance-hub')} /> : null;
      case 'fasting': return <FastingScreen onBack={() => setScreen('performance-hub')} />;
      case 'elite': return <EliteScreen onBack={() => setScreen('performance-hub')} />;
      case 'social': return <SocialScreen onNavigate={setScreen} />;
      case 'map': return <MapScreen onSelectFridge={(f) => { setSelectedFridge(f); setScreen('fridge-detail'); }} />;
      case 'fridge-detail': return selectedFridge ? <FridgeDetail fridge={selectedFridge} onBack={() => setScreen('map')} onSelectProduct={(p) => { setSelectedProduct(p); setScreen('product-detail'); }} /> : null;
      case 'product-detail': return selectedProduct ? <ProductDetailScreen product={selectedProduct} onBack={() => setScreen('fridge-detail')} onBuy={() => setScreen('payment')} /> : null;
      case 'scan': return <ScanScreen onBack={() => setScreen('home')} onScanComplete={() => setScreen('scan-results')} />;
      case 'scan-results': return <ScanResultsScreen onBack={() => setScreen('scan')} onSelectProduct={(p) => { setSelectedProduct(p); setScreen('payment'); }} />;
      case 'journal': return <JournalScreen />;
      case 'profile': return user ? <ProfileScreen user={user} onSettings={() => setScreen('settings')} onNavigate={(s: Screen) => setScreen(s)} onLogout={handleLogout} /> : null;
      case 'settings': return <SettingsScreen onBack={() => setScreen('profile')} onNavigate={(s: Screen) => setScreen(s)} />;
      case 'support': return <SupportScreen onBack={() => setScreen('settings')} />;
      case 'challenges': return <ChallengesScreen onBack={() => setScreen('home')} />;
      case 'notifications': return <NotificationsScreen onBack={() => setScreen('profile')} />;
      case 'personal-info': return user ? <PersonalInfoScreen user={user} onBack={() => setScreen('profile')} /> : null;
      case 'goals-macros': return user ? <GoalsMacrosScreen user={user} onBack={() => setScreen('profile')} onUpdateGoal={updateGoal} /> : null;
      case 'subscription': return user ? <SubscriptionScreen user={user} onBack={() => setScreen('profile')} /> : null;
      case 'admin': return user?.isAdmin ? <AdminScreen onBack={() => setScreen('profile')} /> : null;
      case 'payment': return selectedProduct ? <PaymentScreen product={selectedProduct} onBack={() => setScreen('product-detail')} onComplete={() => setScreen('success')} /> : null;
      case 'success': return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[100svh] bg-natty-teal flex flex-col items-center justify-center p-8 pt-safe pb-safe text-center text-white">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            transition={{ type: "spring", damping: 12 }}
            className="w-24 h-24 bg-natty-lime rounded-full flex items-center justify-center mb-8 shadow-2xl"
          >
            <Check size={48} className="text-natty-teal" />
          </motion.div>
          <h1 className="text-3xl font-black mb-4">Bon appétit !</h1>
          <p className="text-white/60 font-medium mb-12">Ton frigo est déverrouillé. N'oublie pas de bien refermer la porte après avoir récupéré ton {selectedProduct?.name}.</p>
          <Button onClick={() => setScreen('home')} variant="lime" className="w-full">Retour à l'accueil</Button>
        </motion.div>
      );
      default: return <div className="p-12 text-center text-natty-charcoal/20 font-black text-4xl uppercase">En construction</div>;
    }
  };

  const showNav = !['splash', 'login', 'signup', 'forgot-password', 'onboarding', 'fridge-detail', 'product-detail', 'scan', 'scan-results', 'payment', 'success', 'personal-info', 'goals-macros', 'subscription', 'notifications', 'settings', 'support', 'statistics', 'hydration', 'fasting', 'elite', 'admin'].includes(screen);

  return (
    <div className="max-w-md mx-auto bg-natty-beige min-h-[100svh] relative shadow-2xl overflow-hidden">
      <AnimatePresence mode="wait">
        {renderScreen()}
      </AnimatePresence>

      {/* Bottom Navigation */}
      {showNav && (
        <motion.nav 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-6 left-6 right-6 h-20 bg-white rounded-full bottom-nav-shadow flex items-center justify-around px-2 z-50 pb-safe"
        >
          {[
            { id: 'home', icon: Home, label: 'Accueil' },
            { id: 'map', icon: MapIcon, label: 'Carte' },
            { id: 'scan', icon: Scan, label: 'Scan', special: true },
            { id: 'performance-hub', icon: TrendingUp, label: 'Hub' },
            { id: 'journal', icon: BookOpen, label: 'Journal' },
            { id: 'profile', icon: User, label: 'Profil' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setScreen(item.id as Screen)}
              className={`flex flex-col items-center gap-1 transition-all ${screen === item.id ? 'text-natty-teal scale-110' : 'text-natty-charcoal/30'}`}
            >
              <div className={`p-2 rounded-full transition-all ${screen === item.id ? 'bg-natty-lime' : item.special ? 'bg-natty-teal/5' : ''}`}>
                <item.icon 
                  size={item.special ? 28 : 24} 
                  strokeWidth={screen === item.id || item.special ? 2.5 : 2} 
                  className={item.special && screen !== item.id ? 'text-natty-teal' : ''}
                />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest transition-opacity ${screen === item.id ? 'opacity-100' : 'opacity-40'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </motion.nav>
      )}
    </div>
  );
}
