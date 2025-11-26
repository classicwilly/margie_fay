import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import rateLimit from "express-rate-limit";
import MemoryCache from "./src/utils/cache.js";
import RedisCache from "./src/utils/redisCache.js";
import helmet from "helmet";
import cors from "cors";
import * as Sentry from "@sentry/node";
import crypto from "crypto";

// ES Module equivalents of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// When behind a load balancer or Cloud Run, trust the proxy headers
if (process.env.TRUST_PROXY !== "false") app.set("trust proxy", true);
app.use(express.json());
app.use(cookieParser());

// Initialize Sentry (optional) for application-level errors and tracing
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || "development",
  });
  app.use(Sentry.Handlers.requestHandler());
}

// Helmet sets common security headers
app.use(helmet());

// Configure CORS whitelist (ALLOWED_ORIGINS is comma-separated); default to permissive for local/dev.
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
if (allowedOrigins.length) {
  app.use(cors({ origin: allowedOrigins }));
} else {
  app.use(cors());
}
// Cloud Run provides the PORT environment variable, defaulting to 8080 for local development
const port = process.env.PORT || 8080;

// Optional prometheus metrics using prom-client
let promClient;
try {
  // devs may not want to install prom-client by default
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  promClient = require("prom-client");
} catch (e) {}

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, "dist")));

// Rate limiting - customizable via env
const rateLimitWindowMs = Number(
  process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000,
);
const rateLimitMax = Number(process.env.RATE_LIMIT_MAX || 150);
const limiter = rateLimit({ windowMs: rateLimitWindowMs, max: rateLimitMax });

// health & readiness checks
const CACHE_TTL_SECONDS = Number(process.env.CACHE_TTL_SECONDS || 60);
let cache;
if (process.env.REDIS_URL) {
  cache = new RedisCache(CACHE_TTL_SECONDS, process.env.REDIS_URL);
  console.log("Using Redis cache for AI responses");
} else {
  cache = new MemoryCache(CACHE_TTL_SECONDS);
  console.log("Using in-memory cache for AI responses");
}
// Make cache available to routes via `app.get('cache')`
app.set("cache", cache);
app.get("/healthz", (req, res) =>
  res.status(200).json({ status: "ok", uptime: process.uptime() }),
);
app.get("/ready", (req, res) => res.status(200).json({ ready: true }));

app.use("/api/", limiter);

// Server-side Gemini proxy. This keeps the API key out of client bundles and provides one place
// for PII sanitization, telemetry, and abuse-mitigation. Use process.env.GEMINI_API_KEY on the server.
import { getPersonaInstruction } from "./server/personas.js";
import geminiRouter from "./server/geminiProxyRoutes.js";

app.use("/api/gemini", geminiRouter);

// Backwards compatible route: keep POST /api/gemini for anyone hitting exact path
// (the router handles the route)
// Backwards compatible /api/gemini POST handler removed — the router `geminiProxyRoutes.js` handles the route instead.
// The previous fallback logic was intentionally removed to avoid duplicate processing and to keep a single source of truth.

if (promClient) {
  // Custom counters for application telemetry
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Counter } = require("prom-client");
    // Count of Playwright/AI stub installations during a run (used for telemetry in CI)
    const aiStubCounter = new Counter({
      name: "wonky_ai_stub_events_total",
      help: "Total calls to instrument AI stub in tests",
    });
    // Count of advisory board interactions and interviews
    const advisoryCounter = new Counter({
      name: "wonky_advisory_interactions_total",
      help: "Total advisory board interactions",
    });

    app.post("/ai_stub_event", (req, res) => {
      aiStubCounter.inc();
      res.json({ ok: true });
    });

    app.post("/advisory/interview", (req, res) => {
      advisoryCounter.inc();
      res.json({ ok: true });
    });
  } catch (e) {
    // non-fatal - prom-client not available
    console.warn("aiStub telemetry not enabled", e?.message || e);
  }
  // initialize default metrics for the Node process
  promClient.collectDefaultMetrics();
  app.get("/metrics", async (req, res) => {
    try {
      const metrics = await promClient.register.metrics();
      res.set("Content-Type", promClient.register.contentType);
      res.send(metrics);
    } catch (err) {
      res.status(500).send(err?.message || "error");
    }
  });
}

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  if (
    !process.env.GEMINI_API_KEY &&
    process.env.NODE_ENV === "production" &&
    !process.env.DEV_ALLOW_MISSING_GEMINI_KEY
  ) {
    console.error(
      "GEMINI_API_KEY is not set - the Gemini proxy will not function. Set GEMINI_API_KEY in Secrets/Env.",
    );
    console.error(
      "Failing fast for production safety. Use DEV_ALLOW_MISSING_GEMINI_KEY=true to override in non-production deploys.",
    );
    process.exit(1);
  } else if (!process.env.GEMINI_API_KEY) {
    console.warn(
      "Warning: GEMINI_API_KEY is not set on the server. The /api/gemini proxy will fail until the key is provisioned.",
    );
  } else {
    console.log("Gemini proxy available at POST /api/gemini");
  }
});

