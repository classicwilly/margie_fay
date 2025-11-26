import { describe, it, expect, vi } from "vitest";
import { processWebhookJob } from "../../server/webhookProcessor.js";

describe("webhookProcessor - discord voice", () => {
  it("calls bot worker for discord_voice job", async () => {
    const play = vi.fn(async () => true);
    const app = {
      get: (k) => {
        if (k === "auditLogger") return () => {};
        if (k === "discordPlay" || k === "discord.play") return play;
        return null;
      },
    };
    const job = {
      source: "discord",
      event: "discord_voice",
      body: { guildId: "g", channelId: "c", text: "test" },
    };
    await expect(processWebhookJob(app, job)).resolves.not.toThrow();
    expect(play).toHaveBeenCalled();
  });

  it("does not throw when discordPlay missing", async () => {
    const app = {
      get: (k) => {
        if (k === "auditLogger") return () => {};
        return null;
      },
    };
    const job = {
      source: "discord",
      event: "discord_voice",
      body: { guildId: "g", channelId: "c", text: "test" },
    };
    await expect(processWebhookJob(app, job)).resolves.not.toThrow();
  });
});
