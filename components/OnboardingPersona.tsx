import { useState } from "react";
import type { FC } from "react";
import { useAppState } from "../src/contexts/AppStateContext";

const OnboardingPersona: FC<{ onNext: () => void }> = ({ onNext }) => {
  const { appState, dispatch } = useAppState();
  const [selection, setSelection] = useState<"dugout" | "garden">(
    (appState.dashboardType === "william" ? "dugout" : "garden") as any,
  );

  const handleSelect = (val: "dugout" | "garden") => {
    setSelection(val);
    // Set persona token
    dispatch({
      type: "SET_DASHBOARD_TYPE",
      payload: val === "dugout" ? "william" : "willow",
    });
    // Persist theme token in state via neuro prefs or persona override
    if (val === "dugout") {
      dispatch({ type: "SET_NEURO_PREFS", payload: { simplifiedUi: false } });
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold">Choose your experience</h3>
      <p className="text-sm text-text-muted">
        Pick the layout that makes you feel most productive.
      </p>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <button
          className={`p-4 rounded-md ${selection === "dugout" ? "border-neon-orange border-2" : "bg-surface-800"}`}
          onClick={() => handleSelect("dugout")}
        >
          <div className="text-xl font-bold">Bob's Dugout</div>
          <div className="text-sm text-text-muted">
            Tactical, quick, action-first.
          </div>
        </button>
        <button
          className={`p-4 rounded-md ${selection === "garden" ? "border-neon-green border-2" : "bg-surface-800"}`}
          onClick={() => handleSelect("garden")}
        >
          <div className="text-xl font-bold">Marge's Garden</div>
          <div className="text-sm text-text-muted">
            Calm, nurturing, checklist-first.
          </div>
        </button>
      </div>
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => dispatch({ type: "SET_ONBOARDING_STEP", payload: 0 })}
          className="text-text-muted"
        >
          Back
        </button>
        <button className="btn-primary" onClick={onNext}>
          Next
        </button>
      </div>
    </div>
  );
};

export default OnboardingPersona;
