# Video Start Time Feature

## Overview

This feature adds a `videoStartTime` field to YouTube articles, allowing users to specify when YouTube videos should start playing. The start time is used in the YouTube player's `playerVars.start` configuration.

## Database Schema Changes

### New Field Added

- **Field**: `videoStartTime`
- **Type**: `Int?` (optional integer)
- **Purpose**: Stores the start time in seconds for YouTube videos
- **Location**: `prisma/schema.prisma` in the Article model

### Migration

- Migration file: `20250803205401_add_video_start_time`
- Automatically adds the field to existing articles (nullable)

## Form Integration

### NewArticle Component Updates

- Added `videoStartTime` field for YouTube article types
- Auto-extracts start time from YouTube URLs containing `?t=` parameter
- Provides manual input field for custom start times
- Includes validation and helpful text

### Form Fields Added

```typescript
// YouTube URL field (existing, enhanced)
<FormField name="videoUrl" />

// New Start Time field
<FormField name="videoStartTime" />
```

## Validation

### Schema Validation (`db/schema/article.ts`)

- **Required for YouTube articles**: `videoStartTime` must be present
- **Positive number validation**: Must be >= 0
- **Type validation**: Must be a number

### Client-side Features

- **Auto-extraction**: Automatically extracts start time from YouTube URLs
- **Manual input**: Allows manual entry of start time in seconds
- **Real-time validation**: Immediate feedback on invalid inputs

## YouTube URL Support

### Auto-Extraction

The system automatically extracts start times from YouTube URLs:

- `https://youtube.com/watch?v=VIDEO_ID&t=30` → Start time: 30 seconds
- `https://youtu.be/VIDEO_ID?t=60` → Start time: 60 seconds

### Utility Functions (`lib/utils.ts`)

```typescript
// Extract start time from YouTube URL
extractYouTubeStartTime(url: string): number | null

// Validate YouTube URL format
validateYouTubeUrl(url: string): { valid: boolean; error?: string }
```

## Player Integration

### YouTube Component Updates

- **File**: `components/news-card/NewsMedias/Youtube.tsx`
- **Change**: Uses `article.videoStartTime || 0` instead of hardcoded `start: 5`

### YoutubeShorts Component Updates

- **File**: `components/news-card/NewsMedias/YoutubeShorts.tsx`
- **Change**: Uses `article.videoStartTime || 0` instead of hardcoded `start: 0`

### Player Configuration

```typescript
config={{
  playerVars: {
    start: article.videoStartTime || 0,  // Dynamic start time
    modestbranding: 1,
    rel: 0,
    showinfo: 0,
  },
}}
```

## Usage

### For Content Creators

1. **Select YouTube Article Type**: Choose "Youtube Video" from article types
2. **Enter YouTube URL**: Paste the YouTube video URL
3. **Start Time Auto-Extraction**: If URL contains `?t=`, it's automatically extracted
4. **Manual Start Time**: Enter custom start time in seconds if needed
5. **Submit Article**: Start time is saved and used when video plays

### For Viewers

- Videos automatically start at the specified time
- No additional interaction required
- Works with both regular YouTube videos and YouTube Shorts

## Technical Implementation

### Database Layer

```sql
-- Migration adds the field
ALTER TABLE "Article" ADD COLUMN "videoStartTime" INTEGER;
```

### API Layer

```typescript
// Create article action updated
const res = await prisma.article.create({
  data: {
    // ... other fields
    videoStartTime: article.videoStartTime,
  },
});
```

### Form Layer

```typescript
// Form field with auto-extraction
<FormField
  name="videoStartTime"
  render={({ field }) => (
    <Input
      type="number"
      min="0"
      onChange={(e) => {
        // Auto-extract from URL
        const startTime = extractYouTubeStartTime(url);
        if (startTime !== null) {
          form.setValue("videoStartTime", startTime);
        }
      }}
    />
  )}
/>
```

### Display Layer

```typescript
// YouTube player configuration
<ReactPlayer
  config={{
    playerVars: {
      start: article.videoStartTime || 0,
    },
  }}
/>
```

## Error Handling

### Validation Errors

- **Missing start time**: "Start time is required for YouTube articles"
- **Negative value**: "Start time must be a positive number"
- **Invalid URL**: "Please enter a valid YouTube URL"

### User Experience

- **Auto-extraction feedback**: Start time is automatically filled when URL contains time parameter
- **Manual override**: Users can manually change the auto-extracted time
- **Clear labeling**: Field is clearly labeled as "Start Time (seconds)"

## Backward Compatibility

### Existing Articles

- Articles without `videoStartTime` will use `0` as default
- No breaking changes to existing functionality
- Gradual migration as new articles are created

### Database Migration

- Field is nullable, so existing articles remain unaffected
- New articles can optionally include start time
- YouTube articles require start time going forward

## Security Considerations

### Input Validation

- **Server-side**: Schema validation ensures positive numbers
- **Client-side**: Number input with min="0" prevents negative values
- **URL parsing**: Safe URL parsing with try-catch error handling

### Data Integrity

- **Type safety**: TypeScript ensures correct data types
- **Database constraints**: Prisma schema enforces data integrity
- **Form validation**: Zod schema provides runtime validation

## Future Enhancements

### Potential Improvements

- **Time format support**: Allow MM:SS format in addition to seconds
- **End time support**: Add `videoEndTime` for custom end times
- **Preview functionality**: Show video preview with start time
- **Bulk editing**: Allow editing start times for multiple articles

### Integration Opportunities

- **Analytics**: Track which start times are most effective
- **A/B testing**: Test different start times for engagement
- **Content optimization**: Suggest optimal start times based on video content
