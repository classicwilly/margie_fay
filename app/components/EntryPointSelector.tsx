'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ENTRY_POINTS, type EntryPoint } from '@/lib/entryPoints';

export default function EntryPointSelector() {
  const [selectedEntry, setSelectedEntry] = useState<EntryPoint | null>(null);

  const entryPointsList: EntryPoint[] = [
    'crisis',
    'parenting', 
    'kids',
    'community',
    'learning',
    'builder',
    'protocol'
  ];

  const colors = {
    red: 'from-red-600 to-red-700 border-red-500/50',
    blue: 'from-blue-600 to-blue-700 border-blue-500/50',
    purple: 'from-purple-600 to-purple-700 border-purple-500/50',
    green: 'from-green-600 to-green-700 border-green-500/50',
    amber: 'from-amber-600 to-amber-700 border-amber-500/50',
    indigo: 'from-indigo-600 to-indigo-700 border-indigo-500/50',
    slate: 'from-slate-600 to-slate-700 border-slate-500/50'
  };

  const hoverColors = {
    red: 'hover:border-red-400/70',
    blue: 'hover:border-blue-400/70',
    purple: 'hover:border-purple-400/70',
    green: 'hover:border-green-400/70',
    amber: 'hover:border-amber-400/70',
    indigo: 'hover:border-indigo-400/70',
    slate: 'hover:border-slate-400/70'
  };

  if (selectedEntry) {
    const config = ENTRY_POINTS[selectedEntry];
    
    return (
      <div className="bg-slate-900/50 border border-slate-700 rounded-2xl p-8">
        <button
          onClick={() => setSelectedEntry(null)}
          className="text-slate-400 hover:text-white mb-6 inline-flex items-center gap-2"
        >
          ← Back to all entry points
        </button>

        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{config.icon}</div>
          <h2 className="text-3xl font-bold text-white mb-3">{config.title}</h2>
          <p className="text-xl text-slate-400 mb-6">{config.tagline}</p>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Your Situation:</h3>
            <p className="text-slate-300">{config.painPoint}</p>
          </div>

          <div className={`bg-linear-to-br ${colors[config.color as keyof typeof colors]} border rounded-lg p-6`}>
            <h3 className="text-lg font-semibold text-white mb-3">Start Here:</h3>
            <p className="text-white">{config.immediateAction}</p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Your Journey:</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
                <p className="text-slate-300 pt-1">{config.journey.step1}</p>
              </div>
              <div className="flex gap-3">
                <div className="shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
                <p className="text-slate-300 pt-1">{config.journey.step2}</p>
              </div>
              <div className="flex gap-3">
                <div className="shrink-0 w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
                <p className="text-slate-300 pt-1">{config.journey.step3}</p>
              </div>
              <div className="flex gap-3">
                <div className="shrink-0 w-8 h-8 bg-linear-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm">
                  ▲
                </div>
                <p className="text-white font-medium pt-1">{config.journey.revelation}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Link
              href={`/modules/${config.moduleId}`}
              className={`flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 text-lg font-semibold text-white bg-linear-to-r ${colors[config.color as keyof typeof colors]} rounded-xl hover:opacity-90 transition-all`}
            >
              Start Now
              <span>→</span>
            </Link>
            <Link
              href="/docs"
              className="px-6 py-4 text-lg font-semibold text-slate-200 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-3">
          Where Are You Right Now?
        </h2>
        <p className="text-xl text-slate-400">
          Choose your entry point. All roads lead to resilience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {entryPointsList.map((entryId) => {
          const config = ENTRY_POINTS[entryId];
          
          return (
            <button
              key={entryId}
              onClick={() => setSelectedEntry(entryId)}
              className={`text-left bg-slate-900/50 border rounded-xl p-6 transition-all ${hoverColors[config.color as keyof typeof hoverColors]} hover:bg-slate-900/70`}
            >
              <div className="text-4xl mb-3">{config.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">
                {config.title}
              </h3>
              <p className="text-slate-400 text-sm">
                {config.tagline}
              </p>
            </button>
          );
        })}
      </div>

      <div className="text-center">
        <p className="text-slate-500 text-sm">
          Not sure where to start? That's okay. Pick what feels most urgent.
        </p>
      </div>
    </div>
  );
}
