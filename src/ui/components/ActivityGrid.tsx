import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PressableScale } from './PressableScale';
import { Icon, IconName } from '../design-system';
import { ActivityChoice, ACTIVITY_OPTIONS } from '../mapping';
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
              <View style={styles.pillTopRow}>
                <View style={[styles.iconCircle, isSelected && styles.iconCircleSelected]}>
                  <Icon
                    name={ACTIVITY_ICONS[option.value]}
                    size={15}
                    color={isSelected ? colors.surface : colors.primary}
                  />
                </View>
                {isSelected ? <View style={styles.selectionDot} /> : null}
              </View>
              <View style={styles.textBlock}>
                <Text style={[styles.label, isSelected && styles.labelSelected]}>
                  {option.label}
                </Text>
                <Text
                  style={[
                    styles.description,
                    isSelected && styles.descriptionSelected,
                  ]}
                >
                  {option.description}
                </Text>
              </View>
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
    width: '48%',
  },
  pill: {
    minHeight: 64,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: 10,
  },
  pillSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  pillTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleSelected: {
    backgroundColor: colors.primary,
  },
  selectionDot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
  textBlock: {
    flex: 1,
  },
  label: {
    ...typography.body,
    color: colors.ink,
    fontWeight: '700',
  },
  labelSelected: {
    color: colors.primaryDark,
  },
  description: {
    ...typography.bodySmall,
    color: colors.inkTertiary,
    marginTop: 2,
    textTransform: 'none',
    letterSpacing: 0,
  },
  descriptionSelected: {
    color: colors.primaryDark,
  },
});
