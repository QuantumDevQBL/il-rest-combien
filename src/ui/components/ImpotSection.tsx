import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card, Icon } from '../design-system';
import { colors, spacing, typography } from '../theme';
import { Input } from './Input';
import { extractFieldErrors } from '../utils/errors';
import { ValidationError } from '../../engine/types';

interface ImpotSectionProps {
  rfrN2: string;
  partsFiscalesN2: string;
  onChangeRfr: (value: string) => void;
  onChangeParts: (value: string) => void;
  error: ValidationError | null;
}

export function ImpotSection({
  rfrN2,
  partsFiscalesN2,
  onChangeRfr,
  onChangeParts,
  error,
}: ImpotSectionProps) {
  const [expanded, setExpanded] = useState(false);
  const errors = extractFieldErrors(error);

  return (
    <Card style={styles.card}>
      <Pressable
        onPress={() => setExpanded(!expanded)}
        accessibilityRole="button"
        accessibilityLabel={
          expanded
            ? 'Replier la section impôt'
            : 'Déplier la section impôt'
        }
        style={styles.toggle}
      >
        <View style={styles.toggleText}>
          <Text style={styles.title}>Impôt — deux options</Text>
          <Text style={styles.subtitle}>
            Renseigne ton avis d'imposition 2025 pour comparer barème et
            versement libératoire.
          </Text>
        </View>
        <Icon
          name={expanded ? 'chevronUp' : 'chevronDown'}
          size={20}
          color={colors.inkSecondary}
        />
      </Pressable>

      {expanded && (
        <View style={styles.content}>
          <Input
            label="Revenu fiscal de référence N-2"
            value={rfrN2}
            onChangeText={onChangeRfr}
            placeholder="0"
            suffix="€"
            accessibilityLabel="Revenu fiscal de référence N-2, en euros"
            error={errors.rfrN2Foyer}
          />
          <Input
            label="Nombre de parts fiscales N-2"
            value={partsFiscalesN2}
            onChangeText={onChangeParts}
            placeholder="1"
            accessibilityLabel="Nombre de parts fiscales figurant sur l'avis d'imposition N-2"
            error={errors.partsFiscalesN2}
            helper="Distinct du nombre de parts calculé sur la situation actuelle."
          />
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.lg,
  },
  toggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 44,
  },
  toggleText: {
    flex: 1,
    marginRight: spacing.sm,
  },
  title: {
    ...typography.h3,
  },
  subtitle: {
    ...typography.caption,
    color: colors.inkSecondary,
    marginTop: spacing.xxs,
  },
  content: {
    paddingTop: spacing.md,
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
