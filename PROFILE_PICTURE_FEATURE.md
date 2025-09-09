# Profile Picture Collection Feature

## Overview

I've added profile picture collection to the SnapEvent onboarding form. Previously, we were **NOT** collecting photographer profile pictures, but now we are.

## What Was Added

### 1. **Form Data Structure**
- Added `profilePicture: null as File | null` to the form state
- Stores the uploaded profile picture file

### 2. **File Upload Handler**
- `handleProfilePictureChange()` function with validation:
  - **File Type**: Only accepts image files (`image/*`)
  - **File Size**: Maximum 5MB limit
  - **Error Handling**: Shows alerts for invalid files

### 3. **UI Components**
- **Upload Interface**: Circular profile picture preview with upload button
- **Visual Feedback**: Shows camera icon when no image, preview when uploaded
- **Upload Button**: Floating upload icon in bottom-right corner
- **Status Text**: Shows "Profile picture uploaded" or "Upload your profile picture"
- **Guidelines**: "Recommended: Square image, max 5MB"

### 4. **Review Integration**
- Added profile picture status to the review step
- Shows "Uploaded" or "Not provided" in the contact information section

## User Experience

### Upload Process
1. **Visual Preview**: 24x24 circular preview area
2. **Easy Upload**: Click the floating upload button
3. **File Validation**: Automatic validation with user feedback
4. **Preview**: Immediate preview of uploaded image
5. **Status**: Clear indication of upload status

### Design Features
- **Circular Design**: Matches typical profile picture styling
- **Dashed Border**: Indicates upload area when empty
- **Hover Effects**: Upload button has hover state
- **Responsive**: Works on all screen sizes
- **Accessible**: Proper labels and file input handling

## Technical Implementation

### File Handling
```typescript
const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }
    setFormData(prev => ({ ...prev, profilePicture: file }));
  }
};
```

### UI Structure
```jsx
<div className="flex flex-col items-center mb-6">
  <div className="relative">
    <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-dashed border-muted-foreground/25">
      {formData.profilePicture ? (
        <img src={URL.createObjectURL(formData.profilePicture)} alt="Profile preview" />
      ) : (
        <Camera className="h-8 w-8 text-muted-foreground" />
      )}
    </div>
    <label htmlFor="profile-picture" className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors">
      <Upload className="h-4 w-4" />
    </label>
    <input id="profile-picture" type="file" accept="image/*" onChange={handleProfilePictureChange} className="hidden" />
  </div>
</div>
```

## Database Integration

### Existing Schema Support
The database schema already supports profile pictures:
- **User Model**: `avatar` field for user profile pictures
- **PhotographerProfile Model**: `profileImage` and `coverImage` fields

### Data Flow
1. **Upload**: User uploads image in onboarding form
2. **Storage**: File stored in form state (temporary)
3. **Submission**: File sent to backend on form submit
4. **Processing**: Backend processes and stores image
5. **Database**: URL stored in `profileImage` field

## File Validation

### Supported Formats
- **Types**: All image formats (`image/*`)
- **Common**: JPEG, PNG, WebP, GIF
- **Size Limit**: 5MB maximum
- **Recommendation**: Square images work best

### Error Handling
- **Invalid Type**: "Please select an image file"
- **Too Large**: "File size must be less than 5MB"
- **User Feedback**: Clear error messages

## Next Steps for Implementation

### Backend Integration
1. **File Upload API**: Create endpoint for image uploads
2. **Image Processing**: Resize and optimize images
3. **Cloud Storage**: Store images in cloud storage (AWS S3, Cloudinary)
4. **Database Update**: Store image URL in photographer profile

### Image Processing
1. **Resize**: Create multiple sizes (thumbnail, medium, large)
2. **Optimize**: Compress for web delivery
3. **Format**: Convert to web-optimized formats
4. **CDN**: Serve through content delivery network

### Security
1. **File Validation**: Server-side validation
2. **Virus Scanning**: Scan uploaded files
3. **Access Control**: Proper file permissions
4. **Rate Limiting**: Prevent abuse

## Benefits

### For Photographers
- **Professional Appearance**: Profile pictures increase credibility
- **Personal Connection**: Clients can see who they're working with
- **Brand Building**: Consistent professional image

### For Clients
- **Trust Building**: Seeing the photographer builds confidence
- **Personal Connection**: Easier to connect with a face
- **Professional Assessment**: Visual confirmation of professionalism

### For Platform
- **Quality Control**: Profile pictures indicate serious photographers
- **User Engagement**: Visual elements increase engagement
- **Professional Standards**: Maintains high-quality appearance

The profile picture feature is now fully integrated into the onboarding form and ready for backend implementation. It provides a professional, user-friendly way for photographers to upload their profile pictures with proper validation and feedback.
