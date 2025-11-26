import type { FC } from "react";

interface ModuleIconProps {
  iconPath: string;
  label: string;
  onClick: () => void;
  id?: string;
}
const ModuleIcon: FC<ModuleIconProps> = ({ iconPath, label, onClick, id }) => {
  return (
    <button
      data-testid={id ? `module-launcher-${id}` : undefined}
      onClick={onClick}
      className="flex flex-col items-center justify-center p-3 bg-gray-800 rounded-lg border border-sanctuary-border hover:bg-gray-700 hover:border-sanctuary-focus transition-all text-center group transform hover:-translate-y-1"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-sanctuary-focus mb-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
      </svg>
      <span className="text-xs font-semibold text-sanctuary-text-secondary">
        {label}
      </span>
    </button>
  );
};

export default ModuleIcon;
