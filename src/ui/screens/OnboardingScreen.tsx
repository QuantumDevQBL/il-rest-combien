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

const { width } = Dimensions.get('window');

interface Slide {
  id: string;
  title: string;
  description: string;
  icon: IconName;
}

const SLIDES: Slide[] = [
  {
    id: '1',
    title: 'Combien il te reste vraiment ?',
    description:
      'Saisis ton chiffre d\'affaires et découvre instantanément ce qu\'il te reste après cotisations et impôt sur le revenu.',
    icon: 'cash',
  },
  {
    id: '2',
    title: 'Barème ou versement libératoire ?',
    description:
      'On calcule les deux options d\'impôt et on te dit laquelle est la plus avantageuse pour ta situation.',
    icon: 'swapHorizontal',
  },
  {
    id: '3',
    title: 'Tes données restent chez toi',
    description:
      'Aucune connexion internet, aucun tracking, aucun compte. Tout est calculé directement sur ton téléphone.',
    icon: 'lockClosed',
  },
  {
    id: '4',
    title: 'Périmètre de la V1',
    description:
      'Micro-entrepreneurs en France métropolitaine, barèmes 2026. Professions réglementées (Cipav) non couvertes pour l\'instant.',
    icon: 'shieldCheckmark',
  },
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<Slide>>(null);

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(newIndex);
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

  const renderItem = ({ item }: { item: Slide }) => (
    <View style={styles.slide}>
      <View style={styles.iconCircle}>
        <Icon name={item.icon} size={40} color={colors.background} />
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.skipContainer}>
        <PressableScale onPress={onComplete}>
          <Text style={styles.skipText}>Passer</Text>
        </PressableScale>
      </View>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
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
                style={[
                  styles.dot,
                  isActive && styles.dotActive,
                ]}
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
  },
  slide: {
    width,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
    ...shadows.md,
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
    lineHeight: 26,
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
    opacity: 0.4,
    transform: [{ scale: 0.8 }],
  },
  dotActive: {
    backgroundColor: colors.primary,
    opacity: 1,
    transform: [{ scale: 1 }],
  },
});
