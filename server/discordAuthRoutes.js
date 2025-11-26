import express from "express";
import crypto from "crypto";
import { roleCheck } from "./securityMiddleware.js";
import { discordConnector } from "./connectors/index.js";

const router = express.Router();

function getDiscordClientConfig() {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri =
    process.env.DISCORD_OAUTH_REDIRECT_URI ||
    `http://localhost:${process.env.PORT || 8080}/api/discord/callback`;
  if (!clientId || !clientSecret) return null;
  return { clientId, clientSecret, redirectUri };
}

router.get("/auth", (req, res) => {
  const cfg = getDiscordClientConfig();
  if (!cfg) return res.status(400).json({ error: "OAuth not configured" });
  const state = crypto.randomBytes(8).toString("hex");
  const scopes = ["identify", "email", "guilds"];
  const url = `https://discord.com/api/oauth2/authorize?client_id=${encodeURIComponent(cfg.clientId)}&redirect_uri=${encodeURIComponent(cfg.redirectUri)}&response_type=code&scope=${encodeURIComponent(scopes.join(" "))}&state=${encodeURIComponent(state)}`;
  const cache = req.app.get("cache");
  if (cache && cache.set) cache.set(`dc_oauth_state:${state}`, true);
  return res.redirect(url);
});

router.get("/callback", async (req, res) => {
  try {
    const { code, state } = req.query;
    if (!code) return res.status(400).send("Missing code");
    const cfg = getDiscordClientConfig();
    if (!cfg) return res.status(400).send("OAuth not configured");
    const cache = req.app.get("cache");
    if (
      !state ||
      !(
        cache &&
        cache.get &&
        (await cache.get(`dc_oauth_state:${String(state)}`))
      )
    ) {
      return res.status(400).send("Invalid or missing OAuth state");
    }
    if (cache && cache.del) await cache.del(`dc_oauth_state:${String(state)}`);
    const form = new URLSearchParams();
    form.append("client_id", cfg.clientId);
    form.append("client_secret", cfg.clientSecret);
    form.append("grant_type", "authorization_code");
    form.append("code", String(code));
    form.append("redirect_uri", cfg.redirectUri);
    const tokenResp = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });
    const tokenJson = await tokenResp.json();
    if (!tokenJson || !tokenJson.access_token) {
      console.error("Discord token exchange failed", tokenJson);
      return res.status(500).send("Discord token exchange failed");
    }
    const sessionId = crypto.randomBytes(16).toString("hex");
    if (cache && cache.set)
      await cache.set(`discord_tokens:${sessionId}`, tokenJson);
    req.app.get("auditLogger")?.("discord.oauth.callback", {
      session: sessionId,
      token_type: tokenJson.token_type || "unknown",
    });
    res.cookie("dcsess", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    return res.redirect("/?discord_auth=success");
  } catch (err) {
    console.error("Discord OAuth callback error", err);
    return res.status(500).send("Discord OAuth callback error");
  }
});

async function getAuthorizedDiscordToken(req) {
  const sessionId = req.cookies && req.cookies.dcsess;
  if (!sessionId) return null;
  const cache = req.app.get("cache");
  if (!cache || !cache.get) return null;
  const tokens = await cache.get(`discord_tokens:${sessionId}`);
  return tokens && tokens.access_token ? tokens.access_token : null;
}

async function requireDiscordAuth(req, res, next) {
  try {
    const token = await getAuthorizedDiscordToken(req);
    if (!token)
      return res.status(401).json({ error: "Not signed into Discord" });
    req.discordToken = token;
    // Fetch the user profile
    const r = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (r.status === 401) {
      const cache = req.app.get("cache");
      if (cache && cache.del)
        await cache.del(`discord_tokens:${req.cookies?.dcsess}`);
      res.clearCookie("dcsess");
      return res.status(401).json({ error: "Token invalid or expired" });
    }
    req.discordUser = await r.json();
    const admins = (process.env.DISCORD_ADMIN_USERS || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    req.user = {
      id: req.discordUser.id,
      username: req.discordUser.username,
      roles: admins.includes(req.discordUser.username)
        ? ["admin", "discord_user"]
        : ["discord_user"],
    };
    next();
  } catch (e) {
    console.error("requireDiscordAuth error", e);
    return res.status(500).json({ error: "Discord auth error" });
  }
}

async function validateDiscordToken(req, res, next) {
  try {
    const token = await getAuthorizedDiscordToken(req);
    if (!token) return res.status(401).json({ error: "Not signed in" });
    const r = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (r.status === 401) {
      const cache = req.app.get("cache");
      if (cache && cache.del)
        await cache.del(`discord_tokens:${req.cookies?.dcsess}`);
      res.clearCookie("dcsess");
      return res.status(401).json({ error: "Token invalid or expired" });
    }
    req.discordUser = await r.json();
    const admins = (process.env.DISCORD_ADMIN_USERS || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    req.user = {
      id: req.discordUser.id,
      username: req.discordUser.username,
      roles: admins.includes(req.discordUser.username)
        ? ["admin", "discord_user"]
        : ["discord_user"],
    };
    next();
  } catch (e) {
    console.error("validateDiscordToken error", e);
    return res.status(500).json({ error: "Token validation error" });
  }
}

router.get("/me", requireDiscordAuth, async (req, res) => {
  try {
    return res.json({ profile: req.discordUser });
  } catch (e) {
    console.error("discord me error", e);
    return res.status(500).json({ error: "Unable to fetch profile" });
  }
});

router.get("/validate", validateDiscordToken, async (req, res) => {
  return res.json({
    ok: true,
    user: req.discordUser,
    roles: req.user && req.user.roles,
  });
});

router.post("/logout", async (req, res) => {
  const sessionId = req.cookies && req.cookies.dcsess;
  if (sessionId) {
    const cache = req.app.get("cache");
    if (cache && cache.del) await cache.del(`discord_tokens:${sessionId}`);
    res.clearCookie("dcsess");
  }
  return res.json({ ok: true });
});

// Create a guild webhook
router.post(
  "/guilds/:id/webhooks",
  requireDiscordAuth,
  roleCheck(["admin"]),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { name, channel_id } = req.body;
      if (!channel_id)
        return res.status(400).json({ error: "Missing channel_id" });
      const token = req.discordToken;
      const resp = await fetch(
        `https://discord.com/api/guilds/${id}/webhooks`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name || "Wonky Bot Webhook",
            channel_id,
          }),
        },
      );
      const json = await resp.json();
      req.app.get("auditLogger")?.("discord.webhook.create", {
        guild: id,
        channel_id,
        session: req.cookies?.dcsess,
      });
      return res.json({ webhook: json });
    } catch (e) {
      console.error("create guild webhook error", e);
      return res.status(500).json({ error: "Failed to create webhook" });
    }
  },
);

