import express from "express";
import request from "supertest";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import geminiRouter from "../../server/geminiProxyRoutes.js";
import * as personas from "../../server/personas.js";

describe("gemini proxy route", () => {
  let originalFetch;
  beforeEach(() => {
    originalFetch = globalThis.fetch;
    process.env.GEMINI_API_KEY = "fake";
  });
  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("merges persona system instructions into the system instruction sent to the LLM", async () => {
    const app = express();
    app.use(express.json());
    app.use("/api/gemini", geminiRouter);

    let capturedBody = null;
    globalThis.fetch = async (url, opts) => {
      capturedBody = JSON.parse(opts.body);
      return { ok: true, json: async () => ({ output: { text: "ok" } }) };
    };

    const personaInstr = personas.getPersonaInstruction("grandma");

    const res = await request(app)
      .post("/api/gemini")
      .send({
        prompt: "hi",
        systemInstruction: "CLIENT INSTR",
        personaKey: "grandma",
      })
      .set("Accept", "application/json");

    expect(res.status).toBe(200);
    expect(capturedBody).not.toBeNull();
    const systemContent = capturedBody.prompt[0].content;
    expect(systemContent).toContain(personaInstr);
    expect(systemContent).toContain("CLIENT INSTR");
  });
});
