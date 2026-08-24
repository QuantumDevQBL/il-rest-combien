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
  const iconSize = isSmallScreen ? 28 : 34;
  const circleSize = isSmallScreen ? 54 : 64;

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
              <View
                style={[
                  styles.iconCircle,
                  isSelected && styles.iconCircleSelected,
                  { width: circleSize, height: circleSize },
                ]}
              >
                <Icon
                  name={ACTIVITY_ICONS[option.value]}
                  size={iconSize}
                  color={isSelected ? colors.surface : colors.primary}
                />
              </View>
              <Text
                style={[styles.label, isSelected && styles.labelSelected]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.8}
              >
                {option.label}
              </Text>
              {isSelected && (
                <View style={styles.checkmark}>
                  <Icon name="checkmarkCircle" size={20} color={colors.primary} />
                </View>
              )}
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
    aspectRatio: 1,
  },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
    ...shadows.md,
  },
  iconCircle: {
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  iconCircleSelected: {
    backgroundColor: colors.primary,
  },
  label: {
    ...typography.body,
    color: colors.ink,
    fontWeight: '700',
    textAlign: 'center',
    maxWidth: '100%',
  },
  labelSelected: {
    color: colors.ink,
  },
  checkmark: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
  },
});
