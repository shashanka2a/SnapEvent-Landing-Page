# SnapEvent Database Setup Guide

## Overview

This guide will help you set up the SnapEvent database using Prisma with PostgreSQL. The database is designed to support a comprehensive photography marketplace platform.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Git (for version control)

## Database Setup

### 1. Install Dependencies

The required dependencies are already installed:
- `prisma` - Database toolkit
- `@prisma/client` - Prisma client for database operations
- `tsx` - TypeScript execution for seeding

### 2. Environment Configuration

1. Copy the environment template:
```bash
cp env.example .env
```

2. Update the `.env` file with your database credentials:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/snapevent"
```

### 3. Database Creation

Create a PostgreSQL database:
```sql
CREATE DATABASE snapevent;
```

### 4. Generate Prisma Client

```bash
npm run db:generate
```

### 5. Run Database Migrations

```bash
npm run db:migrate
```

This will:
- Create all database tables
- Set up relationships and constraints
- Apply indexes for performance

### 6. Seed the Database

```bash
npm run db:seed
```

This will populate the database with sample data including:
- 8 photography specialties
- 3 client users
- 3 photographer profiles with full data
- Services, portfolio items, awards, testimonials
- Sample bookings, payments, and reviews

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema changes to database |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:studio` | Open Prisma Studio (database GUI) |
| `npm run db:reset` | Reset database and re-run migrations |

## Database Schema Overview

### Core Entities

1. **Users** - Base user accounts (clients, photographers, admins)
2. **PhotographerProfiles** - Extended profiles for photographers
3. **Specialties** - Photography categories (Wedding, Portrait, etc.)
4. **Services** - Individual services offered by photographers
5. **PortfolioItems** - Photographer work samples
6. **Bookings** - Client bookings and event details
7. **Payments** - Payment tracking and processing
8. **Reviews** - Client reviews and ratings
9. **Messages** - Communication between users
10. **Availability** - Photographer scheduling

### Key Features

- **Role-based Access**: Users have roles (CLIENT, PHOTOGRAPHER, ADMIN)
- **Application System**: Photographers apply and get approved
- **Booking Management**: Complete booking lifecycle
- **Payment Processing**: Multiple payment methods and status tracking
- **Review System**: 5-star ratings with moderation
- **Messaging**: Direct communication between users
- **Search & Analytics**: Query tracking and performance metrics

## Sample Data

The seed script creates:

### Photographers
1. **Sarah Chen** - Wedding & Portrait Photographer (San Francisco)
2. **Alex Rodriguez** - Corporate & Event Photographer (New York)
3. **Emma Wilson** - Fashion & Portrait Photographer (Los Angeles)

### Services
- Wedding Photography ($2,500)
- Engagement Sessions ($400)
- Corporate Event Coverage ($800)
- Business Headshots ($200)
- Fashion Editorial Shoots ($600)
- Portrait Sessions ($350)

### Specialties
- Wedding Photography
- Portrait Photography
- Event Photography
- Corporate Photography
- Fashion Photography
- Landscape Photography
- Product Photography
- Food Photography

## Database Relationships

```
User (1:1) PhotographerProfile
User (1:N) Booking
User (1:N) Review
User (1:N) Message

PhotographerProfile (1:N) Service
PhotographerProfile (1:N) PortfolioItem
PhotographerProfile (M:N) Specialty
PhotographerProfile (1:N) Award
PhotographerProfile (1:N) Testimonial

Booking (1:N) Payment
Booking (1:N) Message
Service (1:N) Booking
```

## Performance Considerations

### Indexes
- User email (unique)
- Photographer location (geographic search)
- Booking event date (date queries)
- Portfolio category (filtering)
- Review rating (sorting)

### Optimizations
- Aggregate fields cached on profiles
- Soft deletes with `isActive` flags
- JSON fields for flexible metadata
- Enum types for efficient storage

## Security Features

- Role-based access control
- Data validation and constraints
- Audit trails with timestamps
- Review moderation system
- Payment transaction tracking

## Next Steps

1. **API Development**: Create Next.js API routes for database operations
2. **Authentication**: Implement user authentication and authorization
3. **File Upload**: Set up image storage for portfolios
4. **Payment Integration**: Connect Stripe for payment processing
5. **Email System**: Implement notifications and communications
6. **Search**: Build advanced search and filtering
7. **Analytics**: Add business intelligence and reporting

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check DATABASE_URL format
   - Ensure PostgreSQL is running
   - Verify database exists

2. **Migration Errors**
   - Check for existing data conflicts
   - Reset database: `npm run db:reset`
   - Review schema for syntax errors

3. **Seed Script Errors**
   - Ensure database is migrated first
   - Check for duplicate data
   - Verify all required fields are provided

### Useful Commands

```bash
# View database in browser
npm run db:studio

# Reset everything and start fresh
npm run db:reset

# Check database status
npx prisma db status

# Format schema file
npx prisma format
```

## Production Deployment

For production deployment:

1. Set up production PostgreSQL database
2. Update DATABASE_URL with production credentials
3. Run migrations: `npx prisma migrate deploy`
4. Seed production data (if needed)
5. Set up database backups
6. Configure monitoring and alerts

The database is designed to scale with your application and supports all the features needed for a professional photography marketplace platform.
