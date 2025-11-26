const SebastiansDashboard = () => (
  <div className="card-base bg-card-dark rounded-lg shadow-lg border border-accent-teal p-8">
    <h1
      data-testid="kids-corner-heading"
      data-workshop-testid="kids-corner-heading"
      className="text-3xl font-mono font-bold text-accent-teal mb-6 border-b border-surface-700 pb-2"
    >
      Sebastian's Corner
    </h1>
    <section
      data-testid="kids-reward-store"
      data-workshop-testid="kids-reward-store"
      className="mb-8"
    >
      <h2 className="text-xl font-semibold text-accent-pink mb-4">
        Reward Store
      </h2>
      {/* Rewards UI goes here */}
    </section>
    <section
      data-testid="kids-gem-collection"
      data-workshop-testid="kids-gem-collection"
      className="mb-4"
    >
      <h2 className="text-xl font-semibold text-accent-green mb-4">
        Gem Collection
      </h2>
      {/* Gem collection UI goes here */}
    </section>
  </div>
);

export default SebastiansDashboard;
