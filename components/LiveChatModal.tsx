import type { FC, MouseEvent } from "react";
import LiveChatModule from "./modules/william/LiveChatModule.js";

interface LiveChatModalProps {
  onClose?: (e?: MouseEvent<HTMLDivElement>) => void;
}

const LiveChatModal: FC<LiveChatModalProps> = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-40 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="live-chat-title"
    >
      <div
        className="bg-card-dark rounded-lg shadow-2xl border border-gray-700 w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2
            id="live-chat-title"
            className="text-xl font-bold text-accent-teal"
          >
            Live Chat Controller
          </h2>
          <button
            onClick={(e) => onClose?.(e)}
            className="text-gray-400 hover:text-white text-2xl"
            aria-label="Close modal"
          >
            &times;
          </button>
        </header>
        <div className="p-4">
          <LiveChatModule />
        </div>
      </div>
    </div>
  );
};

export default LiveChatModal;
