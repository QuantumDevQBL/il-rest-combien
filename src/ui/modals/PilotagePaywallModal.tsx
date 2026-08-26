import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Badge, Button, Card, Icon } from '../design-system';
import { ModalContainer } from '../components/ModalContainer';
import { useSubscriptionContext } from '../context/SubscriptionContext';
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
  return (
    <View style={[styles.packageCard, active && styles.packageCardActive]}>
      <View style={styles.packageHeader}>
        <View>
          <Text style={styles.packageTitle}>{item.title}</Text>
          <Text style={styles.packagePrice}>{item.priceLabel}</Text>
        </View>
        {item.highlight ? <Badge label={item.highlight} variant="primary" /> : null}
      </View>
      <Button
        label={active ? 'Achat en cours…' : `Choisir ${item.title.toLowerCase()}`}
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

  useEffect(() => {
    if (isPremiumActive) {
      onSuccess();
    }
  }, [isPremiumActive, onSuccess]);

  return (
    <ModalContainer title="Pilotage Premium" onClose={onClose}>
      <Card variant="accent" style={styles.heroCard}>
        <Text style={styles.heroEyebrow}>Pilotage</Text>
        <Text style={styles.heroTitle}>Pilotez ce que vous pouvez réellement garder.</Text>
        <Text style={styles.heroText}>
          Débloquez le suivi mensuel, le disponible estimé, la projection annuelle,
          l’objectif de revenu et les alertes personnalisées.
        </Text>
      </Card>

      <View style={styles.benefits}>
        <View style={styles.benefitRow}>
          <View style={styles.benefitIcon}>
            <Icon name="wallet" size={18} color={colors.primary} />
          </View>
          <View style={styles.benefitCopy}>
            <Text style={styles.benefitTitle}>Disponible estimé</Text>
            <Text style={styles.benefitText}>
              Ce que vous pouvez garder après réserves et charges fixes.
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
              Où vous atterrissez en décembre avec vos mois déjà encaissés.
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
              Votre cible nette traduite en cap de chiffre d’affaires.
            </Text>
          </View>
        </View>
        <View style={styles.benefitRow}>
          <View style={styles.benefitIcon}>
            <Icon name="warning" size={18} color={colors.primary} />
          </View>
          <View style={styles.benefitCopy}>
            <Text style={styles.benefitTitle}>Alertes personnalisées</Text>
            <Text style={styles.benefitText}>
              Détection prévisionnelle des seuils micro et TVA.
            </Text>
          </View>
        </View>
      </View>

      {packages.length > 0 ? (
        <View style={styles.packages}>
          {packages.map((item) => (
            <PackageCard
              key={item.plan}
              item={item}
              active={isLoading}
              onPress={() => void purchasePlan(item.plan, source)}
            />
          ))}
        </View>
      ) : null}

      {errorMessage ? (
        <Card style={styles.errorCard}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </Card>
      ) : null}

      <View style={styles.footer}>
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
    marginBottom: spacing.lg,
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
  benefits: {
    gap: spacing.md,
    marginBottom: spacing.lg,
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
  packageTitle: {
    ...typography.h2,
    color: colors.ink,
  },
  packagePrice: {
    ...typography.bodySmall,
    color: colors.inkSecondary,
    marginTop: spacing.xxs,
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
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
});
