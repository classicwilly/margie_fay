import { useState } from "react";
import useDecisionParalysis from "../../hooks/useDecisionParalysis";
import { motion } from "framer-motion";
import { useOscilloscope } from "@contexts/OscilloscopeContext";
import {
  getGrandmaAdvice,
  getGrandpaAdvice,
  getBobAdvice,
  getMargeAdvice,
  getAdvice,
} from "../services/geminiService";
import { sanitizePrompt } from "../utils/sanitizePrompt";
import AIConsentModal from "./AIConsentModal";
import { generateContent } from "../services/geminiService";
// Lucide icons removed - unused in this component

// --- Persona Data (Matching Context Keys) ---
const PERSONA_UI = {
  grandma: {
    key: "grandma",
    icon: "👵",
    helper: getGrandmaAdvice,
    color: "text-accent-pink",
    role: "Structural Fix",
    traits: [
      "plants",
      "cooking",
      "emotional-support",
      "housekeeping",
      "makeup",
      "art",
      "music",
      "first-aid",
      "fashion",
      "communication",
    ],
  },
  grandpa: {
    key: "grandpa",
    icon: "🛠️",
    helper: getGrandpaAdvice,
    color: "text-accent-teal",
    role: "Systems Integrity",
    traits: [
      "buckminster-fuller",
      "physics",
      "math",
      "quantum-entanglement",
      "cars",
      "woodworking",
      "coding",
      "diy",
      "3d-printing",
      "communication",
    ],
  },
  bob: {
    key: "bob",
    icon: "⚡️",
    helper: getBobAdvice,
    color: "text-yellow-400",
    role: "Kinetic Coach",
  },
  marge: {
    key: "marge",
    icon: "💖",
    helper: getMargeAdvice,
    color: "text-purple-400",
    role: "Empathetic Planner",
  },
  random: {
    key: "random",
    icon: "🎲",
    helper: (q: string) => getAdvice("random", q),
    color: "text-accent-yellow",
    role: "Surprise Me",
  },
  calm_guide: {
    key: "calm_guide",
    icon: "🧭",
    helper: (q: string) => getAdvice("calm_guide", q),
    color: "text-accent-blue",
    role: "Fallback Guide",
  },
};

