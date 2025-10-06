# Technology Stack

<cite>
**Referenced Files in This Document**   
- [package.json](file://package.json)
- [next.config.js](file://next.config.js)
- [tailwind.config.js](file://tailwind.config.js)
- [tsconfig.json](file://tsconfig.json)
- [supabase.ts](file://src/lib/supabase.ts)
- [supabase-server.ts](file://src/lib/supabase-server.ts)
- [api.ts](file://src/lib/api.ts)
- [App.tsx](file://src/App.tsx)
- [LandingPage.tsx](file://src/components/LandingPage.tsx)
- [button.tsx](file://src/components/ui/button.tsx)
- [form.tsx](file://src/components/ui/form.tsx)
- [input.tsx](file://src/components/ui/input.tsx)
- [select.tsx](file://src/components/ui/select.tsx)
- [utils.ts](file://src/components/ui/utils.ts)
- [middleware.ts](file://src/middleware.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Core Frameworks](#core-frameworks)
3. [Styling Architecture](#styling-architecture)
4. [Backend and Data Management](#backend-and-data-management)
5. [Supporting Libraries](#supporting-libraries)
6. [Configuration and Setup](#configuration-and-setup)
7. [Integration Patterns](#integration-patterns)
8. [Development and Production Considerations](#development-and-production-considerations)

## Introduction
SnapEvent leverages a modern technology stack designed for scalability, type safety, and developer experience. The application combines Next.js for server-side rendering and API routes with React's component architecture, enhanced by TypeScript for type safety. Tailwind CSS provides utility-first styling, while Supabase handles authentication and database operations. Supporting libraries like Framer Motion, React Hook Form, Lucide React, and Prisma complete the ecosystem, enabling rich interactions, form handling, iconography, and database modeling. This document details each technology's role, configuration, integration patterns, and rationale within the SnapEvent architecture.

## Core Frameworks

### Next.js for SSR and API Routes
Next.js serves as the foundation of SnapEvent, providing server-side rendering (SSR) capabilities that enhance SEO and initial load performance. The `pages` directory structure enables automatic routing, with files like `index.tsx`, `signup.tsx`, and `_app.tsx` defining the application's routes and layout. API routes are implemented within the `pages/api` directory, containing endpoints for authentication (`auth/signin.ts`, `auth/signup.ts`), bookings (`bookings/index.ts`), and photographers (`photographers/index.ts`). These API routes allow server-side logic execution without requiring a separate backend service.

The `next.config.js` configuration file includes settings for trailing slashes and image optimization, with `images: { unoptimized: true }` indicating that image optimization is disabled, likely to simplify deployment or accommodate specific hosting requirements. Next.js also enables hybrid static and server rendering, allowing certain pages to be pre-rendered at build time while others are rendered on-demand.

**Section sources**
- [next.config.js](file://next.config.js#L1-L9)
- [package.json](file://package.json#L1-L95)
- [pages/api](file://pages/api)

### React for Component Architecture
React forms the core of SnapEvent's frontend architecture, implementing a component-based structure that promotes reusability and maintainability. The application organizes components within the `src/components` directory, with UI components in `src/components/ui` following a modular pattern. Key components like `LandingPage.tsx`, `OnboardingForm.tsx`, and `PortfolioPage.tsx` represent major application views, while smaller UI elements like buttons, inputs, and cards are encapsulated in reusable components.

The component hierarchy begins with `App.tsx`, which manages application state and navigation between different views (`landing`, `onboarding`, `portfolio`, `signup`). React's useState hook manages the current page state, while props facilitate communication between parent and child components. This architecture enables a clean separation of concerns and promotes component reuse across the application.

**Section sources**
- [App.tsx](file://src/App.tsx#L1-L55)
- [LandingPage.tsx](file://src/components/LandingPage.tsx#L1-L844)
- [src/components](file://src/components)

### TypeScript for Type Safety
TypeScript is integral to SnapEvent's development process, providing static typing that enhances code quality and developer experience. The `tsconfig.json` file configures TypeScript compilation options, including target ECMAScript version (`es5`), module resolution (`bundler`), and strict type checking (`"strict": true`). The configuration also sets up path aliases with `"@/*": ["./src/*"]`, enabling cleaner import statements throughout the codebase.

TypeScript interfaces and types are used extensively to define data structures, such as the `Photographer` and `Booking` interfaces in `api.ts`, which ensure type safety when working with API responses. The Supabase client in `supabase.ts` includes comprehensive type definitions for database tables, providing compile-time validation for database operations and reducing runtime errors.

**Section sources**
- [tsconfig.json](file://tsconfig.json#L1-L29)
- [api.ts](file://src/lib/api.ts#L1-L261)
- [supabase.ts](file://src/lib/supabase.ts#L1-L242)

## Styling Architecture

### Tailwind CSS for Utility-First Styling
Tailwind CSS implements a utility-first approach to styling, enabling developers to build custom designs directly in markup without writing custom CSS. The `tailwind.config.js` file configures the design system with custom colors, spacing, and animations, leveraging CSS variables for theme customization. The configuration includes support for dark mode with `darkMode: ["class"]`, allowing seamless theme switching.

The content configuration specifies directories to scan for Tailwind classes, including `./pages/**/*.{ts,tsx}`, `./components/**/*.{ts,tsx}`, and `./src/**/*.{ts,tsx}`. This ensures all relevant files are processed for class extraction. The theme extends default values with custom colors, border radii, and animations, particularly for the accordion component which uses keyframe animations defined in the configuration.

**Section sources**
- [tailwind.config.js](file://tailwind.config.js#L1-L78)
- [package.json](file://package.json#L1-L95)

### UI Component Library
The application implements a comprehensive UI component library in `src/components/ui`, containing reusable components like `button.tsx`, `input.tsx`, `select.tsx`, and `card.tsx`. These components leverage Tailwind CSS classes for styling while exposing props for customization. The `button.tsx` component, for example, uses `cva` (Class Variance Authority) to define variants for different button styles (`default`, `destructive`, `outline`, `secondary`, `ghost`, `link`) and sizes (`default`, `sm`, `lg`, `icon`).

The component library follows the Radix UI pattern, using primitive components from `@radix-ui/react-*` packages as building blocks. This approach ensures accessibility and proper behavior while allowing complete control over styling. Utility functions in `utils.ts` combine `clsx` and `tailwind-merge` to safely compose class names, handling conditional classes and ensuring that conflicting Tailwind classes are properly resolved.

**Section sources**
- [button.tsx](file://src/components/ui/button.tsx#L1-L59)
- [input.tsx](file://src/components/ui/input.tsx#L1-L22)
- [select.tsx](file://src/components/ui/select.tsx#L1-L190)
- [utils.ts](file://src/components/ui/utils.ts#L1-L7)

## Backend and Data Management

### Supabase for Authentication and Database
Supabase serves as the backend-as-a-service solution for SnapEvent, providing authentication, database, and storage functionality. The application integrates with Supabase through the `@supabase/supabase-js` client library, with configuration managed in `supabase.ts` and `supabase-server.ts`. Environment variables `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` provide client-side configuration, while `SUPABASE_SERVICE_ROLE_KEY` enables server-side administrative operations.

The `supabase.ts` file exports a client instance for client-side usage with authentication settings configured for token auto-refresh and session persistence. It also includes a type-safe database schema definition that mirrors the Supabase PostgreSQL database structure, covering tables like `users` and `photographer_profiles`. Helper functions simplify common operations like user authentication, profile retrieval, and data manipulation.

For server-side operations, `supabase-server.ts` provides functions to create both regular and admin clients. The admin client uses the service role key for elevated privileges, enabling operations like retrieving all users or updating user status that would be restricted for regular clients. This separation of concerns enhances security by limiting client-side capabilities while providing necessary administrative functionality on the server.

**Section sources**
- [supabase.ts](file://src/lib/supabase.ts#L1-L242)
- [supabase-server.ts](file://src/lib/supabase-server.ts#L1-L108)
- [package.json](file://package.json#L1-L95)

### Prisma for ORM
Prisma serves as the Object-Relational Mapper (ORM) for database interactions, providing type-safe database access and schema management. The `prisma` directory contains the database schema and seed data, with `prisma/seed.ts` defining initial data for development and testing. Prisma Client (`@prisma/client`) is included as a dependency, generating type-safe query builders based on the database schema.

The `package.json` file includes several Prisma-related scripts: `db:generate` for generating Prisma Client, `db:push` for pushing schema changes to the database, `db:migrate` for creating and applying migrations, `db:seed` for running the seed script, and `db:studio` for launching the Prisma Studio GUI. This comprehensive tooling enables efficient database development workflows, from schema evolution to data seeding.

**Section sources**
- [package.json](file://package.json#L1-L95)
- [prisma/seed.ts](file://prisma/seed.ts)

## Supporting Libraries

### Framer Motion for Animations
Framer Motion provides advanced animation capabilities for the SnapEvent interface, enabling smooth transitions, gestures, and visual feedback. The `LandingPage.tsx` component imports `motion`, `AnimatePresence`, and various animation utilities from `framer-motion`, using them to create entrance animations, hover effects, and interactive transitions.

Animation variants are defined as objects containing `initial`, `animate`, and `transition` properties, allowing consistent animation patterns across components. For example, `fadeInUp`, `staggerContainer`, and `scaleOnHover` variants are used throughout the landing page to create a dynamic user experience. The `whileHover` and `whileTap` props enable gesture-based animations, providing immediate visual feedback for user interactions.

**Section sources**
- [LandingPage.tsx](file://src/components/LandingPage.tsx#L1-L844)
- [package.json](file://package.json#L1-L95)

### React Hook Form for Form Handling
React Hook Form manages form state and validation in SnapEvent, providing an efficient and flexible approach to form handling. The `form.tsx` component in the UI library integrates React Hook Form with Radix UI primitives, creating accessible form components that work seamlessly with the library's type system.

The implementation uses `useFormContext` and `Controller` components to connect form fields with the form state, while `useFormState` provides access to form validation status. Custom hooks like `useFormField` enhance the developer experience by abstracting common patterns and ensuring consistent behavior across form elements. This approach minimizes re-renders and improves performance compared to traditional controlled components.

**Section sources**
- [form.tsx](file://src/components/ui/form.tsx#L1-L169)
- [package.json](file://package.json#L1-L95)

### Lucide React for Icons
Lucide React provides a comprehensive icon library for the application, with individual icons imported as needed from the `lucide-react` package. The `LandingPage.tsx` component imports specific icons like `Search`, `MapPin`, `Users`, `Camera`, `Star`, and `ArrowRight`, using them to enhance visual communication and user interface elements.

This selective import approach optimizes bundle size by including only the icons that are actually used in the application. The icons are implemented as React components, allowing them to be styled with Tailwind CSS classes and integrated seamlessly with other UI elements. Their consistent design language contributes to a cohesive user experience across the application.

**Section sources**
- [LandingPage.tsx](file://src/components/LandingPage.tsx#L1-L844)
- [package.json](file://package.json#L1-L95)

## Configuration and Setup

### Environment Configuration
The application uses environment variables extensively for configuration, with public variables prefixed with `NEXT_PUBLIC_` to make them available in the browser. The Supabase integration relies on `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_APP_URL`, while the service role key `SUPABASE_SERVICE_ROLE_KEY` remains server-side only for security.

The `package.json` scripts provide a comprehensive development workflow, including `dev` for development mode, `build` for production builds, `start` for running the production server, and `export` for static site generation. Database management scripts streamline schema evolution and data seeding, while testing scripts with Jest enable comprehensive test coverage.

**Section sources**
- [package.json](file://package.json#L1-L95)
- [supabase.ts](file://src/lib/supabase.ts#L1-L242)
- [api.ts](file://src/lib/api.ts#L1-L261)

### Middleware Configuration
Next.js middleware in `middleware.ts` handles cross-origin resource sharing (CORS) for API requests, ensuring proper headers are set for both preflight OPTIONS requests and subsequent API calls. The middleware configures allowed origins, methods, and headers, with a matcher that applies the middleware to most routes while excluding static assets and Next.js internal paths.

This configuration enables the application to handle API requests from different origins, which is essential for development workflows and potential integration with external services. The middleware also passes through non-OPTIONS requests while adding CORS headers, ensuring consistent behavior across different request types.

**Section sources**
- [middleware.ts](file://src/middleware.ts#L1-L40)
- [package.json](file://package.json#L1-L95)

## Integration Patterns

### API Service Layer
The application implements a service layer pattern in `api.ts`, abstracting API calls into dedicated functions that provide type safety and error handling. The `apiRequest` function serves as a generic wrapper for fetch operations, handling JSON serialization, error parsing, and consistent error reporting.

Specific API clients for authentication, photographers, and bookings organize related endpoints into cohesive modules. These services use the base URL from environment variables, enabling configuration across different deployment environments. The type definitions for `Photographer` and `Booking` interfaces ensure type safety throughout the application, from API responses to component props.

**Section sources**
- [api.ts](file://src/lib/api.ts#L1-L261)
- [supabase.ts](file://src/lib/supabase.ts#L1-L242)

### State Management Pattern
SnapEvent employs a hybrid state management approach, combining React's built-in state hooks with external libraries where appropriate. The top-level `App.tsx` component manages navigation state using `useState`, while individual components manage their own local state. For form state, React Hook Form provides efficient state management with minimal re-renders.

The application does not use a global state management library like Redux or Zustand, instead relying on prop drilling and context where necessary. This lightweight approach reduces complexity and bundle size while meeting the application's current requirements. As the application scales, context providers could be introduced to manage shared state more efficiently.

**Section sources**
- [App.tsx](file://src/App.tsx#L1-L55)
- [LandingPage.tsx](file://src/components/LandingPage.tsx#L1-L844)
- [form.tsx](file://src/components/ui/form.tsx#L1-L169)

## Development and Production Considerations

### Version Compatibility
The technology stack maintains careful version compatibility across dependencies. Next.js 14.2.15 works with React 18.3.1 and React DOM 18.3.1, ensuring compatibility between the framework and its rendering library. TypeScript 5.9.2 provides modern language features while maintaining compatibility with the Next.js plugin configuration.

The Prisma version 6.15.0 aligns with the Prisma Client version, ensuring stable database operations. Tailwind CSS 3.4.17 integrates with its ecosystem of plugins like `tailwindcss-animate` 1.0.7, providing consistent animation utilities. These version choices balance stability with access to recent features and security updates.

**Section sources**
- [package.json](file://package.json#L1-L95)
- [tsconfig.json](file://tsconfig.json#L1-L29)

### Local Development Setup
Local development is streamlined through the `package.json` scripts, with `npm run dev` starting the Next.js development server. The configuration supports hot reloading, allowing developers to see changes immediately. Database setup is automated through Prisma scripts, with `db:push` synchronizing the schema and `db:seed` populating initial data.

Environment variables are managed through `.env` files (not shown in the structure), with the required variables documented in the setup process. The combination of Next.js, TypeScript, and ESLint provides immediate feedback on code quality and potential errors, enhancing the developer experience.

**Section sources**
- [package.json](file://package.json#L1-L95)
- [prisma/seed.ts](file://prisma/seed.ts)

### Production Build Considerations
Production builds are optimized through the `build` and `export` scripts in `package.json`. The `export` script runs `next build` followed by `next export`, generating a static version of the application that can be deployed to static hosting services. This approach improves performance and reduces hosting costs compared to server-rendered deployments.

The `next.config.js` configuration disables image optimization with `images: { unoptimized: true }`, which may indicate that images are served from an external CDN or that the team prefers to handle image optimization separately. The trailing slash configuration ensures consistent URL patterns, which is important for SEO and routing reliability.

**Section sources**
- [next.config.js](file://next.config.js#L1-L9)
- [package.json](file://package.json#L1-L95)