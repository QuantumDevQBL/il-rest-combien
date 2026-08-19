import React from 'react';
import { Section } from './Section';
import { Input } from './Input';
import { Select } from './Select';
import { Toggle } from './Toggle';
import { extractFieldErrors } from '../utils/errors';
import { ValidationError } from '../../engine/types';

interface FoyerSectionProps {
  situationFamiliale: 'celibataire' | 'couple';
  nbEnfants: string;
  parentIsole: boolean;
  autresRevenus: string;
  onChangeSituation: (value: 'celibataire' | 'couple') => void;
  onChangeNbEnfants: (value: string) => void;
  onChangeParentIsole: (value: boolean) => void;
  onChangeAutresRevenus: (value: string) => void;
  error: ValidationError | null;
}

const SITUATION_OPTIONS = [
  { value: 'celibataire' as const, label: 'Célibataire' },
  { value: 'couple' as const, label: 'Couple' },
];

export function FoyerSection({
  situationFamiliale,
  nbEnfants,
  parentIsole,
  autresRevenus,
  onChangeSituation,
  onChangeNbEnfants,
  onChangeParentIsole,
  onChangeAutresRevenus,
  error,
}: FoyerSectionProps) {
  const errors = extractFieldErrors(error);
  const parentIsoleApplicable = situationFamiliale === 'celibataire' && Number(nbEnfants) > 0;

  return (
    <Section title="Ton foyer">
      <Select
        label="Situation familiale"
        value={situationFamiliale}
        options={SITUATION_OPTIONS}
        onChange={onChangeSituation}
        accessibilityLabel="Situation familiale"
      />
      <Input
        label="Enfants à charge"
        value={nbEnfants}
        onChangeText={onChangeNbEnfants}
        placeholder="0"
        accessibilityLabel="Nombre d'enfants à charge"
        error={errors.nbEnfants}
      />
      <Toggle
        label="Je vis seul·e avec mes enfants"
        value={parentIsoleApplicable && parentIsole}
        onChange={onChangeParentIsole}
        disabled={!parentIsoleApplicable}
        accessibilityLabel="Case parent isolé"
      />
      <Input
        label="Autres revenus imposables du foyer"
        value={autresRevenus}
        onChangeText={onChangeAutresRevenus}
        placeholder="0"
        suffix="€"
        accessibilityLabel="Autres revenus imposables du foyer, en euros"
        error={errors.autresRevenusNetsImposablesFoyer}
        helper="Montant net imposable figurant sur l'avis d'imposition du foyer."
      />
    </Section>
  );
}
