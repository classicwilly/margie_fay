import { describe, it, expect, vi } from "vitest";
import { githubService } from "../../src/services/githubService";

describe("githubService", () => {
  afterEach(() => {
    // @ts-ignore
    global.fetch = undefined;
  });

  it("lists repos from server endpoint", async () => {
    const repoList = [
      {
        id: 1,
        name: "repo1",
        full_name: "me/repo1",
        private: false,
        html_url: "https://github.com/me/repo1",
      },
    ];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (_url: string) => ({
        ok: true,
        json: async () => ({ repos: repoList }),
      })),
    );
    const repos = await githubService.listRepos(5);
    expect(repos).toEqual(repoList);
    expect((global.fetch as any).mock.calls[0][0]).toContain(
      "/api/github/repos",
    );
  });

  it("throws when create issue fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({ ok: false, json: async () => ({ error: "nope" }) })),
    );
    await expect(
      githubService.createIssue("owner", "repo", "title"),
    ).rejects.toThrow();
  });

  it("creates a PR via server endpoint", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (_url: string, _opts?: any) => ({
        ok: true,
        json: async () => ({ pr: { number: 123, title: "My PR" } }),
      })),
    );
    const pr = await githubService.createPR(
      "me",
      "repo",
      "My PR",
      "feature-branch",
      "main",
    );
    expect(pr).toEqual({ number: 123, title: "My PR" });
  });

  it("creates comment via server endpoint", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({ comment: { id: 1, body: "ok" } }),
      })),
    );
    const c = await githubService.createComment("me", "repo", 1, "ok");
    expect(c).toEqual({ id: 1, body: "ok" });
  });
});
