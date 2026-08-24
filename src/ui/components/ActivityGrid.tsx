import React from 'react';
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
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
  const { width, height } = useWindowDimensions();
  const isCompact = width < 360 || height < 700;
  const iconSize = isCompact ? 26 : 30;
  const circleSize = isCompact ? 48 : 56;
  const columnPadding = isCompact ? spacing.xs : spacing.sm;
  const cardMinHeight = isCompact ? 152 : 168;

  return (
    <View style={styles.grid}>
      {ACTIVITY_OPTIONS.map((option) => {
        const isSelected = selected === option.value;
        return (
          <PressableScale
            key={option.value}
            onPress={() => onSelect(option.value)}
            scale={0.96}
            style={[
              styles.item,
              {
                paddingHorizontal: columnPadding,
                marginBottom: isCompact ? spacing.sm : spacing.md,
              },
            ]}
            accessibilityRole="radio"
            accessibilityState={{ checked: isSelected }}
            accessibilityLabel={option.label}
          >
            <View
              style={[
                styles.card,
                isSelected && styles.cardSelected,
                { minHeight: cardMinHeight },
              ]}
            >
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
              <View style={styles.textBlock}>
                <Text
                  style={[styles.label, isSelected && styles.labelSelected]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.85}
                >
                  {option.label}
                </Text>
                <Text style={styles.description} numberOfLines={1} adjustsFontSizeToFit>
                  {option.description}
                </Text>
              </View>
              {isSelected && (
                <View style={styles.checkmark}>
                  <Icon name="checkmarkCircle" size={18} color={colors.primary} />
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
    marginHorizontal: -spacing.xs,
  },
  item: {
    width: '50%',
  },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
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
  textBlock: {
    alignItems: 'center',
    width: '100%',
  },
  label: {
    ...typography.body,
    color: colors.ink,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.xxs,
    minHeight: 20,
  },
  labelSelected: {
    color: colors.primaryDark,
  },
  description: {
    ...typography.bodySmall,
    color: colors.inkTertiary,
    textAlign: 'center',
    minHeight: 17,
  },
  checkmark: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
  },
});
