import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon } from '../design-system';
import { colors, spacing, typography } from '../theme';

interface LogoHeaderProps {
  showTagline?: boolean;
}

export function LogoHeader({ showTagline = true }: LogoHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.logoRow}>
        <View style={styles.iconCircle}>
          <Icon name="cash" size={22} color={colors.background} />
        </View>
        <Text style={styles.title}>Il reste combien ?</Text>
      </View>
      {showTagline && <Text style={styles.tagline}>Calculateur micro-entreprise 2026</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  title: {
    ...typography.h2,
    color: colors.ink,
  },
  tagline: {
    ...typography.bodySmall,
    color: colors.inkTertiary,
    marginTop: spacing.xxs,
    marginLeft: 44,
  },
});
