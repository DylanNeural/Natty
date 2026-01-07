
import React, { useState, useEffect } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { LandingScreen } from './components/LandingScreen';
import { LoginScreen } from './components/LoginScreen';
import { OnboardingGoals } from './components/OnboardingGoals';
import { DietaryPreferences } from './components/DietaryPreferences';
import { Dashboard } from './components/Dashboard';
import { MapScreen } from './components/MapScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { ImageEditorScreen } from './components/ImageEditorScreen';
import { SocialClubScreen } from './components/SocialClubScreen';
import { MenuScreen } from './components/MenuScreen';
import { PaywallScreen } from './components/PaywallScreen';
import { BottomNav } from './components/BottomNav';
import { fetchProfile, User } from './services/api';

export enum Screen {
  SPLASH = 'SPLASH',
  LANDING = 'LANDING',
  LOGIN = 'LOGIN',
  GOALS = 'GOALS',
  DIET_PREFS = 'DIET_PREFS',
  PAYWALL = 'PAYWALL',
  DASHBOARD = 'DASHBOARD',
  MAP = 'MAP',
  PROFILE = 'PROFILE',
  IMAGE_EDITOR = 'IMAGE_EDITOR',
  SOCIAL_CLUB = 'SOCIAL_CLUB',
  MENU = 'MENU',
}

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.SPLASH);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [restoringSession, setRestoringSession] = useState(true);
  const isAuthenticated = Boolean(authToken);

  // Simulate splash screen delay
  useEffect(() => {
    if (currentScreen === Screen.SPLASH) {
      const timer = setTimeout(() => {
        setCurrentScreen(Screen.LANDING);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  // Restore session on load
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem('natty_token') : null;
    if (!stored) {
      setRestoringSession(false);
      return;
    }

    setAuthToken(stored);
    fetchProfile(stored)
      .then((user) => {
        setCurrentUser(user);
        setCurrentScreen(Screen.DASHBOARD);
      })
      .catch(() => {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem('natty_token');
        }
        setAuthToken(null);
        setCurrentUser(null);
      })
      .finally(() => setRestoringSession(false));
  }, []);

  const navigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleAuthSuccess = (user: User, token: string, origin: 'login' | 'register') => {
    setAuthToken(token);
    setCurrentUser(user);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('natty_token', token);
    }
    setCurrentScreen(origin === 'register' ? Screen.GOALS : Screen.DASHBOARD);
  };

  const handleLogout = () => {
    setAuthToken(null);
    setCurrentUser(null);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('natty_token');
    }
    setCurrentScreen(Screen.LANDING);
  };

  const isMainAppScreen = [Screen.DASHBOARD, Screen.MAP, Screen.PROFILE, Screen.IMAGE_EDITOR, Screen.SOCIAL_CLUB, Screen.MENU].includes(currentScreen);

  return (
    <div className="relative h-screen w-full overflow-hidden flex flex-col bg-background-light dark:bg-background-dark transition-colors duration-300">
      
      {/* Screen Rendering */}
      <div className={`flex-1 overflow-y-auto ${isMainAppScreen ? 'pb-24' : ''}`}>
        {currentScreen === Screen.SPLASH && <SplashScreen />}
        {currentScreen === Screen.LANDING && <LandingScreen onNavigate={() => navigate(Screen.LOGIN)} />}
        {currentScreen === Screen.LOGIN && (
          <LoginScreen
            onAuthSuccess={(user, token, origin) => handleAuthSuccess(user, token, origin)}
            restoringSession={restoringSession}
          />
        )}
        {currentScreen === Screen.GOALS && <OnboardingGoals onNavigate={() => navigate(Screen.DIET_PREFS)} />}
        {currentScreen === Screen.DIET_PREFS && <DietaryPreferences onNavigate={() => navigate(Screen.PAYWALL)} />}
        {currentScreen === Screen.PAYWALL && <PaywallScreen onNavigate={() => navigate(Screen.DASHBOARD)} />}
        
        {currentScreen === Screen.DASHBOARD && <Dashboard onNavigate={(s) => navigate(s)} />}
        {currentScreen === Screen.MAP && <MapScreen onNavigate={(s) => navigate(s)} />}
        {currentScreen === Screen.PROFILE && <ProfileScreen user={currentUser} onLogout={handleLogout} />}
        {currentScreen === Screen.IMAGE_EDITOR && <ImageEditorScreen onBack={() => navigate(Screen.DASHBOARD)} />}
        {currentScreen === Screen.SOCIAL_CLUB && <SocialClubScreen />}
        {currentScreen === Screen.MENU && <MenuScreen onBack={() => navigate(Screen.MAP)} />}
      </div>

      {/* Bottom Navigation for Main App Screens */}
      {isAuthenticated && isMainAppScreen && (
        <BottomNav currentScreen={currentScreen} onNavigate={navigate} />
      )}
    </div>
  );
};

export default App;
