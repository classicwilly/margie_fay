import { describe, it, expect } from "vitest";
import { execSync } from "child_process";
import path from "path";

describe("Module Manifests (static validation)", () => {
  it("should have unique ids and required fields", () => {
    // Run the validator script as a smoke test to ensure script doesn't fail
    const validatorScript = path.resolve(
      __dirname,
      "../scripts/generate/validate_module_manifests.mjs",
    );
    expect(() =>
      execSync(`node ${validatorScript}`, { stdio: "pipe" }),
    ).not.toThrow();
  });
});
