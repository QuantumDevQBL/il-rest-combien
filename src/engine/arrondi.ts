/**
 * Arrondi un montant à l'euro le plus proche.
 *
 * Règles de la spec v2 :
 * - Cotisations sociales et CFP : arrondies séparément à l'euro, puis additionnées.
 * - IR : arrondi à l'euro en fin de calcul, après décote.
 * - Versement libératoire : arrondi à l'euro.
 * - Aucun arrondi intermédiaire dans le calcul du barème par tranches.
 *
 * @param montant - Montant à arrondir, en euros.
 * @returns Montant arrondi, en euros. Retourne 0 si le montant est négatif ou nul.
 */
export function arrondiEuro(montant: number): number {
  if (!Number.isFinite(montant) || montant <= 0) {
    return 0;
  }
  return Math.round(montant);
}
