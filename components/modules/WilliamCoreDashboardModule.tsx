import React from "react";
import ContentCard from "../ContentCard";

const WilliamCoreDashboardModule = () => {
  return (
    <ContentCard title="Core Dashboard (DEPRECATED)">
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <p className="text-text-light text-opacity-80 font-semibold">
          This module has been deprecated and replaced.
        </p>
        <p className="text-sm text-text-light text-opacity-80 mt-2">
          Its functionality has been integrated into the 'Daily Command Module',
          which is now the new core module for your dashboard. You can safely
          remove this module in 'Mod Mode'.
        </p>
      </div>
    </ContentCard>
  );
};

export default WilliamCoreDashboardModule;
