/**
 * Design tokens — Reste vraiment.
 *
 * Toutes les valeurs visuelles de l'application sont centralisées ici.
 * Aucune constante de couleur, d'espacement ou de rayon ne doit être écrite
 * en dur dans les composants.
 */

export const colors = {
  // Fonds
  background: '#FAFAF8',
  surface: '#FFFFFF',
  surfaceSecondary: '#F3F4F6',

  // Encre
  ink: '#111827',
  inkSecondary: '#4B5563',
  inkTertiary: '#9CA3AF',

  // Bordures
  border: '#E5E7EB',
  borderFocused: '#111827',

  // Accents
  primary: '#15803D',
  primaryLight: '#DCFCE7',
  negative: '#9F2B2B',
  negativeLight: '#FEE2E2',
  alert: '#B45309',
  alertLight: '#FEF3C7',
  info: '#1D4ED8',
  infoLight: '#DBEAFE',

  // État
  disabled: '#D1D5DB',
  overlay: 'rgba(17, 24, 39, 0.5)',
} as const;

import { TextStyle } from 'react-native';

export const typography = {
  hero: {
    fontSize: 56,
    fontWeight: '300' as const,
    lineHeight: 64,
    fontFamily: 'System',
  },
  h1: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 34,
    fontFamily: 'System',
  },
  h2: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 26,
    fontFamily: 'System',
  },
  h3: {
    fontSize: 17,
    fontWeight: '600' as const,
    lineHeight: 22,
    fontFamily: 'System',
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 22,
    fontFamily: 'System',
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    fontFamily: 'System',
  },
  caption: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
    fontFamily: 'System',
  },
  overline: {
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
    fontFamily: 'System',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600' as const,
    fontVariant: ['tabular-nums'] as TextStyle['fontVariant'],
    fontFamily: 'System',
  },
  amountLarge: {
    fontSize: 20,
    fontWeight: '700' as const,
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
  sm: 6,
  md: 10,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const shadows = {
  sm: {
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
} as const;
