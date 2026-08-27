import PostHog from 'posthog-react-native';

let client: PostHog | null | undefined;

export function getPostHogClient(): PostHog | null {
  if (client !== undefined) {
    return client;
  }

  const apiKey = process.env.EXPO_PUBLIC_POSTHOG_KEY;
  if (!apiKey) {
    client = null;
    return client;
  }

  client = new PostHog(apiKey, {
    host: process.env.EXPO_PUBLIC_POSTHOG_HOST ?? 'https://eu.i.posthog.com',
  });

  return client;
}

export function resetPostHogClientForTests() {
  client = undefined;
}
