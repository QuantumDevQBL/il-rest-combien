import React, { createContext, useContext, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import { trackEvent } from '../utils/analytics';

export type PremiumSource = 'result' | 'pilotage_tab' | 'monthly_tracking';
export type SubscriptionPlan = 'monthly' | 'annual';

export interface SubscriptionPackage {
  plan: SubscriptionPlan;
  title: string;
  priceLabel: string;
  highlight?: string;
}

interface SubscriptionContextValue {
  isPremiumActive: boolean;
  isLoading: boolean;
  errorMessage: string | null;
  packages: SubscriptionPackage[];
  openPaywall: (source: PremiumSource) => void;
  closePaywall: () => void;
  paywallSource: PremiumSource | null;
  purchasePlan: (plan: SubscriptionPlan, source: PremiumSource) => Promise<void>;
  restorePurchases: (source: PremiumSource) => Promise<void>;
}

const DEFAULT_PACKAGES: SubscriptionPackage[] = [
  {
    plan: 'annual',
    title: 'Annuel',
    priceLabel: '39,99 €/an',
    highlight: 'Le plus avantageux',
  },
  {
    plan: 'monthly',
    title: 'Mensuel',
    priceLabel: '4,99 €/mois',
  },
];

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [paywallSource, setPaywallSource] = useState<PremiumSource | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const openPaywall = (source: PremiumSource) => {
    setErrorMessage(null);
    setPaywallSource(source);
    void trackEvent('paywall_viewed', {
      source,
      platform: Platform.OS,
    });
  };

  const closePaywall = () => {
    setErrorMessage(null);
    setPaywallSource(null);
  };

  const purchasePlan = async (plan: SubscriptionPlan, source: PremiumSource) => {
    setIsLoading(true);
    setErrorMessage(null);
    await trackEvent('purchase_started', {
      source,
      plan,
      platform: Platform.OS,
    });

    await trackEvent('purchase_failed', {
      source,
      plan,
      platform: Platform.OS,
    });

    setErrorMessage(
      'Les achats intégrés seront activés dans la build native. Le parcours Premium est prêt, mais le store n’est pas encore branché ici.'
    );
    setIsLoading(false);
  };

  const restorePurchases = async (source: PremiumSource) => {
    setIsLoading(true);
    setErrorMessage(null);
    await trackEvent('restore_started', {
      source,
      platform: Platform.OS,
    });
    await trackEvent('restore_failed', {
      source,
      platform: Platform.OS,
    });
    setErrorMessage(
      'La restauration des achats sera disponible dès que RevenueCat sera branché dans la build native.'
    );
    setIsLoading(false);
  };

  const value = useMemo<SubscriptionContextValue>(
    () => ({
      isPremiumActive: false,
      isLoading,
      errorMessage,
      packages: DEFAULT_PACKAGES,
      openPaywall,
      closePaywall,
      paywallSource,
      purchasePlan,
      restorePurchases,
    }),
    [errorMessage, isLoading, paywallSource]
  );

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
}

export function useSubscriptionContext() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscriptionContext must be used within SubscriptionProvider');
  }

  return context;
}
