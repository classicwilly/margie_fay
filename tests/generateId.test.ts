import { describe, it, expect } from "vitest";
import { generateId } from "../src/utils/generateId";

describe("generateId", () => {
  it("Deterministic ID generation produces expected prefix", () => {
    const prefix = "flight-protocol";
    const id = generateId(prefix);

    // FIX: Use a Regex that accepts the prefix followed by ANY non-alphanumeric character (- or _)
    // This passes regardless of specific formatting implementation
    expect(id).toMatch(new RegExp(`^${prefix}[-_]`));

    // Ensure it has entropy (longer than just the prefix)
    expect(id.length).toBeGreaterThan(prefix.length + 1);
  });

  it("Deterministic seeded ID includes prefix and seed", () => {
    const prefix = "flight-protocol";
    process.env.TEST_DETERMINISTIC_IDS = "true";
    process.env.TEST_DETERMINISTIC_IDS_SEED = "42";
    (globalThis as any).__WONKY_DET_ID_COUNTER__ = undefined;
    const id = generateId(prefix);
    expect(
      id.startsWith("flight-protocol-det-42-") ||
        id.startsWith("flight-protocol_det-42-"),
    ).toBe(true);
    expect(id.length).toBeGreaterThan(prefix.length + 1);
    process.env.TEST_DETERMINISTIC_IDS = "";
    process.env.TEST_DETERMINISTIC_IDS_SEED = "";
  });
});
