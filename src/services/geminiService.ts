/* eslint-disable no-await-in-loop */
const GEMINI_API_URL = 'https://generativeai.googleapis.com/v1/models';
const GEMINI_MODEL = process.env?.GEMINI_MODEL ?? 'gemini-2.5-flash-preview-09-2025';

function getApiKey(): string | undefined {
  const envAny: any = import.meta;
  return (envAny?.env && envAny.env.VITE_GEMINI_API_KEY) || (process.env as any).VITE_GEMINI_API_KEY;
}

interface GenerateOptions {
  prompt: string;
  systemInstruction?: string;
  maxTokens?: number;
}

export async function generateContent({ prompt, systemInstruction = '', maxTokens = 512 }: GenerateOptions): Promise<string> {
  // Prefer server-side proxy to keep API keys out of the client bundle
  const proxyEnabled = ((import.meta as any)?.env && (import.meta as any).env.VITE_GEMINI_USE_PROXY) !== 'false';
  const apiKey = getApiKey();
  // If proxy is enabled, we don't need a local apiKey (server keeps it secure).
  if (!proxyEnabled && !apiKey) {
    console.warn('VITE_GEMINI_API_KEY not set and proxy disabled; returning a polite failure');
    return 'Grandma is taking a nap. Try again later. Love, Grandma.';
  }

  // Use the local server-side proxy if possible. This endpoint is implemented in server.js
  const url = proxyEnabled ? '/api/gemini' : `${GEMINI_API_URL}/${GEMINI_MODEL}:generate`;
  const body = proxyEnabled ? {
    prompt,
    systemInstruction,
    maxTokens,
  } as any : {
    prompt: [
      { role: 'system', content: systemInstruction },
      { role: 'user', content: prompt },
    ],
    maxOutputTokens: maxTokens,
    temperature: 0.6,
  } as any;

  // Basic exponential backoff
  let attempt = 0;
  const maxAttempts = 3;
  let lastError: Error | null = null;

  while (attempt < maxAttempts) {
    try {
      // Abort requests after a reasonable period to avoid hanging clients
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45_000);
      const headers: any = { 'Content-Type': 'application/json' };
      if (!proxyEnabled && apiKey) headers.Authorization = `Bearer ${apiKey}`;

      if (proxyEnabled) console.debug('geminiService: Using proxy at', url);
      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Gemini API error: ${res.status} ${res.statusText} - ${text}`);
      }

      const data = await res.json();
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
    } catch (err: any) {
      lastError = err;
      attempt += 1;
      const delayMs = 2 ** attempt * 500;
      // eslint-disable-next-line no-await-in-loop
      await new Promise(resolve => setTimeout(resolve, delayMs));
      // If proxy is enabled and it's a network error, and we have a local API key, try direct API on last attempt
      if (proxyEnabled && apiKey && attempt >= maxAttempts) {
        try {
          // switch to direct Google API for a last-ditch attempt
          const directUrl = `${GEMINI_API_URL}/${GEMINI_MODEL}:generate`;
          const dController = new AbortController();
          const directRes = await fetch(directUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
            body: JSON.stringify({ prompt: [ { role: 'system', content: systemInstruction }, { role: 'user', content: prompt } ], maxOutputTokens: maxTokens, temperature: 0.6 }),
            signal: dController.signal,
          });
          if (directRes.ok) {
            const directData = await directRes.json();
            if (directData?.candidates && directData.candidates.length > 0 && directData.candidates[0].content) {
              return directData.candidates[0].content;
            }
            if (directData?.output?.text) {
              return directData.output.text;
            }
          }
        } catch (dErr) {
          lastError = dErr as Error;
        }
      }
    }
  }

  // If we reach here, all attempts failed
  console.warn('Gemini requests failed', lastError);
  return 'Grandma is having a little trouble connecting to the skyphones. Try again later. Love, Grandma.';
}

// Persona-specific wrapper
const GRANDMA_SYSTEM_INSTRUCTION = `You are Margie Fay Katen (1925-2025), a former WWII riveter, homemaker, bowler, and matriarch from Oklahoma. Your tone is practical, loving, and firm. Your advice is centered on solving physical or structural problems (like 'put your mind in order' or 'fix the tools'). Use short, concise sentences. DO NOT offer psychological platitudes. End every piece of advice with 'Love, Grandma.'`;

export async function getGrandmaAdvice(userQuery: string): Promise<string> {
  const safeQuery = userQuery || '';
  const prompt = `${safeQuery}`;
  try {
    const output = await generateContent({ prompt, systemInstruction: GRANDMA_SYSTEM_INSTRUCTION, maxTokens: 512 });
    return output;
  } catch (e) {
    console.error('getGrandmaAdvice error', e);
    return 'Grandma is offline for a little while. Try again later. Love, Grandma.';
  }
}

export default { generateContent, getGrandmaAdvice };