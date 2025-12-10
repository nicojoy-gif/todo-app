// utils/constants.ts

export const COLORS = {
  primary: '#8B7355',
  primaryDark: '#6B5744',
  primaryLight: '#A89080',
  secondary: '#C49A8C',
  success: '#7C9885',
  warning: '#D4A574',
  error: '#B87C7C',
  background: '#F8F6F4',
  surface: '#FFFFFF',
  textPrimary: '#2C2420',
  textSecondary: '#6B6460',
  textLight: '#9C9691',
  border: '#E8E3DF',
  borderLight: '#F0EDE9',
  overlay: 'rgba(44, 36, 32, 0.5)',
  overlayLight: 'rgba(44, 36, 32, 0.3)',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const TYPOGRAPHY = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
};

export const SHADOWS = {
  small: {
    shadowColor: '#2C2420',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#2C2420',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#2C2420',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const MAX_TASKS = 50;

/**
 * COLOR PALETTE - Neutral Nude Theme
 * 
 * Primary (Warm Taupe): #8B7355 - Main brand color
 * Secondary (Soft Rose): #C49A8C - Accent color
 * Success (Sage Green): #7C9885 - Completed tasks
 * Warning (Golden): #D4A574 - Warnings
 * Error (Dusty Rose): #B87C7C - Errors, delete actions
 */