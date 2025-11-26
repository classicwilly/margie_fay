import React, { useState } from "react";
import { useAppState } from "@contexts/AppStateContext";
import ContentCard from "../ContentCard.js";
import useSafeAI from "../../hooks/useSafeAI";
import { SecureMarkdown } from "../../utils/secureMarkdownRenderer.js";
import { useAIPromptSafety } from "../../hooks/useAIPromptSafety.js";
import AIConsentModal from "@components/AIConsentModal";
import PIIWarningModal from "@components/PIIWarningModal";

const AIFinancialAnalysis = () => {
  const { appState } = useAppState();
  const { expenses, financialBudgets } = appState;
  const [analysis, setAnalysis] = useState("");
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
    const now = new Date();
    const currentMonthExpenses = expenses
      .filter(
        (exp) =>
          new Date(exp.date).getMonth() === now.getMonth() &&
          new Date(exp.date).getFullYear() === now.getFullYear(),
      )
      .map(
        (exp) =>
          `- $${exp.amount.toFixed(2)} on ${exp.description} (${exp.category}) on ${new Date(exp.date).toLocaleDateString()}`,
      )
      .join("\n");

    const budgets = Object.entries(financialBudgets)
      // FIX: Cast amount to number to allow toFixed call.
      .map(([cat, amount]) => `- ${cat}: $${Number(amount).toFixed(2)}`)
      .join("\n");

    return `
            You are a financial analyst AI for a neurodivergent user's personal operating system. Your task is to analyze their spending for the current month and provide concise, actionable insights. Avoid generic advice.

            **Core Directives:**
            1.  **Identify Key Patterns:** Find the top 3 spending categories. Note any significant spending spikes on specific days.
            2.  **Budget vs. Actuals:** Compare spending in each category to its budget. Highlight any categories that are over or close to their budget.
            3.  **Actionable Insights:** Frame your findings as neutral observations or questions for the user to consider. For example, "Spending on 'Personal' is 50% higher than last month. Was this planned?"
            4.  **Output Structure:** Provide your analysis in a clear markdown format with these exact headings: "## Spending Overview", "## Budget Compliance", and "## Key Observations".

            **Provided Data for Current Month:**

            **Budgets:**
            ${budgets || "No budgets set."}

            **Expenses:**
            ${currentMonthExpenses || "No expenses logged."}

            Now, generate the financial analysis. If data is insufficient, state that clearly.
        `;
  };

  const { generate } = useSafeAI();

  const handleAnalysis = async (safePrompt?: string) => {
    setLoading(true);
    setError("");
    setAnalysis("");
    const prompt = generatePrompt();
    try {
      const result = await generate(safePrompt ?? prompt, {
        model: "gemini-2.5-flash",
        timeoutMs: 20000,
        skipPromptSafety: true,
      });
      setAnalysis(
        result?.text || (result?.json ? JSON.stringify(result.json) : ""),
      );
    } catch (e) {
      setError(`Analysis failed: ${e.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const triggerAnalysis = () => {
    checkAndExecute(generatePrompt(), handleAnalysis);
  };

  return (
    <ContentCard title="🤖 AI Financial Analyst">
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
      <p className="text-text-light text-opacity-80 mb-4">
        Let the AI analyze your current month's spending to identify patterns,
        check budget compliance, and surface key observations.
      </p>
      <button
        onClick={triggerAnalysis}
        disabled={loading}
        className="w-full px-6 py-2 bg-accent-blue text-background-dark font-bold rounded hover:bg-blue-400 disabled:bg-gray-600"
      >
        {loading ? "Analyzing..." : "✨ Run Financial Analysis"}
      </button>

      <div className="mt-4 grow p-3 bg-gray-800 rounded-md min-h-[150px] border border-gray-700 overflow-y-auto">
        {loading && (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-blue"></div>
            <p className="ml-3">Analyzing finances...</p>
          </div>
        )}
        {error && <div className="text-red-400 p-4">{error}</div>}
        {analysis && (
          <div className="prose prose-invert prose-sm max-w-none">
            <SecureMarkdown content={analysis} />
          </div>
        )}
        {!loading && !error && !analysis && (
          <p className="text-center text-text-light text-opacity-80 p-4">
            Run analysis to see financial insights.
          </p>
        )}
      </div>
    </ContentCard>
  );
};

export default AIFinancialAnalysis;
