/**
 * Formate un montant en euros avec séparateur de milliers et deux décimales.
 */
export function formatMontant(montant: number | null | undefined): string {
  if (montant === null || montant === undefined || !Number.isFinite(montant)) {
    return '—';
  }
  return montant.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

/**
 * Formate un montant en euros sans symbole, pour les grands titres.
 */
export function formatMontantBrut(montant: number | null | undefined): string {
  if (montant === null || montant === undefined || !Number.isFinite(montant)) {
    return '—';
  }
  return montant.toLocaleString('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

/**
 * Formate un pourcentage avec deux décimales.
 */
export function formatPourcentage(valeur: number | null | undefined): string {
  if (valeur === null || valeur === undefined || !Number.isFinite(valeur)) {
    return '—';
  }
  return `${(valeur * 100).toLocaleString('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })} %`;
}

/**
 * Parse une chaîne de saisie en nombre positif ou null.
 * Accepte la virgule ou le point comme séparateur décimal.
 */
export function parseMontantSaisi(value: string): number | null {
  const cleaned = value.replace(/\s/g, '').replace(',', '.');
  if (cleaned === '') {
    return null;
  }
  const parsed = Number(cleaned);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }
  return parsed;
}
