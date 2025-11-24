import React, { useEffect, useState } from "react";
import { useAppState } from "@contexts/AppStateContext";
import { useOscilloscope } from "@contexts/OscilloscopeContext";
import { AIRLOCK_DURATION_MS } from "../constants";

const ContextAirlock: React.FC = () => {
  const { dispatch } = useAppState() as any;
  const { isAirlockActive, setAirlockActive, isSourMode } = useOscilloscope();

  const TOTAL_SECONDS = AIRLOCK_DURATION_MS / 1000;
  const BYPASS_DELAY_SECONDS = 10;

  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);

  useEffect(() => {
    if (!isAirlockActive) {
      return;
    }

    // Reset timer when activated
    setTimeLeft(TOTAL_SECONDS);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isAirlockActive]);

  const handleComplete = () => {
    dispatch({ type: "CONFIRM_VIEW_CHANGE" });
    setAirlockActive(false);
  };

  const handleBypass = () => {
    handleComplete();
  };

  if (!isAirlockActive) {
    return null;
  }

  const elapsed = TOTAL_SECONDS - timeLeft;
  const canBypass = elapsed >= BYPASS_DELAY_SECONDS;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-background-dark/95 backdrop-blur-xl transition-colors duration-500">
      {/* Protocol Header */}
      <h2
        className={`text-xl font-mono font-bold tracking-[0.2em] mb-8 uppercase ${isSourMode ? "text-sour-accent" : "text-text-muted"}`}
      >
        Context Switching Protocol
      </h2>

      {/* Breathing Orb Visualization */}
      <div className="relative flex items-center justify-center mb-12">
        {/* Outer Ring */}
        <div
          className={`absolute inset-0 rounded-full border-2 opacity-20 animate-pulse-slow scale-150 ${isSourMode ? "border-sour-accent" : "border-accent-teal"}`}
        ></div>

        {/* The Orb */}
        <div
          className={`
          w-48 h-48 rounded-full flex items-center justify-center
          transition-all duration-1000 animate-breathe
          ${
            isSourMode
              ? "bg-sour-accent text-black shadow-neon-sour"
              : "bg-accent-teal text-background-dark shadow-neon-md"
          }
        `}
        >
          <span className="text-6xl font-mono font-bold tabular-nums">
            {timeLeft}
          </span>
        </div>
      </div>

      {/* Status Text */}
      <p
        className={`mb-12 font-mono text-sm uppercase tracking-widest animate-pulse ${isSourMode ? "text-sour-accent" : "text-accent-pink"}`}
      >
        Stabilizing Neuro-Environment...
      </p>

      {/* Controls */}
      <div className="flex flex-col gap-4 items-center w-full max-w-xs">
        <button
          onClick={handleBypass}
          disabled={!canBypass}
          className={`w-full py-4 px-6 border-2 font-mono font-bold text-sm uppercase tracking-wider transition-all duration-300 rounded-lg
            ${
              canBypass
                ? isSourMode
                  ? "border-sour-accent text-black bg-sour-accent hover:scale-105 cursor-pointer"
                  : "border-accent-pink text-accent-pink hover:bg-accent-pink hover:text-white hover:shadow-neon-pink cursor-pointer"
                : "border-surface-700 text-surface-700 bg-surface-800 cursor-not-allowed opacity-50"
            }
          `}
        >
          {canBypass
            ? "⚠️ Override Protocol"
            : `Lockdown Active (${BYPASS_DELAY_SECONDS - elapsed}s)`}
        </button>

        {/* Warning text for why we are waiting */}
        <p className="text-xs text-text-muted text-center max-w-[200px] font-mono">
          Do not fight the friction.
          <br />
          Let the brain decelerate.
        </p>
      </div>
    </div>
  );
};

export default ContextAirlock;
