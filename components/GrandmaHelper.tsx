import React from 'react';

const GrandmaHelper: React.FC = () => {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex-shrink-0">
        <img
          className="h-16 w-16 rounded-full"
          src="https://i.ibb.co/L8T6P1t/grandma.png" 
          alt="Grandma AI"
        />
      </div>
      <div className="font-mono">
        <h3 className="text-lg font-bold text-accent-500">ASK GRANDMA</h3>
        <p className="text-sm text-text-muted">MARGIE FAY KATEN (1925-2025)</p>
      </div>
    </div>
  );
};

export default GrandmaHelper;
