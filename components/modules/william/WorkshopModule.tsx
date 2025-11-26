// @ts-nocheck
import React, { useState } from "react";
import ContentCard from "../../ContentCard.js";
import { useAppState } from "@contexts/AppStateContext";
import WorkshopProfileBuilderModal from "../../CockpitProfileBuilderModal.js"; // alias kept for migration

const WorkshopModule = () => {
  const { appState, dispatch } = useAppState();
  const [open, setOpen] = useState(false);
  const stacks = appState?.profileStacks || [];
  const activeId = appState?.activeProfileStackId || null;
  const active = stacks.find((s) => s.id === activeId);

  const handleApply = () => {
    if (!activeId) {
      return;
    }
    dispatch({ type: "APPLY_PROFILE_STACK", payload: activeId });
  };

  // Debug mount logs for E2E trace visibility
  React.useEffect(() => {
    try {
      console.log(
        "WorkshopModule mounted, activeId:",
        activeId,
        "stacks:",
        stacks.map((s) => s.id),
      );
    } catch (e) {}
  }, [activeId, stacks]);

  return (
    <ContentCard title="Workshop" titleClassName="text-accent-teal">
      <div className="space-y-3">
        <div>
          <div className="text-sm text-slate-400">Active Stack</div>
          <div
            data-testid="cockpit-active-stack"
            data-workshop-testid="workshop-active-stack"
            data-workshop-testid="workshop-active-stack"
            className="font-semibold"
          >
            {active?.name || "None"}
          </div>
          <div className="flex gap-2 mt-2">
            <button
              data-testid="cockpit-apply-button"
              data-workshop-testid="workshop-apply-button"
              data-workshop-testid="workshop-apply-button"
              onClick={handleApply}
              className="p-2 bg-sanctuary-accent text-white rounded"
            >
              Apply
            </button>
            <button
              data-testid="cockpit-open-builder"
              data-workshop-testid="workshop-open-builder"
              data-workshop-testid="workshop-open-builder"
              onClick={() => setOpen(true)}
              className="p-2 border rounded"
            >
              Open Builder
            </button>
          </div>
        </div>
        <div>
          <div className="text-sm text-slate-400">Quick Stacks</div>
          <div className="flex gap-2 mt-2 flex-wrap">
            {stacks.map((s) => (
              <button
                data-testid={`cockpit-quick-stack-${s.id}`}
                data-workshop-testid={`workshop-quick-stack-${s.id}`}
                data-workshop-testid={`workshop-quick-stack-${s.id}`}
                data-workshop-testid={`workshop-quick-stack-${s.id}`}
                data-workshop-testid={`workshop-quick-stack-${s.id}`}
                key={s.id}
                onClick={() =>
                  dispatch({ type: "SET_ACTIVE_PROFILE_STACK", payload: s.id })
                }
                className={`px-2 py-1 rounded border ${s.id === activeId ? "bg-sanctuary-accent text-white" : ""}`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      {open && (
        <WorkshopProfileBuilderModal
          onClose={() => setOpen(false)}
          existing={active}
        />
      )}
    </ContentCard>
  );
};

export default WorkshopModule;
