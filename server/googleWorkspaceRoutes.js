import express from "express";
import { requireAuth, auditLoggerFactory } from "./securityMiddleware.js";
import { google } from "googleapis";

const router = express.Router();

// Simple demo endpoint that returns a sample (and optionally attempts to call
// Google APIs when a service account key is provided via env var.
router.get("/demo", requireAuth, async (req, res) => {
  try {
    // If there's a signed-in user, attempt to perform user-scoped operations
    const sessionId = req.cookies && req.cookies.gwsess;
    const cache = req.app.get("cache");
    const userTokens =
      sessionId && cache && cache.get
        ? await cache.get(`google_tokens:${sessionId}`)
        : null;
    let auth;
    if (
      userTokens &&
      process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET
    ) {
      const oauth2 = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_OAUTH_REDIRECT_URI ||
          `http://localhost:${process.env.PORT || 8080}/api/google/oauth2callback`,
      );
      oauth2.setCredentials(userTokens);
      auth = oauth2;
    } else if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY_JSON) {
      const key = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY_JSON);
      auth = new google.auth.JWT(key.client_email, null, key.private_key, [
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/calendar",
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/gmail.send",
      ]);
      await auth.authorize();
    } else {
      return res.json({
        demo: true,
        msg: "No Google credentials available — returning a mock sample.",
      });
    }
    const calendar = google.calendar({ version: "v3", auth });
    // If this is an OAuth user token, attempt to list their upcoming events. Falls back to a mock sample.
    if (userTokens) {
      try {
        // attempt to fetch profile
        const oauth2 = google.oauth2({ version: "v2", auth });
        const profileRes = await oauth2.userinfo.get();
        const profileData = profileRes?.data;
        const eventsResp = await calendar.events.list({
          calendarId: "primary",
          timeMin: new Date().toISOString(),
          maxResults: 5,
          singleEvents: true,
          orderBy: "startTime",
        });
        return res.json({
          demo: true,
          mode: "user",
          events: eventsResp.data.items || [],
          profile: profileData,
        });
      } catch (e) {
        console.warn("Failed to list user events", e?.message || e);
        // continue to return sample
      }
    }
    // We won't actually create a calendar event in the demo to avoid surprise side effects.
    // Instead, return an example payload showing what we'd call.
    const sampleEvent = {
      summary: "Family routine: Morning prep",
      start: { dateTime: new Date().toISOString() },
      end: { dateTime: new Date(Date.now() + 30 * 60 * 1000).toISOString() },
    };
    // Audit the demo request for traceability
    try {
      req.app?.get("auditLogger")?.("google.demo", { mode: "service" });
    } catch (e) {
      /* noop */
    }
    return res.json({ demo: true, mode: "service", sampleEvent });
  } catch (err) {
    console.error("google workspace demo error", err);
    return res.status(500).json({ demo: false, error: String(err) });
  }
});

export default router;
