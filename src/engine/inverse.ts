import { calculerMicroEntreprise } from './micro-entreprise';
import { InputsMicroEntreprise } from './types';

/**
 * Levée quand aucun CA (même très élevé) ne permet d'atteindre le revenu
 * net visé avec les paramètres fournis, pour que l'appelant distingue ce
 * cas d'un résultat valide plutôt que de recevoir silencieusement une
 * valeur qui n'atteint pas réellement l'objectif.
 */
export class UnreachableTargetError extends Error {
  constructor(netVise: number) {
    super(
      `Aucun chiffre d'affaires ne permet d'atteindre un revenu net disponible de ${netVise} € avec ces paramètres.`
    );
    this.name = 'UnreachableTargetError';
  }
}

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

  if (dernierNet < netVise) {
    // Même après 10 doublements de la borne haute, le net visé reste hors
    // de portée : ne pas poursuivre la dichotomie sur un intervalle qui ne
    // contient pas la solution.
    throw new UnreachableTargetError(netVise);
  }

  let caRequis = borneBasse;
  let netCalcule = 0;
  let aConverge = false;
  for (let i = 0; i < 40; i++) {
    caRequis = (borneBasse + borneHaute) / 2;
    const resultat = calculerMicroEntreprise({
      ...baseInputs,
      modeSaisieCA: 'DIRECT',
      caAnnuelHT: caRequis,
      tjm: null,
      joursFactures: null,
    });
    netCalcule = resultat.revenuNetDisponible;

    if (Math.abs(netCalcule - netVise) < 1) {
      aConverge = true;
      break;
    }

    if (netCalcule < netVise) {
      borneBasse = caRequis;
    } else {
      borneHaute = caRequis;
    }
  }

  if (!aConverge) {
    throw new UnreachableTargetError(netVise);
  }

  return {
    caRequis,
    tjm: joursFactures && joursFactures > 0 ? caRequis / joursFactures : null,
  };
}
