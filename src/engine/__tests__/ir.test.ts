import { arrondiEuro } from '../arrondi';
import { calculerIR } from '../ir';

describe('arrondiEuro', () => {
  it('arrondit à l’euro le plus proche', () => {
    expect(arrondiEuro(12.4)).toBe(12);
    expect(arrondiEuro(12.5)).toBe(13);
    expect(arrondiEuro(12.6)).toBe(13);
  });

  it('retourne 0 pour une entrée nulle ou négative', () => {
    expect(arrondiEuro(0)).toBe(0);
    expect(arrondiEuro(-5)).toBe(0);
  });
});

describe('calculerIR - barème progressif', () => {
  it('retourne 0 sous le seuil de la 1re tranche', () => {
    expect(calculerIR(11_600, 1, 1, 'celibataire')).toBe(0);
  });

  it('calcule l’IR dans la 2e tranche (arrondi à l’euro)', () => {
    // Revenu 31 000 €, 1 part → IR brut 2 404,20 €, pas de décote
    expect(calculerIR(31_000, 1, 1, 'celibataire')).toBe(2_404);
  });

  it('calcule l’IR à la limite de la 3e tranche', () => {
    // Revenu 84 577 €, 1 part → IR 18 477,09 €
    expect(calculerIR(84_577, 1, 1, 'celibataire')).toBe(18_477);
  });
});

describe('calculerIR - décote', () => {
  it('applique la décote pour un IR modéré (célibataire)', () => {
    // Revenu 25 000 €, 1 part → IR brut 902 €, après décote ≈ 1 244 €
    expect(calculerIR(25_000, 1, 1, 'celibataire')).toBe(1_244);
  });

  it('n’applique pas la décote au-dessus du seuil', () => {
    // Revenu 31 000 €, 1 part → IR 2 404 € (> 1 982 €)
    expect(calculerIR(31_000, 1, 1, 'celibataire')).toBe(2_404);
  });
});

describe('calculerIR - plafonnement du quotient familial', () => {
  it('ne plafonne pas quand l’avantage est inférieur au plafond', () => {
    // Couple + 1 enfant (2,5 parts), revenu 50 000 €
    expect(calculerIR(50_000, 2.5, 2, 'couple')).toBe(1_872);
  });

  it('plafonne quand l’avantage dépasse le plafond', () => {
    // Couple + 2 enfants (3 parts), revenu 100 000 €
    expect(calculerIR(100_000, 3, 2, 'couple')).toBe(12_594);
  });
});

describe('calculerIR - parent isolé', () => {
  it('attribue une part supplémentaire au parent isolé', () => {
    // Célibataire + 1 enfant + parent isolé = 2 parts
    // Sans parent isolé = 1,5 parts
    const avecParentIsole = calculerIR(30_000, 2, 1, 'celibataire');
    const sansParentIsole = calculerIR(30_000, 1.5, 1, 'celibataire');
    expect(avecParentIsole).toBeLessThan(sansParentIsole);
  });
});
