import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PressableScale } from './PressableScale';
import { Icon } from '../design-system';
import { colors, radius, spacing, typography } from '../theme';

interface LogoHeaderProps {
  showTagline?: boolean;
  onSettings?: () => void;
  onHistory?: () => void;
}

export function LogoHeader({
  showTagline = false,
  onSettings,
  onHistory,
}: LogoHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.logoRow}>
        <View style={styles.iconCircle}>
          <Icon name="cash" size={18} color={colors.surface} />
        </View>
        <Text style={styles.title}>Il reste</Text>
      </View>

      {(showTagline || onSettings || onHistory) && (
        <View style={styles.rightRow}>
          {showTagline && (
            <Text style={styles.tagline}>Calculateur micro-entreprise 2026</Text>
          )}
          {onHistory && (
            <PressableScale
              onPress={onHistory}
              scale={0.9}
              accessibilityRole="button"
              accessibilityLabel="Historique"
            >
              <View style={styles.iconButton}>
                <Icon name="time" size={20} color={colors.inkSecondary} />
              </View>
            </PressableScale>
          )}
          {onSettings && (
            <PressableScale
              onPress={onSettings}
              scale={0.9}
              accessibilityRole="button"
              accessibilityLabel="Paramètres fiscaux"
            >
              <View style={styles.iconButton}>
                <Icon name="settings" size={20} color={colors.inkSecondary} />
              </View>
            </PressableScale>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  title: {
    ...typography.h3,
    color: colors.ink,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  tagline: {
    ...typography.bodySmall,
    color: colors.inkTertiary,
    marginRight: spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
});
