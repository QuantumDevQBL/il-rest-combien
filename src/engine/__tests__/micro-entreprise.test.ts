import { calculerCARequis } from '../inverse';
import {
  calculerEligibiliteVL,
  calculerMicroEntreprise,
  calculerNombreDeParts,
  comparerScenarios,
} from '../micro-entreprise';
import { InputsMicroEntreprise, ValidationError } from '../types';

function baseInputs(
  overrides: Partial<InputsMicroEntreprise> = {}
): InputsMicroEntreprise {
  return {
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
    rfrN2Foyer: null,
    partsFiscalesN2: null,
    moisDebutActivite: null,
    ...overrides,
  };
}

describe('Validation des entrées', () => {
  it('rejette un CA négatif', () => {
    expect(() => calculerMicroEntreprise(baseInputs({ caAnnuelHT: -1 }))).toThrow(
      ValidationError
    );
  });

  it('rejette un mode TJM sans TJM', () => {
    expect(() =>
      calculerMicroEntreprise(
        baseInputs({ modeSaisieCA: 'TJM', caAnnuelHT: null, joursFactures: 200 })
      )
    ).toThrow(ValidationError);
  });

  it('rejette un nombre de jours facturés supérieur à 366', () => {
    expect(() =>
      calculerMicroEntreprise(
        baseInputs({
          modeSaisieCA: 'TJM',
          caAnnuelHT: null,
          tjm: 500,
          joursFactures: 400,
        })
      )
    ).toThrow(ValidationError);
  });

  it('rejette un nombre d’enfants négatif', () => {
    expect(() =>
      calculerMicroEntreprise(baseInputs({ nbEnfants: -1 }))
    ).toThrow(ValidationError);
  });

  it('rejette un mois de début d’activité hors [1, 12]', () => {
    expect(() =>
      calculerMicroEntreprise(baseInputs({ moisDebutActivite: 13 }))
    ).toThrow(ValidationError);
  });

  it('rejette des parts fiscales N-2 négatives ou nulles', () => {
    expect(() =>
      calculerMicroEntreprise(baseInputs({ partsFiscalesN2: 0 }))
    ).toThrow(ValidationError);
  });
});

describe('Détermination du CA', () => {
  it('calcule le CA à partir du TJM et des jours facturés', () => {
    const result = calculerMicroEntreprise(
      baseInputs({
        modeSaisieCA: 'TJM',
        caAnnuelHT: null,
        tjm: 600,
        joursFactures: 150,
      })
    );
    expect(result.caAnnuelHT).toBe(90_000);
  });
});

describe('calculerNombreDeParts', () => {
  it('attribue 1 part à un célibataire sans enfant', () => {
    expect(calculerNombreDeParts('celibataire', 0, false)).toBe(1);
  });

  it('attribue 2 parts à un couple sans enfant', () => {
    expect(calculerNombreDeParts('couple', 0, false)).toBe(2);
  });

  it('attribue 2,5 parts à un couple avec 1 enfant', () => {
    expect(calculerNombreDeParts('couple', 1, false)).toBe(2.5);
  });

  it('ajoute 0,5 part par enfant pour les deux premiers', () => {
    expect(calculerNombreDeParts('couple', 2, false)).toBe(3);
  });

  it('ajoute 1 part à partir du troisième enfant', () => {
    expect(calculerNombreDeParts('couple', 3, false)).toBe(4);
  });

  it('attribue 2 parts à un parent isolé avec 1 enfant', () => {
    expect(calculerNombreDeParts('celibataire', 1, true)).toBe(2);
  });

  it('attribue 2,5 parts à un parent isolé avec 2 enfants', () => {
    expect(calculerNombreDeParts('celibataire', 2, true)).toBe(2.5);
  });

  it('n’attribue pas de part parent isolé à un couple', () => {
    expect(calculerNombreDeParts('couple', 1, true)).toBe(2.5);
  });

  it('n’attribue pas de part parent isolé sans enfant', () => {
    expect(calculerNombreDeParts('celibataire', 0, true)).toBe(1);
  });
});

describe('calculerEligibiliteVL', () => {
  it('retourne null si le RFR N-2 n’est pas renseigné', () => {
    expect(calculerEligibiliteVL(null, null, 1)).toBeNull();
  });

  it('retourne true si RFR <= seuil × parts', () => {
    expect(calculerEligibiliteVL(29_315, null, 1)).toBe(true);
  });

  it('retourne false si RFR dépasse le seuil × parts', () => {
    expect(calculerEligibiliteVL(29_316, null, 1)).toBe(false);
  });

  it('utilise partsFiscalesN2 quand fourni', () => {
    // RFR 60 000 €, parts courantes = 1 → non éligible
    // parts N-2 = 2,5 → seuil = 73 287,5 € → éligible
    expect(calculerEligibiliteVL(60_000, null, 1)).toBe(false);
    expect(calculerEligibiliteVL(60_000, 2.5, 1)).toBe(true);
  });

  it('fonctionne avec des demi-parts', () => {
    // Seuil pour 1,5 parts = 29 315 × 1,5 = 43 972,50 €
    expect(calculerEligibiliteVL(43_972, 1.5, 1)).toBe(true);
    expect(calculerEligibiliteVL(43_973, 1.5, 1)).toBe(false);
  });
});

