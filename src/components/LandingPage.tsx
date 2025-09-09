"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Users, Camera, Star, ArrowRight, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LandingPageProps {
  onNavigate: (page: 'landing' | 'onboarding' | 'portfolio', photographerId?: string) => void;
  onPhotographerSelect: (id: string) => void;
}

export function LandingPage({ onNavigate, onPhotographerSelect }: LandingPageProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Animation variants
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

  const slideInFromLeft = {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, ease: "easeOut" as const }
  };

  const slideInFromRight = {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, ease: "easeOut" as const }
  };

  const categories = [
    {
      name: 'Wedding',
      image: 'https://images.unsplash.com/photo-1730116309939-10a01fdf1edb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwcGhvdG9ncmFwaHklMjBjb3VwbGV8ZW58MXx8fHwxNzU3Mzk0MjE1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      count: '2.1k photographers'
    },
    {
      name: 'Portrait',
      image: 'https://images.unsplash.com/photo-1586796676778-2c50b6bc3937?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHBob3RvZ3JhcGhlciUyMHN0dWRpb3xlbnwxfHx8fDE3NTc0MTU1Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      count: '1.8k photographers'
    },
    {
      name: 'Corporate',
      image: 'https://images.unsplash.com/photo-1705544363562-cdf94dd458cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBldmVudCUyMHBob3RvZ3JhcGh5fGVufDF8fHx8MTc1NzM5Mzk5OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      count: '950 photographers'
    },
    {
      name: 'Events',
      image: 'https://images.unsplash.com/photo-1656918566254-957a997dbd7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMHBhcnR5JTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzU3NDE1NTM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      count: '1.2k photographers'
    }
  ];

  const trendingPhotographers = [
    {
      id: '1',
      name: 'Sarah Chen',
      specialty: 'Wedding & Portrait',
      location: 'San Francisco, CA',
      rating: 4.9,
      reviews: 127,
      price: 'From $800',
      image: 'https://images.unsplash.com/photo-1643968612613-fd411aecd1fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwaG90b2dyYXBoZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTczMjkzODF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      verified: true
    },
    {
      id: '2',
      name: 'Marcus Johnson',
      specialty: 'Corporate & Events',
      location: 'New York, NY',
      rating: 4.8,
      reviews: 203,
      price: 'From $650',
      image: 'https://images.unsplash.com/photo-1502514463321-f81bd30cd473?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW1lcmElMjBwaG90b2dyYXBoZXIlMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzU3NDE1NTM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      verified: true
    },
    {
      id: '3',
      name: 'Elena Rodriguez',
      specialty: 'Fashion & Portrait',
      location: 'Los Angeles, CA',
      rating: 4.9,
      reviews: 156,
      price: 'From $950',
      image: 'https://images.unsplash.com/photo-1586796676778-2c50b6bc3937?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHBob3RvZ3JhcGhlciUyMHN0dWRpb3xlbnwxfHx8fDE3NTc0MTU1Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      verified: true
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <motion.nav 
        className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-2"
              {...slideInFromLeft}
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <Camera className="h-8 w-8 text-primary" />
              </motion.div>
              <span className="text-xl font-semibold">SnapEvent</span>
            </motion.div>
            
            {/* Desktop Navigation */}
            <motion.div 
              className="hidden md:flex items-center space-x-8"
              {...slideInFromRight}
            >
              <motion.a 
                href="#" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                whileHover={{ y: -2 }}
                transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
              >
                Find Photographers
              </motion.a>
              <motion.a 
                href="#" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                whileHover={{ y: -2 }}
                transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
              >
                How it Works
              </motion.a>
              <motion.a 
                href="#" 
                className="text-muted-foreground hover:text-foreground transition-colors"
                whileHover={{ y: -2 }}
                transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
              >
                Pricing
              </motion.a>
              <motion.div {...scaleOnHover}>
                <Button variant="ghost" size="sm">Sign In</Button>
              </motion.div>
              <motion.div {...scaleOnHover}>
                <Button 
                  size="sm" 
                  onClick={() => onNavigate('onboarding')}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Join as Photographer
                </Button>
              </motion.div>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.div 
              className="md:hidden"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <AnimatePresence mode="wait">
                  {isMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                className="md:hidden mt-4 pb-4 border-t border-border pt-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <motion.div 
                  className="flex flex-col space-y-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <motion.a 
                    href="#" 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
                  >
                    Find Photographers
                  </motion.a>
                  <motion.a 
                    href="#" 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
                  >
                    How it Works
                  </motion.a>
                  <motion.a 
                    href="#" 
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
                  >
                    Pricing
                  </motion.a>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button variant="ghost" size="sm" className="justify-start">Sign In</Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      size="sm" 
                      onClick={() => onNavigate('onboarding')}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 justify-start"
                    >
                      Join as Photographer
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            {...fadeInUp}
          >
            Connect with
            <motion.span 
              className="block text-primary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
            >
              Professional Photographers
            </motion.span>
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
          >
            Find the perfect photographer for your special moments. Browse portfolios, compare prices, and book with confidence.
          </motion.p>

          {/* Search Form */}
          <motion.div 
            className="bg-card border border-border rounded-xl p-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.6, ease: "easeOut" as const }}
            whileHover={{ scale: 1.01 }}
          >
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-4 gap-4"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <motion.div className="relative" variants={staggerItem}>
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
                >
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    placeholder="Photography type" 
                    className="pl-10 bg-input-background border-0 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  />
                </motion.div>
              </motion.div>
              <motion.div className="relative" variants={staggerItem}>
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
                >
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    placeholder="Location" 
                    className="pl-10 bg-input-background border-0 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  />
                </motion.div>
              </motion.div>
              <motion.div variants={staggerItem}>
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
                >
                  <Select>
                    <SelectTrigger className="bg-input-background border-0 focus:ring-2 focus:ring-primary/20 transition-all duration-200">
                      <SelectValue placeholder="Event size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small (1-20 people)</SelectItem>
                      <SelectItem value="medium">Medium (21-100 people)</SelectItem>
                      <SelectItem value="large">Large (100+ people)</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
              </motion.div>
              <motion.div variants={staggerItem}>
                <motion.div {...scaleOnHover}>
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    Search Photographers
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div 
            className="flex items-center justify-between mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl font-bold">Browse by Category</h2>
            <motion.div {...scaleOnHover}>
              <Button variant="ghost" className="text-primary hover:text-primary/80">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
          >
            {categories.map((category, index) => (
              <motion.div key={index} variants={staggerItem}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
                >
                  <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 bg-card border-border overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                          <ImageWithFallback
                            src={category.image}
                            alt={category.name}
                            className="w-full h-48 object-cover"
                          />
                        </motion.div>
                        <motion.div 
                          className="absolute inset-0 bg-black/40"
                          whileHover={{ backgroundColor: "rgba(0,0,0,0.2)" }}
                          transition={{ duration: 0.3 }}
                        />
                        <motion.div 
                          className="absolute bottom-4 left-4 text-white"
                          initial={{ opacity: 0, y: 20 }}
                          whileHover={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <h3 className="text-xl font-semibold mb-1">{category.name}</h3>
                          <p className="text-sm opacity-90">{category.count}</p>
                        </motion.div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trending Photographers */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto">
          <motion.div 
            className="flex items-center justify-between mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl font-bold">Trending Photographers</h2>
            <motion.div {...scaleOnHover}>
              <Button variant="ghost" className="text-primary hover:text-primary/80">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
          >
            {trendingPhotographers.map((photographer, index) => (
              <motion.div key={photographer.id} variants={staggerItem}>
                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
                >
                  <Card 
                    className="group cursor-pointer hover:shadow-xl transition-all duration-300 bg-card border-border"
                    onClick={() => onPhotographerSelect(photographer.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <motion.div 
                          className="relative"
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
                        >
                          <ImageWithFallback
                            src={photographer.image}
                            alt={photographer.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          {photographer.verified && (
                            <motion.div 
                              className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: index * 0.1 + 0.5, type: "spring" as const, stiffness: 500, damping: 15 }}
                            >
                              <Star className="h-3 w-3 text-primary-foreground fill-current" />
                            </motion.div>
                          )}
                        </motion.div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold truncate">{photographer.name}</h3>
                            {photographer.verified && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 + 0.7, type: "spring" as const, stiffness: 500, damping: 15 }}
                              >
                                <Badge variant="secondary" className="text-xs">Verified</Badge>
                              </motion.div>
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2">{photographer.specialty}</p>
                          
                          <div className="flex items-center space-x-1 mb-2">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{photographer.location}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1">
                              <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.6, ease: "easeInOut" }}
                              >
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              </motion.div>
                              <span className="text-sm font-medium">{photographer.rating}</span>
                              <span className="text-xs text-muted-foreground">({photographer.reviews})</span>
                            </div>
                            <motion.span 
                              className="text-sm font-medium text-primary"
                              whileHover={{ scale: 1.1 }}
                              transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
                            >
                              {photographer.price}
                            </motion.span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          >
            Ready to capture your special moments?
          </motion.h2>
          <motion.p 
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          >
            Join thousands of satisfied clients who found their perfect photographer through SnapEvent.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div {...scaleOnHover}>
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Find Photographers
              </Button>
            </motion.div>
            <motion.div {...scaleOnHover}>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => onNavigate('onboarding')}
              >
                Join as Photographer
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer 
        className="border-t border-border bg-card/50 py-12 px-4"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="container mx-auto">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.div className="space-y-4" variants={staggerItem}>
              <motion.div 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                  <Camera className="h-6 w-6 text-primary" />
                </motion.div>
                <span className="text-lg font-semibold">SnapEvent</span>
              </motion.div>
              <p className="text-sm text-muted-foreground">
                Connecting clients with professional photographers worldwide.
              </p>
            </motion.div>
            
            <motion.div className="space-y-4" variants={staggerItem}>
              <h4 className="font-semibold">For Clients</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <motion.a 
                  href="#" 
                  className="block hover:text-foreground transition-colors"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
                >
                  Find Photographers
                </motion.a>
                <motion.a 
                  href="#" 
                  className="block hover:text-foreground transition-colors"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
                >
                  How it Works
                </motion.a>
                <motion.a 
                  href="#" 
                  className="block hover:text-foreground transition-colors"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
                >
                  Pricing
                </motion.a>
              </div>
            </motion.div>
            
            <motion.div className="space-y-4" variants={staggerItem}>
              <h4 className="font-semibold">For Photographers</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <motion.a 
                  href="#" 
                  className="block hover:text-foreground transition-colors"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
                >
                  Join SnapEvent
                </motion.a>
                <motion.a 
                  href="#" 
                  className="block hover:text-foreground transition-colors"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
                >
                  Success Stories
                </motion.a>
                <motion.a 
                  href="#" 
                  className="block hover:text-foreground transition-colors"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
                >
                  Resources
                </motion.a>
              </div>
            </motion.div>
            
            <motion.div className="space-y-4" variants={staggerItem}>
              <h4 className="font-semibold">Support</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <motion.a 
                  href="#" 
                  className="block hover:text-foreground transition-colors"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
                >
                  Help Center
                </motion.a>
                <motion.a 
                  href="#" 
                  className="block hover:text-foreground transition-colors"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
                >
                  Contact Us
                </motion.a>
                <motion.a 
                  href="#" 
                  className="block hover:text-foreground transition-colors"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
                >
                  Privacy Policy
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
          >
            © 2025 SnapEvent. All rights reserved.
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
}