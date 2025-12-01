import React from 'react';

const WillowsDashboard = () => (
  <div>
    <h1 data-testid="kids-corner-heading" className="text-3xl font-bold mb-4">Willow&apos;s Corner</h1>
    <section data-testid="kids-reward-store" className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Reward Store</h2>
      {/* Rewards UI goes here */}
    </section>
    <section data-testid="kids-gem-collection" className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Gem Collection</h2>
      {/* Gem collection UI goes here */}
    </section>
  </div>
);

export default WillowsDashboard;
