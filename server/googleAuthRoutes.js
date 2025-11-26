import express from "express";
import crypto from "crypto";
import { google } from "googleapis";

const router = express.Router();

// Helper: read env for OAuth client config
function getOAuth2Client() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri =
    process.env.GOOGLE_OAUTH_REDIRECT_URI ||
    `http://localhost:${process.env.PORT || 8080}/api/google/oauth2callback`;
  if (!clientId || !clientSecret) return null;
  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

// Redirect to Google OAuth consent screen
router.get("/auth", (req, res) => {
  const oAuth2Client = getOAuth2Client();
  if (!oAuth2Client)
    return res.status(400).json({ error: "OAuth not configured" });
  const scopes = [
    "openid",
    "email",
    "profile",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/calendar.events",
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/gmail.send",
  ];
  const state = crypto.randomBytes(8).toString("hex");
  const url = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
    state,
  });
  // Store state in server cache for basic CSRF protection
  try {
    const cache = req.app.get("cache");
    if (cache && cache.set) cache.set(`oauth_state:${state}`, true);
  } catch (e) {
    /* noop */
  }
  return res.redirect(url);
});

// OAuth callback handler - exchange code for tokens and store session
router.get("/oauth2callback", async (req, res) => {
  try {
    const { code, state } = req.query;
    if (!code) return res.status(400).send("Missing code");
    const oAuth2Client = getOAuth2Client();
    if (!oAuth2Client) return res.status(400).send("OAuth not configured");
    // Validate state token
    const cache = req.app.get("cache");
    if (
      !state ||
      !(cache && cache.get && (await cache.get(`oauth_state:${String(state)}`)))
    ) {
      return res.status(400).send("Invalid or missing OAuth state");
    }
    // remove state to avoid replay
    if (cache && cache.del) await cache.del(`oauth_state:${String(state)}`);

    const tokenResponse = await oAuth2Client.getToken(String(code));
    const tokens = tokenResponse.tokens;
    // Save tokens in a MemoryCache or in Redis
    const sessionId = crypto.randomBytes(16).toString("hex");
    const cache = req.app.get("cache");
    if (cache && cache.set)
      await cache.set(`google_tokens:${sessionId}`, tokens);
    // Set a secure cookie with the session id
    res.cookie("gwsess", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    // Redirect back to the app
    return res.redirect("/?google_auth=success");
  } catch (err) {
    console.error("OAuth callback error", err);
    return res.status(500).send("OAuth callback error");
  }
});

// Helper to return a google auth client for a session and auto-refresh tokens
async function getAuthorizedClientForSession(req) {
  const sessionId = req.cookies && req.cookies.gwsess;
  if (!sessionId) return null;
  const cache = req.app.get("cache");
  if (!cache) return null;
  const tokens = await cache.get(`google_tokens:${sessionId}`);
  if (!tokens) return null;
  const oAuth2Client = getOAuth2Client();
  if (!oAuth2Client) return null;
  oAuth2Client.setCredentials(tokens);
  // If token expired or near expiry, refresh it
  try {
    const now = Date.now();
    const expiry = tokens.expiry_date || 0;
    // If expiry within next 60 seconds, refresh
    if (expiry - now < 60 * 1000) {
      const res = await oAuth2Client.getAccessToken();
      // google-auth populates credentials with refresh token changes
      const updatedCreds = oAuth2Client.credentials;
      // Persist updated tokens to cache
      await cache.set(`google_tokens:${sessionId}`, updatedCreds);
    }
  } catch (e) {
    console.warn("Token refresh failed", e?.message || e);
  }
  return oAuth2Client;
}

// Helper: Require OAuth session and return client, else 401
async function requireAuthClient(req, res, next) {
  try {
    const client = await getAuthorizedClientForSession(req);
    if (!client)
      return res.status(401).json({ error: "Not signed into Google" });
    req.googleAuthClient = client;
    next();
  } catch (e) {
    console.error("requireAuthClient error", e);
    return res.status(500).json({ error: "OAuth client error" });
  }
}

// Who am I? Return basic profile info for the signed-in user using stored tokens
router.get("/me", async (req, res) => {
  try {
    const sessionId = req.cookies && req.cookies.gwsess;
    if (!sessionId) return res.status(401).json({ error: "Not signed in" });
    const cache = req.app.get("cache");
    const tokens =
      cache && cache.get ? await cache.get(`google_tokens:${sessionId}`) : null;
    if (!tokens)
      return res.status(401).json({ error: "No tokens found for session" });
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri =
      process.env.GOOGLE_OAUTH_REDIRECT_URI ||
      `http://localhost:${process.env.PORT || 8080}/api/google/oauth2callback`;
    const oAuth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri,
    );
    oAuth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({ version: "v2", auth: oAuth2Client });
    const profile = await oauth2.userinfo.get();
    return res.json({ profile: profile.data });
  } catch (err) {
    console.error("Me route error", err);
    return res.status(500).json({ error: String(err) });
  }
});

// Sign-out
router.post("/logout", async (req, res) => {
  const sessionId = req.cookies && req.cookies.gwsess;
  if (sessionId) {
    const cache = req.app.get("cache");
    if (cache && cache.del) await cache.del(`google_tokens:${sessionId}`);
    res.clearCookie("gwsess");
  }
  return res.json({ ok: true });
});

