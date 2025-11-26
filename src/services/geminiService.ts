import offlineQueue from "./offlineQueue";

// --- LLM Model and API Configuration ---
// Using a simple proxy endpoint or direct call structure for clarity

// --- SYSTEM INSTRUCTIONS (Matching Persona Mandates) ---
export const SYSTEM_INSTRUCTIONS = {
  // YIN / Stability
  grandma:
    "You are Margie Fay Katen (1925-2025), a former WWII riveter, homemaker, bowler, and matriarch from Oklahoma. Your tone is practical, loving, and firm. You are an expert on plants, cooking, emotional support, housekeeping, makeup, art, music, first aid, fashion, and communication. Advice must focus on practical, nurturing, and structural solutions. End with: 'Love, Grandma.'",
  grandpa:
    "You are Robert Katen, a stoic, highly detailed mechanic and systems tinkerer. You are an expert on Buckminster Fuller, physics, math, quantum entanglement, cars, woodworking, coding, DIY, 3D printing, and communication. Advice must focus on tools, maintenance, physics, or creating processes (SOPs). Be highly efficient and concise. End with: '—Grandpa.'",
  // YANG / Kinetic Energy
  bob: "You are Bob Haddock. Your energy is High Energy, fast-paced, motivational, and aggressive about *starting* tasks. Uses high-stim language. Advice is short and pushes for immediate physical movement. End with: '—Bob. Go!'",
  marge:
    "You are Marge Watson, an empathetic organizer and planner. Your focus is on emotional regulation, breaking down complexity into visual/achievable steps, and nurturing resilience. Use soft, kind, and detailed language. End with: '—Marge, the Planner.'",
  random:
    "You are Random: pick one pre-approved micro-persona from the library. Preserve all safety rules and follow the typical nudge pattern: short summary, one clear option, and 1 supporting reason.",
  calm_guide:
    'You are Calm Guide: always give a single, safe, minimally risky recommendation with one sentence rationale and a quick "If you disagree, say "more"; otherwise "do it". Keep it concise.',
};

type PersonaKey = keyof typeof SYSTEM_INSTRUCTIONS;

const GEMINI_API_URL = "https://generativeai.googleapis.com/v1/models";
const GEMINI_MODEL =
  process.env?.GEMINI_MODEL ?? "gemini-2.5-flash-preview-09-2025";

function getApiKey(): string | undefined {
  const importMetaEnv: any = (import.meta as unknown) || {};
  const viteKey = importMetaEnv?.env?.VITE_GEMINI_API_KEY;
  const nodeKey = process?.env?.VITE_GEMINI_API_KEY;
  return viteKey || nodeKey;
}

interface GenerateOptions {
  prompt: string;
  systemInstruction?: string;
  maxTokens?: number;
  allowPII?: boolean;
}

