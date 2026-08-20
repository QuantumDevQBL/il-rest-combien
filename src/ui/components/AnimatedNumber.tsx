import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, TextStyle } from 'react-native';

interface AnimatedNumberProps {
  value: number;
  style?: TextStyle | TextStyle[];
  duration?: number;
  formatter?: (value: number) => string;
}

const IS_TEST_ENV = process.env.NODE_ENV === 'test';

export function AnimatedNumber({
  value,
  style,
  duration = 800,
  formatter = (v) => v.toLocaleString('fr-FR', { maximumFractionDigits: 0 }),
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(IS_TEST_ENV ? value : 0);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const previousValue = useRef(0);

  useEffect(() => {
    if (IS_TEST_ENV) {
      setDisplayValue(value);
      previousValue.current = value;
      return;
    }

    const animation = Animated.timing(animatedValue, {
      toValue: value,
      duration,
      useNativeDriver: true,
    });

    const listener = animatedValue.addListener(({ value: current }) => {
      setDisplayValue(current);
    });

    animation.start();
    previousValue.current = value;

    return () => {
      animatedValue.removeListener(listener);
      animation.stop();
    };
  }, [value, duration, animatedValue]);

  return <Text style={style}>{formatter(displayValue)}</Text>;
}
