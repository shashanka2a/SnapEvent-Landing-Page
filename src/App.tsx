import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { OnboardingForm } from './components/OnboardingForm';
import { PortfolioPage } from './components/PortfolioPage';
import { GeneralizedSignupFlow } from './components/GeneralizedSignupFlow';

type Page = 'landing' | 'onboarding' | 'portfolio' | 'signup';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [selectedPhotographerId, setSelectedPhotographerId] = useState<string>('1');

  const navigateTo = (page: Page, photographerId?: string) => {
    setCurrentPage(page);
    if (photographerId) {
      setSelectedPhotographerId(photographerId);
    }
  };

  const handleSignupComplete = (userType: 'CLIENT' | 'PHOTOGRAPHER') => {
    if (userType === 'PHOTOGRAPHER') {
      // Navigate to portfolio for photographers
      navigateTo('portfolio', 'new-photographer');
    } else {
      // Navigate back to landing for clients
      navigateTo('landing');
    }
  };

  return (
    <div className="min-h-screen bg-background dark">
      {currentPage === 'landing' && (
        <LandingPage 
          onNavigate={navigateTo}
          onPhotographerSelect={(id) => navigateTo('portfolio', id)}
        />
      )}
      {currentPage === 'onboarding' && (
        <OnboardingForm onNavigate={navigateTo} />
      )}
      {currentPage === 'portfolio' && (
        <PortfolioPage 
          photographerId={selectedPhotographerId}
          onNavigate={navigateTo}
        />
      )}
      {currentPage === 'signup' && (
        <GeneralizedSignupFlow 
          onComplete={handleSignupComplete}
          onBack={() => navigateTo('landing')}
        />
      )}
    </div>
  );
}