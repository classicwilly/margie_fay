import React from "react";
import { Button } from "../../Button";

const themeClasses = {
  info: {
    gradient: "from-sanctuary-focus/10 to-sanctuary-accent/10",
    border: "border-sanctuary-focus/30",
    title: "text-sanctuary-accent",
  },
  warning: {
    gradient: "from-sanctuary-warning/10 to-yellow-500/10",
    border: "border-sanctuary-warning/30",
    title: "text-sanctuary-warning",
  },
  reward: {
    gradient: "from-sanctuary-purple/10 to-pink-500/10",
    border: "border-sanctuary-purple/30",
    title: "text-sanctuary-purple",
  },
};

const SystemNudgeModule = ({ nudge, onDismiss }) => {
  const theme = themeClasses[nudge.theme] || themeClasses.info;

  return (
    <div
      className={`p-6 bg-gradient-to-r ${theme.gradient} rounded-lg shadow-lg border ${theme.border} flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse-slow`}
    >
      <div className="flex items-center gap-4 text-left w-full">
        <div className="text-4xl">{nudge.icon}</div>
        <div>
          <h3 className={`text-2xl font-bold ${theme.title}`}>{nudge.title}</h3>
          <p className="text-sanctuary-text-main">{nudge.message}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0 mt-4 md:mt-0">
        <Button onClick={nudge.onAction} variant="primary" size="sm">
          {nudge.actionLabel}
        </Button>
        <Button
          onClick={() => onDismiss(nudge.id)}
          variant="secondary"
          size="sm"
          aria-label="Dismiss notification"
        >
          &times;
        </Button>
      </div>
    </div>
  );
};

export default SystemNudgeModule;
