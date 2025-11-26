import express from "express";
import crypto from "crypto";
import { roleCheck } from "./securityMiddleware.js";
import {
  githubConnector,
  createInstallationToken,
} from "./connectors/index.js";

const router = express.Router();

function getGithubClientConfig() {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const redirectUri =
    process.env.GITHUB_OAUTH_REDIRECT_URI ||
    `http://localhost:${process.env.PORT || 8080}/api/github/callback`;
  if (!clientId || !clientSecret) return null;
  return { clientId, clientSecret, redirectUri };
}

// Redirect to GitHub for OAuth
router.get("/auth", (req, res) => {
  const cfg = getGithubClientConfig();
  if (!cfg) return res.status(400).json({ error: "OAuth not configured" });
  const state = crypto.randomBytes(8).toString("hex");
  const scopes = ["repo", "user", "notifications"];
  const url = `https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(cfg.clientId)}&redirect_uri=${encodeURIComponent(cfg.redirectUri)}&scope=${encodeURIComponent(scopes.join(" "))}&state=${encodeURIComponent(state)}`;
  const cache = req.app.get("cache");
  if (cache && cache.set) cache.set(`gh_oauth_state:${state}`, true);
  return res.redirect(url);
});

// OAuth callback - exchange code for token
router.get("/callback", async (req, res) => {
  try {
    const { code, state } = req.query;
    if (!code) return res.status(400).send("Missing code");
    const cfg = getGithubClientConfig();
    if (!cfg) return res.status(400).send("OAuth not configured");
    const cache = req.app.get("cache");
    if (
      !state ||
      !(
        cache &&
        cache.get &&
        (await cache.get(`gh_oauth_state:${String(state)}`))
      )
    ) {
      return res.status(400).send("Invalid or missing OAuth state");
    }
    if (cache && cache.del) await cache.del(`gh_oauth_state:${String(state)}`);
    const tokenResp = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: cfg.clientId,
          client_secret: cfg.clientSecret,
          code: String(code),
          redirect_uri: cfg.redirectUri,
        }),
      },
    );
    const tokenJson = await tokenResp.json();
    if (!tokenJson || !tokenJson.access_token) {
      console.error("GitHub token exchange failed", tokenJson);
      return res.status(500).send("GitHub token exchange failed");
    }
    const sessionId = crypto.randomBytes(16).toString("hex");
    if (cache && cache.set)
      await cache.set(`github_tokens:${sessionId}`, tokenJson);
    res.cookie("ghsess", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    return res.redirect("/?github_auth=success");
  } catch (err) {
    console.error("GitHub OAuth callback error", err);
    return res.status(500).send("GitHub OAuth callback error");
  }
});

async function getAuthorizedGithubToken(req) {
  const sessionId = req.cookies && req.cookies.ghsess;
  if (!sessionId) return null;
  const cache = req.app.get("cache");
  if (!cache || !cache.get) return null;
  const tokens = await cache.get(`github_tokens:${sessionId}`);
  return tokens && tokens.access_token ? tokens.access_token : null;
}

