'use client';

import React from 'react';
import Link from 'next/link';
import { VERTEX_CONFIGS, VERTEX_COLORS, VertexType } from '../types/vertex';

export default function VertexNavigator() {
  const vertices: VertexType[] = ['technical', 'emotional', 'practical', 'philosophical'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {vertices.map((vertexType) => {
        const config = VERTEX_CONFIGS[vertexType];
        const colors = VERTEX_COLORS[vertexType];

        return (
          <Link
            key={vertexType}
            href={"/vertex/" + vertexType}
            className="group block p-4 rounded-xl border border-slate-700 bg-slate-800/50 hover:bg-slate-800 transition-all hover:border-opacity-100 hover:shadow-xl hover:-translate-y-1"
            style={{
              borderColor: colors.main + '40',
            }}
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                style={{ backgroundColor: colors.main + '20' }}
              >
                {config.icon}
              </div>
              <div>
                <h3
                  className="text-lg font-bold mb-1"
                  style={{ color: colors.main }}
                >
                  {config.name}
                </h3>
                <p className="text-xs text-slate-400 mb-2">
                  {config.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-500 justify-center">
                  <span>{config.documents.length} docs</span>
                  <span>•</span>
                  <span>{config.connectedEdges.length} edges</span>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
