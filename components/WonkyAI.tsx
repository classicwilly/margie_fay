import { useState, type FC } from "react";
import useSafeAI from "../hooks/useSafeAI";
import ContentCard from "./ContentCard";
import SecureMarkdown from "../utils/secureMarkdownRenderer";
import { Button } from "./Button";

// Wonky AI: uses GoogleGenAI with safety wrapper and JSON schema enforcement when needed.

const WonkyAI: FC = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");

  const { generate } = useSafeAI();

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Prompt cannot be empty. Define the problem.");
      return;
    }
    setLoading(true);
    setError("");
    setResponse("");
    try {
      console.log("WonkyAI: invoking generate with prompt and opts", {
        prompt: prompt.trim(),
      });
      // Use the top-level `generate` which already uses the prompt safety wrapper
      const responseSchema = {
        type: "object",
        properties: {
          summary: { type: "string" },
          assist: { type: "string" },
        },
        required: ["summary"],
      } as const;

      const result = await generate(prompt.trim(), {
        model: "gemini-2.5-pro",
        responseMimeType: "application/json",
        responseSchema,
        timeoutMs: 20_000,
        skipPromptSafety: true,
      });

      // useSafeAI returns parsed JSON in `json` when responseMimeType is application/json
      const json = result?.json;
      const summary = json?.summary || result?.text || "No response from model";
      const assist = json?.assist || "";
      setResponse(`${summary}\n\n${assist}`.trim());
    } catch (e: any) {
      setError(
        `Error: ${e.message || "Failed to communicate with the AI model."}`,
      );
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <ContentCard title="👁️ The Observer">
      <div className="flex flex-col h-full">
        <div className="grow overflow-y-auto p-4 bg-gray-800 rounded-md min-h-[200px] max-h-[400px] border border-gray-700 mb-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-blue"></div>
              <p className="ml-3">Diagnosing...</p>
            </div>
          ) : error ? (
            <div className="text-red-400 whitespace-pre-wrap">
              <p className="font-bold mb-2">System Error:</p>
              {error}
            </div>
          ) : response ? (
            <div className="whitespace-pre-wrap prose prose-invert prose-sm max-w-none">
              <SecureMarkdown source={response} />
            </div>
          ) : (
            <p className="text-text-light text-opacity-80 text-center flex items-center justify-center h-full">
              Define a problem. The Observer will provide structure.
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && handleGenerate()}
            placeholder="Describe the chaos..."
            className="grow p-3 bg-gray-800 border border-gray-700 rounded-md text-text-light placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue"
            disabled={loading}
          />
          <Button onClick={handleGenerate} disabled={loading} variant="primary">
            {loading ? "Executing..." : "Generate"}
          </Button>
        </div>
      </div>
    </ContentCard>
  );
};

export default WonkyAI;
