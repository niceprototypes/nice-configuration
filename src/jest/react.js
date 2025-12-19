/**
 * Jest configuration for React projects with TypeScript
 * Uses ts-jest for native TypeScript support
 */

/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  testMatch: ["**/*.test.ts", "**/*.test.tsx"],
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": ["ts-jest", {
      useESM: true,
    }],
  },
  transformIgnorePatterns: [
    "node_modules/(?!(nice-[^/]+)/)",
  ],
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
    "^.+\\.(css|less|scss|sass)$": "<rootDir>/__mocks__/styleMock.js",
  },
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
}