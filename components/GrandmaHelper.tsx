import { useEffect, useRef, useState } from "react";
import type { FC } from "react";
import { useAppState } from "@contexts/AppStateContext";
import {
  getGrandmaAdvice,
  getGrandpaAdvice,
  getBobAdvice,
  getMargeAdvice,
} from "../src/services/geminiService";
import { sanitizePrompt } from "../src/utils/promptSanitizer";

const GrandmaHelper: FC = () => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [persona, setPersona] = useState<
    "grandma" | "grandpa" | "bob" | "marge"
  >("grandma");
  const [lastSanitized, setLastSanitized] = useState("");
  const [piiWarning, setPiiWarning] = useState("");
  const [animate, setAnimate] = useState(false);
  const responseRef = useRef<HTMLDivElement | null>(null);

  // use a shared sanitizer util

  const handleAsk = async () => {
    if (!query.trim()) {
      return;
    }
    const sanitized = sanitizePrompt(query) || "";
    const redacted = sanitized !== query;
    if (redacted) {
      setPiiWarning("Sensitive info removed for your safety.");
    } else {
      setPiiWarning("");
    }
    setLastSanitized(sanitized);
    setLoading(true);
    setResponseText("");
    try {
      let result = "";
      if (persona === "grandma") {
        result = await getGrandmaAdvice(sanitized);
      } else if (persona === "grandpa") {
        result = await getGrandpaAdvice(sanitized);
      } else if (persona === "bob") {
        result = await getBobAdvice(sanitized);
      } else if (persona === "marge") {
        result = await getMargeAdvice(sanitized);
      }
      setResponseText(result);
      setAnimate(true);
      setTimeout(() => setAnimate(false), 900);
    } catch (e) {
      // persona-specific fallback if generateContent or persona wrapper fails
      if (persona === "grandpa") {
        setResponseText(
          "Love, Grandpa. Grandpa is having trouble right now. Try again later.",
        );
      } else if (persona === "bob") {
        setResponseText(
          "Bob is having trouble right now. Try again later. —Bob.",
        );
      } else if (persona === "marge") {
        setResponseText(
          "Marge is having trouble right now. Try again later. —Marge.",
        );
      } else {
        setResponseText(
          "Grandma is having trouble right now. Try again later. Love, Grandma.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const quickTips = [
    "How do I clean a drain?",
    "How do I get motivated to finish the dishes?",
    "How do I reorganize my workspace?",
    "What's the right frequency, chief?",
  ];

  const handleQuickTip = (t: string) => {
    setQuery(t);
    setTimeout(() => {
      const el = document.getElementById("grandma-input");
      if (el) {
        (el as HTMLElement).focus();
      }
    }, 50);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(responseText);
    } catch (e) {
      console.warn("copy failed", e);
    }
  };

  useEffect(() => {
    if (responseRef.current && animate) {
      try {
        if (typeof responseRef.current.scrollIntoView === "function") {
          responseRef.current.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }
      } catch (e) {
        // ScrollIntoView may not be implemented in the test DOM or certain browsers
      }
    }
  }, [animate]);

  useEffect(() => {
    const handler = (e: any) => {
      if (e?.detail?.value) {
        setQuery(e.detail.value);
        setTimeout(() => {
          const el = document.getElementById("grandma-input");
          if (el) {
            (el as HTMLElement).focus();
          }
        }, 50);
      }
    };
    // Listen for both the legacy 'set-grandma-query' and the newer, persona-agnostic
    // 'set-ai-query' events to maintain backward compatibility.
    window.addEventListener("set-grandma-query", handler);
    window.addEventListener("set-ai-query", handler);
    return () => {
      window.removeEventListener("set-grandma-query", handler);
      window.removeEventListener("set-ai-query", handler);
    };
  }, []);

  const { getPersonaDisplayName } = useAppState();
  const personaKey =
    persona === "grandma"
      ? "Grandma"
      : persona === "grandpa"
        ? "Grandpa"
        : persona === "bob"
          ? "Bob"
          : "Marge";
  const displayName = getPersonaDisplayName
    ? getPersonaDisplayName(personaKey)
    : personaKey;
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[40vh] font-neon">
      <div className="flex flex-col items-center gap-4 mb-8">
        <img
          className="h-20 w-20 rounded-full shadow-neon animate-glow mb-2"
          src={
            persona === "grandma"
              ? "/grandma.svg"
              : persona === "grandpa"
                ? "/grandpa.svg"
                : persona === "bob"
                  ? "/bob.svg"
                  : "/marge.svg"
          }
          alt={`${displayName} AI`}
        />
        <h3 className="text-3xl font-bold text-neon-green animate-neon mb-2 tracking-wide text-center">
          ASK {displayName.toUpperCase()}
        </h3>
        <div className="flex items-center gap-2 bg-neon-blue/10 px-4 py-2 rounded-xl border-neon-blue">
          <label className="text-xs text-neon-blue font-neon">Persona:</label>
          <select
            aria-label="AI persona"
            value={persona}
            onChange={(e) => setPersona(e.target.value as any)}
            className="bg-transparent text-sm ml-2 text-neon-green font-neon outline-none"
          >
            <option value="grandma">Grandma</option>
            <option value="grandpa">Grandpa</option>
            <option value="bob">Bob</option>
            <option value="marge">Marge</option>
          </select>
        </div>
        <p className="text-xs text-neon-pink mt-2 text-center">
          {persona === "grandma"
            ? "MARGIE FAY KATEN (1925-2025)"
            : persona === "grandpa"
              ? "WILLIAM KATEN (1920-2025)"
              : persona === "bob"
                ? "BOB HADDCOCK - NEIGHBOR"
                : "MARGE WATSON - ORGANIZER"}
        </p>
        {/** Persona Traits display **/}
        {(() => {
          const TRAITS: Record<string, string[]> = {
            grandma: [
              "plants",
              "cooking",
              "emotional support",
              "housekeeping",
              "makeup",
              "art",
              "music",
              "first aid",
              "fashion",
              "communication",
            ],
            grandpa: [
              "Buckminster Fuller",
              "physics",
              "math",
              "quantum entanglement",
              "cars",
              "woodworking",
              "coding",
              "DIY",
              "3D printing",
              "communication",
            ],
          };
          const t = TRAITS[persona];
          if (!t || t.length === 0) {
            return null;
          }
          return (
            <p
              className="text-xs text-neon-blue mt-1 text-center"
              data-testid="persona-traits"
            >
              Expert in: {t.join(", ")}
            </p>
          );
        })()}
      </div>
      <div className="w-full max-w-md mx-auto">
        <div className="relative flex flex-col gap-4 items-center">
          <input
            id="grandma-input"
            data-testid="grandma-input"
            data-workshop-testid="grandma-input"
            aria-label={`Ask ${displayName} input`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              persona === "grandpa"
                ? "What's the right frequency, chief?"
                : "What's overwhelming you, honey?"
            }
            className="input-neon w-full text-lg font-neon placeholder-neon-pink animate-neon px-5 py-3 rounded-xl mb-2"
          />
          <button
            data-testid="grandma-ask-button"
            data-workshop-testid="grandma-ask-button"
            aria-label={`Ask ${displayName}`}
            className="btn-neon px-6 py-2 text-lg font-bold animate-neon rounded-xl mt-2"
            onClick={handleAsk}
            disabled={loading}
          >
            {loading
              ? "TRANSMITTING..."
              : persona === "grandpa"
                ? "TUNE IN"
                : "ASK"}
          </button>
          {/* Grandpa Mode: Quick Tip Button */}
          {persona === "grandpa" && (
            <button
              className="btn-neon px-5 py-2 text-base animate-glow rounded-xl mt-2"
              onClick={() =>
                handleQuickTip("What's the right frequency, chief?")
              }
            >
              Grandpa's Favorite Tip
            </button>
          )}
        </div>
        {piiWarning && (
          <p className="mt-3 text-xs text-neon-orange font-neon animate-neon text-center">
            {piiWarning}
          </p>
        )}
        {responseText && (
          <div
            ref={responseRef}
            className="mt-8 p-8 rounded-2xl bg-neon-purple/20 border-neon-purple shadow-neon animate-glow flex flex-col items-center"
            data-testid="grandma-output"
          >
            {/* Frequency Wave Animation for Grandpa Mode */}
            {persona === "grandpa" && (
              <svg
                width="140"
                height="40"
                viewBox="0 0 140 40"
                className="mb-6 animate-neon"
                aria-label="Frequency Wave"
              >
                <polyline
                  points="0,20 10,10 20,30 30,10 40,30 50,10 60,30 70,10 80,30 90,10 100,30 110,10 120,20 130,10 140,20"
                  fill="none"
                  stroke="#39ff14"
                  strokeWidth="3"
                />
              </svg>
            )}
            <p className="whitespace-pre-wrap text-neon-yellow font-neon text-xl animate-neon text-center">
              {responseText}
            </p>
            <div className="flex gap-4 mt-6">
              <button
                className="btn-neon text-xs px-4 py-2 rounded-xl"
                onClick={handleCopy}
              >
                COPY
              </button>
              <button
                className="btn-neon text-xs px-4 py-2 bg-neon-pink hover:bg-neon-green rounded-xl"
                onClick={() => alert("Save to SOP (TODO)")}
              >
                SAVE
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GrandmaHelper;
