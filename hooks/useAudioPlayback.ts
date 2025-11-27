

import { useState, useRef, useCallback } from 'react';
import { decode, decodeAudioData } from '../utils/audioUtils.js';

export function useAudioPlayback() {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const outputAudioContextRef = useRef(null);
    // FIX: Typed the ref to ensure members are AudioBufferSourceNode.
    const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const nextStartTimeRef = useRef(0);

    const playAudioChunk = useCallback(async (base64Audio) => {
        if (!outputAudioContextRef.current) {
            // FIX: Cast window to any to access vendor-prefixed property.
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const audioCtx = outputAudioContextRef.current;
        if (audioCtx.state === 'suspended') {
            await audioCtx.resume();
        }

        setIsSpeaking(true);
        
        try {
            const audioBuffer = await decodeAudioData(decode(base64Audio), audioCtx, 24000, 1);
            
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioCtx.currentTime);

            const source = audioCtx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioCtx.destination);
            
            source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) {
                    setIsSpeaking(false);
                }
            });

            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += audioBuffer.duration;
            sourcesRef.current.add(source);
        } catch (e) {
            console.error("Error playing audio chunk:", e);
            setIsSpeaking(false); // Reset speaking state on error
        }
    }, []);

    const stopPlayback = useCallback(() => {
        sourcesRef.current.forEach(source => {
            try {
                source.stop();
            } catch {
                    // Ignore errors from stopping already-stopped sources
                }
        });
        sourcesRef.current.clear();
        nextStartTimeRef.current = 0;
        setIsSpeaking(false);
    }, []);

    return { isSpeaking, playAudioChunk, stopPlayback };
}