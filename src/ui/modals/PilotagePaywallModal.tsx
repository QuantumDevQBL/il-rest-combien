import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ModalContainer } from '../components/ModalContainer';
import { useSubscriptionContext } from '../context/SubscriptionContext';
import { Badge, Button, Card, Icon } from '../design-system';
import { PremiumSource, SubscriptionPackage } from '../subscription/types';
import { colors, radius, spacing, typography } from '../theme';

interface PilotagePaywallModalProps {
  source: PremiumSource;
  onClose: () => void;
  onSuccess: () => void;
}

function PackageCard({
  item,
  active,
  onPress,
}: {
  item: SubscriptionPackage;
  active: boolean;
  onPress: () => void;
}) {
  const isHighlighted = Boolean(item.highlight);

  return (
    <View
      style={[
        styles.packageCard,
        isHighlighted && styles.packageCardHighlighted,
        active && styles.packageCardActive,
      ]}
    >
      <View style={styles.packageHeader}>
        <View style={styles.packageCopy}>
          <Text style={styles.packageTitle}>{item.title}</Text>
          <Text style={styles.packagePrice}>{item.priceLabel}</Text>
          <Text style={styles.packageCaption}>
            {item.plan === 'annual'
              ? 'La formule la plus avantageuse pour suivre votre activite dans la duree.'
              : 'Souple pour demarrer et tester le Pilotage sur un mois.'}
          </Text>
        </View>
        {item.highlight ? <Badge label={item.highlight} variant="primary" /> : null}
      </View>
      <Button
        label={active ? 'Achat en cours...' : `Choisir ${item.title.toLowerCase()}`}
        onPress={onPress}
        size="md"
        disabled={active}
      />
    </View>
  );
}

