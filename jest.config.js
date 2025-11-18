/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",

  roots: ["<rootDir>/src"],

  moduleFileExtensions: ["ts", "js", "json"],
  testMatch: ["**/__tests__/**/*.test.ts", "**/*.test.ts"],

  moduleNameMapper: {
    "^(.*)\\.js$": "$1", 
  },

  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts", "!src/**/__tests__/**"],
  coverageDirectory: "coverage",

  verbose: true,
};
