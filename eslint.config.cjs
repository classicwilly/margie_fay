/*
 * Minimal flat ESLint config that avoids using "extends" to prevent
 * flat config errors. This config intentionally inlines base rules
 * and doesn't rely on plugin exported configs that might use "extends".
 */
module.exports = [
  {
    ignores: ["dist/**", "node_modules/**", "public/**", "tests/e2e/**"],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: require("@typescript-eslint/parser"),
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
        // project intentionally omitted here to avoid parse errors on files
        // that are not part of the project's TypeScript configuration. See
        // the dedicated override below for proper typed rules on `src/**`.
      },
    },
    plugins: {
      react: require("eslint-plugin-react"),
      "react-hooks": require("eslint-plugin-react-hooks"),
      prettier: require("eslint-plugin-prettier"),
      // Tailwind plugin removed to avoid extra dependency; re-add if needed
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
    },
    rules: {
      "prettier/prettier": "error",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      eqeqeq: ["error", "always"],
      curly: "error",
      "no-var": "error",
      "prefer-const": "error",
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
      // Tailwind-specific lint rules removed to avoid extra dependencies
    },
    settings: {
      react: { version: "detect" },
      "import/resolver": { typescript: {} },
    },
  },
  {
    // Enable type-aware rules on the main source folders only
    files: ["src/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
    languageOptions: {
      parser: require("@typescript-eslint/parser"),
      parserOptions: { project: ["./tsconfig.json"] },
    },
    rules: {
      "@typescript-eslint/no-floating-promises": [
        "error",
        { ignoreVoid: true },
      ],
      "@typescript-eslint/explicit-function-return-type": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
  {
    files: [
      "vite.config.ts",
      "vitest.config.ts",
      "playwright.config.ts",
      "scripts/**/*.ts",
    ],
    languageOptions: {
      parser: require("@typescript-eslint/parser"),
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: ["./tsconfig.node.json"],
      },
    },
    rules: {},
  },
];
