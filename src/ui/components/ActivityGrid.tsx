import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PressableScale } from './PressableScale';
import { Icon, IconName } from '../design-system';
import { ActivityChoice, ACTIVITY_OPTIONS, getActivityLabel } from '../mapping';
import { colors, radius, spacing, typography } from '../theme';

interface ActivityGridProps {
  selected: ActivityChoice;
  onSelect: (activity: ActivityChoice) => void;
}

const ACTIVITY_ICONS: Record<ActivityChoice, IconName> = {
  VENTE_MARCHANDISES: 'cart',
  PRESTATION_COMMERCIALE: 'business',
  PRESTATION_ARTISANALE: 'construct',
  PROFESSION_LIBERALE: 'briefcase',
};

export function ActivityGrid({ selected, onSelect }: ActivityGridProps) {
  return (
    <View style={styles.grid}>
      {ACTIVITY_OPTIONS.map((option) => {
        const isSelected = selected === option.value;

        return (
          <PressableScale
            key={option.value}
            onPress={() => onSelect(option.value)}
            scale={0.98}
            style={styles.item}
            accessibilityRole="radio"
            accessibilityState={{ checked: isSelected }}
            accessibilityLabel={option.label}
          >
            <View style={[styles.pill, isSelected && styles.pillSelected]}>
              <View style={[styles.iconCircle, isSelected && styles.iconCircleSelected]}>
                <Icon
                  name={ACTIVITY_ICONS[option.value]}
                  size={15}
                  color={isSelected ? colors.surface : colors.primary}
                />
              </View>
              <Text style={[styles.label, isSelected && styles.labelSelected]}>
                {getActivityLabel(option.value)}
              </Text>
              {isSelected ? <View style={styles.selectionDot} /> : null}
            </View>
          </PressableScale>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  item: {
    width: '48.5%',
  },
  pill: {
    minHeight: 48,
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
  },
  pillSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  iconCircle: {
    width: 22,
    height: 22,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs,
  },
  iconCircleSelected: {
    backgroundColor: colors.primary,
  },
  selectionDot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    marginLeft: 'auto',
  },
  label: {
    ...typography.bodySmall,
    color: colors.ink,
    fontWeight: '700',
    flexShrink: 1,
  },
  labelSelected: {
    color: colors.primaryDark,
  },
});
