import React from 'react';
import { Section } from './Section';
import { Select } from './Select';
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
    </Section>
  );
}
