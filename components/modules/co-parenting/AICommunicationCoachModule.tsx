import React, { useState, useEffect } from "react";
import useSafeAI from "../../../hooks/useSafeAI";
import ContentCard from "../../ContentCard"; // Adjusted path
import { SecureMarkdown } from "../../../utils/secureMarkdownRenderer";
import { useAIPromptSafety } from "../../../hooks/useAIPromptSafety";
import AIConsentModal from "@components/AIConsentModal";
import PIIWarningModal from "@components/PIIWarningModal";

const AICommunicationCoachModule = () => {
  const [mode, setMode] = useState("translate");

  const [originalText, setOriginalText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [incomingText, setIncomingText] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState("");
  const [draftedReply, setDraftedReply] = useState("");

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

  useEffect(() => {
    setError("");
    setAnalysisError("");
  }, [mode, originalText, incomingText]);

  const handleTranslate = async () => {
    if (!originalText.trim()) {
      setError(
        "Input message cannot be empty. Define the communication objective.",
      );
      return;
    }
    setLoading(true);
    setError("");
    setTranslatedText("");

    const systemInstruction = `You are an expert communication coach specializing in translating direct, neurodivergent communication styles (like Autism/ADHD) into language that is clear, collaborative, and less likely to be misinterpreted by a neurotypical co-parent. Your goal is to preserve the core facts and intent of the message while rephrasing it to be constructive and low-conflict.

    **Core Directives:**
    1.  **Preserve Facts:** The essential information (who, what, where, when, why) must remain unchanged.
    2.  **Remove Bluntness:** Replace declarative, demand-like statements with collaborative suggestions or questions.
    3.  **Add 'I' Statements:** Reframe accusations or frustrations into statements about personal feelings or observations (e.g., "You're always late" becomes "I feel stressed when pickup times are missed because it disrupts our evening schedule.").
    4.  **Inject Collaboration:** Use phrases like "How can we work together on this?", "What are your thoughts on...?", or "Would it be possible to...".
    5.  **Assume Good Intent:** Frame the translated message as if the user and co-parent are a team solving a logistical problem for the benefit of their children.
    6.  **Keep it Concise:** Do not add excessive fluff. The goal is clarity and reduced conflict, not a corporate email.

    **Example Translation:**
    -   **Original:** "Bash's soccer cleats don't fit. You need to buy him new ones before Friday's game."
    -   **Translated:** "Hey, I noticed Bash's soccer cleats seem too small for him. With the game on Friday, could we coordinate on getting him a new pair? Let me know what works best for you."`;

    try {
      await checkAndExecute(originalText, async (safePrompt) => {
        const { generate } = useSafeAI();
        const result = await generate(safePrompt, {
          model: "gemini-2.5-flash",
          config: { systemInstruction },
          skipPromptSafety: true,
        });
        setTranslatedText(result?.text || "");
      });
    } catch (e) {
      setError(
        `Error: ${e.message || "Failed to communicate with the AI model."}`,
      );
      console.error(e);
    }
    setLoading(false);
  };

  const handleAnalyze = async () => {
    if (!incomingText.trim()) {
      setAnalysisError("Incoming message cannot be empty.");
      return;
    }
    setAnalysisLoading(true);
    setAnalysisError("");
    setAnalysisResult("");
    setDraftedReply("");

    const systemInstruction = `You are an expert communication coach specializing in de-escalating co-parenting conflicts. You analyze incoming messages for a neurodivergent user who needs help separating emotional subtext from factual information. Your goal is to help the user understand the message without reacting emotionally, so they can reply according to their low-conflict communication protocol.

**Core Directives:**
1.  **Identify Core Facts:** Extract the essential, objective information (who, what, when, where). What is the logistical request?
2.  **Detect Potential Emotions:** Cautiously identify potential underlying emotions in the message (e.g., "The phrasing 'as usual' might suggest frustration."). Use neutral, non-judgmental language.
3.  **Filter Out 'Noise':** Identify parts of the message that are emotional, accusatory, or not constructive (e.g., sarcasm, blame).
4.  **Suggest a Focus:** Advise the user on what to focus their reply on (always the logistical, child-focused part) and what to ignore.
5.  **Draft a Neutral Reply:** Provide a pre-drafted, fact-based reply that the user can copy and paste. The reply must be BIFF (Brief, Informative, Friendly, Firm).
6.  **Output Structure:** Return a markdown-formatted string with three sections: "## Factual Core", "## Emotional Analysis", and "## Suggested Reply".
`;

    try {
      await checkAndExecute(incomingText, async (safePrompt) => {
        const { generate } = useSafeAI();
        const result = await generate(safePrompt, {
          model: "gemini-2.5-flash",
          config: { systemInstruction },
          skipPromptSafety: true,
        });
        setAnalysisResult(result?.text || "");
      });
    } catch (e) {
      setAnalysisError(
        `Error: ${e.message || "Failed to communicate with the AI model."}`,
      );
      console.error(e);
    }
    setAnalysisLoading(false);
  };

  // FIX: Added default export to the component.
};
export default AICommunicationCoachModule;
