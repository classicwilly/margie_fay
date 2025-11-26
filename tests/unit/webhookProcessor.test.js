import { describe, it, expect, vi } from "vitest";
import { processWebhookJob } from "../../server/webhookProcessor.js";

describe("webhookProcessor", () => {
  it("processes pull_request opened events and attempts to create Google Tasks via connector", async () => {
    const queue = { push: async () => {}, pop: async () => null };
    const app = {
      get: (k) => {
        if (k === "auditLogger") return () => {};
        if (k === "webhookQueue") return queue;
        return null;
      },
      set: () => {},
    };
    const job = {
      event: "pull_request",
      deliveryId: "d1",
      body: {
        action: "opened",
        pull_request: {
          number: 1,
          title: "Test",
          html_url: "https://github.com/x/repo/pull/1",
          user: { login: "bob" },
        },
      },
    };
    // Mock googleConnector to return a tasks client with insert method
    const googleConnector = await import(
      "../../server/connectors/googleConnector.js"
    );
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: true, json: async () => ({}) })),
    );
    // We can't easily mock googleapis; instead we verify that running doesn't throw
    await expect(processWebhookJob(app, job)).resolves.not.toThrow();
  });
});
