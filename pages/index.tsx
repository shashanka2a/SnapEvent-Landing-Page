"use client";

import React, { useState } from 'react';
import { LandingPage } from '../src/components/LandingPage';
import { OnboardingForm } from '../src/components/OnboardingForm';
import { PortfolioPage } from '../src/components/PortfolioPage';

type Page = 'landing' | 'onboarding' | 'portfolio';

export default function Home() {
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
