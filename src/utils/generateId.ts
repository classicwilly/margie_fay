export function generateId(prefix?: string): string {
  // If deterministic IDs are requested in the environment, honor that first
  try {
    if (typeof process !== 'undefined' && process.env && process.env.TEST_DETERMINISTIC_IDS === 'true') {
      const seed = Number(process.env.TEST_DETERMINISTIC_IDS_SEED || '1') || 1;
      if (!(globalThis as any).__WONKY_DET_ID_COUNTER__) (globalThis as any).__WONKY_DET_ID_COUNTER__ = { seed, i: 0 };
      const c = (globalThis as any).__WONKY_DET_ID_COUNTER__;
      c.i += 1;
      const body = `det-${seed}-${String(c.i).padStart(6, '0')}`;
      return prefix ? `${prefix}-${body}` : body;
    }
  } catch (e) {
    // ignore and fall through
  }

  try {
    if (typeof crypto !== 'undefined' && typeof (crypto as any).randomUUID === 'function') {
      const uuid = (crypto as any).randomUUID();
      return prefix ? `${prefix}-${uuid}` : uuid;
    }
  } catch (e) {
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
