# Authentication API Documentation

<cite>
**Referenced Files in This Document**
- [pages/api/auth/signin.ts](file://pages/api/auth/signin.ts)
- [pages/api/auth/signup.ts](file://pages/api/auth/signup.ts)
- [pages/api/auth/signout.ts](file://pages/api/auth/signout.ts)
- [pages/api/auth/update-role.ts](file://pages/api/auth/update-role.ts)
- [pages/api/auth/verify.ts](file://pages/api/auth/verify.ts)
- [src/lib/supabase.ts](file://src/lib/supabase.ts)
- [src/middleware/auth.ts](file://src/middleware/auth.ts)
- [src/utils/mailer.ts](file://src/lib/supabase.ts)
- [pages/auth/email-verify.tsx](file://pages/auth/email-verify.tsx)
- [src/components/GeneralizedSignupFlow.tsx](file://src/components/GeneralizedSignupFlow.tsx)
- [src/lib/api.ts](file://src/lib/api.ts)
- [src/middleware/validation.ts](file://src/middleware/validation.ts)
- [src/lib/supabase-server.ts](file://src/lib/supabase-server.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Authentication Architecture](#authentication-architecture)
3. [API Endpoints](#api-endpoints)
4. [Authentication Mechanisms](#authentication-mechanisms)
5. [Security Implementation](#security-implementation)
6. [Client-Side Integration](#client-side-integration)
7. [Error Handling](#error-handling)
8. [Rate Limiting and Performance](#rate-limiting-and-performance)
9. [Troubleshooting Guide](#troubleshooting-guide)
10. [Best Practices](#best-practices)

## Introduction

The SnapEvent Authentication API provides comprehensive user authentication and authorization services built on top of Supabase Auth. The system supports user registration, login, logout, role management, and email verification with robust security measures including JWT handling, session management, and role-based access control.

The authentication system is designed to support two primary user roles:
- **CLIENT**: Regular users who book photography services
- **PHOTOGRAPHER**: Professional photographers offering their services

## Authentication Architecture

The authentication system follows a layered architecture with Supabase Auth as the foundation, complemented by custom user profiles and role management.

```mermaid
graph TB
subgraph "Client Layer"
WebApp[Web Application]
MobileApp[Mobile Application]
end
subgraph "API Gateway"
AuthAPI[Authentication API]
Middleware[Auth Middleware]
end
subgraph "Authentication Layer"
SupabaseAuth[Supabase Auth]
JWT[JWT Token Management]
Session[Session Management]
end
subgraph "Data Layer"
UsersTable[(Users Table)]
ProfilesTable[(Photographer Profiles)]
EmailService[Email Service]
end
WebApp --> AuthAPI
MobileApp --> AuthAPI
AuthAPI --> Middleware
Middleware --> SupabaseAuth
SupabaseAuth --> JWT
SupabaseAuth --> Session
AuthAPI --> UsersTable
AuthAPI --> ProfilesTable
AuthAPI --> EmailService
```

**Diagram sources**
- [src/lib/supabase.ts](file://src/lib/supabase.ts#L1-L242)
- [src/middleware/auth.ts](file://src/middleware/auth.ts#L1-L96)

**Section sources**
- [src/lib/supabase.ts](file://src/lib/supabase.ts#L1-L242)
- [src/middleware/auth.ts](file://src/middleware/auth.ts#L1-L96)

## API Endpoints

### POST /api/auth/signin

Authenticates a user with email and password, returning user profile and session data.

**Request Schema:**
```typescript
interface SignInRequest {
  email: string;
  password: string;
}

interface SignInResponse {
  message: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'CLIENT' | 'PHOTOGRAPHER' | 'ADMIN';
    avatar: string | null;
  };
  session: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    expires_at: number;
    token_type: string;
    provider_token: string | null;
    user: {
      id: string;
      email: string;
      aud: string;
      role: string;
      email_confirmed_at: string | null;
      phone_confirmed_at: string | null;
      app_metadata: Record<string, any>;
      user_metadata: Record<string, any>;
      created_at: string;
      updated_at: string;
    };
  };
}
```

**Example Request:**
```bash
curl -X POST https://your-app.com/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "securepassword"}'
```

**Example Response:**
```json
{
  "message": "Sign in successful",
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CLIENT",
    "avatar": null
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "def50200...",
    "expires_in": 3600,
    "expires_at": 1640995200,
    "token_type": "bearer",
    "provider_token": null,
    "user": {
      "id": "uuid-string",
      "email": "user@example.com",
      "aud": "authenticated",
      "role": "authenticated",
      "email_confirmed_at": "2023-01-01T00:00:00Z",
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-01T00:00:00Z"
    }
  }
}
```

### POST /api/auth/signup

Creates a new user account with email verification and role assignment.

**Request Schema:**
```typescript
interface SignUpRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role?: 'CLIENT' | 'PHOTOGRAPHER';
}

interface SignUpResponse {
  message: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'CLIENT' | 'PHOTOGRAPHER';
  };
}
```

**Example Request:**
```bash
curl -X POST https://your-app.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "photographer@example.com",
    "password": "securepassword",
    "firstName": "Jane",
    "lastName": "Smith",
    "phone": "+1234567890",
    "role": "PHOTOGRAPHER"
  }'
```

**Example Response:**
```json
{
  "message": "User created successfully. Please check your email to verify your account.",
  "user": {
    "id": "uuid-string",
    "email": "photographer@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "PHOTOGRAPHER"
  }
}
```

### POST /api/auth/signout

Logs out the currently authenticated user.

**Request Schema:**
```typescript
interface SignOutRequest {
  // No body required
}

interface SignOutResponse {
  message: string;
}
```

**Example Request:**
```bash
curl -X POST https://your-app.com/api/auth/signout \
  -H "Content-Type: application/json"
```

**Example Response:**
```json
{
  "message": "Sign out successful"
}
```

### POST /api/auth/update-role

Updates the user's role in the system.

**Request Schema:**
```typescript
interface UpdateRoleRequest {
  role: 'CLIENT' | 'PHOTOGRAPHER';
}

interface UpdateRoleResponse {
  message: string;
  user: {
    id: string;
    email: string;
    role: 'CLIENT' | 'PHOTOGRAPHER';
  };
}
```

**Example Request:**
```bash
curl -X POST https://your-app.com/api/auth/update-role \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
  -d '{"role": "PHOTOGRAPHER"}'
```

**Example Response:**
```json
{
  "message": "User role updated successfully",
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "role": "PHOTOGRAPHER"
  }
}
```

### GET /api/auth/verify

Handles email verification for new accounts.

**Query Parameters:**
- `token`: JWT token containing email verification information

**Example Request:**
```bash
curl -X GET https://your-app.com/api/auth/verify?token=jwt-token-here
```

**Example Response:**
Redirects to `/profile/setup` upon successful verification.

### POST /api/auth/verify

Generates and sends verification email links.

**Request Schema:**
```typescript
interface VerifyEmailRequest {
  email: string;
}

interface VerifyEmailResponse {
  message: string;
}
```

**Example Request:**
```bash
curl -X POST https://your-app.com/api/auth/verify \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

**Example Response:**
```json
{
  "message": "Verification email sent"
}
```

**Section sources**
- [pages/api/auth/signin.ts](file://pages/api/auth/signin.ts#L1-L64)
- [pages/api/auth/signup.ts](file://pages/api/auth/signup.ts#L1-L80)
- [pages/api/auth/signout.ts](file://pages/api/auth/signout.ts#L1-L28)
- [pages/api/auth/update-role.ts](file://pages/api/auth/update-role.ts#L1-L49)
- [pages/api/auth/verify.ts](file://pages/api/auth/verify.ts#L1-L65)

## Authentication Mechanisms

### Supabase Integration

The authentication system leverages Supabase Auth for core authentication functionality:

```mermaid
sequenceDiagram
participant Client as "Client Application"
participant API as "Auth API"
participant Supabase as "Supabase Auth"
participant DB as "PostgreSQL Database"
Client->>API : POST /api/auth/signup
API->>Supabase : signUp(email, password)
Supabase->>DB : Create auth.users record
Supabase-->>API : User created with ID
API->>DB : Insert into users table
API->>Supabase : Send verification email
Supabase-->>Client : Verification email sent
Client->>API : POST /api/auth/signin
API->>Supabase : signInWithPassword(email, password)
Supabase-->>API : Authenticated user + session
API->>DB : Get user profile
DB-->>API : User profile data
API-->>Client : User + session data
```

**Diagram sources**
- [pages/api/auth/signup.ts](file://pages/api/auth/signup.ts#L10-L35)
- [pages/api/auth/signin.ts](file://pages/api/auth/signin.ts#L15-L45)

### JWT Token Management

The system uses JWT tokens for secure communication between client and server:

```mermaid
flowchart TD
Login[User Login] --> SupabaseAuth[Supabase Auth]
SupabaseAuth --> GenerateJWT[Generate JWT Token]
GenerateJWT --> StoreToken[Store in Browser Storage]
StoreToken --> SubsequentRequests[Subsequent API Requests]
SubsequentRequests --> ExtractToken[Extract from Authorization Header]
ExtractToken --> ValidateToken[Validate with Supabase]
ValidateToken --> AccessGranted[Access Granted]
Logout[User Logout] --> ClearToken[Clear JWT Token]
ClearToken --> InvalidateSession[Invalidate Session]
```

**Diagram sources**
- [src/middleware/auth.ts](file://src/middleware/auth.ts#L15-L40)
- [pages/api/auth/signin.ts](file://pages/api/auth/signin.ts#L15-L45)

### Session Management

The system implements robust session management with automatic token refresh:

- **Auto Refresh Token**: Enabled for client-side sessions
- **Persist Session**: Maintains user session across browser restarts
- **Detect Session in URL**: Handles OAuth callbacks automatically

**Section sources**
- [src/lib/supabase.ts](file://src/lib/supabase.ts#L10-L20)
- [src/middleware/auth.ts](file://src/middleware/auth.ts#L15-L40)

## Security Implementation

### Password Security

Passwords are handled securely through Supabase's built-in password hashing:

- **Hashing Algorithm**: Argon2i (Supabase default)
- **Salt Generation**: Cryptographically secure random salts
- **Work Factor**: Configurable computational cost
- **No Password Storage**: Plaintext passwords are never stored

### Email Verification Flow

The email verification process ensures account ownership:

```mermaid
sequenceDiagram
participant User as "New User"
participant API as "Auth API"
participant Supabase as "Supabase Auth"
participant Email as "Email Service"
participant Frontend as "Frontend"
User->>API : POST /api/auth/signup
API->>Supabase : Create user with email verification
Supabase->>Email : Send verification email
Email-->>User : Verification email received
User->>Frontend : Click verification link
Frontend->>API : GET /api/auth/verify?token=...
API->>API : Verify JWT token
API->>Supabase : Update user.is_active=true
API-->>Frontend : Redirect to profile setup
```

**Diagram sources**
- [pages/api/auth/signup.ts](file://pages/api/auth/signup.ts#L10-L25)
- [pages/api/auth/verify.ts](file://pages/api/auth/verify.ts#L35-L55)
- [src/utils/mailer.ts](file://src/utils/mailer.ts#L15-L35)

### Role-Based Access Control

The system implements hierarchical role-based access control:

```mermaid
classDiagram
class UserRole {
<<enumeration>>
CLIENT
PHOTOGRAPHER
ADMIN
}
class AuthMiddleware {
+withAuth(handler) Handler
+withRole(requiredRole) Handler
+withRoles(requiredRoles) Handler
}
class User {
+string id
+string email
+string role
+boolean isActive
}
AuthMiddleware --> UserRole : validates
AuthMiddleware --> User : authenticates
User --> UserRole : has
```

**Diagram sources**
- [src/middleware/auth.ts](file://src/middleware/auth.ts#L45-L95)
- [src/lib/supabase.ts](file://src/lib/supabase.ts#L20-L30)

### CSRF Protection

While not explicitly implemented in the current codebase, CSRF protection can be added through:

- **SameSite Cookies**: Configure cookie attributes
- **CSRF Tokens**: Generate and validate tokens for state-changing requests
- **Origin Validation**: Verify request origins

### Rate Limiting

The system should implement rate limiting to prevent abuse:

- **Login Attempts**: Limit failed login attempts per IP/user
- **Signup Frequency**: Prevent spam account creation
- **API Rate Limits**: Limit API request frequency

**Section sources**
- [src/middleware/auth.ts](file://src/middleware/auth.ts#L45-L95)
- [src/utils/mailer.ts](file://src/utils/mailer.ts#L1-L39)

## Client-Side Integration

### Frontend Components

The authentication system integrates seamlessly with React components:

```mermaid
classDiagram
class GeneralizedSignupFlow {
+SignupStep currentStep
+UserType userType
+handleSignupSuccess()
+handleUserTypeSelect()
+handleOnboardingComplete()
}
class AuthMiddleware {
+AuthenticatedRequest req
+validateToken()
+checkPermissions()
}
class APIWrapper {
+signup(userData)
+signin(credentials)
+signout()
+updateRole(role)
}
GeneralizedSignupFlow --> AuthMiddleware : uses
GeneralizedSignupFlow --> APIWrapper : calls
AuthMiddleware --> APIWrapper : protects
```

**Diagram sources**
- [src/components/GeneralizedSignupFlow.tsx](file://src/components/GeneralizedSignupFlow.tsx#L1-L50)
- [src/middleware/auth.ts](file://src/middleware/auth.ts#L10-L40)
- [src/lib/api.ts](file://src/lib/api.ts#L15-L40)

### API Wrapper Usage

The client-side API wrapper simplifies authentication operations:

```typescript
// Example usage in React components
import { authAPI } from '@/src/lib/api';

// Sign up new user
const signup = async (userData: SignupData) => {
  try {
    const response = await authAPI.signup(userData);
    // Handle successful signup
  } catch (error) {
    // Handle signup error
  }
};

// Sign in existing user
const signin = async (credentials: Credentials) => {
  try {
    const response = await authAPI.signin(credentials);
    // Store session token
    localStorage.setItem('auth_token', response.session.access_token);
  } catch (error) {
    // Handle signin error
  }
};
```

### Authentication State Management

The system maintains authentication state through:

- **Local Storage**: Secure storage of JWT tokens
- **Session Storage**: Temporary session data
- **Context API**: Global authentication state
- **React Query**: Caching and synchronization of auth data

**Section sources**
- [src/components/GeneralizedSignupFlow.tsx](file://src/components/GeneralizedSignupFlow.tsx#L1-L192)
- [src/lib/api.ts](file://src/lib/api.ts#L1-L261)

## Error Handling

### HTTP Status Codes

The API uses standard HTTP status codes with specific meanings:

| Status Code | Meaning | Common Causes |
|-------------|---------|---------------|
| 200 | Success | Successful operation |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Invalid or missing authentication |
| 403 | Forbidden | Insufficient permissions |
| 405 | Method Not Allowed | Incorrect HTTP method |
| 500 | Internal Server Error | Unexpected server error |

### Error Response Format

All error responses follow a consistent format:

```typescript
interface ErrorResponse {
  error: string;
  details?: string[];
}

// Example error response
{
  "error": "Validation failed",
  "details": [
    "email is required",
    "password must be at least 6 characters long"
  ]
}
```

### Common Error Scenarios

1. **Invalid Credentials** (`401`)
   - Incorrect email/password combination
   - Account locked due to multiple failed attempts
   - Unverified email address

2. **Validation Errors** (`400`)
   - Missing required fields
   - Invalid email format
   - Password too short
   - Phone number format invalid

3. **Permission Denied** (`403`)
   - User lacks required role
   - Admin-only endpoint accessed by regular user
   - Role update attempted with invalid role

4. **Server Errors** (`500`)
   - Database connection failures
   - Supabase service unavailable
   - Internal processing errors

**Section sources**
- [pages/api/auth/signin.ts](file://pages/api/auth/signin.ts#L20-L35)
- [pages/api/auth/signup.ts](file://pages/api/auth/signup.ts#L15-L25)
- [src/middleware/validation.ts](file://src/middleware/validation.ts#L120-L140)

## Rate Limiting and Performance

### Performance Considerations

The authentication system is designed for optimal performance:

- **Connection Pooling**: Efficient database connections
- **Caching**: JWT token validation caching
- **Async Operations**: Non-blocking API calls
- **Minimal Dependencies**: Lightweight authentication stack

### Scalability Features

- **Horizontal Scaling**: Stateless authentication design
- **Load Balancing**: Session-independent requests
- **Database Optimization**: Indexed queries on user identifiers
- **CDN Integration**: Static assets and email templates

### Monitoring and Metrics

Recommended monitoring includes:

- **Authentication Success Rate**: Track login/signup success rates
- **Error Rates**: Monitor 4xx and 5xx error frequencies
- **Response Times**: Measure API latency
- **Concurrent Sessions**: Track active user sessions
- **Resource Usage**: Monitor database and Supabase usage

## Troubleshooting Guide

### Common Issues and Solutions

#### Authentication Failures

**Problem**: Users cannot log in despite correct credentials
**Solution**: 
1. Verify Supabase project configuration
2. Check email verification status
3. Confirm user account is active
4. Review Supabase logs for authentication errors

#### Email Verification Issues

**Problem**: Verification emails not being delivered
**Solution**:
1. Verify email service configuration (SMTP settings)
2. Check email provider quotas and restrictions
3. Test with different email providers
4. Review email template formatting

#### Role Update Failures

**Problem**: User role updates fail silently
**Solution**:
1. Verify user authentication before role update
2. Check database permissions for role updates
3. Validate role values match allowed enumerations
4. Review server logs for detailed error messages

#### CORS Issues

**Problem**: Cross-origin requests blocked
**Solution**:
1. Verify CORS configuration in middleware
2. Check origin headers in requests
3. Ensure wildcard origins are configured correctly
4. Review browser console for CORS error details

### Debugging Tools

#### Supabase Console
- Monitor authentication events
- View user activity logs
- Check email delivery status
- Review database queries

#### Browser Developer Tools
- Network tab: Monitor API requests/responses
- Application tab: Inspect local/session storage
- Console: View JavaScript errors and warnings
- Security tab: Check certificate validity

#### Server Logs
- Enable detailed logging for authentication endpoints
- Monitor Supabase service health
- Track database connection issues
- Review middleware execution flow

**Section sources**
- [pages/api/auth/signin.ts](file://pages/api/auth/signin.ts#L50-L64)
- [pages/api/auth/signup.ts](file://pages/api/auth/signup.ts#L60-L80)
- [src/utils/mailer.ts](file://src/utils/mailer.ts#L1-L39)

## Best Practices

### Security Best Practices

1. **Environment Variables**
   - Store sensitive configuration in environment variables
   - Never commit secrets to version control
   - Use different keys for development and production

2. **Token Security**
   - Implement proper token expiration policies
   - Use HTTPS for all authentication communications
   - Store tokens securely in browser storage
   - Implement token refresh mechanisms

3. **Input Validation**
   - Validate all user inputs server-side
   - Use parameterized queries to prevent SQL injection
   - Implement rate limiting for authentication endpoints
   - Sanitize user-generated content

4. **Error Handling**
   - Avoid exposing sensitive information in error messages
   - Log errors securely without revealing internal details
   - Implement graceful degradation for authentication failures
   - Provide user-friendly error messages

### Development Best Practices

1. **Code Organization**
   - Separate authentication logic from business logic
   - Use middleware for cross-cutting concerns
   - Implement consistent error handling patterns
   - Document API endpoints thoroughly

2. **Testing Strategies**
   - Unit test authentication functions
   - Integration test API endpoints
   - Test error scenarios comprehensively
   - Mock external services for isolated testing

3. **Deployment Considerations**
   - Configure proper CORS headers
   - Set up monitoring and alerting
   - Implement backup and recovery procedures
   - Plan for authentication service scaling

### Maintenance Guidelines

1. **Regular Updates**
   - Keep Supabase and dependencies updated
   - Monitor security advisories
   - Review authentication logs regularly
   - Update error handling as needed

2. **Performance Monitoring**
   - Track authentication metrics
   - Monitor response times
   - Review resource usage patterns
   - Optimize slow queries

3. **User Experience**
   - Provide clear feedback for authentication actions
   - Implement loading states for async operations
   - Offer helpful error messages
   - Design responsive authentication forms