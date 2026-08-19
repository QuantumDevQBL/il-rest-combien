export const couleurs = {
  encre: '#16181D',
  encreFaible: '#5A6070',
  papier: '#FBFAF7',
  ligne: '#E3E1DB',
  ponction: '#8B3A2F',
  reste: '#1F6B4A',
  alerte: '#A8741A',
};

export const type = {
  compteur: {
    fontSize: 56,
    fontFamily: 'monospace',
    fontWeight: '300' as const,
  },
  montant: {
    fontSize: 17,
    fontFamily: 'monospace',
  },
  titre: {
    fontSize: 20,
    fontWeight: '600' as const,
  },
  corps: {
    fontSize: 15,
  },
  label: {
    fontSize: 13,
    color: couleurs.encreFaible,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
  },
  mention: {
    fontSize: 11,
    color: couleurs.encreFaible,
    lineHeight: 16,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};
