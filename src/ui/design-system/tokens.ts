/**
 * Design tokens — Il reste combien.
 *
 * Toutes les valeurs visuelles de l'application sont centralisées ici.
 * Aucune constante de couleur, d'espacement ou de rayon ne doit être écrite
 * en dur dans les composants.
 */

export const colors = {
  // Fonds
  background: '#E8F5E9',
  surface: '#FFFFFF',
  surfaceSecondary: '#F0FDF4',

  // Encre
  ink: '#0F172A',
  inkSecondary: '#475569',
  inkTertiary: '#94A3B8',

  // Bordures
  border: '#E2E8F0',
  borderFocused: '#059669',

  // Accents
  primary: '#059669',
  primaryLight: '#D1FAE5',
  primaryDark: '#047857',
  secondary: '#F97316',
  secondaryLight: '#FFEDD5',
  tertiary: '#7C3AED',
  tertiaryLight: '#EDE9FE',
  negative: '#DC2626',
  negativeLight: '#FEE2E2',
  alert: '#D97706',
  alertLight: '#FEF3C7',
  info: '#2563EB',
  infoLight: '#DBEAFE',

  // État
  disabled: '#CBD5E1',
  overlay: 'rgba(15, 23, 42, 0.5)',
} as const;

import { TextStyle } from 'react-native';

export const typography = {
  hero: {
    fontSize: 64,
    fontWeight: '700' as const,
    lineHeight: 72,
    fontFamily: 'System',
  },
  h1: {
    fontSize: 32,
    fontWeight: '800' as const,
    lineHeight: 38,
    fontFamily: 'System',
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 30,
    fontFamily: 'System',
  },
  h3: {
    fontSize: 18,
    fontWeight: '700' as const,
    lineHeight: 24,
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
    fontWeight: '600' as const,
    lineHeight: 16,
    fontFamily: 'System',
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
    fontWeight: '700' as const,
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
  lg: 20,
  xl: 28,
  full: 9999,
} as const;

export const shadows = {
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  lg: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
} as const;
