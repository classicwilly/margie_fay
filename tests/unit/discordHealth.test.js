import express from "express";
import request from "supertest";
import { describe, it, expect } from "vitest";
import discordRouter from "../../server/discordAuthRoutes.js";

describe("discord health endpoint", () => {
  it("returns botConnected false and hasService false when not configured", async () => {
    const app = express();
    app.set("cache", { get: async () => null });
    app.use("/api/discord", discordRouter);
    const res = await request(app).get("/api/discord/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      ok: true,
      hasService: false,
      botConnected: false,
    });
  });

  it("returns botConnected true and hasService true when configured", async () => {
    const app = express();
    const cache = { get: async (k) => ({ token: "ok" }) };
    app.set("cache", cache);
    app.set("discordBotConnected", true);
    app.use("/api/discord", discordRouter);
    const res = await request(app).get("/api/discord/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      ok: true,
      hasService: true,
      botConnected: true,
    });
  });
});
