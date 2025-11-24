import React from "react";

// Static Fallback to stop the crash (perf / measurement hooks removed)
const DayProgressBarModule: React.FC = () => {
  return (
    <div className="p-4 bg-card-dark rounded-lg shadow-md border border-gray-700">
      <h2 className="text-2xl font-bold text-accent-green mb-4">
        Day Progress
      </h2>
      <div className="flex items-center gap-4">
        <span className="font-mono text-sm text-accent-teal">06:00</span>
        <div className="w-full bg-gray-700 rounded-full h-4">
          <div className={`h-4 rounded-full bg-accent-blue w-[45%]`} />
        </div>
        <span className="font-mono text-sm text-accent-teal">22:30</span>
      </div>
    </div>
  );
};

export default DayProgressBarModule;

/* Old implementation removed — static fallback retained above */
