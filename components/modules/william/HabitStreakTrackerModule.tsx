import React, { useState } from "react";
import { useAppState } from "@contexts/AppStateContext";
import ContentCard from "../../ContentCard.js";
import HabitDetailModal from "./habit-tracker/HabitDetailModal.js";

const toYMD = (date) => {
  return date.toISOString().split("T")[0];
};

const HabitStreakTrackerModule = () => {
  const { appState, dispatch } = useAppState();
  const { habits, log } = appState.habitTracker;
  const [newHabitName, setNewHabitName] = useState("");
  const [selectedHabit, setSelectedHabit] = useState(null);

  const handleAddHabit = (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) {
      return;
    }
    dispatch({ type: "ADD_HABIT", payload: newHabitName.trim() });
    setNewHabitName("");
  };

  const handleToggleToday = (e, habitId) => {
    e.stopPropagation(); // Prevent modal from opening
    const todayStr = toYMD(new Date());
    dispatch({
      type: "TOGGLE_HABIT_LOG",
      payload: { habitId, date: todayStr },
    });
  };

  const todayStr = toYMD(new Date());

  return (
    <>
      {selectedHabit && (
        <HabitDetailModal
          habit={selectedHabit}
          log={log}
          onClose={() => setSelectedHabit(null)}
        />
      )}
      <ContentCard title="🔥 Habit Streak Tracker">
        <div className="flex flex-col h-full">
          <p className="text-sm text-text-light text-opacity-80 mb-3">
            Define and track core habits. Click a habit for detailed stats and
            analysis.
          </p>

          <div className="flex-grow space-y-3 mb-4 overflow-y-auto max-h-72 pr-2">
            {habits.length > 0 ? (
              habits.map((habit) => {
                const isDoneToday = log[todayStr]?.includes(habit.id);
                return (
                  <button
                    key={habit.id}
                    onClick={() => setSelectedHabit(habit)}
                    className={`w-full text-left p-3 rounded-md border transition-colors ${isDoneToday ? "bg-accent-green/10 border-accent-green/30 hover:bg-accent-green/20" : "bg-gray-800 border-gray-700 hover:bg-gray-700"}`}
                  >
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-accent-teal break-words">
                        {habit.name}
                      </p>
                      <button
                        onClick={(e) => handleToggleToday(e, habit.id)}
                        className={`px-3 py-1 text-sm font-semibold rounded z-10 ${isDoneToday ? "bg-accent-green text-background-dark" : "bg-gray-700 hover:bg-gray-600"}`}
                      >
                        {isDoneToday ? "✓ Done" : "Do It"}
                      </button>
                    </div>
                    <div className="flex justify-between items-center mt-2 text-sm text-text-light text-opacity-80">
                      <span>
                        Current Streak:{" "}
                        <strong className="text-accent-blue">
                          {habit.currentStreak} 🔥
                        </strong>
                      </span>
                      <span>
                        Longest Streak:{" "}
                        <strong className="text-accent-green">
                          {habit.longestStreak} ⭐
                        </strong>
                      </span>
                    </div>
                  </button>
                );
              })
            ) : (
              <p className="text-center text-sm text-gray-500 p-4">
                No habits defined. Add one below.
              </p>
            )}
          </div>

          <form
            onSubmit={handleAddHabit}
            className="mt-auto pt-3 border-t border-gray-700 space-y-2"
          >
            <h4 className="font-semibold text-accent-green">Add New Habit</h4>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g., Foundational Protocols"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md"
                required
              />
              <button
                type="submit"
                className="px-4 bg-accent-blue text-background-dark font-bold rounded hover:bg-blue-400 transition-colors"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </ContentCard>
    </>
  );
};

export default HabitStreakTrackerModule;
