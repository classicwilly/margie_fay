import React from "react";
import { useNeuroPrefs } from "@contexts/NeurodivergentPreferencesContext";

const NeurodivergentOnboarding: React.FC<{ onComplete?: () => void }> = ({
  onComplete,
}) => {
  const { prefs, setPrefs } = useNeuroPrefs();

  const applyPreset = (preset: "autism" | "adhd" | "default") => {
    if (preset === "autism") {
      setPrefs({
        reduceAnimations: true,
        simplifiedUi: true,
        microStepsMode: false,
        assistTone: "concise",
      });
    } else if (preset === "adhd") {
      setPrefs({
        microStepsMode: true,
        focusModeDuration: 15,
        simplifiedUi: true,
        reduceAnimations: false,
        assistTone: "helpful",
      });
    } else {
      setPrefs({
        simplifiedUi: true,
        reduceAnimations: true,
        microStepsMode: true,
      });
    }
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="bg-sanctuary-card p-6 rounded-lg shadow-md max-w-xl mx-auto">
      <h2
        data-testid="neuro-onboarding-title"
        className="text-2xl font-bold mb-4"
      >
        Welcome. You belong here.
      </h2>
      <p className="text-base text-accent-teal mb-2 font-semibold">
        This app is designed for neurodivergent minds—whether you thrive on
        structure, need micro-steps, or crave predictability. Your experience
        matters.
      </p>
      <p className="text-sm text-text-light mb-4">
        Choose a starting point below. You can always adjust your settings
        later. Every choice adapts the app to your unique style.
      </p>
      <div className="flex flex-col gap-3">
        <button
          data-testid="neuro-onboarding-autism"
          className="btn btn-primary"
          onClick={() => applyPreset("autism")}
        >
          Autism-friendly: low-sensory, predictable, concise
        </button>
        <button
          data-testid="neuro-onboarding-adhd"
          className="btn btn-primary"
          onClick={() => applyPreset("adhd")}
        >
          ADHD-friendly: micro steps, focus timer, helpful tone
        </button>
        <button
          data-testid="neuro-onboarding-default"
          className="btn btn-secondary"
          onClick={() => applyPreset("default")}
        >
          Default: balanced, flexible, supportive
        </button>
      </div>
      <div className="mt-4 text-sm text-text-light">
        Current:{" "}
        <span className="font-bold text-accent-teal">{prefs.assistTone}</span>{" "}
        tone ·{" "}
        <span className="font-bold text-accent-teal">
          {prefs.microStepsMode ? "Micro-steps on" : "Micro-steps off"}
        </span>
      </div>
      <div className="mt-6 text-center text-accent-teal text-lg font-semibold">
        You are seen. You are supported.
      </div>
    </div>
  );
};

export default NeurodivergentOnboarding;
