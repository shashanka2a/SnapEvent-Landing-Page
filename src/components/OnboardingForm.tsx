"use client";

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Camera, CheckCircle, Upload, MapPin, User, Briefcase, DollarSign } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Progress } from './ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { photographersAPI } from '../lib/api';

interface OnboardingFormProps {
  onNavigate: (page: 'landing' | 'onboarding' | 'portfolio', photographerId?: string) => void;
  isEditMode?: boolean;
}

export function OnboardingForm({ onNavigate, isEditMode = false }: OnboardingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    profilePicture: null as File | null,
    
    // Professional Info
    experience: '',
    specialties: [] as string[],
    equipment: '',
    website: '',
    
    // Services & Pricing
    services: [] as string[],
    priceRange: '',
    availability: '',
    
    // Portfolio
    portfolioDescription: '',
    instagramHandle: '',
    workSamples: [] as File[]
  });

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const specialtyOptions = [
    'Wedding Photography', 'Portrait Photography', 'Event Photography',
    'Corporate Photography', 'Fashion Photography', 'Landscape Photography',
    'Street Photography', 'Product Photography', 'Food Photography'
  ];

  const serviceOptions = [
    'Photo Shoots', 'Event Coverage', 'Post-Processing', 'Consultation',
    'Album Design', 'Prints & Products', 'Video Services', 'Drone Photography'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      setFormData(prev => ({ ...prev, profilePicture: file }));
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Create photographer profile data
      const photographerData = {
        userId: 'temp-user-id', // In real app, this would come from auth context
        businessName: `${formData.firstName} ${formData.lastName} Photography`,
        title: formData.specialties.join(' & ') || 'Professional Photographer',
        location: formData.location,
        bio: formData.portfolioDescription || 'Professional photographer passionate about capturing special moments.',
        specialties: formData.specialties,
        services: formData.services.map(service => ({
          name: service,
          description: `Professional ${service.toLowerCase()} services`,
          price: formData.priceRange || 'Contact for pricing',
          duration: 'Varies',
          deliverables: 'High-quality edited photos'
        })),
        portfolio: [] // Would be populated with uploaded images
      };

      if (isEditMode) {
        // Update existing photographer profile
        await photographersAPI.update('1', photographerData);
        alert('Profile updated successfully!');
      } else {
        // Create new photographer profile
        const response = await photographersAPI.create(photographerData);
        alert('Profile created successfully! Your portfolio is now live.');
        // Navigate to portfolio page with the new photographer ID
        onNavigate('portfolio', response.id);
        return;
      }
      
      // Navigate to portfolio page
      onNavigate('portfolio', '1');
      
    } catch (error) {
      console.error('Failed to submit profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const stepTransition = {
    type: "tween" as const,
    ease: "easeInOut" as const,
    duration: 0.2
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step-1"
            initial="initial"
            animate="in"
            exit="out"
            variants={stepVariants}
            transition={stepTransition}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <User className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Personal Information</h2>
              <p className="text-muted-foreground">Let's start with the basics</p>
            </div>

            {/* Profile Picture Upload */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-dashed border-muted-foreground/25">
                  {formData.profilePicture ? (
                    <img
                      src={URL.createObjectURL(formData.profilePicture)}
                      alt="Profile preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Camera className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <label
                  htmlFor="profile-picture"
                  className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors"
                >
                  <Upload className="h-4 w-4" />
                </label>
                <input
                  id="profile-picture"
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {formData.profilePicture ? 'Profile picture uploaded' : 'Upload your profile picture'}
              </p>
              <p className="text-xs text-muted-foreground">
                Recommended: Square image, max 5MB
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">First Name</label>
                <Input
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Last Name</label>
                <Input
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="City, State/Country"
                  className="pl-10"
                />
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step-2"
            initial="initial"
            animate="in"
            exit="out"
            variants={stepVariants}
            transition={stepTransition}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <Briefcase className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Professional Background</h2>
              <p className="text-muted-foreground">Tell us about your photography experience</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Years of Experience</label>
              <Select value={formData.experience} onValueChange={(value) => handleInputChange('experience', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Less than 1 year</SelectItem>
                  <SelectItem value="intermediate">1-3 years</SelectItem>
                  <SelectItem value="experienced">3-5 years</SelectItem>
                  <SelectItem value="expert">5+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Photography Specialties</label>
              <p className="text-sm text-muted-foreground mb-3">Select all that apply</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {specialtyOptions.map((specialty) => (
                  <motion.div
                    key={specialty}
                    whileHover={{ scale: 1.02, x: 4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200"
                  >
                    <Checkbox
                      id={specialty}
                      checked={formData.specialties.includes(specialty)}
                      onCheckedChange={() => handleSpecialtyToggle(specialty)}
                    />
                    <label htmlFor={specialty} className="text-sm cursor-pointer flex-1">
                      {specialty}
                    </label>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Camera Equipment</label>
              <Textarea
                value={formData.equipment}
                onChange={(e) => handleInputChange('equipment', e.target.value)}
                placeholder="Describe your camera equipment and gear (e.g., Canon 5D Mark IV, various lenses, lighting equipment...)"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Current Website (Optional)</label>
              <Input
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://yourcurrentwebsite.com"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Your SnapEvent portfolio link will be created instantly upon registration
              </p>
              {formData.firstName && formData.lastName && (
                <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                  <p className="text-muted-foreground">Your portfolio URL will be:</p>
                  <p className="font-mono text-primary">
                    snapevent.com/photographer/{formData.firstName.toLowerCase()}-{formData.lastName.toLowerCase()}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step-3"
            initial="initial"
            animate="in"
            exit="out"
            variants={stepVariants}
            transition={stepTransition}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <DollarSign className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Services & Pricing</h2>
              <p className="text-muted-foreground">What services do you offer?</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Services Offered</label>
              <p className="text-sm text-muted-foreground mb-3">Select all that apply</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {serviceOptions.map((service) => (
                  <motion.div
                    key={service}
                    whileHover={{ scale: 1.02, x: 4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 transition-colors duration-200"
                  >
                    <Checkbox
                      id={service}
                      checked={formData.services.includes(service)}
                      onCheckedChange={() => handleServiceToggle(service)}
                    />
                    <label htmlFor={service} className="text-sm cursor-pointer flex-1">
                      {service}
                    </label>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Starting Price Range</label>
              <Select value={formData.priceRange} onValueChange={(value) => handleInputChange('priceRange', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your starting price range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="budget">Under $500</SelectItem>
                  <SelectItem value="mid">$500 - $1,000</SelectItem>
                  <SelectItem value="premium">$1,000 - $2,500</SelectItem>
                  <SelectItem value="luxury">$2,500+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Availability</label>
              <Select value={formData.availability} onValueChange={(value) => handleInputChange('availability', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="How often are you available for shoots?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekends">Weekends only</SelectItem>
                  <SelectItem value="flexible">Flexible schedule</SelectItem>
                  <SelectItem value="fulltime">Full-time availability</SelectItem>
                  <SelectItem value="limited">Limited availability</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step-4"
            initial="initial"
            animate="in"
            exit="out"
            variants={stepVariants}
            transition={stepTransition}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <Camera className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Portfolio & Social Media</h2>
              <p className="text-muted-foreground">Showcase your work</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Portfolio Description</label>
              <Textarea
                value={formData.portfolioDescription}
                onChange={(e) => handleInputChange('portfolioDescription', e.target.value)}
                placeholder="Describe your photography style and what makes your work unique..."
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Instagram Handle (Optional)</label>
              <Input
                value={formData.instagramHandle}
                onChange={(e) => handleInputChange('instagramHandle', e.target.value)}
                placeholder="@yourinstagram"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Upload Work Samples</label>
              <p className="text-sm text-muted-foreground mb-3">
                Upload 3-5 of your best photos to showcase your style
              </p>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">Drag and drop files here, or click to browse</p>
                <p className="text-xs text-muted-foreground">Supported formats: JPG, PNG (Max 10MB each)</p>
                <Button variant="outline" className="mt-4">
                  Choose Files
                </Button>
              </div>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            key="step-5"
            initial="initial"
            animate="in"
            exit="out"
            variants={stepVariants}
            transition={stepTransition}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Review & Submit</h2>
              <p className="text-muted-foreground">Please review your information before submitting</p>
            </div>

              <div className="bg-muted/20 rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Contact Information</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>Phone:</strong> {formData.phone}</p>
                    <p><strong>Location:</strong> {formData.location}</p>
                    <p><strong>Profile Picture:</strong> {formData.profilePicture ? 'Uploaded' : 'Not provided'}</p>
                  </div>
                </div>

              <div>
                <h3 className="font-semibold mb-2">Experience & Specialties</h3>
                <p className="text-sm text-muted-foreground">
                  {formData.experience} experience • {formData.specialties.join(', ')}
                </p>
              </div>

                <div>
                  <h3 className="font-semibold mb-2">Services & Pricing</h3>
                  <p className="text-sm text-muted-foreground">
                    Starting from {formData.priceRange} • {formData.availability}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Portfolio Information</h3>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p><strong>Your SnapEvent Portfolio:</strong></p>
                    <p className="font-mono text-primary bg-muted/50 p-2 rounded">
                      snapevent.com/photographer/{formData.firstName.toLowerCase()}-{formData.lastName.toLowerCase()}
                    </p>
                    {formData.website && (
                      <p><strong>Current Website:</strong> {formData.website}</p>
                    )}
                  </div>
                </div>
              </div>

            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Instant Registration</h4>
              <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                <li>• Your profile will be created instantly upon submission</li>
                <li>• Your SnapEvent portfolio link will be available immediately</li>
                <li>• Your profile will go live on SnapEvent right away</li>
                <li>• Start receiving booking requests from clients instantly</li>
                <li>• Welcome to the SnapEvent community!</li>
              </ul>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Camera className="h-8 w-8 text-primary" />
              <span className="text-xl font-semibold">SnapEvent</span>
            </div>
            <Button 
              variant="ghost" 
              onClick={() => onNavigate('landing')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
          </div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-2 bg-primary rounded-full"
          />
        </div>
      </div>

      {/* Form Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-12">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center space-x-2 transition-all duration-200 hover:shadow-md"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>
            </motion.div>

            {currentStep === totalSteps ? (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center space-x-2 transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full"
                      />
                      <span>Creating Profile...</span>
                    </>
                  ) : (
                    <>
                      <span>{isEditMode ? 'Update Profile' : 'Create Profile Instantly'}</span>
                      <CheckCircle className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  onClick={nextStep}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center space-x-2 transition-all duration-200 hover:shadow-lg"
                >
                  <span>Next</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}