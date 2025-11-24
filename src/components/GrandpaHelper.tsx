import React from "react";

interface AdviceProps {
  task?: string;
}

function makeGrandpaAdvice(task = "this task") {
  // Grandpa: calm, practical, anecdotal, timeboxed guidance
  return `If I were you, I'd start with the simplest part of ${task} — just one tiny step. Set a 15-minute timer and do nothing else. After that, reassess. If it went well, do the next tiny step. If not, take a break and try again later.`;
}

export default function GrandpaHelper({ task }: AdviceProps) {
  const advice = makeGrandpaAdvice(task);
  return (
    <div className="p-4 bg-white rounded shadow-md" data-workshop-testid="grandpa-output">
      <h2 className="text-xl font-semibold">Grandpa's Advice</h2>
      <p className="mt-3 text-gray-800">{advice}</p>
      <div className="mt-4 text-sm text-gray-600">
        <em>
          Short, calm, practical guidance — 15 minute timebox, one tiny step.
        </em>
      </div>
    </div>
  );
}
