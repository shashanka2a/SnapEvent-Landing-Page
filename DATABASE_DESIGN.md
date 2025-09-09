# SnapEvent Database Design

## Overview

This Prisma schema is designed to support a comprehensive photography marketplace platform that connects clients with professional photographers. The database supports user management, photographer profiles, bookings, payments, reviews, messaging, and analytics.

## Core Features Supported

### 1. **User Management**
- **Users**: Core user accounts with role-based access (Client, Photographer, Admin)
- **Photographer Profiles**: Extended profiles for photographers with business information
- **Authentication**: Email-based user identification with role management

### 2. **Photographer Onboarding & Profiles**
- **Application Process**: Photographers apply with status tracking (Pending, Approved, Rejected)
- **Professional Information**: Experience, specialties, equipment, pricing
- **Portfolio Management**: Image galleries with categorization and tagging
- **Verification System**: Admin approval and verification badges

### 3. **Service & Pricing Management**
- **Services**: Photographers can offer multiple services with individual pricing
- **Specialties**: Categorized photography types (Wedding, Portrait, Corporate, etc.)
- **Dynamic Pricing**: Flexible pricing per service with duration and deliverables

### 4. **Booking & Scheduling System**
- **Booking Management**: Complete booking lifecycle from request to completion
- **Availability Tracking**: Photographer availability calendar
- **Event Details**: Date, location, duration, guest count, special requests
- **Status Tracking**: Pending → Confirmed → In Progress → Completed

### 5. **Payment Processing**
- **Payment Tracking**: Multiple payment methods and status tracking
- **Deposit System**: Partial payments with deposit tracking
- **Transaction History**: Complete payment audit trail
- **Refund Support**: Payment status includes refunded state

### 6. **Review & Rating System**
- **Client Reviews**: 5-star rating system with comments
- **Testimonials**: Pre-approved testimonials for photographer profiles
- **Review Moderation**: Admin approval system for reviews
- **Aggregate Ratings**: Automatic calculation of average ratings

### 7. **Communication System**
- **Messaging**: Direct communication between clients and photographers
- **Booking Context**: Messages linked to specific bookings
- **Message Types**: Text, images, files, and system messages
- **Read Receipts**: Message read status tracking

### 8. **Search & Discovery**
- **Advanced Search**: Location, category, price range, rating filters
- **Search Analytics**: Track popular searches and results
- **Portfolio Filtering**: Category-based portfolio browsing
- **Trending Photographers**: Algorithm support for featured photographers

## Database Schema Structure

### Core Entities

```
User (1:1) PhotographerProfile
User (1:N) Booking
User (1:N) Review
User (1:N) Message
User (1:N) Notification

PhotographerProfile (1:N) Service
PhotographerProfile (1:N) PortfolioItem
PhotographerProfile (1:N) Specialty (M:N)
PhotographerProfile (1:N) Award
PhotographerProfile (1:N) Testimonial
PhotographerProfile (1:N) Availability

Booking (1:N) Payment
Booking (1:N) Message
Service (1:N) Booking
```

### Key Relationships

1. **User ↔ PhotographerProfile**: One-to-one relationship for photographer accounts
2. **Photographer ↔ Specialty**: Many-to-many for multiple specialties per photographer
3. **Booking ↔ Payment**: One-to-many for multiple payments per booking
4. **User ↔ Message**: Many-to-many for messaging between users
5. **PortfolioItem ↔ Category**: Enum-based categorization for filtering

## Data Flow Examples

### Photographer Onboarding
1. User creates account with `role: PHOTOGRAPHER`
2. PhotographerProfile created with `applicationStatus: PENDING`
3. Admin reviews and sets `applicationStatus: APPROVED`
4. Photographer can add services, portfolio items, and availability

### Booking Process
1. Client searches photographers by location/category
2. Client views photographer profile and services
3. Client creates booking with event details
4. Photographer confirms booking
5. Payment processing (deposit + final payment)
6. Event execution and completion
7. Review and rating submission

### Search & Discovery
1. Client enters search criteria (location, category, price)
2. System queries photographers with matching criteria
3. Results ranked by rating, availability, and relevance
4. Search query logged for analytics

## Scalability Considerations

### Indexing Strategy
- **User.email**: Unique index for authentication
- **PhotographerProfile.location**: Geographic search optimization
- **Booking.eventDate**: Date-based queries
- **PortfolioItem.category**: Category filtering
- **Review.rating**: Rating-based sorting

### Performance Optimizations
- **Aggregate Fields**: `averageRating`, `totalReviews` cached on PhotographerProfile
- **Soft Deletes**: `isActive` flags instead of hard deletes
- **JSON Fields**: Flexible metadata storage for analytics
- **Enum Types**: Efficient category and status storage

### Data Archival
- **Analytics**: Time-based partitioning for historical data
- **Messages**: Archive old messages after retention period
- **Search Queries**: Aggregate and archive old search data

## Security & Privacy

### Data Protection
- **PII Handling**: Sensitive data in separate fields for encryption
- **Role-Based Access**: User roles control data access
- **Audit Trail**: Created/updated timestamps on all entities
- **Soft Deletes**: Data retention with `isActive` flags

### Compliance Features
- **Review Moderation**: Admin approval for public content
- **Message Privacy**: Direct communication between parties only
- **Payment Security**: Transaction IDs for audit trails
- **Data Export**: User data export capabilities

## API Integration Points

### External Services
- **Payment Processing**: Stripe integration with `stripePaymentId`
- **Image Storage**: Cloud storage URLs for portfolio images
- **Email Notifications**: Notification system for user communications
- **Analytics**: Event tracking for business intelligence

### Webhook Support
- **Payment Webhooks**: Stripe payment status updates
- **Booking Updates**: Real-time booking status changes
- **Message Notifications**: Push notification triggers

## Migration Strategy

### Phase 1: Core Features
1. User management and authentication
2. Photographer profiles and onboarding
3. Basic portfolio and service management

### Phase 2: Booking System
1. Booking creation and management
2. Payment processing integration
3. Availability and scheduling

### Phase 3: Advanced Features
1. Messaging system
2. Review and rating system
3. Search and analytics

### Phase 4: Optimization
1. Performance tuning
2. Advanced analytics
3. Mobile app support

## Environment Setup

### Required Environment Variables
```env
DATABASE_URL="postgresql://username:password@localhost:5432/snapevent"
```

### Database Commands
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database
npx prisma db seed

# View database in Prisma Studio
npx prisma studio
```

This database design provides a solid foundation for the SnapEvent platform, supporting all current features while remaining flexible for future enhancements and scaling requirements.
