import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Section } from './Section';
import { Select } from './Select';
import { couleurs, spacing, type } from '../theme';
import { ACTIVITY_OPTIONS, ActivityChoice } from '../mapping';

interface ActivitySectionProps {
  activity: ActivityChoice;
  onChange: (activity: ActivityChoice) => void;
}

export function ActivitySection({ activity, onChange }: ActivitySectionProps) {
  return (
    <Section title="Ton activité">
      <Select
        label="Type d'activité"
        value={activity}
        options={ACTIVITY_OPTIONS.map((o) => ({
          value: o.value,
          label: o.label,
        }))}
        onChange={onChange}
        accessibilityLabel="Type d'activité"
      />
      <Text style={styles.helper}>
        Les professions réglementées relevant de la Cipav ne sont pas couvertes
        par cette version.
      </Text>
    </Section>
  );
}

const styles = StyleSheet.create({
  helper: {
    ...type.mention,
    color: couleurs.encreFaible,
    marginTop: spacing.sm,
  },
});
