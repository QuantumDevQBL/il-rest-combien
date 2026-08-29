import React, { useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
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
  const [containerWidth, setContainerWidth] = useState(0);

  const cardWidth = useMemo(() => {
    if (containerWidth <= 0) {
      return undefined;
    }

    const availableWidth = containerWidth - spacing.xs;
    return availableWidth / 2;
  }, [containerWidth]);

  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  return (
    <View style={styles.grid} onLayout={handleLayout}>
      {ACTIVITY_OPTIONS.map((option) => {
        const isSelected = selected === option.value;

        return (
          <PressableScale
            key={option.value}
            onPress={() => onSelect(option.value)}
            scale={0.98}
            style={[styles.item, cardWidth ? { width: cardWidth } : styles.itemFallback]}
            accessibilityRole="radio"
            accessibilityState={{ checked: isSelected }}
            accessibilityLabel={option.label}
          >
            <View style={[styles.pill, isSelected && styles.pillSelected]}>
              <View style={styles.selectionBadge}>
                <View
                  style={[
                    styles.selectionDot,
                    !isSelected && styles.selectionDotHidden,
                  ]}
                />
              </View>
              <View style={[styles.iconCircle, isSelected && styles.iconCircleSelected]}>
                <Icon
                  name={ACTIVITY_ICONS[option.value]}
                  size={16}
                  color={isSelected ? colors.surface : colors.primary}
                />
              </View>
              <Text style={[styles.label, isSelected && styles.labelSelected]} numberOfLines={2}>
                {getActivityLabel(option.value)}
              </Text>
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
    justifyContent: 'space-between',
    rowGap: spacing.xs,
  },
  item: {
    flexGrow: 0,
  },
  itemFallback: {
    width: '48%',
  },
  pill: {
    minHeight: 112,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pillSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  selectionBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 10,
    height: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
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
  selectionDotHidden: {
    opacity: 0,
  },
  label: {
    ...typography.caption,
    color: colors.ink,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 16,
    minHeight: 32,
    width: '100%',
  },
  labelSelected: {
    color: colors.primaryDark,
  },
});
