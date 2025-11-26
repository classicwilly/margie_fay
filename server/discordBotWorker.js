import { createQueue } from "./queue.js";
let client = null;
let player = null;
let isReady = false;

// Lazily import heavy discord libs to avoid blowing Node memory if not configured
async function initBot(app) {
  const token = process.env.DISCORD_SERVICE_BOT_TOKEN;
  if (!token) {
    console.warn(
      "No DISCORD_SERVICE_BOT_TOKEN configured; bot worker disabled",
    );
    return;
  }
  try {
    const dmod = await eval('import("discord.js")');
    const { Client, GatewayIntentBits } = dmod;
    const vmod = await eval('import("@discordjs/voice")');
    const {
      joinVoiceChannel,
      createAudioPlayer,
      createAudioResource,
      AudioPlayerStatus,
      StreamType,
    } = vmod;

    client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
      ],
    });
    client.on("ready", () => {
      isReady = true;
      if (app && app.set) app.set("discordBotConnected", true);
      app.get("auditLogger")?.("discord.bot.ready", { user: client.user?.tag });
      console.log("Discord bot ready as", client.user?.tag);
    });
    client.on("error", (e) =>
      console.warn("discord client error", e?.message || e),
    );
    // Connect
    await client.login(token);
  } catch (e) {
    console.warn(
      "Failed to initialize Discord bot worker. Ensure discord.js and @discordjs/voice are installed.",
      e?.message || e,
    );
    if (app && app.set) app.set("discordBotConnected", false);
    return;
  }
}

// Synthesize TTS to audio URL/stream. Use google-tts-api if available.
async function synthesizeToStream(text) {
  // Attempt to import google-tts-api dynamically
  try {
    const gtts = await eval('import("google-tts-api")');
    const url = gtts.getAudioUrl(text, {
      lang: "en",
      slow: false,
      host: "https://translate.google.com",
    });
    // fetch the URL and return stream
    const res = await fetch(url);
    if (!res.ok) throw new Error("TTS fetch failed");
    return res.body;
  } catch (e) {
    console.warn(
      "google-tts-api not available or failed, falling back to synthetic stream",
      e?.message || e,
    );
    // fallback: create a silent stream or throw
    throw new Error("No TTS provider available");
  }
}

async function playTextInChannel(app, { guildId, channelId, text }) {
  if (!client || !isReady) {
    console.warn("Bot not initialized or ready");
    return false;
  }
  try {
    const channel = await client.channels.fetch(channelId);
    if (!channel || !channel.isVoiceBased?.()) {
      // Not a voice channel. Try to handle if channel is a guild channel with voice
      if (channel && channel.type === 2) {
        // VoiceChannel
      } else {
        console.warn("Target channel is not a voice channel", channelId);
        return false;
      }
    }
    const guild = await client.guilds.fetch(guildId).catch(() => null);
    if (!guild) {
      console.warn("Could not fetch guild", guildId);
      return false;
    }
    const voiceChannel = await guild.channels
      .fetch(channelId)
      .catch(() => null);
    if (!voiceChannel || !voiceChannel.isVoiceBased?.()) {
      console.warn("Voice channel not found or invalid", channelId);
      return false;
    }
    // Use eval-wrapped dynamic import to prevent test bundlers from resolving
    // optional packages at build-time.
    const vmod = await eval('import("@discordjs/voice")');
    const {
      joinVoiceChannel,
      createAudioPlayer,
      createAudioResource,
      StreamType,
    } = vmod;
    const conn = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
    });
    const player = createAudioPlayer();
    const stream = await synthesizeToStream(text);
    const resource = createAudioResource(stream, {
      inputType: StreamType.Arbitrary,
    });
    player.play(resource);
    conn.subscribe(player);
    return new Promise((resolve) => {
      player.on("error", (err) => {
        console.warn("player error", err?.message || err);
        player.stop(true);
        conn.destroy();
        resolve(false);
      });
      player.on("idle", () => {
        conn.destroy();
        resolve(true);
      });
    });
  } catch (e) {
    console.warn("Failed to play audio", e?.message || e);
    return false;
  }
}

export async function initDiscordBotWorker(app) {
  await initBot(app);
  if (!client) return;
  // Start reading queue for voice jobs
  const queue = app.get("webhookQueue");
  if (!queue || !queue.pop) return;
  const poll = Number(process.env.DISCORD_VOICE_POLL_MS || 2000);
  setInterval(async () => {
    try {
      const job = await queue.pop("discord_voice", 1);
      if (!job) return;
      app.get("auditLogger")?.("discord.voice.job.start", { job });
      const ok = await playTextInChannel(app, job);
      app.get("auditLogger")?.("discord.voice.job.complete", {
        job,
        success: ok,
      });
    } catch (e) {
      console.warn("discord voice worker error", e?.message || e);
    }
  }, poll);
}

export async function playOnChannelViaBot(app, guildId, channelId, text) {
  return playTextInChannel(app, { guildId, channelId, text });
}

export default initDiscordBotWorker;
