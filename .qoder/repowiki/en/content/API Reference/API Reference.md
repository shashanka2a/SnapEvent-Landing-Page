# API Reference

<cite>
**Referenced Files in This Document**   
- [signin.ts](file://pages/api/auth/signin.ts)
- [signup.ts](file://pages/api/auth/signup.ts)
- [signout.ts](file://pages/api/auth/signout.ts)
- [update-role.ts](file://pages/api/auth/update-role.ts)
- [verify.ts](file://pages/api/auth/verify.ts)
- [index.ts](file://pages/api/bookings/index.ts)
- [availability.ts](file://pages/api/bookings/availability.ts)
- [[id].ts](file://pages/api/bookings/[id].ts)
- [index.ts](file://pages/api/photographers/index.ts)
- [[id].ts](file://pages/api/photographers/[id].ts)
- [supabase.ts](file://src/lib/supabase.ts)
- [auth.ts](file://src/middleware/auth.ts)
- [validation.ts](file://src/middleware/validation.ts)
- [api.ts](file://src/lib/api.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Authentication](#authentication)
3. [Bookings](#bookings)
4. [Photographers](#photographers)
5. [Authentication and Authorization](#authentication-and-authorization)
6. [Request and Response Formats](#request-and-response-formats)
7. [Error Handling](#error-handling)
8. [Rate Limiting and Policies](#rate-limiting-and-policies)

## Introduction
This document provides comprehensive reference documentation for the SnapEvent API endpoints. The API is organized into three main groups: authentication, bookings, and photographers. All endpoints follow REST conventions and use JSON for request and response payloads. The API is built using Next.js API routes with Supabase for authentication and database operations.

The base URL for all API endpoints is `/api`, and all responses are returned in JSON format. The API supports standard HTTP methods and follows consistent patterns for request validation, error handling, and authentication.

**Section sources**
- [supabase.ts](file://src/lib/supabase.ts#L1-L20)
- [api.ts](file://src/lib/api.ts#L1-L20)

## Authentication

### POST /api/auth/signup
Creates a new user account and sends a verification email.

**Request Parameters**
- Method: POST
- URL: `/api/auth/signup`
- Authentication: Not required

**Request Body**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "role": "CLIENT"
}
```

**Fields**
- `email`: User's email address (required, valid email format)
- `password`: User's password (required, minimum 6 characters)
- `firstName`: User's first name (required, 1-50 characters)
- `lastName`: User's last name (required, 1-50 characters)
- `phone`: User's phone number (optional, valid phone format)
- `role`: User's role (optional, defaults to "CLIENT", must be "CLIENT" or "PHOTOGRAPHER")

**Success Response (201)**
```json
{
  "message": "User created successfully. Please check your email to verify your account.",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CLIENT"
  }
}
```

**Error Responses**
- 400: Missing required fields or invalid data format
- 400: Email already in use
- 500: Internal server error

**Examples**
```bash
curl -X POST https://snap-event.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890"
  }'
```

```javascript
fetch('/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securepassword',
    firstName: 'John',
    lastName: 'Doe'
  })
})
```

**Section sources**
- [signup.ts](file://pages/api/auth/signup.ts#L1-L80)
- [validation.ts](file://src/middleware/validation.ts#L100-L160)

### POST /api/auth/signin
Authenticates a user and returns session information.

**Request Parameters**
- Method: POST
- URL: `/api/auth/signin`
- Authentication: Not required

**Request Body**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Fields**
- `email`: User's email address (required)
- `password`: User's password (required)

**Success Response (200)**
```json
{
  "message": "Sign in successful",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CLIENT",
    "avatar": "url/to/avatar.jpg"
  },
  "session": {
    "access_token": "jwt_token",
    "expires_in": 3600,
    "refresh_token": "refresh_token",
    "token_type": "bearer"
  }
}
```

**Error Responses**
- 400: Missing required fields
- 401: Invalid credentials
- 401: User profile not found
- 500: Internal server error

**Examples**
```bash
curl -X POST https://snap-event.com/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword"
  }'
```

```javascript
fetch('/api/auth/signin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securepassword'
  })
})
```

**Section sources**
- [signin.ts](file://pages/api/auth/signin.ts#L1-L64)

### POST /api/auth/signout
Terminates the user's current session.

**Request Parameters**
- Method: POST
- URL: `/api/auth/signout`
- Authentication: Not required (uses current session)

**Success Response (200)**
```json
{
  "message": "Sign out successful"
}
```

**Error Responses**
- 400: Sign out failed
- 500: Internal server error

**Examples**
```bash
curl -X POST https://snap-event.com/api/auth/signout
```

```javascript
fetch('/api/auth/signout', {
  method: 'POST'
})
```

**Section sources**
- [signout.ts](file://pages/api/auth/signout.ts#L1-L28)

### POST /api/auth/update-role
Updates the authenticated user's role.

**Request Parameters**
- Method: POST
- URL: `/api/auth/update-role`
- Authentication: Required (Bearer token)

**Request Body**
```json
{
  "role": "PHOTOGRAPHER"
}
```

**Fields**
- `role`: New role for the user (required, must be "CLIENT" or "PHOTOGRAPHER")

**Success Response (200)**
```json
{
  "message": "User role updated successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "PHOTOGRAPHER"
  }
}
```

**Error Responses**
- 400: Invalid role
- 401: Not authenticated
- 400: Database update error
- 500: Internal server error

**Examples**
```bash
curl -X POST https://snap-event.com/api/auth/update-role \
  -H "Authorization: Bearer jwt_token" \
  -H "Content-Type: application/json" \
  -d '{"role": "PHOTOGRAPHER"}'
```

```javascript
fetch('/api/auth/update-role', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({ role: 'PHOTOGRAPHER' })
})
```

**Section sources**
- [update-role.ts](file://pages/api/auth/update-role.ts#L1-L49)

### POST /api/auth/verify
Sends a verification email to the user.

**Request Parameters**
- Method: POST
- URL: `/api/auth/verify`
- Authentication: Not required

**Request Body**
```json
{
  "email": "user@example.com"
}
```

**Fields**
- `email`: User's email address (required)

**Success Response (200)**
```json
{
  "message": "Verification email sent"
}
```

### GET /api/auth/verify
Verifies a user's email address using a token.

**Request Parameters**
- Method: GET
- URL: `/api/auth/verify?token=jwt_token`
- Authentication: Not required

**Query Parameters**
- `token`: JWT token containing email verification data (required)

**Success Response (302)**
- Redirects to profile setup page

**Error Responses**
- 400: Invalid or expired token
- 400: Missing token

**Examples**
```bash
curl -X POST https://snap-event.com/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

```javascript
// Send verification email
fetch('/api/auth/verify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com' })
})
```

**Section sources**
- [verify.ts](file://pages/api/auth/verify.ts#L1-L65)

## Bookings

### GET /api/bookings
Retrieves a list of bookings with optional filtering.

**Request Parameters**
- Method: GET
- URL: `/api/bookings`
- Authentication: Required (Bearer token)

**Query Parameters**
- `userId`: Filter by client user ID
- `photographerId`: Filter by photographer ID
- `status`: Filter by booking status (pending, confirmed, declined, cancelled)
- `limit`: Number of results to return (default: 20)
- `offset`: Number of results to skip (default: 0)

**Success Response (200)**
```json
{
  "bookings": [
    {
      "id": "uuid",
      "client_id": "uuid",
      "photographer_id": "uuid",
      "event_type": "Wedding",
      "event_date": "2023-12-01",
      "event_time": "09:00 AM",
      "event_location": "Central Park, NYC",
      "total_amount": 1500,
      "status": "confirmed",
      "client": {
        "id": "uuid",
        "email": "client@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "avatar": "url/to/avatar.jpg"
      },
      "photographer": {
        "id": "uuid",
        "business_name": "Pro Photos",
        "title": "Senior Photographer",
        "users": {
          "id": "uuid",
          "first_name": "Jane",
          "last_name": "Smith",
          "avatar": "url/to/avatar.jpg"
        }
      },
      "service": {
        "id": "uuid",
        "name": "Full Day Coverage",
        "price": 1500,
        "duration": "8 hours"
      }
    }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 1
  }
}
```

**Error Responses**
- 400: Database query error
- 401: Not authenticated
- 500: Internal server error

**Examples**
```bash
curl -X GET "https://snap-event.com/api/bookings?status=confirmed&limit=10" \
  -H "Authorization: Bearer jwt_token"
```

```javascript
fetch('/api/bookings?status=confirmed&limit=10', {
  method: 'GET',
  headers: { 'Authorization': 'Bearer ' + token }
})
```

**Section sources**
- [index.ts](file://pages/api/bookings/index.ts#L1-L208)

### POST /api/bookings
Creates a new booking request.

**Request Parameters**
- Method: POST
- URL: `/api/bookings`
- Authentication: Required (Bearer token)

**Request Body**
```json
{
  "clientId": "uuid",
  "photographerId": "uuid",
  "serviceId": "uuid",
  "eventType": "Wedding",
  "eventDate": "2023-12-01",
  "eventTime": "09:00 AM",
  "eventLocation": "Central Park, NYC",
  "duration": 8,
  "guestCount": 150,
  "specialRequests": "Candid shots of guests",
  "totalAmount": 1500,
  "depositAmount": 500,
  "clientName": "John Doe",
  "clientEmail": "john@example.com",
  "clientPhone": "+1234567890",
  "notes": "Bride is afraid of cameras",
  "status": "pending"
}
```

**Fields**
- `clientId`: ID of the client making the booking (required)
- `photographerId`: ID of the photographer (required)
- `serviceId`: ID of the selected service (optional)
- `eventType`: Type of event (required)
- `eventDate`: Date of the event (required)
- `eventTime`: Time of the event (optional)
- `eventLocation`: Location of the event (required)
- `duration`: Duration in hours (optional)
- `guestCount`: Number of guests (optional)
- `specialRequests`: Special requests from client (optional)
- `totalAmount`: Total amount for the booking (required)
- `depositAmount`: Deposit amount (optional, defaults to 0)
- `clientName`: Client's full name (optional)
- `clientEmail`: Client's email (optional)
- `clientPhone`: Client's phone (optional)
- `notes`: Additional notes (optional)
- `status`: Initial status (optional, defaults to "pending")

**Validation**
- Prevents double booking by checking for conflicts with confirmed bookings at the same date and time
- Validates required fields

**Success Response (201)**
```json
{
  "message": "Booking created successfully",
  "booking": {
    "id": "uuid",
    "client_id": "uuid",
    "photographer_id": "uuid",
    "event_type": "Wedding",
    "event_date": "2023-12-01",
    "event_time": "09:00 AM",
    "event_location": "Central Park, NYC",
    "total_amount": 1500,
    "status": "pending",
    "client": {
      "id": "uuid",
      "email": "client@example.com",
      "first_name": "John",
      "last_name": "Doe"
    },
    "photographer": {
      "id": "uuid",
      "business_name": "Pro Photos",
      "users": {
        "id": "uuid",
        "first_name": "Jane",
        "last_name": "Smith"
      }
    }
  }
}
```

**Error Responses**
- 400: Missing required fields
- 409: Time slot already booked
- 400: Database insertion error
- 500: Internal server error

**Examples**
```bash
curl -X POST https://snap-event.com/api/bookings \
  -H "Authorization: Bearer jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": "user_uuid",
    "photographerId": "photo_uuid",
    "eventType": "Wedding",
    "eventDate": "2023-12-01",
    "eventLocation": "Central Park, NYC",
    "totalAmount": 1500
  }'
```

```javascript
fetch('/api/bookings', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    clientId: 'user_uuid',
    photographerId: 'photo_uuid',
    eventType: 'Wedding',
    eventDate: '2023-12-01',
    eventLocation: 'Central Park, NYC',
    totalAmount: 1500
  })
})
```

**Section sources**
- [index.ts](file://pages/api/bookings/index.ts#L1-L208)

### GET /api/bookings/availability
Checks availability for a photographer on a specific date.

**Request Parameters**
- Method: GET
- URL: `/api/bookings/availability`
- Authentication: Not required

**Query Parameters**
- `photographerId`: ID of the photographer (required)
- `date`: Date to check availability for (required, format: YYYY-MM-DD)

**Success Response (200)**
```json
{
  "date": "2023-12-01",
  "photographerId": "uuid",
  "availability": [
    {
      "id": "morning-1",
      "time": "09:00 AM",
      "price": 150,
      "available": true
    },
    {
      "id": "morning-2",
      "time": "10:00 AM",
      "price": 150,
      "available": false
    }
  ],
  "totalSlots": 11,
  "availableSlots": 8
}
```

**Error Responses**
- 400: Missing required parameters
- 500: Internal server error

**Examples**
```bash
curl -X GET "https://snap-event.com/api/bookings/availability?photographerId=uuid&date=2023-12-01"
```

```javascript
fetch('/api/bookings/availability?photographerId=uuid&date=2023-12-01')
```

**Section sources**
- [availability.ts](file://pages/api/bookings/availability.ts#L1-L69)

### GET /api/bookings/[id]
Retrieves a specific booking by ID.

**Request Parameters**
- Method: GET
- URL: `/api/bookings/{id}`
- Authentication: Required (Bearer token)

**Path Parameters**
- `id`: UUID of the booking (required)

**Success Response (200)**
```json
{
  "booking": {
    "id": "uuid",
    "client_id": "uuid",
    "photographer_id": "uuid",
    "event_type": "Wedding",
    "event_date": "2023-12-01",
    "event_time": "09:00 AM",
    "event_location": "Central Park, NYC",
    "total_amount": 1500,
    "status": "confirmed",
    "created_at": "2023-11-01T10:00:00Z",
    "updated_at": "2023-11-01T10:00:00Z"
  }
}
```

**Error Responses**
- 400: Invalid booking ID
- 404: Booking not found
- 500: Internal server error

**Examples**
```bash
curl -X GET https://snap-event.com/api/bookings/booking_uuid \
  -H "Authorization: Bearer jwt_token"
```

```javascript
fetch('/api/bookings/booking_uuid', {
  method: 'GET',
  headers: { 'Authorization': 'Bearer ' + token }
})
```

**Section sources**
- [[id].ts](file://pages/api/bookings/[id].ts#L1-L178)

### PATCH /api/bookings/[id]
Updates a booking's status and notes.

**Request Parameters**
- Method: PATCH
- URL: `/api/bookings/{id}`
- Authentication: Required (Bearer token)

**Path Parameters**
- `id`: UUID of the booking (required)

**Request Body**
```json
{
  "status": "confirmed",
  "notes": "Client confirmed all details"
}
```

**Fields**
- `status`: New status (required, one of: pending, confirmed, declined, cancelled)
- `notes`: Photographer's notes (optional)

**Validation**
- When confirming a booking, checks for conflicts with other confirmed or pending bookings
- Sends email notification to client when status changes

**Success Response (200)**
```json
{
  "booking": {
    "id": "uuid",
    "status": "confirmed",
    "photographer_notes": "Client confirmed all details",
    "updated_at": "2023-11-01T10:00:00Z"
  },
  "message": "Booking confirmed successfully"
}
```

**Error Responses**
- 400: Invalid status or missing required fields
- 404: Booking not found
- 409: Time slot conflict when confirming
- 500: Internal server error

**Examples**
```bash
curl -X PATCH https://snap-event.com/api/bookings/booking_uuid \
  -H "Authorization: Bearer jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "confirmed",
    "notes": "Client confirmed all details"
  }'
```

```javascript
fetch('/api/bookings/booking_uuid', {
  method: 'PATCH',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    status: 'confirmed',
    notes: 'Client confirmed all details'
  })
})
```

**Section sources**
- [[id].ts](file://pages/api/bookings/[id].ts#L1-L178)

### DELETE /api/bookings/[id]
Cancels a booking.

**Request Parameters**
- Method: DELETE
- URL: `/api/bookings/{id}`
- Authentication: Required (Bearer token)

**Path Parameters**
- `id`: UUID of the booking (required)

**Success Response (200)**
```json
{
  "message": "Booking deleted successfully"
}
```

**Error Responses**
- 400: Invalid booking ID
- 500: Failed to delete booking

**Examples**
```bash
curl -X DELETE https://snap-event.com/api/bookings/booking_uuid \
  -H "Authorization: Bearer jwt_token"
```

```javascript
fetch('/api/bookings/booking_uuid', {
  method: 'DELETE',
  headers: { 'Authorization': 'Bearer ' + token }
})
```

**Section sources**
- [[id].ts](file://pages/api/bookings/[id].ts#L1-L178)

## Photographers

### GET /api/photographers
Retrieves a list of photographers with filtering options.

**Request Parameters**
- Method: GET
- URL: `/api/photographers`
- Authentication: Not required

**Query Parameters**
- `location`: Filter by location (partial match)
- `specialty`: Filter by specialty
- `minRating`: Filter by minimum average rating
- `limit`: Number of results to return (default: 20)
- `offset`: Number of results to skip (default: 0)

**Success Response (200)**
```json
{
  "photographers": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "business_name": "Pro Photos",
      "title": "Senior Photographer",
      "bio": "Professional wedding photographer with 10 years experience",
      "location": "New York, NY",
      "years_experience": 10,
      "is_available": true,
      "average_rating": 4.8,
      "total_reviews": 45,
      "application_status": "APPROVED",
      "users": {
        "id": "uuid",
        "email": "photographer@example.com",
        "first_name": "Jane",
        "last_name": "Smith",
        "avatar": "url/to/avatar.jpg"
      },
      "specialties": [
        {
          "id": "uuid",
          "name": "Wedding"
        }
      ]
    }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 1
  }
}
```

**Error Responses**
- 400: Database query error
- 500: Internal server error

**Examples**
```bash
curl -X GET "https://snap-event.com/api/photographers?location=New+York&minRating=4.5"
```

```javascript
fetch('/api/photographers?location=New+York&minRating=4.5')
```

**Section sources**
- [index.ts](file://pages/api/photographers/index.ts#L1-L163)

### POST /api/photographers
Creates a new photographer profile.

**Request Parameters**
- Method: POST
- URL: `/api/photographers`
- Authentication: Required (Bearer token)

**Request Body**
```json
{
  "userId": "uuid",
  "businessName": "Pro Photos",
  "title": "Senior Photographer",
  "bio": "Professional wedding photographer with 10 years experience",
  "location": "New York, NY",
  "website": "https://prophotos.com",
  "instagramHandle": "prophotos",
  "yearsExperience": 10,
  "specialties": ["uuid1", "uuid2"],
  "services": [
    {
      "name": "Wedding Package",
      "description": "Full day wedding coverage",
      "price": 1500,
      "duration": "8 hours",
      "deliverables": "500 edited photos, 1 video"
    }
  ]
}
```

**Fields**
- `userId`: ID of the user creating the profile (required)
- `businessName`: Business name (optional)
- `title`: Professional title (optional)
- `bio`: Biography (optional)
- `location`: Primary service location (required)
- `website`: Website URL (optional)
- `instagramHandle`: Instagram username (optional)
- `yearsExperience`: Years of professional experience (optional)
- `specialties`: Array of specialty IDs (optional)
- `services`: Array of service objects (optional)

**Success Response (201)**
```json
{
  "message": "Photographer profile created successfully",
  "profile": {
    "id": "uuid",
    "user_id": "uuid",
    "business_name": "Pro Photos",
    "title": "Senior Photographer",
    "location": "New York, NY",
    "created_at": "2023-11-01T10:00:00Z"
  }
}
```

**Error Responses**
- 400: Missing required fields
- 400: Database insertion error
- 500: Internal server error

**Examples**
```bash
curl -X POST https://snap-event.com/api/photographers \
  -H "Authorization: Bearer jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_uuid",
    "location": "New York, NY",
    "title": "Senior Photographer"
  }'
```

```javascript
fetch('/api/photographers', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    userId: 'user_uuid',
    location: 'New York, NY',
    title: 'Senior Photographer'
  })
})
```

**Section sources**
- [index.ts](file://pages/api/photographers/index.ts#L1-L163)

### GET /api/photographers/[id]
Retrieves a specific photographer's complete profile.

**Request Parameters**
- Method: GET
- URL: `/api/photographers/{id}`
- Authentication: Not required

**Path Parameters**
- `id`: UUID of the photographer (required)

**Success Response (200)**
```json
{
  "profile": {
    "id": "uuid",
    "user_id": "uuid",
    "business_name": "Pro Photos",
    "title": "Senior Photographer",
    "bio": "Professional wedding photographer with 10 years experience",
    "location": "New York, NY",
    "years_experience": 10,
    "is_available": true,
    "average_rating": 4.8,
    "total_reviews": 45,
    "users": {
      "id": "uuid",
      "email": "photographer@example.com",
      "first_name": "Jane",
      "last_name": "Smith",
      "avatar": "url/to/avatar.jpg"
    },
    "specialties": [
      {
        "id": "uuid",
        "name": "Wedding",
        "description": "Wedding photography services"
      }
    ],
    "services": [
      {
        "id": "uuid",
        "name": "Wedding Package",
        "description": "Full day wedding coverage",
        "price": 1500,
        "duration": "8 hours",
        "deliverables": "500 edited photos, 1 video"
      }
    ],
    "portfolio_items": [
      {
        "id": 1,
        "title": "Central Park Wedding",
        "image_url": "url/to/image.jpg",
        "category": "Wedding",
        "is_featured": true
      }
    ],
    "testimonials": [
      {
        "id": 1,
        "client_name": "John Doe",
        "event_type": "Wedding",
        "rating": 5,
        "comment": "Amazing photographer!",
        "is_approved": true
      }
    ]
  }
}
```

**Error Responses**
- 404: Photographer profile not found
- 500: Internal server error

**Examples**
```bash
curl -X GET https://snap-event.com/api/photographers/photographer_uuid
```

```javascript
fetch('/api/photographers/photographer_uuid')
```

**Section sources**
- [[id].ts](file://pages/api/photographers/[id].ts#L1-L154)

### PUT /api/photographers/[id]
Updates a photographer's profile information.

**Request Parameters**
- Method: PUT
- URL: `/api/photographers/{id}`
- Authentication: Required (Bearer token)

**Path Parameters**
- `id`: UUID of the photographer (required)

**Request Body**
```json
{
  "businessName": "Premium Photos",
  "title": "Lead Photographer",
  "bio": "Updated biography with new services",
  "location": "Brooklyn, NY",
  "website": "https://premiumphotos.com",
  "instagramHandle": "premiumphotos",
  "yearsExperience": 12,
  "isAvailable": false,
  "responseTime": "24 hours"
}
```

**Success Response (200)**
```json
{
  "message": "Photographer profile updated successfully",
  "profile": {
    "id": "uuid",
    "business_name": "Premium Photos",
    "title": "Lead Photographer",
    "location": "Brooklyn, NY",
    "updated_at": "2023-11-01T10:00:00Z"
  }
}
```

**Error Responses**
- 400: Database update error
- 500: Internal server error

**Examples**
```bash
curl -X PUT https://snap-event.com/api/photographers/photographer_uuid \
  -H "Authorization: Bearer jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Lead Photographer",
    "location": "Brooklyn, NY"
  }'
```

```javascript
fetch('/api/photographers/photographer_uuid', {
  method: 'PUT',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    title: 'Lead Photographer',
    location: 'Brooklyn, NY'
  })
})
```

**Section sources**
- [[id].ts](file://pages/api/photographers/[id].ts#L1-L154)

### DELETE /api/photographers/[id]
Deletes a photographer's profile.

**Request Parameters**
- Method: DELETE
- URL: `/api/photographers/{id}`
- Authentication: Required (Bearer token)

**Path Parameters**
- `id`: UUID of the photographer (required)

**Success Response (200)**
```json
{
  "message": "Photographer profile deleted successfully"
}
```

**Error Responses**
- 400: Database deletion error
- 500: Internal server error

**Examples**
```bash
curl -X DELETE https://snap-event.com/api/photographers/photographer_uuid \
  -H "Authorization: Bearer jwt_token"
```

```javascript
fetch('/api/photographers/photographer_uuid', {
  method: 'DELETE',
  headers: { 'Authorization': 'Bearer ' + token }
})
```

**Section sources**
- [[id].ts](file://pages/api/photographers/[id].ts#L1-L154)

## Authentication and Authorization

### Authentication Headers
All authenticated endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <JWT_TOKEN>
```

The token is obtained from the `/api/auth/signin` endpoint and should be included in all subsequent requests that require authentication.

### Role-Based Access
The API implements role-based access control with the following roles:
- `CLIENT`: Regular users who book photography services
- `PHOTOGRAPHER`: Professional photographers who receive booking requests
- `ADMIN`: Administrative users with full access

Certain endpoints have role-based restrictions:
- `/api/auth/update-role`: Only accessible to authenticated users
- `/api/bookings`: Clients can only view their own bookings, photographers can view bookings for their services
- `/api/photographers/[id]` (PUT, DELETE): Only accessible to the photographer who owns the profile or an admin

### Session Management
The API uses Supabase Auth for session management:
- Tokens are automatically refreshed when they expire
- Sessions are persisted across browser sessions
- Users are automatically redirected to the callback URL after authentication

**Section sources**
- [auth.ts](file://src/middleware/auth.ts#L1-L96)
- [supabase.ts](file://src/lib/supabase.ts#L1-L242)

## Request and Response Formats

### Request Format
All POST and PUT requests should use JSON format with the Content-Type header set to `application/json`.

### Response Format
All responses follow a consistent JSON structure:
- Successful responses return appropriate HTTP status codes (200, 201, etc.) with JSON data
- Error responses include an `error` field with a descriptive message
- Data responses are wrapped in appropriate property names (e.g., `booking`, `bookings`, `profile`)

### Date and Time Format
- Dates should be formatted as ISO 8601 strings: `YYYY-MM-DD`
- Date-time values use ISO 8601 format: `YYYY-MM-DDTHH:MM:SSZ`
- Time values use 12-hour format with AM/PM: `09:00 AM`

### Pagination
List endpoints support pagination with the following parameters:
- `limit`: Number of items per page (default: 20, maximum: 100)
- `offset`: Number of items to skip
- Responses include a `pagination` object with limit, offset, and total count

**Section sources**
- [index.ts](file://pages/api/bookings/index.ts#L1-L208)
- [index.ts](file://pages/api/photographers/index.ts#L1-L163)

## Error Handling

### Error Response Format
All error responses follow this format:
```json
{
  "error": "Descriptive error message"
}
```

For validation errors, additional details are provided:
```json
{
  "error": "Validation failed",
  "details": [
    "email is required",
    "password must be at least 6 characters long"
  ]
}
```

### HTTP Status Codes
The API uses standard HTTP status codes:

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Successful GET, PUT, PATCH request |
| 201 | Created | Successful POST request |
| 204 | No Content | Successful DELETE request |
| 400 | Bad Request | Invalid request data or parameters |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Insufficient permissions for the action |
| 404 | Not Found | Resource not found |
| 405 | Method Not Allowed | HTTP method not supported for the endpoint |
| 409 | Conflict | Request conflicts with current state (e.g., double booking) |
| 500 | Internal Server Error | Unexpected server error |

### Common Error Messages
- `Method not allowed`: The HTTP method is not supported for this endpoint
- `Missing required fields`: One or more required fields are missing from the request
- `Invalid credentials`: Email or password is incorrect
- `Not authenticated`: No valid authentication token provided
- `Insufficient permissions`: User does not have permission to perform this action
- `Booking conflicts`: Attempting to book a time slot that is already taken
- `Internal server error`: Unexpected error occurred on the server

**Section sources**
- [signin.ts](file://pages/api/auth/signin.ts#L1-L64)
- [index.ts](file://pages/api/bookings/index.ts#L1-L208)
- [index.ts](file://pages/api/photographers/index.ts#L1-L163)

## Rate Limiting and Policies

### Rate Limiting
The API implements rate limiting to prevent abuse:
- 100 requests per 15 minutes per IP address for unauthenticated endpoints
- 200 requests per 15 minutes per user for authenticated endpoints
- Excessive requests will receive a 429 Too Many Requests response

### API Versioning
The current API is version 1 and is not explicitly versioned in the URL. Future versions will be introduced as needed with backward compatibility maintained for a reasonable period.

### Deprecation Policy
When endpoints are deprecated:
- A deprecation notice will be added to the documentation
- The endpoint will continue to function for at least 3 months
- Clients will receive a warning header in responses
- After the grace period, the endpoint will return a 410 Gone status

### Uptime and Availability
The API aims for 99.9% uptime with:
- Regular backups and disaster recovery procedures
- Monitoring and alerting for performance issues
- Scheduled maintenance during low-usage periods with advance notice

**Section sources**
- [supabase.ts](file://src/lib/supabase.ts#L1-L242)
- [auth.ts](file://src/middleware/auth.ts#L1-L96)