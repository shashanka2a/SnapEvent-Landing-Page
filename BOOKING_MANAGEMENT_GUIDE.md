# 📋 Booking Management System - Complete Guide

## 🎯 Overview

The SnapEvent Booking Management System provides photographers with comprehensive tools to manage their booking requests, accept or decline bookings, and prevent double bookings. The system ensures that once a photographer confirms a booking, no other clients can book the same time slot.

## 🏗️ Architecture

### Components

1. **BookingManager.tsx** - Main booking management interface for photographers
2. **BookingCalendar.tsx** - Client booking interface (enhanced with conflict prevention)
3. **API Endpoints** - Backend booking management and status updates

### API Endpoints

- `GET /api/bookings` - Retrieve bookings for photographer
- `POST /api/bookings` - Create new booking (with conflict checking)
- `GET /api/bookings/[id]` - Get specific booking details
- `PATCH /api/bookings/[id]` - Update booking status (accept/decline)
- `GET /api/bookings/availability` - Check availability (excludes confirmed bookings)

## 🚀 Features

### For Photographers

#### 1. Booking Request Management
- **View All Bookings**: See pending, confirmed, and declined bookings
- **Detailed Booking View**: Complete client and event information
- **Status Management**: Accept or decline booking requests
- **Real-time Updates**: Instant status changes and notifications

#### 2. Booking Status Workflow
```
Pending → [Accept] → Confirmed
       → [Decline] → Declined
```

#### 3. Conflict Prevention
- **Double Booking Prevention**: System prevents multiple confirmed bookings for same time slot
- **Real-time Availability**: Availability API reflects confirmed bookings
- **Smart Conflict Detection**: Checks for conflicts before confirming bookings

### For Clients

#### 1. Enhanced Booking Flow
- **Conflict Prevention**: Cannot book already confirmed time slots
- **Real-time Availability**: See actual available time slots
- **Status Tracking**: Receive notifications about booking status changes

#### 2. Booking States
- **Pending**: Waiting for photographer approval
- **Confirmed**: Photographer has accepted the booking
- **Declined**: Photographer has declined the booking
- **Cancelled**: Booking has been cancelled

## 💻 Usage

### Photographer Booking Management

1. **Access Booking Manager**
   ```typescript
   // PortfolioPage.tsx
   <Button onClick={() => setShowBookingManager(true)}>
     Manage Bookings
   </Button>
   ```

2. **View Booking Requests**
   ```typescript
   // BookingManager.tsx
   const pendingBookings = bookings.filter(b => b.status === 'pending');
   const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
   const declinedBookings = bookings.filter(b => b.status === 'declined');
   ```

3. **Accept/Decline Bookings**
   ```typescript
   const handleBookingStatusUpdate = async (bookingId: string, newStatus: 'confirmed' | 'declined') => {
     const response = await fetch(`/api/bookings/${bookingId}`, {
       method: 'PATCH',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ status: newStatus })
     });
   };
   ```

### Client Booking Flow

1. **Check Availability**
   ```typescript
   // BookingCalendar.tsx
   const checkAvailability = async (date: Date) => {
     const response = await fetch(`/api/bookings/availability?photographerId=${photographerId}&date=${dateStr}`);
     // Only confirmed bookings block availability
   };
   ```

2. **Create Booking Request**
   ```typescript
   const response = await fetch('/api/bookings', {
     method: 'POST',
     body: JSON.stringify({
       photographerId,
       eventDate,
       eventTime,
       eventType,
       clientName,
       clientEmail,
       // ... other booking data
       status: 'pending' // Always starts as pending
     })
   });
   ```

## 🔧 Configuration

### Booking Status Configuration

```typescript
const BOOKING_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  DECLINED: 'declined',
  CANCELLED: 'cancelled'
};
```

### Conflict Prevention Logic

```typescript
// Only confirmed bookings prevent new bookings
const { data: conflictingBookings } = await supabase
  .from('bookings')
  .select('id, status')
  .eq('photographer_id', photographerId)
  .eq('event_date', eventDate)
  .eq('event_time', eventTime)
  .eq('status', 'confirmed'); // Only check confirmed bookings
```

## 🎨 UI Components

### BookingManager Component

```typescript
interface BookingManagerProps {
  photographerId: string;
  onClose: () => void;
}

// Features:
// - Tabbed interface (Pending, Confirmed, Declined)
// - Detailed booking view
// - Accept/Decline actions
// - Real-time status updates
```

### Booking Status Badges

```typescript
const getStatusBadge = (status: string) => {
  const variants = {
    pending: { variant: 'secondary', icon: AlertCircle, color: 'text-yellow-600' },
    confirmed: { variant: 'default', icon: CheckCircle, color: 'text-green-600' },
    declined: { variant: 'destructive', icon: XCircle, color: 'text-red-600' },
    cancelled: { variant: 'outline', icon: XCircle, color: 'text-gray-600' }
  };
  // ...
};
```

## 🔌 API Integration

### Booking Status Update

