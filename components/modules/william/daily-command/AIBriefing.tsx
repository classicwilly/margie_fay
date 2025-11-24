import React, { useState, useEffect } from "react";
import useSafeAI from "../../../../hooks/useSafeAI";
import { useAppState } from "@contexts/AppStateContext";
import { useCurrentMode } from "../../../../hooks/useCurrentMode.js";
import { SecureMarkdown } from "../../../../utils/secureMarkdownRenderer.js";
import { useAIPromptSafety } from "../../../../hooks/useAIPromptSafety.js";
import AIConsentModal from "@components/AIConsentModal";
import PIIWarningModal from "@components/PIIWarningModal";

const BRIEFING_CACHE_KEY = "wonky-sprout-daily-briefing";
const toYMD = (date) => date.toISOString().split("T")[0];

const AIBriefing = () => {
  const { appState } = useAppState();
  const { calendarEvents, kidsWillowLocation, kidsSebastianLocation } =
    appState;
  const currentMode = useCurrentMode();

  const [briefing, setBriefing] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const {
    checkAndExecute,
    isPiiModalOpen,
    piiMatches,
    handlePiiConfirm,
    handlePiiCancel,
    isConsentModalOpen,
    handleConfirm,
    handleCancel,
    dontShowAgain,
    setDontShowAgain,
  } = useAIPromptSafety();

  const generatePrompt = () => {
    const today = new Date();
    const todaysEvents = calendarEvents
      .filter(
        (event) => new Date(event.date).toDateString() === today.toDateString(),
      )
      .map(
        (event) =>
          `- ${event.title} at ${new Date(event.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
      );

    return `
            Generate a daily briefing for today, ${today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}.
            System Context:
            - Current Operating Mode: ${currentMode}
            - Today's Calendar Events: ${todaysEvents.length > 0 ? todaysEvents.join("\n") : "None"}
            - Willow's Location: ${kidsWillowLocation || "Not set"}
            - Sebastian's Location: ${kidsSebastianLocation || "Not set"}
            Based on this context, create a briefing with a 1-sentence summary of the day's operational focus, a bulleted list of today's priorities from the calendar, a summary of kid logistics, and a brief, general weather outlook.
        `;
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError("");

    const prompt = generatePrompt();
    const systemInstruction =
      "You are the 'Wonky Sprout OS' briefing system. Your purpose is to provide a concise, structured, and actionable daily briefing. Your tone is factual and system-oriented. Use clear markdown formatting. Do not use motivational language.";

    try {
      const { generate } = useSafeAI();
      const result = await generate(prompt, {
        model: "gemini-2.5-flash",
        timeoutMs: 20000,
        config: { systemInstruction, tools: [{ googleSearch: {} }] },
        skipPromptSafety: true,
      });
      const resultText =
        result?.text || (result?.json ? JSON.stringify(result.json) : "");
      setBriefing(resultText);

      const todayStr = toYMD(new Date());
      const cache = { date: todayStr, content: resultText };
      localStorage.setItem(BRIEFING_CACHE_KEY, JSON.stringify(cache));
    } catch (e) {
      setError(
        `Error generating briefing: ${e.message || "Failed to communicate with the model."}`,
      );
      console.error(e);
    }
    setLoading(false);
  };

  const triggerAnalysis = () => {
    const prompt = generatePrompt();
    checkAndExecute(prompt, handleGenerate);
  };

  useEffect(() => {
    const loadOrGenerateBriefing = () => {
      const todayStr = toYMD(new Date());
      const cachedData = localStorage.getItem(BRIEFING_CACHE_KEY);
      if (cachedData) {
        try {
          const parsedCache = JSON.parse(cachedData);
          if (parsedCache.date === todayStr && parsedCache.content) {
            setBriefing(parsedCache.content);
            return; // Valid cache found, do nothing more.
          }
        } catch (e) {
          console.error("Failed to parse briefing cache", e);
        }
      }
      // If we reach here, no valid cache was found. Generate a new one.
      triggerAnalysis();
    };
    loadOrGenerateBriefing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <details className="p-3 bg-gray-800 rounded-md border border-gray-700">
      {isConsentModalOpen && (
        <AIConsentModal
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          dontShowAgain={dontShowAgain}
          setDontShowAgain={setDontShowAgain}
        />
      )}
      {isPiiModalOpen && (
        <PIIWarningModal
          isOpen={isPiiModalOpen}
          onCancel={handlePiiCancel}
          onConfirm={handlePiiConfirm}
          matches={piiMatches}
        />
      )}
      <summary className="cursor-pointer font-bold text-accent-teal flex justify-between items-center">
        📄 AI Briefing
        <button
          onClick={(e) => {
            e.preventDefault();
            triggerAnalysis();
          }}
          disabled={loading}
          className="px-3 py-1 text-xs bg-accent-blue text-background-dark font-semibold rounded-md hover:bg-blue-400 disabled:bg-gray-600"
        >
          {loading ? "..." : "✨ Refresh"}
        </button>
      </summary>
      <div className="mt-2 pt-2 border-t border-gray-700">
        {loading && !briefing ? (
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent-blue"></div>
          </div>
        ) : error ? (
          <div className="text-red-400">{error}</div>
        ) : briefing ? (
          <div className="prose prose-invert prose-sm max-w-none">
            <SecureMarkdown content={briefing} />
          </div>
        ) : (
          <div className="text-center p-2 text-sm text-gray-500">
            No briefing generated for today. Click 'Refresh' to generate one.
          </div>
        )}
      </div>
    </details>
  );
};

export default AIBriefing;
