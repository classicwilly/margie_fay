import React, { useState } from "react";
import { motion } from "framer-motion";
import { useOscilloscope } from "@contexts/OscilloscopeContext";
import {
  getGrandmaAdvice,
  getGrandpaAdvice,
  getBobAdvice,
  getMargeAdvice,
} from "../services/geminiService";
import { sanitizePrompt } from "../utils/sanitizePrompt";
import { Briefcase, Gavel, Hammer, Heart } from "lucide-react"; // Example Lucide icons

// --- Persona Data (Matching Context Keys) ---
const PERSONA_UI = {
  grandma: {
    key: "grandma",
    icon: "👵",
    helper: getGrandmaAdvice,
    color: "text-accent-pink",
    role: "Structural Fix",
  },
  grandpa: {
    key: "grandpa",
    icon: "🛠️",
    helper: getGrandpaAdvice,
    color: "text-accent-teal",
    role: "Systems Integrity",
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
};

export const GrandmaHelper: React.FC = () => {
  // II. ARCHITECTURAL MANDATES: Unify Context
  const { state, dispatch, getPersonaName, getPersonaRole } = useOscilloscope();
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [redactedWarning, setRedactedWarning] = useState(false);

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
    }

    try {
      // Use the helper function associated with the active persona
      const advice = await activePersona.helper(cleanedQuery);
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

  const handlePersonaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: "SET_PERSONA", payload: e.target.value as "grandma" });
  };

  const handleQuickAction = () => {
    const quickQuery = "I feel stuck and overwhelmed, what is my first step?";
    setQuery(quickQuery);
    handleAsk(quickQuery);
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
        </div>

        {/* Persona Selector */}
        <select
          value={state.activePersona}
          onChange={handlePersonaChange}
          className="input-base text-sm py-1"
          aria-label="AI persona selector"
          data-testid="persona-select"
          disabled={isLoading}
        >
          {Object.entries(PERSONA_UI).map(([key, persona]) => (
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
    </motion.div>
  );
};
