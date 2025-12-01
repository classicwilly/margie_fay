import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import React from 'react';
import { act } from '@testing-library/react';
import useSafeAI from '../hooks/useSafeAI';
import { FeatureFlagsProvider } from '@contexts/FeatureFlagsContext';
import * as telemetry from '../utils/telemetry';

vi.mock('../hooks/useAIPromptSafety', () => ({
  default: () => ({ checkAndExecute: (prompt: any, fn: any) => fn(prompt) })
}));
let googleMock: any;

describe('useSafeAI telemetry & failures', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('logs ai_call_success on successful call', async () => {
    googleMock = {
      models: { generateContent: vi.fn().mockResolvedValue({ text: 'hello' }) },
    };
    vi.mock('@google/genai', () => ({ GoogleGenAI: function GoogleGenAI() { return googleMock; } }));

    const spy = vi.spyOn(telemetry, 'logTelemetry');

    const wrapper = ({ children }: any) => React.createElement(FeatureFlagsProvider, null, children);
    const { result } = renderHook(() => useSafeAI(), { wrapper });
    const { generate } = result.current;

    const res = await act(async () => await generate('test prompt'));
    expect(spy).toHaveBeenCalledWith('ai_call_success', expect.any(Object));
  });

  it('logs json parse failure when JSON expected but invalid', async () => {
    googleMock = {
      models: { generateContent: vi.fn().mockResolvedValue({ text: 'notjson' }) },
    };
    vi.mock('@google/genai', () => ({ GoogleGenAI: function GoogleGenAI() { return googleMock; } }));

    const spy = vi.spyOn(telemetry, 'logTelemetry');
    const wrapper = ({ children }: any) => React.createElement(FeatureFlagsProvider, null, children);
    const { result } = renderHook(() => useSafeAI(), { wrapper });
    const { generate } = result.current;

    await expect(result.current.generate('test', { responseMimeType: 'application/json' })).rejects.toThrow();
    expect(spy).toHaveBeenCalledWith('ai_call_json_parse_failure', expect.any(Object));
  });

  it('logs ai_call_error on timeout', async () => {
    vi.useFakeTimers();

    googleMock = {
      models: {
        generateContent: vi.fn((opts: any) =>
          new Promise((_, reject) => {
            if (opts?.signal) {
              opts.signal.addEventListener('abort', () => reject(new Error('aborted')));
            }
          })
        ),
      },
    };
    vi.mock('@google/genai', () => ({ GoogleGenAI: function GoogleGenAI() { return googleMock; } }));

    const spy = vi.spyOn(telemetry, 'logTelemetry');
    const wrapper = ({ children }: any) => React.createElement(FeatureFlagsProvider, null, children);
    const { result } = renderHook(() => useSafeAI(), { wrapper });
    const { generate } = result.current;

    const promise = generate('timeout-promt', { timeoutMs: 10 });
    act(() => {
      vi.advanceTimersByTime(50);
    });

    await expect(promise).rejects.toThrow();
    expect(spy).toHaveBeenCalledWith('ai_call_error', expect.any(Object));

    vi.useRealTimers();
  });

  it('respects external abort signal', async () => {
    googleMock = {
      models: {
        generateContent: vi.fn((opts: any) =>
          new Promise((_, reject) => {
            if (opts?.signal) {
              opts.signal.addEventListener('abort', () => reject(new Error('aborted')));
            }
          })
        ),
      },
    };
    vi.mock('@google/genai', () => ({ GoogleGenAI: function GoogleGenAI() { return googleMock; } }));

    const spy = vi.spyOn(telemetry, 'logTelemetry');
    const wrapper = ({ children }: any) => React.createElement(FeatureFlagsProvider, null, children);
    const { result } = renderHook(() => useSafeAI(), { wrapper });
    const { generate } = result.current;
    const controller = new AbortController();

    const promise = generate('abort-test', { signal: controller.signal });
    controller.abort();

    await expect(promise).rejects.toThrow();
    expect(spy).toHaveBeenCalledWith('ai_call_error', expect.any(Object));
  });

  it('returns a manual fallback when AI is disabled', async () => {
    // Simulate user turning AI off in localStorage
    localStorage.setItem('wonky_flags', JSON.stringify({ aiEnabled: false }));
    const wrapper = ({ children }: any) => React.createElement(FeatureFlagsProvider, null, children);
    const { result } = renderHook(() => useSafeAI(), { wrapper });
    const { generate } = result.current;
    const controller = new AbortController();
    const res = await generate('some prompt');
    expect(res.source).toBe('manual');
  });
  it('returns structured placeholders when JSON is requested and AI is disabled', async () => {
    localStorage.setItem('wonky_flags', JSON.stringify({ aiEnabled: false }));
    const wrapper = ({ children }: any) => React.createElement(FeatureFlagsProvider, null, children);
    const { result } = renderHook(() => useSafeAI(), { wrapper });
    const { generate } = result.current;
    const res = await generate('a prompt', { responseMimeType: 'application/json', responseSchema: { properties: { wins: {}, friction: {} } } });
    expect(res.source).toBe('manual');
    expect('wins' in res.json).toBe(true);
    expect(res.json.wins).toContain('NO_AI');
  });
});
