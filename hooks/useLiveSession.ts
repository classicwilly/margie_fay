

import { useState, useRef, useCallback } from 'react';
import { logError } from '../src/utils/logger';
import { GoogleGenAI } from '@google/genai';
import { createBlob } from '../utils/audioUtils.js';
import win from '../utils/win';



type LiveSession = {
    sendRealtimeInput: (payload: { media: Blob }) => void;
    sendToolResponse: (payload: unknown) => void;
    close: () => void;
};

export function useLiveSession({ onMessage, config }: { onMessage: (msg: unknown) => void; config: { model?: string; config?: unknown } }) {
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState('');
    const [userVolume, setUserVolume] = useState(0);

    const sessionPromiseRef = useRef<Promise<LiveSession | null> | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const analyserNodeRef = useRef<AnalyserNode | null>(null);
    const volumeAnimationRef = useRef<number | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);

    const stopSession = useCallback((fromCallback = false) => {
        if (!fromCallback && sessionPromiseRef.current) {
            sessionPromiseRef.current.then((session) => session.close());
        }
        
        if (scriptProcessorRef.current) scriptProcessorRef.current.disconnect();
        if (mediaStreamSourceRef.current) mediaStreamSourceRef.current.disconnect();
        if (analyserNodeRef.current) analyserNodeRef.current.disconnect();
        if (volumeAnimationRef.current) cancelAnimationFrame(volumeAnimationRef.current);
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
            mediaStreamRef.current = null;
        }

        scriptProcessorRef.current = null;
        mediaStreamSourceRef.current = null;
        analyserNodeRef.current = null;
        volumeAnimationRef.current = null;
        sessionPromiseRef.current = null;
        
        setUserVolume(0);
        setStatus('idle');
    }, []);

    const startSession = useCallback(async () => {
        if (status !== 'idle' && status !== 'error') return;
        setStatus('connecting');
        setError('');

        try {
            // Guard for Playwright CI / deterministic runs: if a test has enabled the
            // AI proxy stub, avoid opening a real vendor websocket or requesting the
            // microphone (headless environments can't access media). Return a fake
            // resolved session so the UI behaves as if a connection was established.
            if (win?.__PLAYWRIGHT_AI_STUB__ === true) {
                const fakeSession: LiveSession = {
                    sendRealtimeInput: (_payload: { media: Blob }) => {},
                    sendToolResponse: (_payload: unknown) => {},
                    close: () => {},
                };
                // Mimic an open connection so UI transitions to listening
                setStatus('listening');
                sessionPromiseRef.current = Promise.resolve(fakeSession);
                return;
            }

            if (!inputAudioContextRef.current) {
                // Prefer the standardized AudioContext but fall back to vendor-prefixed webkitAudioContext when present on the win helper
                const Ctx = (globalThis as unknown as { AudioContext?: typeof AudioContext }).AudioContext || win?.webkitAudioContext;
                if (Ctx) inputAudioContextRef.current = new Ctx({ sampleRate: 16000 } as AudioContextOptions);
            }
            if (inputAudioContextRef.current.state === 'suspended') {
                await inputAudioContextRef.current.resume();
            }

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const onOpen = () => {
                setStatus('listening');
                const audioCtx = inputAudioContextRef.current;
                mediaStreamSourceRef.current = audioCtx.createMediaStreamSource(stream);
                
                // Audio processing
                scriptProcessorRef.current = audioCtx.createScriptProcessor(4096, 1, 1);
                scriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
                    const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                    const pcmBlob = createBlob(inputData);
                    sessionPromiseRef.current?.then((session) => {
                        session.sendRealtimeInput({ media: pcmBlob });
                    });
                };
                
                // Volume analysis
                analyserNodeRef.current = audioCtx.createAnalyser();
                analyserNodeRef.current.fftSize = 512;
                const dataArray = new Uint8Array(analyserNodeRef.current.frequencyBinCount);

                const updateVolume = () => {
                    if (!analyserNodeRef.current) return;
                    analyserNodeRef.current.getByteTimeDomainData(dataArray);
                    let sumSquares = 0.0;
                    for (const amplitude of dataArray) {
                        const val = (amplitude - 128) / 128.0;
                        sumSquares += val * val;
                    }
                    setUserVolume(Math.sqrt(sumSquares / dataArray.length));
                    volumeAnimationRef.current = requestAnimationFrame(updateVolume);
                };
                volumeAnimationRef.current = requestAnimationFrame(updateVolume);
                
                mediaStreamSourceRef.current.connect(analyserNodeRef.current);
                mediaStreamSourceRef.current.connect(scriptProcessorRef.current);
                scriptProcessorRef.current.connect(audioCtx.destination); // Connect to output to avoid glitches in some browsers
            };

            const onError = (e: unknown) => {
                logError('Session error:', e);
                const msg = e instanceof Error ? e.message : String(e);
                setError(`Session error: ${msg}`);
                stopSession(true);
            };

            const onClose = () => {
                stopSession(true);
            };

            sessionPromiseRef.current = ai.live.connect({
                model: config.model,
                callbacks: {
                    onopen: onOpen,
                    onmessage: onMessage,
                    onerror: onError,
                    onclose: onClose,
                },
                config: config.config,
            });

        } catch (e) {
            logError('Failed to start session:', e);
            const msg = e instanceof Error ? e.message : String(e);
            setError(`Failed to start: ${msg}`);
            setStatus('error');
            stopSession();
        }
    }, [status, onMessage, config, stopSession]);

    const sendToolResponse = useCallback((response) => {
        sessionPromiseRef.current?.then((session) => {
            session.sendToolResponse(response);
        });
    }, []);

    return { status, error, userVolume, startSession, stopSession, sendToolResponse };
}