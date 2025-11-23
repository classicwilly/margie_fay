import express from 'express';
import { generateGuidance, redactPII } from './aiUtils';
import { requireAuth } from './securityMiddleware.js';

const router = express.Router();

// middleware placeholder for DLP / rate limiting, etc.
router.use((req, res, next) => {
  // Simple rate-limiter placeholder, extended later
  req.startTime = Date.now();
  next();
});

// POST /api/ai/generate - general generation endpoint (proxied, audited)
router.post('/generate', requireAuth, async (req, res) => {
  try {
    const { prompt, personaKey = 'grandma', maxTokens = 250 } = req.body;
    if (!prompt || typeof prompt !== 'string') return res.status(400).json({ error: 'Missing prompt' });

    // Redact PII and return a safe prompt to the adapter
    const { safePrompt, metadata } = redactPII(prompt);
    // Call the server-side adapter for the LLM
    const guidance = await generateGuidance(safePrompt, { personaKey, maxTokens });

    // Basic audit log - write trace (server will have an audit middleware in production)
    req.app?.get('auditLogger')?.('ai.generate', { personaKey, promptHash: metadata.hash, length: prompt.length });

    return res.json({ guidance, redacted: metadata.redactedTokensCount });
  } catch (err) {
    console.error('AI Proxy generate error', err);
    return res.status(500).json({ error: String(err) });
  }
});

export default router;
