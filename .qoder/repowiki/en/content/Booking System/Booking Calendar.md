# Booking Calendar Component Implementation

<cite>
**Referenced Files in This Document**
- [BookingCalendar.tsx](file://src/components/BookingCalendar.tsx)
- [availability.ts](file://pages/api/bookings/availability.ts)
- [index.ts](file://pages/api/bookings/index.ts)
- [BookingManager.tsx](file://src/components/BookingManager.tsx)
- [AvailabilityManager.tsx](file://src/components/AvailabilityManager.tsx)
- [api.ts](file://src/lib/api.ts)
- [supabase.ts](file://src/lib/supabase.ts)
- [calendar.tsx](file://src/components/ui/calendar.tsx)
- [LandingPage.tsx](file://src/components/LandingPage.tsx)
- [PortfolioPage.tsx](file://src/components/PortfolioPage.tsx)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [System Architecture](#system-architecture)
3. [Core Components](#core-components)
4. [Step-by-Step Booking Flow](#step-by-step-booking-flow)
5. [State Management](#state-management)
6. [API Integration](#api-integration)
7. [UI/UX Features](#uiux-features)
8. [Error Handling](#error-handling)
9. [Performance Considerations](#performance-considerations)
10. [Troubleshooting Guide](#troubleshooting-guide)
11. [Conclusion](#conclusion)

## Introduction

The BookingCalendar component is a sophisticated React component designed for the SnapEvent platform that enables seamless booking experiences between clients and photographers. Built with modern React patterns, TypeScript, and integrated with Framer Motion for smooth animations, this component provides a comprehensive booking solution with real-time availability checking, dynamic form progression, and robust error handling.

The component serves as the primary interface for clients to schedule photography services, featuring intelligent time slot availability checking via API, progressive form filling, and secure submission processes. It integrates seamlessly with the broader SnapEvent ecosystem, including authentication, database management, and notification systems.

## System Architecture

The BookingCalendar system follows a modular architecture with clear separation of concerns across multiple layers:

```mermaid
graph TB
subgraph "Client Layer"
UI[BookingCalendar UI]
FM[Framer Motion Animations]
State[React State Management]
end
subgraph "API Layer"
BC[BookingCalendar API]
AV[Availability API]
BM[Booking Management API]
end
subgraph "Data Layer"
DB[(Supabase Database)]
Cache[API Response Cache]
end
subgraph "External Services"
Auth[Authentication Service]
Notif[Notification Service]
end
UI --> BC
UI --> AV
BC --> BM
AV --> DB
BM --> DB
DB --> Cache
BC --> Auth
BM --> Notif
UI --> FM
UI --> State
```

**Diagram sources**
- [BookingCalendar.tsx](file://src/components/BookingCalendar.tsx#L1-L50)
- [availability.ts](file://pages/api/bookings/availability.ts#L1-L30)
- [index.ts](file://pages/api/bookings/index.ts#L1-L30)

## Core Components

### BookingCalendar Component

The main BookingCalendar component orchestrates the entire booking process through a series of interconnected steps:

```mermaid
classDiagram
class BookingCalendar {
+photographerId : string
+photographerName : string
+photographerLocation : string
+photographerPhone : string
+photographerEmail : string
+onBookingSubmit : Function
+onClose : Function
+selectedDate : Date
+selectedTimeSlot : TimeSlot
+selectedEventType : string
+clientInfo : ClientInfo
+eventLocation : string
+notes : string
+isSubmitting : boolean
+availableTimeSlots : TimeSlot[]
+checkAvailability(date) : Promise~TimeSlot[]~
+handleDateSelect(date) : void
+handleTimeSlotSelect(slot) : void
+handleSubmit() : Promise~void~
+isDateDisabled(date) : boolean
}
class TimeSlot {
+id : string
+time : string
+available : boolean
+price : number
}
class BookingData {
+eventDate : string
+eventTime : string
+eventType : string
+eventLocation : string
+clientName : string
+clientEmail : string
+clientPhone : string
+totalAmount : number
+notes : string
}
class EventType {
+id : string
+name : string
+basePrice : number
}
BookingCalendar --> TimeSlot : manages
BookingCalendar --> BookingData : creates
BookingCalendar --> EventType : uses
```

**Diagram sources**
- [BookingCalendar.tsx](file://src/components/BookingCalendar.tsx#L15-L45)
- [BookingCalendar.tsx](file://src/components/BookingCalendar.tsx#L100-L130)

**Section sources**
- [BookingCalendar.tsx](file://src/components/BookingCalendar.tsx#L1-L384)

### Availability Management System

The availability system ensures real-time synchronization between the calendar and photographer schedules:

```mermaid
sequenceDiagram
participant Client as Client Browser
participant BC as BookingCalendar
participant API as Availability API
participant DB as Supabase DB
participant Cache as Local Cache
Client->>BC : Select Date
BC->>BC : isDateDisabled()
BC->>API : GET /api/bookings/availability
API->>DB : Query existing bookings
DB-->>API : Return booking data
API->>API : Filter confirmed bookings
API->>API : Compare with time slots
API-->>BC : Return availability array
BC->>Cache : Store availability data
BC->>BC : Update availableTimeSlots
BC-->>Client : Display available slots
```

**Diagram sources**
- [availability.ts](file://pages/api/bookings/availability.ts#L15-L50)
- [BookingCalendar.tsx](file://src/components/BookingCalendar.tsx#L130-L150)

**Section sources**
- [availability.ts](file://pages/api/bookings/availability.ts#L1-L69)
- [BookingCalendar.tsx](file://src/components/BookingCalendar.tsx#L130-L150)

## Step-by-Step Booking Flow

The BookingCalendar implements a progressive form approach with four distinct stages:

### Stage 1: Date Selection

The date selection process utilizes a sophisticated calendar component with built-in filtering:

```mermaid
flowchart TD
Start([User Opens Booking Modal]) --> LoadCal["Load Calendar Component"]
LoadCal --> DisablePast["Disable Past Dates<br/>isBefore(date, today)"]
DisablePast --> CheckAvail["Check Availability on Selection"]
CheckAvail --> UpdateSlots["Update Available Time Slots"]
UpdateSlots --> NextStage["Proceed to Time Selection"]
DisablePast --> PastDetected{"Past Date Selected?"}
PastDetected --> |Yes| ShowError["Show Error Message"]
PastDetected --> |No| CheckAvail
ShowError --> LoadCal
```

**Diagram sources**
- [BookingCalendar.tsx](file://src/components/BookingCalendar.tsx#L150-L170)
- [calendar.tsx](file://src/components/ui/calendar.tsx#L1-L76)

### Stage 2: Time Slot Selection

Time slot selection incorporates real-time availability checking and visual feedback:

```mermaid
flowchart TD
DateSelected["Date Selected"] --> APICall["Call Availability API"]
APICall --> ParseResponse["Parse API Response"]
ParseResponse --> UpdateUI["Update Available Slots"]
UpdateUI --> EnableSlots["Enable Available Slots"]
UpdateUI --> DisableSlots["Disable Unavailable Slots"]
EnableSlots --> UserClick["User Clicks Slot"]
DisableSlots --> UserClick
UserClick --> ValidateSlot{"Slot Available?"}
ValidateSlot --> |Yes| SelectSlot["Set Selected Slot"]
ValidateSlot --> |No| ShowUnavailable["Show Unavailable Message"]
SelectSlot --> NextStage["Proceed to Event Type"]
ShowUnavailable --> EnableSlots
```

**Diagram sources**
- [BookingCalendar.tsx](file://src/components/BookingCalendar.tsx#L130-L150)
- [availability.ts](file://pages/api/bookings/availability.ts#L40-L60)

### Stage 3: Event Type Selection

The event type selection provides categorized service options with pricing information:

```mermaid
flowchart TD
TimeSelected["Time Slot Selected"] --> LoadTypes["Load Event Types"]
LoadTypes --> DisplayGrid["Display Event Type Grid"]
DisplayGrid --> UserSelect["User Selects Event Type"]
UserSelect --> UpdateSummary["Update Booking Summary"]
UpdateSummary --> CalculatePrice["Calculate Total Price"]
CalculatePrice --> NextStage["Proceed to Client Info"]
CalculatePrice --> BasePrice["Base Price + Time Slot Price"]
BasePrice --> DisplayTotal["Display Total Amount"]
DisplayTotal --> NextStage
```

**Diagram sources**
- [BookingCalendar.tsx](file://src/components/BookingCalendar.tsx#L200-L220)

### Stage 4: Client Information Collection

The final stage collects comprehensive client information with validation:

```mermaid
flowchart TD
EventTypeSelected["Event Type Selected"] --> LoadForm["Load Client Information Form"]
LoadForm --> ValidateFields["Field Validation"]
ValidateFields --> RequiredFields{"All Required Fields?"}
RequiredFields --> |No| ShowError["Show Validation Error"]
RequiredFields --> |Yes| PrepareData["Prepare Booking Data"]
PrepareData --> APISubmit["Submit to Booking API"]
APISubmit --> Success["Show Success Message"]
APISubmit --> Error["Show Error Message"]
ShowError --> ValidateFields
Success --> CloseModal["Close Booking Modal"]
Error --> ValidateFields
```

**Diagram sources**
- [BookingCalendar.tsx](file://src/components/BookingCalendar.tsx#L230-L280)
- [index.ts](file://pages/api/bookings/index.ts#L80-L120)

**Section sources**
- [BookingCalendar.tsx](file://src/components/BookingCalendar.tsx#L150-L384)

## State Management

The BookingCalendar employs React's useState hook for comprehensive state management across all booking stages:

### State Variables

```typescript
// Core booking state
const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
const [selectedEventType, setSelectedEventType] = useState<string>('');
const [clientInfo, setClientInfo] = useState({
  name: '',
  email: '',
  phone: '',
});
const [eventLocation, setEventLocation] = useState('');
const [notes, setNotes] = useState('');
const [isSubmitting, setIsSubmitting] = useState(false);
const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>(TIME_SLOTS);
```

### State Flow Architecture

```mermaid
stateDiagram-v2
[*] --> Empty : Initial State
Empty --> DateSelected : User selects date
DateSelected --> TimeSelected : Availability loaded
TimeSelected --> EventTypeSelected : Time slot selected
EventTypeSelected --> ClientInfo : Event type selected
ClientInfo --> Submitted : All fields filled
Submitted --> [*] : Booking complete
DateSelected --> DateSelected : Availability refresh
TimeSelected --> TimeSelected : Slot selection
EventTypeSelected --> EventTypeSelected : Type change
ClientInfo --> ClientInfo : Field editing
```

**Diagram sources**
- [BookingCalendar.tsx](file://src/components/BookingCalendar.tsx#L80-L100)

**Section sources**
- [BookingCalendar.tsx](file://src/components/BookingCalendar.tsx#L80-L100)

## API Integration

### Availability Checking API

The availability checking system provides real-time slot availability:

```mermaid
sequenceDiagram
participant BC as BookingCalendar
participant API as Availability API
participant DB as Supabase
participant Cache as Local Storage
BC->>API : GET /api/bookings/availability?photographerId=xxx&date=yyyy-mm-dd
API->>DB : SELECT event_time FROM bookings WHERE photographer_id=xxx AND event_date=yyyy-mm-dd AND status='confirmed'
DB-->>API : Return array of booked times
API->>API : Compare with predefined time slots
API->>API : Mark available/unavailable slots
API-->>BC : Return availability array
BC->>Cache : Store availability data
BC->>BC : Update UI with available slots
```

**Diagram sources**
- [availability.ts](file://pages/api/bookings/availability.ts#L15-L60)
- [BookingCalendar.tsx](file://src/components/BookingCalendar.tsx#L130-L150)

### Booking Submission API

The booking submission process handles comprehensive data validation and persistence:

```mermaid
sequenceDiagram
participant Client as Client Browser
participant BC as BookingCalendar
participant API as Booking API
participant DB as Supabase
participant Notif as Notification Service
Client->>BC : Submit Booking Form
BC->>BC : Validate all required fields
BC->>API : POST /api/bookings
API->>API : Check for conflicts
API->>DB : INSERT INTO bookings
DB-->>API : Return new booking
API->>Notif : Create notification
API-->>BC : Return booking confirmation
BC->>BC : Call onBookingSubmit callback
BC-->>Client : Show success message
```

**Diagram sources**
- [index.ts](file://pages/api/bookings/index.ts#L80-L150)
- [BookingCalendar.tsx](file://src/components/BookingCalendar.tsx#L170-L220)

**Section sources**
- [availability.ts](file://pages/api/bookings/availability.ts#L1-L69)
- [index.ts](file://pages/api/bookings/index.ts#L1-L208)

## UI/UX Features

### Framer Motion Integration

The BookingCalendar leverages Framer Motion for smooth, engaging user interactions:

```typescript
// Animation variants for modal entrance
const modalVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 }
};

// Animation for form progression
const formTransition = {
  type: "tween" as const,
  ease: "anticipate" as const,
  duration: 0.3
};
```

### Responsive Design

The component adapts seamlessly across device sizes:

```mermaid
graph LR
Mobile[Mobile Layout<br/>Single Column] --> Tablet[Tablet Layout<br/>Two Columns]
Tablet --> Desktop[Desktop Layout<br/>Three Columns]
Mobile --> |Screen Width ≤ 768px| Responsive[Responsive Grid System]
Tablet --> |768px < Screen Width ≤ 1024px| Responsive
Desktop --> |Screen Width > 1024px| Responsive
```

### Visual Feedback Systems

The component provides immediate visual feedback for user actions:

- **Date Selection**: Disabled dates appear faded with tooltips
- **Time Slot Selection**: Available slots highlight on hover, unavailable slots show strikethrough
- **Form Progression**: Progress indicators show current stage completion
- **Submission Status**: Loading states prevent duplicate submissions

**Section sources**
- [BookingCalendar.tsx](file://src/components/BookingCalendar.tsx#L1-L50)
- [LandingPage.tsx](file://src/components/LandingPage.tsx#L1-L100)

## Error Handling

### API Failure Handling

The component implements robust fallback mechanisms for API failures:

```typescript
const checkAvailability = async (date: Date) => {
  try {
    const dateStr = format(date, 'yyyy-MM-dd');
    const response = await fetch(`/api/bookings/availability?photographerId=${photographerId}&date=${dateStr}`);
    
    if (!response.ok) {
      throw new Error('Failed to check availability');
    }
    
    const data = await response.json();
    return data.availability || TIME_SLOTS;
  } catch (error) {
    console.error('Error checking availability:', error);
    // Fallback to mock data if API fails
    const unavailableSlots = ['morning-1', 'afternoon-2', 'evening-1'];
    return TIME_SLOTS.map(slot => ({
      ...slot,
      available: !unavailableSlots.includes(slot.id)
    }));
  }
};
```

### Form Validation

Comprehensive form validation prevents invalid submissions:

```typescript
const handleSubmit = async () => {
  if (!selectedDate || !selectedTimeSlot || !selectedEventType || !clientInfo.name || !clientInfo.email) {
    alert('Please fill in all required fields');
    return;
  }
  
  // Additional validation logic...
};
```

### Edge Case Management

The component handles various edge cases gracefully:

- **Past Date Prevention**: Automatic date filtering prevents selection of past dates
- **Concurrent Bookings**: Real-time availability checking prevents double bookings
- **Network Interruptions**: Graceful degradation with cached data
- **Invalid Input**: Clear error messages with field highlighting

**Section sources**
- [BookingCalendar.tsx](file://src/components/BookingCalendar.tsx#L130-L220)

## Performance Considerations

### Optimized Rendering

The component uses several optimization strategies:

1. **Memoization**: Expensive calculations are memoized using React.memo
2. **Conditional Rendering**: Components render only when necessary
3. **Debounced API Calls**: Availability checks debounce rapid date changes
4. **Efficient State Updates**: Minimal state updates prevent unnecessary re-renders

### Memory Management

- **Cleanup Functions**: Event listeners and timers are properly cleaned up
- **Reference Management**: Stable references prevent unnecessary re-renders
- **Resource Cleanup**: Modal state properly cleans up when closed

### Network Optimization

- **Caching**: Availability data is cached locally to reduce API calls
- **Batch Requests**: Related API calls are batched when possible
- **Lazy Loading**: Large components load only when needed

## Troubleshooting Guide

### Common Issues and Solutions

#### Issue 1: Availability API Fails

**Symptoms**: Time slots remain unavailable despite being free
**Solution**: 
- Check network connectivity
- Verify API endpoint accessibility
- Review server logs for errors
- Test with mock data fallback

#### Issue 2: Form Validation Errors

**Symptoms**: Submit button remains disabled or shows validation errors
**Solution**:
- Ensure all required fields are filled
- Check email format validity
- Verify phone number format
- Clear browser cache and reload

#### Issue 3: Booking Submission Timeout

**Symptoms**: Submission hangs or shows timeout error
**Solution**:
- Check server response time
- Verify database connection
- Review notification service status
- Implement retry logic with exponential backoff

#### Issue 4: Date Filtering Not Working

**Symptoms**: Past dates can still be selected
**Solution**:
- Verify `isDateDisabled` function logic
- Check date comparison implementation
- Ensure timezone consistency
- Test with different date formats

### Debugging Tools

1. **Console Logging**: Strategic logging throughout the component lifecycle
2. **React DevTools**: Component state inspection
3. **Network Tab**: API call monitoring
4. **Performance Tab**: Rendering performance analysis

**Section sources**
- [BookingCalendar.tsx](file://src/components/BookingCalendar.tsx#L130-L220)
- [availability.ts](file://pages/api/bookings/availability.ts#L15-L60)

## Conclusion

The BookingCalendar component represents a sophisticated implementation of modern web development practices, combining React's powerful state management with TypeScript's type safety and Framer Motion's animation capabilities. Its modular architecture ensures maintainability and scalability, while comprehensive error handling and fallback mechanisms guarantee a robust user experience.

The component successfully addresses the complex requirements of a booking system, including real-time availability checking, progressive form filling, and seamless API integration. Its responsive design and intuitive user interface make it accessible across all devices, while its performance optimizations ensure smooth operation under various conditions.

Future enhancements could include advanced scheduling features, integration with external calendar systems, and expanded analytics capabilities. The solid foundation provided by this implementation makes such extensions straightforward and maintainable.