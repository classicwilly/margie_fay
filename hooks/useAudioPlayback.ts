

import { useState, useRef, useCallback } from 'react';
import { logError } from '../utils/logger';
import { decode, decodeAudioData } from '../utils/audioUtils.js';

export function useAudioPlayback() {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    // FIX: Typed the ref to ensure members are AudioBufferSourceNode.
    const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const nextStartTimeRef = useRef(0);

    const playAudioChunk = useCallback(async (base64Audio: string) => {
        if (!outputAudioContextRef.current) {
            const audioWindow = window as unknown as { webkitAudioContext?: typeof AudioContext, AudioContext?: typeof AudioContext };
            const AudioCtor = audioWindow.AudioContext ?? audioWindow.webkitAudioContext;
            if (!AudioCtor) throw new Error('No AudioContext available');
            outputAudioContextRef.current = new AudioCtor({ sampleRate: 24000 });
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
            logError('Error playing audio chunk', e);
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