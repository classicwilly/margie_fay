import { describe, it, expect, vi } from "vitest";
import { discordConnector } from "../../server/connectors/discordConnector.js";

describe("discordConnector", () => {
  afterEach(() => {
    // @ts-ignore
    global.fetch = undefined;
  });

  it("calls getMe and returns json", async () => {
    const data = { id: "1", username: "wonky" };
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: true, json: async () => data }) as any),
    );
    const conn = discordConnector();
    const resp = await conn.getMe({ token: "tok" });
    expect(resp).toEqual(data);
  });

  it("throws when createGuildWebhook fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: false, text: async () => "fail" }) as any),
    );
    const conn = discordConnector();
    await expect(
      conn.createGuildWebhook({ guildId: "g", channel_id: "c", token: "tok" }),
    ).rejects.toThrow();
  });

  it("uses cached service token when env not set", async () => {
    const data = { id: "1", username: "wonky-service" };
    let lastAuth = null;
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url, opts) => {
        lastAuth = opts?.headers?.Authorization;
        return { ok: true, json: async () => data } as any;
      }),
    );
    const cache = {
      get: async (_k) => ({ token: "cached-token" }),
      set: async () => {},
    };
    // ensure env var is not set
    delete process.env.DISCORD_SERVICE_BOT_TOKEN;
    const conn = discordConnector(cache as any);
    const resp = await conn.getMe();
    expect(resp).toEqual(data);
    expect(lastAuth).toBe("Bot cached-token");
  });
});
