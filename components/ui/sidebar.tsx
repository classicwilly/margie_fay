import React from "react";
import WorkshopNavigation from "./WorkshopNavigation";

const Sidebar: React.FC = () => {
  return (
    <div className="w-20 bg-surface-800 h-screen flex flex-col items-center py-6 shadow-right-neon-md border-r border-accent-teal">
      <div className="mb-10">
        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-accent-teal text-background-dark text-xl font-extrabold shadow-neon-sm">
          WS
        </div>
      </div>
      <div className="flex-1 w-full">
        <WorkshopNavigation />
      </div>
    </div>
  );
};

export default Sidebar;
