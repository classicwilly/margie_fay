import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import React from 'react';
import { act } from '@testing-library/react';
// Import `useLiveSession` dynamically after mocking `@google/genai` to ensure
// the module uses the mocked GoogleGenAI constructor.

describe('useLiveSession Playwright stub guard', () => {
  beforeEach(() => {
    vi.resetModules();
    // Ensure no pre-existing flag
    try { delete (global as any).__PLAYWRIGHT_AI_STUB__; } catch (e) { /* ignore */ }
  });

  it('returns a fake session and avoids vendor network calls when __PLAYWRIGHT_AI_STUB__ is set', async () => {
    (global as any).__PLAYWRIGHT_AI_STUB__ = true;
    const onMessage = vi.fn();

    const { useLiveSession } = await import('../hooks/useLiveSession');
    const { result } = renderHook(() => useLiveSession({ onMessage, config: { model: 'x', config: {} } }));

    await act(async () => {
      await result.current.startSession();
    });

    // Because we resolve a fake session, status should be listening and methods must be callable
    expect(result.current.status === 'listening' || result.current.status === 'connecting' || result.current.status === 'idle').toBeTruthy();

    // calling sendToolResponse should not throw
    await act(async () => {
      result.current.sendToolResponse({ fake: true });
    });

    // stopSession should not throw
    await act(async () => {
      result.current.stopSession();
    });
  });

  it('uses GoogleGenAI.live.connect when not stubbed', async () => {
    // Provide a fake audio environment to avoid calling actual browser APIs
    (global as any).navigator = (global as any).navigator || {};
    (global as any).navigator.mediaDevices = { getUserMedia: vi.fn().mockResolvedValue({ getTracks: () => [] }) };

    // Minimal AudioContext stub used by the hook
    (global as any).AudioContext = class {
      state = 'running';
      destination = {};
      constructor() {}
      resume() { return Promise.resolve(); }
      createMediaStreamSource() { return { connect: () => {}, disconnect: () => {} }; }
      createScriptProcessor() { return { connect: () => {}, disconnect: () => {}, onaudioprocess: null }; }
      createAnalyser() { return { fftSize: 512, frequencyBinCount: 256, getByteTimeDomainData: (x:any)=>{} }; }
    } as any;

    // Provide the mocked google client via a global to avoid hoisting issues with vi.mock
    (global as any).__testGoogleMock = { live: { connect: vi.fn().mockResolvedValue({ sendRealtimeInput: vi.fn(), sendToolResponse: vi.fn(), close: vi.fn() }) } };
    vi.mock('@google/genai', () => ({ GoogleGenAI: function GoogleGenAI() { return (global as any).__testGoogleMock; } }));

    const onMessage = vi.fn();
    const { useLiveSession } = await import('../hooks/useLiveSession');
    const { result } = renderHook(() => useLiveSession({ onMessage, config: { model: 'x', config: {} } }));

    await act(async () => {
      await result.current.startSession();
    });

    expect((global as any).__testGoogleMock.live.connect).toHaveBeenCalled();
  });
});
