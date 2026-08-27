const capture = jest.fn();
const flush = jest.fn(async () => undefined);

class PostHog {
  apiKey: string;
  options: Record<string, unknown>;

  constructor(apiKey: string, options: Record<string, unknown>) {
    this.apiKey = apiKey;
    this.options = options;
  }

  capture = capture;
  flush = flush;
}

export { capture, flush };
export default PostHog;
