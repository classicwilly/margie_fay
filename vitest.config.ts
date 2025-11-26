import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setupTests.ts"],
    // Exclude E2E tests and packages tests
    include: ["tests/**/*.test.{ts,tsx,js}", "tests/**/*.spec.{ts,tsx,js}"],
    exclude: ["tests/e2e/**", "node_modules/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80,
    },
  },
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, ".") },
      { find: "@hooks", replacement: path.resolve(__dirname, "hooks") },
      {
        find: "@contexts",
        replacement: path.resolve(__dirname, "src/contexts"),
      },
      {
        find: /^@utils\/(.*)$/,
        replacement: path.resolve(__dirname, "src/utils") + "/$1",
      },
      { find: "@utils", replacement: path.resolve(__dirname, "src/utils") },
      {
        find: /^@components\/(.*)$/,
        replacement: path.resolve(__dirname, "components") + "/$1",
      },
      {
        find: "@components",
        replacement: path.resolve(__dirname, "components"),
      },
      {
        find: "@components-src",
        replacement: path.resolve(__dirname, "src/components"),
      },
      {
        find: "@components-root",
        replacement: path.resolve(__dirname, "components"),
      },
      {
        find: "components",
        replacement: path.resolve(__dirname, "components"),
      },
      {
        find: "@services",
        replacement: path.resolve(__dirname, "src/services"),
      },
      { find: "@data", replacement: path.resolve(__dirname, "src/data") },
      { find: "@types", replacement: path.resolve(__dirname, "src/types.ts") },
    ],
  },
});
