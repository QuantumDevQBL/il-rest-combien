import { calculerMicroEntreprise } from '../micro-entreprise';
import { InputsMicroEntreprise } from '../types';

/**
 * Tests de référence croisée avec les simulateurs officiels.
 *
 * Valeurs attendues vérifiées sur :
 *   - simulateur Urssaf (auto-entrepreneur) pour les cotisations et le VL
 *   - simulateur impots.gouv.fr pour l'impôt sur le revenu
 *
 * Ces cas figent le modèle métier. Toute modification du moteur qui les fait
 * basculer doit être justifiée par une évolution réglementaire sourcée.
 */

describe('Référence croisée Urssaf / impots.gouv.fr', () => {
  it('Cas A — BNC libéral non réglementé, 50 000 € HT, célibataire', () => {
    const inputs: InputsMicroEntreprise = {
      activite: 'BNC',
      natureActivite: 'liberale',
      modeSaisieCA: 'DIRECT',
      caAnnuelHT: 50_000,
      tjm: null,
      joursFactures: null,
      chargesFixesAnnuelles: 0,
      situationFamiliale: 'celibataire',
      nbEnfants: 0,
      parentIsole: false,
      autresRevenusNetsImposablesFoyer: 0,
      rfrN2Foyer: 25_000,
      partsFiscalesN2: 1,
      moisDebutActivite: null,
    };

    const result = calculerMicroEntreprise(inputs);

    expect(result.cotisationsSociales).toBe(12_800);
    expect(result.cfp).toBe(100);
    expect(result.totalPrelevementsSociaux).toBe(12_900);
    expect(result.revenuMicroAbattu).toBeCloseTo(33_000, 2);
    expect(result.revenuImposableFoyer).toBeCloseTo(33_000, 2);
    expect(result.nbParts).toBe(1);
    expect(result.totalScenarioBareme).toBe(3_004);
    expect(result.versementLiberatoire).toBe(1_100);
    expect(result.totalScenarioVL).toBe(1_100);
    expect(result.estEligibleVL).toBe(true);
    expect(result.scenarioLePlusFavorable).toBe('VL');
    expect(result.ecartEuros).toBe(1_904);
    expect(result.revenuNetDisponible).toBe(36_000);
    expect(result.resteSurCent).toBeCloseTo(72.0, 1);
  });

  it('Cas B — BIC prestation (nature libérale), 35 000 € HT, couple, 1 enfant', () => {
    const inputs: InputsMicroEntreprise = {
      activite: 'BIC_PRESTATION',
      natureActivite: 'liberale',
      modeSaisieCA: 'DIRECT',
      caAnnuelHT: 35_000,
      tjm: null,
      joursFactures: null,
      chargesFixesAnnuelles: 0,
      situationFamiliale: 'couple',
      nbEnfants: 1,
      parentIsole: false,
      autresRevenusNetsImposablesFoyer: 30_000,
      rfrN2Foyer: 40_000,
      partsFiscalesN2: 2.5,
      moisDebutActivite: null,
    };

    const result = calculerMicroEntreprise(inputs);

    expect(result.cotisationsSociales).toBe(7_420);
    expect(result.cfp).toBe(70);
    expect(result.totalPrelevementsSociaux).toBe(7_490);
    expect(result.revenuMicroAbattu).toBeCloseTo(17_500, 2);
    expect(result.revenuImposableFoyer).toBeCloseTo(47_500, 2);
    expect(result.nbParts).toBe(2.5);
    expect(result.totalScenarioBareme).toBe(1_473);
    expect(result.versementLiberatoire).toBe(595);
    expect(result.totalScenarioVL).toBe(1_525);
    expect(result.estEligibleVL).toBe(true);
    expect(result.scenarioLePlusFavorable).toBe('BAREME');
    expect(result.ecartEuros).toBe(52);
    expect(result.revenuNetDisponible).toBe(26_037);
    expect(result.resteSurCent).toBeCloseTo(74.39, 1);
  });

  it('Cas C — BIC vente (nature commerciale), 80 000 € HT, célibataire', () => {
    const inputs: InputsMicroEntreprise = {
      activite: 'BIC_VENTE',
      natureActivite: 'commerciale',
      modeSaisieCA: 'DIRECT',
      caAnnuelHT: 80_000,
      tjm: null,
      joursFactures: null,
      chargesFixesAnnuelles: 0,
      situationFamiliale: 'celibataire',
      nbEnfants: 0,
      parentIsole: false,
      autresRevenusNetsImposablesFoyer: 0,
      rfrN2Foyer: 35_000,
      partsFiscalesN2: 1,
      moisDebutActivite: null,
    };

    const result = calculerMicroEntreprise(inputs);

    expect(result.cotisationsSociales).toBe(9_840);
    expect(result.cfp).toBe(80);
    expect(result.totalPrelevementsSociaux).toBe(9_920);
    expect(result.revenuMicroAbattu).toBeCloseTo(23_200, 2);
    expect(result.revenuImposableFoyer).toBeCloseTo(23_200, 2);
    expect(result.nbParts).toBe(1);
    expect(result.totalScenarioBareme).toBe(956);
    expect(result.versementLiberatoire).toBeNull();
    expect(result.totalScenarioVL).toBeNull();
    expect(result.estEligibleVL).toBe(false);
    expect(result.scenarioLePlusFavorable).toBe('BAREME');
    expect(result.ecartEuros).toBeNull();
    expect(result.revenuNetDisponible).toBe(69_124);
    expect(result.resteSurCent).toBeCloseTo(86.41, 1);
  });

  it('Cas D — BNC libéral non réglementé, 20 000 € HT, parent isolé, 2 enfants', () => {
    const inputs: InputsMicroEntreprise = {
      activite: 'BNC',
      natureActivite: 'liberale',
      modeSaisieCA: 'DIRECT',
      caAnnuelHT: 20_000,
      tjm: null,
      joursFactures: null,
      chargesFixesAnnuelles: 0,
      situationFamiliale: 'celibataire',
      nbEnfants: 2,
      parentIsole: true,
      autresRevenusNetsImposablesFoyer: 0,
      rfrN2Foyer: 15_000,
      partsFiscalesN2: 2.5,
      moisDebutActivite: null,
    };

    const result = calculerMicroEntreprise(inputs);

    expect(result.cotisationsSociales).toBe(5_120);
    expect(result.cfp).toBe(40);
    expect(result.totalPrelevementsSociaux).toBe(5_160);
    expect(result.revenuMicroAbattu).toBeCloseTo(13_200, 2);
    expect(result.revenuImposableFoyer).toBeCloseTo(13_200, 2);
    expect(result.nbParts).toBe(2.5);
    expect(result.totalScenarioBareme).toBe(0);
    expect(result.versementLiberatoire).toBe(440);
    expect(result.totalScenarioVL).toBe(440);
    expect(result.estEligibleVL).toBe(true);
    expect(result.scenarioLePlusFavorable).toBe('BAREME');
    expect(result.ecartEuros).toBe(440);
    expect(result.revenuNetDisponible).toBe(14_840);
    expect(result.resteSurCent).toBeCloseTo(74.2, 1);
  });
});