async function requireGithubAuth(req, res, next) {
  try {
    const token = await getAuthorizedGithubToken(req);
    if (!token)
      return res.status(401).json({ error: "Not signed into GitHub" });
    req.githubToken = token;
    // Attempt to validate token and set roles
    const r = await fetch("https://api.github.com/user", {
      headers: { Authorization: `token ${token}`, Accept: "application/json" },
    });
    if (r.status === 401) {
      const cache = req.app.get("cache");
      if (cache && cache.del)
        await cache.del(`github_tokens:${req.cookies?.ghsess}`);
      res.clearCookie("ghsess");
      return res.status(401).json({ error: "Token invalid or expired" });
    }
    req.githubUser = await r.json();
    const admins = (process.env.GITHUB_ADMIN_USERS || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    req.user = {
      login: req.githubUser.login,
      roles: admins.includes(req.githubUser.login)
        ? ["admin", "github_user"]
        : ["github_user"],
    };
    next();
  } catch (e) {
    console.error("requireGithubAuth error", e);
    return res.status(500).json({ error: "GitHub auth error" });
  }
}

// Validate the token by hitting /user. If 401, clear session cookie and return 401.
async function validateGithubToken(req, res, next) {
  try {
    const token = await getAuthorizedGithubToken(req);
    if (!token) return res.status(401).json({ error: "Not signed in" });
    const r = await fetch("https://api.github.com/user", {
      headers: { Authorization: `token ${token}`, Accept: "application/json" },
    });
    if (r.status === 401) {
      const cache = req.app.get("cache");
      if (cache && cache.del)
        await cache.del(`github_tokens:${req.cookies?.ghsess}`);
      res.clearCookie("ghsess");
      return res.status(401).json({ error: "Token invalid or expired" });
    }
    req.githubUser = await r.json();
    // annotate roles from env config
    const admins = (process.env.GITHUB_ADMIN_USERS || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    req.user = {
      login: req.githubUser.login,
      roles: admins.includes(req.githubUser.login)
        ? ["admin", "github_user"]
        : ["github_user"],
    };
    next();
  } catch (e) {
    console.error("validateGithubToken error", e);
    return res.status(500).json({ error: "Token validation error" });
  }
}

// Who am I?
router.get("/me", requireGithubAuth, async (req, res) => {
  try {
    const resp = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${req.githubToken}`,
        Accept: "application/json",
      },
    });
    const json = await resp.json();
    return res.json({ profile: json });
  } catch (e) {
    console.error("github me error", e);
    return res.status(500).json({ error: "Unable to fetch profile" });
  }
});

router.get("/validate", validateGithubToken, async (req, res) => {
  return res.json({
    ok: true,
    user: req.githubUser,
    roles: req.user && req.user.roles,
  });
});

router.post("/logout", async (req, res) => {
  const sessionId = req.cookies && req.cookies.ghsess;
  if (sessionId) {
    const cache = req.app.get("cache");
    if (cache && cache.del) await cache.del(`github_tokens:${sessionId}`);
    res.clearCookie("ghsess");
  }
  return res.json({ ok: true });
});

// List repos for the authenticated user
router.get("/repos", requireGithubAuth, async (req, res) => {
  try {
    const max = Number(req.query.max || 50);
    const resp = await fetch(
      `https://api.github.com/user/repos?per_page=${max}&sort=updated`,
      {
        headers: {
          Authorization: `token ${req.githubToken}`,
          Accept: "application/json",
        },
      },
    );
    const json = await resp.json();
    return res.json({ repos: json });
  } catch (e) {
    console.error("list repos error", e);
    return res.status(500).json({ error: "Could not list repos" });
  }
});

// Create an issue
router.post(
  "/repos/:owner/:repo/issues",
  requireGithubAuth,
  async (req, res) => {
    try {
      const { owner, repo } = req.params;
      const { title, body } = req.body;
      if (!title) return res.status(400).json({ error: "Missing title" });
      const resp = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/issues`,
        {
          method: "POST",
          headers: {
            Authorization: `token ${req.githubToken}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, body }),
        },
      );
      const json = await resp.json();
      req.app.get("auditLogger")?.("github.issue.create", {
        owner,
        repo,
        title,
        session: req.cookies?.ghsess,
      });
      return res.json({ issue: json });
    } catch (e) {
      console.error("create issue error", e);
      return res.status(500).json({ error: "Failed to create issue" });
    }
  },
);

// Create a pull request
router.post(
  "/repos/:owner/:repo/pulls",
  requireGithubAuth,
  async (req, res) => {
    try {
      const { owner, repo } = req.params;
      const { title, head, base, body } = req.body;
      if (!title || !head || !base)
        return res
          .status(400)
          .json({ error: "Missing fields (title/head/base)" });
      const token = req.githubToken;
      const resp = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/pulls`,
        {
          method: "POST",
          headers: {
            Authorization: `token ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, head, base, body }),
        },
      );
      const json = await resp.json();
      req.app.get("auditLogger")?.("github.pr.create", {
        owner,
        repo,
        title,
        session: req.cookies?.ghsess,
      });
      return res.json({ pr: json });
    } catch (e) {
      console.error("create pr error", e);
      return res.status(500).json({ error: "Failed to create pull request" });
    }
  },
);

// Post a comment on an issue or PR
router.post(
  "/repos/:owner/:repo/issues/:number/comments",
  requireGithubAuth,
  async (req, res) => {
    try {
      const { owner, repo, number } = req.params;
      const { body } = req.body;
      if (!body) return res.status(400).json({ error: "Missing body" });
      const token = req.githubToken;
      const resp = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/issues/${number}/comments`,
        {
          method: "POST",
          headers: {
            Authorization: `token ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ body }),
        },
      );
      const json = await resp.json();
      req.app.get("auditLogger")?.("github.comment.create", {
        owner,
        repo,
        number,
        session: req.cookies?.ghsess,
      });
      return res.json({ comment: json });
    } catch (e) {
      console.error("create comment error", e);
      return res.status(500).json({ error: "Failed to post comment" });
    }
  },
);

