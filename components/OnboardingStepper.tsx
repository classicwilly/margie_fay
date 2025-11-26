import type { FC } from "react";
import OnboardingPersona from "./OnboardingPersona";
import OnboardingGoogleConnect from "./OnboardingGoogleConnect";
import OnboardingAIConsent from "./OnboardingAIConsent";
import { useAppState } from "../src/contexts/AppStateContext";

const steps = ["persona", "prefs", "family", "google", "ai", "demo"];

const OnboardingStepper: FC = () => {
  const { appState, dispatch } = useAppState();
  const step = appState.onboardingStep || 0;

  const next = () =>
    dispatch({
      type: "SET_ONBOARDING_STEP",
      payload: Math.min(step + 1, steps.length - 1),
    });
  const prev = () =>
    dispatch({ type: "SET_ONBOARDING_STEP", payload: Math.max(step - 1, 0) });

  const finish = () =>
    dispatch({ type: "SET_INITIAL_SETUP_COMPLETE", payload: true });

  return (
    <div className="onboarding-fixed-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-3xl bg-card-dark p-6 rounded-md border border-surface-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Welcome to Wonky Sprout</h2>
          <div className="flex items-center gap-2">
            <button
              className="text-sm text-text-muted"
              onClick={() => {
                dispatch({
                  type: "SET_ONBOARDING_STEP",
                  payload: steps.length - 1,
                });
              }}
            >
              Skip
            </button>
            <button className="btn-primary" onClick={() => finish()}>
              Finish
            </button>
          </div>
        </div>
        <div className="mb-6">
          {step === 0 && <OnboardingPersona onNext={next} />}
          {step === 1 && (
            <div>
              Preferences (simplified UI, animations toggle){" "}
              <div className="mt-4">
                <button className="btn-primary" onClick={next}>
                  Next
                </button>
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              Family Setup (Add family members){" "}
              <div className="mt-4">
                <button className="btn-primary" onClick={next}>
                  Next
                </button>
              </div>
            </div>
          )}
          {step === 3 && <OnboardingGoogleConnect onNext={next} />}
          {step === 4 && <OnboardingAIConsent onNext={next} />}
          {step === 5 && (
            <div>
              <h3 className="text-lg font-semibold">Demo</h3>
              <p className="text-sm text-text-muted">
                Create a sample routine to see how automation works.
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  className="btn-primary"
                  onClick={() => {
                    /* demo create */
                  }}
                >
                  Create Demo Routine
                </button>
                <button className="btn-primary" onClick={() => finish()}>
                  Finish
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <button onClick={prev} className="text-sm text-text-muted">
            Back
          </button>
          <div className="text-sm text-text-muted">
            Step {step + 1} / {steps.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingStepper;
