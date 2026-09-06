import {
  ABATTEMENT_MICRO_BIC_PRESTATION,
  ABATTEMENT_MICRO_BIC_VENTE,
  ABATTEMENT_MICRO_BNC,
  PLAFOND_MICRO_BIC_PRESTATION,
  PLAFOND_MICRO_BNC,
  PLAFOND_MICRO_BIC_VENTE,
  SEUIL_VERSEMENT_LIBERATOIRE_RFR_2026,
  TVA_FRANCHISE_BASE_PRESTATION,
  TVA_FRANCHISE_BASE_VENTE,
  VERSEMENT_LIBERATOIRE_BIC_PRESTATION,
  VERSEMENT_LIBERATOIRE_BIC_VENTE,
  VERSEMENT_LIBERATOIRE_BNC,
} from '../data/baremes-2026';
export { calculerCARequis, UnreachableTargetError } from './inverse';

import { arrondiEuro } from './arrondi';
import { calculerPrelevementsSociaux } from './cotisations';
import { calculerIR } from './ir';
import {
  ActiviteMicro,
  InputsMicroEntreprise,
  ResultatMicro,
  ScenarioLePlusFavorable,
  SituationFamiliale,
  ValidationError,
} from './types';

const ABATTEMENTS: Record<ActiviteMicro, number> = {
  BIC_VENTE: ABATTEMENT_MICRO_BIC_VENTE,
  BIC_PRESTATION: ABATTEMENT_MICRO_BIC_PRESTATION,
  BNC: ABATTEMENT_MICRO_BNC,
  CIPAV: ABATTEMENT_MICRO_BNC,
};

const TAUX_VL: Record<ActiviteMicro, number> = {
  BIC_VENTE: VERSEMENT_LIBERATOIRE_BIC_VENTE,
  BIC_PRESTATION: VERSEMENT_LIBERATOIRE_BIC_PRESTATION,
  BNC: VERSEMENT_LIBERATOIRE_BNC,
  CIPAV: VERSEMENT_LIBERATOIRE_BNC,
};

const PLAFONDS_MICRO: Record<ActiviteMicro, { plafond: number }> = {
  BIC_VENTE: PLAFOND_MICRO_BIC_VENTE,
  BIC_PRESTATION: PLAFOND_MICRO_BIC_PRESTATION,
  BNC: PLAFOND_MICRO_BNC,
  CIPAV: PLAFOND_MICRO_BNC,
};

const SEUILS_TVA: Record<ActiviteMicro, { seuilBase: number; seuilMajore: number }> = {
  BIC_VENTE: TVA_FRANCHISE_BASE_VENTE,
  BIC_PRESTATION: TVA_FRANCHISE_BASE_PRESTATION,
  BNC: TVA_FRANCHISE_BASE_PRESTATION,
  CIPAV: TVA_FRANCHISE_BASE_PRESTATION,
};

const JOURS_PAR_MOIS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function calculerJoursActivite(moisDebut: number): number {
  let jours = 0;
  for (let i = moisDebut - 1; i < 12; i++) {
    jours += JOURS_PAR_MOIS[i];
  }
  return jours;
}

function validerEntrees(inputs: InputsMicroEntreprise): number {
  const {
    modeSaisieCA,
    caAnnuelHT,
    tjm,
    joursFactures,
    chargesFixesAnnuelles,
    nbEnfants,
    autresRevenusNetsImposablesFoyer,
    rfrN2Foyer,
    partsFiscalesN2,
    moisDebutActivite,
  } = inputs;

  if (
    modeSaisieCA === 'DIRECT' &&
    (caAnnuelHT === null || !Number.isFinite(caAnnuelHT) || caAnnuelHT < 0)
  ) {
    throw new ValidationError(
      'caAnnuelHT',
      'Le chiffre d\'affaires annuel est requis en mode DIRECT et doit être positif ou nul.'
    );
  }

  if (modeSaisieCA === 'TJM') {
    if (tjm === null || !Number.isFinite(tjm) || tjm < 0) {
      throw new ValidationError('tjm', 'Le TJM est requis en mode TJM et doit être positif ou nul.');
    }
    if (
      joursFactures === null ||
      !Number.isFinite(joursFactures) ||
      joursFactures < 0 ||
      joursFactures > 366
    ) {
      throw new ValidationError(
        'joursFactures',
        'Le nombre de jours facturés est requis et doit être compris entre 0 et 366.'
      );
    }
  }

  if (!Number.isFinite(chargesFixesAnnuelles) || chargesFixesAnnuelles < 0) {
    throw new ValidationError(
      'chargesFixesAnnuelles',
      'Les charges fixes doivent être positives ou nulles.'
    );
  }

  if (!Number.isFinite(nbEnfants) || nbEnfants < 0 || !Number.isInteger(nbEnfants)) {
    throw new ValidationError(
      'nbEnfants',
      'Le nombre d\'enfants doit être un entier positif ou nul.'
    );
  }

  if (!Number.isFinite(autresRevenusNetsImposablesFoyer) || autresRevenusNetsImposablesFoyer < 0) {
    throw new ValidationError(
      'autresRevenusNetsImposablesFoyer',
      'Les autres revenus du foyer doivent être positifs ou nuls.'
    );
  }

  if (rfrN2Foyer !== null && (!Number.isFinite(rfrN2Foyer) || rfrN2Foyer < 0)) {
    throw new ValidationError('rfrN2Foyer', 'Le RFR N-2 doit être positif ou nul.');
  }

  if (partsFiscalesN2 !== null && (!Number.isFinite(partsFiscalesN2) || partsFiscalesN2 <= 0)) {
    throw new ValidationError(
      'partsFiscalesN2',
      'Le nombre de parts fiscales N-2 doit être strictement positif.'
    );
  }

  if (
    moisDebutActivite !== null &&
    (!Number.isInteger(moisDebutActivite) || moisDebutActivite < 1 || moisDebutActivite > 12)
  ) {
    throw new ValidationError(
      'moisDebutActivite',
      'Le mois de début d\'activité doit être compris entre 1 et 12.'
    );
  }

  return modeSaisieCA === 'DIRECT' ? caAnnuelHT! : tjm! * joursFactures!;
}

