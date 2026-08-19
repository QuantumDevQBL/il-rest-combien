import { calculerMicroEntreprise } from '../micro-entreprise';
import { InputsMicroEntreprise } from '../types';

/**
 * Tests de référence contre les simulateurs officiels.
 *
 * Les valeurs attendues se vérifient en deux passes :
 *   1. Simulateur auto-entrepreneur de l'Urssaf (cotisations sociales, CFP,
 *      versement libératoire)
 *   2. Simulateur d'impots.gouv.fr (impôt sur le revenu au barème progressif)
 *
 * Tant qu'une valeur attendue vaut null, le test correspondant est sauté.
 * Elle ne doit être renseignée qu'après validation manuelle sur les simulateurs.
 */

interface ValeursAttenduesCas {
  cotisationsSociales: number | null;
  cfp: number | null;
  totalScenarioBareme: number | null;
  versementLiberatoire: number | null;
  estEligibleVL: boolean | null;
  revenuNetDisponible: number | null;
}

export const VALEURS_ATTENDUES: Record<string, ValeursAttenduesCas> = {
  A: {
    cotisationsSociales: 12_800,
    cfp: 100,
    totalScenarioBareme: 3_004,
    versementLiberatoire: 1_100,
    estEligibleVL: true,
    revenuNetDisponible: 36_000,
  },
  B: {
    cotisationsSociales: 7_420,
    cfp: 70,
    totalScenarioBareme: 1_473,
    versementLiberatoire: 595,
    estEligibleVL: true,
    revenuNetDisponible: 26_037,
  },
  C: {
    cotisationsSociales: 9_840,
    cfp: 80,
    totalScenarioBareme: 956,
    versementLiberatoire: null,
    estEligibleVL: false,
    revenuNetDisponible: 69_124,
  },
  D: {
    cotisationsSociales: 5_120,
    cfp: 40,
    totalScenarioBareme: 0,
    versementLiberatoire: 440,
    estEligibleVL: true,
    revenuNetDisponible: 14_840,
  },
};

interface CasReference {
  nom: string;
  inputs: InputsMicroEntreprise;
  attendus: ValeursAttenduesCas;
}

const CAS: Record<string, CasReference> = {
  A: {
    nom: 'BNC — 50 000 € HT, célibataire, 0 enfant',
    inputs: {
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
    },
    attendus: VALEURS_ATTENDUES.A,
  },
  B: {
    nom: 'BIC prestation — 35 000 € HT, couple, 1 enfant',
    inputs: {
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
    },
    attendus: VALEURS_ATTENDUES.B,
  },
  C: {
    nom: 'BIC vente — 80 000 € HT, célibataire, 0 enfant',
    inputs: {
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
    },
    attendus: VALEURS_ATTENDUES.C,
  },
  D: {
    nom: 'BNC — 20 000 € HT, célibataire parent isolé, 2 enfants',
    inputs: {
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
      partsFiscalesN2: 3,
      moisDebutActivite: null,
    },
    attendus: VALEURS_ATTENDUES.D,
  },
};

function makeTest(
  label: string,
  valeurAttendue: number | boolean | null,
  valeurCalculee: number | boolean | null
) {
  if (valeurAttendue === null) {
    test.skip(label, () => {});
    return;
  }
  test(label, () => {
    expect(valeurCalculee).toBe(valeurAttendue);
  });
}

describe('Référence officielle — cas figés', () => {
  Object.entries(CAS).forEach(([cle, cas]) => {
    describe(`Cas ${cle} — ${cas.nom}`, () => {
      const result = calculerMicroEntreprise(cas.inputs);

      makeTest(
        'cotisations sociales',
        cas.attendus.cotisationsSociales,
        result.cotisationsSociales
      );
      makeTest('CFP', cas.attendus.cfp, result.cfp);
      makeTest(
        'IR au barème',
        cas.attendus.totalScenarioBareme,
        result.totalScenarioBareme
      );
      makeTest(
        'versement libératoire',
        cas.attendus.versementLiberatoire,
        result.versementLiberatoire
      );
      makeTest(
        'éligibilité VL',
        cas.attendus.estEligibleVL,
        result.estEligibleVL
      );
      makeTest(
        'revenu net disponible',
        cas.attendus.revenuNetDisponible,
        result.revenuNetDisponible
      );
    });
  });
});

describe('Référence officielle — résultats calculés par le moteur', () => {
  test('affiche le tableau des résultats', () => {
    const lignes = Object.entries(CAS).map(([cle, cas]) => {
      const r = calculerMicroEntreprise(cas.inputs);
      return {
        Cas: cle,
        CA: r.caAnnuelHT,
        Cotisations: r.cotisationsSociales,
        CFP: r.cfp,
        'Revenu abattu': r.revenuMicroAbattu,
        Parts: r.nbParts,
        'IR barème': r.totalScenarioBareme,
        VL: r.versementLiberatoire ?? '—',
        'Éligible VL': r.estEligibleVL,
        Scénario: r.scenarioLePlusFavorable,
        'Net dispo': r.revenuNetDisponible,
        'Reste/100': r.resteSurCent.toFixed(2),
      };
    });
    console.table(lignes);
  });
});
