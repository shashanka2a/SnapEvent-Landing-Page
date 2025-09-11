"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LandingPage } from '../src/components/LandingPage';
import { OnboardingForm } from '../src/components/OnboardingForm';
import { PortfolioPage } from '../src/components/PortfolioPage';
import { GeneralizedSignupFlow } from '../src/components/GeneralizedSignupFlow';

type Page = 'landing' | 'onboarding' | 'portfolio' | 'signup';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [selectedPhotographerId, setSelectedPhotographerId] = useState<string>('1');
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const navigateTo = (page: Page, photographerId?: string) => {
    setCurrentPage(page);
    if (photographerId) {
      setSelectedPhotographerId(photographerId);
    }
    // Set edit mode when navigating to onboarding from portfolio
    if (page === 'onboarding' && currentPage === 'portfolio') {
      setIsEditMode(true);
    } else if (page === 'onboarding' && currentPage === 'landing') {
      setIsEditMode(false);
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

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -20 }
  };

  const pageTransition = {
    type: "tween" as const,
    ease: "anticipate" as const,
    duration: 0.3
  };

  return (
    <div className="min-h-screen bg-background dark">
      <AnimatePresence mode="wait">
        {currentPage === 'landing' && (
          <motion.div
            key="landing"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <LandingPage 
              onNavigate={navigateTo}
              onPhotographerSelect={(id) => navigateTo('portfolio', id)}
            />
          </motion.div>
        )}
        {currentPage === 'onboarding' && (
          <motion.div
            key="onboarding"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <OnboardingForm onNavigate={navigateTo} isEditMode={isEditMode} />
          </motion.div>
        )}
        {currentPage === 'signup' && (
          <motion.div
            key="signup"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <GeneralizedSignupFlow 
              onComplete={handleSignupComplete}
              onBack={() => navigateTo('landing')}
            />
          </motion.div>
        )}
        {currentPage === 'portfolio' && (
          <motion.div
            key="portfolio"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <PortfolioPage 
              photographerId={selectedPhotographerId}
              onNavigate={navigateTo}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