export function PilotagePaywallModal({
  source,
  onClose,
  onSuccess,
}: PilotagePaywallModalProps) {
  const {
    isPremiumActive,
    packages,
    isLoading,
    errorMessage,
    purchasePlan,
    restorePurchases,
  } = useSubscriptionContext();

  const orderedPackages = [...packages].sort((left, right) => {
    if (left.highlight && !right.highlight) {
      return -1;
    }

    if (!left.highlight && right.highlight) {
      return 1;
    }

    return 0;
  });

  useEffect(() => {
    if (isPremiumActive) {
      onSuccess();
    }
  }, [isPremiumActive, onSuccess]);

  return (
    <ModalContainer title="Pilotage Premium" onClose={onClose}>
      <Card variant="accent" style={styles.heroCard}>
        <Text style={styles.heroEyebrow}>Pilotage</Text>
        <Text style={styles.heroTitle}>Pilotez ce que vous pouvez reellement garder.</Text>
        <Text style={styles.heroText}>
          Debloquez le suivi mensuel, le disponible estime, la projection annuelle,
          l'objectif de revenu et les alertes personnalisees.
        </Text>
      </Card>

      <Card style={styles.benefitsCard}>
        <View style={styles.benefitsHeader}>
          <Text style={styles.benefitsTitle}>Ce que vous debloquez</Text>
          <Text style={styles.benefitsCaption}>
            Concu pour un suivi mobile, mois apres mois.
          </Text>
        </View>
        <View style={styles.benefits}>
          <View style={styles.benefitRow}>
            <View style={styles.benefitIcon}>
              <Icon name="wallet" size={18} color={colors.primary} />
            </View>
            <View style={styles.benefitCopy}>
              <Text style={styles.benefitTitle}>Disponible estime</Text>
              <Text style={styles.benefitText}>
                Ce que vous pouvez garder apres reserves et charges fixes.
              </Text>
            </View>
          </View>
          <View style={styles.benefitRow}>
            <View style={styles.benefitIcon}>
              <Icon name="statsChart" size={18} color={colors.primary} />
            </View>
            <View style={styles.benefitCopy}>
              <Text style={styles.benefitTitle}>Projection annuelle</Text>
              <Text style={styles.benefitText}>
                Ou vous atterrissez en decembre avec vos mois deja encaisses.
              </Text>
            </View>
          </View>
          <View style={styles.benefitRow}>
            <View style={styles.benefitIcon}>
              <Icon name="trophy" size={18} color={colors.primary} />
            </View>
            <View style={styles.benefitCopy}>
              <Text style={styles.benefitTitle}>Objectif de revenu</Text>
              <Text style={styles.benefitText}>
                Votre cible nette traduite en cap de chiffre d'affaires.
              </Text>
            </View>
          </View>
          <View style={styles.benefitRow}>
            <View style={styles.benefitIcon}>
              <Icon name="warning" size={18} color={colors.primary} />
            </View>
            <View style={styles.benefitCopy}>
              <Text style={styles.benefitTitle}>Alertes personnalisees</Text>
              <Text style={styles.benefitText}>
                Detection previsionnelle des seuils micro et TVA.
              </Text>
            </View>
          </View>
        </View>
      </Card>

      {orderedPackages.length > 0 ? (
        <View style={styles.packages}>
          {orderedPackages.map((item) => (
            <PackageCard
              key={item.plan}
              item={item}
              active={isLoading}
              onPress={() => void purchasePlan(item.plan, source)}
            />
          ))}
        </View>
      ) : !isLoading ? (
        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>Offres temporairement indisponibles</Text>
          <Text style={styles.infoText}>
            Le store ne repond pas pour le moment. Vous pouvez reessayer ou restaurer vos
            achats si vous etes deja abonne.
          </Text>
        </Card>
      ) : (
        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>Chargement des offres...</Text>
          <Text style={styles.infoText}>
            Recuperation des tarifs localises depuis le store.
          </Text>
        </Card>
      )}

      {errorMessage ? (
        <Card style={styles.errorCard}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </Card>
      ) : null}

      <View style={styles.footer}>
        <Text style={styles.footerNote}>Sans compte. Restauration disponible a tout moment.</Text>
        <Button
          label="Restaurer mes achats"
          onPress={() => void restorePurchases(source)}
          variant="ghost"
          size="md"
          disabled={isLoading}
        />
      </View>
    </ModalContainer>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    marginBottom: spacing.sm,
  },
  heroEyebrow: {
    ...typography.overline,
    color: colors.surface,
    opacity: 0.88,
    marginBottom: spacing.xs,
  },
  heroTitle: {
    ...typography.h1,
    color: colors.surface,
    marginBottom: spacing.sm,
  },
  heroText: {
    ...typography.bodySmall,
    color: colors.surface,
    lineHeight: 19,
    opacity: 0.92,
  },
  benefitsCard: {
    gap: spacing.md,
  },
  benefitsHeader: {
    gap: spacing.xxs,
  },
  benefitsTitle: {
    ...typography.body,
    color: colors.ink,
    fontWeight: '800',
  },
  benefitsCaption: {
    ...typography.bodySmall,
    color: colors.inkTertiary,
  },
  benefits: {
    gap: spacing.sm,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  benefitIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitCopy: {
    flex: 1,
  },
  benefitTitle: {
    ...typography.body,
    color: colors.ink,
    fontWeight: '800',
    marginBottom: spacing.xxs,
  },
  benefitText: {
    ...typography.bodySmall,
    color: colors.inkSecondary,
    lineHeight: 18,
  },
  packages: {
    gap: spacing.md,
  },
  packageCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  packageCardHighlighted: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  packageCardActive: {
    opacity: 0.7,
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  packageCopy: {
    flex: 1,
  },
  packageTitle: {
    ...typography.h2,
    color: colors.ink,
  },
  packagePrice: {
    ...typography.bodySmall,
    color: colors.inkSecondary,
    marginTop: spacing.xxs,
  },
  packageCaption: {
    ...typography.bodySmall,
    color: colors.inkTertiary,
    marginTop: spacing.xs,
    lineHeight: 18,
  },
  infoCard: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
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
    lineHeight: 18,
  },
  errorCard: {
    marginTop: spacing.lg,
    backgroundColor: colors.alertLight,
    borderColor: colors.alert,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.ink,
    lineHeight: 18,
  },
  footer: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    gap: spacing.xs,
  },
  footerNote: {
    ...typography.bodySmall,
    color: colors.inkTertiary,
    textAlign: 'center',
  },
});