// Create or update a file contents (commit)
router.put(
  "/repos/:owner/:repo/contents/*",
  requireGithubAuth,
  async (req, res) => {
    try {
      const { owner, repo } = req.params;
      const path = req.params[0];
      const { message, contentBase64, sha } = req.body;
      if (!message || !contentBase64)
        return res.status(400).json({ error: "Missing message or content" });
      const token = req.githubToken;
      const resp = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`,
        {
          method: "PUT",
          headers: {
            Authorization: `token ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message, content: contentBase64, sha }),
        },
      );
      const json = await resp.json();
      req.app.get("auditLogger")?.("github.file.commit", {
        owner,
        repo,
        path,
        session: req.cookies?.ghsess,
      });
      return res.json({ result: json });
    } catch (e) {
      console.error("create file commit error", e);
      return res.status(500).json({ error: "Failed to create commit" });
    }
  },
);

// Create a webhook for a repo
router.post(
  "/repos/:owner/:repo/webhooks",
  requireGithubAuth,
  roleCheck(["admin"]),
  async (req, res) => {
    try {
      const { owner, repo } = req.params;
      const { url, secret, events } = req.body;
      if (!url || !secret)
        return res.status(400).json({ error: "Missing url or secret" });
      const token = req.githubToken;
      const resp = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/hooks`,
        {
          method: "POST",
          headers: {
            Authorization: `token ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            config: { url, content_type: "json", secret },
            events: events || ["push", "pull_request"],
            active: true,
          }),
        },
      );
      const json = await resp.json();
      req.app.get("auditLogger")?.("github.webhook.create", {
        owner,
        repo,
        url,
        session: req.cookies?.ghsess,
      });
      return res.json({ webhook: json });
    } catch (e) {
      console.error("create webhook error", e);
      return res.status(500).json({ error: "Failed to create webhook" });
    }
  },
);

// A simple revoke - removes the token from the cache and optionally tries to call the GitHub app token revocation
router.post("/revoke", requireGithubAuth, async (req, res) => {
  try {
    const cache = req.app.get("cache");
    const sessionId = req.cookies && req.cookies.ghsess;
    if (cache && cache.del && sessionId)
      await cache.del(`github_tokens:${sessionId}`);
    res.clearCookie("ghsess");
    // optionally attempt revoke via GitHub app API if secrets are provided (not implemented here)
    req.app.get("auditLogger")?.("github.revoke", { session: sessionId });
    return res.json({ ok: true });
  } catch (e) {
    console.error("revoke error", e);
    return res.status(500).json({ error: "Failed to revoke token" });
  }
});