describe('comparerScenarios', () => {
  it('calcule le barème progressif et le VL', () => {
    const result = comparerScenarios(
      40_000,
      'BNC',
      40_000 * (1 - 0.34),
      1,
      1,
      'celibataire',
      0,
      true
    );
    expect(result.versementLiberatoire).toBe(Math.round(40_000 * 0.022));
    expect(result.impotAutresRevenus).toBe(0);
    expect(result.totalScenarioVL).toBe(Math.round(40_000 * 0.022));
    expect(result.totalScenarioBareme).toBeGreaterThan(0);
  });

  it('applique le taux effectif sur les autres revenus en cas de VL', () => {
    const revenuMicroAbattu = 40_000 * (1 - 0.34);
    const revenuFoyer = revenuMicroAbattu + 30_000;
    const result = comparerScenarios(
      40_000,
      'BNC',
      revenuFoyer,
      1,
      1,
      'celibataire',
      30_000,
      true
    );

    expect(result.versementLiberatoire).toBe(Math.round(40_000 * 0.022));
    expect(result.impotAutresRevenus).toBeGreaterThan(0);
    expect(result.totalScenarioVL).toBe(
      result.versementLiberatoire! + result.impotAutresRevenus
    );
  });
});

describe('calculerMicroEntreprise - intégration', () => {
  it('retourne des zéros pour un CA nul', () => {
    const result = calculerMicroEntreprise(baseInputs({ caAnnuelHT: 0 }));
    expect(result.totalPrelevementsSociaux).toBe(0);
    expect(result.totalScenarioBareme).toBe(0);
    expect(result.revenuNetDisponible).toBe(0);
    expect(result.resteSurCent).toBe(100);
  });

  it('n’applique pas de cotisation minimale pour un CA nul', () => {
    const result = calculerMicroEntreprise(baseInputs({ caAnnuelHT: 0 }));
    expect(result.cotisationsSociales).toBe(0);
    expect(result.cfp).toBe(0);
  });

  it('calcule l’abattement BNC à 34 %', () => {
    const result = calculerMicroEntreprise(baseInputs({ caAnnuelHT: 50_000 }));
    expect(result.revenuMicroAbattu).toBeCloseTo(50_000 * (1 - 0.34), 2);
  });

  it('calcule les cotisations BIC prestation avec CFP libérale', () => {
    const result = calculerMicroEntreprise(
      baseInputs({
        activite: 'BIC_PRESTATION',
        natureActivite: 'liberale',
        caAnnuelHT: 50_000,
      })
    );
    expect(result.cotisationsSociales).toBe(Math.round(50_000 * 0.212));
    expect(result.cfp).toBe(Math.round(50_000 * 0.002));
  });

  it('calcule les cotisations BIC prestation avec CFP commerciale', () => {
    const result = calculerMicroEntreprise(
      baseInputs({
        activite: 'BIC_PRESTATION',
        natureActivite: 'commerciale',
        caAnnuelHT: 50_000,
      })
    );
    expect(result.cfp).toBe(Math.round(50_000 * 0.001));
  });

  it('les charges fixes ne touchent que le revenu net disponible', () => {
    const sansCharges = calculerMicroEntreprise(baseInputs({ chargesFixesAnnuelles: 0 }));
    const avecCharges = calculerMicroEntreprise(
      baseInputs({ chargesFixesAnnuelles: 10_000 })
    );

    expect(avecCharges.totalPrelevementsSociaux).toBe(
      sansCharges.totalPrelevementsSociaux
    );
    expect(avecCharges.totalScenarioBareme).toBe(sansCharges.totalScenarioBareme);
    expect(avecCharges.revenuNetDisponible).toBe(
      sansCharges.revenuNetDisponible - 10_000
    );
  });

  it('sélectionne le VL quand il est plus favorable', () => {
    const result = calculerMicroEntreprise(
      baseInputs({ caAnnuelHT: 80_000, rfrN2Foyer: 20_000 })
    );

    expect(result.estEligibleVL).toBe(true);
    expect(result.scenarioLePlusFavorable).toBe('VL');
    expect(result.ecartEuros).toBeGreaterThan(0);
  });

  it('reste au barème quand le VL n’est pas éligible', () => {
    const result = calculerMicroEntreprise(baseInputs({ caAnnuelHT: 30_000 }));

    expect(result.estEligibleVL).toBeNull();
    expect(result.scenarioLePlusFavorable).toBe('BAREME');
    expect(result.ecartEuros).toBeNull();
    expect(result.versementLiberatoire).toBeNull();
  });

  it('ne rend pas inéligible au VL le dépassement du plafond micro', () => {
    const result = calculerMicroEntreprise(
      baseInputs({ activite: 'BNC', caAnnuelHT: 90_000, rfrN2Foyer: 20_000 })
    );

    expect(result.depassePlafondMicro).toBe(true);
    expect(result.estEligibleVL).toBe(true);
  });

  it('calcule le taux de prélèvement global et le reste sur 100 €', () => {
    const result = calculerMicroEntreprise(baseInputs({ caAnnuelHT: 50_000 }));
    expect(result.tauxPrelevementGlobal).toBeGreaterThan(0);
    expect(result.resteSurCent).toBe(
      100 * (1 - result.tauxPrelevementGlobal)
    );
  });

  it('calcule le prorata année 1', () => {
    const result = calculerMicroEntreprise(
      baseInputs({ caAnnuelHT: 50_000, moisDebutActivite: 6 })
    );

    expect(result.plafondProratise).toBeCloseTo(
      83_600 * (214 / 365),
      2
    );
    expect(result.seuilTVAProratise).toBeCloseTo(
      37_500 * (214 / 365),
      2
    );
  });

  it('signale le dépassement du seuil de base TVA', () => {
    const result = calculerMicroEntreprise(
      baseInputs({
        activite: 'BIC_PRESTATION',
        natureActivite: 'liberale',
        caAnnuelHT: 40_000,
      })
    );
    expect(result.depasseSeuilBaseTVA).toBe(true);
    expect(result.depasseSeuilMajoreTVA).toBe(false);
  });

  it('signale le dépassement du plafond micro au-delà de 1 €', () => {
    const justeAvant = calculerMicroEntreprise(
      baseInputs({ activite: 'BNC', caAnnuelHT: 83_600 })
    );
    const justeApres = calculerMicroEntreprise(
      baseInputs({ activite: 'BNC', caAnnuelHT: 83_601 })
    );

    expect(justeAvant.depassePlafondMicro).toBe(false);
    expect(justeApres.depassePlafondMicro).toBe(true);
  });

  it('signale le dépassement du plafond micro vente au-delà de 1 €', () => {
    const justeAvant = calculerMicroEntreprise(
      baseInputs({
        activite: 'BIC_VENTE',
        natureActivite: 'commerciale',
        caAnnuelHT: 203_100,
      })
    );
    const justeApres = calculerMicroEntreprise(
      baseInputs({
        activite: 'BIC_VENTE',
        natureActivite: 'commerciale',
        caAnnuelHT: 203_101,
      })
    );

    expect(justeAvant.depassePlafondMicro).toBe(false);
    expect(justeApres.depassePlafondMicro).toBe(true);
  });
});

