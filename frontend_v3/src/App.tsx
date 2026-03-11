/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Page } from './types';
import { API_BASE_URL, pingBackend } from './services/api';

// --- Components ---
import { BottomNavigation } from './components/BottomNavigation';
import { Sidebar } from './components/Sidebar';

// --- Pages ---
import { Dashboard } from './pages/Dashboard';
import { Scanner } from './pages/Scanner';
import { MealDetails } from './pages/MealDetails';
import { Fridge } from './pages/Fridge';
import { Plan } from './pages/Plan';
import { Profile } from './pages/Profile';
import { OnboardingWelcome } from './pages/OnboardingWelcome';
import { OnboardingStep1 } from './pages/OnboardingStep1';
import { OnboardingStep2 } from './pages/OnboardingStep2';
import { OnboardingStep3 } from './pages/OnboardingStep3';
import { OnboardingStep4 } from './pages/OnboardingStep4';
import { OnboardingStep5 } from './pages/OnboardingStep5';
import { Paywall } from './pages/Paywall';
import { Settings } from './pages/Settings';
import { MealHistory } from './pages/MealHistory';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Stats } from './pages/Stats';
import { Favorites } from './pages/Favorites';
import { OrderTracking } from './pages/OrderTracking';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminUsers } from './pages/AdminUsers';
import { AdminFridges } from './pages/AdminFridges';
import { AdminOrders } from './pages/AdminOrders';

// --- Main App ---

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('onboarding-welcome');

  useEffect(() => {
    pingBackend()
      .then((result) => {
        if (!result.ok) {
          console.warn('[Natty V3] Backend répond avec une erreur', {
            apiBaseUrl: API_BASE_URL,
            status: result.status,
            body: result.body,
          });
          return;
        }

        console.info('[Natty V3] Backend connecté', {
          apiBaseUrl: API_BASE_URL,
          status: result.status,
        });
      })
      .catch((error) => {
        console.error('[Natty V3] Backend injoignable', {
          apiBaseUrl: API_BASE_URL,
          error: error instanceof Error ? error.message : String(error),
        });
      });
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'onboarding-welcome':
        return <OnboardingWelcome onNavigate={setCurrentPage} />;
      case 'onboarding-step1':
        return <OnboardingStep1 onNavigate={setCurrentPage} />;
      case 'onboarding-step2':
        return <OnboardingStep2 onNavigate={setCurrentPage} />;
      case 'onboarding-step3':
        return <OnboardingStep3 onNavigate={setCurrentPage} />;
      case 'onboarding-step4':
        return <OnboardingStep4 onNavigate={setCurrentPage} />;
      case 'onboarding-step5':
        return <OnboardingStep5 onNavigate={setCurrentPage} />;
      case 'paywall':
        return <Paywall onNavigate={setCurrentPage} />;
      case 'settings':
        return <Settings onNavigate={setCurrentPage} />;
      case 'meal-history':
        return <MealHistory onNavigate={setCurrentPage} />;
      case 'cart':
        return <Cart onNavigate={setCurrentPage} />;
      case 'checkout':
        return <Checkout onNavigate={setCurrentPage} />;
      case 'stats':
        return <Stats onNavigate={setCurrentPage} />;
      case 'favorites':
        return <Favorites onNavigate={setCurrentPage} />;
      case 'order-tracking':
        return <OrderTracking onNavigate={setCurrentPage} />;
      case 'admin-dashboard':
        return <AdminDashboard onNavigate={setCurrentPage} />;
      case 'admin-users':
        return <AdminUsers onNavigate={setCurrentPage} />;
      case 'admin-fridges':
        return <AdminFridges onNavigate={setCurrentPage} />;
      case 'admin-orders':
        return <AdminOrders onNavigate={setCurrentPage} />;
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'scanner':
        return <Scanner onNavigate={setCurrentPage} />;
      case 'meal-details':
        return <MealDetails onNavigate={setCurrentPage} />;
      case 'fridge':
        return <Fridge onNavigate={setCurrentPage} />;
      case 'plan':
        return <Plan onNavigate={setCurrentPage} />;
      case 'profile':
        return <Profile onNavigate={setCurrentPage} />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  const showNavigation = ['dashboard', 'scanner', 'plan', 'fridge', 'profile', 'meal-history', 'settings', 'cart', 'checkout', 'stats', 'favorites', 'order-tracking', 'admin-dashboard', 'admin-users', 'admin-fridges', 'admin-orders'].includes(currentPage);

  return (
    <div className="min-h-screen bg-[#FBF4EA] flex selection:bg-[#FAEBDD]/30">
      {showNavigation && (
        <Sidebar 
          activeTab={currentPage} 
          onTabChange={setCurrentPage} 
        />
      )}

      <div className={`flex-1 flex flex-col min-h-screen relative overflow-hidden bg-white ${showNavigation ? 'md:rounded-l-[40px] md:shadow-2xl md:my-4 md:mr-4' : ''}`}>
        <div className={`flex-1 flex flex-col ${!showNavigation ? 'w-full' : 'max-w-md mx-auto md:max-w-none md:w-full'}`}>
          <AnimatePresence mode="wait">
            {renderPage()}
          </AnimatePresence>
        </div>

        {showNavigation && (
          <div className="md:hidden">
            <BottomNavigation 
              activeTab={currentPage} 
              onTabChange={setCurrentPage} 
            />
          </div>
        )}
      </div>
    </div>
  );
}
