import { Theme } from '../types';

export const getThemeColors = (theme: Theme) => {
  if (theme === 'dark') {
    return {
      primary: '#A89080',
      primaryDark: '#8B7355',
      primaryLight: '#C4AFA0',
      secondary: '#D4ADA0',
      success: '#8FAA9C',
      warning: '#E0B888',
      error: '#C89090',
      background: '#1C1815',
      surface: '#2C2420',
      textPrimary: '#F8F6F4',
      textSecondary: '#C4BCB6',
      textLight: '#9C9691',
      border: '#3C3430',
      borderLight: '#322C28',
      overlay: 'rgba(0, 0, 0, 0.7)',
      overlayLight: 'rgba(0, 0, 0, 0.5)',
    };
  }

  // Light theme (default)
  return {
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
};