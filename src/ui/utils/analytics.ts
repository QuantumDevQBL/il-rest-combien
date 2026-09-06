import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Application from 'expo-application';
import { Platform } from 'react-native';
import { getPostHogClient } from '../analytics/posthogClient';

const FIRST_OPEN_KEY = 'analytics:first-open-tracked';

type AnalyticsEvent =
  | 'first_open'
  | 'simulation_completed'
  | 'result_viewed'
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

type AnalyticsPrimitive = string | number | boolean | null | undefined;
type AnalyticsProperties = Record<string, AnalyticsPrimitive>;
type PostHogProperties = Record<string, string | number | boolean | null>;

function getBaseProperties(): AnalyticsProperties {
  return {
    app_version: Application.nativeApplicationVersion ?? 'unknown',
    platform: Platform.OS,
  };
}

async function captureEvent(
  eventName: AnalyticsEvent,
  properties?: AnalyticsProperties
): Promise<void> {
  const mergedProperties = {
    ...getBaseProperties(),
    ...(properties ?? {}),
  };
  const sanitizedProperties = Object.fromEntries(
    Object.entries(mergedProperties).filter(([, value]) => value !== undefined)
  ) as PostHogProperties;

  if (__DEV__) {
    console.log('[analytics]', eventName, sanitizedProperties);
  }

  try {
    const client = getPostHogClient();
    if (!client) {
      return;
    }

    client.capture(eventName, sanitizedProperties);
  } catch (error) {
    if (__DEV__) {
      console.warn('[analytics:error]', eventName, error);
    }
  }
}

export async function trackFirstOpenIfNeeded(): Promise<void> {
  try {
    const alreadyTracked = await AsyncStorage.getItem(FIRST_OPEN_KEY);
    if (alreadyTracked === 'true') {
      return;
    }

    await captureEvent('first_open');
    await AsyncStorage.setItem(FIRST_OPEN_KEY, 'true');
  } catch (error) {
    if (__DEV__) {
      console.warn('[analytics:first_open:error]', error);
    }
  }
}

export async function trackEvent(
  eventName: AnalyticsEvent,
  properties?: AnalyticsProperties
): Promise<void> {
  await captureEvent(eventName, properties);
}
