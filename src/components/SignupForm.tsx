"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, ArrowRight, Eye, EyeOff, User, Mail, Phone, Lock } from 'lucide-react';

interface SignupFormProps {
  onSignupSuccess: () => void;
  onBack: () => void;
}

export function SignupForm({ onSignupSuccess, onBack }: SignupFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (error) setError('');
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Real-time validation feedback
    validateField(field, value);
  };

  const validateField = (field: string, value: string) => {
    let fieldError = '';
    
    switch (field) {
      case 'firstName':
        if (value.trim() && value.trim().length < 2) {
          fieldError = 'Must be at least 2 characters';
        } else if (value.trim() && !/^[a-zA-Z\s]+$/.test(value.trim())) {
          fieldError = 'Only letters and spaces allowed';
        }
        break;
      case 'lastName':
        if (value.trim() && value.trim().length < 2) {
          fieldError = 'Must be at least 2 characters';
        } else if (value.trim() && !/^[a-zA-Z\s]+$/.test(value.trim())) {
          fieldError = 'Only letters and spaces allowed';
        }
        break;
      case 'email':
        if (value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          fieldError = 'Invalid email format';
        }
        break;
      case 'phone':
        const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
        if (value.trim() && (!/^\+?[1-9]\d{1,14}$/.test(cleanPhone) || cleanPhone.length < 10)) {
          fieldError = 'Invalid phone number';
        }
        break;
      case 'password':
        if (value && value.length < 8) {
          fieldError = 'Must be at least 8 characters';
        } else if (value && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          fieldError = 'Must contain uppercase, lowercase, and number';
        }
        break;
      case 'confirmPassword':
        if (value && value !== formData.password) {
          fieldError = 'Passwords do not match';
        }
        break;
    }
    
    setFieldErrors(prev => ({ ...prev, [field]: fieldError }));
  };

  const validateForm = () => {
    // Clear any existing errors
    setError('');
    
    // First Name validation
    if (!formData.firstName.trim()) {
      setError('First name is required');
      return false;
    }
    if (formData.firstName.trim().length < 2) {
      setError('First name must be at least 2 characters');
      return false;
    }
    if (!/^[a-zA-Z\s]+$/.test(formData.firstName.trim())) {
      setError('First name can only contain letters and spaces');
      return false;
    }
    
    // Last Name validation
    if (!formData.lastName.trim()) {
      setError('Last name is required');
      return false;
    }
    if (formData.lastName.trim().length < 2) {
      setError('Last name must be at least 2 characters');
      return false;
    }
    if (!/^[a-zA-Z\s]+$/.test(formData.lastName.trim())) {
      setError('Last name can only contain letters and spaces');
      return false;
    }
    
    // Email validation
    if (!formData.email.trim()) {
      setError('Email address is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError('Please enter a valid email address');
      return false;
    }
    
    // Phone validation
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format
    const cleanPhone = formData.phone.replace(/[\s\-\(\)]/g, '');
    if (!phoneRegex.test(cleanPhone) && cleanPhone.length < 10) {
      setError('Please enter a valid phone number (minimum 10 digits)');
      return false;
    }
    
    // Password validation
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      setError('Password must contain at least one lowercase letter, one uppercase letter, and one number');
      return false;
    }
    
    // Confirm Password validation
    if (!formData.confirmPassword) {
      setError('Please confirm your password');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      // Focus on the first input with an error
      const firstInput = document.querySelector('input:invalid') as HTMLInputElement;
      if (firstInput) {
        firstInput.focus();
      }
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Prepare clean data for submission
      const cleanPhone = formData.phone.replace(/[\s\-\(\)]/g, '');
      
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: cleanPhone,
          password: formData.password,
          role: 'CLIENT' // Default role, will be updated after user type selection
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (response.status === 400 && data.error?.includes('email')) {
          throw new Error('This email address is already registered. Please use a different email or try signing in.');
        }
        throw new Error(data.error || 'Failed to create account. Please try again.');
      }

      // Success - show success state briefly before proceeding
      setIsSuccess(true);
      
      // Clear form data for security
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
      });
      
      // Show success message briefly, then proceed
      setTimeout(() => {
        onSignupSuccess();
      }, 1500);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      
      // Log error for debugging (in development)
      if (process.env.NODE_ENV === 'development') {
        console.error('Signup error:', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" as const }
  };

  const scaleOnHover = {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { type: "spring" as const, stiffness: 400, damping: 17 }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <motion.div 
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Card className="border-border">
          <CardHeader className="text-center">
            <motion.div
              className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <User className="h-6 w-6 text-primary" />
            </motion.div>
            <CardTitle className="text-2xl font-bold">Create Your Account</CardTitle>
            <p className="text-muted-foreground">
              Join SnapEvent to get started
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Success Message */}
              {isSuccess && (
                <motion.div 
                  className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md text-green-800 dark:text-green-200 text-sm flex items-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="font-medium">Account created successfully!</div>
                    <div className="text-sm opacity-90">Redirecting to user type selection...</div>
                  </div>
                </motion.div>
              )}
              
              {/* Error Message */}
              {error && (
                <motion.div 
                  className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {error}
                </motion.div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      placeholder="John"
                      className={`pl-10 ${fieldErrors.firstName ? 'border-red-500 focus:border-red-500' : ''}`}
                      required
                    />
                  </div>
                  {fieldErrors.firstName && (
                    <p className="text-xs text-red-500 mt-1">{fieldErrors.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      placeholder="Doe"
                      className={`pl-10 ${fieldErrors.lastName ? 'border-red-500 focus:border-red-500' : ''}`}
                      required
                    />
                  </div>
                  {fieldErrors.lastName && (
                    <p className="text-xs text-red-500 mt-1">{fieldErrors.lastName}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="john@example.com"
                    className={`pl-10 ${fieldErrors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                    required
                  />
                </div>
                {fieldErrors.email && (
                  <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+91 98765 43210"
                    className={`pl-10 ${fieldErrors.phone ? 'border-red-500 focus:border-red-500' : ''}`}
                    required
                  />
                </div>
                {fieldErrors.phone ? (
                  <p className="text-xs text-red-500 mt-1">{fieldErrors.phone}</p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter your phone number with country code
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Create a strong password"
                    className={`pl-10 pr-10 ${fieldErrors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {fieldErrors.password ? (
                  <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1">
                    Must be at least 8 characters with uppercase, lowercase, and number
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirm your password"
                    className={`pl-10 pr-10 ${fieldErrors.confirmPassword ? 'border-red-500 focus:border-red-500' : ''}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">{fieldErrors.confirmPassword}</p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <motion.div {...scaleOnHover} className="flex-1">
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={onBack}
                    className="w-full"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                </motion.div>
                <motion.div {...scaleOnHover} className="flex-1">
                  <Button 
                    type="submit"
                    disabled={isLoading || isSuccess}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <motion.div
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Creating Account...
                      </>
                    ) : isSuccess ? (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Account Created!
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
