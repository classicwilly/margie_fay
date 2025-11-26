import { describe, it, expect, vi } from "vitest";
import { discordService } from "../../src/services/discordService";

describe("discordService", () => {
  afterEach(() => {
    // @ts-ignore
    global.fetch = undefined;
  });

  it("gets profile from server", async () => {
    const profile = { id: "1", username: "wonky" };
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async (_url: string) =>
          ({ ok: true, json: async () => ({ profile }) }) as any,
      ),
    );
    const p = await discordService.getProfile();
    expect(p).toEqual(profile);
    expect((global.fetch as any).mock.calls[0][0]).toContain("/api/discord/me");
  });

  it("throws when create webhook fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          ({ ok: false, json: async () => ({ error: "nope" }) }) as any,
      ),
    );
    await expect(
      discordService.createGuildWebhook("g", "name", "c"),
    ).rejects.toThrow();
  });
});
