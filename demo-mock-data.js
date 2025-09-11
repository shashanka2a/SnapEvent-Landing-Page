#!/usr/bin/env node

// Demo script showing mock data structure for SnapEvent
console.log('🎭 SnapEvent Mock Data Demo\n');

// Mock Photographer Data
const mockPhotographer = {
  id: '1',
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
      image: 'https://images.unsplash.com/photo-1730116309939-10a01fdf1edb?w=800',
      category: 'wedding',
      title: 'Golden Hour Wedding'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1586796676778-2c50b6bc3937?w=800',
      category: 'portrait',
      title: 'Studio Portrait Session'
    }
  ],
  rating: 4.9,
  reviews: 127,
  verified: true,
  image: 'https://images.unsplash.com/photo-1643968612613-fd411aecd1fd?w=400',
  website: 'sarahchen.photography',
  instagram: '@sarahchenphoto',
  awards: ['Best Wedding Photographer 2023', 'Portrait Masters Gold Award'],
  testimonials: [
    {
      name: 'Emily & David',
      event: 'Wedding Photography',
      rating: 5,
      comment: 'Sarah captured our wedding day perfectly! Her attention to detail and ability to capture candid moments made our photos absolutely stunning.'
    }
  ]
};

// Mock User Registration Data
const mockUserRegistration = {
  email: 'test.photographer@example.com',
  password: 'securePassword123',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+1 (555) 123-4567',
  role: 'PHOTOGRAPHER'
};

// Mock Booking Data
const mockBooking = {
  clientId: 'test-client-456',
  photographerId: '1',
  serviceId: 'service-1',
  eventType: 'Wedding',
  eventDate: '2024-07-20',
  eventLocation: 'San Francisco, CA',
  duration: 8,
  guestCount: 120,
  specialRequests: 'Please focus on candid moments and family photos. Outdoor ceremony at Golden Gate Park.',
  totalAmount: 2800,
  depositAmount: 500
};

// Mock Search Results
const mockSearchResults = {
  photographers: [
    {
      id: '1',
      businessName: 'Sarah Chen Photography',
      title: 'Wedding & Portrait Photographer',
      location: 'San Francisco, CA',
      rating: 4.9,
      reviews: 127,
      verified: true,
      image: 'https://images.unsplash.com/photo-1643968612613-fd411aecd1fd?w=400',
      services: [
        {
          name: 'Wedding Photography',
          price: 'From $2,800'
        }
      ]
    },
    {
      id: '2',
      businessName: 'Marcus Johnson Studios',
      title: 'Corporate & Event Photographer',
      location: 'New York, NY',
      rating: 4.8,
      reviews: 89,
      verified: true,
      image: 'https://images.unsplash.com/photo-1502514463321-f81bd30cd473?w=400',
      services: [
        {
          name: 'Corporate Event',
          price: 'From $1,200'
        }
      ]
    }
  ],
  pagination: {
    limit: 6,
    offset: 0,
    total: 2
  }
};

console.log('📸 Mock Photographer Profile:');
console.log(JSON.stringify(mockPhotographer, null, 2));

console.log('\n👤 Mock User Registration:');
console.log(JSON.stringify(mockUserRegistration, null, 2));

console.log('\n📅 Mock Booking:');
console.log(JSON.stringify(mockBooking, null, 2));

console.log('\n🔍 Mock Search Results:');
console.log(JSON.stringify(mockSearchResults, null, 2));

console.log('\n✅ Mock Data Structure Summary:');
console.log('   📸 Photographer: Complete profile with services, portfolio, and testimonials');
console.log('   👤 User Registration: All required fields for account creation');
console.log('   📅 Booking: Complete booking information with client and photographer details');
console.log('   🔍 Search Results: Paginated photographer listings with key information');

console.log('\n🎯 Frontend Integration Points:');
console.log('   🏠 Landing Page: Uses search results for photographer listings');
console.log('   👤 Portfolio Page: Uses complete photographer profile data');
console.log('   📝 Onboarding Form: Uses user registration and photographer creation data');
console.log('   📅 Booking Flow: Uses booking data for reservation management');

console.log('\n🚀 Ready for Frontend Development!');
console.log('   All mock data structures match the API response formats');
console.log('   Frontend components can use this data for development and testing');