/**
 * Calcule le nombre de parts fiscales du foyer pour l'année courante.
 *
 * Règles :
 * - parts de base : 1 (célibataire) ou 2 (couple)
 * - enfants : 0,5 part chacun pour les 2 premiers, 1 part à partir du 3e
 * - parent isolé (case T) : demi-part supplémentaire pour un célibataire
 *   vivant seul avec au moins un enfant à charge
 */
export function calculerNombreDeParts(
  situationFamiliale: SituationFamiliale,
  nbEnfants: number,
  parentIsole: boolean
): number {
  const partsBase = situationFamiliale === 'couple' ? 2 : 1;

  let partsEnfants = 0;
  const enfantsComptes = Math.max(0, Math.floor(nbEnfants));

  for (let i = 0; i < enfantsComptes; i++) {
    partsEnfants += i < 2 ? 0.5 : 1;
  }

  const partsParentIsole =
    parentIsole && situationFamiliale === 'celibataire' && enfantsComptes > 0
      ? 0.5
      : 0;

  return partsBase + partsEnfants + partsParentIsole;
}

/**
 * Détermine l'éligibilité au versement libératoire.
 *
 * Condition : RFR N-2 du foyer <= 29 315 € × nombre de parts fiscales N-2.
 *
 * @param rfrN2Foyer - RFR du foyer N-2.
 * @param partsFiscalesN2 - Nombre de parts fiscales du foyer N-2. Peut être null.
 * @param partsFiscalesCourantes - Fallback si partsFiscalesN2 n'est pas renseigné.
 * @returns true si éligible, false si non éligible, null si inconnu.
 */
export function calculerEligibiliteVL(
  rfrN2Foyer: number | null,
  partsFiscalesN2: number | null,
  partsFiscalesCourantes: number
): boolean | null {
  if (rfrN2Foyer === null) {
    return null;
  }

  const partsPourRFR = partsFiscalesN2 ?? partsFiscalesCourantes;
  const seuilRFR = SEUIL_VERSEMENT_LIBERATOIRE_RFR_2026 * partsPourRFR;

  return rfrN2Foyer <= seuilRFR;
}

export interface ScenariosResult {
  totalScenarioBareme: number;
  versementLiberatoire: number | null;
  impotAutresRevenus: number;
  totalScenarioVL: number | null;
}

export function comparerScenarios(
  caAnnuelHT: number,
  activite: ActiviteMicro,
  revenuImposableFoyer: number,
  nbParts: number,
  partsBase: number,
  situationFamiliale: SituationFamiliale,
  autresRevenusNetsImposablesFoyer: number,
  estEligibleVL: boolean | null
): ScenariosResult {
  const totalScenarioBareme = calculerIR(
    revenuImposableFoyer,
    nbParts,
    partsBase,
    situationFamiliale
  );

  if (estEligibleVL !== true) {
    return {
      totalScenarioBareme,
      versementLiberatoire: null,
      impotAutresRevenus: 0,
      totalScenarioVL: null,
    };
  }

  const versementLiberatoire = arrondiEuro(caAnnuelHT * TAUX_VL[activite]);

  let impotAutresRevenus = 0;
  if (autresRevenusNetsImposablesFoyer > 0) {
    // TODO vérifier ordre décote / taux effectif avec les simulateurs officiels
    const irTotalTheorique = calculerIR(
      revenuImposableFoyer,
      nbParts,
      partsBase,
      situationFamiliale
    );
    const tauxEffectif =
      revenuImposableFoyer > 0 ? irTotalTheorique / revenuImposableFoyer : 0;
    impotAutresRevenus = arrondiEuro(
      autresRevenusNetsImposablesFoyer * tauxEffectif
    );
  }

  const totalScenarioVL = versementLiberatoire + impotAutresRevenus;

  return {
    totalScenarioBareme,
    versementLiberatoire,
    impotAutresRevenus,
    totalScenarioVL,
  };
}

