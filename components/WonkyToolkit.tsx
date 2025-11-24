import React from "react";
import { useAppState } from "@contexts/AppStateContext";
import { Button } from "./Button";
import ContentCard from "./ContentCard";

const WonkyToolkit: React.FC = () => {
  const { appState, dispatch } = useAppState();

  const startPomodoro = () => {
    dispatch({ type: "POMODORO_SET_MODE", payload: "work" });
    dispatch({ type: "POMODORO_TOGGLE" });
  };

  const openSensoryToolkit = () => {
    dispatch({ type: "SET_VIEW", payload: "view-sensory-regulation-module" });
  };

  const openBubbleShield = () => {
    dispatch({ type: "SET_VIEW", payload: "bubble-shield-protocol" });
  };

  const microStepsToggle = () => {
    dispatch({
      type: "SET_NEURO_PREFS",
      payload: { microStepsMode: !appState.neuroPrefs?.microStepsMode },
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-accent-teal">
          Wonky Toolkit
        </h1>
        <p className="text-text-light">
          Your essential tools for stabilization, focus and low-friction
          execution.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ContentCard title="Pomodoro Starter">
          <p className="text-sm text-text-light">
            Jump into a focused session with a single click. Defaults to 25
            minutes of work.
          </p>
          <Button onClick={startPomodoro} variant="primary" className="mt-4">
            Start Pomodoro
          </Button>
        </ContentCard>

        <ContentCard title="Sensory Toolkit">
          <p className="text-sm text-text-light">
            Open the sensory regulation suite or use the Bubble Shield emergency
            protocol for acute overload.
          </p>
          <div className="flex gap-3 mt-4">
            <Button onClick={openSensoryToolkit} variant="secondary">
              Open Sensory Tools
            </Button>
            <Button onClick={openBubbleShield} variant="outline">
              Bubble Shield Protocol
            </Button>
          </div>
        </ContentCard>

        <ContentCard title="Micro Steps">
          <p className="text-sm text-text-light">
            Toggle micro-steps mode to break tasks into tiny actions useful for
            ADHD flows.
          </p>
          <Button onClick={microStepsToggle} className="mt-4" variant="ghost">
            Toggle Micro-steps
          </Button>
        </ContentCard>

        <ContentCard title="Quick Actions">
          <p className="text-sm text-text-light">Common low-friction tools</p>
          <div className="flex flex-wrap gap-3 mt-4">
            <Button
              onClick={() => dispatch({ type: "RESET_CHECKLISTS_AND_INPUTS" })}
            >
              Reset Checklists
            </Button>
            <Button onClick={() => dispatch({ type: "RESET_BRAIN_DUMP" })}>
              Clear Brain Dump
            </Button>
            <Button
              onClick={() =>
                dispatch({
                  type: "START_FOCUS_MODE",
                  payload: { firstTaskId: appState?.tasks?.[0]?.id ?? null },
                })
              }
            >
              Start Focus Mode
            </Button>
          </div>
        </ContentCard>
      </div>
    </div>
  );
};

export default WonkyToolkit;
export { WonkyToolkit };
