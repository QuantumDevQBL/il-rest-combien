import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = 'onboarding-vu';

export interface OnboardingState {
  hasSeenOnboarding: boolean;
  isLoading: boolean;
  markAsSeen: () => Promise<void>;
}

export function useOnboarding(): OnboardingState {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(ONBOARDING_KEY)
      .then((value) => {
        if (cancelled) return;
        setHasSeenOnboarding(value === 'true');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const markAsSeen = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    setHasSeenOnboarding(true);
  };

  return { hasSeenOnboarding, isLoading, markAsSeen };
}