// Revoke (delete) a session
router.post("/revoke", requireDiscordAuth, async (req, res) => {
  try {
    const cache = req.app.get("cache");
    const sessionId = req.cookies && req.cookies.dcsess;
    if (cache && cache.del && sessionId)
      await cache.del(`discord_tokens:${sessionId}`);
    res.clearCookie("dcsess");
    req.app.get("auditLogger")?.("discord.revoke", { session: sessionId });
    return res.json({ ok: true });
  } catch (e) {
    console.error("revoke error", e);
    return res.status(500).json({ error: "Failed to revoke token" });
  }
});

// Admin: set the cached service bot token for server-side operations
router.post(
  "/service/set",
  requireDiscordAuth,
  roleCheck(["admin"]),
  async (req, res) => {
    try {
      const { token } = req.body || {};
      if (!token) return res.status(400).json({ error: "Missing token" });
      const cache = req.app.get("cache");
      if (!cache || !cache.set)
        return res.status(500).json({ error: "Cache not available" });
      await cache.set("discord_service_token", { token });
      req.app.get("auditLogger")?.("discord.service.set", {
        by: req.user?.id || req.user?.username,
      });
      return res.json({ ok: true });
    } catch (e) {
      console.error("set service token error", e);
      return res.status(500).json({ error: "Failed to set token" });
    }
  },
);

// Admin: revoke the cached service token
router.post(
  "/service/revoke",
  requireDiscordAuth,
  roleCheck(["admin"]),
  async (req, res) => {
    try {
      const cache = req.app.get("cache");
      if (cache && cache.del) await cache.del("discord_service_token");
      req.app.get("auditLogger")?.("discord.service.revoke", {
        by: req.user?.id || req.user?.username,
      });
      return res.json({ ok: true });
    } catch (e) {
      console.error("revoke service token error", e);
      return res.status(500).json({ error: "Failed to revoke service token" });
    }
  },
);

// Admin: check if a service token is set (status only)
router.get(
  "/service",
  requireDiscordAuth,
  roleCheck(["admin"]),
  async (req, res) => {
    try {
      const cache = req.app.get("cache");
      const t =
        cache && cache.get ? await cache.get("discord_service_token") : null;
      return res.json({ hasToken: Boolean(t) });
    } catch (e) {
      console.error("get service token status", e);
      return res.status(500).json({ error: "Failed to check service token" });
    }
  },
);

// Admin route to view webhook queue
router.get(
  "/webhooks/queue",
  requireDiscordAuth,
  roleCheck(["admin"]),
  async (req, res) => {
    try {
      const queue = req.app.get("webhookQueue") || [];
      return res.json({ length: queue.length, items: queue.slice(0, 20) });
    } catch (e) {
      console.error("get queue error", e);
      return res.status(500).json({ error: "Could not retrieve queue" });
    }
  },
);

// Demo route mirroring GitHub demo
router.get("/demo", async (req, res) => {
  try {
    const cache = req.app.get("cache");
    const sessionId = req.cookies && req.cookies.dcsess;
    const userToken =
      sessionId && cache && cache.get
        ? await cache.get(`discord_tokens:${sessionId}`).catch(() => null)
        : null;
    if (userToken) {
      try {
        const resp = await fetch("https://discord.com/api/users/@me", {
          headers: { Authorization: `Bearer ${userToken.access_token}` },
        });
        const json = await resp.json();
        return res.json({ demo: true, mode: "user", profile: json });
      } catch (e) {
        console.warn("Failed to fetch user profile", e?.message || e);
      }
    }
    return res.json({
      demo: true,
      mode: "mock",
      profile: { id: "123", username: "wonky-bot" },
    });
  } catch (e) {
    console.error("discord demo error", e);
    return res.status(500).json({ demo: false, error: String(e) });
  }
});

// Public health endpoint to check worker & service token status
router.get("/health", async (req, res) => {
  try {
    const cache = req.app.get("cache");
    const hasService =
      cache && cache.get
        ? Boolean(await cache.get("discord_service_token"))
        : false;
    const botConnected = Boolean(req.app.get("discordBotConnected"));
    return res.json({ ok: true, hasService, botConnected });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e) });
  }
});

export default router;
