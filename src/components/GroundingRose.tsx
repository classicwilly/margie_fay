import React, { useState } from "react";
import { useHaptics } from "../../hooks/useHaptics";

interface GroundingRoseProps {
  onActivate?: () => void;
  className?: string;
}

/**
 * GroundingRose component - Emotional core feature for Grandma Edition
 * Provides haptic feedback and visual ripple effect for grounding interactions
 */
export const GroundingRose: React.FC<GroundingRoseProps> = ({
  onActivate,
  className = "",
}) => {
  const { vibrate } = useHaptics();
  const [isRippling, setIsRippling] = useState(false);

  const handleActivate = () => {
    // Trigger haptic feedback
    vibrate(300); // 300ms vibration

    // Trigger visual ripple
    setIsRippling(true);
    setTimeout(() => setIsRippling(false), 600); // Ripple duration

    // Call optional callback
    onActivate?.();
  };

  return (
    <button
      onClick={handleActivate}
      data-testid="grounding-rose-button"
      className={`
        relative overflow-hidden
        bg-gradient-to-br from-rose-100 to-pink-200
        hover:from-rose-200 hover:to-pink-300
        border-2 border-rose-300 hover:border-rose-400
        rounded-full p-6
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-4 focus:ring-rose-300
        active:scale-95
        ${className}
      `}
      aria-label="Activate Grounding Rose"
      type="button"
    >
      {/* Rose SVG Icon */}
      <svg
        viewBox="0 0 24 24"
        className="w-12 h-12 text-rose-600"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM18 6C19.1 6 20 6.9 20 8C20 9.1 19.1 10 18 10C16.9 10 16 9.1 16 8C16 6.9 16.9 6 18 6ZM6 6C7.1 6 8 6.9 8 8C8 9.1 7.1 10 6 10C4.9 10 4 9.1 4 8C4 6.9 4.9 6 6 6ZM12 8C13.66 8 15 9.34 15 11C15 12.66 13.66 14 12 14C10.34 14 9 12.66 9 11C9 9.34 10.34 8 12 8ZM18 12C19.1 12 20 12.9 20 14C20 15.1 19.1 16 18 16C16.9 16 16 15.1 16 14C16 12.9 16.9 12 18 12ZM6 12C7.1 12 8 12.9 8 14C8 15.1 7.1 14 6 14C4.9 14 4 13.1 4 14C4 12.9 4.9 12 6 12ZM12 16C13.66 16 15 17.34 15 19C15 20.66 13.66 22 12 22C10.34 22 9 20.66 9 19C9 17.34 10.34 16 12 16Z" />
      </svg>

      {/* Ripple Effect Overlay */}
      {isRippling && (
        <div
          data-testid="grounding-rose-ripple"
          className="
            absolute inset-0
            bg-rose-400/30
            rounded-full
            animate-ping
          "
          style={{
            animationDuration: "600ms",
          }}
        />
      )}
    </button>
  );
};
