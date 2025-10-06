# Data Display Components

<cite>
**Referenced Files in This Document**   
- [table.tsx](file://src/components/ui/table.tsx)
- [card.tsx](file://src/components/ui/card.tsx)
- [accordion.tsx](file://src/components/ui/accordion.tsx)
- [avatar.tsx](file://src/components/ui/avatar.tsx)
- [badge.tsx](file://src/components/ui/badge.tsx)
- [chart.tsx](file://src/components/ui/chart.tsx)
- [progress.tsx](file://src/components/ui/progress.tsx)
- [skeleton.tsx](file://src/components/ui/skeleton.tsx)
- [PortfolioPage.tsx](file://src/components/PortfolioPage.tsx)
- [BookingManager.tsx](file://src/components/BookingManager.tsx)
- [supabase.ts](file://src/lib/supabase.ts)
- [api.ts](file://src/lib/api.ts)
- [utils.ts](file://src/components/ui/utils.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Core Data Display Components](#core-data-display-components)
3. [Component Integration in PortfolioPage](#component-integration-in-portfoliopage)
4. [Booking Summary Implementation in BookingManager](#booking-summary-implementation-in-bookingmanager)
5. [Data Binding and Dynamic Content](#data-binding-and-dynamic-content)
6. [Styling and Responsive Design](#styling-and-responsive-design)
7. [Loading States and Skeleton Placeholders](#loading-states-and-skeleton-placeholders)
8. [Accessibility Considerations](#accessibility-considerations)
9. [Performance Optimization](#performance-optimization)
10. [Theming and Animation](#theming-and-animation)

## Introduction
This document provides comprehensive documentation for the data display components used in the SnapEvent application. These components are essential for presenting structured information in a visually appealing and user-friendly manner. The documentation covers the implementation and usage of table, card, accordion, avatar, badge, chart, progress bar, and skeleton loader components, with specific examples from the Photographer profile displays in PortfolioPage.tsx and booking summaries in BookingManager.tsx.

**Section sources**
- [PortfolioPage.tsx](file://src/components/PortfolioPage.tsx#L0-L26)
- [BookingManager.tsx](file://src/components/BookingManager.tsx#L0-L50)

## Core Data Display Components

### Table Component
The Table component provides a structured way to display tabular data with proper styling and accessibility features. It includes subcomponents for TableHeader, TableBody, TableFooter, TableRow, TableHead, and TableCell, allowing for flexible table construction.

```mermaid
classDiagram
class Table {
+className : string
+props : React.ComponentProps<"table">
}
class TableHeader {
+className : string
+props : React.ComponentProps<"thead">
}
class TableBody {
+className : string
+props : React.ComponentProps<"tbody">
}
class TableFooter {
+className : string
+props : React.ComponentProps<"tfoot">
}
class TableRow {
+className : string
+props : React.ComponentProps<"tr">
}
class TableHead {
+className : string
+props : React.ComponentProps<"th">
}
class TableCell {
+className : string
+props : React.ComponentProps<"td">
}
Table --> TableHeader : "contains"
Table --> TableBody : "contains"
Table --> TableFooter : "contains"
TableBody --> TableRow : "contains"
TableRow --> TableHead : "contains"
TableRow --> TableCell : "contains"
```

**Diagram sources**
- [table.tsx](file://src/components/ui/table.tsx#L0-L116)

**Section sources**
- [table.tsx](file://src/components/ui/table.tsx#L0-L116)

### Card Component
The Card component serves as a container for related information, providing a visually distinct grouping of content. It includes subcomponents for CardHeader, CardTitle, CardDescription, CardAction, CardContent, and CardFooter, enabling structured content organization.

```mermaid
classDiagram
class Card {
+className : string
+props : React.ComponentProps<"div">
}
class CardHeader {
+className : string
+props : React.ComponentProps<"div">
}
class CardTitle {
+className : string
+props : React.ComponentProps<"div">
}
class CardDescription {
+className : string
+props : React.ComponentProps<"div">
}
class CardAction {
+className : string
+props : React.ComponentProps<"div">
}
class CardContent {
+className : string
+props : React.ComponentProps<"div">
}
class CardFooter {
+className : string
+props : React.ComponentProps<"div">
}
Card --> CardHeader : "contains"
Card --> CardContent : "contains"
Card --> CardFooter : "contains"
CardHeader --> CardTitle : "contains"
CardHeader --> CardDescription : "contains"
CardHeader --> CardAction : "contains"
```

**Diagram sources**
- [card.tsx](file://src/components/ui/card.tsx#L0-L92)

**Section sources**
- [card.tsx](file://src/components/ui/card.tsx#L0-L92)

### Accordion Component
The Accordion component enables collapsible content sections, improving information hierarchy and saving screen space. It uses Radix UI's Accordion primitives for accessible interactions.

```mermaid
classDiagram
class Accordion {
+props : React.ComponentProps<typeof AccordionPrimitive.Root>
}
class AccordionItem {
+className : string
+props : React.ComponentProps<typeof AccordionPrimitive.Item>
}
class AccordionTrigger {
+className : string
+children : React.ReactNode
+props : React.ComponentProps<typeof AccordionPrimitive.Trigger>
}
class AccordionContent {
+className : string
+children : React.ReactNode
+props : React.ComponentProps<typeof AccordionPrimitive.Content>
}
Accordion --> AccordionItem : "contains"
AccordionItem --> AccordionTrigger : "contains"
AccordionItem --> AccordionContent : "contains"
```

**Diagram sources**
- [accordion.tsx](file://src/components/ui/accordion.tsx#L0-L66)

**Section sources**
- [accordion.tsx](file://src/components/ui/accordion.tsx#L0-L66)

### Avatar Component
The Avatar component displays user profile images with fallback text when images are unavailable. It uses Radix UI's Avatar primitives for consistent behavior.

```mermaid
classDiagram
class Avatar {
+className : string
+props : React.ComponentProps<typeof AvatarPrimitive.Root>
}
class AvatarImage {
+className : string
+props : React.ComponentProps<typeof AvatarPrimitive.Image>
}
class AvatarFallback {
+className : string
+props : React.ComponentProps<typeof AvatarPrimitive.Fallback>
}
Avatar --> AvatarImage : "contains"
Avatar --> AvatarFallback : "contains"
```

**Diagram sources**
- [avatar.tsx](file://src/components/ui/avatar.tsx#L0-L53)

**Section sources**
- [avatar.tsx](file://src/components/ui/avatar.tsx#L0-L53)

### Badge Component
The Badge component displays small pieces of information or status indicators with different visual variants (default, secondary, destructive, outline).

```mermaid
classDiagram
class Badge {
+className : string
+variant : "default" | "secondary" | "destructive" | "outline"
+asChild : boolean
+props : React.ComponentProps<"span">
}
class badgeVariants {
+cva configuration for styling variants
}
Badge --> badgeVariants : "uses"
```

**Diagram sources**
- [badge.tsx](file://src/components/ui/badge.tsx#L0-L46)

**Section sources**
- [badge.tsx](file://src/components/ui/badge.tsx#L0-L46)

### Chart Component
The Chart component integrates Recharts for data visualization, providing a wrapper with theme support and accessibility features.

```mermaid
classDiagram
class ChartContainer {
+id : string
+className : string
+children : React.ReactNode
+config : ChartConfig
}
class ChartTooltip {
+props : RechartsPrimitive.Tooltip props
}
class ChartTooltipContent {
+active : boolean
+payload : any[]
+indicator : "line" | "dot" | "dashed"
+formatter : function
}
class ChartLegend {
+props : RechartsPrimitive.Legend props
}
class ChartLegendContent {
+payload : any[]
+verticalAlign : "top" | "bottom"
}
ChartContainer --> ChartTooltip : "contains"
ChartContainer --> ChartLegend : "contains"
ChartTooltip --> ChartTooltipContent : "contains"
ChartLegend --> ChartLegendContent : "contains"
```

**Diagram sources**
- [chart.tsx](file://src/components/ui/chart.tsx#L0-L353)

**Section sources**
- [chart.tsx](file://src/components/ui/chart.tsx#L0-L353)

### Progress Component
The Progress component visually represents progress or completion status with a customizable bar.

```mermaid
classDiagram
class Progress {
+className : string
+value : number
+props : React.ComponentProps<typeof ProgressPrimitive.Root>
}
Progress --> ProgressPrimitive.Root : "wraps"
Progress --> ProgressPrimitive.Indicator : "contains"
```

**Diagram sources**
- [progress.tsx](file://src/components/ui/progress.tsx#L0-L31)

**Section sources**
- [progress.tsx](file://src/components/ui/progress.tsx#L0-L31)

### Skeleton Component
The Skeleton component provides loading placeholders with animated effects to indicate content loading.

```mermaid
classDiagram
class Skeleton {
+className : string
+props : React.ComponentProps<"div">
}
```

**Diagram sources**
- [skeleton.tsx](file://src/components/ui/skeleton.tsx#L0-L13)

**Section sources**
- [skeleton.tsx](file://src/components/ui/skeleton.tsx#L0-L13)

## Component Integration in PortfolioPage

### Photographer Profile Display
The PortfolioPage component integrates multiple data display components to present photographer information in a structured format. The layout uses cards for content grouping, badges for status indicators, and avatars for profile images.

```mermaid
flowchart TD
PortfolioPage --> HeroSection["Hero Section"]
PortfolioPage --> Tabs["Tabs Navigation"]
HeroSection --> ProfileCard["Profile Card"]
ProfileCard --> Avatar["Avatar Component"]
ProfileCard --> Name["Photographer Name"]
ProfileCard --> Title["Professional Title"]
ProfileCard --> Badges["Badges for Status"]
Tabs --> PortfolioTab["Portfolio Tab"]
Tabs --> ServicesTab["Services Tab"]
Tabs --> ReviewsTab["Reviews Tab"]
PortfolioTab --> CategoryFilter["Category Filter"]
PortfolioTab --> PortfolioGrid["Portfolio Grid"]
ServicesTab --> ServiceCards["Service Cards"]
ServiceCards --> ServiceCard["Individual Service Card"]
ServiceCard --> ServiceTitle["Service Title"]
ServiceCard --> ServicePrice["Service Price"]
ServiceCard --> ServiceDetails["Service Details"]
```

**Diagram sources**
- [PortfolioPage.tsx](file://src/components/PortfolioPage.tsx#L0-L26)
- [card.tsx](file://src/components/ui/card.tsx#L0-L92)
- [badge.tsx](file://src/components/ui/badge.tsx#L0-L46)
- [avatar.tsx](file://src/components/ui/avatar.tsx#L0-L53)

**Section sources**
- [PortfolioPage.tsx](file://src/components/PortfolioPage.tsx#L0-L26)
- [PortfolioPage.tsx](file://src/components/PortfolioPage.tsx#L188-L225)

## Booking Summary Implementation in BookingManager

### Booking Management Interface
The BookingManager component uses data display components to manage booking requests with a tabbed interface for different booking statuses.

```mermaid
flowchart TD
BookingManager --> Tabs["Tabs for Status"]
Tabs --> Pending["Pending Bookings"]
Tabs --> Confirmed["Confirmed Bookings"]
Tabs --> Declined["Declined Bookings"]
Pending --> BookingList["Booking List"]
BookingList --> BookingCard["Booking Card"]
BookingCard --> ClientInfo["Client Information"]
BookingCard --> EventDetails["Event Details"]
BookingCard --> StatusBadge["Status Badge"]
BookingCard --> ActionButtons["Action Buttons"]
BookingCard --> DetailView["Detail View"]
DetailView --> EventCard["Event Information Card"]
DetailView --> ClientCard["Client Information Card"]
DetailView --> ActionButtons["Action Buttons"]
```

**Diagram sources**
- [BookingManager.tsx](file://src/components/BookingManager.tsx#L0-L509)
- [card.tsx](file://src/components/ui/card.tsx#L0-L92)
- [badge.tsx](file://src/components/ui/badge.tsx#L0-L46)
- [button.tsx](file://src/components/ui/button.tsx#L0-L50)

**Section sources**
- [BookingManager.tsx](file://src/components/BookingManager.tsx#L0-L509)

## Data Binding and Dynamic Content

### Supabase Integration
Data display components are populated with dynamic content from Supabase through API calls. The integration follows a service layer pattern with typed responses.

```mermaid
sequenceDiagram
participant UI as "UI Components"
participant API as "API Service"
participant Supabase as "Supabase Client"
UI->>API : Request photographer data
API->>Supabase : Fetch from photographer_profiles table
Supabase-->>API : Return typed data
API-->>UI : Return formatted data
UI->>UI : Render components with data
```

**Diagram sources**
- [supabase.ts](file://src/lib/supabase.ts#L0-L241)
- [api.ts](file://src/lib/api.ts#L0-L260)
- [PortfolioPage.tsx](file://src/components/PortfolioPage.tsx#L0-L26)

**Section sources**
- [supabase.ts](file://src/lib/supabase.ts#L0-L241)
- [api.ts](file://src/lib/api.ts#L0-L260)

## Styling and Responsive Design

### Tailwind CSS Integration
All data display components use Tailwind CSS for styling, with utility classes for responsive layouts and visual customization.

```mermaid
classDiagram
class cn {
+inputs : ClassValue[]
+returns : string
}
class utils {
+cn function for class merging
}
Table --> utils : "uses"
Card --> utils : "uses"
Badge --> utils : "uses"
AllComponents --> utils : "uses"
```

**Diagram sources**
- [utils.ts](file://src/components/ui/utils.ts#L0-L6)
- [table.tsx](file://src/components/ui/table.tsx#L0-L116)
- [card.tsx](file://src/components/ui/card.tsx#L0-L92)
- [badge.tsx](file://src/components/ui/badge.tsx#L0-L46)

**Section sources**
- [utils.ts](file://src/components/ui/utils.ts#L0-L6)

## Loading States and Skeleton Placeholders

### Loading State Management
Components implement loading states using skeleton placeholders to provide visual feedback during data fetching.

```mermaid
flowchart TD
LoadingState --> CheckData["Check if data exists"]
CheckData --> |No data| ShowSkeleton["Show Skeleton Placeholders"]
ShowSkeleton --> Animate["Animate with pulse effect"]
CheckData --> |Data exists| RenderComponents["Render actual components"]
RenderComponents --> HideSkeleton["Hide skeleton placeholders"]
```

**Diagram sources**
- [skeleton.tsx](file://src/components/ui/skeleton.tsx#L0-L13)
- [PortfolioPage.tsx](file://src/components/PortfolioPage.tsx#L188-L225)
- [BookingManager.tsx](file://src/components/BookingManager.tsx#L0-L509)

**Section sources**
- [skeleton.tsx](file://src/components/ui/skeleton.tsx#L0-L13)
- [PortfolioPage.tsx](file://src/components/PortfolioPage.tsx#L188-L225)

## Accessibility Considerations

### ARIA and Semantic HTML
Data display components follow accessibility best practices with proper ARIA attributes and semantic HTML structure.

```mermaid
classDiagram
class Table {
+role : "table"
+aria-label : "Data table"
}
class Accordion {
+role : "region"
+aria-expanded : boolean
+aria-controls : string
}
class Badge {
+aria-label : "Status indicator"
}
class Avatar {
+aria-label : "Profile image"
+role : "img"
}
AllComponents --> Accessibility : "implements"
```

**Diagram sources**
- [table.tsx](file://src/components/ui/table.tsx#L0-L116)
- [accordion.tsx](file://src/components/ui/accordion.tsx#L0-L66)
- [badge.tsx](file://src/components/ui/badge.tsx#L0-L46)
- [avatar.tsx](file://src/components/ui/avatar.tsx#L0-L53)

**Section sources**
- [table.tsx](file://src/components/ui/table.tsx#L0-L116)
- [accordion.tsx](file://src/components/ui/accordion.tsx#L0-L66)

## Performance Optimization

### Large Data Handling
Components are optimized for performance when displaying large datasets, particularly in tables and charts.

```mermaid
flowchart TD
PerformanceOptimization --> Virtualization["Virtual Scrolling"]
PerformanceOptimization --> Memoization["React.memo"]
PerformanceOptimization --> LazyLoading["Lazy Loading"]
PerformanceOptimization --> EfficientRenders["Minimize re-renders"]
Virtualization --> Table["Large Tables"]
Memoization --> ReusableComponents["Reusable components"]
LazyLoading --> Images["Images and media"]
EfficientRenders --> StateManagement["State management"]
```

**Section sources**
- [table.tsx](file://src/components/ui/table.tsx#L0-L116)
- [chart.tsx](file://src/components/ui/chart.tsx#L0-L353)
- [BookingManager.tsx](file://src/components/BookingManager.tsx#L0-L509)

## Theming and Animation

### Visual Feedback and Branding
Components support theming and animation to enhance user experience and provide visual feedback.

```mermaid
classDiagram
class ThemeSupport {
+dark mode support
+CSS variables
+Tailwind themes
}
class Animations {
+hover effects
+transitions
+loading animations
+interactive feedback
}
Table --> ThemeSupport : "supports"
Card --> ThemeSupport : "supports"
Badge --> ThemeSupport : "supports"
Skeleton --> Animations : "uses"
Button --> Animations : "uses"
```

**Section sources**
- [table.tsx](file://src/components/ui/table.tsx#L0-L116)
- [card.tsx](file://src/components/ui/card.tsx#L0-L92)
- [badge.tsx](file://src/components/ui/badge.tsx#L0-L46)
- [skeleton.tsx](file://src/components/ui/skeleton.tsx#L0-L13)
- [utils.ts](file://src/components/ui/utils.ts#L0-L6)