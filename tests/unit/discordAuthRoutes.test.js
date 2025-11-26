import express from "express";
import request from "supertest";
import { vi, describe, it, expect, beforeEach } from "vitest";
import discordRouter from "../../server/discordAuthRoutes.js";

describe("discord auth admin endpoints", () => {
  let cache;
  let sessionId;
  beforeEach(() => {
    sessionId = "sess-test-123";
    cache = {
      store: new Map(),
      async get(k) {
        return this.store.get(k);
      },
      async set(k, v) {
        this.store.set(k, v);
      },
      async del(k) {
        this.store.delete(k);
      },
    };
    // stub global fetch for the /users/@me calls
    global.fetch = vi.fn(async (url, opts) => {
      return {
        status: 200,
        json: async () => ({ id: "123", username: "testadmin" }),
      };
    });
    process.env.DISCORD_ADMIN_USERS = "testadmin";
  });

  it("sets service token when admin", async () => {
    const app = express();
    app.set("cache", cache);
    app.use(express.json());
    // seed a valid session in cache
    await cache.set(`discord_tokens:${sessionId}`, { access_token: "uxtoken" });
    app.use(
      "/api/discord",
      (req, res, next) => {
        req.cookies = { dcsess: sessionId };
        next();
      },
      discordRouter,
    );

    const res = await request(app)
      .post("/api/discord/service/set")
      .set("Cookie", `dcsess=${sessionId}`)
      .send({ token: "botservice" });
    expect(res.status).toBe(200);
    expect(await cache.get("discord_service_token")).toEqual({
      token: "botservice",
    });
  });

  it("returns 403 for set service token when not admin", async () => {
    const app = express();
    app.set("cache", cache);
    app.use(express.json());
    // stub fetch to return a non-admin user
    global.fetch = vi.fn(async () => ({
      status: 200,
      json: async () => ({ id: "124", username: "notadmin" }),
    }));
    process.env.DISCORD_ADMIN_USERS = "testadmin";
    await cache.set(`discord_tokens:${sessionId}`, { access_token: "uxtoken" });
    app.use(
      "/api/discord",
      (req, res, next) => {
        req.cookies = { dcsess: sessionId };
        next();
      },
      discordRouter,
    );
    const res = await request(app)
      .post("/api/discord/service/set")
      .set("Cookie", `dcsess=${sessionId}`)
      .send({ token: "botservice2" });
    expect(res.status).toBe(403);
  });

  it("revoke service token when admin", async () => {
    const app = express();
    app.set("cache", cache);
    app.use(express.json());
    // seed a valid session in cache
    await cache.set(`discord_tokens:${sessionId}`, { access_token: "uxtoken" });
    await cache.set("discord_service_token", { token: "botservice" });
    app.use(
      "/api/discord",
      (req, res, next) => {
        req.cookies = { dcsess: sessionId };
        next();
      },
      discordRouter,
    );

    const res = await request(app)
      .post("/api/discord/service/revoke")
      .set("Cookie", `dcsess=${sessionId}`)
      .send({});
    expect(res.status).toBe(200);
    expect(await cache.get("discord_service_token")).toBeUndefined();
  });

  it("status shows token presence", async () => {
    const app = express();
    app.set("cache", cache);
    app.use(express.json());
    // seed a valid session & service token
    await cache.set(`discord_tokens:${sessionId}`, { access_token: "uxtoken" });
    await cache.set("discord_service_token", { token: "botservice" });
    app.use(
      "/api/discord",
      (req, res, next) => {
        req.cookies = { dcsess: sessionId };
        next();
      },
      discordRouter,
    );

    const res = await request(app)
      .get("/api/discord/service")
      .set("Cookie", `dcsess=${sessionId}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ hasToken: true });
  });

  it("creates a guild webhook when admin", async () => {
    const app = express();
    app.set("cache", cache);
    app.use(express.json());
    // stub fetch to return appropriate response for user@me and webhook creation
    global.fetch = vi.fn(async (url, opts) => {
      if (String(url).includes("/api/users/@me")) {
        return {
          status: 200,
          json: async () => ({ id: "123", username: "testadmin" }),
        };
      }
      if (String(url).includes("/api/guilds/")) {
        return {
          status: 200,
          json: async () => ({ id: "webhook-1", token: "t" }),
        };
      }
      return { status: 404, json: async () => ({}) };
    });
    await cache.set(`discord_tokens:${sessionId}`, { access_token: "uxtoken" });
    app.use(
      "/api/discord",
      (req, res, next) => {
        req.cookies = { dcsess: sessionId };
        next();
      },
      discordRouter,
    );
    const res = await request(app)
      .post("/api/discord/guilds/g/webhooks")
      .set("Cookie", `dcsess=${sessionId}`)
      .send({ channel_id: "c", name: "bot" });
    expect(res.status).toBe(200);
    expect(res.body.webhook).toBeDefined();
    expect(res.body.webhook.id).toBe("webhook-1");
  });
});
