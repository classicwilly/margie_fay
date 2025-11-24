import React, { useEffect } from "react";
import { useOscilloscope } from "@contexts/OscilloscopeContext";

interface Props {
  children: React.ReactNode;
}

export const DeepFocusContainer: React.FC<Props> = ({ children }) => {
  const { dispatch } = useOscilloscope();

  useEffect(() => {
    // On Mount: Enter Deep Work (using canonical provider interface)
    dispatch({ type: "SET_FOCUS_MODE", payload: "laser" });

    // On Unmount: Return to Neutral (unless specific logic overrides)
    return () => {
      dispatch({ type: "SET_FOCUS_MODE", payload: "none" });
    };
  }, [dispatch]);

  return (
    <div className="relative w-full h-full border-2 border-accent-pink/30 rounded-lg p-1">
      <div className="absolute top-0 right-0 -mt-3 mr-4 bg-background-dark px-2 text-xs text-accent-pink font-mono tracking-widest">
        DEEP FOCUS PROTOCOL ACTIVE
      </div>
      {children}
    </div>
  );
};
export default DeepFocusContainer;
