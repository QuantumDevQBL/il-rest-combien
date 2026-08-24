/**
 * Design tokens — ResteClair Premium.
 *
 * Direction "Teal & Slate" : fond clair chaleureux, surfaces blanches,
 * accents teal profonds, ombres douces, typographie bold et aérée.
 * Optimisé pour une lisibilité premium sur mobile sans scroll.
 */

import { TextStyle } from 'react-native';

export const colors = {
  // Fonds
  background: '#F3F6F9',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceGlass: 'rgba(255, 255, 255, 0.92)',

  // Encre
  ink: '#0F172A',
  inkSecondary: '#475569',
  inkTertiary: '#94A3B8',

  // Bordures
  border: 'rgba(15, 23, 42, 0.07)',
  borderFocused: 'rgba(13, 148, 136, 0.5)',

  // Accents — teal premium
  primary: '#0D9488',
  primaryLight: 'rgba(13, 148, 136, 0.12)',
  primaryDark: '#0F766E',
  secondary: '#14B8A6',
  secondaryLight: 'rgba(20, 184, 166, 0.12)',
  success: '#10B981',
  successLight: 'rgba(16, 185, 129, 0.12)',
  alert: '#F59E0B',
  alertLight: 'rgba(245, 158, 11, 0.12)',
  negative: '#EF4444',
  negativeLight: 'rgba(239, 68, 68, 0.12)',
  info: '#0D9488',

  // État
  disabled: '#E2E8F0',
  overlay: 'rgba(2, 6, 23, 0.55)',
} as const;

export const typography = {
  display: {
    fontSize: 52,
    fontWeight: '800' as const,
    lineHeight: 56,
    fontFamily: 'System',
    fontVariant: ['tabular-nums'] as TextStyle['fontVariant'],
  },
  displaySmall: {
    fontSize: 42,
    fontWeight: '800' as const,
    lineHeight: 46,
    fontFamily: 'System',
    fontVariant: ['tabular-nums'] as TextStyle['fontVariant'],
  },
  hero: {
    fontSize: 36,
    fontWeight: '800' as const,
    lineHeight: 42,
    fontFamily: 'System',
    fontVariant: ['tabular-nums'] as TextStyle['fontVariant'],
  },
  h1: {
    fontSize: 24,
    fontWeight: '800' as const,
    lineHeight: 30,
    fontFamily: 'System',
  },
  h2: {
    fontSize: 18,
    fontWeight: '700' as const,
    lineHeight: 24,
    fontFamily: 'System',
  },
  h3: {
    fontSize: 15,
    fontWeight: '700' as const,
    lineHeight: 21,
    fontFamily: 'System',
  },
  body: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
    fontFamily: 'System',
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 17,
    fontFamily: 'System',
  },
  caption: {
    fontSize: 10,
    fontWeight: '700' as const,
    lineHeight: 13,
    fontFamily: 'System',
    letterSpacing: 0.7,
    textTransform: 'uppercase' as const,
  },
  overline: {
    fontSize: 10,
    fontWeight: '800' as const,
    lineHeight: 12,
    fontFamily: 'System',
    letterSpacing: 0.9,
    textTransform: 'uppercase' as const,
  },
  amount: {
    fontSize: 15,
    fontWeight: '800' as const,
    fontVariant: ['tabular-nums'] as TextStyle['fontVariant'],
    fontFamily: 'System',
  },
  amountLarge: {
    fontSize: 20,
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
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
  },
  lg: {
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 12,
  },
  primaryGlow: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 24,
    elevation: 10,
  },
} as const;

export const animation = {
  spring: {
    friction: 7,
    tension: 100,
    useNativeDriver: true,
  },
  springSoft: {
    friction: 8,
    tension: 70,
    useNativeDriver: true,
  },
  fadeIn: {
    duration: 450,
    translateY: 16,
  },
  stagger: {
    delay: 70,
  },
} as const;
