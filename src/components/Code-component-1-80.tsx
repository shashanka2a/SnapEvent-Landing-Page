import React, { useState } from 'react';
import { Search, MapPin, Users, Camera, Star, ArrowRight, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LandingPageProps {
  onNavigate: (page: 'landing' | 'onboarding' | 'portfolio') => void;
  onPhotographerSelect: (id: string) => void;
}

export function LandingPage({ onNavigate, onPhotographerSelect }: LandingPageProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Camera className="h-8 w-8 text-primary" />
              <span className="text-xl font-semibold">SnapEvent</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Find Photographers</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
              <Button variant="ghost" size="sm">Sign In</Button>
              <Button 
                size="sm" 
                onClick={() => onNavigate('onboarding')}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Join as Photographer
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-border pt-4">
              <div className="flex flex-col space-y-3">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Find Photographers</a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
                <Button variant="ghost" size="sm" className="justify-start">Sign In</Button>
                <Button 
                  size="sm" 
                  onClick={() => onNavigate('onboarding')}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 justify-start"
                >
                  Join as Photographer
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Connect with
            <span className="block text-primary">Professional Photographers</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Find the perfect photographer for your special moments. Browse portfolios, compare prices, and book with confidence.
          </p>

          {/* Search Form */}
          <div className="bg-card border border-border rounded-xl p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Photography type" 
                  className="pl-10 bg-input-background border-0"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Location" 
                  className="pl-10 bg-input-background border-0"
                />
              </div>
              <Select>
                <SelectTrigger className="bg-input-background border-0">
                  <SelectValue placeholder="Event size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small (1-20 people)</SelectItem>
                  <SelectItem value="medium">Medium (21-100 people)</SelectItem>
                  <SelectItem value="large">Large (100+ people)</SelectItem>
                </SelectContent>
              </Select>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Search Photographers
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Browse by Category</h2>
            <Button variant="ghost" className="text-primary hover:text-primary/80">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Card key={index} className="group cursor-pointer hover:shadow-lg transition-all duration-300 bg-card border-border">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <ImageWithFallback
                      src={category.image}
                      alt={category.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-semibold mb-1">{category.name}</h3>
                      <p className="text-sm opacity-90">{category.count}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Photographers */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Trending Photographers</h2>
            <Button variant="ghost" className="text-primary hover:text-primary/80">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingPhotographers.map((photographer) => (
              <Card 
                key={photographer.id} 
                className="group cursor-pointer hover:shadow-lg transition-all duration-300 bg-card border-border"
                onClick={() => onPhotographerSelect(photographer.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <ImageWithFallback
                        src={photographer.image}
                        alt={photographer.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      {photographer.verified && (
                        <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1">
                          <Star className="h-3 w-3 text-primary-foreground fill-current" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold truncate">{photographer.name}</h3>
                        {photographer.verified && (
                          <Badge variant="secondary" className="text-xs">Verified</Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">{photographer.specialty}</p>
                      
                      <div className="flex items-center space-x-1 mb-2">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{photographer.location}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{photographer.rating}</span>
                          <span className="text-xs text-muted-foreground">({photographer.reviews})</span>
                        </div>
                        <span className="text-sm font-medium text-primary">{photographer.price}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to capture your special moments?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied clients who found their perfect photographer through SnapEvent.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Find Photographers
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => onNavigate('onboarding')}
            >
              Join as Photographer
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Camera className="h-6 w-6 text-primary" />
                <span className="text-lg font-semibold">SnapEvent</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Connecting clients with professional photographers worldwide.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">For Clients</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a href="#" className="block hover:text-foreground transition-colors">Find Photographers</a>
                <a href="#" className="block hover:text-foreground transition-colors">How it Works</a>
                <a href="#" className="block hover:text-foreground transition-colors">Pricing</a>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">For Photographers</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a href="#" className="block hover:text-foreground transition-colors">Join SnapEvent</a>
                <a href="#" className="block hover:text-foreground transition-colors">Success Stories</a>
                <a href="#" className="block hover:text-foreground transition-colors">Resources</a>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Support</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a href="#" className="block hover:text-foreground transition-colors">Help Center</a>
                <a href="#" className="block hover:text-foreground transition-colors">Contact Us</a>
                <a href="#" className="block hover:text-foreground transition-colors">Privacy Policy</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2025 SnapEvent. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}