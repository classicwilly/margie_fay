'use client';

import React from 'react';
import Link from 'next/link';
import { ENTRY_POINTS, type EntryPoint } from '@/lib/entryPoints';

export default function EntryPointSelector() {
  const entryPointsList: EntryPoint[] = [
    'crisis',
    'parenting', 
    'kids',
    'community',
    'learning',
    'builder',
    'protocol'
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Where Are You Coming From?</h2>
        <p className="text-slate-400 text-sm">Choose your entry point into the mesh</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {entryPointsList.map((entryKey) => {
          const config = ENTRY_POINTS[entryKey];
          return (
            <Link
              key={entryKey}
              href={config.route}
              className="group block p-3 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800 transition-all hover:border-purple-500/50 hover:-translate-y-1"
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{config.icon}</div>
                <h3 className="text-sm font-bold text-white mb-1">{config.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{config.tagline}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
