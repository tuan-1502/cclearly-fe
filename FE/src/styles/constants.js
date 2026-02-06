/**
 * Style constants
 * Reusable style values for consistent design
 */

// Breakpoint values in pixels
export const BREAKPOINTS = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
};

// Z-index layers
export const Z_INDEX = {
  drawer: 1200,
  modal: 1300,
  snackbar: 1400,
  tooltip: 1500,
};

// Layout dimensions
export const LAYOUT = {
  headerHeight: 64,
  sidebarWidth: 240,
  sidebarCollapsedWidth: 64,
  footerHeight: 56,
};

// Animation durations (ms)
export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500,
};

export default {
  BREAKPOINTS,
  Z_INDEX,
  LAYOUT,
  ANIMATION,
};
