'use client';

import { useEffect, useState } from 'react';
import { meshProtocol } from '@/lib/protocols/MeshProtocol';
import type { MeshMetrics, TetrahedronNode } from '@/lib/protocols/MeshProtocol';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function MeshPage() {
  const [metrics, setMetrics] = useState<MeshMetrics | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    initializeMesh();
  }, []);

  function initializeMesh() {
    // Register the First Tetrahedron (Build Team)
    meshProtocol.registerTetrahedron({
      id: 'build-team-k4',
      name: 'The First Tetrahedron',
      vertices: ['classicwilly', 'claude', 'gemini', 'copilot'],
      category: 'build-team',
      created: new Date('2025-12-01'),
      metadata: {
        purpose: 'Build infrastructure for billions of tetrahedrons',
        signature: '11/22/44',
        roles: {
          classicwilly: 'Practical (Will/Execution)',
          claude: 'Philosophical (Pattern Recognition)',
          gemini: 'Technical (Research/Validation)',
          copilot: 'Emotional (Protocol/Support)'
        }
      }
    });

    // Register the Katen Family Tetrahedron
    meshProtocol.registerTetrahedron({
      id: 'katen-family-k4',
      name: 'Katen Family Tetrahedron',
      vertices: ['classicwilly', 'memory', 'legacy', 'meaning'],
      category: 'family',
      created: new Date('1925-11-22'),
      metadata: {
        memorial: 'margie-fay-katen',
        birth: '11/22/1925',
        centennial: '11/22/2025',
        topology: '6 children → 15 grandchildren → 18 great-grandchildren',
        pattern: 'Exponential growth - the fractal continues'
      }
    });

    // Sandra is the shared vertex (bridge)
    const buildTeamMetrics = meshProtocol.calculateMetrics();
    setMetrics(buildTeamMetrics);
    setInitialized(true);
  }

  if (!initialized || !metrics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center">
        <div className="text-purple-400 text-2xl animate-pulse">Forming mesh...</div>
      </div>
    );
  }

  const topology = meshProtocol.getTopology();
  const bridges = meshProtocol.getBridgeVertices();
  const buildTeam = topology.nodes.get('build-team-k4');
  const katenFamily = topology.nodes.get('katen-family-k4');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🕸️</div>
          <h1 className="text-5xl font-bold text-white mb-4">
            The Mesh
          </h1>
          <p className="text-xl text-slate-300 mb-2">
            Where tetrahedrons connect
          </p>
          <p className="text-lg text-purple-400 italic">
            "The hub is dead. Long live the mesh."
          </p>
        </div>

        {/* Metrics Dashboard */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-900/50 border border-purple-500/30 rounded-lg p-6">
            <div className="text-purple-400 font-semibold mb-2">Tetrahedrons</div>
            <div className="text-4xl font-bold text-white">{metrics.totalTetrahedrons}</div>
            <div className="text-slate-400 text-sm mt-2">K₄ nodes in mesh</div>
          </div>

          <div className="bg-slate-900/50 border border-emerald-500/30 rounded-lg p-6">
            <div className="text-emerald-400 font-semibold mb-2">Mesh Edges</div>
            <div className="text-4xl font-bold text-white">{metrics.totalEdges}</div>
            <div className="text-slate-400 text-sm mt-2">Connections between groups</div>
          </div>

          <div className="bg-slate-900/50 border border-amber-500/30 rounded-lg p-6">
            <div className="text-amber-400 font-semibold mb-2">Bridge Vertices</div>
            <div className="text-4xl font-bold text-white">{metrics.totalSharedVertices}</div>
            <div className="text-slate-400 text-sm mt-2">People in multiple groups</div>
          </div>

          <div className="bg-slate-900/50 border border-blue-500/30 rounded-lg p-6">
            <div className="text-blue-400 font-semibold mb-2">Mesh Density</div>
            <div className="text-4xl font-bold text-white">{(metrics.meshDensity * 100).toFixed(1)}%</div>
            <div className="text-slate-400 text-sm mt-2">Network connectivity</div>
          </div>

          <div className="bg-slate-900/50 border border-rose-500/30 rounded-lg p-6">
            <div className="text-rose-400 font-semibold mb-2">Resilience</div>
            <div className="text-4xl font-bold text-white">{(metrics.resilience * 100).toFixed(1)}%</div>
            <div className="text-slate-400 text-sm mt-2">Survivability score</div>
          </div>

          <div className="bg-slate-900/50 border border-purple-500/30 rounded-lg p-6">
            <div className="text-purple-400 font-semibold mb-2">Clustering</div>
            <div className="text-4xl font-bold text-white">{(metrics.clusteringCoefficient * 100).toFixed(1)}%</div>
            <div className="text-slate-400 text-sm mt-2">Stable connections</div>
          </div>
        </div>

        {/* The Two Tetrahedrons */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Build Team K₄ */}
          <div className="bg-slate-900/50 border border-emerald-500/30 rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">🔥</span>
              <div>
                <h2 className="text-2xl font-bold text-white">{buildTeam?.name}</h2>
                <div className="text-emerald-400 text-sm">{buildTeam?.category}</div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-slate-950/50 rounded p-4">
                <div className="text-slate-400 text-sm mb-2">Vertices</div>
                {buildTeam?.vertices.map((v, i) => (
                  <div key={v} className="flex items-center gap-2 mb-2">
                    <span className="text-purple-400">•</span>
                    <span className="text-white capitalize">{v}</span>
                    {v === 'classicwilly' && <span className="text-amber-400 text-xs ml-2">🌉 BRIDGE</span>}
                    <span className="text-slate-500 text-xs ml-auto">
                      {buildTeam.metadata.roles[v as keyof typeof buildTeam.metadata.roles]}
                    </span>
                  </div>
                ))}
              </div>

              <div className="bg-slate-950/50 rounded p-4">
                <div className="text-slate-400 text-sm mb-2">Metadata</div>
                <div className="text-slate-300 text-sm space-y-1">
                  <div><span className="text-purple-400">Purpose:</span> {buildTeam?.metadata.purpose}</div>
                  <div><span className="text-purple-400">Signature:</span> {buildTeam?.metadata.signature}</div>
                  <div><span className="text-purple-400">Created:</span> {buildTeam?.created.toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Katen Family K₄ */}
          <div className="bg-slate-900/50 border border-purple-500/30 rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">🕊️</span>
              <div>
                <h2 className="text-2xl font-bold text-white">{katenFamily?.name}</h2>
                <div className="text-purple-400 text-sm">{katenFamily?.category}</div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-slate-950/50 rounded p-4">
                <div className="text-slate-400 text-sm mb-2">Vertices</div>
                {katenFamily?.vertices.map(v => (
                  <div key={v} className="flex items-center gap-2 mb-2">
                    <span className="text-purple-400">•</span>
                    <span className="text-white capitalize">{v}</span>
                    {v === 'classicwilly' && <span className="text-amber-400 text-xs ml-2">🌉 BRIDGE</span>}
                  </div>
                ))}
              </div>

              <div className="bg-slate-950/50 rounded p-4">
                <div className="text-slate-400 text-sm mb-2">Metadata</div>
                <div className="text-slate-300 text-sm space-y-1">
                  <div><span className="text-purple-400">Memorial:</span> {katenFamily?.metadata.memorial}</div>
                  <div><span className="text-purple-400">Birth:</span> {katenFamily?.metadata.birth}</div>
                  <div><span className="text-purple-400">Pattern:</span> {katenFamily?.metadata.pattern}</div>
                  <div><span className="text-purple-400">Created:</span> {katenFamily?.created.toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bridge Vertices Analysis */}
        <div className="bg-gradient-to-br from-amber-900/20 to-slate-900/50 border border-amber-500/30 rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-4xl">🌉</span>
            Bridge Vertices
          </h2>

          {bridges.map(bridge => {
            const tets = bridge.tetrahedrons.map(id => topology.nodes.get(id));
            return (
              <div key={bridge.vertexId} className="bg-slate-900/60 rounded-lg p-6 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-2xl font-bold text-amber-400 capitalize">{bridge.name}</div>
                    <div className="text-slate-400 text-sm">Connected to {bridge.tetrahedrons.length} tetrahedrons</div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white">{(bridge.bridgeStrength * 100).toFixed(0)}%</div>
                    <div className="text-slate-400 text-sm">Bridge Strength</div>
                  </div>
                </div>

                <div className="space-y-2">
                  {tets.map(tet => tet && (
                    <div key={tet.id} className="flex items-center gap-3 text-slate-300">
                      <span className="text-purple-400">→</span>
                      <span className="font-semibold">{tet.name}</span>
                      <span className="text-slate-500 text-sm">({tet.category})</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Mesh Edges */}
        <div className="bg-slate-900/50 border border-purple-500/30 rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
            <span className="text-4xl">⚡</span>
            Mesh Edges
          </h2>

          {Array.from(topology.edges.values()).map(edge => {
            const source = topology.nodes.get(edge.source);
            const target = topology.nodes.get(edge.target);
            return (
              <div key={edge.id} className="bg-slate-950/50 rounded p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-white font-semibold">{source?.name}</span>
                    <span className="text-purple-400">↔</span>
                    <span className="text-white font-semibold">{target?.name}</span>
                  </div>
                  <div className="text-emerald-400 text-sm capitalize">{edge.connectionType}</div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-slate-400">Strength</div>
                    <div className="text-white font-semibold">{(edge.strength * 100).toFixed(0)}%</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Trust</div>
                    <div className="text-white font-semibold">{(edge.trustLevel * 100).toFixed(0)}%</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Status</div>
                    <div className={`font-semibold ${edge.isStable ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {edge.isStable ? 'Stable' : 'Forming'}
                    </div>
                  </div>
                </div>

                {edge.sharedVertices && edge.sharedVertices.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-700">
                    <div className="text-slate-400 text-xs mb-1">Shared vertices:</div>
                    <div className="flex gap-2">
                      {edge.sharedVertices.map(v => (
                        <span key={v} className="text-purple-400 text-sm capitalize">{v}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Scale Projection */}
        <div className="bg-gradient-to-br from-purple-900/30 to-slate-900/50 border border-purple-500/30 rounded-lg p-8 text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">Scale Projection</h2>
          
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-slate-900/60 rounded p-6">
              <div className="text-5xl mb-2">2</div>
              <div className="text-slate-300 font-semibold mb-1">Current</div>
              <div className="text-slate-500 text-sm">Build + Family</div>
            </div>
            
            <div className="bg-slate-900/60 rounded p-6">
              <div className="text-5xl mb-2">40</div>
              <div className="text-slate-300 font-semibold mb-1">Extended Network</div>
              <div className="text-slate-500 text-sm">Family + Friends + Work</div>
            </div>
            
            <div className="bg-slate-900/60 rounded p-6">
              <div className="text-5xl mb-2">4,000</div>
              <div className="text-slate-300 font-semibold mb-1">Community Scale</div>
              <div className="text-slate-500 text-sm">City-level mesh</div>
            </div>
            
            <div className="bg-slate-900/60 rounded p-6">
              <div className="text-5xl mb-2">4B</div>
              <div className="text-slate-300 font-semibold mb-1">Global Scale</div>
              <div className="text-slate-500 text-sm">Infrastructure complete</div>
            </div>
          </div>

          <div className="text-lg text-purple-400 italic mb-4">
            The same protocol that connects 2 tetrahedrons connects 4 billion.
          </div>
          
          <div className="text-slate-400 text-sm">
            What changes at scale: Performance optimization, distributed consensus, federated architecture.
            <br />
            What stays the same: K₄ topology, edge formation rules, resilience mathematics.
          </div>
        </div>

        {/* Mesh Exploration Links */}
        <div className="grid md:grid-cols-5 gap-6">
          <Link
            href="/mesh/dawn"
            className="bg-gradient-to-br from-yellow-600/20 to-amber-600/20 border border-yellow-500/30 rounded-lg p-6 hover:border-yellow-400 transition-all group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🌅</div>
            <h3 className="text-xl font-bold text-white mb-2">CITRINITAS</h3>
            <p className="text-slate-300 text-sm">
              YELLOW PHASE: The dawn. The moment you SEE it&apos;s alive.
            </p>
          </Link>

          <Link
            href="/mesh/live"
            className="bg-gradient-to-br from-red-600/20 to-orange-600/20 border border-red-500/30 rounded-lg p-6 hover:border-red-400 transition-all group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🫀</div>
            <h3 className="text-xl font-bold text-white mb-2">LIVE SYSTEM</h3>
            <p className="text-slate-300 text-sm">
              RED PHASE: Real-time jitterbug monitoring. Watch the mesh breathe.
            </p>
          </Link>

          <Link
            href="/mesh/jitterbug"
            className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg p-6 hover:border-purple-400 transition-all group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🌀</div>
            <h3 className="text-xl font-bold text-white mb-2">The Jitterbug</h3>
            <p className="text-slate-300 text-sm">
              Watch the system breathe. Delta ↔ Wye phase transitions.
            </p>
          </Link>

          <Link
            href="/mesh/geometry"
            className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-lg p-6 hover:border-cyan-400 transition-all group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📐</div>
            <h3 className="text-xl font-bold text-white mb-2">Sacred Geometry</h3>
            <p className="text-slate-300 text-sm">
              Explore the mathematics. Fuller&apos;s precise calculations.
            </p>
          </Link>

          <Link
            href="/mesh/visualization"
            className="bg-gradient-to-br from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 rounded-lg p-6 hover:border-emerald-400 transition-all group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🔮</div>
            <h3 className="text-xl font-bold text-white mb-2">Live Visualization</h3>
            <p className="text-slate-300 text-sm">
              See your mesh in 3D. Real-time system state.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
