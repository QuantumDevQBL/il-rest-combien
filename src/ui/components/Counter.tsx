import React, { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Card, ProgressBar } from '../design-system';
import { colors, spacing, typography } from '../theme';
import { formatMontantBrut } from '../utils/format';

interface CounterProps {
  resteSurCent: number;
  totalPrelevements: number;
  tauxPrelevementGlobal: number;
}

const IS_TEST_ENV = process.env.NODE_ENV === 'test';

export function Counter({
  resteSurCent,
  totalPrelevements,
  tauxPrelevementGlobal,
}: CounterProps) {
  const [displayValue, setDisplayValue] = useState(
    IS_TEST_ENV ? resteSurCent : 0
  );
  const animationRef = useRef(new Animated.Value(0)).current;
  const reduceMotionRef = useRef(false);

  useEffect(() => {
    if (IS_TEST_ENV) return;

    let isMounted = true;
    let removeListener: (() => void) | null = null;

    const startAnimation = () => {
      if (!isMounted) return;

      if (reduceMotionRef.current) {
        setDisplayValue(resteSurCent);
        return;
      }

      const listener = animationRef.addListener(({ value }) => {
        if (isMounted) {
          setDisplayValue(value);
        }
      });
      removeListener = () => animationRef.removeListener(listener);

      Animated.timing(animationRef, {
        toValue: resteSurCent,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    };

    const reduceMotionCheck = AccessibilityInfo?.isReduceMotionEnabled;
    if (typeof reduceMotionCheck === 'function') {
      Promise.resolve(reduceMotionCheck()).then((isEnabled) => {
        if (!isMounted) return;
        reduceMotionRef.current = Boolean(isEnabled);
        startAnimation();
      });
    } else {
      reduceMotionRef.current = false;
      startAnimation();
    }

    return () => {
      isMounted = false;
      animationRef.stopAnimation();
      removeListener?.();
    };
  }, [resteSurCent, animationRef]);

  return (
    <Card variant="accent" style={styles.card}>
      <Text style={styles.eyebrow}>Sur 100 € facturés</Text>
      <Text style={styles.amount}>{formatMontantBrut(displayValue)} €</Text>
      <Text style={styles.subtitle}>dans ta poche</Text>

      <View style={styles.barContainer}>
        <ProgressBar
          segments={[
            { ratio: resteSurCent, color: colors.surface },
            { ratio: 100 - resteSurCent, color: 'rgba(255,255,255,0.35)' },
          ]}
          height={8}
        />
      </View>

      <Text style={styles.prelevements}>
        {formatMontantBrut(totalPrelevements)} € de cotisations et d'impôt
        {' · '}{formatMontantBrut(tauxPrelevementGlobal * 100)} %
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
    padding: spacing.xl,
    alignItems: 'center',
  },
  eyebrow: {
    ...typography.overline,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: spacing.sm,
  },
  amount: {
    ...typography.hero,
    color: colors.surface,
  },
  subtitle: {
    ...typography.body,
    color: 'rgba(255,255,255,0.9)',
    marginTop: spacing.xxs,
  },
  barContainer: {
    width: '100%',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  prelevements: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.85)',
  },
});
