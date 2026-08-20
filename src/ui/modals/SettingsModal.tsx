import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCalculatorContext } from '../context/CalculatorContext';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Toggle } from '../components/Toggle';
import { Button, Icon } from '../design-system';
import { PressableScale } from '../components/PressableScale';
import { colors, spacing, typography } from '../theme';
import { extractFieldErrors } from '../utils/errors';

interface SettingsModalProps {
  onClose: () => void;
}

const SITUATION_OPTIONS = [
  { value: 'celibataire' as const, label: 'Célibataire' },
  { value: 'couple' as const, label: 'Couple' },
];

export function SettingsModal({ onClose }: SettingsModalProps) {
  const { form, error, setFormField, resetForm } = useCalculatorContext();
  const errors = extractFieldErrors(error);
  const parentIsoleApplicable = form.situationFamiliale === 'celibataire' && Number(form.nbEnfants) > 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Paramètres fiscaux</Text>
        <PressableScale onPress={onClose} scale={0.9}>
          <View style={styles.closeButton}>
            <Icon name="close" size={24} color={colors.ink} />
          </View>
        </PressableScale>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
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
          <Input
            label="Autres revenus imposables du foyer"
            value={form.autresRevenus}
            onChangeText={(value) => setFormField('autresRevenus', value)}
            placeholder="0"
            suffix="€"
            error={errors.autresRevenusNetsImposablesFoyer}
            helper="Montant net imposable figurant sur l'avis d'imposition du foyer."
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Données N-2 (avis d'imposition)</Text>
          <Input
            label="Revenu fiscal de référence N-2"
            value={form.rfrN2}
            onChangeText={(value) => setFormField('rfrN2', value)}
            placeholder="0"
            suffix="€"
            error={errors.rfrN2Foyer}
            helper="Figure sur l'avis d'imposition de l'année N-2."
          />
          <Input
            label="Nombre de parts fiscales N-2"
            value={form.partsFiscalesN2}
            onChangeText={(value) => setFormField('partsFiscalesN2', value)}
            placeholder="1"
            error={errors.partsFiscalesN2}
            helper="Distinct du nombre de parts calculé sur la situation actuelle."
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Charges</Text>
          <Input
            label="Charges fixes annuelles"
            value={form.chargesFixesAnnuelles}
            onChangeText={(value) => setFormField('chargesFixesAnnuelles', value)}
            placeholder="0"
            suffix="€"
            error={errors.chargesFixesAnnuelles}
            helper="Dépenses réelles non déductibles, soustraites en fin de décompte."
          />
        </View>

        <Button
          label="Réinitialiser"
          onPress={resetForm}
          variant="ghost"
          size="md"
        />
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Enregistrer" onPress={onClose} variant="primary" size="lg" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.h2,
    color: colors.ink,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceSolid,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  intro: {
    ...typography.bodySmall,
    color: colors.inkTertiary,
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...typography.overline,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
});
