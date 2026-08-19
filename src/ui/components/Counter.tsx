import React, { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { couleurs, spacing, type } from '../theme';
import { formatMontantBrut } from '../utils/format';

interface CounterProps {
  resteSurCent: number;
  totalPrelevements: number;
}

const IS_TEST_ENV = process.env.NODE_ENV === 'test';

export function Counter({ resteSurCent, totalPrelevements }: CounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const animationRef = useRef(new Animated.Value(0)).current;
  const reduceMotionRef = useRef(false);

  useEffect(() => {
    let isMounted = true;
    let removeListener: (() => void) | null = null;

    const startAnimation = () => {
      if (!isMounted) return;

      if (reduceMotionRef.current || IS_TEST_ENV) {
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
    <View style={styles.container}>
      <Text style={styles.eyebrow}>Sur 100 € facturés</Text>
      <Text style={styles.amount}>{formatMontantBrut(displayValue)} €</Text>
      <Text style={styles.subtitle}>dans ta poche</Text>
      <View style={styles.separator} />
      <Text style={styles.prelevements}>
        {formatMontantBrut(totalPrelevements)} € de cotisations et d'impôt
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: couleurs.encre,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
    alignItems: 'center',
  },
  eyebrow: {
    ...type.eyebrow,
    color: couleurs.papier,
    opacity: 0.7,
    marginBottom: spacing.md,
  },
  amount: {
    ...type.compteur,
    color: couleurs.papier,
  },
  subtitle: {
    ...type.corps,
    color: couleurs.papier,
    opacity: 0.8,
    marginTop: spacing.xs,
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: couleurs.papier,
    opacity: 0.2,
    marginVertical: spacing.lg,
  },
  prelevements: {
    ...type.corps,
    color: couleurs.papier,
    opacity: 0.7,
  },
});
