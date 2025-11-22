/* eslint-disable no-await-in-loop */
const GEMINI_API_URL = 'https://generativeai.googleapis.com/v1/models';
const GEMINI_MODEL = 'gemini-2.5-flash-preview-09-2025';

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
  const apiKey = getApiKey();

  if (!apiKey) {
    console.warn('VITE_GEMINI_API_KEY not set');
    return 'Grandma is taking a nap. Try again later. Love, Grandma.';
  }

  const url = `${GEMINI_API_URL}/${GEMINI_MODEL}:generate`;
  const body = {
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