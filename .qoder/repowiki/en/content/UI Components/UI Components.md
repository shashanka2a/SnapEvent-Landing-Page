# UI Components

<cite>
**Referenced Files in This Document**   
- [button.tsx](file://src/components/ui/button.tsx)
- [dialog.tsx](file://src/components/ui/dialog.tsx)
- [form.tsx](file://src/components/ui/form.tsx)
- [input.tsx](file://src/components/ui/input.tsx)
- [card.tsx](file://src/components/ui/card.tsx)
- [tabs.tsx](file://src/components/ui/tabs.tsx)
- [navigation-menu.tsx](file://src/components/ui/navigation-menu.tsx)
- [badge.tsx](file://src/components/ui/badge.tsx)
- [alert.tsx](file://src/components/ui/alert.tsx)
- [avatar.tsx](file://src/components/ui/avatar.tsx)
- [checkbox.tsx](file://src/components/ui/checkbox.tsx)
- [switch.tsx](file://src/components/ui/switch.tsx)
- [slider.tsx](file://src/components/ui/slider.tsx)
- [utils.ts](file://src/components/ui/utils.ts)
- [use-mobile.ts](file://src/components/ui/use-mobile.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Component Organization](#component-organization)
3. [Core Components](#core-components)
4. [Form Components](#form-components)
5. [Navigation Components](#navigation-components)
6. [Styling and Theme System](#styling-and-theme-system)
7. [Accessibility and Responsive Design](#accessibility-and-responsive-design)
8. [Component Composition Patterns](#component-composition-patterns)
9. [Conclusion](#conclusion)

## Introduction
The UI component library in the SnapEvent-Landing-Page project follows Headless UI patterns, providing a collection of accessible, reusable components built with React and Radix UI primitives. The components are designed to be composable, theme-aware, and accessible by default. This documentation details the organization, usage, and customization options for the key components in the library.

## Component Organization
The UI components are organized in the `src/components/ui` directory, following a modular pattern where each component has its own file. The library leverages Headless UI principles by separating component logic from presentation, using Radix UI primitives for accessible interactions and Tailwind CSS for styling. The components are designed to be imported individually, enabling tree-shaking and optimal bundle sizes.

**Section sources**
- [button.tsx](file://src/components/ui/button.tsx)
- [dialog.tsx](file://src/components/ui/dialog.tsx)
- [form.tsx](file://src/components/ui/form.tsx)

## Core Components

### Button Component
The Button component provides multiple variants and sizes for different use cases. It supports the `asChild` prop to render as different elements while maintaining consistent styling. The component uses `class-variance-authority` (cva) for variant management and integrates with the project's `cn` utility for className merging.

**Props:**
- `variant`: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
- `size`: "default" | "sm" | "lg" | "icon"
- `asChild`: boolean (renders as child element)
- Inherits all standard button props

**Events:**
- Standard button events (onClick, onMouseEnter, etc.)

**Customization:**
- Theme colors are controlled through CSS variables
- Size and spacing can be adjusted via Tailwind classes
- Icon support through SVG children

**Section sources**
- [button.tsx](file://src/components/ui/button.tsx)

### Card Component
The Card component provides a container for grouping related content with a consistent visual style. It includes subcomponents for header, title, description, content, footer, and action areas, enabling flexible composition.

**Props:**
- Standard div props
- Composed of CardHeader, CardTitle, CardDescription, CardContent, CardFooter, and CardAction

**Usage Example:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

**Section sources**
- [card.tsx](file://src/components/ui/card.tsx)

### Dialog Component
The Dialog component implements modal dialogs with accessible markup and animations. It follows WAI-ARIA practices for modal dialogs and includes overlay, content, header, footer, title, and description subcomponents.

**Props:**
- Inherits Radix UI Dialog props (open, onOpenChange, etc.)
- Standard div props for subcomponents

**Events:**
- onOpenChange: triggered when dialog open state changes
- onCloseAutoFocus: prevents focus loss

**Accessibility Features:**
- Focus trapping within dialog
- Proper aria attributes
- Escape key closes dialog
- Click outside closes dialog

**Section sources**
- [dialog.tsx](file://src/components/ui/dialog.tsx)

### Badge Component
The Badge component displays small status indicators or labels with different visual styles. It supports link behavior through the `asChild` prop.

**Props:**
- `variant`: "default" | "secondary" | "destructive" | "outline"
- `asChild`: boolean

**Customization:**
- Color variants map to theme colors
- Supports icon children
- Responsive text sizing

**Section sources**
- [badge.tsx](file://src/components/ui/badge.tsx)

### Alert Component
The Alert component displays important messages with optional titles and descriptions. It supports destructive (error) variants with appropriate color treatment.

**Props:**
- `variant`: "default" | "destructive"
- Standard div props

**Subcomponents:**
- AlertTitle: for heading content
- AlertDescription: for detailed message content

**Section sources**
- [alert.tsx](file://src/components/ui/alert.tsx)

## Form Components

### Form Component
The Form component integrates with react-hook-form for form state management. It provides a context-based system for form fields with automatic error handling and accessibility attributes.

**Key Features:**
- Uses react-hook-form for validation and state
- Context system for field relationships
- Automatic accessibility attributes (aria-invalid, aria-describedby)
- Error message handling

**Subcomponents:**
- FormItem: wrapper for form elements
- FormLabel: accessible label with error state
- FormControl: input element with proper IDs
- FormDescription: helper text
- FormMessage: error message display
- FormField: controller for react-hook-form

**Section sources**
- [form.tsx](file://src/components/ui/form.tsx)

### Input Component
The Input component provides styled text inputs with consistent styling and accessibility features. It integrates with the form system for error states.

**Props:**
- Standard input props (type, placeholder, disabled, etc.)
- className for additional styling

**Accessibility Features:**
- Focus ring with appropriate contrast
- Error state visual feedback
- Proper label association

**Section sources**
- [input.tsx](file://src/components/ui/input.tsx)

### Checkbox Component
The Checkbox component implements accessible checkboxes with visual feedback. It uses Radix UI's checkbox primitive for proper keyboard navigation and screen reader support.

**Props:**
- Standard checkbox props (checked, onCheckedChange, disabled)
- className for styling

**Visual Features:**
- Check icon animation
- Hover and focus states
- Disabled opacity treatment

**Section sources**
- [checkbox.tsx](file://src/components/ui/checkbox.tsx)

### Switch Component
The Switch component provides a toggle control with smooth animations. It follows the same accessibility patterns as the checkbox but with a different visual presentation.

**Props:**
- Standard switch props (checked, onCheckedChange, disabled)
- className for styling

**Animation:**
- Smooth translate transition for thumb movement
- Visual feedback for state changes

**Section sources**
- [switch.tsx](file://src/components/ui/switch.tsx)

### Slider Component
The Slider component implements a range slider with multiple thumb support. It handles both horizontal and vertical orientations.

**Props:**
- `min`, `max`: range values
- `defaultValue`, `value`: controlled/uncontrolled values
- `step`: increment value
- className for styling

**Features:**
- Range visualization
- Multiple thumb support
- Vertical orientation capability
- Touch and keyboard support

**Section sources**
- [slider.tsx](file://src/components/ui/slider.tsx)

## Navigation Components

### Tabs Component
The Tabs component implements tabbed interfaces with smooth transitions between panels. It uses Radix UI's tabs primitive for proper accessibility.

**Subcomponents:**
- Tabs: root container
- TabsList: container for triggers
- TabsTrigger: individual tab button
- TabsContent: panel content

**Features:**
- Keyboard navigation (arrow keys)
- Focus management
- Animated transitions
- Active state styling

**Section sources**
- [tabs.tsx](file://src/components/ui/tabs.tsx)

### Navigation Menu Component
The Navigation Menu component provides a sophisticated menu system with dropdown support. It's designed for complex navigation structures.

**Subcomponents:**
- NavigationMenu: root container
- NavigationMenuList: list of items
- NavigationMenuItem: individual item
- NavigationMenuTrigger: trigger for dropdown
- NavigationMenuContent: dropdown content
- NavigationMenuLink: navigation links
- NavigationMenuViewport: container for active content

**Features:**
- Dropdown animations
- Viewport awareness
- Indicator for active section
- Responsive behavior

**Section sources**
- [navigation-menu.tsx](file://src/components/ui/navigation-menu.tsx)

### Avatar Component
The Avatar component displays user profile images with fallback text. It handles image loading states gracefully.

**Subcomponents:**
- Avatar: container
- AvatarImage: image element
- AvatarFallback: text fallback

**Features:**
- Circular cropping
- Loading state handling
- Fallback for missing images
- Consistent sizing

**Section sources**
- [avatar.tsx](file://src/components/ui/avatar.tsx)

## Styling and Theme System

### Utility Functions
The component library uses utility functions for className management and merging.

**cn function:**
- Combines `clsx` and `tailwind-merge` for conditional classnames
- Resolves conflicting Tailwind classes
- Enables theme-aware styling

```ts
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Section sources**
- [utils.ts](file://src/components/ui/utils.ts)

### Theme Integration
The components use CSS variables for theming, allowing for easy theme switching and customization. Color names follow a semantic pattern (primary, secondary, destructive, etc.) that maps to design tokens.

**Color System:**
- `primary`: main brand color
- `secondary`: secondary brand color
- `destructive`: error/warning states
- `muted`: low emphasis content
- `accent`: accent elements

**Section sources**
- [button.tsx](file://src/components/ui/button.tsx)
- [badge.tsx](file://src/components/ui/badge.tsx)

## Accessibility and Responsive Design

### Accessibility Features
The component library prioritizes accessibility through:

- Proper ARIA attributes on all interactive elements
- Keyboard navigation support
- Focus management in modals and dropdowns
- Screen reader-friendly markup
- Color contrast compliance
- Semantic HTML structure

**Section sources**
- [dialog.tsx](file://src/components/ui/dialog.tsx)
- [checkbox.tsx](file://src/components/ui/checkbox.tsx)
- [navigation-menu.tsx](file://src/components/ui/navigation-menu.tsx)

### Responsive Design
Components are designed to be responsive by default:

- Mobile-first approach
- Flexible layouts using CSS Grid and Flexbox
- Responsive breakpoints in Tailwind classes
- Touch-friendly hit areas
- Adaptive behaviors based on screen size

**Mobile Detection:**
The `use-mobile.ts` utility provides hooks for detecting mobile devices and adjusting behavior accordingly.

**Section sources**
- [use-mobile.ts](file://src/components/ui/use-mobile.ts)
- [navigation-menu.tsx](file://src/components/ui/navigation-menu.tsx)

## Component Composition Patterns

### Compound Components
The library uses the compound component pattern extensively, where a parent component provides context to its children:

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

**Benefits:**
- Clear component hierarchy
- Shared context between parts
- Consistent styling
- Type safety

### Slot Pattern
The `asChild` prop implements the slot pattern, allowing components to render as different elements while maintaining styling:

```tsx
<Button asChild>
  <Link href="/page">Link as Button</Link>
</Button>
```

**Section sources**
- [button.tsx](file://src/components/ui/button.tsx)
- [badge.tsx](file://src/components/ui/badge.tsx)

## Conclusion
The UI component library in the SnapEvent-Landing-Page project provides a comprehensive set of accessible, reusable components following Headless UI patterns. By leveraging Radix UI primitives, Tailwind CSS, and React best practices, the components offer flexibility, accessibility, and consistent styling. The library's organization enables easy maintenance and extension, while the composition patterns support complex UI requirements. Developers can use these components to build consistent, accessible interfaces while maintaining the ability to customize appearance and behavior as needed.