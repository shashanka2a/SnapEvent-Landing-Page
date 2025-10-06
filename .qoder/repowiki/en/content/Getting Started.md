# Getting Started

<cite>
**Referenced Files in This Document**   
- [README.md](file://README.md)
- [package.json](file://package.json)
- [SETUP_GUIDE.md](file://SETUP_GUIDE.md)
- [SUPABASE_SETUP.md](file://SUPABASE_SETUP.md)
- [env.example](file://env.example)
- [next.config.js](file://next.config.js)
- [src/lib/supabase.ts](file://src/lib/supabase.ts)
- [src/middleware/auth.ts](file://src/middleware/auth.ts)
- [src/lib/api.ts](file://src/lib/api.ts)
- [pages/api/auth/signup.ts](file://pages/api/auth/signup.ts)
- [pages/_app.tsx](file://pages/_app.tsx)
- [src/App.tsx](file://src/App.tsx)
- [src/components/LandingPage.tsx](file://src/components/LandingPage.tsx)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Repository Setup](#repository-setup)
4. [Environment Configuration](#environment-configuration)
5. [Database and Supabase Setup](#database-and-supabase-setup)
6. [Running the Application](#running-the-application)
7. [Available Scripts](#available-scripts)
8. [Troubleshooting Common Issues](#troubleshooting-common-issues)
9. [Conclusion](#conclusion)

## Introduction
This guide provides comprehensive instructions for setting up the SnapEvent development environment. The SnapEvent platform is a photography marketplace that connects clients with professional photographers. This documentation will walk you through the complete setup process, from cloning the repository to running the application locally. The guide is designed to be beginner-friendly while providing complete information for experienced developers.

**Section sources**
- [README.md](file://README.md)
- [SETUP_GUIDE.md](file://SETUP_GUIDE.md)

## Prerequisites
Before setting up the SnapEvent development environment, ensure you have the following prerequisites installed on your system:

- **Node.js 18+**: The application is built with Next.js and requires Node.js version 18 or higher. You can download it from [nodejs.org](https://nodejs.org).
- **npm (Node Package Manager)**: This comes bundled with Node.js and is used to install project dependencies.
- **Git**: Required for cloning the repository and version control.
- **Supabase Account**: The application uses Supabase as its backend database and authentication service. You'll need access to the project credentials.

To verify your Node.js and npm installations, run the following commands in your terminal:
```bash
node --version
npm --version
```

**Section sources**
- [SETUP_GUIDE.md](file://SETUP_GUIDE.md)
- [package.json](file://package.json)

## Repository Setup
To get started with the SnapEvent project, you'll need to clone the repository and install the required dependencies.

### 1. Clone the Repository
Open your terminal and run the following command to clone the SnapEvent repository:
```bash
git clone https://github.com/your-organization/SnapEvent-Landing-Page.git
cd SnapEvent-Landing-Page
```

### 2. Install Dependencies
Once you've cloned the repository, install the project dependencies using npm:
```bash
npm install
```

This command will read the package.json file and install all the required packages, including:
- Next.js for the React framework
- Supabase for authentication and database operations
- Prisma for database modeling and migrations
- Tailwind CSS for styling
- Various UI component libraries and utilities

The package.json file contains all the dependencies needed for the SnapEvent application, including frontend libraries, database tools, and development utilities.

**Section sources**
- [README.md](file://README.md)
- [package.json](file://package.json)

## Environment Configuration
Proper environment configuration is crucial for the SnapEvent application to connect to the Supabase backend and function correctly.

### 1. Create Environment File
Start by creating a .env file from the provided example:
```bash
cp env.example .env
```

### 2. Configure Environment Variables
The env.example file contains all the necessary environment variables for the application. Key variables include:

**Database Configuration**
```
DATABASE_URL="postgresql://postgres.chkbamuurntcmhgraxrh:aJ7l0X1WG5VfMFRo@aws-1-us-east-2.pooler.supabase.com:6543/postgres?sslmode=require"
```

**Supabase Configuration**
```
NEXT_PUBLIC_SUPABASE_URL="https://chkbamuurntcmhgraxrh.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoa2JhbXV1cm50Y21oZ3JheHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzI4MDAsImV4cCI6MjA1MDU0ODgwMH0.YOUR_ANON_KEY_HERE"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoa2JhbXV1cm50Y21oZ3JheHJoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDk3MjgwMCwiZXhwIjoyMDUwNTQ4ODAwfQ.YOUR_SERVICE_ROLE_KEY_HERE"
```

**Application Configuration**
```
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**Email Configuration**
```
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_SECURE="false"
EMAIL_USER="snapevent.in@gmail.com"
EMAIL_PASS="xpisrosgrkchxwwl"
```

**Payment Processing**
```
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 3. Security Notes
- Never commit the .env file to version control
- The NEXTAUTH_SECRET should be a strong, randomly generated string
- Keep the SUPABASE_SERVICE_ROLE_KEY secure as it has elevated privileges

**Section sources**
- [env.example](file://env.example)
- [SUPABASE_SETUP.md](file://SUPABASE_SETUP.md)

## Database and Supabase Setup
The SnapEvent application uses Supabase as its backend database and authentication service. Follow these steps to set up the database connection.

### 1. Understanding the Database Configuration
The application is pre-configured to connect to a Supabase PostgreSQL database. The connection details are already provided in the SUPABASE_SETUP.md file and env.example.

### 2. Database Schema Overview
The SnapEvent database includes the following core entities:
- **Users**: Base user accounts with roles (CLIENT, PHOTOGRAPHER, ADMIN)
- **PhotographerProfiles**: Extended profiles for photographers with business information, specialties, and portfolios
- **Services**: Individual photography services offered by photographers
- **Bookings**: Client bookings and event details
- **Reviews**: Client reviews and ratings
- **Messages**: Communication between users

### 3. Setting Up Database Connections
The src/lib/supabase.ts file contains the configuration for connecting to Supabase:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)
```

This configuration creates two Supabase clients:
- `supabase`: For client-side operations with anonymous key
- `supabaseAdmin`: For server-side operations with service role key (higher privileges)

### 4. Authentication Flow
The authentication system is implemented in the pages/api/auth directory and uses Supabase Auth. The signup process (in pages/api/auth/signup.ts) includes:
- Creating a user in Supabase Auth with email verification
- Creating a corresponding user profile in the custom users table
- Handling validation and error cases

The middleware in src/middleware/auth.ts provides authentication protection for API routes.

**Section sources**
- [SUPABASE_SETUP.md](file://SUPABASE_SETUP.md)
- [src/lib/supabase.ts](file://src/lib/supabase.ts)
- [src/middleware/auth.ts](file://src/middleware/auth.ts)
- [pages/api/auth/signup.ts](file://pages/api/auth/signup.ts)

## Running the Application
Once you've completed the setup, you can run the SnapEvent application locally.

### 1. Start the Development Server
Run the following command to start the development server:
```bash
npm run dev
```

This will start the Next.js development server, and you can access the application at [http://localhost:3000](http://localhost:3000).

### 2. Application Structure
The application structure follows a standard Next.js pattern:
- **pages/**: Contains the page components and API routes
- **src/components/**: Reusable UI components
- **src/lib/**: Utility functions and service clients
- **prisma/**: Database schema and seed data
- **public/**: Static assets

### 3. Key Application Components
The main application components include:
- **LandingPage**: The homepage that allows users to search for photographers
- **GeneralizedSignupFlow**: The signup process for new users
- **OnboardingForm**: Form for photographers to set up their profiles
- **PortfolioPage**: Display of photographer portfolios

The App component (src/App.tsx) manages the navigation between these different views.

**Section sources**
- [README.md](file://README.md)
- [pages/_app.tsx](file://pages/_app.tsx)
- [src/App.tsx](file://src/App.tsx)
- [src/components/LandingPage.tsx](file://src/components/LandingPage.tsx)

## Available Scripts
The package.json file defines several useful scripts for development:

| Script | Description |
|--------|-------------|
| `npm run dev` | Starts the development server |
| `npm run build` | Builds the application for production |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs ESLint for code quality checking |
| `npm run export` | Builds and exports a static version of the app |
| `npm run db:generate` | Generates Prisma client |
| `npm run db:push` | Pushes schema changes to the database |
| `npm run db:migrate` | Runs database migrations |
| `npm run db:seed` | Seeds the database with sample data |
| `npm run db:studio` | Opens Prisma Studio (database GUI) |
| `npm run db:reset` | Resets the database and re-runs migrations |
| `npm run test` | Runs Jest tests |
| `npm run test:coverage` | Runs tests with coverage reporting |

For database operations, you can use the Prisma CLI commands:
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Create migration
npx prisma migrate dev --name "migration_name"

# Open Prisma Studio
npx prisma studio
```

**Section sources**
- [package.json](file://package.json)
- [SETUP_GUIDE.md](file://SETUP_GUIDE.md)

## Troubleshooting Common Issues
This section addresses common setup issues and their solutions.

### 1. Database Connection Errors
**Symptoms**: "P1001: Can't reach database server" or connection timeouts.

**Solutions**:
- Verify the DATABASE_URL in your .env file matches the format in SUPABASE_SETUP.md
- Check if your network allows outbound connections to port 5432
- Try different SSL modes in the connection string:
  ```bash
  # Try without SSL first
  DATABASE_URL="postgresql://postgres:aJ7l0X1WG5VfMFRo@db.chkbamuurntcmhgraxrh.supabase.co:5432/postgres?sslmode=disable"
  
  # Then with prefer
  DATABASE_URL="postgresql://postgres:aJ7l0X1WG5VfMFRo@db.chkbamuurntcmhgraxrh.supabase.co:5432/postgres?sslmode=prefer"
  
  # Finally with require
  DATABASE_URL="postgresql://postgres:aJ7l0X1WG5VfMFRo@db.chkbamuurntcmhgraxrh.supabase.co:5432/postgres?sslmode=require"
  ```
- Ensure the Supabase project is active in the dashboard

### 2. Missing Environment Variables
**Symptoms**: Application fails to start or authentication doesn't work.

**Solutions**:
- Ensure you've created a .env file from env.example
- Verify all required variables are present and correctly formatted
- Restart the development server after making changes to .env

### 3. Authentication Issues
**Symptoms**: Unable to sign up or sign in users.

**Solutions**:
- Verify the NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are correct
- Check that the email redirect URL in the signup handler matches your NEXTAUTH_URL
- Ensure the Supabase Auth settings allow email signups

### 4. Prisma Migration Errors
**Symptoms**: Migration fails with schema conflicts.

**Solutions**:
- Reset the database: `npm run db:reset`
- Ensure the database is migrated before seeding: `npm run db:migrate` then `npm run db:seed`
- Check for syntax errors in the Prisma schema

### 5. General Troubleshooting Tips
- Always check the terminal output for error messages
- Verify Node.js and npm versions are compatible
- Clear npm cache if dependencies fail to install: `npm cache clean --force`
- Restart the development server after making configuration changes

**Section sources**
- [SUPABASE_SETUP.md](file://SUPABASE_SETUP.md)
- [SETUP_GUIDE.md](file://SETUP_GUIDE.md)
- [src/lib/supabase.ts](file://src/lib/supabase.ts)

## Conclusion
You now have a complete understanding of how to set up the SnapEvent development environment. The process involves cloning the repository, installing dependencies, configuring environment variables with Supabase credentials, and running the application locally. The application is built with Next.js and uses Supabase for authentication and database operations.

Key points to remember:
- Always keep your environment variables secure and never commit them to version control
- Use the provided scripts in package.json for common development tasks
- Refer to the SUPABASE_SETUP.md and SETUP_GUIDE.md documents for detailed configuration information
- Use the troubleshooting section to resolve common issues

With this setup complete, you can begin developing new features, fixing bugs, or customizing the SnapEvent platform for your specific needs.

**Section sources**
- [README.md](file://README.md)
- [SETUP_GUIDE.md](file://SETUP_GUIDE.md)
- [SUPABASE_SETUP.md](file://SUPABASE_SETUP.md)