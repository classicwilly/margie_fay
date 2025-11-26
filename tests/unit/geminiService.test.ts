import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getGrandmaAdvice } from "../../src/services/geminiService";

import {
  SYSTEM_INSTRUCTIONS,
  GRANDMA_SYSTEM_INSTRUCTION,
  GRANDPA_SYSTEM_INSTRUCTION,
} from "../../src/services/geminiService";

describe("geminiService (client proxy)", () => {
  const originalFetch = globalThis.fetch;
  beforeEach(() => {
    // Mock fetch
    globalThis.fetch = vi.fn();
  });
  afterEach(() => {
    globalThis.fetch = originalFetch as any;
    vi.resetAllMocks();
  });
  it("calls /api/gemini proxy and returns text", async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        output: { text: "I boiled it for two minutes. Love, Grandma." },
      }),
    };
    (globalThis.fetch as any).mockResolvedValue(mockResponse);
    const result = await getGrandmaAdvice("How do I fix a leaky sink?");
    expect(result).toContain("Love, Grandma");
    expect(globalThis.fetch).toHaveBeenCalled();
  });

  it("system instructions for grandma and grandpa include trait keywords", () => {
    // Check SYSTEM_INSTRUCTIONS
    expect(SYSTEM_INSTRUCTIONS.grandma).toMatch(
      /plants|cooking|emotional support|housekeeping|makeup|art|music|first aid|fashion|communication/,
    );
    expect(SYSTEM_INSTRUCTIONS.grandpa).toMatch(
      /Buckminster Fuller|physics|math|quantum entanglement|cars|woodworking|coding|DIY|3D printing|communication/,
    );
    // Check constants
    expect(GRANDMA_SYSTEM_INSTRUCTION).toMatch(
      /plants|cooking|emotional support|housekeeping|makeup|art|music|first aid|fashion|communication/,
    );
    expect(GRANDPA_SYSTEM_INSTRUCTION).toMatch(
      /Buckminster Fuller|physics|math|quantum entanglement|cars|woodworking|coding|DIY|3D printing|communication/,
    );
  });

  it("includes personaKey in proxy body for random persona", async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({ output: { text: "Random persona pick. —Bob." } }),
    } as any;
    (globalThis.fetch as any).mockResolvedValue(mockResponse);
    const { getAdvice } = await import("../../src/services/geminiService");
    const result = await getAdvice("random", "Help me pick something");
    expect(result).toContain("—Bob.");
    expect(globalThis.fetch).toHaveBeenCalled();
    const last = (globalThis.fetch as any).mock.calls.slice(-1)[0];
    const body = JSON.parse(last[1].body || last[1].body);
    expect(body.personaKey).toBeTruthy();
  });
});
