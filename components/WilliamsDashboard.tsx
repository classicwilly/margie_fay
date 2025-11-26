import type { FC } from "react";
import { useAppState } from "@contexts/AppStateContext";
import { useSystemHealth } from "../hooks/useSystemHealth";
import DailyBriefingModule from "./modules/william/DailyBriefingModule.tsx";
import DashboardLauncher from "./DashboardLauncher";
import SystemNudgeModule from "./modules/william/SystemNudgeModule";
import { Button } from "./Button";
import { useProactiveAI } from "../hooks/useProactiveAI";
import WorkshopModule from "./modules/william/WorkshopModule";
import ProfileStackBuilder from "../src/components/ProfileStackBuilder";

const WilliamsDashboard: FC = () => {
  const { appState, dispatch } = useAppState();
  const { statusMood, statusEnergy } = appState;
  const { score } = useSystemHealth();
  const nudges = useProactiveAI(appState, dispatch);

  const handleCustomizeDashboard = () => {
    dispatch({ type: "SET_VIEW", payload: "william-dashboard-builder" });
  };

  const handleDismissNudge = (nudgeId: string) => {
    dispatch({ type: "DISMISS_NUDGE", payload: nudgeId });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <header className="flex flex-col sm:flex-row justify-between sm:items-center text-center sm:text-left mb-12 gap-6">
        <div>
          <h1 className="text-5xl font-extrabold text-gradient-accent drop-shadow-lg mb-2">
            Operations Control
          </h1>
          <p className="text-lg text-text-light text-opacity-80 font-medium">
            Systems Online. Frequency Tuned. Welcome back, Pilot.
          </p>
        </div>
        {appState.isModMode && (
          <Button
            onClick={handleCustomizeDashboard}
            variant="primary"
            size="sm"
            className="btn-neon animate-neon"
            aria-label="Customize Dashboard Modules"
          >
            Customize Dashboard
          </Button>
        )}
      </header>

      {nudges.length > 0 && (
        <div className="mb-8">
          <SystemNudgeModule nudge={nudges[0]} onDismiss={handleDismissNudge} />
        </div>
      )}

      {(appState.view === "view-workshop-module" ||
        appState.view === "view-cockpit-module") && <WorkshopModule />}
      {appState.view === "profile-stack-builder" && <ProfileStackBuilder />}

      {!(
        appState.view === "view-workshop-module" ||
        appState.view === "view-cockpit-module" ||
        appState.view === "profile-stack-builder"
      ) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column: Vitals and Module Launcher */}
          <div className="lg:col-span-1 space-y-8">
            <div className="card-base shadow-neon border-neon-green">
              <h2 className="font-bold text-neon-green text-xl mb-4 text-center animate-glow">
                System Vitals
              </h2>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p
                    className={`text-4xl font-bold text-neon-blue animate-neon`}
                  >
                    {score}
                  </p>
                  <p className="text-xs font-semibold text-text-light text-opacity-70">
                    Health
                  </p>
                </div>
                <div>
                  <p className="text-4xl">🧠</p>
                  <p className="text-xs font-semibold text-neon-yellow animate-neon">
                    {statusMood || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-4xl">🔌</p>
                  <p className="text-xs font-semibold text-neon-pink animate-neon">
                    {statusEnergy || "N/A"}
                  </p>
                </div>
              </div>
            </div>
            <DashboardLauncher />
          </div>
          {/* Right Column: Daily Command Module */}
          <div className="lg:col-span-2">
            <DailyBriefingModule />
          </div>
        </div>
      )}
    </div>
  );
};

export default WilliamsDashboard;
