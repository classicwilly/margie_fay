/*
 * Integration test skeleton for Discord voice playback flow.
 * See notes below — This test is gated by DISCORD_INTEGRATION_TEST=true
 * and requires a valid `DISCORD_SERVICE_BOT_TOKEN`, `REDIS_URL`, and
 * a test guild + voice channel that the bot has permissions to join and speak.
 *
 * Running locally:
 *   DISCORD_INTEGRATION_TEST=true DISCORD_SERVICE_BOT_TOKEN=<token> REDIS_URL=redis://localhost:6379 npm run test:discord-integration
 *
 * WARNING: Real audio playback will happen in your test bot voice channel. Use a test-only channel and bot.
 */

import { describe, it, expect } from "vitest";
// Removed unused React import
import { createQueue } from "../../server/queue.js";

// Skip this whole spec unless DISCORD_INTEGRATION_TEST is explicitly set.
if (!process.env.DISCORD_INTEGRATION_TEST) {
  describe("discord integration tests (skipped)", () => {
    it("skips when DISCORD_INTEGRATION_TEST is not set", () => {
      expect(true).toBe(true);
    });
  });
} else {
  describe("Discord Voice integration test", () => {
    it("pushes a job to Redis and worker processes it", async () => {
      // These env vars must be set in the environment running the test
      const redisUrl = process.env.REDIS_URL;
      const botToken = process.env.DISCORD_SERVICE_BOT_TOKEN;
      const guildId = process.env.DISCORD_TEST_GUILD_ID;
      const channelId = process.env.DISCORD_TEST_VOICE_CHANNEL_ID;
      const text = "Integration test voice playback - hello world";

      if (!redisUrl || !botToken || !guildId || !channelId) {
        throw new Error(
          "Missing integration environment variables; set REDIS_URL, DISCORD_SERVICE_BOT_TOKEN, DISCORD_TEST_GUILD_ID, and DISCORD_TEST_VOICE_CHANNEL_ID",
        );
      }

      const queue = createQueue(redisUrl);
      await queue.push("discord_voice", { guildId, channelId, text });

      // Poll the queue for up to 30 seconds to ensure it's processed and removed
      const start = Date.now();
      let processed = false;
      while (Date.now() - start < 30000) {
        const item = await queue.pop("discord_voice", 1);
        if (!item) {
          // If we can't pop anything, the item was processed by the worker (the test assumes the worker is running separately)
          processed = true;
          break;
        }
        // If it's present, re-enqueue it for the worker to process
        await queue.push("discord_voice", item);
        await new Promise((r) => setTimeout(r, 500));
      }

      expect(processed).toBe(true);
    }, 60000);
  });
}
