"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, MapPin, Calendar, Camera, Phone, Mail, Instagram, Globe, Award, Users, Clock, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { photographersAPI, type Photographer } from '../lib/api';
import { BookingCalendar } from './BookingCalendar';
import { AvailabilityManager } from './AvailabilityManager';
import { BookingManager } from './BookingManager';

interface PortfolioPageProps {
  photographerId: string;
  onNavigate: (page: 'landing' | 'onboarding' | 'portfolio', photographerId?: string) => void;
}

export function PortfolioPage({ photographerId, onNavigate }: PortfolioPageProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showContactForm, setShowContactForm] = useState(false);
  const [showBookingCalendar, setShowBookingCalendar] = useState(false);
  const [showAvailabilityManager, setShowAvailabilityManager] = useState(false);
  const [showBookingManager, setShowBookingManager] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [photographer, setPhotographer] = useState<Photographer | null>(null);

  // Booking submission handler
  const handleBookingSubmit = async (bookingData: any) => {
    try {
      // Here you would call your booking API
      console.log('Booking submitted:', bookingData);
      
      // For now, we'll just show a success message
      alert(`Booking submitted successfully! We'll contact you soon to confirm your ${bookingData.eventType} on ${bookingData.eventDate} at ${bookingData.eventTime}.`);
      
      // Close the booking calendar
      setShowBookingCalendar(false);
      
      // You could also send an email notification here
      // await sendBookingNotification(bookingData);
      
    } catch (error) {
      console.error('Failed to submit booking:', error);
      alert('Failed to submit booking. Please try again.');
    }
  };

  // Fetch photographer data
  React.useEffect(() => {
    const fetchPhotographer = async () => {
      try {
        setIsLoading(true);
        const response = await photographersAPI.getById(photographerId);
        setPhotographer(response);
      } catch (error) {
        console.error('Failed to fetch photographer:', error);
        // Fallback to mock data if API fails
        setPhotographer({
          id: photographerId,
          businessName: 'Sarah Chen Photography',
          title: 'Wedding & Portrait Photographer',
          location: 'San Francisco, CA',
          bio: 'Passionate photographer specializing in capturing authentic moments and emotions. With over 8 years of experience, I focus on creating timeless images that tell your unique story.',
          specialties: ['Wedding Photography', 'Portrait Photography', 'Engagement Sessions'],
          services: [
            {
              name: 'Wedding Photography',
              description: 'Full day coverage with 2 photographers',
              price: 'From $2,800',
              duration: '8-10 hours',
              deliverables: '500+ edited photos, online gallery, print release'
            },
            {
              name: 'Portrait Session',
              description: 'Individual, couple, or family portraits',
              price: 'From $450',
              duration: '1-2 hours',
              deliverables: '30-50 edited photos, online gallery'
            }
          ],
          portfolio: [
            {
              id: 1,
              image: 'https://images.unsplash.com/photo-1730116309939-10a01fdf1edb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwcGhvdG9ncmFwaHklMjBjb3VwbGV8ZW58MXx8fHwxNzU3Mzk0MjE1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
              category: 'wedding',
              title: 'Golden Hour Wedding'
            }
          ],
          rating: 4.9,
          reviews: 127,
          verified: true,
          image: 'https://images.unsplash.com/photo-1643968612613-fd411aecd1fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwaG90b2dyYXBoZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTczMjkzODF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPhotographer();
  }, [photographerId]);

  const SkeletonCard = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-muted/50 rounded-lg p-6 space-y-4"
    >
      <div className="flex items-center space-x-4">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-16 h-16 bg-muted rounded-full"
        />
        <div className="space-y-2 flex-1">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            className="h-4 bg-muted rounded w-3/4"
          />
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            className="h-3 bg-muted rounded w-1/2"
          />
        </div>
      </div>
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
        className="h-3 bg-muted rounded w-full"
      />
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
        className="h-3 bg-muted rounded w-2/3"
      />
    </motion.div>
  );

  // Use fetched photographer data or fallback to null
  if (!photographer) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading photographer profile...</p>
        </div>
      </div>
    );
  }

  const filteredPortfolio = selectedCategory === 'all' 
    ? photographer.portfolio 
    : photographer.portfolio.filter(item => item.category === selectedCategory);

  const portfolioCategories = [
    { id: 'all', name: 'All Work' },
    { id: 'wedding', name: 'Weddings' },
    { id: 'portrait', name: 'Portraits' },
    { id: 'engagement', name: 'Engagements' },
    { id: 'event', name: 'Events' },
    { id: 'corporate', name: 'Corporate' }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => onNavigate('landing')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Browse</span>
            </Button>
            <div className="flex items-center space-x-2">
              <Camera className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">SnapEvent</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-8 md:py-12 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Profile Image */}
            <div className="relative">
              <ImageWithFallback
                src={photographer.image}
                alt={photographer.businessName}
                className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover border-4 border-background shadow-lg"
              />
              {photographer.verified && (
                <div className="absolute -bottom-2 -right-2 bg-primary rounded-full p-2">
                  <CheckCircle className="h-6 w-6 text-primary-foreground fill-current" />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{photographer.businessName}</h1>
                  <p className="text-xl text-muted-foreground mb-4">{photographer.title}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{photographer.location}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAvailabilityManager(true)}
                        className="text-xs"
                      >
                        <Calendar className="h-3 w-3 mr-1" />
                        Manage Availability
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowBookingManager(true)}
                        className="text-xs"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Manage Bookings
                      </Button>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{photographer.rating}</span>
                      <span className="text-sm text-muted-foreground">({photographer.reviews} reviews)</span>
                    </div>
                    {photographer.verified && (
                      <Badge variant="secondary" className="text-xs">Verified</Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {photographer.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <div className="flex gap-3">
                      <Button 
                        size="lg"
                        onClick={() => setShowBookingCalendar(true)}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:shadow-lg flex-1"
                      >
                        Book Now
                      </Button>
                      <Button 
                        size="lg"
                        variant="outline"
                        onClick={() => setShowContactForm(true)}
                        className="flex-1"
                      >
                        Contact
                      </Button>
                    </div>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Button size="lg" variant="outline" className="transition-all duration-200 hover:shadow-md">
                      View Availability
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Button 
                      size="lg"
                      variant="outline"
                      onClick={() => onNavigate('onboarding')}
                      className="border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-300 dark:hover:bg-green-950/20 transition-all duration-200 hover:shadow-md"
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  </motion.div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Award className="h-5 w-5 text-primary mr-1" />
                    <span className="text-xl font-bold">8</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Years Experience</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Users className="h-5 w-5 text-primary mr-1" />
                    <span className="text-xl font-bold">450+</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Happy Clients</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Clock className="h-5 w-5 text-primary mr-1" />
                    <span className="text-xl font-bold">&lt; 2 hours</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Response Time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Banner */}
      <AnimatePresence>
        {showSuccessBanner && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              duration: 0.4 
            }}
            className="bg-green-50 dark:bg-green-950/20 border-b border-green-200 dark:border-green-800"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <motion.div 
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 500, 
                      damping: 15,
                      delay: 0.1 
                    }}
                  >
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </motion.div>
                  <div>
                    <motion.p 
                      className="text-sm font-medium text-green-800 dark:text-green-200"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                    >
                      Profile created successfully!
                    </motion.p>
                    <motion.p 
                      className="text-xs text-green-600 dark:text-green-400"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.3 }}
                    >
                      Your portfolio is now live and ready to receive bookings.
                    </motion.p>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.2 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSuccessBanner(false)}
                    className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200 transition-colors duration-200"
                  >
                    ✕
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="space-y-8">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <Tabs defaultValue="portfolio" className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-4">
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="space-y-8">
            {/* Portfolio Filters */}
            <div className="flex flex-wrap gap-2 justify-center">
              {portfolioCategories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="text-xs"
                >
                  {category.name}
                </Button>
              ))}
            </div>

            {/* Portfolio Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPortfolio.map((item) => (
                <Card key={item.id} className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.title}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <p className="text-white font-medium">{item.title}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="about" className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">About Me</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {photographer.bio}
                </p>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Awards & Recognition</h4>
                    <div className="space-y-1">
                      {photographer.awards?.map((award, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Award className="h-4 w-4 text-primary" />
                          <span className="text-sm">{award}</span>
                        </div>
                      )) || (
                        <p className="text-sm text-muted-foreground">No awards listed</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Connect</h4>
                    <div className="flex flex-wrap gap-4">
                      {photographer.website && (
                        <a href="#" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
                          <Globe className="h-4 w-4" />
                          <span className="text-sm">{photographer.website}</span>
                        </a>
                      )}
                      {photographer.instagram && (
                        <a href="#" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
                          <Instagram className="h-4 w-4" />
                          <span className="text-sm">{photographer.instagram}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <div className="grid gap-6">
              {photographer.services.map((service, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                        <p className="text-muted-foreground mb-3">{service.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{service.duration}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Camera className="h-4 w-4 text-muted-foreground" />
                            <span>{service.deliverables}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary mb-2">{service.price}</p>
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => setShowBookingCalendar(true)}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 flex-1"
                          >
                            Book Now
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => setShowContactForm(true)}
                            className="flex-1"
                          >
                            Contact
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Star className="h-6 w-6 text-yellow-400 fill-current" />
                <span className="text-3xl font-bold">{photographer.rating}</span>
              </div>
              <p className="text-muted-foreground">Based on {photographer.reviews} reviews</p>
            </div>

            <div className="space-y-6">
              {photographer.testimonials?.map((testimonial, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                        <span className="font-semibold text-sm">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">{testimonial.name}</h4>
                            <p className="text-sm text-muted-foreground">{testimonial.event}</p>
                          </div>
                          <div className="flex items-center space-x-1">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-muted-foreground">{testimonial.comment}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )) || (
                <Card>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground text-center">No testimonials available yet</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
        )}
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Contact {photographer.businessName}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Your Name</label>
                  <Input placeholder="Enter your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input type="email" placeholder="your.email@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Event Date</label>
                  <Input type="date" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <Textarea 
                    placeholder="Tell us about your event and photography needs..." 
                    rows={4}
                  />
                </div>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowContactForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => setShowContactForm(false)}
                  >
                    Send Message
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Booking Calendar Modal */}
      {showBookingCalendar && photographer && (
        <BookingCalendar
          photographerId={photographer.id}
          photographerName={photographer.businessName}
          photographerLocation={photographer.location}
          photographerPhone={photographer.phone || ''}
          photographerEmail={photographer.email || ''}
          onBookingSubmit={handleBookingSubmit}
          onClose={() => setShowBookingCalendar(false)}
        />
      )}

      {/* Availability Manager Modal */}
      {showAvailabilityManager && photographer && (
        <AvailabilityManager
          photographerId={photographer.id}
          onClose={() => setShowAvailabilityManager(false)}
        />
      )}

      {/* Booking Manager Modal */}
      {showBookingManager && photographer && (
        <BookingManager
          photographerId={photographer.id}
          onClose={() => setShowBookingManager(false)}
        />
      )}
    </div>
  );
}