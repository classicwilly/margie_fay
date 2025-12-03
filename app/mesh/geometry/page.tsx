'use client';

import { useState, useEffect } from 'react';
import {
  calculateTetrahedronEdgeLength,
  calculateTetrahedronSurfaceArea,
  calculateTetrahedronVolume,
  calculateTetrahedronHeight,
  calculateCircumradius,
  calculateInradius,
  getDihedralAngle,
  calculateDeltaMetrics,
  calculateWyeMetrics,
  calculateDeltaToWyeEnergy,
  calculateWyeToDeltaEnergy,
  calculateStability,
  shouldTransition,
  calculateJitterbugFrequency,
  calculateRotationPeriod,
  calculateFractalMetrics,
  type DeltaMetrics,
  type WyeMetrics,
  type StabilityMetrics
} from '@/lib/geometry/phenix-geometry';
import { TETRAHEDRAL_ANGLE, SQRT2, SQRT3, PHI } from '@/lib/geometry/sacred-geometry';

export default function GeometryMathPage() {
  const [edgeLength, setEdgeLength] = useState(2.0);
  const [hubHealth, setHubHealth] = useState(1.0);
  const [systemLoad, setSystemLoad] = useState(0.5);
  const [currentConfig, setCurrentConfig] = useState<'delta' | 'wye'>('delta');
  
  const [deltaMetrics, setDeltaMetrics] = useState<DeltaMetrics | null>(null);
  const [wyeMetrics, setWyeMetrics] = useState<WyeMetrics | null>(null);
  const [stability, setStability] = useState<StabilityMetrics | null>(null);

  useEffect(() => {
    // Recalculate all metrics when parameters change
    setDeltaMetrics(calculateDeltaMetrics(edgeLength));
    setWyeMetrics(calculateWyeMetrics(edgeLength));
    setStability(calculateStability(currentConfig, hubHealth, systemLoad));
  }, [edgeLength, hubHealth, systemLoad, currentConfig]);

  const transitionAnalysis = stability ? shouldTransition(currentConfig, stability) : null;
  const jitterbugFreq = calculateJitterbugFrequency(systemLoad, 4);
  const rotation = calculateRotationPeriod(4);

  const toDegrees = (rad: number) => (rad * 180 / Math.PI).toFixed(2);
  const toHours = (seconds: number) => (seconds / 3600).toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Sacred Geometry Mathematics
          </h1>
          <p className="text-xl text-slate-300">
            Precise calculations for Fuller&apos;s Jitterbug & Wye-Delta Transitions
          </p>
        </div>

        {/* Universal Constants */}
        <div className="mb-8 p-6 bg-slate-800/50 rounded-lg border border-purple-500/30">
          <h2 className="text-2xl font-bold mb-4 text-cyan-400">Universal Constants</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-slate-700/30 rounded">
              <div className="text-sm text-slate-400">Golden Ratio (φ)</div>
              <div className="text-2xl font-mono text-yellow-400">{PHI.toFixed(6)}</div>
            </div>
            <div className="p-4 bg-slate-700/30 rounded">
              <div className="text-sm text-slate-400">√2</div>
              <div className="text-2xl font-mono text-yellow-400">{SQRT2.toFixed(6)}</div>
            </div>
            <div className="p-4 bg-slate-700/30 rounded">
              <div className="text-sm text-slate-400">√3</div>
              <div className="text-2xl font-mono text-yellow-400">{SQRT3.toFixed(6)}</div>
            </div>
            <div className="p-4 bg-slate-700/30 rounded">
              <div className="text-sm text-slate-400">Tetrahedral Angle</div>
              <div className="text-2xl font-mono text-yellow-400">{toDegrees(TETRAHEDRAL_ANGLE)}°</div>
            </div>
          </div>
        </div>

        {/* Interactive Controls */}
        <div className="mb-8 p-6 bg-slate-800/50 rounded-lg border border-purple-500/30">
          <h2 className="text-2xl font-bold mb-4 text-cyan-400">System Parameters</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Edge Length */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Edge Length: <span className="text-cyan-400">{edgeLength.toFixed(2)}</span>
              </label>
              <input
                type="range"
                min="0.5"
                max="5"
                step="0.1"
                value={edgeLength}
                onChange={(e) => setEdgeLength(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Hub Health */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Hub Health: <span className="text-cyan-400">{(hubHealth * 100).toFixed(0)}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={hubHealth}
                onChange={(e) => setHubHealth(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            {/* System Load */}
            <div>
              <label className="block text-sm font-medium mb-2">
                System Load: <span className="text-cyan-400">{(systemLoad * 100).toFixed(0)}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={systemLoad}
                onChange={(e) => setSystemLoad(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {/* Configuration Toggle */}
          <div className="mt-6">
            <label className="block text-sm font-medium mb-2">Current Configuration</label>
            <div className="flex gap-4">
              <button
                onClick={() => setCurrentConfig('delta')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  currentConfig === 'delta'
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/50'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                Delta (Mesh)
              </button>
              <button
                onClick={() => setCurrentConfig('wye')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  currentConfig === 'wye'
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                Wye (Hub)
              </button>
            </div>
          </div>
        </div>

        {/* Tetrahedron Geometry */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="p-6 bg-slate-800/50 rounded-lg border border-purple-500/30">
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">Tetrahedron Geometry</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-300">Edge Length:</span>
                <span className="font-mono text-cyan-400">{calculateTetrahedronEdgeLength().toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Surface Area:</span>
                <span className="font-mono text-cyan-400">{calculateTetrahedronSurfaceArea(edgeLength).toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Volume:</span>
                <span className="font-mono text-cyan-400">{calculateTetrahedronVolume(edgeLength).toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Height:</span>
                <span className="font-mono text-cyan-400">{calculateTetrahedronHeight(edgeLength).toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Circumradius:</span>
                <span className="font-mono text-cyan-400">{calculateCircumradius(edgeLength).toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Inradius:</span>
                <span className="font-mono text-cyan-400">{calculateInradius(edgeLength).toFixed(4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Dihedral Angle:</span>
                <span className="font-mono text-cyan-400">{toDegrees(getDihedralAngle())}°</span>
              </div>
            </div>
          </div>

          {/* Phase Transition Energy */}
          <div className="p-6 bg-slate-800/50 rounded-lg border border-purple-500/30">
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">Phase Transition Energy</h2>
            <div className="space-y-4">
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded">
                <div className="text-sm text-green-400 mb-1">Delta → Wye (Exothermic)</div>
                <div className="text-2xl font-mono text-green-300">
                  -{calculateDeltaToWyeEnergy(edgeLength).toFixed(4)} energy released
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  System centralizes, releases energy, becomes efficient
                </div>
              </div>
              
              <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded">
                <div className="text-sm text-purple-400 mb-1">Wye → Delta (Endothermic)</div>
                <div className="text-2xl font-mono text-purple-300">
                  +{calculateWyeToDeltaEnergy(edgeLength).toFixed(4)} energy required
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  System decentralizes, requires VPI energy input
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Configuration Metrics */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Delta Metrics */}
          {deltaMetrics && (
            <div className="p-6 bg-slate-800/50 rounded-lg border border-green-500/30">
              <h2 className="text-2xl font-bold mb-4 text-green-400">Delta (Mesh) Metrics</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-300">Edge Count:</span>
                  <span className="font-mono text-green-400">{deltaMetrics.edgeCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Total Edge Length:</span>
                  <span className="font-mono text-green-400">{deltaMetrics.totalEdgeLength.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Connectivity:</span>
                  <span className="font-mono text-green-400">{deltaMetrics.connectivity.toFixed(2)} edges/vertex</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Redundancy:</span>
                  <span className="font-mono text-green-400">{deltaMetrics.redundancy} alternate paths</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Energy Cost:</span>
                  <span className="font-mono text-green-400">{deltaMetrics.energy.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Resilience:</span>
                  <span className="font-mono text-green-400">{(deltaMetrics.resilience * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          )}

          {/* Wye Metrics */}
          {wyeMetrics && (
            <div className="p-6 bg-slate-800/50 rounded-lg border border-blue-500/30">
              <h2 className="text-2xl font-bold mb-4 text-blue-400">Wye (Hub) Metrics</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-300">Edge Count:</span>
                  <span className="font-mono text-blue-400">{wyeMetrics.edgeCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Total Edge Length:</span>
                  <span className="font-mono text-blue-400">{wyeMetrics.totalEdgeLength.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Connectivity:</span>
                  <span className="font-mono text-blue-400">{wyeMetrics.connectivity.toFixed(2)} edges/vertex</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Redundancy:</span>
                  <span className="font-mono text-blue-400">{wyeMetrics.redundancy} path(s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Energy Cost:</span>
                  <span className="font-mono text-blue-400">{wyeMetrics.energy.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Resilience:</span>
                  <span className="font-mono text-blue-400">{(wyeMetrics.resilience * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Hub Load:</span>
                  <span className="font-mono text-blue-400">{(wyeMetrics.hubLoad * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* System Stability Analysis */}
        {stability && (
          <div className="mb-8 p-6 bg-slate-800/50 rounded-lg border border-purple-500/30">
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">Current System Stability</h2>
            
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-slate-700/30 rounded">
                <div className="text-sm text-slate-400 mb-2">Resilience</div>
                <div className="h-2 bg-slate-600 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 transition-all"
                    style={{ width: `${stability.resilience * 100}%` }}
                  />
                </div>
                <div className="text-right text-xs text-slate-300 mt-1">
                  {(stability.resilience * 100).toFixed(0)}%
                </div>
              </div>

              <div className="p-4 bg-slate-700/30 rounded">
                <div className="text-sm text-slate-400 mb-2">Efficiency</div>
                <div className="h-2 bg-slate-600 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all"
                    style={{ width: `${stability.efficiency * 100}%` }}
                  />
                </div>
                <div className="text-right text-xs text-slate-300 mt-1">
                  {(stability.efficiency * 100).toFixed(0)}%
                </div>
              </div>

              <div className="p-4 bg-slate-700/30 rounded">
                <div className="text-sm text-slate-400 mb-2">Load</div>
                <div className="h-2 bg-slate-600 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-500 transition-all"
                    style={{ width: `${stability.load * 100}%` }}
                  />
                </div>
                <div className="text-right text-xs text-slate-300 mt-1">
                  {(stability.load * 100).toFixed(0)}%
                </div>
              </div>

              <div className="p-4 bg-slate-700/30 rounded">
                <div className="text-sm text-slate-400 mb-2">Risk</div>
                <div className="h-2 bg-slate-600 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 transition-all"
                    style={{ width: `${stability.risk * 100}%` }}
                  />
                </div>
                <div className="text-right text-xs text-slate-300 mt-1">
                  {(stability.risk * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            {/* Transition Recommendation */}
            {transitionAnalysis && (
              <div className={`p-4 rounded-lg border ${
                transitionAnalysis.shouldTransition
                  ? 'bg-yellow-500/10 border-yellow-500/30'
                  : 'bg-green-500/10 border-green-500/30'
              }`}>
                <div className="flex items-start gap-3">
                  <div className="text-2xl">
                    {transitionAnalysis.shouldTransition ? '⚠️' : '✅'}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold mb-1">
                      {transitionAnalysis.shouldTransition ? 'Transition Recommended' : 'Current State Optimal'}
                    </div>
                    <div className="text-sm text-slate-300">{transitionAnalysis.reason}</div>
                    {transitionAnalysis.shouldTransition && (
                      <div className="mt-2 text-sm font-mono text-cyan-400">
                        Recommend: {currentConfig.toUpperCase()} → {transitionAnalysis.targetState.toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Jitterbug Oscillation */}
        <div className="mb-8 p-6 bg-slate-800/50 rounded-lg border border-purple-500/30">
          <h2 className="text-2xl font-bold mb-4 text-cyan-400">Jitterbug Oscillation Analysis</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-purple-400">Natural Frequency</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-300">Period:</span>
                  <span className="font-mono text-cyan-400">{toHours(jitterbugFreq.period)} hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Frequency:</span>
                  <span className="font-mono text-cyan-400">{(jitterbugFreq.frequency * 3600).toFixed(6)} cycles/hour</span>
                </div>
                <div className="mt-3 p-3 bg-slate-700/30 rounded text-sm text-slate-300">
                  {jitterbugFreq.description}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-purple-400">Hub Rotation</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-300">Max Hub Duration:</span>
                  <span className="font-mono text-cyan-400">{toHours(rotation.maxHubDuration)} hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-300">Full Rotation Cycle:</span>
                  <span className="font-mono text-cyan-400">{toHours(rotation.rotationCycle)} hours</span>
                </div>
                <div className="mt-3 p-3 bg-slate-700/30 rounded text-sm text-slate-300">
                  Each vertex should be hub for no more than {toHours(rotation.maxHubDuration)} hours to prevent stuck Wye configuration.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fractal Scaling */}
        <div className="p-6 bg-slate-800/50 rounded-lg border border-purple-500/30">
          <h2 className="text-2xl font-bold mb-4 text-cyan-400">Fractal Scaling</h2>
          
          <div className="grid md:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map(depth => {
              const metrics = calculateFractalMetrics(depth);
              return (
                <div key={depth} className="p-4 bg-slate-700/30 rounded">
                  <div className="text-lg font-semibold mb-2 text-purple-400">Depth {depth}</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tetrahedra:</span>
                      <span className="font-mono text-cyan-400">{metrics.tetrahedronCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Vertices:</span>
                      <span className="font-mono text-cyan-400">{metrics.totalVertices}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Edges:</span>
                      <span className="font-mono text-cyan-400">{metrics.totalEdges}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Scale:</span>
                      <span className="font-mono text-cyan-400">{metrics.scaleFactor.toFixed(3)}×</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
