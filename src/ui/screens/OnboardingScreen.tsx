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
import { Button, Card, Icon, IconName } from '../design-system';
import { colors, radius, shadows, spacing, typography } from '../theme';
import { PressableScale } from '../components/PressableScale';
import { hapticSelection } from '../utils/haptics';

const { width } = Dimensions.get('window');
const SLIDE_WIDTH = width;

interface Slide {
  id: string;
  kicker: string;
  title: string;
  description: string;
  icon: IconName;
  statLabel: string;
  statValue: string;
  bullets: [string, string];
}

const SLIDES: Slide[] = [
  {
    id: '1',
    kicker: 'Le vrai sujet',
    title: 'Votre vrai revenu, avant de le depenser',
    description:
      "Vous saisissez votre CA et l'app vous montre tout de suite ce que vous pouvez vraiment garder.",
    icon: 'wallet',
    statLabel: 'Lecture immediate',
    statValue: 'Net mensuel',
    bullets: ['Simulation rapide', 'Sans compte'],
  },
  {
    id: '2',
    kicker: 'La decision',
    title: 'Comprendre ce qui part et ce qui reste',
    description:
      'Cotisations, impot, reste sur 100 EUR et option fiscale sont reunis dans une lecture claire.',
    icon: 'statsChart',
    statLabel: 'Vue utile',
    statValue: 'Reste sur 100',
    bullets: ['Detail lisible', 'Alertes essentielles'],
  },
  {
    id: '3',
    kicker: 'Le pilotage',
    title: 'Suivre votre activite mois apres mois',
    description:
      'Ajoutez vos encaissements, anticipez vos reserves et gardez une vision nette de votre annee.',
    icon: 'sparkles',
    statLabel: 'Bientot actif',
    statValue: 'Pilotage',
    bullets: ['Projection annuelle', 'Objectif de revenu'],
  },
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

function SlideChip({ label }: { label: string }) {
  return (
    <View style={styles.chip}>
      <Text style={styles.chipText}>{label}</Text>
    </View>
  );
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<Slide>>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / SLIDE_WIDTH);
    setCurrentIndex(newIndex);
    void hapticSelection();
  };

  const goToNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      return;
    }

    onComplete();
  };

  const renderItem = ({ item, index }: { item: Slide; index: number }) => {
    const inputRange = [(index - 1) * SLIDE_WIDTH, index * SLIDE_WIDTH, (index + 1) * SLIDE_WIDTH];
    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.25, 1, 0.25],
      extrapolate: 'clamp',
    });
    const translateY = scrollX.interpolate({
      inputRange,
      outputRange: [26, 0, 26],
      extrapolate: 'clamp',
    });
    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.94, 1, 0.94],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[styles.slide, { opacity, transform: [{ translateY }, { scale }] }]}>
        <View style={styles.heroShell}>
          <View style={styles.orbLarge} />
          <View style={styles.orbSmall} />

          <View style={styles.topLine}>
            <Text style={styles.brandMark}>Quantumdev</Text>
            <SlideChip label={item.kicker} />
          </View>

          <View style={styles.iconHero}>
            <Icon name={item.icon} size={30} color={colors.surface} />
          </View>

          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>

          <Card style={styles.previewCard}>
            <View style={styles.previewHeader}>
              <Text style={styles.previewLabel}>{item.statLabel}</Text>
              <View style={styles.previewBadge}>
                <Text style={styles.previewBadgeText}>{item.statValue}</Text>
              </View>
            </View>

            <View style={styles.previewMetricRow}>
              <View style={styles.previewMetric}>
                <Text style={styles.previewMetricValue}>2 980 EUR</Text>
                <Text style={styles.previewMetricCaption}>Disponible estime</Text>
              </View>
              <View style={styles.previewMetricDivider} />
              <View style={styles.previewMetric}>
                <Text style={styles.previewMetricValue}>1 020 EUR</Text>
                <Text style={styles.previewMetricCaption}>A reserver</Text>
              </View>
            </View>

            <View style={styles.chipsRow}>
              {item.bullets.map((bullet) => (
                <SlideChip key={bullet} label={bullet} />
              ))}
            </View>
          </Card>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.skipContainer}>
        <PressableScale onPress={onComplete} scale={0.97}>
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
          // Metrics may be unavailable in tests.
        }}
        scrollEventThrottle={16}
      />

      <View style={styles.footer}>
        <View style={styles.progressRow}>
          {SLIDES.map((slide, index) => {
            const isActive = index === currentIndex;
            return <View key={slide.id} style={[styles.dot, isActive && styles.dotActive]} />;
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
    color: colors.inkSecondary,
    fontWeight: '700',
  },
  slide: {
    width: SLIDE_WIDTH,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  heroShell: {
    flex: 1,
    borderRadius: radius.xxl,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    overflow: 'hidden',
    ...shadows.lg,
  },
  orbLarge: {
    position: 'absolute',
    top: -56,
    right: -32,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.primaryLight,
  },
  orbSmall: {
    position: 'absolute',
    bottom: 84,
    left: -28,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.secondaryLight,
  },
  topLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  brandMark: {
    ...typography.caption,
    color: colors.inkTertiary,
  },
  iconHero: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    ...shadows.primaryGlow,
  },
  title: {
    ...typography.h1,
    color: colors.ink,
    marginBottom: spacing.sm,
    maxWidth: 280,
  },
  description: {
    ...typography.body,
    color: colors.inkSecondary,
    lineHeight: 22,
    maxWidth: 320,
    marginBottom: spacing.xl,
  },
  previewCard: {
    marginTop: 'auto',
    backgroundColor: colors.surfaceGlass,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  previewLabel: {
    ...typography.caption,
    color: colors.inkTertiary,
  },
  previewBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
  },
  previewBadgeText: {
    ...typography.caption,
    color: colors.primaryDark,
  },
  previewMetricRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  previewMetric: {
    flex: 1,
  },
  previewMetricDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.sm,
  },
  previewMetricValue: {
    ...typography.h2,
    color: colors.ink,
    marginBottom: spacing.xxs,
  },
  previewMetricCaption: {
    ...typography.bodySmall,
    color: colors.inkSecondary,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  chip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.full,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipText: {
    ...typography.caption,
    color: colors.inkSecondary,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    paddingTop: spacing.sm,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.inkTertiary,
    opacity: 0.26,
  },
  dotActive: {
    width: 26,
    backgroundColor: colors.primary,
    opacity: 1,
  },
});
