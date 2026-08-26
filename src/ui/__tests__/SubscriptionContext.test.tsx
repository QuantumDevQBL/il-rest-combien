import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import Purchases from 'react-native-purchases';
import * as analytics from '../utils/analytics';
import { SubscriptionProvider, useSubscriptionContext } from '../context/SubscriptionContext';
import { resetRevenueCatStateForTests } from '../subscription/revenueCat';

function Probe() {
  const {
    isPremiumActive,
    packages,
    errorMessage,
    purchasePlan,
    restorePurchases,
  } = useSubscriptionContext();

  return (
    <View>
      <Text>{isPremiumActive ? 'premium-on' : 'premium-off'}</Text>
      <Text>{packages.map((item) => `${item.plan}:${item.priceLabel}`).join('|')}</Text>
      <Text>{errorMessage ?? 'no-error'}</Text>
      <TouchableOpacity onPress={() => void purchasePlan('monthly', 'result')}>
        <Text>Acheter mensuel</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => void purchasePlan('annual', 'result')}>
        <Text>Acheter annuel</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => void restorePurchases('result')}>
        <Text>Restaurer</Text>
      </TouchableOpacity>
    </View>
  );
}

describe('SubscriptionContext', () => {
  const mockedPurchases = Purchases as unknown as {
    configure: jest.Mock;
    setLogLevel: jest.Mock;
    getOfferings: jest.Mock;
    getCustomerInfo: jest.Mock;
    purchasePackage: jest.Mock;
    restorePurchases: jest.Mock;
    addCustomerInfoUpdateListener: jest.Mock;
    removeCustomerInfoUpdateListener: jest.Mock;
  };

  beforeEach(() => {
    process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY = 'goog_test_key';
    process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY = 'appl_test_key';
    resetRevenueCatStateForTests();
    jest.spyOn(analytics, 'trackEvent').mockImplementation(() => Promise.resolve());
    mockedPurchases.configure.mockClear();
    mockedPurchases.setLogLevel.mockClear();
    mockedPurchases.getOfferings.mockResolvedValue({
      current: {
        availablePackages: [
          {
            identifier: '$rc_annual',
            packageType: 'ANNUAL',
            product: { priceString: '39,99 €/an' },
          },
          {
            identifier: '$rc_monthly',
            packageType: 'MONTHLY',
            product: { priceString: '4,99 €/mois' },
          },
        ],
      },
    });
    mockedPurchases.getCustomerInfo.mockResolvedValue({
      entitlements: { active: {} },
    });
    mockedPurchases.purchasePackage.mockResolvedValue({
      customerInfo: {
        entitlements: {
          active: {
            pilotage: {
              isActive: true,
            },
          },
        },
      },
    });
    mockedPurchases.restorePurchases.mockResolvedValue({
      entitlements: {
        active: {
          pilotage: {
            isActive: true,
          },
        },
      },
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('loads localized packages from RevenueCat', async () => {
    const screen = render(
      <SubscriptionProvider>
        <Probe />
      </SubscriptionProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('annual:39,99 €/an|monthly:4,99 €/mois')).toBeTruthy();
    });
  });

  it('marks premium active when entitlement is already active', async () => {
    mockedPurchases.getCustomerInfo.mockResolvedValue({
      entitlements: {
        active: {
          pilotage: {
            isActive: true,
          },
        },
      },
    });

    const screen = render(
      <SubscriptionProvider>
        <Probe />
      </SubscriptionProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('premium-on')).toBeTruthy();
    });
  });

  it('completes a monthly purchase and tracks analytics', async () => {
    const screen = render(
      <SubscriptionProvider>
        <Probe />
      </SubscriptionProvider>
    );

    fireEvent.press(screen.getByText('Acheter mensuel'));

    await waitFor(() => {
      expect(screen.getByText('premium-on')).toBeTruthy();
    });

    expect(mockedPurchases.purchasePackage).toHaveBeenCalledTimes(1);
    expect(analytics.trackEvent).toHaveBeenCalledWith(
      'purchase_completed',
      expect.objectContaining({ plan: 'monthly', source: 'result' })
    );
  });

  it('tracks purchase cancellation without surfacing a technical error', async () => {
    mockedPurchases.purchasePackage.mockRejectedValue({
      userCancelled: true,
    });

    const screen = render(
      <SubscriptionProvider>
        <Probe />
      </SubscriptionProvider>
    );

    fireEvent.press(screen.getByText('Acheter annuel'));

    await waitFor(() => {
      expect(analytics.trackEvent).toHaveBeenCalledWith(
        'purchase_cancelled',
        expect.objectContaining({ plan: 'annual', source: 'result' })
      );
    });

    expect(screen.getByText('no-error')).toBeTruthy();
  });

  it('restores purchases and activates premium', async () => {
    const screen = render(
      <SubscriptionProvider>
        <Probe />
      </SubscriptionProvider>
    );

    fireEvent.press(screen.getByText('Restaurer'));

    await waitFor(() => {
      expect(screen.getByText('premium-on')).toBeTruthy();
    });

    expect(analytics.trackEvent).toHaveBeenCalledWith(
      'restore_completed',
      expect.objectContaining({ source: 'result' })
    );
  });

  it('surfaces an unavailable offering gracefully', async () => {
    mockedPurchases.getOfferings.mockResolvedValue({
      current: {
        availablePackages: [],
      },
    });

    const screen = render(
      <SubscriptionProvider>
        <Probe />
      </SubscriptionProvider>
    );

    await waitFor(() => {
      expect(
        screen.getByText('L’offre Pilotage est indisponible sur ce store pour le moment.')
      ).toBeTruthy();
    });
  });
});
