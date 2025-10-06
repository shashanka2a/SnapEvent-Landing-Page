# Interactive Overlays & Modals

<cite>
**Referenced Files in This Document**   
- [dialog.tsx](file://src/components/ui/dialog.tsx)
- [drawer.tsx](file://src/components/ui/drawer.tsx)
- [sheet.tsx](file://src/components/ui/sheet.tsx)
- [alert-dialog.tsx](file://src/components/ui/alert-dialog.tsx)
- [popover.tsx](file://src/components/ui/popover.tsx)
- [hover-card.tsx](file://src/components/ui/hover-card.tsx)
- [command.tsx](file://src/components/ui/command.tsx)
- [use-mobile.ts](file://src/components/ui/use-mobile.ts)
- [BookingManager.tsx](file://src/components/BookingManager.tsx)
- [PortfolioPage.tsx](file://src/components/PortfolioPage.tsx)
- [utils.ts](file://src/components/ui/utils.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Core Overlay Components](#core-overlay-components)
3. [Implementation with Radix UI Primitives](#implementation-with-radix-ui-primitives)
4. [Portal Rendering Mechanism](#portal-rendering-mechanism)
5. [Trigger Mechanisms and State Management](#trigger-mechanisms-and-state-management)
6. [Animation System with Framer Motion](#animation-system-with-framer-motion)
7. [Accessibility Features](#accessibility-features)
8. [Responsive Behavior Patterns](#responsive-behavior-patterns)
9. [Component-Specific Implementations](#component-specific-implementations)
10. [Common Issues and Solutions](#common-issues-and-solutions)
11. [Performance Optimization](#performance-optimization)

## Introduction
This document provides comprehensive documentation for interactive overlay and modal components in the SnapEvent application. The system implements a robust set of UI components including dialogs, drawers, sheets, alert dialogs, popovers, hover cards, and command menus. These components are built using Radix UI primitives and enhanced with portal rendering, Framer Motion animations, and responsive design patterns. The documentation covers implementation details, accessibility features, and practical usage examples from key components like BookingManager.tsx and PortfolioPage.tsx where modals are used for booking confirmation and image previews.

## Core Overlay Components

The application implements seven primary overlay components, each serving distinct user interaction patterns:

- **Dialog**: Standard modal dialog for focused user interactions
- **Drawer**: Sliding panel from screen edges, typically used for navigation or forms
- **Sheet**: Similar to drawer but with different animation and positioning logic
- **Alert Dialog**: Specialized dialog for critical user decisions with confirmation actions
- **Popover**: Floating panel that appears on hover or click, anchored to a trigger element
- **Hover Card**: Lightweight overlay that appears on mouse hover over elements
- **Command Menu**: Keyboard-accessible interface for executing commands, implemented as a dialog wrapper

**Section sources**
- [dialog.tsx](file://src/components/ui/dialog.tsx)
- [drawer.tsx](file://src/components/ui/drawer.tsx)
- [sheet.tsx](file://src/components/ui/sheet.tsx)
- [alert-dialog.tsx](file://src/components/ui/alert-dialog.tsx)
- [popover.tsx](file://src/components/ui/popover.tsx)
- [hover-card.tsx](file://src/components/ui/hover-card.tsx)
- [command.tsx](file://src/components/ui/command.tsx)

## Implementation with Radix UI Primitives

```mermaid
classDiagram
class DialogPrimitive {
+Root
+Trigger
+Portal
+Overlay
+Content
+Close
+Title
+Description
}
class DrawerPrimitive {
+Root
+Trigger
+Portal
+Overlay
+Content
+Close
+Title
+Description
}
class SheetPrimitive {
+Root
+Trigger
+Portal
+Overlay
+Content
+Close
+Title
+Description
}
class AlertDialogPrimitive {
+Root
+Trigger
+Portal
+Overlay
+Content
+Action
+Cancel
+Title
+Description
}
class PopoverPrimitive {
+Root
+Trigger
+Portal
+Content
+Anchor
}
class HoverCardPrimitive {
+Root
+Trigger
+Portal
+Content
}
class CommandPrimitive {
+Root
+Input
+List
+Empty
+Group
+Item
+Separator
}
DialogPrimitive --> Dialog : "implements"
DrawerPrimitive --> Drawer : "implements"
SheetPrimitive --> Sheet : "implements"
AlertDialogPrimitive --> AlertDialog : "implements"
PopoverPrimitive --> Popover : "implements"
HoverCardPrimitive --> HoverCard : "implements"
CommandPrimitive --> Command : "implements"
```

**Diagram sources**
- [dialog.tsx](file://src/components/ui/dialog.tsx)
- [drawer.tsx](file://src/components/ui/drawer.tsx)
- [sheet.tsx](file://src/components/ui/sheet.tsx)
- [alert-dialog.tsx](file://src/components/ui/alert-dialog.tsx)
- [popover.tsx](file://src/components/ui/popover.tsx)
- [hover-card.tsx](file://src/components/ui/hover-card.tsx)
- [command.tsx](file://src/components/ui/command.tsx)

**Section sources**
- [dialog.tsx](file://src/components/ui/dialog.tsx#L1-L132)
- [drawer.tsx](file://src/components/ui/drawer.tsx#L1-L132)
- [sheet.tsx](file://src/components/ui/sheet.tsx#L1-L139)

## Portal Rendering Mechanism

The overlay components utilize portal rendering to ensure proper z-index stacking and escape container overflow constraints. All components implement a Portal primitive that renders content at the end of the document body.

```mermaid
sequenceDiagram
participant Trigger as "Trigger Element"
participant Root as "Component Root"
participant Portal as "Portal Renderer"
participant Body as "Document Body"
Trigger->>Root : User Interaction
Root->>Portal : Request Portal Render
Portal->>Body : Create Portal Container
Body->>Portal : Return Portal Reference
Portal->>Body : Mount Overlay Content
Body->>User : Display Overlay
User->>Body : Interact with Overlay
Body->>Root : Propagate Events
Root->>Portal : Request Unmount
Portal->>Body : Remove Portal Container
```

**Diagram sources**
- [dialog.tsx](file://src/components/ui/dialog.tsx#L45-L50)
- [drawer.tsx](file://src/components/ui/drawer.tsx#L45-L50)
- [sheet.tsx](file://src/components/ui/sheet.tsx#L45-L50)
- [alert-dialog.tsx](file://src/components/ui/alert-dialog.tsx#L45-L50)

**Section sources**
- [dialog.tsx](file://src/components/ui/dialog.tsx#L40-L55)
- [drawer.tsx](file://src/components/ui/drawer.tsx#L40-L55)
- [sheet.tsx](file://src/components/ui/sheet.tsx#L40-L55)

## Trigger Mechanisms and State Management

Overlay components are controlled through trigger mechanisms and external state management. The system uses React state hooks to manage visibility, with triggers that toggle the state.

```mermaid
flowchart TD
Start([Component Mount]) --> StateInit["Initialize State: useState(false)"]
StateInit --> RenderTrigger["Render Trigger Element"]
RenderTrigger --> UserInteraction["Wait for User Interaction"]
UserInteraction --> TriggerClick["User Clicks Trigger"]
TriggerClick --> UpdateState["Update State: setState(true)"]
UpdateState --> CheckState{"State == true?"}
CheckState --> |Yes| RenderOverlay["Render Overlay Component"]
RenderOverlay --> PortalMount["Mount in Portal"]
PortalMount --> Display["Display Overlay"]
Display --> WaitClose["Wait for Close Event"]
WaitClose --> CloseEvent{"Close Triggered?"}
CloseEvent --> |Yes| SetStateFalse["Set State: setState(false)"]
SetStateFalse --> Unmount["Unmount Overlay"]
Unmount --> End([Idle])
CloseEvent --> |No| Continue["Continue Display"]
Continue --> WaitClose
```

**Diagram sources**
- [BookingManager.tsx](file://src/components/BookingManager.tsx#L26-L30)
- [PortfolioPage.tsx](file://src/components/PortfolioPage.tsx#L26-L30)

**Section sources**
- [BookingManager.tsx](file://src/components/BookingManager.tsx#L26-L30)
- [PortfolioPage.tsx](file://src/components/PortfolioPage.tsx#L26-L30)

## Animation System with Framer Motion

While Radix UI components have built-in CSS animations, additional components use Framer Motion for more sophisticated transitions. The system implements entrance and exit animations with configurable duration and easing.

```mermaid
sequenceDiagram
participant Component as "Overlay Component"
participant Framer as "Framer Motion"
participant DOM as "DOM Elements"
Component->>Framer : initial={{ opacity : 0, scale : 0.95 }}
Component->>Framer : animate={{ opacity : 1, scale : 1 }}
Component->>Framer : exit={{ opacity : 0, scale : 0.95 }}
Component->>Framer : transition={{ duration : 0.2 }}
Framer->>DOM : Apply Initial State
DOM->>User : Render Hidden Element
User->>DOM : Trigger Animation
DOM->>Framer : Animation Start
Framer->>DOM : Gradually Update Styles
DOM->>User : Visual Animation
Framer->>DOM : Complete Animation
DOM->>Component : Animation Complete
```

**Diagram sources**
- [PortfolioPage.tsx](file://src/components/PortfolioPage.tsx#L734-L771)

**Section sources**
- [PortfolioPage.tsx](file://src/components/PortfolioPage.tsx#L734-L771)

## Accessibility Features

The overlay system implements comprehensive accessibility features following WAI-ARIA guidelines, including proper role assignment, focus management, and screen reader support.

```mermaid
flowchart TD
A[Accessibility Implementation] --> B[ARIA Roles]
A --> C[Focus Management]
A --> D[Keyboard Navigation]
A --> E[Screen Reader Support]
B --> B1["role=\"dialog\""]
B --> B2["role=\"alertdialog\""]
B --> B3["aria-modal=\"true\""]
B --> B4["aria-labelledby"]
B --> B5["aria-describedby"]
C --> C1["Focus Trapping"]
C --> C2["Initial Focus"]
C --> C3["Return Focus"]
C --> C4["Focus Cycle"]
D --> D1["Escape Key Close"]
D --> D2["Tab Navigation"]
D --> D3["Shift+Tab Reverse"]
D --> D4["Enter/Space Activate"]
E --> E1["SR-Only Text"]
E --> E2["Live Regions"]
E --> E3["Announcements"]
E --> E4["Labeling"]
B --> Implementation
C --> Implementation
D --> Implementation
E --> Implementation
Implementation[Implementation in Code] --> Dialog
Implementation --> Drawer
Implementation --> Sheet
Implementation --> AlertDialog
Implementation --> Popover
Implementation --> HoverCard
Implementation --> Command
Dialog[dialog.tsx] --> B1
Dialog --> C1
Dialog --> D1
Dialog --> E1
AlertDialog[alert-dialog.tsx] --> B2
AlertDialog --> C1
AlertDialog --> D1
AlertDialog --> E1
```

**Diagram sources**
- [dialog.tsx](file://src/components/ui/dialog.tsx#L1-L132)
- [alert-dialog.tsx](file://src/components/ui/alert-dialog.tsx#L1-L157)
- [popover.tsx](file://src/components/ui/popover.tsx#L1-L48)

**Section sources**
- [dialog.tsx](file://src/components/ui/dialog.tsx#L1-L132)
- [alert-dialog.tsx](file://src/components/ui/alert-dialog.tsx#L1-L157)

## Responsive Behavior Patterns

The system implements responsive behavior patterns that adapt overlay presentation based on device characteristics, particularly using the use-mobile hook to determine presentation style.

```mermaid
flowchart TD
A[Device Detection] --> B{Mobile Device?}
B --> |Yes| C[Use Drawer Component]
B --> |No| D[Use Dialog Component]
C --> E[Slide from Bottom]
C --> F[Full Width]
C --> G[Touch-Optimized]
C --> H[Gesture Support]
D --> I[Centered Modal]
D --> J[Fixed Width]
D --> K[Mouse Optimized]
D --> L[Keyboard Navigation]
M[useIsMobile Hook] --> N["MOBILE_BREAKPOINT = 768"]
N --> O[window.matchMedia]
O --> P[Max-width Check]
P --> B
Q[Booking Flow] --> B
R[Image Preview] --> B
S[Command Menu] --> B
B --> C
B --> D
```

**Diagram sources**
- [use-mobile.ts](file://src/components/ui/use-mobile.ts#L1-L21)
- [PortfolioPage.tsx](file://src/components/PortfolioPage.tsx#L26-L30)

**Section sources**
- [use-mobile.ts](file://src/components/ui/use-mobile.ts#L1-L21)
- [PortfolioPage.tsx](file://src/components/PortfolioPage.tsx#L26-L30)

## Component-Specific Implementations

### Booking Manager Implementation
The BookingManager component uses a dialog-style overlay for managing photographer bookings, with tabs for different booking statuses and detailed views for individual bookings.

```mermaid
flowchart TD
A[BookingManager] --> B[State Management]
B --> B1["useState<Booking[]>()"]
B --> B2["useState<Booking|null>()"]
B --> B3["useState<boolean>()"]
A --> C[Data Fetching]
C --> C1["useEffect()"]
C --> C2["fetch('/api/bookings')"]
C --> C3["Mock Data Fallback"]
A --> D[UI Structure]
D --> D1["Tabs: Pending, Confirmed, Declined"]
D --> D2["Card List View"]
D --> D3["Detail View"]
D --> D4["Action Buttons"]
A --> E[Interaction Flow]
E --> E1["View Booking Details"]
E --> E2["Accept Booking"]
E --> E3["Decline Booking"]
E --> E4["Close Manager"]
E1 --> F[PATCH /api/bookings/:id]
E2 --> F
E3 --> F
F --> G[Update Local State]
G --> H[Show Confirmation]
```

**Diagram sources**
- [BookingManager.tsx](file://src/components/BookingManager.tsx#L1-L509)

**Section sources**
- [BookingManager.tsx](file://src/components/BookingManager.tsx#L1-L509)

### Portfolio Page Implementation
The PortfolioPage component implements multiple overlay types for different use cases, including a share popup with Framer Motion animations.

```mermaid
flowchart TD
A[PortfolioPage] --> B[State Variables]
B --> B1["showBookingCalendar"]
B --> B2["showAvailabilityManager"]
B --> B3["showBookingManager"]
B --> B4["showSharePopup"]
A --> C[Modal Triggers]
C --> C1["Booking Calendar Button"]
C --> C2["Availability Manager Button"]
C --> C3["Booking Manager Button"]
C --> C4["Share Button"]
A --> D[Overlay Components]
D --> D1["BookingCalendar"]
D --> D2["AvailabilityManager"]
D --> D3["BookingManager"]
D --> D4["Share Popup"]
D4 --> E[Framer Motion]
E --> E1["initial={{ opacity: 0, scale: 0.95 }}"]
E --> E2["animate={{ opacity: 1, scale: 1 }}"]
E --> E3["exit={{ opacity: 0, scale: 0.95 }}"]
E --> E4["transition={{ duration: 0.2 }}"]
C4 --> D4
D4 --> F[Share Functionality]
F --> F1["Copy URL"]
F --> F2["Social Sharing"]
F --> F3["Close Popup"]
```

**Diagram sources**
- [PortfolioPage.tsx](file://src/components/PortfolioPage.tsx#L26-L30)
- [PortfolioPage.tsx](file://src/components/PortfolioPage.tsx#L734-L771)

**Section sources**
- [PortfolioPage.tsx](file://src/components/PortfolioPage.tsx#L26-L30)
- [PortfolioPage.tsx](file://src/components/PortfolioPage.tsx#L734-L771)

## Common Issues and Solutions

### Scroll Lock Management
The overlay system must manage document scrolling when overlays are active to prevent background content from scrolling.

```mermaid
flowchart TD
A[Overlay Open] --> B[Add CSS Class to Body]
B --> C["overflow: hidden"]
C --> D[Store Scroll Position]
D --> E[Overlay Active]
E --> F{Overlay Closing?}
F --> |Yes| G[Restore Scroll Position]
G --> H[Remove CSS Class from Body]
H --> I["overflow: auto"]
I --> J[Complete]
F --> |No| K[Continue]
K --> E
```

**Section sources**
- [dialog.tsx](file://src/components/ui/dialog.tsx)
- [drawer.tsx](file://src/components/ui/drawer.tsx)

### Z-Index Conflicts
Proper z-index stacking is critical for overlay components to display correctly above other content.

```mermaid
flowchart TD
A[Z-Index Strategy] --> B[Consistent Values]
B --> B1["Overlay: z-50"]
B --> B2["Content: z-50"]
B --> B3["Portal Container: z-50"]
A --> C[Conflict Resolution]
C --> C1["Avoid Inline Styles"]
C --> C2["Use CSS Variables"]
C --> C3["Document Hierarchy"]
A --> D[Common Issues]
D --> D1["Other Elements with High Z-Index"]
D --> D2["Nested Overlays"]
D --> D3["Positioning Context"]
D --> E[Solutions]
E --> E1["Audit Z-Index Usage"]
E --> E2["Standardize Values"]
E --> E3["Use Portal Consistently"]
```

**Section sources**
- [dialog.tsx](file://src/components/ui/dialog.tsx)
- [drawer.tsx](file://src/components/ui/drawer.tsx)
- [sheet.tsx](file://src/components/ui/sheet.tsx)

## Performance Optimization

### Complex Content Rendering
For overlays with complex content, optimization techniques prevent performance degradation.

```mermaid
flowchart TD
A[Performance Considerations] --> B[Lazy Loading]
B --> B1["React.lazy()"]
B --> B2["Suspense"]
A --> C[Virtualization]
C --> C1["Windowing"]
C --> C2["Infinite Scroll"]
A --> D[Memoization]
D --> D1["React.memo()"]
D --> D2["useMemo()"]
D --> D3["useCallback()"]
A --> E[Resource Management]
E --> E1["Cleanup Effects"]
E --> E2["Cancel Requests"]
E --> E3["Dispose Handlers"]
F[BookingManager Example] --> D2
F --> E1
F --> E2
G[Command Menu Example] --> B1
G --> C1
G --> D1
```

**Section sources**
- [BookingManager.tsx](file://src/components/BookingManager.tsx)
- [command.tsx](file://src/components/ui/command.tsx)