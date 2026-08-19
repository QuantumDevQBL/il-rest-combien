import { calculerMicroEntreprise } from './micro-entreprise';
import { InputsMicroEntreprise } from './types';

/**
 * Calcule le CA annuel HT (et le TJM associé) nécessaire pour atteindre
 * un revenu net disponible visé.
 *
 * Utilise une recherche par dichotomie. La fonction directe étant monotone
 * croissante, la dichotomie converge toujours.
 *
 * @param netVise - Revenu net disponible visé, en euros.
 * @param baseInputs - Paramètres du freelance (activité, nature, situation, etc.), sans CA/TJM.
 * @param joursFactures - Nombre de jours facturés (optionnel). Si fourni, retourne aussi le TJM correspondant.
 * @returns CA requis et TJM correspondant si applicable.
 */
export function calculerCARequis(
  netVise: number,
  baseInputs: Omit<
    InputsMicroEntreprise,
    'modeSaisieCA' | 'caAnnuelHT' | 'tjm' | 'joursFactures'
  >,
  joursFactures?: number
): { caRequis: number; tjm: number | null } {
  if (netVise < 0) {
    throw new Error('Le revenu net visé ne peut pas être négatif.');
  }

  let borneBasse = netVise;
  let borneHaute = netVise * 3;

  // Ajustement de la borne haute si nécessaire
  let dernierNet = 0;
  for (let i = 0; i < 10; i++) {
    const resultat = calculerMicroEntreprise({
      ...baseInputs,
      modeSaisieCA: 'DIRECT',
      caAnnuelHT: borneHaute,
      tjm: null,
      joursFactures: null,
    });
    dernierNet = resultat.revenuNetDisponible;
    if (dernierNet >= netVise) {
      break;
    }
    borneHaute *= 2;
  }

  let caRequis = borneBasse;
  for (let i = 0; i < 40; i++) {
    caRequis = (borneBasse + borneHaute) / 2;
    const resultat = calculerMicroEntreprise({
      ...baseInputs,
      modeSaisieCA: 'DIRECT',
      caAnnuelHT: caRequis,
      tjm: null,
      joursFactures: null,
    });
    const netCalcule = resultat.revenuNetDisponible;

    if (Math.abs(netCalcule - netVise) < 1) {
      break;
    }

    if (netCalcule < netVise) {
      borneBasse = caRequis;
    } else {
      borneHaute = caRequis;
    }
  }

  return {
    caRequis,
    tjm: joursFactures && joursFactures > 0 ? caRequis / joursFactures : null,
  };
}
