import {
  CFP_ARTISANALE,
  CFP_COMMERCIALE,
  CFP_LIBERALE,
  COTISATIONS_MICRO_BIC_PRESTATION,
  COTISATIONS_MICRO_BIC_VENTE,
  COTISATIONS_MICRO_BNC,
  COTISATIONS_MICRO_CIPAV,
} from '../data/baremes-2026';
import { arrondiEuro } from './arrondi';
import { ActiviteMicro, NatureActivite } from './types';

const TAUX_COTISATIONS: Record<ActiviteMicro, number> = {
  BIC_VENTE: COTISATIONS_MICRO_BIC_VENTE,
  BIC_PRESTATION: COTISATIONS_MICRO_BIC_PRESTATION,
  BNC: COTISATIONS_MICRO_BNC,
  CIPAV: COTISATIONS_MICRO_CIPAV,
};

const TAUX_CFP: Record<NatureActivite, number> = {
  commerciale: CFP_COMMERCIALE,
  liberale: CFP_LIBERALE,
  artisanale: CFP_ARTISANALE,
};

export interface PrelevementsSociaux {
  cotisationsSociales: number;
  cfp: number;
  totalPrelevementsSociaux: number;
}

/**
 * Calcule les prélèvements sociaux sur le CA encaissé.
 *
 * @param caAnnuelHT - Chiffre d'affaires annuel hors taxes.
 * @param activite - Catégorie fiscale de la micro-entreprise.
 * @param natureActivite - Nature métier de l'activité (détermine la CFP).
 * @returns Cotisations sociales, CFP et total.
 */
export function calculerPrelevementsSociaux(
  caAnnuelHT: number,
  activite: ActiviteMicro,
  natureActivite: NatureActivite
): PrelevementsSociaux {
  const cotisationsSociales = arrondiEuro(
    caAnnuelHT * TAUX_COTISATIONS[activite]
  );
  const cfp = arrondiEuro(caAnnuelHT * TAUX_CFP[natureActivite]);

  return {
    cotisationsSociales,
    cfp,
    totalPrelevementsSociaux: cotisationsSociales + cfp,
  };
}
