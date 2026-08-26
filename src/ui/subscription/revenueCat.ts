import { Platform } from 'react-native';
import Purchases, {
  CustomerInfo,
  LOG_LEVEL,
  PACKAGE_TYPE,
  PurchasesConfiguration,
  PurchasesPackage,
} from 'react-native-purchases';
import {
  SubscriptionPackage,
  SubscriptionPlan,
  SubscriptionPurchaseResult,
  SubscriptionRestoreResult,
  SubscriptionSnapshot,
} from './types';

const PILOTAGE_ENTITLEMENT = 'pilotage';
const FALLBACK_PACKAGES: SubscriptionPackage[] = [
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

let isConfigured = false;

function getApiKey(): string | null {
  const testFallbackKey = process.env.NODE_ENV === 'test' ? 'revenuecat_test_key' : null;

  if (Platform.OS === 'ios') {
    return process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY ?? testFallbackKey;
  }

  if (Platform.OS === 'android') {
    return process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY ?? testFallbackKey;
  }

  return null;
}

function getUnavailableSnapshot(message: string): SubscriptionSnapshot {
  return {
    isPremiumActive: false,
    packages: FALLBACK_PACKAGES,
    errorMessage: message,
  };
}

function hasPilotageEntitlement(customerInfo: CustomerInfo): boolean {
  return Boolean(customerInfo.entitlements.active[PILOTAGE_ENTITLEMENT]?.isActive);
}

function mapPackageTypeToPlan(packageType: PACKAGE_TYPE): SubscriptionPlan | null {
  if (packageType === PACKAGE_TYPE.ANNUAL) {
    return 'annual';
  }

  if (packageType === PACKAGE_TYPE.MONTHLY) {
    return 'monthly';
  }

  return null;
}

function mapPackages(packages: PurchasesPackage[]): SubscriptionPackage[] {
  const mappedPackages: SubscriptionPackage[] = [];

  packages.forEach((item) => {
    const plan = mapPackageTypeToPlan(item.packageType);
    if (!plan) {
      return;
    }

    mappedPackages.push({
      plan,
      title: plan === 'annual' ? 'Annuel' : 'Mensuel',
      priceLabel: item.product.priceString,
      ...(plan === 'annual' ? { highlight: 'Le plus avantageux' } : {}),
    });
  });

  return mappedPackages.sort((left, right) => {
    if (left.plan === right.plan) {
      return 0;
    }

    return left.plan === 'annual' ? -1 : 1;
  });
}

function getStoreErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
}

function isPurchaseCancelled(error: unknown): boolean {
  if (!error || typeof error !== 'object') {
    return false;
  }

  return Boolean((error as { userCancelled?: boolean }).userCancelled);
}

async function ensureConfigured(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return false;
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    return false;
  }

  if (isConfigured) {
    return true;
  }

  if (__DEV__) {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  }

  const configuration: PurchasesConfiguration = { apiKey };
  Purchases.configure(configuration);
  isConfigured = true;
  return true;
}

export async function loadSubscriptionSnapshot(): Promise<SubscriptionSnapshot> {
  const configured = await ensureConfigured();
  if (!configured) {
    return getUnavailableSnapshot(
      'Les achats intégrés ne sont pas encore configurés dans cette build.'
    );
  }

  try {
    const [offerings, customerInfo] = await Promise.all([
      Purchases.getOfferings(),
      Purchases.getCustomerInfo(),
    ]);

    const packages = mapPackages(offerings.current?.availablePackages ?? []);
    if (packages.length === 0) {
      return {
        isPremiumActive: hasPilotageEntitlement(customerInfo),
        packages: FALLBACK_PACKAGES,
        errorMessage: 'L’offre Pilotage est indisponible sur ce store pour le moment.',
      };
    }

    return {
      isPremiumActive: hasPilotageEntitlement(customerInfo),
      packages,
      errorMessage: null,
    };
  } catch (error) {
    return getUnavailableSnapshot(
      getStoreErrorMessage(
        error,
        'Impossible de charger les offres du store pour le moment.'
      )
    );
  }
}

export async function purchaseSubscription(
  plan: SubscriptionPlan
): Promise<SubscriptionPurchaseResult> {
  const configured = await ensureConfigured();
  if (!configured) {
    return {
      status: 'failed',
      isPremiumActive: false,
      errorMessage: 'Les achats intégrés ne sont pas encore configurés dans cette build.',
    };
  }

  try {
    const offerings = await Purchases.getOfferings();
    const targetPackage = (offerings.current?.availablePackages ?? []).find(
      (item) => mapPackageTypeToPlan(item.packageType) === plan
    );

    if (!targetPackage) {
      return {
        status: 'failed',
        isPremiumActive: false,
        errorMessage: 'Cette formule Pilotage est indisponible pour le moment.',
      };
    }

    const result = await Purchases.purchasePackage(targetPackage);
    return {
      status: 'purchased',
      isPremiumActive: hasPilotageEntitlement(result.customerInfo),
      errorMessage: null,
    };
  } catch (error) {
    if (isPurchaseCancelled(error)) {
      return {
        status: 'cancelled',
        isPremiumActive: false,
        errorMessage: null,
      };
    }

    return {
      status: 'failed',
      isPremiumActive: false,
      errorMessage: getStoreErrorMessage(
        error,
        'Le store n’a pas pu finaliser l’achat pour le moment.'
      ),
    };
  }
}

export async function restoreSubscription(): Promise<SubscriptionRestoreResult> {
  const configured = await ensureConfigured();
  if (!configured) {
    return {
      status: 'failed',
      isPremiumActive: false,
      errorMessage: 'La restauration est indisponible dans cette build.',
    };
  }

  try {
    const customerInfo = await Purchases.restorePurchases();
    return {
      status: 'restored',
      isPremiumActive: hasPilotageEntitlement(customerInfo),
      errorMessage: null,
    };
  } catch (error) {
    return {
      status: 'failed',
      isPremiumActive: false,
      errorMessage: getStoreErrorMessage(
        error,
        'La restauration des achats a échoué pour le moment.'
      ),
    };
  }
}

export async function subscribeToSubscriptionUpdates(
  listener: (nextIsPremiumActive: boolean) => void
): Promise<() => void> {
  const configured = await ensureConfigured();
  if (!configured) {
    return () => undefined;
  }

  const onCustomerInfoUpdated = (customerInfo: CustomerInfo) => {
    listener(hasPilotageEntitlement(customerInfo));
  };

  Purchases.addCustomerInfoUpdateListener(onCustomerInfoUpdated);

  return () => {
    Purchases.removeCustomerInfoUpdateListener(onCustomerInfoUpdated);
  };
}

export function resetRevenueCatStateForTests() {
  isConfigured = false;
}
