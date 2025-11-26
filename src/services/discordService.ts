export interface DiscordProfile {
  id: string;
  username: string;
  discriminator?: string;
  avatar?: string;
}

class DiscordService {
  async signIn() {
    window.location.href = "/api/discord/auth";
  }

  async getProfile() {
    const r = await fetch("/api/discord/me");
    if (!r.ok) {
      throw new Error("Not signed into Discord");
    }
    const json = await r.json();
    return json.profile as DiscordProfile;
  }

  async createGuildWebhook(guildId: string, name: string, channelId: string) {
    const r = await fetch(`/api/discord/guilds/${guildId}/webhooks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, channel_id: channelId }),
    });
    if (!r.ok) {
      throw new Error("Failed to create webhook");
    }
    const json = await r.json();
    return json.webhook;
  }

  async validateToken() {
    const r = await fetch("/api/discord/validate");
    if (!r.ok) {
      throw new Error("Token invalid or not signed in");
    }
    return await r.json();
  }

  async revokeToken() {
    const r = await fetch("/api/discord/revoke", { method: "POST" });
    if (!r.ok) {
      throw new Error("Failed to revoke token");
    }
    return await r.json();
  }

  async signOut() {
    await fetch("/api/discord/logout", { method: "POST" });
  }

  async setServiceToken(token: string) {
    const r = await fetch("/api/discord/service/set", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    if (!r.ok) {
      throw new Error("Failed to set service token");
    }
    return await r.json();
  }

  async revokeServiceToken() {
    const r = await fetch("/api/discord/service/revoke", { method: "POST" });
    if (!r.ok) {
      throw new Error("Failed to revoke service token");
    }
    return await r.json();
  }

  async getServiceTokenStatus() {
    const r = await fetch("/api/discord/service");
    if (!r.ok) {
      throw new Error("Failed to get service token status");
    }
    const json = await r.json();
    return json as { hasToken: boolean };
  }
}

export const discordService = new DiscordService();
