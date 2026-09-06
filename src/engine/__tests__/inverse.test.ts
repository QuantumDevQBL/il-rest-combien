import { UnreachableTargetError, calculerCARequis } from '../inverse';

jest.mock('../micro-entreprise', () => ({
  calculerMicroEntreprise: jest.fn(() => ({ revenuNetDisponible: 0 })),
}));

const baseInputs = {
  activite: 'BNC' as const,
  natureActivite: 'liberale' as const,
  chargesFixesAnnuelles: 0,
  situationFamiliale: 'celibataire' as const,
  nbEnfants: 0,
  parentIsole: false,
  autresRevenusNetsImposablesFoyer: 0,
  rfrN2Foyer: null,
  partsFiscalesN2: null,
  moisDebutActivite: null,
};

describe('calculerCARequis - detection d\'echec', () => {
  it('leve UnreachableTargetError si le net vise reste hors de portee apres elargissement des bornes', () => {
    expect(() => calculerCARequis(50_000, baseInputs)).toThrow(UnreachableTargetError);
  });
});
