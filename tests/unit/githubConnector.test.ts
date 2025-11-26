import { describe, it, expect, vi } from "vitest";
import { githubConnector } from "../../server/connectors/githubConnector.js";

describe("githubConnector", () => {
  afterEach(() => {
    // @ts-ignore
    global.fetch = undefined;
  });

  it("calls listRepos and returns json", async () => {
    const data = [{ id: 1, name: "repo1" }];
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: true, json: async () => data })),
    );
    const conn = githubConnector();
    const resp = await conn.listRepos({ token: "tok" });
    expect(resp).toEqual(data);
  });

  it("throws when createIssue fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: false, text: async () => "fail" })),
    );
    const conn = githubConnector();
    await expect(
      conn.createIssue({ owner: "me", repo: "r", title: "x", token: "tok" }),
    ).rejects.toThrow();
  });
});
