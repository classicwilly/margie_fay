// @ts-nocheck
import React, { useCallback, useMemo } from "react";
import { Type } from "@google/genai";

import {
  SOP_DATA,
  ALL_WILLIAM_MODULES_CONFIG,
  ALL_GEMS,
} from "../constants.js";
import { allTools } from "./toolDeclarations.js";

export function useLiveChatFunctions(dispatch, appState, updaters) {
  const {
    userSops,
    habitTracker,
    williamDashboardModules,
    brainDumpText,
    knowledgeVaultEntries,
    expenses,
    activeSops,
    tasks,
  } = appState;

  const dispatchUserAction = (action) => dispatch(action);

  const systemInstruction = useMemo(() => {
    const allSopNames = [...SOP_DATA, ...(userSops || [])].map((s) => s.title);
    const allHabitNames = (habitTracker.habits || []).map((h) => h.name);
    const allModuleNames = ALL_WILLIAM_MODULES_CONFIG.filter(
      (m) => m.isRemovable,
    ).map((m) => m.name);

    return `You are "Wonky AI," a voice assistant for a neurodivergent systems diagnostician named William. Your core philosophy is "Structure Engineered for Chaos." You are a direct, unambiguous, and system-oriented controller. Your responses are concise and confirm actions taken. You can control the OS via function calls.
            
    Available SOPs: ${allSopNames.join(", ")}.
    Available Habits: ${allHabitNames.join(", ")}.
    Available Dashboard Modules: ${allModuleNames.join(", ")}.
    
    You can also navigate the app by saying "Open the Flight Protocol Vault", "Show me the Life Maintenance Protocol", etc.
    You can create quests for the children, for example: "Create a quest for both kids to clean the living room. Steps are pick up toys, dust tables, vacuum. Reward is a gold quest gem."
    When a user asks a question about their day, tasks, or knowledge, use the getSystemState function to get the full context, then answer naturally.
    When a user asks to synthesize an SOP from their knowledge, you MUST first call the 'findKnowledgeForSop' function with the relevant topic. Then inform the user that you have found the entries and they can proceed in the chat.
    To initiate the end-of-day shutdown, use the 'shutdownAndPlan' function. Capture the user's final brain dump and their critical tasks for tomorrow in a single call.
    You can complete tasks by name. You can list tasks for today or in the inbox. You can add new habits. You can set financial budgets. You can delete quests. You can manually award gems to the children.`;
  }, [userSops, habitTracker.habits]);

  const handleSynthesizeSop = useCallback(
    async (topic, entries, cardId) => {
      updaters.updateTranscriptEntry(
        cardId,
        React.createElement(
          "div",
          { className: "animate-pulse-slow font-bold" },
          "Synthesizing SOP from knowledge entries...",
        ),
      );

      const synthesisPrompt = `
            Analyze the following knowledge entries on the topic "${topic}" and synthesize them into a new Standard Operating Procedure (SOP).
            The SOP should have a title, description, a numbered list of steps, and optional cues.

            Knowledge Entries:
            ${entries.map((e) => `### ${e.title}\n${e.content}`).join("\n\n")}
        `;

      try {
        const { generate } = useSafeAI();
        const response = await generate(synthesisPrompt, {
          model: "gemini-2.5-flash",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              steps: { type: Type.ARRAY, items: { type: Type.STRING } },
              cues: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
          },
          timeoutMs: 20000,
        });

        const draft =
          response.json || (response.text ? JSON.parse(response.text) : null);

        const handleApplyDraft = () => {
          dispatchUserAction({
            type: "SET_GENERATED_SOP_DRAFT",
            payload: draft,
          });
          dispatchUserAction({ type: "SET_VIEW", payload: "create-sop" });
        };

        const resultCard = React.createElement(
          "div",
          null,
          React.createElement(
            "h4",
            { className: "font-bold text-accent-green mb-2" },
            "SOP Draft Synthesized:",
          ),
          React.createElement("p", { className: "font-bold" }, draft.title),
          React.createElement(
            "p",
            { className: "text-xs italic mb-2" },
            draft.description,
          ),
          React.createElement(
            "button",
            {
              onClick: handleApplyDraft,
              className:
                "mt-2 w-full p-2 bg-accent-green text-background-dark font-bold rounded",
            },
            "Send to Editor",
          ),
        );
        updaters.updateTranscriptEntry(cardId, resultCard);
      } catch (e) {
        updaters.updateTranscriptEntry(
          cardId,
          React.createElement(
            "div",
            { className: "text-red-400 font-bold" },
            "Error during synthesis.",
          ),
        );
        console.error(e);
      }
    },
    [dispatchUserAction, updaters],
  );

  const toolHandlers = useMemo(() => {
    // FIX: Explicitly typed staticViewMap to ensure values are of type ViewType.
    const staticViewMap: Record<string, string> = {
      "sop vault": "sop-vault",
      "flight protocol vault": "sop-vault",
      "weekly review": "weekly-review",
      "all checklists": "all-checklists",
      "my dashboard": "williams-dashboard",
      "game master hub": "game-master-dashboard",
      "system insights": "system-insights",
    };

    return {
      addTask: async (args) => {
        const { taskDescription } = args;
        dispatchUserAction({
          type: "ADD_TASK",
          payload: {
            title: taskDescription,
            priority: "Medium",
            dueDate: null,
          },
        });
        updaters.addTranscriptEntry({
          type: "system",
          content: React.createElement(
            React.Fragment,
            null,
            React.createElement("b", null, "Task Added to Matrix:"),
            " ",
            taskDescription,
          ),
        });
        return { result: "ok" };
      },
      addQuest: async (args) => {
        const stepsArray = args.steps
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        if (stepsArray.length === 0) {
          return {
            result: "Quest creation failed. At least one step is required.",
          };
        }
        const questPayload = { ...args, steps: stepsArray };
        dispatchUserAction({ type: "ADD_QUEST", payload: questPayload });
        updaters.addTranscriptEntry({
          type: "system",
          content: React.createElement(
            React.Fragment,
            null,
            React.createElement("b", null, "Quest Created:"),
            " '",
            args.title,
            "' for ",
            args.assignedTo,
          ),
        });
        return { result: "ok" };
      },
      addBrainDump: async (args) => {
        const { note } = args;
        const newText = `${brainDumpText}\n- ${note}`.trim();
        dispatchUserAction({ type: "SET_BRAIN_DUMP", payload: newText });
        updaters.addTranscriptEntry({
          type: "system",
          content: React.createElement("b", null, "Brain Dump Updated."),
        });
        return { result: "ok" };
      },
      captureAndProcessThought: async (args) => {
        const cardId = updaters.addTranscriptEntry({
          type: "system",
          content: React.createElement(
            "div",
            { className: "animate-pulse-slow font-bold" },
            "Processing thought...",
          ),
        });
        (async () => {
          try {
            const { generate } = useSafeAI();
            const processResponse = await generate(
              `Summarize this thought into a title, structured content, and tags. Thought: "${args.thought}"`,
              {
                model: "gemini-2.5-flash",
                responseMimeType: "application/json",
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    content: { type: Type.STRING },
                    tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                },
                timeoutMs: 20000,
              },
            );
            const processed =
              processResponse.json ||
              (processResponse.text ? JSON.parse(processResponse.text) : null);
            dispatchUserAction({
              type: "ADD_KNOWLEDGE_ENTRY",
              payload: processed,
            });
            updaters.updateTranscriptEntry(
              cardId,
              React.createElement(
                React.Fragment,
                null,
                React.createElement("b", null, "Thought Captured:"),
                " '",
                processed.title,
                "' saved to vault.",
              ),
            );
          } catch (e) {
            console.error("Failed to process thought:", e);
            updaters.updateTranscriptEntry(
              cardId,
              React.createElement(
                "div",
                { className: "text-red-400 font-bold" },
                "Error processing thought.",
              ),
            );
          }
        })();
        return { result: "ok" };
      },
      findKnowledgeForSop: async (args) => {
        const { topic } = args;
        const topicLower = topic.toLowerCase();
        const foundEntries = knowledgeVaultEntries.filter(
          (e) =>
            e.title.toLowerCase().includes(topicLower) ||
            e.content.toLowerCase().includes(topicLower) ||
            e.tags.some((t) => t.toLowerCase().includes(topicLower)),
        );
        if (foundEntries.length > 0) {
          let cardId;
          const handleCancel = () =>
            updaters.updateTranscriptEntry(
              cardId,
              React.createElement("em", null, "SOP synthesis cancelled."),
            );
          const cardContent = React.createElement(
            "div",
            null,
            React.createElement(
              "h4",
              { className: "font-bold text-accent-green mb-2" },
              `Found ${foundEntries.length} entries for "${topic}":`,
            ),
            React.createElement(
              "ul",
              {
                className:
                  "list-disc list-inside text-xs mb-3 max-h-24 overflow-y-auto",
              },
              foundEntries.map((e) =>
                React.createElement("li", { key: e.id }, e.title),
              ),
            ),
            React.createElement(
              "p",
              { className: "text-xs mb-3" },
              "Proceed with synthesis?",
            ),
            React.createElement(
              "div",
              { className: "flex justify-end gap-2" },
              React.createElement(
                "button",
                {
                  onClick: handleCancel,
                  className: "px-3 py-1 bg-gray-600 rounded",
                },
                "Cancel",
              ),
              React.createElement(
                "button",
                {
                  onClick: () =>
                    handleSynthesizeSop(topic, foundEntries, cardId),
                  className:
                    "px-3 py-1 bg-accent-green text-background-dark font-bold rounded",
                },
                "Generate SOP",
              ),
            ),
          );
          cardId = updaters.addTranscriptEntry({
            type: "system",
            content: cardContent,
          });
          return {
            result: `Found ${foundEntries.length} relevant entries. Presenting for confirmation.`,
          };
        } else {
          updaters.addTranscriptEntry({
            type: "system",
            content: `No knowledge entries found on the topic "${topic}".`,
          });
          return { result: `No entries found for "${topic}".` };
        }
      },
      findKnowledgeEntry: async (args) => {
        const { topic } = args;
        const topicLower = topic.toLowerCase();
        const entry = knowledgeVaultEntries.find(
          (e) =>
            e.title.toLowerCase().includes(topicLower) ||
            e.content.toLowerCase().includes(topicLower),
        );

        if (!entry) {
          updaters.addTranscriptEntry({
            type: "system",
            content: `No knowledge entry found for "${topic}".`,
          });
          return { result: "not found" };
        }

        const cardId = updaters.addTranscriptEntry({
          type: "system",
          content: React.createElement(
            "div",
            null,
            React.createElement(
              "h4",
              { className: "font-bold text-accent-green" },
              entry.title,
            ),
            React.createElement(
              "p",
              { className: "text-xs" },
              entry.content.substring(0, 100) + "...",
            ),
            React.createElement(
              "p",
              { className: "text-xs mt-2 text-gray-400 animate-pulse" },
              "Finding related notes...",
            ),
          ),
        });

        // Asynchronously find related notes
        (async () => {
          const otherEntries = knowledgeVaultEntries.filter(
            (e) => e.id !== entry.id,
          );
          if (otherEntries.length === 0) {
            updaters.updateTranscriptEntry(
              cardId,
              React.createElement(
                "div",
                null,
                React.createElement(
                  "h4",
                  { className: "font-bold text-accent-green" },
                  entry.title,
                ),
                React.createElement(
                  "p",
                  { className: "text-xs" },
                  entry.content,
                ),
              ),
            );
            return;
          }

          const prompt = `Primary Note: "${entry.title}". Other Notes: ${otherEntries.map((e) => `ID:"${e.id}", Title:"${e.title}"`).join("; ")}. Identify top 3 related notes.`;
          try {
            const { generate } = useSafeAI();
            const response = await generate(prompt, {
              model: "gemini-2.5-flash",
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  relatedIds: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
              },
              timeoutMs: 20000,
            });
            const { relatedIds } =
              response.json || (response.text ? JSON.parse(response.text) : {});
            const foundNotes = otherEntries.filter((e) =>
              relatedIds.includes(e.id),
            );

            updaters.updateTranscriptEntry(
              cardId,
              React.createElement(
                "div",
                null,
                React.createElement(
                  "h4",
                  { className: "font-bold text-accent-green" },
                  entry.title,
                ),
                React.createElement(
                  "p",
                  { className: "text-xs" },
                  entry.content,
                ),
                React.createElement(
                  "h5",
                  { className: "text-xs font-bold mt-2 text-accent-blue" },
                  "Related Notes:",
                ),
                React.createElement(
                  "ul",
                  { className: "list-disc list-inside text-xs" },
                  foundNotes.length > 0
                    ? foundNotes.map((n) =>
                        React.createElement("li", { key: n.id }, n.title),
                      )
                    : React.createElement("li", null, "None found."),
                ),
              ),
            );
          } catch (e) {
            // If related search fails, just show the main entry
            updaters.updateTranscriptEntry(
              cardId,
              React.createElement(
                "div",
                null,
                React.createElement(
                  "h4",
                  { className: "font-bold text-accent-green" },
                  entry.title,
                ),
                React.createElement(
                  "p",
                  { className: "text-xs" },
                  entry.content,
                ),
              ),
            );
          }
        })();

        return { result: `Found entry: ${entry.title}` };
      },
      addQuickReference: async (args) => {
        dispatchUserAction({
          type: "ADD_QUICK_REFERENCE_ENTRY",
          payload: args,
        });
        updaters.addTranscriptEntry({
          type: "system",
          content: React.createElement(
            React.Fragment,
            null,
            React.createElement("b", null, "Vault Entry Added:"),
            " ",
            args.key,
          ),
        });
        return { result: "ok" };
      },
      addKnowledgeEntry: async (args) => {
        dispatchUserAction({
          type: "ADD_KNOWLEDGE_ENTRY",
          payload: {
            ...args,
            tags: args.tags ? args.tags.split(",").map((t) => t.trim()) : [],
          },
        });
        updaters.addTranscriptEntry({
          type: "system",
          content: React.createElement(
            React.Fragment,
            null,
            React.createElement("b", null, "Knowledge Entry Saved:"),
            " ",
            args.title,
          ),
        });
        return { result: "ok" };
      },
      addCalendarEvent: async (args) => {
        const dateWithTime = new Date(`${args.date}T${args.time}:00`);
        dispatchUserAction({
          type: "ADD_CALENDAR_EVENT",
          payload: {
            title: args.title,
            date: dateWithTime.toISOString(),
            type: "other",
          },
        });
        updaters.addTranscriptEntry({
          type: "system",
          content: React.createElement(
            React.Fragment,
            null,
            React.createElement("b", null, "Event Scheduled:"),
            " ",
            `${args.title} on ${args.date} at ${args.time}`,
          ),
        });
        return { result: "ok" };
      },
      setMood: async (args) => {
        dispatchUserAction({ type: "SET_MOOD", payload: args.mood });
        updaters.addTranscriptEntry({
          type: "system",
          content: React.createElement(
            React.Fragment,
            null,
            React.createElement("b", null, "Mood set to:"),
            " ",
            args.mood,
          ),
        });
        return { result: "ok" };
      },
      setEnergy: async (args) => {
        dispatchUserAction({ type: "SET_ENERGY", payload: args.energy });
        updaters.addTranscriptEntry({
          type: "system",
          content: React.createElement(
            React.Fragment,
            null,
            React.createElement("b", null, "Energy set to:"),
            " ",
            args.energy,
          ),
        });
        return { result: "ok" };
      },
      logExpense: async (args) => {
        const { amount, description } = args;
        const categoryMap = {
          food: "Groceries",
          groceries: "Groceries",
          lunch: "Groceries",
          dinner: "Groceries",
          transport: "Transport",
          gas: "Transport",
          transit: "Transport",
          health: "Health",
          medicine: "Health",
        };
        const inferredCategory = Object.keys(categoryMap).find((key) =>
          description.toLowerCase().includes(key),
        );
        dispatchUserAction({
          type: "ADD_EXPENSE",
          payload: {
            amount,
            description,
            category: inferredCategory
              ? categoryMap[inferredCategory]
              : "Other",
          },
        });
        updaters.addTranscriptEntry({
          type: "system",
          content: React.createElement(
            React.Fragment,
            null,
            React.createElement("b", null, "Expense Logged:"),
            " $",
            amount,
            " for ",
            description,
          ),
        });
        return { result: "ok" };
      },
      markHabitAsDone: async (args) => {
        const habit = habitTracker.habits.find(
          (h) => h.name.toLowerCase() === args.habitName.toLowerCase(),
        );
        if (habit) {
          dispatchUserAction({
            type: "TOGGLE_HABIT_LOG",
            payload: {
              habitId: habit.id,
              date: new Date().toISOString().split("T")[0],
            },
          });
          updaters.addTranscriptEntry({
            type: "system",
            content: React.createElement(
              React.Fragment,
              null,
              React.createElement("b", null, "Habit Completed:"),
              " ",
              habit.name,
            ),
          });
          return { result: "ok" };
        }
        return { result: `Habit '${args.habitName}' not found.` };
      },
      logDailyEssential: async (args) => {
        const itemMap = {
          "morning medication": "essentials-meds-am",
          "noon medication": "essentials-meds-noon",
          "night medication": "essentials-meds-pm",
          water: () => {
            for (let i = 1; i <= 4; i++) {
              if (!appState.checkedItems[`essentials-water-${i}`]) {
                return `essentials-water-${i}`;
              }
            }
            return null;
          },
          breakfast: "essentials-food-1",
          lunch: "essentials-food-2",
          dinner: "essentials-food-3",
        };
        let checkId = null;
        const mapping = itemMap[args.item.toLowerCase()];
        if (typeof mapping === "function") {
          checkId = mapping();
        } else if (typeof mapping === "string") {
          checkId = mapping;
        }

        if (checkId && !appState.checkedItems[checkId]) {
          dispatchUserAction({ type: "TOGGLE_CHECKED", payload: checkId });
          updaters.addTranscriptEntry({
            type: "system",
            content: React.createElement(
              React.Fragment,
              null,
              React.createElement("b", null, "Essential Logged:"),
              " ",
              args.item,
            ),
          });
          return { result: "ok" };
        } else if (checkId && appState.checkedItems[checkId]) {
          return { result: `${args.item} was already logged.` };
        } else if (mapping && !checkId) {
          return { result: `All water has already been logged.` };
        }
        return { result: `Item '${args.item}' not found.` };
      },
      startPomodoro: async (args) => {
        dispatchUserAction({ type: "POMODORO_SET_MODE", payload: args.mode });
        dispatchUserAction({ type: "POMODORO_TOGGLE" });
        updaters.addTranscriptEntry({
          type: "system",
          content: React.createElement(
            React.Fragment,
            null,
            React.createElement("b", null, "Pomodoro Started:"),
            " ",
            args.mode,
            " mode.",
          ),
        });
        return { result: "ok" };
      },
      pausePomodoro: async () => {
        dispatchUserAction({ type: "POMODORO_TOGGLE" });
        updaters.addTranscriptEntry({
          type: "system",
          content: React.createElement("b", null, "Pomodoro Paused."),
        });
        return { result: "ok" };
      },
      resetPomodoro: async () => {
        dispatchUserAction({ type: "POMODORO_RESET" });
        updaters.addTranscriptEntry({
          type: "system",
          content: React.createElement("b", null, "Pomodoro Reset."),
        });
        return { result: "ok" };
      },
      setActiveSop: async (args) => {
        const sop = [...SOP_DATA, ...userSops].find(
          (s) => s.title.toLowerCase() === args.sopName.toLowerCase(),
        );
        if (sop) {
          const newActiveSops = args.isActive
            ? [...activeSops.filter((id) => id !== sop.id), sop.id]
            : activeSops.filter((id) => id !== sop.id);
          dispatchUserAction({
            type: "SET_ACTIVE_SOPS",
            payload: newActiveSops,
          });
          updaters.addTranscriptEntry({
            type: "system",
            content: React.createElement(
              React.Fragment,
              null,
              React.createElement(
                "b",
                null,
                `SOP ${args.isActive ? "Activated" : "Deactivated"}:`,
              ),
              " ",
              sop.title,
            ),
          });
          return { result: "ok" };
        }
        return { result: "SOP not found." };
      },
      clearActiveSops: async () => {
        dispatchUserAction({ type: "SET_ACTIVE_SOPS", payload: [] });
        updaters.addTranscriptEntry({
          type: "system",
          content: React.createElement("b", null, "All active SOPs cleared."),
        });
        return { result: "ok" };
      },
      getSystemState: async () => ({ result: JSON.stringify(appState) }),
      manageDashboardModule: async (args) => {
        const module = ALL_WILLIAM_MODULES_CONFIG.find(
          (m) => m.name.toLowerCase() === args.moduleName.toLowerCase(),
        );
        if (module && module.isRemovable) {
          let newModules = [...williamDashboardModules];
          if (args.action === "add" && !newModules.includes(module.id)) {
            newModules.push(module.id);
          } else if (args.action === "remove") {
            newModules = newModules.filter((id) => id !== module.id);
          }
          dispatchUserAction({
            type: "SET_WILL_DASHBOARD_MODULES",
            payload: newModules,
          });
          updaters.addTranscriptEntry({
            type: "system",
            content: React.createElement(
              React.Fragment,
              null,
              React.createElement(
                "b",
                null,
                `Module ${args.action === "add" ? "Added" : "Removed"}:`,
              ),
              " ",
              module.name,
            ),
          });
          return { result: "ok" };
        }
        return { result: "Module not found or is a core module." };
      },
      deleteLastExpense: async () => {
        if (expenses.length > 0) {
          const lastExpense = expenses[0];
          dispatchUserAction({
            type: "REMOVE_EXPENSE",
            payload: lastExpense.id,
          });
          updaters.addTranscriptEntry({
            type: "system",
            content: React.createElement(
              React.Fragment,
              null,
              React.createElement("b", null, "Last Expense Deleted:"),
              " ",
              `$${lastExpense.amount} for ${lastExpense.description}`,
            ),
          });
          return { result: "ok" };
        }
        return { result: "No expenses to delete." };
      },
      clearBrainDump: async () => {
        dispatchUserAction({ type: "SET_BRAIN_DUMP", payload: "" });
        updaters.addTranscriptEntry({
          type: "system",
          content: React.createElement("b", null, "Brain Dump Cleared."),
        });
        return { result: "ok" };
      },
      navigateToView: async (args) => {
        const dest = args.destinationName.toLowerCase();
        const view = staticViewMap[dest];
        if (view) {
          dispatchUserAction({ type: "SET_VIEW", payload: view });
          return { result: "ok" };
        }
        const sop = [...SOP_DATA, ...userSops].find(
          (s) => s.title.toLowerCase() === dest,
        );
        if (sop) {
          if (sop.viewId) {
            dispatchUserAction({ type: "SET_VIEW", payload: sop.viewId });
          } else if (sop.isPageView) {
            dispatchUserAction({
              type: "SET_ACTIVE_USER_SOP_ID",
              payload: sop.id,
            });
            dispatchUserAction({ type: "SET_VIEW", payload: "user-sop-view" });
          }
          return { result: "ok" };
        }
        return { result: "Destination not found." };
      },
      shutdownAndPlan: async (args) => {
        const { brainDumpContent, tomorrowTasks } = args;

        // 1. Update Brain Dump
        const newBrainDump =
          `${brainDumpText}\n\n--- End of Day Shutdown ---\n${brainDumpContent}`.trim();
        dispatchUserAction({ type: "SET_BRAIN_DUMP", payload: newBrainDump });

        // 2. Schedule Tasks for Tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split("T")[0];

        tomorrowTasks.forEach((taskTitle) => {
          dispatchUserAction({
            type: "ADD_TASK",
            payload: {
              title: taskTitle,
              priority: "High",
              dueDate: tomorrowStr,
            },
          });
        });

        const confirmationMessage = `Shutdown complete. Brain dump updated and ${tomorrowTasks.length} critical tasks scheduled for tomorrow. It is now safe to disengage.`;
        updaters.addTranscriptEntry({
          type: "system",
          content: React.createElement("b", null, confirmationMessage),
        });
        return { result: "ok" };
      },
      completeTask: async (args) => {
        const { taskName } = args;
        const taskToComplete = appState.tasks.find(
          (t) =>
            t.title.toLowerCase() === taskName.toLowerCase() &&
            t.status === "todo",
        );
        if (taskToComplete) {
          dispatchUserAction({
            type: "UPDATE_TASK",
            payload: { id: taskToComplete.id, status: "done" },
          });
          updaters.addTranscriptEntry({
            type: "system",
            content: `Task Completed: "${taskName}"`,
          });
          return { result: "ok" };
        }
        return { result: `Task "${taskName}" not found or already completed.` };
      },
      listTasks: async (args) => {
        const { filter } = args;
        let tasksToList = [];
        const todayStr = new Date().toISOString().split("T")[0];

        if (filter === "today") {
          tasksToList = appState.tasks.filter(
            (t) => t.dueDate === todayStr && t.status === "todo",
          );
        } else if (filter === "inbox") {
          tasksToList = appState.tasks.filter(
            (t) => !t.dueDate && t.status === "todo",
          );
        } else {
          // 'all'
          tasksToList = appState.tasks.filter((t) => t.status === "todo");
        }

        const taskTitles = tasksToList.map((t) => t.title);

        updaters.addTranscriptEntry({
          type: "system",
          content: `Found ${taskTitles.length} tasks for '${filter}'.`,
        });

        return { result: JSON.stringify(taskTitles) };
      },
      addHabit: async (args) => {
        const { habitName } = args;
        dispatchUserAction({ type: "ADD_HABIT", payload: habitName });
        updaters.addTranscriptEntry({
          type: "system",
          content: `Habit Added: "${habitName}"`,
        });
        return { result: "ok" };
      },
      setBudget: async (args) => {
        const { category, amount } = args;
        dispatchUserAction({
          type: "SET_FINANCIAL_BUDGET",
          payload: { category, amount },
        });
        updaters.addTranscriptEntry({
          type: "system",
          content: `Budget for ${category} set to $${amount}.`,
        });
        return { result: "ok" };
      },
      deleteQuest: async (args) => {
        const { questName } = args;
        const questToDelete = appState.quests.find(
          (q) => q.title.toLowerCase() === questName.toLowerCase(),
        );
        if (questToDelete) {
          dispatchUserAction({
            type: "DELETE_QUEST",
            payload: questToDelete.id,
          });
          updaters.addTranscriptEntry({
            type: "system",
            content: `Quest Deleted: "${questName}"`,
          });
          return { result: "ok" };
        }
        return { result: `Quest "${questName}" not found.` };
      },
      awardGem: async (args) => {
        const { persona, gemLabel } = args;
        const gemToAward = ALL_GEMS.find(
          (g) => g.label.toLowerCase() === gemLabel.toLowerCase(),
        );
        if (gemToAward) {
          dispatchUserAction({
            type: "ADD_GEM",
            payload: { id: gemToAward.id, recipient: persona },
          });
          updaters.addTranscriptEntry({
            type: "system",
            content: `Awarded "${gemLabel}" gem to ${persona}.`,
          });
          return { result: "ok" };
        }
        return { result: `Gem "${gemLabel}" not found.` };
      },
    };
  }, [
    appState,
    dispatchUserAction,
    updaters,
    handleSynthesizeSop,
    brainDumpText,
    williamDashboardModules,
    userSops,
    expenses,
    knowledgeVaultEntries,
    activeSops,
    habitTracker.habits,
  ]);

  const handleToolCall = useCallback(
    async (fc) => {
      const handler = toolHandlers[fc.name];
      if (handler) {
        return await handler(fc.args);
      }
      return { result: `Function ${fc.name} not found.` };
    },
    [toolHandlers],
  );

  return { allTools, systemInstruction, handleToolCall };
}
