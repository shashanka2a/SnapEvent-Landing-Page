"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Camera, CheckCircle, Upload, MapPin, User, Briefcase, DollarSign } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Progress } from './ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { photographersAPI } from '../lib/api';

interface FormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  location: string;
  cameraManufacturer: string;
  cameraModel: string;
  lenses: string;
  photographerType: string;
  experience: string;
  photoTypes: string[];
  otherPhotoText: string;
  additionalServices: string[];
  otherSoftwareText: string;
  otherHardwareText: string;
  samplePhotos: string;
  startingPrice: string;
  language: string;
  rankedPhotoTypes: string;
  rankedAdditionalServices: string;
  // Legacy fields for compatibility
  firstName: string;
  lastName: string;
  phone: string;
  profilePicture: File | null;
  specialties: string[];
  equipment: string;
  website: string;
  services: string[];
  priceRange: string;
  availability: string;
  portfolioDescription: string;
  instagramHandle: string;
  workSamples: File[];
}

interface OnboardingFormProps {
  onNavigate: (page: 'landing' | 'onboarding' | 'portfolio', photographerId?: string) => void;
  isEditMode?: boolean;
}

export function OnboardingForm({ onNavigate, isEditMode = false }: OnboardingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentLang, setCurrentLang] = useState<'en' | 'te'>('te');
  const [priceError, setPriceError] = useState('');
  const [showOtherPhotoText, setShowOtherPhotoText] = useState(false);
  const [showOtherSoftwareText, setShowOtherSoftwareText] = useState(false);
  const [showOtherHardwareText, setShowOtherHardwareText] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    // Bilingual form fields
    fullName: '',
    phoneNumber: '',
    email: '',
    location: '',
    cameraManufacturer: '',
    cameraModel: '',
    lenses: '',
    photographerType: '',
    experience: '',
    photoTypes: [],
    otherPhotoText: '',
    additionalServices: [],
    otherSoftwareText: '',
    otherHardwareText: '',
    samplePhotos: '',
    startingPrice: '',
    language: '',
    rankedPhotoTypes: '',
    rankedAdditionalServices: '',
    // Legacy compatibility fields
    firstName: '',
    lastName: '',
    phone: '',
    profilePicture: null,
    specialties: [],
    equipment: '',
    website: '',
    services: [],
    priceRange: '',
    availability: '',
    portfolioDescription: '',
    instagramHandle: '',
    workSamples: []
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const toggleLanguage = () => {
    setCurrentLang(currentLang === 'en' ? 'te' : 'en');
  };

  const totalSteps = 6; // Updated to include bilingual form fields
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

  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: FormData) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'photoTypes' | 'additionalServices') => {
    const { value, checked, id } = e.target;
    
    setFormData((prev: FormData) => {
      const currentArray = prev[fieldName];
      let newArray;
      
      if (checked) {
        // Limit to 2 selections
        if (currentArray.length < 2) {
          newArray = [...currentArray, value];
        } else {
          return prev; // Don't add if already 2 selected
        }
      } else {
        newArray = currentArray.filter((item: string) => item !== value);
      }
      
      // Update ranked list
      setTimeout(() => updateRankedList(fieldName, newArray), 0);
      
      return { ...prev, [fieldName]: newArray };
    });

    // Handle 'Other' text field visibility
    if (value === 'Other' && fieldName === 'photoTypes') {
      setShowOtherPhotoText(checked);
      if (!checked) setFormData((prev: FormData) => ({ ...prev, otherPhotoText: '' }));
    } else if (id === 'otherSoftware') {
      setShowOtherSoftwareText(checked);
      if (!checked) setFormData((prev: FormData) => ({ ...prev, otherSoftwareText: '' }));
    } else if (id === 'otherHardware') {
      setShowOtherHardwareText(checked);
      if (!checked) setFormData((prev: FormData) => ({ ...prev, otherHardwareText: '' }));
    }
  };

  const getPlaceholder = (key: string): string => {
    const placeholders: Record<string, {en: string, te: string}> = {
      lenses: {
        en: "e.g., Canon 24-70mm f/2.8, Sigma 50mm f/1.4 Art",
        te: "ఉదా., కెనాన్ 24-70మిమీ f/2.8, సిగ్మా 50మిమీ f/1.4 ఆర్ట్"
      },
      otherPhotoText: {
        en: "e.g., Corporate, Events, Birthday",
        te: "ఉదా., కార్పొరేట్, ఈవెంట్స్, పుట్టినరోజు"
      },
      otherSoftwareText: {
        en: "e.g., Photo Editing, Logo Designing",
        te: "ఉదా., ఫోటో ఎడిటింగ్, లోగో డిజైనింగ్"
      },
      otherHardwareText: {
        en: "e.g., Special Cameras, Green Screen",
        te: "ఉదా., ప్రత్యేక కెమెరాలు, గ్రీన్ స్క్రీన్"
      },
      samplePhotos: {
        en: "Paste your Google Drive link here",
        te: "Google Drive లింక్‌ను ఇక్కడ అతికించండి"
      },
      startingPrice: {
        en: "₹20,000",
        te: "₹20,000"
      }
    };
    return placeholders[key]?.[currentLang as keyof typeof placeholders[string]] || '';
  };

  const updateRankedList = (fieldName: 'photoTypes' | 'additionalServices', checkedValues: string[]) => {
    const rankedList: string[] = [];
    checkedValues.forEach((value, index) => {
      let displayValue = value;
      if (value === 'Other' && fieldName === 'photoTypes' && formData.otherPhotoText.trim() !== '') {
        displayValue = formData.otherPhotoText.trim();
      } else if (value === 'Other' && fieldName === 'additionalServices' && formData.otherSoftwareText.trim() !== '') {
        displayValue = formData.otherSoftwareText.trim();
      } else if (value === 'Other Hardware' && fieldName === 'additionalServices' && formData.otherHardwareText.trim() !== '') {
        displayValue = formData.otherHardwareText.trim();
      }
      rankedList.push(`${index + 1}. ${displayValue}`);
    });
    
    const rankedFieldName = fieldName === 'photoTypes' ? 'rankedPhotoTypes' : 'rankedAdditionalServices';
    setFormData((prev: FormData) => ({ ...prev, [rankedFieldName]: rankedList.join(', ') }));
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

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Price validation for bilingual form
    const priceValue = formData.startingPrice.replace(/[^0-9]/g, '');
    const price = parseInt(priceValue, 10);
    
    if (isNaN(price) || price < 20000) {
      setPriceError(currentLang === 'te' 
        ? 'కనీసం ప్రారంభ ధర ₹20,000 లేదా అంతకంటే ఎక్కువ ఉండాలి.' 
        : 'Minimum starting price must be ₹20,000 or more.');
      return;
    }
    
    setPriceError('');
    setIsSubmitting(true);
    
    try {
      // Use bilingual /api/submit for the detailed form
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Create photographer profile data from the submitted bilingual form
        const newPhotographerId = `photographer-${Date.now()}`; // Generate unique ID
        
        // Success message
        alert(currentLang === 'te' 
          ? 'మీ వివరాలు విజయవంతంగా సమర్పించబడ్డాయి! మా బృందం త్వరలోనే మిమ్మల్ని సంప్రదిస్తుంది.'
          : 'Your details have been submitted successfully! Your portfolio is now being created.');
        
        // Navigate to portfolio page with success state
        onNavigate('portfolio', newPhotographerId);
        return;
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(currentLang === 'te' 
        ? 'ఫారమ్ సమర్పించడంలో విఫలమైంది. దయచేసి మళ్లీ ప్రయత్నించండి.'
        : 'Failed to submit form. Please try again.');
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
              <User className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">
                {currentLang === 'te' ? 'వ్యక్తిగత వివరాలు' : 'Personal Information'}
              </h2>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                {currentLang === 'te' ? 'మూలభూత వివరాలతో ప్రారంభించాలి' : "Let's start with the basics"}
              </p>
            </div>

            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="fullName" className={`block text-sm md:text-base font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {currentLang === 'te' ? 'పూర్తి పేరు' : 'Full Name'}
              </label>
              <Input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleFormInputChange}
                className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-100 border-gray-600' 
                    : 'bg-white text-gray-900 border-gray-300'
                }`}
                required
              />
            </div>

            {/* Phone Number */}
            <div className="form-group">
              <label htmlFor="phoneNumber" className={`block text-sm md:text-base font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {currentLang === 'te' ? 'ఫోన్ నంబర్ (వాట్సాప్ ఉత్తమం)' : 'Phone Number (WhatsApp preferred)'}
              </label>
              <Input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleFormInputChange}
                className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-100 border-gray-600' 
                    : 'bg-white text-gray-900 border-gray-300'
                }`}
                required
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email" className={`block text-sm md:text-base font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {currentLang === 'te' ? 'ఈమెయిల్ చిరునామా' : 'Email Address'}
              </label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleFormInputChange}
                className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-100 border-gray-600' 
                    : 'bg-white text-gray-900 border-gray-300'
                }`}
                required
              />
            </div>

            {/* Location */}
            <div className="form-group">
              <label htmlFor="location" className={`block text-sm md:text-base font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {currentLang === 'te' ? 'ప్రాంతం (గ్రామం/పట్టణం, జిల్లా, రాష్ట్రం)' : 'Location (Village/Town, District, State)'}
              </label>
              <div className="relative">
                <MapPin className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <Input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleFormInputChange}
                  className={`mt-1 block w-full pl-10 px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 text-gray-100 border-gray-600' 
                      : 'bg-white text-gray-900 border-gray-300'
                  }`}
                  required
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
              <DollarSign className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">
                {currentLang === 'te' ? 'ప్రారంభ ధర మరియు సేవలు' : 'Pricing & Sample Work'}
              </h2>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                {currentLang === 'te' ? 'మీ వర్క్ సాంపల్ మరియు ప్రైసింగ్' : 'Your portfolio and pricing information'}
              </p>
            </div>

            {/* Sample Photos */}
            <div className="form-group">
              <label htmlFor="samplePhotos" className={`block text-sm md:text-base font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {currentLang === 'te' ? '3–5 నమూనా ఆల్బమ్‌లు అప్‌లోడ్ చేయండి (Google Drive లింక్)' : 'Upload 3–5 Sample Albums (Google Drive link)'}
              </label>
              <Textarea
                id="samplePhotos"
                name="samplePhotos"
                rows={4}
                value={formData.samplePhotos}
                onChange={handleFormInputChange}
                placeholder={getPlaceholder('samplePhotos')}
                className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-100 border-gray-600' 
                    : 'bg-white text-gray-900 border-gray-300'
                }`}
                required
              />
            </div>

            {/* Starting Price with ₹20,000 validation */}
            <div className="form-group">
              <label htmlFor="startingPrice" className={`block text-sm md:text-base font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {currentLang === 'te' ? 'ప్రారంభ ధర (కనీసం ₹20,000 రోజుకు – ఫోటోలు + వీడియోలు)' : 'Starting Price (Min. ₹20,000 Per Day – Photos + Videos)'}
              </label>
              <Input
                type="text"
                id="startingPrice"
                name="startingPrice"
                value={formData.startingPrice}
                onChange={handleFormInputChange}
                placeholder={getPlaceholder('startingPrice')}
                className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-100 border-gray-600' 
                    : 'bg-white text-gray-900 border-gray-300'
                }`}
                required
              />
              {priceError && (
                <div className="text-red-400 text-sm mt-1">
                  {priceError}
                </div>
              )}
            </div>

            {/* Language Preference */}
            <div className="form-group">
              <label htmlFor="language" className={`block text-sm md:text-base font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {currentLang === 'te' ? 'సంవాదానికి ఇష్టమైన భాష' : 'Preferred Language for Communication'}
              </label>
              <Select value={formData.language} onValueChange={(value) => handleInputChange('language', value)}>
                <SelectTrigger className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-100 border-gray-600' 
                    : 'bg-white text-gray-900 border-gray-300'
                }`}>
                  <SelectValue placeholder={
                    currentLang === 'te' ? 'ఒక ఎంపికను ఎంచుకోండి' : 'Select an option'
                  } />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Telugu">Telugu</SelectItem>
                  <SelectItem value="Hindi">Hindi</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-900 text-gray-100' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Header */}
      <div className={`border-b transition-colors duration-300 backdrop-blur-sm ${
        isDarkMode 
          ? 'border-gray-700 bg-gray-800/50' 
          : 'border-gray-200 bg-white/50'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Camera className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-semibold">
                {currentLang === 'te' ? 'స్నాప్‌ఈవెంట్' : 'SnapEvent'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {currentLang === 'en' ? 'తెలుగు' : 'English'}
              </button>
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg text-sm font-semibold transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {isDarkMode ? '🌙' : '☀️'}
              </button>
              {/* Back Button */}
              <Button 
                variant="ghost" 
                onClick={() => onNavigate('landing')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>{currentLang === 'te' ? 'తిరిగి హోమ్‌కు' : 'Back to Home'}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className={`transition-colors duration-300 border-b ${
        isDarkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              {currentLang === 'te' 
                ? `అడుగు ${currentStep} / ${totalSteps}` 
                : `Step ${currentStep} of ${totalSteps}`
              }
            </span>
            <span className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {Math.round(progress)}% {currentLang === 'te' ? 'పూర్తి' : 'Complete'}
            </span>
          </div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-2 bg-blue-500 rounded-full"
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
                <span>{currentLang === 'te' ? 'ముందుది' : 'Previous'}</span>
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
                  className="bg-blue-600 text-white hover:bg-blue-700 flex items-center space-x-2 transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>{currentLang === 'te' ? 'సమర్పిస్తోంది...' : 'Submitting...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{currentLang === 'te' ? 'ఫారమ్ సమర్పించండి' : 'Submit Form'}</span>
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
                  className="bg-blue-600 text-white hover:bg-blue-700 flex items-center space-x-2 transition-all duration-200 hover:shadow-lg"
                >
                  <span>{currentLang === 'te' ? 'తరువాత' : 'Next'}</span>
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