/**
 * Application configuration
 * Reads from environment variables with fallbacks
 */

/**
 * @typedef {Object} Config
 * @property {string} apiUrl - Base URL for API requests
 * @property {string} environment - Current environment (development/production/test)
 * @property {boolean} enableLogger - Whether logging is enabled
 */

/**
 * Get application configuration
 * @returns {Config}
 */
const getConfig = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
  const environment = import.meta.env.VITE_APP_ENV || 'development';
  const enableLogger = import.meta.env.VITE_ENABLE_LOGGER === 'true';

  // Validate required environment variables
  if (!apiUrl) {
    console.warn(
      '⚠️  VITE_API_URL is not set, using default: http://localhost:8080'
    );
  }

  return {
    apiUrl,
    environment,
    enableLogger,
  };
};

export const config = getConfig();

// Helper functions
export const isDevelopment = () => config.environment === 'development';
export const isProduction = () => config.environment === 'production';
export const isTest = () => config.environment === 'test';

export default config;
