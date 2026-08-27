import AsyncStorage from '@react-native-async-storage/async-storage';
import PostHog from 'posthog-react-native';
import { resetAsyncStorage } from './__mocks__/async-storage';
import { resetPostHogClientForTests } from '../analytics/posthogClient';
import { trackEvent, trackFirstOpenIfNeeded } from '../utils/analytics';

describe('analytics', () => {
  const captureMock = (jest.requireMock('posthog-react-native') as { capture: jest.Mock }).capture;

  beforeEach(() => {
    resetAsyncStorage();
    resetPostHogClientForTests();
    process.env.EXPO_PUBLIC_POSTHOG_KEY = 'phc_test_key';
    process.env.EXPO_PUBLIC_POSTHOG_HOST = 'https://eu.i.posthog.com';
    captureMock.mockClear();
  });

  afterEach(() => {
    delete process.env.EXPO_PUBLIC_POSTHOG_KEY;
    delete process.env.EXPO_PUBLIC_POSTHOG_HOST;
  });

  it('sends events through PostHog with base properties', async () => {
    await trackEvent('purchase_started', {
      source: 'result',
      plan: 'monthly',
    });

    expect(PostHog).toHaveBeenCalledWith(
      'phc_test_key',
      expect.objectContaining({ host: 'https://eu.i.posthog.com' })
    );
    expect(captureMock).toHaveBeenCalledWith(
      'purchase_started',
      expect.objectContaining({
        source: 'result',
        plan: 'monthly',
        platform: expect.any(String),
        app_version: expect.any(String),
      })
    );
  });

  it('tracks first_open only once per installation', async () => {
    await trackFirstOpenIfNeeded();
    await trackFirstOpenIfNeeded();

    const firstOpenCalls = captureMock.mock.calls.filter(
      ([eventName]: [string]) => eventName === 'first_open'
    );

    expect(firstOpenCalls).toHaveLength(1);
    await expect(AsyncStorage.getItem('analytics:first-open-tracked')).resolves.toBe('true');
  });

  it('does nothing when PostHog is not configured', async () => {
    delete process.env.EXPO_PUBLIC_POSTHOG_KEY;
    resetPostHogClientForTests();

    await trackEvent('result_viewed');

    expect(captureMock).not.toHaveBeenCalled();
  });
});
