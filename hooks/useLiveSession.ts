import { useState, useRef, useCallback } from "react";
import { GoogleGenAI } from "@google/genai";
import { createBlob } from "../utils/audioUtils.js";

export function useLiveSession({ onMessage, config }) {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [userVolume, setUserVolume] = useState(0);

  const sessionPromiseRef = useRef(null);
  const inputAudioContextRef = useRef(null);
  const scriptProcessorRef = useRef(null);
  const mediaStreamSourceRef = useRef(null);
  const analyserNodeRef = useRef(null);
  const volumeAnimationRef = useRef(null);
  const mediaStreamRef = useRef(null);

  const stopSession = useCallback((fromCallback = false) => {
    if (!fromCallback && sessionPromiseRef.current) {
      sessionPromiseRef.current.then((session) => session.close());
    }

    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
    }
    if (mediaStreamSourceRef.current) {
      mediaStreamSourceRef.current.disconnect();
    }
    if (analyserNodeRef.current) {
      analyserNodeRef.current.disconnect();
    }
    if (volumeAnimationRef.current) {
      cancelAnimationFrame(volumeAnimationRef.current);
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    scriptProcessorRef.current = null;
    mediaStreamSourceRef.current = null;
    analyserNodeRef.current = null;
    volumeAnimationRef.current = null;
    sessionPromiseRef.current = null;

    setUserVolume(0);
    setStatus("idle");
  }, []);

  const startSession = useCallback(async () => {
    if (status !== "idle" && status !== "error") {
      return;
    }
    setStatus("connecting");
    setError("");

    try {
      // Guard for Playwright CI / deterministic runs: if a test has enabled the
      // AI proxy stub, avoid opening a real vendor websocket or requesting the
      // microphone (headless environments can't access media). Return a fake
      // resolved session so the UI behaves as if a connection was established.
      if (
        typeof window !== "undefined" &&
        (window as any).__PLAYWRIGHT_AI_STUB__ === true
      ) {
        const fakeSession = {
          sendRealtimeInput: (_: any) => {},
          sendToolResponse: (_: any) => {},
          close: () => {},
        };
        // Mimic an open connection so UI transitions to listening
        setStatus("listening");
        sessionPromiseRef.current = Promise.resolve(fakeSession as any);
        return;
      }

      if (!inputAudioContextRef.current && typeof window !== "undefined") {
        // FIX: Cast window to any to access vendor-prefixed property.
        inputAudioContextRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)({ sampleRate: 16000 });
      }
      if (inputAudioContextRef.current.state === "suspended") {
        await inputAudioContextRef.current.resume();
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      const onOpen = () => {
        setStatus("listening");
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
        const dataArray = new Uint8Array(
          analyserNodeRef.current.frequencyBinCount,
        );

        const updateVolume = () => {
          if (!analyserNodeRef.current) {
            return;
          }
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

      const onError = (e) => {
        console.error("Session error:", e);
        setError(`Session error: ${e.message || "An unknown error occurred"}`);
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
      console.error("Failed to start session:", e);
      setError(`Failed to start: ${e.message}`);
      setStatus("error");
      stopSession();
    }
  }, [status, onMessage, config, stopSession]);

  const sendToolResponse = useCallback((response) => {
    sessionPromiseRef.current?.then((session) => {
      session.sendToolResponse(response);
    });
  }, []);

  return {
    status,
    error,
    userVolume,
    startSession,
    stopSession,
    sendToolResponse,
  };
}
