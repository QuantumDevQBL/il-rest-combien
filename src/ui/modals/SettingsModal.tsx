import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useCalculatorContext } from '../context/CalculatorContext';
import { ModalContainer } from '../components/ModalContainer';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Toggle } from '../components/Toggle';
import { Tooltip } from '../components/Tooltip';
import { Button } from '../design-system';
import { colors, spacing, typography } from '../theme';
import { extractFieldErrors } from '../utils/errors';

interface SettingsModalProps {
  onClose: () => void;
}

const SITUATION_OPTIONS = [
  { value: 'celibataire' as const, label: 'Célibataire' },
  { value: 'couple' as const, label: 'Couple' },
];

interface LabeledInputProps {
  label: string;
  tooltip?: string;
  children: React.ReactNode;
}

function LabeledInput({ label, tooltip, children }: LabeledInputProps) {
  return (
    <View style={styles.inputWrapper}>
      <View style={styles.labelRow}>
        <Text style={styles.inputLabel}>{label}</Text>
        {tooltip && <Tooltip content={tooltip} />}
      </View>
      {children}
    </View>
  );
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const { form, error, setFormField, resetForm } = useCalculatorContext();
  const errors = extractFieldErrors(error);
  const parentIsoleApplicable = form.situationFamiliale === 'celibataire' && Number(form.nbEnfants) > 0;

  return (
    <ModalContainer title="Paramètres fiscaux" onClose={onClose}>
      <Text style={styles.intro}>
        Ces données servent à calculer l'impôt au barème et à tester l'éligibilité au versement libératoire.
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Situation familiale</Text>
        <Select
          label="Situation familiale"
          value={form.situationFamiliale}
          options={SITUATION_OPTIONS}
          onChange={(value) => setFormField('situationFamiliale', value)}
        />
        <Input
          label="Enfants à charge"
          value={form.nbEnfants}
          onChangeText={(value) => setFormField('nbEnfants', value)}
          placeholder="0"
          error={errors.nbEnfants}
        />
        <Toggle
          label="Je vis seul·e avec mes enfants (parent isolé)"
          value={parentIsoleApplicable && form.parentIsole}
          onChange={(value) => setFormField('parentIsole', value)}
          disabled={!parentIsoleApplicable}
        />

        <LabeledInput
          label="Autres revenus imposables du foyer"
          tooltip="Montant net imposable du foyer figurant sur l'avis d'imposition. Ces revenus sont ajoutés à ceux de la micro-entreprise pour le calcul de l'impôt."
        >
          <Input
            value={form.autresRevenus}
            onChangeText={(value) => setFormField('autresRevenus', value)}
            placeholder="0"
            suffix="€"
            error={errors.autresRevenusNetsImposablesFoyer}
            helper="Montant net imposable figurant sur l'avis d'imposition du foyer."
          />
        </LabeledInput>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Données N-2</Text>
          <Tooltip content="Ces données figurent sur l'avis d'imposition de l'année N-2 (avant-dernier avis reçu). Elles servent uniquement à tester l'éligibilité au versement libératoire." />
        </View>
        <LabeledInput
          label="Revenu fiscal de référence N-2"
          tooltip="C'est le revenu fiscal de référence total du foyer, figurant sur l'avis d'imposition de l'année N-2."
        >
          <Input
            value={form.rfrN2}
            onChangeText={(value) => setFormField('rfrN2', value)}
            placeholder="0"
            suffix="€"
            error={errors.rfrN2Foyer}
            helper="Figure sur l'avis d'imposition de l'année N-2."
          />
        </LabeledInput>
        <LabeledInput
          label="Nombre de parts fiscales N-2"
          tooltip="Le nombre de parts du foyer N-2 est différent de celui de l'année en cours. Il figure sur l'avis d'imposition concerné."
        >
          <Input
            value={form.partsFiscalesN2}
            onChangeText={(value) => setFormField('partsFiscalesN2', value)}
            placeholder="1"
            error={errors.partsFiscalesN2}
            helper="Distinct du nombre de parts calculé sur la situation actuelle."
          />
        </LabeledInput>
      </View>

      <View style={styles.section}>
        <LabeledInput
          label="Charges fixes annuelles"
          tooltip="Dépenses réelles professionnelles ou personnelles non déductibles du calcul micro-entrepreneur. Elles sont soustraites du net disponible final."
        >
          <Input
            value={form.chargesFixesAnnuelles}
            onChangeText={(value) => setFormField('chargesFixesAnnuelles', value)}
            placeholder="0"
            suffix="€"
            error={errors.chargesFixesAnnuelles}
            helper="Dépenses réelles non déductibles, soustraites en fin de décompte."
          />
        </LabeledInput>
      </View>

      <View style={styles.actions}>
        <Button label="Enregistrer" onPress={onClose} variant="primary" size="lg" />
        <Button label="Réinitialiser" onPress={resetForm} variant="ghost" size="md" />
      </View>
    </ModalContainer>
  );
}

const styles = StyleSheet.create({
  intro: {
    ...typography.bodySmall,
    color: colors.inkTertiary,
    marginBottom: spacing.xl,
    lineHeight: 20,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.overline,
    color: colors.primary,
  },
  inputWrapper: {
    marginTop: spacing.sm,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xxs,
  },
  inputLabel: {
    ...typography.caption,
    color: colors.inkSecondary,
  },
  actions: {
    gap: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
});
