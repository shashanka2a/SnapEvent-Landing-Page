# SnapEvent API Test Scripts

This directory contains comprehensive Node.js test scripts to verify the onboarding and portfolio functionality with mock data.

## 📁 Test Scripts Overview

### 1. `test-onboarding.js`
**Purpose**: Tests the onboarding API functionality including user registration and photographer profile creation.

**Tests**:
- ✅ User Registration API
- ✅ Photographer Profile Creation
- ✅ Portfolio API CRUD Operations
- ✅ Booking API Functionality
- ✅ Input Validation and Error Handling

### 2. `test-frontend-integration.js`
**Purpose**: Tests API compatibility with frontend components and verifies response formats.

**Tests**:
- ✅ Landing Page API Integration
- ✅ Portfolio Page API Integration
- ✅ Onboarding Form API Integration
- ✅ Booking API Integration
- ✅ API Response Format Compatibility
- ✅ Error Handling for Frontend

### 3. `run-all-tests.js`
**Purpose**: Comprehensive test runner that executes all test suites and provides a final summary.

**Features**:
- 🔍 Server availability check
- 📊 Detailed test results
- 🎯 Final pass/fail summary
- 📝 Production readiness assessment

### 4. `demo-mock-data.js`
**Purpose**: Demonstrates the mock data structure used in testing.

**Shows**:
- 📸 Complete photographer profile structure
- 👤 User registration data format
- 📅 Booking information structure
- 🔍 Search results format

## 🚀 How to Run Tests

### Prerequisites
1. **Development Server**: Make sure the Next.js development server is running
   ```bash
   npm run dev
   ```

2. **Server Status**: The server should be accessible at `http://localhost:3000`

### Running Individual Tests

```bash
# Test onboarding functionality
node test-onboarding.js

# Test frontend integration
node test-frontend-integration.js

# Demo mock data structure
node demo-mock-data.js
```

### Running All Tests

```bash
# Run comprehensive test suite
node run-all-tests.js
```

## 📊 Test Results Interpretation

### ✅ Success Indicators
- **PASSED**: Test completed successfully
- **PARTIAL**: API structure valid, Supabase connection failed (expected in test environment)

### ⚠️ Expected Warnings
- **Supabase Connection Errors**: These are expected in the test environment since we're not connected to a real Supabase instance
- **308 Redirects**: Some API routes may redirect due to trailing slash configuration

### ❌ Failure Indicators
- **FAILED**: Test structure or validation failed
- **ERROR**: Network or script execution error

## 🎯 What the Tests Verify

### API Structure
- ✅ Request/response format compatibility
- ✅ Input validation working correctly
- ✅ Error handling and status codes
- ✅ CORS headers properly set

### Frontend Integration
- ✅ Landing page photographer listings
- ✅ Portfolio page individual profiles
- ✅ Onboarding form data submission
- ✅ Booking creation and management

### Data Validation
- ✅ Required field validation
- ✅ Email format validation
- ✅ Password strength requirements
- ✅ Data type validation

## 📝 Mock Data Structure

The tests use comprehensive mock data that matches the expected API response formats:

### Photographer Profile
```javascript
{
  id: "1",
  businessName: "Sarah Chen Photography",
  title: "Wedding & Portrait Photographer",
  location: "San Francisco, CA",
  bio: "...",
  specialties: ["Wedding Photography", "Portrait Photography"],
  services: [...],
  portfolio: [...],
  rating: 4.9,
  reviews: 127,
  verified: true,
  image: "...",
  website: "...",
  instagram: "...",
  awards: [...],
  testimonials: [...]
}
```

### User Registration
```javascript
{
  email: "test.photographer@example.com",
  password: "securePassword123",
  firstName: "John",
  lastName: "Doe",
  phone: "+1 (555) 123-4567",
  role: "PHOTOGRAPHER"
}
```

### Booking Information
```javascript
{
  clientId: "test-client-456",
  photographerId: "1",
  serviceId: "service-1",
  eventType: "Wedding",
  eventDate: "2024-07-20",
  eventLocation: "San Francisco, CA",
  duration: 8,
  guestCount: 120,
  specialRequests: "...",
  totalAmount: 2800,
  depositAmount: 500
}
```

## 🔧 Troubleshooting

### Common Issues

1. **Server Not Running**
   ```
   ❌ Development server is not running on localhost:3000
   ```
   **Solution**: Start the development server with `npm run dev`

2. **Supabase Connection Errors**
   ```
   ⚠️ PARTIAL - Supabase connection failed (expected in test environment)
   ```
   **Solution**: This is expected behavior in test environment

3. **308 Redirects**
   ```
   ❌ Status: 308
   ```
   **Solution**: Some API routes redirect due to trailing slash configuration

### Debug Mode
To see detailed request/response information, modify the test scripts to include verbose logging:

```javascript
// Add this to any test script for detailed output
console.log('Request:', { method, path, data });
console.log('Response:', { statusCode, headers, body });
```

## 🎉 Success Criteria

Your API is ready for production when:
- ✅ All test suites pass
- ✅ Validation middleware works correctly
- ✅ CORS headers are properly set
- ✅ Error handling returns appropriate status codes
- ✅ API response formats match frontend expectations

## 📞 Support

If you encounter issues with the test scripts:
1. Check that the development server is running
2. Verify API routes are accessible
3. Review the test output for specific error messages
4. Ensure all dependencies are installed

The test scripts are designed to be comprehensive and should catch most integration issues before deployment.
