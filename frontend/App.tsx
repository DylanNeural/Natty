
import React, { useState, useEffect } from "react";
import { SplashScreen } from "./components/SplashScreen";
import { LandingScreen } from "./components/LandingScreen";
import { LoginScreen } from "./components/LoginScreen";
import { OnboardingGoals } from "./components/OnboardingGoals";
import { DietaryPreferences } from "./components/DietaryPreferences";
import { Dashboard } from "./components/Dashboard";
import { MapScreen } from "./components/MapScreen";
import { ProfileScreen } from "./components/ProfileScreen";
import { ImageEditorScreen } from "./components/ImageEditorScreen";
import { SocialClubScreen } from "./components/SocialClubScreen";
import { MenuScreen } from "./components/MenuScreen";
import { PaywallScreen } from "./components/PaywallScreen";
<<<<<<< HEAD
import { TestScreen } from "./components/TestScreen";
=======
>>>>>>> 70f9d6c ( ajout)
import { BottomNav } from "./components/BottomNav";
import { User } from "./services/api";
import { useAuth } from "./services/AuthContext";

/**
 * 🔐 Écrans de l'application
 */
export enum Screen {
  SPLASH = "SPLASH",
  LANDING = "LANDING",
  LOGIN = "LOGIN",
  GOALS = "GOALS",
  DIET_PREFS = "DIET_PREFS",
  PAYWALL = "PAYWALL",
  DASHBOARD = "DASHBOARD",
  MAP = "MAP",
  PROFILE = "PROFILE",
  IMAGE_EDITOR = "IMAGE_EDITOR",
  SOCIAL_CLUB = "SOCIAL_CLUB",
  MENU = "MENU",
<<<<<<< HEAD
  TEST = "TEST",
=======
>>>>>>> 70f9d6c ( ajout)
}

const App: React.FC = () => {
  /**
   * 🔐 Auth centralisée
   * - token stocké en mémoire
   * - source de vérité unique
   */
  const { login, logout, isAuthenticated } = useAuth();

  /**
   * 🎛️ États UI
   */
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.SPLASH);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [restoringSession, setRestoringSession] = useState(false);

  /**
   * ⏳ Splash screen (UX)
   */
  useEffect(() => {
    if (currentScreen === Screen.SPLASH) {
      const timer = setTimeout(() => {
        setCurrentScreen(Screen.LANDING);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  /**
   * 🔐 Protection des écrans sensibles
   * Empêche toute navigation forcée sans authentification
   */
  useEffect(() => {
    const protectedScreens: Screen[] = [
      Screen.DASHBOARD,
      Screen.MAP,
      Screen.PROFILE,
      Screen.IMAGE_EDITOR,
      Screen.SOCIAL_CLUB,
      Screen.MENU,
    ];

    if (!isAuthenticated && protectedScreens.includes(currentScreen)) {
      setCurrentScreen(Screen.LOGIN);
    }
  }, [currentScreen, isAuthenticated]);

  /**
   * 🔐 Callback après login / register
   */
  const handleAuthSuccess = (
    user: User,
    token: string,
    origin: "login" | "register"
  ) => {
    login(token); // token en mémoire
    setCurrentUser(user);

    setCurrentScreen(
      origin === "register" ? Screen.GOALS : Screen.DASHBOARD
    );
  };

  /**
   * 🔐 Déconnexion sécurisée
   */
  const handleLogout = () => {
    logout(); // supprime le token mémoire
    setCurrentUser(null);
    setCurrentScreen(Screen.LANDING);
  };

  /**
   * 📱 Écrans avec BottomNav
   */
  const isMainAppScreen = [
    Screen.DASHBOARD,
    Screen.MAP,
    Screen.PROFILE,
    Screen.IMAGE_EDITOR,
    Screen.SOCIAL_CLUB,
    Screen.MENU,
  ].includes(currentScreen);

  return (
    <div className="relative h-screen w-full overflow-hidden flex flex-col bg-background-light dark:bg-background-dark transition-colors duration-300">
      {/* Écrans */}
      <div className={`flex-1 overflow-y-auto ${isMainAppScreen ? "pb-24" : ""}`}>
        {currentScreen === Screen.SPLASH && <SplashScreen />}

        {currentScreen === Screen.LANDING && (
<<<<<<< HEAD
          <LandingScreen
            onNavigate={() => setCurrentScreen(Screen.LOGIN)}
            onTestNavigate={() => setCurrentScreen(Screen.TEST)}
          />
=======
          <LandingScreen onNavigate={() => setCurrentScreen(Screen.LOGIN)} />
>>>>>>> 70f9d6c ( ajout)
        )}

        {currentScreen === Screen.LOGIN && (
          <LoginScreen
            onAuthSuccess={handleAuthSuccess}
            restoringSession={restoringSession}
          />
        )}

        {currentScreen === Screen.GOALS && (
          <OnboardingGoals
            onNavigate={() => setCurrentScreen(Screen.DIET_PREFS)}
          />
        )}

        {currentScreen === Screen.DIET_PREFS && (
          <DietaryPreferences
            onNavigate={() => setCurrentScreen(Screen.PAYWALL)}
          />
        )}

        {currentScreen === Screen.PAYWALL && (
          <PaywallScreen
            onNavigate={() => setCurrentScreen(Screen.DASHBOARD)}
          />
        )}

        {currentScreen === Screen.DASHBOARD && (
          <Dashboard onNavigate={(s) => setCurrentScreen(s)} />
        )}

        {currentScreen === Screen.MAP && (
          <MapScreen onNavigate={(s) => setCurrentScreen(s)} />
        )}

        {currentScreen === Screen.PROFILE && (
          <ProfileScreen user={currentUser} onLogout={handleLogout} />
        )}

        {currentScreen === Screen.IMAGE_EDITOR && (
          <ImageEditorScreen
            onBack={() => setCurrentScreen(Screen.DASHBOARD)}
          />
        )}

        {currentScreen === Screen.SOCIAL_CLUB && <SocialClubScreen />}

        {currentScreen === Screen.MENU && (
          <MenuScreen onBack={() => setCurrentScreen(Screen.MAP)} />
        )}
<<<<<<< HEAD

        {currentScreen === Screen.TEST && (
          <TestScreen onBack={() => setCurrentScreen(Screen.LANDING)} />
        )}
=======
>>>>>>> 70f9d6c ( ajout)
      </div>

      {/* Navigation basse */}
      {isAuthenticated && isMainAppScreen && (
        <BottomNav
          currentScreen={currentScreen}
          onNavigate={(s) => setCurrentScreen(s)}
        />
      )}
    </div>
  );
};

export default App;
