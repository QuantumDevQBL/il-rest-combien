const storage = new Map<string, string>();

export const mockAsyncStorage = {
  setItem: jest.fn(async (key: string, value: string) => {
    storage.set(key, value);
  }),
  getItem: jest.fn(async (key: string) => {
    return storage.get(key) ?? null;
  }),
  removeItem: jest.fn(async (key: string) => {
    storage.delete(key);
  }),
  clear: jest.fn(async () => {
    storage.clear();
  }),
};

export function resetAsyncStorage() {
  storage.clear();
  mockAsyncStorage.setItem.mockClear();
  mockAsyncStorage.getItem.mockClear();
  mockAsyncStorage.removeItem.mockClear();
  mockAsyncStorage.clear.mockClear();
}
