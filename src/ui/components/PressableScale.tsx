import React from 'react';
import {
  Animated,
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { animation } from '../theme';

interface PressableScaleProps extends PressableProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  scale?: number;
}

const IS_TEST_ENV = process.env.NODE_ENV === 'test';

export function PressableScale({
  children,
  style,
  scale = 0.96,
  ...props
}: PressableScaleProps) {
  const animatedValue = React.useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    if (IS_TEST_ENV) return;
    Animated.spring(animatedValue, {
      toValue: scale,
      useNativeDriver: true,
      friction: animation.spring.friction,
      tension: animation.spring.tension,
    }).start();
  };

  const onPressOut = () => {
    if (IS_TEST_ENV) return;
    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: true,
      friction: animation.springSoft.friction,
      tension: animation.springSoft.tension,
    }).start();
  };

  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut} {...props}>
      <Animated.View
        style={[
          { transform: [{ scale: IS_TEST_ENV ? 1 : animatedValue }] },
          style,
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}
