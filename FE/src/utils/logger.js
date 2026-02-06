/**
 * Logger utility
 * Conditional logging based on environment
 */

import { isDevelopment } from '@/config/config';

const logger = {
  log: (...args) => {
    if (isDevelopment()) {
      console.log('[LOG]', ...args);
    }
  },

  info: (...args) => {
    if (isDevelopment()) {
      console.info('[INFO]', ...args);
    }
  },

  warn: (...args) => {
    if (isDevelopment()) {
      console.warn('[WARN]', ...args);
    }
  },

  error: (...args) => {
    // Always log errors in all environments
    console.error('[ERROR]', ...args);
  },

  debug: (...args) => {
    if (isDevelopment()) {
      console.debug('[DEBUG]', ...args);
    }
  },

  table: (data) => {
    if (isDevelopment()) {
      console.table(data);
    }
  },

  group: (label, ...args) => {
    if (isDevelopment()) {
      console.group(label);
      args.forEach((arg) => console.log(arg));
      console.groupEnd();
    }
  },
};

export default logger;
