interface AdviceProps {
  task?: string;
  onStartTimer?: (minutes?: number) => void; // Optional hook for e2e and unit tests
}

function makeGrandpaAdvice(task = "this task") {
  // Grandpa: calm, practical, anecdotal, timeboxed guidance
  return `If I were you, I'd start with the simplest part of ${task} — just one tiny step. Set a 15-minute timer and do nothing else. After that, reassess. If it went well, do the next tiny step. If not, take a break and try again later.`;
}

export default function GrandpaHelper({ task, onStartTimer }: AdviceProps) {
  const advice = makeGrandpaAdvice(task);
  const startTimer = (mins = 15) => {
    try {
      if (typeof onStartTimer === "function") {
        onStartTimer(mins);
      }
    } catch (e) {
      /* ignore */
    }
    // Store a local representation for E2E/diagnostics convenience
    if (typeof window !== "undefined") {
      try {
        const now = Date.now();
        window.localStorage.setItem("grandpa.timerStartedAt", String(now));
        window.localStorage.setItem("grandpa.timerMinutes", String(mins));
      } catch (e) {
        /* ignore */
      }
    }
  };
  return (
    <div
      className="p-4 bg-white rounded shadow-md"
      data-workshop-testid="grandpa-output"
    >
      <h2 className="text-xl font-semibold">Grandpa's Advice</h2>
      <p className="mt-3 text-gray-800">{advice}</p>
      <div className="mt-4 text-sm text-gray-600">
        <em>
          Short, calm, practical guidance — 15 minute timebox, one tiny step.
        </em>
      </div>
      <div className="mt-4">
        <button
          className="px-3 py-2 bg-accent-teal text-black rounded-md text-sm font-semibold"
          data-workshop-testid="grandpa-choice-start"
          aria-label="Grandpa's Choice: Start 15-minute Timer"
          onClick={() => startTimer(15)}
        >
          Grandpa's Choice: Start 15-minute Timer
        </button>
      </div>
    </div>
  );
}
