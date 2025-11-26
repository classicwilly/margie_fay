import { googleConnector } from "./connectors/index.js";
import { githubConnector } from "./connectors/index.js";
import { discordConnector } from "./connectors/index.js";
// NOTE: Avoid statically importing discord bot worker or other optional libs
// to prevent Vite from trying to resolve optional dependencies during test
// bundling. We'll dynamically import it at runtime when needed.

// Minimal webhook processor. Keeps the job processing lightweight and
// auditable. Jobs are passed as { event, deliveryId, body }.

export async function processWebhookJob(app, job) {
  const { event, deliveryId, body } = job;
  try {
    app.get("auditLogger")?.("github.webhook.job.start", { event, deliveryId });
    // Only handle a few event types for now
    if (job.source === "github" || event === "pull_request") {
      const pr = body.pull_request;
      const action = body.action;
      // When PR is opened, create a review task in Google Tasks (if possible)
      if (action === "opened") {
        // Use service account connector where available
        try {
          const gConnector = await googleConnector();
          if (gConnector && gConnector.tasks) {
            const taskTitle = `Review PR #${pr.number}: ${pr.title}`;
            const notes = `PR: ${pr.html_url}\nAuthor: ${pr.user?.login}`;
            // use service account via gConnector
            await gConnector.tasks.insert({
              tasklist: "@default",
              requestBody: { title: taskTitle, notes },
            });
            app.get("auditLogger")?.("webhook.task.create", {
              type: "review_pr",
              prNumber: pr.number,
              title: taskTitle,
              deliveryId,
            });
          } else {
            app.get("auditLogger")?.("webhook.task.create.failed", {
              reason: "no google tasks available",
              deliveryId,
            });
          }
        } catch (e) {
          app.get("auditLogger")?.("webhook.task.create.error", {
            error: e?.message || e,
            deliveryId,
          });
        }
      }
    } else if (job.source === "github" || event === "issues") {
      const issue = body.issue;
      const action = body.action;
      if (action === "opened") {
        // create a repository TODO in a service like Google Tasks or create a GH comment
        try {
          const gh = githubConnector(app.get("cache"));
          // optional: create a comment acknowledging receipt
          await gh
            .createComment({
              owner: body.repository.owner.login,
              repo: body.repository.name,
              issueNumber: issue.number,
              body: "Thanks! A task was created for this issue.",
            })
            .catch(() => null);
          app.get("auditLogger")?.("webhook.issue.ack", {
            issueNumber: issue.number,
            deliveryId,
          });
        } catch (e) {
          app.get("auditLogger")?.("webhook.issue.ack.failed", {
            error: e?.message || e,
            deliveryId,
          });
        }
      }
    }
    // Discord interaction events or voice jobs
    if (job.source === "discord") {
      // If it's an interaction, we might respond or enqueue tasks. If it's a voice job (discord_voice), handle playback.
      if (
        event &&
        typeof event === "string" &&
        event.startsWith("discord.interaction")
      ) {
        // Example: store interactions or create a GH issue / Google Task
        app.get("auditLogger")?.("discord.interaction", { event, deliveryId });
      }
      if (
        event === "discord_voice" ||
        job.event === "discord_voice" ||
        job.type === "discord_voice"
      ) {
        const payload = job.body || job.payload || {};
        const guildId =
          payload.guildId || payload.guild?.id || payload.guild_id;
        const channelId =
          payload.channelId || payload.channel_id || payload.channel?.id;
        const text = payload.text || payload.content || payload.message || "";
        try {
          if (guildId && channelId && text) {
            // Allow the running test or server to inject a play handler via app.get('discordPlay')
            const injectedPlay =
              (typeof app?.get === "function" &&
                (app.get("discordPlay") || app.get("discord.play"))) ||
              null;
            let play = injectedPlay;
            if (!play) {
              // dynamic import via eval to avoid Vite analyzing the import path
              // This allows runtime to import optional module only when needed.
              const mod = await eval('import("./discordBotWorker.js")');
              play =
                mod?.playOnChannelViaBot || mod?.default?.playOnChannelViaBot;
            }
            if (!play) {
              app.get("auditLogger")?.("discord.voice.handler.missing", {
                guildId,
                channelId,
                deliveryId,
              });
            } else {
              await play(app, guildId, channelId, text);
              app.get("auditLogger")?.("discord.voice.playback", {
                guildId,
                channelId,
                deliveryId,
              });
            }
          } else {
            app.get("auditLogger")?.("discord.voice.invalid", { job });
          }
        } catch (err) {
          app.get("auditLogger")?.("discord.voice.error", {
            error: err?.message || err,
            job,
          });
        }
      }
    }
    app.get("auditLogger")?.("github.webhook.job.complete", {
      event,
      deliveryId,
    });
  } catch (e) {
    app.get("auditLogger")?.("github.webhook.job.error", {
      error: e?.message || e,
      event,
      deliveryId,
    });
  }
}

export default async function initWebhookProcessor(app) {
  // No-op for feature-gating when we don't want a processor
  const enabled = process.env.WEBHOOK_PROCESSOR_ENABLE !== "false";
  if (!enabled) return;

  // Start a worker that polls the queue every second
  const intervalMs = Number(process.env.WEBHOOK_PROCESSOR_POLL_MS || 2000);
  setInterval(async () => {
    try {
      const queue = app.get("webhookQueue");
      if (!queue) return;
      const job = (await queue.pop("webhook", 1)) || null;
      if (!job) return;
      await processWebhookJob(app, job);
    } catch (e) {
      console.warn("webhook worker error", e?.message || e);
    }
  }, intervalMs);
  app.get("auditLogger")?.("webhook.processor.started", { intervalMs });
}
