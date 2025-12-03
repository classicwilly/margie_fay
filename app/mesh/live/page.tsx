'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Activity, AlertTriangle, Check } from 'lucide-react';
import JitterbugVisualization from '@/app/components/JitterbugVisualization';
import { calculateStability, shouldTransition, type StabilityMetrics } from '@/lib/geometry/phenix-geometry';

type SystemState = 'delta' | 'wye' | 'transition';
type JitterbugState = 'stable-delta' | 'stressed-delta' | 'positive-wye' | 'hub-failure' | 'negative-wye' | 'reformation' | 'new-delta';

interface LiveMetrics {
  state: SystemState;
  jitterbugPhase: JitterbugState;
  hubHealth: number;
  systemLoad: number;
  uptime: number;
  lastTransition: Date | null;
  transitionCount: number;
}

export default function LiveSystemPage() {
  const [metrics, setMetrics] = useState<LiveMetrics>({
    state: 'delta',
    jitterbugPhase: 'stable-delta',
    hubHealth: 1.0,
    systemLoad: 0.3,
    uptime: 0,
    lastTransition: null,
    transitionCount: 0
  });
  
  const [stability, setStability] = useState<StabilityMetrics | null>(null);
  const [isLive, setIsLive] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // RED PHASE: System is live, breathing
    if (isLive) {
      intervalRef.current = setInterval(() => {
        setMetrics(prev => {
          // Simulate natural system dynamics
          const newLoad = Math.max(0, Math.min(1, prev.systemLoad + (Math.random() - 0.5) * 0.1));
          const newHubHealth = Math.max(0.2, Math.min(1, prev.hubHealth + (Math.random() - 0.5) * 0.05));
          
          // Only calculate stability when in a stable state (not transitioning)
          const currentState = prev.state === 'transition' ? 'delta' : prev.state;
          
          // Calculate stability
          const newStability = calculateStability(currentState, newHubHealth, newLoad);
          setStability(newStability);
          
          // Check if transition needed
          const transitionCheck = shouldTransition(currentState, newStability);
          
          let newState = prev.state;
          let newJitterbugPhase = prev.jitterbugPhase;
          let transitionCount = prev.transitionCount;
          let lastTransition = prev.lastTransition;
          
          if (transitionCheck.shouldTransition) {
            newState = transitionCheck.targetState;
            transitionCount++;
            lastTransition = new Date();
            
            // Update jitterbug phase based on transition
            if (newState === 'wye') {
              newJitterbugPhase = 'positive-wye';
            } else if (newState === 'delta') {
              newJitterbugPhase = newHubHealth < 0.5 ? 'reformation' : 'new-delta';
            }
          }
          
          return {
            state: newState,
            jitterbugPhase: newJitterbugPhase,
            hubHealth: newHubHealth,
            systemLoad: newLoad,
            uptime: prev.uptime + 1,
            lastTransition,
            transitionCount
          };
        });
      }, 2000); // Update every 2 seconds
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isLive]);

  const getStateColor = (state: SystemState) => {
    switch (state) {
      case 'delta':
        return 'text-green-400';
      case 'wye':
        return 'text-blue-400';
      case 'transition':
        return 'text-amber-400';
    }
  };

  const getStateDescription = (state: SystemState) => {
    switch (state) {
      case 'delta':
        return 'Mesh - All nodes peer-to-peer, distributed resilience';
      case 'wye':
        return 'Hub - Centralized coordination, efficient but fragile';
      case 'transition':
        return 'Transitioning between configurations';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/mesh"
          className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Mesh</span>
        </Link>

        {/* Header - RED PHASE */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Activity className="w-12 h-12 text-red-400 animate-pulse" />
            <h1 className="text-5xl font-bold text-white">LIVE SYSTEM</h1>
          </div>
          <p className="text-xl text-slate-300 mb-2">
            Real-time Jitterbug monitoring
          </p>
          <p className="text-lg text-red-400 italic">
            RED PHASE: The mesh breathes
          </p>
        </div>

        {/* Live Status Banner */}
        <div className={`mb-8 p-6 rounded-lg border-2 ${
          isLive 
            ? 'bg-green-900/20 border-green-500/50' 
            : 'bg-slate-800/50 border-slate-600/50'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-4 h-4 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-slate-500'}`} />
              <div>
                <div className="text-lg font-semibold text-white">
                  {isLive ? 'SYSTEM LIVE' : 'SYSTEM PAUSED'}
                </div>
                <div className="text-sm text-slate-400">
                  Uptime: {Math.floor(metrics.uptime / 30)} min {metrics.uptime % 30} sec
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsLive(!isLive)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                isLive
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isLive ? 'Pause' : 'Resume'}
            </button>
          </div>
        </div>

        {/* Current State */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-900/50 border border-purple-500/30 rounded-lg p-6">
            <h2 className="text-xl font-bold text-purple-400 mb-4">Current Configuration</h2>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-slate-400">State</div>
                <div className={`text-3xl font-bold ${getStateColor(metrics.state)}`}>
                  {metrics.state.toUpperCase()}
                </div>
                <div className="text-sm text-slate-300 mt-1">
                  {getStateDescription(metrics.state)}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-slate-400">Jitterbug Phase</div>
                <div className="text-lg font-semibold text-cyan-400">
                  {metrics.jitterbugPhase}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-purple-500/30 rounded-lg p-6">
            <h2 className="text-xl font-bold text-purple-400 mb-4">Transition History</h2>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-slate-400">Total Transitions</div>
                <div className="text-3xl font-bold text-amber-400">
                  {metrics.transitionCount}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-slate-400">Last Transition</div>
                <div className="text-lg font-semibold text-slate-300">
                  {metrics.lastTransition 
                    ? metrics.lastTransition.toLocaleTimeString()
                    : 'No transitions yet'
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Jitterbug Visualization */}
        <div className="mb-8 bg-slate-900/50 border border-purple-500/30 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-purple-400 mb-6 text-center">
            Watch the System Breathe
          </h2>
          <JitterbugVisualization 
            autoPlay={isLive}
            speed={1.5}
            size={500}
          />
        </div>

        {/* Live Metrics */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-900/50 border border-purple-500/30 rounded-lg p-6">
            <h3 className="text-lg font-bold text-purple-400 mb-4">Hub Health</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-300">Current</span>
                <span className="text-2xl font-bold text-cyan-400">
                  {(metrics.hubHealth * 100).toFixed(0)}%
                </span>
              </div>
              <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    metrics.hubHealth > 0.7 ? 'bg-green-500' :
                    metrics.hubHealth > 0.4 ? 'bg-amber-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${metrics.hubHealth * 100}%` }}
                />
              </div>
              {metrics.hubHealth < 0.5 && (
                <div className="flex items-center gap-2 text-sm text-amber-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Hub health declining - transition may trigger</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-purple-500/30 rounded-lg p-6">
            <h3 className="text-lg font-bold text-purple-400 mb-4">System Load</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-300">Current</span>
                <span className="text-2xl font-bold text-cyan-400">
                  {(metrics.systemLoad * 100).toFixed(0)}%
                </span>
              </div>
              <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    metrics.systemLoad < 0.5 ? 'bg-green-500' :
                    metrics.systemLoad < 0.8 ? 'bg-amber-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${metrics.systemLoad * 100}%` }}
                />
              </div>
              {metrics.systemLoad > 0.7 && (
                <div className="flex items-center gap-2 text-sm text-amber-400">
                  <AlertTriangle className="w-4 h-4" />
                  <span>High load - may centralize to Wye for efficiency</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stability Analysis */}
        {stability && (
          <div className="bg-slate-900/50 border border-purple-500/30 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-purple-400 mb-6">Stability Analysis</h2>
            
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div>
                <div className="text-sm text-slate-400 mb-2">Resilience</div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-1">
                  <div 
                    className="h-full bg-green-500 transition-all duration-500"
                    style={{ width: `${stability.resilience * 100}%` }}
                  />
                </div>
                <div className="text-xs text-right text-slate-300">
                  {(stability.resilience * 100).toFixed(0)}%
                </div>
              </div>

              <div>
                <div className="text-sm text-slate-400 mb-2">Efficiency</div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-1">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${stability.efficiency * 100}%` }}
                  />
                </div>
                <div className="text-xs text-right text-slate-300">
                  {(stability.efficiency * 100).toFixed(0)}%
                </div>
              </div>

              <div>
                <div className="text-sm text-slate-400 mb-2">Load</div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-1">
                  <div 
                    className="h-full bg-yellow-500 transition-all duration-500"
                    style={{ width: `${stability.load * 100}%` }}
                  />
                </div>
                <div className="text-xs text-right text-slate-300">
                  {(stability.load * 100).toFixed(0)}%
                </div>
              </div>

              <div>
                <div className="text-sm text-slate-400 mb-2">Risk</div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-1">
                  <div 
                    className="h-full bg-red-500 transition-all duration-500"
                    style={{ width: `${stability.risk * 100}%` }}
                  />
                </div>
                <div className="text-xs text-right text-slate-300">
                  {(stability.risk * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            {/* Transition Recommendation */}
            {(() => {
              const currentState = metrics.state === 'transition' ? 'delta' : metrics.state;
              const check = shouldTransition(currentState, stability);
              return (
                <div className={`p-4 rounded-lg border ${
                  check.shouldTransition
                    ? 'bg-amber-900/20 border-amber-500/30'
                    : 'bg-green-900/20 border-green-500/30'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">
                      {check.shouldTransition ? '⚠️' : <Check className="w-6 h-6 text-green-400" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-white mb-1">
                        {check.shouldTransition ? 'Transition Recommended' : 'Current State Optimal'}
                      </div>
                      <div className="text-sm text-slate-300 mb-2">{check.reason}</div>
                      {check.shouldTransition && (
                        <div className="text-sm font-mono text-cyan-400">
                          System will transition: {metrics.state.toUpperCase()} → {check.targetState.toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Legend */}
        <div className="mt-8 bg-slate-900/30 border border-slate-700/50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-slate-300 mb-4">Understanding Live System</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-semibold text-green-400 mb-2">Delta (Mesh)</div>
              <p className="text-slate-400">
                All nodes connected peer-to-peer. High resilience, higher energy cost. Can lose any node.
              </p>
            </div>
            <div>
              <div className="font-semibold text-blue-400 mb-2">Wye (Hub)</div>
              <p className="text-slate-400">
                Centralized coordination through hub. Low energy, high efficiency. Fragile - hub failure = collapse.
              </p>
            </div>
            <div>
              <div className="font-semibold text-amber-400 mb-2">Jitterbug</div>
              <p className="text-slate-400">
                Natural breathing between states. System auto-regulates based on load and hub health.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
