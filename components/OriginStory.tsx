import React from "react";

const NavIcon = ({
  children,
  active = false,
  roleProp,
}: {
  children: React.ReactNode;
  active?: boolean;
  roleProp?: string;
}) => (
  <button
    role={roleProp}
    className={`w-12 h-12 flex items-center justify-center rounded-lg transition-all duration-200 ${
      active
        ? "bg-accent-teal shadow-neon-md text-black"
        : "bg-surface-800 hover:bg-surface-700"
    }`}
  >
    {children}
  </button>
);

const OriginStory: React.FC = () => {
  return (
    <div className="min-h-screen bg-background-dark text-text-light">
      <div className="flex">
        {/* Left nav */}
        <aside className="w-20 p-4 flex flex-col items-center gap-4 bg-surface-900 border-r border-gray-800 shadow-inner">
          <ul
            role="menu"
            aria-label="main navigation"
            aria-orientation="vertical"
            className="flex flex-col gap-3 list-none p-0 m-0"
          >
            <li role="none">
              <NavIcon roleProp="menuitem" active>
                WS
              </NavIcon>
            </li>
            <li role="none">
              <NavIcon roleProp="menuitem">🗂</NavIcon>
            </li>
            <li role="none">
              <NavIcon roleProp="menuitem">📦</NavIcon>
            </li>
            <li role="none">
              <NavIcon roleProp="menuitem">⚗️</NavIcon>
            </li>
            <li role="none">
              <NavIcon roleProp="menuitem">⚙️</NavIcon>
            </li>
          </ul>
          <div className="mt-auto pb-4">
            <NavIcon>🍋</NavIcon>
          </div>
        </aside>

        {/* Main content */}
        <main
          className="flex-1 p-8 max-w-[1200px] mx-auto"
          data-workshop-testid="main-content"
        >
          {/* Top banner */}
          <div
            className="rounded-2xl border border-neon-purple p-6 bg-linear-to-r from-surface-800 to-surface-750 shadow-neon animate-glow mb-8"
            data-workshop-testid="banner"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs uppercase text-accent-pink tracking-widest mb-2">
                  Protocol 11-22-44 // Integrity check
                </div>
                <h2
                  className="text-4xl md:text-5xl font-extrabold text-white"
                  data-workshop-testid="workshop-title"
                >
                  DAY 36,527
                </h2>
                <div className="text-sm text-text-light mt-2">
                  ● 0 CONFIRMED VICTORIES
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm uppercase text-accent-teal font-bold">
                  Field Report
                </div>
                <div className="italic text-text-muted mt-2">
                  Fog of War. Visibility low. Rely on instruments.
                </div>
              </div>
            </div>
          </div>

          {/* Ask Grandma Card */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div
              className="col-span-2 rounded-2xl border border-neon-purple p-6 bg-card-dark shadow-neon flex flex-col"
              data-workshop-testid="ask-grandma-card"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-14 h-14 rounded-full bg-surface-800 border border-accent-pink text-accent-pink">
                  🙂
                </div>
                <div>
                  <div className="text-accent-pink font-bold uppercase">
                    Ask Grandma
                  </div>
                  <div className="text-sm text-text-muted">
                    Margie Fay Katen (1925-2025)
                  </div>
                </div>
              </div>

              <div className="mt-6 flex-1">
                <textarea
                  placeholder="What's overwhelming you, honey?"
                  className="w-full h-32 rounded-md bg-surface-800 border border-surface-700 p-4 text-text-light placeholder:text-text-muted"
                  data-workshop-testid="grandma-input"
                />
              </div>

              <div className="mt-4 bg-surface-900 p-4 rounded-md border border-surface-700">
                <div className="text-sm text-neutral-200">Response</div>
                <div
                  data-workshop-testid="grandma-output"
                  className="mt-2 p-2 rounded-md bg-surface-800 border border-surface-700 text-text-light"
                >
                  Love, Grandma
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-text-muted">
                  Powered by: Grandma AI
                </div>
                <button className="py-2 px-4 bg-accent-pink text-white rounded-md font-bold">
                  Ask
                </button>
              </div>
            </div>

            {/* Right column: Initialize panel */}
            <div className="rounded-2xl border border-surface-700 p-6 bg-card-dark shadow-sm flex flex-col items-stretch justify-between">
              <label className="text-sm font-bold text-text-muted mb-2">
                Input operational parameter
              </label>
              <input
                className="w-full rounded-md bg-surface-800 p-3 border border-surface-700 text-text-light"
                placeholder="Input operational parameter..."
              />
              <div className="mt-4">
                <button className="w-full py-3 bg-accent-teal text-black font-bold rounded-md">
                  INITIALIZE
                </button>
              </div>
            </div>
          </section>

          {/* Active Objectives */}
          <div className="rounded-lg border border-surface-700 p-4 bg-surface-800">
            <div className="text-xs uppercase text-text-muted mb-2">
              Active Objectives (0)
            </div>
            <div className="text-text-muted text-sm">
              No objectives at this time.
            </div>
          </div>

          {/* Grounding area */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="rounded-lg border border-surface-700 p-4 bg-card-dark">
              <div className="flex items-center justify-between">
                <div className="font-bold">Grounding</div>
                <button className="bg-accent-teal text-black py-1 px-2 rounded text-sm">
                  Activate
                </button>
              </div>
              <div
                className="mt-4"
                data-workshop-testid="grounding-rose-ripple"
              >
                (visual ripple)
              </div>
            </div>

            {/* Airlock / restore button */}
            <div className="rounded-lg border border-surface-700 p-4 bg-card-dark">
              <div className="font-bold mb-2">Test E-Stop Protocol</div>
              <div className="text-sm text-text-muted mb-4">
                Open the modal to test decompression and restore
              </div>
              <div>
                <button
                  className="py-2 px-3 bg-accent-pink text-white rounded"
                  data-workshop-testid="context-restore-restore-btn"
                >
                  Restore
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Lemon floating button (quick action) */}
      <button
        className="fixed right-6 bottom-6 w-16 h-16 rounded-full bg-accent-pink shadow-neon text-white flex items-center justify-center text-xl border-2 border-accent-teal"
        aria-label="Quick Action"
      >
        🍋
      </button>
    </div>
  );
};

export default OriginStory;
