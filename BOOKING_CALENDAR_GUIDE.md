# 📅 Booking Calendar System - Complete Guide

## 🎯 Overview

The SnapEvent Booking Calendar System provides a comprehensive solution for photographers to manage their availability and for clients to book photography sessions seamlessly. The system includes:

- **Interactive Calendar Component** - Date selection with availability checking
- **Time Slot Management** - Predefined time slots with pricing
- **Event Type Selection** - Different photography services with base pricing
- **Client Information Collection** - Complete booking form
- **Availability Management** - Photographers can block/unblock dates
- **Real-time API Integration** - Live availability checking and booking submission

## 🏗️ Architecture

### Components

1. **BookingCalendar.tsx** - Main booking interface
2. **AvailabilityManager.tsx** - Photographer availability management
3. **PortfolioPage.tsx** - Integration with photographer profiles
4. **API Endpoints** - Backend booking and availability management

### API Endpoints

- `GET /api/bookings/availability` - Check photographer availability
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - Retrieve bookings

## 🚀 Features

### For Clients

#### 1. Date Selection
- Interactive calendar with date picker
- Past dates automatically disabled
- Visual indication of blocked dates
- Real-time availability checking

#### 2. Time Slot Selection
- Predefined time slots (9 AM - 6 PM)
- Dynamic pricing based on time of day
- Real-time availability updates
- Visual feedback for unavailable slots

#### 3. Event Type Selection
- Wedding Photography ($200 base)
- Portrait Session ($150 base)
- Event Photography ($175 base)
- Commercial Photography ($250 base)

#### 4. Client Information
- Full name (required)
- Email address (required)
- Phone number (optional)
- Event location
- Additional notes

#### 5. Booking Summary
- Complete booking details
- Price calculation
- Confirmation before submission

### For Photographers

#### 1. Availability Management
- Block specific dates
- Add reasons for blocking
- Unblock dates when available
- Visual calendar with blocked dates

#### 2. Booking Management
- View all bookings
- Track booking status
- Client contact information
- Event details

## 💻 Usage

### Client Booking Flow

1. **Navigate to Photographer Profile**
   ```typescript
   // PortfolioPage.tsx
   <Button onClick={() => setShowBookingCalendar(true)}>
     Book Now
   </Button>
   ```

2. **Select Date and Time**
   ```typescript
   // BookingCalendar.tsx
   const handleDateSelect = (date: Date | undefined) => {
     setSelectedDate(date);
     setSelectedTimeSlot(null);
   };
   ```

3. **Choose Event Type**
   ```typescript
   const EVENT_TYPES = [
     { id: 'wedding', name: 'Wedding', basePrice: 200 },
     { id: 'portrait', name: 'Portrait Session', basePrice: 150 },
     // ...
   ];
   ```

4. **Submit Booking**
   ```typescript
   const response = await fetch('/api/bookings', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(bookingData)
   });
   ```

### Photographer Availability Management

1. **Access Availability Manager**
   ```typescript
   // PortfolioPage.tsx
   <Button onClick={() => setShowAvailabilityManager(true)}>
     Manage Availability
   </Button>
   ```

2. **Block Dates**
   ```typescript
   // AvailabilityManager.tsx
   const handleBlockDate = async () => {
     const newBlockedDate = {
       id: Date.now().toString(),
       date: dateStr,
       reason
     };
     setBlockedDates(prev => [...prev, newBlockedDate]);
   };
   ```

## 🔧 Configuration

### Time Slots Configuration

```typescript
const TIME_SLOTS: TimeSlot[] = [
  { id: 'morning-1', time: '09:00 AM', available: true, price: 150 },
  { id: 'morning-2', time: '10:00 AM', available: true, price: 150 },
  { id: 'afternoon-1', time: '12:00 PM', available: true, price: 175 },
  { id: 'evening-1', time: '04:00 PM', available: true, price: 200 },
  // ...
];
```

### Event Types Configuration

