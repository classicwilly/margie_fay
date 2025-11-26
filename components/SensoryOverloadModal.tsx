import type { FC } from "react";
import { useAppState } from "@contexts/AppStateContext";

const SensoryOverloadModal: FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { dispatch } = useAppState();

  if (!isOpen) {
    return null;
  }

  const handleActivateBubbleShield = () => {
    dispatch({ type: "SET_VIEW", payload: "bubble-shield-protocol" });
    onClose();
  };

  const handleStartTimer = () => {
    dispatch({ type: "POMODORO_SET_MODE", payload: "shortBreak" });
    dispatch({ type: "POMODORO_TOGGLE" });
    const pomodoro = document.getElementById("module-pomodoro-timer-module");
    if (pomodoro) {
      pomodoro.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    onClose();
  };

  const handleViewFullProtocol = () => {
    dispatch({ type: "SET_VIEW", payload: "sensory-overload" });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="overload-modal-title"
    >
      <div
        className="bg-card-dark rounded-lg shadow-2xl p-8 border-2 border-accent-warning w-full max-w-lg m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="text-center mb-6">
          <h2
            id="overload-modal-title"
            className="text-4xl font-extrabold text-accent-warning animate-pulse-slow"
          >
            🚨 Sensory Overload Detected
          </h2>
          <p className="text-lg text-yellow-300 mt-2">
            Immediate action is recommended to prevent system failure.
          </p>
        </header>

        <div className="space-y-4">
          <button
            onClick={handleActivateBubbleShield}
            className="w-full text-left p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700 flex items-center gap-4"
          >
            <span className="text-3xl">🎧</span>
            <div>
              <h3 className="font-bold text-accent-blue text-xl">
                Activate Bubble Shield
              </h3>
              <p className="text-sm text-text-light text-opacity-70">
                Immediately deploy sensory mitigation hardware.
              </p>
            </div>
          </button>
          <button
            onClick={handleStartTimer}
            className="w-full text-left p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700 flex items-center gap-4"
          >
            <span className="text-3xl">⏱️</span>
            <div>
              <h3 className="font-bold text-accent-blue text-xl">
                Start 5-Min Regulation Timer
              </h3>
              <p className="text-sm text-text-light text-opacity-70">
                Create a structured break for system recovery.
              </p>
            </div>
          </button>
          <button
            onClick={handleViewFullProtocol}
            className="w-full text-left p-4 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors border border-gray-700 flex items-center gap-4"
          >
            <span className="text-3xl">📄</span>
            <div>
              <h3 className="font-bold text-accent-blue text-xl">
                Review Full IPI-SO Protocol
              </h3>
              <p className="text-sm text-text-light text-opacity-70">
                Access the complete emergency procedure.
              </p>
            </div>
          </button>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-700 text-text-light rounded-md hover:bg-gray-600 transition-colors duration-200 font-semibold"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default SensoryOverloadModal;
