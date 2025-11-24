import React from "react";
import { useAppState } from "../src/contexts/AppStateContext";

interface HeaderProps {
  openResetModal: () => void;
}

const Header: React.FC<HeaderProps> = ({ openResetModal }) => {
  const { dispatch } = useAppState();

  return (
    <header className="bg-card-dark border-b border-accent-teal p-4 shadow-lg" data-workshop-testid="banner">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-mono font-bold text-accent-teal">
          Wonky Sprout OS
        </h1>
        <nav className="flex gap-4">
          <button
            onClick={() => dispatch({ type: "SET_VIEW", payload: "dashboard" })}
            className="px-4 py-2 bg-accent-teal text-black rounded-lg font-semibold hover:bg-accent-teal/80"
          >
            Dashboard
          </button>
          <button
            onClick={() => dispatch({ type: "SET_VIEW", payload: "garden" })}
            className="px-4 py-2 bg-accent-pink text-white rounded-lg font-semibold hover:bg-accent-pink/80"
          >
            Garden
          </button>
        </nav>
      </div>
    </header>
  );
};

export { Header };
