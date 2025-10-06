# Form Components

<cite>
**Referenced Files in This Document**   
- [form.tsx](file://src/components/ui/form.tsx)
- [input.tsx](file://src/components/ui/input.tsx)
- [textarea.tsx](file://src/components/ui/textarea.tsx)
- [checkbox.tsx](file://src/components/ui/checkbox.tsx)
- [radio-group.tsx](file://src/components/ui/radio-group.tsx)
- [select.tsx](file://src/components/ui/select.tsx)
- [switch.tsx](file://src/components/ui/switch.tsx)
- [slider.tsx](file://src/components/ui/slider.tsx)
- [input-otp.tsx](file://src/components/ui/input-otp.tsx)
- [label.tsx](file://src/components/ui/label.tsx)
- [GeneralizedSignupFlow.tsx](file://src/components/GeneralizedSignupFlow.tsx)
- [OnboardingForm.tsx](file://src/components/OnboardingForm.tsx)
- [utils.ts](file://src/components/ui/utils.ts)
- [validation.ts](file://src/middleware/validation.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Form Architecture and Integration](#form-architecture-and-integration)
3. [Core Form Components](#core-form-components)
4. [Form Validation System](#form-validation-system)
5. [Accessibility Implementation](#accessibility-implementation)
6. [Styling with Tailwind CSS](#styling-with-tailwind-css)
7. [Real-World Usage Examples](#real-world-usage-examples)
8. [Common Issues and Solutions](#common-issues-and-solutions)
9. [Advanced Features](#advanced-features)
10. [Component Reference](#component-reference)

## Introduction
This documentation provides comprehensive guidance on the form-related UI components within the SnapEvent application. The form system is built on a robust architecture that integrates React Hook Form for state management, Radix UI for accessible component primitives, and Tailwind CSS for styling. The components are designed to work together seamlessly through a wrapper-based approach, enabling consistent validation, error handling, and accessibility across the application. This document covers the implementation details, usage patterns, and best practices for all form components including input fields, selection controls, and specialized inputs.

## Form Architecture and Integration

```mermaid
graph TD
Form[Form Component] --> FormProvider[react-hook-form Provider]
FormField[FormField] --> Controller[react-hook-form Controller]
FormItem[FormItem] --> Context[FormFieldContext]
FormLabel[FormLabel] --> useFormField[useFormField Hook]
FormControl[FormControl] --> useFormField
FormDescription[FormDescription] --> useFormField
FormMessage[FormMessage] --> useFormField
Input[Input] --> FormControl
Textarea[Textarea] --> FormControl
Checkbox[Checkbox] --> FormControl
RadioGroup[RadioGroup] --> FormControl
Select[Select] --> FormControl
Switch[Switch] --> FormControl
Slider[Slider] --> FormControl
InputOTP[InputOTP] --> FormControl
style Form fill:#4C566A,stroke:#434C5E
style FormProvider fill:#5E81AC,stroke:#4C566A
style FormField fill:#4C566A,stroke:#434C5E
style FormItem fill:#4C566A,stroke:#434C5E
style FormLabel fill:#4C566A,stroke:#434C5E
style FormControl fill:#4C566A,stroke:#434C5E
style FormDescription fill:#4C566A,stroke:#434C5E
style FormMessage fill:#4C566A,stroke:#434C5E
```

**Diagram sources**
- [form.tsx](file://src/components/ui/form.tsx#L1-L167)

**Section sources**
- [form.tsx](file://src/components/ui/form.tsx#L1-L167)

## Core Form Components

### Input Components
The form system includes several input components that are designed to work within the Form wrapper context. Each component is built with accessibility and validation in mind, using Radix UI primitives and Tailwind CSS for styling.

#### Text Input and Textarea
The Input and Textarea components provide basic text input functionality with consistent styling and validation feedback. They integrate with the Form system through the FormControl component, which manages accessibility attributes and error states.

```mermaid
classDiagram
class Input {
+type : string
+className : string
+placeholder : string
+disabled : boolean
+required : boolean
+onChange : function
+onBlur : function
}
class Textarea {
+className : string
+placeholder : string
+disabled : boolean
+required : boolean
+onChange : function
+onBlur : function
+rows : number
+cols : number
}
FormControl <|-- Input
FormControl <|-- Textarea
```

**Diagram sources**
- [input.tsx](file://src/components/ui/input.tsx#L1-L21)
- [textarea.tsx](file://src/components/ui/textarea.tsx#L1-L18)
- [form.tsx](file://src/components/ui/form.tsx#L1-L167)

### Selection Components
The form system includes various selection components that provide different ways for users to make choices within forms.

#### Checkbox and Radio Group
The Checkbox and RadioGroup components provide binary and multiple choice selection capabilities. They use Radix UI's accessible primitives to ensure proper keyboard navigation and screen reader support.

```mermaid
classDiagram
class Checkbox {
+checked : boolean
+onCheckedChange : function
+disabled : boolean
+required : boolean
+name : string
+value : string
}
class RadioGroup {
+value : string
+onValueChange : function
+disabled : boolean
+name : string
+orientation : "horizontal" | "vertical"
}
class RadioGroupItem {
+value : string
+disabled : boolean
+text : string
}
RadioGroup o-- RadioGroupItem
FormControl <|-- Checkbox
FormControl <|-- RadioGroup
```

**Diagram sources**
- [checkbox.tsx](file://src/components/ui/checkbox.tsx#L1-L32)
- [radio-group.tsx](file://src/components/ui/radio-group.tsx#L1-L45)
- [form.tsx](file://src/components/ui/form.tsx#L1-L167)

#### Select Component
The Select component provides a dropdown menu for selecting from a list of options. It uses Radix UI's Select primitive to ensure accessibility and includes support for grouping, separators, and scrolling.

```mermaid
classDiagram
class Select {
+value : string
+onValueChange : function
+disabled : boolean
+name : string
}
class SelectTrigger {
+size : "sm" | "default"
+className : string
}
class SelectContent {
+position : "popper" | "item-aligned"
+className : string
}
class SelectItem {
+value : string
+disabled : boolean
+text : string
}
class SelectGroup {
+text : string
}
class SelectLabel {
+text : string
}
class SelectSeparator {
}
Select o-- SelectTrigger
Select o-- SelectContent
SelectContent o-- SelectItem
SelectContent o-- SelectGroup
SelectContent o-- SelectSeparator
SelectGroup o-- SelectItem
SelectContent o-- SelectLabel
FormControl <|-- Select
```

**Diagram sources**
- [select.tsx](file://src/components/ui/select.tsx#L1-L189)
- [form.tsx](file://src/components/ui/form.tsx#L1-L167)

### Specialized Input Components
The form system includes specialized components for specific input scenarios.

#### Switch and Slider
The Switch component provides a toggle interface for binary choices, while the Slider component allows users to select a value from a range.

```mermaid
classDiagram
class Switch {
+checked : boolean
+onCheckedChange : function
+disabled : boolean
+required : boolean
+name : string
}
class Slider {
+value : number[]
+onValueChange : function
+min : number
+max : number
+step : number
+disabled : boolean
+orientation : "horizontal" | "vertical"
}
FormControl <|-- Switch
FormControl <|-- Slider
```

**Diagram sources**
- [switch.tsx](file://src/components/ui/switch.tsx#L1-L31)
- [slider.tsx](file://src/components/ui/slider.tsx#L1-L63)
- [form.tsx](file://src/components/ui/form.tsx#L1-L167)

#### OTP Input
The InputOTP component provides a specialized interface for entering one-time passwords or verification codes, with support for grouping and separators.

```mermaid
classDiagram
class InputOTP {
+value : string
+onChange : function
+containerClassName : string
+maxLength : number
+pattern : RegExp
+disabled : boolean
}
class InputOTPGroup {
+className : string
}
class InputOTPSlot {
+index : number
+className : string
+active : boolean
}
class InputOTPSeparator {
}
InputOTP o-- InputOTPGroup
InputOTPGroup o-- InputOTPSlot
InputOTPGroup o-- InputOTPSeparator
FormControl <|-- InputOTP
```

**Diagram sources**
- [input-otp.tsx](file://src/components/ui/input-otp.tsx#L1-L77)
- [form.tsx](file://src/components/ui/form.tsx#L1-L167)

**Section sources**
- [input.tsx](file://src/components/ui/input.tsx#L1-L21)
- [textarea.tsx](file://src/components/ui/textarea.tsx#L1-L18)
- [checkbox.tsx](file://src/components/ui/checkbox.tsx#L1-L32)
- [radio-group.tsx](file://src/components/ui/radio-group.tsx#L1-L45)
- [select.tsx](file://src/components/ui/select.tsx#L1-L189)
- [switch.tsx](file://src/components/ui/switch.tsx#L1-L31)
- [slider.tsx](file://src/components/ui/slider.tsx#L1-L63)
- [input-otp.tsx](file://src/components/ui/input-otp.tsx#L1-L77)
- [form.tsx](file://src/components/ui/form.tsx#L1-L167)

## Form Validation System

```mermaid
sequenceDiagram
participant User as "User"
participant Component as "Form Component"
participant HookForm as "react-hook-form"
participant Validator as "Validation Rules"
participant UI as "Error UI"
User->>Component : Enters data
Component->>HookForm : Updates field value
HookForm->>Validator : Validates on change/blur/submit
Validator-->>HookForm : Returns validation result
alt Validation fails
HookForm->>Component : Provides error object
Component->>UI : Renders error message
UI-->>User : Displays error
else Validation succeeds
HookForm-->>Component : No error
Component->>UI : Renders success state
end
User->>Component : Submits form
Component->>HookForm : Triggers submit
HookForm->>Validator : Validates all fields
alt All validations pass
HookForm->>Component : Provides form data
Component->>Backend : Submits data
else Validation fails
HookForm->>UI : Provides error objects
UI-->>User : Displays all errors
end
```

**Diagram sources**
- [form.tsx](file://src/components/ui/form.tsx#L1-L167)
- [validation.ts](file://src/middleware/validation.ts#L1-L159)

**Section sources**
- [form.tsx](file://src/components/ui/form.tsx#L1-L167)
- [validation.ts](file://src/middleware/validation.ts#L1-L159)

## Accessibility Implementation
The form components are designed with accessibility as a core principle, leveraging Radix UI's accessible primitives and implementing proper ARIA attributes.

```mermaid
flowchart TD
Start([Form Component]) --> LabelAssociation["Associate labels with inputs using htmlFor"]
LabelAssociation --> AriaAttributes["Implement ARIA attributes (aria-invalid, aria-describedby)"]
AriaAttributes --> KeyboardNavigation["Ensure keyboard navigation support"]
KeyboardNavigation --> FocusManagement["Manage focus states and indicators"]
FocusManagement --> ErrorCommunication["Communicate errors effectively"]
ErrorCommunication --> ScreenReaderSupport["Ensure screen reader compatibility"]
ScreenReaderSupport --> End([Accessible Form])
subgraph "Error Communication"
ErrorCommunication --> LiveRegions["Use ARIA live regions for dynamic errors"]
ErrorCommunication --> VisualIndicators["Provide visual error indicators"]
ErrorCommunication --> DescriptiveMessages["Use descriptive error messages"]
end
```

**Diagram sources**
- [form.tsx](file://src/components/ui/form.tsx#L1-L167)
- [label.tsx](file://src/components/ui/label.tsx)
- [input.tsx](file://src/components/ui/input.tsx#L1-L21)

**Section sources**
- [form.tsx](file://src/components/ui/form.tsx#L1-L167)

## Styling with Tailwind CSS
The form components use Tailwind CSS for styling, with a consistent design system that supports both light and dark modes.

```mermaid
classDiagram
class TailwindStyling {
+BaseStyles : string
+FocusStyles : string
+ErrorStyles : string
+DisabledStyles : string
+SizeVariants : string
+ThemeSupport : string
}
class InputStyling {
+Padding : "px-3 py-1"
+Border : "border border-input"
+Radius : "rounded-md"
+Background : "bg-input-background"
+Text : "text-base"
+Focus : "focus-visible : border-ring focus-visible : ring-ring/50 focus-visible : ring-[3px]"
+Error : "aria-invalid : ring-destructive/20 aria-invalid : border-destructive"
+Disabled : "disabled : opacity-50 disabled : cursor-not-allowed"
}
class CheckboxStyling {
+Size : "size-4"
+Border : "border border-input"
+Radius : "rounded-[4px]"
+Background : "bg-input-background"
+Checked : "data-[state=checked] : bg-primary data-[state=checked] : border-primary"
+Focus : "focus-visible : border-ring focus-visible : ring-ring/50 focus-visible : ring-[3px]"
+Error : "aria-invalid : ring-destructive/20 aria-invalid : border-destructive"
}
class SelectStyling {
+Padding : "px-3 py-2"
+Border : "border border-input"
+Radius : "rounded-md"
+Background : "bg-input-background"
+Text : "text-sm"
+Focus : "focus-visible : border-ring focus-visible : ring-ring/50 focus-visible : ring-[3px]"
+Error : "aria-invalid : ring-destructive/20 aria-invalid : border-destructive"
+SizeVariants : "data-[size=default] : h-9 data-[size=sm] : h-8"
}
TailwindStyling <|-- InputStyling
TailwindStyling <|-- CheckboxStyling
TailwindStyling <|-- SelectStyling
```

**Diagram sources**
- [input.tsx](file://src/components/ui/input.tsx#L1-L21)
- [checkbox.tsx](file://src/components/ui/checkbox.tsx#L1-L32)
- [select.tsx](file://src/components/ui/select.tsx#L1-L189)
- [utils.ts](file://src/components/ui/utils.ts)

**Section sources**
- [input.tsx](file://src/components/ui/input.tsx#L1-L21)
- [checkbox.tsx](file://src/components/ui/checkbox.tsx#L1-L32)
- [select.tsx](file://src/components/ui/select.tsx#L1-L189)
- [utils.ts](file://src/components/ui/utils.ts)

## Real-World Usage Examples

### Generalized Signup Flow
The GeneralizedSignupFlow component demonstrates a multi-step form process that guides users through account creation, user type selection, and onboarding.

```mermaid
flowchart TD
Start([Signup Flow]) --> SignupStep["Signup Step"]
SignupStep --> UserTypeStep["User Type Selection"]
UserTypeStep --> ClientPath["Client Path: Complete"]
UserTypeStep --> PhotographerPath["Photographer Path: Onboarding"]
PhotographerPath --> OnboardingStep["Onboarding Form"]
OnboardingStep --> Complete["Complete"]
subgraph "Signup Step"
SignupStep --> EmailValidation["Email validation"]
SignupStep --> PasswordValidation["Password validation"]
SignupStep --> Submit["Submit to API"]
end
subgraph "User Type Selection"
UserTypeStep --> ClientSelect["Client selected"]
UserTypeStep --> PhotographerSelect["Photographer selected"]
ClientSelect --> UpdateRole["Update user role"]
PhotographerSelect --> UpdateRole
end
subgraph "Onboarding Form"
OnboardingStep --> PersonalInfo["Personal Information"]
OnboardingStep --> EquipmentInfo["Equipment Information"]
OnboardingStep --> ServiceInfo["Service Information"]
OnboardingStep --> PortfolioInfo["Portfolio Information"]
OnboardingStep --> PriceInfo["Pricing Information"]
OnboardingStep --> SubmitOnboarding["Submit onboarding data"]
end
```

**Diagram sources**
- [GeneralizedSignupFlow.tsx](file://src/components/GeneralizedSignupFlow.tsx#L1-L191)
- [OnboardingForm.tsx](file://src/components/OnboardingForm.tsx#L1-L199)

### Onboarding Form
The OnboardingForm component demonstrates a complex form with multiple sections, conditional fields, and validation requirements.

```mermaid
flowchart TD
FormStart([Onboarding Form]) --> Step1["Step 1: Personal Information"]
Step1 --> Step2["Step 2: Equipment Information"]
Step2 --> Step3["Step 3: Service Information"]
Step3 --> Step4["Step 4: Portfolio Information"]
Step4 --> Step5["Step 5: Pricing Information"]
Step5 --> Step6["Step 6: Review and Submit"]
subgraph "Conditional Logic"
Step3 --> PhotoTypes["Photo Types Selection"]
PhotoTypes --> MaxSelection["Limit to 2 selections"]
PhotoTypes --> OtherOption["'Other' option shows text field"]
Step3 --> AdditionalServices["Additional Services"]
AdditionalServices --> SoftwareOption["'Other Software' option"]
SoftwareOption --> ShowTextField["Shows text input"]
AdditionalServices --> HardwareOption["'Other Hardware' option"]
HardwareOption --> ShowTextField
end
subgraph "Validation"
Step1 --> EmailValidation["Email format validation"]
Step1 --> PhoneValidation["Phone number validation"]
Step5 --> PriceValidation["Price range validation"]
PriceValidation --> ErrorState["Show error if invalid"]
end
subgraph "State Management"
FormStart --> FormData["FormData state"]
FormData --> HandleInputChange["handleInputChange handler"]
FormData --> HandleCheckboxChange["handleCheckboxChange handler"]
FormData --> HandleFormInputChange["handleFormInputChange handler"]
end
```

**Diagram sources**
- [OnboardingForm.tsx](file://src/components/OnboardingForm.tsx#L1-L199)

**Section sources**
- [GeneralizedSignupFlow.tsx](file://src/components/GeneralizedSignupFlow.tsx#L1-L191)
- [OnboardingForm.tsx](file://src/components/OnboardingForm.tsx#L1-L199)

## Common Issues and Solutions

### Uncontrolled vs Controlled Behavior
A common issue in React forms is the mixing of uncontrolled and controlled components. The form system addresses this by using react-hook-form's Controller component to wrap all form elements, ensuring consistent state management.

```mermaid
flowchart LR
Problem([Uncontrolled vs Controlled]) --> Issue1["Inconsistent state management"]
Issue1 --> Solution1["Use Controller from react-hook-form"]
Problem --> Issue2["Value prop warnings"]
Issue2 --> Solution2["Always provide defaultValue or value"]
Problem --> Issue3["State synchronization issues"]
Issue3 --> Solution3["Use useFormContext for shared state"]
Solution1 --> Benefit1["Consistent state management"]
Solution2 --> Benefit2["No console warnings"]
Solution3 --> Benefit3["Real-time state synchronization"]
```

**Diagram sources**
- [form.tsx](file://src/components/ui/form.tsx#L1-L167)

### Accessibility Labeling
Proper labeling is crucial for accessibility. The form system uses the FormLabel component to ensure all inputs have associated labels with proper htmlFor attributes.

```mermaid
flowchart TD
AccessibilityIssue([Accessibility Labeling]) --> Problem1["Missing labels"]
Problem1 --> Solution1["Use FormLabel with htmlFor"]
AccessibilityIssue --> Problem2["Incorrect label association"]
Problem2 --> Solution2["Use useFormField hook for ID generation"]
AccessibilityIssue --> Problem3["Screen reader issues"]
Problem3 --> Solution3["Implement aria-describedby for error messages"]
Solution1 --> Benefit1["All inputs have visible labels"]
Solution2 --> Benefit2["Correct label-input association"]
Solution3 --> Benefit3["Screen readers announce errors"]
```

**Diagram sources**
- [form.tsx](file://src/components/ui/form.tsx#L1-L167)
- [label.tsx](file://src/components/ui/label.tsx)

### Responsive Layout Adjustments
Forms need to work well on all device sizes. The form system uses Tailwind CSS's responsive utilities to adjust layouts based on screen size.

```mermaid
flowchart LR
ResponsiveIssue([Responsive Layout]) --> Problem1["Horizontal radio groups on mobile"]
Problem1 --> Solution1["Use flex-col on small screens"]
ResponsiveIssue --> Problem2["Wide inputs on mobile"]
Problem2 --> Solution2["Use full width inputs on mobile"]
ResponsiveIssue --> Problem3["Multi-column layouts on mobile"]
Problem3 --> Solution3["Use single column on small screens"]
Solution1 --> Benefit1["Vertical radio groups on mobile"]
Solution2 --> Benefit2["Inputs fill screen width"]
Solution3 --> Benefit3["Linear flow on small screens"]
```

**Diagram sources**
- [form.tsx](file://src/components/ui/form.tsx#L1-L167)
- [radio-group.tsx](file://src/components/ui/radio-group.tsx#L1-L45)

**Section sources**
- [form.tsx](file://src/components/ui/form.tsx#L1-L167)

## Advanced Features

### Custom Validation
The form system supports custom validation through both client-side and server-side validation rules.

```mermaid
sequenceDiagram
participant User as "User"
participant Form as "Form Component"
participant ClientValidation as "Client Validation"
participant ServerValidation as "Server Validation"
participant API as "API Endpoint"
User->>Form : Submits form
Form->>ClientValidation : Runs validation rules
alt Client validation fails
ClientValidation-->>Form : Returns error
Form->>User : Shows error message
else Client validation passes
Form->>ServerValidation : Sends data to server
ServerValidation->>API : Validates data
alt Server validation fails
API-->>ServerValidation : Returns error
ServerValidation-->>Form : Returns error
Form->>User : Shows error message
else Server validation passes
API-->>ServerValidation : Returns success
ServerValidation-->>Form : Returns success
Form->>User : Shows success message
end
end
```

**Diagram sources**
- [validation.ts](file://src/middleware/validation.ts#L1-L159)
- [form.tsx](file://src/components/ui/form.tsx#L1-L167)

### Animation with Framer Motion
The form components integrate with Framer Motion to provide smooth transitions and animations for form state changes.

```mermaid
flowchart TD
AnimationStart([Form Animation]) --> StepTransition["Step transitions in multi-step forms"]
StepTransition --> MotionDiv["Use motion.div for animated containers"]
StepTransition --> Variants["Define entry, in, and exit variants"]
StepTransition --> Transition["Specify transition type and duration"]
AnimationStart --> ErrorAnimation["Error state animations"]
ErrorAnimation --> Shake["Shake animation for invalid inputs"]
ErrorAnimation --> Fade["Fade in for error messages"]
AnimationStart --> LoadingState["Loading state animations"]
LoadingState --> ButtonMotion["Animated button with whileHover and whileTap"]
LoadingState --> Spinner["Loading spinner during submission"]
style MotionDiv fill:#88C0D0,stroke:#81A1C1
style Variants fill:#88C0D0,stroke:#81A1C1
style Transition fill:#88C0D0,stroke:#81A1C1
```

**Diagram sources**
- [GeneralizedSignupFlow.tsx](file://src/components/GeneralizedSignupFlow.tsx#L1-L191)
- [OnboardingForm.tsx](file://src/components/OnboardingForm.tsx#L1-L199)

**Section sources**
- [validation.ts](file://src/middleware/validation.ts#L1-L159)
- [GeneralizedSignupFlow.tsx](file://src/components/GeneralizedSignupFlow.tsx#L1-L191)
- [OnboardingForm.tsx](file://src/components/OnboardingForm.tsx#L1-L199)

## Component Reference

### Form Component
The Form component is a wrapper that provides the react-hook-form context to all form elements.

**Props**
- `form`: The form methods object from `useForm()`
- `onSubmit`: The submit handler function
- `children`: The form content

**Section sources**
- [form.tsx](file://src/components/ui/form.tsx#L1-L167)

### FormField Component
The FormField component wraps individual form controls and connects them to react-hook-form.

**Props**
- `name`: The field name in the form
- `control`: The control object from `useForm()`
- `rules`: Validation rules for the field
- `render`: The render function for the field

**Section sources**
- [form.tsx](file://src/components/ui/form.tsx#L1-L167)

### FormItem Component
The FormItem component provides a container for form fields with consistent spacing.

**Props**
- `className`: Additional CSS classes
- `children`: The form field content

**Section sources**
- [form.tsx](file://src/components/ui/form.tsx#L1-L167)

### FormLabel Component
The FormLabel component provides an accessible label for form fields.

**Props**
- `className`: Additional CSS classes
- `children`: The label text

**Section sources**
- [form.tsx](file://src/components/ui/form.tsx#L1-L167)

### FormControl Component
The FormControl component wraps the actual input element and manages accessibility attributes.

**Props**
- `children`: The input element

**Section sources**
- [form.tsx](file://src/components/ui/form.tsx#L1-L167)

### FormDescription Component
The FormDescription component provides additional information about a form field.

**Props**
- `className`: Additional CSS classes
- `children`: The description text

**Section sources**
- [form.tsx](file://src/components/ui/form.tsx#L1-L167)

### FormMessage Component
The FormMessage component displays validation errors for a form field.

**Props**
- `className`: Additional CSS classes
- `children`: The error message (optional, uses validation error by default)

**Section sources**
- [form.tsx](file://src/components/ui/form.tsx#L1-L167)

### Input Component
The Input component provides a styled text input field.

**Props**
- `type`: The input type (text, email, password, etc.)
- `className`: Additional CSS classes
- `placeholder`: Placeholder text
- `disabled`: Whether the input is disabled
- `required`: Whether the input is required

**Section sources**
- [input.tsx](file://src/components/ui/input.tsx#L1-L21)

### Textarea Component
The Textarea component provides a styled multi-line text input.

**Props**
- `className`: Additional CSS classes
- `placeholder`: Placeholder text
- `disabled`: Whether the textarea is disabled
- `required`: Whether the textarea is required
- `rows`: Number of visible rows
- `cols`: Number of visible columns

**Section sources**
- [textarea.tsx](file://src/components/ui/textarea.tsx#L1-L18)

### Checkbox Component
The Checkbox component provides a styled checkbox input.

**Props**
- `checked`: Whether the checkbox is checked
- `onCheckedChange`: Callback when checked state changes
- `disabled`: Whether the checkbox is disabled
- `required`: Whether the checkbox is required
- `name`: The field name
- `value`: The field value

**Section sources**
- [checkbox.tsx](file://src/components/ui/checkbox.tsx#L1-L32)

### RadioGroup Component
The RadioGroup component provides a container for radio buttons.

**Props**
- `value`: The currently selected value
- `onValueChange`: Callback when selection changes
- `disabled`: Whether the group is disabled
- `name`: The group name
- `orientation`: Layout orientation ("horizontal" or "vertical")

**Section sources**
- [radio-group.tsx](file://src/components/ui/radio-group.tsx#L1-L45)

### Select Component
The Select component provides a dropdown selection interface.

**Props**
- `value`: The currently selected value
- `onValueChange`: Callback when selection changes
- `disabled`: Whether the select is disabled
- `name`: The field name

**Section sources**
- [select.tsx](file://src/components/ui/select.tsx#L1-L189)

### Switch Component
The Switch component provides a toggle switch interface.

**Props**
- `checked`: Whether the switch is on
- `onCheckedChange`: Callback when state changes
- `disabled`: Whether the switch is disabled
- `required`: Whether the switch is required
- `name`: The field name

**Section sources**
- [switch.tsx](file://src/components/ui/switch.tsx#L1-L31)

### Slider Component
The Slider component provides a range selection interface.

**Props**
- `value`: The current value(s)
- `onValueChange`: Callback when value changes
- `min`: Minimum value
- `max`: Maximum value
- `step`: Step increment
- `disabled`: Whether the slider is disabled
- `orientation`: Layout orientation ("horizontal" or "vertical")

**Section sources**
- [slider.tsx](file://src/components/ui/slider.tsx#L1-L63)

### InputOTP Component
The InputOTP component provides a one-time password input interface.

**Props**
- `value`: The current OTP value
- `onChange`: Callback when value changes
- `containerClassName`: Additional classes for container
- `maxLength`: Maximum number of digits
- `pattern`: Regex pattern for validation
- `disabled`: Whether the input is disabled

**Section sources**
- [input-otp.tsx](file://src/components/ui/input-otp.tsx#L1-L77)