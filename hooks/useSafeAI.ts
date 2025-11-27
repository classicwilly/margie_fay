import { useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import useAIPromptSafety from './useAIPromptSafety';
import { useAIEnabled } from '@contexts/FeatureFlagsContext';
import win from '../utils/win';
import { logDebug, logError } from '../utils/logger';
import { logTelemetry } from '../utils/telemetry';

export type GenerateOptions = {
	model?: string;
	responseMimeType?: string;
	responseSchema?: unknown;
	timeoutMs?: number;
	inputs?: unknown[];
	config?: unknown;
	signal?: AbortSignal;
	skipPromptSafety?: boolean;
};

const DEFAULT_TIMEOUT = 20000;

export function useSafeAI() {
	const { checkAndExecute } = useAIPromptSafety();
	const aiEnabled = useAIEnabled();

	const generate = useCallback(async (prompt: string, opts: GenerateOptions = {}): Promise<{ text: string }> => {
		try {
			logDebug('useSafeAI.generate called', { promptLength: prompt.length, opts });
		} catch { /* ignore logging errors */ }

				if (!aiEnabled) {
			// Return a structured manual fallback to match telemetry-driven tests
			if (opts.responseMimeType === 'application/json' && opts.responseSchema) {
				// Build a minimal placeholder JSON using schema properties
				const placeholder: Record<string, unknown> = {};
				try {
					const props = ((opts.responseSchema as unknown) as { properties?: Record<string, unknown> }).properties || {};
					for (const k of Object.keys(props || {})) {
						placeholder[k] = ['NO_AI'];
					}
				} catch {
					// if responseSchema isn't as expected, fallback to generic
					placeholder.wins = ['NO_AI'];
				}
				return { source: 'manual', json: placeholder, text: '' } as const;
			}
			return { source: 'manual', text: '' } as const;
		}

		const safeAction = async (safePrompt: string) => {
			const derived = new AbortController();
			const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT;
			const timeoutId = setTimeout(() => derived.abort(), timeoutMs);
			try {
				try { logDebug('useSafeAI: checking proxy flag ->', win?.__PLAYWRIGHT_AI_STUB__); } catch (e: unknown) { logDebug('useSafeAI: proxy flag check error', e); }
				if (win?.__PLAYWRIGHT_AI_STUB__ === true) {
					logDebug('useSafeAI: using proxy stub for AI');
					const proxyResp = await fetch('/aiProxy', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ prompt: safePrompt }),
					});
											const proxyJson = await proxyResp.json();
										const proxyChoices = (proxyJson as unknown as { choices?: { text?: string }[] }).choices;
										const textResult = (proxyJson as unknown as { text?: string }).text || proxyChoices?.[0]?.text || '';
										if (opts.responseMimeType === 'application/json') {
											try {
												const parsed = typeof textResult === 'string' ? JSON.parse(textResult) : textResult;
												logTelemetry('ai_call_success', { model: opts.model, promptLength: safePrompt.length });
												return { source: 'ai', json: parsed, text: '' } as const;
											} catch (err: unknown) {
												const errMsg = (err as Error)?.message || String(err);
												logTelemetry('ai_call_json_parse_failure', { err: errMsg });
												throw err;
											}
										}
										logTelemetry('ai_call_success', { model: opts.model, promptLength: safePrompt.length });
										return { source: 'ai', text: textResult } as const;
				}
				logDebug('useSafeAI: proxy not used, falling back to vendor SDK');
				const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? process.env.API_KEY });
								// Respect external signal by linking opts.signal to derived controller
								let externalAbortHandler: (() => void) | undefined;
								if (opts.signal) {
									if (opts.signal.aborted) derived.abort();
									else {
										externalAbortHandler = () => derived.abort();
										opts.signal.addEventListener('abort', externalAbortHandler);
									}
								}

								const result = await ai.models.generateContent({
					model: opts.model ?? 'gemini-2.5-flash',
					contents: safePrompt,
					responseMimeType: opts.responseMimeType,
					responseSchema: opts.responseSchema,
					inputs: opts.inputs,
					signal: derived.signal,
					config: opts.config,
				});
								const textResult = (result as unknown as { text?: string }).text || '';
								if (opts.responseMimeType === 'application/json') {
									try {
										const parsed = typeof textResult === 'string' ? JSON.parse(textResult) : textResult;
										logTelemetry('ai_call_success', { model: opts.model, promptLength: safePrompt.length });
										return { source: 'ai', json: parsed, text: '' } as const;
									} catch (err: unknown) {
										const errMsg = (err as Error)?.message || String(err);
										logTelemetry('ai_call_json_parse_failure', { err: errMsg });
										throw err;
									}
								}
								logTelemetry('ai_call_success', { model: opts.model, promptLength: safePrompt.length });
								return { source: 'ai', text: textResult } as const;
			} catch (e: unknown) {
				logError('useSafeAI: generate failed', e);
				try { logTelemetry('ai_call_error', { message: (e as Error)?.message }); } catch (err: unknown) { logDebug('useSafeAI: logTelemetry failed', err); }
				throw e;
						} finally {
								if (opts.signal && externalAbortHandler) {
									try { opts.signal.removeEventListener('abort', externalAbortHandler); } catch (err: unknown) { logDebug('useSafeAI: removeEventListener failed', err); }
								}
				clearTimeout(timeoutId);
			}
		};

		if (opts.skipPromptSafety) return safeAction(prompt.trim());
		return checkAndExecute(prompt, safeAction);
	}, [checkAndExecute, aiEnabled]);

	return { generate };
}

export default useSafeAI;
