import express from 'express';
import crypto from 'crypto';
import { google } from 'googleapis';

const router = express.Router();

// Helper: read env for OAuth client config
function getOAuth2Client() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI || `http://localhost:${process.env.PORT || 8080}/api/google/oauth2callback`;
  if (!clientId || !clientSecret) return null;
  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

// Redirect to Google OAuth consent screen
router.get('/auth', (req, res) => {
  const oAuth2Client = getOAuth2Client();
  if (!oAuth2Client) return res.status(400).json({ error: 'OAuth not configured' });
  const scopes = [
    'openid',
    'email',
    'profile',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/gmail.send',
  ];
  const state = crypto.randomBytes(8).toString('hex');
  const url = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: scopes,
    state,
  });
  // Store state in server cache for basic CSRF protection
  try {
    const cache = req.app.get('cache');
    if (cache && cache.set) cache.set(`oauth_state:${state}`, true);
  } catch (e) { /* noop */ }
  return res.redirect(url);
});

// OAuth callback handler - exchange code for tokens and store session
router.get('/oauth2callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    if (!code) return res.status(400).send('Missing code');
    const oAuth2Client = getOAuth2Client();
    if (!oAuth2Client) return res.status(400).send('OAuth not configured');
    // Validate state token
    const cache = req.app.get('cache');
    if (!state || !(cache && cache.get && (await cache.get(`oauth_state:${String(state)}`)))) {
      return res.status(400).send('Invalid or missing OAuth state');
    }
    // remove state to avoid replay
    if (cache && cache.del) await cache.del(`oauth_state:${String(state)}`);

    const tokenResponse = await oAuth2Client.getToken(String(code));
    const tokens = tokenResponse.tokens;
    // Save tokens in a MemoryCache or in Redis
    const sessionId = crypto.randomBytes(16).toString('hex');
    const cache = req.app.get('cache');
    if (cache && cache.set) await cache.set(`google_tokens:${sessionId}`, tokens);
    // Set a secure cookie with the session id
    res.cookie('gwsess', sessionId, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' });
    // Redirect back to the app
    return res.redirect('/?google_auth=success');
  } catch (err) {
    console.error('OAuth callback error', err);
    return res.status(500).send('OAuth callback error');
  }
});

// Who am I? Return basic profile info for the signed-in user using stored tokens
router.get('/me', async (req, res) => {
  try {
    const sessionId = req.cookies && req.cookies.gwsess;
    if (!sessionId) return res.status(401).json({ error: 'Not signed in' });
    const cache = req.app.get('cache');
    const tokens = cache && cache.get ? await cache.get(`google_tokens:${sessionId}`) : null;
    if (!tokens) return res.status(401).json({ error: 'No tokens found for session' });
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI || `http://localhost:${process.env.PORT || 8080}/api/google/oauth2callback`;
    const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    oAuth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({ version: 'v2', auth: oAuth2Client });
    const profile = await oauth2.userinfo.get();
    return res.json({ profile: profile.data });
  } catch (err) {
    console.error('Me route error', err);
    return res.status(500).json({ error: String(err) });
  }
});

// Sign-out
router.post('/logout', (req, res) => {
  const sessionId = req.cookies && req.cookies.gwsess;
  if (sessionId) {
    const cache = req.app.get('cache');
    if (cache && cache.del) await cache.del(`google_tokens:${sessionId}`);
    res.clearCookie('gwsess');
  }
  return res.json({ ok: true });
});

export default router;
