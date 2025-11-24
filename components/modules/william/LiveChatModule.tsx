import React, { useRef, useEffect, useCallback } from "react";
import { LiveServerMessage, Modality } from "@google/genai";
import ContentCard from "../../ContentCard.js";
import { useAppState } from "@contexts/AppStateContext";
import { useLiveChatFunctions } from "../../../hooks/useLiveChatFunctions.js";
import { useLiveSession } from "../../../hooks/useLiveSession.js";
import { useAudioPlayback } from "../../../hooks/useAudioPlayback.js";
import { useTranscript } from "../../../hooks/useTranscript.js";

const LiveChatModule = () => {
  const { appState, dispatch } = useAppState();

  const {
    transcript,
    userStreamingText,
    aiStreamingText,
    addEntry,
    updateEntry,
    handleStreamingMessage,
    clearStreamingText,
  } = useTranscript();

  const { allTools, systemInstruction, handleToolCall } = useLiveChatFunctions(
    dispatch,
    appState,
    { addTranscriptEntry: addEntry, updateTranscriptEntry: updateEntry },
  );

  const { isSpeaking, playAudioChunk, stopPlayback } = useAudioPlayback();

  const sendToolResponseFunc = useRef((_response) => {});

  const onMessageHandler = useCallback(
    async (message) => {
      handleStreamingMessage(message);

      if (message.toolCall) {
        for (const fc of message.toolCall.functionCalls) {
          const { result } = await handleToolCall(fc);
          sendToolResponseFunc.current({
            functionResponses: {
              id: fc.id,
              name: fc.name,
              response: { result },
            },
          });
        }
      }

      const base64Audio =
        message.serverContent?.modelTurn?.parts[0]?.inlineData.data;
      if (base64Audio) {
        playAudioChunk(base64Audio);
      }

      if (message.serverContent?.interrupted) {
        stopPlayback();
        clearStreamingText();
      }
    },
    [
      handleStreamingMessage,
      handleToolCall,
      playAudioChunk,
      stopPlayback,
      clearStreamingText,
    ],
  );

  const {
    status: sessionStatus,
    error,
    userVolume,
    startSession,
    stopSession,
    sendToolResponse,
  } = useLiveSession({
    onMessage: onMessageHandler,
    config: {
      model: "gemini-2.5-flash-native-audio-preview-09-2025",
      config: {
        responseModalities: [Modality.AUDIO],
        outputAudioTranscription: {},
        inputAudioTranscription: {},
        tools: [{ functionDeclarations: allTools }],
        systemInstruction,
      },
    },
  });

  sendToolResponseFunc.current = sendToolResponse;

  const status = isSpeaking ? "speaking" : sessionStatus;
  const isSessionActive = status !== "idle" && status !== "error";

  const handleStop = useCallback(() => {
    stopPlayback();
    stopSession();
  }, [stopSession, stopPlayback]);

  return (
    <ContentCard title="🎙️ Wonky AI Live Chat">
      <div className="flex flex-col h-full min-h-[450px]">
        <p className="text-sm text-text-light text-opacity-80 mb-2">
          Start a real-time voice conversation for hands-free system control.
        </p>
        <div className="text-xs text-gray-400 mb-3 italic">
          Examples: "Add 'Finalize Q3 budget' to my tasks.", "Open the Life
          Maintenance Protocol.", "Capture this thought...", "What are my tasks
          for today?", "Synthesize my notes on project management into a new
          SOP."
        </div>

        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="rgba(52, 211, 153, 0.2)"
              strokeWidth="2"
              fill="none"
            />
            {status === "speaking" && (
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="#1abc9c"
                strokeWidth="3"
                fill="none"
                className="animate-pulse"
              />
            )}
            {status === "connecting" && (
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="#58a6ff"
                strokeWidth="2"
                fill="none"
                className="animate-pulse-slow"
              />
            )}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#58a6ff"
              strokeWidth="3"
              fill="none"
              strokeDasharray={283}
              strokeDashoffset={283 * (1 - Math.min(1, userVolume * 2))}
              opacity={status === "listening" ? 1 : 0}
              className="dash-circle"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-3xl">
            {status === "speaking" ? "🌱" : "🎤"}
          </div>
        </div>

        <div className="text-center text-sm font-semibold mb-3 capitalize text-accent-teal">
          {status}
        </div>

        <div className="flex-grow overflow-y-auto p-3 bg-gray-800 rounded-md border border-gray-700 mb-4 space-y-4">
          {transcript.map((entry) => (
            <div
              key={entry.id}
              className={`flex items-end gap-2 ${entry.type === "user" ? "justify-end" : "justify-start"} ${entry.type === "system" ? "justify-center" : ""}`}
            >
              {entry.type === "ai" && (
                <div className="flex-shrink-0 text-2xl w-8 h-8 flex items-center justify-center bg-card-dark rounded-full">
                  🌱
                </div>
              )}
              <div
                className={`max-w-[80%] p-3 rounded-xl ${entry.type === "user" ? "bg-accent-blue text-background-dark rounded-br-none" : entry.type === "system" ? "bg-gray-700/50 text-text-light text-sm w-full" : "bg-gray-700 text-text-light rounded-bl-none"}`}
              >
                <div className="text-sm break-words">{entry.content}</div>
              </div>
              {entry.type === "user" && (
                <div className="flex-shrink-0 text-2xl w-8 h-8 flex items-center justify-center bg-card-dark rounded-full">
                  👤
                </div>
              )}
            </div>
          ))}
          {userStreamingText && (
            <div className="flex items-end gap-2 justify-end">
              <div className="max-w-[80%] p-3 rounded-xl bg-accent-blue text-background-dark rounded-br-none opacity-75">
                <div className="text-sm break-words">{userStreamingText}</div>
              </div>
              <div className="flex-shrink-0 text-2xl w-8 h-8 flex items-center justify-center bg-card-dark rounded-full">
                👤
              </div>
            </div>
          )}
          {aiStreamingText && (
            <div className="flex items-end gap-2 justify-start">
              <div className="flex-shrink-0 text-2xl w-8 h-8 flex items-center justify-center bg-card-dark rounded-full">
                🌱
              </div>
              <div className="max-w-[80%] p-3 rounded-xl bg-gray-700 text-text-light rounded-bl-none opacity-75">
                <div className="text-sm break-words blinking-cursor">
                  {aiStreamingText}
                </div>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="text-red-400 text-sm mb-3 p-2 bg-red-900/30 rounded-md">
            {error}
          </div>
        )}

        <button
          onClick={isSessionActive ? handleStop : startSession}
          className={`w-full p-4 font-bold rounded-md transition-colors text-lg ${isSessionActive ? "bg-red-700 text-white hover:bg-red-600" : "bg-accent-green text-background-dark hover:bg-green-500"}`}
        >
          {isSessionActive ? "Stop Session" : "Start Live Chat"}
        </button>
      </div>
    </ContentCard>
  );
};

export default LiveChatModule;
