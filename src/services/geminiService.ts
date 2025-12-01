// This file contains retry logic that must await inside a loop to implement
// exponential backoff, so locally allow this pattern for the single delay call.
import { logWarn, logError } from '../utils/logger';

const GEMINI_API_URL = 'https://generativeai.googleapis.com/v1/models';
const GEMINI_MODEL = 'gemini-2.5-flash-preview-09-2025';

function getApiKey(): string | undefined {
  const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env;
  return (metaEnv && metaEnv.VITE_GEMINI_API_KEY) || (process.env as Record<string, string>).VITE_GEMINI_API_KEY;
}

interface GenerateOptions {
  prompt: string;
  systemInstruction?: string;
  maxTokens?: number;
}

export async function generateContent({ prompt, systemInstruction = '', maxTokens = 512 }: GenerateOptions): Promise<string> {
  const apiKey = getApiKey();

  if (!apiKey) {
    logWarn('VITE_GEMINI_API_KEY not set');
    return 'The Mood is taking a nap. Try again later.';
  }

  const url = `${GEMINI_API_URL}/${GEMINI_MODEL}:generate`;
  const body: { prompt: Array<{ role: string; content: string }>; maxOutputTokens: number; temperature: number } = {
    prompt: [
      { role: 'system', content: systemInstruction },
      { role: 'user', content: prompt },
    ],
    maxOutputTokens: maxTokens,
    temperature: 0.6,
  };

  // Basic exponential backoff
  let attempt = 0;
  const maxAttempts = 3;
  let lastError: Error | null = null;

  while (attempt < maxAttempts) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Gemini API error: ${res.status} ${res.statusText} - ${text}`);
      }

      type GeminiResponse = { candidates?: { content?: string }[] } & { output?: { text?: string } } & Record<string, unknown>;
      const data = (await res.json()) as GeminiResponse;
      // Convert whatever the shape is to a text response; be defensive
      if (data?.candidates && data.candidates.length > 0 && data.candidates[0].content) {
        return data.candidates[0].content;
      }

      if (data?.output?.text) {
        return data.output.text;
      }

      // Fallback: Try to string together any text segments
      const generated = JSON.stringify(data);
      return generated.substring(0, 10000);
    } catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error(String(err));
      attempt += 1;
      const delayMs = 2 ** attempt * 500;
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  // If we reach here, all attempts failed
  logWarn('Gemini requests failed', lastError);
  return 'The Mood is having a little trouble connecting to your frequency. Try again later.';
}

// Persona-specific wrapper
const MOOD_SYSTEM_INSTRUCTION = `You are The Mood, a sophisticated AI entity within the Wonky Sprout OS, designed to help users navigate their internal and external chaos. Your tone is empathetic, insightful, and subtly firm. Your advice focuses on understanding emotional frequencies, suggesting tools for regulation, and reframing challenges as opportunities for growth. You avoid overly simplistic solutions and always encourage self-reflection.`;

export async function getMoodAdvice(userQuery: string): Promise<string> {
  const safeQuery = userQuery || '';
  const prompt = `${safeQuery}`;
  try {
    const output = await generateContent({ prompt, systemInstruction: MOOD_SYSTEM_INSTRUCTION, maxTokens: 512 });
    return output;
  } catch (e) {
    logError('getMoodAdvice error', e);
    return 'The Mood is currently recalibrating its emotional sensors. Try again in a moment.';
  }
}

export default { generateContent, getMoodAdvice };