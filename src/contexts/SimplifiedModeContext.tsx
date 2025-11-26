import React, { createContext, useContext, useEffect, useState } from "react";

interface SimplifiedModeContextShape {
  simplifiedMode: boolean;
  setSimplifiedMode: (v: boolean) => void;
}

const SimplifiedModeContext = createContext<SimplifiedModeContextShape | null>(
  null,
);

export const SimplifiedModeProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [simplifiedMode, setSimplifiedMode] = useState<boolean>(() => {
    try {
      const v = localStorage.getItem("simplified_mode");
      return v === "true";
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        "simplified_mode",
        simplifiedMode ? "true" : "false",
      );
    } catch (e) {
      // Ignore
    }
    if (typeof document !== "undefined") {
      if (simplifiedMode) {
        document.body.classList.add("simplified-mode");
      } else {
        document.body.classList.remove("simplified-mode");
      }
    }
  }, [simplifiedMode]);

  return (
    <SimplifiedModeContext.Provider
      value={{ simplifiedMode, setSimplifiedMode }}
    >
      {children}
    </SimplifiedModeContext.Provider>
  );
};

export function useSimplifiedMode() {
  const ctx = useContext(SimplifiedModeContext);
  if (!ctx) {
    throw new Error(
      "useSimplifiedMode must be used within a SimplifiedModeProvider",
    );
  }
  return ctx;
}

export default SimplifiedModeProvider;
