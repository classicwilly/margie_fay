import React, { useEffect, useRef, useState, useMemo } from "react";
import ContentCard from "../../ContentCard.js";
import { useAppState } from "@contexts/AppStateContext";

const PomodoroTimerModule = () => {
  const { appState, dispatch } = useAppState();
  const { mode, timeLeft, isActive, taskId, workSessionsCompleted } =
    appState.pomodoroState;
  const { tasks, recurringTasks } = appState;
  const intervalRef = useRef(null);
  const [sessionEnded, setSessionEnded] = useState(false);

  const activeTask = useMemo(() => {
    if (!taskId) {
      return null;
    }
    if (taskId.startsWith("recurring-")) {
      return recurringTasks.find(
        (t) => t.id === taskId.replace("recurring-", ""),
      );
    }
    return tasks.find((t) => t.id === taskId);
  }, [taskId, tasks, recurringTasks]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        dispatch({ type: "POMODORO_TICK" });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (isActive && timeLeft === 0) {
        // Session finished
        dispatch({ type: "POMODORO_TOGGLE" }); // Stop the timer logically
        setSessionEnded(true);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft, dispatch]);

  useEffect(() => {
    document.title = isActive
      ? `${formatTime(timeLeft)} - Wonky Sprout OS`
      : "Wonky Sprout OS";
    return () => {
      document.title = "Wonky Sprout OS";
    };
  }, [isActive, timeLeft]);

  const handleToggle = () => {
    if (sessionEnded) {
      // If session ended, default action is to start work
      dispatch({ type: "POMODORO_SET_MODE", payload: "work" });
      dispatch({ type: "POMODORO_TOGGLE" });
      setSessionEnded(false);
    } else {
      dispatch({ type: "POMODORO_TOGGLE" });
    }
  };

  const handleModeSwitch = (newMode) => {
    dispatch({ type: "POMODORO_SET_MODE", payload: newMode });
    setSessionEnded(false);
  };

  const handleStartBreak = () => {
    dispatch({ type: "POMODORO_FINISH_SESSION_AND_START_BREAK" });
    setSessionEnded(false);
  };

  const handleContinueTask = () => {
    dispatch({ type: "POMODORO_RESET" });
    dispatch({ type: "POMODORO_TOGGLE" });
    setSessionEnded(false);
  };

  const handleCompleteAndNext = () => {
    dispatch({ type: "POMODORO_COMPLETE_TASK_AND_START_NEXT" });
    setSessionEnded(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const ModeButton = ({ targetMode, label }) => (
    <button
      onClick={() => handleModeSwitch(targetMode)}
      className={`px-3 py-1 rounded-md text-sm font-semibold transition-colors w-full ${mode === targetMode ? "bg-accent-blue text-background-dark" : "bg-gray-700 hover:bg-gray-600"}`}
    >
      {label}
    </button>
  );

  if (sessionEnded && mode === "work") {
    return (
      <ContentCard title="⏱️ Pomodoro: What's Next?">
        <div className="flex flex-col items-center text-center p-4">
          <span className="text-4xl mb-3">🎉</span>
          <h3 className="text-xl font-bold text-accent-green">
            Work Session Complete!
          </h3>
          <p className="text-gray-400 mb-4">
            Task: {activeTask?.title || "General Work"}
          </p>
          <div className="space-y-3 w-full max-w-xs">
            <button
              onClick={handleStartBreak}
              className="w-full py-3 bg-accent-blue text-background-dark font-bold rounded"
            >
              Start Break
            </button>
            <button
              onClick={handleContinueTask}
              className="w-full py-2 bg-gray-600 rounded"
            >
              Continue This Task
            </button>
            <button
              onClick={handleCompleteAndNext}
              className="w-full py-2 bg-accent-green text-background-dark font-semibold rounded"
            >
              ✓ Complete & Start Next
            </button>
          </div>
        </div>
      </ContentCard>
    );
  }

  if (sessionEnded && (mode === "shortBreak" || mode === "longBreak")) {
    return (
      <ContentCard title="⏱️ Pomodoro: Break Over">
        <div className="flex flex-col items-center text-center p-4">
          <span className="text-4xl mb-3">☕️</span>
          <h3 className="text-xl font-bold text-accent-green">
            Break Finished!
          </h3>
          <p className="text-gray-400 mb-4">Ready for the next session?</p>
          <button
            onClick={handleToggle}
            className="w-full max-w-xs py-3 bg-accent-green text-background-dark font-bold rounded"
          >
            Start Next Work Session
          </button>
        </div>
      </ContentCard>
    );
  }

  return (
    <ContentCard title="⏱️ Pomodoro Timer">
      <div className="flex flex-col items-center">
        <div className="grid grid-cols-3 gap-2 w-full mb-4">
          <ModeButton targetMode="work" label="Work" />
          <ModeButton targetMode="shortBreak" label="Short Break" />
          <ModeButton targetMode="longBreak" label="Long Break" />
        </div>

        {activeTask && (
          <div className="text-center p-2 bg-gray-800 rounded-md w-full mb-3 border border-gray-700">
            <p className="text-xs text-accent-teal">Current Task:</p>
            <p className="font-semibold truncate">{activeTask.title}</p>
          </div>
        )}

        <div className="font-mono text-6xl text-text-light my-4">
          {formatTime(timeLeft)}
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleToggle}
            className="px-8 py-3 bg-accent-green text-background-dark rounded-md hover:bg-green-600 font-semibold"
          >
            {isActive ? "Pause" : "Start"}
          </button>
          <button
            onClick={() => dispatch({ type: "POMODORO_RESET" })}
            className="px-8 py-3 bg-gray-600 text-text-light rounded-md hover:bg-gray-500 font-semibold"
          >
            Reset
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          Sessions completed: {workSessionsCompleted}
        </p>
      </div>
    </ContentCard>
  );
};

export default PomodoroTimerModule;
