# Onboarding Form Updates

## Summary of Changes

I've updated the SnapEvent onboarding form to better handle contact information and portfolio link generation as requested.

## Key Changes Made

### 1. **Enhanced Contact Information Display**
- **Location, Phone, Email**: These fields were already present in the form data but are now more prominently displayed
- **Review Step**: Contact information is now clearly separated and formatted in the review step
- **Field Labels**: Updated to be more descriptive and user-friendly

### 2. **Portfolio Link Generation**
- **Automatic Generation**: The form now clearly indicates that SnapEvent portfolio links will be created automatically
- **URL Preview**: Users can see what their portfolio URL will look like as they fill out the form
- **Database Schema**: Added `portfolioUrl` field to store the generated portfolio URL
- **Utility Functions**: Created portfolio URL generation utilities in `src/utils/portfolio.ts`

### 3. **Form Field Updates**
- **Website Field**: Changed from "Website/Portfolio" to "Current Website (Optional)" to clarify it's for existing websites
- **Portfolio Preview**: Shows live preview of the generated portfolio URL based on user's name
- **Clear Messaging**: Added explanatory text about automatic portfolio creation

### 4. **Database Schema Enhancements**
- **New Field**: Added `portfolioUrl` to `PhotographerProfile` model
- **Sample Data**: Updated seed data to include portfolio URLs for sample photographers
- **URL Format**: Portfolio URLs follow the pattern `snapevent.com/photographer/firstname-lastname`

## Updated Form Flow

### Step 1: Personal Information
- First Name
- Last Name  
- Email
- Phone Number
- Location

### Step 2: Professional Information
- Years of Experience
- Photography Specialties (multiple selection)
- Equipment Description
- Current Website (Optional) - with portfolio URL preview

### Step 3: Services & Pricing
- Available Services (multiple selection)
- Price Range
- Availability

### Step 4: Portfolio
- Portfolio Description
- Instagram Handle
- Work Sample Uploads

### Step 5: Review & Submit
- Complete contact information review
- Portfolio URL preview
- Next steps including automatic portfolio creation

## Portfolio URL Generation

### Features
- **Automatic Creation**: URLs are generated based on photographer's name
- **Uniqueness**: System ensures URL uniqueness by adding numbers if needed
- **Format**: `snapevent.com/photographer/firstname-lastname`
- **Preview**: Users see their URL as they type their name

### Example URLs
- `snapevent.com/photographer/sarah-chen`
- `snapevent.com/photographer/alex-rodriguez`
- `snapevent.com/photographer/emma-wilson`

## Database Changes

### New Field in PhotographerProfile
```prisma
portfolioUrl      String?  // Generated SnapEvent portfolio URL
```

### Updated Seed Data
All sample photographers now have portfolio URLs:
- Sarah Chen: `snapevent.com/sarah-chen`
- Alex Rodriguez: `snapevent.com/alex-rodriguez`
- Emma Wilson: `snapevent.com/emma-wilson`

## Utility Functions Created

### `src/utils/portfolio.ts`
- `generatePortfolioSlug()` - Creates unique URL slugs
- `generatePortfolioUrl()` - Creates full portfolio URLs
- `isValidPortfolioUrl()` - Validates URL format
- `extractSlugFromUrl()` - Extracts slug from URL
- `createPortfolioUrl()` - Main function for creating portfolio URLs
- `formatPortfolioUrl()` - Formats URLs for display

## User Experience Improvements

### Clear Communication
- Users understand that portfolio links are created automatically
- Preview shows exactly what their URL will be
- No confusion about existing vs. new portfolio links

### Better Organization
- Contact information is clearly separated and displayed
- Portfolio information has its own section in the review
- Next steps clearly explain the portfolio creation process

### Visual Feedback
- Live preview of portfolio URL as user types
- Highlighted portfolio URL in review step
- Clear distinction between current website and new portfolio

## Next Steps for Implementation

1. **API Integration**: Connect form submission to database
2. **URL Generation**: Implement automatic portfolio URL creation on approval
3. **Portfolio Pages**: Create dynamic portfolio pages using the generated URLs
4. **Admin Panel**: Add approval workflow for photographer applications
5. **Email Notifications**: Send portfolio URL to approved photographers

The onboarding form now provides a much clearer and more professional experience for photographers joining the SnapEvent platform, with automatic portfolio link generation being a key differentiator.
