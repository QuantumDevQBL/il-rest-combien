/**
 * Catégories fiscales de micro-entreprise.
 *
 * Déterminent :
 * - le taux de cotisations sociales
 * - l'abattement forfaitaire sur le revenu imposable
 * - le taux de versement libératoire
 * - le plafond du régime micro
 *
 * V1 : BNC correspond aux professions libérales non réglementées.
 * CIPAV (professions libérales réglementées) n'est pas encore implémenté.
 */
export type ActiviteMicro =
  | 'BIC_VENTE'
  | 'BIC_PRESTATION'
  | 'BNC'
  | 'CIPAV';

/**
 * Nature d'activité.
 *
 * Détermine le taux de CFP (contribution à la formation professionnelle).
 * Elle est orthogonale à la catégorie fiscale : une activité BIC prestation
 * peut être commerciale, artisanale ou libérale.
 *
 * V1 : on distingue les trois natures principales. CIPAV n'est pas supporté.
 */
export type NatureActivite =
  | 'commerciale'
  | 'artisanale'
  | 'liberale';

export type SituationFamiliale = 'celibataire' | 'couple';

export type ModeSaisieCA = 'DIRECT' | 'TJM';

export type ScenarioLePlusFavorable = 'BAREME' | 'VL';

export interface InputsMicroEntreprise {
  activite: ActiviteMicro;
  /** Nature métier de l'activité, utilisée pour la CFP. */
  natureActivite: NatureActivite;
  modeSaisieCA: ModeSaisieCA;
  caAnnuelHT: number | null;
  tjm: number | null;
  joursFactures: number | null;
  chargesFixesAnnuelles: number;
  situationFamiliale: SituationFamiliale;
  nbEnfants: number;
  parentIsole: boolean;
  autresRevenusNetsImposablesFoyer: number;
  /** RFR du foyer N-2, tel qu'il figure sur l'avis d'imposition. */
  rfrN2Foyer: number | null;
  /** Nombre de parts fiscales du foyer N-2. Ne pas reconstruire depuis la situation actuelle. */
  partsFiscalesN2: number | null;
  moisDebutActivite: number | null;
}

export interface ResultatMicro {
  // Chiffre d'affaires
  caAnnuelHT: number;

  // Prélèvements sociaux
  cotisationsSociales: number;
  cfp: number;
  totalPrelevementsSociaux: number;

  // Assiette fiscale
  revenuMicroAbattu: number;
  revenuImposableFoyer: number;
  nbParts: number;

  // Impôt — les deux scénarios, toujours
  totalScenarioBareme: number;
  versementLiberatoire: number | null;
  totalScenarioVL: number | null;
  estEligibleVL: boolean | null;
  scenarioLePlusFavorable: ScenarioLePlusFavorable;
  ecartEuros: number | null;

  // Résultat
  impotRetenu: number;
  chargesFixesAnnuelles: number;
  revenuNetDisponible: number;
  tauxPrelevementGlobal: number;
  resteSurCent: number;

  // Alertes
  depassePlafondMicro: boolean;
  depasseSeuilBaseTVA: boolean;
  depasseSeuilMajoreTVA: boolean;

  // Prorata année 1 (informatif)
  plafondProratise: number | null;
  seuilTVAProratise: number | null;
}

export class ValidationError extends Error {
  constructor(
    public readonly champ: string,
    message: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}
