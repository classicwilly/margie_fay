import React, { useState, useMemo } from "react";
import { Type } from "@google/genai";
import useSafeAI from "../../../../hooks/useSafeAI";
import { useAppState } from "@contexts/AppStateContext";
import { useAIPromptSafety } from "../../../../hooks/useAIPromptSafety.js";
import AIConsentModal from "@components/AIConsentModal";
import PIIWarningModal from "@components/PIIWarningModal";

const toYMD = (date) => date.toISOString().split("T")[0];

const CriticalTasks = () => {
  const { appState, dispatch } = useAppState();
  const { statusMood, statusEnergy, calendarEvents, tasks } = appState;
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

  const todayStr = useMemo(() => toYMD(new Date()), []);

  const criticalTasks = useMemo(() => {
    return tasks
      .filter(
        (task) =>
          task.status === "todo" &&
          task.dueDate === todayStr &&
          task.priority === "High",
      )
      .slice(0, 3);
  }, [tasks, todayStr]);

  const generatePrompt = () => {
    const todaysEvents = calendarEvents
      .filter((event) => toYMD(new Date(event.date)) === todayStr)
      .map((event) => event.title);

    return `
            Current status:
            - Mood: ${statusMood || "Not set"}
            - Energy: ${statusEnergy || "Not set"}
            - Today's Calendar Events: ${todaysEvents.length > 0 ? todaysEvents.join(", ") : "None"}

            Based on this, generate the top 3 critical, actionable, and achievable tasks for today.
        `;
  };

  const { generate } = useSafeAI();

  const handleGenerate = async (safePrompt?: string) => {
    setLoading(true);
    setError("");

    const prompt = generatePrompt();

    try {
      const result = await generate(safePrompt ?? prompt, {
        model: "gemini-2.5-flash",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tasks: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
        },
        timeoutMs: 20000,
        skipPromptSafety: true,
      });

      const jsonResponse =
        result?.json ?? (result?.text ? JSON.parse(result.text) : null);
      if (jsonResponse.tasks && Array.isArray(jsonResponse.tasks)) {
        const tasksToDelete = tasks
          .filter(
            (task) =>
              task.dueDate === todayStr &&
              task.priority === "High" &&
              task.status === "todo",
          )
          .map((task) => task.id);

        tasksToDelete.forEach((id) => {
          dispatch({ type: "DELETE_TASK", payload: id });
        });

        jsonResponse.tasks.slice(0, 3).forEach((taskTitle) => {
          dispatch({
            type: "ADD_TASK",
            payload: { title: taskTitle, priority: "High", dueDate: todayStr },
          });
        });
      } else {
        throw new Error("Invalid response format from AI.");
      }
    } catch (e) {
      setError(
        `Error generating tasks: ${e.message || "Failed to communicate with the model."}`,
      );
      console.error(e);
    }
    setLoading(false);
  };

  const triggerGeneration = () => {
    const prompt = generatePrompt();
    checkAndExecute(prompt, handleGenerate);
  };

  const handleToggleComplete = (task) => {
    dispatch({ type: "UPDATE_TASK", payload: { id: task.id, status: "done" } });
  };

  const TaskSlot = ({ task, index }) => {
    if (!task) {
      return (
        <div className="p-3 text-gray-500 italic">
          Objective {index + 1} not set...
        </div>
      );
    }
    return (
      <div className="flex items-center gap-3 p-2 bg-gray-900/50 rounded-md">
        <input
          type="checkbox"
          checked={false}
          onChange={() => handleToggleComplete(task)}
          className="h-5 w-5 rounded bg-gray-700 border-gray-600 text-accent-blue focus:ring-accent-blue"
          aria-label={`Complete task: ${task.title}`}
        />
        <span className="flex-grow">{task.title}</span>
      </div>
    );
  };

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
        <span>🎯 Critical Tasks</span>
      </summary>
      <div className="mt-2 pt-2 border-t border-gray-700 space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400 italic">
            Showing High-priority tasks for today from the Task Matrix.
          </p>
          <button
            onClick={(e) => {
              e.preventDefault();
              triggerGeneration();
            }}
            disabled={loading}
            aria-label="Ask AI to generate critical tasks"
            className="px-3 py-1 text-xs bg-accent-blue text-background-dark font-semibold rounded-md hover:bg-blue-400 disabled:bg-gray-600"
          >
            {loading ? "..." : "✨ Ask AI for Tasks"}
          </button>
        </div>
        {error && (
          <div className="text-red-400 text-xs p-2 bg-red-900/30 rounded-md">
            {error}
          </div>
        )}
        {/* moved the explanatory text above */}
        <TaskSlot task={criticalTasks[0]} index={0} />
        <TaskSlot task={criticalTasks[1]} index={1} />
        <TaskSlot task={criticalTasks[2]} index={2} />
        <button
          onClick={() =>
            document
              .getElementById("module-task-matrix-module")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="text-xs text-accent-blue hover:underline mt-2 w-full text-right"
        >
          Manage all tasks in Matrix &rarr;
        </button>
      </div>
    </details>
  );
};

export default CriticalTasks;