```typescript
const EVENT_TYPES = [
  { id: 'wedding', name: 'Wedding', basePrice: 200 },
  { id: 'portrait', name: 'Portrait Session', basePrice: 150 },
  { id: 'event', name: 'Event Photography', basePrice: 175 },
  { id: 'commercial', name: 'Commercial', basePrice: 250 },
];
```

## 🎨 UI Components

### BookingCalendar Component

```typescript
interface BookingCalendarProps {
  photographerId: string;
  photographerName: string;
  photographerLocation: string;
  photographerPhone: string;
  photographerEmail: string;
  onBookingSubmit: (bookingData: BookingData) => void;
  onClose: () => void;
}
```

### AvailabilityManager Component

```typescript
interface AvailabilityManagerProps {
  photographerId: string;
  onClose: () => void;
}
```

## 🔌 API Integration

### Availability Check

```typescript
// GET /api/bookings/availability?photographerId=123&date=2024-02-15
{
  "date": "2024-02-15",
  "photographerId": "123",
  "availability": [
    { "id": "morning-1", "time": "09:00 AM", "available": true, "price": 150 },
    { "id": "morning-2", "time": "10:00 AM", "available": false, "price": 150 }
  ],
  "totalSlots": 10,
  "availableSlots": 8
}
```

### Booking Creation

```typescript
// POST /api/bookings
{
  "photographerId": "123",
  "clientId": "456",
  "eventType": "Wedding",
  "eventDate": "2024-02-15",
  "eventTime": "10:00 AM",
  "eventLocation": "Golden Gate Park",
  "totalAmount": 350,
  "clientName": "John Doe",
  "clientEmail": "john@example.com",
  "clientPhone": "+1 (555) 123-4567",
  "notes": "Outdoor wedding ceremony",
  "status": "pending"
}
```

## 🧪 Testing

### Test Script

Run the booking calendar test script:

```bash
node test-booking-calendar.js
```

### Test Coverage

- ✅ Availability API testing
- ✅ Booking creation testing
- ✅ Booking retrieval testing
- ✅ Integration flow testing

## 🚀 Deployment

### Prerequisites

1. **Dependencies**
   ```bash
   npm install date-fns
   ```

2. **Environment Variables**
   ```env
   # Supabase configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Database Schema**
   - `bookings` table with proper relationships
   - `photographers` table with availability settings

### Build and Deploy

```bash
npm run build
npm start
```

## 🔒 Security Considerations

1. **Input Validation** - All form inputs are validated
2. **Rate Limiting** - API endpoints should implement rate limiting
3. **Authentication** - Client authentication for booking management
4. **Data Sanitization** - All user inputs are sanitized

## 📱 Responsive Design

The booking calendar is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Touch devices

## 🎯 Future Enhancements

1. **Payment Integration** - Stripe/PayPal integration
2. **Email Notifications** - Automated booking confirmations
3. **Calendar Sync** - Google Calendar/Outlook integration
4. **Recurring Bookings** - Support for recurring sessions
5. **Multi-language Support** - Internationalization
6. **Advanced Scheduling** - Custom time slots
7. **Booking Modifications** - Allow clients to modify bookings
8. **Waitlist System** - Queue for popular time slots

## 🐛 Troubleshooting

### Common Issues

1. **Availability Not Loading**
   - Check Supabase connection
   - Verify API endpoint is accessible
   - Check browser console for errors

2. **Booking Submission Fails**
   - Verify all required fields are filled
   - Check network connection
   - Verify API endpoint is working

3. **Calendar Not Displaying**
   - Check if date-fns is installed
   - Verify Calendar component import
   - Check for CSS conflicts

### Debug Mode

Enable debug logging:

```typescript
const DEBUG = process.env.NODE_ENV === 'development';
if (DEBUG) {
  console.log('Booking data:', bookingData);
}
```

## 📞 Support

For technical support or feature requests:
- Check the test scripts for functionality verification
- Review the API endpoints for integration issues
- Consult the component documentation for UI customization

---

**🎉 Your SnapEvent Booking Calendar System is now fully integrated and ready for production use!**
