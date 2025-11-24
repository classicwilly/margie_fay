import React, { useMemo, useState, useEffect } from "react";
import { useAppState } from "@contexts/AppStateContext";
import ContentCard from "./ContentCard.js";
import { ALL_CHECKLIST_DATA } from "../checklist-data.js";
import ChecklistItem from "./ChecklistItem.js";
import { SecureMarkdown } from "../utils/secureMarkdownRenderer.js";

const toYMD = (date) => date.toISOString().split("T")[0];
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const BRIEFING_CACHE_KEY = "wonky-sprout-daily-briefing";

const DailyReport = () => {
  const { appState } = useAppState();
  const { calendarEvents, recurringTasks, tasks, checkedItems } = appState;
  const [briefing, setBriefing] = useState("");

  useEffect(() => {
    const todayStr = toYMD(new Date());
    const cachedData = localStorage.getItem(BRIEFING_CACHE_KEY);
    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        if (parsed.date === todayStr) {
          setBriefing(parsed.content);
        }
      } catch (e) {
        console.error("Failed to parse briefing cache", e);
      }
    }
  }, []);

  const fullAgenda = useMemo(() => {
    const today = new Date();
    const todayStr = toYMD(today);
    today.setHours(0, 0, 0, 0);

    const todaysCalEvents = calendarEvents
      .filter((event) => toYMD(new Date(event.date)) === todayStr)
      .map((e) => ({ ...e, itemType: "event" }));

    const dueRecurring = recurringTasks
      .filter((task) => {
        const lastEventDate = task.lastCompletedDate
          ? new Date(task.lastCompletedDate)
          : new Date(task.startDate);
        const dueDate = addDays(lastEventDate, task.frequencyDays);
        return (
          Math.round(
            (dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24),
          ) <= 0
        );
      })
      .map((task) => ({
        ...task,
        id: `recurring-${task.id}`,
        status: "todo",
        dueDate: todayStr,
        priority: "Medium",
        createdAt: task.startDate,
        completedAt: null,
        itemType: "recurring",
      }));

    const todayT = tasks
      .filter((t) => t.status === "todo" && t.dueDate === todayStr)
      .map((t) => ({ ...t, itemType: "task" }));

    const agenda = [...todaysCalEvents, ...dueRecurring, ...todayT];
    agenda.sort((a, b) => {
      const timeA =
        a.itemType === "event" ? new Date(a.date).getTime() : Infinity;
      const timeB =
        b.itemType === "event" ? new Date(b.date).getTime() : Infinity;
      if (timeA !== timeB) {
        return timeA - timeB;
      }
      const priorityOrder = { High: 1, Medium: 2, Low: 3 };
      const priorityA = "priority" in a ? priorityOrder[a.priority] : 4;
      const priorityB = "priority" in b ? priorityOrder[b.priority] : 4;
      return priorityA - priorityB;
    });
    return agenda;
  }, [calendarEvents, recurringTasks, tasks]);

  const essentialsData = useMemo(
    () =>
      ALL_CHECKLIST_DATA.find((section) => section.id === "essentials-tracker"),
    [],
  );

  return (
    <div>
      <header className="text-center mb-10 no-print">
        <h1 className="text-4xl md:text-5xl font-extrabold text-accent-teal mb-4">
          Print Daily Report
        </h1>
        <p className="text-lg text-text-light text-opacity-80 max-w-3xl mx-auto">
          Generate a physical "mission sheet" for the day. This is a powerful
          tool to combat the "out of sight, out of mind" challenge of
          digital-only systems.
        </p>
        <button
          onClick={() => window.print()}
          className="mt-6 px-6 py-3 bg-accent-blue text-background-dark font-bold rounded hover:bg-blue-400"
        >
          Print Today's Mission
        </button>
      </header>

      <div
        id="main-content"
        className="bg-card-dark rounded-lg shadow-md p-6 border border-gray-700 space-y-6"
      >
        <header className="text-center pb-4 border-b border-gray-600">
          <h1 className="text-3xl font-bold text-accent-teal">
            Daily Mission Sheet
          </h1>
          <p className="text-lg text-gray-300">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </header>

        <section aria-labelledby="ai-briefing-title">
          <h2
            id="ai-briefing-title"
            className="text-2xl font-bold text-accent-green mb-3"
          >
            AI Briefing
          </h2>
          <div className="prose prose-invert prose-sm max-w-none p-4 bg-gray-800 rounded-md">
            {briefing ? (
              <SecureMarkdown content={briefing} />
            ) : (
              <p>No AI briefing available for today.</p>
            )}
          </div>
        </section>

        <section aria-labelledby="agenda-title">
          <h2
            id="agenda-title"
            className="text-2xl font-bold text-accent-green mb-3"
          >
            Today's Chronological Agenda
          </h2>
          <div className="space-y-3">
            {fullAgenda.length > 0 ? (
              fullAgenda.map((item) => {
                if (item.itemType === "event") {
                  return (
                    <div
                      key={item.id}
                      className="p-3 bg-gray-800 rounded-md flex items-center"
                    >
                      <input
                        type="checkbox"
                        className="h-5 w-5 mr-3"
                        aria-label={`Event: ${item.title}`}
                      />
                      <span className="font-bold text-accent-blue w-20 flex-shrink-0">
                        {new Date(item.date).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span>{item.title}</span>
                    </div>
                  );
                }
                const task = item;
                return (
                  <div
                    key={item.id}
                    className="p-3 bg-gray-800 rounded-md flex items-center"
                  >
                    <input
                      type="checkbox"
                      className="h-5 w-5 mr-3"
                      aria-label={`Task: ${task.title}`}
                    />
                    <div>
                      <span>{task.title}</span>
                      <span className="text-xs text-gray-400 ml-2">
                        ({task.priority})
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-400">No items on today's agenda.</p>
            )}
          </div>
        </section>

        <section aria-labelledby="essentials-title">
          <h2
            id="essentials-title"
            className="text-2xl font-bold text-accent-green mb-3"
          >
            Daily Protocol Compliance
          </h2>
          <div className="space-y-4 p-4 bg-gray-800 rounded-md">
            {essentialsData?.subSections?.map((subSection) => (
              <div key={subSection.id}>
                <h3 className="text-lg font-semibold text-accent-blue mb-2">
                  {subSection.title}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {subSection.items?.map((item) => (
                    <label key={item.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={!!checkedItems[item.id]}
                        readOnly
                        className="h-5 w-5 mr-2"
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DailyReport;
