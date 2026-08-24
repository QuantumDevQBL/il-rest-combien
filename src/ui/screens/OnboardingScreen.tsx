import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Icon, IconName } from '../design-system';
import { colors, shadows, spacing, typography } from '../theme';
import { PressableScale } from '../components/PressableScale';
import { hapticSelection } from '../utils/haptics';

const { width } = Dimensions.get('window');

interface Slide {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  kicker: string;
}

const SLIDES: Slide[] = [
  {
    id: '1',
    kicker: 'Le besoin',
    title: 'Tu saisis ton CA, tu vois ton vrai net',
    description:
      "Pas un simulateur administratif de plus. L'app répond vite à la vraie question d'un freelance : combien il me reste réellement ?",
    icon: 'cash',
  },
  {
    id: '2',
    kicker: 'La valeur',
    title: 'Cotisations, impôt, reste sur 100 €',
    description:
      "Le résultat met d'abord l'essentiel en avant : ton net mensuel, ton net annuel et la part absorbée par les prélèvements.",
    icon: 'statsChart',
  },
  {
    id: '3',
    kicker: 'Le cadre',
    title: 'Simple, local, pensé pour la micro',
    description:
      "Barèmes 2026, calcul local sur le téléphone, paramètres avancés seulement si tu veux affiner. Tu peux commencer sans tout renseigner.",
    icon: 'shieldCheckmark',
  },
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<Slide>>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(newIndex);
    void hapticSelection();
  };

  const goToNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    } else {
      onComplete();
    }
  };

  const renderItem = ({ item, index }: { item: Slide; index: number }) => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.2, 1, 0.2],
      extrapolate: 'clamp',
    });
    const translateY = scrollX.interpolate({
      inputRange,
      outputRange: [24, 0, 24],
      extrapolate: 'clamp',
    });
    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.92, 1, 0.92],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[styles.slide, { opacity, transform: [{ translateY }, { scale }] }]}>
        <View style={styles.iconCircle}>
          <Icon name={item.icon} size={44} color={colors.background} />
        </View>
        <Text style={styles.kicker}>{item.kicker}</Text>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.skipContainer}>
        <PressableScale onPress={onComplete} scale={0.95}>
          <Text style={styles.skipText}>Passer</Text>
        </PressableScale>
      </View>

      <Animated.FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: false,
        })}
        onScrollToIndexFailed={() => {
          // Fallback for environments where layout metrics are unavailable (tests).
        }}
        scrollEventThrottle={16}
      />

      <View style={styles.footer}>
        <View style={styles.progressContainer}>
          {SLIDES.map((_, index) => {
            const isActive = index === currentIndex;
            return (
              <Animated.View
                key={index}
                style={[styles.dot, isActive && styles.dotActive]}
              />
            );
          })}
        </View>

        <Button
          label={currentIndex === SLIDES.length - 1 ? 'Commencer' : 'Suivant'}
          onPress={goToNext}
          variant="primary"
          size="lg"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  skipContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  skipText: {
    ...typography.bodySmall,
    color: colors.inkTertiary,
    fontWeight: '600',
  },
  slide: {
    width,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    ...shadows.md,
  },
  kicker: {
    ...typography.overline,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.h1,
    color: colors.ink,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  description: {
    ...typography.body,
    color: colors.inkSecondary,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.inkTertiary,
    opacity: 0.3,
    transform: [{ scale: 0.85 }],
  },
  dotActive: {
    width: 22,
    borderRadius: 4,
    backgroundColor: colors.primary,
    opacity: 1,
    transform: [{ scale: 1 }],
  },
});
