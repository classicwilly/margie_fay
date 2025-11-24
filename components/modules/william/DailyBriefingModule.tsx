import React, { useMemo } from "react";
import ContentCard from "../../ContentCard.js";
import useProgressVar from "@hooks/useProgressVar";
import AIBriefing from "./daily-command/AIBriefing.js";
import CriticalTasks from "./daily-command/CriticalTasks.js";
import TodaysAgenda from "./daily-command/TodaysAgenda.js";
import DailyHabits from "./daily-command/DailyHabits.js";
import DailyEssentials from "./daily-command/DailyEssentials.js";
import { useAppState } from "@contexts/AppStateContext";
import { ALL_CHECKLIST_DATA } from "../../../checklist-data.js";

const toYMD = (date) => date.toISOString().split("T")[0];

const ProgressBar = ({ label, percentage, completed, total }) => {
  const trackRef = React.useRef<HTMLDivElement | null>(null);
  useProgressVar(trackRef, percentage);

  return (
    <div>
      <div className="flex justify-between items-center text-sm mb-1">
        <span className="font-semibold">{label}</span>
        <span className="text-gray-400">
          {completed} / {total}
        </span>
      </div>
      <div
        className="w-full bg-gray-700 rounded-full h-2.5"
        role="progressbar"
        aria-label={`${label} progress: ${Math.round(percentage)}%`}
      >
        <div
          ref={trackRef}
          className="bg-accent-green h-2.5 rounded-full transition-all duration-500 progress-fill"
        ></div>
        <span className="sr-only">
          {label} progress: {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
};

const DailyBriefingModule = () => {
  const { appState } = useAppState();
  const { checkedItems, habitTracker } = appState;

  const completionStatus = useMemo(() => {
    // Essentials
    const essentialsData = ALL_CHECKLIST_DATA.find(
      (section) => section.id === "essentials-tracker",
    );
    const essentialItems =
      essentialsData?.subSections?.flatMap((ss) => ss.items || []) || [];
    const totalEssentials = essentialItems.length;
    const completedEssentials = essentialItems.filter(
      (item) => checkedItems[item.id],
    ).length;
    const essentialsPercentage =
      totalEssentials > 0 ? (completedEssentials / totalEssentials) * 100 : 0;

    // Habits
    const todayLog = habitTracker.log[toYMD(new Date())] || [];
    const totalHabits = habitTracker.habits.length;
    const completedHabits = habitTracker.habits.filter((habit) =>
      todayLog.includes(habit.id),
    ).length;
    const habitsPercentage =
      totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0;

    return {
      essentials: {
        completed: completedEssentials,
        total: totalEssentials,
        percentage: essentialsPercentage,
      },
      habits: {
        completed: completedHabits,
        total: totalHabits,
        percentage: habitsPercentage,
      },
    };
  }, [checkedItems, habitTracker]);

  return (
    <ContentCard title="Daily Command Module" showHeader={false}>
      <div className="flex flex-col h-full">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-accent-green">
            Daily Command Module
          </h2>
          <p className="text-sm text-text-light text-opacity-70">
            Unified daily operations center.
          </p>
        </div>

        <div className="p-3 bg-gray-800 rounded-md border border-gray-700 mb-4">
          <h3 className="font-bold text-accent-teal mb-2">
            Daily Protocol Compliance
          </h3>
          <div className="space-y-3">
            <ProgressBar
              label="⚙️ Essentials"
              percentage={completionStatus.essentials.percentage}
              completed={completionStatus.essentials.completed}
              total={completionStatus.essentials.total}
            />
            <ProgressBar
              label="🔥 Habits"
              percentage={completionStatus.habits.percentage}
              completed={completionStatus.habits.completed}
              total={completionStatus.habits.total}
            />
          </div>
        </div>

        <div className="space-y-4">
          <AIBriefing />
          <DailyEssentials />
          <CriticalTasks />
          <TodaysAgenda />
          <DailyHabits />
        </div>
      </div>
    </ContentCard>
  );
};

export default DailyBriefingModule;
