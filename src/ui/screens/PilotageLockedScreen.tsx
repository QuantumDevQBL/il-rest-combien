import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PressableScale } from '../components/PressableScale';
import { useSubscriptionContext } from '../context/SubscriptionContext';
import { Badge, Button, Card, Icon } from '../design-system';
import { PremiumSource, SubscriptionPackage } from '../subscription/types';
import { colors, radius, spacing, typography } from '../theme';

interface PilotageLockedScreenProps {
  onGoToSimulation: () => void;
}

function BenefitCard({
  icon,
  title,
  description,
}: {
  icon: 'wallet' | 'statsChart' | 'trophy' | 'warning';
  title: string;
  description: string;
}) {
  return (
    <View style={styles.benefitCard}>
      <View style={styles.benefitIcon}>
        <Icon name={icon} size={18} color={colors.primary} />
      </View>
      <Text style={styles.benefitTitle}>{title}</Text>
      <Text style={styles.benefitText}>{description}</Text>
    </View>
  );
}

function PackageCard({
  item,
  active,
  source,
  onPress,
}: {
  item: SubscriptionPackage;
  active: boolean;
  source: PremiumSource;
  onPress: (plan: SubscriptionPackage['plan'], source: PremiumSource) => void;
}) {
  const isHighlighted = Boolean(item.highlight);

  return (
    <Card style={[styles.packageCard, isHighlighted && styles.packageCardHighlighted]}>
      <View style={styles.packageHeader}>
        <View style={styles.packageCopy}>
          <View style={styles.packageTitleRow}>
            <Text style={styles.packageTitle}>{item.title}</Text>
            {item.highlight ? <Badge label={item.highlight} variant="primary" /> : null}
          </View>
          <Text style={styles.packagePrice}>{item.priceLabel}</Text>
          <Text style={styles.packageCaption}>
            {item.plan === 'annual'
              ? 'Le meilleur choix pour suivre votre activite toute l annee.'
              : 'Souple pour demarrer avec Pilotage.'}
          </Text>
        </View>
      </View>

      <Button
        label={active ? 'Achat en cours...' : `Choisir ${item.title.toLowerCase()}`}
        onPress={() => onPress(item.plan, source)}
        size="md"
        disabled={active}
      />
    </Card>
  );
}

export function PilotageLockedScreen({ onGoToSimulation }: PilotageLockedScreenProps) {
  const {
    packages,
    isLoading,
    errorMessage,
    purchasePlan,
    restorePurchases,
    paywallSource,
  } = useSubscriptionContext();

  const source = paywallSource ?? 'pilotage_tab';
  const orderedPackages = [...packages].sort((left, right) => {
    if (left.highlight && !right.highlight) {
      return -1;
    }

    if (!left.highlight && right.highlight) {
      return 1;
    }

    return 0;
  });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>Pilotage Premium</Text>
          <Text style={styles.title}>Pilotez ce que vous pouvez reellement garder.</Text>
        </View>
        <Button label="Retour" variant="secondary" size="md" onPress={onGoToSimulation} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Card variant="accent" style={styles.heroCard}>
          <Text style={styles.heroTitle}>Un vrai espace de pilotage, pas juste un resultat.</Text>
          <Text style={styles.heroText}>
            Disponible estime, projection annuelle, objectif de revenu et alertes personnalisees.
          </Text>
        </Card>

        <View style={styles.benefitGrid}>
          <BenefitCard
            icon="wallet"
            title="Disponible estime"
            description="Ce que vous pouvez garder apres reserves et charges fixes."
          />
          <BenefitCard
            icon="statsChart"
            title="Projection annuelle"
            description="Ou vous atterrissez en decembre au rythme actuel."
          />
          <BenefitCard
            icon="trophy"
            title="Objectif de revenu"
            description="Votre net cible traduit en cap de chiffre d affaires."
          />
          <BenefitCard
            icon="warning"
            title="Alertes personnalisees"
            description="Des seuils predictifs utiles avant d etre surpris."
          />
        </View>

        {orderedPackages.length > 0 ? (
          <View style={styles.packageStack}>
            {orderedPackages.map((item) => (
              <PackageCard
                key={item.plan}
                item={item}
                active={isLoading}
                source={source}
                onPress={(plan, currentSource) => void purchasePlan(plan, currentSource)}
              />
            ))}
          </View>
        ) : (
          <Card style={styles.infoCard}>
            <Text style={styles.infoTitle}>
              {isLoading ? 'Chargement des offres...' : 'Offres temporairement indisponibles'}
            </Text>
            <Text style={styles.infoText}>
              {isLoading
                ? 'Recuperation des tarifs localises depuis le store.'
                : 'Le store ne repond pas pour le moment. Vous pouvez reessayer ou restaurer vos achats si vous etes deja abonne.'}
            </Text>
          </Card>
        )}

        {errorMessage ? (
          <Card style={styles.errorCard}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </Card>
        ) : null}

        <PressableScale
          onPress={() => void restorePurchases(source)}
          scale={0.98}
          disabled={isLoading}
          accessibilityRole="button"
          accessibilityLabel="Restaurer mes achats"
        >
          <View style={styles.restoreRow}>
            <Text style={styles.restoreLabel}>Restaurer mes achats</Text>
            <Icon name="arrowForward" size={16} color={colors.primary} />
          </View>
        </PressableScale>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  headerCopy: {
    flex: 1,
  },
  eyebrow: {
    ...typography.overline,
    color: colors.primary,
    marginBottom: spacing.xxs,
  },
  title: {
    ...typography.h1,
    color: colors.ink,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
    gap: spacing.md,
  },
  heroCard: {
    gap: spacing.sm,
  },
  heroTitle: {
    ...typography.h2,
    color: colors.surface,
  },
  heroText: {
    ...typography.bodySmall,
    color: colors.surface,
    opacity: 0.9,
  },
  benefitGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  benefitCard: {
    width: '48.5%',
    minHeight: 154,
    padding: spacing.md,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  benefitIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  benefitTitle: {
    ...typography.bodySmall,
    color: colors.ink,
    fontWeight: '800',
    marginBottom: spacing.xxs,
  },
  benefitText: {
    ...typography.bodySmall,
    color: colors.inkSecondary,
  },
  packageStack: {
    gap: spacing.sm,
  },
  packageCard: {
    gap: spacing.md,
  },
  packageCardHighlighted: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  packageHeader: {
    gap: spacing.xs,
  },
  packageCopy: {
    gap: spacing.xxs,
  },
  packageTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.sm,
  },
  packageTitle: {
    ...typography.h2,
    color: colors.ink,
  },
  packagePrice: {
    ...typography.body,
    color: colors.inkSecondary,
  },
  packageCaption: {
    ...typography.bodySmall,
    color: colors.inkTertiary,
  },
  infoCard: {
    backgroundColor: colors.surfaceElevated,
  },
  infoTitle: {
    ...typography.body,
    color: colors.ink,
    fontWeight: '800',
    marginBottom: spacing.xxs,
  },
  infoText: {
    ...typography.bodySmall,
    color: colors.inkSecondary,
  },
  errorCard: {
    backgroundColor: colors.alertLight,
    borderColor: colors.alert,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.ink,
  },
  restoreRow: {
    minHeight: 48,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
  },
  restoreLabel: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '800',
  },
});
