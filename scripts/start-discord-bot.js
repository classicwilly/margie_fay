#!/usr/bin/env node
// Small script to run the Discord bot worker as a standalone process.
// This avoids bundlers from statically resolving discord libs during the
// main server's build and lets you run the bot in a separate container or process.
import { createQueue } from "../server/queue.js";
import initDiscordBotWorker from "../server/discordBotWorker.js";

const queue = createQueue(process.env.REDIS_URL);

const app = {
  get: (k) => {
    if (k === "webhookQueue") return queue;
    if (k === "auditLogger")
      return (...args) => console.log("[audit]", ...args);
    return null;
  },
  set: () => {},
};

// Start the worker
initDiscordBotWorker(app).catch((e) => {
  console.error("Failed to start discord bot worker", e?.message || e);
  process.exit(1);
});
