import { describe, it, expect } from "vitest";
import { generateId } from "../../src/utils/generateId";

describe("generateId", () => {
  it("Deterministic ID generation produces expected prefix", () => {
    const prefix = "flight-protocol";
    const id = generateId(prefix);

    // Check that it starts with the prefix followed by a separator (- or _)
    // This Regex ^flight-protocol[-_] handles both cases
    expect(id).toMatch(new RegExp(`^${prefix}[-_]`));

    // Ensure the ID actually has content after the prefix
    expect(id.length).toBeGreaterThan(prefix.length + 1);
  });
});
