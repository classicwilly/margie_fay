import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';
import MemoryCache from './src/utils/cache.js';
import crypto from 'crypto';

// ES Module equivalents of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
// Cloud Run provides the PORT environment variable, defaulting to 8080 for local development
const port = process.env.PORT || 8080;

// Optional prometheus metrics using prom-client
let promClient;
try {
  // devs may not want to install prom-client by default
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  promClient = require('prom-client');
} catch (e) {}

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// This is crucial for single-page applications (SPAs)
// It ensures that any direct navigation to a route (e.g., /some-page)
// will be served by index.html from the 'dist' folder, allowing the client-side router to take over.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 150 });
// health check endpoint for monitoring
const aiCache = new MemoryCache(60);
app.get('/healthz', (req, res) => {
  return res.status(200).json({ status: 'ok' });
});

// Basic rate limiter to reduce abuse of the proxy in local/workspace demo mode
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 150 });
app.use('/api/', limiter);

// Server-side Gemini proxy. This keeps the API key out of client bundles and provides one place
// for PII sanitization, telemetry, and abuse-mitigation. Use process.env.GEMINI_API_KEY on the server.
app.post('/api/gemini', async (req, res) => {
  try {
    const { prompt, systemInstruction, maxTokens } = req.body || {};
    if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

    // Sanitize prompt with the same PII scrub used in functions/pii_sanitizer.js
    // We intentionally keep this minimal; in production use a vetted library
    const piiModule = await import('./functions/pii_sanitizer.js');
    const { scrubPII } = (piiModule && (piiModule.scrubPII ? piiModule : piiModule.default)) || { scrubPII: (text) => ({ text, found: [] }) };
    const { text: sanitized, found } = scrubPII(prompt);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Server missing GEMINI_API_KEY' });

    // Forward to Google Generative AI endpoint
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash-preview-09-2025';
    const url = `https://generativeai.googleapis.com/v1/models/${model}:generate`;
    const body = {
      prompt: [
        { role: 'system', content: systemInstruction || '' },
        { role: 'user', content: sanitized },
      ],
      maxOutputTokens: maxTokens || 512,
      temperature: 0.6,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });
    const json = await response.json();
    // Remove any identifying traces from the response as an extra precaution if necessary
    return res.json({ ...json, _sanitized: !!found.length });
  } catch (err) {
    console.error('Gemini proxy error', err);
    return res.status(500).json({ error: 'Gemini proxy error' });
  }
});

if (promClient) {
  // Custom counters for application telemetry
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Counter } = require('prom-client');
    // Count of Playwright/AI stub installations during a run (used for telemetry in CI)
    const aiStubCounter = new Counter({ name: 'wonky_ai_stub_events_total', help: 'Total calls to instrument AI stub in tests' });
    // Count of advisory board interactions and interviews
    const advisoryCounter = new Counter({ name: 'wonky_advisory_interactions_total', help: 'Total advisory board interactions' });

    app.post('/ai_stub_event', (req, res) => {
      aiStubCounter.inc();
      res.json({ ok: true });
    });

    app.post('/advisory/interview', (req, res) => {
      advisoryCounter.inc();
      res.json({ ok: true });
    });
  } catch (e) {
    // non-fatal - prom-client not available
    console.warn('aiStub telemetry not enabled', e?.message || e);
  }
  // initialize default metrics for the Node process
  promClient.collectDefaultMetrics();
  app.get('/metrics', async (req, res) => {
    try {
      const metrics = await promClient.register.metrics();
      res.set('Content-Type', promClient.register.contentType);
      res.send(metrics);
    } catch (err) {
      res.status(500).send(err?.message || 'error');
    }
  });
}

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  if (!process.env.GEMINI_API_KEY) {
    console.warn('Warning: GEMINI_API_KEY is not set on the server. The /api/gemini proxy will fail until the key is provisioned.');
  } else {
    console.log('Gemini proxy available at POST /api/gemini');
  }
});