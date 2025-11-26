import React from "react";
import { useSimplifiedMode } from "../src/contexts/SimplifiedModeContext";

const SimplifiedModeToggle: React.FC = () => {
  const { simplifiedMode, setSimplifiedMode } = useSimplifiedMode();
  return (
    <button
      aria-pressed={simplifiedMode}
      onClick={() => setSimplifiedMode(!simplifiedMode)}
      className="px-3 py-1 border rounded text-sm bg-card-dark border-accent-teal hover:bg-accent-teal/10"
    >
      {simplifiedMode ? "Simplified" : "Standard"}
    </button>
  );
};

export default SimplifiedModeToggle;
