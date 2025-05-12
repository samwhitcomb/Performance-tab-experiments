import { useTheme } from '@/contexts/ThemeContext';

const lightColors = {
  // Primary
  primary: '#2B73DF',
  black: '#000000',
  white: '#FFFFFF',

  // Secondary
  secondary: {
    green: '#BCD879',
    lightGreen: '#DCF0A4',
    neonGreen: '#A3FC9C',
    indigo: '#6366f1',
  },

  // Neutral greys
  grey: {
    50: '#F7F7F7',
    100: '#E4E5E9',
    200: '#D3D5D9',
    300: '#AFB2B8',
    400: '#8D94A2',
    500: '#5C616B',
    600: '#323438',
  },

  // Status colors
  status: {
    success: '#22C55E',
    warning: '#F59E0B',
    info: '#5082BE',
    error: '#EF4444',
  },
};

const darkColors = {
  // Primary
  primary: '#4B93FF',
  black: '#FFFFFF',
  white: '#1A1A1A',

  // Secondary
  secondary: {
    green: '#8CA859',
    lightGreen: '#BCD084',
    neonGreen: '#83DC7C',
    indigo: '#8385f3',
  },

  // Neutral greys
  grey: {
    50: '#1A1A1A',
    100: '#2A2A2A',
    200: '#3A3A3A',
    300: '#4A4A4A',
    400: '#858585',
    500: '#A5A5A5',
    600: '#E5E5E5',
  },

  // Status colors
  status: {
    success: '#42E57E',
    warning: '#FFB52B',
    info: '#70A2DE',
    error: '#FF6464',
  },
};

// Typography
export const typography = {
  h1: {
    fontFamily: 'Barlow-Bold',
    fontSize: 32,
    lineHeight: 40,
  },
  h2: {
    fontFamily: 'Barlow-Bold',
    fontSize: 24,
    lineHeight: 32,
  },
  h3: {
    fontFamily: 'Barlow-SemiBold',
    fontSize: 20,
    lineHeight: 28,
  },
  h4: {
    fontFamily: 'Barlow-SemiBold',
    fontSize: 18,
    lineHeight: 24,
  },
  body1: {
    fontFamily: 'Barlow-Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  body2: {
    fontFamily: 'Barlow-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  button: {
    fontFamily: 'Barlow-Medium',
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    fontFamily: 'Barlow-Regular',
    fontSize: 12,
    lineHeight: 16,
  },
};

export function useColors() {
  const { isDark } = useTheme();
  return isDark ? darkColors : lightColors;
}

export const colors = lightColors; // Keep for backward compatibility