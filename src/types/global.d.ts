interface Window {
  appState?: import('../types').AppState;
  __PLAYWRIGHT_SKIP_DEV_BYPASS__?: boolean;
  __E2E_FORCE_VIEW__?: string;
  __WONKY_TEST_INITIALIZE__?: Partial<import('../contexts/types').AppState>;
  __WONKY_LAST_ERROR__?: { message?: string; stack?: string; ts?: string } | null;
  __PLAYWRIGHT_ERROR_CAPTURE__?: boolean;
  __E2E_STORAGE_KEY__?: string;
  __WONKY_E2E_TEST_MODE__?: boolean;
  __WONKY_TEST_FORCE_VIEW__?: (view: string) => void;
  __WONKY_TEST_DISPATCH__?: (action: import('../contexts/types').AppAction) => void;
  __WONKY_TEST_ALLOW_DB_UPDATES__?: (allow?: boolean) => void;
  __WONKY_TEST_CAN_UPDATE_DB__?: () => boolean;
  __WONKY_TEST_BLOCK_DB__?: boolean;
  __WONKY_TEST_STICKY_VIEW__?: string;
  __WONKY_TEST_STICKY_DASHBOARD__?: string;
  __WONKY_E2E_LOG__?: unknown[];
  __WONKY_E2E_LOG_PUSH__?: (msg: string, meta?: unknown) => void;
  __WONKY_E2E_LOG_GET__?: () => unknown[];
  __PLAYWRIGHT_AI_STUB__?: boolean;
  __WONKY_TEST_DB_ALLOW_TIMEOUT__?: number;
  __WONKY_TEST_READY__?: boolean;
  __WONKY_DET_ID_COUNTER__?: { seed: number; i: number };
}
