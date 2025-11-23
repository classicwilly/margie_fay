import { useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import useAIPromptSafety from './useAIPromptSafety';
import { useAIEnabled } from '../src/contexts/FeatureFlagsContext';
import { logTelemetry } from '../utils/telemetry';

export type GenerateOptions = {
  model?: string;
  responseMimeType?: string;
  responseSchema?: any;
  timeoutMs?: number;
  inputs?: any[];
  config?: any;
  signal?: AbortSignal;
  skipPromptSafety?: boolean;
};

const DEFAULT_TIMEOUT = 20_000;

export function useSafeAI() {
  const { checkAndExecute } = useAIPromptSafety();

  const aiEnabled = useAIEnabled();

  const generate = useCallback(async (prompt: string, opts: GenerateOptions = {}) => {
    console.log('useSafeAI.generate called', { promptLength: prompt.length, opts });
    if (!aiEnabled) {
      // AI is disabled; return a safe fallback that UIs can interpret
      // If JSON is requested, return simple placeholders matching the expected keys
      if (opts.responseMimeType === 'application/json' && opts.responseSchema && opts.responseSchema.properties) {
        const json: any = {};
        for (const [k] of Object.entries(opts.responseSchema.properties)) {
          json[k] = 'NO_AI: Manual entry required.';
        }
        return { json, text: JSON.stringify(json, null, 2), source: 'manual' };
      }
      return { text: 'Manual mode: provide a manual response.', source: 'manual' };
    }
    const safeAction = async (safePrompt: string) => {
      // Create a derived controller so callers can pass an external signal
      const derived = new AbortController();
      const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT;
      const timeoutId = setTimeout(() => derived.abort(), timeoutMs);
      // if caller passed signal, forward it to the derived controller
      if (opts.signal) {
        if (opts.signal.aborted) derived.abort();
        // forward abort
        opts.signal.addEventListener('abort', () => derived.abort(), { once: true });
      }

        try {
          console.log('useSafeAI: checking proxy flag ->', window.__PLAYWRIGHT_AI_STUB__);
        // For Playwright runs we allow a deterministic server-side stub to be used.
        // Some test runs set `__PLAYWRIGHT_AI_STUB__` via `page.addInitScript`.
        if (typeof window !== 'undefined' && (window as any).__PLAYWRIGHT_AI_STUB__ === true) {
          // Use the AI proxy path so Playwright route intercepts the response.
          console.debug('useSafeAI: proxy mode enabled; calling /aiProxy');
          const proxyResp = await fetch('/aiProxy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: safePrompt }),
          });
          const proxyJson = await proxyResp.json();
          if (opts.responseMimeType === 'application/json') {
            logTelemetry('ai_call_success', { model: opts.model, promptLength: safePrompt.length });
            console.debug('useSafeAI: ai proxy returned', proxyJson);
            return { json: proxyJson, text: JSON.stringify(proxyJson, null, 2), raw: proxyJson };
          } else {
            logTelemetry('ai_call_success', { model: opts.model, promptLength: safePrompt.length });
            return { text: proxyJson.choices?.[0]?.text || proxyJson.text || '', raw: proxyJson };
          }
        }
        console.log('useSafeAI: proxy not used, falling back to vendor SDK');
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? process.env.API_KEY });
        const result = await ai.models.generateContent({
          model: opts.model ?? 'gemini-2.5-flash',
          contents: safePrompt,
          responseMimeType: opts.responseMimeType,
          responseSchema: opts.responseSchema,
          inputs: opts.inputs,
          signal: derived.signal,
          config: opts.config,
        });

        if (opts.responseMimeType === 'application/json') {
          try {
            const json = result?.toJson ? result.toJson() : JSON.parse(result.text);
            logTelemetry('ai_call_success', { model: opts.model, promptLength: safePrompt.length });
            return { json, text: result.text, raw: result };
          } catch (err) {
            logTelemetry('ai_call_json_parse_failure', { err: err?.message });
            throw err;
          }
        }

        logTelemetry('ai_call_success', { model: opts.model, promptLength: safePrompt.length });
        return { text: result.text, raw: result };
      } catch (err) {
        logTelemetry('ai_call_error', { message: err?.message });
        throw err;
      } finally {
        clearTimeout(timeoutId);
      }
    };

    if (opts.skipPromptSafety) {
      return safeAction(prompt.trim());
    }

    return checkAndExecute(prompt, safeAction);
  }, [checkAndExecute]);

  return { generate };
}

export default useSafeAI;
