import type { FC } from "react";
import GrandmaHelper from "./components/GrandmaHelper";

const WonkyAIModule: FC = () => {
  return (
    <div className="relative bg-gradient-to-br from-background-dark to-primary-dark-300 p-6 rounded-lg shadow-neon-md border border-primary-dark-200 overflow-hidden">
      <GrandmaHelper />
      <div className="absolute right-0 top-0 h-full w-1 bg-accent-400/80"></div>
      <div className="mt-4 relative"></div>
      <button
        aria-label="Ask Grandma quick action"
        title="Ask AI quick action"
        data-testid="ai-quick-action"
        className="absolute -bottom-4 right-6 h-12 w-12 rounded-full bg-yellow-400 ring-4 ring-pink-600/70 shadow-lg flex items-center justify-center text-lg"
        onClick={() => {
          const evt = new CustomEvent("set-ai-query", {
            detail: { value: "Hi Grandpa!" },
          });
          window.dispatchEvent(evt);
        }}
      >
        🍋
      </button>
    </div>
  );
};

export default WonkyAIModule;
