export function generateId(prefix?: string) {
  // If deterministic IDs are requested in the environment, honor that first
  try {
    if (typeof process !== 'undefined' && process.env && process.env.TEST_DETERMINISTIC_IDS === 'true') {
      const seed = Number(process.env.TEST_DETERMINISTIC_IDS_SEED || '1') || 1;
      const g = globalThis as unknown as { __WONKY_DET_ID_COUNTER__?: { seed: number; i: number } };
      if (!g.__WONKY_DET_ID_COUNTER__) g.__WONKY_DET_ID_COUNTER__ = { seed, i: 0 };
      const c = g.__WONKY_DET_ID_COUNTER__!;
      c.i += 1;
      const body = `det-${seed}-${String(c.i).padStart(6, '0')}`;
      return prefix ? `${prefix}-${body}` : body;
    }
  } catch {
    // ignore and fall through
  }

  try {
    const globalCrypto = (globalThis as unknown as { crypto?: { randomUUID?: () => string } }).crypto;
    if (globalCrypto && typeof globalCrypto.randomUUID === 'function') {
      const uuid = globalCrypto.randomUUID();
      return prefix ? `${prefix}-${uuid}` : uuid;
    }
  } catch {
    // fall through to fallback
  }

  // If we're running in a test or PR mode, support a deterministic id generator
  // via TEST_DETERMINISTIC_IDS env var. Useful for vitest/playwright snapshots.
  // Deterministic check and crypto paths are handled above. Continue to fallback.

  // Fallback: Date + short random suffix
  const body = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return prefix ? `${prefix}-${body}` : body;
}

export default generateId;
