export function safeJsonParse<T = unknown>(value: string | null | undefined, fallback: T | null = null): T | null {
  if (value === null || value === undefined) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    // Be conservative: log guardedly elsewhere if necessary; return fallback
    return fallback;
  }
}

export default safeJsonParse;
