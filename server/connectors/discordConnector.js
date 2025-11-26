// Minimal Discord connector for server-side workflows
export default function discordConnector(cache = null) {
  async function serviceToken() {
    // If a service bot token is configured in env, use it; otherwise try cache
    if (process.env.DISCORD_SERVICE_BOT_TOKEN)
      return process.env.DISCORD_SERVICE_BOT_TOKEN;
    if (cache && cache.get) {
      const o = await cache.get("discord_service_token").catch(() => null);
      if (o && o.token) return o.token;
    }
    return null;
  }

  async function getMe({ token } = {}) {
    const t = token || (await serviceToken());
    if (!t) throw new Error("No Discord token available");
    const resp = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bot ${t}` },
    });
    if (!resp.ok) throw new Error(`Get me failed: ${await resp.text()}`);
    return resp.json();
  }

  async function createGuildWebhook({ guildId, name, channel_id, token } = {}) {
    const t = token || (await serviceToken());
    if (!t) throw new Error("No Discord token available");
    const resp = await fetch(
      `https://discord.com/api/guilds/${guildId}/webhooks`,
      {
        method: "POST",
        headers: {
          Authorization: `Bot ${t}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name || "Wonky Webhook", channel_id }),
      },
    );
    if (!resp.ok)
      throw new Error(`Create guild webhook failed: ${await resp.text()}`);
    return resp.json();
  }

  async function sendWebhookMessage({
    webhookId,
    webhookToken,
    content,
    embeds,
    username,
    avatar_url,
  } = {}) {
    if (!webhookId || !webhookToken) throw new Error("Missing webhook details");
    const resp = await fetch(
      `https://discord.com/api/webhooks/${webhookId}/${webhookToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, embeds, username, avatar_url }),
      },
    );
    if (!resp.ok)
      throw new Error(`Send webhook message failed: ${await resp.text()}`);
    return resp.json();
  }

  return { getMe, createGuildWebhook, sendWebhookMessage };
}

export { discordConnector };
