/**
 * Design tokens — ResteClair.
 *
 * Direction "Clair & Vert" : fond clair slate-50, surfaces blanches,
 * accents emerald/teal, ombres douces neutres, typographie bold et aérée.
 */

import { TextStyle } from 'react-native';

export const colors = {
  // Fonds
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceGlass: 'rgba(255, 255, 255, 0.92)',

  // Encre
  ink: '#0F172A',
  inkSecondary: '#475569',
  inkTertiary: '#94A3B8',

  // Bordures
  border: 'rgba(15, 23, 42, 0.08)',
  borderFocused: 'rgba(16, 185, 129, 0.5)',

  // Accents
  primary: '#10B981',
  primaryLight: 'rgba(16, 185, 129, 0.12)',
  secondary: '#0D9488',
  secondaryLight: 'rgba(13, 148, 136, 0.12)',
  success: '#10B981',
  successLight: 'rgba(16, 185, 129, 0.12)',
  alert: '#F59E0B',
  alertLight: 'rgba(245, 158, 11, 0.12)',
  negative: '#EF4444',
  negativeLight: 'rgba(239, 68, 68, 0.12)',
  info: '#0D9488',

  // État
  disabled: '#E2E8F0',
  overlay: 'rgba(15, 23, 42, 0.5)',
} as const;

export const typography = {
  display: {
    fontSize: 56,
    fontWeight: '800' as const,
    lineHeight: 60,
    fontFamily: 'System',
    fontVariant: ['tabular-nums'] as TextStyle['fontVariant'],
  },
  hero: {
    fontSize: 42,
    fontWeight: '800' as const,
    lineHeight: 48,
    fontFamily: 'System',
    fontVariant: ['tabular-nums'] as TextStyle['fontVariant'],
  },
  h1: {
    fontSize: 26,
    fontWeight: '800' as const,
    lineHeight: 32,
    fontFamily: 'System',
  },
  h2: {
    fontSize: 20,
    fontWeight: '700' as const,
    lineHeight: 26,
    fontFamily: 'System',
  },
  h3: {
    fontSize: 16,
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
    fontSize: 11,
    fontWeight: '700' as const,
    lineHeight: 14,
    fontFamily: 'System',
    letterSpacing: 0.8,
    textTransform: 'uppercase' as const,
  },
  overline: {
    fontSize: 10,
    fontWeight: '800' as const,
    lineHeight: 12,
    fontFamily: 'System',
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
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
  xxl: 24,
  full: 9999,
} as const;

export const shadows = {
  sm: {
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 28,
    elevation: 10,
  },
  primaryGlow: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 8,
  },
} as const;
