/**
 * Formats a lastSeen timestamp to a user-friendly relative string.
 * e.g., "Last seen today at 3:45 PM", "Last seen yesterday at 12:30 PM", "Last seen Jul 10 at 2:15 PM"
 */
export const formatLastSeen = (dateString) => {
  if (!dateString) return 'Offline';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Offline';

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (compareDate.getTime() === today.getTime()) {
    return `Last seen today at ${timeStr}`;
  } else if (compareDate.getTime() === yesterday.getTime()) {
    return `Last seen yesterday at ${timeStr}`;
  } else {
    const monthStr = date.toLocaleString([], { month: 'short' });
    const dayStr = date.getDate();
    if (date.getFullYear() === now.getFullYear()) {
      return `Last seen ${monthStr} ${dayStr} at ${timeStr}`;
    } else {
      return `Last seen ${monthStr} ${dayStr}, ${date.getFullYear()} at ${timeStr}`;
    }
  }
};

/**
 * Formats a message timestamp into a group date separator name (e.g. "Today", "Yesterday", or "July 10, 2026").
 */
export const getGroupDateString = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (compareDate.getTime() === today.getTime()) {
    return 'Today';
  } else if (compareDate.getTime() === yesterday.getTime()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
};
