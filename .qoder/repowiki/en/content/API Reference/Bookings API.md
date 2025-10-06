# Bookings API

<cite>
**Referenced Files in This Document**
- [pages/api/bookings/index.ts](file://pages/api/bookings/index.ts)
- [pages/api/bookings/[id].ts](file://pages/api/bookings/[id].ts)
- [pages/api/bookings/availability.ts](file://pages/api/bookings/availability.ts)
- [src/components/BookingCalendar.tsx](file://src/components/BookingCalendar.tsx)
- [src/components/BookingManager.tsx](file://src/components/BookingManager.tsx)
- [src/lib/supabase.ts](file://src/lib/supabase.ts)
- [src/middleware/auth.ts](file://src/middleware/auth.ts)
- [BOOKING_CALENDAR_GUIDE.md](file://BOOKING_CALENDAR_GUIDE.md)
- [DATABASE_DESIGN.md](file://DATABASE_DESIGN.md)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [API Endpoints](#api-endpoints)
3. [Authentication & Authorization](#authentication--authorization)
4. [Request/Response Schemas](#requestresponse-schemas)
5. [Calendar Integration](#calendar-integration)
6. [Error Handling](#error-handling)
7. [Performance Considerations](#performance-considerations)
8. [Integration Examples](#integration-examples)
9. [Troubleshooting Guide](#troubleshooting-guide)
10. [Conclusion](#conclusion)

## Introduction

The SnapEvent Bookings API provides a comprehensive booking management system for photography services. It enables clients to browse available time slots, create booking requests, and manage their appointments, while photographers can view, accept, decline, and manage booking requests through a dedicated management interface.

The API follows RESTful principles and integrates with Supabase for database operations, providing real-time availability checking, conflict prevention, and automated notifications. The system supports role-based access control with distinct permissions for clients and photographers.

## API Endpoints

### GET /api/bookings

Retrieves a paginated list of bookings with optional filtering by user, photographer, or status.

**Query Parameters:**
- `userId` (string): Filter bookings by client ID
- `photographerId` (string): Filter bookings by photographer ID
- `status` (string): Filter by booking status (pending, confirmed, declined, cancelled)
- `limit` (number): Maximum number of results (default: 20)
- `offset` (number): Pagination offset (default: 0)

**Response Format:**
```json
{
  "bookings": [
    {
      "id": "booking-uuid",
      "client_id": "client-uuid",
      "photographer_id": "photographer-uuid",
      "event_type": "Wedding",
      "event_date": "2024-02-15",
      "event_time": "10:00 AM",
      "event_location": "Golden Gate Park",
      "total_amount": 350,
      "status": "pending",
      "client": {
        "id": "client-uuid",
        "email": "client@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "avatar": "https://example.com/avatar.jpg"
      },
      "photographer": {
        "id": "photographer-uuid",
        "business_name": "Jane Photography",
        "title": "Professional Wedding Photographer",
        "location": "San Francisco, CA",
        "users": {
          "id": "user-uuid",
          "first_name": "Jane",
          "last_name": "Smith",
          "avatar": "https://example.com/profile.jpg"
        }
      }
    }
  ],
  "pagination": {
    "limit": 20,
    "offset": 0,
    "total": 15
  }
}
```

### POST /api/bookings

Creates a new booking request with conflict checking and notification.

**Request Body:**
```json
{
  "clientId": "client-uuid",
  "photographerId": "photographer-uuid",
  "serviceId": "service-uuid",
  "eventType": "Wedding",
  "eventDate": "2024-02-15",
  "eventTime": "10:00 AM",
  "eventLocation": "Golden Gate Park",
  "duration": 2,
  "guestCount": 100,
  "specialRequests": "Outdoor wedding ceremony with sunset shots",
  "totalAmount": 350,
  "depositAmount": 100,
  "clientName": "John Doe",
  "clientEmail": "john@example.com",
  "clientPhone": "+1 (555) 123-4567",
  "notes": "Please arrive 30 minutes early",
  "status": "pending"
}
```

**Response:**
```json
{
  "message": "Booking created successfully",
  "booking": {
    "id": "booking-uuid",
    "client_id": "client-uuid",
    "photographer_id": "photographer-uuid",
    "event_type": "Wedding",
    "event_date": "2024-02-15",
    "event_time": "10:00 AM",
    "status": "pending",
    "total_amount": 350
  }
}
```

### GET /api/bookings/[id]

Retrieves a specific booking by ID.

**Response:**
```json
{
  "booking": {
    "id": "booking-uuid",
    "client_id": "client-uuid",
    "photographer_id": "photographer-uuid",
    "event_type": "Wedding",
    "event_date": "2024-02-15",
    "event_time": "10:00 AM",
    "event_location": "Golden Gate Park",
    "total_amount": 350,
    "status": "pending",
    "client_name": "John Doe",
    "client_email": "john@example.com",
    "client_phone": "+1 (555) 123-4567",
    "notes": "Please arrive 30 minutes early",
    "photographer_notes": "Will prepare sunset shot list",
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-15T10:00:00Z"
  }
}
```

### PATCH /api/bookings/[id]

Updates a booking's status and sends notifications.

**Request Body:**
```json
{
  "status": "confirmed",
  "notes": "Updated photographer notes"
}
```

**Response:**
```json
{
  "booking": {
    "id": "booking-uuid",
    "status": "confirmed",
    "photographer_notes": "Updated notes",
    "updated_at": "2024-01-15T11:30:00Z"
  },
  "message": "Booking confirmed successfully"
}
```

### DELETE /api/bookings/[id]

Deletes a booking permanently.

**Response:**
```json
{
  "message": "Booking deleted successfully"
}
```

### GET /api/bookings/availability

Checks availability for a specific photographer on a given date.

**Query Parameters:**
- `photographerId` (string): Required - Photographer's UUID
- `date` (string): Required - Date in YYYY-MM-DD format

**Response:**
```json
{
  "date": "2024-02-15",
  "photographerId": "photographer-uuid",
  "availability": [
    {
      "id": "morning-1",
      "time": "09:00 AM",
      "available": true,
      "price": 150
    },
    {
      "id": "morning-2",
      "time": "10:00 AM",
      "available": false,
      "price": 150
    }
  ],
  "totalSlots": 10,
  "availableSlots": 8
}
```

**Section sources**
- [pages/api/bookings/index.ts](file://pages/api/bookings/index.ts#L1-L208)
- [pages/api/bookings/[id].ts](file://pages/api/bookings/[id].ts#L1-L178)
- [pages/api/bookings/availability.ts](file://pages/api/bookings/availability.ts#L1-L69)

## Authentication & Authorization

The API uses JWT-based authentication with role-based access control. All endpoints require a valid Bearer token in the Authorization header.

### Role-Based Permissions

**Clients:**
- Can view their own bookings (`GET /api/bookings?userId=CLIENT_ID`)
- Can create new bookings (`POST /api/bookings`)
- Can view specific bookings they own (`GET /api/bookings/:id`)

**Photographers:**
- Can view bookings for their profile (`GET /api/bookings?photographerId=PHOTOGRAPHER_ID`)
- Can update booking statuses (`PATCH /api/bookings/:id`)
- Can delete bookings (`DELETE /api/bookings/:id`)

**Admin Users:**
- Have full access to all endpoints
- Can bypass role restrictions

### Authentication Middleware

```typescript
// Example usage in API handlers
export default withAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
  // Handler logic here
});

// Role-specific access
export default withRole('PHOTOGRAPHER')(async (req: AuthenticatedRequest, res: NextApiResponse) => {
  // Photographer-only logic
});
```

**Section sources**
- [src/middleware/auth.ts](file://src/middleware/auth.ts#L1-L96)

## Request/Response Schemas

### Booking Schema

```typescript
interface Booking {
  id: string;
  clientId: string;
  photographerId: string;
  serviceId?: string;
  eventType: string;
  eventDate: string;
  eventTime?: string;
  eventLocation: string;
  duration?: number;
  guestCount?: number;
  specialRequests?: string;
  totalAmount: number;
  depositAmount?: number;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  notes?: string;
  photographerNotes?: string;
  status: 'pending' | 'confirmed' | 'declined' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}
```

### Availability Schema

```typescript
interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  price?: number;
}

interface AvailabilityResponse {
  date: string;
  photographerId: string;
  availability: TimeSlot[];
  totalSlots: number;
  availableSlots: number;
}
```

### Error Response Schema

```typescript
interface ErrorResponse {
  error: string;
}
```

**Section sources**
- [src/components/BookingCalendar.tsx](file://src/components/BookingCalendar.tsx#L20-L30)
- [pages/api/bookings/availability.ts](file://pages/api/bookings/availability.ts#L30-L45)

## Calendar Integration

### Time Slot Configuration

The system defines predefined time slots with dynamic pricing:

```typescript
const TIME_SLOTS: TimeSlot[] = [
  { id: 'morning-1', time: '09:00 AM', available: true, price: 150 },
  { id: 'morning-2', time: '10:00 AM', available: true, price: 150 },
  { id: 'morning-3', time: '11:00 AM', available: true, price: 150 },
  { id: 'afternoon-1', time: '12:00 PM', available: true, price: 175 },
  { id: 'afternoon-2', time: '01:00 PM', available: true, price: 175 },
  { id: 'afternoon-3', time: '02:00 PM', available: true, price: 175 },
  { id: 'afternoon-4', time: '03:00 PM', available: true, price: 175 },
  { id: 'evening-1', time: '04:00 PM', available: true, price: 200 },
  { id: 'evening-2', time: '05:00 PM', available: true, price: 200 },
  { id: 'evening-3', time: '06:00 PM', available: true, price: 200 }
];
```

### Event Type Configuration

```typescript
const EVENT_TYPES = [
  { id: 'wedding', name: 'Wedding', basePrice: 200 },
  { id: 'portrait', name: 'Portrait Session', basePrice: 150 },
  { id: 'event', name: 'Event Photography', basePrice: 175 },
  { id: 'commercial', name: 'Commercial', basePrice: 250 }
];
```

### Availability Checking Logic

The availability endpoint checks for confirmed bookings to prevent double-booking:

```typescript
// Only check confirmed bookings for availability
const { data: existingBookings, error: bookingsError } = await supabase
  .from('bookings')
  .select('event_time, status')
  .eq('photographer_id', photographerId)
  .eq('event_date', date)
  .eq('status', 'confirmed');

// Mark slots as unavailable if booked
const availability = allTimeSlots.map(slot => ({
  ...slot,
  available: !bookedTimes.includes(slot.time)
}));
```

**Section sources**
- [src/components/BookingCalendar.tsx](file://src/components/BookingCalendar.tsx#L30-L50)
- [pages/api/bookings/availability.ts](file://pages/api/bookings/availability.ts#L30-L60)

## Error Handling

### Common Error Scenarios

**400 Bad Request:**
- Missing required fields in booking creation
- Invalid date format
- Invalid status value

**401 Unauthorized:**
- Missing or invalid Authorization header
- Expired or invalid JWT token

**403 Forbidden:**
- Insufficient permissions for the requested operation
- User role doesn't match required permissions

**404 Not Found:**
- Booking ID not found
- User profile not found

**409 Conflict:**
- Time slot already booked (when creating or confirming bookings)
- Duplicate booking attempt

**500 Internal Server Error:**
- Database connection issues
- Unexpected runtime errors

### Error Response Examples

```typescript
// Missing required fields
{
  "error": "Missing required fields: clientId, photographerId, eventType, eventDate, eventLocation, totalAmount"
}

// Time slot conflict
{
  "error": "This time slot is already booked"
}

// Invalid status
{
  "error": "Invalid status. Must be one of: pending, confirmed, declined, cancelled"
}
```

### Conflict Prevention

The system implements multiple layers of conflict prevention:

```typescript
// During booking creation
if (eventTime) {
  const { data: conflictingBookings, error: conflictError } = await supabase
    .from('bookings')
    .select('id, status')
    .eq('photographer_id', photographerId)
    .eq('event_date', eventDate)
    .eq('event_time', eventTime)
    .eq('status', 'confirmed');

  if (conflictingBookings && conflictingBookings.length > 0) {
    return res.status(409).json({ error: 'This time slot is already booked' });
  }
}

// During status update
if (status === 'confirmed') {
  const { data: conflictingBookings, error: conflictError } = await supabase
    .from('bookings')
    .select('id, status')
    .eq('photographer_id', existingBooking.photographer_id)
    .eq('event_date', existingBooking.event_date)
    .eq('event_time', existingBooking.event_time)
    .in('status', ['confirmed', 'pending'])
    .neq('id', bookingId);

  if (conflictingBookings && conflictingBookings.length > 0) {
    return res.status(409).json({ 
      error: 'Time slot is already booked or has a pending request' 
    });
  }
}
```

**Section sources**
- [pages/api/bookings/index.ts](file://pages/api/bookings/index.ts#L60-L85)
- [pages/api/bookings/[id].ts](file://pages/api/bookings/[id].ts#L50-L75)

## Performance Considerations

### Query Optimization

**Pagination Implementation:**
```typescript
let query = supabase
  .from('bookings')
  .select(`*`)
  .order('created_at', { ascending: false })
  .range(Number(offset), Number(offset) + Number(limit) - 1);
```

**Index Recommendations:**
- Create indexes on frequently queried columns:
  - `bookings(client_id)`
  - `bookings(photographer_id)`
  - `bookings(event_date)`
  - `bookings(status)`

**Caching Strategy:**
- Cache availability data for frequently accessed dates
- Implement Redis caching for booking lists with filters
- Use database connection pooling for concurrent requests

### Scalability Patterns

**Database Design:**
- Use soft deletes with `is_active` flags instead of hard deletes
- Implement proper indexing for date-based queries
- Consider partitioning large booking tables by date

**API Rate Limiting:**
- Implement rate limiting on availability endpoints
- Use exponential backoff for retry mechanisms
- Monitor API usage patterns for optimization

**Monitoring Metrics:**
- Response times for booking creation and availability checks
- Database query performance
- Concurrent booking creation rates
- Error rates by endpoint

## Integration Examples

### Frontend Integration with BookingCalendar

```typescript
// Client-side booking submission
const handleSubmit = async (bookingData: BookingData) => {
  try {
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        photographerId: bookingData.photographerId,
        clientId: 'temp-client-id', // Replace with authenticated user ID
        eventType: bookingData.eventType,
        eventDate: bookingData.eventDate,
        eventTime: bookingData.eventTime,
        eventLocation: bookingData.eventLocation,
        totalAmount: bookingData.totalAmount,
        clientName: bookingData.clientName,
        clientEmail: bookingData.clientEmail,
        clientPhone: bookingData.clientPhone,
        notes: bookingData.notes,
        status: 'pending'
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit booking');
    }

    const result = await response.json();
    console.log('Booking successful:', result);
    
  } catch (error) {
    console.error('Booking submission failed:', error);
    alert('Failed to submit booking. Please try again.');
  }
};
```

### Availability Checking Integration

```typescript
// Real-time availability checking
const checkAvailability = async (date: Date) => {
  try {
    const dateStr = format(date, 'yyyy-MM-dd');
    const response = await fetch(
      `/api/bookings/availability?photographerId=${photographerId}&date=${dateStr}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to check availability');
    }
    
    const data = await response.json();
    return data.availability || TIME_SLOTS;
  } catch (error) {
    console.error('Error checking availability:', error);
    // Fallback to mock data if API fails
    return TIME_SLOTS.map(slot => ({
      ...slot,
      available: true
    }));
  }
};
```

### Photographer Booking Management

```typescript
// Photographer booking status update
const handleBookingStatusUpdate = async (bookingId: string, newStatus: 'confirmed' | 'declined') => {
  try {
    const response = await fetch(`/api/bookings/${bookingId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) {
      throw new Error('Failed to update booking status');
    }

    // Update local state
    setBookings(prev => prev.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: newStatus, updatedAt: new Date().toISOString() }
        : booking
    ));

  } catch (error) {
    console.error('Error updating booking status:', error);
    alert('Failed to update booking status. Please try again.');
  }
};
```

**Section sources**
- [src/components/BookingCalendar.tsx](file://src/components/BookingCalendar.tsx#L150-L200)
- [src/components/BookingManager.tsx](file://src/components/BookingManager.tsx#L100-L150)

## Troubleshooting Guide

### Common Issues and Solutions

**Issue: Availability Not Loading**
- **Cause:** Supabase connection issues or API endpoint problems
- **Solution:** 
  - Check Supabase URL and API keys in environment variables
  - Verify API endpoint accessibility
  - Check browser console for CORS or network errors
  - Test with Postman or curl

**Issue: Booking Submission Fails**
- **Cause:** Missing required fields or validation errors
- **Solution:**
  - Verify all required fields are included in the request
  - Check date format (YYYY-MM-DD)
  - Ensure photographerId and clientId are valid UUIDs
  - Validate email format

**Issue: Double Booking Occurs**
- **Cause:** Race condition during booking creation
- **Solution:**
  - Implement database-level constraints
  - Use transaction isolation levels
  - Add retry logic with exponential backoff
  - Check for pending bookings alongside confirmed ones

**Issue: Calendar Not Displaying Correctly**
- **Cause:** Missing dependencies or CSS conflicts
- **Solution:**
  - Ensure date-fns library is installed
  - Verify Calendar component import
  - Check for CSS conflicts with Tailwind classes
  - Clear browser cache

### Debug Mode Configuration

```typescript
// Enable debug logging
const DEBUG = process.env.NODE_ENV === 'development';

if (DEBUG) {
  console.log('Booking data:', bookingData);
  console.log('Availability response:', availabilityData);
}
```

### API Testing

Use the built-in test script to verify functionality:

```bash
node test-booking-calendar.js
```

### Monitoring and Logging

**Important logs to monitor:**
- Booking creation attempts and failures
- Availability check performance
- Authentication token validation
- Database query execution times
- Email notification delivery status

**Section sources**
- [BOOKING_CALENDAR_GUIDE.md](file://BOOKING_CALENDAR_GUIDE.md#L270-L315)

## Conclusion

The SnapEvent Bookings API provides a robust, scalable solution for managing photography bookings with comprehensive features for both clients and photographers. Key strengths include:

**Technical Excellence:**
- RESTful API design with proper HTTP status codes
- Comprehensive error handling and validation
- Role-based access control with JWT authentication
- Real-time availability checking with conflict prevention

**Developer Experience:**
- Well-documented endpoints with clear schemas
- Integration examples for common use cases
- Comprehensive error handling guidance
- Performance optimization recommendations

**Business Value:**
- Streamlined booking process for clients
- Efficient booking management for photographers
- Automated notifications and status updates
- Scalable architecture supporting growth

The API integrates seamlessly with the frontend components, providing a complete booking solution that handles everything from initial availability checking to final booking confirmation. With proper implementation of the suggested performance optimizations and monitoring practices, the system can scale effectively to support growing user bases and increased booking volumes.

Future enhancements could include payment integration, advanced scheduling features, and expanded internationalization support, building upon this solid foundation.