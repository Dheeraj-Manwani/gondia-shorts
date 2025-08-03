# Admin Features Documentation

## Overview

This document describes the comprehensive admin features implemented for the Gondia Shorts application, including articles management, user restrictions, and comment moderation.

## Database Schema Changes

### User Model Updates

- **New Field**: `isRestricted` (Boolean, default: false)
- **Purpose**: Controls whether a user can comment on articles
- **Location**: `prisma/schema.prisma` in the User model

### Migration

- Migration file: `20250803205401_add_user_restriction`
- Automatically adds the field to existing users (defaults to false)

## Admin Access Control

### Authentication Requirements

- **Role Required**: `ADMIN`
- **Access Control**: All admin features require admin privileges
- **Session Validation**: Automatic session checking on all admin routes

### Admin Routes

- **Primary Route**: `/admin/articles`
- **Access**: Only users with `ADMIN` role can access
- **Redirect**: Non-admin users are redirected to home page

## Articles Management

### Features

1. **View All Articles**: Complete list of all articles in the system
2. **Edit Articles**: Modify article content, type, video settings, etc.
3. **Delete Articles**: Permanently remove articles from the system
4. **View Article Details**: Quick access to article content and metadata

### Article Information Displayed

- **Basic Info**: Title, type, author, creation date
- **Engagement**: Comment count, like count
- **Author Status**: Shows if author is restricted
- **Actions**: Edit, view, delete buttons

### Article Editing

- **Editable Fields**:
  - Title and content
  - Article type (IMAGE_N_TEXT, VIDEO_N_TEXT, etc.)
  - Video URL and start time (for YouTube articles)
  - Source and author information
- **Validation**: Form validation for required fields
- **Real-time Updates**: Changes reflect immediately in the interface

## User Management

### User Information Displayed

- **Basic Info**: Name, email, role
- **Activity**: Comment count
- **Status**: Active/Restricted status
- **Actions**: Restrict/Unrestrict buttons

### User Restriction System

- **Purpose**: Prevent users from commenting on articles
- **Implementation**: `isRestricted` field in User model
- **Effect**: Restricted users cannot create comments
- **Admin Control**: Admins can toggle user restrictions

### Restriction Workflow

1. **Admin Action**: Admin clicks "Restrict" button
2. **Database Update**: `isRestricted` field set to `true`
3. **Comment Prevention**: User's future comment attempts are blocked
4. **Error Message**: Clear message explaining the restriction

## Comment Moderation

### Comment Creation Validation

- **Restriction Check**: Before creating any comment
- **User Status**: Verifies if user is restricted
- **Error Handling**: Clear error messages for restricted users
- **Graceful Degradation**: Non-restricted users unaffected

### Comment Deletion

- **Admin Only**: Only admins can delete comments
- **Permanent Removal**: Comments are permanently deleted
- **No Confirmation**: Immediate deletion without confirmation dialog

### Error Messages

- **Restricted User**: "You are restricted from commenting. Please contact an administrator."
- **Access Denied**: "Access denied. Admin privileges required."
- **General Errors**: User-friendly error messages for all operations

## Technical Implementation

### Database Layer

```sql
-- User restriction field
ALTER TABLE "User" ADD COLUMN "isRestricted" BOOLEAN NOT NULL DEFAULT false;

-- Article management queries
SELECT * FROM "Article" ORDER BY "createdAt" DESC;
UPDATE "Article" SET ... WHERE "id" = ?;
DELETE FROM "Article" WHERE "id" = ?;
```

### API Layer

```typescript
// Admin actions
export const getAllArticles = async () => {
  /* ... */
};
export const deleteArticle = async (articleId: number) => {
  /* ... */
};
export const updateArticle = async (articleId: number, data: any) => {
  /* ... */
};
export const getAllUsers = async () => {
  /* ... */
};
export const updateUserRestriction = async (
  userId: number,
  isRestricted: boolean
) => {
  /* ... */
};
export const deleteComment = async (commentId: number) => {
  /* ... */
};
```

### Frontend Components

- **AdminArticlesPage**: Main admin dashboard
- **EditArticleForm**: Article editing interface
- **User Management Dialog**: User restriction controls
- **Error Handling**: Toast notifications for all operations

## Security Considerations

### Access Control

- **Session Validation**: All admin actions validate session
- **Role Checking**: Admin role required for all operations
- **Unauthorized Access**: Automatic redirects for non-admin users

### Data Protection

- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: Prisma ORM provides protection
- **Error Handling**: Secure error messages without exposing internals

### User Privacy

- **Restricted User Data**: Only admins can see restriction status
- **Comment Privacy**: Deleted comments are permanently removed
- **Audit Trail**: No logging of admin actions (can be added later)

## User Experience

### Admin Interface

- **Clean Design**: Modern, responsive admin dashboard
- **Intuitive Navigation**: Easy-to-use table layouts
- **Real-time Feedback**: Toast notifications for all actions
- **Loading States**: Proper loading indicators

### Error Handling

- **User-Friendly Messages**: Clear, actionable error messages
- **Graceful Degradation**: System continues working despite errors
- **Recovery Options**: Easy ways to retry failed operations

### Responsive Design

- **Mobile Support**: Admin interface works on all devices
- **Table Scrolling**: Horizontal scrolling for wide tables
- **Dialog Modals**: Proper modal dialogs for editing

## Future Enhancements

### Potential Improvements

- **Bulk Operations**: Select multiple articles/users for batch actions
- **Advanced Filtering**: Filter articles by type, date, author
- **Search Functionality**: Search articles and users
- **Audit Logging**: Track admin actions for accountability
- **User Activity Monitoring**: Track user behavior patterns
- **Comment Moderation Tools**: Advanced comment filtering and moderation

### Integration Opportunities

- **Analytics Dashboard**: Article performance metrics
- **User Analytics**: User engagement and behavior data
- **Content Moderation**: AI-powered content filtering
- **Notification System**: Alert admins about flagged content

## Troubleshooting

### Common Issues

1. **Prisma Client Not Updated**: Run `npx prisma generate` after schema changes
2. **Session Issues**: Clear browser cache and re-login
3. **Permission Errors**: Verify user has ADMIN role in database
4. **Database Connection**: Check DATABASE_URL environment variable

### Debug Steps

1. **Check Console**: Look for JavaScript errors in browser console
2. **Verify Session**: Confirm user session and role in database
3. **Test Database**: Verify database connection and schema
4. **Check Logs**: Review server logs for error details

## Deployment Notes

### Environment Variables

- **DATABASE_URL**: Required for database connection
- **NEXTAUTH_SECRET**: Required for session management
- **NEXTAUTH_URL**: Required for authentication

### Database Migration

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Verify schema
npx prisma db push
```

### Build Process

```bash
# Install dependencies
npm install

# Build application
npm run build

# Start production server
npm start
```

## Support and Maintenance

### Regular Tasks

- **Monitor User Restrictions**: Review and manage user restrictions
- **Content Moderation**: Review and moderate comments
- **System Health**: Monitor application performance and errors
- **User Support**: Handle user inquiries about restrictions

### Backup and Recovery

- **Database Backups**: Regular backups of user and article data
- **Configuration Backups**: Backup admin settings and configurations
- **Recovery Procedures**: Document recovery procedures for data loss

This comprehensive admin system provides full control over articles, users, and comments while maintaining security and user privacy.
