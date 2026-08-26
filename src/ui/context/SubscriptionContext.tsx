import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import { trackEvent } from '../utils/analytics';
import {
  loadSubscriptionSnapshot,
  purchaseSubscription,
  restoreSubscription,
  subscribeToSubscriptionUpdates,
} from '../subscription/revenueCat';
import { PremiumSource, SubscriptionPackage, SubscriptionPlan } from '../subscription/types';

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

const SubscriptionContext = createContext<SubscriptionContextValue | null>(null);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [paywallSource, setPaywallSource] = useState<PremiumSource | null>(null);
  const [isPremiumActive, setIsPremiumActive] = useState(false);
  const [packages, setPackages] = useState<SubscriptionPackage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let unsubscribe: (() => void) | undefined;

    const bootstrap = async () => {
      const snapshot = await loadSubscriptionSnapshot();
      if (!isMounted) {
        return;
      }

      setIsPremiumActive(snapshot.isPremiumActive);
      setPackages(snapshot.packages);
      setErrorMessage(snapshot.errorMessage);

      unsubscribe = await subscribeToSubscriptionUpdates((nextIsPremiumActive) => {
        if (!isMounted) {
          return;
        }

        setIsPremiumActive(nextIsPremiumActive);
      });
    };

    void bootstrap();

    return () => {
      isMounted = false;
      unsubscribe?.();
    };
  }, []);

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

    const result = await purchaseSubscription(plan);
    if (result.status === 'purchased') {
      setIsPremiumActive(result.isPremiumActive);
      await trackEvent('purchase_completed', {
        source,
        plan,
        platform: Platform.OS,
      });
      setIsLoading(false);
      return;
    }

    if (result.status === 'cancelled') {
      await trackEvent('purchase_cancelled', {
        source,
        plan,
        platform: Platform.OS,
      });
      setIsLoading(false);
      return;
    }

    setErrorMessage(result.errorMessage);
    await trackEvent('purchase_failed', {
      source,
      plan,
      platform: Platform.OS,
    });
    setIsLoading(false);
  };

  const restorePurchases = async (source: PremiumSource) => {
    setIsLoading(true);
    setErrorMessage(null);

    await trackEvent('restore_started', {
      source,
      platform: Platform.OS,
    });

    const result = await restoreSubscription();
    if (result.status === 'restored') {
      setIsPremiumActive(result.isPremiumActive);
      await trackEvent('restore_completed', {
        source,
        platform: Platform.OS,
      });
      setIsLoading(false);
      return;
    }

    setErrorMessage(result.errorMessage);
    await trackEvent('restore_failed', {
      source,
      platform: Platform.OS,
    });
    setIsLoading(false);
  };

  const value = useMemo<SubscriptionContextValue>(
    () => ({
      isPremiumActive,
      isLoading,
      errorMessage,
      packages,
      openPaywall,
      closePaywall,
      paywallSource,
      purchasePlan,
      restorePurchases,
    }),
    [errorMessage, isLoading, isPremiumActive, packages, paywallSource]
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