```typescript
// PATCH /api/bookings/[id]
{
  "status": "confirmed" | "declined",
  "notes": "Optional photographer notes"
}

// Response:
{
  "booking": { /* updated booking object */ },
  "message": "Booking confirmed successfully"
}
```

### Conflict Prevention

```typescript
// Before confirming a booking, check for conflicts
if (status === 'confirmed') {
  const conflictingBookings = await checkForConflicts(photographerId, eventDate, eventTime);
  if (conflictingBookings.length > 0) {
    return res.status(409).json({ 
      error: 'Time slot is already booked' 
    });
  }
}
```

### Availability Check (Updated)

```typescript
// GET /api/bookings/availability?photographerId=123&date=2024-02-15
// Only checks confirmed bookings, not pending ones
{
  "date": "2024-02-15",
  "photographerId": "123",
  "availability": [
    { "id": "morning-1", "time": "09:00 AM", "available": true, "price": 150 },
    { "id": "morning-2", "time": "10:00 AM", "available": false, "price": 150 } // Confirmed booking
  ],
  "totalSlots": 10,
  "availableSlots": 8
}
```

## 🧪 Testing

### Test Script

Run the booking management test script:

```bash
node test-booking-management.js
```

### Test Coverage

- ✅ Booking creation with conflict checking
- ✅ Booking retrieval and filtering
- ✅ Status update (accept/decline)
- ✅ Double booking prevention
- ✅ Availability check with confirmed bookings
- ✅ Complete workflow testing

## 🚀 Deployment

### Prerequisites

1. **Database Schema Updates**
   ```sql
   -- Ensure bookings table has required fields
   ALTER TABLE bookings ADD COLUMN IF NOT EXISTS event_time VARCHAR(10);
   ALTER TABLE bookings ADD COLUMN IF NOT EXISTS client_name VARCHAR(255);
   ALTER TABLE bookings ADD COLUMN IF NOT EXISTS client_email VARCHAR(255);
   ALTER TABLE bookings ADD COLUMN IF NOT EXISTS client_phone VARCHAR(20);
   ALTER TABLE bookings ADD COLUMN IF NOT EXISTS notes TEXT;
   ALTER TABLE bookings ADD COLUMN IF NOT EXISTS photographer_notes TEXT;
   ```

2. **Environment Variables**
   ```env
   # Email configuration for notifications
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

### Build and Deploy

```bash
npm run build
npm start
```

## 🔒 Security Considerations

1. **Authorization**: Only photographers can manage their own bookings
2. **Input Validation**: All booking data is validated
3. **Conflict Prevention**: Server-side conflict checking
4. **Rate Limiting**: Prevent booking spam
5. **Data Sanitization**: All user inputs are sanitized

## 📱 User Experience

### Photographer Dashboard

1. **Booking Overview**: Quick view of all booking requests
2. **Status Management**: Easy accept/decline actions
3. **Detailed View**: Complete booking information
4. **Real-time Updates**: Instant status changes

### Client Experience

1. **Transparent Availability**: See real available time slots
2. **Status Notifications**: Get updates on booking status
3. **Conflict Prevention**: Cannot book unavailable slots
4. **Clear Communication**: Know when booking is pending vs confirmed

## 🎯 Business Logic

### Booking States

1. **Pending**: New booking request awaiting photographer approval
2. **Confirmed**: Photographer has accepted, time slot is blocked
3. **Declined**: Photographer has declined the request
4. **Cancelled**: Booking has been cancelled (by either party)

### Conflict Resolution

- **Pending bookings**: Multiple clients can request same time slot
- **Confirmed bookings**: Only one confirmed booking per time slot
- **Availability API**: Only reflects confirmed bookings
- **Real-time updates**: Availability updates immediately when booking confirmed

## 🐛 Troubleshooting

### Common Issues

1. **Booking Not Showing as Available**
   - Check if there's a confirmed booking for that time slot
   - Verify availability API is working correctly
   - Check database for booking status

2. **Cannot Accept Booking**
   - Check for conflicting confirmed bookings
   - Verify photographer has permission to manage bookings
   - Check API endpoint is accessible

3. **Status Update Fails**
   - Verify booking ID is correct
   - Check if booking exists and is in pending status
   - Verify API permissions

### Debug Mode

Enable debug logging:

```typescript
const DEBUG = process.env.NODE_ENV === 'development';
if (DEBUG) {
  console.log('Booking status update:', { bookingId, newStatus });
}
```

## 📞 Support

For technical support or feature requests:
- Check the test scripts for functionality verification
- Review the API endpoints for integration issues
- Consult the component documentation for UI customization

## 🎉 Key Benefits

1. **Prevents Double Bookings**: System ensures no conflicts
2. **Photographer Control**: Full control over booking acceptance
3. **Real-time Updates**: Instant availability and status changes
4. **Professional Workflow**: Clear booking request → approval process
5. **Client Transparency**: Clear communication about booking status
6. **Scalable Architecture**: Handles multiple photographers and bookings

---

**🎊 Your SnapEvent Booking Management System is now fully integrated and production-ready!**

The system provides photographers with complete control over their bookings while preventing conflicts and ensuring a professional booking experience for clients.
