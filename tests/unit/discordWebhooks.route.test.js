import express from "express";
import request from "supertest";
import { vi, describe, it, expect } from "vitest";
import discordRouter from "../../server/discordWebhooks.js";
import {
  genKeyPair,
  buildSignedDiscordPayload,
} from "../utils/discordTestHelpers";

describe("discord webhook route", () => {
  it("rejects requests when DISCORD_PUBLIC_KEY is not set", async () => {
    const app = express();
    app.use("/discord", discordRouter);
    delete process.env.DISCORD_PUBLIC_KEY;
    // send a signature header so the route reaches the public key check
    const res = await request(app)
      .post("/discord/receive")
      .set("x-signature-ed25519", "deadbeef")
      .set("x-signature-timestamp", "123")
      .set("content-type", "application/json")
      .send("{}");
    expect(res.status).toBe(403);
  });

  it("responds to ping when signature valid", async () => {
    const app = express();
    app.use("/discord", discordRouter);
    const kp = genKeyPair();
    const pkHex = Buffer.from(kp.publicKey).toString("hex");
    process.env.DISCORD_PUBLIC_KEY = pkHex;
    const {
      ts: timestamp,
      sigHex,
      bodyStr,
    } = buildSignedDiscordPayload({ type: 1 }, kp);

    const res = await request(app)
      .post("/discord/receive")
      .set("x-signature-ed25519", sigHex)
      .set("x-signature-timestamp", timestamp)
      .set("content-type", "application/json")
      .send(bodyStr);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ type: 1 });
  });

  it("enqueues webhook jobs with Discord public key and valid signature", async () => {
    const mockQueue = { push: vi.fn(async () => true) };
    const app = express();
    app.set("webhookQueue", mockQueue);
    app.use("/discord", discordRouter);
    const kp = genKeyPair();
    const pkHex = Buffer.from(kp.publicKey).toString("hex");
    process.env.DISCORD_PUBLIC_KEY = pkHex;
    const {
      ts: timestamp,
      sigHex,
      bodyStr,
    } = buildSignedDiscordPayload({ type: 3, data: { name: "test" } }, kp);

    const res = await request(app)
      .post("/discord/receive")
      .set("x-signature-ed25519", sigHex)
      .set("x-signature-timestamp", timestamp)
      .set("content-type", "application/json")
      .send(bodyStr);
    expect(res.status).toBe(200);
    expect(mockQueue.push).toHaveBeenCalled();
  });

  it("rejects when signature headers are missing", async () => {
    const app = express();
    app.use("/discord", discordRouter);
    process.env.DISCORD_PUBLIC_KEY = Buffer.from(
      genKeyPair().publicKey,
    ).toString("hex");
    const res = await request(app)
      .post("/discord/receive")
      .set("content-type", "application/json")
      .send("{}");
    expect(res.status).toBe(400);
  });

  it("returns ok when queue is missing", async () => {
    const app = express();
    app.use("/discord", discordRouter);
    const kp = genKeyPair();
    const { ts, sigHex, bodyStr } = buildSignedDiscordPayload({ type: 3 }, kp);
    process.env.DISCORD_PUBLIC_KEY = Buffer.from(kp.publicKey).toString("hex");
    const res = await request(app)
      .post("/discord/receive")
      .set("x-signature-ed25519", sigHex)
      .set("x-signature-timestamp", ts)
      .set("content-type", "application/json")
      .send(bodyStr);
    expect(res.status).toBe(200);
  });
});
