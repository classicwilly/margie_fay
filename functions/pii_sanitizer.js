/**
 * Basic server-side PII scrubber.
 * NOTE: This is a simple, best-effort sanitizer. For production use, replace
 * with a well-tested library and review with legal/security teams.
 */

const crypto = require('crypto');

function maskAll(text, mask = '[REDACTED]') {
  return mask;
}

function scrubPII(input) {
  if (!input) return { text: input, found: [] };

  let text = String(input);
  const found = [];

  // emails
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  if (emailRegex.test(text)) {
    found.push('email');
    text = text.replace(emailRegex, '[EMAIL_REDACTED]');
  }

  // phone numbers (simple international + local). This is an imperfect heuristic.
  const phoneRegex = /(\+?\d{1,3}[-\.\s]?)?\(?\d{3}\)?[-\.\s]?\d{3}[-\.\s]?\d{4}/g;
  if (phoneRegex.test(text)) {
    found.push('phone');
    text = text.replace(phoneRegex, '[PHONE_REDACTED]');
  }

  // Simple SSN detection - US pattern (XXX-XX-XXXX)
  const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
  if (ssnRegex.test(text)) {
    found.push('ssn');
    text = text.replace(ssnRegex, '[SSN_REDACTED]');
  }

  // Credit card patterns (very basic)
  const ccRegex = /\b(?:\d[ -]*?){13,16}\b/g;
  if (ccRegex.test(text)) {
    found.push('credit_card');
    text = text.replace(ccRegex, '[CREDIT_REDACTED]');
  }

  // Long sequences of digits - might be an ID
  const longNumRegex = /\b\d{9,}\b/g;
  if (longNumRegex.test(text)) {
    found.push('long_number');
    text = text.replace(longNumRegex, '[NUMBER_REDACTED]');
  }

  return { text, found };
}

function hashUserId(uid) {
  if (!uid) return null;
  return crypto.createHash('sha256').update(uid).digest('hex');
}

module.exports = { scrubPII, hashUserId };
