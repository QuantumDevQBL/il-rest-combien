const capture = jest.fn();
const flush = jest.fn(async () => undefined);

const PostHog = jest.fn().mockImplementation(
  (apiKey: string, options: Record<string, unknown>) => ({
    apiKey,
    options,
    capture,
    flush,
  })
);

export { capture, flush };
export default PostHog;
