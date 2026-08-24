import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useCalculatorContext } from '../context/CalculatorContext';
import { ModalContainer } from '../components/ModalContainer';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Toggle } from '../components/Toggle';
import { Tooltip } from '../components/Tooltip';
import { Button, Card, Icon } from '../design-system';
import { colors, radius, spacing, typography } from '../theme';
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

interface SectionProps {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

function Section({ eyebrow, title, description, children }: SectionProps) {
  return (
    <Card style={styles.sectionCard}>
      <Text style={styles.sectionEyebrow}>{eyebrow}</Text>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionDescription}>{description}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </Card>
  );
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const { form, error, setFormField, resetForm } = useCalculatorContext();
  const errors = extractFieldErrors(error);
  const parentIsoleApplicable =
    form.situationFamiliale === 'celibataire' && Number(form.nbEnfants) > 0;

  return (
    <ModalContainer title="Paramètres fiscaux" onClose={onClose}>
      <Card style={styles.introCard}>
        <View style={styles.introHeader}>
          <View style={styles.introIcon}>
            <Icon name="informationCircle" size={18} color={colors.primary} />
          </View>
          <View style={styles.introTextBlock}>
            <Text style={styles.introTitle}>Options avancées</Text>
            <Text style={styles.intro}>
              Laisse vide si tu veux une estimation rapide. Complète seulement ce que
              tu connais.
            </Text>
          </View>
        </View>
      </Card>

      <Section
        eyebrow="Impact direct"
        title="Ce qui change ton net"
        description="Ces champs modifient directement le résultat affiché."
      >
        <LabeledInput
          label="Charges fixes annuelles"
          tooltip="Dépenses réelles professionnelles ou personnelles non déductibles du régime micro. Elles sont soustraites du net final."
        >
          <Input
            value={form.chargesFixesAnnuelles}
            onChangeText={(value) => setFormField('chargesFixesAnnuelles', value)}
            placeholder="0"
            suffix="€"
            error={errors.chargesFixesAnnuelles}
            helper="Exemple : logiciels, assurance, frais fixes non couverts par l'abattement."
          />
        </LabeledInput>
      </Section>

      <Section
        eyebrow="Affiner l'impôt"
        title="Situation du foyer"
        description="Utile si tu veux une estimation plus réaliste de l'impôt au barème."
      >
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
          helper="Utilisé pour estimer le nombre de parts fiscales du foyer actuel."
        />
        <Toggle
          label="Je vis seul·e avec mes enfants (parent isolé)"
          value={parentIsoleApplicable && form.parentIsole}
          onChange={(value) => setFormField('parentIsole', value)}
          disabled={!parentIsoleApplicable}
        />

        <LabeledInput
          label="Autres revenus imposables du foyer"
          tooltip="Montant net imposable du foyer figurant sur l'avis d'imposition. Il s'ajoute au revenu micro pour le calcul de l'impôt."
        >
          <Input
            value={form.autresRevenus}
            onChangeText={(value) => setFormField('autresRevenus', value)}
            placeholder="0"
            suffix="€"
            error={errors.autresRevenusNetsImposablesFoyer}
            helper="À renseigner si ton foyer a déjà d'autres revenus imposables."
          />
        </LabeledInput>
      </Section>

      <Section
        eyebrow="Versement libératoire"
        title="Données N-2"
        description="Ces champs servent uniquement à tester si le versement libératoire est accessible."
      >
        <LabeledInput
          label="Revenu fiscal de référence N-2"
          tooltip="Revenu fiscal de référence total du foyer figurant sur l'avis d'imposition N-2."
        >
          <Input
            value={form.rfrN2}
            onChangeText={(value) => setFormField('rfrN2', value)}
            placeholder="0"
            suffix="€"
            error={errors.rfrN2Foyer}
            helper="Si tu ne le connais pas, laisse vide : le calcul principal fonctionnera quand même."
          />
        </LabeledInput>
        <LabeledInput
          label="Nombre de parts fiscales N-2"
          tooltip="Le nombre de parts N-2 peut être différent de la situation actuelle. Il figure sur l'avis concerné."
        >
          <Input
            value={form.partsFiscalesN2}
            onChangeText={(value) => setFormField('partsFiscalesN2', value)}
            placeholder="1"
            error={errors.partsFiscalesN2}
            helper="Utilisé seulement pour l'éligibilité au versement libératoire."
          />
        </LabeledInput>
      </Section>

      <View style={styles.actions}>
        <Button label="Enregistrer" onPress={onClose} variant="primary" size="lg" />
        <Button label="Réinitialiser" onPress={resetForm} variant="ghost" size="md" />
      </View>
    </ModalContainer>
  );
}

const styles = StyleSheet.create({
  introCard: {
    marginBottom: spacing.lg,
    backgroundColor: colors.surface,
  },
  introHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  introIcon: {
    width: 34,
    height: 34,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  introTextBlock: {
    flex: 1,
  },
  introTitle: {
    ...typography.body,
    color: colors.ink,
    fontWeight: '800',
    marginBottom: spacing.xxs,
  },
  intro: {
    ...typography.bodySmall,
    color: colors.inkSecondary,
    lineHeight: 20,
  },
  sectionCard: {
    marginBottom: spacing.lg,
  },
  sectionEyebrow: {
    ...typography.overline,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.ink,
    marginBottom: spacing.xxs,
  },
  sectionDescription: {
    ...typography.bodySmall,
    color: colors.inkSecondary,
    lineHeight: 20,
  },
  sectionContent: {
    marginTop: spacing.md,
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
