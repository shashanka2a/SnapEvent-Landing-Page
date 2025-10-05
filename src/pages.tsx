'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
}

export default function Home() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentLang, setCurrentLang] = useState<'en' | 'te'>('te');
  const [formData, setFormData] = useState<FormData>({
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
    rankedAdditionalServices: ''
  });
  const [priceError, setPriceError] = useState('');
  const [showOtherPhotoText, setShowOtherPhotoText] = useState(false);
  const [showOtherSoftwareText, setShowOtherSoftwareText] = useState(false);
  const [showOtherHardwareText, setShowOtherHardwareText] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/success');
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(currentLang === 'te' 
        ? 'ফর্ম জমা দিতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।'
        : 'Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-900 text-gray-100' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="flex items-center justify-center p-4">
        <div className={`w-full max-w-2xl rounded-xl shadow-lg p-6 md:p-10 my-8 transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-gray-800' 
            : 'bg-white'
        }`}>
          {/* Toggles Section */}
          <div className="flex justify-end items-center space-x-2 mb-4">
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
          </div>

          {/* Header Section */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {currentLang === 'te' 
                ? 'స్నాప్‌ఈవెంట్ – ఫోటోగ్రాఫర్ కమ్యూనిటీ ఆన్‌బోర్డింగ్'
                : 'SnapEvent – Photographer Community Onboarding'
              }
            </h1>
            <p className={`leading-relaxed text-sm md:text-base ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <span className="font-semibold">
                {currentLang === 'te' ? '🙏 స్వాగతం!' : '🙏 Welcome!'}
              </span><br />
              {currentLang === 'te' 
                ? 'స్నాప్‌ఈవెంట్ అనేది ఫోటోగ్రాఫర్‌లకు మరింత గుర్తింపు, క్లయింట్లు, మరియు బుకింగ్‌లు పొందడంలో సహాయపడే కొత్త ప్లాట్‌ఫారమ్.'
                : 'SnapEvent is a new platform to help photographers get more visibility, clients, and bookings.'
              }
            </p>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Question 1: Full Name */}
            <div className="form-group">
              <label htmlFor="fullName" className={`block text-sm md:text-base font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {currentLang === 'te' ? 'పూర్తి పేరు' : 'Full Name'}
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-100 border-gray-600' 
                    : 'bg-white text-gray-900 border-gray-300'
                }`}
                required
              />
            </div>

            {/* Question 2: Phone Number */}
            <div className="form-group">
              <label htmlFor="phoneNumber" className={`block text-sm md:text-base font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {currentLang === 'te' ? 'ఫోన్ నంబర్ (వాట్సాప్ ఉత్తమం)' : 'Phone Number (WhatsApp preferred)'}
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-100 border-gray-600' 
                    : 'bg-white text-gray-900 border-gray-300'
                }`}
                required
              />
            </div>

            {/* Question 3: Email */}
            <div className="form-group">
              <label htmlFor="email" className={`block text-sm md:text-base font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {currentLang === 'te' ? 'ఈమెయిల్ చిరునామా' : 'Email Address'}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-100 border-gray-600' 
                    : 'bg-white text-gray-900 border-gray-300'
                }`}
                required
              />
            </div>

            {/* Question 4: Location */}
            <div className="form-group">
              <label htmlFor="location" className={`block text-sm md:text-base font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {currentLang === 'te' ? 'ప్రాంతం (గ్రామం/పట్టణం, జిల్లా, రాష్ట్రం)' : 'Location (Village/Town, District, State)'}
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-100 border-gray-600' 
                    : 'bg-white text-gray-900 border-gray-300'
                }`}
                required
              />
            </div>

            {/* Question 5: Camera Manufacturer */}
            <div className="form-group">
              <label htmlFor="cameraManufacturer" className={`block text-sm md:text-base font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {currentLang === 'te' ? 'కెమెరా తయారీదారు' : 'Camera Manufacturer'}
              </label>
              <select
                id="cameraManufacturer"
                name="cameraManufacturer"
                value={formData.cameraManufacturer}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-100 border-gray-600' 
                    : 'bg-white text-gray-900 border-gray-300'
                }`}
                required
              >
                <option value="" disabled>
                  {currentLang === 'te' ? 'తయారీదారుని ఎంచుకోండి' : 'Select a manufacturer'}
                </option>
                <option value="Canon">Canon</option>
                <option value="Nikon">Nikon</option>
                <option value="Sony">Sony</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Question 6: Camera Model */}
            <div className="form-group">
              <label htmlFor="cameraModel" className={`block text-sm md:text-base font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {currentLang === 'te' ? 'కెమెరా మోడల్' : 'Camera Model'}
              </label>
              <input
                type="text"
                id="cameraModel"
                name="cameraModel"
                value={formData.cameraModel}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-100 border-gray-600' 
                    : 'bg-white text-gray-900 border-gray-300'
                }`}
                required
              />
            </div>

            {/* Question 7: Lenses */}
            <div className="form-group">
              <label htmlFor="lenses" className={`block text-sm md:text-base font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {currentLang === 'te' ? 'లెన్స్‌లు' : 'Lenses'}
              </label>
              <textarea
                id="lenses"
                name="lenses"
                rows={4}
                value={formData.lenses}
                onChange={handleInputChange}
                placeholder={getPlaceholder('lenses')}
                className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-100 border-gray-600' 
                    : 'bg-white text-gray-900 border-gray-300'
                }`}
                required
              />
            </div>

            {/* Question 8: Photographer Type */}
            <div className="form-group">
              <label htmlFor="photographerType" className={`block text-sm md:text-base font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {currentLang === 'te' ? 'రకం: ఫోటోగ్రాఫర్ / వీడియోగ్రాఫర్' : 'Type: Photographer / Videographer'}
              </label>
              <select
                id="photographerType"
                name="photographerType"
                value={formData.photographerType}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-100 border-gray-600' 
                    : 'bg-white text-gray-900 border-gray-300'
                }`}
                required
              >
                <option value="" disabled>
                  {currentLang === 'te' ? 'ఒక ఎంపికను ఎంచుకోండి' : 'Select an option'}
                </option>
                <option value="Photographer">
                  {currentLang === 'te' ? 'ఫోటోగ్రాఫర్' : 'Photographer'}
                </option>
                <option value="Videographer">
                  {currentLang === 'te' ? 'వీడియోగ్రాఫర్' : 'Videographer'}
                </option>
              </select>
            </div>

            {/* Question 9: Years of Experience */}
            <div className="form-group">
              <label htmlFor="experience" className={`block text-sm md:text-base font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {currentLang === 'te' ? 'అనుభవం' : 'Experience'}
              </label>
              <select
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-100 border-gray-600' 
                    : 'bg-white text-gray-900 border-gray-300'
                }`}
                required
              >
                <option value="" disabled>
                  {currentLang === 'te' ? 'ఒక ఎంపికను ఎంచుకోండి' : 'Select an option'}
                </option>
                <option value="0-2">0–2</option>
                <option value="3-5">3–5</option>
                <option value="6-10">6–10</option>
                <option value="10+">10+</option>
                <option value="20+">20+</option>
                <option value="30+">30+</option>
              </select>
            </div>

            {/* Question 10: Types of Photography */}
            <div className="form-group">
              <label className={`block text-sm md:text-base font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {currentLang === 'te' ? 'మీరు చేసే ఫోటోగ్రఫీ రకాలు' : 'Types of Photography You Do'}
              </label>
              <p className={`text-sm mb-2 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {currentLang === 'te' ? 'దయచేసి గరిష్టంగా 2 ఎంపికలను ఎంచుకోండి.' : 'Please select up to 2 options.'}
              </p>
              <div className="space-y-2">
                {[
                  { value: 'Traditional', en: 'Traditional', te: 'సాంప్రదాయ' },
                  { value: 'Candid', en: 'Candid', te: 'కాండిడ్' },
                  { value: 'Cinematic', en: 'Cinematic', te: 'సినిమాటిక్' },
                  { value: 'Other', en: 'Other', te: 'ఇతర' }
                ].map((option) => (
                  <div key={option.value} className="flex items-center">
                    <input
                      id={`photo-${option.value.toLowerCase()}`}
                      name="photoTypes"
                      type="checkbox"
                      value={option.value}
                      checked={formData.photoTypes.includes(option.value)}
                      onChange={(e) => handleCheckboxChange(e, 'photoTypes')}
                      disabled={!formData.photoTypes.includes(option.value) && formData.photoTypes.length >= 2}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-600 rounded bg-gray-700"
                    />
                    <label htmlFor={`photo-${option.value.toLowerCase()}`} className={`ml-2 block text-sm font-medium ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {currentLang === 'te' ? option.te : option.en}
                      {formData.photoTypes.includes(option.value) && (
                        <span className="text-blue-400 ml-1">({formData.photoTypes.indexOf(option.value) + 1})</span>
                      )}
                    </label>
                  </div>
                ))}
                {showOtherPhotoText && (
                  <input
                    type="text"
                    id="otherPhotoText"
                    name="otherPhotoText"
                    value={formData.otherPhotoText}
                    onChange={handleInputChange}
                    placeholder={getPlaceholder('otherPhotoText')}
                    className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      isDarkMode 
                        ? 'bg-gray-700 text-gray-100 border-gray-600' 
                        : 'bg-white text-gray-900 border-gray-300'
                    }`}
                  />
                )}
              </div>
            </div>

            {/* Question 11: Additional Services */}
            <div className="form-group">
              <label className={`block text-sm md:text-base font-medium mb-2 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {currentLang === 'te' ? 'అదనపు సేవలు' : 'Additional Services'}
              </label>
              <p className={`text-sm mb-2 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {currentLang === 'te' ? 'దయచేసి గరిష్టంగా 2 ఎంపికలను ఎంచుకోండి.' : 'Please select up to 2 options.'}
              </p>
              
              <div>
                <h4 className={`text-base font-semibold mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {currentLang === 'te' ? 'సాఫ్ట్‌వేర్ సేవలు' : 'Software Services'}
                </h4>
                <div className="space-y-2">
                  {[
                    { value: 'Album Designing', en: 'Album Designing', te: 'ఆల్బమ్ డిజైనింగ్' },
                    { value: 'Video Editing', en: 'Video Editing', te: 'వీడియో ఎడిటింగ్' },
                    { value: 'Video Mixing', en: 'Video Mixing', te: 'వీడియో మిక్సింగ్' }
                  ].map((option) => (
                    <div key={option.value} className="flex items-center">
                      <input
                        id={`software-${option.value.toLowerCase().replace(' ', '-')}`}
                        name="additionalServices"
                        type="checkbox"
                        value={option.value}
                        checked={formData.additionalServices.includes(option.value)}
                        onChange={(e) => handleCheckboxChange(e, 'additionalServices')}
                        disabled={!formData.additionalServices.includes(option.value) && formData.additionalServices.length >= 2}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-600 rounded bg-gray-700"
                      />
                      <label htmlFor={`software-${option.value.toLowerCase().replace(' ', '-')}`} className={`ml-2 block text-sm font-medium ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {currentLang === 'te' ? option.te : option.en}
                        {formData.additionalServices.includes(option.value) && (
                          <span className="text-blue-400 ml-1">({formData.additionalServices.indexOf(option.value) + 1})</span>
                        )}
                      </label>
                    </div>
                  ))}
                  <div className="flex items-center">
                    <input
                      id="otherSoftware"
                      name="additionalServices"
                      type="checkbox"
                      value="Other"
                      checked={formData.additionalServices.includes('Other')}
                      onChange={(e) => handleCheckboxChange(e, 'additionalServices')}
                      disabled={!formData.additionalServices.includes('Other') && formData.additionalServices.length >= 2}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-600 rounded bg-gray-700"
                    />
                    <label htmlFor="otherSoftware" className={`ml-2 block text-sm font-medium ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {currentLang === 'te' ? 'ఇతర' : 'Other'}
                      {formData.additionalServices.includes('Other') && (
                        <span className="text-blue-400 ml-1">({formData.additionalServices.indexOf('Other') + 1})</span>
                      )}
                    </label>
                  </div>
                  {showOtherSoftwareText && (
                    <input
                      type="text"
                      id="otherSoftwareText"
                      name="otherSoftwareText"
                      value={formData.otherSoftwareText}
                      onChange={handleInputChange}
                      placeholder={getPlaceholder('otherSoftwareText')}
                      className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        isDarkMode 
                          ? 'bg-gray-700 text-gray-100 border-gray-600' 
                          : 'bg-white text-gray-900 border-gray-300'
                      }`}
                    />
                  )}
                </div>
              </div>
              
              <div className="mt-4">
                <h4 className={`text-base font-semibold mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {currentLang === 'te' ? 'హార్డ్‌వేర్ సేవలు' : 'Hardware Services'}
                </h4>
                <div className="space-y-2">
                  {[
                    { value: 'Drone', en: 'Drone', te: 'డ్రోన్' },
                    { value: 'Livestreaming (LED Walls)', en: 'Livestreaming (LED Walls)', te: 'లైవ్ స్ట్రీమింగ్ (LED వాల్స్)' }
                  ].map((option) => (
                    <div key={option.value} className="flex items-center">
                      <input
                        id={`hardware-${option.value.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                        name="additionalServices"
                        type="checkbox"
                        value={option.value}
                        checked={formData.additionalServices.includes(option.value)}
                        onChange={(e) => handleCheckboxChange(e, 'additionalServices')}
                        disabled={!formData.additionalServices.includes(option.value) && formData.additionalServices.length >= 2}
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-600 rounded bg-gray-700"
                      />
                      <label htmlFor={`hardware-${option.value.toLowerCase().replace(/[^a-z0-9]/g, '-')}`} className={`ml-2 block text-sm font-medium ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {currentLang === 'te' ? option.te : option.en}
                        {formData.additionalServices.includes(option.value) && (
                          <span className="text-blue-400 ml-1">({formData.additionalServices.indexOf(option.value) + 1})</span>
                        )}
                      </label>
                    </div>
                  ))}
                  <div className="flex items-center">
                    <input
                      id="otherHardware"
                      name="additionalServices"
                      type="checkbox"
                      value="Other Hardware"
                      checked={formData.additionalServices.includes('Other Hardware')}
                      onChange={(e) => handleCheckboxChange(e, 'additionalServices')}
                      disabled={!formData.additionalServices.includes('Other Hardware') && formData.additionalServices.length >= 2}
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-600 rounded bg-gray-700"
                    />
                    <label htmlFor="otherHardware" className={`ml-2 block text-sm font-medium ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {currentLang === 'te' ? 'ఇతర' : 'Other'}
                      {formData.additionalServices.includes('Other Hardware') && (
                        <span className="text-blue-400 ml-1">({formData.additionalServices.indexOf('Other Hardware') + 1})</span>
                      )}
                    </label>
                  </div>
                  {showOtherHardwareText && (
                    <input
                      type="text"
                      id="otherHardwareText"
                      name="otherHardwareText"
                      value={formData.otherHardwareText}
                      onChange={handleInputChange}
                      placeholder={getPlaceholder('otherHardwareText')}
                      className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        isDarkMode 
                          ? 'bg-gray-700 text-gray-100 border-gray-600' 
                          : 'bg-white text-gray-900 border-gray-300'
                      }`}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Question 12: Sample Photos */}
            <div className="form-group">
              <label htmlFor="samplePhotos" className={`block text-sm md:text-base font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {currentLang === 'te' ? '3–5 నమూనా ఆల్బమ్‌లు అప్‌లోడ్ చేయండి (Google Drive లింక్)' : 'Upload 3–5 Sample Albums (Google Drive link)'}
              </label>
              <textarea
                id="samplePhotos"
                name="samplePhotos"
                rows={4}
                value={formData.samplePhotos}
                onChange={handleInputChange}
                placeholder={getPlaceholder('samplePhotos')}
                className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-100 border-gray-600' 
                    : 'bg-white text-gray-900 border-gray-300'
                }`}
                required
              />
            </div>

            {/* Question 13: Starting Price */}
            <div className="form-group">
              <label htmlFor="startingPrice" className={`block text-sm md:text-base font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {currentLang === 'te' ? 'ప్రారంభ ధర (కనీసం ₹20,000 రోజుకు – ఫోటోలు + వీడియోలు)' : 'Starting Price (Min. ₹20,000 Per Day – Photos + Videos)'}
              </label>
              <input
                type="text"
                id="startingPrice"
                name="startingPrice"
                value={formData.startingPrice}
                onChange={handleInputChange}
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

            {/* Question 14: Language */}
            <div className="form-group">
              <label htmlFor="language" className={`block text-sm md:text-base font-medium mb-1 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {currentLang === 'te' ? 'సంవాదానికి ఇష్టమైన భాష' : 'Preferred Language for Communication'}
              </label>
              <select
                id="language"
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 text-gray-100 border-gray-600' 
                    : 'bg-white text-gray-900 border-gray-300'
                }`}
                required
              >
                <option value="" disabled>
                  {currentLang === 'te' ? 'ఒక ఎంపికను ఎంచుకోండి' : 'Select an option'}
                </option>
                <option value="Telugu">Telugu</option>
                <option value="Hindi">Hindi</option>
                <option value="English">English</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="mt-8 text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : (currentLang === 'te' ? 'ఫారమ్ సమర్పించండి' : 'Submit Form')}
              </button>
            </div>
          </form>

          {/* Closing Message */}
          <div className={`mt-10 text-center text-sm md:text-base leading-relaxed ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            <p className="font-semibold text-lg mb-2">
              {currentLang === 'te' ? '✅ ధన్యవాదాలు! 🎉' : '✅ Thank you! 🎉'}
            </p>
            <p>
              {currentLang === 'te' 
                ? 'మా బృందం త్వరలోనే మీ వివరాలను సమీక్షించి SnapEvent ప్రొఫైల్ సృష్టిస్తుంది.'
                : 'Our team will review your details and create your SnapEvent profile soon.'
              }
            </p>
            <p>
              {currentLang === 'te' 
                ? 'వేచి ఉండండి – మీ పోర్ట్‌ఫోలియో లింక్‌ను మేము వాట్సాప్‌లో షేర్ చేస్తాము.'
                : 'Stay tuned – we\'ll share your portfolio link on WhatsApp.'
              }
            </p>
            <p className="text-sm mt-2">
              {currentLang === 'te' ? 'ఇన్‌స్టాగ్రామ్‌లో మమ్మల్ని అనుసరించండి: ' : 'Follow us on Instagram: '}
              <a 
                href="https://www.instagram.com/snapevent.in" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline font-semibold"
              >
                @snapevent.in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}