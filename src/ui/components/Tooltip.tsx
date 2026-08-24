import React, { useState } from 'react';
import { LayoutRectangle, StyleSheet, Text, View } from 'react-native';
import { PressableScale } from './PressableScale';
import { Icon } from '../design-system';
import { colors, radius, shadows, spacing, typography } from '../theme';

interface TooltipProps {
  content: string;
}

export function Tooltip({ content }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [layout, setLayout] = useState<LayoutRectangle | null>(null);

  return (
    <View
      style={styles.container}
      onLayout={(event) => setLayout(event.nativeEvent.layout)}
    >
      <PressableScale onPress={() => setVisible((v) => !v)} scale={0.85} hitSlop={8}>
        <Icon name="informationCircle" size={18} color={colors.inkTertiary} />
      </PressableScale>
      {visible && layout && (
        <View style={[styles.bubble, { top: layout.height + spacing.xs }]}>
          <Text style={styles.text}>{content}</Text>
          <PressableScale onPress={() => setVisible(false)} scale={0.9} style={styles.close}>
            <Icon name="close" size={14} color={colors.inkTertiary} />
          </PressableScale>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  bubble: {
    position: 'absolute',
    right: 0,
    width: 260,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.md,
    zIndex: 10,
  },
  text: {
    ...typography.bodySmall,
    color: colors.inkSecondary,
    lineHeight: 18,
    paddingRight: spacing.lg,
  },
  close: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
  },
});