export const GrandmaHelper: React.FC = () => {
  // II. ARCHITECTURAL MANDATES: Unify Context
  const { state, dispatch, getPersonaName, getPersonaRole } = useOscilloscope();
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [redactedWarning, setRedactedWarning] = useState(false);
  const [consentModalOpen, setConsentModalOpen] = useState(false);
  const [dontShowConsentAgain, setDontShowConsentAgain] = useState(false);

  const activePersona = PERSONA_UI[state.activePersona];

  const handleAsk = async (userQuery: string) => {
    if (isLoading || userQuery.trim() === "") {
      return;
    }

    setIsLoading(true);
    setResponse("");
    setRedactedWarning(false);

    // III. FILE-SPECIFIC CLEANUP: PII Sanitization
    const { cleanedQuery, redacted } = sanitizePrompt(userQuery);
    if (redacted) {
      setRedactedWarning(true);
      // Consent flow: if the user hasn't opted to skip the consent modal, show it
      if (!dontShowConsentAgain) {
        setConsentModalOpen(true);
        setIsLoading(false);
        return;
      }
    }

    try {
      // Use the helper function associated with the active persona
      // Ensure we handle direct calls or generic `getAdvice`
      const advice =
        typeof activePersona.helper === "function"
          ? await activePersona.helper(cleanedQuery)
          : await getAdvice(state.activePersona as any, cleanedQuery);
      setResponse(advice);
    } catch (error) {
      console.error("LLM Call Failed:", error);
      // Ensure local fallback uses the required persona ending
      setResponse(
        `Communication array offline. Please check network. ${activePersona.key === "grandma" ? "Love, Grandma." : "—" + activePersona.key + "."}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const { isIndecisive, recordEvent, reset } = useDecisionParalysis();

  const handlePersonaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    recordEvent();
    dispatch({ type: "SET_PERSONA", payload: e.target.value as "grandma" });
  };

  const handleQuickAction = () => {
    const quickQuery = "I feel stuck and overwhelmed, what is my first step?";
    setQuery(quickQuery);
    handleAsk(quickQuery);
  };

  const acceptCalmGuide = async () => {
    reset();
    setIsLoading(true);
    setResponse("");
    const safeQ = sanitizePrompt(query || "I can't decide").cleanedQuery;
    const advice = await getAdvice("calm_guide", safeQ);
    setResponse(advice);
    setIsLoading(false);
  };

  const handleConfirmConsent = async () => {
    setConsentModalOpen(false);
    setIsLoading(true);
    setResponse("");
    const safeQ = sanitizePrompt(query || "I can't decide").cleanedQuery;
    try {
      const advice = await generateContent({
        prompt: safeQ,
        personaKey: state.activePersona as any,
        allowPII: true,
      } as any);
      setResponse(advice);
    } catch (err) {
      console.error("consent ask failed", err);
      setResponse("Sorry  — Grandma couldn't be reached.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelConsent = () => {
    setConsentModalOpen(false);
    // We'll keep redacted warning on and not send the request
  };

  return (
    <motion.div
      className="card-base p-6 space-y-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* HEADER & AVATAR (Dynamic Persona Display) */}
      <div className="flex items-center gap-4">
        <div
          className={`text-4xl ${activePersona.color}`}
          data-testid="persona-avatar"
        >
          {activePersona.icon}
        </div>
        <div className="flex-1">
          <h3
            className={`text-xl font-bold uppercase ${activePersona.color}`}
            data-testid="persona-display-name"
          >
            ASK {getPersonaName(state.activePersona)}
          </h3>
          <p className="text-text-muted text-xs">
            {getPersonaRole(state.activePersona)} ({activePersona.key})
          </p>
          {"traits" in activePersona &&
            Array.isArray(activePersona.traits) &&
            activePersona.traits.length > 0 && (
              <p
                className="text-text-muted text-xs mt-1"
                data-testid="persona-traits"
              >
                Expert in: {activePersona.traits.join(", ").replace(/-/g, " ")}
              </p>
            )}
        </div>

        {/* Persona Selector */}
        <select
          value={state.activePersona}
          onChange={handlePersonaChange}
          className="input-base text-sm py-1"
          aria-label="AI persona"
          data-testid="persona-select"
          disabled={isLoading}
        >
          {Object.entries(PERSONA_UI).map(([key]) => (
            <option key={key} value={key}>
              {getPersonaName(key)}
            </option>
          ))}
        </select>
      </div>

      {/* INPUT AREA */}
      <div className="flex gap-2 relative">
        <input
          type="text"
          placeholder={`What's overwhelming you, ${activePersona.key}?`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAsk(query);
            }
          }}
          className="input-base flex-1"
          data-testid="grandma-input"
          data-workshop-testid="grandma-input"
          disabled={isLoading}
        />
        <button
          onClick={() => handleAsk(query)}
          className={`btn-primary ${isLoading ? "opacity-50" : ""}`}
          data-testid="grandma-ask-button"
          data-workshop-testid="grandma-ask-button"
          disabled={isLoading}
        >
          {isLoading ? "TRANSMITTING..." : "ASK"}
        </button>
      </div>

      {/* Quick Action Button (Lemon CTA) - Now uses the FAB utility class */}
      <motion.div
        className="fab p-2 text-lg absolute bottom-0 right-0 transform translate-x-1/2 translate-y-1/2"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <button
          onClick={handleQuickAction}
          className="w-full h-full bg-transparent border-none text-white focus:outline-none"
          title="Quick Stuck Action"
          data-testid="quick-stuck-action"
          data-workshop-testid="quick-stuck-action"
        >
          🍋
        </button>
      </motion.div>

      {/* RESPONSE AREA */}
      {isIndecisive && (
        <div
          className="card-inner border-accent-yellow/40 p-3 rounded-md mt-2 flex items-center gap-3"
          data-testid="calm-guide-banner"
        >
          <div className="text-xl">🧭</div>
          <div className="flex-1">
            <div className="text-xs font-semibold">
              Calm Guide thinks you might be stuck.
            </div>
            <div className="text-sm">
              Would you like a single simple suggestion to move forward?
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={acceptCalmGuide}
              className="btn-compact btn-primary"
              data-testid="calm-guide-accept"
            >
              Yes, pick for me
            </button>
            <button
              onClick={reset}
              className="btn-compact btn-ghost"
              data-testid="calm-guide-more"
            >
              More options
            </button>
          </div>
        </div>
      )}
      {response && (
        <motion.div
          className="card-inner mt-4 border-accent-teal/50"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          data-testid="grandma-output"
          data-workshop-testid="grandma-output"
        >
          {redactedWarning && (
            <p className="text-accent-pink text-xs mb-2">
              ⚠️ PII detected and sanitized before transmission.
            </p>
          )}
          <p className="text-text-light whitespace-pre-wrap">{response}</p>
        </motion.div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="text-center py-2 text-accent-teal">
          Calculating Trajectory...
        </div>
      )}
      {consentModalOpen && (
        <AIConsentModal
          onConfirm={handleConfirmConsent}
          onCancel={handleCancelConsent}
          dontShowAgain={dontShowConsentAgain}
          setDontShowAgain={setDontShowConsentAgain}
        />
      )}
    </motion.div>
  );
};