export function calculerMicroEntreprise(inputs: InputsMicroEntreprise): ResultatMicro {
  // Étape 0 : validation et détermination du CA
  const caAnnuelHT = validerEntrees(inputs);

  const {
    activite,
    natureActivite,
    chargesFixesAnnuelles,
    situationFamiliale,
    nbEnfants,
    parentIsole,
    autresRevenusNetsImposablesFoyer,
    rfrN2Foyer,
    partsFiscalesN2,
    moisDebutActivite,
  } = inputs;

  // Étape 1 : prélèvements sociaux
  const { cotisationsSociales, cfp, totalPrelevementsSociaux } =
    calculerPrelevementsSociaux(caAnnuelHT, activite, natureActivite);

  // Étape 2 : revenu imposable
  const revenuMicroAbattu = caAnnuelHT * (1 - ABATTEMENTS[activite]);
  const revenuImposableFoyer = revenuMicroAbattu + autresRevenusNetsImposablesFoyer;

  // Étape 3 : nombre de parts
  const nbParts = calculerNombreDeParts(situationFamiliale, nbEnfants, parentIsole);
  const partsBase = situationFamiliale === 'couple' ? 2 : 1;

  // Étape 4 : éligibilité VL
  const estEligibleVL = calculerEligibiliteVL(
    rfrN2Foyer,
    partsFiscalesN2,
    nbParts
  );

  // Étape 5 : comparaison des scénarios
  const {
    totalScenarioBareme,
    versementLiberatoire,
    impotAutresRevenus,
    totalScenarioVL,
  } = comparerScenarios(
    caAnnuelHT,
    activite,
    revenuImposableFoyer,
    nbParts,
    partsBase,
    situationFamiliale,
    autresRevenusNetsImposablesFoyer,
    estEligibleVL
  );

  // Étape 6 : scénario le plus favorable
  let scenarioLePlusFavorable: ScenarioLePlusFavorable;
  let ecartEuros: number | null;

  if (estEligibleVL === true && totalScenarioVL !== null) {
    if (totalScenarioVL < totalScenarioBareme) {
      scenarioLePlusFavorable = 'VL';
      ecartEuros = totalScenarioBareme - totalScenarioVL;
    } else {
      scenarioLePlusFavorable = 'BAREME';
      ecartEuros = totalScenarioVL - totalScenarioBareme;
    }
  } else {
    scenarioLePlusFavorable = 'BAREME';
    ecartEuros = null;
  }

  // Étape 7 : revenu net disponible
  const impotRetenu =
    scenarioLePlusFavorable === 'VL' ? totalScenarioVL! : totalScenarioBareme;
  const revenuNetDisponible =
    caAnnuelHT - totalPrelevementsSociaux - impotRetenu - chargesFixesAnnuelles;

  const tauxPrelevementGlobal =
    caAnnuelHT > 0
      ? (totalPrelevementsSociaux + impotRetenu) / caAnnuelHT
      : 0;
  const resteSurCent = 100 * (1 - tauxPrelevementGlobal);

  // Étape 8 : seuils franchis
  const depassePlafondMicro = caAnnuelHT > PLAFONDS_MICRO[activite].plafond;
  const depasseSeuilBaseTVA = caAnnuelHT > SEUILS_TVA[activite].seuilBase;
  const depasseSeuilMajoreTVA = caAnnuelHT > SEUILS_TVA[activite].seuilMajore;

  // Étape 9 : prorata année 1 (informatif)
  let plafondProratise: number | null = null;
  let seuilTVAProratise: number | null = null;

  if (moisDebutActivite !== null) {
    const joursActivite = calculerJoursActivite(moisDebutActivite);
    plafondProratise = PLAFONDS_MICRO[activite].plafond * (joursActivite / 365);
    seuilTVAProratise = SEUILS_TVA[activite].seuilBase * (joursActivite / 365);
  }

  return {
    caAnnuelHT,
    cotisationsSociales,
    cfp,
    totalPrelevementsSociaux,
    revenuMicroAbattu,
    revenuImposableFoyer,
    nbParts,
    totalScenarioBareme,
    versementLiberatoire,
    totalScenarioVL,
    estEligibleVL,
    scenarioLePlusFavorable,
    ecartEuros,
    impotRetenu,
    chargesFixesAnnuelles,
    revenuNetDisponible,
    tauxPrelevementGlobal,
    resteSurCent,
    depassePlafondMicro,
    depasseSeuilBaseTVA,
    depasseSeuilMajoreTVA,
    plafondProratise,
    seuilTVAProratise,
  };
}
