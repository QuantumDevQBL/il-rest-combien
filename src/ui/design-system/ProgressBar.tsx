import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from './tokens';

interface Segment {
  ratio: number;
  color: string;
}

interface ProgressBarProps {
  segments: Segment[];
  height?: number;
}

export function ProgressBar({ segments, height = 12 }: ProgressBarProps) {
  const total = segments.reduce((sum, s) => sum + s.ratio, 0);
  const safeTotal = total > 0 ? total : 1;

  return (
    <View style={[styles.track, { height }]}>
      {segments.map((segment, index) => (
        <View
          key={index}
          style={[
            styles.segment,
            {
              flex: segment.ratio / safeTotal,
              backgroundColor: segment.color,
            },
            index === 0 && styles.firstSegment,
            index === segments.length - 1 && styles.lastSegment,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: colors.surfaceSecondary,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  segment: {
    height: '100%',
    marginRight: spacing.xxs,
  },
  firstSegment: {
    borderTopLeftRadius: radius.full,
    borderBottomLeftRadius: radius.full,
  },
  lastSegment: {
    borderTopRightRadius: radius.full,
    borderBottomRightRadius: radius.full,
    marginRight: 0,
  },
});
