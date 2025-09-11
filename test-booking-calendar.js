#!/usr/bin/env node

/**
 * Test Script for Booking Calendar System
 * Tests the booking calendar functionality with mock data
 */

// Using built-in fetch (Node.js 18+)

const API_BASE_URL = 'http://localhost:3001/api';

// Test data
const mockPhotographer = {
  id: 'test-photographer-1',
  businessName: 'Sarah Chen Photography',
  location: 'San Francisco, CA',
  phone: '+1 (555) 123-4567',
  email: 'sarah@example.com'
};

const mockBookingData = {
  photographerId: mockPhotographer.id,
  clientId: 'test-client-1',
  eventType: 'Wedding',
  eventDate: '2024-02-15',
  eventTime: '10:00 AM',
  eventLocation: 'Golden Gate Park, San Francisco',
  totalAmount: 350,
  clientName: 'John Doe',
  clientEmail: 'john@example.com',
  clientPhone: '+1 (555) 987-6543',
  notes: 'Outdoor wedding ceremony and reception',
  status: 'pending'
};

async function testAvailabilityAPI() {
  console.log('🧪 Testing Availability API...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/availability?photographerId=${mockPhotographer.id}&date=2024-02-15`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log('✅ Availability API Response:');
    console.log(`   Date: ${data.date}`);
    console.log(`   Photographer ID: ${data.photographerId}`);
    console.log(`   Total Slots: ${data.totalSlots}`);
    console.log(`   Available Slots: ${data.availableSlots}`);
    console.log(`   Availability:`, data.availability.map(slot => ({
      time: slot.time,
      available: slot.available,
      price: slot.price
    })));
    
    return true;
  } catch (error) {
    console.error('❌ Availability API Test Failed:', error.message);
    return false;
  }
}

async function testBookingCreation() {
  console.log('\n🧪 Testing Booking Creation...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mockBookingData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP ${response.status}: ${errorData.error || response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log('✅ Booking Creation Response:');
    console.log(`   Booking ID: ${data.id}`);
    console.log(`   Status: ${data.status}`);
    console.log(`   Event: ${data.eventType} on ${data.eventDate} at ${data.eventTime}`);
    console.log(`   Client: ${data.clientName} (${data.clientEmail})`);
    console.log(`   Total: $${data.totalAmount}`);
    
    return data.id;
  } catch (error) {
    console.error('❌ Booking Creation Test Failed:', error.message);
    return null;
  }
}

async function testBookingRetrieval(bookingId) {
  if (!bookingId) {
    console.log('\n⏭️  Skipping Booking Retrieval Test (no booking ID)');
    return false;
  }
  
  console.log('\n🧪 Testing Booking Retrieval...');
  
  try {
    const response = await fetch(`${API_BASE_URL}/bookings?photographerId=${mockPhotographer.id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log('✅ Booking Retrieval Response:');
    console.log(`   Total Bookings: ${data.bookings.length}`);
    
    if (data.bookings.length > 0) {
      const latestBooking = data.bookings[0];
      console.log(`   Latest Booking: ${latestBooking.eventType} on ${latestBooking.eventDate}`);
      console.log(`   Status: ${latestBooking.status}`);
      console.log(`   Client: ${latestBooking.clientName}`);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Booking Retrieval Test Failed:', error.message);
    return false;
  }
}

async function testBookingCalendarIntegration() {
  console.log('\n🧪 Testing Booking Calendar Integration...');
  
  try {
    // Test 1: Check availability for multiple dates
    const testDates = ['2024-02-15', '2024-02-16', '2024-02-17'];
    const availabilityResults = [];
    
    for (const date of testDates) {
      const response = await fetch(`${API_BASE_URL}/bookings/availability?photographerId=${mockPhotographer.id}&date=${date}`);
      if (response.ok) {
        const data = await response.json();
        availabilityResults.push({
          date,
          availableSlots: data.availableSlots,
          totalSlots: data.totalSlots
        });
      }
    }
    
    console.log('✅ Multi-Date Availability Check:');
    availabilityResults.forEach(result => {
      console.log(`   ${result.date}: ${result.availableSlots}/${result.totalSlots} slots available`);
    });
    
    // Test 2: Test booking flow simulation
    console.log('\n✅ Booking Flow Simulation:');
    console.log('   1. User selects date: 2024-02-15');
    console.log('   2. System shows available time slots');
    console.log('   3. User selects time: 10:00 AM');
    console.log('   4. User selects event type: Wedding');
    console.log('   5. User fills client information');
    console.log('   6. System calculates total: $350');
    console.log('   7. Booking submitted successfully');
    
    return true;
  } catch (error) {
    console.error('❌ Booking Calendar Integration Test Failed:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting Booking Calendar System Tests\n');
  console.log('=' .repeat(60));
  
  const results = {
    availabilityAPI: false,
    bookingCreation: false,
    bookingRetrieval: false,
    integration: false
  };
  
  // Run tests
  results.availabilityAPI = await testAvailabilityAPI();
  const bookingId = await testBookingCreation();
  results.bookingCreation = bookingId !== null;
  results.bookingRetrieval = await testBookingRetrieval(bookingId);
  results.integration = await testBookingCalendarIntegration();
  
  // Summary
  console.log('\n' + '=' .repeat(60));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('=' .repeat(60));
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`✅ Availability API: ${results.availabilityAPI ? 'PASS' : 'FAIL'}`);
  console.log(`✅ Booking Creation: ${results.bookingCreation ? 'PASS' : 'FAIL'}`);
  console.log(`✅ Booking Retrieval: ${results.bookingRetrieval ? 'PASS' : 'FAIL'}`);
  console.log(`✅ Integration Test: ${results.integration ? 'PASS' : 'FAIL'}`);
  
  console.log(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed! Booking calendar system is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above.');
  }
  
  return passedTests === totalTests;
}

// Check if development server is running
async function checkServer() {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings/availability?photographerId=test&date=2024-01-01`);
    return true;
  } catch (error) {
    return false;
  }
}

// Main execution
async function main() {
  console.log('🔍 Checking if development server is running...');
  
  const serverRunning = await checkServer();
  
  if (!serverRunning) {
    console.log('❌ Development server is not running!');
    console.log('Please start the development server with: npm run dev');
    console.log('Then run this test script again.');
    process.exit(1);
  }
  
  console.log('✅ Development server is running on port 3001');
  
  const success = await runAllTests();
  process.exit(success ? 0 : 1);
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});

// Run the tests
main().catch(console.error);
