import { ActiviteMicro, NatureActivite } from '../engine/types';

/**
 * Choix d'activité présentés à l'utilisateur.
 *
 * Chaque choix détermine à la fois la catégorie fiscale et la nature d'activité
 * utilisée par le moteur. L'utilisateur ne peut pas combiner librement ces deux
 * dimensions : le mapping garantit la cohérence fiscale.
 */
export type ActivityChoice =
  | 'VENTE_MARCHANDISES'
  | 'PRESTATION_COMMERCIALE'
  | 'PRESTATION_ARTISANALE'
  | 'PROFESSION_LIBERALE';

export interface ActivityOption {
  value: ActivityChoice;
  label: string;
  activite: ActiviteMicro;
  natureActivite: NatureActivite;
}

export const ACTIVITY_OPTIONS: readonly ActivityOption[] = [
  {
    value: 'VENTE_MARCHANDISES',
    label: 'Vente de marchandises',
    activite: 'BIC_VENTE',
    natureActivite: 'commerciale',
  },
  {
    value: 'PRESTATION_COMMERCIALE',
    label: 'Prestations de services commerciales',
    activite: 'BIC_PRESTATION',
    natureActivite: 'commerciale',
  },
  {
    value: 'PRESTATION_ARTISANALE',
    label: 'Prestations artisanales',
    activite: 'BIC_PRESTATION',
    natureActivite: 'artisanale',
  },
  {
    value: 'PROFESSION_LIBERALE',
    label: 'Profession libérale non réglementée',
    activite: 'BNC',
    natureActivite: 'liberale',
  },
];

/**
 * Retourne la configuration moteur correspondant à un choix utilisateur.
 */
export function getActivityConfig(
  choice: ActivityChoice
): Pick<ActivityOption, 'activite' | 'natureActivite'> {
  const option = ACTIVITY_OPTIONS.find((o) => o.value === choice);
  if (!option) {
    throw new Error(`Choix d'activité inconnu : ${choice}`);
  }
  return {
    activite: option.activite,
    natureActivite: option.natureActivite,
  };
}

/**
 * Libellé associé à un choix d'activité.
 */
export function getActivityLabel(choice: ActivityChoice): string {
  const option = ACTIVITY_OPTIONS.find((o) => o.value === choice);
  return option?.label ?? choice;
}
