import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { OnboardingForm } from './components/OnboardingForm';
import { PortfolioPage } from './components/PortfolioPage';

type Page = 'landing' | 'onboarding' | 'portfolio';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [selectedPhotographerId, setSelectedPhotographerId] = useState<string>('1');

  const navigateTo = (page: Page, photographerId?: string) => {
    setCurrentPage(page);
    if (photographerId) {
      setSelectedPhotographerId(photographerId);
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
    </div>
  );
}