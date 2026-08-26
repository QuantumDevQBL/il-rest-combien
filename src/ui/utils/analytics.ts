export type PremiumIntroSource = 'monthly_tracking' | 'projection' | 'reserve';

type AnalyticsEvent =
  | 'first_open'
  | 'simulation_completed'
  | 'result_viewed'
  | 'monthly_tracking_clicked'
  | 'projection_clicked'
  | 'reserve_clicked'
  | 'premium_intro_viewed'
  | 'premium_intro_closed'
  | 'paywall_viewed'
  | 'purchase_started'
  | 'purchase_completed'
  | 'purchase_cancelled'
  | 'purchase_failed'
  | 'restore_started'
  | 'restore_completed'
  | 'restore_failed'
  | 'pilotage_opened'
  | 'monthly_revenue_entry_created'
  | 'monthly_revenue_entry_updated'
  | 'monthly_revenue_entry_deleted'
  | 'pilotage_summary_viewed'
  | 'projection_viewed'
  | 'pilotage_objective_created'
  | 'pilotage_objective_updated'
  | 'pilotage_objective_deleted'
  | 'pilotage_objective_viewed'
  | 'alert_prediction_viewed';

type AnalyticsProperties = Record<string, string | number | boolean | null | undefined>;

export async function trackEvent(
  eventName: AnalyticsEvent,
  properties?: AnalyticsProperties
): Promise<void> {
  if (__DEV__) {
    console.log('[analytics]', eventName, properties ?? {});
  }
}
