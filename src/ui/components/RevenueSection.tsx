import React from 'react';
import { Section } from './Section';
import { Input } from './Input';
import { extractFieldErrors } from '../utils/errors';
import { ValidationError } from '../../engine/types';

interface RevenueSectionProps {
  caAnnuelHT: string;
  chargesFixes: string;
  onChangeCa: (value: string) => void;
  onChangeCharges: (value: string) => void;
  error: ValidationError | null;
}

export function RevenueSection({
  caAnnuelHT,
  chargesFixes,
  onChangeCa,
  onChangeCharges,
  error,
}: RevenueSectionProps) {
  const errors = extractFieldErrors(error);

  return (
    <Section title="Chiffre d'affaires">
      <Input
        label="Chiffre d'affaires annuel HT"
        value={caAnnuelHT}
        onChangeText={onChangeCa}
        placeholder="0"
        suffix="€"
        accessibilityLabel="Chiffre d'affaires annuel hors taxes, en euros"
        error={errors.caAnnuelHT}
      />
      <Input
        label="Charges fixes annuelles"
        value={chargesFixes}
        onChangeText={onChangeCharges}
        placeholder="0"
        suffix="€"
        accessibilityLabel="Charges fixes annuelles, en euros"
        error={errors.chargesFixesAnnuelles}
        helper="Dépenses réelles non déductibles du calcul, soustraites en fin de décompte."
      />
    </Section>
  );
}
