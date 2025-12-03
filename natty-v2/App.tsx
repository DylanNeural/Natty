
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

  // Simulate splash screen delay
  useEffect(() => {
    if (currentScreen === Screen.SPLASH) {
      const timer = setTimeout(() => {
        setCurrentScreen(Screen.LANDING);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const navigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const isMainAppScreen = [Screen.DASHBOARD, Screen.MAP, Screen.PROFILE, Screen.IMAGE_EDITOR, Screen.SOCIAL_CLUB, Screen.MENU].includes(currentScreen);

  return (
    <div className="relative h-screen w-full overflow-hidden flex flex-col bg-background-light dark:bg-background-dark transition-colors duration-300">
      
      {/* Screen Rendering */}
      <div className={`flex-1 overflow-y-auto ${isMainAppScreen ? 'pb-24' : ''}`}>
        {currentScreen === Screen.SPLASH && <SplashScreen />}
        {currentScreen === Screen.LANDING && <LandingScreen onNavigate={() => navigate(Screen.LOGIN)} />}
        {currentScreen === Screen.LOGIN && <LoginScreen onNavigate={() => navigate(Screen.GOALS)} />}
        {currentScreen === Screen.GOALS && <OnboardingGoals onNavigate={() => navigate(Screen.DIET_PREFS)} />}
        {currentScreen === Screen.DIET_PREFS && <DietaryPreferences onNavigate={() => navigate(Screen.PAYWALL)} />}
        {currentScreen === Screen.PAYWALL && <PaywallScreen onNavigate={() => navigate(Screen.DASHBOARD)} />}
        
        {currentScreen === Screen.DASHBOARD && <Dashboard onNavigate={(s) => navigate(s)} />}
        {currentScreen === Screen.MAP && <MapScreen onNavigate={(s) => navigate(s)} />}
        {currentScreen === Screen.PROFILE && <ProfileScreen onLogout={() => navigate(Screen.LANDING)} />}
        {currentScreen === Screen.IMAGE_EDITOR && <ImageEditorScreen onBack={() => navigate(Screen.DASHBOARD)} />}
        {currentScreen === Screen.SOCIAL_CLUB && <SocialClubScreen />}
        {currentScreen === Screen.MENU && <MenuScreen onBack={() => navigate(Screen.MAP)} />}
      </div>

      {/* Bottom Navigation for Main App Screens */}
      {isMainAppScreen && (
        <BottomNav currentScreen={currentScreen} onNavigate={navigate} />
      )}
    </div>
  );
};

export default App;
