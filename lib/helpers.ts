/**
 * Truncates text to the specified number of words.
 * @param text The text to truncate
 * @param wordCount The maximum number of words to keep
 * @returns The truncated text with ellipsis if truncated
 */
export function truncateToWordCount(text: string, wordCount: number): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= wordCount) {
    return text;
  }
  return words.slice(0, wordCount).join(' ') + '...';
}

/**
 * Ensures a text is between min and max words.
 * If text has more words than max, it will be truncated.
 * If text has fewer words than min, it will return false.
 * @param text The text to check
 * @param min Minimum word count
 * @param max Maximum word count
 * @returns The processed text or false if below minimum
 */
export function ensureWordCount(text: string, min: number, max: number): string | false {
  const words = text.trim().split(/\s+/);
  if (words.length < min) {
    return false;
  }
  if (words.length > max) {
    return truncateToWordCount(text, max);
  }
  return text;
}

/**
 * Formats a date in a human-readable format.
 * @param date The date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(dateObj);
}
