/**
 * Currency utilities
 * Common currency formatting functions
 */

/**
 * Format number as Vietnamese currency (VND)
 * @param {number} amount - Amount to format
 * @returns {string}
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

/**
 * Format number with thousand separators
 * @param {number} value - Number to format
 * @returns {string}
 */
export const formatNumber = (value) => {
  if (value === null || value === undefined) return '';
  return new Intl.NumberFormat('vi-VN').format(value);
};

/**
 * Parse formatted currency string to number
 * @param {string} value - Currency string to parse
 * @returns {number}
 */
export const parseCurrency = (value) => {
  if (!value) return 0;
  // Remove all non-numeric characters except minus sign
  const cleaned = String(value).replace(/[^\d-]/g, '');
  return parseInt(cleaned, 10) || 0;
};

/**
 * Format number as compact (e.g., 1K, 1M)
 * @param {number} value - Number to format
 * @returns {string}
 */
export const formatCompact = (value) => {
  if (value === null || value === undefined) return '';
  return new Intl.NumberFormat('vi-VN', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value);
};

export default {
  formatCurrency,
  formatNumber,
  parseCurrency,
  formatCompact,
};