describe('calculerCARequis - calcul inverse', () => {
  it('retourne un CA proche de celui qui génère le net visé', () => {
    const inputs = baseInputs({ caAnnuelHT: 50_000, rfrN2Foyer: 20_000 });
    const resultatDirect = calculerMicroEntreprise(inputs);
    const netVise = resultatDirect.revenuNetDisponible;

    const { caRequis } = calculerCARequis(
      netVise,
      {
        activite: inputs.activite,
        natureActivite: inputs.natureActivite,
        chargesFixesAnnuelles: inputs.chargesFixesAnnuelles,
        situationFamiliale: inputs.situationFamiliale,
        nbEnfants: inputs.nbEnfants,
        parentIsole: inputs.parentIsole,
        autresRevenusNetsImposablesFoyer: inputs.autresRevenusNetsImposablesFoyer,
        rfrN2Foyer: inputs.rfrN2Foyer,
        partsFiscalesN2: inputs.partsFiscalesN2,
        moisDebutActivite: inputs.moisDebutActivite,
      },
      150
    );

    const resultatInverse = calculerMicroEntreprise({
      ...inputs,
      modeSaisieCA: 'DIRECT',
      caAnnuelHT: caRequis,
      tjm: null,
      joursFactures: null,
    });
    expect(
      Math.abs(resultatInverse.revenuNetDisponible - netVise)
    ).toBeLessThan(1);
  });

  it('calcule le TJM associé si les jours facturés sont fournis', () => {
    const { caRequis, tjm } = calculerCARequis(
      30_000,
      {
        activite: 'BNC',
        natureActivite: 'liberale',
        chargesFixesAnnuelles: 0,
        situationFamiliale: 'celibataire',
        nbEnfants: 0,
        parentIsole: false,
        autresRevenusNetsImposablesFoyer: 0,
        rfrN2Foyer: null,
        partsFiscalesN2: null,
        moisDebutActivite: null,
      },
      200
    );

    expect(tjm).toBeCloseTo(caRequis / 200, 2);
  });
});
