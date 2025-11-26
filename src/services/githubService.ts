export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description?: string;
}

export interface GitHubIssue {
  number: number;
  title: string;
  body?: string;
  html_url: string;
}

class GitHubService {
  async signIn() {
    window.location.href = "/api/github/auth";
  }

  async getProfile() {
    const r = await fetch("/api/github/me");
    if (!r.ok) {
      throw new Error("Not signed in");
    }
    const json = await r.json();
    return json.profile;
  }

  async listRepos(max: number = 50) {
    const r = await fetch(`/api/github/repos?max=${max}`);
    if (!r.ok) {
      throw new Error("Failed to list repos");
    }
    const json = await r.json();
    return json.repos as GitHubRepo[];
  }

  async createIssue(owner: string, repo: string, title: string, body?: string) {
    const r = await fetch(`/api/github/repos/${owner}/${repo}/issues`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body }),
    });
    if (!r.ok) {
      throw new Error("Failed to create issue");
    }
    const json = await r.json();
    return json.issue as GitHubIssue;
  }

  async createPR(
    owner: string,
    repo: string,
    title: string,
    head: string,
    base: string,
    body?: string,
  ) {
    const r = await fetch(`/api/github/repos/${owner}/${repo}/pulls`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, head, base, body }),
    });
    if (!r.ok) {
      throw new Error("Failed to create PR");
    }
    const json = await r.json();
    return json.pr;
  }

  async createComment(
    owner: string,
    repo: string,
    number: string | number,
    body: string,
  ) {
    const r = await fetch(
      `/api/github/repos/${owner}/${repo}/issues/${number}/comments`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      },
    );
    if (!r.ok) {
      throw new Error("Failed to create comment");
    }
    const json = await r.json();
    return json.comment;
  }

  async createOrUpdateFile(
    owner: string,
    repo: string,
    path: string,
    message: string,
    contentBase64: string,
    sha?: string,
  ) {
    const r = await fetch(
      `/api/github/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, contentBase64: contentBase64, sha }),
      },
    );
    if (!r.ok) {
      throw new Error("Failed to create/update file");
    }
    const json = await r.json();
    return json.result;
  }

  async createWebhook(
    owner: string,
    repo: string,
    url: string,
    secret: string,
    events?: string[],
  ) {
    const r = await fetch(`/api/github/repos/${owner}/${repo}/webhooks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, secret, events }),
    });
    if (!r.ok) {
      throw new Error("Failed to create webhook");
    }
    const json = await r.json();
    return json.webhook;
  }

  async validateToken() {
    const r = await fetch("/api/github/validate");
    if (!r.ok) {
      throw new Error("Token invalid or not signed in");
    }
    return await r.json();
  }

  async revokeToken() {
    const r = await fetch("/api/github/revoke", { method: "POST" });
    if (!r.ok) {
      throw new Error("Failed to revoke token");
    }
    return await r.json();
  }

  async signOut() {
    await fetch("/api/github/logout", { method: "POST" });
  }
}

export const githubService = new GitHubService();
