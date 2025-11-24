import fetch from "node-fetch";
import { redactPII } from "../../server/aiUtils";

interface GenerateOptions {
  personaKey?: string;
  maxTokens?: number;
}

export async function generateWithLLM(
  prompt: string,
  opts: GenerateOptions = {},
) {
  // Perform DLP redaction for PII and return placeholder if missing API key
  const { safePrompt } = redactPII(prompt);

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return `${safePrompt} — Gemini API key not configured.`;
  }

  // TODO: Replace with actual Gemini SDK / API requests, with proper auth from server.
  // For now we return a placeholder string to avoid making external calls in CI.
  const end =
    opts.personaKey === "grandma"
      ? "Love, Grandma."
      : `—${opts.personaKey || "AI"}.`;
  return `${safePrompt} ${end}`;
}

export default { generateWithLLM };
