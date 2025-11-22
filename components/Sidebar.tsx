import React from 'react';
import CockpitNavigation from './CockpitNavigation';

const Sidebar: React.FC = () => {
  return (
    <div className="w-20 bg-primary-dark-300 h-screen flex flex-col items-center py-6 shadow-right-neon-md border-r border-primary-dark-200">
      <div className="mb-10">
        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-accent-500 text-white text-xl font-bold">
          WS
        </div>
      </div>
      <div className="flex-1 w-full">
        <CockpitNavigation />
      </div>
    </div>
  );
};

export default Sidebar;
