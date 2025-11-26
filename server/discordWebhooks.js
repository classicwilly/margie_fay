import express from "express";
import { roleCheck } from "./securityMiddleware.js";

const router = express.Router();

// Discord webhook/interaction receiver.
// This route uses `express.raw` so we can verify the Ed25519 signature for Discord.
router.post(
  "/receive",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const signature =
        req.headers["x-signature-ed25519"] || req.headers["x-signature"];
      const timestamp =
        req.headers["x-signature-timestamp"] ||
        req.headers["x-signature-timestamp"];
      if (!signature || !timestamp) {
        return res.status(400).json({ error: "Missing signature headers" });
      }
      const publicKey = process.env.DISCORD_PUBLIC_KEY;
      if (!publicKey) {
        console.warn("DISCORD_PUBLIC_KEY not configured; rejecting webhook");
        return res.status(403).json({ error: "Not configured" });
      }
      const rawBody =
        req.body instanceof Buffer
          ? req.body
          : Buffer.from(String(req.body || ""));
      const isValid = await verifyDiscordSignature(
        publicKey,
        signature.toString(),
        timestamp.toString(),
        rawBody,
      );
      if (!isValid) return res.status(401).json({ error: "Invalid signature" });

      const rbody = JSON.parse(rawBody.toString("utf8"));
      // Handle PING interactions
      if (rbody?.type === 1) return res.json({ type: 1 });

      const queue = req.app.get("webhookQueue");
      if (!queue) {
        req.app.get("auditLogger")?.("discord.webhook.received", {
          event: "no_queue",
          body: rbody,
        });
        return res.status(200).json({ ok: true });
      }
      const eventType = rbody?.type
        ? `discord.interaction.${rbody.type}`
        : "discord.event";
      await queue.push("webhook", {
        source: "discord",
        event: eventType,
        body: rbody,
      });
      req.app.get("auditLogger")?.("discord.webhook.received", {
        eventType,
        body: rbody,
      });
      return res.json({ ok: true });
    } catch (e) {
      console.error("Discord webhook error", e);
      return res.status(500).json({ error: "Failed processing" });
    }
  },
);

function hexToUint8(hex) {
  if (!hex) return null;
  if (typeof hex !== "string") return null;
  if (hex.startsWith("0x")) hex = hex.substring(2);
  const len = hex.length / 2;
  const out = new Uint8Array(len);
  for (let i = 0; i < len; i++) out[i] = parseInt(hex.substr(i * 2, 2), 16);
  return out;
}

async function verifyDiscordSignature(
  publicKey,
  signature,
  timestamp,
  rawBody,
) {
  try {
    const msgBytes = Buffer.concat([
      Buffer.from(timestamp, "utf8"),
      Buffer.from(rawBody),
    ]);
    const sigBytes = hexToUint8(signature);
    const pk = hexToUint8(publicKey);
    if (!sigBytes || !pk) return false;
    // Attempt import via eval to avoid Vite static resolution in bundling,
    // but fallback to standard dynamic import or require to support testing environments.
    let nacl;
    try {
      nacl = (await eval('import("tweetnacl")')).default;
    } catch (e) {
      try {
        nacl = (await import("tweetnacl")).default; // Node dynamic import fallback
      } catch (e2) {
        try {
          // CommonJS require fallback

          nacl = require("tweetnacl");
        } catch (e3) {
          throw e3;
        }
      }
    }
    // Ensure msgBytes is a Uint8Array for tweetnacl
    const msgUint8 = new Uint8Array(msgBytes);
    return nacl.sign.detached.verify(msgUint8, sigBytes, pk);
  } catch (e) {
    console.warn("signature verification failed", e?.message || e);
    return false;
  }
}

export { verifyDiscordSignature };

export default router;
