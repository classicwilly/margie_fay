/**
 * Sanitizes user input to mask sensitive Personal Identifying Information (PII)
 * before sending the prompt to the external Gemini API.
 * This function enforces a client-side filter for privacy.
 */

// Regex patterns for common PII (simplified for client-side check)
const PII_REGEXES = [
  {
    pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
    replacement: "[REDACTED EMAIL]",
  }, // Email
  {
    pattern: /(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/g,
    replacement: "[REDACTED PHONE]",
  }, // Phone (common US formats)
  {
    pattern: /\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/g,
    replacement: "[REDACTED SSN]",
  }, // SSN/Tax ID
  { pattern: /(http(s)?:\/\/[^\s]+)/gi, replacement: "[REDACTED URL]" }, // URLs
];

/**
 * Ensures user query is safe by masking PII.
 * Returns the sanitized query and a boolean indicating if redaction occurred.
 */
export function sanitizePrompt(query: string): {
  cleanedQuery: string;
  redacted: boolean;
} {
  let cleanedQuery = query;
  let redacted = false;

  PII_REGEXES.forEach((item) => {
    if (cleanedQuery.match(item.pattern)) {
      cleanedQuery = cleanedQuery.replace(item.pattern, item.replacement);
      redacted = true;
    }
  });

  return { cleanedQuery, redacted };
}
