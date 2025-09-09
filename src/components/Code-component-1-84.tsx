import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Camera, CheckCircle, Upload, MapPin, User, Briefcase, DollarSign } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Progress } from './ui/progress';
import { motion } from 'motion/react';

interface OnboardingFormProps {
  onNavigate: (page: 'landing' | 'onboarding' | 'portfolio') => void;
}

export function OnboardingForm({ onNavigate }: OnboardingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    
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

  const handleSubmit = () => {
    // Here you would typically submit to backend
    console.log('Form submitted:', formData);
    // Navigate to a success page or portfolio
    onNavigate('landing');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <User className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Personal Information</h2>
              <p className="text-muted-foreground">Let's start with the basics</p>
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
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
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
                  <div key={specialty} className="flex items-center space-x-2">
                    <Checkbox
                      id={specialty}
                      checked={formData.specialties.includes(specialty)}
                      onCheckedChange={() => handleSpecialtyToggle(specialty)}
                    />
                    <label htmlFor={specialty} className="text-sm cursor-pointer">
                      {specialty}
                    </label>
                  </div>
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
              <label className="block text-sm font-medium mb-2">Website/Portfolio (Optional)</label>
              <Input
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://yourportfolio.com"
              />
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
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
                  <div key={service} className="flex items-center space-x-2">
                    <Checkbox
                      id={service}
                      checked={formData.services.includes(service)}
                      onCheckedChange={() => handleServiceToggle(service)}
                    />
                    <label htmlFor={service} className="text-sm cursor-pointer">
                      {service}
                    </label>
                  </div>
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
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
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
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Review & Submit</h2>
              <p className="text-muted-foreground">Please review your information before submitting</p>
            </div>

            <div className="bg-muted/20 rounded-lg p-6 space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Personal Information</h3>
                <p className="text-sm text-muted-foreground">
                  {formData.firstName} {formData.lastName} • {formData.email} • {formData.location}
                </p>
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
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Next Steps</h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• We'll review your application within 2-3 business days</li>
                <li>• You'll receive an email confirmation once approved</li>
                <li>• Start receiving client inquiries within 24 hours of approval</li>
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
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Form Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-12">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>

            {currentStep === totalSteps ? (
              <Button
                onClick={handleSubmit}
                className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center space-x-2"
              >
                <span>Submit Application</span>
                <CheckCircle className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center space-x-2"
              >
                <span>Next</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}