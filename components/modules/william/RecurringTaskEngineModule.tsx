import React, { useState, useMemo } from "react";
import { useAppState } from "@contexts/AppStateContext";
import ContentCard from "../../ContentCard.js";

const toYMD = (date) => date.toISOString().split("T")[0];
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const RecurringTaskEngineModule = () => {
  const { appState, dispatch } = useAppState();
  const { recurringTasks } = appState;

  const [title, setTitle] = useState("");
  const [frequencyDays, setFrequencyDays] = useState("30");
  const [startDate, setStartDate] = useState(toYMD(new Date()));

  const handleSubmit = (e) => {
    e.preventDefault();
    const numFrequency = parseInt(frequencyDays, 10);
    if (!title.trim() || isNaN(numFrequency) || numFrequency <= 0) {
      return;
    }

    dispatch({
      type: "ADD_RECURRING_TASK",
      payload: {
        title: title.trim(),
        frequencyDays: numFrequency,
        startDate,
      },
    });
    setTitle("");
    setFrequencyDays("30");
  };

  const handleDelete = (id) => {
    if (
      window.confirm("Are you sure you want to delete this recurring task?")
    ) {
      dispatch({ type: "REMOVE_RECURRING_TASK", payload: id });
    }
  };

  const handleComplete = (id) => {
    dispatch({ type: "COMPLETE_RECURRING_TASK", payload: id });
  };

  const sortedTasks = useMemo(() => {
    return [...recurringTasks].sort((a, b) => {
      const dueDateA = addDays(
        new Date(a.lastCompletedDate || a.startDate),
        a.frequencyDays,
      );
      const dueDateB = addDays(
        new Date(b.lastCompletedDate || b.startDate),
        b.frequencyDays,
      );
      return dueDateA.getTime() - dueDateB.getTime();
    });
  }, [recurringTasks]);

  return (
    <ContentCard title="🔄 Recurring Task Engine">
      <div className="flex flex-col h-full">
        <p className="text-sm text-text-light text-opacity-80 mb-3">
          Automated tracking for periodic life maintenance tasks.
        </p>

        <div className="flex-grow space-y-2 mb-4 overflow-y-auto max-h-72 pr-2">
          {sortedTasks.length > 0 ? (
            sortedTasks.map((task) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const lastEventDate = task.lastCompletedDate
                ? new Date(task.lastCompletedDate)
                : new Date(task.startDate);
              const dueDate = addDays(lastEventDate, task.frequencyDays);
              const daysUntilDue = Math.round(
                (dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24),
              );

              let statusColor = "text-gray-400";
              let statusText =
                daysUntilDue > 0
                  ? `Due in ${daysUntilDue} days`
                  : `Due ${daysUntilDue} days ago`;
              if (daysUntilDue === 0) {
                statusColor = "text-yellow-400";
                statusText = "Due today";
              } else if (daysUntilDue < 0) {
                statusColor = "text-red-400";
                statusText = `Overdue by ${Math.abs(daysUntilDue)} days`;
              }

              return (
                <div
                  key={task.id}
                  className="p-3 bg-gray-800 rounded-md border border-gray-700"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-text-light break-words">
                        {task.title}
                      </p>
                      <p className={`text-xs ${statusColor}`}>{statusText}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleComplete(task.id)}
                        className="px-2 py-1 text-xs bg-accent-green text-background-dark font-semibold rounded hover:bg-green-500"
                        aria-label="Complete task"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="px-2 py-1 text-xs bg-red-800 text-red-300 font-semibold rounded hover:bg-red-700"
                        aria-label="Delete task"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-center text-sm text-gray-500 p-4">
              No recurring tasks defined.
            </p>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-auto pt-3 border-t border-gray-700 space-y-2"
        >
          <h4 className="font-semibold text-accent-green">
            Add New Recurring Task
          </h4>
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 bg-gray-900 border border-gray-600 rounded"
            required
          />
          <div className="flex gap-2">
            <label htmlFor="recurring-frequency" className="sr-only">
              Frequency in days
            </label>
            <input
              id="recurring-frequency"
              type="number"
              value={frequencyDays}
              onChange={(e) => setFrequencyDays(e.target.value)}
              className="w-1/2 p-2 bg-gray-900 border border-gray-600 rounded"
              required
              min="1"
              placeholder="Repeats every (days)..."
            />
            <label htmlFor="recurring-start" className="sr-only">
              Start date
            </label>
            <input
              id="recurring-start"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-1/2 p-2 bg-gray-900 border border-gray-600 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-accent-blue text-background-dark font-bold rounded hover:bg-blue-400"
          >
            Add Task
          </button>
        </form>
      </div>
    </ContentCard>
  );
};

export default RecurringTaskEngineModule;
