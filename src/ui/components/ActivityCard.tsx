import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PressableScale } from './PressableScale';
import { Icon, IconName } from '../design-system';
import { colors, radius, shadows, spacing, typography } from '../theme';

interface ActivityCardProps {
  label: string;
  description: string;
  icon: IconName;
  selected: boolean;
  onPress: () => void;
}

export function ActivityCard({
  label,
  description,
  icon,
  selected,
  onPress,
}: ActivityCardProps) {
  return (
    <PressableScale onPress={onPress} scale={0.97} style={styles.container}>
      <View style={[styles.card, selected && styles.cardSelected]}>
        <View style={[styles.iconContainer, selected && styles.iconContainerSelected]}>
          <Icon name={icon} size={28} color={selected ? colors.background : colors.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        {selected && (
          <View style={styles.checkmark}>
            <Icon name="checkmarkCircle" size={20} color={colors.primary} />
          </View>
        )}
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSolid,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
    ...shadows.glow,
  },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: 'rgba(245, 183, 0, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  iconContainerSelected: {
    backgroundColor: colors.primary,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    ...typography.h3,
    color: colors.ink,
    marginBottom: spacing.xxs,
  },
  labelSelected: {
    color: colors.ink,
  },
  description: {
    ...typography.bodySmall,
    color: colors.inkTertiary,
  },
  checkmark: {
    marginLeft: spacing.sm,
  },
});
