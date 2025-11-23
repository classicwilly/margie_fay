import React from 'react';

export const Skeleton: React.FC<{ lines?: number }> = ({ lines = 3 }) => (
  <div className="space-y-2 w-full">
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className="h-4 bg-gray-700 rounded animate-pulse" />
    ))}
  </div>
);

export default Skeleton;
