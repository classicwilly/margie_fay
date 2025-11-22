import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getGrandmaAdvice } from '../../src/services/geminiService';

describe('geminiService (client proxy)', () => {
  const originalFetch = globalThis.fetch;
  beforeEach(() => {
    // Mock fetch
    globalThis.fetch = vi.fn();
  });
  afterEach(() => {
    globalThis.fetch = originalFetch as any;
    vi.resetAllMocks();
  });
  it('calls /api/gemini proxy and returns text', async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({ output: { text: 'I boiled it for two minutes. Love, Grandma.' } }),
    };
    (globalThis.fetch as any).mockResolvedValue(mockResponse);
    const result = await getGrandmaAdvice('How do I fix a leaky sink?');
    expect(result).toContain('Love, Grandma');
    expect(globalThis.fetch).toHaveBeenCalled();
  });
});
