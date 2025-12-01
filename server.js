import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

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
} catch {}

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// This is crucial for single-page applications (SPAs)
// It ensures that any direct navigation to a route (e.g., /some-page)
// will be served by index.html from the 'dist' folder, allowing the client-side router to take over.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// health check endpoint for monitoring
app.get('/healthz', (req, res) => {
  return res.status(200).json({ status: 'ok' });
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
    const { logWarn } = await import('./server/logger.js');
    logWarn('aiStub telemetry not enabled', e?.message || e);
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
  import('./server/logger.js').then(({ logInfo }) => logInfo(`Server listening on port ${port}`)).catch(() => {});
});