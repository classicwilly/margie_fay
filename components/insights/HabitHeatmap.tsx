import React, { useMemo } from "react";
import { useAppState } from "@contexts/AppStateContext";
import ContentCard from "../ContentCard.js";

// Helper to get YYYY-MM-DD
const toYMD = (date) => date.toISOString().split("T")[0];

const HabitHeatmap = () => {
  const { appState } = useAppState();
  const { habits, log } = appState.habitTracker;

  const today = new Date();
  const todayYMD = toYMD(today);

  const days = useMemo(() => {
    const todayForCalc = new Date(todayYMD + "T00:00:00"); // Use a consistent time to avoid timezone issues
    return Array.from({ length: 30 }, (_, i) => {
      const d = new Date(todayForCalc);
      d.setDate(todayForCalc.getDate() - i);
      return d;
    }).reverse();
  }, [todayYMD]);

  if (habits.length === 0) {
    return (
      <ContentCard title="Habit Compliance (Last 30 Days)">
        <p className="text-text-light text-opacity-80 text-center p-4">
          No habits are being tracked. Add habits via the Habit Streak Tracker
          module.
        </p>
      </ContentCard>
    );
  }

  return (
    <ContentCard title="Habit Compliance (Last 30 Days)">
      <div className="space-y-4">
        {habits.map((habit) => (
          <div key={habit.id}>
            <h3 className="font-bold text-accent-blue mb-2">{habit.name}</h3>
            <div className="grid grid-cols-15 gap-1">
              {days.map((day, index) => {
                const dayStr = toYMD(day);
                const isCompleted = log[dayStr]?.includes(habit.id);
                const isFuture = day > today;
                const isToday = dayStr === todayYMD;
                let bgColor = "bg-gray-700";
                if (isCompleted) {
                  bgColor = "bg-accent-green";
                } else if (!isFuture) {
                  bgColor = "bg-gray-800";
                }

                return (
                  <div
                    key={index}
                    title={`${dayStr}: ${isCompleted ? "Completed" : "Not Completed"}`}
                    className={`w-4 h-4 rounded-sm ${bgColor} ${isToday ? "ring-2 ring-accent-blue" : ""}`}
                  ></div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <style>{`.grid-cols-15 { grid-template-columns: repeat(15, minmax(0, 1fr)); }`}</style>
    </ContentCard>
  );
};

export default HabitHeatmap;