// List events for signed-in user
router.get("/events", requireAuthClient, async (req, res) => {
  try {
    const calendar = google.calendar({
      version: "v3",
      auth: req.googleAuthClient,
    });
    const eventsResp = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      maxResults: 20,
      singleEvents: true,
      orderBy: "startTime",
    });
    res.json({ events: eventsResp.data.items || [] });
  } catch (e) {
    console.error("list events error", e);
    res.status(500).json({ error: "Could not list events" });
  }
});

router.get("/emails", requireAuthClient, async (req, res) => {
  try {
    const gmail = google.gmail({ version: "v1", auth: req.googleAuthClient });
    const max = Number(req.query.max || 10);
    const messagesResp = await gmail.users.messages.list({
      userId: "me",
      maxResults: max,
      q: "is:unread",
    });
    const messages = messagesResp.data.messages || [];
    const emails = await Promise.all(
      messages.map(async (m) => {
        const detail = await gmail.users.messages.get({
          userId: "me",
          id: m.id,
        });
        const headers = detail.data.payload?.headers || [];
        const subject = headers.find((h) => h.name === "Subject")?.value || "";
        const from = headers.find((h) => h.name === "From")?.value || "";
        const date = headers.find((h) => h.name === "Date")?.value || "";
        return {
          id: m.id,
          threadId: detail.data.threadId,
          labelIds: detail.data.labelIds || [],
          snippet: detail.data.snippet || "",
          subject,
          from,
          date,
          isUnread: detail.data.labelIds?.includes("UNREAD") || false,
        };
      }),
    );
    return res.json({ emails });
  } catch (e) {
    console.error("list emails error", e);
    return res.status(500).json({ error: "Failed to list emails" });
  }
});

router.get("/tasks", requireAuthClient, async (req, res) => {
  try {
    const tasksApi = google.tasks({
      version: "v1",
      auth: req.googleAuthClient,
    });
    const response = await tasksApi.tasks.list({ tasklist: "@default" });
    return res.json({ tasks: response.data.items || [] });
  } catch (e) {
    console.error("list tasks error", e);
    return res.status(500).json({ error: "Failed to list tasks" });
  }
});

router.get("/drive", requireAuthClient, async (req, res) => {
  try {
    const driveApi = google.drive({
      version: "v3",
      auth: req.googleAuthClient,
    });
    const max = Number(req.query.max || 10);
    const response = await driveApi.files.list({
      pageSize: max,
      fields:
        "files(id, name, mimeType, modifiedTime, webViewLink, thumbnailLink)",
      orderBy: "modifiedTime desc",
    });
    return res.json({ files: response.data.files || [] });
  } catch (e) {
    console.error("list drive error", e);
    return res.status(500).json({ error: "Failed to list drive files" });
  }
});

router.post("/calendar/create", requireAuthClient, async (req, res) => {
  try {
    const { summary, startTime, endTime, description, location } = req.body;
    const calendar = google.calendar({
      version: "v3",
      auth: req.googleAuthClient,
    });
    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: {
        summary,
        description,
        location,
        start: { dateTime: startTime },
        end: { dateTime: endTime },
      },
    });
    req.app.get("auditLogger")?.("calendar.create", {
      summary,
      session: req.cookies?.gwsess,
    });
    return res.json({ event: response.data });
  } catch (e) {
    console.error("create calendar event error", e);
    return res.status(500).json({ error: "Could not create event" });
  }
});

router.post("/drive/create", requireAuthClient, async (req, res) => {
  try {
    const { name, content, mimeType } = req.body;
    const drive = google.drive({ version: "v3", auth: req.googleAuthClient });
    const response = await drive.files.create({
      requestBody: { name, mimeType },
      media: { mimeType, body: content },
    });
    req.app.get("auditLogger")?.("drive.create", {
      name,
      session: req.cookies?.gwsess,
    });
    return res.json({ file: response.data });
  } catch (e) {
    console.error("drive create error", e);
    return res.status(500).json({ error: "Could not create file" });
  }
});

router.post("/tasks/create", requireAuthClient, async (req, res) => {
  try {
    const { title, notes, due } = req.body;
    const tasksApi = google.tasks({
      version: "v1",
      auth: req.googleAuthClient,
    });
    const response = await tasksApi.tasks.insert({
      tasklist: "@default",
      requestBody: { title, notes, due },
    });
    req.app.get("auditLogger")?.("tasks.create", {
      title,
      session: req.cookies?.gwsess,
    });
    return res.json({ task: response.data });
  } catch (e) {
    console.error("tasks create error", e);
    return res.status(500).json({ error: "Could not create task" });
  }
});

router.post("/gmail/send", requireAuthClient, async (req, res) => {
  try {
    const { raw } = req.body; // raw RFC 2822 formatted message
    const gmail = google.gmail({ version: "v1", auth: req.googleAuthClient });
    const response = await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw },
    });
    req.app.get("auditLogger")?.("gmail.send", {
      session: req.cookies?.gwsess,
    });
    return res.json({ result: response.data });
  } catch (e) {
    console.error("gmail send error", e);
    return res.status(500).json({ error: "Could not send message" });
  }
});

export default router;
