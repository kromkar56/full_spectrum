/**
 * Date and scheduling utility functions for CampusDeadline.
 * Provides clean, explainable date formatting, relative horizon calculation,
 * and deadline status determination.
 */

/**
 * Format a Date or date string (YYYY-MM-DD) into standard display: "12 Oct"
 */
export function formatDateDisplay(dateInput) {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return dateInput;
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }).toUpperCase();
}

/**
 * Get ISO date string (YYYY-MM-DD) for today offset by given days
 */
export function getDateOffset(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
}

/**
 * Calculate difference in calendar days between today and the target date
 */
export function getDaysDifference(targetDateStr) {
  if (!targetDateStr) return 999;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(targetDateStr);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Determine human-readable deadline status and urgency label
 * Categories: Overdue, Due Soon (<= 1 day), Upcoming (2-7 days), Later (> 7 days)
 */
export function getDeadlineUrgency(dueDateStr, isCompleted = false) {
  if (isCompleted) {
    return { status: 'Completed', label: 'COMPLETED', isUrgent: false, filterKey: 'completed' };
  }

  const diffDays = getDaysDifference(dueDateStr);

  if (diffDays < 0) {
    return { status: 'Overdue', label: 'OVERDUE', isUrgent: true, filterKey: 'overdue' };
  }
  if (diffDays === 0) {
    return { status: 'Due Soon', label: 'DUE TODAY', isUrgent: true, filterKey: 'today' };
  }
  if (diffDays === 1) {
    return { status: 'Due Soon', label: 'DUE TOMORROW', isUrgent: true, filterKey: 'today' };
  }
  if (diffDays <= 7) {
    return { status: 'Upcoming', label: `DUE IN ${diffDays} DAYS`, isUrgent: false, filterKey: 'thisweek' };
  }
  return { status: 'Later', label: `IN ${diffDays} DAYS`, isUrgent: false, filterKey: 'later' };
}
