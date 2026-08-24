import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
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

function getActivityDescription(value: ActivityChoice): string {
  switch (value) {
    case 'VENTE_MARCHANDISES':
      return 'Commerce, revente';
    case 'PRESTATION_COMMERCIALE':
      return 'Services, conseil';
    case 'PRESTATION_ARTISANALE':
      return 'Artisanat, travaux';
    case 'PROFESSION_LIBERALE':
      return 'Libérale non Cipav';
  }
}

export function ActivityGrid({ selected, onSelect }: ActivityGridProps) {
  return (
    <View style={styles.grid}>
      {ACTIVITY_OPTIONS.map((option) => {
        const isSelected = selected === option.value;
        return (
          <PressableScale
            key={option.value}
            onPress={() => onSelect(option.value)}
            scale={0.97}
            style={styles.item}
            accessibilityRole="radio"
            accessibilityState={{ checked: isSelected }}
            accessibilityLabel={option.label}
          >
            <View style={[styles.card, isSelected && styles.cardSelected]}>
              <View style={[styles.iconCircle, isSelected && styles.iconCircleSelected]}>
                <Icon
                  name={ACTIVITY_ICONS[option.value]}
                  size={26}
                  color={isSelected ? colors.surface : colors.primary}
                />
              </View>
              <Text style={[styles.label, isSelected && styles.labelSelected]} numberOfLines={2}>
                {option.label}
              </Text>
              <Text style={styles.description} numberOfLines={1}>
                {getActivityDescription(option.value)}
              </Text>
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
    marginHorizontal: -spacing.xs,
  },
  item: {
    width: '50%',
    aspectRatio: 1,
    padding: spacing.xs,
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
    width: 54,
    height: 54,
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
    marginBottom: spacing.xxs,
  },
  labelSelected: {
    color: colors.ink,
  },
  description: {
    ...typography.caption,
    color: colors.inkTertiary,
    textAlign: 'center',
  },
  checkmark: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
  },
});
