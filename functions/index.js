const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');

// In test environments, admin may be mocked and initializeApp can be called more than once.
// Guard against multiple initializations which cause errors during unit tests.
try {
  if (!admin.apps || admin.apps.length === 0) {
    admin.initializeApp();
  }
} catch (err) {
  console.warn('admin.initializeApp skipped:', err?.message || err);
}

// Example: Cloud function that proxies an AI request from the client to the model.
// Purpose: keep server-side API keys out of client bundles and ensure prompt safety.
// NOTE: This is a minimal stub — you should implement rate-limiting, App Check validation, and input sanitization.

exports.aiProxy = functions.https.onRequest(async (req, res) => {
  // If running in a test or dev environment and AI_STUB=true, return a canned response without calling external AI.
  // To protect production environments, require NODE_ENV !== 'production' and optional functions config flag.
  // Allow Playwright/local runner to request a server-side AI stub via PLAYWRIGHT_AI_STUB
  const aiStubEnv = process.env.AI_STUB === 'true' || process.env.PLAYWRIGHT_AI_STUB === 'true';
  const notProd = process.env.NODE_ENV !== 'production';
  const configAllow = functions.config && functions.config().ai && functions.config().ai.allow_stub === 'true';
  if (aiStubEnv && (notProd || configAllow)) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const { prompt } = req.body || {};
    return res.json({
      model: 'stub-v1',
      stub: true,
      prompt: prompt || '',
      choices: [ { text: 'ok from ai (server stub)', index: 0 } ],
    });
  }
  // Authenticate the user token
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing token' });
  }
  const idToken = authHeader.split('Bearer ')[1];
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    // Save to request for convenience (telemetry, further checks)
    req.auth = decoded;
    // Optionally add more checks, e.g., email_verified
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  // Optional App Check verification to reduce abuse. App Check tokens are sent in the
  // "X-Firebase-AppCheck" header by default in web SDKs configured with App Check.
  const appCheckToken = req.header('X-Firebase-AppCheck') || req.header('x-firebase-appcheck');
  const appCheckEnforce = process.env.APP_CHECK_ENFORCE === 'true' || (functions.config && functions.config().appcheck && functions.config().appcheck.enforce === 'true');
  if (!appCheckToken) {
    if (appCheckEnforce) {
      return res.status(403).json({ error: 'Missing App Check token' });
    }
    // For local testing or clients without App Check enabled, we allow it unless `APP_CHECK_ENFORCE` is true.
  } else {
    try {
      await admin.appCheck().verifyToken(appCheckToken);
    } catch (err) {
      console.error('App Check failed', err);
      return res.status(403).json({ error: 'Invalid App Check token' });
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, config } = req.body || {};
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

  // TODO: confirm that you scrub any PII here if your use-case requires it

  // Proxy example to a hypothetical secure AI endpoint: use env var `AI_BACKEND_URL` & `AI_BACKEND_KEY`
  try {
    // Sanitize prompt server-side to avoid leaking PII to third-party AI
    const { scrubPII, hashUserId } = require('./pii_sanitizer');
    const { text: sanitized, found } = scrubPII(prompt);
    const promptForAi = sanitized;
    // If a custom AI backend is configured, use it. Otherwise, default to Google Generative AI (Gemini)
    const aiKey = process.env.AI_BACKEND_KEY || (functions.config && functions.config().ai && functions.config().ai.key);
    const geminiModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash-preview-09-2025';
    const aiUrl = process.env.AI_BACKEND_URL || (functions.config && functions.config().ai && functions.config().ai.url) || `https://generativeai.googleapis.com/v1/models/${geminiModel}:generate`;
    // If AI_BACKEND_URL wasn't set, we'll also prefer to use the GEMINI_API_KEY env var to authenticate.
    const fallbackGeminiKey = process.env.GEMINI_API_KEY;

    const headers = {
      'Content-Type': 'application/json',
    };
    if (aiKey) headers['x-api-key'] = aiKey;
    if (!aiKey && fallbackGeminiKey && aiUrl.includes('generativeai.googleapis.com')) {
      headers['Authorization'] = `Bearer ${fallbackGeminiKey}`;
    }

    const aiResponse = await fetch(aiUrl, {
      method: 'POST',
      headers: {
        // merged headers - may contain x-api-key via env or Functions config
        ...headers,
      },
      body: JSON.stringify({ prompt: promptForAi, config }),
    });

    const json = await aiResponse.json();

    // Non-PII telemetry example: store anonymized usage metadata only. Avoid storing raw prompt text.
    try {
      const telemetry = {
        userHash: hashUserId((req.auth && req.auth.uid) || null),
        type: 'ai_call',
        hasPII: !!found.length,
        model: json.model || null,
        promptExcerptLen: promptForAi.length,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      };
      await admin.firestore().collection('telemetry').add(telemetry);
    } catch (tErr) {
      // telemetry should not break the main response
      console.warn('Telemetry failed', tErr);
    }
    // remove personally-identifying parts from JSON if necessary
    res.json(json);
  } catch (err) {
    console.error('AI proxy error', err);
    res.status(500).json({ error: 'AI backend failure' });
  }
});
