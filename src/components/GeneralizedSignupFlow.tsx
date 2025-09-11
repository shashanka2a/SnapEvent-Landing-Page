"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SignupForm } from './SignupForm';
import { UserTypeSelection } from './UserTypeSelection';
import { OnboardingForm } from './OnboardingForm';

type SignupStep = 'signup' | 'userType' | 'onboarding' | 'complete';

interface GeneralizedSignupFlowProps {
  onComplete: (userType: 'CLIENT' | 'PHOTOGRAPHER') => void;
  onBack: () => void;
}

export function GeneralizedSignupFlow({ onComplete, onBack }: GeneralizedSignupFlowProps) {
  const [currentStep, setCurrentStep] = useState<SignupStep>('signup');
  const [userType, setUserType] = useState<'CLIENT' | 'PHOTOGRAPHER' | null>(null);
  const [userData, setUserData] = useState<any>(null);

  const handleSignupSuccess = () => {
    setCurrentStep('userType');
  };

  const handleUserTypeSelect = async (selectedUserType: 'CLIENT' | 'PHOTOGRAPHER') => {
    setUserType(selectedUserType);
    
    // Update user role in database
    try {
      const response = await fetch('/api/auth/update-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: selectedUserType
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user role');
      }

      // If photographer, go to onboarding
      if (selectedUserType === 'PHOTOGRAPHER') {
        setCurrentStep('onboarding');
      } else {
        // If client, complete the flow
        setCurrentStep('complete');
        onComplete(selectedUserType);
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      // Still proceed with the flow even if role update fails
      if (selectedUserType === 'PHOTOGRAPHER') {
        setCurrentStep('onboarding');
      } else {
        setCurrentStep('complete');
        onComplete(selectedUserType);
      }
    }
  };

  const handleOnboardingComplete = () => {
    setCurrentStep('complete');
    onComplete('PHOTOGRAPHER');
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'userType':
        setCurrentStep('signup');
        break;
      case 'onboarding':
        setCurrentStep('userType');
        break;
      default:
        onBack();
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
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {currentStep === 'signup' && (
          <motion.div
            key="signup"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <SignupForm 
              onSignupSuccess={handleSignupSuccess}
              onBack={onBack}
            />
          </motion.div>
        )}

        {currentStep === 'userType' && (
          <motion.div
            key="userType"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <UserTypeSelection 
              onUserTypeSelect={handleUserTypeSelect}
              onBack={handleBack}
            />
          </motion.div>
        )}

        {currentStep === 'onboarding' && userType === 'PHOTOGRAPHER' && (
          <motion.div
            key="onboarding"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <OnboardingForm 
              onNavigate={(page) => {
                if (page === 'landing') {
                  handleOnboardingComplete();
                }
              }}
              isEditMode={false}
            />
          </motion.div>
        )}

        {currentStep === 'complete' && (
          <motion.div
            key="complete"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="min-h-screen bg-background text-foreground flex items-center justify-center px-4"
          >
            <div className="text-center">
              <motion.div
                className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 15 }}
              >
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              <h1 className="text-3xl font-bold mb-4">Welcome to SnapEvent!</h1>
              <p className="text-xl text-muted-foreground mb-8">
                {userType === 'CLIENT' 
                  ? "Your account is ready! You can now browse and book photographers."
                  : "Your photographer profile is ready! You can now start receiving bookings."
                }
              </p>
              <motion.button
                onClick={() => onComplete(userType!)}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
