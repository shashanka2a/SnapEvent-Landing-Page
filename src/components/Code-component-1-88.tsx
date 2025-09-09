import React, { useState } from 'react';
import { ArrowLeft, Star, MapPin, Calendar, Camera, Phone, Mail, Instagram, Globe, Award, Users, Clock, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PortfolioPageProps {
  photographerId: string;
  onNavigate: (page: 'landing' | 'onboarding' | 'portfolio') => void;
}

export function PortfolioPage({ photographerId, onNavigate }: PortfolioPageProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showContactForm, setShowContactForm] = useState(false);

  // Mock photographer data - in real app this would come from props or API
  const photographer = {
    id: photographerId,
    name: 'Sarah Chen',
    title: 'Wedding & Portrait Photographer',
    location: 'San Francisco, CA',
    rating: 4.9,
    reviews: 127,
    yearsExperience: 8,
    totalClients: 450,
    responseTime: '< 2 hours',
    bio: 'Passionate photographer specializing in capturing authentic moments and emotions. With over 8 years of experience, I focus on creating timeless images that tell your unique story. My approach combines photojournalistic style with artistic vision to deliver stunning results.',
    image: 'https://images.unsplash.com/photo-1643968612613-fd411aecd1fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwaG90b2dyYXBoZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTczMjkzODF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    verified: true,
    website: 'sarahchen.photography',
    instagram: '@sarahchenphoto',
    email: 'hello@sarahchen.photography',
    phone: '+1 (415) 555-0123',
    specialties: ['Wedding Photography', 'Portrait Photography', 'Engagement Sessions'],
    awards: ['Best Wedding Photographer 2023', 'Portrait Masters Gold Award'],
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
      },
      {
        name: 'Engagement Session',
        description: 'Romantic couple photography session',
        price: 'From $650',
        duration: '1.5 hours',
        deliverables: '40-60 edited photos, online gallery'
      }
    ],
    portfolio: [
      {
        id: 1,
        image: 'https://images.unsplash.com/photo-1730116309939-10a01fdf1edb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwcGhvdG9ncmFwaHklMjBjb3VwbGV8ZW58MXx8fHwxNzU3Mzk0MjE1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        category: 'wedding',
        title: 'Golden Hour Wedding'
      },
      {
        id: 2,
        image: 'https://images.unsplash.com/photo-1586796676778-2c50b6bc3937?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHBob3RvZ3JhcGhlciUyMHN0dWRpb3xlbnwxfHx8fDE3NTc0MTU1Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        category: 'portrait',
        title: 'Studio Portrait Session'
      },
      {
        id: 3,
        image: 'https://images.unsplash.com/photo-1502514463321-f81bd30cd473?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW1lcmElMjBwaG90b2dyYXBoZXIlMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzU3NDE1NTM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        category: 'engagement',
        title: 'Outdoor Engagement'
      },
      {
        id: 4,
        image: 'https://images.unsplash.com/photo-1656918566254-957a997dbd7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaXJ0aGRheSUyMHBhcnR5JTIwcGhvdG9ncmFwaHl8ZW58MXx8fHwxNzU3NDE1NTM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        category: 'event',
        title: 'Birthday Celebration'
      },
      {
        id: 5,
        image: 'https://images.unsplash.com/photo-1705544363562-cdf94dd458cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3Jwb3JhdGUlMjBldmVudCUyMHBob3RvZ3JhcGh5fGVufDF8fHx8MTc1NzM5Mzk5OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        category: 'corporate',
        title: 'Corporate Event'
      },
      {
        id: 6,
        image: 'https://images.unsplash.com/photo-1730116309939-10a01fdf1edb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwcGhvdG9ncmFwaHklMjBjb3VwbGV8ZW58MXx8fHwxNzU3Mzk0MjE1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        category: 'wedding',
        title: 'Ceremony Moments'
      }
    ],
    testimonials: [
      {
        name: 'Emily & David',
        event: 'Wedding Photography',
        rating: 5,
        comment: 'Sarah captured our wedding day perfectly! Her attention to detail and ability to capture candid moments made our photos absolutely stunning. Highly recommended!'
      },
      {
        name: 'Jessica Miller',
        event: 'Family Portrait',
        rating: 5,
        comment: 'Professional, patient, and incredibly talented. Sarah made our family session fun and comfortable, and the results exceeded our expectations.'
      },
      {
        name: 'Mark Thompson',
        event: 'Corporate Event',
        rating: 5,
        comment: 'Sarah delivered exceptional photos for our company event. Professional, punctual, and the photos perfectly captured the atmosphere of our celebration.'
      }
    ]
  };

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
                alt={photographer.name}
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
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{photographer.name}</h1>
                  <p className="text-xl text-muted-foreground mb-4">{photographer.title}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{photographer.location}</span>
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
                  <Button 
                    size="lg"
                    onClick={() => setShowContactForm(true)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Contact Photographer
                  </Button>
                  <Button size="lg" variant="outline">
                    View Availability
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Award className="h-5 w-5 text-primary mr-1" />
                    <span className="text-xl font-bold">{photographer.yearsExperience}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Years Experience</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Users className="h-5 w-5 text-primary mr-1" />
                    <span className="text-xl font-bold">{photographer.totalClients}+</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Happy Clients</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Clock className="h-5 w-5 text-primary mr-1" />
                    <span className="text-xl font-bold">{photographer.responseTime}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Response Time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
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
                      {photographer.awards.map((award, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Award className="h-4 w-4 text-primary" />
                          <span className="text-sm">{award}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Connect</h4>
                    <div className="flex flex-wrap gap-4">
                      <a href="#" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
                        <Globe className="h-4 w-4" />
                        <span className="text-sm">{photographer.website}</span>
                      </a>
                      <a href="#" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
                        <Instagram className="h-4 w-4" />
                        <span className="text-sm">{photographer.instagram}</span>
                      </a>
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
                        <Button 
                          onClick={() => setShowContactForm(true)}
                          className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          Book Now
                        </Button>
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
              {photographer.testimonials.map((testimonial, index) => (
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
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Contact {photographer.name}</h3>
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
    </div>
  );
}