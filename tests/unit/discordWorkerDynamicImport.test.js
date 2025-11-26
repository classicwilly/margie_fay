import { describe, it, expect } from "vitest";

describe("server dynamic import for discord worker", () => {
  it("should not crash when DISCORD_ENABLE_BOT_WORKER is not set", async () => {
    const prior = process.env.DISCORD_ENABLE_BOT_WORKER;
    delete process.env.DISCORD_ENABLE_BOT_WORKER;
    // Importing server should not throw even when discord libs are absent
    await expect(async () => {
      // eslint-disable-next-line import/no-dynamic-require
      await import("../../server.js");
    }).not.toThrow();
    if (prior) process.env.DISCORD_ENABLE_BOT_WORKER = prior;
  });

  it("should not crash when DISCORD_ENABLE_BOT_WORKER is true but libs are missing", async () => {
    const prior = process.env.DISCORD_ENABLE_BOT_WORKER;
    process.env.DISCORD_ENABLE_BOT_WORKER = "true";
    // leaving DISCORD_SERVICE_BOT_TOKEN empty simulates not having a token but env enable set
    const priorToken = process.env.DISCORD_SERVICE_BOT_TOKEN;
    delete process.env.DISCORD_SERVICE_BOT_TOKEN;
    await expect(async () => {
      await import("../../server.js");
    }).not.toThrow();
    if (prior) process.env.DISCORD_ENABLE_BOT_WORKER = prior;
    if (priorToken) process.env.DISCORD_SERVICE_BOT_TOKEN = priorToken;
  });
});
