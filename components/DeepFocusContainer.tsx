import React from 'react';

interface Props {
  children: React.ReactNode;
  active?: boolean;
}

export const DeepFocusContainer: React.FC<Props> = ({ children, active = false }) => {
  return (
    <div className={`relative w-full h-full border-0 ${active ? 'ring-4 ring-accent-pink/20 rounded-lg' : ''}`}>
      {active && (
        <div className="absolute top-4 right-6 bg-background-dark px-2 text-xs text-accent-pink font-mono tracking-widest rounded">
          DEEP FOCUS
        </div>
      )}
      {children}
    </div>
  );
};

export default DeepFocusContainer;
