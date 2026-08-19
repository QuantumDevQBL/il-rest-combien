import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCalculatorContext } from '../context/CalculatorContext';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Toggle } from '../components/Toggle';
import { Button } from '../design-system';
import { colors, spacing, typography } from '../theme';
import { extractFieldErrors } from '../utils/errors';

const SITUATION_OPTIONS = [
  { value: 'celibataire' as const, label: 'Célibataire' },
  { value: 'couple' as const, label: 'Couple' },
];

export function SettingsScreen() {
  const {
    form,
    error,
    setFormField,
    resetForm,
  } = useCalculatorContext();
  const insets = useSafeAreaInsets();
  const errors = extractFieldErrors(error);

  const parentIsoleApplicable = form.situationFamiliale === 'celibataire' && Number(form.nbEnfants) > 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + spacing.xxxl },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Paramètres fiscaux</Text>
          <Text style={styles.subtitle}>
            Ces données permettent de calculer l'impôt au barème et de tester l'éligibilité au versement libératoire.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Situation familiale</Text>
          <Select
            label="Situation familiale"
            value={form.situationFamiliale}
            options={SITUATION_OPTIONS}
            onChange={(value) => setFormField('situationFamiliale', value)}
            accessibilityLabel="Situation familiale"
          />
          <Input
            label="Enfants à charge"
            value={form.nbEnfants}
            onChangeText={(value) => setFormField('nbEnfants', value)}
            placeholder="0"
            accessibilityLabel="Nombre d'enfants à charge"
            error={errors.nbEnfants}
          />
          <Toggle
            label="Je vis seul·e avec mes enfants (parent isolé)"
            value={parentIsoleApplicable && form.parentIsole}
            onChange={(value) => setFormField('parentIsole', value)}
            disabled={!parentIsoleApplicable}
            accessibilityLabel="Case parent isolé"
          />
          <Input
            label="Autres revenus imposables du foyer"
            value={form.autresRevenus}
            onChangeText={(value) => setFormField('autresRevenus', value)}
            placeholder="0"
            suffix="€"
            accessibilityLabel="Autres revenus imposables du foyer"
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
            accessibilityLabel="Revenu fiscal de référence N-2"
            error={errors.rfrN2Foyer}
            helper="Figure sur l'avis d'imposition de l'année N-2."
          />
          <Input
            label="Nombre de parts fiscales N-2"
            value={form.partsFiscalesN2}
            onChangeText={(value) => setFormField('partsFiscalesN2', value)}
            placeholder="1"
            accessibilityLabel="Nombre de parts fiscales N-2"
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
            accessibilityLabel="Charges fixes annuelles"
            error={errors.chargesFixesAnnuelles}
            helper="Dépenses réelles non déductibles du calcul, soustraites en fin de décompte."
          />
        </View>

        <Button
          label="Réinitialiser tous les paramètres"
          onPress={resetForm}
          variant="tertiary"
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.md,
  },
  header: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
    color: colors.ink,
  },
  subtitle: {
    ...typography.body,
    color: colors.inkSecondary,
    marginTop: spacing.xs,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    ...typography.overline,
    color: colors.inkSecondary,
    marginBottom: spacing.sm,
  },
});
