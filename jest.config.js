module.exports = {
  projects: [
    {
      displayName: 'engine',
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['**/src/engine/__tests__/**/*.test.ts'],
    },
    {
      displayName: 'ui',
      preset: 'jest-expo',
      testMatch: ['**/src/ui/__tests__/**/*.test.tsx'],
      transformIgnorePatterns: [
        'node_modules/(?!((react-native.*)?|(@react-native.*)?|expo.*|@expo.*))',
      ],
    },
  ],
};
