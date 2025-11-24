import Workshop from "./Workshop";

// Backward-compatible re-export: Workshop for legacy imports
export { Workshop as Workshop };
export default Workshop;
      {/* Header (Top) */}
      <DeepFocusContainer active={appState?.isFocusModeActive}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="mb-4 md:mb-0">
            <p className="font-mono text-sm text-accent-teal">
              PROTOCOL 11-22-44 // INTEGRITY CHECK
            </p>
            <h1
              data-testid="cockpit-title" data-workshop-testid="workshop-title" className="text-5xl font-extrabold text-accent-teal mt-2"
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

export { Workshop };
export default Cockpit;
