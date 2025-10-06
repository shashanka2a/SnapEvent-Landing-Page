# Contribution Guidelines

<cite>
**Referenced Files in This Document**   
- [README.md](file://README.md)
- [package.json](file://package.json)
- [src/guidelines/Guidelines.md](file://src/guidelines/Guidelines.md)
- [src/lib/api.ts](file://src/lib/api.ts)
- [src/middleware/auth.ts](file://src/middleware/auth.ts)
- [src/components/ui/button.tsx](file://src/components/ui/button.tsx)
- [src/components/ui/utils.ts](file://src/components/ui/utils.ts)
- [tailwind.config.js](file://tailwind.config.js)
- [src/index.css](file://src/index.css)
- [src/App.tsx](file://src/App.tsx)
- [pages/_app.tsx](file://pages/_app.tsx)
- [src/components/LandingPage.tsx](file://src/components/LandingPage.tsx)
- [src/components/ui/input.tsx](file://src/components/ui/input.tsx)
- [src/components/ui/select.tsx](file://src/components/ui/select.tsx)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Code Style Guidelines](#code-style-guidelines)
3. [Pull Request Workflow](#pull-request-workflow)
4. [Branch Naming Conventions](#branch-naming-conventions)
5. [Commit Message Standards](#commit-message-standards)
6. [Testing Requirements](#testing-requirements)
7. [Proposing Major Changes](#proposing-major-changes)
8. [Issue Reporting Template](#issue-reporting-template)
9. [Feature Request Template](#feature-request-template)

## Introduction
Welcome to the SnapEvent Landing Page project! This document provides comprehensive guidelines for contributing to our codebase. Whether you're a first-time contributor or an experienced developer, these guidelines will help you understand our development practices, coding standards, and contribution workflow. Our goal is to maintain high code quality while making the contribution process welcoming and efficient for everyone.

## Code Style Guidelines

### TypeScript Conventions
Our project uses TypeScript with strict type checking enabled. All new code should include proper type annotations and follow these conventions:
- Use interface for object shapes and type for unions and primitives
- Prefer const assertions for immutable objects
- Use PascalCase for interfaces and types, camelCase for variables and functions
- Include JSDoc comments for public functions and complex logic
- Avoid any type; use specific types or unknown with proper type guards

### React Component Guidelines
We follow React best practices with a focus on reusable, accessible components:
- Use functional components with hooks
- Keep components small and focused on a single responsibility
- Use React.memo for components that render frequently with the same props
- Destructure props at the beginning of component functions
- Use custom hooks to extract component logic
- Prefer client components only when necessary (use "use client" directive)

### Tailwind CSS Conventions
Our styling system is built on Tailwind CSS with the following guidelines:
- Use the `cn()` utility function for conditional class composition
- Follow the order: layout → positioning → styling → states
- Use semantic class names only when necessary for readability
- Leverage the design system tokens defined in CSS variables
- Avoid custom CSS unless absolutely necessary
- Use responsive prefixes consistently (sm:, md:, lg:)

The project uses a utility-first approach with Tailwind, and all components should use the provided UI components from `src/components/ui` when available.

**Section sources**
- [src/components/ui/button.tsx](file://src/components/ui/button.tsx#L1-L59)
- [src/components/ui/utils.ts](file://src/components/ui/utils.ts#L1-L7)
- [tailwind.config.js](file://tailwind.config.js#L1-L78)
- [src/index.css](file://src/index.css#L1-L60)

## Pull Request Workflow

### PR Creation Process
1. Fork the repository and create a feature branch from main
2. Implement your changes following the code style guidelines
3. Write appropriate tests for new functionality
4. Ensure all existing tests pass
5. Create a pull request with a clear description of changes
6. Link to any relevant issues using GitHub keywords

### Review Process
All pull requests undergo a thorough review process:
- At least one maintainer must approve the PR
- Code must pass all automated tests and linting
- Documentation updates must accompany feature changes
- Accessibility considerations must be addressed
- Performance implications must be evaluated

### Merge Criteria
Pull requests will be merged when they meet all of the following criteria:
- ✅ All tests are passing
- ✅ Code style guidelines are followed
- ✅ Clear and concise commit messages
- ✅ Comprehensive documentation updates
- ✅ Approval from at least one project maintainer
- ✅ Successful deployment to staging environment

Maintainers will typically respond to PRs within 48 hours during business days. For urgent fixes, tag @maintainer-team in the PR comments.

**Section sources**
- [package.json](file://package.json#L1-L95)
- [README.md](file://README.md#L1-L11)

## Branch Naming Conventions

We use a structured branch naming system to maintain organization and clarity:

### Feature Branches
`feature/[short-description]`
- Examples: `feature/user-authentication`, `feature/booking-calendar`
- Use lowercase with hyphens to separate words
- Keep descriptions concise but meaningful

### Bug Fix Branches
`fix/[short-description]`
- Examples: `fix/login-error`, `fix/responsive-layout`
- Should reference the issue number when possible: `fix/login-error-123`

### Documentation Branches
`docs/[short-description]`
- Examples: `docs/contribution-guide`, `docs/api-reference`

### Release Branches
`release/v[version]`
- Examples: `release/v1.2.0`
- Created for final testing before production deployment

All branches should be created from the main branch unless otherwise specified by the release manager.

**Section sources**
- [README.md](file://README.md#L1-L11)
- [package.json](file://package.json#L1-L95)

## Commit Message Standards

We follow conventional commit guidelines to ensure clear and consistent commit history:

### Commit Message Format
```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

### Allowed Types
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code formatting changes (white-space, formatting, etc.)
- `refactor`: Code changes that neither fix bugs nor add features
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

### Scope Convention
The scope should be a noun that describes the affected component:
- `auth`: Authentication related changes
- `api`: API service layer changes
- `ui`: User interface components
- `styles`: CSS/Tailwind changes
- `utils`: Utility functions

### Example Commits
```
feat(auth): implement email verification flow
fix(ui): resolve responsive layout issue on mobile
docs: update contribution guidelines
style: format code according to linting rules
```

Write commit messages in the imperative mood ("add feature" not "added feature" or "adds feature").

**Section sources**
- [package.json](file://package.json#L1-L95)
- [src/lib/api.ts](file://src/lib/api.ts#L1-L261)

## Testing Requirements

### Test Coverage Standards
All new contributions must include appropriate tests:
- Unit tests for utility functions and hooks
- Integration tests for component interactions
- End-to-end tests for critical user flows
- Minimum 80% test coverage for new code

### Testing Tools
Our testing stack includes:
- Jest for test running and assertions
- React Testing Library for component testing
- Playwright for end-to-end testing
- ESLint with TypeScript rules

### Test Structure
Organize tests following this pattern:
```
__tests__/
  components/
    Button.test.tsx
    Form.test.tsx
  hooks/
    useAuth.test.ts
  utils/
    validators.test.ts
  integration/
    auth-flow.test.ts
```

Or co-locate tests with source files:
```
src/components/Button.tsx
src/components/Button.test.tsx
```

### Running Tests
Use the following commands to run tests:
```bash
npm test                    # Run all tests
npm run test:coverage       # Run tests with coverage report
npm run test -- -t "login"  # Run tests matching "login"
```

**Section sources**
- [package.json](file://package.json#L1-L95)
- [src/lib/api.ts](file://src/lib/api.ts#L1-L261)

## Proposing Major Changes

### RFC Process
For significant architectural changes or new features, follow our Request for Comments (RFC) process:

1. **Create an RFC Issue**
   - Use the "RFC" template
   - Include problem statement, proposed solution, alternatives considered
   - Add `rfc` label

2. **Gather Feedback**
   - Engage with the community and maintainers
   - Address concerns and iterate on the proposal
   - Minimum 7-day comment period

3. **Decision Making**
   - Maintainers will evaluate the RFC
   - Decision will be documented in the issue
   - Approved RFCs will be assigned an implementation issue

### Design Requirements
Major changes should include:
- Architecture diagrams showing component relationships
- Data flow diagrams for complex interactions
- API design specifications
- Migration plan for existing users
- Performance impact analysis
- Accessibility considerations

### Implementation Phases
Approved major changes should be implemented in phases:
1. Core infrastructure
2. Basic functionality
3. Edge cases and error handling
4. Documentation and examples
5. Final testing and deployment

This phased approach allows for incremental review and reduces risk.

**Section sources**
- [src/App.tsx](file://src/App.tsx#L1-L55)
- [src/components/LandingPage.tsx](file://src/components/LandingPage.tsx#L1-L799)

## Issue Reporting Template

```markdown
<!-- Before submitting, please search existing issues to avoid duplicates -->

## Expected Behavior
<!-- Describe what should happen -->

## Actual Behavior
<!-- Describe what actually happens -->

## Steps to Reproduce
1. 
2. 
3. 

## Environment
- Browser: [e.g., Chrome 120]
- OS: [e.g., Windows 11]
- Device: [e.g., Desktop]

## Screenshots
<!-- Add screenshots if applicable -->

## Console Errors
<!-- Paste any console errors here -->

## Additional Context
<!-- Add any other context about the problem here -->
```

**Section sources**
- [README.md](file://README.md#L1-L11)

## Feature Request Template

```markdown
## Problem Statement
<!-- Describe the problem this feature would solve -->

## Proposed Solution
<!-- Describe your proposed solution in detail -->

## Alternatives Considered
<!-- What other approaches did you consider? -->

## Implementation Details
<!-- Technical details about how this could be implemented -->

## Benefits
<!-- What are the benefits of this feature? -->

## Potential Drawbacks
<!-- What are the potential downsides or challenges? -->

## Examples
<!-- Include examples of how this would be used -->
```

**Section sources**
- [README.md](file://README.md#L1-L11)