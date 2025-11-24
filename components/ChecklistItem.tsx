import React from "react";
import { useAppState } from "@contexts/AppStateContext";

interface ChecklistItemProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  large?: boolean;
  gemAwardId?: string;
  gemRecipient?: "willow" | "sebastian";
  achievementAwardId?: string;
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({
  id,
  children,
  className = "",
  large = false,
  gemAwardId,
  gemRecipient,
  achievementAwardId,
}) => {
  const { appState, dispatch } = useAppState();
  const checked = !!appState.checkedItems[id];

  const checkboxSize = large ? "h-6 w-6" : "h-5 w-5";
  const labelSize = large ? "text-lg" : "";

  const handleChange = () => {
    const isCheckingOn = !checked;
    dispatch({ type: "TOGGLE_CHECKED", payload: id });

    if (isCheckingOn) {
      if (gemAwardId && gemRecipient) {
        dispatch({
          type: "ADD_GEM",
          payload: { id: gemAwardId, recipient: gemRecipient },
        });
      }
      if (achievementAwardId) {
        dispatch({ type: "ADD_ACHIEVEMENT", payload: achievementAwardId });
      }
    }
  };

  return (
    <li className={`flex items-start my-2 ${className}`}>
      <label
        htmlFor={id}
        className={`flex items-center cursor-pointer text-text-light text-opacity-90 hover:text-opacity-100 transition-opacity w-full ${labelSize}`}
      >
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          className={`${checkboxSize} rounded bg-gray-700 border-gray-600 text-accent-blue focus:ring-accent-blue focus:ring-offset-background-dark focus:ring-2 mr-4 flex-shrink-0`}
        />
        <span
          className={`${checked ? "line-through text-text-light text-opacity-50" : ""} break-words`}
        >
          {children}
        </span>
      </label>
    </li>
  );
};

export default ChecklistItem;
