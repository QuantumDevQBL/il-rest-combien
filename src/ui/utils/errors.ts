import { ValidationError } from '../../engine/types';

export interface FieldErrors {
  [champ: string]: string | undefined;
}

/**
 * Transforme une ValidationError du moteur en message utilisateur compréhensible.
 */
export function getUserMessageForError(error: ValidationError): {
  champ: string;
  message: string;
} {
  switch (error.champ) {
    case 'caAnnuelHT':
      return {
        champ: 'caAnnuelHT',
        message: 'Le chiffre d\'affaires doit être un montant positif ou nul.',
      };
    case 'tjm':
      return {
        champ: 'tjm',
        message: 'Le TJM doit être un montant positif ou nul.',
      };
    case 'joursFactures':
      return {
        champ: 'joursFactures',
        message: 'Le nombre de jours facturés doit être compris entre 0 et 366.',
      };
    case 'chargesFixesAnnuelles':
      return {
        champ: 'chargesFixesAnnuelles',
        message: 'Les charges fixes doivent être positives ou nulles.',
      };
    case 'nbEnfants':
      return {
        champ: 'nbEnfants',
        message: 'Le nombre d\'enfants doit être un entier positif ou nul.',
      };
    case 'autresRevenusNetsImposablesFoyer':
      return {
        champ: 'autresRevenusNetsImposablesFoyer',
        message: 'Les autres revenus du foyer doivent être positifs ou nuls.',
      };
    case 'rfrN2Foyer':
      return {
        champ: 'rfrN2Foyer',
        message: 'Le revenu fiscal de référence doit être positif ou nul.',
      };
    case 'partsFiscalesN2':
      return {
        champ: 'partsFiscalesN2',
        message: 'Le nombre de parts fiscales N-2 doit être strictement positif.',
      };
    case 'moisDebutActivite':
      return {
        champ: 'moisDebutActivite',
        message: 'Le mois de début d\'activité doit être compris entre 1 et 12.',
      };
    default:
      return {
        champ: error.champ,
        message: error.message,
      };
  }
}

/**
 * Extrait les erreurs de validation sous forme de map champ → message.
 */
export function extractFieldErrors(error: unknown): FieldErrors {
  if (error instanceof ValidationError) {
    const { champ, message } = getUserMessageForError(error);
    return { [champ]: message };
  }
  return {};
}
