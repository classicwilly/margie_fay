// Typed helper to centralize runtime global window flags for E2E/test helpers
export const win = typeof window !== 'undefined' ? (window as Window & {
  __E2E_STORAGE_KEY__?: string;
  __PLAYWRIGHT_SKIP_DEV_BYPASS__?: boolean;
  __WONKY_TEST_INITIALIZE__?: Partial<import('../contexts/types').AppState>;
  __WONKY_E2E_LOG__?: unknown[];
  __WONKY_E2E_LOG_PUSH__?: (msg: string, meta?: unknown) => void;
  __WONKY_E2E_LOG_GET__?: () => unknown[];
  __WONKY_TEST_STICKY_VIEW__?: string;
  __WONKY_DEBUG__?: boolean;
  __WONKY_TEST_CAN_UPDATE_DB__?: () => boolean;
  __E2E_FORCE_VIEW__?: string;
  __WONKY_TEST_BLOCK_DB__?: boolean;
  webkitAudioContext?: typeof AudioContext | undefined;
  __WONKY_TEST_DISPATCH__?: (action: import('../contexts/types').AppAction) => void;
  __WONKY_TEST_ALLOW_DB_UPDATES__?: (allow?: boolean) => void;
  __WONKY_TEST_STICKY_DASHBOARD__?: string;
  __WONKY_LAST_ERROR__?: { message?: string; stack?: string; ts?: string } | null;
  __PLAYWRIGHT_AI_STUB__?: boolean;
}) : undefined;

export default win;
