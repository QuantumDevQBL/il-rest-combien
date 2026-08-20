import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';

interface FadeInViewProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  delay?: number;
  duration?: number;
  translateY?: number;
}

const IS_TEST_ENV = process.env.NODE_ENV === 'test';

export function FadeInView({
  children,
  style,
  delay = 0,
  duration = 500,
  translateY = 20,
}: FadeInViewProps) {
  const opacity = useRef(new Animated.Value(IS_TEST_ENV ? 1 : 0)).current;
  const translate = useRef(new Animated.Value(IS_TEST_ENV ? 0 : translateY)).current;

  useEffect(() => {
    if (IS_TEST_ENV) return;

    const animation = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translate, {
        toValue: 0,
        duration,
        delay,
        useNativeDriver: true,
      }),
    ]);

    animation.start();

    return () => {
      animation.stop();
    };
  }, [delay, duration, opacity, translate]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity,
          transform: [{ translateY: translate }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
