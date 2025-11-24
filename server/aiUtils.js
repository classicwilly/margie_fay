import crypto from "crypto";

// Very small PII detector & redaction stub for now — in prod you'd use a proper DLP
export function redactPII(text) {
  // A naive regex: emails and phone numbers
  let redacted = text.replace(
    /[\w.-]+@[\w.-]+\.[A-Za-z]{2,6}/g,
    "[REDACTED_EMAIL]",
  );
  redacted = redacted.replace(/\+?\d[\d\s\-()]{7,}/g, "[REDACTED_PHONE]");
  const redactedTokensCount = (text.length - redacted.length) / 10; // very rough heuristic
  const hash = crypto.createHash("sha256").update(text).digest("hex");
  return { safePrompt: redacted, metadata: { hash, redactedTokensCount } };
}

// adapter shim - keep minimal for now
export async function generateGuidance(prompt, opts) {
  // In production, call an LLM proxy or Gemini via a server-side client.
  // For now, return a short placeholder persona-driven response.
  const persona = opts.personaKey || "grandma";
  const personaEndings = {
    grandma: "Love, Grandma.",
    grandpa: "—Grandpa.",
    bob: "—Bob. Go!",
    marge: "—Marge, the Planner.",
  };
  const ending = personaEndings[persona] || "—Kindly.";
  const safe = prompt.trim().split("\n").slice(0, 3).join(" ");
  return `${safe} ${ending}`;
}
