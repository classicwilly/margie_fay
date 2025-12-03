'use client';

import { useState } from 'react';
import { Users, Circle, Zap, Eye, Play } from 'lucide-react';
import Link from 'next/link';
import JitterbugVisualization from '../../components/JitterbugVisualization';

export default function JitterbugPage() {
  const [showFullAnimation, setShowFullAnimation] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/mesh" className="text-slate-400 hover:text-white">
              <Eye className="w-6 h-6" />
            </Link>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              The Jitterbug
            </h1>
          </div>
          <p className="text-xl text-slate-300 mb-2">
            Fuller's transformation: <strong className="text-white">Delta ↔ Wye ↔ Delta</strong>
          </p>
          <p className="text-slate-400">
            The geometry of resilience in motion. Watch your system breathe.
          </p>
        </div>

        {/* Main Visualization */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Phase Transition Animation</h2>
            <button
              onClick={() => setShowFullAnimation(!showFullAnimation)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              <Play className="w-4 h-4" />
              {showFullAnimation ? 'Hide Animation' : 'Show Animation'}
            </button>
          </div>
          
          {showFullAnimation && (
            <JitterbugVisualization 
              autoPlay={true}
              speed={1.2}
              showLabels={true}
              size={500}
            />
          )}
        </div>

        {/* The Seven States */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">The Seven States</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* State 1: Stable Delta */}
            <div className="bg-slate-800 border-2 border-green-500 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <h3 className="font-bold text-white">1. Stable Delta</h3>
              </div>
              <p className="text-sm text-slate-300 mb-2">Distributed mesh, all nodes equal</p>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• High energy, high resilience</li>
                <li>• No single point of failure</li>
                <li>• Peer-to-peer connections</li>
                <li>• Weekend/creative mode</li>
              </ul>
            </div>

            {/* State 2: Stressed Delta */}
            <div className="bg-slate-800 border-2 border-yellow-500 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <h3 className="font-bold text-white">2. Stressed Delta</h3>
              </div>
              <p className="text-sm text-slate-300 mb-2">Load concentrating on one node</p>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• Stress point emerging</li>
                <li>• Beginning to centralize</li>
                <li>• Natural transition</li>
                <li>• Not a failure (yet)</li>
              </ul>
            </div>

            {/* State 3: Positive Wye */}
            <div className="bg-slate-800 border-2 border-blue-500 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <h3 className="font-bold text-white">3. Positive Wye</h3>
              </div>
              <p className="text-sm text-slate-300 mb-2">Hub formed, efficient coordinator</p>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• Low energy, high efficiency</li>
                <li>• Fragile but functional</li>
                <li>• Healthy when TEMPORARY</li>
                <li>• Toxic when PERMANENT</li>
              </ul>
            </div>

            {/* State 4: Hub Failure */}
            <div className="bg-slate-800 border-2 border-red-500 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <h3 className="font-bold text-white">4. Hub Failure</h3>
              </div>
              <p className="text-sm text-slate-300 mb-2">Center failing, dying, or leaving</p>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• Hub cannot sustain load</li>
                <li>• Peripheral nodes isolating</li>
                <li>• Cascade collapse begins</li>
                <li>• Crisis state</li>
              </ul>
            </div>

            {/* State 5: Negative Wye */}
            <div className="bg-slate-800 border-2 border-rose-600 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-rose-600"></div>
                <h3 className="font-bold text-white">5. Negative Wye</h3>
              </div>
              <p className="text-sm text-slate-300 mb-2">Vacuum after hub loss</p>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• Center is gone</li>
                <li>• Nodes still oriented to void</li>
                <li>• Grief, chaos, shock</li>
                <li>• Maximum fragility</li>
              </ul>
            </div>

            {/* State 6: Reformation */}
            <div className="bg-slate-800 border-2 border-orange-500 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <h3 className="font-bold text-white">6. Reformation</h3>
              </div>
              <p className="text-sm text-slate-300 mb-2">VPI active, new edges forming</p>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• Peer-to-peer connections</li>
                <li>• Energy input required</li>
                <li>• Mesh self-healing</li>
                <li>• Delta reconstruction</li>
              </ul>
            </div>

            {/* State 7: New Delta */}
            <div className="bg-slate-800 border-2 border-emerald-500 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <h3 className="font-bold text-white">7. New Delta</h3>
              </div>
              <p className="text-sm text-slate-300 mb-2">Mesh restored, system healed</p>
              <ul className="text-xs text-slate-400 space-y-1">
                <li>• Resilient structure</li>
                <li>• Memorial or new 4th</li>
                <li>• Can breathe again</li>
                <li>• Regeneration complete</li>
              </ul>
            </div>

          </div>
        </div>

        {/* The Star Shifts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          
          {/* Healthy: Rotating */}
          <div className="bg-gradient-to-br from-green-900/30 to-blue-900/30 border border-green-700/50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-400" />
              Healthy: The Star Shifts
            </h3>
            <p className="text-slate-300 mb-4 text-sm">
              The center <strong className="text-green-400">rotates</strong> through vertices. No one is always the hub.
            </p>
            <div className="bg-slate-900/50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <span className="text-slate-300">Monday: Mom coordinates school</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                <span className="text-slate-300">Tuesday: Dad coordinates dinner</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span className="text-slate-300">Wednesday: Kid coordinates chores</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                <span className="text-slate-300">Weekend: Back to mesh (everyone equal)</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-3">
              <strong>Examples:</strong> Military fireteams, Agile teams, Jazz bands, Healthy families
            </p>
          </div>

          {/* Unhealthy: Stuck */}
          <div className="bg-gradient-to-br from-red-900/30 to-orange-900/30 border border-red-700/50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <Circle className="w-5 h-5 text-red-400" />
              Unhealthy: The Star is Stuck
            </h3>
            <p className="text-slate-300 mb-4 text-sm">
              The center is <strong className="text-red-400">fixed</strong>. One person always the hub.
            </p>
            <div className="bg-slate-900/50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <span className="text-slate-300">Person A coordinates EVERYTHING</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                <span className="text-slate-400">B, C, D depend on A</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                <span className="text-slate-400">No peer connections</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-red-300">A burns out → CASCADE COLLAPSE</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-3">
              <strong>Examples:</strong> Dictators, Toxic bosses, Enmeshed parents, Single points of failure
            </p>
          </div>

        </div>

        {/* VPI is the Jitterbug */}
        <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-700/50 rounded-xl p-6 mb-8">
          <h3 className="text-2xl font-bold text-white mb-4">VPI = Jitterbug Recovery Protocol</h3>
          <div className="grid md:grid-cols-4 gap-4">
            
            <div className="bg-slate-900/50 rounded-lg p-4">
              <div className="text-rose-400 font-bold mb-2">1. Pull Vacuum</div>
              <p className="text-sm text-slate-300">
                Hub removed. Negative Wye state. System in chaos. Maximum fragility.
              </p>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4">
              <div className="text-orange-400 font-bold mb-2">2. Flood with Resin</div>
              <p className="text-sm text-slate-300">
                New connections form. Peer-to-peer edges. Resin fills gaps. Delta begins.
              </p>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4">
              <div className="text-amber-400 font-bold mb-2">3. Pressurize</div>
              <p className="text-sm text-slate-300">
                Force connections deep. Energy input. Overcome resistance. Solidify structure.
              </p>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4">
              <div className="text-green-400 font-bold mb-2">4. Cure</div>
              <p className="text-sm text-slate-300">
                Mesh hardens. System stabilizes. Resilience achieved. Can breathe again.
              </p>
            </div>

          </div>
        </div>

        {/* How G.O.D. Manages the Motion */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-8">
          <h3 className="text-2xl font-bold text-white mb-4">How G.O.D. Manages the Jitterbug</h3>
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Detection */}
            <div>
              <h4 className="font-bold text-blue-400 mb-2">Detection</h4>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>• <strong>Guardian Node</strong> watches for stuck hubs</li>
                <li>• Alerts when star not rotating</li>
                <li>• Detects Negative Wye (crisis)</li>
                <li>• Monitors mesh health</li>
              </ul>
            </div>

            {/* Intervention */}
            <div>
              <h4 className="font-bold text-purple-400 mb-2">Intervention</h4>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>• Forces leadership rotation</li>
                <li>• Activates VPI when hub fails</li>
                <li>• Suggests new connections</li>
                <li>• Memorial Fund for crisis</li>
              </ul>
            </div>

            {/* Visualization */}
            <div>
              <h4 className="font-bold text-green-400 mb-2">Visualization</h4>
              <ul className="text-sm text-slate-300 space-y-2">
                <li>• Watch your system breathe</li>
                <li>• See when hub is stuck</li>
                <li>• Track recovery progress</li>
                <li>• History of all transitions</li>
              </ul>
            </div>

          </div>
        </div>

        {/* The Profound Insight */}
        <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-2 border-indigo-500/50 rounded-xl p-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">The Profound Insight</h3>
          <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4">
            Resilience is Motion, Not Structure
          </p>
          <p className="text-slate-300 text-lg mb-6 max-w-3xl mx-auto">
            The system doesn&apos;t need to be <em>always mesh</em> or <em>always hub</em>. 
            It needs to be able to <strong className="text-white">move between them</strong>.
          </p>
          <div className="flex items-center justify-center gap-8 text-4xl font-bold">
            <span className="text-green-400">Delta</span>
            <span className="text-slate-500">↔</span>
            <span className="text-blue-400">Wye</span>
            <span className="text-slate-500">↔</span>
            <span className="text-emerald-400">Delta</span>
          </div>
          <p className="text-slate-400 mt-6 text-sm">
            The star shifts. The center moves. The hub rotates. The system breathes.
          </p>
        </div>

        {/* Next Steps */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link 
            href="/mesh/visualization"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-semibold"
          >
            <Users className="w-5 h-5" />
            View Your Mesh
          </Link>
          <Link 
            href="/mesh"
            className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-semibold"
          >
            <Eye className="w-5 h-5" />
            Back to Mesh Hub
          </Link>
        </div>

      </div>
    </div>
  );
}
