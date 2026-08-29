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
            <View style={[styles.rowCard, isSelected && styles.rowCardSelected]}>
              <View style={[styles.iconCircle, isSelected && styles.iconCircleSelected]}>
                <Icon
                  name={ACTIVITY_ICONS[option.value]}
                  size={18}
                  color={isSelected ? colors.surface : colors.primary}
                />
              </View>

              <View style={styles.content}>
                <Text style={[styles.label, isSelected && styles.labelSelected]}>
                  {getActivityLabel(option.value)}
                </Text>
                <Text style={[styles.meta, isSelected && styles.metaSelected]}>
                  {option.label}
                </Text>
              </View>

              <View style={[styles.selectionBadge, isSelected && styles.selectionBadgeSelected]}>
                <View
                  style={[
                    styles.selectionDot,
                    !isSelected && styles.selectionDotHidden,
                  ]}
                />
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
    gap: spacing.xs,
  },
  item: {
    width: '100%',
  },
  rowCard: {
    minHeight: 88,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: spacing.sm,
  },
  rowCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconCircleSelected: {
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
    gap: spacing.xxs,
  },
  label: {
    ...typography.body,
    color: colors.ink,
    fontWeight: '800',
  },
  labelSelected: {
    color: colors.primaryDark,
  },
  meta: {
    ...typography.bodySmall,
    color: colors.inkSecondary,
  },
  metaSelected: {
    color: colors.primaryDark,
  },
  selectionBadge: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  selectionBadgeSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
  },
  selectionDot: {
    width: 10,
    height: 10,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
  },
  selectionDotHidden: {
    opacity: 0,
  },
});