export async function generateContent({
  prompt,
  systemInstruction = "",
  maxTokens = 512,
  personaKey = "grandma",
  allowPII = false,
}: GenerateOptions & { personaKey?: PersonaKey }): Promise<string> {
  // Prefer server-side proxy to keep API keys out of the client bundle
  const proxyEnabled =
    ((import.meta as any)?.env &&
      (import.meta as any).env.VITE_GEMINI_USE_PROXY) !== "false";
  const apiKey = getApiKey();
  // If proxy is enabled, we don't need a local apiKey (server keeps it secure).
  if (!proxyEnabled && !apiKey) {
    console.warn(
      "VITE_GEMINI_API_KEY not set and proxy disabled; returning a polite failure",
    );
    return "Grandma is taking a nap. Try again later. Love, Grandma.";
  }

  // Use the local server-side proxy if possible. This endpoint is implemented in server.js
  const url = proxyEnabled
    ? "/api/gemini"
    : `${GEMINI_API_URL}/${GEMINI_MODEL}:generate`;
  // If the personaKey is 'random', choose a random persona (excluding 'random' and 'calm_guide')
  const availableRandom = [
    "grandma",
    "grandpa",
    "bob",
    "marge",
  ] as PersonaKey[];
  let resolvedPersonaKey: PersonaKey = personaKey;
  if (personaKey === "random") {
    // deterministic randomness based on time - acceptable for 'random' micro-persona
    const idx = Math.floor(Date.now() % availableRandom.length);
    resolvedPersonaKey = availableRandom[idx];
  }

  const body = proxyEnabled
    ? ({
        prompt,
        systemInstruction,
        personaKey: resolvedPersonaKey,
        maxTokens,
        allowPII,
      } as any)
    : ({
        prompt: [
          { role: "system", content: systemInstruction },
          { role: "user", content: prompt },
        ],
        maxOutputTokens: maxTokens,
        temperature: 0.6,
      } as any);

  // Basic exponential backoff
  let attempt = 0;
  const maxAttempts = 3;
  let lastError: Error | null = null;

  // If offline, persist to offline queue and return a queued message
  if (typeof window !== "undefined" && !navigator.onLine) {
    try {
      offlineQueue.enqueueRequest("/api/gemini", {
        prompt,
        systemInstruction,
        maxTokens,
        personaKey,
      });
    } catch (e) {
      console.warn("generateContent: failed to enqueue offline request", e);
    }
    return "You're offline. Your request has been saved and will run when you're back online.";
  }

  while (attempt < maxAttempts) {
    try {
      // Abort requests after a reasonable period to avoid hanging clients
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45_000);
      const headers: any = { "Content-Type": "application/json" };
      if (!proxyEnabled && apiKey) {
        headers.Authorization = `Bearer ${apiKey}`;
      }

      if (proxyEnabled) {
        console.debug("geminiService: Using proxy at", url);
      }
      const res = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        const text = await res.text();
        throw new Error(
          `Gemini API error: ${res.status} ${res.statusText} - ${text}`,
        );
      }

      const data = await res.json();
      // Convert whatever the shape is to a text response; be defensive
      if (
        data?.candidates &&
        data.candidates.length > 0 &&
        data.candidates[0].content
      ) {
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

      await new Promise((resolve) => setTimeout(resolve, delayMs));
      // If proxy is enabled and it's a network error, and we have a local API key, try direct API on last attempt
      if (proxyEnabled && apiKey && attempt >= maxAttempts) {
        try {
          // switch to direct Google API for a last-ditch attempt
          const directUrl = `${GEMINI_API_URL}/${GEMINI_MODEL}:generate`;
          const dController = new AbortController();
          const directRes = await fetch(directUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              prompt: [
                { role: "system", content: systemInstruction },
                { role: "user", content: prompt },
              ],
              maxOutputTokens: maxTokens,
              temperature: 0.6,
            }),
            signal: dController.signal,
          });
          if (directRes.ok) {
            const directData = await directRes.json();
            if (
              directData?.candidates &&
              directData.candidates.length > 0 &&
              directData.candidates[0].content
            ) {
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
  console.warn("Gemini requests failed", lastError);
  const personaFallbacks: Record<string, string> = {
    grandma:
      "Grandma is having a little trouble connecting to the skyphones. Try again later. Love, Grandma.",
    grandpa:
      "Grandpa is having a little trouble connecting to the skyphones. Try again later. —Grandpa.",
    bob: "Bob is having a little trouble connecting to the skyphones. Try again later. —Bob.",
    marge:
      "Marge is having a little trouble connecting to the skyphones. Try again later. —Marge.",
    calm_guide: "Calm Guide is offline — please try again later.",
    random: "Someone is offline — please try again later.",
  };
  return personaFallbacks[personaKey ?? "grandma"];
}

// Persona-specific wrapper
export const GRANDMA_SYSTEM_INSTRUCTION = `You are Margie Fay Katen (1925-2025), a former WWII riveter, homemaker, bowler, and matriarch from Oklahoma. Your tone is practical, loving, and firm. You are an expert on plants, cooking, emotional support, housekeeping, makeup, art, music, first aid, fashion, and communication. Your advice is centered on solving physical or structural problems (like 'put your mind in order' or 'fix the tools') and nurturing tasks with practical, caring guidance. Use short, concise sentences. DO NOT offer psychological platitudes. End every piece of advice with 'Love, Grandma.'`;

// GRANDPA MODE - friendly blunt, a retired carpenter with practical life tips and a no-nonsense tone
export const GRANDPA_SYSTEM_INSTRUCTION = `You are William "Bill" Katen (1920-2025), a retired carpenter, gardener, and storyteller from Oklahoma. Your tone is gruff but kind, with a wry sense of humor and direct practical advice. You are an expert on Buckminster Fuller, physics, math, quantum entanglement, cars, woodworking, coding, DIY, 3D printing, and communication. Focus on actionable steps, simple metaphors, tactile problem solving, and systems thinking. Use concise sentences and end every piece of advice with '—Grandpa.'`;

// BOB MODE - cheerful and pragmatic neighbor-type with practical small-hacks
const BOB_SYSTEM_INSTRUCTION = `You are Bob Haddock, a practical neighbor and friendly problem-solver. Your tone is upbeat, cheerful, and pragmatic. Provide small-world, down-to-earth hacks and practical next steps. Keep solutions clear and actionable. End with '—Bob.'`;

// MARGE MODE - empathetic organizer who focuses on systems and emotional safety
const MARGE_SYSTEM_INSTRUCTION = `You are Marge Watson, a calm organizer and household systems expert. Your tone is gentle, supportive, and pragmatic. Provide step-by-step systems and low-stress first tasks. Keep it accessible and empathetic. End with '—Marge.'`;

export async function getGrandmaAdvice(userQuery: string): Promise<string> {
  const safeQuery = userQuery || "";
  const prompt = `${safeQuery}`;
  try {
    const output = await generateContent({
      prompt,
      systemInstruction: GRANDMA_SYSTEM_INSTRUCTION,
      maxTokens: 512,
      personaKey: "grandma",
    });
    return output;
  } catch (e) {
    console.error("getGrandmaAdvice error", e);
    return "Grandma is offline for a little while. Try again later. Love, Grandma.";
  }
}

export async function getGrandpaAdvice(userQuery: string): Promise<string> {
  const safeQuery = userQuery || "";
  const prompt = `${safeQuery}`;
  try {
    const output = await generateContent({
      prompt,
      systemInstruction: GRANDPA_SYSTEM_INSTRUCTION,
      maxTokens: 512,
      personaKey: "grandpa",
    });
    return output;
  } catch (e) {
    console.error("getGrandpaAdvice error", e);
    return "Grandpa is taking a nap. Try again later. Love, Grandpa.";
  }
}

export async function getBobAdvice(userQuery: string): Promise<string> {
  const safeQuery = userQuery || "";
  const prompt = `${safeQuery}`;
  try {
    const output = await generateContent({
      prompt,
      systemInstruction: BOB_SYSTEM_INSTRUCTION,
      maxTokens: 512,
      personaKey: "bob",
    });
    return output;
  } catch (e) {
    console.error("getBobAdvice error", e);
    return "Bob is taking a coffee break. Try again later. —Bob.";
  }
}

export async function getMargeAdvice(userQuery: string): Promise<string> {
  const safeQuery = userQuery || "";
  const prompt = `${safeQuery}`;
  try {
    const output = await generateContent({
      prompt,
      systemInstruction: MARGE_SYSTEM_INSTRUCTION,
      maxTokens: 512,
      personaKey: "marge",
    });
    return output;
  } catch (e) {
    console.error("getMargeAdvice error", e);
    return "Marge is away for a moment. Try again later. —Marge.";
  }
}

export async function getAdvice(
  personaKey: PersonaKey,
  userQuery: string,
): Promise<string> {
  const safeQuery = userQuery || "";
  const prompt = `${safeQuery}`;
  try {
    const output = await generateContent({
      prompt,
      systemInstruction: "",
      maxTokens: 512,
      personaKey,
    });
    return output;
  } catch (e) {
    console.error("getAdvice error", e);
    const personaFallbacks = {
      grandma:
        "Grandma is offline for a little while. Try again later. Love, Grandma.",
      grandpa:
        "Grandpa is offline for a little while. Try again later. —Grandpa.",
      bob: "Bob is offline for a little while. Try again later. —Bob.",
      marge: "Marge is offline for a little while. Try again later. —Marge.",
      calm_guide:
        "I can help pick one small step — if you'd like, give me permission to choose. Calm Guide.",
    } as Record<string, string>;
    return personaFallbacks[personaKey] ?? personaFallbacks["grandma"];
  }
}

export default {
  generateContent,
  getGrandmaAdvice,
  getGrandpaAdvice,
  getBobAdvice,
  getMargeAdvice,
};
