/* Global and third-party module typings used by the app to reduce TypeScript noise.
   These are intentionally lightweight to avoid heavyweight @types installs in CI for now.
   Add more precise declarations as needed. */

declare module "marked" {
  export function parse(src?: string): string;
  export function setOptions(opts: any): void;
  export const Renderer: any;
  export const marked: any;
}

declare module "module-alias" {
  export function addAlias(alias: string, path: string): void;
  export function addAliases(aliases: Record<string, string>): void;
}

declare module "axe-core" {
  const axe: any;
  export default axe;
}

declare module "tweetnacl" {
  const nacl: any;
  export default nacl;
}
declare module "node-fetch" {
  const fetch: any;
  export default fetch;
}

// Module shims for server-side utilities imported by client tests/builds
declare module "../../server/aiUtils" {
  export function redactPII(text: string): {
    safePrompt: string;
    metadata: { hash: string; redactedTokensCount: number };
  };
}

// Firebase client shim used in client code (auth/db interfaces are referenced)
declare module "../../firebase.js" {
  export const auth: any;
  export const db: any;
  const firebaseDefault: any;
  export default firebaseDefault;
}
declare module "firebase.js" {
  export const auth: any;
  export const db: any;
  const firebaseDefault: any;
  export default firebaseDefault;
}

/* Basic CSS/JSON module imports */
declare module "*.css";
declare module "*.scss";
declare module "*.json" {
  const value: any;
  export default value;
}

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: string;
    GEMINI_API_KEY?: string;
    DISCORD_INTEGRATION_TEST?: string;
    TEST_DETERMINISTIC_IDS?: string;
    TEST_DETERMINISTIC_IDS_SEED?: string;
    [key: string]: string | undefined;
  }
}

declare global {
  // Helper used by generateId deterministic branch
  var __WONKY_DET_ID_COUNTER__: { seed: number; i: number } | undefined;
  interface Window {
    __WONKY_TEST_INITIALIZE__?: any;
    __E2E_FORCE_VIEW__?: any;
    __PLAYWRIGHT_AI_STUB__?: boolean;
    __WONKY_E2E_TEST_MODE__?: boolean;
    __WONKY_E2E_LOG_PUSH__?: (...args: any[]) => void;
    appState?: any;
  }
}

// Minimal test global declarations used by Vitest/Mocha/Jest-like tests in the workspace.
declare global {
  function describe(name: string, fn: () => void): void;
  function it(name: string, fn: () => void): void;
  function test(name: string, fn: () => void): void;
  function beforeEach(fn: () => void): void;
  function afterEach(fn: () => void): void;
  const expect: any;
  const vi: any;

  // Some test runners compile with global names as variables, declare them too
  var describe: any;
  var it: any;
  var test: any;
  var beforeEach: any;
  var afterEach: any;
  var expect: any;
  var vi: any;
}

export {};