// Admin: view the webhook queue
router.get(
  "/webhooks/queue",
  requireGithubAuth,
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

// Admin: replay the recent webhook jobs
router.post(
  "/webhooks/replay",
  requireGithubAuth,
  roleCheck(["admin"]),
  async (req, res) => {
    try {
      const count = Number(req.body.count || 10);
      const queue = req.app.get("webhookQueue") || [];
      const toReplay = queue.slice(-count);
      const wp = (await import("./webhookProcessor.js")).processWebhookJob;
      for (const job of toReplay) {
        wp(req.app, job).catch((err) => console.warn("replay job error", err));
      }
      return res.json({ ok: true, replayed: toReplay.length });
    } catch (e) {
      console.error("replay error", e);
      return res.status(500).json({ error: "Failed to replay" });
    }
  },
);

// Create an installation token for a GitHub App (admin only)
router.post(
  "/app/installation-token",
  requireGithubAuth,
  roleCheck(["admin"]),
  async (req, res) => {
    try {
      const { installationId } = req.body || {};
      if (!installationId)
        return res.status(400).json({ error: "Missing installationId" });
      const token = await createInstallationToken(installationId).catch(
        () => null,
      );
      if (!token)
        return res
          .status(500)
          .json({ error: "Failed to create installation token" });
      req.app.get("auditLogger")?.("github.app.installation_token", {
        installationId,
        session: req.cookies?.ghsess,
      });
      return res.json({ token });
    } catch (e) {
      console.error("create installation token error", e);
      return res
        .status(500)
        .json({ error: "Failed to create installation token" });
    }
  },
);

// Rotate service token by creating an installation token for configured installation ID
router.post(
  "/service/refresh",
  requireGithubAuth,
  roleCheck(["admin"]),
  async (req, res) => {
    try {
      const installationId = process.env.GITHUB_SERVICE_INSTALLATION_ID;
      if (!installationId)
        return res
          .status(400)
          .json({ error: "GITHUB_SERVICE_INSTALLATION_ID not configured" });
      const newToken = await createInstallationToken(installationId);
      if (!newToken)
        return res.status(500).json({ error: "Failed to refresh token" });
      const cache = req.app.get("cache");
      if (cache && cache.set)
        await cache.set("github_service_token", { token: newToken });
      req.app.get("auditLogger")?.("github.service.rotate", { installationId });
      return res.json({ ok: true });
    } catch (e) {
      console.error("service token refresh error", e);
      return res.status(500).json({ error: "Failed to rotate token" });
    }
  },
);

// webhook receiver endpoint
router.post(
  "/webhooks/receive",
  express.json({ type: "application/json" }),
  async (req, res) => {
    try {
      // Validate X-Hub-Signature-256 if webhook secret set
      const secret = process.env.GITHUB_WEBHOOK_SECRET;
      if (secret) {
        const signature = req.headers["x-hub-signature-256"];
        if (!signature)
          return res.status(400).json({ error: "Missing signature" });
        const crypto = await import("crypto");
        const hmac = crypto.createHmac("sha256", secret);
        const payload = JSON.stringify(req.body);
        const digest = `sha256=${hmac.update(payload).digest("hex")}`;
        if (
          !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest))
        ) {
          return res.status(403).json({ error: "Invalid signature" });
        }
      }
      const event = req.headers["x-github-event"];
      const deliveryId = req.headers["x-github-delivery"];
      // Enrich audit trail for PR/Issue events
      try {
        if (event === "pull_request") {
          const pr = req.body?.pull_request;
          req.app.get("auditLogger")?.("github.webhook.pr", {
            action: req.body.action,
            pr: {
              id: pr?.id,
              number: pr?.number,
              title: pr?.title,
              url: pr?.html_url,
            },
            deliveryId,
          });
        } else if (event === "issues") {
          const issue = req.body?.issue;
          req.app.get("auditLogger")?.("github.webhook.issue", {
            action: req.body.action,
            issue: {
              id: issue?.id,
              number: issue?.number,
              title: issue?.title,
            },
            deliveryId,
          });
        } else {
          // Enqueue jobs for processing
          const queue = req.app.get("webhookQueue");
          if (queue && queue.push)
            await queue.push("webhook", { event, deliveryId, body: req.body });
          // For authenticated admin API we also allow enqueuing with extra metadata
          req.app.get("auditLogger")?.("webhook.queue.enqueue", {
            event,
            deliveryId,
          });
          req.app.get("auditLogger")?.("github.webhook.received", {
            event,
            deliveryId,
            body: req.body,
          });
        }
      } catch (err) {
        req.app.get("auditLogger")?.("github.webhook.received", {
          event,
          deliveryId,
          body: req.body,
        });
      }
      return res.json({ ok: true });
    } catch (e) {
      console.error("webhook receive error", e);
      return res.status(500).json({ error: "Failed processing webhook" });
    }
  },
);

export default router;

// Demo route - show sample or attempt to list repos using a service token or user token
router.get("/demo", async (req, res) => {
  try {
    const cache = req.app.get("cache");
    const sessionId = req.cookies && req.cookies.ghsess;
    const userToken =
      sessionId && cache && cache.get
        ? await cache.get(`github_tokens:${sessionId}`).catch(() => null)
        : null;
    const serviceToken = process.env.GITHUB_SERVICE_TOKEN;
    if (userToken) {
      // try to list with user token
      try {
        const resp = await fetch(
          "https://api.github.com/user/repos?per_page=5&sort=updated",
          {
            headers: {
              Authorization: `token ${userToken.access_token || userToken.token || userToken}`,
              Accept: "application/json",
            },
          },
        );
        const json = await resp.json();
        return res.json({ demo: true, mode: "user", repos: json });
      } catch (e) {
        console.warn("Failed to list user repos", e?.message || e);
      }
    }
    if (serviceToken) {
      try {
        const resp = await fetch(
          "https://api.github.com/user/repos?per_page=5&sort=updated",
          {
            headers: {
              Authorization: `token ${serviceToken}`,
              Accept: "application/json",
            },
          },
        );
        const json = await resp.json();
        return res.json({ demo: true, mode: "service", repos: json });
      } catch (e) {
        console.warn(
          "Failed to list repos with service token",
          e?.message || e,
        );
      }
    }
    // fallback sample
    return res.json({
      demo: true,
      mode: "mock",
      repos: [
        {
          id: 1,
          name: "wonky-sample",
          full_name: "wonky/wonky-sample",
          private: false,
          html_url: "https://github.com/wonky/wonky-sample",
        },
      ],
    });
  } catch (e) {
    console.error("github demo error", e);
    return res.status(500).json({ demo: false, error: String(e) });
  }
});
