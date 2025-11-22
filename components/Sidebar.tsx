import React from 'react';
import { Home, LayoutGrid, Folder, FlaskConical, Settings, Workflow } from 'lucide-react';

const Sidebar: React.FC = () => {
  return (
    <div className="w-20 bg-primary-dark-300 h-screen flex flex-col items-center py-6 shadow-right-neon-md border-r border-primary-dark-200">
      <div className="mb-10">
        <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-accent-500 text-white text-xl font-bold">
          WS
        </div>
      </div>
      <nav className="flex flex-col space-y-8">
        <Home className="text-text-muted hover:text-accent-500 cursor-pointer transition-colors" size={28} />
        <LayoutGrid className="text-text-muted hover:text-accent-500 cursor-pointer transition-colors" size={28} />
        <Folder className="text-text-muted hover:text-accent-500 cursor-pointer transition-colors" size={28} />
        <FlaskConical className="text-text-muted hover:text-accent-500 cursor-pointer transition-colors" size={28} />
        <Settings className="text-text-muted hover:text-accent-500 cursor-pointer transition-colors" size={28} />
        <Workflow className="text-text-muted hover:text-accent-500 cursor-pointer transition-colors" size={28} />
      </nav>
    </div>
  );
};

export default Sidebar;
