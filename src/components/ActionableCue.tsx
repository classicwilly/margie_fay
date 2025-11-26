import type { FC } from "react";

// FIX: Explicitly typed component with React.FC and a props interface to handle the `key` prop correctly.
interface ActionableCueProps {
  text: string;
}
const ActionableCue: FC<ActionableCueProps> = ({ text }) => {
  return (
    <div className="inline-flex items-center px-3 py-1 bg-accent-blue bg-opacity-20 text-accent-blue text-sm font-medium rounded-full mr-2 mb-2 select-none">
      {text}
    </div>
  );
};

export default ActionableCue;
