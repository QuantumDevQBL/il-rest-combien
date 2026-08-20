/**
 * Design tokens — Il reste combien.
 *
 * Direction premium : fond sombre, accents dorés, glassmorphism léger.
 * Toutes les valeurs visuelles sont centralisées ici.
 */

export const colors = {
  // Fonds
  background: '#0B1220',
  backgroundElevated: '#111827',
  surface: 'rgba(30, 41, 59, 0.85)',
  surfaceSolid: '#1E293B',
  surfaceSecondary: 'rgba(51, 65, 85, 0.6)',

  // Encre
  ink: '#F8FAFC',
  inkSecondary: '#CBD5E1',
  inkTertiary: '#94A3B8',

  // Bordures
  border: 'rgba(148, 163, 184, 0.2)',
  borderFocused: '#F5B700',

  // Accents
  primary: '#F5B700',
  primaryLight: '#FEF3C7',
  primaryDark: '#D97706',
  success: '#34D399',
  successLight: 'rgba(52, 211, 153, 0.15)',
  info: '#60A5FA',
  infoLight: 'rgba(96, 165, 250, 0.15)',
  negative: '#F87171',
  negativeLight: 'rgba(248, 113, 113, 0.15)',
  alert: '#FB923C',
  alertLight: 'rgba(251, 146, 60, 0.15)',

  // État
  disabled: '#475569',
  overlay: 'rgba(0, 0, 0, 0.6)',

  // Gradients
  gradientStart: '#F5B700',
  gradientEnd: '#F97316',
} as const;

import { TextStyle } from 'react-native';

export const typography = {
  display: {
    fontSize: 72,
    fontWeight: '800' as const,
    lineHeight: 80,
    fontFamily: 'System',
  },
  hero: {
    fontSize: 56,
    fontWeight: '800' as const,
    lineHeight: 64,
    fontFamily: 'System',
  },
  h1: {
    fontSize: 34,
    fontWeight: '800' as const,
    lineHeight: 40,
    fontFamily: 'System',
  },
  h2: {
    fontSize: 26,
    fontWeight: '700' as const,
    lineHeight: 32,
    fontFamily: 'System',
  },
  h3: {
    fontSize: 20,
    fontWeight: '700' as const,
    lineHeight: 26,
    fontFamily: 'System',
  },
  body: {
    fontSize: 17,
    fontWeight: '500' as const,
    lineHeight: 24,
    fontFamily: 'System',
  },
  bodySmall: {
    fontSize: 15,
    fontWeight: '500' as const,
    lineHeight: 22,
    fontFamily: 'System',
  },
  caption: {
    fontSize: 13,
    fontWeight: '700' as const,
    lineHeight: 18,
    fontFamily: 'System',
    letterSpacing: 0.3,
  },
  overline: {
    fontSize: 12,
    fontWeight: '800' as const,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
    fontFamily: 'System',
  },
  amount: {
    fontSize: 18,
    fontWeight: '800' as const,
    fontVariant: ['tabular-nums'] as TextStyle['fontVariant'],
    fontFamily: 'System',
  },
  amountLarge: {
    fontSize: 24,
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
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  full: 9999,
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 28,
    elevation: 12,
  },
  glow: {
    shadowColor: '#F5B700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
} as const;
