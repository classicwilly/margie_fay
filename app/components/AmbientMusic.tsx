'use client';

import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, Minimize2, Maximize2, GripHorizontal } from 'lucide-react';

interface AmbientMusicProps {
  frequency?: '396Hz' | '528Hz' | '639Hz' | '741Hz';
  autoplay?: boolean;
  className?: string;
}

/**
 * 🎵 Ambient Music Component
 * 
 * Plays Solfeggio frequency-tuned ambient music for healing resonance
 * Frequencies map to VPI protocol modules:
 * - 396 Hz: Liberation from fear/guilt (Kids)
 * - 528 Hz: Transformation, DNA repair (Parenting)
 * - 639 Hz: Harmonizing relationships (Status/Connection)
 * - 741 Hz: Awakening intuition (Default/Documentation)
 */
export default function AmbientMusic({ 
  frequency = '741Hz',
  autoplay = false,
  className = ''
}: AmbientMusicProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Map frequencies to audio sources (using royalty-free Solfeggio tone generators)
  const audioSources = {
    '396Hz': 'https://www.solfeggio-frequencies.com/audio/396hz-ambient.mp3',
    '528Hz': 'https://www.solfeggio-frequencies.com/audio/528hz-ambient.mp3',
    '639Hz': 'https://www.solfeggio-frequencies.com/audio/639hz-ambient.mp3',
    '741Hz': 'https://www.solfeggio-frequencies.com/audio/741hz-ambient.mp3',
  };

  const frequencyInfo = {
    '396Hz': { name: 'Liberation', color: 'text-pink-400', description: 'Liberating guilt & fear' },
    '528Hz': { name: 'Transformation', color: 'text-green-400', description: 'Miracles & DNA repair' },
    '639Hz': { name: 'Connection', color: 'text-blue-400', description: 'Harmonizing relationships' },
    '741Hz': { name: 'Intuition', color: 'text-purple-400', description: 'Awakening consciousness' },
  };

  const info = frequencyInfo[frequency];

  useEffect(() => {
    // Create audio element
    const audio = new Audio(audioSources[frequency]);
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;

    // Autoplay if enabled (with user interaction requirement handling)
    if (autoplay) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay blocked - user will need to click play
            console.log('Autoplay blocked - waiting for user interaction');
          });
      }
    }

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [frequency, autoplay]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && containerRef.current) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => setIsPlaying(true))
            .catch((error) => console.error('Playback error:', error));
        }
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0) setIsMuted(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div 
      ref={containerRef}
      className={`fixed z-50 ${className}`}
      style={{
        bottom: position.y === 0 ? '24px' : 'auto',
        right: position.x === 0 ? '24px' : 'auto',
        left: position.x !== 0 ? `${position.x}px` : 'auto',
        top: position.y !== 0 ? `${position.y}px` : 'auto',
        cursor: isDragging ? 'grabbing' : 'auto'
      }}
    >
      <div className="bg-slate-900/95 backdrop-blur-lg border border-slate-700/50 rounded-xl shadow-2xl min-w-[280px] max-w-[400px]">
        {/* Drag Handle */}
        <div 
          className="flex items-center justify-between px-4 py-2 border-b border-slate-700/50 cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-2 text-slate-400">
            <GripHorizontal className="w-4 h-4" />
            <span className="text-xs font-medium">Ambient Healing</span>
          </div>
          <button
            onClick={toggleMinimize}
            className="p-1 text-slate-400 hover:text-white transition-colors"
            title={isMinimized ? 'Maximize' : 'Minimize'}
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
        </div>

        {!isMinimized && (
          <div className="p-4">
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br from-purple-600/20 to-blue-600/20 ${info.color}`}>
                <Music className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="text-white font-semibold text-sm">{frequency} - {info.name}</div>
                <div className="text-slate-400 text-xs">{info.description}</div>
              </div>
            </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className={`p-2 rounded-lg transition-all ${
              isPlaying 
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/30' 
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Volume Control */}
          <div className="flex-1 flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <label className="flex-1">
              <span className="sr-only">Volume</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                title="Volume control"
                className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-purple-500 [&::-webkit-slider-thumb]:to-blue-500"
              />
            </label>
            <span className="text-slate-400 text-xs font-mono w-8 text-right">
              {Math.round((isMuted ? 0 : volume) * 100)}
            </span>
          </div>
        </div>

        {/* Frequency Visualization */}
        {isPlaying && (
          <div className="mt-3 flex items-center gap-1 justify-center h-6">
            <div className="w-1 h-2 bg-gradient-to-t from-purple-600 to-blue-400 rounded-full animate-pulse" />
            <div className="w-1 h-3 bg-gradient-to-t from-purple-600 to-blue-400 rounded-full animate-pulse [animation-delay:100ms]" />
            <div className="w-1 h-4 bg-gradient-to-t from-purple-600 to-blue-400 rounded-full animate-pulse [animation-delay:200ms]" />
            <div className="w-1 h-5 bg-gradient-to-t from-purple-600 to-blue-400 rounded-full animate-pulse [animation-delay:300ms]" />
            <div className="w-1 h-6 bg-gradient-to-t from-purple-600 to-blue-400 rounded-full animate-pulse [animation-delay:400ms]" />
            <div className="w-1 h-4 bg-gradient-to-t from-purple-600 to-blue-400 rounded-full animate-pulse [animation-delay:500ms]" />
            <div className="w-1 h-3 bg-gradient-to-t from-purple-600 to-blue-400 rounded-full animate-pulse [animation-delay:600ms]" />
            <div className="w-1 h-5 bg-gradient-to-t from-purple-600 to-blue-400 rounded-full animate-pulse [animation-delay:700ms]" />
            <div className="w-1 h-2 bg-gradient-to-t from-purple-600 to-blue-400 rounded-full animate-pulse [animation-delay:800ms]" />
            <div className="w-1 h-4 bg-gradient-to-t from-purple-600 to-blue-400 rounded-full animate-pulse [animation-delay:900ms]" />
            <div className="w-1 h-3 bg-gradient-to-t from-purple-600 to-blue-400 rounded-full animate-pulse [animation-delay:1000ms]" />
            <div className="w-1 h-5 bg-gradient-to-t from-purple-600 to-blue-400 rounded-full animate-pulse [animation-delay:1100ms]" />
          </div>
        )}

        {/* Info Note */}
        <div className="mt-3 pt-3 border-t border-slate-700/50">
          <p className="text-slate-500 text-xs text-center">
            Ambient healing tones for enhanced resonance
          </p>
        </div>
          </div>
        )}
      </div>
    </div>
  );
}
