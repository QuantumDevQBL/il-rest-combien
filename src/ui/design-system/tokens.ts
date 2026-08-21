/**
 * Design tokens — Il reste combien.
 *
 * Direction premium mobile : fond quasi-noir, accents or et bleu électrique,
 * surfaces étagées, ombres subtiles, chiffres tabulaires.
 */

import { TextStyle } from 'react-native';

export const colors = {
  // Fonds
  background: '#050505',
  surface: '#121212',
  surfaceElevated: '#1E1E1E',

  // Encre
  ink: '#FFFFFF',
  inkSecondary: '#B0B0B0',
  inkTertiary: '#6E6E6E',

  // Bordures
  border: 'rgba(255, 255, 255, 0.08)',
  borderFocused: 'rgba(255, 215, 0, 0.6)',

  // Accents
  primary: '#FFD700',
  primaryLight: 'rgba(255, 215, 0, 0.14)',
  secondary: '#00D4FF',
  secondaryLight: 'rgba(0, 212, 255, 0.14)',
  success: '#00E676',
  successLight: 'rgba(0, 230, 118, 0.14)',
  alert: '#FFB300',
  alertLight: 'rgba(255, 179, 0, 0.14)',
  negative: '#EF4444',
  negativeLight: 'rgba(239, 68, 68, 0.14)',
  info: '#00D4FF',

  // État
  disabled: '#3A3A3A',
  overlay: 'rgba(0, 0, 0, 0.65)',
} as const;

export const typography = {
  display: {
    fontSize: 64,
    fontWeight: '800' as const,
    lineHeight: 70,
    fontFamily: 'System',
    fontVariant: ['tabular-nums'] as TextStyle['fontVariant'],
  },
  hero: {
    fontSize: 48,
    fontWeight: '800' as const,
    lineHeight: 54,
    fontFamily: 'System',
    fontVariant: ['tabular-nums'] as TextStyle['fontVariant'],
  },
  h1: {
    fontSize: 28,
    fontWeight: '800' as const,
    lineHeight: 34,
    fontFamily: 'System',
  },
  h2: {
    fontSize: 22,
    fontWeight: '700' as const,
    lineHeight: 28,
    fontFamily: 'System',
  },
  h3: {
    fontSize: 17,
    fontWeight: '700' as const,
    lineHeight: 22,
    fontFamily: 'System',
  },
  body: {
    fontSize: 15,
    fontWeight: '600' as const,
    lineHeight: 21,
    fontFamily: 'System',
  },
  bodySmall: {
    fontSize: 13,
    fontWeight: '500' as const,
    lineHeight: 18,
    fontFamily: 'System',
  },
  caption: {
    fontSize: 12,
    fontWeight: '700' as const,
    lineHeight: 16,
    fontFamily: 'System',
    letterSpacing: 0.3,
  },
  overline: {
    fontSize: 11,
    fontWeight: '800' as const,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
    fontFamily: 'System',
  },
  amount: {
    fontSize: 16,
    fontWeight: '800' as const,
    fontVariant: ['tabular-nums'] as TextStyle['fontVariant'],
    fontFamily: 'System',
  },
  amountLarge: {
    fontSize: 22,
    fontWeight: '800' as const,
    fontVariant: ['tabular-nums'] as TextStyle['fontVariant'],
    fontFamily: 'System',
  },
};

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 10,
  },
} as const;
