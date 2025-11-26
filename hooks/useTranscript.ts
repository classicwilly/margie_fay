import { useState, useRef, useCallback } from "react";
import { generateId } from "@utils/generateId";

interface TranscriptEntry {
  id: string;
  type: "user" | "ai" | string;
  content: string;
  [key: string]: any;
}

export function useTranscript() {
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [userStreamingText, setUserStreamingText] = useState("");
  const [aiStreamingText, setAiStreamingText] = useState("");

  const currentInputTranscriptionRef = useRef("");
  const currentOutputTranscriptionRef = useRef("");

  const addEntry = useCallback(
    (entry: { type: string; content?: string; [key: string]: any }) => {
      const newEntry = {
        ...entry,
        id: `${entry.type}-${generateId()}`,
        content: entry.content ?? "",
      };
      setTranscript((prev) => [...prev, newEntry]);
      return newEntry.id;
    },
    [],
  );

  const updateEntry = useCallback((id: string, newContent: string) => {
    setTranscript((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, content: newContent } : entry,
      ),
    );
  }, []);

  const handleStreamingMessage = useCallback((message: any) => {
    if (message.serverContent?.inputTranscription) {
      currentInputTranscriptionRef.current +=
        message.serverContent.inputTranscription.text;
      setUserStreamingText(currentInputTranscriptionRef.current);
    }
    if (message.serverContent?.outputTranscription) {
      currentOutputTranscriptionRef.current +=
        message.serverContent.outputTranscription.text;
      setAiStreamingText(currentOutputTranscriptionRef.current);
    }

    if (message.serverContent?.turnComplete) {
      const finalUserInput = currentInputTranscriptionRef.current.trim();
      const finalAiOutput = currentOutputTranscriptionRef.current.trim();

      if (finalUserInput || finalAiOutput) {
        const newEntries: TranscriptEntry[] = [];
        if (finalUserInput) {
          newEntries.push({
            id: `user-${generateId()}`,
            type: "user",
            content: finalUserInput,
          });
        }
        if (finalAiOutput) {
          newEntries.push({
            id: `ai-${generateId()}`,
            type: "ai",
            content: finalAiOutput,
          });
        }
        if (newEntries.length > 0) {
          setTranscript((prev) => [...prev, ...newEntries]);
        }
      }

      currentInputTranscriptionRef.current = "";
      currentOutputTranscriptionRef.current = "";
      setUserStreamingText("");
      setAiStreamingText("");
    }
  }, []);

  const clearStreamingText = useCallback(() => {
    currentOutputTranscriptionRef.current = "";
    setAiStreamingText("");
  }, []);

  return {
    transcript,
    userStreamingText,
    aiStreamingText,
    addEntry,
    updateEntry,
    handleStreamingMessage,
    clearStreamingText,
  };
}
