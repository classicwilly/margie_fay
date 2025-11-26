// Minimal GitHub connector for server-side workflows
export default function githubConnector(cache = null) {
  const serviceToken = async () => {
    if (process.env.GITHUB_SERVICE_TOKEN)
      return process.env.GITHUB_SERVICE_TOKEN;
    if (cache && cache.get) {
      const o = await cache.get("github_service_token").catch(() => null);
      if (o && o.token) return o.token;
    }
    return null;
  };

  async function listRepos({ token } = {}) {
    const t = token || (await serviceToken());
    if (!t) throw new Error("No GitHub token available");
    const resp = await fetch(
      `https://api.github.com/user/repos?per_page=50&sort=updated`,
      {
        headers: { Authorization: `token ${t}`, Accept: "application/json" },
      },
    );
    if (!resp.ok) {
      const txt = await resp.text();
      throw new Error(`List repos failed: ${txt}`);
    }
    return resp.json();
  }

  async function createIssue({ owner, repo, title, body, token } = {}) {
    const t = token || (await serviceToken());
    if (!t) throw new Error("No GitHub token available");
    const resp = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues`,
      {
        method: "POST",
        headers: {
          Authorization: `token ${t}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, body }),
      },
    );
    if (!resp.ok) throw new Error(`Create issue failed: ${await resp.text()}`);
    return resp.json();
  }

  async function createPR({
    owner,
    repo,
    title,
    head,
    base,
    body,
    token,
  } = {}) {
    const t = token || (await serviceToken());
    if (!t) throw new Error("No GitHub token available");
    const resp = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/pulls`,
      {
        method: "POST",
        headers: {
          Authorization: `token ${t}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, head, base, body }),
      },
    );
    if (!resp.ok) throw new Error(`Create PR failed: ${await resp.text()}`);
    return resp.json();
  }

  async function createComment({ owner, repo, issueNumber, body, token } = {}) {
    const t = token || (await serviceToken());
    if (!t) throw new Error("No GitHub token available");
    const resp = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}/comments`,
      {
        method: "POST",
        headers: {
          Authorization: `token ${t}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ body }),
      },
    );
    if (!resp.ok)
      throw new Error(`Create comment failed: ${await resp.text()}`);
    return resp.json();
  }

  async function createOrUpdateFile({
    owner,
    repo,
    path,
    message,
    contentBase64,
    sha,
    token,
  } = {}) {
    const t = token || (await serviceToken());
    if (!t) throw new Error("No GitHub token available");
    const body = { message, content: contentBase64 };
    if (sha) body.sha = sha;
    const resp = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${t}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );
    if (!resp.ok)
      throw new Error(`Create/Update file failed: ${await resp.text()}`);
    return resp.json();
  }

  async function createWebhook({
    owner,
    repo,
    url,
    secret,
    events = ["push", "pull_request"],
    token,
  } = {}) {
    const t = token || (await serviceToken());
    if (!t) throw new Error("No GitHub token available");
    const body = {
      config: { url, content_type: "json", secret },
      events,
      active: true,
    };
    const resp = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/hooks`,
      {
        method: "POST",
        headers: {
          Authorization: `token ${t}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );
    if (!resp.ok)
      throw new Error(`Create webhook failed: ${await resp.text()}`);
    return resp.json();
  }

  return {
    listRepos,
    createIssue,
    createPR,
    createComment,
    createOrUpdateFile,
    createWebhook,
  };
}

export { githubConnector };

// Helpers for GitHub App flows
export async function createInstallationToken(installationId) {
  const jwt = await import("jsonwebtoken");
  const appId = process.env.GITHUB_APP_ID;
  const privateKey = process.env.GITHUB_APP_PRIVATE_KEY;
  if (!appId || !privateKey) throw new Error("GitHub App config missing");
  // Create JWT
  const now = Math.floor(Date.now() / 1000);
  const payload = { iat: now - 60, exp: now + 600, iss: appId };
  const token = jwt.sign(payload, privateKey, { algorithm: "RS256" });
  const resp = await fetch(
    `https://api.github.com/app/installations/${installationId}/access_tokens`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
    },
  );
  if (!resp.ok) throw new Error("Failed to create installation token");
  const json = await resp.json();
  return json.token;
}
