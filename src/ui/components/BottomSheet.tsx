import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  ScrollView,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { PressableScale } from './PressableScale';
import { Icon } from '../design-system';
import { colors, radius, shadows, spacing } from '../theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BottomSheetProps {
  children: React.ReactNode;
  collapsedHeight?: number;
  expandedHeight?: number;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  showHandle?: boolean;
  scrollEnabled?: boolean;
  style?: ViewStyle;
}

export function BottomSheet({
  children,
  collapsedHeight = SCREEN_HEIGHT * 0.28,
  expandedHeight = SCREEN_HEIGHT * 0.82,
  expanded: controlledExpanded,
  onExpandedChange,
  showHandle = true,
  scrollEnabled = true,
  style,
}: BottomSheetProps) {
  const isControlled = controlledExpanded !== undefined;
  const [internalExpanded, setInternalExpanded] = useState(false);
  const expandedState = isControlled ? controlledExpanded : internalExpanded;

  const setExpanded = useCallback(
    (value: boolean) => {
      if (!isControlled) setInternalExpanded(value);
      onExpandedChange?.(value);
    },
    [isControlled, onExpandedChange]
  );

  const initialTargetY = SCREEN_HEIGHT - (expandedState ? expandedHeight : collapsedHeight);
  const translateY = useRef(new Animated.Value(initialTargetY)).current;
  const currentY = useRef(initialTargetY);

  useEffect(() => {
    const targetY = SCREEN_HEIGHT - (expandedState ? expandedHeight : collapsedHeight);
    Animated.spring(translateY, {
      toValue: targetY,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();
    currentY.current = targetY;
  }, [expandedState, collapsedHeight, expandedHeight, translateY]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        translateY.stopAnimation((value) => {
          currentY.current = value;
        });
      },
      onPanResponderMove: (_, gestureState) => {
        const newY = currentY.current + gestureState.dy;
        const minY = SCREEN_HEIGHT - expandedHeight;
        const maxY = SCREEN_HEIGHT - collapsedHeight;
        const clampedY = Math.max(minY, Math.min(maxY, newY));
        translateY.setValue(clampedY);
      },
      onPanResponderRelease: (_, gestureState) => {
        const minY = SCREEN_HEIGHT - expandedHeight;
        const maxY = SCREEN_HEIGHT - collapsedHeight;
        const threshold = (minY + maxY) / 2;
        const shouldExpand = currentY.current + gestureState.dy < threshold;
        setExpanded(shouldExpand);
      },
    })
  ).current;

  const handlePress = () => {
    setExpanded(!expandedState);
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          height: expandedHeight,
        },
        style,
      ]}
    >
      <PressableScale onPress={handlePress} scale={0.98} style={styles.header}>
        {showHandle && (
          <View style={styles.handleContainer} {...panResponder.panHandlers}>
            <View style={styles.handle} />
          </View>
        )}
        <View style={styles.expandHint}>
          <Icon name={expandedState ? 'chevronDown' : 'chevronUp'} size={20} color={colors.inkTertiary} />
        </View>
      </PressableScale>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={scrollEnabled && expandedState}
      >
        {children}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.lg,
    overflow: 'hidden',
  },
  header: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    alignItems: 'center',
  },
  handleContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.inkTertiary,
  },
  expandHint: {
    marginTop: spacing.xxs,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
});
