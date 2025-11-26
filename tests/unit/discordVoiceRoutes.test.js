import express from "express";
import request from "supertest";
import { vi, describe, it, expect } from "vitest";
import voiceRoutes from "../../server/discordVoiceRoutes.js";

describe("Discord voice routes", () => {
  it("returns 400 when missing fields", async () => {
    const app = express();
    app.use(express.json());
    // make the user an admin on the req via middleware before route
    app.use((req, res, next) => {
      req.user = { id: "1", username: "test", roles: ["admin"] };
      next();
    });
    app.use("/api/discord", voiceRoutes);
    const res = await request(app).post("/api/discord/play").send({});
    expect(res.status).toBe(400);
  });

  it("returns 500 when queue unavailable", async () => {
    const app = express();
    app.use(express.json());
    app.use((req, res, next) => {
      req.user = { id: "1", username: "test", roles: ["admin"] };
      next();
    });
    app.use("/api/discord", voiceRoutes);
    const res = await request(app)
      .post("/api/discord/play")
      .send({ guildId: "g", channelId: "c", text: "hello" });
    expect(res.status).toBe(500);
  });

  it("enqueues a job with queue present", async () => {
    const app = express();
    app.use(express.json());
    const mockQueue = { push: vi.fn(async () => true) };
    app.set("webhookQueue", mockQueue);
    app.use((req, res, next) => {
      req.user = { id: "1", username: "test", roles: ["admin"] };
      next();
    });
    app.use("/api/discord", voiceRoutes);
    const res = await request(app)
      .post("/api/discord/play")
      .send({ guildId: "g", channelId: "c", text: "hello" });
    expect(res.status).toBe(200);
    expect(mockQueue.push).toHaveBeenCalled();
  });

  it("returns 403 when user is not admin", async () => {
    const app = express();
    app.use(express.json());
    app.use((req, res, next) => {
      req.user = { id: "1", username: "test", roles: ["user"] };
      next();
    });
    app.use("/api/discord", voiceRoutes);
    const res = await request(app)
      .post("/api/discord/play")
      .send({ guildId: "g", channelId: "c", text: "hello" });
    expect(res.status).toBe(403);
  });
});
