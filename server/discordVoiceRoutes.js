import express from "express";
import { roleCheck } from "./securityMiddleware.js";
import { discordConnector } from "./connectors/index.js";

const router = express.Router();

// Play a TTS message on a channel (admin-only)
router.post("/play", express.json(), roleCheck(["admin"]), async (req, res) => {
  try {
    const { guildId, channelId, text } = req.body || {};
    if (!guildId || !channelId || !text)
      return res.status(400).json({ error: "Missing required fields" });
    const queue = req.app.get("webhookQueue");
    if (!queue) return res.status(500).json({ error: "Queue unavailable" });
    await queue.push("discord_voice", {
      guildId,
      channelId,
      text,
      requestedBy: req.user?.username,
    });
    req.app.get("auditLogger")?.("discord.voice.enqueue", {
      guildId,
      channelId,
      requestedBy: req.user?.username,
    });
    return res.json({ ok: true });
  } catch (e) {
    console.error("voice play error", e);
    return res.status(500).json({ error: "Failed to enqueue voice job" });
  }
});

export default router;
