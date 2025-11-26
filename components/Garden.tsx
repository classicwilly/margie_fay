import type { FC } from "react";

const Garden: FC = () => {
  return (
    <div className="card-base bg-card-dark rounded-lg shadow-lg border border-accent-teal p-8">
      <h1 className="text-3xl font-mono font-bold text-accent-teal mb-6 border-b border-surface-700 pb-2">
        Fay's Flight Deck - Garden
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-base bg-card-dark rounded-lg shadow-lg border border-accent-pink p-6">
          <h2 className="text-xl font-semibold text-accent-pink mb-4">
            Living Sprouts
          </h2>
          <p className="text-sm">Monitor your growing tasks and connections.</p>
        </div>
        <div className="card-base bg-card-dark rounded-lg shadow-lg border border-accent-green p-6">
          <h2 className="text-xl font-semibold text-accent-green mb-4">
            Sprout Overview
          </h2>
          <p className="text-sm">Visual summary of system health and legacy.</p>
        </div>
      </div>
    </div>
  );
};

export default Garden;
