import { lazy, Suspense, type MouseEvent } from "react";
import type { FC } from "react";
import { Button } from "./Button";
import { useAppState } from "@contexts/AppStateContext";
import ContentCard from "./ContentCard";
import OnboardingStepper from "./OnboardingStepper";
import NeurodivergentOnboarding from "../src/components/NeurodivergentOnboarding";
import EssentialsTrackerModule from "./modules/EssentialsTrackerModule";
import KidsTrackerModule from "./modules/KidsTrackerModule";
import { WorkspaceLaunchpadModule } from "./modules/WorkspaceLaunchpadModule";
import CriticalTasks from "./modules/william/daily-command/CriticalTasks";
import WonkyAIModule from "../WonkyAIModule";
import AchievementTrackerModule from "./modules/AchievementTrackerModule";
import DayProgressBarModule from "./modules/DayProgressBarModule";
import StatusTrackerModule from "./modules/StatusTrackerModule";
import { GroundingRose } from "./GroundingRose";
import { useOscilloscope } from "@contexts/OscilloscopeContext";
import DeepFocusContainer from "./DeepFocusContainer";

const Workshop: FC = () => {
  // Lazy load AskGrandmaFloating for browser context
  const AskGrandmaFloatingLazy = lazy(() => import("./AskGrandmaFloating"));
  const { appState, dispatch } = useAppState();

  const { setAirlockActive } = useOscilloscope();
  const handleTestAirlock = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // Trigger Airlock for transition test and save context
    try {
      // Provide a saved context that satisfies the modal's expectations (prompt/response)
      // and maintain backward-compatible `view`/`dashboardType` entries so both
      // shapes are handled by the reducer and downstream UI without mismatch.
      dispatch?.({
        type: "SET_SAVED_CONTEXT",
        payload: {
          view: "workshop",
          dashboardType: "william",
          prompt: "Test E-Stop Protocol",
          response: "E-Stop test placeholder",
        },
      });
    } catch (e) {
      /* ignore */
    }
    try {
      setAirlockActive(true);
    } catch (e) {
      /* ignore */
    }
    // Ensure we also open the modal for E2E tests (force open)
    try {
      dispatch?.({ type: "SET_CONTEXT_RESTORE_MODAL_OPEN", payload: true });
    } catch (e) {
      /* ignore */
    }
  };

  return (
    <div
      className="container mx-auto px-4 py-8 space-y-8"
      data-workshop-testid="main-content"
    >
      {/* Render onboarding overlays when appropriate */}
      {(!appState?.initialSetupComplete ||
        appState?.view === "neuro-onboarding") && (
        <div aria-hidden={appState?.initialSetupComplete ? true : false}>
          {typeof window !== "undefined" &&
            console.info &&
            console.info("WORKSHOP: onboarding overlay check", {
              view: appState?.view,
              initialSetupComplete: appState?.initialSetupComplete,
            })}
          {/* Show the legacy OnboardingStepper for general onboarding */}
          {!appState?.initialSetupComplete && <OnboardingStepper />}
          {/* Also surface the neurodivergent onboarding flow for the explicit view */}
          {appState?.view === "neuro-onboarding" && (
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
              <div className="pointer-events-auto w-full max-w-xl px-6">
                {typeof window !== "undefined" &&
                  console.info &&
                  console.info("WORKSHOP: neuro-onboarding rendering")}
                <NeurodivergentOnboarding />
              </div>
            </div>
          )}
        </div>
      )}
      {/* Floating Ask AI Button for E2E */}
      <div className="fixed bottom-6 right-6 z-99999">
        <Suspense fallback={null}>
          <AskGrandmaFloatingLazy />
        </Suspense>
      </div>
      {/* Header (Top) */}
      <header data-workshop-testid="banner">
        <DeepFocusContainer active={appState?.isFocusModeActive}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div className="mb-4 md:mb-0">
              <p className="font-mono text-sm text-accent-teal">
                PROTOCOL 11-22-44 // INTEGRITY CHECK
              </p>
              <h1
                data-workshop-testid="workshop-title"
                className="text-5xl font-extrabold text-accent-teal mt-2"
              >
                DAY <span className="text-text-light">36,525</span>
              </h1>
              <p className="text-text-muted mt-2">● 0 CONFIRMED VICTORIES</p>
            </div>
            <div className="flex flex-col items-end">
              <ContentCard showHeader={false} className="mb-4 max-w-xs w-full">
                <h2 className="text-md font-semibold text-accent-teal">
                  FIELD REPORT
                </h2>
                <p className="text-text-light italic mt-1">
                  Fog of War. Visibility low. Rely on instruments.
                </p>
              </ContentCard>
              <div className="card-base px-4 py-2 rounded-full flex items-center space-x-2">
                <span className="text-sm text-text-muted font-mono">
                  FREE FLIGHT
                </span>
                <span className="text-lg text-accent-teal font-bold">
                  Deep Focus
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-zap text-accent-teal"
                >
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
            </div>
          </div>
        </DeepFocusContainer>
      </header>

      {/* --- ROW 1: AUCTION (Ask Grandma) --- */}
      <ContentCard showHeader={false} className="w-full">
        <WonkyAIModule />
      </ContentCard>

      {/* --- ROW 2: DAY PROGRESS & GROUNDING (Existing) --- */}
      <div className="grid grid-cols-1 gap-6">
        <ContentCard showHeader={true} title="Day Progress">
          <DayProgressBarModule />
        </ContentCard>

        <ContentCard showHeader={true} title="Grounding">
          <div className="flex flex-col items-center justify-center space-y-6">
            <p className="text-text-muted text-sm">
              Take a moment to ground yourself. Feel the connection.
            </p>
            <GroundingRose />
          </div>
        </ContentCard>
      </div>

      {/* --- ROW 2: STATUS TRACKERS (Missing in UI) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* The modules are rendered here in parallel */}
        <StatusTrackerModule />
        <EssentialsTrackerModule />
        <KidsTrackerModule />
      </div>

      {/* --- ROW 3: WORK & CRITICAL TASKS (Missing in UI) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ContentCard title="Workspace Launchpad">
          <WorkspaceLaunchpadModule />
          <div className="mt-4 flex gap-2">
            <Button
              data-testid="test-airlock-btn"
              data-workshop-testid="test-estop-btn"
              variant="danger"
              className="font-bold"
              onClick={handleTestAirlock}
            >
              🛑 Test E-Stop Protocol
            </Button>
            <Button
              variant="secondary"
              className="font-bold"
              onClick={() => {
                dispatch({
                  type: "SET_CONTEXT_RESTORE_MODAL_OPEN",
                  payload: false,
                });
                dispatch({ type: "SET_VIEW", payload: "bio-hacks" });
              }}
            >
              💊 The Apothecary
            </Button>
          </div>
        </ContentCard>
        <CriticalTasks />
      </div>

      {/* --- ROW 4: AI & ACHIEVEMENT --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AchievementTrackerModule />
      </div>
    </div>
  );
};

export default Workshop;
