/**
 * Date utilities
 * Common date formatting and manipulation functions
 */

/**
 * Format date to locale string
 * @param {Date|string} date - Date to format
 * @param {string} locale - Locale string (default: 'vi-VN')
 * @returns {string}
 */
export const formatDate = (date, locale = 'vi-VN') => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString(locale);
};

/**
 * Format date and time to locale string
 * @param {Date|string} date - Date to format
 * @param {string} locale - Locale string (default: 'vi-VN')
 * @returns {string}
 */
export const formatDateTime = (date, locale = 'vi-VN') => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleString(locale);
};

/**
 * Format date to ISO string (YYYY-MM-DD)
 * @param {Date|string} date - Date to format
 * @returns {string}
 */
export const formatISODate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

/**
 * Get relative time string (e.g., "5 minutes ago")
 * @param {Date|string} date - Date to compare
 * @returns {string}
 */
export const getRelativeTime = (date) => {
  if (!date) return '';

  const now = new Date();
  const d = new Date(date);
  const diffMs = now - d;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return 'Vừa xong';
  if (diffMin < 60) return `${diffMin} phút trước`;
  if (diffHour < 24) return `${diffHour} giờ trước`;
  if (diffDay < 7) return `${diffDay} ngày trước`;

  return formatDate(d);
};

/**
 * Check if date is today
 * @param {Date|string} date - Date to check
 * @returns {boolean}
 */
export const isToday = (date) => {
  if (!date) return false;
  const d = new Date(date);
  const today = new Date();
  return d.toDateString() === today.toDateString();
};

export default {
  formatDate,
  formatDateTime,
  formatISODate,
  getRelativeTime,
  isToday,
};
