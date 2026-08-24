import React from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { PressableScale } from './PressableScale';
import { Icon, IconName } from '../design-system';
import { ActivityChoice, ACTIVITY_OPTIONS } from '../mapping';
import { colors, radius, shadows, spacing, typography } from '../theme';

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
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 360;
  const gap = isSmallScreen ? spacing.sm : spacing.md;

  return (
    <View style={[styles.grid, { marginHorizontal: -gap / 2 }]}>
      {ACTIVITY_OPTIONS.map((option) => {
        const isSelected = selected === option.value;
        return (
          <PressableScale
            key={option.value}
            onPress={() => onSelect(option.value)}
            scale={0.97}
            style={[styles.item, { width: '50%', padding: gap / 2 }]}
            accessibilityRole="radio"
            accessibilityState={{ checked: isSelected }}
            accessibilityLabel={option.label}
          >
            <View style={[styles.card, isSelected && styles.cardSelected]}>
              <View style={styles.row}>
                <View style={[styles.iconCircle, isSelected && styles.iconCircleSelected]}>
                  <Icon
                    name={ACTIVITY_ICONS[option.value]}
                    size={isSmallScreen ? 22 : 26}
                    color={isSelected ? colors.surface : colors.primary}
                  />
                </View>
                {isSelected && (
                  <View style={styles.checkmark}>
                    <Icon name="checkmarkCircle" size={18} color={colors.primary} />
                  </View>
                )}
              </View>

              <View style={styles.textBlock}>
                <Text
                  style={[styles.label, isSelected && styles.labelSelected]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {option.label}
                </Text>
                <Text style={styles.description} numberOfLines={1}>
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  item: {
    minHeight: 110,
  },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    justifyContent: 'space-between',
    ...shadows.sm,
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
    ...shadows.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleSelected: {
    backgroundColor: colors.primary,
  },
  textBlock: {
    width: '100%',
  },
  label: {
    ...typography.body,
    color: colors.ink,
    fontWeight: '700',
    marginBottom: spacing.xxs,
  },
  labelSelected: {
    color: colors.ink,
  },
  description: {
    ...typography.bodySmall,
    color: colors.inkTertiary,
    fontWeight: '500',
  },
  checkmark: {
    marginLeft: spacing.sm,
  },
});
