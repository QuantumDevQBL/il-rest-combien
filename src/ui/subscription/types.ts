export type PremiumSource = 'result' | 'pilotage_tab' | 'monthly_tracking';
export type SubscriptionPlan = 'monthly' | 'annual';

export interface SubscriptionPackage {
  plan: SubscriptionPlan;
  title: string;
  priceLabel: string;
  highlight?: string;
}

export interface SubscriptionSnapshot {
  isPremiumActive: boolean;
  packages: SubscriptionPackage[];
  errorMessage: string | null;
}

export interface SubscriptionPurchaseResult {
  status: 'purchased' | 'cancelled' | 'failed';
  isPremiumActive: boolean;
  errorMessage: string | null;
}

export interface SubscriptionRestoreResult {
  status: 'restored' | 'failed';
  isPremiumActive: boolean;
  errorMessage: string | null;
}