// Mount Google Workspace demo routes
import googleWorkspaceRoutes from "./server/googleWorkspaceRoutes.js";
app.use("/api/google", googleWorkspaceRoutes);
import googleAuthRoutes from "./server/googleAuthRoutes.js";
app.use("/api/google", googleAuthRoutes);
import githubAuthRoutes from "./server/githubAuthRoutes.js";
app.use("/api/github", githubAuthRoutes);
import discordAuthRoutes from "./server/discordAuthRoutes.js";
app.use("/api/discord", discordAuthRoutes);
import discordWebhooks from "./server/discordWebhooks.js";
app.use("/api/discord/webhooks", discordWebhooks);
import discordVoiceRoutes from "./server/discordVoiceRoutes.js";
app.use("/api/discord/voice", discordVoiceRoutes);
// Periodically refresh the GitHub App service token if installed
try {
  const { createInstallationToken } = await import(
    "./server/connectors/index.js"
  );
  if (process.env.GITHUB_APP_ID && process.env.GITHUB_SERVICE_INSTALLATION_ID) {
    const rotationInterval = Number(
      process.env.GITHUB_SERVICE_ROTATION_SECONDS || 60 * 60 * 6,
    ); // default 6 hours
    const rotate = async () => {
      try {
        const token = await createInstallationToken(
          process.env.GITHUB_SERVICE_INSTALLATION_ID,
        );
        if (token) {
          await cache.set("github_service_token", { token });
          process.env.GITHUB_SERVICE_TOKEN = token; // useful for connectors that read env
          app.get("auditLogger")?.("github.service.rotate", { ts: Date.now() });
          console.log("Rotated GitHub service token");
        }
      } catch (e) {
        console.warn("Failed to rotate GitHub service token", e?.message || e);
      }
    };
    // Rotate immediately and then on interval
    rotate();
    setInterval(rotate, rotationInterval * 1000);
  }
} catch (e) {
  console.warn(
    "GitHub App token rotation not configured or failed to import",
    e?.message || e,
  );
}
// Mount security middleware and AI proxy routes
import aiProxyRoutes from "./server/aiProxyRoutes.js";
import { auditLoggerFactory } from "./server/securityMiddleware.js";
// Create a simple in-memory audit store to start with. In prod we'll wire to DB.
const auditStore = [];
app.set("auditStore", auditStore);
app.set("auditLogger", auditLoggerFactory(app));
// initialize webhook queue for background processors
app.set("webhookQueue", []);
app.use("/api/ai", aiProxyRoutes);
// Start the webhook processor (polls the webhookQueue and executes jobs)
import initWebhookProcessor from "./server/webhookProcessor.js";
import { createQueue } from "./server/queue.js";

// Create a queue instance: prefer Redis when configured
const queue = createQueue(process.env.REDIS_URL);
app.set("webhookQueue", queue);
// Hook queue disconnection for graceful shutdown
app.set("queueClient", queue);
initWebhookProcessor(app).catch(() => {});
// Start the Discord bot worker (if configured). Use a runtime-eval import so
// bundlers like Vite do not resolve optional Discord dependencies during
// transform time; only import if an env flag or token indicates the bot
// should be started.
try {
  const enableBot =
    (process.env.DISCORD_ENABLE_BOT_WORKER || "false").toLowerCase() === "true";
  const hasToken = !!process.env.DISCORD_SERVICE_BOT_TOKEN;
  if (enableBot || hasToken) {
    (async () => {
      try {
        const mod = await eval('import("./server/discordBotWorker.js")');
        const initDiscordBotWorker = mod?.default || mod?.initDiscordBotWorker;
        if (typeof initDiscordBotWorker === "function") {
          initDiscordBotWorker(app).catch((e) =>
            console.warn("Discord bot worker failed to start", e?.message || e),
          );
        }
      } catch (e) {
        console.warn("Discord bot worker import failed", e?.message || e);
      }
    })();
  }
} catch (e) {
  console.warn(
    "Failed to check Discord bot worker enablement",
    e?.message || e,
  );
}

// Catch-all: Serve SPA for non-API routes. This MUST come AFTER API endpoints above.
app.get("*", (req, res) => {
  if (
    req.path.startsWith("/api/") ||
    req.path.startsWith("/metrics") ||
    req.path.startsWith("/ai_stub_event")
  ) {
    return res.status(404).send("Not found");
  }
  return res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// If Sentry is active, attach the error handler middleware
if (process.env.SENTRY_DSN) {
  app.use(Sentry.Handlers.errorHandler());
}

// graceful shutdown
const shutdown = async (signal) => {
  console.log(`Shutting down due to ${signal}`);
  try {
    if (cache && cache.disconnect) await cache.disconnect();
  } catch (e) {
    console.warn("Error closing cache", e?.message || e);
  }
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
  setTimeout(() => {
    console.warn("Force exit");
    process.exit(1);
  }, 10000);
};
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection", err);
  if (Sentry.getCurrentHub().getClient()) Sentry.captureException(err);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception", err);
  if (Sentry.getCurrentHub().getClient()) Sentry.captureException(err);
  // For safety, exit after a short delay
  setTimeout(() => process.exit(1), 10000);
});
