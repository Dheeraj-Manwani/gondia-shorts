# Video Upload Feature

## Overview

This feature allows users to upload video files directly to articles when creating content. The system automatically identifies uploaded video files and sets them in the appropriate field when saving articles.

## Supported Video Formats

- MP4
- MOV
- AVI
- WMV
- FLV
- WEBM
- MKV

## File Size Limits

- Maximum video file size: 100MB
- Maximum image file size: 5MB

## Article Types That Support Video Upload

- **FULL_VIDEO**: Full vertical video articles
- **VIDEO_N_TEXT**: Video with text content

## How It Works

### 1. Video Upload Component

The `VideoAttachment` component (`components/form/VideoAttachment.tsx`) handles:

- File selection and validation
- File size checking
- Video format validation
- Upload to S3 storage
- Preview with video player

### 2. Form Integration

The `NewArticle` component automatically shows the video upload field when:

- Article type is `FULL_VIDEO` or `VIDEO_N_TEXT`
- Uses the `isVideoRequired()` utility function for validation

### 3. Validation

- **Client-side**: File type and size validation before upload
- **Server-side**: Schema validation ensures video URL is present for video article types
- **Database**: Video URL is stored in the `videoUrl` field

### 4. Display

Uploaded videos are displayed using the existing `VideoText` component which:

- Supports autoplay on intersection
- Has mute/unmute controls
- Loops automatically
- Responsive design

## Usage

1. **Create New Article**: Navigate to the article creation form
2. **Select Article Type**: Choose "Only Video (Full Vertical)" or "Video with Text"
3. **Upload Video**: Use the video upload field to select and upload a video file
4. **Preview**: The uploaded video will be displayed with a preview
5. **Submit**: The video URL will be automatically set in the article

## Technical Implementation

### Key Components

- `VideoAttachment.tsx`: Video upload component
- `utils.ts`: Validation functions (`validateVideoFile`, `isVideoRequired`)
- `article.ts`: Schema validation for video requirements
- `NewArticle.tsx`: Form integration

### Validation Functions

```typescript
// Check if article type requires video
isVideoRequired(selectedType: ArticleType)

// Validate video file
validateVideoFile(file: File, maxSizeMB: number)

// Check if file is video
isVideoFile(file: File)
```

### Database Schema

The `videoUrl` field in the Article model stores the uploaded video URL.

## Error Handling

- Invalid file type: Shows error message with supported formats
- File too large: Shows error message with size limit
- Upload failure: Shows error message and allows retry
- Network issues: Graceful error handling with user feedback

## Security

- File type validation prevents malicious uploads
- Size limits prevent abuse
- S3 storage with proper access controls
- Client and server-side validation
