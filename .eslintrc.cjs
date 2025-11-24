// Legacy config stub.
// This file is intentionally minimal to avoid conflicting with the flat config
// `eslint.config.cjs`. It remains for compatibility with older linting tooling
// and won't be used for enforcement in ESLint v9+ flat config systems.
module.exports = {
  root: true,
  env: { browser: true, es2021: true },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    ecmaFeatures: { jsx: true },
  },
  rules: {},
  settings: { react: { version: "detect" } },
};
