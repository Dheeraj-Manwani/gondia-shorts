# Article Public Visibility Feature

## Overview

This feature adds an `isPublic` field to the Article model, allowing admins to control which articles are visible in the main feed. Articles are private by default and must be explicitly made public by an admin.

## Database Schema Changes

### Article Model Updates

- **New Field**: `isPublic` (Boolean, default: false)
- **Purpose**: Controls whether an article appears in the main feed
- **Location**: `prisma/schema.prisma` in the Article model
- **Default Value**: `false` (articles are private by default)

### Migration

- Migration file: `20250803205402_add_article_public_visibility`
- Automatically adds the field to existing articles (defaults to false)

## Admin Interface Updates

### Admin Articles Page (`/admin/articles`)

- **Dual View Mode**: Toggle between table view and card view
- **Public Toggle**: Switch to make articles public/private
- **Visual Indicators**: Globe icon for public, Lock icon for private
- **Real-time Updates**: Changes reflect immediately

### View Modes

1. **Table View**: Traditional table layout with all article details
2. **Card View**: Card-based layout similar to InteractedNewsFeed.tsx

### Public Toggle Functionality

- **Switch Control**: Toggle switch for each article
- **Icon Indicators**:
  - 🌐 Globe icon for public articles
  - 🔒 Lock icon for private articles
- **Status Badge**: Shows "Public" or "Private" status
- **Toast Notifications**: Success/error feedback

## Feed Integration

### Public Article Filtering

- **Feed Visibility**: Only public articles appear in main feed
- **Private Articles**: Hidden from regular users
- **Admin Access**: Admins can see all articles regardless of status

### Article Fetching Logic

```typescript
// In fetchArticles function
where: {
  ...(mainArticle ? { slug: { not: articleSlug } } : {}),
  isPublic: true, // Only fetch public articles for feed
}
```

## Technical Implementation

### Database Layer

```sql
-- Add isPublic field to Article table
ALTER TABLE "Article" ADD COLUMN "isPublic" BOOLEAN NOT NULL DEFAULT false;
```

### API Layer

```typescript
// Update article with public status
export const updateArticle = async (
  articleId: number,
  data: {
    // ... other fields
    isPublic?: boolean;
  }
) => {
  const article = await prisma.article.update({
    where: { id: articleId },
    data: {
      ...(data.isPublic !== undefined && { isPublic: data.isPublic }),
    },
  });
};
```

### Frontend Components

- **AdminArticlesPage**: Main admin dashboard with toggle controls
- **Public Toggle Switch**: UI component for changing article visibility
- **Status Indicators**: Visual feedback for article status
- **Dual View Mode**: Table and card view options

## User Experience

### Admin Workflow

1. **Create Article**: Article is created as private by default
2. **Review Content**: Admin reviews article content and quality
3. **Make Public**: Admin toggles article to public status
4. **Feed Visibility**: Article now appears in main feed

### Visual Design

- **Clean Interface**: Modern toggle switches and status indicators
- **Responsive Design**: Works on all device sizes
- **Intuitive Controls**: Clear visual feedback for all actions
- **Consistent Styling**: Matches existing admin interface

## Security Considerations

### Access Control

- **Admin Only**: Only admins can change article visibility
- **Session Validation**: All toggle actions validate admin session
- **Role Checking**: Admin role required for visibility changes

### Data Protection

- **Default Privacy**: Articles are private by default
- **Explicit Public**: Articles must be explicitly made public
- **Audit Trail**: All visibility changes are logged (can be added)

## Integration Points

### Feed System

- **Main Feed**: Only shows public articles
- **Admin Feed**: Shows all articles regardless of status
- **Search Results**: Only public articles in search results

### Article Management

- **Creation Flow**: New articles start as private
- **Review Process**: Admin reviews before making public
- **Bulk Operations**: Future enhancement for bulk visibility changes

## Error Handling

### User Feedback

- **Success Messages**: "Article made public/private successfully"
- **Error Messages**: Clear error messages for failed operations
- **Loading States**: Proper loading indicators during operations

### Graceful Degradation

- **Fallback Behavior**: Private articles hidden from feed
- **Error Recovery**: System continues working despite errors
- **Backward Compatibility**: Existing articles remain functional

## Future Enhancements

### Potential Improvements

- **Bulk Operations**: Select multiple articles for batch visibility changes
- **Scheduled Publishing**: Set articles to become public at specific times
- **Auto-Review**: AI-powered content review before public status
- **Analytics**: Track which articles perform better when public

### Advanced Features

- **Draft Mode**: Articles can be saved as drafts
- **Scheduled Publishing**: Articles become public at scheduled times
- **Content Moderation**: Automated content review before public status
- **A/B Testing**: Test different visibility strategies

## Deployment Notes

### Database Migration

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Verify schema
npx prisma db push
```

### Environment Variables

- No additional environment variables required
- Uses existing admin authentication system

### Testing Checklist

- [ ] Admin can toggle article visibility
- [ ] Public articles appear in feed
- [ ] Private articles are hidden from feed
- [ ] Admin can see all articles regardless of status
- [ ] Toggle switches work correctly
- [ ] Status indicators display properly
- [ ] Error handling works as expected

## Troubleshooting

### Common Issues

1. **Articles Not Appearing**: Check if articles are set to public
2. **Toggle Not Working**: Verify admin permissions
3. **Database Errors**: Check Prisma client generation
4. **UI Issues**: Clear browser cache and reload

### Debug Steps

1. **Check Database**: Verify isPublic field exists and has correct values
2. **Verify Permissions**: Confirm user has ADMIN role
3. **Check Logs**: Review server logs for error details
4. **Test Toggle**: Try toggling article visibility manually

## Support and Maintenance

### Regular Tasks

- **Monitor Public Articles**: Review articles that are made public
- **Content Quality**: Ensure public articles meet quality standards
- **System Health**: Monitor article visibility functionality
- **User Support**: Handle admin inquiries about article visibility

### Backup and Recovery

- **Database Backups**: Regular backups of article data including visibility status
- **Configuration Backups**: Backup admin settings and visibility configurations
- **Recovery Procedures**: Document recovery procedures for visibility data

This comprehensive article visibility system provides full control over which articles appear in the main feed while maintaining security and user experience.
