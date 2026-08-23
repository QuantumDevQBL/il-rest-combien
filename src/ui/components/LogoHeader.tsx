import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon } from '../design-system';
import { colors, radius, spacing, typography } from '../theme';

interface LogoHeaderProps {
  showTagline?: boolean;
}

export function LogoHeader({ showTagline = false }: LogoHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.logoRow}>
        <View style={styles.iconCircle}>
          <Icon name="cash" size={18} color={colors.background} />
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
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 32,
    height: 32,
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
  tagline: {
    ...typography.bodySmall,
    color: colors.inkTertiary,
    marginTop: spacing.xxs,
    marginLeft: 40,
  },
});
