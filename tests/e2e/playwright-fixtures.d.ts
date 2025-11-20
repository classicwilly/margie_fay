import '@playwright/test';

declare module '@playwright/test' {
  interface TestArgs {
    // The worker-scoped storage key provided by our extended fixture.
    storageKey: string;
  }
  interface WorkerArgs {
    storageKey: string;
  }
}
