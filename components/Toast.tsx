import React, { useEffect, useState } from "react";

// FIX: Explicitly typed component with React.FC and a props interface to handle the `key` prop correctly.
interface ToastProps {
  id: string;
  emoji?: string;
  message: string;
  actionLabel?: string;
  onAction?: (id: string) => void;
  onDismiss: (id: string) => void;
}
const Toast: React.FC<ToastProps> = ({ id, emoji, message, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade in
    const entryTimer = setTimeout(() => setIsVisible(true), 10);

    // Schedule fade out and dismissal
    const exitTimer = setTimeout(() => {
      setIsVisible(false);
      const dismissTimer = setTimeout(() => onDismiss(id), 300); // Wait for fade out
      return () => clearTimeout(dismissTimer);
    }, 4000);

    return () => {
      clearTimeout(entryTimer);
      clearTimeout(exitTimer);
    };
  }, [id, onDismiss]);

  return (
    <div
      className={`flex items-center gap-4 bg-card-dark border-2 border-accent-green shadow-lg rounded-lg p-4 transition-all duration-300 ease-in-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      role="alert"
      aria-live="assertive"
    >
      <span className="text-3xl">{emoji}</span>
      <div className="flex items-center gap-4">
        <p className="font-semibold text-accent-green mr-3">{message}</p>
        {actionLabel && (
          <button
            onClick={() => onAction?.(id)}
            className="px-3 py-1 bg-accent-blue text-background-dark rounded text-xs font-semibold"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default Toast;
