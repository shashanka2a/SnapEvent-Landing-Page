"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Camera, Users, ArrowRight } from 'lucide-react';

interface UserTypeSelectionProps {
  onUserTypeSelect: (userType: 'CLIENT' | 'PHOTOGRAPHER') => void;
  onBack: () => void;
}

export function UserTypeSelection({ onUserTypeSelect, onBack }: UserTypeSelectionProps) {
  const [selectedType, setSelectedType] = useState<'CLIENT' | 'PHOTOGRAPHER' | null>(null);

  const handleContinue = () => {
    if (selectedType) {
      onUserTypeSelect(selectedType);
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" as const }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const staggerItem = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" as const }
  };

  const scaleOnHover = {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { type: "spring" as const, stiffness: 400, damping: 17 }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <motion.div 
        className="w-full max-w-4xl"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        <motion.div 
          className="text-center mb-12"
          variants={staggerItem}
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-6"
            {...fadeInUp}
          >
            Welcome to SnapEvent!
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          >
            Let's get you set up. Are you looking to book photographers or join as a photographer?
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
          variants={staggerContainer}
        >
          {/* Client Option */}
          <motion.div variants={staggerItem}>
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-300 ${
                  selectedType === 'CLIENT' 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : 'hover:shadow-lg'
                }`}
                onClick={() => setSelectedType('CLIENT')}
              >
                <CardContent className="p-8 text-center">
                  <motion.div
                    className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  >
                    <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-4">I'm looking for photographers</h3>
                  <p className="text-muted-foreground mb-6">
                    Find and book professional photographers for your special events, portraits, or any photography needs.
                  </p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Browse photographer portfolios</p>
                    <p>• Compare prices and reviews</p>
                    <p>• Book with confidence</p>
                    <p>• Get professional results</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Photographer Option */}
          <motion.div variants={staggerItem}>
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-300 ${
                  selectedType === 'PHOTOGRAPHER' 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : 'hover:shadow-lg'
                }`}
                onClick={() => setSelectedType('PHOTOGRAPHER')}
              >
                <CardContent className="p-8 text-center">
                  <motion.div
                    className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  >
                    <Camera className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-4">I'm a photographer</h3>
                  <p className="text-muted-foreground mb-6">
                    Join our platform to showcase your work, connect with clients, and grow your photography business.
                  </p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Create your portfolio</p>
                    <p>• Set your pricing</p>
                    <p>• Get booked by clients</p>
                    <p>• Manage your business</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
        >
          <motion.div {...scaleOnHover}>
            <Button 
              variant="outline" 
              onClick={onBack}
              className="px-8"
            >
              Back
            </Button>
          </motion.div>
          <motion.div {...scaleOnHover}>
            <Button 
              onClick={handleContinue}
              disabled={!selectedType}
              className="px-8 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
