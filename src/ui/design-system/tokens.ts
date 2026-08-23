/**
 * Design tokens — Il reste combien.
 *
 * Direction "Midnight Fintech" : fond profond bleu-noir, accents cyan et violet,
 * surfaces étagées, glassmorphism subtil, ombres colorées diffuses, chiffres tabulaires.
 */

import { TextStyle } from 'react-native';

export const colors = {
  // Fonds
  background: '#0B0F19',
  surface: '#151B2B',
  surfaceElevated: '#1E2738',
  surfaceGlass: 'rgba(21, 27, 43, 0.85)',

  // Encre
  ink: '#F8FAFC',
  inkSecondary: '#94A3B8',
  inkTertiary: '#64748B',

  // Bordures
  border: 'rgba(148, 163, 184, 0.12)',
  borderFocused: 'rgba(0, 212, 255, 0.5)',

  // Accents
  primary: '#00D4FF',
  primaryLight: 'rgba(0, 212, 255, 0.15)',
  secondary: '#8B5CF6',
  secondaryLight: 'rgba(139, 92, 246, 0.15)',
  success: '#22C55E',
  successLight: 'rgba(34, 197, 94, 0.15)',
  alert: '#F97316',
  alertLight: 'rgba(249, 115, 22, 0.15)',
  negative: '#EF4444',
  negativeLight: 'rgba(239, 68, 68, 0.15)',
  info: '#00D4FF',

  // État
  disabled: '#3A3A3A',
  overlay: 'rgba(0, 0, 0, 0.75)',
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
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  md: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  lg: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 32,
    elevation: 12,
  },
  primaryGlow: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 24,
    elevation: 12,
  },
  secondaryGlow: {
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 12,
  },
} as const;
