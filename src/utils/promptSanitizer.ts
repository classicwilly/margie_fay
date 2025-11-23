export function sanitizePrompt(text: string) {
  if (!text) return text;
  // Remove emails
  let s = text.replace(/\b[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, '[REDACTED_EMAIL]');
  // Remove phone numbers
  s = s.replace(/\+?\d[\d\-\s()]{7,}\d/g, '[REDACTED_PHONE]');
  // Remove obvious PII (SSN-like patterns)
  s = s.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[REDACTED_SSN]');
  // Remove child names: simple example list — in production use a configurable list
  s = s.replace(/\bWillow\b|\bSebastian\b/gi, '[REDACTED_NAME]');
  return s;
}

export default { sanitizePrompt };